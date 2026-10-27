export type DeviceContext = { profileId: string; tokenHash: string };

// Cloudflare Workers currently supports PBKDF2 iteration counts up to 100,000.
// Keep this at the platform maximum so PIN hashing remains intentionally slow
// without making the parental access route fail at runtime.
export const PBKDF2_ITERATIONS = 100_000;

export const now = () => Date.now();

export { getDatabase as getD1 } from "../../lib/database";
import { getDatabase as getD1 } from "../../lib/database";

export function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashPin(pin: string, salt: string) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: new TextEncoder().encode(salt), iterations: PBKDF2_ITERATIONS },
    material,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const ACCOUNT_PROFILE_ID = "bela-account-v2";
export const AUTH_COOKIE = "bela-session-v2";
export function safeMutation(request: Request) {
  if (request.method === 'GET') return true;
  const origin=request.headers.get('origin');
  try { if(origin && new URL(origin).host !== request.headers.get('host')) return false; } catch { return false; }
  return request.headers.get('content-type')?.includes('application/json') === true;
}
export function sessionCookie(request: Request) {
  return request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(AUTH_COOKIE+'='))?.slice(AUTH_COOKIE.length+1) ?? '';
}
export async function getDevice(request: Request): Promise<DeviceContext | null> {
  if(!safeMutation(request))return null;
  const token=sessionCookie(request);
  if(!/^[a-f0-9]{48}$/.test(token))return null;
  const d1=await getD1(),tokenHash=await sha256(token);
  const row=await d1.prepare("SELECT profile_id AS profileId FROM login_sessions WHERE token_hash=? AND expires_at>?").bind(tokenHash,now()).first<{profileId:string}>();
  return row?{profileId:row.profileId,tokenHash}:null;
}
export async function rateLimited(bucket: string) {
  const db=await getD1();
  const row=await db.prepare('SELECT count,window_start FROM auth_failures WHERE bucket=?').bind(bucket).first<{count:number;window_start:number}>();
  return Boolean(row && row.count>=5 && row.window_start>now()-15*60*1000);
}
export async function failedAuth(bucket: string) {
  const db=await getD1(),time=now();
  await db.prepare(`INSERT INTO auth_failures(bucket,count,window_start) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=CASE WHEN window_start<? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<? THEN ? ELSE window_start END`).bind(bucket,time,time-15*60*1000,time-15*60*1000,time).run();
}
export async function clearFailures(bucket:string) {await (await getD1()).prepare('DELETE FROM auth_failures WHERE bucket=?').bind(bucket).run();}
export async function validBelaPassword(password: string) {
  const salt=process.env.BELA_LOGIN_SALT,hash=process.env.BELA_LOGIN_HASH;
  return Boolean(salt && hash && await hashPin(password,salt)===hash);
}

export async function getParentSession(request: Request) {
  const token = request.headers.get("x-bela-parent-token")?.trim();
  if (!token) return null;
  const d1 = await getD1();
  const tokenHash = await sha256(token);
  return d1.prepare(
    "SELECT profile_id AS profileId FROM parent_sessions WHERE token_hash = ? AND expires_at > ?",
  ).bind(tokenHash, now()).first<{ profileId: string }>();
}

export const unauthorized = (message = "Dispositivo não conectado") =>
  Response.json({ ok: false, error: message }, { status: 401 });
