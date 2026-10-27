import base64,gzip,hashlib,io,json,tarfile
from pathlib import Path
root=Path(__file__).resolve().parents[1];dest=root/'.asset-bundle';m=json.loads((dest/'manifest.json').read_text());buf=io.BytesIO()
with tarfile.open(fileobj=buf,mode='w') as tar:
 p=root/'public/sw.js';info=tar.gettarinfo(str(p),arcname='public/sw.js');info.uid=info.gid=info.mtime=0;info.uname=info.gname=''
 with p.open('rb') as f:tar.addfile(info,f)
data=gzip.compress(buf.getvalue(),mtime=0);name='auth-v2-000.part.b64';(dest/name).write_text(base64.b64encode(data).decode())
m['supplements']=[s for s in m.get('supplements',[]) if name not in s['parts']]+[dict(sha256=hashlib.sha256(data).hexdigest(),parts=[name])]
m['files']['public/sw.js']=hashlib.sha256((root/'public/sw.js').read_bytes()).hexdigest();(dest/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print('Packed account service worker; previous assets preserved.')
