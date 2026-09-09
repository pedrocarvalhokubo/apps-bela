// Lossless transport bundle: GitHub stores base64 chunks; builds restore original files.
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const manifest=JSON.parse(readFileSync('.asset-bundle/manifest.json','utf8'));
const hash=(b)=>createHash('sha256').update(b).digest('hex');
const complete=()=>Object.entries(manifest.files).every(([path,sha])=>existsSync(path)&&hash(readFileSync(path))===sha);
if (!complete()) {
  if (existsSync('public')) throw new Error('Public assets differ from the saved bundle. Run npm run assets:pack to preserve intentional edits before building.');
  const archive=Buffer.concat(manifest.parts.map(name=>Buffer.from(readFileSync(join('.asset-bundle',name),'utf8'),'base64')));
  if(hash(archive)!==manifest.sha256)throw new Error('Asset archive checksum mismatch');
  const dir=mkdtempSync(join(tmpdir(),'bela-assets-'));
  try {
    const file=join(dir,'public.tar.gz');writeFileSync(file,archive);
    execFileSync('tar',['-xzf',file,'--no-same-owner']);
    if(!complete())throw new Error('Extracted asset checksum mismatch');
  } finally {rmSync(dir,{recursive:true,force:true});}
}
console.log('Verified '+Object.keys(manifest.files).length+' study assets');
