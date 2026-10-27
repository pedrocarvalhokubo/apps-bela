import {validStudy} from '../../../lib/study-merge';
export const dynamic='force-dynamic';
import {getDevice,getParentSession,getD1,sha256,unauthorized} from '../_lib';
import {officialQuestions} from '../../obmep/officialQuestions';
const validIds=new Set(officialQuestions.map(q=>q.id));
export async function POST(request:Request) {
 const session=await getDevice(request);if(!session)return unauthorized();
 const parent=await getParentSession(request);if(!parent||parent.profileId!==session.profileId)return unauthorized('Entre na área dos pais para importar.');
 const b=await request.json().catch(()=>({}));
 if(JSON.stringify(b).length>1_000_000)return Response.json({error:'Arquivo muito grande.'},{status:413});
 const db=await getD1();let sourceId:string|null=null;
 if(b.legacyToken){
  if(typeof b.legacyToken!=='string'|| !/^[a-f0-9]{48}$/.test(b.legacyToken))return Response.json({error:'Histórico antigo inválido.'},{status:400});
  const row=await db.prepare('SELECT profile_id FROM devices WHERE token_hash=?').bind(await sha256(b.legacyToken)).first<{profile_id:string}>();
  if(!row)return Response.json({error:'O vínculo antigo não foi encontrado. Os dados originais continuam preservados.'},{status:404});
  sourceId=row.profile_id;
 }
 const local=b.study && typeof b.study==='object' && !Array.isArray(b.study)?b.study:{};
 if(!validStudy(local))return Response.json({error:'Histórico de estudos inválido.'},{status:400});
 const obmep=b.obmep && typeof b.obmep==='object' && !Array.isArray(b.obmep)?b.obmep:{};
 for(const [id,value] of Object.entries(obmep)){
  const v=value as {solved?:unknown;attempts?:unknown;firstTry?:unknown};
  if(!validIds.has(id)||!v||typeof v.solved!=='boolean'||typeof v.firstTry!=='boolean'||typeof v.attempts!=='number'||!Number.isInteger(v.attempts)||v.attempts<1||v.attempts>5)return Response.json({error:'Histórico OBMEP inválido.'},{status:400});
 }
 const drafts:Record<string,string>={};
 for(const [k,v]of Object.entries(b.drafts??{}))if(/^bela-(science-write-\d+|ela3-practice-e3-[a-z-]+)$/.test(k)&&typeof v==='string'&&v.length<=20000)drafts[k]=v;
 const sourceKey=sourceId?'profile:'+sourceId:'file:'+await sha256(JSON.stringify({local,obmep,drafts}));
 if(b.action==='preview'){
  const old=sourceId?await db.prepare('SELECT state_json FROM study_state WHERE profile_id=?').bind(sourceId).first<{state_json:string}>():null;
  const attempts=sourceId?await db.prepare('SELECT COUNT(*) AS count,MAX(created_at) AS lastAt FROM attempts WHERE profile_id=?').bind(sourceId).first():null;
  const imported=await db.prepare('SELECT imported_at FROM history_imports WHERE source_key=?').bind(sourceKey).first();
  const lessons=new Set([...(Array.isArray(local.completedLessons)?local.completedLessons:[]),...(old?JSON.parse(old.state_json).completedLessons??[]:[])]);
  return Response.json({ok:true,lessons:lessons.size,attempts,alreadyImported:Boolean(imported)});
 }
 if(b.action!=='import')return Response.json({error:'Ação inválida'},{status:400});
 const changed=db.importHistory(session.profileId,sourceId,sourceKey,local,obmep,drafts);
 return Response.json({ok:true,changed,message:changed?'Histórico importado. Os originais foram preservados.':'Este histórico já foi importado.'});
}
