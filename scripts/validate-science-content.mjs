import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

export function validateScienceContent(data) {
  const text = (value, field) => assert.ok(typeof value === 'string' && value.trim(), `${field}: expected nonempty text`);
  const subject = data.scienceSubject;
  assert.equal(subject.key, 'science');
  assert.equal(subject.quizId, 'science-general');
  for (const field of ['name', 'icon', 'eyebrow', 'title', 'description']) text(subject[field], field);
  assert.equal(subject.assessmentDate, '');
  assert.equal(subject.lessons.length, 8);
  const ids = new Set();
  for (const lesson of subject.lessons) {
    assert.match(lesson.id, /^science-[a-z0-9-]+$/);
    assert.ok(!ids.has(lesson.id), 'duplicate lesson'); ids.add(lesson.id);
    for (const field of ['number', 'icon', 'title', 'subtitle', 'intro', 'remember', 'tone']) text(lesson[field], `${lesson.id}.${field}`);
    assert.equal(lesson.quizId, 'science-general');
    assert.ok(lesson.facts.length > 0);
    for (const fact of lesson.facts) { text(fact.term, 'fact.term'); text(fact.text, 'fact.text'); }
    const deep = data.scienceDeepStudyByLesson[lesson.id];
    for (const field of ['title', 'example', 'challenge']) text(deep[field], `${lesson.id}.deep.${field}`);
    assert.ok(deep.paragraphs.length > 0); deep.paragraphs.forEach(p => text(p, 'paragraph'));
    assert.ok(deep.vocabulary.length > 0);
    deep.vocabulary.forEach(v => { assert.equal(v.length, 3); v.forEach(t => text(t, 'vocabulary')); });
  }
  assert.equal(data.scienceQuiz.length, 20);
  const questionIds = new Set();
  let associations = 0;
  for (const question of data.scienceQuiz) {
    assert.ok(Number.isInteger(question.id));
    assert.ok(!questionIds.has(question.id), 'duplicate question'); questionIds.add(question.id);
    for (const field of ['topic', 'prompt', 'support']) text(question[field], `question.${field}`);
    assert.ok(!question.format || ['choice', 'association'].includes(question.format));
    if (question.format === 'association') { text(question.concept, 'concept'); associations++; }
    assert.equal(question.options.length, 4);
    assert.deepEqual(question.options.map(o => o.id), ['a','b','c','d']);
    assert.ok(question.options.some(o => o.id === question.correct));
    question.options.forEach(o => { text(o.label, 'option.label'); text(o.explanation, 'option.explanation'); });
  }
  assert.ok(associations > 0, 'at least one association required');
  assert.equal(data.scienceInfographicPages.length, 4);
  for (const page of data.scienceInfographicPages) {
    assert.match(page.src, /^\/infographics\/[a-z0-9-]+\.(webp|png|jpg)$/);
    text(page.alt, 'image.alt'); text(page.label, 'image.label');
    assert.ok(page.width > 0 && page.height > 0);
  }
  assert.equal(data.scienceDownloads.exam, '/materials/science-term3-exam.pdf');
  assert.equal(data.scienceDownloads.answerKey, '/materials/science-term3-answer-key.pdf');
  return data;
}
if (process.argv[1]?.endsWith('validate-science-content.mjs') && process.argv[2]) {
  validateScienceContent(JSON.parse(readFileSync(process.argv[2], 'utf8')));
  console.log('Science editorial contract validated: 8 lessons, 20 questions, 4 infographics, 2 PDFs');
}
