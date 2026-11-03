import {createCipheriv,createDecipheriv,randomBytes,createHmac} from 'node:crypto';
export function encryptionReady(){return /^[a-f0-9]{64}$/i.test(process.env.BELA_TUTOR_ENCRYPTION_KEY??'');}
function secret(){if(!encryptionReady())throw new Error('Tutor encryption unavailable');return Buffer.from(process.env.BELA_TUTOR_ENCRYPTION_KEY!,'hex');}
export function sealKey(value:string){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',secret(),iv),encrypted=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return [iv,cipher.getAuthTag(),encrypted].map(x=>x.toString('base64url')).join('.');}
export function openKey(value:string){const [iv,tag,data]=value.split('.').map(x=>Buffer.from(x,'base64url'));const decipher=createDecipheriv('aes-256-gcm',secret(),iv);decipher.setAuthTag(tag);return Buffer.concat([decipher.update(data),decipher.final()]).toString('utf8');}
export function safetyId(profile:string){return createHmac('sha256',secret()).update(profile).digest('hex');}
export const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export const privateHeaders={'cache-control':'private, no-store','x-content-type-options':'nosniff'};
export function json(data:unknown,status=200){return Response.json(data,{status,headers:privateHeaders});}
export async function boundedJson(request:Request,max=8000){
 if(Number(request.headers.get('content-length')??0)>max)throw new Error('REQUEST_TOO_LARGE');
 const reader=request.body?.getReader();if(!reader)return {};
 const chunks:Uint8Array[]=[];let total=0;
 while(true){const {value,done}=await reader.read();if(done)break;total+=value.length;if(total>max){await reader.cancel();throw new Error('REQUEST_TOO_LARGE');}chunks.push(value);}
 return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
