import {getTutorDevice} from '../../../../lib/tutor-auth';
import {unauthorized} from '../../_lib';
import {json,privateHeaders} from '../../../../lib/tutor-security';
import {turnFor,readMedia} from '../../../../lib/tutor-store';
export const dynamic='force-dynamic';
export async function GET(request:Request){const d=await getTutorDevice(request);if(!d)return unauthorized();const params=new URL(request.url).searchParams,kind=params.get('kind')==='voice'?'voice':'image',turn=await turnFor(d.profileId,params.get('id')??'');if(!turn)return json({error:'Arquivo não encontrado.'},404);const bytes=readMedia(turn.id,kind);if(!bytes)return json({error:'Arquivo ainda indisponível.'},404);return new Response(new Uint8Array(bytes),{headers:{...privateHeaders,'content-type':kind==='image'?'image/png':'audio/wav','content-disposition':'inline; filename="tutor-'+kind+(kind==='image'?'.png':'.wav')+'"'}});}
