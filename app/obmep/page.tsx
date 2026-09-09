"use client";

import { useEffect, useMemo, useState } from "react";
import { useObmepProgress } from "../../lib/use-obmep-progress";
import {
  type LevelId,
  type OfficialQuestion,
  type ThemeId,
  officialQuestions,
} from "./officialQuestions";

type View = "home" | "quiz" | "summary";
type Feedback = "idle" | "wrong" | "correct";
type ProgressRecord = Record<
  string,
  { solved: boolean; attempts: number; firstTry: boolean }
>;
type SessionResult = { id: string; firstTry: boolean };

const STORAGE_KEY = "bela-obmep-progress-v1";
const letters = ["A", "B", "C", "D", "E"];

const themeMeta: Record<
  ThemeId,
  { name: string; icon: string; color: "aqua" | "sun" | "lilac" | "coral" | "mint" }
> = {
  geometria: { name: "Espaço e Geometria", icon: "△", color: "aqua" },
  aritmetica: { name: "Aritmética", icon: "2+", color: "sun" },
  logica: { name: "Raciocínio Lógico", icon: "?!", color: "lilac" },
  tempo: { name: "Tempo e Calendário", icon: "31", color: "coral" },
  percurso: { name: "Contagem e Percurso", icon: "↝", color: "mint" },
  combinatoria: { name: "Combinatória", icon: "●", color: "sun" },
  numerico: { name: "Raciocínio Numérico", icon: "123", color: "aqua" },
  medidas: { name: "Medidas e Grandezas", icon: "↔", color: "mint" },
  graficos: { name: "Dados e Gráficos", icon: "▥", color: "coral" },
};

const themeOrder = Object.keys(themeMeta) as ThemeId[];

function levelLabel(level: LevelId) {
  return level === "m2" ? "Mirim 2 • 4º e 5º ano" : "Mirim 1 • 2º e 3º ano";
}

function sessionTitle(question: OfficialQuestion) {
  return `${question.year} • ${question.phase}ª fase • questão ${question.number}`;
}

function solvedIn(
  items: OfficialQuestion[],
  progress: ProgressRecord,
) {
  return items.filter((question) => progress[question.id]?.solved).length;
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [level, setLevel] = useState<LevelId>("m2");
  const { progress, setProgress, syncMessage, deviceToken } = useObmepProgress();
  const [session, setSession] = useState<OfficialQuestion[]>([]);
  const [sessionName, setSessionName] = useState("Treino misto");
  const [sessionResult, setSessionResult] = useState<SessionResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongChoices, setWrongChoices] = useState<number[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [showProgress, setShowProgress] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const levelQuestions = useMemo(
    () => officialQuestions.filter((question) => question.level === level),
    [level],
  );
  const solvedCount = useMemo(
    () => solvedIn(levelQuestions, progress),
    [levelQuestions, progress],
  );
  const firstTryCount = useMemo(
    () =>
      levelQuestions.filter((question) => progress[question.id]?.firstTry).length,
    [levelQuestions, progress],
  );

  const beginSession = (items: OfficialQuestion[], name: string) => {
    setSession(items);
    setSessionName(name);
    setSessionResult([]);
    setCurrentIndex(0);
    setWrongChoices([]);
    setWrongAttempts(0);
    setFeedback("idle");
    setView("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startMixed = () => {
    const ordered = [
      ...levelQuestions.filter((question) => !progress[question.id]?.solved),
      ...levelQuestions.filter((question) => progress[question.id]?.solved),
    ];
    beginSession(ordered.slice(0, 5), "Treino misto");
  };

  const startTheme = (themeId: ThemeId) => {
    const themeQuestions = levelQuestions.filter(
      (question) => question.theme === themeId,
    );
    const ordered = [
      ...themeQuestions.filter((question) => !progress[question.id]?.solved),
      ...themeQuestions.filter((question) => progress[question.id]?.solved),
    ];
    beginSession(
      ordered.slice(0, Math.min(10, ordered.length)),
      themeMeta[themeId].name,
    );
  };

  const startExam = (year: number, phase: 1 | 2) => {
    const exam = levelQuestions
      .filter((question) => question.year === year && question.phase === phase)
      .sort((a, b) => a.number - b.number);
    beginSession(exam, `Prova ${year} • ${phase}ª fase`);
  };

  const currentQuestion = session[currentIndex];

  const chooseAnswer = (optionIndex: number) => {
    if (
      !currentQuestion ||
      feedback === "correct" ||
      wrongChoices.includes(optionIndex)
    ) {
      return;
    }

    if (deviceToken) void fetch("/api/attempts", {
      method: "POST", headers: { "content-type": "application/json", "x-bela-device-token": deviceToken },
      body: JSON.stringify({ subject: "obmep", quizId: currentQuestion.id, questionId: currentQuestion.number,
        topic: themeMeta[currentQuestion.theme].name, selected: letters[optionIndex],
        correct: optionIndex === currentQuestion.answer, isReview: Boolean(progress[currentQuestion.id]?.solved) }),
    }).catch(() => {});
    if (optionIndex === currentQuestion.answer) {
      const firstTry = wrongAttempts === 0;
      setProgress((previous) => ({
        ...previous,
        [currentQuestion.id]: {
          solved: true,
          attempts: Math.min(
            previous[currentQuestion.id]?.attempts ?? Number.POSITIVE_INFINITY,
            wrongAttempts + 1,
          ),
          firstTry: previous[currentQuestion.id]?.firstTry || firstTry,
        },
      }));
      setSessionResult((previous) => [
        ...previous.filter((item) => item.id !== currentQuestion.id),
        { id: currentQuestion.id, firstTry },
      ]);
      setFeedback("correct");
      return;
    }

    setWrongChoices((previous) => [...previous, optionIndex]);
    setWrongAttempts((previous) => previous + 1);
    setFeedback("wrong");
  };

  const nextQuestion = () => {
    if (currentIndex === session.length - 1) {
      setView("summary");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentIndex((previous) => previous + 1);
    setWrongChoices([]);
    setWrongAttempts(0);
    setFeedback("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setView("home");
    setFeedback("idle");
    setShowProgress(false);
    setExpandedImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const imageModal =
    expandedImage && (
      <div
        className="image-modal"
        role="presentation"
        onClick={() => setExpandedImage(null)}
      >
        <button
          className="image-modal-close"
          onClick={() => setExpandedImage(null)}
          aria-label="Fechar imagem ampliada"
        >
          ×
        </button>
        <img
          src={expandedImage}
          alt="Questão ou solução oficial ampliada"
          onClick={(event) => event.stopPropagation()}
        />
      </div>
    );

  if (view === "quiz" && currentQuestion) {
    const meta = themeMeta[currentQuestion.theme];
    const progressPercent = ((currentIndex + 1) / session.length) * 100;
    const hintIndex = Math.min(Math.max(wrongAttempts - 1, 0), 2);

    return (
      <>
        <main className="quiz-shell">
          <header className="quiz-topbar">
            <button
              className="back-button"
              onClick={goHome}
              aria-label="Voltar ao início"
            >
              ← <span>Início</span>
            </button>
            <div className={`quiz-theme ${meta.color}`}>
              <span>{meta.icon}</span>
              {meta.name}
            </div>
            <div
              className="quiz-score"
              aria-label={`${solvedCount} questões resolvidas`}
            >
              ★ {solvedCount}
            </div>
          </header>

          <div
            className="quiz-progress"
            aria-label={`Questão ${currentIndex + 1} de ${session.length}`}
          >
            <span>
              {sessionName} • {currentIndex + 1}/{session.length}
            </span>
            <i>
              <b style={{ width: `${progressPercent}%` }} />
            </i>
          </div>

          <section className="question-layout">
            <article className="question-card official-question-card">
              <div className="question-source-row">
                <p className="eyebrow">Questão oficial OBMEP Mirim</p>
                <span>{sessionTitle(currentQuestion)}</span>
              </div>
              <h1>Leia com atenção e escolha uma alternativa.</h1>

              <button
                className="official-image-button"
                onClick={() => setExpandedImage(currentQuestion.questionImage)}
                aria-label="Ampliar a questão"
              >
                <img
                  src={currentQuestion.questionImage}
                  alt={currentQuestion.altText}
                />
                <span>⌕ Toque para ampliar</span>
              </button>

              <div className="answer-grid official-answer-grid" aria-label="Escolha uma resposta">
                {letters.map((letter, index) => {
                  const isWrong = wrongChoices.includes(index);
                  const isCorrect =
                    feedback === "correct" &&
                    index === currentQuestion.answer;
                  return (
                    <button
                      className={`${isWrong ? "wrong-option" : ""} ${
                        isCorrect ? "correct-option" : ""
                      }`}
                      disabled={feedback === "correct" || isWrong}
                      key={letter}
                      onClick={() => chooseAnswer(index)}
                    >
                      <span>{letter}</span>
                      <strong>Alternativa {letter}</strong>
                      {isWrong && <i aria-label="Resposta já tentada">×</i>}
                      {isCorrect && <i aria-label="Resposta correta">✓</i>}
                    </button>
                  );
                })}
              </div>
            </article>

            <aside className={`coach-card ${feedback}`} aria-live="polite">
              {feedback === "idle" && (
                <>
                  <span className="coach-face">◡</span>
                  <p className="eyebrow">Pense como uma investigadora</p>
                  <h2>Procure a informação que muda tudo.</h2>
                  <ul>
                    <li>O que a questão quer descobrir?</li>
                    <li>Quais dados você já conhece?</li>
                    <li>Vale desenhar ou testar casos?</li>
                  </ul>
                  <p className="coach-note">
                    Se a figura estiver pequena, toque nela para ampliar.
                  </p>
                </>
              )}

              {feedback === "wrong" && (
                <>
                  <span className="coach-face">↻</span>
                  <p className="eyebrow">Pista {hintIndex + 1} de 3</p>
                  <h2>
                    {wrongAttempts === 1
                      ? "Boa tentativa! Vamos olhar por outro jeito."
                      : wrongAttempts === 2
                        ? "Você está chegando perto. Tente este novo passo."
                        : "Agora organize o raciocínio parte por parte."}
                  </h2>
                  <div className="hint-box">
                    {currentQuestion.hints[hintIndex]}
                  </div>
                  <p className="coach-note">
                    A opção tentada foi eliminada. Escolha outra quando estiver pronta.
                  </p>
                </>
              )}

              {feedback === "correct" && (
                <>
                  <span className="coach-face">★</span>
                  <p className="eyebrow">
                    {wrongAttempts === 0
                      ? "Acertou de primeira!"
                      : "Você conseguiu!"}
                  </p>
                  <h2>
                    {wrongAttempts === 0
                      ? "Mandou muito bem, Bela!"
                      : "Boa, Bela! Você usou as pistas e não desistiu."}
                  </h2>
                  <div className="official-solution">
                    <strong>
                      Solução oficial • alternativa {letters[currentQuestion.answer]}
                    </strong>
                    <p>Compare o seu raciocínio com a explicação da OBMEP.</p>
                    {currentQuestion.solutionImages.map((image, index) => (
                      <button
                        key={image}
                        onClick={() => setExpandedImage(image)}
                        aria-label={`Ampliar solução oficial, parte ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`Solução oficial da questão ${currentQuestion.number}, parte ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                  <button className="next-button" onClick={nextQuestion}>
                    {currentIndex === session.length - 1
                      ? "Ver meu resultado"
                      : "Próxima questão"}{" "}
                    →
                  </button>
                </>
              )}
            </aside>
          </section>
        </main>
        {imageModal}
      </>
    );
  }

  if (view === "summary") {
    const sessionFirstTry = sessionResult.filter((item) => item.firstTry).length;
    return (
      <main className="summary-shell">
        <section className="summary-card">
          <div className="medal" aria-hidden="true">
            <span>★</span>
          </div>
          <p className="eyebrow">Missão cumprida</p>
          <h1>Você ficou mais forte, Bela!</h1>
          <p>
            No {sessionName.toLowerCase()}, você resolveu {sessionResult.length}{" "}
            questões e acertou {sessionFirstTry} de primeira.
          </p>
          <div className="summary-stats">
            <article>
              <strong>{sessionResult.length}</strong>
              <span>resolvidas</span>
            </article>
            <article>
              <strong>{sessionFirstTry}</strong>
              <span>de primeira</span>
            </article>
            <article>
              <strong>{solvedIn(levelQuestions, progress)}/90</strong>
              <span>no nível</span>
            </article>
          </div>
          <div className="summary-actions">
            <button
              className="primary-action"
              onClick={() => beginSession(session, sessionName)}
            >
              Fazer novamente
            </button>
            <button className="secondary-action" onClick={goHome}>
              Escolher outra aventura
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
        <p role="status" className="sync-notice">{syncMessage}</p>
      <div className="paper-shape shape-one" aria-hidden="true" />
      <div className="paper-shape shape-two" aria-hidden="true" />
      <div className="paper-shape shape-three" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">
          <span className="brand-circle" />
          <span className="brand-triangle" />
          <span className="brand-square" />
        </div>
        <div>
          <p className="eyebrow">Aventura matemática</p>
          <h1>Bela na OBMEP</h1>
        </div>
        <button
          className="round-button"
          aria-label="Ver meu progresso"
          onClick={() => setShowProgress(true)}
        >
          ★
        </button>
      </header>

      <div className="level-switch" aria-label="Escolha o nível da OBMEP Mirim">
        <button
          className={level === "m2" ? "active" : ""}
          onClick={() => setLevel("m2")}
        >
          <strong>Mirim 2</strong>
          <span>Para a Bela • 4º e 5º ano</span>
        </button>
        <button
          className={level === "m1" ? "active" : ""}
          onClick={() => setLevel("m1")}
        >
          <strong>Mirim 1</strong>
          <span>Aquecimento • 2º e 3º ano</span>
        </button>
      </div>

      <section className="hero" aria-labelledby="welcome-title">
        <div className="hero-copy">
          <span className="level-pill">{levelLabel(level)} • 90 oficiais</span>
          <h2 id="welcome-title">
            Oi, Bela! <span>Vamos treinar?</span>
          </h2>
          <p>
            Questões oficiais de 2023, 2024 e 2025, com pistas e soluções.
          </p>
          <div className="stats" aria-label="Seu progresso">
            <article>
              <span className="stat-icon aqua">✓</span>
              <div>
                <strong>{solvedCount}</strong>
                <small>questões resolvidas</small>
              </div>
            </article>
            <article>
              <span className="stat-icon sun">★</span>
              <div>
                <strong>{firstTryCount}</strong>
                <small>acertos de primeira</small>
              </div>
            </article>
            <article>
              <span className="stat-icon lilac">↗</span>
              <div>
                <strong>{solvedCount === 90 ? "Completo!" : "3 anos"}</strong>
                <small>{solvedCount === 90 ? "nível conquistado" : "de provas oficiais"}</small>
              </div>
            </article>
          </div>
        </div>

        <aside className="start-card">
          <div className="start-orbit" aria-hidden="true">
            <span>{solvedCount === 90 ? "✓" : Math.min(solvedCount + 1, 90)}</span>
          </div>
          <p>Seu próximo passo</p>
          <h3>
            {solvedCount === 0
              ? "Faça um treino misto com 5 questões"
              : solvedCount === 90
                ? "Revise as questões para ganhar confiança"
                : "Continue com 5 questões ainda não resolvidas"}
          </h3>
          <button onClick={startMixed}>
            {solvedCount === 0 ? "Começar treino" : "Continuar treino"}{" "}
            <span aria-hidden="true">→</span>
          </button>
        </aside>
      </section>

      <section className="themes-section" id="temas" aria-labelledby="themes-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">9 caminhos para explorar</p>
            <h2 id="themes-title">Treinar por tema</h2>
          </div>
          <span className="question-count">90 questões neste nível</span>
        </div>

        <div className="theme-grid">
          {themeOrder.map((themeId, index) => {
            const theme = themeMeta[themeId];
            const themeQuestions = levelQuestions.filter(
              (question) => question.theme === themeId,
            );
            const completed = solvedIn(themeQuestions, progress);
            const percent =
              themeQuestions.length > 0
                ? (completed / themeQuestions.length) * 100
                : 0;
            return (
              <button
                className="theme-card"
                key={themeId}
                aria-label={`Treinar ${theme.name}. ${completed} de ${themeQuestions.length} concluídas`}
                onClick={() => startTheme(themeId)}
                disabled={themeQuestions.length === 0}
              >
                <span className={`theme-icon ${theme.color}`} aria-hidden="true">
                  {theme.icon}
                </span>
                <span className="theme-copy">
                  <small>
                    Aventura {index + 1} • {completed}/{themeQuestions.length}
                  </small>
                  <strong>{theme.name}</strong>
                  <span className="mini-progress">
                    <i style={{ width: `${percent}%` }} />
                  </span>
                </span>
                <span className="card-arrow" aria-hidden="true">
                  ›
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="exam-section" aria-labelledby="exam-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">15 questões em sequência</p>
            <h2 id="exam-title">Fazer uma prova completa</h2>
          </div>
          <span className="question-count">2023 a 2025</span>
        </div>
        <div className="exam-grid">
          {YEARS.map((year) =>
            ([1, 2] as const).map((phase) => {
              const exam = levelQuestions.filter(
                (question) =>
                  question.year === year && question.phase === phase,
              );
              const done = solvedIn(exam, progress);
              return (
                <button
                  key={`${year}-${phase}`}
                  onClick={() => startExam(year, phase)}
                >
                  <span>{year}</span>
                  <strong>{phase}ª fase</strong>
                  <small>{done}/15 resolvidas</small>
                  <i>Começar →</i>
                </button>
              );
            }),
          )}
        </div>
      </section>

      <footer>
        <p>Feito para a Bela pensar, testar e descobrir no ritmo dela.</p>
        <span>Questões e soluções oficiais da OBMEP Mirim.</span>
      </footer>

      {showProgress && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setShowProgress(false)}
        >
          <section
            className="progress-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="progress-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowProgress(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <p className="eyebrow">Mapa da Bela • {levelLabel(level)}</p>
            <h2 id="progress-title">Seu progresso</h2>
            <p>
              Cada questão resolvida fica salva neste aparelho. Você pode repetir
              qualquer tema ou prova quando quiser.
            </p>
            <div className="progress-big">
              <strong>{solvedCount}/90</strong>
              <span>questões oficiais resolvidas</span>
            </div>
            <div className="progress-list">
              {themeOrder.map((themeId) => {
                const themeQuestions = levelQuestions.filter(
                  (question) => question.theme === themeId,
                );
                return (
                  <div key={themeId}>
                    <span>{themeMeta[themeId].name}</span>
                    <strong>
                      {solvedIn(themeQuestions, progress)}/{themeQuestions.length}
                    </strong>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

const YEARS = [2023, 2024, 2025] as const;
