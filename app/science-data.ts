import content from './science-content.json';
import extension from './science-extension.json';
import type { StudySubject, QuizId, SubjectKey } from './curriculum-data';
import type { QuizQuestion } from './quiz-data';
import type { DeepStudy } from './deep-content';

const extraFacts: Record<string, {term: string; text: string}[]> = extension.extraFacts;
export const scienceSubject = {
  ...content.scienceSubject,
  quizId: 'science3-general',
  lessons: [...content.scienceSubject.lessons, ...extension.lessons].map(lesson => ({
    ...lesson,
    facts: [...lesson.facts, ...(extraFacts[lesson.id] ?? [])],
    quizId: lesson.id.replace('s3-', 'science3-'),
  })),
} as StudySubject;
// Keep the previous questions and IDs available for saved attempts and resumptions.
export const scienceQuiz = content.scienceQuiz as QuizQuestion[];
export const science3Quiz = extension.questions as QuizQuestion[];
export const scienceDeepStudyByLesson: Record<string, DeepStudy> = Object.fromEntries(
  Object.entries({...content.scienceDeepStudyByLesson, ...extension.deepStudy}).map(([id, study]) => [id, {
    ...study,
    vocabulary: study.vocabulary.map(([emoji, english, portuguese]): [string, string, string] => [emoji, english, portuguese]),
  }]),
);
export const science3Catalog = Object.fromEntries([
  ...scienceSubject.lessons.map(lesson => [lesson.quizId!, {title: `Science • ${lesson.title}`, subject: 'science', questions: science3Quiz.filter(q => q.topic === lesson.id)}]),
  ['science3-general', {title: 'Science • Term 3 Challenge', subject: 'science', questions: science3Quiz}],
  ['science3-mock-a', {title: 'Science • Practice test A', subject: 'science', questions: science3Quiz.filter((_, i) => i % 4 < 2)}],
  ['science3-mock-b', {title: 'Science • Practice test B', subject: 'science', questions: science3Quiz.filter((_, i) => i % 4 >= 2)}],
]) as Partial<Record<QuizId, {title: string; subject: SubjectKey; questions: QuizQuestion[]}>>;
export const scienceInfographicPages = content.scienceInfographicPages;
export const scienceMaterialsReady = true;
export const scienceDownloads = [
  {id: 'review', label: 'Science • 20 atividades para imprimir', src: '/science-term3/assessment/science-complete-review.pdf', pages: 10},
  {id: 'key', label: 'Science • Gabarito comentado', src: '/science-term3/assessment/science-complete-answer-key.pdf', pages: 5},
];
export const sciencePractice = extension.practice;
export const scienceSources = extension.sources;
export const scienceTopicTitle = (topic: string) => scienceSubject.lessons.find(lesson => lesson.id === topic)?.title ?? topic;
export const scienceImageForLesson = (id: string) => scienceInfographicPages[
  ['s3-sound','s3-hearing'].includes(id) ? 0 : ['s3-rocks-minerals','s3-rock-types'].includes(id) ? 1 : ['s3-fossils','s3-landscapes','s3-fossil-discovery'].includes(id) ? 2 : 3
];
