"use client";

import { useState } from 'react';
import { ela3Practice, ela3Subject } from '../../ela3-data';

export default function Ela3Print() {
  const [key, setKey] = useState(false);
  return <main className="ela3-print">
    <nav className="print-controls"><a href="/">← Voltar ao app</a><button onClick={() => setKey(!key)}>{key ? 'Voltar às atividades' : 'Consultar gabarito'}</button><button onClick={() => window.print()}>Imprimir / salvar PDF</button></nav>
    <h1>ELA • Term 3</h1><p>{key ? 'Suggested answers • Gabarito de apoio' : 'Writing practice • Atividades de revisão'}</p>
    <p>{key ? 'Accept other answers with the same meaning and evidence. These are practice materials, not an official assessment.' : 'Read the lessons first. Answer in English. These are practice activities, not an official assessment.'}</p>
    {ela3Practice.map((task, i) => <section key={task.lesson} className="print-question">
      <h2>{i + 1}. {ela3Subject.lessons.find(l => l.id === task.lesson)?.title}</h2>
      <p>{task.prompt}</p>
      {key ? <p className="print-answer">{task.answer}</p> : <div className="answer-lines" aria-label="Espaço para escrever a resposta">{[0,1,2,3,4].map(n => <div key={n} />)}</div>}
    </section>)}
    <style>{`
      .ela3-print{max-width:800px;margin:32px auto;padding:28px;background:white;color:#172d41;font:17px/1.6 system-ui}
      .ela3-print h1{font-size:34px}.ela3-print h2{font-size:20px}
      .print-controls{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:32px}.print-controls button,.print-controls a{padding:12px;border:1px solid #25767c;border-radius:12px;background:#edfafa;color:#164b50;cursor:pointer}
      .print-question{padding:20px 0;border-top:2px solid #bee3df;break-inside:avoid}.answer-lines div{border-bottom:1px solid #cbd5e1;height:34px}.print-answer{padding:16px;background:#edfafa}
      @media print{@page{size:A4;margin:18mm}.print-controls,body>nav,body>header{display:none!important}.ela3-print{max-width:none;margin:0;padding:0;font-size:12pt}.print-question{break-inside:avoid}.answer-lines div{height:30px}body{background:white!important}}
    `}</style>
  </main>;
}
