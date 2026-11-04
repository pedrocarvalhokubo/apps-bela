// Test-process-only transport: real WebSocket frames, synthetic upstream/audio.
// Never loaded by the application or its production start command.
import https from 'node:https';
import http from 'node:http';
import {once} from 'node:events';
import {WebSocketServer} from 'ws';

if(process.env.BELA_VOICE_LOOPBACK!=='synthetic-test-only')throw new Error('Test fixture only');
const upstream=new WebSocketServer({host:'127.0.0.1',port:0});
await once(upstream,'listening');
upstream.on('connection',(socket,request)=>{
 const live=request.url.startsWith('/v1/live/');
 socket.send(JSON.stringify({type:live?'session.started':'session.created'}));
 if(live){
  socket.send(JSON.stringify({type:'session.input_transcript.delta',event_id:'fixture-input',delta:'Olá, tutor.',start_ms:0,end_ms:300}));
  socket.send(JSON.stringify({type:'session.output_transcript.delta',event_id:'fixture-output',delta:'Olá! Pode falar.',start_ms:350,end_ms:900}));
 }
 socket.on('message',raw=>{
  const event=JSON.parse(raw.toString());
  if(live&&event.type==='session.close')socket.send(JSON.stringify({type:'session.closed',usage:{seconds:3}}));
  if(event.type==='session.update')socket.send(JSON.stringify({type:'session.updated'}));
  if(event.type==='response.create'){
   const transcript=event.response.input[0].content[0].text;
   // One second of synthetic PCM, no speech or personal data.
   const pcm=Buffer.alloc(48000);
   for(let i=0;i<24000;i++)pcm.writeInt16LE(Math.round(1600*Math.sin(2*Math.PI*440*i/24000)),i*2);
   socket.send(JSON.stringify({type:'response.created'}));
   socket.send(JSON.stringify({type:'response.output_audio.delta',delta:pcm.toString('base64')}));
   socket.send(JSON.stringify({type:'response.output_audio_transcript.done',transcript}));
   socket.send(JSON.stringify({type:'response.done',response:{status:'completed'}}));
  }
 });
});
const original=https.request;
https.request=function(options,callback){
 // ws supplies an options object; block every non-fixture network destination.
 if(typeof options!=='object'||(options.hostname??options.host)!=='api.openai.com'||!(/^\/v1\/realtime\?|^\/v1\/live\/sessions\/[A-Za-z0-9_-]+\/attach$/.test(options.path??'')))throw new Error('Unexpected test network destination');
 return http.request({...options,hostname:'127.0.0.1',host:'127.0.0.1',port:upstream.address().port,protocol:'http:',createConnection:undefined,_defaultAgent:http.globalAgent},callback);
};
process.on('exit',()=>{https.request=original;});
const originalFetch=globalThis.fetch;
globalThis.fetch=async(input,init)=>{
 const url=String(input);
 if(url==='https://api.openai.com/v1/models/gpt-live-1')return Response.json({id:'gpt-live-1'});
 if(url==='https://api.openai.com/v1/live/sessions'){
  const body=JSON.parse(init.body);
  if(body.session.model!=='gpt-live-1'||body.session.store!==false||body.session.client.data_channel.allowed_client_events.includes('session.instructions.append'))throw new Error('Unsafe live configuration in compiled route');
  return Response.json({session:{id:'live_compiled_fixture'},transport:{type:'webrtc',sdp:'v=0 synthetic live answer'}},{status:201});
 }
 if(url.startsWith('https://api.openai.com/'))throw new Error('Unexpected provider request in local fixture');
 return originalFetch(input,init);
};
