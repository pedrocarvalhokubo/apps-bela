import {getDatabase} from './database';
import {mkdirSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {openKey,encryptionReady,uuid} from './tutor-security';
export type TutorSettings={profile_id:string;encrypted_key:string;enabled:number;zdr_confirmed:number;images_enabled:number;daily_turns:number;daily_images:number;custom_prompt:string;updated_at:number};
export async function settings(profile:string){return (await getDatabase()).prepare('SELECT * FROM tutor_settings WHERE profile_id=?').bind(profile).first<TutorSettings>();}
export async function readySettings(profile:string){const s=await settings(profile);if(!s?.enabled||!s.zdr_confirmed||!s.encrypted_key||!encryptionReady())return null;try{return {...s,key:openKey(s.encrypted_key)};}catch{return null;}}
export async function quota(profile:string,kind:'turns'|'images',limit:number){const db=await getDatabase(),day=new Date().toLocaleDateString('en-CA',{timeZone:'America/Bahia'});await db.prepare('INSERT OR IGNORE INTO tutor_usage(profile_id,day) VALUES(?,?)').bind(profile,day).run();const r=await db.prepare(`UPDATE tutor_usage SET ${kind}=${kind}+1 WHERE profile_id=? AND day=? AND ${kind}<?`).bind(profile,day,limit).run();return Number(r.changes)===1;}
export type TutorTurn={id:string;session_id:string;profile_id:string;user_text:string;answer:string;topic:string;suggestion:string;sources_json:string;flagged:number;status:string;visual_kind:string;visual_prompt:string;image_status:string;created_at:number};
export async function turnFor(profile:string,id:string){if(!uuid.test(id))return null;return (await getDatabase()).prepare('SELECT * FROM tutor_turns WHERE id=? AND profile_id=?').bind(id,profile).first<TutorTurn>();}
function mediaPath(id:string,kind:'image'|'voice'){if(!uuid.test(id))throw new Error('Invalid media ID');const root=process.env.RAILWAY_VOLUME_MOUNT_PATH||dirname(process.env.DB_PATH||'data/bela.sqlite');return join(root,'tutor-media',id+(kind==='image'?'.png':'.wav'));}
export function saveMedia(id:string,kind:'image'|'voice',bytes:Buffer){const path=mediaPath(id,kind);mkdirSync(dirname(path),{recursive:true,mode:0o700});writeFileSync(path,bytes,{mode:0o600});}
export function readMedia(id:string,kind:'image'|'voice'){const path=mediaPath(id,kind);return existsSync(path)?readFileSync(path):null;}
export function publicTurn(t:TutorTurn){return {id:t.id,userText:t.user_text,answer:t.answer,topic:t.topic,suggestion:t.suggestion,sourceIds:JSON.parse(t.sources_json),flagged:Boolean(t.flagged),status:t.status,visualKind:t.visual_kind,imageStatus:t.image_status,createdAt:t.created_at};}
