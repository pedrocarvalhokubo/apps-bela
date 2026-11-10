import type { IconName } from "../AppIcon";
import { curriculumSubjects, quizCatalog, type QuizId, type SubjectKey } from "../../curriculum-data";
import { ela3Subject } from "../../ela3-data";
import { geography3Subject } from "../../geography3-data";
import { history3Subject } from "../../history3-data";
import { portuguese3Subject } from "../../portuguese3-data";
import { scienceSubject } from "../../science-data";
import type { QuizStats, View } from "./types";

export const parentErrorMessages = new Set([
  "Use um PIN de 4 a 6 números",
  "O PIN já foi configurado",
  "PIN inválido",
  "PIN incorreto",
  "Código de configuração inválido.",
  "Escolha um PIN diferente da senha da Bela.",
  "Muitas tentativas. Aguarde 15 minutos.",
  "Dispositivo não conectado",
  "Sessão parental expirada",
]);

export function friendlyParentError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : "";
  return parentErrorMessages.has(message) ? message : fallback;
}

export const subjects: Array<{ key?: SubjectKey; name: string; icon: IconName; detail: string; status: "ready" | "soon"; color: string }> = [
  { key: "science", name: "Science", icon: "science", detail: `${scienceSubject.lessons.length} aulas • inglês e português`, status: "ready", color: "science" },
  { key: "portuguese", name: "Português", icon: "portuguese", detail: "Aulas e quizzes", status: "ready", color: "portuguese" },
  { key: "geography", name: "Geografia", icon: "geography", detail: "Aulas e quizzes", status: "ready", color: "geography" },
  { key: "math", name: "Math", icon: "math", detail: "Aulas e quizzes", status: "ready", color: "math" },
  { key: "ela", name: "E.L.A.", icon: "language", detail: "Aulas e quizzes", status: "ready", color: "ela" },
  { key: "history", name: "História", icon: "history", detail: "Aulas e quizzes", status: "ready", color: "history" },
];

export const emptyQuizStats = (): Record<QuizId, QuizStats> =>
  Object.fromEntries(Object.keys(quizCatalog).map((id) => [id, { bestScore: 0, attempts: 0, totalAnswered: 0 }])) as Record<QuizId, QuizStats>;

export const defaultSubject: SubjectKey = "ela";
export const defaultQuiz: QuizId = "ela3-general";
export const defaultLesson = ela3Subject.lessons[0].id;
export const availableSubjects = new Set<SubjectKey>(["science", "math", "ela", "geography", "history", "portuguese"]);
export const availableQuizzes = new Set<QuizId>(Object.keys(quizCatalog) as QuizId[]);
export const availableLessonIds = new Set([...Object.values(curriculumSubjects), history3Subject, ela3Subject, geography3Subject, portuguese3Subject].flatMap((subject) => subject.lessons.map((lesson) => lesson.id)));

export const elaInfographicPages = [
  { src: "/infographics/ela-term2-review-v1.webp", alt: "E.L.A. Term 2 exam map", width: 1024, height: 1536, label: "Map" },
  { src: "/infographics/ela-deep-1-story-elements.webp", alt: "Deep review of story elements", width: 864, height: 1821, label: "Story" },
  { src: "/infographics/ela-deep-2-character-traits.webp", alt: "Deep review of character traits", width: 1024, height: 1536, label: "Traits" },
  { src: "/infographics/ela-deep-3-georgie.webp", alt: "Deep review of The Thing About Georgie", width: 1024, height: 1536, label: "Georgie" },
  { src: "/infographics/ela-deep-4-5ws-1h.webp", alt: "Deep review of 5Ws and 1H", width: 1024, height: 1536, label: "5Ws" },
  { src: "/infographics/ela-deep-5-chronological-order.webp", alt: "Deep review of chronological order", width: 1024, height: 1536, label: "Order" },
  { src: "/infographics/ela-deep-6-writing-summary.webp", alt: "Deep review of writing a summary", width: 1024, height: 1536, label: "Summary" },
  { src: "/infographics/ela-deep-7-imagery.webp", alt: "Deep review of imagery", width: 1024, height: 1536, label: "Imagery" },
] as const;

export const geographyInfographicPages = [
  { src: "/infographics/geografia-1-setores-da-economia.webp", alt: "Infográfico sobre os setores primário, secundário e terciário", width: 1024, height: 1536, label: "Setores" },
  { src: "/infographics/geografia-2-campo-e-cidade.webp", alt: "Infográfico sobre a relação entre campo e cidade", width: 1024, height: 1536, label: "Campo e cidade" },
  { src: "/infographics/geografia-3-materia-prima-e-produtos.webp", alt: "Infográfico sobre matérias-primas e produtos", width: 1024, height: 1536, label: "Matéria-prima" },
  { src: "/infographics/geografia-4-origem-e-extrativismo.webp", alt: "Infográfico sobre origem animal, vegetal, mineral e extrativismo", width: 1024, height: 1536, label: "Origem" },
  { src: "/infographics/geografia-5-reciclagem-e-responsabilidade.webp", alt: "Infográfico sobre reciclagem e uso responsável dos recursos", width: 1024, height: 1536, label: "Reciclagem" },
] as const;
export const portugueseInfographicPages = [
  { src: "/infographics/portugues-1-entrevista.webp", alt: "Infográfico sobre entrevista", width: 1024, height: 1536, label: "Entrevista" },
  { src: "/infographics/portugues-2-substantivos.webp", alt: "Infográfico sobre substantivos", width: 1024, height: 1536, label: "Substantivos" },
  { src: "/infographics/portugues-3-sinonimos-antonimos.webp", alt: "Infográfico sobre sinônimos e antônimos", width: 1024, height: 1536, label: "Sinônimos" },
  { src: "/infographics/portugues-4-homonimas-paronimas.webp", alt: "Infográfico sobre homônimas e parônimas", width: 1024, height: 1536, label: "Palavras parecidas" },
  { src: "/infographics/portugues-5-isar-izar.webp", alt: "Infográfico sobre isar e izar", width: 1024, height: 1536, label: "-isar e -izar" },
] as const;

export const safeSubject = (value: unknown): SubjectKey => availableSubjects.has(value as SubjectKey)
  ? value as SubjectKey
  : defaultSubject;

export const safeQuiz = (value: unknown): QuizId => availableQuizzes.has(value as QuizId)
  ? value as QuizId
  : defaultQuiz;

export const safeStudyView = (value: unknown): Exclude<View, "home" | "results" | "parent"> =>
  value === "learn" || value === "infographic" || value === "quiz" || value === "science" ? value : "science";
