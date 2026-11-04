#!/usr/bin/env python3
"""Append the reviewed Geography PDFs; preserve every existing asset archive."""
import base64,gzip,hashlib,io,json,tarfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
names=['prova-geografia.pdf','gabarito-geografia-2.pdf','quiz-geografia-3.pdf','simulado-a-geografia-3.pdf','simulado-b-geografia-3.pdf','atividades-geografia-3.pdf','gabaritos-geografia-3.pdf']
manifest_path=ROOT/'.asset-bundle/manifest.json'
manifest=json.loads(manifest_path.read_text())
archive=io.BytesIO()
with tarfile.open(fileobj=archive,mode='w',format=tarfile.USTAR_FORMAT) as tar:
 for name in names:
  path='public/materials/'+name
  raw=(ROOT/path).read_bytes()
  info=tarfile.TarInfo(path);info.size=len(raw);info.mode=0o644;info.mtime=0
  tar.addfile(info,io.BytesIO(raw))
  manifest['files'][path]=hashlib.sha256(raw).hexdigest()
raw=gzip.compress(archive.getvalue(),mtime=0)
sha=hashlib.sha256(raw).hexdigest()
prefix='geography-review-20261104'
existing=[x for x in manifest.get('supplements',[]) if x.get('name')==prefix]
if existing and existing[0]['sha256']!=sha:
 raise SystemExit('A different Geography review archive already exists. Use a new revision name; never overwrite a published archive.')
if not existing:
 encoded=base64.b64encode(raw).decode()
 parts=[]
 for i,start in enumerate(range(0,len(encoded),48000),1):
  name=f'{prefix}-{i:03}.b64';(ROOT/'.asset-bundle'/name).write_text(encoded[start:start+48000]);parts.append(name)
 manifest.setdefault('supplements',[]).append(dict(name=prefix,sha256=sha,parts=parts))
 manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(f'Preserved existing bundles; Geography archive {sha}, {len(raw)} bytes')
