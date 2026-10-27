import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync(new URL('../lib/study-storage.ts',import.meta.url),'utf8');
const storage=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const fake=()=>{const values={};return new Proxy({getItem:k=>values[k]??null,setItem:(k,v)=>{values[k]=v},removeItem:k=>{delete values[k]}},{ownKeys:()=>Object.keys(values),getOwnPropertyDescriptor:()=>({enumerable:true,configurable:true})});};
test('guest session and account caches stay separate; logout preserves original migration source',()=>{
 globalThis.localStorage=fake();globalThis.sessionStorage=fake();
 localStorage.setItem('bela-study-progress','original history');
 storage.setStudyMode('bela');storage.studyStorage.setItem('bela-study-progress','account history');
 storage.setStudyMode('guest');assert.equal(storage.studyStorage.getItem('bela-study-progress'),null);storage.studyStorage.setItem('bela-study-progress','guest practice');
 storage.setStudyMode('bela');assert.equal(storage.studyStorage.getItem('bela-study-progress'),'account history');
 sessionStorage.setItem('bela-parent-token','parent');storage.clearAccountCache();
 assert.equal(storage.studyStorage.getItem('bela-study-progress'),null);assert.equal(sessionStorage.getItem('bela-parent-token'),null);assert.equal(localStorage.getItem('bela-study-progress'),'original history');
 storage.setStudyMode('guest');assert.equal(storage.studyStorage.getItem('bela-study-progress'),'guest practice');
});
