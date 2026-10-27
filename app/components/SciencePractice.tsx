"use client";

import Image from 'next/image';
import { useWrittenDraft } from '../../lib/use-written-draft';
import { sciencePractice, scienceSources } from '../science-data';

function WrittenTask({task}: {task: typeof sciencePractice[number]}) {
  const {draft,ready,status,change} = useWrittenDraft(`bela-${task.id}`);
  return <section className="ela3-practice" aria-label="Science writing practice">
    <small>✍️ YOUR TURN • AGORA É COM VOCÊ</small>
    <h3>{task.prompt}</h3>
    <label htmlFor={task.id}>Your answer • Sua resposta</label>
    <textarea id={task.id} value={draft} disabled={!ready} rows={5} onChange={event => change(event.target.value)} placeholder="Write in English. You can also use your notebook." />
    <small>{status} Você também pode responder no caderno.</small>
    <details><summary>Compare after trying • Ver sugestão depois de tentar</summary><p>{task.answer}</p><p>Outras palavras são aceitas quando explicam as mesmas ideias. Confira com um adulto.</p></details>
  </section>;
}

export default function SciencePractice({lessonId}: {lessonId: string}) {
  const sources = lessonId === 's3-fossil-discovery' ? scienceSources.slice(0,1) : lessonId === 's3-hurricane' ? scienceSources.slice(1) : [];
  return <>
    {lessonId === 's3-hurricane' && <figure className="science-evidence"><Image src="/science-term3/evidence/haiti-comparison.jpg" alt="Cavaillon River, Haiti: greener landscape on the left before Matthew; browner land and sediment near the river mouth on the right afterwards." width={720} height={480} /><figcaption>Haiti • Left: 26 Sep 2016. Right: 12 Oct 2016.<br />NASA Earth Observatory / Jesse Allen, using USGS Landsat data.</figcaption></figure>}
    {sources.length > 0 && <aside className="ela3-practice"><h3>Read the evidence • Consulte as fontes</h3>{sources.map(source => <p key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></p>)}</aside>}
    {sciencePractice.filter(task => task.lesson === lessonId).map(task => <WrittenTask key={task.id} task={task} />)}
  </>;
}
