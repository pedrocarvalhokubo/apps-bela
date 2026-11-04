// Browser API lifecycle contracts with synthetic WebRTC/media, not acoustic tests.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundle=await build({entryPoints:['lib/tutor-live-client.ts'],bundle:true,write:false,platform:'browser',format:'esm'});
const {TutorLiveSession}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const tick=async()=>{for(let i=0;i<40;i++)await Promise.resolve();};
const emit=(target,type,values={})=>{const event=new Event(type);Object.assign(event,values);target.dispatchEvent(event);};
function platform(t,{permission}={}){
 const saved=new Map(['window','navigator','RTCPeerConnection','MediaStream','fetch'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
 const calls=[],tracks=[],sources=[],peers=[],states=[],errors=[],captions=[];
 class Track extends EventTarget{stops=0;stop(){this.stops++;}}
 class Stream{constructor(input){this.tracks=input??[new Track()];tracks.push(...this.tracks);}getAudioTracks(){return this.tracks;}getTracks(){return this.tracks;}}
 const node=()=>({connections:[],gain:{value:1},fftSize:512,connect(target){this.connections.push(target);},disconnect(){this.disconnected=true;},getFloatTimeDomainData(samples){samples.fill(0);}});
 class Context extends EventTarget{state='suspended';destination={};resume(){calls.push('resume');this.state='running';return Promise.resolve();}close(){this.state='closed';return Promise.resolve();}createGain(){return node();}createAnalyser(){return node();}createMediaStreamSource(stream){const value=node();value.stream=stream;sources.push(value);return value;}}
 class Channel extends EventTarget{readyState='open';sent=[];send(raw){const event=JSON.parse(raw);this.sent.push(event);if(event.type==='session.close')queueMicrotask(()=>emit(this,'message',{data:JSON.stringify({type:'session.closed'})}));}close(){this.readyState='closed';emit(this,'close');}}
 class Peer extends EventTarget{
  iceGatheringState='complete';connectionState='connected';channel=new Channel();closed=false;
  constructor(){super();peers.push(this);}
  addTrack(track,stream){this.input={track,stream};}createDataChannel(label){assert.equal(label,'oai-events');return this.channel;}
  async createOffer(){return {type:'offer',sdp:'v=0 synthetic offer'};}async setLocalDescription(value){this.localDescription=value;}
  async setRemoteDescription(value){assert.equal(value.type,'answer');this.remote=value;emit(this,'track',{track:new Track()});emit(this.channel,'message',{data:JSON.stringify({type:'session.started'})});}
  close(){this.closed=true;this.connectionState='closed';emit(this,'connectionstatechange');}
 }
 Object.defineProperty(globalThis,'window',{configurable:true,value:{AudioContext:Context}});
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{mediaDevices:{getUserMedia(){calls.push('permission');return permission?permission():Promise.resolve(new Stream());}}}});
 Object.assign(globalThis,{RTCPeerConnection:Peer,MediaStream:Stream,fetch:async(url,init)=>{
  assert.equal(url,'/api/tutor/live');const body=JSON.parse(init.body);calls.push(body);
  return Response.json(body.action==='start'?{sessionId:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',sdp:'v=0 synthetic answer',model:'gpt-live-1',maxSeconds:60}:{state:'active',turns:[]});
 }});
 const session=new TutorLiveSession({context:{subject:'geography',term:3},onState:value=>states.push(value),onError:value=>errors.push(value),onCaptions:value=>captions.push(value),onSession:id=>assert.match(id,/^aaaaaaaa/)});
 t.after(async()=>{session.stop();await tick();for(const [key,descriptor]of saved){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}});
 return {session,calls,tracks,sources,peers,states,errors,captions,Stream,emit:message=>emit(peers[0].channel,'message',{data:JSON.stringify(message)})};
}
test('native WebRTC starts once, unlocks audio before permission, and plays media without a TTS fetch',async t=>{
 const h=platform(t);await h.session.start();
 assert.deepEqual(h.calls.slice(0,2),['resume','permission']);assert.ok(h.session.active);assert.equal(h.sources.length,1);assert.equal(h.sources[0].connections.length,2);
 assert.equal(h.calls.filter(call=>call.action==='start').length,1);assert.ok(h.states.includes('listening'));
 h.emit({type:'session.output_transcript.delta',event_id:'a',delta:'Oi!',start_ms:100,end_ms:300});
 assert.equal(h.captions.at(-1)[0].text,'Oi!');assert.equal(h.calls.filter(call=>typeof call==='object').length,1);
 await h.session.start();assert.equal(h.calls.filter(call=>call.action==='start').length,1);
 h.session.stop();await tick();assert.equal(h.tracks[0].stops,1);assert.equal(h.peers[0].closed,true);assert.equal(h.sources[0].disconnected,true);
});
test('native interruption mutes output immediately and leaves microphone/session active',async t=>{
 const h=platform(t);await h.session.start();h.session.interrupt();await tick();
 assert.equal(h.sources[0].connections[0].gain.value,0);assert.equal(h.tracks[0].stops,0);assert.ok(h.session.active);
 assert.ok(h.calls.some(call=>call.action==='interrupt'));
 h.emit({type:'session.input_transcript.delta',event_id:'b',delta:'Outra dúvida.',start_ms:400,end_ms:900});
 assert.equal(h.sources[0].connections[0].gain.value,1);assert.equal(h.captions.at(-1)[0].role,'user');
});
test('native permission denial makes no server session and keeps a readable error',async t=>{
 const h=platform(t,{permission:()=>Promise.reject(new DOMException('denied','NotAllowedError'))});await h.session.start();
 assert.equal(h.session.active,false);assert.equal(h.peers.length,0);assert.match(h.errors[0],/Permita o microfone/);assert.equal(h.calls.filter(call=>call.action==='start').length,0);
});
test('native late permission after stop disposes the device and cannot start a call',async t=>{
 let grant;const pending=new Promise(resolve=>grant=resolve),h=platform(t,{permission:()=>pending});
 const starting=h.session.start();h.session.stop();grant(new h.Stream());await starting;
 assert.equal(h.tracks[0].stops,1);assert.equal(h.peers.length,0);assert.equal(h.calls.filter(call=>call.action==='start').length,0);
});
test('native connection failures release microphone and surface the interruption',async t=>{
 const h=platform(t);await h.session.start();h.peers[0].connectionState='failed';emit(h.peers[0],'connectionstatechange');await tick();
 assert.equal(h.session.active,false);assert.equal(h.tracks[0].stops,1);assert.match(h.errors[0],/interrompida/);
});
