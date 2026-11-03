import {build} from 'esbuild';
import {readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const temp=mkdtempSync(join(tmpdir(),'bela-corpus-'));
try {
 await build({stdin:{contents:`import {curriculumSubjects,quizCatalog} from './app/curriculum-data'; import {studySubject,quizTerm,history3Infographics} from './app/history3-data'; import {geography3Infographics} from './app/geography3-data'; import {ela3Infographics} from './app/ela3-data'; import {scienceInfographicPages} from './app/science-data'; import {deepStudyByLesson} from './app/deep-content'; const modules=[...Object.keys(curriculumSubjects).filter(x=>x!=='science').map(subject=>({subject,term:2,data:studySubject(curriculumSubjects,subject,2)})),...['geography','history','ela','science'].map(subject=>({subject,term:3,data:studySubject(curriculumSubjects,subject,3)}))];console.log(JSON.stringify({pages:{history:history3Infographics,geography:geography3Infographics,ela:ela3Infographics,science:scienceInfographicPages},modules,quizzes:Object.entries(quizCatalog).map(([id,q])=>({id,term:quizTerm(id),...q})),deepStudyByLesson}));`,resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:join(temp,'source.mjs'),logLevel:'silent'});
 const source=JSON.parse(execFileSync(process.execPath,[join(temp,'source.mjs')],{maxBuffer:8e6}));
 const dir='content/tutor', extras=JSON.parse(readFileSync(join(dir,'enrichment.json'),'utf8')),catalog=[];
 mkdirSync(dir,{recursive:true});
 for(const module of source.modules){
  const id=`${module.subject}-${module.term}`,data=module.data, sections=[];
  for(const lesson of data.lessons){
   const deep=source.deepStudyByLesson[lesson.id];
   let md=`## ${lesson.title}\n\nID: ${lesson.id}\n\n${lesson.subtitle}\n\n${lesson.intro}\n\n`;
   md+=lesson.facts.map(f=>`### ${f.term}\n\n${f.text}\n`).join('\n');
   md+=`\nLembre: ${lesson.remember}\n`;
   if(deep) md+=`\n### Aprofundamento\n\n${deep.paragraphs.join('\n\n')}\n\n${deep.vocabulary.map(v=>`- ${v[1]}: ${v[2]}`).join('\n')}\n\nExemplo: ${deep.example}\n\nDesafio: ${deep.challenge}\n`;
   sections.push({id:lesson.id,title:lesson.title,text:md});
  }
  const extra=extras[id]??extras[module.subject];
  let md=`# ${data.name} — trimestre ${module.term}\n\nID: ${id}\n\n${data.title}\n\n${data.description}\n\nOrigem: conteúdo já revisado e publicado no app. Atualize este arquivo com npm run tutor:content após modificar aulas. Exemplos suplementares são autorais.\n\n${sections.map(s=>s.text).join('\n')}`;
  if(extra)md+=`\n## Ampliação curada\n\n${extra.text}\n\n### Fontes de conferência\n\n${extra.sources.map(s=>`- ${s}`).join('\n')}\n`;
  writeFileSync(join(dir,id+'.md'),md.trim()+'\n');
  const questions=new Map();for(const q of source.quizzes.filter(q=>q.subject===module.subject&&q.term===module.term))for(const question of q.questions)questions.set(String(question.id),question);
  writeFileSync(join(dir,id+'-assessment.md'),`# Referência do curador — ${data.name}\n\nNão enviar ao tutor durante quiz ou simulado. Inclui exemplos e alternativas disponíveis no app, sem criar novas provas.\n\n`+[...questions.values()].map(q=>`## ${q.topic} — ${q.id}\n\n${q.prompt}\n\n${q.support??''}\n\n${q.options.map(o=>`- ${o.id.toUpperCase()}. ${o.label}\n  Explicação: ${o.explanation}`).join('\n')}\n\nResposta: ${q.correct}\n`).join('\n'));
  catalog.push({id,subject:module.subject,term:module.term,title:data.name,moduleTitle:data.title,file:id+'.md',pages:module.term===3?(source.pages[module.subject]??[]).map(p=>({label:p.label,description:p.alt})):[],lessons:sections.map(({id,title})=>({id,title}))});
 }
 writeFileSync(join(dir,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');
 console.log(`Curated corpus: ${catalog.length} modules, ${catalog.reduce((n,m)=>n+m.lessons.length,0)} lessons`);
} finally {rmSync(temp,{recursive:true,force:true});}
