"use client";
import Image from "next/image";
import AppIcon from "../AppIcon";
import { useStudy } from "./StudyContext";

export default function InfographicView() {
  const { activeSubject, setEnlargedInfographic, infographicPage, setInfographicPage, activeSubjectData, isEla3, reviewInfographicPages, go } = useStudy();
  return (
    <div className="page infographic-page ela-infographic-page">
          <button className="back-button" onClick={() => go("science")}>← {activeSubject === "ela" ? "Back to E.L.A." : `Voltar para ${activeSubjectData.name}`}</button>
          <div className="infographic-heading">
            <div>
              <span className="eyebrow orange-text">{activeSubject === "ela" ? "VISUAL REVIEW" : "REVISÃO VISUAL"}</span>
              <h1>{activeSubject === "ela" ? "Bela's Exam Map" : `Mapas da prova de ${activeSubjectData.name}`}</h1>
              <p>{isEla3 ? "Review the ten Term 3 topics, then return to the quiz to practise." : activeSubject === "ela" ? "Review the seven Term 2 topics, then return to the quiz to practise." : "Revise cada mapa e depois pratique nos desafios interativos."}</p>
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
              <span><AppIcon name="search" /> {activeSubject === "ela" ? "Tap to enlarge" : "Toque para ampliar"}</span>
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
  );
}
