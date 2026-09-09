export type QuizOption = {
  id: string;
  label: string;
  explanation: string;
};

export type QuizQuestion = {
  id: number;
  topic: string;
  prompt: string;
  support: string;
  format?: "choice" | "association";
  concept?: string;
  visualKey?: "history-trade" | "history-wildlife" | "history-technology" | "history-payments" | "ela-story" | "ela-character" | "ela-senses" | "math-groups" | "math-data-time";
  visualPrompt?: string;
  correct: string;
  options: QuizOption[];
};

export function withAssociations(questions: QuizQuestion[], concepts: Record<number, string>): QuizQuestion[] {
  return questions.map((item) => concepts[item.id]
    ? { ...item, format: "association" as const, concept: concepts[item.id] }
    : item);
}
