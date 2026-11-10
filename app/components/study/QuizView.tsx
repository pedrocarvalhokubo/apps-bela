"use client";
import Image from "next/image";
import AppIcon from "../AppIcon";
import { GeographyQuestionVisual } from "../study/Visuals";
import { scienceTopicTitle } from "../../science-data";
import { useStudy } from "./StudyContext";

export default function QuizView() {
  const { activeSubject, activeQuizId, quizIndex, selectedOption, setSelectedOption, answerChecked, doubtQuestionIds, eliminatedOptions, questionMistakes, thinkingFeedback, isGeography3, currentQuestions, go, currentQuestion, activeQuizTitle, isPortugueseMode, toggleDoubt, checkAnswer, nextQuestion } = useStudy();
  return (
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
              <span>{activeSubject === "science" ? scienceTopicTitle(currentQuestion.topic) : currentQuestion.topic}</span>
              <span>{answerChecked
                ? isPortugueseMode ? "Resposta explicada" : "Answer explained"
                : isPortugueseMode ? "Escolha uma resposta" : "Choose an answer"}</span>
            </div>

            <div className="question-title">
              <span>{quizIndex + 1}</span>
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

            {activeSubject === "geography" && !isGeography3 && <GeographyQuestionVisual topic={currentQuestion.topic} />}

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
  );
}
