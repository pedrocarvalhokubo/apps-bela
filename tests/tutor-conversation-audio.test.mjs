import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createConversationVad, conversationWavBase64, startConversationCapture} from '../lib/tutor-conversation-audio.ts';

// Generated tones only: no microphone, child data, accounts or provider requests.
function tone(seconds, amplitude = .06, rate = 16000) {
 return Float32Array.from({length: Math.round(seconds * rate)}, (_, i) => Math.sin(2 * Math.PI * 400 * i / rate) * amplitude);
}
function vadFixture(rate = 16000) {
 const starts = [], utterances = [], limits = [];
 const vad = createConversationVad(rate, () => starts.push(true), pcm => utterances.push(pcm), () => limits.push(true));
 return {vad, starts, utterances, limits};
}

test('local VAD waits for speech, preserves 300 ms prefix and waits one second to finalize', () => {
 const {vad, starts, utterances} = vadFixture();
 vad.push(tone(2, 0)); assert.equal(starts.length, 0); assert.equal(utterances.length, 0);
 vad.push(tone(.16)); assert.equal(starts.length, 1);
 vad.push(tone(.3)); vad.push(tone(.98, 0)); assert.equal(utterances.length, 0);
 vad.push(tone(.02, 0)); assert.equal(utterances.length, 1);
 assert.equal(utterances[0].length, 1.76 * 16000);
 assert.ok(utterances[0].slice(0, 4800).every(value => value === 0));
 assert.ok(utterances[0].slice(4800, 4800 + 2560).some(value => value > .04));
});
test('clicks, short bursts, DC offsets and initial silence are never sent', () => {
 const {vad, starts, utterances} = vadFixture();
 vad.push(tone(.1)); vad.push(tone(1, 0));
 vad.push(new Float32Array(16000).fill(.2)); vad.finish();
 assert.equal(starts.length, 0); assert.equal(utterances.length, 0);
});
test('manual finish sends confirmed speech with partial frame, keeps listening and ignores empty sends', () => {
 const {vad, starts, utterances} = vadFixture();
 vad.finish(); vad.push(tone(.171)); vad.finish(); vad.finish();
 assert.equal(utterances.length, 1); assert.equal(utterances[0].length, 2736);
 vad.push(tone(.2)); vad.finish(); assert.equal(utterances.length, 2); assert.equal(starts.length, 2);
});
test('30 second limit discards the whole utterance, reports once and never starts a competing turn', () => {
 const {vad, starts, utterances, limits} = vadFixture();
 vad.push(tone(29.98)); assert.equal(limits.length, 0);
 vad.push(tone(.02)); assert.equal(limits.length, 1);
 vad.push(tone(31)); vad.finish();
 assert.equal(utterances.length, 0); assert.equal(starts.length, 1); assert.equal(limits.length, 1);
});
test('barge-in rejects lower echo and shorter bursts but retains a new utterance', () => {
 const {vad, starts, utterances} = vadFixture();
 vad.setPlayback(true); vad.push(tone(.5, .03)); vad.push(tone(.26, .07));
 assert.equal(starts.length, 0);
 vad.push(tone(.02, .07)); assert.equal(starts.length, 1);
 vad.setPlayback(false); vad.push(tone(.2, .02)); vad.finish();
 assert.equal(utterances.length, 1);
 assert.equal(utterances[0].length, (.3 + .28 + .2) * 16000);
});
test('playback transition clears unconfirmed echo before normal threshold resumes', () => {
 const {vad, starts, utterances} = vadFixture();
 vad.setPlayback(true); vad.push(tone(.26)); vad.setPlayback(false); vad.push(tone(.02)); vad.finish();
 assert.equal(starts.length, 0); assert.equal(utterances.length, 0);
});
test('stop and reentrant stop discard all audio and prevent future callbacks', () => {
 const {vad, starts, utterances} = vadFixture();
 vad.push(tone(.2)); vad.stop(); vad.stop(); vad.finish(); vad.push(tone(2));
 assert.equal(starts.length, 1); assert.equal(utterances.length, 0);
 let startCount = 0;
 const reentrant = createConversationVad(16000, () => { startCount++; reentrant.stop(); }, () => assert.fail('late audio'), () => assert.fail('late limit'));
 reentrant.push(tone(32)); assert.equal(startCount, 1);
});
test('WAV is PCM16 mono, resampled and bounded below 3 MB including base64', () => {
 for (const rate of [8000, 16000, 44100, 48000, 96000]) {
  const audio = conversationWavBase64(tone(31, .7, rate), rate), bytes = Buffer.from(audio, 'base64');
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF'); assert.equal(bytes.toString('ascii', 8, 12), 'WAVE');
  assert.equal(bytes.readUInt16LE(20), 1); assert.equal(bytes.readUInt16LE(22), 1);
  assert.equal(bytes.readUInt32LE(24), Math.min(rate, 16000)); assert.equal(bytes.readUInt16LE(34), 16);
  assert.equal(bytes.length, 44 + 30 * Math.min(rate, 16000) * 2); assert.ok(audio.length < 3_000_000);
 }
});

function browser(options = {}) {
 const names = ['navigator', 'AudioWorkletNode', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'];
 const originals = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
 const realNow = Date.now;
 let now = 0, nextTimer = 0, permissions = 0, requested, starts = 0;
 const timers = new Map(), intervals = new Map(), utterances = [], errors = [], nodes = [];
 class Track extends EventTarget { stops = 0; readyState = 'live'; stop() { this.stops++; this.readyState = 'ended'; } }
 const track = new Track(), stream = {getTracks: () => [track], getAudioTracks: () => [track]};
 class Node {
  disconnects = 0; connections = []; gain = {value: 1};
  constructor() { nodes.push(this); }
  connect(node) { this.connections.push(node); }
  disconnect() { this.disconnects++; this.connections = []; }
 }
 class Worklet extends Node {
  port = {onmessage: null, closes: 0, close() { this.closes++; }};
 }
 class Context extends EventTarget {
  state = options.state ?? 'running'; sampleRate = 16000; destination = {}; closes = 0; resumes = 0;
  audioWorklet = options.noWorklet ? undefined : {addModule: path => {
   assert.equal(path, '/tutor/voice-capture-worklet.js?v=8c593ea340c0');
   return options.modulePromise ?? (options.moduleRejects ? Promise.reject(new Error('Module failed')) : Promise.resolve());
  }};
  resume() { this.resumes++; return options.resumePromise ?? (options.resumeRejects ? Promise.reject(new Error('Resume blocked')) : Promise.resolve()); }
  close() { this.closes++; }
  createMediaStreamSource() { if (options.sourceThrows) throw new Error('Source failed'); this.source = new Node(); return this.source; }
  createGain() { this.mute = new Node(); return this.mute; }
  createScriptProcessor() { if (options.fallbackThrows) throw new Error('Fallback failed'); this.fallback = new Node(); return this.fallback; }
 }
 const install = (name, value) => Object.defineProperty(globalThis, name, {value, writable: true, configurable: true});
 install('navigator', {mediaDevices: {getUserMedia: constraints => {
  permissions++; requested = constraints;
  return options.permissionPromise ?? (options.permissionRejects ? Promise.reject(new DOMException('Denied', 'NotAllowedError')) : Promise.resolve(stream));
 }}});
 install('AudioWorkletNode', Worklet);
 install('setTimeout', fn => { const id = ++nextTimer; timers.set(id, fn); return id; });
 install('clearTimeout', id => timers.delete(id));
 install('setInterval', fn => { const id = ++nextTimer; intervals.set(id, fn); return id; });
 install('clearInterval', id => intervals.delete(id));
 Date.now = () => now;
 const context = new Context();
 return {
  context, track, stream, utterances, errors, nodes, timers, intervals,
  get starts() { return starts; }, get permissions() { return permissions; }, get requested() { return requested; },
  get worklet() { return nodes.find(node => node instanceof Worklet); },
  start: (signal, extra = {}) => startConversationCapture({context, signal, onSpeechStart: () => starts++, onUtterance: (...args) => utterances.push(args), onError: error => errors.push(error), ...extra}),
  feed: pcm => {
   const node = nodes.find(node => node instanceof Worklet);
   if (node) node.port.onmessage?.({data: pcm});
   else context.fallback?.onaudioprocess?.({inputBuffer: {getChannelData: () => pcm}, outputBuffer: {getChannelData: () => new Float32Array(pcm.length)}});
  },
  tick: at => { now = at; for (const fn of [...intervals.values()]) fn(); },
  timeout: () => { for (const fn of [...timers.values()]) fn(); },
  flush: () => new Promise(resolve => setImmediate(resolve)),
  restore: () => {
   for (const [name, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
   Date.now = realNow;
  },
 };
}
async function fixture(options, fn) { const env = browser(options); try { await fn(env); } finally { env.restore(); } }

test('continuous capture lifecycle with mocked browser audio', async t => {
 await t.test('opens one mic with AEC and never plays or closes shared audio context', () => fixture({}, async env => {
  const capture = await env.start();
  assert.equal(env.permissions, 1); assert.deepEqual(env.requested.audio, {channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true});
  assert.equal(env.context.mute.gain.value, 0); assert.equal(env.context.resumes, 1);
  env.feed(tone(.2)); capture.finish(); env.feed(tone(.2)); capture.finish();
  assert.equal(env.utterances.length, 2); assert.equal(env.utterances[0][1], 'audio/wav'); assert.equal(env.track.stops, 0);
  capture.stop(); capture.stop();
  assert.equal(env.track.stops, 1); assert.equal(env.context.closes, 0);
  assert.equal(env.context.source.disconnects, 1); assert.equal(env.worklet.disconnects, 1); assert.equal(env.worklet.port.closes, 1);
  assert.equal(env.intervals.size, 0); assert.equal(env.timers.size, 0);
 }));
 await t.test('long question closes mic, reports actionable error and sends no partial audio', () => fixture({}, async env => {
  const capture = await env.start(); env.feed(tone(31));
  capture.finish(); env.feed(tone(1)); capture.stop();
  assert.equal(env.track.stops, 1); assert.equal(env.starts, 1); assert.equal(env.utterances.length, 0);
  assert.equal(env.errors.length, 1); assert.match(env.errors[0], /pergunta mais curta/);
  assert.equal(env.intervals.size, 0); assert.equal(env.context.closes, 0);
 }));
 await t.test('stop suppresses queued callbacks and discards speech', () => fixture({}, async env => {
  const capture = await env.start(); const queued = env.worklet.port.onmessage;
  env.feed(tone(.2)); capture.stop(); queued({data: tone(2)}); capture.finish(); capture.setPlayback(true);
  env.track.dispatchEvent(new Event('ended')); env.worklet.onprocessorerror?.();
  assert.equal(env.starts, 1); assert.equal(env.utterances.length, 0); assert.equal(env.errors.length, 0);
 }));
 await t.test('signal abort releases active capture without result or error', () => fixture({}, async env => {
  const controller = new AbortController(), capture = await env.start(controller.signal);
  env.feed(tone(.2)); controller.abort(); capture.finish();
  assert.equal(env.track.stops, 1); assert.equal(env.errors.length, 0); assert.equal(env.utterances.length, 0);
 }));
 await t.test('already-aborted request never asks permission', () => fixture({}, async env => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(env.start(controller.signal), {name: 'AbortError'}); assert.equal(env.permissions, 0);
 }));
 await t.test('pending permission abort rejects promptly, later grant stops tracks', async () => {
  let allow; const permissionPromise = new Promise(resolve => { allow = resolve; });
  await fixture({permissionPromise}, async env => {
   const controller = new AbortController(), pending = env.start(controller.signal);
   controller.abort(); await assert.rejects(pending, {name: 'AbortError'});
   assert.equal(env.nodes.length, 0); allow(env.stream); await env.flush();
   assert.equal(env.track.stops, 1); assert.equal(env.errors.length, 0); assert.equal(env.context.closes, 0);
  });
 });
 await t.test('pending permission times out and disposes of a late grant', async () => {
  let allow; const permissionPromise = new Promise(resolve => { allow = resolve; });
  await fixture({permissionPromise}, async env => {
   const pending = env.start(); env.timeout(); await assert.rejects(pending, /permissão/);
   allow(env.stream); await env.flush(); assert.equal(env.track.stops, 1); assert.equal(env.errors.length, 0);
  });
 });
 await t.test('pending AudioContext resume cancels promptly and never revives an old capture', async () => {
  let resume;const resumePromise=new Promise(resolve=>{resume=resolve;});
  await fixture({resumePromise},async env=>{
   const controller=new AbortController(),pending=env.start(controller.signal);await env.flush();controller.abort();
   await assert.rejects(pending,{name:'AbortError'});assert.equal(env.track.stops,1);resume();await env.flush();
   assert.equal(env.nodes.length,0);assert.equal(env.utterances.length,0);assert.equal(env.errors.length,0);
  });
 });
 await t.test('pending AudioContext resume has a visible deadline and releases the microphone', async () => {
  await fixture({resumePromise:new Promise(()=>{})},async env=>{
   const pending=env.start();await env.flush();env.timeout();await assert.rejects(pending,/permissão/);
   assert.equal(env.track.stops,1);assert.equal(env.nodes.length,0);assert.equal(env.intervals.size,0);
  });
 });
 await t.test('denied permission preserves browser error and does not acquire tracks', () => fixture({permissionRejects: true}, async env => {
  await assert.rejects(env.start(), {name: 'NotAllowedError'});
  assert.equal(env.track.stops, 0); assert.equal(env.errors.length, 0); assert.equal(env.timers.size, 0);
 }));
 for (const options of [{moduleRejects: true}, {noWorklet: true}]) await t.test(`local PCM fallback: ${JSON.stringify(options)}`, () => fixture(options, async env => {
  const capture = await env.start(); assert.ok(env.context.fallback);
  env.feed(tone(.2)); capture.finish(); assert.equal(env.utterances.length, 1);
  capture.stop(); assert.equal(env.context.fallback.onaudioprocess, null); assert.equal(env.track.stops, 1);
 }));
 for (const options of [{state: 'suspended'}, {resumeRejects: true}, {sourceThrows: true}, {moduleRejects: true, fallbackThrows: true}]) await t.test(`startup failure releases acquired microphone: ${JSON.stringify(options)}`, () => fixture(options, async env => {
  await assert.rejects(env.start()); await env.flush();
  assert.equal(env.track.stops, 1); assert.equal(env.context.closes, 0); assert.equal(env.errors.length, 0);
  assert.equal(env.timers.size, 0); assert.equal(env.intervals.size, 0);
 }));
 await t.test('closed context never requests permission', () => fixture({state: 'closed'}, async env => {
  await assert.rejects(env.start(), /encerrado/); assert.equal(env.permissions, 0);
 }));
 await t.test('abort during loading worklet releases tracks and never creates fallback', async () => {
  let loaded; const modulePromise = new Promise(resolve => { loaded = resolve; });
  await fixture({modulePromise}, async env => {
   const controller = new AbortController(), pending = env.start(controller.signal); await env.flush();
   controller.abort(); await assert.rejects(pending, {name: 'AbortError'}); loaded(); await env.flush();
   assert.equal(env.track.stops, 1); assert.equal(env.context.fallback, undefined); assert.equal(env.worklet, undefined);
  });
 });
 await t.test('suspending while worklet loads fails startup and releases microphone', async () => {
  let loaded; const modulePromise = new Promise(resolve => { loaded = resolve; });
  await fixture({modulePromise}, async env => {
   const pending = env.start(); await env.flush();
   env.context.state = 'suspended'; env.context.dispatchEvent(new Event('statechange'));
   loaded(); await assert.rejects(pending, /interrompido/);
   assert.equal(env.track.stops, 1); assert.equal(env.errors.length, 0); assert.equal(env.intervals.size, 0);
  });
 });
 await t.test('device disconnect during worklet loading rejects without awaiting module', async () => {
  const modulePromise = new Promise(() => {});
  await fixture({modulePromise}, async env => {
   const pending = env.start(); await env.flush();
   env.track.dispatchEvent(new Event('ended')); await assert.rejects(pending, /desconectado/);
   assert.equal(env.track.stops, 1); assert.equal(env.errors.length, 0); assert.equal(env.context.closes, 0);
  });
 });
 for (const interruption of ['ended', 'suspended', 'closed', 'processorerror', 'no-frames']) await t.test(`runtime ${interruption} stops mic and reports once`, () => fixture({}, async env => {
  const capture = await env.start(); env.feed(tone(.2));
  if (interruption === 'ended') env.track.dispatchEvent(new Event('ended'));
  else if (interruption === 'processorerror') env.worklet.onprocessorerror();
  else if (interruption === 'no-frames') env.tick(6000);
  else { env.context.state = interruption; env.context.dispatchEvent(new Event('statechange')); }
  capture.finish(); capture.stop(); assert.equal(env.track.stops, 1); assert.equal(env.errors.length, 1);
  assert.equal(env.utterances.length, 0); assert.equal(env.intervals.size, 0);
 }));
 await t.test('playback mode can be toggled during speech-start callback without losing utterance', () => fixture({}, async env => {
  let capture, starts = 0;
  capture = await env.start(undefined, {onSpeechStart: () => { starts++; capture.setPlayback(false); }});
  capture.setPlayback(true); env.feed(tone(.26)); assert.equal(starts, 0);
  env.feed(tone(.04)); env.feed(tone(1, 0)); assert.equal(starts, 1); assert.equal(env.utterances.length, 1);
  capture.stop();
 }));
});

test('worklet downmixes local PCM, transfers bounded chunks and silences all outputs', () => {
 let Processor;
 class Base { constructor() { this.messages = []; this.port = {postMessage: (pcm, transfer) => this.messages.push({pcm, transfer})}; } }
 vm.runInNewContext(readFileSync(new URL('../public/tutor/voice-capture-worklet.js', import.meta.url), 'utf8'), {
  AudioWorkletProcessor: Base, Float32Array,
  registerProcessor: (name, implementation) => { assert.equal(name, 'tutor-voice-capture'); Processor = implementation; },
 });
 const processor = new Processor(), left = new Float32Array(128).fill(.2), right = new Float32Array(128).fill(.4);
 const output = new Float32Array(128).fill(1);
 for (let i = 0; i < 8; i++) assert.equal(processor.process([[left, right]], [[output]]), true);
 assert.equal(processor.messages.length, 1); assert.equal(processor.messages[0].pcm.length, 1024);
 assert.ok(Math.abs(processor.messages[0].pcm[0] - .3) < .00001);
 assert.equal(processor.messages[0].transfer[0], processor.messages[0].pcm.buffer); assert.ok(output.every(value => value === 0));
 assert.equal(processor.process([[]], [[output]]), true);
});
