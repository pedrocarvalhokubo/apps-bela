'use client';
import {useState} from 'react';
import {math3Practice} from '../../math3-data';
import {useWrittenDraft} from '../../../lib/use-written-draft';
export default function Math3Written({lessonId}:{lessonId:string}){const task=math3Practice.find(t=>t.lesson===lessonId);const {draft,ready,status,change}=useWrittenDraft(`bela-math3-written-${lessonId}`);const [show,setShow]=useState(false);if(!task)return null;return <section className="ela3-practice"><h3>✍️ Explain your thinking</h3><p>{task.prompt}</p><label htmlFor={`math-write-${lessonId}`}>Sua explicação ou cálculo</label><textarea id={`math-write-${lessonId}`} disabled={!ready} rows={4} value={draft} onChange={e=>change(e.target.value)}/><small role="status">{status}</small><button onClick={()=>setShow(!show)}>{show?'Esconder resposta':'Já fiz: conferir uma resposta'}</button>{show&&<p>{task.answer}</p>}</section>;}
