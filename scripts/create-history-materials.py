"""Create precise educational diagrams and printable materials from History content."""
import json
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit
from reportlab.lib.colors import HexColor
import fitz

root=Path(__file__).resolve().parents[1]
content=json.loads((root/'app/history3-content.json').read_text())
tmp=root/'tmp/history-qa';tmp.mkdir(parents=True,exist_ok=True)
(root/'public/infographics').mkdir(parents=True,exist_ok=True)
(root/'public/materials').mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('D','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DB','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
TEAL='#176A66'; INK='#203D43'; ORANGE='#D56439'; CREAM='#FBF6ED'; MINT='#E7F1E8'

def txt(c,text,x,y,width,size=12,bold=False,color=INK,leading=None):
    c.setFont('DB' if bold else 'D',size);c.setFillColor(HexColor(color))
    lines=simpleSplit(text,'DB' if bold else 'D',size,width)
    for line in lines:
        c.drawString(x,y,line);y-=leading or size*1.48
    return y

maps=[
 ('África: muitas histórias','DIVERSIDADE E ORIGENS',[
  ('CONTINENTE, NÃO PAÍS','A África reúne vários países, povos, línguas, religiões e modos de viver.'),
  ('CONHECIMENTOS E GOVERNOS','Agricultura, comércio, artes e reinos já existiam antes da chegada dos europeus. Congo e Mali são exemplos.'),
  ('BERÇO DA HUMANIDADE','Fósseis encontrados na África ajudam a estudar a origem e a evolução dos seres humanos.')],
  ['Muitos povos','Muitas culturas','Muitas histórias'],'Por que estudar só a escravidão deixaria essa história incompleta?'),
 ('Escravidão e liberdade','COMPARAR SEM GENERALIZAR',[
  ('SITUAÇÕES DIFERENTES','Em algumas sociedades, guerras ou dívidas podiam levar à escravização. As regras variavam no tempo e no espaço.'),
  ('CASA E COMUNIDADE','Pessoas podiam trabalhar em casas ou na agricultura. Em certos casos havia possibilidade de libertação.'),
  ('PROXIMIDADE NÃO É LIBERDADE','Mesmo perto de uma família, a pessoa escravizada não podia escolher livremente a própria vida. A situação era injusta.')],
  ['Guerras ou dívidas','Dominação','Falta de liberdade'],'Viver perto de uma família significava ser livre? Explique.'),
 ('Duas rotas, dois espaços','SAARA E OCEANO ATLÂNTICO',[
  ('TRANSAARIANA','Atravessava o deserto do Saara. Caravanas ligavam regiões africanas e transportavam sal, ouro e outros produtos.'),
  ('TRANSATLÂNTICA','Atravessava o oceano Atlântico. Navios levavam africanos à força para as Américas, incluindo o Brasil.'),
  ('VIOLÊNCIA NAS ROTAS','Também houve comércio de pessoas escravizadas. Seres humanos foram tratados como mercadoria.')],
  ['Saara: caravanas','Atlântico: navios','Espaços diferentes'],'Compare por onde passava cada rota e qual transporte era usado.'),
 ('Colonização e independências','ORGANIZE NO TEMPO',[
  ('1. SOCIEDADES ORGANIZADAS','Povos africanos já tinham conhecimentos, técnicas, culturas e governos antes da colonização europeia.'),
  ('2. DOMÍNIO COLONIAL','Potências europeias dominaram e dividiram territórios conforme seus interesses, desrespeitando identidades locais.'),
  ('3. INDEPENDÊNCIAS','O material destaca os processos após a Segunda Guerra Mundial. Independência é deixar o domínio político colonial.')],
  ['Sociedades','Colonização','Independências'],'Por que a história da África não começa com a chegada dos europeus?'),
 ('Cultura afro-brasileira','CRIAÇÕES E RESISTÊNCIA',[
  ('ALIMENTAÇÃO, MÚSICA E MOVIMENTO','Acarajé, berimbau, capoeira, jongo, maracatu e samba de roda são exemplos apresentados nas atividades.'),
  ('MEMÓRIAS, SABERES E CRENÇAS','História oral, literatura, conhecimentos, orixás e povos de terreiro também fazem parte dessa cultura.'),
  ('RESISTÊNCIA À ESCRAVIDÃO','Quilombos e Zumbi dos Palmares são referências de luta contra a dominação e a falta de liberdade.')],
  ['Criar','Preservar','Resistir'],'Escolha duas manifestações e explique o que cada uma representa.'),
 ('Diáspora e formação do Brasil','CONTRIBUIÇÕES E DIREITOS',[
  ('DIÁSPORA FORÇADA','Diáspora é o deslocamento de um povo para diferentes regiões. No tráfico, pessoas foram retiradas contra a própria vontade.'),
  ('ESTIMATIVAS DO MATERIAL','Entre os séculos XVI e XIX: cerca de 12 milhões de pessoas transportadas; aproximadamente 40% destinadas ao Brasil.'),
  ('PARTICIPAÇÃO E RECONHECIMENTO','Africanos e descendentes trabalharam, formaram famílias, resistiram e criaram culturas. Suas contribuições não apagam a violência.')],
  ['Reconhecer','Lembrar a violência','Combater o racismo'],'Por que devemos estudar contribuições culturais e violência da escravidão?'),
]

for i,(title,eyebrow,cards,labels,prompt) in enumerate(maps,1):
    pdf=tmp/f'map-{i}.pdf';c=canvas.Canvas(str(pdf),pagesize=(1024,1536))
    c.setFillColor(HexColor(CREAM));c.rect(0,0,1024,1536,fill=1,stroke=0)
    txt(c,'HISTÓRIA  /  III TRIMESTRE',64,1460,890,23,True,TEAL)
    y=txt(c,title,64,1385,890,48,True,TEAL,60)
    txt(c,eyebrow,66,y-18,890,23,True,ORANGE)
    for j,(heading,body) in enumerate(cards):
        top=1180-j*247
        c.setFillColor(HexColor('#FFFFFF'));c.roundRect(56,top-215,912,225,24,fill=1,stroke=0)
        c.setFillColor(HexColor(ORANGE));c.circle(96,top-35,19,fill=1,stroke=0)
        txt(c,str(j+1),88,top-43,30,21,True,'#FFFFFF')
        txt(c,heading,132,top-42,795,24,True,TEAL)
        bottom=txt(c,body,86,top-94,850,29,False,INK,41)
        assert bottom >= top-220,(i,j,bottom,top)
    # A compact connected strip emphasizes the main relationship.
    for j,label in enumerate(labels):
        x=56+j*309
        c.setFillColor(HexColor(MINT));c.roundRect(x,338,294,92,16,fill=1,stroke=0)
        txt(c,label,x+18,390,258,22,True,TEAL,29)
        if j<2 and i==4: txt(c,'→',x+291,370,22,22,True,ORANGE)
    txt(c,'EXPLIQUE COM SUAS PALAVRAS',64,280,890,23,True,ORANGE)
    txt(c,prompt,64,230,890,29,False,INK,41)
    txt(c,'Revisão baseada nas atividades de estudo enviadas • '+str(i)+'/6',64,55,900,17,False,TEAL)
    c.save()
    doc=fitz.open(pdf);doc[0].get_pixmap().save(root/f'public/infographics/history3-{i}.png')

# Open questions complement the multiple-choice exercises in the app.
exams={
 'a':[
 ('Explique por que a África é um continente e dê dois exemplos de sua diversidade.','A África reúne vários países. Exemplos: diferentes línguas, religiões, culturas e formas de organização.'),
 ('Por que estudar a África apenas pela escravidão esconderia parte de sua história? Cite dois conhecimentos ou atividades.','Já havia agricultura, comércio, artes, técnicas e governos. A escravidão é parte dessa história, não toda ela.'),
 ('O que significa berço da humanidade? Que descoberta ajuda a estudar esse passado?','A expressão se refere à origem dos primeiros seres humanos. Fósseis ajudam a estudar a origem e a evolução humana.'),
 ('Cite duas situações que podiam levar à escravização em algumas sociedades africanas. As regras eram iguais em todo lugar?','Guerras e dívidas são exemplos. Não: as regras variavam conforme a sociedade e a época.'),
 ('Uma pessoa escravizada vivia perto da família que a dominava. Isso significava que era livre? Justifique.','Não. A proximidade não garantia o direito de escolher sua vida. Estar integrada não apagava a falta de liberdade.'),
 ('Compare as rotas: qual espaço era atravessado e que transporte era usado em cada uma?','Transaariana: Saara, caravanas. Transatlântica: oceano Atlântico, navios.'),
 ('Corrija a frase: Nas duas rotas circulavam apenas produtos, nunca pessoas.','Também havia comércio e deslocamento de pessoas escravizadas. No Atlântico, milhões foram levados à força para as Américas.'),
 ('Numere de 1 a 3: (  ) independências; (  ) sociedades africanas já organizadas; (  ) colonização europeia.','Na ordem em que aparecem: 3, 1, 2. Primeiro sociedades organizadas, depois colonização e então independências.'),
 ('Cite uma consequência de dividir territórios sem respeitar as identidades dos povos locais.','Pode separar ou agrupar povos sem respeitar sua organização e contribuir para conflitos. Aceitar explicação coerente.'),
 ('Escolha duas manifestações afro-brasileiras e explique a relação de cada uma com a cultura.','Exemplos: acarajé e alimentação/tradição; capoeira e movimento/música; samba de roda e música/dança; história oral e memória.'),
 ('O que é diáspora? Por que a diáspora africana estudada é chamada de forçada?','É o deslocamento de um povo para diferentes regiões. Foi forçada porque pessoas foram retiradas contra a própria vontade.'),
 ('Por que reconhecer contribuições africanas também exige lembrar a violência da escravidão e combater o racismo?','Valorizar a cultura não apaga a violência. As duas dimensões ajudam a compreender a formação do Brasil, reconhecer direitos e enfrentar o racismo.')],
 'b':[
 ('Um colega disse: Toda a África tem a mesma língua e a mesma cultura. Como você explicaria o erro?','A África é diversa: reúne muitos países, povos, línguas, religiões e culturas. Não existe uma única cultura africana igual em todo lugar.'),
 ('Os reinos do Congo e do Mali mostram que os povos africanos só se organizaram depois da chegada europeia? Explique.','Não. São exemplos de formas de organização e governos já existentes na história africana antes do domínio europeu.'),
 ('Imagine que um pesquisador encontrou um fóssil humano antigo. Como isso pode ajudar a conhecer o passado?','É uma evidência material para estudar seres humanos antigos e a evolução humana. Não é necessário repetir uma frase exata.'),
 ('Explique uma diferença entre escravidão doméstica e comércio de pessoas escravizadas para outras regiões.','A doméstica se ligava à casa/comunidade de quem dominava. No comércio para outras regiões, pessoas eram vendidas e deslocadas. Ambas retiravam liberdade.'),
 ('Corrija: Como existia possibilidade de libertação em alguns casos, a escravidão era justa.','A possibilidade futura não significava liberdade no presente. A escravidão retirava o direito de escolher a própria vida e não era justa.'),
 ('Complete: a rota transaariana cruzava o __________ em __________; a transatlântica cruzava o __________ em __________.','Saara; caravanas; oceano Atlântico; navios. Aceitar deserto do Saara no primeiro espaço.'),
 ('Explique por que a travessia atlântica estudada não era uma viagem de turismo ou uma migração escolhida.','Pessoas foram retiradas de suas terras e transportadas contra a própria vontade, em condições desumanas, para exploração do trabalho.'),
 ('O que significa independência? Que período o material destaca para os processos africanos?','Deixar o domínio político colonial. O material destaca o período após a Segunda Guerra Mundial.'),
 ('Relacione e explique: quilombos, Zumbi dos Palmares e resistência.','Quilombos foram espaços de resistência à escravidão. Zumbi dos Palmares é uma referência dessa luta contra a dominação.'),
 ('A cultura afro-brasileira se resume à comida? Cite exemplos de duas outras áreas.','Não. Exemplos: música (berimbau, samba), movimento (capoeira), memória (história oral), literatura, conhecimentos e religião.'),
 ('O texto estima cerca de 12 milhões de pessoas transportadas e aproximadamente 40% destinadas ao Brasil. O que esses dados ajudam a compreender?','A enorme dimensão do deslocamento forçado e a grande participação do Brasil como destino. São estimativas aproximadas, não contagens exatas.'),
 ('Como africanos e seus descendentes participaram da formação do Brasil? Inclua contribuição cultural e resistência em sua resposta.','Trabalharam, formaram famílias, criaram e preservaram conhecimentos e culturas, resistiram à escravidão e lutaram por direitos. Aceitar exemplos coerentes.')]
}

def page(c,title,sub,n,total):
    c.setFillColor(HexColor(CREAM));c.rect(0,0,595.28,841.89,fill=1,stroke=0)
    txt(c,'HISTÓRIA • III TRIMESTRE',42,797,510,10,True,TEAL)
    y=txt(c,title,42,758,510,23,True,TEAL,30)
    txt(c,sub,42,y-8,510,10,False,INK)
    c.setStrokeColor(HexColor('#C8D8D3'));c.line(42,50,553,50)
    txt(c,f'Material de revisão • {n}/{total}',42,31,510,9,False,TEAL)

for tag,items in exams.items():
    target=root/f'public/materials/historia3-simulado-{tag}.pdf'
    c=canvas.Canvas(str(target),pagesize=(595.28,841.89))
    for p in range(4):
        page(c,'Simulado '+tag.upper(),'Responda com suas palavras. Este é um treino, não a prova da escola.',p+1,4)
        txt(c,'Nome: ____________________________  Data: ____/____/______',42,674,510,10)
        for j,(prompt,answer) in enumerate(items[p*3:p*3+3]):
            top=630-j*176
            y=txt(c,f'{p*3+j+1:02}. '+prompt,42,top,510,12,True,INK,18)
            assert y>top-87
            c.setStrokeColor(HexColor('#AFC2BE'))
            for line in range(3):c.line(42,y-16-line*22,553,y-16-line*22)
        c.showPage()
    c.save()

c=canvas.Canvas(str(root/'public/materials/historia3-gabarito.pdf'),pagesize=(595.28,841.89))
for p in range(6):
    tag='a' if p<3 else 'b';offset=(p%3)*4
    page(c,'Gabarito explicado • '+tag.upper(),'Para o responsável: avalie a ideia, sem exigir palavras idênticas.',p+1,6)
    y=661
    for j,(prompt,answer) in enumerate(exams[tag][offset:offset+4]):
        y=txt(c,f'{offset+j+1:02}. '+prompt,42,y,510,11,True,TEAL,16)-8
        y=txt(c,answer,42,y,510,11,False,INK,17)-26
    assert y>60,(p,y)
    c.showPage()
c.save()

c=canvas.Canvas(str(root/'public/materials/historia3-guia.pdf'),pagesize=(595.28,841.89))
for i,l in enumerate(content['historySubject']['lessons']):
    page(c,l['title'],l['subtitle'],i+1,7)
    y=txt(c,l['intro'],42,659,510,12,False,INK,19)-24
    for f in l['facts']:
        y=txt(c,f['term'].upper(),42,y,510,10,True,TEAL,15)-5
        y=txt(c,f['text'],42,y,510,12,False,INK,19)-18
    y=txt(c,'PARA LEMBRAR',42,y,510,10,True,ORANGE)-8
    y=txt(c,l['remember'],42,y,510,12,True,INK,19)-24
    y=txt(c,'EXPLIQUE COM SUAS PALAVRAS',42,y,510,10,True,ORANGE)-8
    y=txt(c,content['historyDeepStudyByLesson'][l['id']]['challenge'],42,y,510,12,False,INK,19)
    assert y>60,(i,y)
    c.showPage()
c.save()

for d in content['historyDownloads']:
    d['pages']=len(fitz.open(root/('public'+d['src'])))
(root/'app/history3-content.json').write_text(json.dumps(content,ensure_ascii=False,indent=2)+'\n')
# Render every PDF page for QA; these images are not application content.
for path in sorted((root/'public/materials').glob('historia3-*.pdf')):
    doc=fitz.open(path)
    for i,p in enumerate(doc):p.get_pixmap(matrix=fitz.Matrix(1,1)).save(tmp/f'{path.stem}-{i+1}.png')
print('Created six infographic PNGs and four PDFs; all pages rendered for visual QA.')
