import test from 'node:test';
import assert from 'node:assert/strict';
import { TutorVoiceSession } from '../lib/tutor-voice-session.ts';

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };

function fakeClock() {
  let time = 0, id = 0;
  const timers = new Map();
  return {
    now: () => time,
    setTimeout(callback, ms) { const handle = ++id; timers.set(handle, { at: time + ms, callback }); return handle; },
    clearTimeout(handle) { timers.delete(handle); },
    tick(ms) {
      const end = time + ms;
      while (true) {
        const next = [...timers].sort((a, b) => a[1].at - b[1].at).find(([, timer]) => timer.at <= end);
        if (!next) break;
        timers.delete(next[0]); time = next[1].at; next[1].callback();
      }
      time = end;
    },
    get pending() { return timers.size; },
  };
}

function harness(options = {}) {
  const captures = [], submits = [], plays = [], turns = [], states = [], errors = [];
  const clock = fakeClock();
  const session = new TutorVoiceSession({
    clock,
    openCapture: async (callbacks) => {
      const capture = {
        callbacks, stops: 0, finishes: 0, playback: [],
        stop() { this.stops++; },
        finish() { this.finishes++; },
        setPlayback(value) { this.playback.push(value); },
      };
      captures.push(capture);
      if (options.deferOpen) {
        capture.opening = deferred();
        await capture.opening.promise;
      }
      return capture;
    },
    submit(audioBase64, mime, signal) {
      const request = { ...deferred(), audioBase64, mime, signal };
      submits.push(request); return request.promise;
    },
    play(turn, signal, onSpeaking) {
      const playback = { ...deferred(), turn, signal, onSpeaking };
      plays.push(playback); return playback.promise;
    },
    onTurn: (turn) => turns.push(turn), onState: (state) => states.push(state), onError: (error) => errors.push(error),
    ...options,
  });
  return { session, clock, captures, submits, plays, turns, states, errors };
}
const speak = (capture, text = 'fake-audio') => {
  capture.callbacks.onSpeechStart();
  capture.callbacks.onUtterance(text, 'audio/webm');
};

test('one capture supports several turns and speaking starts only on playback confirmation', async () => {
  const h = harness();
  const first = h.session.start();
  assert.equal(first, h.session.start());
  await first;
  assert.equal(h.session.active, true);
  assert.deepEqual(h.states, ['permission', 'listening']);
  const capture = h.captures[0];
  for (let i = 0; i < 2; i++) {
    speak(capture);
    assert.equal(h.states.at(-1), 'thinking');
    assert.equal(h.submits[i].audioBase64, 'fake-audio');
    h.submits[i].resolve({ text: `answer-${i}` }); await flush();
    assert.equal(h.states.at(-1), 'audio');
    assert.equal(capture.playback.includes(true), i > 0);
    h.plays[i].onSpeaking();
    assert.equal(h.states.at(-1), 'speaking');
    assert.equal(capture.playback.at(-1), true);
    h.plays[i].resolve(); await flush();
    assert.equal(h.states.at(-1), 'listening');
    assert.equal(capture.playback.at(-1), false);
  }
  assert.equal(h.captures.length, 1);
  assert.equal(h.turns.length, 2);
  h.session.stop();
  assert.equal(capture.stops, 1);
  assert.equal(h.clock.pending, 0);
});

test('speech interrupts playback immediately and ignores late speaking/completion callbacks', async () => {
  const h = harness(); await h.session.start(); const capture = h.captures[0];
  speak(capture); h.submits[0].resolve('first'); await flush(); h.plays[0].onSpeaking();
  capture.callbacks.onSpeechStart();
  assert.equal(h.plays[0].signal.aborted, true);
  assert.equal(h.states.at(-1), 'listening');
  assert.equal(capture.playback.at(-1), false);
  capture.callbacks.onUtterance('second', 'audio/webm');
  const count = h.states.length;
  h.plays[0].onSpeaking(); h.plays[0].resolve(); await flush();
  assert.equal(h.states.length, count);
  assert.equal(capture.stops, 0);
  h.submits[1].resolve('second'); await flush();
  assert.deepEqual(h.turns, ['first', 'second']);
  h.session.stop();
});

test('speech during submit cancels the old request and ignores its late response', async () => {
  const h = harness(); await h.session.start(); const capture = h.captures[0];
  speak(capture); speak(capture, 'second');
  assert.equal(h.submits[0].signal.aborted, true);
  h.submits[0].resolve('stale'); await flush();
  assert.deepEqual(h.turns, []); assert.equal(h.plays.length, 0);
  h.submits[1].resolve('current'); await flush();
  assert.deepEqual(h.turns, ['current']);
  h.session.stop();
});

test('late rejected requests and old capture errors never affect a restarted session', async () => {
  const h = harness(); await h.session.start(); const old = h.captures[0];
  speak(old); h.session.stop(); await h.session.start();
  h.submits[0].reject(new Error('old network failure'));
  old.callbacks.onError(new Error('old microphone failure'));
  old.callbacks.onSpeechStart(); old.callbacks.onUtterance('stale', 'audio/webm');
  await flush();
  assert.equal(h.session.active, true); assert.equal(h.states.at(-1), 'listening');
  assert.deepEqual(h.errors, []); assert.equal(h.submits.length, 1);
  h.session.stop();
});

test('late permission resolution closes only the old microphone across start/stop/start', async () => {
  const h = harness({ deferOpen: true });
  const oldStart = h.session.start(); await flush(); const old = h.captures[0];
  h.session.stop();
  assert.equal(old.callbacks.signal.aborted, true);
  const newStart = h.session.start(); await flush(); const current = h.captures[1];
  current.opening.resolve(); await newStart;
  old.opening.resolve(); await oldStart;
  assert.equal(old.stops, 1); assert.equal(current.stops, 0);
  assert.equal(h.session.active, true); assert.equal(h.states.at(-1), 'listening');
  h.session.stop(); assert.equal(current.stops, 1);
});

test('stop before capture opens avoids requesting permission at all', async () => {
  const h = harness(); const pending = h.session.start(); h.session.stop(); await pending;
  assert.equal(h.captures.length, 0); assert.equal(h.session.active, false);
});

for (const failure of ['submit', 'play', 'capture']) {
  test(`${failure} error closes capture, clears timers and preserves any delivered text`, async () => {
    const h = harness(); await h.session.start(); const capture = h.captures[0];
    speak(capture);
    if (failure === 'submit') h.submits[0].reject(new Error('Falha na resposta.'));
    if (failure === 'play') {
      h.submits[0].resolve('text remains'); await flush();
      h.plays[0].reject(new Error('Falha no áudio.'));
    }
    if (failure === 'capture') capture.callbacks.onError(new Error('Microfone desconectado.'));
    await flush();
    assert.equal(h.session.active, false); assert.equal(capture.stops, 1);
    assert.equal(h.states.at(-1), 'error'); assert.equal(h.errors.length, 1);
    assert.equal(h.clock.pending, 0); assert.equal(h.submits[0].signal.aborted, true);
    assert.deepEqual(h.turns, failure === 'play' ? ['text remains'] : []);
  });
}

test('permission error returns cleanly and allows a fresh start', async () => {
  let calls = 0;
  const h = harness({ openCapture: async () => { calls++; throw new Error('Permita acesso ao microfone.'); } });
  await h.session.start(); await h.session.start();
  assert.equal(calls, 2); assert.equal(h.session.active, false);
  assert.equal(h.errors.at(-1), 'Permita acesso ao microfone.');
});

test('button interrupt keeps capture open; repeated finish and stop are safe', async () => {
  const h = harness(); h.session.finish(); h.session.stop(); h.session.interrupt();
  await h.session.start(); const capture = h.captures[0];
  h.session.finish(); h.session.finish(); assert.equal(capture.finishes, 2);
  speak(capture); h.session.interrupt(); h.session.interrupt();
  assert.equal(h.submits[0].signal.aborted, true); assert.equal(capture.stops, 0);
  assert.equal(h.states.at(-1), 'listening');
  h.session.stop(); h.session.stop(); h.session.finish();
  assert.equal(capture.stops, 1); assert.equal(capture.finishes, 2);
  assert.equal(h.states.at(-1), 'idle');
});

test('idle limit applies only while waiting, not while capturing, thinking or playing', async () => {
  const h = harness(); await h.session.start(); const capture = h.captures[0];
  h.clock.tick(59_999); assert.equal(h.session.active, true);
  capture.callbacks.onSpeechStart(); h.clock.tick(61_000); assert.equal(h.session.active, true);
  capture.callbacks.onUtterance('fake', 'audio/webm');
  h.clock.tick(61_000); assert.equal(h.session.active, true);
  h.submits[0].resolve('reply'); await flush();
  h.clock.tick(61_000); assert.equal(h.session.active, true);
  h.plays[0].onSpeaking(); h.clock.tick(61_000); assert.equal(h.session.active, true);
  h.plays[0].resolve(); await flush();
  h.clock.tick(59_999); assert.equal(h.session.active, true);
  h.clock.tick(1); assert.equal(h.session.active, false);
  assert.match(h.errors[0], /inatividade/); assert.equal(capture.stops, 1);
});

test('maximum duration ends idle sessions and removes all timers', async () => {
  const h = harness({ idleTimeoutMs: 1_000_000 }); await h.session.start();
  h.clock.tick(600_000);
  assert.equal(h.session.active, false); assert.match(h.errors[0], /10 minutos/);
  assert.equal(h.clock.pending, 0);
});

for (const phase of ['capturing', 'thinking', 'audio', 'speaking']) {
  test(`maximum duration waits until ${phase} finishes`, async () => {
    const h = harness(); await h.session.start(); const capture = h.captures[0];
    capture.callbacks.onSpeechStart();
    if (phase !== 'capturing') capture.callbacks.onUtterance('fake', 'audio/webm');
    if (phase === 'audio' || phase === 'speaking') { h.submits[0].resolve('reply'); await flush(); }
    if (phase === 'speaking') h.plays[0].onSpeaking();
    h.clock.tick(600_001); assert.equal(h.session.active, true);
    if (phase === 'capturing') capture.callbacks.onUtterance('fake', 'audio/webm');
    if (phase === 'capturing' || phase === 'thinking') { h.submits[0].resolve('reply'); await flush(); }
    h.plays[0].resolve(); await flush();
    assert.equal(h.session.active, false); assert.match(h.errors[0], /10 minutos/);
    assert.equal(capture.stops, 1); assert.equal(h.clock.pending, 0);
  });
}

test('discarded speech restores idle timeout without submitting empty audio', async () => {
  const h = harness(); await h.session.start(); const capture = h.captures[0];
  capture.callbacks.onSpeechStart(); h.clock.tick(70_000);
  capture.callbacks.onUtterance('', 'audio/webm');
  assert.equal(h.submits.length, 0);
  h.clock.tick(60_000); assert.equal(h.session.active, false);
});

test('late callbacks after stop cannot restore speaking or deliver turns', async () => {
  const h = harness(); await h.session.start(); const capture = h.captures[0];
  speak(capture); h.submits[0].resolve('kept'); await flush();
  h.session.stop(); const stateCount = h.states.length;
  h.plays[0].onSpeaking(); h.plays[0].reject(new Error('late playback error'));
  capture.callbacks.onError('late capture error');
  await flush();
  assert.equal(h.states.length, stateCount); assert.equal(h.states.at(-1), 'idle');
  assert.deepEqual(h.errors, []); assert.deepEqual(h.turns, ['kept']);
});

test('browser microphone permission errors have actionable messages', async () => {
  const error = new Error('Permission denied'); error.name = 'NotAllowedError';
  const h = harness({ openCapture: async () => { throw error; } });
  await h.session.start();
  assert.match(h.errors[0], /Permita o acesso ao microfone/);
});

test('playback cleanup failure still closes microphone and reports error', async () => {
  const h = harness(); await h.session.start(); const capture = h.captures[0];
  speak(capture); h.submits[0].resolve('kept'); await flush();
  capture.setPlayback = () => { throw new Error('Falha ao finalizar áudio.'); };
  h.plays[0].resolve(); await flush();
  assert.equal(h.session.active, false); assert.equal(capture.stops, 1);
  assert.deepEqual(h.turns, ['kept']); assert.equal(h.errors.length, 1);
});
