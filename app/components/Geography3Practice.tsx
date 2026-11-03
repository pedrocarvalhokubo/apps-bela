'use client';
import {useState} from 'react';
import {geography3Practice} from '../geography3-data';
import {useWrittenDraft} from '../../lib/use-written-draft';
export default function Geography3Practice({lessonId}:{lessonId:string}) {
 const task=geography3Practice.find(t=>t.lesson===lessonId);
 const {draft,ready,status,change}=useWrittenDraft(`bela-geography3-practice-${lessonId}`);
 const [show,setShow]=useState(false);
 if(!task)return null;
 return <section className="ela3-practice" aria-label="Desafio de escrita de Geografia"><h3>✍️ Explique do seu jeito</h3><p>{task.prompt}</p><label htmlFor={`write-${lessonId}`}>Sua resposta</label><textarea id={`write-${lessonId}`} disabled={!ready} value={draft} onChange={e=>change(e.target.value)} rows={5}/><small role="status">{status}</small><button onClick={()=>setShow(!show)}>{show?'Esconder orientação':'Já respondi: conferir uma orientação'}</button>{show&&<p className="practice-answer">{task.answer}</p>}<p>Respostas abertas podem usar outras palavras. O importante é explicar a ideia com evidências.</p></section>;
}
