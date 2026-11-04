import {getTutorDevice} from '../../../../lib/tutor-auth';
import {getD1,unauthorized} from '../../_lib';
import {boundedJson,json,safetyId,privateHeaders} from '../../../../lib/tutor-security';
import {readySettings,turnFor,readMedia,saveMedia} from '../../../../lib/tutor-store';
import {speak,providerMessage,speechFailureDetails} from '../../../../lib/tutor-provider';
export const dynamic='force-dynamic';
const running=new Set<string>();
export async function POST(request:Request){
 const d=await getTutorDevice(request);if(!d)return unauthorized();let body;try{body=await boundedJson(request);}catch{return json({error:'Pedido inválido.'},400);}
 const config=await readySettings(d.profileId),turn=await turnFor(d.profileId,body.turnId??'');if(!config||!turn||turn.status!=='done')return json({error:'Resposta indisponível.'},404);
 const response=(bytes:Buffer)=>new Response(new Uint8Array(bytes),{headers:{...privateHeaders,'content-type':'audio/wav'}});
 const cached=readMedia(turn.id,'voice');if(cached)return response(cached);
 if(running.has(turn.id))return json({error:'O áudio está sendo preparado.'},409);running.add(turn.id);
 try{
  const db=await getD1(),budget=await db.prepare('INSERT INTO tutor_speech_requests(turn_id,attempts) VALUES(?,1) ON CONFLICT(turn_id) DO UPDATE SET attempts=attempts+1 WHERE attempts<3').bind(turn.id).run();
  if(!Number(budget.changes))return json({error:'O áudio não ficou pronto após três tentativas. A resposta escrita continua disponível. Peça aos responsáveis para verificar o acesso à voz.'},429);
  const bytes=await speak(config.key,turn.answer,safetyId(d.profileId),request.signal);saveMedia(turn.id,'voice',bytes);return response(bytes);
 }catch(error){console.warn('tutor_voice_failure',speechFailureDetails(error));return json({error:providerMessage(error,'voz')},502);}finally{running.delete(turn.id);}
}
