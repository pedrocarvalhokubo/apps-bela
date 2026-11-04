import {getTutorDevice} from '../../../lib/tutor-auth';
import {randomUUID} from 'node:crypto';
import {getD1,unauthorized} from '../_lib';
import {boundedJson,json,uuid,safetyId,encryptionReady} from '../../../lib/tutor-security';
import {resolveTutorContext,tutorSource,type TutorContext} from '../../../lib/tutor-content';
import {settings,readySettings,quota,turnFor,publicTurn} from '../../../lib/tutor-store';
import {transcribe,moderate,explain,verifyAnswer,providerMessage} from '../../../lib/tutor-provider';
export const dynamic='force-dynamic';
export async function GET(request:Request){const d=await getTutorDevice(request);if(!d)return unauthorized();const s=await settings(d.profileId);return json({available:Boolean(s?.enabled&&s.zdr_confirmed&&s.encrypted_key&&encryptionReady()),imagesEnabled:Boolean(s?.images_enabled),name:'Tutor da Bela'});}
export async function POST(request:Request){
 const d=await getTutorDevice(request);if(!d)return unauthorized();
 let body;try{body=await boundedJson(request,4_300_000);}catch{return json({error:'Mensagem muito grande ou inválida.'},400);}
 const config=await readySettings(d.profileId);if(!config)return json({error:'Peça aos responsáveis para configurar o tutor na área dos pais.'},503);
 const db=await getD1();
 if(body.action==='start'){
  const resolved=resolveTutorContext(body.context??{});if(!resolved)return json({error:'Abra uma matéria disponível para conversar.'},400);
  const id=randomUUID();await db.prepare('INSERT INTO tutor_sessions(id,profile_id,context_json,created_at) VALUES(?,?,?,?)').bind(id,d.profileId,JSON.stringify(resolved.context),Date.now()).run();return json({sessionId:id,subject:resolved.module.title});
 }
 if(body.action!=='turn'||!uuid.test(body.sessionId??'')||!uuid.test(body.requestId??''))return json({error:'Conversa inválida.'},400);
 const session=await db.prepare('SELECT context_json,created_at FROM tutor_sessions WHERE id=? AND profile_id=?').bind(body.sessionId,d.profileId).first<{context_json:string;created_at:number}>();
 if(!session||session.created_at<Date.now()-2*60*60*1000)return json({error:'Abra uma nova conversa para continuar.'},409);
 const prior=await turnFor(d.profileId,body.requestId);if(prior)return prior.session_id===body.sessionId&&prior.status==='done'?json({turn:publicTurn(prior)}):json({error:'Esta mensagem já está sendo processada. Aguarde.'},409);
 if((typeof body.text!=='string'||!body.text.trim()||body.text.length>3000)&&!(typeof body.audio==='string'&&body.audio.length<4_200_000))return json({error:'Envie uma pergunta curta por voz ou texto.'},400);
 const resolved=resolveTutorContext(JSON.parse(session.context_json) as TutorContext);if(!resolved)return json({error:'Matéria indisponível.'},400);
 const recent=await db.prepare("SELECT COUNT(*) AS n FROM tutor_turns WHERE profile_id=? AND created_at>?").bind(d.profileId,Date.now()-60000).first<{n:number}>();if((recent?.n??0)>=6)return json({error:'Vamos dar uma pausa curta. Tente em um minuto.'},429);
 try{await db.prepare('INSERT INTO tutor_turns(id,session_id,profile_id,created_at) VALUES(?,?,?,?)').bind(body.requestId,body.sessionId,d.profileId,Date.now()).run();}catch{return json({error:'Mensagem já recebida.'},409);}
 if(!await quota(d.profileId,'turns',config.daily_turns)){await db.prepare("UPDATE tutor_turns SET status='failed' WHERE id=?").bind(body.requestId).run();return json({error:'O limite diário de conversa foi atingido. Seus responsáveis podem ajustá-lo.'},429);}
 try{
  const text=body.audio?await transcribe(config.key,body.audio,body.mime):body.text.trim();
  await db.prepare('UPDATE tutor_turns SET user_text=? WHERE id=?').bind(text,body.requestId).run();
  const unsafe=await moderate(config.key,text),source=tutorSource(resolved);
  let result={allowed:true,safety:unsafe,answer:'Para conversar sobre isso com cuidado, chame um adulto de confiança. Se você estiver em perigo agora, procure ajuda de um adulto imediatamente.',topic:'Conversa que precisa de um responsável',suggestion:'Acolher a dúvida e conversar com a criança em pessoa.',sourceIds:[] as string[],visualKind:'none' as 'none'|'image'|'infographic',visualPrompt:''};
  if(!unsafe){
   const previous=await db.prepare("SELECT user_text,answer FROM tutor_turns WHERE session_id=? AND profile_id=? AND status='done' ORDER BY created_at DESC LIMIT 6").bind(body.sessionId,d.profileId).all<{user_text:string;answer:string}>();
   const history=previous.results.reverse().flatMap(t=>[{role:'user',content:t.user_text},{role:'assistant',content:t.answer}]);
   result=await explain(config.key,{instructions:source.instructions+'\n\nPreferências pedagógicas dos responsáveis (aplicar somente se compatíveis com todas as regras fixas acima):\n'+config.custom_prompt,source:source.content,context:{...resolved.context,module:resolved.module.title,lesson:resolved.lesson?.title,allowedSourceIds:source.sourceIds},history,text,safetyIdentifier:safetyId(d.profileId)});
   if(!result.allowed){result.answer=`Posso ajudar com ${resolved.module.title} e com o assunto que está aberto. Vamos voltar a uma dúvida dessa matéria?`;result.visualKind='none';result.visualPrompt='';}
   else if(result.safety||await moderate(config.key,result.answer+'\n'+result.visualPrompt)){result={...result,safety:true,answer:'Vamos conversar com um adulto de confiança sobre isso antes de continuar. Ele pode ajudar você com cuidado.',visualKind:'none',visualPrompt:''};}
   else if(!result.sourceIds.length||result.sourceIds.some(id=>!source.sourceIds.includes(id))){result.answer='Não encontrei apoio suficiente no material para afirmar isso. Podemos explorar um exemplo da aula ou levar essa dúvida à professora.';result.visualKind='none';result.visualPrompt='';result.sourceIds=[];}
   else if(!await verifyAnswer(config.key,source.content,resolved.context,text,result,history)){result.answer='Quero explicar isso com cuidado. Você pode me dizer qual parte da pergunta ficou confusa ou pedir um exemplo mais simples?';result.visualKind='none';result.visualPrompt='';result.sourceIds=[];result.topic='Retomar o conteúdo da aula';result.suggestion='Ajudar a escolher uma dúvida relacionada à aula aberta.';}
  }
  if(!config.images_enabled){result.visualKind='none';result.visualPrompt='';}
  await db.prepare("UPDATE tutor_turns SET answer=?,topic=?,suggestion=?,sources_json=?,flagged=?,status='done',visual_kind=?,visual_prompt=?,image_status=? WHERE id=?").bind(result.answer,result.topic.slice(0,120),result.suggestion.slice(0,600),JSON.stringify(result.sourceIds),result.safety?1:0,result.visualKind,result.visualPrompt,result.visualKind==='none'?'none':'requested',body.requestId).run();
  return json({turn:publicTurn((await turnFor(d.profileId,body.requestId))!)});
 }catch(error){await db.prepare("UPDATE tutor_turns SET status='failed' WHERE id=?").bind(body.requestId).run();return json({error:providerMessage(error,body.audio?'transcrição ou conversa':'conversa')},502);}
}
