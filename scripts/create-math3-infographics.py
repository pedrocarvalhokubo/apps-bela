from pathlib import Path
from html import escape
import math
INK='#283e5b';PURPLE='#927bd1';GREEN='#65bda5';ORANGE='#efb265'
def text(x,y,s,size=26,color=INK,weight=500):return f'<text x="{x}" y="{y}" fill="{color}" font-family="DejaVu Sans,sans-serif" font-size="{size}" font-weight="{weight}">{escape(s)}</text>'
def box(y,h,title,sub):return f'<rect x="48" y="{y}" width="928" height="{h}" rx="28" fill="white" stroke="#e3dced" stroke-width="2"/>'+text(78,y+50,title,30,INK,800)+text(78,y+87,sub,21,'#637288')
def circle(x,y,d,n,r=68):
 out=''
 for i in range(d):
  a=i*2*math.pi/d-math.pi/2;b=(i+1)*2*math.pi/d-math.pi/2
  path=f'M{x} {y} L{x+r*math.cos(a)} {y+r*math.sin(a)} A{r} {r} 0 {int(b-a>math.pi)} 1 {x+r*math.cos(b)} {y+r*math.sin(b)}Z'
  out+=f'<path d="{path}" fill="{PURPLE if i<n else "#eee8f8"}" stroke="white" stroke-width="3"/>'
 return out
def grid(x,y,w,h,n,cell=24):return ''.join(f'<rect x="{x+c*cell}" y="{y+r*cell}" width="{cell}" height="{cell}" fill="{GREEN if r*w+c<n else "#f2f7f5"}" stroke="white" stroke-width="2"/>' for r in range(h) for c in range(w))
def base(title,subtitle,num):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1448" viewBox="0 0 1024 1448"><rect width="1024" height="1448" fill="#faf6ed"/>'+text(52,62,'BELA • MATH • TERM 3',19,'#776599',800)+text(52,123,title,45,INK,800)+text(52,165,subtitle,23,'#637288')+f'<g transform="translate(895,95)"><path d="M-34 -14 L-40 -44 L-13 -30 Q0 -35 13 -30 L40 -44 L34 -14 Q48 32 0 34 Q-48 32 -34 -14" fill="#edd2a6"/><circle cx="-14" cy="0" r="3" fill="{INK}"/><circle cx="14" cy="0" r="3" fill="{INK}"/><path d="M-4 12L0 16L4 12M0 16L0 22" stroke="{INK}" stroke-width="2" fill="none"/></g>'+text(52,1402,'Explore. Explain. Try again.',19,'#776599')+text(925,1402,str(num),20)
p=base('Fractions that make sense','Equal pieces • equal groups • equal values',1)
p+=box(210,330,'1. A fraction of a whole','The pieces must be equal. The circles below are the same size.')
for x,d,n,label in [(190,4,3,'3/4'),(490,6,4,'4/6'),(790,8,3,'3/8')]:p+=circle(x,400,d,n)+text(x-28,502,label,30,INK,800)
p+=box(568,235,'2. Numerator and denominator','In 3/4: 3 parts selected; 4 equal parts in ONE whole.')+text(85,705,'Numerator = parts selected',29,PURPLE,800)+text(85,755,'Denominator = all equal parts in one whole',27)
p+=box(831,225,'3. A fraction of a set','Divide by the denominator, then multiply by the numerator.')+text(85,975,'3/4 of 56 = 56 ÷ 4 × 3 = 42',35,INK,800)+text(85,1020,'4 equal groups of 14 → choose 3 groups.',24)
p+=box(1084,255,'4. Same value • mixed numbers','Change numerator AND denominator by the same factor.')+text(85,1220,'1/2 = 2/4 = 3/6',35,PURPLE,800)+text(85,1275,'2 1/3 = (2 × 3 + 1)/3 = 7/3',30)+text(85,1312,'Count all the thirds in the wholes, then add the extra third.',21)
Path('public/infographics/math3-1.svg').write_text(p+'</svg>')
p=base('Decimals, one cell at a time','Tenths • hundredths • aligned calculations',2)
p+=box(210,400,'1. A hundred chart','100 cells = one whole. Each cell = 1/100 = 0.01.')+grid(90,330,10,10,35,23)+text(390,375,'35/100 = 0.35',38,INK,800)+text(390,430,'1 full row = 10/100 = 0.1',25)+text(390,480,'5/100 = 0.05',29,PURPLE,800)+text(390,530,'1 6/100 = 1.06',29)+text(390,575,'1 60/100 = 1.60 = 1.6',27)
p+=box(638,245,'2. Compare by place value','Compare wholes, then tenths, then hundredths.')+text(85,777,'0.89 < 0.90        0.9 = 0.90',34,INK,800)+text(85,835,'3.04 = 3 4/100       1.9 = 1 9/10',29)
p+=box(911,255,'3. Line up the decimal points','Add zeros if needed. Regroup from right to left.')
for x,lines in [(150,['22.30','+ 34.10','56.40']),(590,['3.20','− 2.85','0.35'])]:
 for j,line in enumerate(lines):p+=text(x,1030+48*j,line,35,INK if j<2 else PURPLE,800)
 p+=f'<path d="M{x-15} 1092H{x+180}" stroke="{INK}" stroke-width="2"/>'
p+=box(1194,145,'4. Read the problem, then choose','Distance difference: 3.20 − 2.85 = 0.35 km.')+text(85,1310,'Temperature rise: 29.8 + 2.5 = 32.3°C.',25)
Path('public/infographics/math3-2.svg').write_text(p+'</svg>')
p=base('Around it or inside it?','Perimeter • area • build a house',3)
p+=box(210,365,'1. Two different measures','A rectangle: length 5 m, width 3 m.')+grid(100,345,5,3,15,42)+f'<rect x="100" y="345" width="210" height="126" rx="2" stroke="{PURPLE}" stroke-width="5" fill="none"/>'+text(170,325,'5 m',24)+text(320,420,'3 m',24)+text(410,360,'PERIMETER = outside',28,PURPLE,800)+text(410,407,'5 + 3 + 5 + 3 = 16 m',28)+text(410,468,'AREA = inside',28,GREEN,800)+text(410,515,'5 × 3 = 15 m²',32,INK,800)
p+=box(603,220,'2. Regular polygons: equal sides','One side = perimeter ÷ number of sides.')+text(85,744,'Square: 20 ÷ 4 = 5 cm',28)+text(85,787,'Pentagon: 25 ÷ 5 = 5 cm',28)
p+=box(851,180,'3. Count square units','A 4 × 3 grid covers 12 square units.')+text(85,991,'Area uses cm² or m². Perimeter uses cm or m.',27,INK,800)
p+=box(1059,280,'4. Design a house','Each 1 cm × 1 cm cell covers 1 cm².')
for i,(t,c) in enumerate([('1st bedroom: 8 cm²','#599ee8'),('2nd bedroom: 6 cm²','#c7a52e'),('Bathroom: 4 cm²','#d06476'),('Kitchen: 12 cm²','#409b7e'),('Living room: 16 cm²','#c8843c'),('Balcony: 2 cm²','#b67ab6')]):p+=text(85+(i%2)*440,1200+(i//2)*48,t,26,c,800)
Path('public/infographics/math3-3.svg').write_text(p+'</svg>')
