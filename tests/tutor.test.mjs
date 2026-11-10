import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomUUID,randomBytes} from 'node:crypto';
const root=mkdtempSync(join(tmpdir(),'bela-tutor-tests-'));
process.env.DB_PATH=join(root,'bela.sqlite');process.env.RAILWAY_ENVIRONMENT_ID='';process.env.RAILWAY_VOLUME_MOUNT_PATH='';process.env.BELA_TUTOR_ENCRYPTION_KEY=randomBytes(32).toString('hex');
let calls=[],answerPatch={},review=true,visualReview=true;
globalThis.__liveSockets=[];
const sample={allowed:true,safety:false,answer:'Uma mudança dentro do mesmo país é uma migração interna. Que pista ajuda você a perceber isso?',topic:'Migração interna',suggestion:'Comparar duas mudanças e identificar as fronteiras.',sourceIds:['geography-3'],visualKind:'none',visualPrompt:''};
globalThis.__tutorMock={
 apiFetch:async(path,_key,body)=>{calls.push(['live-create',path,body]);return Response.json({session:{id:'live_fixture_'+randomUUID()},transport:{sdp:'v=0 synthetic answer'}});},
 validateKey:async key=>{calls.push(['validateKey',key]);},
 moderate:async(_key,text)=>text==='unsafe fixture',
 transcribe:async()=>{calls.push(['transcribe']);return 'Quero entender migração interna.';},
 explain:async(_key,input)=>{calls.push(['explain',input]);return {...sample,...answerPatch};},
 verifyAnswer:async(...args)=>{calls.push(['review',...args.slice(1)]);return review;},
 providerMessage:()=> 'Falha de conexão com a API.',
 speechFailureDetails:()=>({stage:'test',code:'synthetic'}),
 checkModelAccess:async()=>{calls.push(['diagnose']);return [{feature:'text',model:'gpt-6.1-terra',available:true,status:200}];},
 generateVisual:async()=>{calls.push(['image']);return Buffer.from('89504e470d0a1a0a','hex');},
 reviewVisual:async()=>visualReview,
 speak:async(_key,text,identifier)=>{calls.push(['speak',text,identifier]);return Buffer.from('RIFF fixture WAVE');},
 structuredReply:async(_key,instructions,input)=>{calls.push(['prompt',instructions,input]);return {prompt:'Explique uma ideia por vez e use exemplos novos.',summary:'Frases curtas e exemplos variados.'};}
};
await build({stdin:{contents:`export * as tutor from './app/api/tutor/route';export * as live from './app/api/tutor/live/route';export * as liveService from './lib/tutor-live';export * as parent from './app/api/tutor/parent/route';export * as image from './app/api/tutor/image/route';export * as voice from './app/api/tutor/voice/route';export * as media from './app/api/tutor/media/route';export * as security from './lib/tutor-security';export * as store from './lib/tutor-store';export * as content from './lib/tutor-content';export {getD1 as getDB,sha256} from './app/api/_lib';`,resolveDir:process.cwd()},outfile:join(root,'api.mjs'),bundle:true,platform:'node',format:'esm',packages:'external',logLevel:'silent',plugins:[{name:'controlled-provider',setup(b){b.onResolve({filter:/^ws$/},()=>({path:'ws',namespace:'loopback'}));b.onLoad({filter:/.*/,namespace:'loopback'},()=>({contents:`import {EventEmitter} from 'node:events';export default class WS extends EventEmitter {static OPEN=1;readyState=0;commands=[];constructor(url,options){super();this.url=url;this.options=options;globalThis.__liveSockets.push(this);queueMicrotask(()=>{this.readyState=1;this.emit('open');});}send(raw){const event=JSON.parse(raw);this.commands.push(event);if(event.type==='session.close')queueMicrotask(()=>this.emit('message',JSON.stringify({type:'session.closed',usage:{seconds:3}})));}close(){this.readyState=3;this.emit('close');}terminate(){this.close();}}`,loader:'js'}));b.onLoad({filter:/lib\/tutor-provider\.ts$/},()=>({contents:`export const tutorModels={text:'gpt-6.1-terra',speech:'fixture',image:'fixture',transcription:'fixture'};export class ProviderError extends Error{};${Object.keys(globalThis.__tutorMock).map(name=>`export const ${name}=(...args)=>globalThis.__tutorMock.${name}(...args);`).join('\n')}`,loader:'js'}));}}]});
const api=await import(pathToFileURL(join(root,'api.mjs')).href),db=await api.getDB();
const token='ab'.repeat(24),parentToken='parent-fixture',foreign='cd'.repeat(24),key='sk-'+ 'testonly'.repeat(8),profile='bela-account-v2';
await db.prepare('INSERT INTO profiles(id,name,created_at) VALUES(?,?,?)').bind(profile,'Test fixture',Date.now()).run();
await db.prepare('INSERT INTO profiles(id,name,created_at) VALUES(?,?,?)').bind('foreign-profile','Fixture',Date.now()).run();
await db.prepare('INSERT INTO login_sessions VALUES(?,?,?,?)').bind(await api.sha256(token),profile,Date.now()+1e6,Date.now()).run();
await db.prepare('INSERT INTO login_sessions VALUES(?,?,?,?)').bind(await api.sha256(foreign),'foreign-profile',Date.now()+1e6,Date.now()).run();
await db.prepare('INSERT INTO parent_sessions(token_hash,profile_id,expires_at,created_at) VALUES(?,?,?,?)').bind(await api.sha256(parentToken),profile,Date.now()+1e6,Date.now()).run();
function req(body,cookie=token,parent=false,path=''){
 return new Request('https://bela.test/api/tutor'+path,{method:body?'POST':'GET',headers:{host:'bela.test',origin:'https://bela.test','content-type':'application/json',...(cookie?{cookie:'bela-session-v2='+cookie}:{}),...(parent?{'x-bela-parent-token':parentToken}:{})},body:body?JSON.stringify(body):undefined});
}
async function post(route,body,cookie=token,parent=false){const r=await route.POST(req(body,cookie,parent));return {status:r.status,data:await r.json()};}
const config={action:'save',enabled:false,zdrConfirmed:false,imagesEnabled:true,dailyTurns:40,dailyImages:3};
async function newSession(context={subject:'geography',term:3,view:'study'}){return (await post(api.tutor,{action:'start',context})).data.sessionId;}
async function turn(sessionId,text='Explique com um exemplo diferente.',requestId=randomUUID()){
 await db.prepare('UPDATE tutor_turns SET created_at=?').bind(Date.now()-120000).run();
 return post(api.tutor,{action:'turn',sessionId,requestId,text});
}
test('Tutor authorization, encrypted settings, curation and durable conversations',async t=>{
 try{
 await t.test('guests and other profiles have no tutor access or AI spend',async()=>{
  const count=calls.length;
  for(const route of [api.tutor,api.parent,api.image,api.voice,api.live])for(const cookie of [null,foreign])assert.equal((await post(route,{action:'read'},cookie,true)).status,401);
  assert.equal((await api.media.GET(req(null,null,false,'/media?id='+randomUUID()))).status,401);
  assert.equal((await post(api.parent,{action:'read'})).status,401);assert.equal(calls.length,count);
 });
 await t.test('key is encrypted, redacted and activation requires ZDR attestation',async()=>{
  assert.equal((await post(api.tutor,{action:'start',context:{subject:'geography',term:3}})).status,503);
  assert.equal((await post(api.parent,{...config,apiKey:key},token,true)).status,200);
  const saved=await api.store.settings(profile);assert.notEqual(saved.encrypted_key,key);assert.equal(api.security.openKey(saved.encrypted_key),key);
  const read=await post(api.parent,{action:'read'},token,true);assert.equal(read.data.settings.keyConfigured,true);assert.ok(!JSON.stringify(read.data).includes(key));assert.ok(!JSON.stringify(read.data).includes(saved.encrypted_key));
  assert.equal((await post(api.parent,{...config,enabled:true},token,true)).status,400);
  const beforeVoice=calls.length;assert.equal((await post(api.parent,{action:'testVoice'})).status,401);assert.equal(calls.length,beforeVoice);
  assert.equal((await api.parent.POST(req({action:'testVoice'},token,true))).status,200);
  const voiceCall=calls.filter(c=>c[0]==='speak').at(-1);assert.equal(voiceCall[1],'Esta é uma frase de teste do tutor. Um triângulo tem três lados.');assert.ok(!voiceCall[2].includes(profile));

  const beforePrompt=calls.length;assert.equal((await post(api.parent,{action:'suggestPrompt',prompt:'',instruction:'Use exemplos.'},token,true)).status,403);assert.equal(calls.length,beforePrompt);
  assert.equal((await post(api.parent,{...config,enabled:true,zdrConfirmed:true},token,true)).status,200);
  assert.equal((await api.tutor.GET(req())).status,200);
  const modified=saved.encrypted_key.split('.');modified[2]=(modified[2][0]==='A'?'B':'A')+modified[2].slice(1);assert.throws(()=>api.security.openKey(modified.join('.')));
 });
 await t.test('model diagnostics stay PIN-protected and send no child data',async()=>{
  const before=calls.length;assert.equal((await post(api.parent,{action:'diagnose'})).status,401);assert.equal(calls.length,before);
  const originalNow=Date.now;Date.now=()=>originalNow()+11000;const result=await post(api.parent,{action:'diagnose'},token,true);Date.now=originalNow;assert.equal(result.status,200);assert.equal(result.data.models[0].available,true);assert.equal(result.data.privacyVerified,false);assert.match(result.data.note,/Não comprova/);assert.equal(JSON.stringify(result.data).includes(key),false);
 });
 await t.test('spend reports require the parent PIN and expose only this account metering',async()=>{
  assert.equal((await post(api.parent,{action:'costs'})).status,401);
  assert.equal((await post(api.parent,{action:'costs'},foreign,true)).status,401);
  const report=await post(api.parent,{action:'costs'},token,true);assert.equal(report.status,200);assert.equal(report.data.basis,'estimate');assert.equal(report.data.currency,'USD');assert.ok(!JSON.stringify(report.data).includes(key));assert.equal(report.data.turns,undefined);
 });
 await t.test('prompt suggestions are drafts; saves create reviewable versions',async()=>{
  const originalNow=Date.now;Date.now=()=>originalNow()+22000;
  const suggestion=await post(api.parent,{action:'suggestPrompt',prompt:'',instruction:'Use frases menores.'},token,true);Date.now=originalNow;assert.equal(suggestion.status,200);
  assert.equal((await api.store.settings(profile)).custom_prompt,'');
  assert.equal((await post(api.parent,{action:'savePrompt',prompt:suggestion.data.prompt},token,true)).status,200);
  const read=await post(api.parent,{action:'read'},token,true);assert.equal(read.data.versions.length,1);assert.equal(read.data.settings.customPrompt,suggestion.data.prompt);
  assert.match(calls.find(c=>c[0]==='prompt')[1],/apenas Bela autenticada/);
 });
 await t.test('only catalog modules and lessons resolve, with no assessment answers in source',()=>{
  assert.equal(api.content.resolveTutorContext({subject:'arbitrary',term:3}),null);
  assert.equal(api.content.resolveTutorContext({subject:'geography',term:3,lessonId:'e3-verbs'}),null);
  assert.equal(api.content.tutorCatalog.length,10);assert.equal(api.content.tutorCatalog.reduce((sum,m)=>sum+m.lessons.length,0),70);
  for(const m of api.content.tutorCatalog){const source=api.content.tutorSource(api.content.resolveTutorContext({subject:m.subject,term:m.term,view:'quiz'}));assert.ok(source.content.includes(m.id));assert.ok(!source.content.includes('Referência do curador'));assert.ok(!source.content.includes('undefined'));for(const lesson of m.lessons)assert.ok(source.content.includes(lesson.id));}
 });
 await t.test('turns are scoped, saved once and exposed to PIN-protected history',async()=>{
  const session=await newSession(),id=randomUUID();const first=await turn(session,'O que muda dentro do mesmo país?',id);assert.equal(first.status,200);assert.equal(first.data.turn.answer,sample.answer);
  const before=calls.filter(c=>c[0]==='explain').length;assert.equal((await turn(session,'different payload',id)).data.turn.answer,sample.answer);assert.equal(calls.filter(c=>c[0]==='explain').length,before);
  const input=calls.find(c=>c[0]==='explain')[1];assert.match(input.instructions,/Explique uma ideia por vez/);assert.equal(input.context.subject,'geography');assert.ok(!input.source.includes('Referência do curador'));
  const history=await post(api.parent,{action:'conversation',sessionId:session},token,true);assert.equal(history.data.turns.length,1);assert.ok(!JSON.stringify(history.data).includes('visual_prompt'));
  assert.equal((await post(api.tutor,{action:'turn',sessionId:session,requestId:randomUUID(),text:'hello'},foreign)).status,401);
  assert.equal((await turn(randomUUID())).status,409);
 });
 await t.test('review receives conversation history for short follow-up questions',async()=>{
  const session=await newSession();await turn(session,'O que é migração?');await turn(session,'E por quê?');
  const reviewCall=calls.filter(c=>c[0]==='review').at(-1);assert.equal(reviewCall[3],'E por quê?');assert.equal(reviewCall[5].length,2);assert.equal(reviewCall[5][0].content,'O que é migração?');
  const source=api.content.tutorSource(api.content.resolveTutorContext({subject:'geography',term:3}));assert.match(source.instructions,/conhecimento geral confiável/);assert.match(source.instructions,/não um limite de palavras/);assert.match(source.instructions,/não tem navegação/);
 });
 await t.test('ending voice during transcription cancels provider work and never publishes a stale turn',async()=>{
  const sessionId=await newSession(),requestId=randomUUID(),control=new AbortController(),previous=globalThis.__tutorMock.transcribe;
  await db.prepare('UPDATE tutor_turns SET created_at=?').bind(Date.now()-120000).run();
  const before=calls.filter(call=>call[0]==='explain').length;
  globalThis.__tutorMock.transcribe=async(_key,_audio,_mime,signal)=>{assert.ok(signal instanceof AbortSignal);control.abort();signal.throwIfAborted();};
  try{
   const request=new Request(req({action:'turn',sessionId,requestId,audio:'A'.repeat(200),mime:'audio/wav'}),{signal:control.signal});
   const result=await api.tutor.POST(request);assert.equal(result.status,499);
   assert.equal((await api.store.turnFor(profile,requestId)).status,'failed');
   assert.equal(calls.filter(call=>call[0]==='explain').length,before);
  }finally{globalThis.__tutorMock.transcribe=previous;}
 });
 await t.test('a late review cannot publish a response after the client interrupted it',async()=>{
  const sessionId=await newSession(),requestId=randomUUID(),control=new AbortController(),previous=globalThis.__tutorMock.verifyAnswer;
  await db.prepare('UPDATE tutor_turns SET created_at=?').bind(Date.now()-120000).run();
  globalThis.__tutorMock.verifyAnswer=async(...args)=>{assert.ok(args.at(-1) instanceof AbortSignal);control.abort();return true;};
  try{
   const request=new Request(req({action:'turn',sessionId,requestId,text:'Pergunta sintética.'}),{signal:control.signal});
   assert.equal((await api.tutor.POST(request)).status,499);const saved=await api.store.turnFor(profile,requestId);assert.equal(saved.status,'failed');assert.equal(saved.answer,'');
  }finally{globalThis.__tutorMock.verifyAnswer=previous;}
 });
 await t.test('unknown sources and failed independent review do not escape the module',async()=>{
  const session=await newSession();answerPatch={sourceIds:['science-3']};let r=await turn(session);assert.match(r.data.turn.answer,/apoio suficiente/);
  answerPatch={allowed:false,visualKind:'image',visualPrompt:'Unrelated'};r=await turn(session);assert.match(r.data.turn.answer,/Geografia/);assert.equal(r.data.turn.visualKind,'none');
  answerPatch={};review=false;r=await turn(session);assert.match(r.data.turn.answer,/explicar isso com cuidado/);review=true;
  r=await turn(session,'unsafe fixture');assert.equal(r.data.turn.flagged,true);assert.match(r.data.turn.answer,/adulto/);
 });
 await t.test('private images and audio are owned, reviewed, budgeted and cached',async()=>{
  answerPatch={visualKind:'infographic',visualPrompt:'Migração interna e externa. Exemplo fictício.'};const session=await newSession(),r=await turn(session,'Crie um infográfico.'),id=r.data.turn.id;
  assert.equal((await post(api.image,{turnId:id})).status,200);const imageCount=calls.filter(c=>c[0]==='image').length;assert.equal((await post(api.image,{turnId:id})).status,200);assert.equal(calls.filter(c=>c[0]==='image').length,imageCount);
  let media=await api.media.GET(req(null,token,false,'/media?id='+id+'&kind=image'));assert.equal(media.status,200);assert.equal(media.headers.get('content-type'),'image/png');assert.match(media.headers.get('cache-control'),/private, no-store/);
  assert.equal((await api.media.GET(req(null,foreign,false,'/media?id='+id+'&kind=image'))).status,401);
  assert.equal((await api.voice.POST(req({turnId:id}))).status,200);assert.equal((await api.voice.POST(req({turnId:id}))).status,200);assert.equal(calls.filter(c=>c[0]==='speak'&&c[1]===sample.answer).length,1);
  visualReview=false;const rejected=await turn(session,'Crie outro infográfico.');assert.equal((await post(api.image,{turnId:rejected.data.turn.id})).status,502);assert.equal((await api.media.GET(req(null,token,false,'/media?id='+rejected.data.turn.id))).status,404);visualReview=true;answerPatch={};
 });
 await t.test('a speech budget database failure releases the in-flight lock',async()=>{
  const session=await newSession(),result=await turn(session,'Explique uma ideia.');const id=result.data.turn.id;
  await db.prepare("CREATE TEMP TRIGGER fail_speech_budget BEFORE INSERT ON tutor_speech_requests BEGIN SELECT RAISE(FAIL, 'synthetic budget failure'); END").run();
  try{assert.equal((await post(api.voice,{turnId:id})).status,502);}finally{await db.prepare('DROP TRIGGER fail_speech_budget').run();}
  assert.equal((await api.voice.POST(req({turnId:id}))).status,200);
 });
 await t.test('native voice configuration keeps the project key and instruction controls on the server',async()=>{
  const config=api.liveService.liveConfiguration({subject:'geography',term:3,view:'quiz'},'Frases curtas.');
  assert.equal(config.model,'gpt-live-1');assert.equal(config.store,false);assert.equal(config.delegation.type,'client');
  assert.deepEqual(config.client.data_channel.allowed_client_events,['session.close','session.input_audio.mute','session.input_audio.unmute']);
  assert.match(config.instructions,/Generate <\|SpawnThinking\|>/);assert.match(config.instructions,/só dê pistas/);assert.match(config.instructions,/Geografia/);
  assert.throws(()=>api.liveService.liveConfiguration({subject:'unknown',term:3},''));
  assert.equal((await post(api.live,{action:'start',sdp:'invalid',context:{subject:'geography',term:3}})).status,400);
  assert.equal((await post(api.live,{action:'start',sdp:'v=0 fixture',context:{subject:'unknown',term:3}})).status,400);
 });
 await t.test('native voice persists server-observed captions and delegates only through the authenticated tutor',async()=>{
  const first=await post(api.live,{action:'start',sdp:'v=0 fixture',context:{subject:'geography',term:3}});assert.equal(first.status,200);assert.equal(first.data.model,'gpt-live-1');
  assert.ok(!JSON.stringify(first.data).includes(key));assert.ok(!JSON.stringify(first.data).includes('instructions'));
  const sessionId=first.data.sessionId,socket=globalThis.__liveSockets.at(-1);
  const send=event=>socket.emit('message',JSON.stringify(event));
  send({type:'session.input_transcript.delta',event_id:'input-1',delta:'O que é migração?',start_ms:100,end_ms:1000});
  send({type:'session.output_transcript.delta',event_id:'output-1',delta:'Vamos pensar juntos.',start_ms:900,end_ms:1500});
  send({type:'session.delegation.created',offset_ms:1100,delegation:{id:'delegate-1',target:'client'}});
  await new Promise(resolve=>setTimeout(resolve,20));
  assert.ok(socket.commands.some(event=>event.type==='session.commentary.append'&&event.delegation_id==='delegate-1'&&event.content.includes(sample.answer)));
  assert.equal((await post(api.live,{action:'status',sessionId},foreign)).status,401);
  const status=await post(api.live,{action:'status',sessionId});assert.equal(status.data.events.length,2);
  assert.equal(status.data.events[0].text,'O que é migração?');
  const parent=await post(api.parent,{action:'conversation',sessionId},token,true);assert.equal(parent.data.liveTranscripts.length,2);
  await post(api.live,{action:'interrupt',sessionId});assert.ok(socket.commands.some(event=>event.type==='session.instructions.append'));
  await post(api.live,{action:'stop',sessionId});await new Promise(resolve=>setTimeout(resolve,10));
  assert.equal((await post(api.live,{action:'status',sessionId})).data.state,'closed');
  const saved=await db.prepare('SELECT reserved_seconds,used_seconds FROM tutor_live_sessions WHERE id=?').bind(sessionId).first();assert.equal(saved.reserved_seconds,3);assert.equal(saved.used_seconds,3);
 });
 await t.test('parents control daily live minutes and exhausted voice cannot open another provider session',async()=>{
  assert.equal((await post(api.parent,{...config,enabled:true,zdrConfirmed:true,dailyVoiceMinutes:0},token,true)).status,400);
  assert.equal((await post(api.parent,{...config,enabled:true,zdrConfirmed:true,dailyVoiceMinutes:1},token,true)).status,200);
  const id=randomUUID(),day=new Date().toLocaleDateString('en-CA',{timeZone:'America/Bahia'});
  await db.prepare('INSERT INTO tutor_sessions(id,profile_id,context_json,created_at) VALUES(?,?,?,?)').bind(id,profile,'{}',Date.now()).run();
  await db.prepare("INSERT INTO tutor_live_sessions(id,profile_id,state,started_at,last_seen,day,reserved_seconds) VALUES(?,?,'closed',?,?,?,60)").bind(id,profile,Date.now()-120000,Date.now(),day).run();
  const before=calls.filter(call=>call[0]==='live-create').length;
  const rejected=await post(api.live,{action:'start',sdp:'v=0 fixture',context:{subject:'geography',term:3}});assert.equal(rejected.status,400);assert.match(rejected.data.error,/limite diário/);
  assert.equal(calls.filter(call=>call[0]==='live-create').length,before);
 });
 await t.test('quota is atomic and disabled tutor cannot spend through any endpoint',async()=>{
  const results=await Promise.all(Array.from({length:10},()=>api.store.quota('foreign-profile','turns',3)));assert.equal(results.filter(Boolean).length,3);
  await post(api.parent,{...config,enabled:false,zdrConfirmed:true},token,true);assert.equal((await post(api.tutor,{action:'start',context:{subject:'geography',term:3}})).status,503);assert.equal((await post(api.voice,{turnId:randomUUID()})).status,404);assert.equal((await post(api.image,{turnId:randomUUID()})).status,403);
 });
 }finally{rmSync(root,{recursive:true,force:true});delete globalThis.__tutorMock;}
});
