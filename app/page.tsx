"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { ensureDevice } from "../lib/device-client";
import {
  curriculumSubjects,
  quizCatalog,
  type QuizId,
  type StudyLesson,
  type SubjectKey,
} from "./curriculum-data";
import { deepStudyByLesson } from "./deep-content";
import { scienceInfographicPages, scienceMaterialsReady } from "./science-data";
import { questionHint } from "./quiz-hints";

type View = "home" | "science" | "learn" | "infographic" | "quiz" | "results" | "parent";

type IconName =
  | "home" | "subjects" | "star" | "trophy" | "science" | "math" | "language"
  | "portuguese" | "geography" | "history" | "book" | "art" | "medal" | "target"
  | "note" | "calendar" | "compass" | "brain" | "chart" | "phone" | "search"
  | "spark" | "sun" | "ray" | "lens" | "water" | "shadow" | "moon" | "arrow"
  | "lock" | "checklist" | "sync";

const iconGlyphs: Record<IconName, string> = {
  home: "⌂",
  subjects: "▦",
  star: "✦",
  trophy: "◆",
  science: "◉",
  math: "∑",
  language: "Aa",
  portuguese: "A",
  geography: "◎",
  history: "◷",
  book: "▤",
  art: "✣",
  medal: "◇",
  target: "◎",
  note: "?",
  calendar: "□",
  compass: "⌖",
  brain: "✦",
  chart: "▥",
  phone: "▯",
  search: "⌕",
  spark: "✦",
  sun: "☼",
  ray: "↗",
  lens: "◌",
  water: "≈",
  shadow: "◐",
  moon: "☾",
  arrow: "→",
  lock: "⌾",
  checklist: "✓",
  sync: "↻",
};

function AppIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return <span className={`app-icon ${className}`} aria-hidden="true">{iconGlyphs[name]}</span>;
}

type QuizAnswer = {
  questionId: number;
  selected: string;
  correct: boolean;
  attempts?: number;
};

type TopicSignal = {
  subject: string;
  topic: string;
  attempts: number;
  correct: number;
  reviewAttempts: number;
  reviewCorrect: number;
};

type ParentAnalytics = {
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
};

type QuizStats = {
  bestScore: number;
  attempts: number;
  totalAnswered: number;
};

type SavedProgress = {
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

const parentErrorMessages = new Set([
  "Use um PIN de 4 a 6 números",
  "O PIN já foi configurado",
  "PIN inválido",
  "PIN incorreto",
  "Muitas tentativas. Aguarde 15 minutos.",
  "Dispositivo não conectado",
  "Sessão parental expirada",
]);

function friendlyParentError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : "";
  return parentErrorMessages.has(message) ? message : fallback;
}

const subjects: Array<{ key?: SubjectKey; name: string; icon: IconName; detail: string; status: "ready" | "soon"; color: string }> = [
  { key: "science", name: "Science", icon: "science", detail: "8 aulas • inglês e português", status: "ready", color: "science" },
  { key: "portuguese", name: "Português", icon: "portuguese", detail: "Aulas e quizzes", status: "ready", color: "portuguese" },
  { key: "geography", name: "Geografia", icon: "geography", detail: "Aulas e quizzes", status: "ready", color: "geography" },
  { key: "math", name: "Math", icon: "math", detail: "Aulas e quizzes", status: "ready", color: "math" },
  { key: "ela", name: "E.L.A.", icon: "language", detail: "Aulas e quizzes", status: "ready", color: "ela" },
  { key: "history", name: "História", icon: "history", detail: "Aulas e quizzes", status: "ready", color: "history" },
];

const emptyQuizStats = (): Record<QuizId, QuizStats> => ({
  "science-general": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  math: { bestScore: 0, attempts: 0, totalAnswered: 0 },
  ela: { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "geography-sectors": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "geography-field-city": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "geography-materials": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "geography-origin": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "geography-recycling": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "geography-general": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "history-trade": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "history-wildlife": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "history-technology": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "history-payments": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "history-general": { bestScore: 0, attempts: 0, totalAnswered: 0 },
  "portuguese-general": { bestScore: 0, attempts: 0, totalAnswered: 0 },
});

const defaultSubject: SubjectKey = "geography";
const defaultQuiz: QuizId = "geography-general";
const defaultLesson = curriculumSubjects.geography.lessons[0].id;
const availableSubjects = new Set<SubjectKey>(["science", "math", "ela", "geography", "history", "portuguese"]);
const availableQuizzes = new Set<QuizId>(Object.keys(quizCatalog) as QuizId[]);
const availableLessonIds = new Set(Object.values(curriculumSubjects).flatMap((subject) => subject.lessons.map((lesson) => lesson.id)));

const elaInfographicPages = [
  { src: "/infographics/ela-term2-review-v1.webp", alt: "E.L.A. Term 2 exam map", width: 1024, height: 1536, label: "Map" },
  { src: "/infographics/ela-deep-1-story-elements.webp", alt: "Deep review of story elements", width: 864, height: 1821, label: "Story" },
  { src: "/infographics/ela-deep-2-character-traits.webp", alt: "Deep review of character traits", width: 1024, height: 1536, label: "Traits" },
  { src: "/infographics/ela-deep-3-georgie.webp", alt: "Deep review of The Thing About Georgie", width: 1024, height: 1536, label: "Georgie" },
  { src: "/infographics/ela-deep-4-5ws-1h.webp", alt: "Deep review of 5Ws and 1H", width: 1024, height: 1536, label: "5Ws" },
  { src: "/infographics/ela-deep-5-chronological-order.webp", alt: "Deep review of chronological order", width: 1024, height: 1536, label: "Order" },
  { src: "/infographics/ela-deep-6-writing-summary.webp", alt: "Deep review of writing a summary", width: 1024, height: 1536, label: "Summary" },
  { src: "/infographics/ela-deep-7-imagery.webp", alt: "Deep review of imagery", width: 1024, height: 1536, label: "Imagery" },
] as const;

const geographyInfographicPages = [
  { src: "/infographics/geografia-1-setores-da-economia.webp", alt: "Infográfico sobre os setores primário, secundário e terciário", width: 1024, height: 1536, label: "Setores" },
  { src: "/infographics/geografia-2-campo-e-cidade.webp", alt: "Infográfico sobre a relação entre campo e cidade", width: 1024, height: 1536, label: "Campo e cidade" },
  { src: "/infographics/geografia-3-materia-prima-e-produtos.webp", alt: "Infográfico sobre matérias-primas e produtos", width: 1024, height: 1536, label: "Matéria-prima" },
  { src: "/infographics/geografia-4-origem-e-extrativismo.webp", alt: "Infográfico sobre origem animal, vegetal, mineral e extrativismo", width: 1024, height: 1536, label: "Origem" },
  { src: "/infographics/geografia-5-reciclagem-e-responsabilidade.webp", alt: "Infográfico sobre reciclagem e uso responsável dos recursos", width: 1024, height: 1536, label: "Reciclagem" },
] as const;
const portugueseInfographicPages = [
  { src: "/infographics/portugues-1-entrevista.webp", alt: "Infográfico sobre entrevista", width: 1024, height: 1536, label: "Entrevista" },
  { src: "/infographics/portugues-2-substantivos.webp", alt: "Infográfico sobre substantivos", width: 1024, height: 1536, label: "Substantivos" },
  { src: "/infographics/portugues-3-sinonimos-antonimos.webp", alt: "Infográfico sobre sinônimos e antônimos", width: 1024, height: 1536, label: "Sinônimos" },
  { src: "/infographics/portugues-4-homonimas-paronimas.webp", alt: "Infográfico sobre homônimas e parônimas", width: 1024, height: 1536, label: "Palavras parecidas" },
  { src: "/infographics/portugues-5-isar-izar.webp", alt: "Infográfico sobre isar e izar", width: 1024, height: 1536, label: "-isar e -izar" },
] as const;

const safeSubject = (value: unknown): SubjectKey => availableSubjects.has(value as SubjectKey)
  ? value as SubjectKey
  : defaultSubject;

const safeQuiz = (value: unknown): QuizId => availableQuizzes.has(value as QuizId)
  ? value as QuizId
  : defaultQuiz;

const safeStudyView = (value: unknown): Exclude<View, "home" | "results" | "parent"> =>
  value === "learn" || value === "infographic" || value === "quiz" || value === "science" ? value : "science";

function LessonVisual({ subject, lessonId }: { subject: SubjectKey; lessonId: string }) {
  if (subject === "math") {
    if (lessonId === "math-time") return <div className="lesson-visual clock-visual" aria-label="Clock showing quarter past three"><div className="clock-face"><b>12</b><b>3</b><b>6</b><b>9</b><i className="hour-hand" /><i className="minute-hand" /><span /></div><p><strong>3:15</strong><small>quarter past three</small></p></div>;
    if (["math-bar-picto", "math-line-pie"].includes(lessonId)) return <div className="lesson-visual graph-visual" aria-label="Example bar graph"><div><i style={{ height: "38%" }} /><i style={{ height: "72%" }} /><i style={{ height: "54%" }} /><i style={{ height: "90%" }} /></div><p><strong>Read the data story</strong><small>title → labels → scale → compare</small></p></div>;
    if (lessonId === "math-remainders") return <div className="lesson-visual box-visual"><div><span>10</span><span>10</span><span>10</span><span>+5</span></div><p><strong>35 ÷ 10 = 3 R5</strong><small>Does the story need one more box?</small></p></div>;
    if (["math-division-meaning", "math-division-strategies", "math-long-division"].includes(lessonId)) return <div className="lesson-visual groups-visual"><div>{[0, 1, 2, 3].map((group) => <span key={group}>{[0, 1, 2].map((dot) => <i key={dot} />)}</span>)}</div><p><strong>12 ÷ 4 = 3</strong><small>Share equally • count each group</small></p></div>;
    return <div className="lesson-visual array-visual"><div>{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><p><strong>3 rows × 4 dots = 12</strong><small>array • repeated addition • product</small></p></div>;
  }
  if (subject === "ela") {
    if (lessonId === "ela-5w1h") return <div className="lesson-visual wh-visual">{["WHO", "WHAT", "WHEN", "WHERE", "WHY", "HOW"].map((word) => <span key={word}>{word}</span>)}</div>;
    if (lessonId === "ela-chronology") return <div className="lesson-visual timeline-visual"><span>First</span><i /><span>Next</span><i /><span>Then</span><i /><span>Finally</span></div>;
    if (lessonId === "ela-imagery") return <div className="lesson-visual senses-visual"><strong>IMAGERY</strong>{[["👁", "sight"], ["👂", "sound"], ["👃", "smell"], ["👅", "taste"], ["✋", "touch"]].map(([icon, label]) => <span key={label}>{icon}<small>{label}</small></span>)}</div>;
    if (lessonId === "ela-summary") return <div className="lesson-visual summary-visual"><div><span>whole text</span><span>main idea + key details</span><span>clear summary</span></div></div>;
    if (lessonId === "ela-character-traits") return <div className="lesson-visual traits-visual"><span>👧🏽</span><div><b>PHYSICAL</b><small>curly hair • brown eyes</small><b>PERSONALITY</b><small>brave • patient • loyal</small></div></div>;
    return <div className="lesson-visual story-map-visual"><span><b>SETTING</b><small>where + when</small></span><i>→</i><span><b>PROBLEM</b><small>what changes?</small></span><i>→</i><span><b>SOLUTION</b><small>how does it end?</small></span></div>;
  }
  if (subject === "history") {
    if (lessonId === "history-trade") return <div className="lesson-visual history-trade-visual"><span><b>🌳 Pau-brasil</b><small>conhecimento + trabalho indígena</small></span><i>⇄</i><span><b>🪓 Ferramentas</b><small>troca direta, sem moeda</small></span></div>;
    if (lessonId === "history-wildlife") return <div className="lesson-visual history-wildlife-visual"><span>🦜</span><i>→</i><span className="danger-cage">▦</span><i>→</i><span>🏥</span><p><strong>Tráfico é crime</strong><small>não comprar • comunicar • proteger</small></p></div>;
    if (lessonId === "history-technology") return <div className="lesson-visual history-tech-visual"><span>🛒<small>comprar</small></span><span>📚<small>estudar</small></span><span>💼<small>trabalhar</small></span><span>🩺<small>consultar</small></span><p><strong>Internet durante a pandemia</strong><small>mais possibilidades, mas acesso desigual</small></p></div>;
    return <div className="lesson-visual history-payment-visual"><span><b>🤝</b><small>escambo</small></span><i>→</i><span><b>💵</b><small>dinheiro</small></span><i>→</i><span><b>💳</b><small>cartão</small></span><i>→</i><span><b>📱</b><small>Pix</small></span></div>;
  }
  if (subject === "geography") {
    if (lessonId === "geography-sectors") return <div className="lesson-visual geography-chain-visual"><span><b>🌾</b><small>primário</small></span><i>→</i><span><b>🏭</b><small>secundário</small></span><i>→</i><span><b>🛍️</b><small>terciário</small></span></div>;
    if (lessonId === "geography-field-city") return <div className="lesson-visual geography-field-visual"><span><b>🚜 CAMPO</b><small>alimentos • matérias-primas</small></span><i>⇄</i><span><b>🏙️ CIDADE</b><small>serviços • indústrias • comércio</small></span></div>;
    if (lessonId === "geography-materials") return <div className="lesson-visual geography-product-visual"><span>🌾<small>trigo</small></span><i>→</i><span>🌾<small>farinha</small></span><i>→</i><span>🍞<small>pão</small></span><i>→</i><span>🏪<small>venda</small></span></div>;
    if (lessonId === "geography-origin") return <div className="lesson-visual geography-origin-visual"><span>🐝<small>animal</small></span><span>🌳<small>vegetal</small></span><span>⛰️<small>mineral</small></span></div>;
    return <div className="lesson-visual geography-recycling-visual"><span>📄</span><i>→</i><span>♻️</span><i>→</i><span>📒</span><p><strong>Um novo ciclo</strong><small>menos resíduos • menos matéria-prima nova</small></p></div>;
  }
  return null;
}

function GeographyQuestionVisual({ topic }: { topic: string }) {
  if (topic === "Setores da economia") return <div className="geography-question-visual"><span>🌾<small>produzir</small></span><i>→</i><span>🏭<small>transformar</small></span><i>→</i><span>🛍️<small>vender e servir</small></span></div>;
  if (topic === "Campo e cidade") return <div className="geography-question-visual"><span>🚜<small>campo</small></span><i>⇄</i><span>🚚<small>circulação</small></span><i>⇄</i><span>🏙️<small>cidade</small></span></div>;
  if (topic === "Matéria-prima e produtos") return <div className="geography-question-visual"><span>🌳<small>matéria-prima</small></span><i>→</i><span>⚙️<small>transformação</small></span><i>→</i><span>📒<small>produto</small></span></div>;
  if (topic === "Origem e extrativismo") return <div className="geography-question-visual"><span>🐝<small>animal</small></span><span>🌱<small>vegetal</small></span><span>⛰️<small>mineral</small></span></div>;
  return <div className="geography-question-visual"><span>📄<small>usar</small></span><i>→</i><span>♻️<small>reciclar</small></span><i>→</i><span>📒<small>novo produto</small></span></div>;
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [term, setTerm] = useState(2);
  const [openLesson, setOpenLesson] = useState<string>(defaultLesson);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizStatsById, setQuizStatsById] = useState<Record<QuizId, QuizStats>>(emptyQuizStats);
  const [activeSubject, setActiveSubject] = useState<SubjectKey>(defaultSubject);
  const [activeQuizId, setActiveQuizId] = useState<QuizId>(defaultQuiz);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [resultAnswers, setResultAnswers] = useState<QuizAnswer[]>([]);
  const [lastStudyView, setLastStudyView] = useState<Exclude<View, "home" | "results" | "parent">>("science");
  const [doubtQuestionIds, setDoubtQuestionIds] = useState<string[]>([]);
  const [studyNotes, setStudyNotes] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [enlargedInfographic, setEnlargedInfographic] = useState(false);
  const [infographicPage, setInfographicPage] = useState(0);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deviceToken, setDeviceToken] = useState("");
  const [syncState, setSyncState] = useState<"local" | "syncing" | "synced" | "offline">("local");
  const [topicSignals, setTopicSignals] = useState<TopicSignal[]>([]);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [questionMistakes, setQuestionMistakes] = useState(0);
  const [thinkingFeedback, setThinkingFeedback] = useState("");
  const [parentHasPin, setParentHasPin] = useState<boolean | null>(null);
  const [parentPin, setParentPin] = useState("");
  const [parentToken, setParentToken] = useState("");
  const [parentError, setParentError] = useState("");
  const [parentAnalytics, setParentAnalytics] = useState<ParentAnalytics | null>(null);
  const [pairLink, setPairLink] = useState("");
  const [pairQr, setPairQr] = useState("");
  const [pairExpiresAt, setPairExpiresAt] = useState<number | null>(null);
  const [pairMessage, setPairMessage] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem("bela-study-progress");
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<SavedProgress>;
          setCompletedLessons((parsed.completedLessons ?? []).filter((id) => availableLessonIds.has(id)));
          const restoredStats = { ...emptyQuizStats() };
          for (const id of availableQuizzes) {
            if (parsed.quizStatsById?.[id]) restoredStats[id] = parsed.quizStatsById[id];
          }
          setQuizStatsById(restoredStats);
          setActiveSubject(safeSubject(parsed.activeSubject));
          setActiveQuizId(safeQuiz(parsed.activeQuizId));
          setLastStudyView(safeStudyView(parsed.lastStudyView));
          const savedLesson = parsed.openLesson ?? defaultLesson;
          setOpenLesson(Object.values(curriculumSubjects).some((subject) => subject.lessons.some((lesson) => lesson.id === savedLesson)) ? savedLesson : defaultLesson);
          setQuizIndex(parsed.quizIndex ?? 0);
          setSelectedOption(parsed.selectedOption ?? null);
          setAnswerChecked(parsed.answerChecked ?? false);
          setQuizAnswers(parsed.quizAnswers ?? []);
          setResultAnswers(parsed.resultAnswers ?? []);
          setDoubtQuestionIds((parsed.doubtQuestionIds ?? []).filter((id) => availableQuizzes.has(String(id).split(":")[0] as QuizId)));
          setStudyNotes(parsed.studyNotes ?? "");
        }
      } catch {
        // A ausência de armazenamento local não impede os estudos.
      } finally {
        setStorageReady(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    let cancelled = false;

    const connect = async () => {
      setSyncState("syncing");
      try {
        const params = new URLSearchParams(window.location.search);
        const pairingCode = params.get("pair");
        const token = await ensureDevice();
        if (pairingCode) setPairMessage("Aparelho conectado ao progresso da Bela!");

        if (cancelled) return;
        const response = await fetch("/api/sync", { headers: { "x-bela-device-token": token } });
        const result = await response.json() as { state?: Partial<SavedProgress> | null; topics?: TopicSignal[] };
        if (!response.ok) throw new Error("Sincronização indisponível");
        if (result.state) {
          const saved = result.state;
          setCompletedLessons((saved.completedLessons ?? []).filter((id) => availableLessonIds.has(id)));
          const syncedStats = { ...emptyQuizStats() };
          for (const id of availableQuizzes) {
            if (saved.quizStatsById?.[id]) syncedStats[id] = saved.quizStatsById[id];
          }
          setQuizStatsById(syncedStats);
          setActiveSubject(safeSubject(saved.activeSubject));
          setActiveQuizId(safeQuiz(saved.activeQuizId));
          setLastStudyView(safeStudyView(saved.lastStudyView));
          const syncedLesson = saved.openLesson ?? defaultLesson;
          setOpenLesson(Object.values(curriculumSubjects).some((subject) => subject.lessons.some((lesson) => lesson.id === syncedLesson)) ? syncedLesson : defaultLesson);
          setDoubtQuestionIds((saved.doubtQuestionIds ?? []).filter((id) => availableQuizzes.has(String(id).split(":")[0] as QuizId)));
          setStudyNotes(saved.studyNotes ?? "");
        }
        setTopicSignals((result.topics ?? []).filter((item) => availableSubjects.has(item.subject as SubjectKey)).map((item) => ({
          ...item,
          attempts: Number(item.attempts), correct: Number(item.correct),
          reviewAttempts: Number(item.reviewAttempts), reviewCorrect: Number(item.reviewCorrect),
        })));
        setDeviceToken(token);
        setSyncState("synced");
      } catch {
        const pairingCode = new URLSearchParams(window.location.search).get("pair");
        if (pairingCode) setPairMessage("Este link de pareamento expirou ou não pôde ser usado. Peça aos pais para gerar outro.");
        setSyncState("offline");
      }
    };

    void connect();
    return () => { cancelled = true; };
  }, [storageReady]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const standalone = window.matchMedia("(display-mode: standalone)").matches
        || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
      setIsStandalone(standalone);
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // The app remains fully usable online if registration is unavailable.
      });
    }
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    const progress: SavedProgress = {
      completedLessons,
      quizStatsById,
      lastStudyView,
      activeSubject,
      activeQuizId,
      openLesson,
      quizIndex,
      selectedOption,
      answerChecked,
      quizAnswers,
      resultAnswers,
      doubtQuestionIds,
      studyNotes,
    };
    try {
      window.localStorage.setItem("bela-study-progress", JSON.stringify(progress));
    } catch {
      // Mantém a experiência funcional mesmo se o navegador bloquear o salvamento.
    }
    if (!deviceToken) return;
    const timer = window.setTimeout(() => {
      setSyncState("syncing");
      fetch("/api/sync", {
        method: "POST",
        headers: { "content-type": "application/json", "x-bela-device-token": deviceToken },
        body: JSON.stringify({ state: progress, updatedAt: Date.now() }),
      }).then((response) => {
        if (!response.ok) throw new Error("sync");
        setSyncState("synced");
      }).catch(() => setSyncState("offline"));
    }, 650);
    return () => window.clearTimeout(timer);
  }, [
    answerChecked,
    activeQuizId,
    activeSubject,
    completedLessons,
    doubtQuestionIds,
    lastStudyView,
    openLesson,
    quizAnswers,
    quizIndex,
    quizStatsById,
    resultAnswers,
    selectedOption,
    storageReady,
    studyNotes,
    deviceToken,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowReset(false);
        setShowInstall(false);
        setEnlargedInfographic(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeSubjectData = curriculumSubjects[activeSubject];
  const reviewInfographicPages = activeSubject === "science" ? scienceInfographicPages : activeSubject === "geography" ? geographyInfographicPages : activeSubject === "portuguese" ? portugueseInfographicPages : elaInfographicPages;
  const currentLessons = activeSubjectData.lessons;
  const completedCurrentLessons = currentLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  const learnProgress = Math.round((completedCurrentLessons / currentLessons.length) * 100);
  const currentQuestions = quizCatalog[activeQuizId].questions;
  const allLessons = Object.values(curriculumSubjects).flatMap((subject) => subject.lessons);
  const completedAllLessons = allLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  const totalBestAnswers = Object.values(quizStatsById).reduce((sum, stats) => sum + stats.bestScore, 0);
  const totalQuizQuestions = Object.values(quizCatalog).reduce((sum, quiz) => sum + quiz.questions.length, 0);
  const overallProgress = Math.round(
    (completedAllLessons / allLessons.length) * 45 + (totalBestAnswers / totalQuizQuestions) * 55,
  );

  const go = (next: View) => {
    if (next !== "home" && next !== "results" && next !== "parent") setLastStudyView(next);
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLesson = (lessonId: string) => {
    const next = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];
    setCompletedLessons(next);
  };

  const activeLesson = useMemo(
    () => currentLessons.find((lesson) => lesson.id === openLesson) ?? currentLessons[0],
    [currentLessons, openLesson],
  );

  const currentQuestion = currentQuestions[quizIndex];
  const resultScore = resultAnswers.filter((answer) => answer.correct).length;
  const resultPercent = Math.round((resultScore / currentQuestions.length) * 100);
  const activeQuizTitle = quizCatalog[activeQuizId].title;
  const isPortugueseMode = activeSubject === "history" || activeSubject === "geography" || activeSubject === "portuguese";
  const topicList = useMemo(() => [...new Set(currentQuestions.map((item) => item.topic))], [currentQuestions]);

  const topicResults = useMemo(
    () => topicList.map((topic) => {
      const questionIds = currentQuestions.filter((question) => question.topic === topic).map((question) => question.id);
      const answers = resultAnswers.filter((answer) => questionIds.includes(answer.questionId));
      return {
        topic,
        correct: answers.filter((answer) => answer.correct).length,
        total: questionIds.length,
      };
    }),
    [currentQuestions, resultAnswers, topicList],
  );

  const nextSteps = useMemo(() => {
    const schedule: Array<{ subject: SubjectKey; name: string; date: string; shortDate: string; lessons: StudyLesson[] }> = [
      { subject: "science", name: "Science", date: "", shortDate: "ESTUDAR", lessons: curriculumSubjects.science.lessons },
      { subject: "geography", name: "Geografia", date: "", shortDate: "ESTUDAR", lessons: curriculumSubjects.geography.lessons },
      { subject: "ela", name: "E.L.A.", date: "", shortDate: "ESTUDAR", lessons: curriculumSubjects.ela.lessons },
      { subject: "math", name: "Math", date: "", shortDate: "ESTUDAR", lessons: curriculumSubjects.math.lessons },
      { subject: "history", name: "História", date: "", shortDate: "ESTUDAR", lessons: curriculumSubjects.history.lessons },
    ];
    const steps: Array<{ subject: SubjectKey; title: string; detail: string; badge: string; kind: string }> = [];
    const weak = [...topicSignals]
      .filter((topic) => topic.attempts >= 2 && topic.correct / topic.attempts < 0.8)
      .sort((a, b) => a.correct / a.attempts - b.correct / b.attempts)[0];
    if (weak) {
      steps.push({
        subject: weak.subject as SubjectKey,
        title: `Reforçar: ${weak.topic}`,
        detail: `Você acertou ${Math.round((weak.correct / weak.attempts) * 100)}% até agora. Vamos praticar com calma.`,
        badge: "PRIORIDADE",
        kind: "weak",
      });
    }
    for (const item of schedule) {
      const pending = item.lessons.find((lesson) => !completedLessons.includes(lesson.id));
      if (!pending) continue;
      steps.push({ subject: item.subject, title: pending.title, detail: `${item.name} • continuar os estudos`, badge: item.shortDate, kind: "lesson" });
      if (steps.length === 3) break;
    }
    const review = topicSignals.find((topic) => topic.attempts >= 3 && topic.correct / topic.attempts >= 0.8 && topic.reviewAttempts === 0);
    if (review && steps.length < 3) {
      steps.push({ subject: review.subject as SubjectKey, title: `Revisão: ${review.topic}`, detail: "Você já chegou a 80%. Faça uma revisão posterior para dominar o assunto.", badge: "REVISAR", kind: "review" });
    }
    return steps.slice(0, 3);
  }, [completedLessons, topicSignals]);

  const recordAttempt = (selected: string, correct: boolean) => {
    if (!deviceToken) return;
    fetch("/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json", "x-bela-device-token": deviceToken },
      body: JSON.stringify({
        subject: activeSubject,
        quizId: activeQuizId,
        questionId: currentQuestion.id,
        topic: currentQuestion.topic,
        selected,
        correct,
        isReview: quizStatsById[activeQuizId].attempts > 0,
      }),
    }).then(async (response) => {
      if (!response.ok) throw new Error("attempt");
      const refreshed = await fetch("/api/sync", { headers: { "x-bela-device-token": deviceToken } });
      const result = await refreshed.json() as { topics?: TopicSignal[] };
      setTopicSignals((result.topics ?? []).filter((item) => availableSubjects.has(item.subject as SubjectKey)).map((item) => ({
        ...item,
        attempts: Number(item.attempts), correct: Number(item.correct),
        reviewAttempts: Number(item.reviewAttempts), reviewCorrect: Number(item.reviewCorrect),
      })));
    }).catch(() => setSyncState("offline"));
  };

  const loadParentAnalytics = async (token: string) => {
    const response = await fetch("/api/parent", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-bela-device-token": deviceToken,
        "x-bela-parent-token": token,
      },
      body: JSON.stringify({ action: "analytics" }),
    });
    const result = await response.json() as ParentAnalytics & { ok?: boolean; error?: string };
    if (!response.ok) throw new Error(result.error ?? "Não foi possível abrir o acompanhamento");
    result.topics = (result.topics ?? []).map((item) => ({
      ...item,
      attempts: Number(item.attempts), correct: Number(item.correct),
      reviewAttempts: Number(item.reviewAttempts), reviewCorrect: Number(item.reviewCorrect),
    }));
    result.topics = result.topics.filter((item) => item.subject === "obmep" || availableSubjects.has(item.subject as SubjectKey));
    result.wrongAnswers = (result.wrongAnswers ?? []).filter((item) => item.subject === "obmep" || availableQuizzes.has(item.quizId));
    if (result.state) {
      result.state.completedLessons = (result.state.completedLessons ?? []).filter((id) => availableLessonIds.has(id));
    }
    setParentAnalytics(result);
  };

  const openParent = async () => {
    go("parent");
    setParentError("");
    if (!deviceToken) return;
    try {
      const response = await fetch("/api/parent", { headers: { "x-bela-device-token": deviceToken } });
      const result = await response.json() as { hasPin?: boolean };
      setParentHasPin(Boolean(result.hasPin));
      const savedToken = window.sessionStorage.getItem("bela-parent-token") ?? "";
      if (savedToken) {
        setParentToken(savedToken);
        await loadParentAnalytics(savedToken);
      }
    } catch {
      setParentError("Não foi possível abrir a área parental agora.");
    }
  };

  const unlockParent = async () => {
    setParentError("");
    try {
      const response = await fetch("/api/parent", {
        method: "POST",
        headers: { "content-type": "application/json", "x-bela-device-token": deviceToken },
        body: JSON.stringify({ action: parentHasPin ? "verify-pin" : "setup-pin", pin: parentPin }),
      });
      const result = await response.json() as { parentToken?: string; error?: string };
      if (!response.ok || !result.parentToken) throw new Error(result.error ?? "PIN inválido");
      setParentToken(result.parentToken);
      setParentHasPin(true);
      setParentPin("");
      window.sessionStorage.setItem("bela-parent-token", result.parentToken);
      await loadParentAnalytics(result.parentToken);
    } catch (error) {
      setParentError(friendlyParentError(
        error,
        "Não foi possível validar o PIN agora. Tente novamente em alguns instantes.",
      ));
    }
  };

  const createPair = async () => {
    setParentError("");
    try {
      const response = await fetch("/api/parent", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-bela-device-token": deviceToken,
          "x-bela-parent-token": parentToken,
        },
        body: JSON.stringify({ action: "create-pair" }),
      });
      const result = await response.json() as { code?: string; expiresAt?: number; error?: string };
      if (!response.ok || !result.code || !result.expiresAt) throw new Error(result.error ?? "Não foi possível gerar o link");
      const link = `${window.location.origin}${window.location.pathname}?pair=${result.code}`;
      setPairLink(link);
      setPairExpiresAt(result.expiresAt);
      setPairQr(await QRCode.toDataURL(link, { width: 260, margin: 1, color: { dark: "#173a63", light: "#ffffff" } }));
    } catch (error) {
      setParentError(friendlyParentError(
        error,
        "Não foi possível gerar o pareamento agora. Tente novamente em alguns instantes.",
      ));
    }
  };

  const startQuiz = (quizId: QuizId) => {
    if (!quizCatalog[quizId].questions.length) return;
    setTerm(quizCatalog[quizId].subject === "science" ? 3 : 2);
    setInfographicPage(0);
    setActiveSubject(quizCatalog[quizId].subject);
    setActiveQuizId(quizId);
    setQuizIndex(0);
    setSelectedOption(null);
    setAnswerChecked(false);
    setQuizAnswers([]);
    setResultAnswers([]);
    setEliminatedOptions([]);
    setQuestionMistakes(0);
    setThinkingFeedback("");
    go("quiz");
  };

  const openSubject = (subject: SubjectKey) => {
    setActiveSubject(subject);
    setTerm(subject === "science" ? 3 : 2);
    setInfographicPage(0);
    const firstLesson = curriculumSubjects[subject].lessons[0].id;
    setOpenLesson(firstLesson);
    go("science");
  };

  const resumeStudy = () => {
    go(lastStudyView);
  };

  const toggleDoubt = (questionId: number) => {
    const doubtId = `${activeQuizId}:${questionId}`;
    setDoubtQuestionIds((current) => current.includes(doubtId)
      ? current.filter((id) => id !== doubtId)
      : [...current, doubtId]);
  };

  const resetProgress = () => {
    try {
      window.localStorage.removeItem("bela-study-progress");
    } catch {
      // O estado visível ainda é reiniciado mesmo se o armazenamento estiver bloqueado.
    }
    setCompletedLessons([]);
    setQuizStatsById(emptyQuizStats());
    setActiveSubject(defaultSubject);
    setActiveQuizId(defaultQuiz);
    setLastStudyView("science");
    setOpenLesson(defaultLesson);
    setQuizIndex(0);
    setSelectedOption(null);
    setAnswerChecked(false);
    setQuizAnswers([]);
    setResultAnswers([]);
    setDoubtQuestionIds([]);
    setStudyNotes("");
    setEliminatedOptions([]);
    setQuestionMistakes(0);
    setThinkingFeedback("");
    setShowReset(false);
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const checkAnswer = () => {
    if (!selectedOption || answerChecked) return;
    const isCorrect = selectedOption === currentQuestion.correct;
    recordAttempt(selectedOption, isCorrect);
    if (!isCorrect) {
      const wrongOption = currentQuestion.options.find((option) => option.id === selectedOption);
      setEliminatedOptions((current) => [...current, selectedOption]);
      setQuestionMistakes((count) => count + 1);
      setThinkingFeedback(`${wrongOption?.explanation ?? "Essa alternativa não combina com as pistas."} ${questionHint(currentQuestion, questionMistakes + 1)}`);
      setSelectedOption(null);
      return;
    }
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selected: selectedOption,
      correct: questionMistakes === 0,
      attempts: questionMistakes + 1,
    };
    setQuizAnswers((current) => [...current, answer]);
    setThinkingFeedback("");
    setAnswerChecked(true);
  };

  const nextQuestion = () => {
    if (!answerChecked) return;
    if (quizIndex < currentQuestions.length - 1) {
      setQuizIndex((index) => index + 1);
      setSelectedOption(null);
      setAnswerChecked(false);
      setEliminatedOptions([]);
      setQuestionMistakes(0);
      setThinkingFeedback("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const score = quizAnswers.filter((answer) => answer.correct).length;
    const previousStats = quizStatsById[activeQuizId];
    const nextStats: QuizStats = {
      bestScore: Math.max(previousStats.bestScore, score),
      attempts: previousStats.attempts + 1,
      totalAnswered: previousStats.totalAnswered + currentQuestions.length,
    };
    setQuizStatsById((current) => ({ ...current, [activeQuizId]: nextStats }));
    setResultAnswers(quizAnswers);
    go("results");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go("home")} aria-label="Voltar ao início">
          <span className="brand-mark">B</span>
          <span>
            <strong>Estudos da Bela</strong>
            <small>Aprender, revisar e praticar</small>
          </span>
        </button>

        <nav aria-label="Navegação principal">
          <button className={view === "home" ? "nav-active" : ""} onClick={() => go("home")}>
            <AppIcon name="home" /> Início
          </button>
          <button className={view !== "home" ? "nav-active" : ""} onClick={() => go("science")}>
            <AppIcon name="subjects" /> Matérias
          </button>
        </nav>

        <div className="header-actions">
          <span className={`sync-chip sync-${syncState}`} title={syncState === "synced" ? "Progresso sincronizado" : "Sincronização em andamento"}>
            <AppIcon name="sync" /> {syncState === "synced" ? "Salvo" : syncState === "offline" ? "Offline" : "Salvando"}
          </span>
          <div className="profile-chip" aria-label="Perfil de Bela">
            <AppIcon name="star" />
            <b>Bela</b>
          </div>
          <button className="parent-trigger" onClick={openParent} aria-label="Abrir área parental">
            <AppIcon name="lock" /> <span>Pais</span>
          </button>
          {!isStandalone && (
            <button className="install-trigger" onClick={() => setShowInstall(true)} aria-label="Instalar no iPhone">
              <span>▣</span> <span>Instalar</span>
            </button>
          )}
          <button className="reset-trigger" onClick={() => setShowReset(true)} aria-label="Reiniciar progresso das matérias">
            ↻ <span>Reiniciar</span>
          </button>
        </div>
      </header>

      {view === "home" && (
        <div className="page home-page">
          <section className="welcome-card">
            <div className="welcome-copy">
              <span className="eyebrow"><AppIcon name="spark" /> OLÁ, BELA!</span>
              <h1>Qual aventura vamos estudar hoje?</h1>
              <p>
                Explore missões visuais, pratique por assunto e avance até se sentir supersegura para a prova.
              </p>
              <button className="primary-button" onClick={resumeStudy} disabled={!storageReady}>
                {storageReady ? "Continuar de onde parei" : "Carregando progresso..."} <span>→</span>
              </button>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="learning-orb"><span>B</span><i /></div>
              <div className="floating-card card-bulb"><AppIcon name="spark" /></div>
              <div className="floating-card card-book"><AppIcon name="book" /></div>
              <div className="floating-card card-star"><AppIcon name="star" /></div>
            </div>
          </section>

          <section className="progress-strip" aria-label="Progresso da Bela">
            <div>
              <span className="progress-icon"><AppIcon name="trophy" /></span>
              <span><b>{overallProgress}%</b><small>do módulo concluído</small></span>
            </div>
            <div className="progress-track"><span style={{ width: `${overallProgress}%` }} /></div>
            <p>{completedAllLessons} de {allLessons.length} aulas estudadas</p>
          </section>

          {pairMessage && <div className="pair-notice" role="status">✓ {pairMessage}</div>}

          <section className="next-missions" aria-labelledby="next-missions-title">
            <div className="section-heading compact-heading">
              <div>
                <span className="eyebrow orange-text">MEU PLANO DE HOJE</span>
                <h2 id="next-missions-title">Próximos passos para a Bela</h2>
              </div>
              <span className="plan-rule">Domínio = 80% + revisão posterior</span>
            </div>
            <div className="mission-list">
              {nextSteps.map((step, index) => (
                <button key={`${step.subject}-${step.title}`} className={`mission-card mission-${step.kind}`} onClick={() => openSubject(step.subject)}>
                  <span className="mission-check">{index + 1}</span>
                  <span><small>{step.badge}</small><strong>{step.title}</strong><em>{step.detail}</em></span>
                  <b>→</b>
                </button>
              ))}
            </div>
          </section>

          <section className="home-tools-grid">
            <a className="obmep-card" href="/obmep">
              <span className="obmep-medal">★</span>
              <span><small>DESAFIO EXTRA</small><strong>Bela na OBMEP Mirim</strong><em>180 questões oficiais • treino por tema</em></span>
              <b>→</b>
            </a>
            <div className="calendar-card">
              <span><AppIcon name="calendar" /></span>
              <div><small>MATERIAL PARA ESTUDAR</small><strong>Science • História • E.L.A. • Geografia • Math • Português</strong><em>Conteúdo criado somente a partir dos materiais enviados.</em></div>
            </div>
          </section>

          <section className="section-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow teal">MINHAS MATÉRIAS</span>
                <h2>Escolha uma matéria</h2>
              </div>
              <div className="term-switcher" aria-label="Selecionar trimestre">
                {[1, 2, 3].map((item) => (
                  <button key={item} className={term === item ? "selected" : ""} onClick={() => setTerm(item)}>
                    {item}º tri
                  </button>
                ))}
              </div>
            </div>

            {term === 2 || term === 3 ? (
              <div className="subject-grid">
                {subjects.filter(subject => term === 3 ? subject.key === "science" : subject.key !== "science").map((subject) => (
                  <button
                    key={subject.name}
                    className={`subject-card ${subject.color} ${subject.status === "soon" ? "subject-soon" : ""}`}
                    onClick={() => subject.status === "ready" && subject.key && openSubject(subject.key as SubjectKey)}
                    disabled={subject.status === "soon"}
                  >
                    <span className="subject-icon"><AppIcon name={subject.icon} /></span>
                    <span className="subject-copy">
                      <strong>{subject.name}</strong>
                      <small>{subject.detail}</small>
                    </span>
                    {subject.status === "ready" ? <span className="subject-arrow">→</span> : <span className="soon-pill">Em breve</span>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-term">
                <AppIcon name={term === 1 ? "spark" : "ray"} className="empty-term-icon" />
                <h3>Este trimestre será preenchido aos poucos</h3>
                <p>Quando um novo conteúdo chegar, ele vai aparecer aqui para a Bela revisar quando quiser.</p>
              </div>
            )}
          </section>
        </div>
      )}

      {view === "science" && (
        <div className="page subject-page">
          <button className="back-button" onClick={() => go("home")}>← Voltar às matérias</button>

          <section className={`subject-hero subject-hero-${activeSubjectData.key}`}>
            <div className="subject-hero-icon"><AppIcon name={activeSubjectData.key === "ela" ? "language" : activeSubjectData.key} /></div>
            <div>
              <span className="eyebrow teal">{activeSubjectData.eyebrow}</span>
              <h1>{activeSubjectData.title}</h1>
              <p>{activeSubjectData.description}</p>

            </div>
            <div className="module-progress">
              <strong>{learnProgress}%</strong>
              <span>estudado</span>
              <div><i style={{ width: `${learnProgress}%` }} /></div>
            </div>
          </section>

          <section className={`path-grid compact-path-grid ${activeSubject === "ela" ? "ela-path-grid" : ""}`} aria-label={`Formas de estudar ${activeSubjectData.name}`}>
            <button className="path-card path-learn" onClick={() => go("learn")}>
              <span className="path-number">1</span>
              <span className="path-art"><AppIcon name="book" /></span>
              <span className="path-content">
                <small>PRIMEIRO</small>
                <strong>Aprender e revisar</strong>
                <p>Comece pelo resumo e aprofunde com vocabulário, exemplos e atividades do material.</p>
                <em>{completedCurrentLessons}/{currentLessons.length} aulas</em>
              </span>
              <span className="path-arrow">→</span>
            </button>

            {(activeSubject === "ela" || activeSubject === "geography" || activeSubject === "portuguese" || (activeSubject === "science" && scienceMaterialsReady)) && (
              <button className="path-card path-info" onClick={() => { setInfographicPage(0); go("infographic"); }}>
                <span className="path-number">2</span>
                <span className="path-art"><AppIcon name="art" /></span>
                <span className="path-content">
                  <small>{activeSubject === "ela" ? "VISUAL REVIEW" : "REVISÃO VISUAL"}</small>
                  <strong>{activeSubject === "ela" ? "Exam infographic" : "Infográficos da prova"}</strong>
                  <p>{activeSubject === "ela" ? "Start with the exam map, then explore one deep-review page for each topic." : "Veja um mapa visual de cada assunto e explique os exemplos com suas palavras."}</p>
                  <em>{activeSubject === "ela" ? "8 illustrated review pages" : `${reviewInfographicPages.length} páginas ilustradas`}</em>
                </span>
                <span className="path-arrow">→</span>
              </button>
            )}

            {activeSubject === "geography" && (
              <a className="path-card path-test" href="/materials/prova-geografia.pdf" download>
                <span className="path-number">3</span>
                <span className="path-art"><AppIcon name="note" /></span>
                <span className="path-content">
                  <small>PROVA ESCRITA</small>
                  <strong>Baixar e imprimir</strong>
                  <p>Vinte questões abertas e aplicadas aos cinco assuntos do guia de estudo.</p>
                  <em>PDF A4 • 10 páginas</em>
                </span>
                <span className="path-arrow">↓</span>
              </a>
            )}

            <button className="path-card path-quiz" disabled={!quizCatalog[activeSubjectData.quizId].questions.length} onClick={() => startQuiz(activeSubjectData.quizId)}>
              <span className="path-number">{activeSubject === "geography" ? "4" : activeSubject === "ela" ? "3" : "2"}</span>
              <span className="path-art"><AppIcon name="medal" /></span>
              <span className="path-content">
                <small>DEPOIS</small>
                <strong>{activeSubject === "history" || activeSubject === "geography" || activeSubject === "portuguese" ? "Desafio interativo" : "Quiz de revisão"}</strong>
                <p>Pratique e leia por que cada uma das quatro alternativas está certa ou errada.</p>
                <em>{quizCatalog[activeSubjectData.quizId].questions.length} questões • melhor: {quizStatsById[activeSubjectData.quizId].bestScore}/{quizCatalog[activeSubjectData.quizId].questions.length}</em>
              </span>
              <span className="path-arrow">→</span>
            </button>
          </section>

          <section className="quick-review">
            <div>
              <span className="eyebrow orange-text">ASSUNTOS DA PROVA</span>
              <h2>O que Bela precisa dominar</h2>
            </div>
            <div className="quick-grid">
              {activeSubjectData.lessons.map((lesson, index) => (
                <span key={lesson.id}><b>{index + 1}</b> {lesson.title}</span>
              ))}
            </div>
          </section>

          {(activeSubject === "history" || activeSubject === "geography" || activeSubject === "portuguese") && (
            <section className="topic-practice" aria-labelledby="topic-practice-title">
              <div className="section-heading compact-heading">
                <div>
                  <span className="eyebrow teal">ESTUDO POR ASSUNTO</span>
                  <h2 id="topic-practice-title">Uma missão de cada vez</h2>
                </div>
                <small>Estude o cartão e faça somente o quiz daquele assunto.</small>
              </div>
              <div className="topic-practice-grid">
                {activeSubjectData.lessons.map((lesson) => (
                  <article key={lesson.id} className={`topic-practice-card ${lesson.tone}`}>
                    <span>{lesson.icon}</span>
                    <small>MISSÃO {lesson.number}</small>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.subtitle}</p>
                    <div>
                      <button onClick={() => { setOpenLesson(lesson.id); go("learn"); }}>Estudar assunto</button>
                      {lesson.quizId && (
                        <button className="topic-quiz-button" onClick={() => startQuiz(lesson.quizId!)}>
                          Quiz • {quizCatalog[lesson.quizId].questions.length} questões
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="provisional-note">
            <span><AppIcon name="compass" /></span>
            <div>
              <strong>Material da escola incorporado</strong>
              <p>As aulas e os testes desta matéria foram revisados somente com os materiais enviados pela escola.</p>
            </div>
          </section>
        </div>
      )}

      {view === "infographic" && (activeSubject === "ela" || activeSubject === "geography" || activeSubject === "portuguese" || (activeSubject === "science" && scienceMaterialsReady)) && (
        <div className="page infographic-page ela-infographic-page">
          <button className="back-button" onClick={() => go("science")}>← {activeSubject === "ela" ? "Back to E.L.A." : `Voltar para ${activeSubjectData.name}`}</button>
          <div className="infographic-heading">
            <div>
              <span className="eyebrow orange-text">{activeSubject === "ela" ? "VISUAL REVIEW" : "REVISÃO VISUAL"}</span>
              <h1>{activeSubject === "ela" ? "Bela's Exam Map" : `Mapas da prova de ${activeSubjectData.name}`}</h1>
              <p>{activeSubject === "ela" ? "Review the seven Term 2 topics, then return to the quiz to practise." : "Revise cada mapa e depois pratique nos desafios interativos."}</p>
            </div>
            <a className="download-button" href={reviewInfographicPages[infographicPage].src} download>
              {activeSubject === "ela" ? "Download this page" : "Baixar esta página"} ↓
            </a>
          </div>

          <div className="infographic-viewer ela-infographic-viewer">
            <button
              className="viewer-arrow left"
              onClick={() => setInfographicPage((page) => Math.max(0, page - 1))}
              disabled={infographicPage === 0}
              aria-label="Previous infographic page"
            >
              ‹
            </button>
            <button className="infographic-image-button" onClick={() => setEnlargedInfographic(true)} aria-label="Ampliar o infográfico de revisão">
              <Image
                src={reviewInfographicPages[infographicPage].src}
                alt={reviewInfographicPages[infographicPage].alt}
                width={reviewInfographicPages[infographicPage].width}
                height={reviewInfographicPages[infographicPage].height}
                sizes="(max-width: 620px) 100vw, 820px"
                priority
                unoptimized
              />
              <span><AppIcon name="search" /> Tap to enlarge</span>
            </button>
            <button
              className="viewer-arrow right"
              onClick={() => setInfographicPage((page) => Math.min(reviewInfographicPages.length - 1, page + 1))}
              disabled={infographicPage === reviewInfographicPages.length - 1}
              aria-label="Next infographic page"
            >
              ›
            </button>
          </div>

          <div className="infographic-counter">{activeSubject === "ela" ? "Page" : "Página"} <b>{infographicPage + 1}</b> {activeSubject === "ela" ? "of" : "de"} {reviewInfographicPages.length} • {reviewInfographicPages[infographicPage].label}</div>
          <div className="thumbnail-row ela-thumbnail-row" aria-label="Choose an infographic page">
            {reviewInfographicPages.map((page, index) => (
              <button key={page.src} className={index === infographicPage ? "active" : ""} onClick={() => setInfographicPage(index)} aria-label={`Open page ${index + 1}: ${page.label}`}>
                <Image src={page.src} alt="" width={page.width} height={page.height} sizes="76px" unoptimized />
                <span>{index + 1}</span>
              </button>
            ))}
          </div>

          <div className="infographic-study-tip">
            <AppIcon name="spark" />
            <p><strong>{activeSubject === "ela" ? "Study tip" : "Dica de estudo"}</strong><span>{activeSubject === "ela" ? "Cover one card, explain it in your own words, then check the infographic again." : "Cubra um cartão, explique com suas palavras e depois confira novamente no infográfico."}</span></p>
          </div>
        </div>
      )}

      {enlargedInfographic && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Infográfico de revisão ampliado" onClick={() => setEnlargedInfographic(false)}>
          <button onClick={() => setEnlargedInfographic(false)} aria-label="Close enlarged infographic">×</button>
          <Image
            src={reviewInfographicPages[infographicPage].src}
            alt={reviewInfographicPages[infographicPage].alt}
            width={reviewInfographicPages[infographicPage].width}
            height={reviewInfographicPages[infographicPage].height}
            sizes="(max-width: 620px) 150vw, 1024px"
            unoptimized
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      {view === "learn" && (
        <div className="page learn-page">
          <button className="back-button" onClick={() => go("science")}>
            ← Voltar para {activeSubjectData.name}
          </button>
          <div className="learn-heading">
            <div>
              <span className="eyebrow teal">MODO APRENDER</span>
              <h1>Vamos revisar {activeSubjectData.name}!</h1>
              <p>Escolha uma aula, leia com atenção e marque quando concluir.</p>
            </div>
            <div className="lesson-progress-ring" style={{ "--progress": `${learnProgress * 3.6}deg` } as React.CSSProperties}>
              <span><b>{learnProgress}%</b><small>estudado</small></span>
            </div>
          </div>

          <div className="learn-layout">
            <aside className="lesson-list" aria-label="Lista de aulas">
              {currentLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setOpenLesson(lesson.id)}
                  className={`${openLesson === lesson.id ? "active" : ""} ${completedLessons.includes(lesson.id) ? "done" : ""}`}
                >
                  <span>{lesson.number}</span>
                  <i><AppIcon name={activeSubject === "ela" ? "language" : activeSubject} /></i>
                  <em><b>{lesson.title}</b><small>{lesson.subtitle}</small></em>
                  {completedLessons.includes(lesson.id) && <mark>✓</mark>}
                </button>
              ))}
            </aside>

            <article className={`lesson-content ${activeLesson.tone} ${activeSubject === "science" ? "science-lesson" : ""}`}>
              <div className="lesson-title-row">
                <span className="lesson-big-icon"><AppIcon name={activeSubject === "ela" ? "language" : activeSubject} /></span>
                <div>
                  <small>AULA {activeLesson.number}</small>
                  <h2>{activeLesson.title}</h2>
                  <p>{activeLesson.subtitle}</p>
                </div>
              </div>

              <p className="lesson-intro">{activeLesson.intro}</p>

              <LessonVisual subject={activeSubject} lessonId={activeLesson.id} />

              <div className="fact-stack">
                {activeLesson.facts.map((fact, index) => (
                  <div key={fact.term}>
                    <span>{index + 1}</span>
                    <p><strong>{fact.term}</strong> {fact.text}</p>
                  </div>
                ))}
              </div>

              {deepStudyByLesson[activeLesson.id] && (() => {
                const deep = deepStudyByLesson[activeLesson.id];
                return (
                  <section className="deep-study" aria-label="Conteúdo para aprofundar">
                    <div className="deep-study-heading"><span>🔎</span><div><small>APROFUNDE</small><h3>{deep.title}</h3></div></div>
                    <div className="deep-paragraphs">{deep.paragraphs.filter((paragraph) => activeSubject !== "science" || !activeLesson.facts.some((fact) => paragraph.endsWith(fact.text))).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                    <h4>🧠 Palavras importantes</h4>
                    <div className="vocabulary-grid">{deep.vocabulary.map(([icon, term, meaning]) => <div key={term}><span>{icon}</span><p><strong>{term}</strong><small>{meaning}</small></p></div>)}</div>
                    <div className="deep-example"><span>💡</span><p><small>EXEMPLO GUIADO</small><strong>{deep.example}</strong></p></div>
                    <div className="deep-challenge"><span>✍️</span><p><small>SUA VEZ</small><strong>{deep.challenge}</strong></p></div>
                  </section>
                );
              })()}

              <div className="remember-box">
                <span><AppIcon name="brain" /></span>
                <p><small>LEMBRE-SE</small><strong>{activeLesson.remember}</strong></p>
              </div>

              {activeLesson.quizId && quizCatalog[activeLesson.quizId].questions.length > 0 && (
                <button className="lesson-quiz-button" onClick={() => startQuiz(activeLesson.quizId!)}>
                  Testar somente este assunto <span>→</span>
                </button>
              )}

              <button
                className={`complete-button ${completedLessons.includes(activeLesson.id) ? "completed" : ""}`}
                onClick={() => toggleLesson(activeLesson.id)}
              >
                {completedLessons.includes(activeLesson.id)
                  ? "✓ Aula concluída"
                  : "Marcar como concluída"}
              </button>
            </article>
          </div>
        </div>
      )}

      {view === "parent" && (
        <div className="page parent-page">
          <button className="back-button" onClick={() => go("home")}>← Voltar ao app da Bela</button>
          <section className="parent-hero">
            <span className="parent-hero-icon"><AppIcon name="lock" /></span>
            <div><span className="eyebrow teal">ÁREA DOS PAIS</span><h1>Acompanhamento da Bela</h1><p>Veja o que ela estudou, onde encontrou dificuldade e qual é o melhor próximo passo.</p></div>
          </section>

          {!parentToken ? (
            <section className="pin-card">
              <span className="pin-illustration">🔐</span>
              <h2>{parentHasPin === false ? "Crie o PIN dos pais" : "Digite o PIN dos pais"}</h2>
              <p>{parentHasPin === false
                ? "Use de 4 a 6 números. Esse PIN protegerá respostas, dificuldades e o pareamento de novos aparelhos."
                : "A área da Bela continua livre para estudar; somente este acompanhamento fica protegido."}</p>
              <input
                value={parentPin}
                onChange={(event) => setParentPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                type="password"
                placeholder="••••"
                aria-label="PIN dos pais"
                onKeyDown={(event) => event.key === "Enter" && void unlockParent()}
              />
              {parentError && <span className="form-error">{parentError}</span>}
              <button className="primary-button" onClick={unlockParent} disabled={parentPin.length < 4 || !deviceToken}>
                {parentHasPin === false ? "Criar PIN e entrar" : "Entrar no acompanhamento"}
              </button>
            </section>
          ) : (
            <>
              <section className="parent-summary-grid">
                <div><span>📚</span><strong>{parentAnalytics?.state?.completedLessons.length ?? 0}</strong><small>aulas concluídas</small></div>
                <div><span>🎯</span><strong>{parentAnalytics?.topics.filter((topic) => topic.attempts > 0 && topic.correct / topic.attempts >= .8 && topic.reviewAttempts > 0 && topic.reviewCorrect / topic.reviewAttempts >= .8).length ?? 0}</strong><small>assuntos dominados</small></div>
                <div><span>💡</span><strong>{parentAnalytics?.topics.filter((topic) => topic.attempts >= 2 && topic.correct / topic.attempts < .8).length ?? 0}</strong><small>assuntos para reforçar</small></div>
                <div><span>✍️</span><strong>{parentAnalytics?.wrongAnswers.length ?? 0}</strong><small>erros recentes registrados</small></div>
              </section>

              <div className="parent-dashboard-grid">
                <section className="parent-panel topic-panel">
                  <div className="panel-heading"><div><span className="eyebrow orange-text">POR ASSUNTO</span><h2>Forças e dificuldades</h2></div><small>Domínio exige 80% e revisão posterior</small></div>
                  {parentAnalytics?.topics.length ? (
                    <div className="mastery-list">
                      {[...parentAnalytics.topics].sort((a, b) => a.correct / a.attempts - b.correct / b.attempts).map((topic) => {
                        const accuracy = Math.round((topic.correct / topic.attempts) * 100);
                        const reviewAccuracy = topic.reviewAttempts ? Math.round((topic.reviewCorrect / topic.reviewAttempts) * 100) : 0;
                        const mastered = accuracy >= 80 && topic.reviewAttempts > 0 && reviewAccuracy >= 80;
                        const needsReview = accuracy >= 80 && !mastered;
                        return <div key={`${topic.subject}-${topic.topic}`} className="mastery-row">
                          <span className={`mastery-dot ${mastered ? "mastered" : needsReview ? "review" : "practice"}`}>{mastered ? "✓" : needsReview ? "↻" : "!"}</span>
                          <div><strong>{topic.topic}</strong><small>{topic.subject.toUpperCase()} • {topic.attempts} respostas</small><i><b style={{ width: `${accuracy}%` }} /></i></div>
                          <em>{accuracy}%<small>{mastered ? "dominado" : needsReview ? "revisar depois" : "reforçar"}</small></em>
                        </div>;
                      })}
                    </div>
                  ) : <div className="empty-parent"><span>🌱</span><p>Os indicadores aparecerão assim que Bela responder às primeiras questões.</p></div>}
                </section>

                <aside className="parent-panel pair-panel">
                  <span className="eyebrow teal">NOVO APARELHO</span>
                  <h2>Conectar iPhone ou iPad</h2>
                  <p>Gere um QR de uso único. Ele expira em 10 minutos e conecta o novo aparelho ao mesmo progresso.</p>
                  {!pairLink ? (
                    <button className="primary-button" onClick={createPair}>Gerar QR e link seguro</button>
                  ) : (
                    <div className="pair-result">
                      {pairQr && <Image src={pairQr} alt="QR Code para conectar o aparelho da Bela" width={260} height={260} unoptimized />}
                      <small>Válido até {pairExpiresAt ? new Date(pairExpiresAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : ""}</small>
                      <div>
                        <button onClick={() => navigator.clipboard.writeText(pairLink)}>Copiar link</button>
                        <button onClick={() => { setPairLink(""); setPairQr(""); void createPair(); }}>Gerar outro</button>
                      </div>
                    </div>
                  )}
                  {parentError && <span className="form-error">{parentError}</span>}
                </aside>
              </div>

              <section className="parent-panel errors-panel">
                <div className="panel-heading"><div><span className="eyebrow teal">RESPOSTAS QUE PRECISARAM DE AJUDA</span><h2>Erros recentes</h2></div><small>O app registra cada tentativa, inclusive quando ela acerta depois da pista.</small></div>
                {parentAnalytics?.wrongAnswers.length ? (
                  <div className="error-list">
                    {parentAnalytics.wrongAnswers.map((wrong, index) => {
                      const questions = quizCatalog[wrong.quizId]?.questions ?? [];
                      const question = questions.find((item) => item.id === Number(wrong.questionId));
                      const option = question?.options.find((item) => item.id === wrong.selected);
                      return <article key={`${wrong.quizId}-${wrong.questionId}-${wrong.createdAt}-${index}`}>
                        <span>{wrong.subject === "math" ? "∑" : wrong.subject === "ela" ? "Aa" : wrong.subject === "geography" ? "◎" : "◷"}</span>
                        <div><small>{wrong.subject.toUpperCase()} • {wrong.topic}</small><strong>{question?.prompt ?? `Questão ${wrong.questionId}`}</strong><p>Marcou: {option?.label ?? wrong.selected.toUpperCase()}</p></div>
                        <time>{new Date(Number(wrong.createdAt)).toLocaleDateString("pt-BR")}</time>
                      </article>;
                    })}
                  </div>
                ) : <div className="empty-parent"><span>✨</span><p>Nenhum erro registrado ainda.</p></div>}
              </section>

              <button className="parent-logout" onClick={() => { setParentToken(""); setParentAnalytics(null); window.sessionStorage.removeItem("bela-parent-token"); }}>Bloquear área parental</button>
            </>
          )}
        </div>
      )}

      {view === "quiz" && (
        <div className="page quiz-page">
          <div className="quiz-topline">
            <button className="back-button" onClick={() => go("science")}>← {isPortugueseMode ? "Sair do quiz" : "Exit quiz"}</button>
            <span>{isPortugueseMode ? "Questão" : "Question"} <b>{quizIndex + 1}</b> {isPortugueseMode ? "de" : "of"} {currentQuestions.length}</span>
          </div>

          <div className="quiz-name">{activeQuizTitle}</div>

          <div className="quiz-progress" aria-label={`${isPortugueseMode ? "Progresso" : "Progress"}: ${quizIndex + 1} / ${currentQuestions.length}`}>
            <span style={{ width: `${((quizIndex + 1) / currentQuestions.length) * 100}%` }} />
          </div>

          <section className="question-card">
            <div className="question-meta">
              <span>{currentQuestion.topic}</span>
              <span>{answerChecked
                ? isPortugueseMode ? "Resposta explicada" : "Answer explained"
                : isPortugueseMode ? "Escolha uma resposta" : "Choose an answer"}</span>
            </div>

            <div className="question-title">
              <span>{currentQuestion.id}</span>
              <div>
                {currentQuestion.format === "association" && (
                  <div className="association-concept"><small>🔗 ASSOCIE O CONCEITO</small><strong>{currentQuestion.concept}</strong></div>
                )}
                <h1>{currentQuestion.prompt}</h1>
                <p>{currentQuestion.support}</p>
              </div>
            </div>

            {currentQuestion.visualKey && (
              <figure className={`question-visual ${currentQuestion.visualKey}`}>
                <Image
                  src={`/quiz-visuals/${currentQuestion.visualKey}.webp`}
                  alt={currentQuestion.visualPrompt ?? "Pista visual da questão"}
                  width={1448}
                  height={1086}
                  priority={quizIndex === 0}
                  unoptimized
                />
                <figcaption><span>👀</span><p><small>PISTA VISUAL</small><strong>{currentQuestion.visualPrompt}</strong></p></figcaption>
              </figure>
            )}

            {activeSubject === "geography" && <GeographyQuestionVisual topic={currentQuestion.topic} />}

            <button
              className={`doubt-toggle ${doubtQuestionIds.includes(`${activeQuizId}:${currentQuestion.id}`) ? "marked" : ""}`}
              onClick={() => toggleDoubt(currentQuestion.id)}
              aria-pressed={doubtQuestionIds.includes(`${activeQuizId}:${currentQuestion.id}`)}
            >
              {doubtQuestionIds.includes(`${activeQuizId}:${currentQuestion.id}`)
                ? isPortugueseMode ? "✓ Marcada para revisar" : "✓ Marked for review"
                : isPortugueseMode ? "? Marcar para revisar" : "? Mark for review"}
            </button>

            <div className="option-list" role="group" aria-label={isPortugueseMode ? "Alternativas" : "Answer choices"}>
              {currentQuestion.options.map((option) => {
                const isCorrect = option.id === currentQuestion.correct;
                const isSelected = option.id === selectedOption;
                const isEliminated = eliminatedOptions.includes(option.id);
                const stateClass = answerChecked
                  ? isCorrect
                    ? "option-correct"
                    : isSelected
                      ? "option-wrong"
                      : "option-neutral"
                  : isEliminated
                    ? "option-eliminated"
                    : isSelected
                      ? "option-selected"
                      : "";

                return (
                  <button
                    key={option.id}
                    className={`quiz-option ${stateClass}`}
                    onClick={() => !answerChecked && !isEliminated && setSelectedOption(option.id)}
                    disabled={answerChecked || isEliminated}
                    aria-pressed={isSelected}
                  >
                    <span className="option-letter">{option.id.toUpperCase()}</span>
                    <span className="option-body">
                      <strong>{option.label}</strong>
                      {answerChecked && (
                        <small>
                          <i>{isCorrect ? "✓" : "×"}</i>
                          {option.explanation}
                        </small>
                      )}
                    </span>
                    {isSelected && !answerChecked && <span className="selected-dot" />}
                    {isEliminated && !answerChecked && <span className="eliminated-mark">× {isPortugueseMode ? "Tente outra" : "Try another"}</span>}
                  </button>
                );
              })}
            </div>

            {thinkingFeedback && !answerChecked && (
              <div className="thinking-coach" role="status">
                <span>💭</span>
                <div>
                  <strong>{questionMistakes === 1
                    ? isPortugueseMode ? "Vamos pensar de outro jeito" : "Let's think another way"
                    : isPortugueseMode ? "Mais uma pista para você" : "One more clue for you"}</strong>
                  <p>{thinkingFeedback}</p>
                  <small>{isPortugueseMode
                    ? "A resposta certa continua escondida. Observe as alternativas que restaram e tente novamente."
                    : "The correct answer is still hidden. Look at the choices that remain and try again."}</small>
                </div>
              </div>
            )}

            {answerChecked && (
              <div className="answer-banner answer-success">
                <span><AppIcon name="star" /></span>
                <p>
                  <strong>{isPortugueseMode ? "Muito bem! Você encontrou a resposta!" : "Brilliant! You found it!"}</strong>
                  <small>
                    {isPortugueseMode
                      ? "Agora leia as explicações para reforçar o raciocínio que levou você até ela."
                      : "Now read the explanations to reinforce the thinking that led you there."}
                  </small>
                </p>
              </div>
            )}

            <div className="quiz-actions">
              {!answerChecked ? (
                <button className="check-button" onClick={checkAnswer} disabled={!selectedOption}>
                  {isPortugueseMode ? "Conferir resposta" : "Check answer"}
                </button>
              ) : (
                <button className="next-button" onClick={nextQuestion}>
                  {quizIndex === currentQuestions.length - 1
                    ? isPortugueseMode ? "Ver meu resultado" : "See my result"
                    : isPortugueseMode ? "Próxima questão" : "Next question"} <span>→</span>
                </button>
              )}
            </div>
          </section>

          <p className="quiz-reminder"><AppIcon name="spark" /> {isPortugueseMode
            ? "Vá com calma: aprender com cada alternativa faz parte da revisão."
            : "Take your time: learning from every answer choice is part of the practice."}</p>
        </div>
      )}

      {view === "results" && (
        <div className="page results-page">
          <section className="results-hero">
            <div className="confetti" aria-hidden="true"><span>★</span><span>●</span><span>◆</span><span>★</span><span>●</span></div>
            <div className="score-medal">
              <AppIcon name="medal" />
              <b>{resultScore}<small>/{currentQuestions.length}</small></b>
            </div>
            <span className="eyebrow">{isPortugueseMode ? "QUIZ CONCLUÍDO" : "QUIZ COMPLETED"}</span>
            <h1>
              {isPortugueseMode
                ? resultPercent >= 85 ? "Arrasou, Bela!" : resultPercent >= 70 ? "Muito bem, Bela!" : "Boa tentativa, Bela!"
                : resultPercent >= 85 ? "Amazing, Bela!" : resultPercent >= 70 ? "Great job, Bela!" : "Good try, Bela!"}
            </h1>
            <p>
              {isPortugueseMode
                ? resultPercent >= 85
                  ? "Você mostrou que domina os principais assuntos desta matéria."
                  : resultPercent >= 70
                    ? "Você está no caminho certo. Revise os tópicos abaixo e tente novamente."
                    : "Cada erro mostrou exatamente o que revisar. Estude mais um pouco e tente novamente."
                : resultPercent >= 85
                  ? "You showed that you understand the main ideas in this review."
                  : resultPercent >= 70
                    ? "You are on the right path. Review the topics below and try again."
                    : "Every mistake showed you exactly what to review. Study a little more and try again."}
            </p>
            <div className="result-stars" aria-label={`${resultPercent >= 90 ? 3 : resultPercent >= 70 ? 2 : 1} stars`}>
              {[0, 1, 2].map((star) => (
                <span key={star} className={star < (resultPercent >= 90 ? 3 : resultPercent >= 70 ? 2 : 1) ? "earned" : ""}>★</span>
              ))}
            </div>
          </section>

          <div className="results-grid">
            <section className="topic-results">
              <div className="result-section-title">
                <span><AppIcon name="chart" /></span>
                <div><small>{isPortugueseMode ? "SEU RESULTADO" : "YOUR RESULT"}</small><h2>{isPortugueseMode ? "Desempenho por assunto" : "Performance by topic"}</h2></div>
              </div>
              <div className="topic-bars">
                {topicResults.map((item) => {
                  const percent = Math.round((item.correct / item.total) * 100);
                  return (
                    <div key={item.topic}>
                      <p><strong>{item.topic}</strong><span>{item.correct}/{item.total}</span></p>
                      <div><i style={{ width: `${percent}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="next-study-card">
              <span><AppIcon name="target" /></span>
              <small>{isPortugueseMode ? "PRÓXIMO PASSO" : "NEXT STEP"}</small>
              <h2>{resultScore === currentQuestions.length
                ? isPortugueseMode ? "Revisão completa!" : "Keep that light shining!"
                : isPortugueseMode ? "Revise e tente novamente" : "Review and try again"}</h2>
              <p>
                {resultScore === currentQuestions.length
                  ? isPortugueseMode
                    ? "Você acertou todas as questões. Faça uma revisão rápida das aulas antes da prova."
                    : "You got every answer right. Review the lessons once more before the test."
                  : isPortugueseMode
                    ? `Você errou ${currentQuestions.length - resultScore} ${currentQuestions.length - resultScore === 1 ? "questão" : "questões"}. Revise as aulas e tente novamente.`
                    : `You missed ${currentQuestions.length - resultScore} ${currentQuestions.length - resultScore === 1 ? "question" : "questions"}. Review your weakest lessons, then take the quiz again.`}
              </p>
              <div className="result-actions">
                <button className="next-button" onClick={() => startQuiz(activeQuizId)}>{isPortugueseMode ? "Refazer o quiz" : "Take the quiz again"} ↻</button>
                <button className="secondary-button" onClick={() => go("learn")}>{isPortugueseMode ? "Revisar aulas" : "Review lessons"}</button>
                <button className="text-button" onClick={() => go("science")}>{isPortugueseMode ? `Voltar para ${activeSubjectData.name}` : `Back to ${activeSubjectData.name}`}</button>
              </div>
            </aside>
          </div>
        </div>
      )}

      {showInstall && (
        <div className="reset-overlay" role="presentation" onClick={() => setShowInstall(false)}>
          <section
            className="install-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="install-icon"><AppIcon name="phone" /></span>
            <span className="eyebrow teal">APP NO IPHONE</span>
            <h2 id="install-title">Adicione Estudos da Bela à Tela de Início</h2>
            <p>Abra esta página no Safari e siga estes três passos:</p>
            <ol className="install-steps">
              <li><span>1</span><p><b>Toque em Compartilhar</b><small>É o quadrado com uma seta apontando para cima.</small></p><i>⇧</i></li>
              <li><span>2</span><p><b>Escolha Adicionar à Tela de Início</b><small>Role o menu se a opção não aparecer de imediato.</small></p><i>＋</i></li>
              <li><span>3</span><p><b>Toque em Adicionar</b><small>O app abrirá em tela cheia e manterá o progresso da Bela.</small></p><i>✓</i></li>
            </ol>
            <button className="next-button" onClick={() => setShowInstall(false)}>Entendi</button>
          </section>
        </div>
      )}

      {showReset && (
        <div className="reset-overlay" role="presentation" onClick={() => setShowReset(false)}>
          <section
            className="reset-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="reset-icon">↻</span>
            <h2 id="reset-title">Reiniciar progresso das matérias?</h2>
            <p>Isso limpa o estado de estudo visível neste aparelho. O histórico sincronizado de respostas continua protegido na área parental.</p>
            <div>
              <button className="secondary-button" onClick={() => setShowReset(false)}>Cancelar</button>
              <button className="danger-button" onClick={resetProgress}>Sim, começar de novo</button>
            </div>
          </section>
        </div>
      )}

      <footer>
        <span>Feito para a Bela estudar no seu ritmo • progresso sincronizado entre aparelhos</span>
        <span className="footer-stars"><AppIcon name="star" /><AppIcon name="star" /><AppIcon name="star" /></span>
      </footer>
    </main>
  );
}
