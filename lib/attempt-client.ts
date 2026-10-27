'use client';
import {getStudyMode,studyStorage} from './study-storage';
type Attempt=Record<string,unknown>&{eventId:string;answeredAt:number};
let flushing:Promise<void>|undefined;
const read=():Attempt[]=>{try{return JSON.parse(studyStorage.getItem('pending-attempts')??'[]');}catch{return [];}};
export async function flushAttempts(){
 if(getStudyMode()!=='bela')return;
 if(flushing)return flushing;
 flushing=(async()=>{
  while(getStudyMode()==='bela'){
   const next=read()[0];if(!next)return;
   const response=await fetch('/api/attempts',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(next)});
   if(!response.ok)throw new Error('As respostas aguardam sincronização.');
   studyStorage.setItem('pending-attempts',JSON.stringify(read().filter(a=>a.eventId!==next.eventId)));
  }
 })().finally(()=>{flushing=undefined;});return flushing;
}
export async function submitAttempt(payload:Record<string,unknown>){
 if(getStudyMode()!=='bela')return false;
 const event={...payload,eventId:crypto.randomUUID(),answeredAt:Date.now()};
 studyStorage.setItem('pending-attempts',JSON.stringify([...read(),event]));
 try{await flushAttempts();return true;}catch{return false;}
}
