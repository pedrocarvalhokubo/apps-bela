import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
const dir=mkdtempSync(join(tmpdir(),'bela-test-'));
const port=4389;
let child;
async function start(){
 child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p',String(port)],{env:{...process.env,DB_PATH:join(dir,'test.sqlite')},stdio:['ignore','pipe','pipe']});
 let logs='';child.stdout.on('data',b=>{logs+=b;process.stdout.write(b)});child.stderr.on('data',b=>{logs+=b;process.stderr.write(b)});
 for(let i=0;i<100;i++){
  try {if((await fetch(`http://localhost:${port}/api/health`, {signal:AbortSignal.timeout(1000)})).ok)return;}catch{}
  if(child.exitCode!==null)throw new Error(logs);
  await new Promise(r=>setTimeout(r,100));
 }
 throw new Error('Server failed: '+logs);
}
async function stop(){if(child&&child.exitCode===null){const ended=once(child,'exit'); child.kill(); const timer=setTimeout(()=>child.kill('SIGKILL'),3000);await ended;clearTimeout(timer);}}
async function api(path,token,body,parent){
 const r=await fetch(`http://localhost:${port}${path}`,{signal:AbortSignal.timeout(5000),method:body?'POST':'GET',headers:{'content-type':'application/json',...(token?{'x-bela-device-token':token}:{}),...(parent?{'x-bela-parent-token':parent}:{})},body:body?JSON.stringify(body):undefined});
 return {status:r.status,data:await r.json()};
}
test('unified app: profile isolation, persistence, PIN, pairing and OBMEP merge',async()=>{
 try{
 await start();console.log('Server healthy');
 for(const p of ['/','/obmep']){const r=await fetch(`http://localhost:${port}${p}`,{signal:AbortSignal.timeout(5000)});assert.equal(r.status,200);const html=await r.text();assert.match(html,/OBMEP Mirim/);assert.doesNotMatch(html,/Maple Bear|21\/08\/2026/);}
 assert.equal((await api('/api/sync')).status,401);
 const a=(await api('/api/device',null,{action:'bootstrap'})).data.token;
 const b=(await api('/api/device',null,{action:'bootstrap'})).data.token;
 const state={completedLessons:['one'],studyNotes:'Test private note'};
 assert.equal((await api('/api/sync',a,{state})).status,200);
 assert.deepEqual((await api('/api/sync',a)).data.state,state);
 assert.equal((await api('/api/sync',b)).data.state,null);
 const parent=(await api('/api/parent',a,{action:'setup-pin',pin:'123456'})).data.parentToken;
 assert.ok(parent);
 assert.equal((await api('/api/parent',a,{action:'analytics'})).status,401);
 assert.equal((await api('/api/parent',b,{action:'analytics'},parent)).status,401);
 assert.equal((await api('/api/parent',a,{action:'setup-pin',pin:'999999'})).status,409);
 const pair=(await api('/api/parent',a,{action:'create-pair'},parent)).data.code;
 const paired=await Promise.all([api('/api/device',null,{action:'pair',code:pair}),api('/api/device',null,{action:'pair',code:pair})]);
 assert.deepEqual(paired.map(x=>x.status).sort(),[200,401]);
 const second=paired.find(x=>x.status===200).data.token;
 assert.deepEqual((await api('/api/sync',second)).data.state,state);
 const q='2023-f1-m1-q01';
 const all=await import('../app/obmep/officialQuestions.ts');
 const id=all.officialQuestions[0].id, id2=all.officialQuestions[1].id;
 const results=await Promise.all([api('/api/obmep',a,{progress:{[id]:{solved:true,attempts:3,firstTry:false}}}),api('/api/obmep',second,{progress:{[id2]:{solved:true,attempts:1,firstTry:true}}})]);
 assert.ok(results.every(x=>x.status===200));
 await api('/api/obmep',second,{progress:{[id]:{solved:true,attempts:1,firstTry:true}}});
 const progress=(await api('/api/obmep',a)).data.progress;
 assert.equal(progress[id].attempts,1);assert.equal(progress[id].firstTry,true);assert.ok(progress[id2]);
 assert.deepEqual((await api('/api/obmep',b)).data.progress,{});
 assert.equal((await api('/api/obmep',a,{progress:{bad:{solved:true,attempts:1,firstTry:true}}})).status,400);
 await stop();await start();
 assert.deepEqual((await api('/api/sync',a)).data.state,state);
 assert.deepEqual((await api('/api/obmep',second)).data.progress,progress);
 assert.equal((await api('/api/parent',a,{action:'verify-pin',pin:'123456'})).status,200);
 for(let i=0;i<5;i++)assert.equal((await api('/api/parent',a,{action:'verify-pin',pin:'654321'})).status,401);
 assert.equal((await api('/api/parent',a,{action:'verify-pin',pin:'654321'})).status,429);
 assert.equal(all.officialQuestions.length,180);
 }finally{await stop();rmSync(dir,{recursive:true,force:true});}
});
