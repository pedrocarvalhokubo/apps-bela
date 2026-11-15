import content from './math3-content.json';
import type {StudySubject, QuizId, SubjectKey} from './curriculum-data';
import type {QuizQuestion} from './quiz-data';
import type {DeepStudy} from './deep-content';
export const math3Subject = content.subject as StudySubject;
export const math3Questions = content.questions.map(q=>({...q,hints:q.hints as [string,string]}));
export const math3Infographics = content.infographics;
export const math3Practice = content.practice;
export const math3DeepStudy = content.deepStudy as unknown as Record<string,DeepStudy>;
export const math3Catalog = Object.fromEntries([
 ...math3Subject.lessons.map(l=>[l.quizId!,{title:`Quiz • ${l.title}`,subject:'math',questions:math3Questions.filter(q=>q.topic===l.title && q.pool==='quiz')}]),
 ...['quiz','mock-a','mock-b'].map(pool=>[pool==='quiz'?'math3-general':`math3-${pool}`,{title:pool==='quiz'?'Math • Revisão completa':`Math • Simulado ${pool==='mock-a'?'A':'B'}`,subject:'math',questions:math3Questions.filter(q=>q.pool===pool)}]),
]) as Partial<Record<QuizId,{title:string;subject:SubjectKey;questions:QuizQuestion[]}>>;
