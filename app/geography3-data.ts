import content from './geography3-content.json';
import type { StudySubject, QuizId, SubjectKey } from './curriculum-data';
import type { QuizQuestion } from './quiz-data';
import type { DeepStudy } from './deep-content';
export const geography3Subject = content.subject as StudySubject;
export const geography3Questions = content.questions.map(q => ({...q, hints: [q.hints[0],q.hints[1]] as [string,string]}));
export const geography3Quiz = geography3Questions.filter(q => q.pool === 'quiz');
export const geography3Infographics = content.infographics;
export const geography3Practice = content.practice;
export const geography3DeepStudy = Object.fromEntries(Object.entries(content.deepStudy).map(([id,study])=>[id,{...study,vocabulary:study.vocabulary.map(([icon,term,meaning]):[string,string,string]=>[icon,term,meaning])}])) as Record<string, DeepStudy>;
export const geography3Catalog = Object.fromEntries([
 ...geography3Subject.lessons.map(l => [l.quizId!, {title: `Quiz • ${l.title}`, subject: 'geography', questions: geography3Quiz.filter(q => q.topic === l.title)}]),
 ['geography3-general', {title: 'Geografia • Quiz de descoberta', subject: 'geography', questions: geography3Quiz}],
 ['geography3-mock-a', {title: 'Geografia • Simulado A', subject: 'geography', questions: geography3Questions.filter(q => q.pool === 'mock-a')}],
 ['geography3-mock-b', {title: 'Geografia • Simulado B', subject: 'geography', questions: geography3Questions.filter(q => q.pool === 'mock-b')}],
]) as Partial<Record<QuizId, {title:string; subject:SubjectKey; questions:QuizQuestion[]}>>;
export const geography3ImageForLesson = (id:string) => geography3Infographics[Math.max(0, geography3Subject.lessons.findIndex(l => l.id === id))];
