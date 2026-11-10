"use client";
import AppIcon from "../AppIcon";
import { quizCatalog } from "../../curriculum-data";
import { scienceMaterialsReady, scienceDownloads } from "../../science-data";
import { history3Downloads } from "../../history3-data";
import { useStudy } from "./StudyContext";

export default function SubjectView() {
  const { geographyDate, setOpenLesson, quizStatsById, activeSubject, setInfographicPage, activeSubjectData, isEla3, isGeography3, isHistory3, isPortuguese3, reviewInfographicPages, currentLessons, completedCurrentLessons, learnProgress, go, startQuiz, infographicCardShown, mockQuizIds, mockCopy, reviewQuizNumber, reviewQuizCard } = useStudy();
  return (
    <div className="page subject-page">
          <button className="back-button" onClick={() => go("home")}>← Voltar às matérias</button>

          <section className={`subject-hero subject-hero-${activeSubjectData.key}`}>
            <div className="subject-hero-icon"><AppIcon name={activeSubjectData.key === "ela" ? "language" : activeSubjectData.key} /></div>
            <div>
              <span className="eyebrow teal">{activeSubjectData.eyebrow}</span>
              <h1>{activeSubjectData.title}</h1>
              <p>{activeSubjectData.description}</p>
              {isGeography3 && geographyDate && <p className="geo-assessment-date">🗓 Avaliação: {new Date(geographyDate+"T12:00:00").toLocaleDateString("pt-BR")}</p>}

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
                <p>{isGeography3 ? "Estude por imagens, amplie os infográficos e pratique com suas palavras." : "Comece pelo resumo e aprofunde com vocabulário, exemplos e atividades do material."}</p>
                <em>{completedCurrentLessons}/{currentLessons.length} aulas</em>
              </span>
              <span className="path-arrow">→</span>
            </button>

            {infographicCardShown && (
              <button className="path-card path-info" onClick={() => { setInfographicPage(0); go("infographic"); }}>
                <span className="path-number">2</span>
                <span className="path-art"><AppIcon name="art" /></span>
                <span className="path-content">
                  <small>{activeSubject === "ela" ? "VISUAL REVIEW" : "REVISÃO VISUAL"}</small>
                  <strong>{activeSubject === "ela" ? "Exam infographic" : "Infográficos da prova"}</strong>
                  <p>{isEla3 ? "Explore sounds, word meanings and reading with three illustrated review maps." : activeSubject === "ela" ? "Start with the exam map, then explore one deep-review page for each topic." : "Veja um mapa visual de cada assunto e explique os exemplos com suas palavras."}</p>
                  <em>{activeSubject === "ela" ? `${reviewInfographicPages.length} illustrated review pages` : `${reviewInfographicPages.length} páginas ilustradas`}</em>
                </span>
                <span className="path-arrow">→</span>
              </button>
            )}

            {mockQuizIds.length > 0 && reviewQuizCard}
            {mockQuizIds.map((id, index) => (
              <button key={id} className="path-card path-quiz" onClick={() => startQuiz(id)}>
                <span className="path-number">{reviewQuizNumber + 1 + index}</span>
                <span className="path-art"><AppIcon name="medal" /></span><span className="path-content"><small>{mockCopy.small}</small><strong>{quizCatalog[id].title}</strong><p>{mockCopy.text}</p><em>{mockCopy.best} {quizStatsById[id].bestScore}/{quizCatalog[id].questions.length}</em></span><span className="path-arrow">→</span>
              </button>
            ))}
            {isPortuguese3 && (
              <button className="path-card path-quiz" onClick={() => startQuiz("portuguese3-roman-practice")}>
                <span className="path-number">{reviewQuizNumber + 1 + mockQuizIds.length}</span>
                <span className="path-art"><AppIcon name="history" /></span><span className="path-content"><small>TREINO EXTRA</small><strong>{quizCatalog["portuguese3-roman-practice"].title}</strong><p>{quizCatalog["portuguese3-roman-practice"].questions.length} questões só de números romanos: ler, escrever, séculos, reis e relógios.</p><em>Melhor: {quizStatsById["portuguese3-roman-practice"].bestScore}/{quizCatalog["portuguese3-roman-practice"].questions.length}</em></span><span className="path-arrow">→</span>
              </button>
            )}

            {isGeography3 && <a className="path-card path-test" href="/geografia3/imprimir" target="_blank" rel="noopener noreferrer"><span className="path-art"><AppIcon name="note" /></span><span className="path-content"><small>SE QUISER ESCREVER NO PAPEL</small><strong>Provas e atividades para imprimir</strong><p>Escolha o quiz, o simulado A, B ou as respostas escritas. PDFs e gabarito separado.</p></span><span className="path-arrow">→</span></a>}
            {isPortuguese3 && <a className="path-card path-test" href="/portugues3/imprimir" target="_blank" rel="noopener noreferrer"><span className="path-art"><AppIcon name="note" /></span><span className="path-content"><small>SE QUISER ESCREVER NO PAPEL</small><strong>Provas e atividades para imprimir</strong><p>Quiz, simulado A, simulado B ou atividades escritas, com gabarito separado.</p><em>Abrir folha → imprimir ou salvar em PDF</em></span><span className="path-arrow">→</span></a>}
            {isEla3 && <a className="path-card path-test" href="/ela3/imprimir" target="_blank" rel="noopener noreferrer"><span className="path-art"><AppIcon name="note" /></span><span className="path-content"><small>WRITING PRACTICE</small><strong>Atividades para imprimir</strong><p>10 atividades abertas e gabarito separado para consultar depois.</p><em>Abrir folha de atividades → imprimir ou salvar em PDF</em></span><span className="path-arrow">→</span></a>}
            {isHistory3 && history3Downloads.map(download => (
              <a key={download.id} className="path-card path-test" href={download.src} download>
                <span className="path-art"><AppIcon name="note" /></span>
                <span className="path-content"><small>MATERIAL PARA IMPRIMIR</small><strong>{download.label}</strong><p>{download.id === "key" ? "Confira depois de responder. Respostas abertas aceitam outras palavras com a mesma ideia." : "Leia com calma e responda com suas palavras."}</p><em>PDF A4 • {download.pages} páginas</em></span>
                <span className="path-arrow">↓</span>
              </a>
            ))}
            {activeSubject === "science" && scienceMaterialsReady && scienceDownloads.map(download => (
              <a key={download.id} className="path-card path-test" href={download.src} download>
                <span className="path-art"><AppIcon name="note" /></span>
                <span className="path-content"><small>DOWNLOAD PDF</small><strong>{download.label}</strong><p>Baixar e imprimir • Download and print</p><em>PDF A4 • {download.pages} páginas</em></span>
                <span className="path-arrow">↓</span>
              </a>
            ))}

            {activeSubject === "geography" && !isGeography3 && <a className="path-card path-test" href="/materials/gabarito-geografia-2.pdf" target="_blank" rel="noopener noreferrer"><span className="path-art"><AppIcon name="note" /></span><span className="path-content"><small>CONFERIR DEPOIS DE RESPONDER</small><strong>Gabarito da prova escrita</strong><p>Orientações de resposta e referências às atividades da escola.</p></span><span className="path-arrow">→</span></a>}

            {activeSubject === "geography" && !isGeography3 && (
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

            {!mockQuizIds.length && reviewQuizCard}
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
                      {isPortuguese3 && lesson.id === "p3-roman" && (
                        <button className="topic-quiz-button" onClick={() => startQuiz("portuguese3-roman-practice")}>
                          Treino extra • {quizCatalog["portuguese3-roman-practice"].questions.length} questões
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
  );
}
