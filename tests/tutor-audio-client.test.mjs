import {test} from 'node:test';
import assert from 'node:assert/strict';
import {audioContext, recordQuestion} from '../lib/tutor-audio-client.ts';

// Synthetic browser/media fixtures only. No microphone, account or provider calls.
function browser(options = {}) {
 const names = ['window', 'navigator', 'MediaRecorder', 'setInterval', 'clearInterval'];
 const original = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
 const originalNow = Date.now;
 const intervals = new Map(), contexts = [], recorders = [], done = [], errors = [], events = [];
 let now = 0, nextTimer = 0, level = options.level ?? 0;
 class Track extends EventTarget { stops = 0; stop() { this.stops++; } }
 const track = new Track(), stream = {getTracks: () => [track]};
 class Context {
  state = options.suspended ? 'suspended' : 'running';
  closes = 0; resumes = 0; sourceDisconnects = 0; analyserDisconnects = 0;
  constructor() { if (options.contextThrows) throw new Error('Context unavailable'); contexts.push(this); events.push('context'); }
  resume() { this.resumes++; events.push('resume'); return options.resumeRejects ? Promise.reject(new Error('Resume blocked')) : Promise.resolve(); }
  close() { this.closes++; this.state = 'closed'; return Promise.resolve(); }
  createAnalyser() {
   if (options.analyserThrows) throw new Error('Analyser unavailable');
   return {fftSize: 0, getFloatTimeDomainData: values => values.fill(level), disconnect: () => this.analyserDisconnects++};
  }
  createMediaStreamSource() { return {connect() {}, disconnect: () => this.sourceDisconnects++}; }
 }
 class Recorder {
  state = 'inactive'; stops = 0;
  constructor(_stream, settings) {
   if (options.recorderThrows) throw new Error('Recorder unavailable');
   this.mimeType = settings.mimeType; recorders.push(this);
  }
  static isTypeSupported(mime) { return !options.unsupported && (options.mp4Only ? mime === 'audio/mp4' : mime.startsWith('audio/webm')); }
  start() { if (options.startThrows) throw new Error('Start failed'); this.state = 'recording'; }
  stop() {
   this.stops++; this.state = 'inactive';
   if (options.stopThrows) throw new Error('Stop failed');
   queueMicrotask(() => {
    this.ondataavailable?.({data: new Blob([new Uint8Array(options.bytes ?? 256)])});
    void this.onstop?.();
   });
  }
 }
 const install = (name, value) => Object.defineProperty(globalThis, name, {configurable: true, writable: true, value});
 install('window', options.noContext ? {} : {AudioContext: Context});
 install('navigator', {mediaDevices: {getUserMedia: () => {
  events.push('permission');
  if (options.permissionRejects) return Promise.reject(new DOMException('Denied', 'NotAllowedError'));
  return options.permissionPromise ?? Promise.resolve(stream);
 }}});
 install('MediaRecorder', Recorder);
 install('setInterval', fn => { const id = ++nextTimer; intervals.set(id, fn); return id; });
 install('clearInterval', id => intervals.delete(id));
 Date.now = () => now;
 return {
  contexts, recorders, done, errors, events, track, stream, intervals,
  createContext: () => new Context(),
  start: opts => recordQuestion((...args) => done.push(args), error => errors.push(error), opts),
  tick: (at, rms = level) => { now = at; level = rms; for (const fn of [...intervals.values()]) fn(); },
  flush: () => new Promise(resolve => setImmediate(resolve)),
  restore: () => { for (const [name, value] of original) { if (value) Object.defineProperty(globalThis, name, value); else delete globalThis[name]; } Date.now = originalNow; },
 };
}

async function fixture(options, fn) {
 const env = browser(options);
 try { await fn(env); } finally { env.restore(); }
}

test('microphone capture, VAD and lifecycle with synthetic browser fixtures', async t => {
 await t.test('reuses a gesture-unlocked context without closing it', () => fixture({}, async env => {
  const shared = env.createContext(), recording = await env.start({context: shared});
  assert.equal(env.contexts.length, 1);
  recording.finish(); recording.finish(); await env.flush();
  assert.equal(env.done.length, 1); assert.equal(env.done[0][1], 'audio/webm');
  assert.equal(Buffer.from(env.done[0][0], 'base64').length, 256);
  assert.equal(env.track.stops, 1); assert.equal(shared.closes, 0);
  assert.equal(shared.sourceDisconnects, 1); assert.equal(shared.analyserDisconnects, 1);
  assert.equal(env.intervals.size, 0);
 }));
 await t.test('creates and resumes an owned context before awaiting microphone permission', () => fixture({}, async env => {
  const recording = await env.start();
  assert.deepEqual(env.events.slice(0, 3), ['context', 'resume', 'permission']);
  recording.finish(); await env.flush();
  assert.equal(env.contexts[0].closes, 1);
 }));
 for (const options of [{suspended: true}, {suspended: true, resumeRejects: true}, {noContext: true}, {analyserThrows: true}, {contextThrows: true}]) {
  await t.test(`unavailable VAD falls back to bounded recording: ${JSON.stringify(options)}`, () => fixture(options, async env => {
   await env.start(); env.tick(25100); await env.flush();
   assert.equal(env.errors.length, 0); assert.equal(env.recorders[0].state, 'recording');
   env.tick(45000); await env.flush();
   assert.equal(env.done.length, 1); assert.equal(env.track.stops, 1); assert.equal(env.intervals.size, 0);
  }));
 }
 await t.test('quiet speech and a thinking pause are not discarded or cut at 1.5 seconds', () => fixture({}, async env => {
  await env.start(); env.tick(100, .01); env.tick(1700, 0);
  assert.equal(env.recorders[0].state, 'recording');
  env.tick(2200, 0); await env.flush();
  assert.equal(env.done.length, 1); assert.equal(env.errors.length, 0);
 }));
 await t.test('silence with a working analyser fails once and releases the microphone', () => fixture({}, async env => {
  await env.start(); env.tick(25000); env.tick(45000); await env.flush();
  assert.equal(env.done.length, 0); assert.equal(env.errors.length, 1);
  assert.match(env.errors[0], /Não ouvi/); assert.equal(env.track.stops, 1);
 }));
 for (const options of [{unsupported: true}, {recorderThrows: true}, {startThrows: true}]) {
  await t.test(`startup failure releases resources: ${JSON.stringify(options)}`, () => fixture(options, async env => {
   await assert.rejects(env.start()); await env.flush();
   assert.equal(env.track.stops, 1); assert.equal(env.contexts[0].closes, 1);
   assert.equal(env.intervals.size, 0); assert.equal(env.done.length, 0); assert.equal(env.errors.length, 0);
  }));
 }
 await t.test('denied microphone permission closes only the owned context', () => fixture({permissionRejects: true}, async env => {
  await assert.rejects(env.start(), {name: 'NotAllowedError'});
  assert.equal(env.contexts[0].closes, 1); assert.equal(env.recorders.length, 0);
 }));
 await t.test('cancel while permission is pending stops the late stream without recording', async () => {
  let allow;
  const permissionPromise = new Promise(resolve => { allow = resolve; });
  await fixture({permissionPromise}, async env => {
   const controller = new AbortController(), pending = env.start({signal: controller.signal});
   controller.abort(); allow(env.stream);
   await assert.rejects(pending, {name: 'AbortError'});
   assert.equal(env.track.stops, 1); assert.equal(env.recorders.length, 0);
   assert.equal(env.contexts[0].closes, 1); assert.equal(env.errors.length, 0);
  });
 });
 await t.test('cancel is idempotent and suppresses queued media callbacks', () => fixture({}, async env => {
  const recording = await env.start(); recording.cancel(); recording.cancel(); await env.flush();
  assert.equal(env.done.length, 0); assert.equal(env.errors.length, 0);
  assert.equal(env.recorders[0].stops, 1); assert.equal(env.track.stops, 1);
 }));
 await t.test('abort after stop suppresses the queued result', () => fixture({}, async env => {
  const controller = new AbortController(), recording = await env.start({signal: controller.signal});
  recording.finish(); controller.abort(); await env.flush();
  assert.equal(env.done.length, 0); assert.equal(env.errors.length, 0);
 }));
 await t.test('a disconnected microphone reports one actionable error', () => fixture({}, async env => {
  await env.start(); env.track.dispatchEvent(new Event('ended')); await env.flush();
  assert.equal(env.done.length, 0); assert.equal(env.errors.length, 1); assert.match(env.errors[0], /microfone foi interrompido/);
  assert.equal(env.track.stops, 1); assert.equal(env.intervals.size, 0);
 }));
 await t.test('empty recording and stop errors fail exactly once', async () => {
  for (const options of [{bytes: 0}, {stopThrows: true}]) await fixture(options, async env => {
   const recording = await env.start(); recording.finish(); await env.flush();
   assert.equal(env.done.length, 0); assert.equal(env.errors.length, 1);
   assert.equal(env.track.stops, 1); assert.equal(env.intervals.size, 0);
  });
 });
 await t.test('Safari MP4 capture preserves its supported MIME type', () => fixture({mp4Only: true}, async env => {
  const recording = await env.start(); recording.finish(); await env.flush();
  assert.equal(env.done[0][1], 'audio/mp4');
 }));
 await t.test('already aborted capture does not request microphone access', () => fixture({}, async env => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(env.start({signal: controller.signal}), {name: 'AbortError'});
  assert.equal(env.events.length, 0);
 }));
 await t.test('audio context failure is a supported fallback', () => fixture({contextThrows: true}, async () => {
  assert.equal(audioContext(), null);
 }));
});
