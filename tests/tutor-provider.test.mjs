import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const dir=mkdtempSync(join(tmpdir(),'bela-provider-'));
await build({entryPoints:['lib/tutor-provider.ts'],outfile:join(dir,'provider.mjs'),bundle:true,platform:'node',format:'esm',logLevel:'silent',plugins:[{name:'test-websocket',setup(b){b.onResolve({filter:/^ws$/},()=>({path:'ws',namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:`import {EventEmitter} from 'node:events';export default class WS extends EventEmitter{constructor(url,options){super();globalThis.__voiceEvents=[{url,options}];queueMicrotask(()=>this.emit('message',JSON.stringify({type:'session.created'})));}send(raw){const e=JSON.parse(raw);globalThis.__voiceEvents.push(e);if(e.type==='session.update')queueMicrotask(()=>this.emit('message',JSON.stringify({type:'session.updated'})));if(e.type==='response.create')queueMicrotask(()=>{this.emit('message',JSON.stringify({type:'response.output_audio.delta',delta:'AAA='}));this.emit('message',JSON.stringify({type:'response.output_audio_transcript.done',transcript:globalThis.__spoken}));this.emit('message',JSON.stringify({type:'response.done',response:{status:'completed'}}));});}close(){this.emit('close');}}` }));}}]});
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
  const events=globalThis.__voiceEvents;assert.match(events[0].url,/gpt-realtime-2.1-mini/);assert.equal(events[0].options.headers['OpenAI-Safety-Identifier'],'opaque');assert.equal(events[1].session.audio.output.voice,'marin');assert.equal(events[2].response.conversation,'none');assert.deepEqual(events[2].response.input,[]);
  globalThis.__spoken='Texto extra que não foi aprovado.';completed({faithful:false});await assert.rejects(provider.speak(key,'Texto autorizado.','opaque'),/review/);
 });
 await t.test('provider failures never echo keys or upstream bodies',async()=>{
  globalThis.fetch=async()=>new Response('sensitive upstream body',{status:401});await assert.rejects(provider.validateKey(key),error=>error.status===401&&!error.message.includes(key)&&!error.message.includes('sensitive'));
 });
 }finally{globalThis.fetch=originalFetch;delete globalThis.__voiceEvents;delete globalThis.__spoken;rmSync(dir,{recursive:true,force:true});}
});
