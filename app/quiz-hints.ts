import type { QuizQuestion } from './quiz-data';

/** Existing quizzes retain their support text; new quizzes may graduate hints. */
export function questionHint(question: QuizQuestion, mistakes: number): string {
  if (!question.hints?.length) return question.support;
  return question.hints[Math.min(Math.max(mistakes - 1, 0), question.hints.length - 1)];
}
