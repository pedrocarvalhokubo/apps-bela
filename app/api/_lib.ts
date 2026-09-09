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

export async function getDevice(request: Request): Promise<DeviceContext | null> {
  const token = request.headers.get("x-bela-device-token")?.trim();
  if (!token) return null;
  const d1 = await getD1();
  const tokenHash = await sha256(token);
  const row = await d1.prepare("SELECT profile_id AS profileId FROM devices WHERE token_hash = ?")
    .bind(tokenHash)
    .first<{ profileId: string }>();
  if (!row) return null;
  await d1.prepare("UPDATE devices SET last_seen_at = ? WHERE token_hash = ?")
    .bind(now(), tokenHash)
    .run();
  return { profileId: row.profileId, tokenHash };
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
