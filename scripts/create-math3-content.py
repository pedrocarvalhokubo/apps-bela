import json
from pathlib import Path
# All scope and examples come from the two batches supplied on 15 Nov 2026.
rows=[
('fractions','Fractions of a whole','Numerator, denominator and equal parts','🍕','purple',
 'A fraction represents equal parts of a whole. The denominator tells how many equal parts make one whole; the numerator tells how many of those parts are selected.',
 [('Equal parts','The pieces must have the same size. Four unequal pieces do not make fourths.'),('Numerator','In 3/4, 3 is the numerator: three parts are selected.'),('Denominator','In 3/4, 4 is the denominator: one whole is split into four equal parts.'),('Fraction names','1/2 = one half; 1/3 = one third; 1/4 = one fourth; 1/5 = one fifth; 1/6 = one sixth; 1/7 = one seventh; 1/8 = one eighth.'),('One whole','All the parts together make one whole: 4/4 = 1 and 6/6 = 1.')],
 'Denominator = equal parts in ONE whole. Numerator = parts selected.',
 ['For the same whole, a larger denominator means smaller pieces. One sixth is smaller than one fourth, because the whole was divided into more pieces.','Português: denominador indica em quantas partes iguais o inteiro foi dividido; numerador conta as partes escolhidas.'],
 [('🍕','Whole','inteiro'),('🔢','Numerator','numerador: partes escolhidas'),('🧩','Denominator','denominador: partes iguais em um inteiro')],
 'Divide one circle into 6 equal parts. Select 4: the fraction is 4/6.',
 'Draw a whole divided into 8 equal parts and shade 3. Label the numerator and denominator.',
 '3/8: numerator 3, denominator 8; exactly three of the eight equal parts are shaded.', ['M3-F1','M3-F2']),
('sets','Fraction of a set','Share equally, then choose groups','🧺','green',
 'To find a fraction of a set, divide the total into the number of equal groups shown by the denominator. Then take the number of groups shown by the numerator.',
 [('Divide first','1/5 of 20 marbles: 20 ÷ 5 = 4 marbles.'),('Multiply next','3/4 of 56 students: 56 ÷ 4 × 3 = 42 students.'),('One group','1/4 of 56 students = 14 students.'),('Equal sharing','24 cupcakes shared equally by 6 teachers: 24 ÷ 6 = 4 cupcakes each.'),('Do not mix up the total','When finding 1/5 of 20, the denominator is 5. The total number of objects is 20.')],
 'Total ÷ denominator × numerator. Keep the unit in your answer.',
 ['A set is a collection of objects. The denominator tells how many equal groups to form; it is not automatically the number of objects.','Português: primeiro divida pelo número de grupos; depois pegue a quantidade de grupos pedida.'],
 [('🧺','Set','coleção ou conjunto'),('➗','Share equally','dividir em grupos iguais'),('✖️','Of','de: encontrar a parte da quantidade')],
 '3/4 of 56: four groups of 14; select three groups, so 14 + 14 + 14 = 42.',
 'There are 24 counters. Find 1/6 and 5/6 of the set. Show the equal groups.',
 '24 ÷ 6 = 4; 1/6 is 4 counters and 5/6 is 4 × 5 = 20 counters.', ['M3-F2','M3-F3']),
('equivalence','Equivalent fractions and mixed numbers','Same value, different parts','⚖️','orange',
 'Equivalent fractions represent the same amount of the same whole. A mixed number combines a whole-number part and a fraction.',
 [('Equivalent fractions','Multiply or divide BOTH numerator and denominator by the same nonzero number: 2/5 = 4/10; 12/24 = 6/12.'),('Proper fraction','The numerator is smaller than the denominator: 2/5 is less than one.'),('Improper fraction','The numerator is at least the denominator. 7/3 is greater than one; 3/3 is exactly one.'),('Mixed to improper','Whole × denominator + numerator gives the new numerator. Keep the denominator: 2 1/3 = 7/3.'),('Improper to mixed','Divide numerator by denominator: 7 ÷ 3 = 2 remainder 1, so 7/3 = 2 1/3.')],
 'Equal value needs the SAME whole. Change numerator and denominator together.',
 ['Examples in the school material: 1 2/6 = 8/6; 2 2/3 = 8/3; 2 5/6 = 17/6; 1 3/8 = 11/8. Count all selected parts across the wholes.','Português: número misto tem inteiro e fração. Para transformar, conte quantas partes cabem nos inteiros e acrescente as restantes.'],
 [('⚖️','Equivalent','equivalente: mesmo valor'),('🍕','Improper fraction','fração imprópria'),('🧩','Mixed number','número misto')],
 '2 5/6: two wholes contain 12 sixths; add 5 sixths: 17/6.',
 'Show that 1/2 = 3/6. Then convert 2 1/3 to an improper fraction.',
 '1 × 3 / (2 × 3) = 3/6. The same half is selected. 2 1/3 = (2 × 3 + 1)/3 = 7/3.', ['M3-F3','M3-F4']),
('decimals','Tenths and hundredths','Fractions, grids and decimal numbers','💯','blue',
 'A decimal point separates the whole-number part from the decimal part. The first place after the point is tenths; the second is hundredths.',
 [('Reading','1.2 = one and two tenths. 71.82 = seventy-one and eighty-two hundredths. You can also read digits after “point”.'),('Tenths','7/10 = 0.7; 16/10 = 1 6/10 = 1.6.'),('Hundredths','35/100 = 0.35; 5/100 = 0.05. The zero in the tenths place matters.'),('More than one','1 6/100 = 1.06; 1 60/100 = 1.60; 2 82/100 = 2.82.'),('Back to fractions','1.9 = 1 9/10 = 19/10; 3.04 = 3 4/100; 1.23 = 1 23/100; 0.09 = 9/100.'),('Compare and order','Compare wholes, then tenths, then hundredths. 0.89 < 0.90. Increasing order: 0.09, 0.89, 0.9, 1.4, 1.45, 2.65, 4.09.')],
 '0.6 = 0.60, but 0.06 is different. One whole grid contains 100 hundredths.',
 ['Each square in a 10 × 10 chart is one hundredth; each complete row of ten squares is one tenth. Ten tenths and one hundred hundredths both make one whole.','The material uses both decimal points and decimal commas. In the games, 1.06 and 1,06 are accepted as the same value. Commas in the distance table, such as 1,960 km, separate thousands.'],
 [('🔟','Tenth','décimo: 1/10'),('💯','Hundredth','centésimo: 1/100'),('🔢','Whole part','parte inteira')],
 'Shade 47 of 100 cells: 47/100 = 0.47. Shade a whole grid and 6 more cells: 1.06.',
 'Write 0.8 and 0.09 as fractions. Put 1.4, 0.89 and 0.9 in increasing order.',
 '0.8 = 8/10; 0.09 = 9/100. Increasing order: 0.89 < 0.9 < 1.4.', ['M3-D1','M3-D2','M3-D3']),
('operations','Adding and subtracting decimals','Line up the decimal points','➕','purple',
 'Write the numbers in columns with decimal points directly under each other. Add or subtract from right to left, regrouping when needed.',
 [('Align','Ones under ones, tenths under tenths, hundredths under hundredths.'),('Add zeros','3.2 = 3.20. A final zero helps line up places without changing the value.'),('Addition','22.3 + 34.1 = 56.4.'),('Subtraction','76.3 − 34.1 = 42.2. For 3.20 − 2.85, regroup: the result is 0.35.'),('Keep the point','Write the answer’s decimal point directly under the points above.')],
 'Line up the POINTS, not the last digits. Check each column.',
 ['If a column adds to ten or more, carry to the next place. In subtraction, exchange one unit for ten tenths or one tenth for ten hundredths when needed.','Português: alinhe os separadores, complete com zeros e faça a conta da direita para a esquerda.'],
 [('📏','Align','alinhar'),('🔄','Regroup','reagrupar: vai um ou troca'),('➖','Difference','diferença: resultado da subtração')],
 '3.20 − 2.85: exchange one tenth for ten hundredths, then one unit for ten tenths. Result: 0.35.',
 'Set out and solve 22.3 + 34.1 and 3.2 − 2.85 in columns.',
 '22.30 + 34.10 = 56.40; 3.20 − 2.85 = 0.35.', ['M3-D4','M3-D5']),
('problems','Money, distance and temperature','Choose the operation and explain','🗺️','green',
 'Read what the question asks before choosing an operation. Keep money, distance and temperature units in the answer.',
 [('Money','Saved i$260; i$5 left means spending i$255. Check how many activities the question asks for.'),('School activity prices','Free play 25; movie 200; movie with popcorn 140; digital center 60; all centers 100; free clothing 150; buddy reading 30, all in i$.'),('Four activities','Free play + movie with popcorn + digital center + buddy reading: 25 + 140 + 60 + 30 = 255; 260 − 255 = 5.'),('Distance difference','Liam ran 3.2 km; Jack ran 2.85 km. “How much farther?” means subtract: 3.20 − 2.85 = 0.35 km.'),('Order a table','From Salvador: Belo Horizonte 1,370 km; Brasília 1,460; Rio de Janeiro 1,640; São Paulo 1,960; Curitiba 2,100, in increasing order.'),('Temperature rise','29.8°C rising by 2.5°C: 29.8 + 2.5 = 32.3°C.')],
 'Read → choose an operation → calculate → check the unit and the question.',
 ['“Left as change” asks how much remains after spending. “Farther than” compares two distances. “Rise by” tells how much to add.','Português: procure o que está sendo pedido; não escolha a operação só porque viu uma palavra. Confira o sentido da resposta no problema.'],
 [('💰','Change','troco'),('🏃','Farther','mais longe'),('🌡️','Rise by','aumentar em')],
 'A budget of 260 with 5 left allows a total cost of 255. Select exactly four activities and check both conditions.',
 'Find how much farther Liam ran than Jack and tomorrow’s temperature after a 2.5°C rise from 29.8°C.',
 'Liam ran 0.35 km farther. Tomorrow’s temperature is 32.3°C.', ['M3-D4','M3-D5','M3-D6']),
('perimeter','Perimeter','Walk around the outside','📏','orange',
 'Perimeter is the total distance around the outside of a flat shape. Add all the side lengths, using the same unit.',
 [('Rectangle','Opposite sides are equal. With length 5 m and width 3 m: 5 + 3 + 5 + 3 = 16 m.'),('Square','Four equal sides. A square with side 25 cm has perimeter 100 cm.'),('Regular polygons','All sides are equal. To find one side, divide the perimeter by the number of sides.'),('Find a side','Square: 20 ÷ 4 = 5 cm. Regular pentagon: 25 ÷ 5 = 5 cm. Regular hexagon: 60 ÷ 6 = 10 cm.'),('Compare units','500 m = 0.5 km. A square with 500 m sides has perimeter 2 km; a triangle with three 1 km sides has 3 km; a 1.2 km × 0.5 km rectangle has 3.4 km.'),('Missing information','Do not assume two triangle sides are equal just because they look equal. You need lengths, equality marks or a statement.')],
 'Perimeter = outside boundary. Use cm, m or km, without a square sign.',
 ['Perimeter can also be counted along the exposed edges of square cells. An edge shared by two cells is inside the shape, so do not count it.','Português: contorno é diferente de espaço por dentro. Em polígonos regulares, divida o contorno pelo número de lados para descobrir um lado.'],
 [('📏','Perimeter','perímetro: contorno'),('⬟','Regular','regular: todos os lados iguais'),('↔️','Length / width','comprimento / largura')],
 'A 30 cm × 20 cm rectangle: 30 + 20 + 30 + 20 = 100 cm.',
 'Find the perimeter of a 40 cm × 10 cm rectangle. A regular hexagon has perimeter 60 cm: find one side.',
 'Rectangle: 40 + 10 + 40 + 10 = 100 cm. Hexagon: 60 ÷ 6 = 10 cm.', ['M3-G1','M3-G2','M3-G3']),
('area','Area and a house on a grid','Count square units inside','🏠','blue',
 'Area measures the space inside a shape. Count the square units that cover it. For a rectangle or square, multiply length by width.',
 [('Square units','One 1 cm × 1 cm square has area 1 cm². Area units include cm² and m².'),('Rectangle','A 9 m × 6 m rectangle has area 9 × 6 = 54 m² and perimeter 30 m.'),('Square','A 5 × 5 square covers 25 square units.'),('Count cells','A 4 × 3 grid has 12 square units. A 5 × 6 grid has 30. A 3 × 3 grid has 9.'),('Draw a house','First bedroom: 8 cm² blue; second bedroom: 6 cm² yellow; bathroom: 4 cm² red; kitchen: 12 cm² green; living room: 16 cm² orange; balcony: 2 cm² pink.'),('Area is not perimeter','The same area can have different perimeters. A 2 × 6 rectangle and a 3 × 4 rectangle both cover 12 square units, but their perimeters are 16 and 14 units.')],
 'Area = inside squares. Perimeter = outside edges. Label each with the right unit.',
 ['For an irregular shape made of full squares, count each square once. In the house, rooms must not overlap and the cells of each room should connect along edges.','Português: área conta os quadradinhos por dentro. No retângulo, linhas × colunas dá a quantidade de quadradinhos.'],
 [('🟩','Area','área: espaço interno'),('🔲','Square unit','unidade quadrada'),('🏠','Grid','malha quadriculada')],
 'A room 11 m long and 7 m wide has area 77 m² and perimeter 36 m.',
 'Draw a room with area 12 square units. Give its length, width, area and perimeter.',
 'One possible answer: 3 × 4 units; area 12 square units; perimeter 3 + 4 + 3 + 4 = 14 units.', ['M3-G1','M3-G4','M3-G5'])
]
lessons=[];deep={};practice=[]
for i,(slug,title,sub,icon,tone,intro,facts,remember,paragraphs,vocab,example,prompt,answer,refs) in enumerate(rows):
 id='m3-'+slug
 lessons.append(dict(id=id,number=f'{i+1:02}',icon=icon,title=title,subtitle=sub,intro=intro,facts=[dict(term=t,text=x) for t,x in facts],remember=remember,tone=tone,quizId='math3-'+slug))
 deep[id]=dict(title=sub,paragraphs=paragraphs,vocabulary=vocab,example=example,challenge=prompt)
 practice.append(dict(lesson=id,prompt=prompt,answer=answer,sourceRefs=refs))
# Parallel pools, all computational skills bounded by the supplied school material.
items=[
 [('A whole is split into 6 equal parts. Four are shaded. Which fraction is shaded?','4/6',['6/4','4/10','2/6'],'The numerator counts 4 shaded parts; the denominator counts 6 equal parts.'),('In 3/8, what does 8 tell you?','Equal parts in one whole',['Shaded parts','Number of wholes','Unshaded parts only'],'The denominator counts all equal parts in one whole.'),('Which shows one whole?','6/6',['1/6','5/6','6/12'],'All six of the six equal parts are selected.')],
 [('Find 1/4 of 56 students.','14 students',['4 students','42 students','52 students'],'56 ÷ 4 = 14.'),('Find 3/4 of 56 students.','42 students',['14 students','21 students','53 students'],'56 ÷ 4 × 3 = 42.'),('Share 24 cupcakes equally among 6 teachers. How many each?','4 cupcakes',['6 cupcakes','18 cupcakes','144 cupcakes'],'24 ÷ 6 = 4.')],
 [('Which fraction is equivalent to 2/5?','4/10',['2/10','4/5','3/6'],'Multiply both 2 and 5 by 2.'),('Convert 2 1/3 to an improper fraction.','7/3',['3/3','5/3','7/6'],'2 × 3 + 1 = 7; keep denominator 3.'),('Which is a proper fraction?','2/5',['7/3','8/6','17/6'],'2 is smaller than 5, so 2/5 is less than one.')],
 [('Write 5/100 as a decimal.','0.05',['0.5','5.00','0.005'],'5 hundredths is 0.05, with zero tenths.'),('Which number is greatest: 0.89, 0.9, 0.09, 0.19?','0.9',['0.89','0.09','0.19'],'0.9 = 0.90, greater than 0.89.'),('Write 1 6/100 as a decimal.','1.06',['1.6','0.16','1.006'],'One whole and six hundredths is 1.06.')],
 [('Calculate 22.3 + 34.1.','56.4',['56.04','55.4','57.4'],'22.30 + 34.10 = 56.40.'),('Calculate 76.3 − 34.1.','42.2',['42.02','41.2','110.4'],'76.30 − 34.10 = 42.20.'),('Calculate 3.2 − 2.85.','0.35',['0.45','1.65','0.07'],'Write 3.20, line up the points and regroup.')],
 [('Liam ran 3.2 km and Jack ran 2.85 km. How much farther did Liam run?','0.35 km',['0.45 km','6.05 km','1.35 km'],'Compare the distances: 3.20 − 2.85 = 0.35 km.'),('The temperature is 29.8°C and rises by 2.5°C. What is the new temperature?','32.3°C',['31.3°C','27.3°C','32.03°C'],'29.8 + 2.5 = 32.3°C.'),('You save i$260 and want i$5 change. How much may you spend?','i$255',['i$265','i$250','i$5'],'260 − 5 = 255.')],
 [('Find the perimeter of a 5 m by 3 m rectangle.','16 m',['15 m','8 m','16 m²'],'5 + 3 + 5 + 3 = 16 m.'),('A square has perimeter 20 cm. Find one side.','5 cm',['4 cm','10 cm','80 cm'],'A square has four equal sides: 20 ÷ 4 = 5.'),('A regular hexagon has perimeter 60 cm. Find one side.','10 cm',['6 cm','12 cm','15 cm'],'Six equal sides: 60 ÷ 6 = 10.')],
 [('Find the area of a 9 m by 6 m rectangle.','54 m²',['30 m²','15 m²','54 m'],'9 × 6 = 54 square metres.'),('How many square units are in a 4 by 3 grid?','12 square units',['7 square units','14 square units','16 square units'],'4 columns × 3 rows = 12 squares.'),('Which measures the space inside a shape?','Area',['Perimeter','Length of one edge','Outside boundary'],'Area counts the square units covering the inside.')]
]
# Additional exact and varied exercises for mock pools.
variants={
0:[('A circle has 8 equal parts; 3 are selected. Write the fraction.','3/8',['8/3','5/8','3/5'],'3 selected out of 8 equal parts.'),('In 2/5, which is the numerator?','2',['5','7','3'],'The numerator is the number above the fraction line.'),('Which is larger for the same whole: 1/4 or 1/6?','1/4',['1/6','They are equal','Both are one whole'],'Four equal pieces are larger than six equal pieces of the same whole.')],
1:[('Find 1/5 of 20 marbles.','4 marbles',['5 marbles','15 marbles','100 marbles'],'20 ÷ 5 = 4.'),('Find 5/6 of 24 counters.','20 counters',['4 counters','18 counters','23 counters'],'24 ÷ 6 × 5 = 20.'),('Find 2/3 of 18 counters.','12 counters',['6 counters','9 counters','15 counters'],'18 ÷ 3 × 2 = 12.')],
2:[('Convert 2 5/6 to an improper fraction.','17/6',['12/6','7/6','17/12'],'2 × 6 + 5 = 17.'),('Convert 1 3/8 to an improper fraction.','11/8',['4/8','8/11','3/8'],'1 × 8 + 3 = 11.'),('Convert 8/3 to a mixed number.','2 2/3',['2 1/3','3 2/3','1 5/3'],'8 ÷ 3 = 2 remainder 2.')],
3:[('Write 47/100 as a decimal.','0.47',['4.7','0.047','47.0'],'47 hundredths is 0.47.'),('Write 3.04 as a mixed number.','3 4/100',['3 4/10','3 40/100','34/100'],'The 4 is in the hundredths place.'),('Which equals 0.6?','0.60',['0.06','6.0','0.006'],'Six tenths is sixty hundredths.')],
4:[('Calculate 29.8 + 2.5.','32.3',['31.3','32.03','27.3'],'8 tenths + 5 tenths = 13 tenths; carry one whole.'),('Calculate 1.06 + 0.84.','1.90',['1.10','1.80','0.90'],'106 hundredths + 84 hundredths = 190 hundredths.'),('Calculate 4.09 − 1.45.','2.64',['3.64','2.74','5.54'],'409 hundredths − 145 hundredths = 264 hundredths.')],
5:[('Which city is nearest Salvador: São Paulo 1,960 km, Rio 1,640 km, Belo Horizonte 1,370 km or Brasília 1,460 km?','Belo Horizonte',['São Paulo','Rio de Janeiro','Brasília'],'1,370 km is the smallest listed distance.'),('Four activities cost i$25, i$140, i$60 and i$30. How much change from i$260?','i$5',['i$15','i$25','i$0'],'25 + 140 + 60 + 30 = 255; 260 − 255 = 5.'),('A distance increases from 1.4 km to 2.65 km. Find the increase.','1.25 km',['4.05 km','1.35 km','0.25 km'],'2.65 − 1.40 = 1.25 km.')],
6:[('A regular pentagon has perimeter 25 cm. Find one side.','5 cm',['4 cm','6 cm','125 cm'],'A pentagon has 5 sides: 25 ÷ 5 = 5.'),('Find the perimeter of a 30 cm by 20 cm rectangle.','100 cm',['50 cm','600 cm','100 cm²'],'30 + 20 + 30 + 20 = 100.'),('Find the perimeter of a 1.2 km by 0.5 km rectangle.','3.4 km',['1.7 km','0.6 km','2.4 km'],'1.2 + 0.5 + 1.2 + 0.5 = 3.4 km.')],
7:[('Find the area of an 11 m by 7 m rectangle.','77 m²',['36 m²','18 m²','77 m'],'11 × 7 = 77 m².'),('A grid has 5 columns and 6 rows. Find its area.','30 square units',['11 square units','22 square units','25 square units'],'5 × 6 = 30 squares.'),('Which room needs exactly 8 cells of 1 cm² in the house activity?','First bedroom',['Second bedroom','Kitchen','Balcony'],'The first bedroom must cover 8 cm²; each cell is 1 cm².')]
}
questions=[]
for p,pool in enumerate(['quiz','mock-a','mock-b']):
 for i,row in enumerate(rows):
  source=items[i] if p==0 else variants[i] if p==1 else items[i][1:]+variants[i][:1]
  for j,(prompt,correct,wrong,explain) in enumerate(source):
   n=len(questions); opts=[correct]+wrong; shift=n%4;opts=opts[-shift:]+opts[:-shift] if shift else opts
   questions.append(dict(id=35000+n,pool=pool,topic=row[1],prompt=prompt if p!=2 else 'Check your understanding: '+prompt,support='Use the model in the lesson. Work it out before choosing.',hints=[row[7],explain],correct='abcd'[opts.index(correct)],options=[dict(id='abcd'[k],label=o,explanation=('Correct. ' if o==correct else 'Try again. ')+explain) for k,o in enumerate(opts)],sourceRefs=row[-1]))
subject=dict(key='math',name='Math',icon='🔢',eyebrow='MATH • III TRIMESTRE',title='Fractions, decimals and shapes',description='8 aulas • laboratórios de toque, frações, decimais, problemas, perímetro e área.',assessmentDate='',quizId='math3-general',lessons=lessons)
infographics=[dict(src=f'/infographics/math3-{n}.svg',alt=t,width=1024,height=1448,label=t,lessons=ids) for n,t,ids in [(1,'Fractions and equal parts',['m3-fractions','m3-sets','m3-equivalence']),(2,'Decimals and calculations',['m3-decimals','m3-operations','m3-problems']),(3,'Perimeter and area',['m3-perimeter','m3-area'])]]
Path('app/math3-content.json').write_text(json.dumps(dict(subject=subject,questions=questions,deepStudy=deep,practice=practice,infographics=infographics),ensure_ascii=False,indent=2)+'\n')
Path('app/math3-sources.json').write_text(json.dumps(dict(received='2026-11-15',term=3,year=2026,grade='Year 4',scope='Math Study Material — III trimestre; no exam date printed in the supplied pages.',sources=[dict(id=id,title=title,section=section) for id,title,section in [
('M3-F1','Fractions','What is a fraction? Fraction of a whole.'),('M3-F2','Equal parts and fraction of a set','Numerator, denominator, equal grouping.'),('M3-F3','Equivalent fractions','Same value, multiplying and dividing both terms.'),('M3-F4','Proper, improper and mixed','Represent mixed numbers; students and cupcakes problems.'),('M3-D1','Decimals','Whole part, decimal part, reading numbers.'),('M3-D2','Converting fractions into decimals','Tenths and hundredths grids, mixed numbers.'),('M3-D3','Decimal practice','Shade grids, order numbers, write fractions.'),('M3-D4','Adding and subtracting decimals','Align decimal points; activity prices.'),('M3-D5','Applied problems','Change, running distances, city-distance table.'),('M3-D6','Order and temperature','Order cities; 29.8°C rises by 2.5°C.'),('M3-G1','Perimeter and area','Boundary, inside, rectangles and squares.'),('M3-G2','Compare and find perimeter','500 m square, triangle, 1.2 × 0.5 km rectangle.'),('M3-G3','Regular polygons','Square, pentagon and hexagon side lengths.'),('M3-G4','Area practice','Count cells; perimeter and area of rectangles.'),('M3-G5','House on a grid','Bedroom 8 and 6; bathroom 4; kitchen 12; living 16; balcony 2 cm².')]],notes=['The school text calls the total number of objects the denominator in one step. The app corrects this: the denominator is the number of equal groups in the fraction being found.','One school diagram shows five squares but labels six. The app counts actual cells.','The red triangle has an unknown side without equality marks. The app does not assume that side length.','Study content and exercises are derived; original student photos and full name are not published.']),ensure_ascii=False,indent=2)+'\n')
print(len(questions),'questions,',len(lessons),'lessons')
