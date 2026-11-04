// Test-process-only transport: real WebSocket frames, synthetic upstream/audio.
// Never loaded by the application or its production start command.
import https from 'node:https';
import http from 'node:http';
import {once} from 'node:events';
import {WebSocketServer} from 'ws';

if(process.env.BELA_VOICE_LOOPBACK!=='synthetic-test-only')throw new Error('Test fixture only');
const upstream=new WebSocketServer({host:'127.0.0.1',port:0});
await once(upstream,'listening');
upstream.on('connection',socket=>{
 socket.send(JSON.stringify({type:'session.created'}));
 socket.on('message',raw=>{
  const event=JSON.parse(raw.toString());
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
 if(typeof options!=='object'||(options.hostname??options.host)!=='api.openai.com'||!options.path?.startsWith('/v1/realtime?'))throw new Error('Unexpected test network destination');
 return http.request({...options,hostname:'127.0.0.1',host:'127.0.0.1',port:upstream.address().port,protocol:'http:',createConnection:undefined,_defaultAgent:http.globalAgent},callback);
};
process.on('exit',()=>{https.request=original;});
