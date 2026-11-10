import type { QuizId, SubjectKey } from "../../curriculum-data";

export type View = "home" | "science" | "learn" | "infographic" | "quiz" | "results" | "parent";


export type QuizAnswer = {
  questionId: number;
  selected: string;
  correct: boolean;
  attempts?: number;
};

export type TopicSignal = {
  subject: string;
  topic: string;
  attempts: number;
  correct: number;
  reviewAttempts: number;
  reviewCorrect: number;
};

export type ParentAnalytics = {
  topics: TopicSignal[];
  wrongAnswers: Array<{
    subject: string;
    topic: string;
    quizId: QuizId;
    questionId: number;
    selected: string;
    createdAt: number;
  }>;
  state: SavedProgress | null;
  timeline?: Array<{day:string;attempts:number;correct:number}>;
  summary?: {attempts:number;correct:number;lastAt:number|null};
  drafts?: Array<{taskId:string;answer:string;updatedAt:number}>;
};

export type QuizStats = {
  bestScore: number;
  attempts: number;
  totalAnswered: number;
};

export type SavedProgress = {
  term?: number;
  completedLessons: string[];
  quizStats?: QuizStats;
  quizStatsById: Record<QuizId, QuizStats>;
  lastStudyView: Exclude<View, "home" | "results" | "parent">;
  activeSubject: SubjectKey;
  activeQuizId: QuizId;
  openLesson: string;
  quizIndex: number;
  selectedOption: string | null;
  answerChecked: boolean;
  quizAnswers: QuizAnswer[];
  resultAnswers: QuizAnswer[];
  doubtQuestionIds: string[];
  studyNotes: string;
};
