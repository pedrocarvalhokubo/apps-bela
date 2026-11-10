"use client";
import Image from "next/image";
import BelaTutor from "./components/BelaTutor";
import AppIcon from "./components/AppIcon";
import { scienceMaterialsReady } from "./science-data";
import { useStudyApp } from "./components/study/useStudyApp";
import { StudyContext } from "./components/study/StudyContext";
import HomeView from "./components/study/HomeView";
import SubjectView from "./components/study/SubjectView";
import InfographicView from "./components/study/InfographicView";
import LearnView from "./components/study/LearnView";
import ParentView from "./components/study/ParentView";
import QuizView from "./components/study/QuizView";
import ResultsView from "./components/study/ResultsView";

export default function Home() {
  const app = useStudyApp();
  const { isGuest, view, term, activeSubject, showReset, setShowReset, showInstall, setShowInstall, enlargedInfographic, setEnlargedInfographic, infographicPage, isStandalone, syncState, activeSubjectData, isHistory3, reviewInfographicPages, go, activeLesson, openParent, resetProgress } = app;
  return (
    <StudyContext.Provider value={app}>
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
            <AppIcon name="sync" /> {isGuest ? "Sem salvar" : syncState === "synced" ? "Salvo na conta" : syncState === "offline" ? "Offline" : "Salvando"}
          </span>
          <div className="profile-chip" aria-label={isGuest?"Perfil de convidado":"Perfil de Bela"}>
            <AppIcon name="star" />
            <b>{isGuest?"Convidado":"Bela"}</b>
          </div>
          {!isGuest && <button className="parent-trigger" onClick={openParent} aria-label="Abrir área parental">
            <AppIcon name="lock" /> <span>Pais</span>
          </button>}
          {!isStandalone && (
            <button className="install-trigger" onClick={() => setShowInstall(true)} aria-label="Instalar no iPhone">
              <AppIcon name="phone" /> <span>Instalar</span>
            </button>
          )}
          {isGuest && <button className="reset-trigger" onClick={() => setShowReset(true)} aria-label="Reiniciar progresso das matérias">
            <AppIcon name="sync" /> <span>Reiniciar</span>
          </button>}
        </div>
      </header>

      {view === "home" && <HomeView />}

      {view === "science" && <SubjectView />}

      {view === "infographic" && (activeSubject === "ela" || activeSubject === "geography" || activeSubject === "portuguese" || isHistory3 || (activeSubject === "science" && scienceMaterialsReady)) && <InfographicView />}

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

      {view === "learn" && <LearnView />}

      {view === "parent" && <ParentView />}

      {view === "quiz" && <QuizView />}

      {view === "results" && <ResultsView />}

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

      {!isGuest && view !== "home" && view !== "parent" && <BelaTutor title={activeSubjectData.name} context={{subject:activeSubject,term,view:view === "quiz" ? "quiz" : "study",...(view === "learn" ? {lessonId:activeLesson.id} : {}),...(view === "infographic" ? {page:infographicPage} : {})}} />}

      <footer>
        <span>{isGuest ? "Modo convidado • sem gravar avanço no banco" : "Feito para a Bela estudar no seu ritmo • histórico salvo na conta"}</span>
        <span className="footer-stars"><AppIcon name="star" /><AppIcon name="star" /><AppIcon name="star" /></span>
      </footer>
    </main>
    </StudyContext.Provider>
  );
}
