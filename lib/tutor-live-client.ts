import {audioContext} from './tutor-audio-client';
import type {VoicePhase} from './tutor-voice-session';
export type LiveCaption={id:string;role:'user'|'assistant';text:string;startMs:number;endMs:number};
type Options={context:unknown;onState:(phase:VoicePhase)=>void;onError:(message:string)=>void;onCaptions:(events:LiveCaption[])=>void;onSession:(id:string)=>void;onVisual?:(turn:unknown)=>void};
/** Native GPT-Live media. No recorded uploads, TTS request or project key in this module. */
export class TutorLiveSession {
 private lifetime:AbortController|null=null;
 private peer:RTCPeerConnection|null=null;
 private channel:RTCDataChannel|null=null;
 private stream:MediaStream|null=null;
 private audio:AudioContext|null=null;
 private output:MediaStreamAudioSourceNode|null=null;
 private gain:GainNode|null=null;
 private analyser:AnalyserNode|null=null;
 private poll:ReturnType<typeof setInterval>|null=null;
 private meter:ReturnType<typeof setInterval>|null=null;
 private deadline:ReturnType<typeof setTimeout>|null=null;
 private startup:ReturnType<typeof setTimeout>|null=null;
 private closing:ReturnType<typeof setTimeout>|null=null;
 private id='';private started=false;private polling=false;private muted=false;private lastOutput=0;
 private captions=new Map<string,LiveCaption>();
 private visuals=new Set<string>();
 constructor(private options:Options){}
 get active(){return this.lifetime!==null;}
 private current(control:AbortController){return this.lifetime===control&&!control.signal.aborted;}
 private async request(body:unknown,signal?:AbortSignal){
  const response=await fetch('/api/tutor/live',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:signal?AbortSignal.any([signal,AbortSignal.timeout(30000)]):AbortSignal.timeout(8000),keepalive:!signal});
  const result=await response.json();if(!response.ok)throw new Error(result.error||'A conexão de voz não ficou pronta.');return result;
 }
 private fail(error:unknown){
  if(!this.active)return;
  const names:Record<string,string>={NotAllowedError:'Permita o microfone nas configurações deste site para conversar.',NotFoundError:'Nenhum microfone foi encontrado. Conecte um ou use texto.',NotReadableError:'O microfone está ocupado ou indisponível. Feche outro app que o esteja usando.',TimeoutError:'A conexão de voz demorou demais. Confira a internet e tente novamente.'};
  const message=error instanceof Error?names[error.name]??error.message:'Não foi possível continuar a voz ao vivo.';
  this.stop();this.options.onState('error');this.options.onError(/Failed to fetch|Load failed/i.test(message)?'A conexão caiu. Confira a internet e inicie novamente.':message);
 }
 async start(){
  if(this.active)return;
  const control=new AbortController();this.lifetime=control;this.options.onState('permission');
  try{
   if(!navigator.mediaDevices?.getUserMedia||typeof RTCPeerConnection==='undefined')throw new Error('Este navegador não suporta voz ao vivo. Use Safari, Chrome, Edge ou Firefox atualizado.');
   // Unlock Web Audio in the initiating gesture, before awaiting microphone access.
   const audio=audioContext();if(!audio)throw new Error('O navegador não oferece reprodução de áudio. Use texto ou outro navegador atualizado.');
   this.audio=audio;const resumed=audio.resume();void resumed.catch(()=>{});
   this.startup=setTimeout(()=>this.fail(new Error('A permissão do microfone ou a conexão não foi concluída. Inicie novamente.')),45000);
   const permission=navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true,channelCount:1}});
   void permission.then(stream=>{if(!this.current(control))stream.getTracks().forEach(track=>track.stop());},()=>{});
   const stream=await permission;if(!this.current(control))return; // Late grants are disposed by the handler above.
   this.stream=stream;if(!stream.getAudioTracks().length)throw new Error('Nenhum microfone foi encontrado.');await resumed;if(!this.current(control))return;
   if(audio.state!=='running')throw new Error('O navegador bloqueou o áudio. Toque para iniciar novamente.');
   audio.addEventListener('statechange',()=>{if(this.current(control)&&audio.state!=='running')this.fail(new Error('O sistema interrompeu o áudio. Toque para retomar a conversa.'));});
   for(const track of stream.getAudioTracks())track.addEventListener('ended',()=>{if(this.current(control))this.fail(new Error('O microfone foi desconectado. Inicie novamente.'));});
   const peer=new RTCPeerConnection();this.peer=peer;
   const gain=audio.createGain();gain.connect(audio.destination);this.gain=gain;
   const analyser=audio.createAnalyser();analyser.fftSize=512;this.analyser=analyser;
   peer.addEventListener('track',event=>{
    if(!this.current(control))return;
    this.output?.disconnect();const remote=new MediaStream([event.track]);
    const source=audio.createMediaStreamSource(remote);source.connect(gain);source.connect(analyser);this.output=source;
    const samples=new Float32Array(analyser.fftSize);
    if(this.meter)clearInterval(this.meter);
    this.meter=setInterval(()=>{
     if(!this.current(control)||!this.started)return;
     analyser.getFloatTimeDomainData(samples);let energy=0;for(const value of samples)energy+=value*value;
     if(Math.sqrt(energy/samples.length)>.006){this.lastOutput=Date.now();this.options.onState('speaking');}
     else if(Date.now()-this.lastOutput>500)this.options.onState('listening');
    },150);
   });
   peer.addEventListener('connectionstatechange',()=>{if(this.current(control)&&['failed','closed'].includes(peer.connectionState))this.fail(new Error('A conexão de voz foi interrompida. Inicie novamente.'));});
   for(const track of stream.getAudioTracks())peer.addTrack(track,stream);
   const channel=peer.createDataChannel('oai-events');this.channel=channel;
   channel.addEventListener('message',event=>{
    if(!this.current(control))return;
    let message:Record<string,any>;try{message=JSON.parse(event.data);}catch{this.fail(new Error('O serviço enviou um evento de áudio inválido.'));return;}
    if(message.type==='session.started'){
     this.started=true;if(this.startup)clearTimeout(this.startup);this.options.onState('listening');
    }
    if(message.type==='session.closed'){this.stop();return;}
    if(message.type==='error')this.fail(new Error('O serviço de voz interrompeu esta conversa. Tente iniciar novamente.'));
    if(message.type==='session.input_transcript.delta'||message.type==='session.output_transcript.delta'){
     if(typeof message.delta!=='string'||!Number.isFinite(message.start_ms)||!Number.isFinite(message.end_ms))return;
     const role=message.type==='session.input_transcript.delta'?'user':'assistant';
     const id=typeof message.event_id==='string'?message.event_id:role+'-'+message.start_ms+'-'+message.end_ms;
     this.captions.set(id,{id,role,text:message.delta,startMs:message.start_ms,endMs:message.end_ms});
     if(this.captions.size>4000){this.fail(new Error('A conversa ficou longa. Inicie outra para continuar.'));return;}
     this.options.onCaptions([...this.captions.values()].sort((a,b)=>a.startMs-b.startMs));
     if(role==='user'&&this.muted){gain.gain.value=1;this.muted=false;}
    }
   });
   channel.addEventListener('close',()=>{if(this.current(control))this.fail(new Error('A sessão de voz foi encerrada. Inicie novamente.'));});
   const offer=await peer.createOffer();if(!this.current(control))return;await peer.setLocalDescription(offer);
   if(peer.iceGatheringState!=='complete')await new Promise<void>((resolve,reject)=>{
    const timeout=setTimeout(()=>finish(new Error('Não foi possível negociar a conexão de voz. Confira a internet.')),10000);
    const change=()=>{if(peer.iceGatheringState==='complete')finish();};
    const cancel=()=>finish(control.signal.reason);
    const finish=(failure?:unknown)=>{clearTimeout(timeout);peer.removeEventListener('icegatheringstatechange',change);control.signal.removeEventListener('abort',cancel);if(failure)reject(failure);else resolve();};
    peer.addEventListener('icegatheringstatechange',change);control.signal.addEventListener('abort',cancel,{once:true});change();
   });
   if(!this.current(control))return;
   this.options.onState('thinking');
   const result=await this.request({action:'start',sdp:peer.localDescription?.sdp,context:this.options.context},control.signal);
   if(!this.current(control)){void this.request({action:'stop',sessionId:result.sessionId}).catch(()=>{});return;}
   this.id=result.sessionId;this.options.onSession(this.id);
   await peer.setRemoteDescription({type:'answer',sdp:result.sdp});
   if(!this.current(control))return;
   this.deadline=setTimeout(()=>{if(this.current(control))this.stop();},Math.min(600,result.maxSeconds)*1000);
   this.poll=setInterval(()=>{if(!this.current(control)||this.polling)return;this.polling=true;
    void this.request({action:'status',sessionId:this.id},control.signal).then(status=>{if(!this.current(control))return;if(!['active','starting'].includes(status.state)){this.fail(new Error('A conversa ao vivo foi encerrada pelo servidor. Você pode iniciar outra.'));return;}for(const turn of status.turns??[]){if(typeof turn.id==='string'&&!this.visuals.has(turn.id)){this.visuals.add(turn.id);this.options.onVisual?.(turn);}}}).catch(error=>{if(this.current(control))this.fail(error);}).finally(()=>{this.polling=false;});
   },10000);
  }catch(error){if(this.current(control))this.fail(error);}
 }
 stop(){
  const control=this.lifetime;if(!control)return;this.lifetime=null;control.abort();
  if(this.poll)clearInterval(this.poll);if(this.meter)clearInterval(this.meter);if(this.deadline)clearTimeout(this.deadline);if(this.startup)clearTimeout(this.startup);
  // Stop transmitting the microphone immediately; let the event channel finalize usage briefly.
  this.stream?.getTracks().forEach(track=>track.stop());this.stream=null;
  const channel=this.channel,peer=this.peer;this.channel=null;this.peer=null;
  if(channel?.readyState==='open')try{channel.send(JSON.stringify({type:'session.close'}));}catch{}
  if(this.id)void this.request({action:'stop',sessionId:this.id}).catch(()=>{});
  const close=()=>{channel?.close();peer?.close();};
  if(channel||peer){this.closing=setTimeout(close,1500);channel?.addEventListener('message',event=>{try{if(JSON.parse(event.data).type==='session.closed'){if(this.closing)clearTimeout(this.closing);close();}}catch{};});}else close();
  this.output?.disconnect();this.gain?.disconnect();this.analyser?.disconnect();const audio=this.audio;this.audio=null;void audio?.close();
  this.options.onState('idle');
 }
 interrupt(){
  if(!this.active||!this.id)return;this.muted=true;if(this.gain)this.gain.gain.value=0;
  void this.request({action:'interrupt',sessionId:this.id},this.lifetime!.signal).catch(error=>this.fail(error));this.options.onState('listening');
 }
 finish(){/* Native streaming has no recorded message to submit. */}
}
