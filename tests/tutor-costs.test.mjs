import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const root=mkdtempSync(join(tmpdir(),'bela-costs-'));
process.env.DB_PATH=join(root,'test.sqlite');process.env.RAILWAY_ENVIRONMENT_ID='';
await build({stdin:{contents:"export * from './lib/tutor-costs';export * as provider from './lib/tutor-provider';export {getDatabase} from './lib/database';",resolveDir:process.cwd()},outfile:join(root,'costs.mjs'),bundle:true,platform:'node',format:'esm',packages:'external',logLevel:'silent',plugins:[{name:'resolve-websocket',setup(b){b.onResolve({filter:/^ws$/},()=>({path:createRequire(import.meta.url).resolve('ws'),external:true}));}}]});
const api=await import(pathToFileURL(join(root,'costs.mjs')).href),db=await api.getDatabase();
test('API metering uses measured units, isolates accounts and never fabricates missing costs',async t=>{
 const original=globalThis.fetch,now=Date.now(),today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bahia',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 try{
 for(const id of ['app','other'])await db.prepare('INSERT INTO profiles(id,name,created_at) VALUES(?,?,?)').bind(id,'Synthetic',now).run();
 await t.test('current text prices account for cached reads, cache writes and output once',()=>{
  assert.equal(api.usageEstimate('gpt-6.1-terra',{input_tokens:1000,output_tokens:100,input_tokens_details:{cached_tokens:200,cache_write_tokens:100,cache_write_tokens_details:{ttl_12h_tokens:20}}}).nano,1360000);
  assert.equal(api.usageEstimate('gpt-live-1',{seconds:60}).nano,null); // native cumulative seconds are read separately, never inserted twice
  assert.equal(api.usageEstimate('gpt-transcribe',{seconds:60}).nano,4500000);
  assert.equal(api.usageEstimate('gpt-image-2.5-flare',{input_tokens:150,output_tokens:200,input_tokens_details:{text_tokens:100,image_tokens:50}}).nano,6900000);
  assert.equal(api.usageEstimate('gpt-realtime-2.1-mini',{input_tokens:100,output_tokens:100,input_token_details:{text_tokens:90,audio_tokens:10,cached_tokens:0},output_token_details:{text_tokens:20,audio_tokens:80}}).nano,1802000);
  assert.equal(api.usageEstimate('unknown',{input_tokens:100,output_tokens:100}).nano,null);
  assert.equal(api.usageEstimate('gpt-6.1-terra',{input_tokens:NaN,output_tokens:100}).nano,null);
 });
 await t.test('concurrent request scopes stay separate; repeated provider IDs are idempotent',async()=>{
  await Promise.all(['app','other'].map(profile=>api.withTutorUsage(profile,async()=>{await Promise.resolve();await api.recordTutorUsage('gpt-6.1-terra','responses',{id:profile,usage:{input_tokens:100,output_tokens:50},text:'PRIVATE',secret:'sk-PRIVATE'});}))); 
  await api.withTutorUsage('app',()=>api.recordTutorUsage('gpt-6.1-terra','responses',{id:'app',usage:{input_tokens:100,output_tokens:50}}));
  const rows=(await db.prepare('SELECT * FROM tutor_api_costs').all()).results;assert.equal(rows.length,2);
  assert.equal(rows.find(row=>row.profile_id==='app').cost_nano_usd,350000);assert.ok(!JSON.stringify(rows).includes('PRIVATE'));
 });
 await t.test('real provider parsing meters reviews, images and transcription before validation',async()=>{
  let sequence=0;globalThis.fetch=async url=>{
   sequence++;
   if(String(url).endsWith('/responses'))return Response.json({id:'response-'+sequence,status:'completed',usage:{input_tokens:1000,output_tokens:100},output:[{content:[{type:'output_text',text:'{"approved":true}'}]}]});
   if(String(url).endsWith('/audio/transcriptions'))return Response.json({text:'Synthetic',usage:{type:'duration',seconds:30}});
   return Response.json({usage:{input_tokens:100,output_tokens:200,input_tokens_details:{text_tokens:100,image_tokens:0}},data:[{b64_json:Buffer.from('89504e470d0a1a0a','hex').toString('base64')}]});
  };
  await api.withTutorUsage('app',async()=>{
   await api.provider.structuredReply('fixture','Reviewer','Synthetic',{approved:{type:'boolean'}},'review');
   await api.provider.transcribe('fixture','A'.repeat(200),'audio/wav');
   await api.provider.generateVisual('fixture','Synthetic','infographic');
  });
  assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM tutor_api_costs WHERE profile_id='app'").first()).n,4);
 });
 await t.test('missing usage and failed requests stay visibly unpriced',async()=>{
  globalThis.fetch=async()=>Response.json({error:'PRIVATE-provider-error'},{status:503});
  await api.withTutorUsage('app',()=>assert.rejects(api.provider.structuredReply('fixture','Synthetic','Synthetic',{},'review')));
  await api.withTutorUsage('app',()=>api.recordTutorUsage('gpt-image-2.5-flare','images/generations',{}));
  const rows=(await db.prepare('SELECT * FROM tutor_api_costs').all()).results;assert.ok(!JSON.stringify(rows).includes('PRIVATE'));
  assert.equal(rows.filter(row=>row.cost_nano_usd===null).length,2);
 });
 await t.test('live cumulative seconds combine with API totals without counting reservations as spend',async()=>{
  await db.prepare('INSERT INTO tutor_sessions(id,profile_id,context_json,created_at) VALUES(?,?,?,?)').bind('live','app','{}',now).run();
  await db.prepare('INSERT INTO tutor_live_sessions(id,profile_id,provider_id,state,started_at,last_seen,day,reserved_seconds,used_seconds) VALUES(?,?,?,?,?,?,?,?,?)').bind('live','app','provider','active',now,now,today,600,60).run();
  const summary=await api.tutorCostSummary('app',now),voice=summary.models.find(row=>row.model==='gpt-live-1');
  assert.equal(voice.usd,.05);assert.equal(voice.seconds,60);assert.equal(summary.pendingLiveSessions,1);assert.equal(summary.total.unpriced,2);assert.equal(summary.total.calls,7);
  assert.equal(summary.currency,'USD');assert.equal(summary.basis,'estimate');assert.equal((await api.tutorCostSummary('other',now)).total.calls,1);
  await db.prepare("UPDATE tutor_live_sessions SET state='closed',used_seconds=90 WHERE id='live'").run();
  const final=await api.tutorCostSummary('app',now);assert.equal(final.models.find(row=>row.model==='gpt-live-1').usd,.075);assert.equal(final.pendingLiveSessions,0);
 });
 }finally{globalThis.fetch=original;rmSync(root,{recursive:true,force:true});}
});
