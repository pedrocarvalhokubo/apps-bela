import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, mkdtempSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const hash=(b)=>createHash('sha256').update(b).digest('hex');
const files={};
function walk(path){
  for(const e of readdirSync(path,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
    const p=join(path,e.name);
    if(e.isSymbolicLink())throw new Error('Public assets cannot contain symlinks');
    if(e.isDirectory())walk(p);else files[p]=hash(readFileSync(p));
  }
}
walk('public');
const tmp=mkdtempSync(join(tmpdir(),'bela-pack-'));
try{
  const archive=join(tmp,'public.tar.gz');
  execFileSync('python3',['scripts/pack-assets.py',archive]);
  const bytes=readFileSync(archive), parts=[];
  mkdirSync('.asset-bundle',{recursive:true});
  for(const f of readdirSync('.asset-bundle'))if(/^public-\d+\.part\.b64$/.test(f))rmSync(join('.asset-bundle',f));
  for(let offset=0,i=0;offset<bytes.length;offset+=600000,i++){
    const name=`public-${String(i).padStart(3,'0')}.part.b64`;
    writeFileSync(join('.asset-bundle',name),bytes.subarray(offset,offset+600000).toString('base64'));parts.push(name);
  }
  writeFileSync('.asset-bundle/manifest.json',JSON.stringify({sha256:hash(bytes),parts,files},null,2)+'\n');
  console.log(`Packed ${Object.keys(files).length} public assets. Commit the updated .asset-bundle files.`);
}finally{rmSync(tmp,{recursive:true,force:true});}
