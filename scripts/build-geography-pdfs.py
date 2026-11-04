#!/usr/bin/env python3
"""Build only Geography assessments from the reviewed question banks.

Requires reportlab. No school photos, student records or credentials are read.
Run from the repository root, then scripts/pack-geography-assessments.py.
"""
import json
from functools import partial
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Flowable

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/materials'
OUT.mkdir(parents=True, exist_ok=True)
FONTS = Path('/usr/share/fonts/truetype/dejavu')
for name, file in [('Bela','DejaVuSans.ttf'),('BelaBold','DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS/file)))
pdfmetrics.registerFontFamily('Bela', normal='Bela', bold='BelaBold')
INK, TEAL, MUTED = colors.HexColor('#21364a'), colors.HexColor('#216d76'), colors.HexColor('#526773')
STYLES = {
 'h1': ParagraphStyle('h1',fontName='BelaBold',fontSize=21,leading=27,textColor=INK,spaceAfter=10),
 'h2': ParagraphStyle('h2',fontName='BelaBold',fontSize=15,leading=20,textColor=TEAL,spaceBefore=8,spaceAfter=10),
 'q': ParagraphStyle('q',fontName='BelaBold',fontSize=11.5,leading=17,textColor=INK,spaceAfter=9),
 'body': ParagraphStyle('body',fontName='Bela',fontSize=11,leading=16,textColor=INK,spaceAfter=7),
 'option': ParagraphStyle('option',fontName='Bela',fontSize=10.5,leading=15,textColor=INK,leftIndent=14,spaceAfter=5),
 'small': ParagraphStyle('small',fontName='Bela',fontSize=8.5,leading=12,textColor=MUTED,spaceAfter=8),
 'cell': ParagraphStyle('cell',fontName='Bela',fontSize=10,leading=14,textColor=INK),
}
WIDTH=A4[0]-96

def p(text, style='body'):
    return Paragraph(escape(str(text)),STYLES[style])

class Lines(Flowable):
    def __init__(self,count):super().__init__();self.width=WIDTH;self.height=count*23;self.count=count
    def draw(self):
        self.canv.setStrokeColor(colors.HexColor('#b9cdd3'));self.canv.setLineWidth(.5)
        for i in range(self.count):self.canv.line(0,self.height-23*(i+1),self.width,self.height-23*(i+1))

def build(name,title,term,story):
    def chrome(canvas,doc):
        canvas.saveState();canvas.setFillColor(TEAL);canvas.setFont('BelaBold',9)
        canvas.drawString(48,A4[1]-30,f'GEOGRAFIA • {term} TRIMESTRE')
        canvas.setStrokeColor(colors.HexColor('#b9cdd3'));canvas.line(48,42,A4[0]-48,42)
        canvas.setFillColor(MUTED);canvas.setFont('Bela',8)
        canvas.drawString(48,28,'Prática baseada no material escolar • revisão de conteúdo 04/11/2026')
        canvas.drawRightString(A4[0]-48,28,f'Página {doc.page}');canvas.restoreState()
    doc=SimpleDocTemplate(str(OUT/name),pagesize=A4,leftMargin=48,rightMargin=48,topMargin=55,bottomMargin=58,title=title,author='Bela',allowSplitting=1)
    doc.build(story,onFirstPage=chrome,onLaterPages=chrome,canvasmaker=partial(Canvas,invariant=1))

def header(title,extra='Responda com as informações das atividades da escola.'):
    return [p(title,'h1'),p(extra),Spacer(1,10)]

def ref_list(sources):
    story=[PageBreak(),p('Referências das respostas','h1'),p('Os códigos identificam páginas das fontes escolares. As fotos originais continuam privadas; nenhuma imagem ou resposta pessoal da estudante está neste PDF.','small')]
    for i,s in enumerate(sources):
        if len(sources)>10 and i==8:story += [PageBreak(),p('Referências das respostas • continuação','h1')]
        story.append(KeepTogether([p(f"{s['id']} — {s['title']}",'q'),p(f"Foto {s['photo']}. {s['section']}",'small')]))
    return story

c2=json.loads((ROOT/'app/geography2-written.json').read_text())
s2=json.loads((ROOT/'app/geography2-sources.json').read_text())['sources']
c3=json.loads((ROOT/'app/geography3-content.json').read_text())
s3=json.loads((ROOT/'app/geography3-sources.json').read_text())['sources']

# Historical II-term assessment: preserve numbering, 20 questions and ten pages.
story=[]
for idx,q in enumerate(c2['questions']):
    if idx%2==0:
        if idx:story.append(PageBreak())
        story+=header('Atividade escrita • II trimestre' if idx==0 else q['topic'])
    items=[p(f"{q['id']}. {q['prompt']}",'q')]
    if q.get('rows'):
        if q['id']==8:
            rows=[[p(c,'cell') for c in q['columns']]]+[[p(f'{i}. __________________','cell'),p(f'{i}. __________________','cell')] for i in range(1,4)]
            widths=[WIDTH/2]*2
        else:
            rows=[[p(c,'cell') for c in q['columns']]]+[[p(row,'cell'),p('___________','cell')] for row in q['rows']]
            widths=[WIDTH*.71,WIDTH*.29]
        table=Table(rows,colWidths=widths,hAlign='LEFT')
        table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e1f1ef')),('GRID',(0,0),(-1,-1),.4,colors.HexColor('#b9cdd3')),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
        items.append(table)
    if q['lines']:items += [Spacer(1,5),Lines(q['lines'])]
    items.append(Spacer(1,24))
    story.append(KeepTogether(items))
build('prova-geografia.pdf','Geografia • II trimestre • Atividade escrita','II',story)
story=header('Gabarito • II trimestre','Orientações da atividade escrita. Aceite outras palavras que expressem a mesma ideia apoiada nas fontes. Não exija etapas ou exemplos que não foram ensinados.')
for q in c2['questions']:
    story.append(KeepTogether([p(f"{q['id']}. {q['prompt']}",'q'),p(q['answer']),p('Fontes: '+', '.join(q['sourceRefs'])+'.','small'),Spacer(1,9)]))
story+=ref_list(s2)
build('gabarito-geografia-2.pdf','Geografia • II trimestre • Gabarito','II',story)

pools=[('quiz','Quiz de revisão','quiz-geografia-3.pdf'),('mock-a','Simulado A','simulado-a-geografia-3.pdf'),('mock-b','Simulado B','simulado-b-geografia-3.pdf')]
for pool,title,name in pools:
    story=[]
    for i,q in enumerate([q for q in c3['questions'] if q['pool']==pool],1):
        if (i-1)%4==0:
            if i>1:story.append(PageBreak())
            story+=header(title+' • III trimestre')
        story.append(KeepTogether([p(f"{i}. {q['prompt']}",'q')]+[p(f"{o['id']}) {o['label']}",'option') for o in q['options']]+[Spacer(1,14)]))
    build(name,'Geografia • III trimestre • '+title,'III',story)
story=[]
for i,t in enumerate(c3['practice']):
    if i%2==0:
        if i:story.append(PageBreak())
        story+=header('Respostas escritas • III trimestre')
    story.append(KeepTogether([p(f"{i+1}. {t['prompt']}",'q'),Lines(7),Spacer(1,28)]))
build('atividades-geografia-3.pdf','Geografia • III trimestre • Respostas escritas','III',story)
story=header('Gabaritos • III trimestre','Confira depois de responder. O número entre parênteses identifica a questão no app; os códigos indicam suas fontes escolares.')
for pool,title,_ in pools:
    if pool!='quiz':story.append(PageBreak())
    story.append(p(title,'h2'))
    for i,q in enumerate([q for q in c3['questions'] if q['pool']==pool],1):
        correct=next(o for o in q['options'] if o['id']==q['correct'])
        story.append(KeepTogether([p(f"{i}. ({q['id']}) {q['prompt']}",'q'),p(f"{q['correct'].upper()}. {correct['label']}"),p(correct['explanation']),p('Fontes: '+', '.join(q['sourceRefs'])+'.','small'),Spacer(1,8)]))
story += [PageBreak(),p('Respostas escritas','h2')]
for i,t in enumerate(c3['practice'],1):
    story.append(KeepTogether([p(f"{i}. {t['prompt']}",'q'),p(t['answer']),p('Fontes: '+', '.join(t['sourceRefs'])+'.','small'),Spacer(1,10)]))
story+=ref_list(s3)
build('gabaritos-geografia-3.pdf','Geografia • III trimestre • Gabaritos','III',story)
print('Built 7 reviewed Geography PDFs')
