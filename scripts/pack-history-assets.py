"""Append the bounded History bundle without repacking existing study assets."""
import base64, gzip, hashlib, io, json, tarfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
manifest_path=root/'.asset-bundle/manifest.json'
manifest=json.loads(manifest_path.read_text())
content=json.loads((root/'app/history3-content.json').read_text())
paths=[root/('public'+r['src']) for r in content['historyInfographicPages']+content['historyDownloads']]
raw=io.BytesIO()
with tarfile.open(fileobj=raw,mode='w') as tar:
    for path in sorted(paths):
        info=tar.gettarinfo(str(path),arcname=str(path.relative_to(root)))
        info.uid=info.gid=info.mtime=0;info.uname=info.gname='';info.mode=0o644
        with path.open('rb') as f:tar.addfile(info,f)
archive=gzip.compress(raw.getvalue(),mtime=0)
parts=[]
for i in range(0,len(archive),60000):
    name=f'history3-{i//60000:03}.part.b64'
    (root/'.asset-bundle'/name).write_text(base64.b64encode(archive[i:i+60000]).decode())
    parts.append(name)
manifest['supplements']=[dict(sha256=hashlib.sha256(archive).hexdigest(),parts=parts)]
for p in paths:manifest['files'][str(p.relative_to(root))]=hashlib.sha256(p.read_bytes()).hexdigest()
manifest_path.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
print(f'Packed {len(paths)} History assets into {len(parts)} small chunks; existing chunks preserved.')
