import { geography3Subject } from './geography3-data';
import { ela3Subject } from './ela3-data';
import { portuguese3Subject } from './portuguese3-data';
import content from './history3-content.json';
import type { StudySubject, QuizId, SubjectKey } from './curriculum-data';
import type { QuizQuestion } from './quiz-data';
import type { DeepStudy } from './deep-content';
export const history3Subject = content.historySubject as StudySubject;
export const history3Quiz = content.historyQuiz as QuizQuestion[];
export const history3DeepStudy: Record<string, DeepStudy> = Object.fromEntries(Object.entries(content.historyDeepStudyByLesson).map(([id, study]) => [id, { ...study, vocabulary: study.vocabulary.map(([icon, term, meaning]): [string, string, string] => [icon, term, meaning]) }]));
export const history3Infographics = content.historyInfographicPages;
export const history3Downloads = content.historyDownloads;
export const history3Catalog = Object.fromEntries([
  ...history3Subject.lessons.map(l => [l.quizId!, { title: `Quiz • ${l.title}`, subject: 'history' as SubjectKey, questions: history3Quiz.filter(q => q.topic === l.title) }]),
  ['history3-general', { title: 'História • III trimestre • revisão completa', subject: 'history', questions: history3Quiz }],
  ['history3-mock-a', { title: 'História • Simulado A', subject: 'history', questions: history3Quiz.filter((_,i) => i%4 < 2) }],
  ['history3-mock-b', { title: 'História • Simulado B', subject: 'history', questions: history3Quiz.filter((_,i) => i%4 >= 2) }],
]) as Partial<Record<QuizId, { title: string; subject: SubjectKey; questions: QuizQuestion[] }>>;
export const studySubject = (subjects: Record<SubjectKey, StudySubject>, subject: SubjectKey, term: number) => subject === 'geography' && term === 3 ? geography3Subject : subject === 'ela' && term === 3 ? ela3Subject : subject === 'history' && term === 3 ? history3Subject : subject === 'portuguese' && term === 3 ? portuguese3Subject : subjects[subject];
export const quizTerm = (id: QuizId) => id === 'science-general' || id.startsWith('geography3-') || id.startsWith('science3-') || id.startsWith('history3-') || id.startsWith('ela3-') || id.startsWith('portuguese3-') ? 3 : 2;

export const resumeTerm = (subject: SubjectKey, lessonId: string, quizId: QuizId, view: string) => view === 'quiz' ? quizTerm(quizId) : subject === 'science' || (subject === 'geography' && lessonId.startsWith('g3-')) || (subject === 'ela' && lessonId.startsWith('e3-')) || (subject === 'history' && lessonId.startsWith('h3-')) || (subject === 'portuguese' && lessonId.startsWith('p3-')) ? 3 : 2;
