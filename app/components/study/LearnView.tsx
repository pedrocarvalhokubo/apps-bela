"use client";
import Image from "next/image";
import AppIcon from "../AppIcon";
import { LessonVisual } from "./Visuals";
import { quizCatalog } from "../../curriculum-data";
import { ela3ImageForLesson } from "../../ela3-data";
import { geography3Subject, geography3ImageForLesson } from "../../geography3-data";
import Geography3Practice from "../Geography3Practice";
import Portuguese3Practice from "../Portuguese3Practice";
import { portuguese3Infographics, portuguese3ImageForLesson } from "../../portuguese3-data";
import Ela3Practice from "../Ela3Practice";
import SciencePractice from "../SciencePractice";
import ScienceMatching from "../ScienceMatching";
import { deepStudyByLesson } from "../../deep-content";
import { scienceImageForLesson } from "../../science-data";
import { history3Infographics } from "../../history3-data";
import { useStudy } from "./StudyContext";

export default function LearnView() {
  const { openLesson, setOpenLesson, completedLessons, activeSubject, setEnlargedInfographic, setInfographicPage, activeSubjectData, isEla3, isGeography3, isHistory3, isPortuguese3, currentLessons, learnProgress, go, toggleLesson, activeLesson, startQuiz } = useStudy();
  return (
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

              {isPortuguese3 && portuguese3ImageForLesson(activeLesson.id) ? <button className="geo-lesson-image" onClick={()=>{setInfographicPage(portuguese3Infographics.indexOf(portuguese3ImageForLesson(activeLesson.id)!));setEnlargedInfographic(true);}} aria-label="Ampliar o infográfico desta aula"><Image className="history3-lesson-map" src={portuguese3ImageForLesson(activeLesson.id)!.src} alt={portuguese3ImageForLesson(activeLesson.id)!.alt} width={1024} height={1536} unoptimized /><span>Toque para ampliar ↗</span></button> : isPortuguese3 ? null : isGeography3 ? <button className="geo-lesson-image" onClick={()=>{setInfographicPage(geography3Subject.lessons.findIndex(l=>l.id===activeLesson.id));setEnlargedInfographic(true);}} aria-label="Ampliar o infográfico desta aula"><Image className="history3-lesson-map" {...geography3ImageForLesson(activeLesson.id)} alt={geography3ImageForLesson(activeLesson.id).alt} unoptimized /><span>Toque para ampliar ↗</span></button> : isEla3 ? <Image className="history3-lesson-map" {...ela3ImageForLesson(activeLesson.id)} alt={ela3ImageForLesson(activeLesson.id).alt} /> : isHistory3 ? <Image className="history3-lesson-map" src={history3Infographics[activeLesson.id === "h3-diversity" || activeLesson.id === "h3-origins" ? 0 : ["h3-slavery","h3-routes","h3-colonization","h3-culture","h3-diaspora"].indexOf(activeLesson.id)+1].src} alt="Mapa visual do assunto; amplie na área de infográficos" width={1024} height={1536} /> : activeSubject === "science" ? <Image className="history3-lesson-map" src={scienceImageForLesson(activeLesson.id).src} alt={scienceImageForLesson(activeLesson.id).alt} width={1024} height={1536} /> : <LessonVisual subject={activeSubject} lessonId={activeLesson.id} />}

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

              {isGeography3 && <Geography3Practice key={activeLesson.id} lessonId={activeLesson.id} />}
              {isPortuguese3 && <Portuguese3Practice key={activeLesson.id} lessonId={activeLesson.id} />}
              {isPortuguese3 && activeLesson.id === "p3-roman" && (
                <button className="lesson-quiz-button" onClick={() => startQuiz("portuguese3-roman-practice")}>
                  🏛️ Treino extra de algarismos romanos • {quizCatalog["portuguese3-roman-practice"].questions.length} questões
                </button>
              )}
              {isEla3 && <Ela3Practice key={activeLesson.id} lessonId={activeLesson.id} />}
              {activeSubject === "science" && <><ScienceMatching key={activeLesson.id} lessonId={activeLesson.id} /><SciencePractice key={`practice-${activeLesson.id}`} lessonId={activeLesson.id} /></>}

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
  );
}
