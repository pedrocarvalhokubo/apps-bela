import {withTutorUsage} from '../../../../lib/tutor-costs';
import {getTutorDevice} from '../../../../lib/tutor-auth';
import {getD1,unauthorized} from '../../_lib';
import {boundedJson,json} from '../../../../lib/tutor-security';
import {readySettings,turnFor,quota,saveMedia} from '../../../../lib/tutor-store';
import {generateVisual,moderate,reviewVisual} from '../../../../lib/tutor-provider';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const device=await getTutorDevice(request);if(!device)return unauthorized();
 return withTutorUsage(device.profileId,()=>handlePost(request));
}
async function handlePost(request:Request){
 const d=await getTutorDevice(request);if(!d)return unauthorized();let body;try{body=await boundedJson(request);}catch{return json({error:'Pedido inválido.'},400);}
 const config=await readySettings(d.profileId),turn=await turnFor(d.profileId,body.turnId??'');
 if(!config?.images_enabled)return json({error:'A criação de imagens está desativada pelos responsáveis.'},403);
 if(!turn||turn.status!=='done'||turn.visual_kind==='none'||turn.flagged)return json({error:'Não há um pedido de imagem aprovado nessa conversa.'},400);
 if(turn.image_status==='ready')return json({imageUrl:'/api/tutor/media?id='+turn.id+'&kind=image'});
 const db=await getD1();const claim=await db.prepare("UPDATE tutor_turns SET image_status='pending' WHERE id=? AND image_status='requested'").bind(turn.id).run();if(!Number(claim.changes))return json({error:'A imagem já está em preparação ou não pode ser repetida. Faça um novo pedido se necessário.'},409);
 if(!await quota(d.profileId,'images',config.daily_images)){await db.prepare("UPDATE tutor_turns SET image_status='limited' WHERE id=?").bind(turn.id).run();return json({error:'O limite de imagens de hoje foi atingido.'},429);}
 try{if(await moderate(config.key,turn.visual_prompt))throw new Error('Blocked image');const bytes=await generateVisual(config.key,turn.visual_prompt,turn.visual_kind);if(!await reviewVisual(config.key,turn.visual_prompt,bytes))throw new Error('Visual review failed');saveMedia(turn.id,'image',bytes);await db.prepare("UPDATE tutor_turns SET image_status='ready' WHERE id=?").bind(turn.id).run();return json({imageUrl:'/api/tutor/media?id='+turn.id+'&kind=image'});}catch{await db.prepare("UPDATE tutor_turns SET image_status='failed' WHERE id=?").bind(turn.id).run();return json({error:'Não consegui criar a imagem agora. A explicação continua disponível.'},502);}
}
