export const dynamic='force-dynamic';
import {
  getD1,
  failedAuth, rateLimited, clearFailures, validBelaPassword,
  getDevice,
  getParentSession,
  hashPin,
  now,
  randomCode,
  randomToken,
  sha256,
  unauthorized,
} from "../_lib";

const PIN_RE = /^\d{4,6}$/;

export async function GET(request: Request) {
  const device = await getDevice(request);
  if (!device) return unauthorized();
  const d1 = await getD1();
  const row = await d1.prepare("SELECT 1 AS present FROM parent_settings WHERE profile_id = ?")
    .bind(device.profileId).first<{ present: number }>();
  return Response.json({ ok: true, hasPin: Boolean(row) });
}

async function createSession(profileId: string) {
  const d1 = await getD1();
  const token = randomToken();
  const tokenHash = await sha256(token);
  const timestamp = now();
  await d1.prepare(
    "INSERT INTO parent_sessions (token_hash, profile_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
  ).bind(tokenHash, profileId, timestamp + 15 * 60 * 1000, timestamp).run();
  return token;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { action?: string; pin?: string; setupCode?: string };
  const device = await getDevice(request);
  if (!device) return unauthorized();
  const d1 = await getD1();

  if (body.action === "setup-pin") {
    if (!body.pin || !PIN_RE.test(body.pin)) {
      return Response.json({ ok: false, error: "Use um PIN de 4 a 6 números" }, { status: 400 });
    }
    const existing = await d1.prepare("SELECT 1 AS present FROM parent_settings WHERE profile_id = ?")
      .bind(device.profileId).first();
    if (existing) return Response.json({ ok: false, error: "O PIN já foi configurado" }, { status: 409 });
    const bucket='parent-setup:'+device.profileId;
    if(await rateLimited(bucket))return Response.json({error:'Muitas tentativas. Aguarde 15 minutos.'},{status:429});
    const setup=(body.setupCode??'').replace(/[-\s]/g,'').toUpperCase();
    if(!process.env.BELA_PARENT_SETUP_HASH || await sha256(setup)!==process.env.BELA_PARENT_SETUP_HASH){await failedAuth(bucket);return Response.json({error:'Código de configuração inválido.'},{status:401});}
    if(await validBelaPassword(body.pin))return Response.json({error:'Escolha um PIN diferente da senha da Bela.'},{status:400});
    await clearFailures(bucket);
    const salt = randomToken();
    const pinHash = await hashPin(body.pin, salt);
    await d1.prepare(
      "INSERT INTO parent_settings (profile_id, pin_salt, pin_hash, updated_at) VALUES (?, ?, ?, ?)",
    ).bind(device.profileId, salt, pinHash, now()).run();
    return Response.json({ ok: true, parentToken: await createSession(device.profileId) });
  }

  if (body.action === "verify-pin") {
    if (!body.pin || !PIN_RE.test(body.pin)) return unauthorized("PIN inválido");
    const lock = await d1.prepare("SELECT count, locked_until FROM pin_failures WHERE profile_id = ?")
      .bind(device.profileId).first<{count: number; locked_until: number}>();
    if (lock && lock.locked_until > now()) return Response.json({ error: "Muitas tentativas. Aguarde 15 minutos." }, { status: 429 });
    const row = await d1.prepare(
      "SELECT pin_salt AS pinSalt, pin_hash AS pinHash FROM parent_settings WHERE profile_id = ?",
    ).bind(device.profileId).first<{ pinSalt: string; pinHash: string }>();
    if (!row || await hashPin(body.pin, row.pinSalt) !== row.pinHash) {
      await d1.prepare(`INSERT INTO pin_failures (profile_id, count, locked_until) VALUES (?, 1, 0)
        ON CONFLICT(profile_id) DO UPDATE SET
        count = CASE WHEN pin_failures.locked_until > 0 AND pin_failures.locked_until <= ? THEN 1 ELSE pin_failures.count + 1 END,
        locked_until = CASE WHEN pin_failures.locked_until > 0 AND pin_failures.locked_until <= ? THEN 0 WHEN pin_failures.count + 1 >= 5 THEN ? ELSE 0 END`)
        .bind(device.profileId, now(), now(), now() + 15 * 60 * 1000).run();
      return unauthorized("PIN incorreto");
    }
    await d1.prepare("DELETE FROM pin_failures WHERE profile_id = ?").bind(device.profileId).run();
    return Response.json({ ok: true, parentToken: await createSession(device.profileId) });
  }

  const session = await getParentSession(request);
  if (!session || session.profileId !== device.profileId) return unauthorized("Sessão parental expirada");

  if (body.action === "analytics") {
    const topicRows = await d1.prepare(
      `SELECT subject, topic,
        COUNT(*) AS attempts,
        SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct,
        SUM(CASE WHEN is_review = 1 THEN 1 ELSE 0 END) AS reviewAttempts,
        SUM(CASE WHEN is_review = 1 AND correct = 1 THEN 1 ELSE 0 END) AS reviewCorrect
       FROM attempts WHERE profile_id = ? GROUP BY subject, topic ORDER BY subject, topic`,
    ).bind(device.profileId).all();
    const wrongRows = await d1.prepare(
      `SELECT subject, topic, quiz_id AS quizId, question_id AS questionId, selected, created_at AS createdAt
       FROM attempts WHERE profile_id = ? AND correct = 0 ORDER BY created_at DESC LIMIT 30`,
    ).bind(device.profileId).all();
    const state = await d1.prepare(
      "SELECT state_json AS stateJson, updated_at AS updatedAt FROM study_state WHERE profile_id = ?",
    ).bind(device.profileId).first<{ stateJson: string; updatedAt: number }>();
    const timeline=await d1.prepare(`SELECT date(created_at/1000,'unixepoch','-3 hours') AS day,COUNT(*) AS attempts,SUM(correct) AS correct FROM attempts WHERE profile_id=? GROUP BY day ORDER BY day DESC LIMIT 30`).bind(device.profileId).all();
    const drafts=await d1.prepare('SELECT task_id AS taskId,answer,updated_at AS updatedAt FROM written_drafts WHERE profile_id=? ORDER BY updated_at DESC').bind(device.profileId).all();
    const summary=await d1.prepare('SELECT COUNT(*) AS attempts,SUM(correct) AS correct,MAX(created_at) AS lastAt FROM attempts WHERE profile_id=?').bind(device.profileId).first();
    return Response.json({
      ok: true, timeline:timeline.results,drafts:drafts.results,summary,
      topics: topicRows.results,
      wrongAnswers: wrongRows.results,
      state: state ? JSON.parse(state.stateJson) : null,
      updatedAt: state?.updatedAt ?? null,
    });
  }

  return Response.json({ ok: false, error: "Ação desconhecida" }, { status: 400 });
}
