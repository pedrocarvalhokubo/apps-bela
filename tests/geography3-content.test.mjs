import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const c=JSON.parse(read('../app/geography3-content.json'));
const load=async source=>import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const routing=await load(read('../app/history3-data.ts').replace("import { geography3Subject } from './geography3-data';",`const geography3Subject=${JSON.stringify(c.subject)};`).replace("import { ela3Subject } from './ela3-data';",`const ela3Subject=${JSON.stringify(JSON.parse(read('../app/ela3-content.json')).subject)};`).replace("import content from './history3-content.json';",`const content=${read('../app/history3-content.json')};`));
test('Geography pools preserve 60 question IDs, varied wording and all four school content areas',()=>{
 assert.equal(c.questions.length,60);
 assert.equal(new Set(c.questions.map(q=>q.id)).size,60);
 assert.equal(new Set(c.questions.map(q=>q.prompt.normalize('NFD').replace(/[^a-z0-9]/gi,'').toLowerCase())).size,60);
 assert.equal(new Set(c.questions.map(q=>q.scenarioId)).size,60);
 for(const pool of ['quiz','mock-a','mock-b']){
  const qs=c.questions.filter(q=>q.pool===pool);assert.equal(qs.length,20);
  for(const l of c.subject.lessons)assert.equal(qs.filter(q=>q.topic===l.title).length,5);
  for(const letter of 'abcd')assert.equal(qs.filter(q=>q.correct===letter).length,5);
  for(const q of qs){assert.equal(new Set(q.options.map(o=>o.label)).size,4);assert.equal(q.options.filter(o=>o.id===q.correct).length,1);assert.equal(q.hints.length,2);assert.ok(q.options.every(o=>o.explanation.trim().length>=15));assert.equal(new Set(q.options.map(o=>o.explanation)).size,4);}
 }
});
test('Geography preserves second-term routing and resumes third-term lessons and tests',()=>{
 const old={geography:{lessons:[{id:'geography-sectors'}]}};
 assert.equal(routing.studySubject(old,'geography',2),old.geography);
 assert.equal(routing.studySubject(old,'geography',3).lessons[0].id,'g3-places');
 assert.equal(routing.resumeTerm('geography','g3-places','geography-general','learn'),3);
 assert.equal(routing.resumeTerm('geography','geography-sectors','geography3-mock-a','quiz'),3);
 assert.equal(routing.resumeTerm('geography','geography-sectors','geography3-general','learn'),2);
});
test('Study cards are PNGs and public content does not expose school identity or assessment schedule',()=>{
 assert.equal(c.subject.assessmentDate,'');assert.doesNotMatch(JSON.stringify(c),/Isabela|Maple Bear|Y4B|06\/11|2026-11-06/);
 for(const a of c.infographics){assert.ok(a.src.endsWith('.png'));assert.deepEqual([...readFileSync(new URL('../public'+a.src,import.meta.url)).subarray(0,8)],[137,80,78,71,13,10,26,10]);}
});
