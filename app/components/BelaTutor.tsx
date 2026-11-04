"use client";
import {useEffect,useRef,useState} from 'react';
import {audioContext} from '../../lib/tutor-audio-client';
import {startConversationCapture} from '../../lib/tutor-conversation-audio';
import {TutorVoiceSession,type VoicePhase} from '../../lib/tutor-voice-session';
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
 const session=useRef(''),epoch=useRef(0),mounted=useRef(true),sound=useRef<AudioContext|null>(null);
 const playback=useRef<AudioBufferSourceNode|null>(null),abort=useRef<AbortController|null>(null);
 const voice=useRef<TutorVoiceSession<TutorTurn>|null>(null),conversation=useRef<HTMLDivElement|null>(null);
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
  const control=new AbortController();imageRequests.current.add(control);setImageBusy(turn.id);
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
  cancelTextWork();setError('');setLoop(true);
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
 async function sendText(){
  const question=text.trim();if(!question)return;
  endVoice();cancelTextWork();const version=epoch.current,control=new AbortController();abort.current=control;
  setPhase('thinking');setError('');
  void unlockedAudio(control.signal).catch(()=>null);
  try{
   const turn=await submit({text:question},control.signal);
   if(version!==epoch.current||!mounted.current)return;receivedTurn(turn);setPhase('audio');
   control.signal.throwIfAborted();
   await playTurn(turn,control.signal,()=>{if(version===epoch.current&&mounted.current)setPhase('speaking');});
   if(version===epoch.current&&mounted.current)setPhase('idle');
  }catch(failure){if(version===epoch.current&&mounted.current){setPhase('error');setError(messageOf(failure,'Não consegui responder. Tente novamente.'));}}
 }
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
  queueMicrotask(()=>{if(!control.signal.aborted&&mounted.current){setLoop(false);setPhase('idle');setTurns([]);setError('');setImageBusy('');setAvailable(null);}});
  fetch('/api/tutor',{signal:control.signal}).then(response=>{if(!response.ok)throw new Error();return response.json();}).then(data=>{
   if(!control.signal.aborted&&mounted.current){setAvailable(data.available);setImages(data.imagesEnabled);}
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
 useEffect(()=>{conversation.current?.scrollTo({top:conversation.current.scrollHeight,behavior:'smooth'});},[turns,phase,imageBusy,open]);

 const busy=!['idle','error'].includes(phase);
 const status=phase==='permission'?'Aguardando permissão do microfone…':phase==='listening'?'Ouvindo… Pode falar naturalmente.':phase==='thinking'?'Entendendo e conferindo sua pergunta…':phase==='audio'?'Preparando a resposta em voz…':phase==='speaking'?'Falando… Comece a falar para interromper.':phase==='error'?'Conversa pausada. Você pode tentar novamente.':imageBusy?'Desenhando e revisando…':'Seu ajudante de estudos';
 return <aside className={styles.widget} aria-label="Tutor da Bela">
  {open&&<section className={styles.panel} aria-labelledby="tutor-title">
   <header className={styles.header}><img src="/tutor/mascot.png" alt="Gatinho ajudante"/><div><strong id="tutor-title">Tutor da Bela</strong><small>{title}</small></div><button aria-label="Minimizar tutor" onClick={()=>setOpen(false)}>−</button></header>
   <p className={styles.disclosure}>Tutor e voz gerados por IA. Seus responsáveis podem ver as conversas.</p>
   <div className={styles.conversation} ref={conversation} aria-live="polite" aria-relevant="additions">
    {!turns.length&&<div className={styles.welcome}><span>Vamos descobrir juntos?</span><p>Pergunte sobre esta matéria. Você pode continuar olhando o material enquanto conversamos.</p>{context.view==='quiz'&&<small>Durante a prova, vou ajudar com pistas para você pensar.</small>}</div>}
    {turns.map(turn=><article className={styles.turn} key={turn.id}><p className={styles.question}><b>Você</b>{turn.userText}</p><div className={styles.answer}><b>Tutor</b><p>{turn.answer}</p><button disabled={phase==='permission'} onClick={()=>void replay(turn)}>▶ Ouvir</button>{turn.imageStatus==='ready'&&<a href={turn.imageUrl||'/api/tutor/media?id='+turn.id+'&kind=image'} target="_blank" rel="noreferrer"><img className={styles.generated} src={turn.imageUrl||'/api/tutor/media?id='+turn.id+'&kind=image'} alt={'Imagem de estudo: '+turn.topic}/><small>Abrir imagem para ampliar</small></a>}{imageBusy===turn.id&&<p role="status">Criando e conferindo sua imagem…</p>}</div></article>)}
   </div>
   {error&&<p className={styles.error} role="alert">{error}</p>}
   {available===false?<p className={styles.setup}>Peça aos responsáveis para ativar o tutor na área dos pais.</p>:available===null?<p className={styles.setup}>Conectando ao tutor…</p>:<div className={styles.controls}>
    <div className={styles.status} role="status"><i className={phase==='listening'?styles.pulse:''}/>{status}</div>
    <div className={styles.actions}>
     {!loop?<button className={styles.primary} disabled={busy} onClick={()=>void startVoice()}>● Iniciar conversa por voz</button>:<>
      {phase==='listening'?<button className={styles.primary} onClick={()=>voice.current?.finish()}>Enviar minha fala</button>:<button className={styles.primary} disabled={phase==='permission'} onClick={()=>voice.current?.interrupt()}>Interromper e falar</button>}
      <button onClick={()=>{endVoice();cancelTextWork();}}>Encerrar conversa</button>
     </>}
     {!loop&&busy&&<button onClick={()=>{cancelTextWork();setPhase('idle');}}>Cancelar resposta</button>}
    </div>
    {loop&&<p className={styles.voiceHint}>O microfone continua aberto até você encerrar. Fale para interromper a resposta. Se houver eco, use fones ou o botão de interrupção. <button onClick={()=>{endVoice();cancelTextWork();}}>Usar texto</button></p>}
    <form className={styles.inputRow} onSubmit={event=>{event.preventDefault();if(text.trim()&&!busy)void sendText();}}><input aria-label="Sua pergunta para o tutor" placeholder="Ou escreva sua dúvida…" maxLength={3000} value={text} onChange={event=>setText(event.target.value)} disabled={busy}/><button disabled={!text.trim()||busy||Boolean(imageBusy)} aria-label="Enviar pergunta">↑</button></form>
    {images&&<button className={styles.chip} disabled={busy||Boolean(imageBusy)} onClick={()=>setText('Crie um infográfico para me ajudar a entender o assunto desta aula, com um exemplo novo.')}>✦ Pedir um infográfico</button>}
   </div>}
  </section>}
  <div className={styles.floatingRow}>{!open&&(loop||busy)&&<button className={styles.pauseFloating} onClick={stopAll}>Encerrar voz</button>}<button className={styles.launcher} onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open?'Minimizar Tutor da Bela':'Abrir Tutor da Bela'}><img src="/tutor/mascot.png" alt=""/><span>{!open&&(loop||busy)?'Conversando…':'Tutor da Bela'}</span></button></div>
 </aside>;
}
