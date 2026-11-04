/** Synthetic component/session integration, NOT browser/device validation.
 * Executes the real BelaTutor and TutorVoiceSession. Only React rendering/hooks,
 * DOM, capture, WebAudio and HTTP are substituted. No microphone/API is accessed.
 * This harness does not reproduce React concurrency, DOM events, permissions,
 * autoplay policy, AudioWorklet, echo cancellation or browser lifecycle behavior.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bridgeKey = '__belaVoiceUiSyntheticHarness';
const bundle = await build({
  entryPoints: [new URL('../app/components/BelaTutor.tsx', import.meta.url).pathname],
  bundle: true, write: false, platform: 'node', format: 'esm', jsx: 'automatic',
  plugins: [{ name: 'synthetic-platform-only', setup(builder) {
    builder.onResolve({ filter: /^(react|react\/jsx-runtime)$/ }, args => ({ path: args.path, namespace: 'harness' }));
    builder.onResolve({ filter: /tutor-(audio-client|conversation-audio)$/ }, args => ({ path: args.path, namespace: 'harness' }));
    builder.onResolve({ filter: /\.module\.css$/ }, args => ({ path: args.path, namespace: 'harness' }));
    builder.onLoad({ filter: /.*/, namespace: 'harness' }, args => {
      const bridge = `globalThis.${bridgeKey}`;
      let contents;
      if (args.path === 'react') contents = `export const useState=(...a)=>${bridge}.useState(...a),useRef=(...a)=>${bridge}.useRef(...a),useEffect=(...a)=>${bridge}.useEffect(...a);`;
      else if (args.path === 'react/jsx-runtime') contents = 'export const Fragment=Symbol.for("fragment"),jsx=(type,props,key)=>({type,props:props||{},key}),jsxs=jsx;';
      else if (args.path.endsWith('tutor-audio-client')) contents = `export const audioContext=()=>${bridge}.audio;`;
      else if (args.path.endsWith('tutor-conversation-audio')) contents = `export const startConversationCapture=(options)=>${bridge}.openCapture(options);`;
      else contents = 'export default new Proxy({}, {get:(_,key)=>key});';
      return { contents, loader: 'js' };
    });
  } }],
});
const { default: BelaTutor } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const flush = async () => { for (let i = 0; i < 80; i++) await Promise.resolve(); };
function deferred() { let resolve; const promise = new Promise(yes => { resolve = yes; }); return { promise, resolve }; }
const turn = (id = 'turn-1') => ({ id, userText: 'Pergunta de teste', answer: `Resposta escrita ${id}`, topic: 'Teste', suggestion: '', sourceIds: [], flagged: false, status: 'ready', visualKind: 'none', imageStatus: 'none', createdAt: 1 });
const response = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data, arrayBuffer: async () => new ArrayBuffer(8) });
function nodes(tree) {
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...nodes(tree.props?.children)];
}
function textOf(tree) {
  if (Array.isArray(tree)) return tree.map(textOf).join('');
  if (tree == null || typeof tree === 'boolean') return '';
  return typeof tree === 'object' ? textOf(tree.props?.children) : String(tree);
}
async function mount(t, options = {}) {
  const saved = new Map(['fetch', 'window', 'document', bridgeKey].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const slots = [], captures = [], requests = [], sources = [];
  let cursor = 0, effects = [], scheduled = false, disposed = false, tree;
  let props = { context: { subject: 'matematica', term: 1 }, title: 'Matemática' };
  const schedule = () => { if (scheduled || disposed) return; scheduled = true; queueMicrotask(() => { scheduled = false; if (!disposed) render(); }); };
  const audio = options.noAudio ? null : {
    state: 'running', destination: {}, resumes: 0, closes: 0,
    async resume() { this.resumes++; }, async close() { this.closes++; this.state = 'closed'; },
    async decodeAudioData() { return { duration: 1 }; },
    createBufferSource() {
      const source = { starts: 0, stops: 0, disconnects: 0, onended: null,
        connect() {}, disconnect() { this.disconnects++; }, start() { this.starts++; },
        stop() { this.stops++; this.onended?.(); }, end() { this.onended?.(); } };
      sources.push(source); return source;
    },
  };
  const bridge = {
    audio,
    useState(initial) {
      const index = cursor++;
      if (!slots[index]) slots[index] = { value: typeof initial === 'function' ? initial() : initial };
      return [slots[index].value, value => { if (disposed) return; const next = typeof value === 'function' ? value(slots[index].value) : value; if (!Object.is(next, slots[index].value)) { slots[index].value = next; schedule(); } }];
    },
    useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
    useEffect(callback, deps) {
      const index = cursor++, previous = slots[index];
      if (!previous || !deps || deps.some((dep, i) => !Object.is(dep, previous.deps?.[i]))) {
        slots[index] = { deps, cleanup: previous?.cleanup };
        effects.push(() => { slots[index].cleanup?.(); slots[index].cleanup = callback(); });
      }
    },
    async openCapture(callbacks) {
      const capture = { callbacks, stops: 0, finishes: 0, playback: [],
        stop() { this.stops++; }, finish() { this.finishes++; }, setPlayback(value) { this.playback.push(value); } };
      captures.push(capture);
      if (options.captureGate) await options.captureGate.promise;
      return capture;
    },
  };
  const window = new EventTarget(), document = new EventTarget(); document.hidden = false;
  Object.assign(globalThis, { [bridgeKey]: bridge, window, document, fetch: async (url, init = {}) => {
    const body = init.body ? JSON.parse(init.body) : undefined;
    const request = { url, body, signal: init.signal }; requests.push(request);
    if (!body) return response({ available: true, imagesEnabled: false });
    if (body.action === 'start') return response({ sessionId: `session-${requests.length}` });
    if (body.action === 'turn') return options.turnGate ? options.turnGate.promise : response({ turn: turn(`turn-${requests.filter(r => r.body?.action === 'turn').length}`) });
    if (url === '/api/tutor/voice') return options.voiceFailure ? response({ error: 'Áudio indisponível no teste.' }, 503) : response({});
    throw new Error(`Unexpected synthetic request: ${url}`);
  } });
  function render() { cursor = 0; effects = []; tree = BelaTutor(props); const pending = effects; effects = []; for (const effect of pending) effect(); }
  const h = {
    captures, requests, sources, audio, window, document,
    get text() { return textOf(tree); },
    find(type, label) { const node = nodes(tree).find(node => node.type === type && (node.props['aria-label'] === label || textOf(node) === label)); assert.ok(node, `Missing ${type}: ${label}\n${textOf(tree)}`); return node; },
    async click(label) { const button = this.find('button', label); assert.ok(!button.props.disabled, `Disabled: ${label}`); button.props.onClick(); await flush(); },
    async speak(capture = captures.at(-1)) { capture.callbacks.onSpeechStart(); capture.callbacks.onUtterance('synthetic-audio', 'audio/wav'); await flush(); },
    async sendText(value = 'Quanto é dois mais dois?') { this.find('input', 'Sua pergunta para o tutor').props.onChange({ target: { value } }); await flush(); nodes(tree).find(n => n.type === 'form').props.onSubmit({ preventDefault() {} }); await flush(); },
    async context(context) { props = { ...props, context }; render(); await flush(); },
    unmount() { if (disposed) return; disposed = true; for (const slot of slots) slot.cleanup?.(); },
  };
  t.after(async () => { h.unmount(); await flush(); for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } });
  render(); await flush(); await h.click('Abrir Tutor da Bela'); return h;
}

test('synthetic integration: start, finish, interrupt playback, continue and end use the real session', async t => {
  const h = await mount(t);
  await h.click('● Iniciar conversa por voz');
  const capture = h.captures[0];
  assert.match(h.text, /Ouvindo/);
  await h.click('Enviar minha fala'); assert.equal(capture.finishes, 1);
  await h.speak();
  assert.match(h.text, /Resposta escrita turn-1/); assert.match(h.text, /Falando…/);
  assert.equal(h.sources[0].starts, 1); assert.equal(capture.playback.at(-1), true);
  const staleEnded = h.sources[0].onended;
  await h.click('Interromper e falar');
  assert.equal(h.sources[0].stops, 1); assert.equal(h.sources[0].disconnects, 1);
  assert.equal(capture.playback.at(-1), false); assert.match(h.text, /Ouvindo/);
  staleEnded(); await flush(); assert.match(h.text, /Ouvindo/);
  await h.speak(); h.sources[1].end(); await flush(); assert.match(h.text, /Ouvindo/);
  assert.equal(h.captures.length, 1);
  assert.equal(h.requests.filter(r => r.body?.action === 'start').length, 1);
  await h.click('Encerrar conversa'); assert.equal(capture.stops, 1); assert.equal(capture.callbacks.signal.aborted, true);
  assert.ok(h.find('button', '● Iniciar conversa por voz'));
});

test('synthetic integration: ending during capture permission discards late callbacks and capture', async t => {
  const captureGate = deferred(), h = await mount(t, { captureGate });
  await h.click('● Iniciar conversa por voz'); const capture = h.captures[0];
  await h.click('Encerrar conversa');
  capture.callbacks.onUtterance('late', 'audio/wav'); capture.callbacks.onError(new Error('stale failure'));
  captureGate.resolve(); await flush();
  assert.equal(capture.stops, 1); assert.doesNotMatch(h.text, /stale failure/);
  assert.equal(h.requests.filter(r => r.body).length, 0);
  assert.ok(!h.find('button', '● Iniciar conversa por voz').props.disabled);
});

test('synthetic integration: subject change aborts pending turn and rejects stale results', async t => {
  const turnGate = deferred(), h = await mount(t, { turnGate });
  await h.click('● Iniciar conversa por voz'); await h.speak();
  const old = h.captures[0], request = h.requests.find(r => r.body?.action === 'turn');
  await h.context({ subject: 'historia', term: 2 });
  assert.equal(request.signal.aborted, true); assert.equal(old.stops, 1);
  turnGate.resolve(response({ turn: turn('stale-subject') })); await flush();
  old.callbacks.onSpeechStart(); old.callbacks.onError(new Error('old subject error')); await flush();
  assert.doesNotMatch(h.text, /stale-subject|old subject error/); assert.equal(h.sources.length, 0);
  await h.click('● Iniciar conversa por voz'); await h.speak();
  assert.deepEqual(h.requests.filter(r => r.body?.action === 'start').at(-1).body.context, { subject: 'historia', term: 2 });
});

test('synthetic integration: offline, pagehide and hidden document release active voice and playback', async t => {
  const h = await mount(t);
  for (const event of ['offline', 'pagehide', 'visibilitychange']) {
    await h.click('● Iniciar conversa por voz'); await h.speak();
    const capture = h.captures.at(-1), source = h.sources.at(-1);
    if (event === 'visibilitychange') { h.document.hidden = true; h.document.dispatchEvent(new Event(event)); }
    else h.window.dispatchEvent(new Event(event));
    await flush();
    assert.equal(capture.stops, 1, event); assert.equal(source.stops, 1, event);
    assert.equal(capture.callbacks.signal.aborted, true, event);
    assert.ok(!h.find('button', '● Iniciar conversa por voz').props.disabled);
    if (event === 'offline') assert.match(h.text, /A conexão caiu/);
  }
});

test('synthetic integration: voice audio failure preserves the written answer and enables text', async t => {
  const h = await mount(t, { voiceFailure: true });
  await h.click('● Iniciar conversa por voz'); await h.speak();
  assert.match(h.text, /Resposta escrita turn-1/); assert.match(h.text, /Áudio indisponível no teste/);
  assert.equal(h.captures[0].stops, 1); assert.equal(h.sources.length, 0);
  assert.ok(!h.find('input', 'Sua pergunta para o tutor').props.disabled);
  await h.sendText();
  assert.match(h.text, /Resposta escrita turn-1/); assert.match(h.text, /Resposta escrita turn-2/);
  assert.equal(h.requests.filter(r => r.body?.action === 'turn').at(-1).body.text, 'Quanto é dois mais dois?');
});

test('synthetic integration: absent WebAudio does not prevent written questions or answers', async t => {
  const h = await mount(t, { noAudio: true });
  await h.click('● Iniciar conversa por voz');
  assert.match(h.text, /Este navegador não oferece o áudio necessário/); assert.equal(h.captures.length, 0);
  await h.sendText('Pergunta sem WebAudio');
  assert.match(h.text, /Resposta escrita turn-1/);
  assert.equal(h.requests.find(r => r.body?.action === 'turn').body.text, 'Pergunta sem WebAudio');
  assert.ok(!h.find('input', 'Sua pergunta para o tutor').props.disabled);
  await h.sendText('Segunda pergunta'); assert.match(h.text, /Resposta escrita turn-2/);
});

test('synthetic integration: unmount closes audio and makes late capture callbacks inert', async t => {
  const h = await mount(t);
  await h.click('● Iniciar conversa por voz'); await h.speak();
  const capture = h.captures[0], source = h.sources[0], before = h.requests.length;
  h.unmount(); await flush();
  assert.equal(capture.stops, 1); assert.equal(source.stops, 1); assert.equal(h.audio.closes, 1);
  capture.callbacks.onUtterance('late', 'audio/wav'); capture.callbacks.onError(new Error('late'));
  h.window.dispatchEvent(new Event('offline')); await flush(); assert.equal(h.requests.length, before);
});
