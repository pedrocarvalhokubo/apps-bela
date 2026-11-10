"use client";
import AppIcon from "../AppIcon";
import { subjects } from "../study/data";
import { type SubjectKey } from "../../curriculum-data";
import { useStudy } from "./StudyContext";

export default function HomeView() {
  const { isGuest, term, setTerm, storageReady, pairMessage, allLessons, completedAllLessons, overallProgress, nextSteps, openSubject, resumeStudy } = useStudy();
  return (
    <div className="page home-page">
          <section className="welcome-card">
            <div className="welcome-copy">
              <span className="eyebrow"><AppIcon name="spark" /> {isGuest?"OLÁ, CONVIDADO!":"OLÁ, BELA!"}</span>
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
                <button key={`${step.subject}-${step.title}`} className={`mission-card mission-${step.kind}`} onClick={() => openSubject(step.subject, step.term)}>
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
                {subjects.filter(subject => term === 3 ? subject.key === "science" || subject.key === "history" || subject.key === "ela" || subject.key === "geography" || subject.key === "portuguese" : subject.key !== "science").map((subject) => (
                  <button
                    key={subject.name}
                    className={`subject-card ${subject.color} ${subject.status === "soon" ? "subject-soon" : ""}`}
                    onClick={() => subject.status === "ready" && subject.key && openSubject(subject.key as SubjectKey)}
                    disabled={subject.status === "soon"}
                  >
                    <span className="subject-icon"><AppIcon name={subject.icon} /></span>
                    <span className="subject-copy">
                      <strong>{subject.name}</strong>
                      <small>{term === 3 && subject.key === "geography" ? "Migrações e culturas • 4 aulas" : term === 3 && subject.key === "ela" ? "Words & reading • 10 aulas" : term === 3 && subject.key === "history" ? "África e Brasil • 7 aulas" : term === 3 && subject.key === "portuguese" ? "Verbos, numerais e sílabas • 6 aulas" : subject.detail}</small>
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
  );
}
