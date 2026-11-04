"use client";
import {useEffect,useRef,useState} from 'react';
import {audioContext,recordQuestion,type Recording} from '../../lib/tutor-audio-client';
import styles from './Tutor.module.css';
export type TutorContext={subject:string;term:number;lessonId?:string;view?:string;page?:number};
export type TutorTurn={id:string;userText:string;answer:string;topic:string;suggestion:string;sourceIds:string[];flagged:boolean;status:string;visualKind:string;imageStatus:string;createdAt:number;imageUrl?:string};
type Phase='idle'|'permission'|'listening'|'thinking'|'audio'|'speaking';
function waitForVoice(signal:AbortSignal){return new Promise<void>((resolve,reject)=>{if(signal.aborted){reject(signal.reason);return;}const cancel=()=>{clearTimeout(timer);reject(signal.reason);};const timer=setTimeout(()=>{signal.removeEventListener('abort',cancel);resolve();},1000);signal.addEventListener('abort',cancel,{once:true});});}

export default function BelaTutor({context,title}:{context:TutorContext;title:string}){
 const [open,setOpen]=useState(false),[available,setAvailable]=useState<boolean|null>(null),[images,setImages]=useState(false),[turns,setTurns]=useState<TutorTurn[]>([]),[text,setText]=useState(''),[error,setError]=useState(''),[phase,setPhase]=useState<Phase>('idle'),[loop,setLoop]=useState(false),[imageBusy,setImageBusy]=useState('');
 const session=useRef(''),epoch=useRef(0),active=useRef(false),recorder=useRef<Recording|null>(null),playback=useRef<AudioBufferSourceNode|null>(null),sound=useRef<AudioContext|null>(null),abort=useRef<AbortController|null>(null),conversation=useRef<HTMLDivElement|null>(null),mounted=useRef(true),listening=useRef(false),listenRef=useRef<()=>Promise<void>>(async()=>{}),imageRequests=useRef(new Set<AbortController>());
 const contextKey=JSON.stringify(context),currentContext=useRef(context);
 function cancelImages(){for(const control of imageRequests.current)control.abort();imageRequests.current.clear();}
 function stop(){active.current=false;setLoop(false);listening.current=false;recorder.current?.cancel();recorder.current=null;playback.current?.stop();playback.current=null;setPhase('idle');}
 function unlock(){if(!sound.current||sound.current.state==='closed')sound.current=audioContext();void sound.current?.resume();}
 async function call(path:string,body:unknown,signal?:AbortSignal){const r=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:signal?AbortSignal.any([signal,AbortSignal.timeout(230000)]):AbortSignal.timeout(230000)});const data=await r.json();if(!r.ok){if(r.status===409&&String(data.error).startsWith('Abra uma nova conversa'))session.current='';throw new Error(data.error||'Não consegui conectar. Tente de novo.');}return data;}
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;active.current=false;epoch.current++;recorder.current?.cancel();playback.current?.stop();abort.current?.abort();cancelImages();void sound.current?.close();};},[]);
 useEffect(()=>{
  currentContext.current=JSON.parse(contextKey);active.current=false;listening.current=false;recorder.current?.cancel();recorder.current=null;playback.current?.stop();playback.current=null;
  ++epoch.current;abort.current?.abort();cancelImages();session.current='';const control=new AbortController();
  queueMicrotask(()=>{if(!control.signal.aborted&&mounted.current){setLoop(false);setPhase('idle');setTurns([]);setError('');setImageBusy('');setAvailable(null);}});
  fetch('/api/tutor',{signal:control.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(d=>{if(!control.signal.aborted&&mounted.current){setAvailable(d.available);setImages(d.imagesEnabled);}}).catch(e=>{if(e.name!=='AbortError'&&!control.signal.aborted&&mounted.current){setAvailable(false);setError('Não consegui consultar o tutor. Abra a matéria novamente para tentar.');}});
  return()=>control.abort();
 },[contextKey]); // Context changes end the old voice conversation before a new one starts.

 useEffect(()=>{const hidden=()=>{if(document.hidden){stop();epoch.current++;abort.current?.abort();cancelImages();setImageBusy('');}};document.addEventListener('visibilitychange',hidden);return()=>document.removeEventListener('visibilitychange',hidden);},[]);
 useEffect(()=>{conversation.current?.scrollTo({top:conversation.current.scrollHeight,behavior:'smooth'});},[turns,phase,imageBusy,open]);
 async function speak(turn:TutorTurn,version:number){
  setPhase('audio');
  const signal=abort.current?.signal?AbortSignal.any([abort.current.signal,AbortSignal.timeout(150000)]):AbortSignal.timeout(150000);
  let r:Response;
  for(;;){r=await fetch('/api/tutor/voice',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({turnId:turn.id}),signal});if(r.status!==409)break;await waitForVoice(signal);}

  if(!r.ok){const data=await r.json();throw new Error(data.error||'Não consegui tocar o áudio.');}
  const bytes=await r.arrayBuffer();if(version!==epoch.current)return;
  sound.current??=audioContext();const audio=sound.current;if(!audio)throw new Error('Toque em Ouvir para reproduzir a resposta.');await audio.resume();if(audio.state!=='running')throw new Error('Toque em Ouvir para liberar o áudio neste navegador.');
  const buffer=await audio.decodeAudioData(bytes);if(version!==epoch.current)return;
  await new Promise<void>(resolve=>{const source=audio.createBufferSource();source.buffer=buffer;source.connect(audio.destination);source.onended=()=>{if(playback.current===source)playback.current=null;resolve();};playback.current=source;setPhase('speaking');source.start();});
 }
 async function makeImage(turn:TutorTurn){
  setImageBusy(turn.id);const control=new AbortController();imageRequests.current.add(control);
  try{const result=await call('/api/tutor/image',{turnId:turn.id},control.signal);if(!control.signal.aborted&&mounted.current)setTurns(list=>list.map(t=>t.id===turn.id?{...t,imageStatus:'ready',imageUrl:result.imageUrl}:t));}
  catch(e){if(!control.signal.aborted&&mounted.current)setError(e instanceof Error?e.message:'A imagem não ficou pronta.');}
  finally{imageRequests.current.delete(control);if(!control.signal.aborted&&mounted.current)setImageBusy(id=>id===turn.id?'':id);}
 }
 async function send(payload:{text?:string;audio?:string;mime?:string}){
  const version=epoch.current;listening.current=false;setPhase('thinking');setError('');abort.current=new AbortController();
  try{
   if(!session.current){const start=await call('/api/tutor',{action:'start',context:currentContext.current},abort.current.signal);if(version!==epoch.current)return;session.current=start.sessionId;}
   const result=await call('/api/tutor',{action:'turn',sessionId:session.current,requestId:crypto.randomUUID(),...payload},abort.current.signal);
   if(version!==epoch.current||!mounted.current)return;
   const turn=result.turn as TutorTurn;setTurns(list=>[...list,turn]);setText('');
   if(turn.visualKind!=='none')void makeImage(turn);
   try{await speak(turn,version);}catch(e){if(version===epoch.current){active.current=false;setLoop(false);setError(e instanceof Error?e.message:'Leia a resposta ou toque em Ouvir.');}}
   if(version===epoch.current&&mounted.current){setPhase('idle');if(active.current)await listenRef.current();}
  }catch(e){if(version===epoch.current&&mounted.current){stop();setError(e instanceof Error?e.message:'Não consegui responder. Tente novamente.');}}
 }
 async function listen(){
  if(listening.current||!available)return;listening.current=true;setPhase('permission');setError('');unlock();const version=epoch.current;abort.current=new AbortController();const signal=abort.current.signal;
  try{const recording=await recordQuestion((audio,mime)=>{recorder.current=null;if(version===epoch.current&&mounted.current)void send({audio,mime});},message=>{if(version===epoch.current&&mounted.current){stop();setError(message);}},{context:sound.current,signal});if(version!==epoch.current||!mounted.current||!listening.current){recording.cancel();return;}recorder.current=recording;setPhase('listening');}
  catch(e){if(version===epoch.current){stop();setError(e instanceof Error&&e.name!=='NotAllowedError'?e.message:'Permita o microfone no navegador ou escreva sua pergunta.');}}
 }
 useEffect(()=>{listenRef.current=listen;});
 async function replay(turn:TutorTurn){stop();unlock();const version=++epoch.current;abort.current?.abort();abort.current=new AbortController();setError('');try{await speak(turn,version);}catch(e){if(version===epoch.current)setError(e instanceof Error?e.message:'Áudio indisponível.');}finally{if(version===epoch.current)setPhase('idle');}}
 const busy=phase!=='idle',status=phase==='listening'?'Estou ouvindo…':phase==='permission'?'Abrindo microfone…':phase==='thinking'?'Pensando na sua dúvida…':phase==='audio'?'Preparando a voz…':phase==='speaking'?'Falando… Você pode interromper para perguntar.':imageBusy?'Desenhando e revisando…':loop?'Conversa por voz ativa':'Seu ajudante de estudos';
 return <aside className={styles.widget} aria-label="Tutor da Bela">
  {open&&<section className={styles.panel} aria-labelledby="tutor-title">
   <header className={styles.header}><img src="/tutor/mascot.png" alt="Gatinho ajudante"/><div><strong id="tutor-title">Tutor da Bela</strong><small>{title}</small></div><button aria-label="Minimizar tutor" onClick={()=>setOpen(false)}>−</button></header>
   <p className={styles.disclosure}>Tutor e voz gerados por IA. Seus responsáveis podem ver as conversas.</p>
   <div className={styles.conversation} ref={conversation} aria-live="polite" aria-relevant="additions">
    {!turns.length&&<div className={styles.welcome}><span>Vamos descobrir juntos?</span><p>Pergunte sobre esta matéria. Você pode continuar olhando o material enquanto conversamos.</p>{context.view==='quiz'&&<small>Durante a prova, vou ajudar com pistas para você pensar.</small>}</div>}
    {turns.map(turn=><article className={styles.turn} key={turn.id}><p className={styles.question}><b>Você</b>{turn.userText}</p><div className={styles.answer}><b>Tutor</b><p>{turn.answer}</p><button disabled={phase==='thinking'||phase==='permission'||phase==='listening'} onClick={()=>void replay(turn)}>▶ Ouvir</button>{turn.imageStatus==='ready'&&<a href={turn.imageUrl||'/api/tutor/media?id='+turn.id+'&kind=image'} target="_blank" rel="noreferrer"><img className={styles.generated} src={turn.imageUrl||'/api/tutor/media?id='+turn.id+'&kind=image'} alt={'Imagem de estudo: '+turn.topic}/><small>Abrir imagem para ampliar</small></a>}{imageBusy===turn.id&&<p role="status">Criando e conferindo sua imagem…</p>}</div></article>)}
   </div>
   {error&&<p className={styles.error} role="alert">{error}</p>}
   {available===false?<p className={styles.setup}>Peça aos responsáveis para ativar o tutor na área dos pais.</p>:available===null?<p className={styles.setup}>Conectando ao tutor…</p>:<div className={styles.controls}>
    <div className={styles.status} role="status"><i className={phase==='listening'?styles.pulse:''}/>{status}</div>
    <div className={styles.actions}>{phase==='listening'?<button className={styles.primary} onClick={()=>recorder.current?.finish()}>Enviar minha fala</button>:<button className={styles.primary} disabled={phase==='thinking'||phase==='permission'} onClick={()=>{epoch.current++;abort.current?.abort();stop();active.current=true;setLoop(true);void listen();}}>● {phase==='speaking'||phase==='audio'?'Interromper e falar':loop?'Falar agora':'Conversar por voz'}</button>}{(busy||loop)&&<button onClick={()=>{epoch.current++;abort.current?.abort();stop();cancelImages();setImageBusy('');}}>Pausar</button>}</div>
    <form className={styles.inputRow} onSubmit={e=>{e.preventDefault();if(text.trim()&&!busy){unlock();void send({text:text.trim()});}}}><input aria-label="Sua pergunta para o tutor" placeholder="Ou escreva sua dúvida…" maxLength={3000} value={text} onChange={e=>setText(e.target.value)} disabled={busy}/><button disabled={!text.trim()||busy||Boolean(imageBusy)} aria-label="Enviar pergunta">↑</button></form>
    {images&&<button className={styles.chip} disabled={busy||Boolean(imageBusy)} onClick={()=>{setText('Crie um infográfico para me ajudar a entender o assunto desta aula, com um exemplo novo.');}}>✦ Pedir um infográfico</button>}
   </div>}
  </section>}
  <div className={styles.floatingRow}>{!open&&(loop||busy)&&<button className={styles.pauseFloating} onClick={()=>{epoch.current++;abort.current?.abort();stop();cancelImages();setImageBusy('');}}>Pausar voz</button>}<button className={styles.launcher} onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open?'Minimizar Tutor da Bela':'Abrir Tutor da Bela'}><img src="/tutor/mascot.png" alt=""/><span>{!open&&(loop||busy)?'Conversando…':'Tutor da Bela'}</span></button></div>
 </aside>;
}
