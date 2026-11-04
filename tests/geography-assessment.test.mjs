import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const third=json('app/geography3-content.json'), second=json('app/geography2-sources.json'), written=json('app/geography2-written.json');
const temp=mkdtempSync(join(tmpdir(),'bela-geography-'));
let geo;
try{await build({entryPoints:['app/geography-data.ts'],outfile:join(temp,'geo.mjs'),bundle:true,platform:'node',format:'esm',logLevel:'silent'});geo=await import(pathToFileURL(join(temp,'geo.mjs')).href);}finally{rmSync(temp,{recursive:true,force:true});}
const quizzes=['geographySectorsQuiz','geographyFieldCityQuiz','geographyMaterialsQuiz','geographyOriginQuiz','geographyRecyclingQuiz'].flatMap(id=>geo[id]);
const correct=q=>q.options.find(o=>o.id===q.correct);
test('Every Geography assessment has an evidence reference in its own term',()=>{
 assert.equal(quizzes.length,25);assert.equal(written.questions.length,20);assert.equal(third.questions.length,60);assert.equal(third.practice.length,4);
 for(const [term,sources,questions] of [[2,second.sources,[...quizzes,...written.questions]],[3,json('app/geography3-sources.json').sources,[...third.questions,...third.practice]]]){
  const ids=new Set(sources.map(s=>s.id));assert.equal(ids.size,term===2?10:15);
  for(const q of questions){assert.ok(q.sourceRefs.length>0,q.prompt);assert.ok(q.sourceRefs.every(r=>r.startsWith(`G${term}-`)&&ids.has(r)),q.prompt);}
 }
 for(const q of [...quizzes,...third.questions]){assert.ok(q.evidenceNote?.trim());assert.ok(correct(q)?.explanation.trim());assert.ok(q.support.trim());}
 assert.equal(third.assessmentPolicy.basis,'school-original-only');assert.equal(written.assessmentPolicy,'school-original-only');
});
test('The general II-term quiz reuses 20 of 25 reviewed questions with the same feedback and sources',()=>{
 assert.equal(geo.geographyGeneralQuiz.length,20);
 for(const q of geo.geographyGeneralQuiz){const original=quizzes.find(x=>x.topic===q.topic&&x.prompt===q.prompt&&x.support===q.support);assert.ok(original);assert.deepEqual(q.options,original.options);assert.deepEqual(q.sourceRefs,original.sourceRefs);}
 assert.equal(new Set(quizzes.map(q=>q.topic+':'+q.id)).size,25);
 const curator=readFileSync('content/tutor/geography-2-assessment.md','utf8');assert.equal((curator.match(/^## /gm)||[]).length,25);
});
test('August school scenarios remain; unsupported processing stages and machines are removed from assessed feedback',()=>{
 assert.match(geo.geographyFieldCityQuiz[2].prompt,/caminhão.*semana/);assert.match(geo.geographyFieldCityQuiz[3].prompt,/fazenda.*leite.*estrada/);
 assert.match(correct(geo.geographyFieldCityQuiz[4]).label,/insumos e fertilizantes/);assert.doesNotMatch(correct(geo.geographyFieldCityQuiz[4]).label,/máquinas/);
 assert.doesNotMatch(correct(geo.geographyMaterialsQuiz[2]).explanation,/fio|tecido/);
 assert.match(written.questions[2].prompt,/pão/);assert.match(written.questions[11].prompt,/origem animal, vegetal ou mineral/);
 assert.match(written.questions[17].prompt,/dois destinos/);assert.match(written.questions[19].answer,/Separar corretamente/);
});
test('November assessments replace invented demands with the exact school concepts',()=>{
 const q=id=>third.questions.find(q=>q.id===id);
 assert.equal(correct(q(3203)).label,'Econômicas, sociais, políticas e climáticas.');assert.deepEqual(q(3203).sourceRefs,['G3-03']);
 assert.equal(correct(q(3116)).label,'Em outro país.');assert.match(correct(q(3216)).label,/solicitar refúgio/);
 assert.match(correct(q(3316)).label,/perseguição.*violações/);assert.match(correct(q(3318)).label,/segurança e dignidade/);
 for(const id of [3116,3203,3216,3316,3318])assert.doesNotMatch(JSON.stringify(q(id)),/avós|matrícula|biblioteca|privacidade|aprender.*idioma|necessidade familiar/);
 assert.doesNotMatch(JSON.stringify(q(3218)),/automaticamente|Convenção|estatuto jurídico/);
});
test('Four assessed written tasks match the repeated lesson challenges; new study examples are explicitly complementary',()=>{
 for(const task of third.practice){const lesson=third.deepStudy[task.lesson];assert.equal(lesson.challenge,task.prompt);assert.match(lesson.example,/Exemplo complementar.*não faz parte da avaliação/);}
 const instructions=readFileSync('content/tutor/instructions.md','utf8');assert.match(instructions,/resposta correta de cada avaliação deve estar no material original da escola do mesmo trimestre/);assert.match(instructions,/Enunciados, alternativas, dicas, explicações e gabaritos/);assert.match(instructions,/Se a fonte não estiver disponível/);
 const reviewer=readFileSync('lib/tutor-provider.ts','utf8');assert.match(reviewer,/Em avaliações, a resposta correta deve estar no material original da escola do mesmo trimestre/);
});
