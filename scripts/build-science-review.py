"""Build the authored, standalone Science worksheet and separate answer key."""
from pathlib import Path
import json
from html import escape
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT=Path(__file__).resolve().parents[1]
base=json.loads((ROOT/'app/science-content.json').read_text())
ext=json.loads((ROOT/'app/science-extension.json').read_text())
lessons=base['scienceSubject']['lessons']+ext['lessons']
OUT=ROOT/'public/science-term3/assessment'; OUT.mkdir(parents=True,exist_ok=True)
for name,file in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+file))
W,H=A4;M=44;INK=HexColor('#233d48');ACCENT=HexColor('#087f80')
def para(c,text,x,y,w,size=10.5,bold=False,color=INK):
    style=ParagraphStyle('p',fontName='Bold' if bold else 'Body',fontSize=size,leading=size*1.42,textColor=color)
    p=Paragraph(escape(text).replace('\n','<br/>'),style);_,h=p.wrap(w,H)
    assert y-h>40, f'Page overflow: {text[:60]}'
    p.drawOn(c,x,y-h);return y-h

def page(c,title,n,total,key=False):
    c.setFillColor(ACCENT);c.rect(0,H-15,W,15,fill=1,stroke=0)
    para(c,'SCIENCE  /  TERM 3',M,H-42,W-2*M,10,True,ACCENT)
    y=para(c,title,M,H-66,W-2*M,20,True)
    c.setStrokeColor(HexColor('#b8d7d5'));c.line(M,42,W-M,42)
    c.setFont('Body',8);c.setFillColor(INK);c.drawString(M,20,'Answer key • Compare after trying' if key else 'Write in English • Use your own words')
    c.setFont('Body',8);c.setFillColor(INK);c.drawRightString(W-M,20,f'{n} / {total}')
    return y-20

def lines(c,y,count=5):
    c.setStrokeColor(HexColor('#cad7dc'));c.setLineWidth(.5)
    for _ in range(count):c.line(M,y,W-M,y);y-=20
    return y

student=canvas.Canvas(str(OUT/'science-complete-review.pdf'),pagesize=A4)
student.setTitle('Science Term 3 — 20 written activities');student.setAuthor('Estudos da Bela')
for index,lesson in enumerate(lessons):
    y=page(student,lesson['title'],index+1,10)
    y=para(student,'Name: __________________________  Date: ______________',M,y,W-2*M,9)-18
    if lesson['id']=='s3-fossil-discovery':
        for fact in lesson['facts']:
            y=para(student,fact['text'].split('\n\n')[0],M,y,W-2*M,9.5)-10
        y=para(student,'Reading adapted for study. Source: UFSM / CAPPA, 14 Oct 2024.',M,y,W-2*M,8)-12
    elif lesson['id']=='s3-hurricane':
        y=para(student,lesson['intro'].split('\n\n')[0],M,y,W-2*M,9.5)-8
        image_w=270;image_h=180
        student.drawImage(str(ROOT/'public/science-term3/evidence/haiti-comparison.jpg'),M,y-image_h,width=image_w,height=image_h)
        para(student,'Haiti — Cavaillon River\nLeft: 26 Sep 2016\nRight: 12 Oct 2016\n\nNASA Earth Observatory / Jesse Allen. USGS Landsat data.\n\nObserve the land colour and the river mouth.',M+286,y,W-2*M-286,8.5)
        y-=image_h+12
        y=para(student,'Florida account: Storm waves removed sand from a dune near St. Augustine and opened a new inlet between the Atlantic Ocean and the Matanzas River. The USGS photographs compare 6 Sep 2014 with 13 Oct 2016. This is a different location from the Haiti satellite images.',M,y,W-2*M,9.5)-14
    else:
        y=para(student,'Explain, compare and give examples. You may draw and label a diagram.\nExplique, compare e dê exemplos. Você pode desenhar e identificar as partes.',M,y,W-2*M,10)-20
    tasks=[t for t in ext['practice'] if t['lesson']==lesson['id']]
    slot=(y-65)/2
    for j,task in enumerate(tasks):
        start=y-j*slot
        bottom=para(student,f"{index*2+j+1:02d}. {task['prompt']}",M,start,W-2*M,10.5,True)
        count=max(2,int((slot-(start-bottom)-25)/20))
        lines(student,bottom-24,count)
    student.showPage()
student.save()
key=canvas.Canvas(str(OUT/'science-complete-answer-key.pdf'),pagesize=A4)
key.setTitle('Science Term 3 — commented answer key');key.setAuthor('Estudos da Bela')
for pg in range(5):
    y=page(key,'Answer key • Gabarito',pg+1,5,True)
    y=para(key,'Accept other words that explain the same scientific ideas. Discuss evidence and reasoning with an adult. / Aceite outras palavras com a mesma ideia.',M,y,W-2*M,10)-20
    for i,task in enumerate(ext['practice'][pg*4:pg*4+4],pg*4+1):
        y=para(key,f'{i:02d}. '+next(l['title'] for l in lessons if l['id']==task['lesson']),M,y,W-2*M,11,True)-6
        y=para(key,task['prompt'],M,y,W-2*M,9)-8
        y=para(key,task['answer'],M,y,W-2*M,10)-24
    key.showPage()
key.save()
print('Created worksheet (10 pages) and answer key (5 pages).')
