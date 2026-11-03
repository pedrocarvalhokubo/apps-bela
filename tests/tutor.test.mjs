import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomUUID,randomBytes,createHash} from 'node:crypto';
const root=mkdtempSync(join(tmpdir(),'bela-tutor-tests-'));
process.env.DB_PATH=join(root,'bela.sqlite');process.env.RAILWAY_ENVIRONMENT_ID='';process.env.RAILWAY_VOLUME_MOUNT_PATH='';process.env.BELA_TUTOR_ENCRYPTION_KEY=randomBytes(32).toString('hex');
let calls=[],answerPatch={},review=true,visualReview=true;
const sample={allowed:true,safety:false,answer:'Uma mudança dentro do mesmo país é uma migração interna. Que pista ajuda você a perceber isso?',topic:'Migração interna',suggestion:'Comparar duas mudanças e identificar as fronteiras.',sourceIds:['geography-3'],visualKind:'none',visualPrompt:''};
globalThis.__tutorMock={
 validateKey:async key=>{calls.push(['validateKey',key]);},
 moderate:async(_key,text)=>text==='unsafe fixture',
 transcribe:async()=>{calls.push(['transcribe']);return 'Quero entender migração interna.';},
 explain:async(_key,input)=>{calls.push(['explain',input]);return {...sample,...answerPatch};},
 verifyAnswer:async()=>review,
 generateVisual:async()=>{calls.push(['image']);return Buffer.from('89504e470d0a1a0a','hex');},
 reviewVisual:async()=>visualReview,
 speak:async()=>{calls.push(['speak']);return Buffer.from('RIFF fixture WAVE');},
 structuredReply:async(_key,instructions,input)=>{calls.push(['prompt',instructions,input]);return {prompt:'Explique uma ideia por vez e use exemplos novos.',summary:'Frases curtas e exemplos variados.'};}
};
await build({stdin:{contents:`export * as tutor from './app/api/tutor/route';export * as parent from './app/api/tutor/parent/route';export * as image from './app/api/tutor/image/route';export * as voice from './app/api/tutor/voice/route';export * as media from './app/api/tutor/media/route';export * as security from './lib/tutor-security';export * as store from './lib/tutor-store';export * as content from './lib/tutor-content';export {getD1 as getDB,sha256} from './app/api/_lib';`,resolveDir:process.cwd()},outfile:join(root,'api.mjs'),bundle:true,platform:'node',format:'esm',packages:'external',logLevel:'silent',plugins:[{name:'controlled-provider',setup(b){b.onLoad({filter:/lib\/tutor-provider\.ts$/},()=>({contents:`export const tutorModels={text:'gpt-6.1-terra',speech:'fixture',image:'fixture',transcription:'fixture'};export class ProviderError extends Error{};${Object.keys(globalThis.__tutorMock).map(name=>`export const ${name}=(...args)=>globalThis.__tutorMock.${name}(...args);`).join('\n')}`,loader:'js'}));}}]});
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
  for(const route of [api.tutor,api.parent,api.image,api.voice])for(const cookie of [null,foreign])assert.equal((await post(route,{action:'read'},cookie,true)).status,401);
  assert.equal((await api.media.GET(req(null,null,false,'/media?id='+randomUUID()))).status,401);
  assert.equal((await post(api.parent,{action:'read'})).status,401);assert.equal(calls.length,count);
 });
 await t.test('key is encrypted, redacted and activation requires ZDR attestation',async()=>{
  assert.equal((await post(api.tutor,{action:'start',context:{subject:'geography',term:3}})).status,503);
  assert.equal((await post(api.parent,{...config,apiKey:key},token,true)).status,200);
  const saved=await api.store.settings(profile);assert.notEqual(saved.encrypted_key,key);assert.equal(api.security.openKey(saved.encrypted_key),key);
  const read=await post(api.parent,{action:'read'},token,true);assert.equal(read.data.settings.keyConfigured,true);assert.ok(!JSON.stringify(read.data).includes(key));assert.ok(!JSON.stringify(read.data).includes(saved.encrypted_key));
  assert.equal((await post(api.parent,{...config,enabled:true},token,true)).status,400);
  assert.equal((await post(api.parent,{...config,enabled:true,zdrConfirmed:true},token,true)).status,200);
  assert.equal((await api.tutor.GET(req())).status,200);
  const modified=saved.encrypted_key.split('.');modified[2]=(modified[2][0]==='A'?'B':'A')+modified[2].slice(1);assert.throws(()=>api.security.openKey(modified.join('.')));
 });
 await t.test('prompt suggestions are drafts; saves create reviewable versions',async()=>{
  const suggestion=await post(api.parent,{action:'suggestPrompt',prompt:'',instruction:'Use frases menores.'},token,true);assert.equal(suggestion.status,200);
  assert.equal((await api.store.settings(profile)).custom_prompt,'');
  assert.equal((await post(api.parent,{action:'savePrompt',prompt:suggestion.data.prompt},token,true)).status,200);
  const read=await post(api.parent,{action:'read'},token,true);assert.equal(read.data.versions.length,1);assert.equal(read.data.settings.customPrompt,suggestion.data.prompt);
  assert.match(calls.find(c=>c[0]==='prompt')[1],/apenas Bela autenticada/);
 });
 await t.test('only catalog modules and lessons resolve, with no assessment answers in source',()=>{
  assert.equal(api.content.resolveTutorContext({subject:'arbitrary',term:3}),null);
  assert.equal(api.content.resolveTutorContext({subject:'geography',term:3,lessonId:'e3-verbs'}),null);
  assert.equal(api.content.tutorCatalog.length,9);assert.equal(api.content.tutorCatalog.reduce((sum,m)=>sum+m.lessons.length,0),64);
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
 await t.test('unknown sources and failed independent review do not escape the module',async()=>{
  const session=await newSession();answerPatch={sourceIds:['science-3']};let r=await turn(session);assert.match(r.data.turn.answer,/apoio suficiente/);
  answerPatch={allowed:false,visualKind:'image',visualPrompt:'Unrelated'};r=await turn(session);assert.match(r.data.turn.answer,/Geografia/);assert.equal(r.data.turn.visualKind,'none');
  answerPatch={};review=false;r=await turn(session);assert.match(r.data.turn.answer,/assunto desta aula/);review=true;
  r=await turn(session,'unsafe fixture');assert.equal(r.data.turn.flagged,true);assert.match(r.data.turn.answer,/adulto/);
 });
 await t.test('private images and audio are owned, reviewed, budgeted and cached',async()=>{
  answerPatch={visualKind:'infographic',visualPrompt:'Migração interna e externa. Exemplo fictício.'};const session=await newSession(),r=await turn(session,'Crie um infográfico.'),id=r.data.turn.id;
  assert.equal((await post(api.image,{turnId:id})).status,200);const imageCount=calls.filter(c=>c[0]==='image').length;assert.equal((await post(api.image,{turnId:id})).status,200);assert.equal(calls.filter(c=>c[0]==='image').length,imageCount);
  let media=await api.media.GET(req(null,token,false,'/media?id='+id+'&kind=image'));assert.equal(media.status,200);assert.equal(media.headers.get('content-type'),'image/png');assert.match(media.headers.get('cache-control'),/private, no-store/);
  assert.equal((await api.media.GET(req(null,foreign,false,'/media?id='+id+'&kind=image'))).status,401);
  assert.equal((await api.voice.POST(req({turnId:id}))).status,200);assert.equal((await api.voice.POST(req({turnId:id}))).status,200);assert.equal(calls.filter(c=>c[0]==='speak').length,1);
  visualReview=false;const rejected=await turn(session,'Crie outro infográfico.');assert.equal((await post(api.image,{turnId:rejected.data.turn.id})).status,502);assert.equal((await api.media.GET(req(null,token,false,'/media?id='+rejected.data.turn.id))).status,404);visualReview=true;answerPatch={};
 });
 await t.test('quota is atomic and disabled tutor cannot spend through any endpoint',async()=>{
  const results=await Promise.all(Array.from({length:10},()=>api.store.quota('foreign-profile','turns',3)));assert.equal(results.filter(Boolean).length,3);
  await post(api.parent,{...config,enabled:false,zdrConfirmed:true},token,true);assert.equal((await post(api.tutor,{action:'start',context:{subject:'geography',term:3}})).status,503);assert.equal((await post(api.voice,{turnId:randomUUID()})).status,404);assert.equal((await post(api.image,{turnId:randomUUID()})).status,403);
 });
 }finally{rmSync(root,{recursive:true,force:true});delete globalThis.__tutorMock;}
});
