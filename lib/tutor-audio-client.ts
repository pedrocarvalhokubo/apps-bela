export type Recording={finish:()=>void;cancel:()=>void};
export function audioContext(){
 const Constructor=window.AudioContext||(window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
 return Constructor?new Constructor():null;
}
export async function recordQuestion(onDone:(audio:string,mime:string)=>void,onError:(message:string)=>void):Promise<Recording>{
 if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined')throw new Error('Este navegador não permite gravar. Use o Safari ou Chrome atualizado, ou escreva a pergunta.');
 const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
 const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(m=>MediaRecorder.isTypeSupported(m));
 if(!mime){stream.getTracks().forEach(t=>t.stop());throw new Error('Formato de áudio não disponível. Escreva a pergunta.');}
 let recorder:MediaRecorder;
 try{recorder=new MediaRecorder(stream,{mimeType:mime,audioBitsPerSecond:64000});}catch(error){stream.getTracks().forEach(t=>t.stop());throw error;}
 let cancelled=false,finished=false,total=0,heard=false,lastVoice=Date.now(),started=Date.now();
 const chunks:BlobPart[]=[],context=audioContext(),analyser=context?.createAnalyser();
 if(context&&analyser){void context.resume();analyser.fftSize=1024;context.createMediaStreamSource(stream).connect(analyser);}
 const samples=new Float32Array(1024);
 const cleanup=()=>{clearInterval(timer);stream.getTracks().forEach(t=>t.stop());void context?.close();};
 const finish=()=>{if(finished)return;finished=true;if(recorder.state!=='inactive')recorder.stop();cleanup();};
 const timer=setInterval(()=>{
  const now=Date.now();
  if(analyser){analyser.getFloatTimeDomainData(samples);const rms=Math.sqrt(samples.reduce((n,v)=>n+v*v,0)/samples.length);if(rms>.017){heard=true;lastVoice=now;}}
  if((heard&&now-lastVoice>1500&&now-started>1800)||now-started>45000)finish();
  if(!heard&&now-started>25000){cancelled=true;finish();onError('Não ouvi uma pergunta. Toque no microfone para tentar de novo.');}
 },100);
 recorder.ondataavailable=e=>{if(e.data.size){chunks.push(e.data);total+=e.data.size;if(total>3_000_000)finish();}};
 recorder.onerror=()=>{cancelled=true;finish();onError('A gravação foi interrompida. Tente de novo ou escreva.');};
 recorder.onstop=async()=>{if(cancelled)return;const blob=new Blob(chunks,{type:mime});if(blob.size<100)return onError('A gravação ficou vazia. Tente de novo.');try{const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));if(!cancelled)onDone(btoa(binary),mime.split(';')[0]);}catch{onError('Não foi possível preparar o áudio.');}};
 recorder.start(250);
 return {finish,cancel:()=>{cancelled=true;finish();}};
}
