import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync,readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { DatabaseSync } from 'node:sqlite';
import { pbkdf2Sync,createHash,randomUUID } from 'node:crypto';
import {officialQuestions} from '../app/obmep/officialQuestions.ts';
const dir=mkdtempSync(join(tmpdir(),'bela-test-')),port=4389;
const password='986532',salt='fixture-salt',setupCode='TEST-ONLY-SETUP',parentPin='473829';
const hash=s=>createHash('sha256').update(s).digest('hex');
let child,db;
async function start(){
 child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p',String(port)],{env:{...process.env,RAILWAY_ENVIRONMENT_ID:'',DB_PATH:join(dir,'test.sqlite'),BELA_LOGIN_SALT:salt,BELA_LOGIN_HASH:pbkdf2Sync(password,salt,100000,32,'sha256').toString('hex'),BELA_PARENT_SETUP_HASH:hash(setupCode.replaceAll('-',''))},stdio:['ignore','pipe','pipe']});
 let logs='';child.stdout.on('data',b=>{logs+=b});child.stderr.on('data',b=>{logs+=b});
 for(let i=0;i<100;i++){
  try {if((await fetch(`http://localhost:${port}/api/health`, {signal:AbortSignal.timeout(1000)})).ok)return;}catch{}
  if(child.exitCode!==null)throw new Error(logs);
  await new Promise(r=>setTimeout(r,100));
 }
 throw new Error('Server failed: '+logs);
}
async function stop(){if(child&&child.exitCode===null){const ended=once(child,'exit');child.kill();const timer=setTimeout(()=>child.kill('SIGKILL'),3000);await ended;clearTimeout(timer);}}
async function api(path,cookie,body,parent,extra={}){
 const r=await fetch(`http://localhost:${port}${path}`,{signal:AbortSignal.timeout(5000),method:body?'POST':'GET',headers:{'content-type':'application/json',...(cookie?{cookie}:{}),...(parent?{'x-bela-parent-token':parent}:{}),...extra},body:body?JSON.stringify(body):undefined});
 return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0],setCookie:r.headers.get('set-cookie')};
}
const login=()=>api('/api/auth',null,{action:'login',password});
test('Bela account, guest isolation and durable history',async(t)=>{
 try{
 await start();db=new DatabaseSync(join(dir,'test.sqlite'));db.exec('PRAGMA busy_timeout=5000');
 const legacyToken='ab'.repeat(24),oldTime=Date.now()-86400000;
 db.prepare("INSERT INTO profiles VALUES('legacy-bela','Original',?)").run(oldTime);
 db.prepare("INSERT INTO devices VALUES(?,'legacy-bela','Original phone',?,?)").run(hash(legacyToken),oldTime,oldTime);
 db.prepare("INSERT INTO study_state VALUES('legacy-bela',?,?)").run(JSON.stringify({completedLessons:['legacy-cloud'],studyNotes:'Original note'}),oldTime);
 db.prepare("INSERT INTO attempts VALUES('legacy-attempt','legacy-bela','science','science-general',1,'sound','a',0,0,?)").run(oldTime);
 const [q1,q2]=officialQuestions;
 db.prepare("INSERT INTO obmep_progress VALUES('legacy-bela',?,?)").run(JSON.stringify({[q1.id]:{solved:true,attempts:2,firstTry:false}}),oldTime);
 let a,b,parent;
 await t.test('guest and old device tokens cannot read or write account data',async()=>{
  for(const p of ['/','/obmep']){const r=await fetch(`http://localhost:${port}${p}`);assert.equal(r.status,200);assert.match(await r.text(),/Estudos da Bela/);}
  assert.equal((await api('/api/auth')).data.authenticated,false);
  for(const p of ['/api/sync','/api/obmep','/api/parent','/api/drafts'])assert.equal((await api(p)).status,401,p);
  for(const p of ['/api/sync','/api/obmep','/api/parent','/api/drafts','/api/attempts','/api/history-import'])assert.equal((await api(p,null,{state:{},action:'import'})).status,401,p);
  assert.equal((await api('/api/device',null,{action:'bootstrap'})).status,410);
  assert.equal((await api('/api/sync',null,null,null,{'x-bela-device-token':legacyToken})).status,401);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM profiles').get().n,1);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM attempts').get().n,1);
 });
 await t.test('password, durable HttpOnly login and cross-origin protection',async()=>{
  assert.equal((await api('/api/auth',null,{action:'login',password:'wrong'})).status,401);
  const first=await login();assert.equal(first.status,200);a=first.cookie;
  assert.match(first.setCookie,/HttpOnly/);assert.match(first.setCookie,/SameSite=Strict/);assert.match(first.setCookie,/Max-Age=2592000/);
  b=(await login()).cookie;assert.notEqual(a,b);
  assert.equal((await api('/api/auth',a)).data.authenticated,true);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM profiles').get().n,2);
  assert.equal((await api('/api/sync',a,{state:{}},null,{origin:'https://untrusted.invalid'})).status,401);
  assert.equal((await api('/api/sync',a,{state:{}},null,{origin:'not-a-url'})).status,401);
 });
 await t.test('two devices preserve concurrent achievements and read the same notes',async()=>{
  const first=await api('/api/sync',a,{state:{completedLessons:['a'],quizStatsById:{quiz:{attempts:1,bestScore:2}},studyNotes:'A'},revision:0});assert.equal(first.status,200);
  assert.equal((await api('/api/sync',b)).data.state.studyNotes,'A');
  const conflict=await api('/api/sync',b,{state:{completedLessons:['b'],quizStatsById:{quiz:{attempts:2,bestScore:1}},studyNotes:'B'},revision:0});
  assert.equal(conflict.data.conflict,true);assert.deepEqual(conflict.data.state.completedLessons,['a','b']);assert.equal(conflict.data.state.quizStatsById.quiz.bestScore,2);
  const fresh=await api('/api/sync',a,{state:{...conflict.data.state,completedLessons:['b'],studyNotes:''},revision:conflict.data.updatedAt});
  assert.equal(fresh.data.conflict,false);assert.deepEqual((await api('/api/sync',b)).data.state.completedLessons,['b']);
 });
 await t.test('parents require a private one-time setup code and separate PIN',async()=>{
  assert.equal((await api('/api/parent',a)).data.hasPin,false);
  assert.equal((await api('/api/parent',a,{action:'setup-pin',pin:parentPin})).status,401);
  assert.equal((await api('/api/parent',a,{action:'setup-pin',pin:password,setupCode})).status,400);
  const r=await api('/api/parent',a,{action:'setup-pin',pin:parentPin,setupCode});assert.equal(r.status,200);parent=r.data.parentToken;assert.ok(parent);
  assert.equal((await api('/api/parent',a,{action:'setup-pin',pin:'654321',setupCode})).status,409);
  assert.equal((await api('/api/parent',a,{action:'analytics'})).status,401);
  assert.equal((await api('/api/parent',null,{action:'analytics'},parent)).status,401);
  assert.equal((await api('/api/parent',b,{action:'verify-pin',pin:parentPin})).status,200);
 });
 await t.test('attempts are graded on the server, deduplicated and visible in parents history',async()=>{
  const content=JSON.parse(readFileSync('app/science-content.json','utf8')),q=content.scienceQuiz[0];
  const wrong=q.options.find(o=>o.id!==q.correct).id;
  const attempt={eventId:randomUUID(),subject:'science',quizId:'science-general',questionId:q.id,topic:'forged topic',selected:wrong,correct:true,answeredAt:Date.now()};
  assert.equal((await api('/api/attempts',a,attempt)).status,200);
  assert.equal((await api('/api/attempts',b,attempt)).status,200);
  assert.equal((await api('/api/attempts',a,{...attempt,eventId:randomUUID(),questionId:999999})).status,400);
  assert.equal((await api('/api/attempts',a,{...attempt,eventId:randomUUID(),selected:q.correct,correct:false,isReview:true})).status,200);
  const report=(await api('/api/parent',b,{action:'analytics'},parent)).data;
  assert.equal(report.summary.attempts,2);assert.equal(report.summary.correct,1);assert.equal(report.timeline[0].attempts,2);assert.equal(report.wrongAnswers.length,1);assert.equal(report.topics[0].topic,q.topic);
 });
 await t.test('written answers and OBMEP progress travel with the account',async()=>{
  assert.equal((await api('/api/drafts',a,{task:'bela-science-write-1',answer:'A private written answer'})).status,200);
  assert.equal((await api('/api/drafts?task=bela-science-write-1',b)).data.draft.answer,'A private written answer');
  assert.equal((await api('/api/drafts',b,{task:'invalid',answer:'x'})).status,400);
  const responses=await Promise.all([api('/api/obmep',a,{progress:{[q1.id]:{solved:true,attempts:3,firstTry:false}}}),api('/api/obmep',b,{progress:{[q2.id]:{solved:true,attempts:1,firstTry:true}}})]);assert.ok(responses.every(r=>r.status===200));
  await api('/api/obmep',b,{progress:{[q1.id]:{solved:true,attempts:1,firstTry:true}}});
  const progress=(await api('/api/obmep',a)).data.progress;assert.equal(progress[q1.id].attempts,1);assert.ok(progress[q2.id]);
  assert.equal((await api('/api/obmep',a,{progress:{bad:{solved:true,attempts:1,firstTry:true}}})).status,400);
  assert.equal(officialQuestions.length,180);
 });
 await t.test('parent-approved import is atomic, repeat-safe and preserves original history',async()=>{
  const payload={legacyToken,study:{completedLessons:['legacy-local'],studyNotes:'Local original'},drafts:{'bela-science-write-2':'Old draft'},obmep:{[q2.id]:{solved:true,attempts:4,firstTry:false}}};
  assert.equal((await api('/api/history-import',a,{...payload,action:'preview'})).status,401);
  const preview=await api('/api/history-import',a,{...payload,action:'preview'},parent);assert.equal(preview.status,200);assert.equal(preview.data.lessons,2);assert.equal(preview.data.attempts.count,1);
  assert.equal((await api('/api/parent',a,{action:'analytics'},parent)).data.summary.attempts,2);
  assert.equal((await api('/api/history-import',a,{...payload,obmep:{[q1.id]:null},action:'import'},parent)).status,400);
  assert.equal((await api('/api/history-import',a,{...payload,action:'import'},parent)).data.changed,true);
  assert.equal((await api('/api/history-import',b,{...payload,action:'import'},parent)).data.changed,false);
  const state=(await api('/api/sync',b)).data.state;assert.deepEqual(new Set(state.completedLessons),new Set(['b','legacy-local','legacy-cloud']));
  const report=(await api('/api/parent',a,{action:'analytics'},parent)).data;assert.equal(report.summary.attempts,3);assert.equal(report.drafts.length,2);assert.equal(report.timeline.length,2);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM attempts WHERE profile_id='legacy-bela'").get().n,1);
  assert.equal(db.prepare("SELECT state_json FROM study_state WHERE profile_id='legacy-bela'").get().state_json,JSON.stringify({completedLessons:['legacy-cloud'],studyNotes:'Original note'}));
  assert.equal((await api('/api/obmep',b)).data.progress[q1.id].attempts,1);
 });
 await t.test('server restart retains account, history and PIN; expiry and logout revoke access',async()=>{
  const before=(await api('/api/sync',a)).data;await stop();await start();
  assert.deepEqual((await api('/api/sync',a)).data,before);
  assert.equal((await api('/api/parent',a,{action:'verify-pin',pin:parentPin})).status,200);
  const c=(await login()).cookie;db.prepare('UPDATE login_sessions SET expires_at=0 WHERE token_hash=?').run(hash(c.split('=')[1]));assert.equal((await api('/api/sync',c)).status,401);
  db.prepare('UPDATE parent_sessions SET expires_at=0 WHERE token_hash=?').run(hash(parent));assert.equal((await api('/api/parent',a,{action:'analytics'},parent)).status,401);
  assert.equal((await api('/api/auth',a,{action:'logout'})).status,200);assert.equal((await api('/api/sync',a)).status,401);assert.equal((await api('/api/sync',b)).status,200);
 });
 await t.test('password and parental PIN attempts are rate limited',async()=>{
  for(let i=0;i<5;i++)assert.equal((await api('/api/auth',null,{action:'login',password:'bad'},null,{'x-real-ip':'test-limited'})).status,401);
  assert.equal((await api('/api/auth',null,{action:'login',password},null,{'x-real-ip':'test-limited'})).status,429);
  assert.equal((await api('/api/auth',null,{action:'login',password},null,{'x-real-ip':'different-test-ip'})).status,429);
  for(let i=0;i<5;i++)assert.equal((await api('/api/parent',b,{action:'verify-pin',pin:'654321'})).status,401);
  assert.equal((await api('/api/parent',b,{action:'verify-pin',pin:'654321'})).status,429);
 });
 }finally{db?.close();await stop();rmSync(dir,{recursive:true,force:true});}
});
