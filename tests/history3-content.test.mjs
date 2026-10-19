import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';

const content = JSON.parse(readFileSync(new URL('../app/history3-content.json', import.meta.url), 'utf8'));
const source = readFileSync(new URL('../app/history3-data.ts', import.meta.url), 'utf8')
  .replace("import content from './history3-content.json';", `const content = ${JSON.stringify(content)};`);
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { history3Catalog, history3Subject, studySubject, quizTerm, resumeTerm } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

test('History Term 3 covers each source topic with graduated explanations and independent quizzes', () => {
  assert.equal(content.historySubject.lessons.length, 7);
  assert.equal(content.historyQuiz.length, 28);
  const ids = new Set();
  for (const lesson of content.historySubject.lessons) {
    assert.ok(lesson.id.startsWith('h3-'));
    assert.ok(content.historyDeepStudyByLesson[lesson.id].challenge);
    const quiz = history3Catalog[lesson.quizId];
    assert.equal(quiz.questions.length, 4);
    assert.ok(quiz.questions.every(q => q.topic === lesson.title));
    for (const q of quiz.questions) {
      assert.ok(!ids.has(q.id)); ids.add(q.id);
      assert.equal(q.options.length,4);
      assert.equal(q.options.filter(o=>o.id===q.correct).length,1);
      assert.ok(q.options.every(o=>o.label && o.explanation.length>20));
      assert.equal(q.hints.length,2);
    }
  }
  const a=history3Catalog['history3-mock-a'].questions,b=history3Catalog['history3-mock-b'].questions;
  assert.equal(a.length,14);assert.equal(b.length,14);
  assert.equal(new Set([...a,...b].map(q=>q.id)).size,28);
  assert.equal(new Set(a.map(q=>q.topic)).size,7);
  assert.equal(new Set(b.map(q=>q.topic)).size,7);
});

test('term selection preserves legacy History and selects new lessons only in term 3', () => {
  const legacy={ history:{ lessons:[{id:'history-trade'}] }, science:{ lessons:[{id:'s3-sound'}] } };
  assert.equal(studySubject(legacy,'history',2),legacy.history);
  assert.equal(studySubject(legacy,'history',3),history3Subject);
  assert.equal(studySubject(legacy,'science',3),legacy.science);
  assert.equal(quizTerm('history-general'),2);
  assert.equal(quizTerm('history3-general'),3);
  assert.equal(quizTerm('science-general'),3);
  assert.equal(resumeTerm('history','h3-routes','history-general','learn'),3);
  assert.equal(resumeTerm('history','history-trade','history3-general','learn'),2);
  assert.equal(resumeTerm('history','history-trade','history3-general','quiz'),3);
  assert.equal(resumeTerm('history','h3-routes','history-general','quiz'),2);
});

test('public History downloads have verified bytes and contain no school, pupil identity or exam date', () => {
  assert.equal(content.historySubject.assessmentDate,'');
  assert.doesNotMatch(JSON.stringify(content),/@|https?:|\d{2}\/\d{2}\/2026/);
  assert.equal(content.historyInfographicPages.length,6);
  assert.deepEqual(content.historyDownloads.map(d=>d.pages),[7,4,4,6]);
  const manifest=JSON.parse(readFileSync(new URL('../.asset-bundle/manifest.json', import.meta.url),'utf8'));
  for (const r of [...content.historyInfographicPages,...content.historyDownloads]) {
    const bytes=readFileSync(new URL('../public'+r.src,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest.files['public'+r.src]);
    if(r.src.endsWith('.pdf')) assert.equal(bytes.subarray(0,4).toString(),'%PDF');
    else { assert.equal(bytes.readUInt32BE(16),1024);assert.equal(bytes.readUInt32BE(20),1536); }
  }
});
