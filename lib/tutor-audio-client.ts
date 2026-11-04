export type Recording = {finish: () => void; cancel: () => void};
export type RecordingOptions = {context?: AudioContext | null; signal?: AbortSignal};

export function audioContext() {
 const Constructor = window.AudioContext || (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
 try { return Constructor ? new Constructor() : null; } catch { return null; }
}

export async function recordQuestion(
 onDone: (audio: string, mime: string) => void,
 onError: (message: string) => void,
 options: RecordingOptions = {},
): Promise<Recording> {
 if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
  throw new Error('Este navegador não permite gravar. Use o Safari ou Chrome atualizado, ou escreva a pergunta.');
 }
 const {signal} = options;
 if (signal?.aborted) throw new DOMException('Gravação cancelada.', 'AbortError');

 // Reuse the context unlocked by the microphone button. Creating/resuming it
 // before the permission await also preserves the user gesture when unshared.
 const context = options.context?.state !== 'closed' && options.context ? options.context : audioContext();
 const ownsContext = context !== options.context;
 if (context) { try { void context.resume().catch(() => {}); } catch { /* Manual recording remains available. */ } }
 let stream: MediaStream | undefined, recorder: MediaRecorder | undefined;
 let source: MediaStreamAudioSourceNode | undefined, analyser: AnalyserNode | undefined;
 let timer: ReturnType<typeof setInterval> | undefined;
 let cancelled = false, finished = false, delivered = false, contextClosed = false;
 const chunks: BlobPart[] = [];
 let total = 0;

 const cleanup = () => {
  if (timer !== undefined) { clearInterval(timer); timer = undefined; }
  source?.disconnect(); source = undefined;
  analyser?.disconnect(); analyser = undefined;
  stream?.getTracks().forEach(track => { track.removeEventListener('ended', interrupted); track.stop(); });
  stream = undefined;
  if (ownsContext && context && !contextClosed) {
   contextClosed = true;
   try { void context.close().catch(() => {}); } catch { /* Already closed. */ }
  }
 };
 const finish = () => {
  if (finished) return;
  finished = true;
  try { if (recorder && recorder.state !== 'inactive') recorder.stop(); }
  catch { fail('A gravação foi interrompida. Tente de novo ou escreva.'); }
  finally { cleanup(); }
 };
 const cancel = () => { cancelled = true; finish(); cleanup(); signal?.removeEventListener('abort', cancel); };
 const fail = (message: string) => {
  if (cancelled || delivered) return;
  delivered = true;
  finish();
  signal?.removeEventListener('abort', cancel);
  onError(message);
 };
 const interrupted = () => fail('O microfone foi interrompido. Toque para tentar de novo ou escreva.');
 signal?.addEventListener('abort', cancel, {once: true});

 try {
  const acquired = await navigator.mediaDevices.getUserMedia({audio: {echoCancellation: true, noiseSuppression: true}});
  if (cancelled || signal?.aborted) {
   acquired.getTracks().forEach(track => track.stop());
   throw new DOMException('Gravação cancelada.', 'AbortError');
  }
  stream = acquired;
  const mime = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find(type => MediaRecorder.isTypeSupported(type));
  if (!mime) throw new Error('Formato de áudio não disponível. Escreva a pergunta.');
  recorder = new MediaRecorder(stream, {mimeType: mime, audioBitsPerSecond: 64000});
  stream.getTracks().forEach(track => track.addEventListener('ended', interrupted));

  if (context) {
   try {
    analyser = context.createAnalyser(); analyser.fftSize = 1024;
    source = context.createMediaStreamSource(stream); source.connect(analyser);
   } catch {
    source?.disconnect(); source = undefined;
    analyser?.disconnect(); analyser = undefined;
   }
  }
  const samples = new Float32Array(1024);
  const started = Date.now();
  let heard = false, lastVoice = started;
  timer = setInterval(() => {
   const now = Date.now();
   if (now - started >= 45000) { finish(); return; }
   // A suspended/missing analyser is not evidence of silence. Keep the manual
   // send button and bounded recording instead of discarding valid microphone data.
   if (!analyser || context?.state !== 'running') return;
   try { analyser.getFloatTimeDomainData(samples); } catch { return; }
   const rms = Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length);
   if (rms > .008) { heard = true; lastVoice = now; }
   if (heard && now - lastVoice >= 2000 && now - started >= 2200) { finish(); return; }
   if (!heard && now - started >= 25000) fail('Não ouvi uma pergunta. Toque no microfone para tentar de novo.');
  }, 100);

  recorder.ondataavailable = event => {
   if (cancelled || delivered || !event.data.size) return;
   chunks.push(event.data); total += event.data.size;
   if (total > 3_000_000) finish();
  };
  recorder.onerror = () => fail('A gravação foi interrompida. Tente de novo ou escreva.');
  recorder.onstop = async () => {
   finished = true;
   cleanup();
   if (cancelled || delivered) return;
   const blob = new Blob(chunks, {type: mime});
   if (blob.size < 100) { fail('A gravação ficou vazia. Tente de novo.'); return; }
   try {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    if (!cancelled && !delivered) { delivered = true; onDone(btoa(binary), mime.split(';')[0]); }
   } catch { fail('Não foi possível preparar o áudio.'); }
   finally { signal?.removeEventListener('abort', cancel); }
  };
  recorder.start(250);
  return {finish, cancel};
 } catch (error) {
  cancel();
  throw error;
 }
}
