import { ACCOUNT_PROFILE_ID,AUTH_COOKIE,clearFailures,failedAuth,getD1,getDevice,now,randomToken,rateLimited,safeMutation,sessionCookie,sha256,validBelaPassword } from '../_lib';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
function cookie(value:string,age:number) {return `${AUTH_COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${process.env.RAILWAY_ENVIRONMENT_ID ? '; Secure' : ''}`;}
export async function GET(request:Request) {
  const session=await getDevice(request);
  return Response.json({ok:true,authenticated:Boolean(session),name:session?'Bela':null},{headers});
}
export async function POST(request:Request) {
  if(!safeMutation(request))return Response.json({error:'Pedido inválido'},{status:403,headers});
  const body=await request.json().catch(()=>({}));
  if(body.action==='logout') {
    const token=sessionCookie(request);
    if(token){const db=await getD1();await db.prepare('DELETE FROM login_sessions WHERE token_hash=?').bind(await sha256(token)).run();}
    return Response.json({ok:true},{headers:{...headers,'Set-Cookie':cookie('',0)}});
  }
  if(body.action!=='login' || typeof body.password!=='string' || body.password.length>64)return Response.json({error:'Informe a senha da Bela'},{status:400,headers});
  if(!process.env.BELA_LOGIN_HASH || !process.env.BELA_LOGIN_SALT)return Response.json({error:'O login está sendo preparado. Tente novamente em instantes.'},{status:503,headers});
  const ip=request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const bucket='login:'+await sha256(ip);
  if(await rateLimited(bucket)||await rateLimited('login:account'))return Response.json({error:'Muitas tentativas. Aguarde 15 minutos.'},{status:429,headers});
  if(!await validBelaPassword(body.password)){await failedAuth(bucket);await failedAuth('login:account');return Response.json({error:'Senha incorreta'},{status:401,headers});}
  await clearFailures(bucket);await clearFailures('login:account');
  const db=await getD1(),token=randomToken(),time=now();
  await db.batch([
    db.prepare("INSERT OR IGNORE INTO profiles(id,name,created_at) VALUES(?,'Bela',?)").bind(ACCOUNT_PROFILE_ID,time),
    db.prepare('DELETE FROM login_sessions WHERE expires_at<=?').bind(time),
    db.prepare('INSERT INTO login_sessions(token_hash,profile_id,expires_at,created_at) VALUES(?,?,?,?)').bind(await sha256(token),ACCOUNT_PROFILE_ID,time+30*24*60*60*1000,time),
  ]);
  return Response.json({ok:true,authenticated:true,name:'Bela'},{headers:{...headers,'Set-Cookie':cookie(token,30*24*60*60)}});
}
