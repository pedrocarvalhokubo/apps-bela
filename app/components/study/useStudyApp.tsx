"use client";
import { registerPendingSave } from "../../../lib/pending-saves";
import { useEffect, useMemo, useState, useRef } from "react";
import { useStudyAccount } from "../AuthGate";
import AppIcon from "../AppIcon";
import type { View, QuizAnswer, TopicSignal, ParentAnalytics, QuizStats, SavedProgress } from "./types";
import { friendlyParentError, emptyQuizStats, availableQuizzes, availableSubjects, defaultSubject, defaultQuiz, defaultLesson, availableLessonIds, elaInfographicPages, geographyInfographicPages, portugueseInfographicPages, safeSubject, safeQuiz, safeStudyView } from "./data";
import { studyStorage } from "../../../lib/study-storage";
import { submitAttempt } from "../../../lib/attempt-client";
import { mergeStudy } from "../../../lib/study-merge";
import { ensureDevice } from "../../../lib/device-client";
import { curriculumSubjects, quizCatalog, type QuizId, type StudyLesson, type SubjectKey } from "../../curriculum-data";
import { ela3Subject, ela3Infographics } from "../../ela3-data";
import { geography3Subject, geography3Infographics } from "../../geography3-data";
import { portuguese3Subject, portuguese3Infographics } from "../../portuguese3-data";
import { scienceInfographicPages, scienceMaterialsReady, scienceTopicTitle } from "../../science-data";
import { history3Subject, history3Infographics, studySubject, quizTerm, resumeTerm } from "../../history3-data";
import { questionHint } from "../../quiz-hints";

// All state and actions of the study app. The views read them through StudyContext.
export function useStudyApp() {
  const {mode}=useStudyAccount();
  const isGuest=mode==='guest';
  const revision=useRef(0);
  const syncQueue=useRef(Promise.resolve());
  const [connectRetry,setConnectRetry]=useState(0);
  const [parentSetupCode,setParentSetupCode]=useState('');
  const [view, setView] = useState<View>("home");
  const [term, setTerm] = useState(3);
  const [geographyDate,setGeographyDate]=useState("");
  useEffect(()=>{if(isGuest)return;let alive=true;void fetch('/api/study-plan',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{if(alive)setGeographyDate(data?.geography?.date??'');}).catch(()=>{});return()=>{alive=false;};},[isGuest]);
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
  const [pairMessage, setPairMessage] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = studyStorage.getItem("bela-study-progress");
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
          setOpenLesson(availableLessonIds.has(savedLesson) ? savedLesson : defaultLesson);
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
    if (!storageReady || isGuest) return;
    let cancelled = false;

    const connect = async () => {
      setSyncState("syncing");
      try {
        const token = await ensureDevice();


        if (cancelled) return;
        const response = await fetch("/api/sync", { headers: { "x-bela-device-token": token } });
        const result = await response.json() as { state?: Partial<SavedProgress> | null; topics?: TopicSignal[]; updatedAt?: number };
        if (!response.ok) throw new Error("Sincronização indisponível");
        revision.current=Number(result.updatedAt)||0;
        const cached=JSON.parse(studyStorage.getItem('bela-study-progress')??'{}');
        if (result.state || Object.keys(cached).length) {
          const saved = (studyStorage.getItem('study-unsynced')==='yes' ? mergeStudy(result.state??{},cached) : result.state??cached) as Partial<SavedProgress>;
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
          setOpenLesson(availableLessonIds.has(syncedLesson) ? syncedLesson : defaultLesson);
          setDoubtQuestionIds((saved.doubtQuestionIds ?? []).filter((id) => availableQuizzes.has(String(id).split(":")[0] as QuizId)));
          setStudyNotes(saved.studyNotes ?? "");
          setQuizIndex(saved.quizIndex??0);setSelectedOption(saved.selectedOption??null);
          setAnswerChecked(saved.answerChecked??false);setQuizAnswers(saved.quizAnswers??[]);setResultAnswers(saved.resultAnswers??[]);
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
  }, [storageReady,isGuest,connectRetry]);

  useEffect(()=>{const online=()=>setConnectRetry(n=>n+1);window.addEventListener('online',online);return()=>window.removeEventListener('online',online);},[]);
  useEffect(()=>{if(!parentToken)return;const timer=setTimeout(()=>{setParentToken('');setParentAnalytics(null);sessionStorage.removeItem('bela-parent-token');},15*60*1000);return()=>clearTimeout(timer);},[parentToken]);

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
      term,
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
      const serialized=JSON.stringify(progress),prior=studyStorage.getItem("bela-study-progress");
      if(prior && prior!==serialized && !isGuest)studyStorage.setItem("study-unsynced","yes");
      studyStorage.setItem("bela-study-progress", serialized);
    } catch {
      // Mantém a experiência funcional mesmo se o navegador bloquear o salvamento.
    }
    if (!deviceToken) return;
    const save = () => {
      setSyncState("syncing");
      syncQueue.current=syncQueue.current.catch(()=>{}).then(async()=>{
        try {
          const response=await fetch('/api/sync',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({state:progress,revision:revision.current})});
          if(!response.ok)throw new Error('sync');const result=await response.json();revision.current=result.updatedAt;
          if(studyStorage.getItem('bela-study-progress')===JSON.stringify(progress))studyStorage.removeItem('study-unsynced');
          if(result.conflict){
            setCompletedLessons((result.state.completedLessons??[]).filter((id:string)=>availableLessonIds.has(id)));
            setQuizStatsById({...emptyQuizStats(),...result.state.quizStatsById});
          }
          setSyncState('synced');
        } catch {setSyncState('offline');throw new Error('O progresso aguarda conexão para sincronizar.');}
      });
      return syncQueue.current;
    };
    registerPendingSave('study',save);
    const timer = window.setTimeout(() => {void save().catch(()=>{});},650);
    return () => window.clearTimeout(timer);
  }, [
    answerChecked,
    term,
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
    isGuest,
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

  const activeSubjectData = studySubject(curriculumSubjects, activeSubject, term);
  const isEla3 = activeSubject === "ela" && term === 3;
  const isGeography3 = activeSubject === "geography" && term === 3;
  const isHistory3 = activeSubject === "history" && term === 3;
  const isPortuguese3 = activeSubject === "portuguese" && term === 3;
  const reviewInfographicPages = isPortuguese3 ? portuguese3Infographics : isGeography3 ? geography3Infographics : isEla3 ? ela3Infographics : isHistory3 ? history3Infographics : activeSubject === "science" ? scienceInfographicPages : activeSubject === "geography" ? geographyInfographicPages : activeSubject === "portuguese" ? portugueseInfographicPages : elaInfographicPages;
  const currentLessons = activeSubjectData.lessons;
  const completedCurrentLessons = currentLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  const learnProgress = Math.round((completedCurrentLessons / currentLessons.length) * 100);
  const currentQuestions = quizCatalog[activeQuizId].questions;
  const allLessons = [...Object.values(curriculumSubjects), history3Subject, ela3Subject, geography3Subject, portuguese3Subject].flatMap((subject) => subject.lessons);
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

  const currentQuestion = currentQuestions[quizIndex] ?? currentQuestions[0];
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
      { subject: "portuguese", name: "Português", date: "", shortDate: "ESTUDAR", lessons: studySubject(curriculumSubjects, "portuguese", term).lessons },
      { subject: "science", name: "Science", date: "", shortDate: "ESTUDAR", lessons: curriculumSubjects.science.lessons },
      { subject: "geography", name: "Geografia", date: "", shortDate: "ESTUDAR", lessons: studySubject(curriculumSubjects, "geography", term).lessons },
      { subject: "ela", name: "E.L.A.", date: "", shortDate: "ESTUDAR", lessons: studySubject(curriculumSubjects, "ela", term).lessons },
      { subject: "math", name: "Math", date: "", shortDate: "ESTUDAR", lessons: curriculumSubjects.math.lessons },
      { subject: "history", name: "História", date: "", shortDate: "ESTUDAR", lessons: studySubject(curriculumSubjects, "history", term).lessons },
    ];
    const steps: Array<{ term: number; subject: SubjectKey; title: string; detail: string; badge: string; kind: string }> = [];
    const weak = [...topicSignals]
      .filter((topic) => topic.attempts >= 2 && topic.correct / topic.attempts < 0.8)
      .sort((a, b) => a.correct / a.attempts - b.correct / b.attempts)[0];
    if (weak) {
      steps.push({
        term: weak.subject === "science" || ela3Subject.lessons.some(l => l.title === weak.topic) || history3Subject.lessons.some(l => l.title === weak.topic) || geography3Subject.lessons.some(l => l.title === weak.topic) || portuguese3Subject.lessons.some(l => l.title === weak.topic) ? 3 : 2,
        subject: weak.subject as SubjectKey,
        title: `Reforçar: ${weak.subject === "science" ? scienceTopicTitle(weak.topic) : weak.topic}`,
        detail: `Você acertou ${Math.round((weak.correct / weak.attempts) * 100)}% até agora. Vamos praticar com calma.`,
        badge: "PRIORIDADE",
        kind: "weak",
      });
    }
    for (const item of schedule.filter(item => term === 3 ? ["portuguese", "science", "ela", "history", "geography"].includes(item.subject) : term === 2 && item.subject !== "science" && item.subject !== "portuguese")) {
      const pending = item.lessons.find((lesson) => !completedLessons.includes(lesson.id));
      if (!pending) continue;
      steps.push({ term, subject: item.subject, title: pending.title, detail: `${item.name} • continuar os estudos`, badge: item.shortDate, kind: "lesson" });
      if (steps.length === 3) break;
    }
    const review = topicSignals.find((topic) => topic.attempts >= 3 && topic.correct / topic.attempts >= 0.8 && topic.reviewAttempts === 0);
    if (review && steps.length < 3) {
      steps.push({ term: review.subject === "science" || ela3Subject.lessons.some(l => l.title === review.topic) || history3Subject.lessons.some(l => l.title === review.topic) || geography3Subject.lessons.some(l => l.title === review.topic) || portuguese3Subject.lessons.some(l => l.title === review.topic) ? 3 : 2, subject: review.subject as SubjectKey, title: `Revisão: ${review.subject === "science" ? scienceTopicTitle(review.topic) : review.topic}`, detail: "Você já chegou a 80%. Faça uma revisão posterior para dominar o assunto.", badge: "REVISAR", kind: "review" });
    }
    return steps.slice(0, 3);
  }, [completedLessons, topicSignals, term]);

  const recordAttempt = (selected: string, correct: boolean) => {
    if (isGuest) return;
    submitAttempt({
        subject: activeSubject,
        quizId: activeQuizId,
        questionId: currentQuestion.id,
        topic: currentQuestion.topic,
        selected,
        correct,
        isReview: quizStatsById[activeQuizId].attempts > 0,
      }).then(async (saved) => {
      if (!saved) throw new Error("attempt");
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
      if(!response.ok)throw new Error("auth");
      const result = await response.json() as { hasPin?: boolean };
      setParentHasPin(Boolean(result.hasPin));
      const savedToken = window.sessionStorage.getItem("bela-parent-token") ?? "";
      if (savedToken) {
        setParentToken(savedToken);
        await loadParentAnalytics(savedToken);
      }
    } catch {
      setParentToken("");setParentAnalytics(null);window.sessionStorage.removeItem("bela-parent-token");
      setParentError("Entre com o PIN dos pais para continuar.");
    }
  };

  const unlockParent = async () => {
    setParentError("");
    try {
      const response = await fetch("/api/parent", {
        method: "POST",
        headers: { "content-type": "application/json", "x-bela-device-token": deviceToken },
        body: JSON.stringify({ action: parentHasPin ? "verify-pin" : "setup-pin", pin: parentPin, setupCode:parentSetupCode }),
      });
      const result = await response.json() as { parentToken?: string; error?: string };
      if (!response.ok || !result.parentToken) throw new Error(result.error ?? "PIN inválido");
      setParentToken(result.parentToken);
      setParentHasPin(true);
      setParentPin("");setParentSetupCode("");
      window.sessionStorage.setItem("bela-parent-token", result.parentToken);
      await loadParentAnalytics(result.parentToken);
    } catch (error) {
      setParentError(friendlyParentError(
        error,
        "Não foi possível validar o PIN agora. Tente novamente em alguns instantes.",
      ));
    }
  };

  const startQuiz = (quizId: QuizId) => {
    if (!quizCatalog[quizId].questions.length) return;
    setTerm(quizTerm(quizId));
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

  const openSubject = (subject: SubjectKey, selectedTerm = subject === "science" ? 3 : subject === "history" || subject === "ela" || subject === "geography" || subject === "portuguese" ? term : 2) => {
    setActiveSubject(subject);
    setTerm(selectedTerm);
    setInfographicPage(0);
    const firstLesson = studySubject(curriculumSubjects, subject, selectedTerm).lessons[0].id;
    setOpenLesson(firstLesson);
    go("science");
  };

  const resumeStudy = () => {
    setTerm(resumeTerm(activeSubject, openLesson, activeQuizId, lastStudyView));
    setInfographicPage(0);
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
      studyStorage.removeItem("bela-study-progress");
    } catch {
      // O estado visível ainda é reiniciado mesmo se o armazenamento estiver bloqueado.
    }
    setCompletedLessons([]);
    setTerm(3);
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

  const infographicCardShown = (activeSubject === "ela" || activeSubject === "geography" || activeSubject === "portuguese" || isHistory3 || (activeSubject === "science" && scienceMaterialsReady)) && reviewInfographicPages.length > 0;
  const mockQuizIds: QuizId[] = isGeography3 ? ["geography3-mock-a", "geography3-mock-b"] : isEla3 ? ["ela3-mock-a", "ela3-mock-b"] : isHistory3 ? ["history3-mock-a", "history3-mock-b"] : isPortuguese3 ? ["portuguese3-mock-a", "portuguese3-mock-b"] : activeSubject === "science" ? ["science3-mock-a", "science3-mock-b"] : [];
  const mockCopy = isGeography3 ? { small: "APLIQUE O QUE APRENDEU", text: "20 questões baseadas nas atividades da escola. Leia, compare e encontre as pistas no material.", best: "Melhor resultado:" }
    : isEla3 || activeSubject === "science" ? { small: "PRACTICE TEST", text: "20 questions • all ten topics • hints and explanations.", best: "Best:" }
    : isHistory3 ? { small: "PRATICAR NO APP", text: "Quatorze questões, pistas graduais e explicações para cada alternativa.", best: "Melhor:" }
    : { small: "SIMULADO", text: "18 questões novas sobre os seis assuntos, com pistas e explicações.", best: "Melhor:" };
  const reviewQuizNumber = activeSubject === "geography" && !isGeography3 ? 4 : infographicCardShown ? 3 : 2;
  const reviewQuizCard = (
            <button className="path-card path-quiz" disabled={!quizCatalog[activeSubjectData.quizId].questions.length} onClick={() => startQuiz(activeSubjectData.quizId)}>
              <span className="path-number">{reviewQuizNumber}</span>
              <span className="path-art"><AppIcon name="medal" /></span>
              <span className="path-content">
                <small>DEPOIS</small>
                <strong>{activeSubject === "history" || activeSubject === "geography" || activeSubject === "portuguese" ? "Desafio interativo" : "Quiz de revisão"}</strong>
                <p>Pratique e leia por que cada uma das quatro alternativas está certa ou errada.</p>
                <em>{quizCatalog[activeSubjectData.quizId].questions.length} questões • melhor: {quizStatsById[activeSubjectData.quizId].bestScore}/{quizCatalog[activeSubjectData.quizId].questions.length}</em>
              </span>
              <span className="path-arrow">→</span>
            </button>
  );

  return {
    mode,
    isGuest,
    revision,
    syncQueue,
    connectRetry,
    setConnectRetry,
    parentSetupCode,
    setParentSetupCode,
    view,
    setView,
    term,
    setTerm,
    geographyDate,
    setGeographyDate,
    openLesson,
    setOpenLesson,
    completedLessons,
    setCompletedLessons,
    quizStatsById,
    setQuizStatsById,
    activeSubject,
    setActiveSubject,
    activeQuizId,
    setActiveQuizId,
    quizIndex,
    setQuizIndex,
    selectedOption,
    setSelectedOption,
    answerChecked,
    setAnswerChecked,
    quizAnswers,
    setQuizAnswers,
    resultAnswers,
    setResultAnswers,
    lastStudyView,
    setLastStudyView,
    doubtQuestionIds,
    setDoubtQuestionIds,
    studyNotes,
    setStudyNotes,
    storageReady,
    setStorageReady,
    showReset,
    setShowReset,
    showInstall,
    setShowInstall,
    enlargedInfographic,
    setEnlargedInfographic,
    infographicPage,
    setInfographicPage,
    isStandalone,
    setIsStandalone,
    deviceToken,
    setDeviceToken,
    syncState,
    setSyncState,
    topicSignals,
    setTopicSignals,
    eliminatedOptions,
    setEliminatedOptions,
    questionMistakes,
    setQuestionMistakes,
    thinkingFeedback,
    setThinkingFeedback,
    parentHasPin,
    setParentHasPin,
    parentPin,
    setParentPin,
    parentToken,
    setParentToken,
    parentError,
    setParentError,
    parentAnalytics,
    setParentAnalytics,
    pairMessage,
    setPairMessage,
    activeSubjectData,
    isEla3,
    isGeography3,
    isHistory3,
    isPortuguese3,
    reviewInfographicPages,
    currentLessons,
    completedCurrentLessons,
    learnProgress,
    currentQuestions,
    allLessons,
    completedAllLessons,
    totalBestAnswers,
    totalQuizQuestions,
    overallProgress,
    go,
    toggleLesson,
    activeLesson,
    currentQuestion,
    resultScore,
    resultPercent,
    activeQuizTitle,
    isPortugueseMode,
    topicList,
    topicResults,
    nextSteps,
    recordAttempt,
    loadParentAnalytics,
    openParent,
    unlockParent,
    startQuiz,
    openSubject,
    resumeStudy,
    toggleDoubt,
    resetProgress,
    checkAnswer,
    nextQuestion,
    infographicCardShown,
    mockQuizIds,
    mockCopy,
    reviewQuizNumber,
    reviewQuizCard,
  };
}
