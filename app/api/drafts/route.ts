export const dynamic='force-dynamic';
import {getDevice,getD1,now,unauthorized} from '../_lib';
export async function GET(request:Request) {
 const device=await getDevice(request);if(!device)return unauthorized();
 const task=new URL(request.url).searchParams.get('task')??'';
 const row=await (await getD1()).prepare('SELECT answer,updated_at AS updatedAt FROM written_drafts WHERE profile_id=? AND task_id=?').bind(device.profileId,task).first();
 return Response.json({ok:true,draft:row},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(request:Request) {
 const device=await getDevice(request);if(!device)return unauthorized();
 const b=await request.json().catch(()=>({}));
 if(typeof b.task!=='string'||!/^bela-(science-write-\d+|ela3-practice-e3-[a-z-]+)$/.test(b.task)||typeof b.answer!=='string'||b.answer.length>20000)return Response.json({error:'Atividade inválida'},{status:400});
 await(await getD1()).prepare('INSERT INTO written_drafts(profile_id,task_id,answer,updated_at) VALUES(?,?,?,?) ON CONFLICT(profile_id,task_id) DO UPDATE SET answer=excluded.answer,updated_at=excluded.updated_at').bind(device.profileId,b.task,b.answer,now()).run();
 return Response.json({ok:true});
}
