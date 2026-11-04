#!/usr/bin/env python3
"""Check PDF/text parity, privacy, margins and deployment bytes. Requires PyMuPDF."""
import argparse,hashlib,json,re,unicodedata,urllib.request
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--base-url');args=parser.parse_args()
c2=json.loads((ROOT/'app/geography2-written.json').read_text());c3=json.loads((ROOT/'app/geography3-content.json').read_text())
normalize=lambda t:''.join(c for c in unicodedata.normalize('NFKC',t).casefold() if c.isalnum())
files={'prova-geografia.pdf':10,'gabarito-geografia-2.pdf':5,'quiz-geografia-3.pdf':5,'simulado-a-geografia-3.pdf':5,'simulado-b-geografia-3.pdf':5,'atividades-geografia-3.pdf':2,'gabaritos-geografia-3.pdf':15}
texts={};report=[]
for name,pages in files.items():
 raw=(ROOT/'public/materials'/name).read_bytes();doc=fitz.open(stream=raw,filetype='pdf')
 assert len(doc)==pages,(name,len(doc),pages)
 text='\n'.join(page.get_text() for page in doc);texts[name]=normalize(text)
 assert not re.search(r'Isabela|Maple.?Bear|Y4B|Year 4|21/08|06/11',text,re.I),name
 for n,page in enumerate(doc):
  assert not page.get_images(),(name,'unexpected image')
  for block in page.get_text('dict')['blocks']:
   for line in block.get('lines',[]):
    for span in line['spans']:
     x0,y0,x1,y1=span['bbox'];assert 40<=x0<x1<=page.rect.width-40 and 10<y0<y1<page.rect.height-10,(name,n,span)
 item=dict(file=name,pages=pages,sha256=hashlib.sha256(raw).hexdigest())
 if args.base_url:
  url=args.base_url.rstrip('/')+'/materials/'+name
  with urllib.request.urlopen(url,timeout=30) as response:
   remote=response.read();assert response.status==200;assert response.headers.get_content_type()=='application/pdf'
  assert remote==raw,(name,'production PDF differs from verified PDF')
  item.update(url=url,productionMatch=True)
 report.append(item)
for q in c2['questions']:
 for name in ['prova-geografia.pdf','gabarito-geografia-2.pdf']:assert normalize(q['prompt']) in texts[name],(name,q['id'])
 for row in q.get('rows',[]):assert normalize(row) in texts['prova-geografia.pdf']
 assert normalize(q['answer']) in texts['gabarito-geografia-2.pdf'],q['id']
 for ref in q['sourceRefs']:assert normalize(ref) in texts['gabarito-geografia-2.pdf']
for pool,name in [('quiz','quiz-geografia-3.pdf'),('mock-a','simulado-a-geografia-3.pdf'),('mock-b','simulado-b-geografia-3.pdf')]:
 for q in [q for q in c3['questions'] if q['pool']==pool]:
  assert normalize(q['prompt']) in texts[name],q['id']
  for option in q['options']:assert normalize(option['label']) in texts[name],q['id']
  correct=next(o for o in q['options'] if o['id']==q['correct'])
  for value in [q['prompt'],f"{q['correct'].upper()}. {correct['label']}",correct['explanation'],*q['sourceRefs']]:assert normalize(value) in texts['gabaritos-geografia-3.pdf'],q['id']
for task in c3['practice']:
 assert normalize(task['prompt']) in texts['atividades-geografia-3.pdf']
 assert normalize(task['prompt']) in texts['gabaritos-geografia-3.pdf']
 assert normalize(task['answer']) in texts['gabaritos-geografia-3.pdf']
print(json.dumps(dict(pdfs=report,totalPages=sum(files.values()),questionParity=True,answerParity=True,privacy=True,margins=True),ensure_ascii=False,indent=2))
