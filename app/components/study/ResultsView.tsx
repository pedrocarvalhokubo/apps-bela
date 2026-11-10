"use client";
import AppIcon from "../AppIcon";
import { scienceTopicTitle } from "../../science-data";
import { useStudy } from "./StudyContext";

export default function ResultsView() {
  const { activeSubject, activeQuizId, activeSubjectData, currentQuestions, go, resultScore, resultPercent, isPortugueseMode, topicResults, startQuiz } = useStudy();
  return (
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
                      <p><strong>{activeSubject === "science" ? scienceTopicTitle(item.topic) : item.topic}</strong><span>{item.correct}/{item.total}</span></p>
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
  );
}
