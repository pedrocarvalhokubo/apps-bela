import { getD1 } from "../_lib";
export const dynamic = "force-dynamic";
export async function GET() {
  try { const db = await getD1(); await db.prepare("SELECT 1").first(); return Response.json({ ok: true }); }
  catch { return Response.json({ ok: false }, { status: 503 }); }
}
