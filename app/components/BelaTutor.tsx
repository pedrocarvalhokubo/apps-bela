"use client";
import {useEffect,useRef,useState} from 'react';
import {audioContext} from '../../lib/tutor-audio-client';
import {startConversationCapture} from '../../lib/tutor-conversation-audio';
import {TutorVoiceSession,type VoicePhase} from '../../lib/tutor-voice-session';
import {TutorLiveSession,type LiveCaption} from '../../lib/tutor-live-client';
import styles from './Tutor.module.css';

export type TutorContext={subject:string;term:number;lessonId?:string;view?:string;page?:number};
export type TutorTurn={id:string;userText:string;answer:string;topic:string;suggestion:string;sourceIds:string[];flagged:boolean;status:string;visualKind:string;imageStatus:string;createdAt:number;imageUrl?:string};

function voiceRetryDelay(signal:AbortSignal){
 return new Promise<void>((resolve,reject)=>{
  signal.throwIfAborted();
  const cancel=()=>{clearTimeout(timer);reject(signal.reason);};
  const timer=setTimeout(()=>{signal.removeEventListener('abort',cancel);resolve();},1000);
  signal.addEventListener('abort',cancel,{once:true});
 });
}
function messageOf(error:unknown,fallback:string){
 if(error instanceof Error){
  if(error.name==='TimeoutError')return 'A conexão demorou demais. Tente iniciar novamente ou escreva sua pergunta.';
  if(error.name==='NotAllowedError')return 'Permita o microfone nas configurações deste site para conversar. Você também pode escrever sua pergunta.';
  if(error.name==='NotFoundError')return 'Não encontrei um microfone. Conecte um ou escreva sua pergunta.';
  if(error.name==='NotReadableError')return 'O microfone está ocupado ou indisponível. Feche outros apps que estejam usando-o e tente novamente.';
  return error.message||fallback;
 }
 return fallback;
}

export default function BelaTutor({context,title}:{context:TutorContext;title:string}){
 const [open,setOpen]=useState(false),[available,setAvailable]=useState<boolean|null>(null),[images,setImages]=useState(false);
 const [turns,setTurns]=useState<TutorTurn[]>([]),[text,setText]=useState(''),[error,setError]=useState('');
 const [phase,setPhase]=useState<VoicePhase>('idle'),[loop,setLoop]=useState(false),[imageBusy,setImageBusy]=useState('');
 const [native,setNative]=useState(false),[captions,setCaptions]=useState<LiveCaption[]>([]);
 const [connectionCheck,setConnectionCheck]=useState(''),[menu,setMenu]=useState(false);
 const session=useRef(''),epoch=useRef(0),mounted=useRef(true),sound=useRef<AudioContext|null>(null);
 const playback=useRef<AudioBufferSourceNode|null>(null),abort=useRef<AbortController|null>(null);
 const voice=useRef<TutorVoiceSession<TutorTurn>|TutorLiveSession|null>(null),conversation=useRef<HTMLDivElement|null>(null);
 const imageRequests=useRef(new Set<AbortController>()),contextKey=JSON.stringify(context),currentContext=useRef(context);

 function cancelImages(){for(const control of imageRequests.current)control.abort();imageRequests.current.clear();}
 function stopPlayback(){const source=playback.current;playback.current=null;if(source){try{source.stop();}catch{/* Already ended. */}}}
 function cancelTextWork(){epoch.current++;abort.current?.abort();abort.current=null;stopPlayback();}
 function endVoice(){voice.current?.stop();voice.current=null;if(mounted.current){setLoop(false);setPhase('idle');}}
 function stopAll(){endVoice();cancelTextWork();cancelImages();if(mounted.current)setImageBusy('');}
 function audioForConversation(){
  if(!sound.current||sound.current.state==='closed')sound.current=audioContext();
  const audio=sound.current;
  if(!audio)throw new Error('Este navegador não oferece o áudio necessário. Abra em Safari, Chrome, Edge ou Firefox atualizado, ou use texto.');
  return audio;
 }
 async function unlockedAudio(signal:AbortSignal=AbortSignal.timeout(10000)){
  const audio=audioForConversation();
  const bounded=AbortSignal.any([signal,AbortSignal.timeout(10000)]);
  await new Promise<void>((resolve,reject)=>{
   const cancel=()=>reject(bounded.reason);
   bounded.addEventListener('abort',cancel,{once:true});
   const finished=()=>bounded.removeEventListener('abort',cancel);
   if(bounded.aborted){finished();reject(bounded.reason);return;}
   audio.resume().then(()=>{finished();resolve();},failure=>{finished();reject(failure);});
  });
  if(audio.state!=='running')throw new Error('O navegador pausou o áudio. Toque em Iniciar conversa para liberar novamente.');
  return audio;
 }
 async function call(path:string,body:unknown,signal:AbortSignal){
  const response=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.any([signal,AbortSignal.timeout(230000)])});
  const data=await response.json();signal.throwIfAborted();
  if(!response.ok){
   if(response.status===409&&String(data.error).startsWith('Abra uma nova conversa'))session.current='';
   throw new Error(data.error||'Não consegui conectar. Tente de novo.');
  }
  return data;
 }
 async function submit(payload:{text?:string;audio?:string;mime?:string},signal:AbortSignal){
  if(!session.current){
   const start=await call('/api/tutor',{action:'start',context:currentContext.current},signal);
   signal.throwIfAborted();session.current=start.sessionId;
  }
  const result=await call('/api/tutor',{action:'turn',sessionId:session.current,requestId:crypto.randomUUID(),...payload},signal);
  signal.throwIfAborted();return result.turn as TutorTurn;
 }
 async function playTurn(turn:TutorTurn,signal:AbortSignal,onSpeaking:()=>void){
  const bounded=AbortSignal.any([signal,AbortSignal.timeout(150000)]);
  let response:Response;
  for(;;){
   response=await fetch('/api/tutor/voice',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({turnId:turn.id}),signal:bounded});
   if(response.status!==409)break;
   await voiceRetryDelay(bounded);
  }
  if(!response.ok){const data=await response.json();throw new Error(data.error||'Não consegui tocar o áudio. A resposta está disponível por escrito.');}
  const bytes=await response.arrayBuffer();bounded.throwIfAborted();
  const audio=await unlockedAudio(bounded);bounded.throwIfAborted();
  const buffer=await audio.decodeAudioData(bytes);bounded.throwIfAborted();
  await new Promise<void>((resolve,reject)=>{
   const source=audio.createBufferSource();source.buffer=buffer;source.connect(audio.destination);
   let settled=false;
   const timer=setTimeout(()=>{source.onended=null;try{source.stop();}catch{/* Already ended. */}finish(new Error('O navegador interrompeu a reprodução. Toque em Ouvir para tentar novamente.'));},Math.min(180000,buffer.duration*1000+5000));
   const finish=(failure?:unknown)=>{
    if(settled)return;settled=true;clearTimeout(timer);signal.removeEventListener('abort',cancel);source.onended=null;
    if(playback.current===source)playback.current=null;
    source.disconnect();if(failure)reject(failure);else resolve();
   };
   const cancel=()=>{source.onended=null;try{source.stop();}catch{/* Not started or ended. */}finish(signal.reason||new DOMException('Interrupted','AbortError'));};
   source.onended=()=>finish();signal.addEventListener('abort',cancel,{once:true});
   if(signal.aborted){cancel();return;}
   playback.current=source;
   try{onSpeaking();source.start();}catch(failure){finish(failure);}
  });
 }
 async function makeImage(turn:TutorTurn){
  const control=new AbortController();imageRequests.current.add(control);setImageBusy(turn.id);setOpen(true);setMenu(false);
  try{
   const result=await call('/api/tutor/image',{turnId:turn.id},control.signal);
   if(!control.signal.aborted&&mounted.current)setTurns(list=>list.map(item=>item.id===turn.id?{...item,imageStatus:'ready',imageUrl:result.imageUrl}:item));
  }catch(failure){if(!control.signal.aborted&&mounted.current)setError(messageOf(failure,'A imagem não ficou pronta.'));}
  finally{imageRequests.current.delete(control);if(!control.signal.aborted&&mounted.current)setImageBusy(id=>id===turn.id?'':id);}
 }
 function receivedTurn(turn:TutorTurn){
  if(!mounted.current)return;
  setTurns(list=>list.some(item=>item.id===turn.id)?list:[...list,turn]);setText('');
  if(turn.visualKind!=='none')void makeImage(turn);
 }
 async function startVoice(){
  if(!available||voice.current?.active)return;
  cancelTextWork();setError('');setMenu(false);setLoop(true);
  if(native){
   setCaptions([]);
   const live=new TutorLiveSession({context:currentContext.current,onSession:id=>{session.current=id;},onState:state=>{if(mounted.current&&voice.current===live){setPhase(state);if(state==='idle')setLoop(false);}},onError:message=>{if(mounted.current&&voice.current===live){setLoop(false);setError(message);}},onCaptions:events=>{if(mounted.current&&voice.current===live)setCaptions(events);},onVisual:turn=>{if(mounted.current&&voice.current===live)receivedTurn(turn as TutorTurn);}});
   voice.current=live;await live.start();return;
  }
  const controller=new TutorVoiceSession<TutorTurn>({
   openCapture:options=>startConversationCapture({...options,context:audioForConversation()}),
   submit:(audio,mime,signal)=>submit({audio,mime},signal),
   play:playTurn,
   onTurn:turn=>{if(voice.current===controller)receivedTurn(turn);},
   onState:state=>{if(mounted.current&&voice.current===controller)setPhase(state);},
   onError:message=>{if(mounted.current&&voice.current===controller){setLoop(false);setError(message);}},
  });
  voice.current=controller;
  await controller.start();
 }
 async function sendText(question=text.trim()){
  if(!question)return;setOpen(true);setMenu(false);
  endVoice();cancelTextWork();const version=epoch.current,control=new AbortController();abort.current=control;
  setPhase('thinking');setError('');
  try{
   const turn=await submit({text:question},control.signal);
   if(version!==epoch.current||!mounted.current)return;receivedTurn(turn);
   if(version===epoch.current&&mounted.current)setPhase('idle');
  }catch(failure){if(version===epoch.current&&mounted.current){setPhase('error');setError(messageOf(failure,'Não consegui responder. Tente novamente.'));}}
 }
 async function requestInfographic(){
  if(imageBusy)return;
  const recent=captions.filter(item=>item.role==='user').slice(-4).map(item=>item.text).join(' ').slice(-900);
  const question='Crie um infográfico para me ajudar a entender o assunto desta aula, com um exemplo novo.'+(recent?' Use como referência o assunto das minhas últimas falas: '+recent:'');
  if(!loop){await sendText(question);return;}
  // A visual request is independent of the open voice transport.
  const control=new AbortController();imageRequests.current.add(control);setImageBusy('request');setOpen(true);setMenu(false);setError('');
  try{const turn=await submit({text:question},control.signal);if(!control.signal.aborted&&mounted.current)receivedTurn(turn);}
  catch(failure){if(!control.signal.aborted&&mounted.current)setError(messageOf(failure,'Não consegui preparar o infográfico.'));}
  finally{imageRequests.current.delete(control);if(!control.signal.aborted&&mounted.current)setImageBusy(id=>id==='request'?'':id);}
 }
 function useText(){endVoice();cancelTextWork();setOpen(true);setMenu(false);}
 async function replay(turn:TutorTurn){
  endVoice();cancelTextWork();const version=epoch.current,control=new AbortController();abort.current=control;
  setPhase('audio');setError('');
  try{
   await unlockedAudio(control.signal);control.signal.throwIfAborted();
   await playTurn(turn,control.signal,()=>{if(version===epoch.current&&mounted.current)setPhase('speaking');});
   if(version===epoch.current&&mounted.current)setPhase('idle');
  }catch(failure){if(version===epoch.current&&mounted.current){setPhase('error');setError(messageOf(failure,'Áudio indisponível.'));}}
 }

 useEffect(()=>{
  mounted.current=true;
  return()=>{mounted.current=false;voice.current?.stop();epoch.current++;abort.current?.abort();cancelImages();stopPlayback();void sound.current?.close();};
 },[]);
 useEffect(()=>{
  currentContext.current=JSON.parse(contextKey);voice.current?.stop();voice.current=null;epoch.current++;
  abort.current?.abort();cancelImages();stopPlayback();session.current='';const control=new AbortController();
  queueMicrotask(()=>{if(!control.signal.aborted&&mounted.current){setLoop(false);setPhase('idle');setTurns([]);setCaptions([]);setError('');setImageBusy('');setAvailable(null);setMenu(false);}});
  fetch('/api/tutor',{signal:control.signal}).then(response=>{if(!response.ok)throw new Error();return response.json();}).then(data=>{
   if(!control.signal.aborted&&mounted.current){setAvailable(data.available);setImages(data.imagesEnabled);setNative(data.voiceMode==='live');}
  }).catch(failure=>{if(failure.name!=='AbortError'&&!control.signal.aborted&&mounted.current){setAvailable(false);setError('Não consegui consultar o tutor. Abra a matéria novamente para tentar.');}});
  return()=>control.abort();
 },[contextKey]);
 useEffect(()=>{
  const stop=()=>{
   voice.current?.stop();voice.current=null;epoch.current++;abort.current?.abort();cancelImages();stopPlayback();
   if(mounted.current){setLoop(false);setPhase('idle');setImageBusy('');}
  };
  const hidden=()=>{if(document.hidden)stop();};
  const offline=()=>{stop();if(mounted.current){setPhase('error');setError('A conexão caiu. Quando a internet voltar, toque em Iniciar conversa.');}};
  document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',stop);window.addEventListener('offline',offline);
  return()=>{document.removeEventListener('visibilitychange',hidden);window.removeEventListener('pagehide',stop);window.removeEventListener('offline',offline);};
 },[]);
 useEffect(()=>{conversation.current?.scrollTo({top:conversation.current.scrollHeight,behavior:'smooth'});},[turns,captions,phase,imageBusy,open]);

 const busy=!['idle','error'].includes(phase);
 const status=phase==='permission'?'Permita o microfone para começar':phase==='listening'?'Ouvindo você…':phase==='thinking'?'Pensando com carinho…':phase==='audio'?'Preparando a voz…':phase==='speaking'?'Falando… Pode me interromper':phase==='error'?'Vamos tentar de novo?':imageBusy?'Preparando seu infográfico…':'Toque para conversar';
 const mascotState=imageBusy?'working':phase==='thinking'||phase==='audio'?'working':phase==='speaking'?'speaking':phase==='listening'?'listening':'idle';
 const mascotLabel=loop?(phase==='listening'&&!native?'Enviar minha fala':'Interromper e falar'):'Conversar por voz';
 function touchMascot(){if(loop){if(phase==='listening'&&!native)voice.current?.finish();else voice.current?.interrupt();}else void startVoice();}
 return <aside className={styles.widget} aria-label="Ajudante de estudos">
  {open&&<section className={styles.panel} aria-labelledby="tutor-title">
   <header className={styles.header}><div><small>VAMOS APRENDER</small><strong id="tutor-title">{title}</strong></div><button aria-label="Fechar chat" onClick={()=>setOpen(false)}>×</button></header>
   <p className={styles.disclosure}>Ajudante e voz de IA. Seus responsáveis podem ver as conversas.</p>
   <div className={styles.conversation} ref={conversation} aria-live="polite" aria-relevant="additions">
    {!turns.length&&!captions.length&&<div className={styles.welcome}><span>Uma dúvida de cada vez ✨</span><p>Escreva sobre esta matéria ou toque no gatinho para conversar. Estou aqui para pensar com você.</p>{context.view==='quiz'&&<small>Durante a prova, vou ajudar com pistas para você pensar.</small>}</div>}
    {captions.length>0&&<div className={styles.turn} aria-label="Transcrição da conversa ao vivo">{captions.reduce<{role:string;text:string;id:string;endMs:number}[]>((groups,item)=>{const previous=groups.at(-1);if(previous&&previous.role===item.role&&item.startMs-previous.endMs<2500){previous.text+=item.text;previous.endMs=item.endMs;}else groups.push({...item});return groups;},[]).map(item=><p className={item.role==='user'?styles.question:styles.answer} key={item.id}><b>{item.role==='user'?'Você':'Gatinho'}</b>{item.text}</p>)}</div>}
    {turns.map(turn=><article className={styles.turn} key={turn.id}><p className={styles.question}><b>Você</b>{turn.userText}</p><div className={styles.answer}><b>Gatinho</b><p>{turn.answer}</p><button disabled={phase==='permission'} onClick={()=>void replay(turn)}>▶ Ouvir</button>{turn.imageStatus==='ready'&&<a href={turn.imageUrl||'/api/tutor/media?id='+turn.id+'&kind=image'} target="_blank" rel="noreferrer"><img className={styles.generated} src={turn.imageUrl||'/api/tutor/media?id='+turn.id+'&kind=image'} alt={'Imagem de estudo: '+turn.topic}/><small>Abrir imagem para ampliar</small></a>}{imageBusy===turn.id&&<p className={styles.drawing} role="status"><span aria-hidden="true">✦</span> Desenhando e conferindo as ideias…</p>}</div></article>)}
    {imageBusy==='request'&&<p className={styles.drawing} role="status">✦ Organizando as ideias para o infográfico…</p>}
    {phase==='thinking'&&!loop&&<p className={styles.drawing} role="status">✦ Pensando na sua pergunta…</p>}
   </div>
   {available===false?<p className={styles.setup}>Peça aos responsáveis para ativar o ajudante na área dos pais.</p>:<div className={styles.controls}>
    {loop?<div className={styles.chatVoice}><span>● A conversa por voz continua</span><button onClick={useText}>Digitar</button></div>:<form className={styles.inputRow} onSubmit={event=>{event.preventDefault();if(text.trim()&&!busy)void sendText();}}><input aria-label="Sua pergunta para o tutor" placeholder="Escreva sua dúvida…" maxLength={3000} value={text} onChange={event=>setText(event.target.value)} disabled={busy}/><button disabled={!text.trim()||busy||Boolean(imageBusy)} aria-label="Enviar pergunta">↑</button></form>}
    {images&&<button className={styles.chip} disabled={(!loop&&busy)||Boolean(imageBusy)} onClick={()=>void requestInfographic()}>✦ Pedir um infográfico</button>}
   </div>}
  </section>}
  {error&&<div className={styles.error} role="alert"><p>{error}</p><button onClick={useText}>Escrever minha pergunta</button>{native&&available&&<button onClick={()=>{setConnectionCheck('Verificando…');void call('/api/tutor/live',{action:'checkAccess'},new AbortController().signal).then(()=>setConnectionCheck('A conexão está disponível. Toque no gatinho para tentar novamente.')).catch(failure=>setConnectionCheck(messageOf(failure,'Não foi possível verificar agora.')));}}>Verificar conexão</button>}{connectionCheck&&<p role="status">{connectionCheck}</p>}</div>}
  {menu&&<div className={styles.menu} role="group" aria-label="Opções de estudo" onKeyDown={event=>{if(event.key==='Escape')setMenu(false);}}>
   <span>COMO VAMOS ESTUDAR?</span>
   <button onClick={useText}>✎ Escrever uma pergunta</button>
   <button onClick={()=>{setOpen(true);setMenu(false);}}>☷ Acompanhar o chat</button>
   {images&&<button disabled={(!loop&&busy)||Boolean(imageBusy)} onClick={()=>void requestInfographic()}>✦ Pedir um infográfico</button>}
   {loop&&<button onClick={()=>{stopAll();setMenu(false);}}>Encerrar conversa</button>}
  </div>}
  <div className={styles.dock}>
   <div className={styles.bubble} role="status">{available===null?'Só um instante…':available===false?'Vamos configurar?':status}{loop&&<small>Voz de IA · responsáveis podem acompanhar</small>}</div>
   <div className={styles.floatingRow}>
    <button className={styles.menuToggle} aria-label="Opções do gatinho" aria-expanded={menu} onClick={()=>setMenu(!menu)}>•••</button>
    <button className={styles.launcher} data-state={mascotState} onClick={touchMascot} disabled={available!==true||(!loop&&busy)||phase==='permission'} aria-label={mascotLabel} aria-pressed={loop} aria-describedby="cat-help"><span className={styles.halo} aria-hidden="true"/><img src="/tutor/mascot.png" alt="Gatinho ajudante" draggable={false}/><span className={styles.sparkle} aria-hidden="true">✦</span></button>
    {(loop||busy)&&<button className={styles.stop} onClick={stopAll} aria-label={loop?'Encerrar conversa':'Cancelar resposta'} title={loop?'Encerrar conversa':'Cancelar resposta'}>■</button>}
   </div>
   <span id="cat-help" className={styles.srOnly}>Toque no gatinho para conversar por voz. Durante a resposta, toque para interromper. Abra as opções para digitar ou pedir um infográfico.</span>
  </div>
 </aside>;
}
