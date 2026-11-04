import {randomUUID} from 'node:crypto';
import {getTutorDevice} from '../../../../lib/tutor-auth';
import {readySettings} from '../../../../lib/tutor-store';
import {boundedJson,json,uuid} from '../../../../lib/tutor-security';
import {liveAction,startLive} from '../../../../lib/tutor-live';
import {ProviderError,apiFetch} from '../../../../lib/tutor-provider';
import {unauthorized} from '../../_lib';
export const dynamic='force-dynamic';
const lastCheck=new Map<string,number>();
export async function POST(request:Request){
 const device=await getTutorDevice(request);if(!device)return unauthorized();
 let body;try{body=await boundedJson(request,100000);}catch{return json({error:'Pedido de voz inválido.'},400);}
 if(['status','stop','interrupt'].includes(body.action)&&uuid.test(body.sessionId??'')){
  if(body.action!=='stop'&&!await readySettings(device.profileId)){await liveAction(device.profileId,body.sessionId,'stop');return json({state:'disabled',events:[],turns:[]});}
  const result=await liveAction(device.profileId,body.sessionId,body.action);return result?json(result):json({error:'Conversa indisponível.'},404);
 }
 const config=await readySettings(device.profileId);if(!config)return json({error:'Ative o tutor na área dos pais antes de iniciar a voz ao vivo.'},503);
 if(body.action==='checkAccess'){
  if(Date.now()-(lastCheck.get(device.profileId)??0)<5000)return json({error:'Aguarde alguns segundos antes de verificar novamente.'},429);
  lastCheck.set(device.profileId,Date.now());
  try{await apiFetch('models/gpt-live-1',config.key,undefined,AbortSignal.timeout(12000));return json({available:true,model:'gpt-live-1'});}
  catch(error){return json({error:error instanceof ProviderError&&[401,403,404].includes(error.status)?'A chave salva não tem acesso ao GPT-Live 1. Confira o projeto OpenAI na área dos pais.':'Não foi possível verificar a conexão com a OpenAI agora.'},502);}
 }
 if(body.action!=='start'||typeof body.sdp!=='string'||!body.sdp.startsWith('v=0')||body.sdp.length>90000)return json({error:'Conexão de áudio inválida.'},400);
 try{return json(await startLive({id:randomUUID(),profile:device.profileId,context:body.context??{},sdp:body.sdp,config,headers:request.headers,origin:new URL(request.url).origin,signal:request.signal}));}
 catch(error){
  const message=error instanceof ProviderError?[401,403,404].includes(error.status)?'A chave salva não tem acesso ao GPT-Live 1. Confira o projeto OpenAI na área dos pais.':error.status===429?'O projeto OpenAI atingiu um limite ou está sem saldo.':'A OpenAI não conseguiu iniciar a voz ao vivo. Tente novamente.':error instanceof Error?error.message:'Não foi possível iniciar a voz ao vivo.';
  // No upstream bodies, credentials, prompts, SDP or transcripts in diagnostics.
  return json({error:message},error instanceof ProviderError?502:400);
 }
}
