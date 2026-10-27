'use client';
import {getStudyMode} from './study-storage';
// Keep the latest saver when navigating between subjects and OBMEP.
const saves=new Map<string,()=>Promise<void>>();
export function registerPendingSave(key:string,save:()=>Promise<void>){saves.set(key,save);}
export function clearPendingSaves(){saves.clear();}
export async function flushPendingSaves(){if(getStudyMode()==='bela')for(const save of saves.values())await save();}
