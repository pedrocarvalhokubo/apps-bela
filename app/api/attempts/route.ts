import { getD1, getDevice, now, unauthorized } from "../_lib";

type AttemptBody = {
  subject?: string;
  quizId?: string;
  questionId?: number;
  topic?: string;
  selected?: string;
  correct?: boolean;
  isReview?: boolean;
};

export async function POST(request: Request) {
  const device = await getDevice(request);
  if (!device) return unauthorized();
  const d1 = await getD1();
  const body = await request.json().catch(() => ({})) as AttemptBody;
  if (!body.subject || !body.quizId || !body.questionId || !body.topic || !body.selected) {
    return Response.json({ ok: false, error: "Tentativa incompleta" }, { status: 400 });
  }
  await d1.prepare(
    `INSERT INTO attempts
      (id, profile_id, subject, quiz_id, question_id, topic, selected, correct, is_review, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    crypto.randomUUID(), device.profileId, body.subject, body.quizId, body.questionId,
    body.topic, body.selected, body.correct ? 1 : 0, body.isReview ? 1 : 0, now(),
  ).run();
  return Response.json({ ok: true });
}
