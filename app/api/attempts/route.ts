import {quizCatalog,type QuizId} from "../../curriculum-data";
import {officialQuestions} from "../../obmep/officialQuestions";
import { getD1, getDevice, now, unauthorized } from "../_lib";

type AttemptBody = {
  eventId?:string;
  answeredAt?:number;
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
  const standard=quizCatalog[body.quizId as QuizId];
  const q=standard?.questions.find(q=>q.id===body.questionId);
  const obmep=body.subject==='obmep'?officialQuestions.find(q=>q.id===body.quizId && q.number===body.questionId):null;
  if(!(q && standard.subject===body.subject && q.options.some(o=>o.id===body.selected)) && !(obmep && /^[A-E]$/.test(body.selected)))return Response.json({error:'Questão inválida'},{status:400});
  const correct=obmep?'ABCDE'[obmep.answer]===body.selected:q!.correct===body.selected;
  const eventId=typeof body.eventId==='string'&&/^[a-f0-9-]{36}$/.test(body.eventId)?body.eventId:crypto.randomUUID();
  const timestamp=Number(body.answeredAt);const answeredAt=Number.isFinite(timestamp)&&timestamp>now()-90*86400000&&timestamp<=now()?timestamp:now();
  await d1.prepare(
    `INSERT OR IGNORE INTO attempts
      (id, profile_id, subject, quiz_id, question_id, topic, selected, correct, is_review, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    eventId, device.profileId, body.subject, body.quizId, body.questionId,
    q?.topic ?? body.topic, body.selected, correct ? 1 : 0, body.isReview ? 1 : 0, answeredAt,
  ).run();
  return Response.json({ ok: true });
}
