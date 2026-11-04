export interface ConversationCapture {
 /** Discard any pending speech and release the microphone. Safe to call twice. */
 stop(): void;
 /** Send a confirmed utterance now, then keep listening. Silence is never sent. */
 finish(): void;
 /** Enable the more conservative local detector while tutor audio is playing. */
 setPlayback(active: boolean): void;
}
export interface ConversationCaptureOptions {
 context: AudioContext;
 signal?: AbortSignal;
 onSpeechStart: () => void;
 onUtterance: (audioBase64: string, mime: 'audio/wav') => void;
 onError: (message: string) => void;
}

const FRAME_SECONDS = .02;
const PRE_ROLL_FRAMES = 15; // 300 ms, before the first candidate speech frame.
const PAUSE_FRAMES = 50;
const MAX_SECONDS = 30;

/** Local energy detector, exported for deterministic synthetic-audio tests.
 * It is deliberately not a speech recognizer and never contacts a service.
 * Echo cancellation is supplied by the browser, not guaranteed by this VAD.
 */
export function createConversationVad(sampleRate: number, onStart: () => void, onAudio: (pcm: Float32Array) => void, onLimit: () => void) {
 if (!Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 192000) throw new Error('Taxa de áudio não suportada.');
 const frameSize = Math.round(sampleRate * FRAME_SECONDS);
 const maxSamples = Math.floor(sampleRate * MAX_SECONDS);
 let partial = new Float32Array(frameSize), partialLength = 0;
 let history: Float32Array[] = [], candidate: Float32Array[] = [], utterance: Float32Array[] = [];
 let length = 0, quietFrames = 0, speaking = false, playback = false, stopped = false;
 const reset = () => { history = []; candidate = []; utterance = []; length = 0; quietFrames = 0; speaking = false; };
 const deliver = () => {
  if (stopped || !speaking) { reset(); return; }
  const pcm = new Float32Array(length);
  let offset = 0;
  for (const frame of utterance) { pcm.set(frame, offset); offset += frame.length; }
  reset(); // Reset before a consumer callback can stop/reenter the detector.
  onAudio(pcm);
 };
 const remember = (frame: Float32Array) => {
  history.push(frame);
  if (history.length > PRE_ROLL_FRAMES) history.shift();
 };
 const process = (frame: Float32Array) => {
  let energy = 0;
  // Remove the DC component so a constant device offset cannot trigger speech.
  let mean = 0;
  for (const sample of frame) mean += sample;
  mean /= frame.length;
  for (const sample of frame) energy += (sample - mean) ** 2;
  const loud = Math.sqrt(energy / frame.length) >= (playback ? .035 : .012);
  if (!speaking) {
   if (!loud) {
    for (const pending of candidate) remember(pending);
    candidate = []; remember(frame); return;
   }
   candidate.push(frame);
   if (candidate.length < (playback ? 14 : 8)) return; // 280 / 160 ms rejects clicks.
   utterance = [...history, ...candidate]; history = []; candidate = [];
   length = utterance.reduce((total, chunk) => total + chunk.length, 0);
   speaking = true; quietFrames = 0;
   onStart();
   return;
  }
  const remaining = maxSamples - length;
  const chunk = frame.length <= remaining ? frame : frame.slice(0, remaining);
  utterance.push(chunk); length += chunk.length;
  quietFrames = loud ? 0 : quietFrames + 1;
  if (length >= maxSamples) {
   stopped = true; partialLength = 0; reset();
   onLimit(); // Never submit a partial question or start a competing turn.
  } else if (quietFrames >= PAUSE_FRAMES) deliver();
 };
 return {
  push(samples: Float32Array) {
   if (stopped) return;
   let offset = 0;
   while (offset < samples.length && !stopped) {
    const count = Math.min(frameSize - partialLength, samples.length - offset);
    partial.set(samples.subarray(offset, offset + count), partialLength);
    partialLength += count; offset += count;
    if (partialLength === frameSize) {
     const frame = partial; partial = new Float32Array(frameSize); partialLength = 0;
     process(frame);
    }
   }
  },
  finish() {
   if (stopped) return;
   if (speaking && partialLength) {
    const chunk = partial.slice(0, Math.min(partialLength, maxSamples - length));
    utterance.push(chunk); length += chunk.length;
   }
   partialLength = 0;
   deliver();
  },
  setPlayback(active: boolean) {
   if (stopped || playback === active) return;
   playback = active;
   // Do not allow a partial echo candidate to become speech at the lower threshold.
   if (!speaking) {
    history = [...history, ...candidate].slice(-PRE_ROLL_FRAMES);
    candidate = []; partialLength = 0;
   }
  },
  stop() { stopped = true; partialLength = 0; reset(); },
 };
}

/** PCM16 WAV with area-averaged downsampling (mono, at most 16 kHz).
 * Thirty seconds is <= 960,044 bytes, including its header, well below 3 MB.
 */
export function conversationWavBase64(pcm: Float32Array, sampleRate: number): string {
 const rate = Math.min(16000, sampleRate);
 const count = Math.floor(Math.min(pcm.length, sampleRate * MAX_SECONDS) * rate / sampleRate);
 const bytes = new Uint8Array(44 + count * 2), view = new DataView(bytes.buffer);
 const label = (at: number, value: string) => { for (let i = 0; i < value.length; i++) bytes[at + i] = value.charCodeAt(i); };
 label(0, 'RIFF'); view.setUint32(4, bytes.length - 8, true); label(8, 'WAVE'); label(12, 'fmt ');
 view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
 view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
 label(36, 'data'); view.setUint32(40, count * 2, true);
 const ratio = sampleRate / rate;
 for (let i = 0; i < count; i++) {
  const start = i * ratio, end = (i + 1) * ratio;
  let sum = 0;
  for (let index = Math.floor(start); index < Math.ceil(end); index++) {
   sum += (pcm[index] || 0) * (Math.min(end, index + 1) - Math.max(start, index));
  }
  const sample = Math.max(-1, Math.min(1, sum / ratio));
  view.setInt16(44 + i * 2, Math.round(sample * (sample < 0 ? 32768 : 32767)), true);
 }
 let binary = '';
 for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
 return btoa(binary);
}

export async function startConversationCapture(options: ConversationCaptureOptions): Promise<ConversationCapture> {
 const {context, signal, onSpeechStart, onUtterance, onError} = options;
 const aborted = () => new DOMException('Conversa cancelada.', 'AbortError');
 if (signal?.aborted) throw aborted();
 if (!navigator.mediaDevices?.getUserMedia) throw new Error('Este navegador não permite conversar por voz. Use Safari ou Chrome atualizado, ou escreva.');
 if (context.state === 'closed') throw new Error('O áudio foi encerrado. Toque para iniciar outra conversa.');
 let stopped = false, ready = false;
 let stream: MediaStream | undefined, source: MediaStreamAudioSourceNode | undefined;
 let processor: AudioWorkletNode | ScriptProcessorNode | undefined, mute: GainNode | undefined;
 let startupTimer: ReturnType<typeof setTimeout> | undefined, watchdog: ReturnType<typeof setInterval> | undefined;
 let lastFrame = Date.now();
 let rejectStartup: (reason: Error) => void = () => {};
 const cancelled = new Promise<never>((_resolve, reject) => { rejectStartup = reject; });
 // The abort/deadline race can reject while an earlier synchronous setup step fails.
 void cancelled.catch(() => {});
 const detachProcessor = () => {
  if (!processor) return;
  if ('port' in processor) { processor.port.onmessage = null; processor.port.close(); processor.onprocessorerror = null; }
  else processor.onaudioprocess = null;
  try { processor.disconnect(); } catch { /* Detached already. */ }
  processor = undefined;
 };
 const stop = () => {
  if (stopped) return;
  stopped = true;
  rejectStartup(aborted());
  vad.stop();
  signal?.removeEventListener('abort', stop);
  context.removeEventListener('statechange', stateChanged);
  if (startupTimer !== undefined) clearTimeout(startupTimer);
  if (watchdog !== undefined) clearInterval(watchdog);
  try { source?.disconnect(); } catch { /* Detached already. */ }
  source = undefined;
  detachProcessor();
  try { mute?.disconnect(); } catch { /* Detached already. */ }
  mute = undefined;
  stream?.getTracks().forEach(track => { track.removeEventListener('ended', deviceEnded); track.stop(); });
  stream = undefined;
 };
 const fail = (message: string) => {
  if (stopped) return;
  const wasReady = ready;
  rejectStartup(new Error(message));
  stop();
  if (wasReady) onError(message);
 };
 const deviceEnded = () => fail('O microfone foi desconectado. Toque para iniciar outra conversa.');
 const stateChanged = () => {
  if (context.state === 'closed' || (ready && context.state !== 'running')) {
   fail('O áudio foi interrompido. Toque para retomar a conversa.');
  }
 };
 const vad = createConversationVad(context.sampleRate, () => { if (!stopped) onSpeechStart(); }, pcm => {
  if (stopped) return;
  try {
   const audio = conversationWavBase64(pcm, context.sampleRate);
   if (!stopped) onUtterance(audio, 'audio/wav');
  } catch { fail('Não foi possível preparar a fala. Toque para tentar novamente.'); }
 }, () => fail('A pergunta ficou muito longa. Tente uma pergunta mais curta, com menos de 30 segundos.'));
 const receive = (samples: Float32Array) => {
  if (stopped || !ready) return;
  if (context.state !== 'running') { stateChanged(); return; }
  lastFrame = Date.now();
  try { vad.push(samples); } catch { fail('A captura de voz foi interrompida. Toque para tentar novamente.'); }
 };
 signal?.addEventListener('abort', stop, {once: true});
 context.addEventListener('statechange', stateChanged);
 startupTimer = setTimeout(() => fail('A permissão do microfone ou o áudio não foi liberado. Toque para tentar novamente.'), 45000);
 try {
  // Resume synchronously within the initiating click, before awaiting permission.
  const resumed = context.resume();
  void resumed.catch(() => {});
  const permission = navigator.mediaDevices.getUserMedia({audio: {
   channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true,
  }}).then(acquired => {
   // A permission prompt cannot be cancelled, so dispose even a much later grant.
   if (stopped || signal?.aborted) { acquired.getTracks().forEach(track => track.stop()); throw aborted(); }
   stream = acquired;
   stream.getTracks().forEach(track => track.addEventListener('ended', deviceEnded));
   if (!stream.getAudioTracks().length || stream.getAudioTracks().some(track => track.readyState === 'ended')) throw new Error('O microfone não está disponível.');
   return acquired;
  });
  await Promise.race([Promise.all([permission, resumed]), cancelled]);
  if (stopped) throw aborted();
  if (context.state !== 'running') throw new Error('O navegador bloqueou o áudio. Toque para tentar novamente.');
  source = context.createMediaStreamSource(stream!);
  mute = context.createGain(); mute.gain.value = 0;
  mute.connect(context.destination); // Pull the graph without playing microphone audio.
  if (context.audioWorklet && typeof AudioWorkletNode !== 'undefined') {
   try {
    await Promise.race([context.audioWorklet.addModule('/tutor/voice-capture-worklet.js?v=8c593ea340c0'), cancelled]);
    if (stopped) throw aborted();
    const node = new AudioWorkletNode(context, 'tutor-voice-capture', {numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1]});
    processor = node;
    node.port.onmessage = event => { if (event.data instanceof Float32Array) receive(event.data); };
    node.onprocessorerror = () => fail('A captura de voz foi interrompida. Toque para tentar novamente.');
    source.connect(node); node.connect(mute);
   } catch (error) {
    if (stopped) throw error;
    source.disconnect(); detachProcessor();
   }
  }
  if (!processor) {
   // Local PCM fallback for browsers without a working AudioWorklet; no speech API.
   if (typeof context.createScriptProcessor !== 'function') throw new Error('Este navegador não suporta conversa contínua. Use Safari ou Chrome atualizado, ou escreva.');
   const node = context.createScriptProcessor(2048, 1, 1);
   processor = node;
   node.onaudioprocess = event => { event.outputBuffer.getChannelData(0).fill(0); receive(event.inputBuffer.getChannelData(0)); };
   source.connect(node); node.connect(mute);
  }
  if (stopped) throw aborted();
  if (context.state !== 'running') throw new Error('O áudio foi interrompido. Toque para retomar a conversa.');
  ready = true; lastFrame = Date.now();
  clearTimeout(startupTimer); startupTimer = undefined;
  // Detect a graph which starts but never processes; don't leave a silent live mic.
  watchdog = setInterval(() => {
   if (!stopped && Date.now() - lastFrame > 5000) fail('Não foi possível receber áudio do microfone. Toque para tentar novamente.');
  }, 1000);
  return {stop, finish: () => { if (!stopped) vad.finish(); }, setPlayback: active => { if (!stopped) vad.setPlayback(active); }};
 } catch (error) {
  stop();
  throw error;
 }
}
