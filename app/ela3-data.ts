import content from './ela3-content.json';
import type { StudySubject, QuizId, SubjectKey } from './curriculum-data';
import type { QuizQuestion } from './quiz-data';
import type { DeepStudy } from './deep-content';

export const ela3Subject = content.subject as StudySubject;
export const ela3Quiz = content.questions as QuizQuestion[];
export const ela3DeepStudy: Record<string, DeepStudy> = Object.fromEntries(Object.entries(content.deepStudy).map(([id, study]) => [id, { ...study, vocabulary: study.vocabulary.map(([icon, term, meaning]): [string, string, string] => [icon, term, meaning]) }]));
export const ela3Infographics = content.infographics;
export const ela3Practice = content.practice;
export const ela3Catalog = Object.fromEntries([
  ...ela3Subject.lessons.map(lesson => [lesson.quizId!, {title: `ELA • ${lesson.title}`, subject: 'ela', questions: ela3Quiz.filter(q => q.topic === lesson.title)}]),
  ['ela3-general', {title: 'ELA • Term 3 Challenge', subject: 'ela', questions: ela3Quiz}],
  ['ela3-mock-a', {title: 'ELA • Practice test A', subject: 'ela', questions: ela3Quiz.filter((_, i) => i % 4 < 2)}],
  ['ela3-mock-b', {title: 'ELA • Practice test B', subject: 'ela', questions: ela3Quiz.filter((_, i) => i % 4 >= 2)}],
]) as Partial<Record<QuizId, {title: string; subject: SubjectKey; questions: QuizQuestion[]}>>;

export const ela3ImageForLesson = (id: string) => ela3Infographics[['e3-blends','e3-verbs','e3-adverbs'].includes(id) ? 0 : ['e3-homophones','e3-homographs'].includes(id) ? 1 : 2];
