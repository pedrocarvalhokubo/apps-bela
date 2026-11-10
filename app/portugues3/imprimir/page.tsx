'use client';
import Link from 'next/link';
import {useState} from 'react';
import {portuguese3Questions, portuguese3Practice, portuguese3Sources, portuguese3Subject} from '../../portuguese3-data';
const activities = {
  quiz: 'Quiz de revisão',
  'mock-a': 'Simulado A',
  'mock-b': 'Simulado B',
  'roman-practice': 'Treino de algarismos romanos',
  written: 'Atividades escritas',
};
type Pool = keyof typeof activities;
export default function PortuguesePrint() {
  const [pool, setPool] = useState<Pool>('mock-a'), [showKey, setShowKey] = useState(false);
  const questions = portuguese3Questions.filter(q => q.pool === pool);
  const refs = [...new Set((pool === 'written' ? portuguese3Practice : questions).flatMap(q => q.sourceRefs))];
  return <main className="geo-print">
    <nav aria-label="Impressão de Português">
      <Link href="/">← Voltar ao app</Link>
      <label>Atividade <select value={pool} onChange={e => { setPool(e.target.value as Pool); setShowKey(false); }}>{Object.entries(activities).map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select></label>
      <button onClick={() => setShowKey(!showKey)}>{showKey ? 'Voltar às questões' : 'Consultar gabarito'}</button>
      <button onClick={() => window.print()}>Imprimir / salvar PDF</button>
    </nav>
    <h1>Português • III trimestre</h1>
    <h2>{activities[pool]}{showKey ? ' • Gabarito comentado' : ''}</h2>
    <p>Prática sobre os assuntos do guia de estudo. As questões são novas, para treinar sem decorar as respostas do guia.</p>
    {pool === 'written' ? portuguese3Practice.map((t, i) => <section key={t.lesson}>
      <h3>{i + 1}. {portuguese3Subject.lessons.find(l => l.id === t.lesson)?.title}</h3>
      <p>{t.prompt}</p>
      {showKey ? <p><b>Resposta:</b> {t.answer}</p> : <div className="lines">{[0, 1, 2, 3, 4].map(n => <div key={n} />)}</div>}
    </section>) : questions.map((q, i) => <section key={q.id}>
      <h3>{i + 1}. {q.prompt}</h3>
      {showKey ? <><p><b>{q.correct.toUpperCase()}.</b> {q.options.find(o => o.id === q.correct)?.label}</p><p>{q.options.find(o => o.id === q.correct)?.explanation}</p><small>Assunto: {q.topic} • Referências: {q.sourceRefs.join(', ')}</small></> : <ol type="a">{q.options.map(o => <li key={o.id}>{o.label}</li>)}</ol>}
    </section>)}
    {showKey && <aside aria-label="Referências do guia de estudo"><h2>Referências do guia</h2><p>Os códigos indicam a parte do guia de estudo relacionada a cada resposta.</p>{portuguese3Sources.sources.filter(s => refs.includes(s.id)).map(s => <p key={s.id}><b>{s.id}</b> — {s.title}: {s.section}.</p>)}</aside>}
    <style>{`.geo-print{max-width:820px;margin:24px auto;padding:28px;background:white;color:#182b3a;font:17px/1.6 system-ui}.geo-print nav{display:flex;flex-wrap:wrap;gap:12px}.geo-print button,.geo-print select,.geo-print nav a{padding:10px;border:1px solid #26858c;border-radius:10px;background:#f0fbfb;color:#163c45}.geo-print section{padding:16px 0;border-top:1px solid #b8d6d8;break-inside:avoid}.geo-print h3{font-size:18px}.geo-print ol{list-style-type:lower-alpha;padding-left:28px}.geo-print li{padding:5px;display:list-item}.geo-print small{display:block;font-size:13px;color:#48606b}.geo-print aside{margin-top:28px}.lines div{height:32px;border-bottom:1px solid #b8c7d1}@media(max-width:600px){.geo-print{margin:0;padding:20px;font-size:16px}.geo-print nav>*{max-width:100%}}@media print{@page{size:A4;margin:16mm}.geo-print nav,.account-bar{display:none!important}.geo-print{padding:0;margin:0;font-size:12pt}.geo-print h3{font-size:12pt}.geo-print aside{break-before:page}}`}</style>
  </main>;
}
