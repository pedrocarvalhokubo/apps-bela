import content from './portuguese3-content.json';
import type { StudySubject, QuizId, SubjectKey } from './curriculum-data';
import type { QuizQuestion } from './quiz-data';
import type { DeepStudy } from './deep-content';
export const portuguese3Subject = content.subject as StudySubject;
export const portuguese3Questions = content.questions.map(q => ({...q, hints: [q.hints[0], q.hints[1]] as [string, string]}));
export const portuguese3Quiz = portuguese3Questions.filter(q => q.pool === 'quiz');
export const portuguese3Infographics = content.infographics;
export const portuguese3Practice = content.practice;
export const portuguese3DeepStudy = Object.fromEntries(Object.entries(content.deepStudy).map(([id, study]) => [id, {...study, vocabulary: study.vocabulary.map(([icon, term, meaning]): [string, string, string] => [icon, term, meaning])}])) as Record<string, DeepStudy>;
export const portuguese3Catalog = Object.fromEntries([
  ...portuguese3Subject.lessons.map(l => [l.quizId!, {title: `Quiz • ${l.title}`, subject: 'portuguese', questions: portuguese3Questions.filter(q => q.topic === l.title && q.pool !== 'roman-practice')}]),
  ['portuguese3-general', {title: 'Português • Quiz de revisão', subject: 'portuguese', questions: portuguese3Quiz}],
  ['portuguese3-mock-a', {title: 'Português • Simulado A', subject: 'portuguese', questions: portuguese3Questions.filter(q => q.pool === 'mock-a')}],
  ['portuguese3-roman-practice', {title: 'Português • Treino de algarismos romanos', subject: 'portuguese', questions: portuguese3Questions.filter(q => q.pool === 'roman-practice')}],
  ['portuguese3-mock-b', {title: 'Português • Simulado B', subject: 'portuguese', questions: portuguese3Questions.filter(q => q.pool === 'mock-b')}],
]) as Partial<Record<QuizId, {title: string; subject: SubjectKey; questions: QuizQuestion[]}>>;
export const portuguese3ImageForLesson = (id: string) => portuguese3Infographics.find(page => page.lessons.includes(id));
export {default as portuguese3Sources} from './portuguese3-sources.json';
