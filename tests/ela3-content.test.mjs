import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const content = JSON.parse(read('../app/ela3-content.json'));
const load = async source => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const ela = await load(read('../app/ela3-data.ts').replace("import content from './ela3-content.json';", `const content=${JSON.stringify(content)};`));
const routing = await load(read('../app/history3-data.ts')
  .replace("import { ela3Subject } from './ela3-data';", `const ela3Subject=${JSON.stringify(content.subject)};`)
  .replace("import content from './history3-content.json';", `const content=${read('../app/history3-content.json')};`));

test('ELA term 3 and term 2 route independently, including resumed lessons and quizzes', () => {
  const legacy={ela:{lessons:[{id:'ela-5w1h'}]}};
  assert.equal(routing.studySubject(legacy,'ela',2),legacy.ela);
  assert.equal(routing.studySubject(legacy,'ela',3).lessons[0].id,'e3-blends');
  assert.equal(routing.quizTerm('ela'),2);
  for(const view of ['learn','infographic','science']) {
    assert.equal(routing.resumeTerm('ela','e3-spiders','ela',view),3);
    assert.equal(routing.resumeTerm('ela','ela-5w1h','ela3-general',view),2);
  }
  assert.equal(routing.resumeTerm('ela','ela-5w1h','ela3-mock-a','quiz'),3);
  assert.equal(routing.resumeTerm('ela','e3-spiders','ela','quiz'),2);
});

test('both practice tests cover every source topic, with no duplicate questions and valid feedback', () => {
  const a=ela.ela3Catalog['ela3-mock-a'].questions,b=ela.ela3Catalog['ela3-mock-b'].questions;
  assert.equal(a.length,20);assert.equal(b.length,20);
  assert.equal(new Set([...a,...b].map(q=>q.id)).size,40);
  assert.equal(new Set(a.map(q=>q.topic)).size,10);assert.equal(new Set(b.map(q=>q.topic)).size,10);
  for(const lesson of ela.ela3Subject.lessons) {
    const quiz=ela.ela3Catalog[lesson.quizId];assert.equal(quiz.questions.length,4);
    assert.ok(content.practice.some(t=>t.lesson===lesson.id));
    for(const q of quiz.questions) {
      assert.equal(q.hints.length,2);
      assert.equal(q.options.filter(o=>o.id===q.correct).length,1);
      assert.ok(q.options.find(o=>o.id===q.correct).explanation.startsWith('Correct.'));
      assert.ok(q.options.filter(o=>o.id!==q.correct).every(o=>o.explanation.startsWith('Try again.')));
    }
  }
});

test('new study assets exist and public learning content excludes pupil identity and school dates', () => {
  assert.equal(content.subject.assessmentDate,'');
  assert.doesNotMatch(JSON.stringify(content),/Maple Bear|Isabela|\d{2}\/\d{2}\/2026|@/);
  for(const asset of content.infographics)assert.equal(readFileSync(new URL('../public'+asset.src,import.meta.url)).subarray(0,4).toString(),'RIFF');
});
