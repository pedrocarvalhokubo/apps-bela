import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const dir=mkdtempSync(join(tmpdir(),'bela-provider-'));
await build({entryPoints:['lib/tutor-provider.ts'],outfile:join(dir,'provider.mjs'),bundle:true,platform:'node',format:'esm',logLevel:'silent',plugins:[{name:'test-websocket',setup(b){b.onResolve({filter:/^ws$/},()=>({path:'ws',namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:`import {EventEmitter} from 'node:events';export default class WS extends EventEmitter{constructor(url,options){super();globalThis.__voiceEvents=[{url,options}];if(globalThis.__voiceScenario!=='no-session')queueMicrotask(()=>this.emit('message',JSON.stringify({type:'session.created'})));}send(raw){const e=JSON.parse(raw);globalThis.__voiceEvents.push(e);if(e.type==='session.update')queueMicrotask(()=>this.emit('message',JSON.stringify({type:'session.updated'})));if(e.type==='response.create'&&globalThis.__voiceScenario==='rate-limit'){queueMicrotask(()=>this.emit('message',JSON.stringify({type:'error',error:{code:'rate_limit_exceeded'}})));return;}if(e.type==='response.create')queueMicrotask(()=>{this.emit('message',JSON.stringify({type:'response.output_audio.delta',delta:'AAA='}));this.emit('message',JSON.stringify({type:'response.output_audio_transcript.done',transcript:globalThis.__spoken}));this.emit('message',JSON.stringify({type:'response.done',response:{status:'completed'}}));});}close(){this.emit('close');}terminate(){globalThis.__voiceTerminated=true;this.emit('close');}}` }));}}]});
const provider=await import(pathToFileURL(join(dir,'provider.mjs')).href),originalFetch=globalThis.fetch;
let captured=[],response={};
globalThis.fetch=async(url,options)=>{captured.push({url,options});return Response.json(response);};
function completed(value){response={status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}]};}
const key='sk-'+ 'fixture'.repeat(8);
test('OpenAI request contracts and defensive parsing (mock transport)',async t=>{
 try{
 await t.test('moderation must return an explicit boolean decision',async()=>{response={results:[{}]};await assert.rejects(provider.moderate(key,'example'));response={results:[{flagged:false}]};assert.equal(await provider.moderate(key,'example'),false);});
 await t.test('Responses use Terra, strict schemas, store:false and only provided context',async()=>{
  const answer={allowed:true,safety:false,answer:'Exemplo breve.',topic:'Migração',suggestion:'Retome a ideia.',sourceIds:['geography-3'],visualKind:'none',visualPrompt:''};completed(answer);
  const input={instructions:'Fixed rules',source:'Curated source',context:{subject:'geography'},history:[],text:'Question',safetyIdentifier:'opaque-id'};assert.deepEqual(await provider.explain(key,input),answer);
  let body=JSON.parse(captured.at(-1).options.body);assert.equal(body.model,'gpt-6.1-terra');assert.equal(body.store,false);assert.equal(body.safety_identifier,'opaque-id');assert.equal(body.text.format.strict,true);assert.match(body.instructions,/Curated source/);assert.equal(body.tools,undefined);
  completed({...answer,topic:{malformed:true}});await assert.rejects(provider.explain(key,input));response={status:'incomplete',output:[]};await assert.rejects(provider.explain(key,input));
 });
 await t.test('review permits curricular enrichment and receives follow-up context',async()=>{
  completed({approved:true});const history=[{role:'user',content:'O que é migração?'},{role:'assistant',content:'É mudar de um lugar para outro.'}];
  assert.equal(await provider.verifyAnswer(key,'Fonte curricular',{subject:'geography'},'E por quê?',{},history),true);
  const body=JSON.parse(captured.at(-1).options.body);assert.deepEqual(JSON.parse(body.input).history,history);assert.match(body.instructions,/conhecimento geral confiável/);assert.match(body.instructions,/ausência de uma palavra na fonte não é motivo de rejeição/);assert.match(body.instructions,/pesquisas inventadas/);
 });
 await t.test('model diagnostics use metadata only and do not claim generation or ZDR readiness',async()=>{
  const before=captured.length;response={};const results=await provider.checkModelAccess(key);assert.equal(results.length,5);assert.ok(results.every(r=>r.available));assert.ok(results.some(r=>r.model==='gpt-live-1'));
  for(const call of captured.slice(before)){assert.equal(call.options.method,'GET');assert.equal(call.options.body,undefined);assert.match(call.url,/\/models\//);}
 });
 await t.test('unsupported or oversized audio is rejected before transmission',async()=>{
  const before=captured.length;await assert.rejects(provider.transcribe(key,'A'.repeat(200),'audio/ogg'));await assert.rejects(provider.transcribe(key,'A'.repeat(4_200_004),'audio/webm'));assert.equal(captured.length,before);
  response={text:'Pergunta transcrita.'};assert.equal(await provider.transcribe(key,'A'.repeat(200),'audio/mp4'),'Pergunta transcrita.');const form=captured.at(-1).options.body;assert.equal(form.get('model'),'gpt-transcribe');assert.equal(form.get('file').name,'question.mp4');assert.equal(captured.at(-1).options.headers['content-type'],undefined);
 });
 await t.test('visual generation requests PNG, then independent visual review uses image input',async()=>{
  response={data:[{b64_json:Buffer.from('89504e470d0a1a0a','hex').toString('base64')}]};const bytes=await provider.generateVisual(key,'Título e conceitos.','infographic');let body=JSON.parse(captured.at(-1).options.body);assert.equal(body.model,'gpt-image-2.5-flare');assert.equal(body.output_format,'png');assert.equal(body.size,'1024x1536');
  completed({approved:true});assert.equal(await provider.reviewVisual(key,'Roteiro',bytes),true);body=JSON.parse(captured.at(-1).options.body);assert.equal(body.store,false);assert.match(body.input[0].content[1].image_url,/^data:image\/png;base64,/);
 });
 await t.test('voice follows the Realtime WebSocket protocol and returns validated WAV',async()=>{
  globalThis.__spoken='Uma ideia de cada vez.';const wav=await provider.speak(key,'Uma ideia de cada vez.','opaque');assert.equal(wav.subarray(0,4).toString(),'RIFF');assert.equal(wav.readUInt32LE(24),24000);assert.equal(wav.readUInt16LE(22),1);
  const events=globalThis.__voiceEvents;assert.match(events[0].url,/gpt-realtime-2.1-mini/);assert.equal(events[0].options.headers['OpenAI-Safety-Identifier'],'opaque');assert.equal(events[1].session.audio.output.voice,'marin');assert.equal(events[2].response.conversation,'none');assert.equal(events[1].session.audio.input.turn_detection,null);assert.equal(events[2].response.input[0].content[0].text,'Uma ideia de cada vez.');
  globalThis.__spoken='Texto extra que não foi aprovado.';completed({faithful:false});await assert.rejects(provider.speak(key,'Texto autorizado.','opaque'),error=>error instanceof provider.SpeechError&&error.details.code==='review_failed');
  const abort=new AbortController();abort.abort();await assert.rejects(provider.speak(key,'Texto sintético.','opaque',abort.signal),error=>error.name==='AbortError');
 });
 await t.test('cancelling in-flight speech closes the socket and reports metadata only',async()=>{
  globalThis.__voiceScenario='no-session';globalThis.__voiceTerminated=false;const abort=new AbortController();const promise=provider.speak(key,'Synthetic text not for logs.','opaque',abort.signal);abort.abort();
  await assert.rejects(promise,error=>{assert.equal(error.details.code,'cancelled');assert.equal(error.details.status,499);assert.ok(!JSON.stringify(error.details).includes('Synthetic text'));assert.ok(!JSON.stringify(error.details).includes(key));return true;});assert.equal(globalThis.__voiceTerminated,true);delete globalThis.__voiceScenario;
 });
 await t.test('speech fidelity review shares the absolute two-minute deadline',async context=>{
  let clockCalls=0;context.mock.method(Date,'now',()=>clockCalls++===0?1000:101000);
  const timeoutBudgets=[];context.mock.method(AbortSignal,'timeout',ms=>{timeoutBudgets.push(ms);return new AbortController().signal;});
  globalThis.__spoken='Três lados.';completed({faithful:true});await provider.speak(key,'3 lados.','opaque');
  assert.deepEqual(timeoutBudgets,[20000]);
 });
 await t.test('an exhausted total deadline cannot start an additional review request',async context=>{
  let clockCalls=0;context.mock.method(Date,'now',()=>clockCalls++===0?1000:121000);
  globalThis.__spoken='Três lados.';const before=captured.length;
  await assert.rejects(provider.speak(key,'3 lados.','opaque'),error=>error.details.code==='total_timeout'&&error.status===504);assert.equal(captured.length,before);
 });
 await t.test('silent sockets fail in the connection phase, not an opaque minute later',async context=>{
  context.mock.timers.enable({apis:['setTimeout','Date'],now:1000});globalThis.__voiceScenario='no-session';
  try{const promise=provider.speak(key,'Synthetic.','opaque');context.mock.timers.tick(15001);await assert.rejects(promise,error=>error.details.stage==='connecting'&&error.details.code==='phase_timeout'&&error.details.elapsedMs===15001);}finally{delete globalThis.__voiceScenario;context.mock.timers.reset();}
 });
 await t.test('Realtime rate limits remain distinguishable without upstream text',async()=>{
  globalThis.__voiceScenario='rate-limit';try{await assert.rejects(provider.speak(key,'Synthetic.','opaque'),error=>error.details.code==='provider_error'&&error.status===429);}finally{delete globalThis.__voiceScenario;}
 });
 await t.test('conversation cancellation reaches transcription, moderation, answer and review requests',async()=>{
  const mockFetch=globalThis.fetch;
  try{
   for(const operation of [
    signal=>provider.transcribe(key,'A'.repeat(200),'audio/wav',signal),
    signal=>provider.moderate(key,'Synthetic question.',signal),
    signal=>provider.explain(key,{instructions:'Rules',source:'Source',context:{},history:[],text:'Synthetic.',safetyIdentifier:'opaque'},signal),
    signal=>provider.verifyAnswer(key,'Source',{},'Synthetic.',{},[],signal),
   ]){
    const control=new AbortController();let received;
    globalThis.fetch=async(_url,options)=>new Promise((_resolve,reject)=>{received=options.signal;options.signal.addEventListener('abort',()=>reject(options.signal.reason),{once:true});});
    const pending=operation(control.signal);assert.ok(received instanceof AbortSignal);control.abort();
    await assert.rejects(pending,error=>error.name==='AbortError');assert.equal(received.aborted,true);
   }
  }finally{globalThis.fetch=mockFetch;}
 });
 await t.test('provider failures never echo keys or upstream bodies',async()=>{
  assert.match(provider.providerMessage(new provider.ProviderError(404),'voz'),/serviço de voz/);assert.match(provider.providerMessage(new provider.ProviderError(429),'voz'),/saldo/);
  globalThis.fetch=async()=>new Response('sensitive upstream body',{status:401});const diagnostics=await provider.checkModelAccess(key);assert.ok(diagnostics.every(item=>!item.available&&item.status===401));assert.ok(!JSON.stringify(diagnostics).includes(key));await assert.rejects(provider.validateKey(key),error=>error.status===401&&!error.message.includes(key)&&!error.message.includes('sensitive'));
 });
 }finally{globalThis.fetch=originalFetch;delete globalThis.__voiceEvents;delete globalThis.__spoken;delete globalThis.__voiceScenario;delete globalThis.__voiceTerminated;rmSync(dir,{recursive:true,force:true});}
});
