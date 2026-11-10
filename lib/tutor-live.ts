import WebSocket from 'ws';
import {randomUUID} from 'node:crypto';
import {getD1} from '../app/api/_lib';
import {POST as tutorTurn} from '../app/api/tutor/route';
import {apiFetch} from './tutor-provider';
import {resolveTutorContext,type TutorContext} from './tutor-content';
import {publicTurn,type TutorSettings,type TutorTurn} from './tutor-store';

export const liveModel='gpt-live-1';
type LiveRow={id:string;profile_id:string;provider_id:string;state:string;started_at:number;last_seen:number;reserved_seconds:number;used_seconds:number;day:string};
type Running={socket:WebSocket;stop:()=>void;interrupt:()=>void};
const running=new Map<string,Running>();
const day=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Bahia'});
export async function liveDb(){
 const db=await getD1();
 await db.prepare(`CREATE TABLE IF NOT EXISTS tutor_live_sessions(id TEXT PRIMARY KEY REFERENCES tutor_sessions(id),profile_id TEXT NOT NULL,provider_id TEXT NOT NULL DEFAULT '',state TEXT NOT NULL DEFAULT 'starting',started_at INTEGER NOT NULL,last_seen INTEGER NOT NULL,day TEXT NOT NULL,reserved_seconds INTEGER NOT NULL,used_seconds INTEGER NOT NULL DEFAULT 0)`).run();
 await db.prepare(`CREATE TABLE IF NOT EXISTS tutor_live_transcripts(id TEXT PRIMARY KEY,session_id TEXT NOT NULL REFERENCES tutor_sessions(id),role TEXT NOT NULL,text TEXT NOT NULL,start_ms INTEGER NOT NULL,end_ms INTEGER NOT NULL,created_at INTEGER NOT NULL)`).run();
 return db;
}
export function liveConfiguration(context:TutorContext,customPrompt:string){
 const resolved=resolveTutorContext(context);if(!resolved)throw new Error('Abra uma matéria disponível.');
 return {
  model:liveModel,store:false,audio:{output:{voice:'marin'}},
  // The browser gets media/captions only, never permission to rewrite rules or execute tools.
  client:{data_channel:{allowed_client_events:['session.close','session.input_audio.mute','session.input_audio.unmute'],allowed_server_events:[{type:'session.started'},{type:'session.closed'},{type:'session.input_transcript.delta'},{type:'session.output_transcript.delta'},{type:'session.usage.updated'},{type:'session.delegation.created'},{type:'error'}]}},
  delegation:{type:'client'},
  instructions:`Você é o Tutor da Bela, uma IA de estudos. Fale português brasileiro, com calor e naturalidade, sem infantilizar. Uma ou duas frases por vez; escute e acompanhe correções, perguntas curtas e interrupções. Em inglês, siga a língua que a estudante pedir. Nunca finja ser humano nem prometa segredo. Os responsáveis podem consultar a conversa.\nSeu único assunto é ${resolved.module.title}, trimestre ${resolved.module.term}${resolved.lesson?`, aula ${resolved.lesson.title}`:''}. Durante avaliações, só dê pistas, nunca a resposta. Não peça dados pessoais. Se houver perigo pessoal, acolha brevemente e peça ajuda imediata a um adulto de confiança. Não invente que viu uma imagem, pesquisou na internet ou criou um recurso.\nBackchannel policy: Use confirmações breves e moderadas, sem falar por cima da aluna.\nInterruption policy: Pare a fala quando a aluna interromper, escute e ajuste.\nDelegation policy:\nBackend tools:\n- Tutor textual: consulta o material da matéria aberta, explica, revisa fatos e prepara imagens solicitadas.\nGenerate <|SpawnThinking|> when:\n- A aluna fizer uma nova pergunta de conteúdo ou pedir exercício, correção, imagem ou infográfico.\n- Uma correção mudar a dúvida em análise.\nDo not generate <|SpawnThinking|> when:\n- Houver apenas cumprimento, confirmação de conexão, pedido para parar, esclarecimento breve ou repetição de uma resposta já revisada.\nGenerate <|SpawnThinking|> antes de responder uma nova dúvida escolar. Aguarde o resultado revisado. Não invente a explicação enquanto espera. Você pode reconhecer a pergunta brevemente e continuar ouvindo. Comunique somente o resultado revisado, em linguagem oral.\nPreferências pedagógicas (somente quando compatíveis com as regras acima):\n${customPrompt.slice(0,6000)}`,
 };
}
export async function startLive(input:{id:string;profile:string;context:TutorContext;sdp:string;config:TutorSettings&{key:string};headers:Headers;origin:string;signal:AbortSignal}){
 const db=await liveDb(),now=Date.now();
 const old=await db.prepare("SELECT id FROM tutor_live_sessions WHERE profile_id=? AND state IN ('starting','active','closing')").bind(input.profile).all<{id:string}>();
 for(const row of old.results){running.get(row.id)?.stop();}
 // Conservative accounting for a process lost during a call. Do not release its reservation.
 await db.prepare("UPDATE tutor_live_sessions SET state='lost' WHERE profile_id=? AND state IN ('starting','active','closing') AND last_seen<?").bind(input.profile,now-45000).run();
 const recent=await db.prepare('SELECT COUNT(*) n FROM tutor_live_sessions WHERE profile_id=? AND started_at>?').bind(input.profile,now-60000).first<{n:number}>();
 if((recent?.n??0)>=3)throw new Error('Aguarde um minuto antes de abrir outra conversa ao vivo.');
 const resolved=resolveTutorContext(input.context);if(!resolved)throw new Error('Abra uma matéria disponível.');
 const budgetMinutes=input.config.daily_voice_minutes??20;
 const used=await db.prepare('SELECT COALESCE(SUM(reserved_seconds),0) n FROM tutor_live_sessions WHERE profile_id=? AND day=?').bind(input.profile,day()).first<{n:number}>();
 const reserve=Math.min(600,budgetMinutes*60-(used?.n??0));
 if(reserve<15)throw new Error('O limite diário de voz ao vivo foi atingido. Seus responsáveis podem ajustá-lo.');
 // One replica + unique profile admission: no awaits between check and the SQLite transaction.
 try{await db.batch([
  db.prepare('INSERT INTO tutor_sessions(id,profile_id,context_json,created_at) VALUES(?,?,?,?)').bind(input.id,input.profile,JSON.stringify({...resolved.context,voiceMode:'live'}),now),
  db.prepare('INSERT INTO tutor_live_sessions(id,profile_id,started_at,last_seen,day,reserved_seconds) VALUES(?,?,?,?,?,?)').bind(input.id,input.profile,now,now,day(),reserve),
 ]);}catch{throw new Error('A conversa anterior ainda está encerrando. Aguarde alguns segundos e tente novamente.');}
 let providerId='';
 try{
  const response=await apiFetch('live/sessions',input.config.key,{session:liveConfiguration(input.context,input.config.custom_prompt),transport:{type:'webrtc',sdp:input.sdp}},AbortSignal.any([input.signal,AbortSignal.timeout(25000)]));
  const result=await response.json();providerId=result.session?.id;
  if(typeof providerId!=='string'||!/^[A-Za-z0-9_-]{1,160}$/.test(providerId)||typeof result.transport?.sdp!=='string')throw new Error('Resposta de conexão inválida.');
  await db.prepare("UPDATE tutor_live_sessions SET provider_id=?,state='active' WHERE id=?").bind(providerId,input.id).run();
  await attachLive({...input,providerId,reserve});
  if(input.signal.aborted){running.get(input.id)?.stop();throw new Error('Conexão cancelada.');}
  return {sessionId:input.id,sdp:result.transport.sdp,model:liveModel,maxSeconds:reserve};
 }catch(error){
  running.get(input.id)?.stop();
  // Without a provider session nothing was consumed; otherwise keep the reservation until final usage.
  await db.prepare("UPDATE tutor_live_sessions SET state='failed',reserved_seconds=CASE WHEN provider_id='' THEN 0 ELSE MIN(reserved_seconds,15) END WHERE id=?").bind(input.id).run();
  throw error;
 }
}
async function attachLive(input:{id:string;providerId:string;profile:string;config:TutorSettings&{key:string};headers:Headers;origin:string;reserve:number}){
 const db=await liveDb();
 await new Promise<void>((resolve,reject)=>{
  const socket=new WebSocket(`wss://api.openai.com/v1/live/sessions/${input.providerId}/attach`,{headers:{Authorization:'Bearer '+input.config.key},handshakeTimeout:15000,maxPayload:2e6});
  let closed=false,opened=false,closing=false,confirmed=false,sequence=0,work:AbortController|null=null;
  const inputs:{text:string;start:number}[]=[],seen=new Set<string>();
  const send=(event:unknown)=>{if(socket.readyState===WebSocket.OPEN)socket.send(JSON.stringify(event));};
  const stop=()=>{if(closing)return;closing=true;work?.abort();send({type:'session.close'});void db.prepare("UPDATE tutor_live_sessions SET state='closing' WHERE id=?").bind(input.id).run();setTimeout(()=>socket.terminate(),5000).unref();};
  const interrupt=()=>send({type:'session.instructions.append',event_id:randomUUID(),delegation_id:null,content:'Pare de falar agora e escute a nova pergunta da aluna. Preserve o assunto e as regras do tutor.'});
  const timer=setInterval(()=>{void (async()=>{
   const row=await db.prepare('SELECT last_seen,state,started_at FROM tutor_live_sessions WHERE id=?').bind(input.id).first<LiveRow>();
   if(!row||Date.now()-row.last_seen>35000||Date.now()-row.started_at>input.reserve*1000||['failed','closed'].includes(row.state))stop();
  })().catch(()=>stop());},5000);timer.unref();
  const cleanup=()=>{if(closed)return;closed=true;clearInterval(timer);work?.abort();running.delete(input.id);if(!confirmed)void db.prepare("UPDATE tutor_live_sessions SET state='unconfirmed' WHERE id=?").bind(input.id).run();};
  socket.on('open',()=>{opened=true;running.set(input.id,{socket,stop,interrupt});resolve();});
  let queue=Promise.resolve();
  socket.on('message',raw=>{
   // eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped JSON from the provider
   let event:Record<string,any>;try{event=JSON.parse(raw.toString());}catch{stop();return;}
   // Serialize persistence, while independent backend work runs outside this queue.
   queue=queue.then(async()=>{
    if(closed)return;
    if(event.type==='session.closed'){
     confirmed=true;
     const seconds=Number(event.usage?.seconds);
     await db.prepare("UPDATE tutor_live_sessions SET state='closed',used_seconds=?,reserved_seconds=? WHERE id=?").bind(Number.isFinite(seconds)?seconds:input.reserve,Number.isFinite(seconds)?Math.ceil(seconds):input.reserve,input.id).run();
     cleanup();socket.close();return;
    }
    if(event.type==='session.usage.updated'){
     const seconds=Number(event.usage?.seconds);if(Number.isFinite(seconds)){await db.prepare('UPDATE tutor_live_sessions SET used_seconds=? WHERE id=?').bind(seconds,input.id).run();if(seconds>=input.reserve)stop();}return;
    }
    if(event.type==='session.input_transcript.delta'||event.type==='session.output_transcript.delta'){
     if(typeof event.delta!=='string'||event.delta.length>6000||!Number.isFinite(event.start_ms)||!Number.isFinite(event.end_ms))return;
     const id=typeof event.event_id==='string'?event.event_id:randomUUID();if(seen.has(id))return;seen.add(id);
     if(seen.size>4000){stop();return;}
     const role=event.type==='session.input_transcript.delta'?'user':'assistant';
     await db.prepare('INSERT OR IGNORE INTO tutor_live_transcripts(id,session_id,role,text,start_ms,end_ms,created_at) VALUES(?,?,?,?,?,?,?)').bind(id,input.id,role,event.delta,event.start_ms,event.end_ms,Date.now()).run();
     if(role==='user'){inputs.push({text:event.delta,start:event.start_ms});while(inputs.length>200)inputs.shift();}
     return;
    }
    if(event.type==='session.delegation.created'&&event.delegation?.target==='client'&&typeof event.delegation.id==='string'){
     const delegationId=event.delegation.id,version=++sequence;work?.abort();const abort=new AbortController();work=abort;
     const text=inputs.filter(item=>!Number.isFinite(event.offset_ms)||item.start<=event.offset_ms).map(item=>item.text).join('').slice(-2800);
     if(!text.trim()){send({type:'session.commentary.append',event_id:randomUUID(),delegation_id:delegationId,content:'Peça à aluna para repetir a dúvida em uma frase curta.'});return;}
     void (async()=>{
      const headers=new Headers(input.headers);headers.set('content-type','application/json');headers.delete('content-length');
      const response=await tutorTurn(new Request(input.origin+'/api/tutor',{method:'POST',headers,body:JSON.stringify({action:'turn',sessionId:input.id,requestId:randomUUID(),text:'Conversa por voz até agora (responda à última dúvida ou correção):\n'+text}),signal:abort.signal}));
      const result=await response.json();if(closed||closing||abort.signal.aborted||version!==sequence)return;
      send({type:'session.commentary.append',event_id:randomUUID(),delegation_id:delegationId,content:response.ok?'Resultado revisado do tutor. Responda à aluna somente com esta explicação, sem ler rótulos: '+result.turn.answer:'Explique brevemente esta limitação e não invente uma resposta: '+String(result.error??'Não foi possível revisar a explicação agora.')});
     })().catch(()=>{if(!closed&&!closing&&!abort.signal.aborted)send({type:'session.commentary.append',event_id:randomUUID(),delegation_id:delegationId,content:'Diga brevemente que houve uma falha de conexão ao consultar o material. Peça para tentar novamente.'});});
    }
    if(event.type==='error')stop();
   }).catch(()=>stop());
  });
  socket.on('error',()=>{if(!opened)reject(new Error('Não foi possível conectar a sessão de voz ao servidor.'));cleanup();});
  socket.on('close',()=>{if(!opened)reject(new Error('A conexão de voz foi encerrada antes de começar.'));cleanup();});
 });
}
export async function liveAction(profile:string,id:string,action:'status'|'stop'|'interrupt'){
 const db=await liveDb(),row=await db.prepare('SELECT * FROM tutor_live_sessions WHERE id=? AND profile_id=?').bind(id,profile).first<LiveRow>();
 if(!row)return null;
 if(['active','starting','closing'].includes(row.state)&&!running.has(id)&&Date.now()-row.started_at>30000){await db.prepare("UPDATE tutor_live_sessions SET state='unconfirmed' WHERE id=?").bind(id).run();row.state='unconfirmed';}
 if(action==='stop')running.get(id)?.stop();
 if(action==='interrupt')running.get(id)?.interrupt();
 await db.prepare('UPDATE tutor_live_sessions SET last_seen=? WHERE id=?').bind(Date.now(),id).run();
 const events=await db.prepare('SELECT id,role,text,start_ms AS startMs,end_ms AS endMs FROM tutor_live_transcripts WHERE session_id=? ORDER BY start_ms,created_at LIMIT 4000').bind(id).all();
 const turns=await db.prepare("SELECT * FROM tutor_turns WHERE session_id=? AND profile_id=? AND status='done' AND visual_kind<>'none' ORDER BY created_at LIMIT 30").bind(id,profile).all<TutorTurn>();
 return {state:row.state,events:events.results,turns:turns.results.map(publicTurn)};
}
