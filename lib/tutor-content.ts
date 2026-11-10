import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import catalog from '../content/tutor/catalog.json';
export type TutorContext={subject:string;term:number;lessonId?:string;view?:string;quizId?:string;questionId?:number;page?:number};
export function resolveTutorContext(input:TutorContext){
 const entry=catalog.find(m=>m.subject===input.subject&&m.term===input.term);
 if(!entry)return null;
 const lesson=entry.lessons.find(l=>l.id===input.lessonId);
 if(input.lessonId&&!lesson)return null;
 return {module:entry,lesson,context:{subject:entry.subject,term:entry.term,lessonId:lesson?.id??'',view:input.view==='quiz'?'quiz':'study',page:Number.isInteger(input.page)?Math.max(0,Math.min(30,input.page!)):0,pageTitle:Number.isInteger(input.page)?entry.pages[input.page!]?.label??'':''}};
}
export function tutorSource(resolved:NonNullable<ReturnType<typeof resolveTutorContext>>){
 const root=join(process.cwd(),'content/tutor');
 const content=readFileSync(join(root,resolved.module.file),'utf8');
 return {instructions:readFileSync(join(root,'instructions.md'),'utf8'),content,sourceIds:[resolved.module.id,...resolved.module.lessons.map(l=>l.id)]};
}
export {catalog as tutorCatalog};
