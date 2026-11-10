import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const c=JSON.parse(read('../app/portuguese3-content.json'));
const sources=JSON.parse(read('../app/portuguese3-sources.json')).sources;
const load=async source=>import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const subject=file=>JSON.stringify(JSON.parse(read(file)).subject);
const routing=await load(read('../app/history3-data.ts')
 .replace("import { geography3Subject } from './geography3-data';",`const geography3Subject=${subject('../app/geography3-content.json')};`)
 .replace("import { ela3Subject } from './ela3-data';",`const ela3Subject=${subject('../app/ela3-content.json')};`)
 .replace("import { portuguese3Subject } from './portuguese3-data';",`const portuguese3Subject=${JSON.stringify(c.subject)};`)
 .replace("import content from './history3-content.json';",`const content=${read('../app/history3-content.json')};`));
const roman=s=>{const v={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};let n=0;for(let i=0;i<s.length;i++)n+=v[s[i]]<(v[s[i+1]]??0)?-v[s[i]]:v[s[i]];return n;};

test('Portuguese pools have 54 distinct questions covering every lesson with balanced answers',()=>{
 assert.equal(c.questions.length,78);
 assert.equal(new Set(c.questions.map(q=>q.id)).size,78);
 assert.equal(new Set(c.questions.map(q=>q.prompt)).size,78);
 const ids=new Set(sources.map(s=>s.id));
 for(const pool of ['quiz','mock-a','mock-b']){
  const qs=c.questions.filter(q=>q.pool===pool);assert.equal(qs.length,18);
  for(const l of c.subject.lessons)assert.equal(qs.filter(q=>q.topic===l.title).length,3,l.title);
  for(const letter of 'abcd'){const n=qs.filter(q=>q.correct===letter).length;assert.ok(n>=4&&n<=5,`${pool} ${letter}: ${n}`);}
  for(const q of qs){
   assert.equal(new Set(q.options.map(o=>o.label)).size,4);
   assert.equal(q.options.filter(o=>o.id===q.correct).length,1);
   assert.equal(q.hints.length,2);
   assert.ok(q.options.every(o=>o.explanation.trim().length>=15));
   assert.equal(new Set(q.options.map(o=>o.explanation)).size,4);
   assert.ok(q.options.find(o=>o.id===q.correct).explanation.startsWith('Correto'),q.prompt);
   assert.ok(q.sourceRefs.length&&q.sourceRefs.every(r=>ids.has(r)));
  }
 }
});

test('Roman numeral practice has 24 checked questions with balanced answers and valid options',()=>{
 const qs=c.questions.filter(q=>q.pool==='roman-practice');
 assert.equal(qs.length,24);
 for(const letter of 'abcd')assert.equal(qs.filter(q=>q.correct===letter).length,6);
 for(const q of qs){
  assert.equal(q.topic,'Algarismos romanos');
  assert.equal(new Set(q.options.map(o=>o.label)).size,4);
  assert.equal(new Set(q.options.map(o=>o.explanation)).size,4);
  assert.ok(q.options.every(o=>o.explanation.trim().length>=15),q.prompt);
  assert.ok(q.options.find(o=>o.id===q.correct).explanation.startsWith('Correto'),q.prompt);
 }
 const write=qs.filter(q=>/^Como se escreve/.test(q.prompt));assert.equal(write.length,8);
 const read=qs.filter(q=>/^Quanto vale/.test(q.prompt));assert.equal(read.length,8);
 for(const q of read)for(const o of q.options)if(o.id!==q.correct)assert.notEqual(o.label,String(roman(q.prompt.match(/vale (\w+)/)[1])));
});

test('Roman numeral answers are arithmetically correct',()=>{
 for(const q of c.questions.filter(q=>q.topic==='Algarismos romanos')){
  const answer=q.options.find(o=>o.id===q.correct).label;
  const value=q.prompt.match(/^Quanto vale ([IVXLCDM]+)\?$/);
  if(value)assert.equal(String(roman(value[1])),answer,q.prompt);
  const write=q.prompt.match(/^Como se escreve (\d+) em algarismos romanos\?$/);
  if(write)assert.equal(roman(answer),Number(write[1]),q.prompt);
 }
 for(const t of c.practice.filter(t=>t.lesson==='p3-roman'))for(const [,n,r] of t.answer.matchAll(/(\d+) = ([IVXLCDM]+)/g))assert.equal(roman(r),Number(n));
});

test('Portuguese term 3 routes independently from term 2',()=>{
 const old={portuguese:{lessons:[{id:'pt-interview'}]}};
 assert.equal(routing.studySubject(old,'portuguese',2),old.portuguese);
 assert.equal(routing.studySubject(old,'portuguese',3).lessons[0].id,'p3-reading');
 assert.equal(routing.quizTerm('portuguese3-mock-a'),3);
 assert.equal(routing.quizTerm('portuguese-general'),2);
 assert.equal(routing.resumeTerm('portuguese','p3-roman','portuguese-general','learn'),3);
 assert.equal(routing.resumeTerm('portuguese','pt-interview','portuguese-general','learn'),2);
});

test('Lessons, practice and infographics are complete and public content stays anonymous',()=>{
 assert.equal(c.subject.lessons.length,6);
 for(const l of c.subject.lessons){
  assert.ok(c.deepStudy[l.id]);
  assert.ok(c.practice.some(t=>t.lesson===l.id));
  if(l.id!=='p3-reading')assert.ok(c.infographics.some(p=>p.lessons.includes(l.id)));
 }
 assert.equal(c.subject.assessmentDate,'');
 assert.doesNotMatch(JSON.stringify(c)+JSON.stringify(sources),/Maple ?Bear|Moni|Isabela|13\/11|2026-11-13|achei/i);
 for(const a of c.infographics){
  const png=readFileSync(new URL('../public'+a.src,import.meta.url));
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],[a.width,a.height]);
 }
 for(const f of ['../app/api/drafts/route.ts','../app/api/history-import/route.ts','../app/components/HistoryImport.tsx'])assert.match(read(f),/portuguese3-practice-p3-\[a-z-\]\+/);
});
