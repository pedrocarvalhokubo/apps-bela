'use client';
import Link from 'next/link';
import {useState} from 'react';
import {geography3Questions,geography3Practice,geography3Sources} from '../../geography3-data';
const activities = {
 quiz: {title:'Quiz de revisão',pdf:'quiz-geografia-3.pdf'},
 'mock-a': {title:'Simulado A',pdf:'simulado-a-geografia-3.pdf'},
 'mock-b': {title:'Simulado B',pdf:'simulado-b-geografia-3.pdf'},
 written: {title:'Respostas escritas',pdf:'atividades-geografia-3.pdf'},
};
type Pool=keyof typeof activities;
export default function GeographyPrint(){
 const [pool,setPool]=useState<Pool>('mock-a'),[showKey,setShowKey]=useState(false);
 const questions=geography3Questions.filter(q=>q.pool===pool);
 const refs=[...new Set((pool==='written'?geography3Practice:questions).flatMap(q=>q.sourceRefs))];
 return <main className="geo-print">
  <nav aria-label="Impressão de Geografia">
   <Link href="/">← Voltar ao app</Link>
   <label>Atividade <select value={pool} onChange={e=>{setPool(e.target.value as Pool);setShowKey(false);}}>{Object.entries(activities).map(([id,a])=><option key={id} value={id}>{a.title}</option>)}</select></label>
   <button onClick={()=>setShowKey(!showKey)}>{showKey?'Voltar às questões':'Consultar gabarito'}</button>
   <button onClick={()=>window.print()}>Imprimir esta versão</button>
   <a href={'/materials/'+activities[pool].pdf} download>Baixar questões em PDF</a>
   <a href="/materials/gabaritos-geografia-3.pdf" download>Baixar gabaritos em PDF</a>
  </nav>
  <h1>Geografia • III trimestre</h1>
  <h2>{activities[pool].title}{showKey?' • Gabarito comentado':''}</h2>
  <p>Prática baseada no material da escola. Responda com as informações das atividades estudadas.</p>
  {pool==='written'?geography3Practice.map((t,i)=><section key={t.lesson}>
   <h3>{i+1}. {t.prompt}</h3>
   {showKey?<><p>{t.answer}</p><small>Fontes: {t.sourceRefs.join(', ')}.</small></>:<div className="lines">{[0,1,2,3,4].map(n=><div key={n}/>)}</div>}
  </section>):questions.map((q,i)=><section key={q.id}>
   <h3>{i+1}. {q.prompt}</h3>
   {showKey?<><p><b>{q.correct.toUpperCase()}.</b> {q.options.find(o=>o.id===q.correct)?.label}</p><p>{q.options.find(o=>o.id===q.correct)?.explanation}</p><small>Questão {q.id} • Fontes: {q.sourceRefs.join(', ')}. {q.evidenceNote}</small></>:<ol type="a">{q.options.map(o=><li key={o.id}>{o.label}</li>)}</ol>}
  </section>)}
  {showKey&&<aside aria-label="Referências do material escolar"><h2>Referências das respostas</h2><p>Os códigos identificam páginas do material original; as fotos permanecem privadas.</p>{geography3Sources.sources.filter(s=>refs.includes(s.id)).map(s=><p key={s.id}><b>{s.id}</b> — {s.title}, foto {s.photo}: {s.section}.</p>)}</aside>}
  <style>{`.geo-print{max-width:820px;margin:24px auto;padding:28px;background:white;color:#182b3a;font:17px/1.6 system-ui}.geo-print nav{display:flex;flex-wrap:wrap;gap:12px}.geo-print button,.geo-print select,.geo-print nav a{padding:10px;border:1px solid #26858c;border-radius:10px;background:#f0fbfb;color:#163c45}.geo-print section{padding:16px 0;border-top:1px solid #b8d6d8;break-inside:avoid}.geo-print h3{font-size:18px}.geo-print ol{list-style-type:lower-alpha;padding-left:28px}.geo-print li{padding:5px;display:list-item}.geo-print small{display:block;font-size:13px;color:#48606b}.geo-print aside{margin-top:28px}.lines div{height:32px;border-bottom:1px solid #b8c7d1}@media(max-width:600px){.geo-print{margin:0;padding:20px;font-size:16px}.geo-print nav>*{max-width:100%}}@media print{@page{size:A4;margin:16mm}.geo-print nav,.account-bar{display:none!important}.geo-print{padding:0;margin:0;font-size:12pt}.geo-print h3{font-size:12pt}.geo-print aside{break-before:page}}`}</style>
 </main>;
}
