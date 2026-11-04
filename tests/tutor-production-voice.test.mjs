// Execute compiled Next route handlers and real ws framing. The upstream is a
// local fixture, NOT OpenAI; this catches errors that mocked provider tests miss.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {pbkdf2Sync,createHash,createCipheriv,randomBytes,randomUUID} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';

test('compiled tutor voice routes send masked WebSocket frames and return replayable private WAV', {timeout:30000}, async()=>{
 const dir=mkdtempSync(join(tmpdir(),'bela-compiled-voice-')),port=4394;
 const password='928651',salt='test-salt',setup='ONLY-FIXTURE',pin='385729',encryption=randomBytes(32);
 const hash=value=>createHash('sha256').update(value).digest('hex');
 let logs='',db;
 const child=spawn(process.execPath,['--import',resolve('tests/fixtures/realtime-loopback.mjs'),'node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p',String(port)],{
  env:{...process.env,RAILWAY_ENVIRONMENT_ID:'',DB_PATH:join(dir,'voice.sqlite'),BELA_VOICE_LOOPBACK:'synthetic-test-only',BELA_LOGIN_SALT:salt,BELA_LOGIN_HASH:pbkdf2Sync(password,salt,100000,32,'sha256').toString('hex'),BELA_PARENT_SETUP_HASH:hash(setup.replaceAll('-','')),BELA_TUTOR_ENCRYPTION_KEY:encryption.toString('hex')},stdio:['ignore','pipe','pipe'],
 });
 const log=bytes=>{logs=(logs+bytes).slice(-20000);};child.stdout.on('data',log);child.stderr.on('data',log);
 const api=(path,body,cookie,parent)=>fetch(`http://127.0.0.1:${port}${path}`,{method:body?'POST':'GET',headers:{'content-type':'application/json',...(cookie?{cookie}:{}),...(parent?{'x-bela-parent-token':parent}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(16000)});
 try{
  let ready=false;
  for(let i=0;i<100;i++){
   try{if((await api('/api/health')).ok){ready=true;break;}}catch{}
   if(child.exitCode!==null)throw new Error('Test server exited: '+logs);
   await new Promise(resolve=>setTimeout(resolve,75));
  }
  assert.ok(ready,'Compiled server must start');
  const login=await api('/api/auth',{action:'login',password});assert.equal(login.status,200);
  const cookie=login.headers.get('set-cookie').split(';')[0];
  const setupResponse=await api('/api/parent',{action:'setup-pin',pin,setupCode:setup},cookie);assert.equal(setupResponse.status,200);
  const {parentToken}=await setupResponse.json();
  db=new DatabaseSync(join(dir,'voice.sqlite'));db.exec('PRAGMA busy_timeout=5000');
  const profile=db.prepare('SELECT profile_id FROM login_sessions').get().profile_id;
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',encryption,iv);
  const encrypted=Buffer.concat([cipher.update('sk-synthetic-fixture-not-a-real-key'),cipher.final()]);
  const sealed=[iv,cipher.getAuthTag(),encrypted].map(part=>part.toString('base64url')).join('.');
  db.prepare('INSERT INTO tutor_settings(profile_id,encrypted_key,enabled,zdr_confirmed,updated_at) VALUES(?,?,1,1,?)').run(profile,sealed,Date.now());
  const sessionId=randomUUID(),turnId=randomUUID();
  db.prepare('INSERT INTO tutor_sessions(id,profile_id,context_json,created_at) VALUES(?,?,?,?)').run(sessionId,profile,'{}',Date.now());
  db.prepare("INSERT INTO tutor_turns(id,session_id,profile_id,answer,status,created_at) VALUES(?,?,?,?,'done',?)").run(turnId,sessionId,profile,'Um triângulo tem três lados.',Date.now());
  assert.equal((await api('/api/tutor/voice',{turnId})).status,401);
  assert.equal((await api('/api/tutor/parent',{action:'testVoice'},cookie)).status,401);
  const voice=await api('/api/tutor/voice',{turnId},cookie);
  const bytes=Buffer.from(await voice.arrayBuffer());
  assert.equal(voice.status,200,'Compiled voice failed: '+bytes.toString().slice(0,200)+'; '+logs);
  assert.equal(voice.headers.get('content-type'),'audio/wav');assert.match(voice.headers.get('cache-control'),/private.*no-store/);
  assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.readUInt32LE(24),24000);assert.equal(bytes.length,48044);
  const replay=await api('/api/tutor/voice',{turnId},cookie);assert.equal(replay.status,200);
  assert.deepEqual(Buffer.from(await replay.arrayBuffer()),bytes);
  assert.equal(db.prepare('SELECT attempts FROM tutor_speech_requests WHERE turn_id=?').get(turnId).attempts,1);
  const parent=await api('/api/tutor/parent',{action:'testVoice'},cookie,parentToken);assert.equal(parent.status,200,'Parent voice test must use the same working transport');
  assert.equal(Buffer.from(await parent.arrayBuffer()).subarray(0,4).toString(),'RIFF');
  assert.equal((await api('/api/tutor/live',{action:'start',sdp:'v=0 fixture'})).status,401);
  const access=await api('/api/tutor/live',{action:'checkAccess'},cookie);assert.equal(access.status,200);assert.equal((await access.json()).model,'gpt-live-1');
  const live=await api('/api/tutor/live',{action:'start',sdp:'v=0 compiled fixture',context:{subject:'geography',term:3}},cookie);assert.equal(live.status,200);
  const opened=await live.json();assert.equal(opened.model,'gpt-live-1');assert.ok(!JSON.stringify(opened).includes('sk-'));assert.ok(!JSON.stringify(opened).includes('instructions'));
  await new Promise(resolve=>setTimeout(resolve,30));
  const status=await api('/api/tutor/live',{action:'status',sessionId:opened.sessionId},cookie);assert.equal(status.status,200);const active=await status.json();assert.equal(active.state,'active');assert.equal(active.events.length,2);
  const captions=await api('/api/tutor/parent',{action:'conversation',sessionId:opened.sessionId},cookie,parentToken);assert.equal((await captions.json()).liveTranscripts.length,2);
  await api('/api/tutor/live',{action:'interrupt',sessionId:opened.sessionId},cookie);
  await api('/api/tutor/live',{action:'stop',sessionId:opened.sessionId},cookie);
  await new Promise(resolve=>setTimeout(resolve,30));
  assert.equal(db.prepare('SELECT state FROM tutor_live_sessions WHERE id=?').get(opened.sessionId).state,'closed');
  assert.equal((await api('/api/tutor/parent',{action:'costs'},cookie)).status,401);
  const costs=await api('/api/tutor/parent',{action:'costs'},cookie,parentToken);assert.equal(costs.status,200);
  const report=await costs.json();assert.equal(report.currency,'USD');assert.equal(report.basis,'estimate');
  assert.equal(report.models.find(row=>row.model==='gpt-realtime-2.1-mini').calls,2,'Cached replay must not add a provider charge');
  assert.equal(report.models.find(row=>row.model==='gpt-realtime-2.1-mini').unpriced,2,'Synthetic provider omits usage; must remain visibly unknown');
  assert.equal(report.models.find(row=>row.model==='gpt-live-1').seconds,3);assert.equal(report.models.find(row=>row.model==='gpt-live-1').usd,.0125);assert.ok(!JSON.stringify(report).includes('sk-'));
  assert.doesNotMatch(logs,/mask is not a function|uncaughtException/);
 }finally{
  db?.close();
  if(child.exitCode===null){const exited=once(child,'exit');child.kill();const force=setTimeout(()=>child.kill('SIGKILL'),2000);await exited;clearTimeout(force);}
  rmSync(dir,{recursive:true,force:true});
 }
});
