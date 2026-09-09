import { getD1, now, randomToken, sha256, unauthorized } from "../_lib";

export async function POST(request: Request) {
  const d1 = await getD1();
  const body = await request.json().catch(() => ({})) as { action?: string; code?: string; label?: string };
  const token = randomToken();
  const tokenHash = await sha256(token);
  const timestamp = now();

  if (body.action === "pair") {
    const code = body.code?.trim().toUpperCase();
    if (!code) return unauthorized("Código de pareamento ausente");
    const codeHash = await sha256(code);
    if (!d1.redeemPair(codeHash, tokenHash, body.label ?? "Aparelho da Bela")) {
      return unauthorized("Este link expirou ou já foi utilizado");
    }
    return Response.json({ ok: true, token, paired: true, profileName: "Bela" });
  }

  const profileId = crypto.randomUUID();
  await d1.batch([
    d1.prepare("INSERT INTO profiles (id, name, created_at) VALUES (?, 'Bela', ?)")
      .bind(profileId, timestamp),
    d1.prepare("INSERT INTO devices (token_hash, profile_id, label, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)")
      .bind(tokenHash, profileId, body.label ?? "Primeiro aparelho", timestamp, timestamp),
  ]);
  return Response.json({ ok: true, token, paired: false, profileName: "Bela" });
}
