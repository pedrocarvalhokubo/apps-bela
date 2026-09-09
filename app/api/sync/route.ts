import { getD1, getDevice, now, unauthorized } from "../_lib";

export async function GET(request: Request) {
  const device = await getDevice(request);
  if (!device) return unauthorized();
  const d1 = await getD1();
  const row = await d1.prepare(
    "SELECT state_json AS stateJson, updated_at AS updatedAt FROM study_state WHERE profile_id = ?",
  ).bind(device.profileId).first<{ stateJson: string; updatedAt: number }>();
  const topics = await d1.prepare(
    `SELECT subject, topic, COUNT(*) AS attempts,
      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct,
      SUM(CASE WHEN is_review = 1 THEN 1 ELSE 0 END) AS reviewAttempts,
      SUM(CASE WHEN is_review = 1 AND correct = 1 THEN 1 ELSE 0 END) AS reviewCorrect
     FROM attempts WHERE profile_id = ? GROUP BY subject, topic`,
  ).bind(device.profileId).all();
  return Response.json({
    ok: true,
    state: row ? JSON.parse(row.stateJson) : null,
    updatedAt: row?.updatedAt ?? null,
    topics: topics.results,
  });
}

export async function POST(request: Request) {
  const device = await getDevice(request);
  if (!device) return unauthorized();
  const d1 = await getD1();
  const body = await request.json().catch(() => ({})) as { state?: unknown; updatedAt?: number };
  if (!body.state || typeof body.state !== "object") {
    return Response.json({ ok: false, error: "Estado inválido" }, { status: 400 });
  }
  const updatedAt = Math.max(Number(body.updatedAt) || 0, now());
  await d1.prepare(
    `INSERT INTO study_state (profile_id, state_json, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(profile_id) DO UPDATE SET state_json = excluded.state_json, updated_at = excluded.updated_at
     WHERE excluded.updated_at >= study_state.updated_at`,
  ).bind(device.profileId, JSON.stringify(body.state), updatedAt).run();
  return Response.json({ ok: true, updatedAt });
}
