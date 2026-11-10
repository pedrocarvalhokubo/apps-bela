"use client";
import HistoryImport from "../HistoryImport";
import TutorParents from "../TutorParents";
import AppIcon from "../AppIcon";
import { quizCatalog } from "../../curriculum-data";
import { scienceTopicTitle } from "../../science-data";
import { useStudy } from "./StudyContext";

export default function ParentView() {
  const { parentSetupCode, setParentSetupCode, deviceToken, parentHasPin, parentPin, setParentPin, parentToken, setParentToken, parentError, parentAnalytics, setParentAnalytics, go, unlockParent } = useStudy();
  return (
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
                ? "Use o código privado de configuração recebido por Pedro e escolha um PIN de 4 a 6 números, diferente da senha da Bela."
                : "A área da Bela continua livre para estudar; somente este acompanhamento fica protegido."}</p>
              {parentHasPin===false && <label>Código privado de configuração<input value={parentSetupCode} onChange={e=>setParentSetupCode(e.target.value)} autoComplete="off" aria-label="Código privado de configuração" placeholder="Código entregue a Pedro" /></label>}
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
                <div><span>✍️</span><strong>{parentAnalytics?.summary?.attempts ?? 0}</strong><small>respostas no histórico</small></div>
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
                          <div><strong>{topic.subject === "science" ? scienceTopicTitle(topic.topic) : topic.topic}</strong><small>{topic.subject.toUpperCase()} • {topic.attempts} respostas</small><i><b style={{ width: `${accuracy}%` }} /></i></div>
                          <em>{accuracy}%<small>{mastered ? "dominado" : needsReview ? "revisar depois" : "reforçar"}</small></em>
                        </div>;
                      })}
                    </div>
                  ) : <div className="empty-parent"><span>🌱</span><p>Os indicadores aparecerão assim que Bela responder às primeiras questões.</p></div>}
                </section>

                <aside className="parent-panel"><span className="eyebrow teal">EM QUALQUER APARELHO</span><h2>Uma conta, o mesmo histórico</h2><p>Entre como Bela com a senha dela no iPhone, iPad ou computador. O histórico fica associado à conta.</p><p>Para consultar este painel em outro aparelho, entre como Bela e informe o PIN exclusivo dos pais.</p><p>Última resposta: {parentAnalytics?.summary?.lastAt ? new Date(parentAnalytics.summary.lastAt).toLocaleString('pt-BR',{timeZone:'America/Bahia'}) : 'ainda não registrada'}.</p></aside>
              </div>

              <TutorParents parentToken={parentToken} />
              <HistoryImport parentToken={parentToken} />
              <section className="parent-panel"><span className="eyebrow teal">EVOLUÇÃO</span><h2>Respostas por dia</h2><p>Últimos 30 dias com atividade. Cada tentativa conta, inclusive após uma pista. Horários da Bahia.</p>
                {parentAnalytics?.timeline?.length ? <div className="history-table"><table><thead><tr><th>Dia</th><th>Respostas</th><th>Acertos</th><th>Aproveitamento</th></tr></thead><tbody>{parentAnalytics.timeline.map(day=><tr key={day.day}><td>{day.day.split('-').reverse().join('/')}</td><td>{day.attempts}</td><td>{day.correct}</td><td>{Math.round(day.correct/day.attempts*100)}%</td></tr>)}</tbody></table></div>:<p>As primeiras respostas formarão a evolução diária.</p>}
              </section>
              <section className="parent-panel"><h2>Atividades escritas</h2><p>Rascunhos da conta, sem correção automática.</p>{parentAnalytics?.drafts?.filter(d=>d.answer).length?parentAnalytics.drafts.filter(d=>d.answer).map(d=><details key={d.taskId}><summary>{d.taskId.replace('bela-science-write-','Ciências • atividade ').replace('bela-ela3-practice-e3-','ELA • ').replace('bela-geography3-practice-g3-','Geografia • ').replace('bela-portuguese3-practice-p3-','Português • ')} — {new Date(d.updatedAt).toLocaleDateString('pt-BR',{timeZone:'America/Bahia'})}</summary><p style={{whiteSpace:'pre-wrap'}}>{d.answer}</p></details>):<p>Ainda não há respostas escritas salvas.</p>}</section>
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
                        <div><small>{wrong.subject.toUpperCase()} • {wrong.subject === "science" ? scienceTopicTitle(wrong.topic) : wrong.topic}</small><strong>{question?.prompt ?? `Questão ${wrong.questionId}`}</strong><p>Marcou: {option?.label ?? wrong.selected.toUpperCase()}</p></div>
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
  );
}
