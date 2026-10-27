'use client';
export type StudyMode='bela'|'guest';
let mode:StudyMode='guest';
export function setStudyMode(value:StudyMode){mode=value;}
export function getStudyMode(){return mode;}
export const studyStorage={
 getItem(key:string){try{return(mode==='bela'?localStorage:sessionStorage).getItem((mode==='bela'?'bela-account-v2:':'bela-guest-v2:')+key);}catch{return null;}},
 setItem(key:string,value:string){try{(mode==='bela'?localStorage:sessionStorage).setItem((mode==='bela'?'bela-account-v2:':'bela-guest-v2:')+key,value);}catch{}},
 removeItem(key:string){try{(mode==='bela'?localStorage:sessionStorage).removeItem((mode==='bela'?'bela-account-v2:':'bela-guest-v2:')+key);}catch{}},
};
export function clearAccountCache(){try{for(const key of Object.keys(localStorage))if(key.startsWith('bela-account-v2:'))localStorage.removeItem(key);sessionStorage.removeItem('bela-parent-token');}catch{}}
