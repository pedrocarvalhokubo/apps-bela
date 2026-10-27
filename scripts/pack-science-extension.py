"""Append the inspected Science extension without touching previous bundles."""
import base64,gzip,hashlib,io,json,tarfile
from pathlib import Path
root=Path(__file__).resolve().parents[1];dest=root/'.asset-bundle';mp=dest/'manifest.json';m=json.loads(mp.read_text())
paths=[root/'public/science-term3'/p for p in ['evidence/haiti-comparison.jpg','assessment/science-complete-review.pdf','assessment/science-complete-answer-key.pdf']]
buf=io.BytesIO()
with tarfile.open(fileobj=buf,mode='w') as tar:
 for p in paths:
  info=tar.gettarinfo(str(p),arcname=str(p.relative_to(root)));info.uid=info.gid=info.mtime=0;info.uname=info.gname='';info.mode=0o644
  with p.open('rb') as f:tar.addfile(info,f)
data=gzip.compress(buf.getvalue(),mtime=0);parts=[]
for i in range(0,len(data),180000):
 name=f'science-extension-{i//180000:03}.part.b64';(dest/name).write_text(base64.b64encode(data[i:i+180000]).decode());parts.append(name)
m['supplements']=[s for s in m.get('supplements',[]) if not any(p.startswith('science-extension-') for p in s['parts'])]+[dict(sha256=hashlib.sha256(data).hexdigest(),parts=parts)]
for p in paths:m['files'][str(p.relative_to(root))]=hashlib.sha256(p.read_bytes()).hexdigest()
mp.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print(f'Packed {len(paths)} new assets in {len(parts)} chunks; {len(m["files"])} assets in total.')
