import { getD1, getDevice, now, unauthorized } from "../_lib";
import { type ProgressRecord } from "../../../lib/obmep-progress";
import { officialQuestions } from "../../obmep/officialQuestions";
const ids = new Set(officialQuestions.map((q) => q.id));
export async function GET(request: Request) {
  const device = await getDevice(request);
  if (!device) return unauthorized();
  const db = await getD1();
  const row = await db.prepare("SELECT state_json FROM obmep_progress WHERE profile_id = ?").bind(device.profileId).first<{state_json: string}>();
  return Response.json({ progress: row ? JSON.parse(row.state_json) : {} });
}
export async function POST(request: Request) {
  const device = await getDevice(request);
  if (!device) return unauthorized();
  const body = await request.json().catch(() => null);
  const input = body?.progress;
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length > 180)
    return Response.json({ error: "Progresso inválido" }, { status: 400 });
  const clean: ProgressRecord = {};
  for (const [id, item] of Object.entries(input)) {
    const v = item as ProgressRecord[string];
    if (!ids.has(id) || !v || typeof v.solved !== "boolean" || typeof v.firstTry !== "boolean" || !Number.isInteger(v.attempts) || v.attempts < 1 || v.attempts > 5)
      return Response.json({ error: "Progresso inválido" }, { status: 400 });
    clean[id] = { solved: v.solved, firstTry: v.firstTry, attempts: v.attempts };
  }
  const db = await getD1();
  db.mergeObmep(device.profileId, clean);
  return Response.json({ ok: true });
}
