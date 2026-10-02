import content from './science-content.json';
import type { StudySubject } from './curriculum-data';
import type { QuizQuestion } from './quiz-data';
import type { DeepStudy } from './deep-content';

export const scienceSubject = content.scienceSubject as StudySubject;
export const scienceQuiz = content.scienceQuiz as QuizQuestion[];
export const scienceDeepStudyByLesson: Record<string, DeepStudy> = Object.fromEntries(
  Object.entries(content.scienceDeepStudyByLesson).map(([id, study]) => [id, {
    ...study,
    vocabulary: study.vocabulary.map(([emoji, english, portuguese]): [string, string, string] => [emoji, english, portuguese]),
  }]),
);
export const scienceInfographicPages = content.scienceInfographicPages;
// Enabled only after all canonical assets are inspected and packed.
export const scienceMaterialsReady = false;
