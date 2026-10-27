import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const original=JSON.parse(read('../app/science-content.json'));
const extension=JSON.parse(read('../app/science-extension.json'));
const load=async source=>import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const science=await load(read('../app/science-data.ts').replace("import content from './science-content.json';",`const content=${JSON.stringify(original)};`).replace("import extension from './science-extension.json';",`const extension=${JSON.stringify(extension)};`));
const routing=await load(read('../app/history3-data.ts').replace("import { ela3Subject } from './ela3-data';",`const ela3Subject=${JSON.stringify(JSON.parse(read('../app/ela3-content.json')).subject)};`).replace("import content from './history3-content.json';",`const content=${read('../app/history3-content.json')};`));
test('Science extension preserves saved lessons and the complete legacy question bank',()=>{
 assert.equal(science.scienceSubject.lessons.length,10);
 assert.deepEqual(science.scienceSubject.lessons.slice(0,8).map(l=>l.id),original.scienceSubject.lessons.map(l=>l.id));
 assert.deepEqual(science.scienceQuiz,original.scienceQuiz);
 assert.equal(science.scienceSubject.assessmentDate,'');
 assert.equal(science.scienceSubject.quizId,'science3-general');
 assert.equal(routing.quizTerm('science-general'),3);
 for(const id of Object.keys(science.science3Catalog))assert.equal(routing.quizTerm(id),3);
 assert.equal(routing.resumeTerm('science','s3-hurricane','science3-mock-b','quiz'),3);
 assert.equal(routing.quizTerm('ela'),2);
});
test('two Science tests cover all ten topics, without overlap; every lesson gets its own quiz and two written tasks',()=>{
 const a=science.science3Catalog['science3-mock-a'].questions,b=science.science3Catalog['science3-mock-b'].questions;
 assert.equal(a.length,20);assert.equal(b.length,20);assert.equal(new Set([...a,...b].map(q=>q.id)).size,40);
 for(const quiz of [a,b])assert.equal(new Set(quiz.map(q=>q.topic)).size,10);
 for(const lesson of science.scienceSubject.lessons){
  const quiz=science.science3Catalog[lesson.quizId].questions;assert.equal(quiz.length,4);
  assert.equal(extension.practice.filter(t=>t.lesson===lesson.id).length,2);
  assert.ok(science.scienceDeepStudyByLesson[lesson.id]);assert.ok(science.scienceImageForLesson(lesson.id));
  for(const q of quiz){
   assert.equal(q.topic,lesson.id);assert.equal(q.hints.length,2);assert.equal(q.options.length,4);
   assert.equal(new Set(q.options.map(o=>o.id)).size,4);assert.equal(q.options.filter(o=>o.id===q.correct).length,1);
   assert.ok(q.options.every(o=>o.explanation.length>15));
  }
 }
});
test('Science reading evidence and print resources are complete and exclude private worksheet identifiers',()=>{
 assert.doesNotMatch(JSON.stringify(extension),/Maple Bear|Isabela|\d{2}\/\d{2}\/2026|@/);
 assert.match(extension.lessons.find(l=>l.id==='s3-hurricane').facts[1].text,/Florida/);
 assert.match(extension.lessons.find(l=>l.id==='s3-fossil-discovery').facts.map(f=>f.text).join(' '),/237 million/);
 for(const resource of science.scienceDownloads){
  const pdf=readFileSync(new URL('../public'+resource.src,import.meta.url));assert.equal(pdf.subarray(0,4).toString(),'%PDF');assert.ok(pdf.length>10000);
 }
 assert.ok(readFileSync(new URL('../public/science-term3/evidence/haiti-comparison.jpg',import.meta.url)).length>10000);
});
