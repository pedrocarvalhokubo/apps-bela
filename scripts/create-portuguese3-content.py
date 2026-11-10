"""Gera app/portuguese3-content.json e app/portuguese3-sources.json.

Língua Portuguesa • III trimestre. Conteúdos do guia de estudo: leitura e compreensão,
tempos verbais, pronomes eu e mim, numerais (incluindo algarismos romanos) e tonicidade.
As questões são autorais e treinam as mesmas habilidades do guia sem copiar os exercícios.
Execute: python3 scripts/create-portuguese3-content.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SOURCES = [
    ("P3-01", "Guia do III trimestre", "Conteúdos da avaliação", 1),
    ("P3-02", "Explicação: tempos verbais", "Pretérito, presente, futuro, tabela de exemplos e dica das palavras de tempo", 2),
    ("P3-03", "Explicação: eu e mim", "Eu como sujeito do verbo; mim depois de preposição", 7),
    ("P3-04", "Explicação: numerais", "Cardinal, ordinal, multiplicativo e fracionário", 7),
    ("P3-05", "Exercícios 1 a 3", "Identificar o tempo verbal e reescrever no futuro", 8),
    ("P3-06", "Exercícios 4 a 6", "Completar verbos; usar eu e mim", 9),
    ("P3-07", "Exercícios 7 a 9", "Uso inadequado de eu e mim; numerais em um texto", 6),
    ("P3-08", "Exercícios 10 a 12", "Classificar numerais; separar sílabas e classificar a tonicidade", 5),
    ("P3-09", "Exercícios 13 a 15", "Oxítonas, paroxítonas, proparoxítonas e escrita em algarismos romanos", 4),
    ("P3-10", "Exercícios 16 a 18", "Valores de algarismos romanos, séculos e regras de repetição", 3),
]

LESSONS = [
    {
        "id": "p3-reading", "number": "01", "icon": "📖", "title": "Leitura e compreensão",
        "subtitle": "Ler, localizar e concluir", "tone": "purple", "quizId": "portuguese3-reading",
        "intro": "Compreender um texto é entender o que está escrito e também o que podemos concluir a partir das pistas. Leia o texto inteiro antes de responder.",
        "facts": [
            {"term": "Antes", "text": "leia o título e observe sobre o que o texto fala."},
            {"term": "Localizar", "text": "algumas respostas estão escritas no texto. Volte ao trecho e procure a informação."},
            {"term": "Retirar do texto", "text": "significa copiar a palavra ou o trecho exatamente como aparece no texto."},
            {"term": "Concluir", "text": "outras respostas pedem pistas: ações, sentimentos e palavras de tempo ajudam a entender o que aconteceu."},
        ],
        "remember": "Leia tudo, volte ao trecho e confira se a resposta está no texto ou pode ser concluída por ele.",
        "deep": {
            "title": "Detetive da leitura",
            "paragraphs": [
                "Um bom leitor faz perguntas: quem participa? O que aconteceu? Quando? Onde? Por quê? As respostas ajudam a organizar o texto na cabeça.",
                "Há dois tipos de resposta. A informação explícita está escrita no texto. A informação implícita é concluída pelas pistas: se alguém pulou e abraçou a mãe sorrindo, podemos concluir que estava feliz.",
            ],
            "vocabulary": [["🔎", "explícito", "está escrito no texto"], ["💡", "implícito", "concluído pelas pistas"], ["✂️", "retirar do texto", "copiar exatamente a palavra do texto"]],
            "example": "Texto: “Choveu a semana toda. No sábado, o sol apareceu e as crianças foram ao parque.” Quando foram ao parque? No sábado (explícito). Por que não foram antes? Porque estava chovendo (implícito).",
            "challenge": "Escolha um parágrafo de um livro e faça três perguntas sobre ele: uma de quem, uma de quando e uma de por quê.",
        },
    },
    {
        "id": "p3-tenses", "number": "02", "icon": "⏳", "title": "Tempos verbais",
        "subtitle": "Pretérito, presente e futuro", "tone": "blue", "quizId": "portuguese3-tenses",
        "intro": "Verbos indicam ações, estados ou fenômenos da natureza. O tempo verbal mostra quando a ação acontece: no passado, no presente ou no futuro.",
        "facts": [
            {"term": "Pretérito", "text": "já aconteceu: Ontem eu estudei. Ela escreveu. Eles comeram."},
            {"term": "Presente", "text": "acontece agora: Hoje eu estudo. Ela escreve. Eles comem."},
            {"term": "Futuro", "text": "ainda acontecerá: Amanhã eu estudarei. Ela escreverá. Eles comerão."},
            {"term": "Palavras de tempo", "text": "ontem, hoje, agora, amanhã, depois, no mês passado e na próxima semana ajudam a descobrir o tempo."},
        ],
        "remember": "Ontem → pretérito. Hoje/agora → presente. Amanhã → futuro.",
        "deep": {
            "title": "A linha do tempo do verbo",
            "paragraphs": [
                "Imagine uma linha: à esquerda fica o que já passou, no meio o agora, à direita o que ainda vai acontecer. Cada verbo muda a terminação para mostrar em que ponto da linha a ação está.",
                "Às vezes a mesma forma serve para dois tempos: “Nós viajamos ontem” (pretérito) e “Nós viajamos hoje” (presente). Por isso as palavras de tempo da frase são pistas importantes.",
            ],
            "vocabulary": [["⬅️", "pretérito", "ação que já aconteceu"], ["⏺️", "presente", "ação que acontece agora"], ["➡️", "futuro", "ação que ainda acontecerá"]],
            "example": "brincar: eu brinquei (pretérito), eu brinco (presente), eu brincarei (futuro).",
            "challenge": "Conte o seu dia em três frases: uma sobre ontem, uma sobre hoje e uma sobre amanhã. Circule os verbos.",
        },
    },
    {
        "id": "p3-eu-mim", "number": "03", "icon": "🙋", "title": "Eu ou mim?",
        "subtitle": "Quem faz a ação?", "tone": "orange", "quizId": "portuguese3-eu-mim",
        "intro": "Eu e mim são pronomes pessoais. Usamos EU quando o pronome realiza a ação de um verbo. Usamos MIM depois de preposições como para, de, por e entre, quando ele não é sujeito de um verbo.",
        "facts": [
            {"term": "EU", "text": "faz a ação: Eu gosto de ler. Este livro é para eu estudar. Minha mãe pediu para eu organizar o quarto."},
            {"term": "MIM", "text": "vem depois de preposição e não faz a ação: Este presente é para mim. Ela gosta de mim."},
            {"term": "Entre", "text": "o correto é “entre mim e você”, nunca “entre eu e você”."},
            {"term": "Teste rápido", "text": "depois de “para”, veja se vem um verbo que você mesmo faz: para eu ler; para mim, sem verbo depois."},
        ],
        "remember": "Mim não faz nada: “para mim fazer” está errado. O certo é “para eu fazer”.",
        "deep": {
            "title": "O truque do verbo",
            "paragraphs": [
                "Quando aparecer “para eu” ou “para mim”, olhe o que vem depois. Se vier um verbo que você vai realizar (ler, fazer, guardar), use EU, porque você é quem faz a ação.",
                "Se a frase terminar ou não vier um verbo seu, use MIM: “O bolo é para mim.” Com “entre”, use sempre mim: “entre mim e ela”.",
            ],
            "vocabulary": [["🙋", "sujeito", "quem realiza a ação do verbo"], ["🔗", "preposição", "palavra de ligação: para, de, por, entre"], ["🎁", "mim", "recebe ou completa o sentido depois da preposição"]],
            "example": "A professora pediu para eu apagar o quadro (eu apago). A professora trouxe um livro para mim (eu não faço ação).",
            "challenge": "Invente duas frases com “para eu” + verbo e duas com “para mim”. Leia em voz alta.",
        },
    },
    {
        "id": "p3-numerals", "number": "04", "icon": "🔢", "title": "Numerais",
        "subtitle": "Quantidade, ordem, multiplicação e divisão", "tone": "green", "quizId": "portuguese3-numerals",
        "intro": "Numerais são palavras que indicam quantidade, ordem, multiplicação ou divisão de uma quantidade. Existem quatro tipos principais.",
        "facts": [
            {"term": "Cardinal", "text": "indica quantidade: Tenho quatro livros. Três maçãs. Vinte estudantes."},
            {"term": "Ordinal", "text": "indica posição ou ordem: Ela chegou em primeiro lugar. Segundo, terceiro, décimo."},
            {"term": "Multiplicativo", "text": "indica multiplicação: Ganhei o dobro de pontos. Triplo, quádruplo."},
            {"term": "Fracionário", "text": "indica parte de um todo: Comi metade da maçã. Um terço, um quarto."},
        ],
        "remember": "Quantos? cardinal. Em que posição? ordinal. Quantas vezes mais? multiplicativo. Que parte? fracionário.",
        "deep": {
            "title": "Quatro perguntas para os numerais",
            "paragraphs": [
                "Para classificar, pergunte o que o numeral mostra. “Quinze” responde quantos (cardinal). “Terceiro” responde em que posição (ordinal).",
                "“Triplo” responde quantas vezes maior (multiplicativo). “Um terço” responde que parte de um inteiro (fracionário).",
            ],
            "vocabulary": [["🍎", "cardinal", "quantidade: três maçãs"], ["🥇", "ordinal", "ordem: primeiro lugar"], ["✖️", "multiplicativo", "dobro, triplo"], ["🍕", "fracionário", "metade, um terço"]],
            "example": "“Vinte estudantes participaram. Ana ficou em primeiro lugar, Lucas fez o dobro de pontos e metade da turma ganhou medalha.” vinte = cardinal; primeiro = ordinal; dobro = multiplicativo; metade = fracionário.",
            "challenge": "Procure numerais em uma receita ou em um jogo e classifique cada um.",
        },
    },
    {
        "id": "p3-roman", "number": "05", "icon": "🏛️", "title": "Algarismos romanos",
        "subtitle": "I, V, X, L, C, D e M", "tone": "purple", "quizId": "portuguese3-roman",
        "intro": "Os romanos escreviam números com letras. Ainda usamos algarismos romanos em séculos, nomes de reis e imperadores, capítulos e relógios.",
        "facts": [
            {"term": "Valores", "text": "I = 1, V = 5, X = 10, L = 50, C = 100, D = 500 e M = 1000."},
            {"term": "Somar", "text": "símbolo menor depois do maior soma: VI = 6, XV = 15, LX = 60."},
            {"term": "Subtrair", "text": "I antes de V ou X, X antes de L ou C, C antes de D ou M subtrai: IV = 4, IX = 9, XL = 40, XC = 90."},
            {"term": "Repetir", "text": "I, X, C e M podem ser repetidos até três vezes seguidas: III = 3, XXX = 30. V, L e D não se repetem."},
        ],
        "remember": "Menor depois soma; menor antes subtrai. No máximo três símbolos iguais seguidos.",
        "deep": {
            "title": "Montando números romanos",
            "paragraphs": [
                "Para escrever um número, separe dezenas e unidades. 24 = 20 + 4 = XX + IV = XXIV. 39 = 30 + 9 = XXX + IX = XXXIX.",
                "Em nomes como Dom Pedro II, o número romano indica a ordem: Pedro II foi o segundo imperador chamado Pedro. Séculos também usam romanos: século XIX é o século 19; século XXI é o século 21, em que vivemos.",
            ],
            "vocabulary": [["🕰️", "algarismo romano", "símbolo usado pelos romanos para escrever números"], ["➕", "somar", "menor depois do maior"], ["➖", "subtrair", "menor antes do maior"]],
            "example": "16 = X + V + I = XVI. 50 = L. 63 = L + X + III = LXIII.",
            "challenge": "Escreva a sua idade, o ano em que você está na escola e o número da sua casa em algarismos romanos.",
        },
    },
    {
        "id": "p3-stress", "number": "06", "icon": "🗣️", "title": "Tonicidade",
        "subtitle": "Oxítonas, paroxítonas e proparoxítonas", "tone": "blue", "quizId": "portuguese3-stress",
        "intro": "Toda palavra com mais de uma sílaba tem uma sílaba pronunciada com mais força: a sílaba tônica. A posição dela classifica a palavra. Separe as sílabas e conte de trás para frente.",
        "facts": [
            {"term": "Oxítona", "text": "a tônica é a última sílaba: ca-FÉ, so-FÁ, ja-ca-RÉ, pa-PEL, co-ra-ÇÃO, a-ba-ca-XI."},
            {"term": "Paroxítona", "text": "a tônica é a penúltima sílaba: ca-DER-no, es-CO-la, LÁ-pis."},
            {"term": "Proparoxítona", "text": "a tônica é a antepenúltima sílaba: MÚ-si-ca, LÂM-pa-da, MÉ-di-co, ÁR-vo-re."},
            {"term": "Acento", "text": "toda proparoxítona tem acento gráfico. Mas a tônica nem sempre tem acento: pa-PEL, ca-DER-no."},
        ],
        "remember": "Conte do fim: última = oxítona; penúltima = paroxítona; antepenúltima = proparoxítona.",
        "deep": {
            "title": "Chame a palavra em voz alta",
            "paragraphs": [
                "Uma dica é falar a palavra como se estivesse chamando alguém de longe: a sílaba que sai mais forte é a tônica. Ca-fééé! Ca-deeer-no! Múúú-si-ca!",
                "Depois de achar a tônica, conte de trás para frente: 1ª do fim é a última, 2ª é a penúltima e 3ª é a antepenúltima.",
            ],
            "vocabulary": [["💪", "sílaba tônica", "falada com mais força"], ["1️⃣", "oxítona", "tônica na última"], ["2️⃣", "paroxítona", "tônica na penúltima"], ["3️⃣", "proparoxítona", "tônica na antepenúltima"]],
            "example": "pás-sa-ro: tônica PÁS, 3ª do fim → proparoxítona. sa-pa-to: tônica PA, 2ª do fim → paroxítona. pi-co-lé: tônica LÉ, última → oxítona.",
            "challenge": "Encontre em casa um objeto com nome oxítono, um paroxítono e um proparoxítono.",
        },
    },
]

# (lição, pool, enunciado, [pista1, pista2], (correta, explicação), [(errada, explicação) x3], fontes)
Q = []
def q(lesson, pool, prompt, hints, right, wrongs, refs):
    Q.append((lesson, pool, prompt, hints, right, wrongs, refs))

# ---------- Leitura e compreensão ----------
q("p3-reading", "quiz", "Leia: “Lia acordou cedo, pegou a mochila e correu para o ponto. Quando chegou, o ônibus já tinha partido.” O que aconteceu quando Lia chegou ao ponto?",
  ["Volte à última frase do texto.", "A resposta está escrita no texto."],
  ("O ônibus já tinha partido.", "Correto. O texto diz que, quando Lia chegou, o ônibus já tinha partido."),
  [("Lia encontrou uma amiga no ponto.", "O texto não fala de nenhuma amiga; essa informação foi inventada."),
   ("O ônibus estava atrasado.", "É o contrário: o ônibus já tinha ido embora quando ela chegou."),
   ("Lia voltou para dormir.", "O texto não conta o que Lia fez depois; não podemos afirmar isso.")], ["P3-01"])
q("p3-reading", "quiz", "Uma questão pede: “Retire do texto um numeral”. O que você deve fazer?",
  ["Pense no significado de “retirar”.", "A palavra deve aparecer igualzinha no texto."],
  ("Copiar a palavra exatamente como aparece no texto.", "Correto. Retirar do texto é copiar a palavra ou o trecho do jeito que está escrito."),
  [("Inventar uma palavra parecida.", "A resposta precisa vir do texto, não da imaginação."),
   ("Resumir o texto inteiro.", "Resumir é outra tarefa; aqui basta copiar a palavra pedida."),
   ("Apagar o numeral do texto.", "Retirar, nesse caso, não significa apagar, e sim copiar.")], ["P3-07"])
q("p3-reading", "quiz", "Leia: “O gato Tufo dormia no sofá. De repente, um trovão forte ecoou e Tufo correu para debaixo da cama.” Por que Tufo se escondeu?",
  ["Veja o que aconteceu logo antes de ele correr.", "Pense no que um barulho forte causa em um gato."],
  ("Porque se assustou com o trovão.", "Correto. O trovão forte veio “de repente”; a pista mostra que Tufo ficou assustado."),
  [("Porque estava com fome.", "O texto não fala de comida; não há pista de fome."),
   ("Porque queria brincar.", "Correr para debaixo da cama logo após um trovão não indica brincadeira."),
   ("Porque o sofá quebrou.", "O texto não diz que o sofá quebrou.")], ["P3-01"])
q("p3-reading", "mock-a", "Leia: “A feira de ciências teve doze projetos. O vulcão de argila da turma do 4º ano foi o mais visitado.” Qual projeto foi o mais visitado?",
  ["Procure a palavra “visitado”.", "A resposta está escrita na segunda frase."],
  ("O vulcão de argila.", "Correto. O texto afirma que o vulcão de argila foi o mais visitado."),
  [("Um projeto do 5º ano.", "O texto fala da turma do 4º ano, não do 5º."),
   ("O décimo segundo projeto.", "Doze é a quantidade de projetos, não a posição do mais visitado."),
   ("Todos os projetos empataram.", "O texto diz que um projeto foi o mais visitado, então não houve empate.")], ["P3-01"])
q("p3-reading", "mock-a", "Qual é a melhor atitude para entender bem um texto antes de responder às perguntas?",
  ["Pense no que um bom leitor faz primeiro.", "Ler só um pedaço pode deixar informações de fora."],
  ("Ler o título e o texto inteiro com atenção.", "Correto. Ler tudo com atenção ajuda a encontrar as informações e as pistas."),
  [("Ler apenas a primeira linha.", "A resposta pode estar em qualquer parte do texto."),
   ("Olhar só as figuras.", "As figuras ajudam, mas não substituem a leitura do texto."),
   ("Responder primeiro e ler depois.", "Responder antes de ler aumenta a chance de erro.")], ["P3-01"])
q("p3-reading", "mock-a", "Leia: “Mesmo cansado depois do treino, Caio ajudou o avô a carregar as compras.” O que podemos concluir sobre Caio?",
  ["Ele estava cansado, mas fez algo pelo avô.", "Que qualidade tem quem ajuda os outros?"],
  ("Ele é prestativo.", "Correto. Ajudar o avô mesmo cansado mostra que Caio gosta de ajudar."),
  [("Ele não gosta do avô.", "Ele ajudou o avô; isso mostra cuidado, não desgosto."),
   ("Ele faltou ao treino.", "O texto diz que ele estava cansado depois do treino, então foi ao treino."),
   ("Ele estava descansado.", "O texto diz claramente que Caio estava cansado.")], ["P3-01"])
q("p3-reading", "mock-b", "Leia: “Choveu a semana toda. No sábado, o sol finalmente apareceu, e as crianças foram ao parque.” Quando as crianças foram ao parque?",
  ["Procure uma palavra que indique o dia.", "Releia a segunda frase."],
  ("No sábado, quando o sol apareceu.", "Correto. O texto diz que foram ao parque no sábado, quando o sol apareceu."),
  [("Durante a semana de chuva.", "Durante a semana choveu; elas foram depois, no sábado."),
   ("Antes de começar a chover.", "O texto não fala de antes da chuva."),
   ("O texto não informa.", "O texto informa: no sábado.")], ["P3-01"])
q("p3-reading", "mock-b", "Leia: “Marina plantou um feijão no copo e regou todos os dias. Depois de uma semana, apareceram as primeiras folhas.” Quanto tempo levou para as folhas aparecerem?",
  ["Procure uma expressão de tempo.", "Ela aparece na segunda frase."],
  ("Uma semana.", "Correto. O texto diz: “Depois de uma semana, apareceram as primeiras folhas”."),
  [("Um dia.", "Marina regava todos os dias, mas as folhas surgiram depois de uma semana."),
   ("Um mês.", "O texto não fala em mês."),
   ("Duas semanas.", "O texto fala em uma semana, não duas.")], ["P3-01"])
q("p3-reading", "mock-b", "Leia: “Pedro olhou o boletim, deu um pulo e abraçou a mãe, sorrindo.” Como Pedro provavelmente se sentiu?",
  ["Observe as ações: pular, abraçar, sorrir.", "Essas ações combinam com qual sentimento?"],
  ("Feliz com o resultado.", "Correto. Pular, abraçar e sorrir são pistas de alegria."),
  [("Triste com as notas.", "Quem está triste normalmente não pula sorrindo."),
   ("Com medo da mãe.", "Ele abraçou a mãe sorrindo; não há sinal de medo."),
   ("Entediado com o boletim.", "Um pulo e um abraço mostram empolgação, não tédio.")], ["P3-01"])

# ---------- Tempos verbais ----------
q("p3-tenses", "quiz", "“Ontem, os alunos visitaram o museu.” Em que tempo está o verbo?",
  ["Encontre o verbo da frase.", "A palavra “ontem” é uma pista."],
  ("Pretérito, porque a ação já aconteceu.", "Correto. “Visitaram” e “ontem” mostram uma ação que já aconteceu."),
  [("Presente, porque acontece agora.", "Se fosse agora, seria “visitam”. “Ontem” indica passado."),
   ("Futuro, porque ainda vai acontecer.", "No futuro seria “visitarão”."),
   ("A frase não tem verbo.", "“Visitaram” é o verbo da frase.")], ["P3-02", "P3-05"])
q("p3-tenses", "quiz", "Qual frase está no futuro?",
  ["Procure uma ação que ainda vai acontecer.", "Observe a palavra de tempo e a terminação do verbo."],
  ("Amanhã eu estudarei para a prova.", "Correto. “Amanhã” e “estudarei” indicam algo que ainda acontecerá."),
  [("Ontem eu estudei para a prova.", "“Estudei” e “ontem” indicam pretérito."),
   ("Hoje eu estudo para a prova.", "“Estudo” e “hoje” indicam presente."),
   ("Eu estudava todos os dias no ano passado.", "“Estudava” e “ano passado” indicam passado.")], ["P3-02"])
q("p3-tenses", "quiz", "Complete: “Agora, o treinador ____ o time no campo.” (reunir)",
  ["“Agora” indica qual tempo?", "Escolha a forma do presente."],
  ("reúne", "Correto. “Agora” pede o presente: o treinador reúne o time."),
  [("reuniu", "“Reuniu” é pretérito e não combina com “agora”."),
   ("reunirá", "“Reunirá” é futuro e não combina com “agora”."),
   ("reunir", "“Reunir” é o nome do verbo; não mostra quando a ação acontece.")], ["P3-06"])
q("p3-tenses", "mock-a", "Quais palavras ajudam a perceber que uma ação ainda vai acontecer?",
  ["Pense no que vem depois de hoje.", "Procure o grupo do futuro."],
  ("amanhã, depois, na próxima semana", "Correto. Essas expressões apontam para o futuro."),
  [("ontem, no mês passado, anteontem", "Essas palavras indicam passado."),
   ("hoje, agora, neste momento", "Essas palavras indicam presente."),
   ("sempre, nunca, talvez", "Essas palavras não mostram um tempo específico da ação.")], ["P3-02"])
q("p3-tenses", "mock-a", "Passe para o futuro: “Os meninos jogaram bola.”",
  ["No futuro, a ação ainda vai acontecer.", "Lembre: eles comerão, eles brincarão…"],
  ("Os meninos jogarão bola.", "Correto. “Jogarão” é a forma do futuro."),
  [("Os meninos jogam bola.", "“Jogam” está no presente."),
   ("Os meninos jogavam bola.", "“Jogavam” ainda indica passado."),
   ("Os meninos jogaram bola amanhã.", "Só acrescentar “amanhã” não muda o verbo; “jogaram” continua no passado.")], ["P3-05"])
q("p3-tenses", "mock-a", "A forma “viajamos” aparece em “Nós viajamos ontem” e em “Nós viajamos hoje”. Como descobrir o tempo de cada frase?",
  ["O verbo é igual nas duas frases.", "O que muda entre elas?"],
  ("Pelas palavras de tempo, como ontem e hoje.", "Correto. Quando a forma é igual, “ontem” mostra pretérito e “hoje” mostra presente."),
  [("Contando as letras do verbo.", "As duas formas têm as mesmas letras; contar não ajuda."),
   ("Pelo tamanho da frase.", "O tamanho da frase não indica o tempo."),
   ("Não é possível descobrir.", "É possível: as palavras de tempo resolvem.")], ["P3-02"])
q("p3-tenses", "mock-b", "Em “Mariana escreve uma história sobre sua família”, qual é o verbo e em que tempo ele está?",
  ["O verbo indica a ação de Mariana.", "Essa ação acontece agora?"],
  ("escreve — presente", "Correto. “Escreve” é a ação e está no presente."),
  [("história — pretérito", "“História” é um substantivo, não um verbo."),
   ("escreve — futuro", "No futuro seria “escreverá”."),
   ("família — presente", "“Família” é um substantivo, não um verbo.")], ["P3-05"])
q("p3-tenses", "mock-b", "Complete: “No ano passado, minha tia ____ para o Japão.” (mudar)",
  ["“No ano passado” indica qual tempo?", "Escolha a forma do pretérito."],
  ("mudou", "Correto. “No ano passado” pede o pretérito: mudou."),
  [("muda", "“Muda” está no presente."),
   ("mudará", "“Mudará” está no futuro."),
   ("mudar", "“Mudar” é o nome do verbo e não indica tempo.")], ["P3-06"])
q("p3-tenses", "mock-b", "Qual frase tem verbos que indicam ações que já aconteceram?",
  ["Procure terminações do passado.", "Exemplos: brinquei, escreveu, comeram."],
  ("Lucas pintou o desenho e guardou os lápis.", "Correto. “Pintou” e “guardou” estão no pretérito."),
  [("Lucas pinta o desenho e guarda os lápis.", "“Pinta” e “guarda” estão no presente."),
   ("Lucas pintará o desenho e guardará os lápis.", "“Pintará” e “guardará” estão no futuro."),
   ("Lucas vai pintar o desenho amanhã.", "“Vai pintar amanhã” indica futuro.")], ["P3-05"])

# ---------- Eu ou mim ----------
q("p3-eu-mim", "quiz", "Complete: “A vovó fez um bolo para ____.”",
  ["Depois do espaço vem algum verbo?", "Sem verbo depois de “para”, qual pronome usamos?"],
  ("mim", "Correto. Depois de “para”, sem verbo seguinte, usamos mim: o bolo é para mim."),
  [("eu", "Eu só aparece depois de “para” quando vem um verbo: para eu comer."),
   ("comigo", "“Para comigo” não combina com esta frase."),
   ("me", "“Para me” não é usado no fim dessa frase.")], ["P3-03", "P3-06"])
q("p3-eu-mim", "quiz", "Complete: “O professor pediu para ____ apagar o quadro.”",
  ["Quem vai apagar o quadro?", "Se o pronome faz a ação, qual usamos?"],
  ("eu", "Correto. Eu vou apagar o quadro; quem faz a ação é EU."),
  [("mim", "Mim não faz ações. “Para mim apagar” está inadequado."),
   ("me", "“Para me apagar” muda o sentido: seria apagar a si mesmo."),
   ("comigo", "“Para comigo apagar” não forma uma frase correta.")], ["P3-03", "P3-06"])
q("p3-eu-mim", "quiz", "Qual frase usa o pronome corretamente?",
  ["Lembre a regra da palavra “entre”.", "Depois de preposição sem verbo, usamos mim."],
  ("Entre mim e você não há segredos.", "Correto. Com “entre”, usamos mim."),
  [("Entre eu e você não há segredos.", "Com “entre”, o correto é “entre mim e você”."),
   ("Esse lanche é para eu.", "No fim da frase, depois de “para”, usamos mim."),
   ("Minha irmã trouxe um livro para eu.", "Sem verbo depois, o correto é “para mim”.")], ["P3-03", "P3-07"])
q("p3-eu-mim", "mock-a", "Complete: “Este jogo é para ____ montar sozinha.”",
  ["Quem vai montar?", "Há um verbo logo depois do espaço."],
  ("eu", "Correto. Eu vou montar: o pronome faz a ação, então usamos eu."),
  [("mim", "“Para mim montar” está inadequado, porque mim não faz ações."),
   ("me", "“Para me montar” mudaria o sentido da frase."),
   ("comigo", "“Para comigo montar” não está correto.")], ["P3-03"])
q("p3-eu-mim", "mock-a", "Complete: “Meu primo sentou perto de ____ no cinema.”",
  ["“De” é uma preposição.", "Há algum verbo depois do espaço?"],
  ("mim", "Correto. Depois da preposição “de”, sem verbo, usamos mim."),
  [("eu", "“Perto de eu” está inadequado; o pronome não faz ação aqui."),
   ("comigo", "“Perto de comigo” não é usado."),
   ("me", "“Perto de me” não está correto.")], ["P3-03"])
q("p3-eu-mim", "mock-a", "Quando usamos EU depois da palavra “para”?",
  ["Lembre o exemplo “Este livro é para eu estudar”.", "O que vem depois de “eu” nesse exemplo?"],
  ("Quando depois vem um verbo que eu vou fazer.", "Correto. Para eu ler, para eu estudar: eu faço a ação."),
  [("Sempre que aparece a palavra “para”.", "Nem sempre: “O presente é para mim” usa mim."),
   ("Nunca; depois de “para” só se usa mim.", "Usamos eu quando há um verbo: “para eu fazer”."),
   ("Só quando a palavra está no fim da frase.", "No fim da frase, sem verbo, usamos mim.")], ["P3-03"])
q("p3-eu-mim", "mock-b", "Qual frase apresenta uso INADEQUADO do pronome?",
  ["Procure a frase que termina com o pronome.", "Sem verbo depois de “para”, qual pronome é o certo?"],
  ("A mamãe deixou um bilhete para eu.", "Correto, esta é a inadequada: sem verbo depois, deveria ser “para mim”."),
  [("A mamãe deixou um bilhete para eu ler.", "Esta está adequada: eu vou ler, então usamos eu."),
   ("A mamãe deixou um bilhete para mim.", "Esta está adequada: mim depois de “para”, sem verbo."),
   ("Eu li o bilhete da mamãe.", "Esta está adequada: eu é quem lê.")], ["P3-07"])
q("p3-eu-mim", "mock-b", "Complete: “Minha amiga gosta muito de ____.”",
  ["“De” é uma preposição.", "O pronome recebe o carinho, não faz a ação."],
  ("mim", "Correto. Depois de “de”, sem verbo seguinte, usamos mim: gosta de mim."),
  [("eu", "“Gosta de eu” está inadequado."),
   ("comigo", "“Gosta de comigo” não está correto."),
   ("me", "“Gosta de me” não está correto nessa frase.")], ["P3-03"])
q("p3-eu-mim", "mock-b", "Complete: “O treinador passou a bola para ____ chutar.”",
  ["Quem vai chutar?", "Há verbo depois do espaço."],
  ("eu", "Correto. Eu vou chutar; quem faz a ação é eu."),
  [("mim", "Mim não faz ações; “para mim chutar” está inadequado."),
   ("me", "“Para me chutar” mudaria totalmente o sentido."),
   ("comigo", "“Para comigo chutar” não está correto.")], ["P3-06"])

# ---------- Numerais ----------
q("p3-numerals", "quiz", "“Ganhei o triplo de figurinhas.” Como se classifica o numeral “triplo”?",
  ["Triplo é três vezes mais.", "Que tipo indica multiplicação?"],
  ("Multiplicativo", "Correto. Triplo indica multiplicação: três vezes a quantidade."),
  [("Cardinal", "Cardinal indica quantidade, como três ou quatro."),
   ("Ordinal", "Ordinal indica posição, como terceiro."),
   ("Fracionário", "Fracionário indica parte, como um terço.")], ["P3-04", "P3-08"])
q("p3-numerals", "quiz", "Qual destes numerais é ordinal?",
  ["Ordinal indica posição.", "Qual palavra responde “em que lugar”?"],
  ("quinto", "Correto. Quinto indica posição: o quinto da fila."),
  [("cinco", "Cinco indica quantidade: é cardinal."),
   ("quíntuplo", "Quíntuplo indica multiplicação: é multiplicativo."),
   ("um quinto", "Um quinto indica parte de um todo: é fracionário.")], ["P3-04"])
q("p3-numerals", "quiz", "“Comi um terço da pizza.” O numeral “um terço” indica:",
  ["A pizza foi dividida.", "Pense em parte de um todo."],
  ("Uma parte de um todo: fracionário.", "Correto. Um terço é uma das três partes iguais da pizza."),
  [("Uma quantidade inteira: cardinal.", "Cardinal seria “três pizzas”, por exemplo."),
   ("Uma posição: ordinal.", "Ordinal seria “a terceira pizza”."),
   ("Uma multiplicação: multiplicativo.", "Multiplicativo seria “o triplo de pizza”.")], ["P3-04"])
q("p3-numerals", "mock-a", "Leia: “Trinta crianças correram. Bia chegou em terceiro lugar e ganhou o dobro de medalhas do ano passado.” Qual é o numeral cardinal?",
  ["Cardinal indica quantidade.", "Qual palavra diz quantas crianças?"],
  ("trinta", "Correto. Trinta indica a quantidade de crianças."),
  [("terceiro", "Terceiro indica posição: é ordinal."),
   ("dobro", "Dobro indica multiplicação: é multiplicativo."),
   ("lugar", "Lugar não é numeral; é um substantivo.")], ["P3-04", "P3-07"])
q("p3-numerals", "mock-a", "Complete com um numeral ordinal: “Meu irmão está no ____ ano.”",
  ["O ano da escola indica uma ordem.", "Procure a palavra de posição."],
  ("segundo", "Correto. Segundo indica a ordem do ano escolar."),
  [("dois", "Dois é cardinal; indica quantidade."),
   ("duplo", "Duplo é multiplicativo."),
   ("metade", "Metade é fracionário.")], ["P3-08"])
q("p3-numerals", "mock-a", "Qual par está classificado corretamente?",
  ["Lembre: metade é parte de um todo.", "Confira cada par com a tabela dos quatro tipos."],
  ("metade — fracionário", "Correto. Metade indica parte de um todo."),
  [("dobro — ordinal", "Dobro é multiplicativo, não ordinal."),
   ("décimo — cardinal", "Décimo indica posição: é ordinal."),
   ("doze — multiplicativo", "Doze indica quantidade: é cardinal.")], ["P3-04", "P3-08"])
q("p3-numerals", "mock-b", "“O ônibus levou quarenta passageiros.” O numeral “quarenta” é:",
  ["Ele responde à pergunta “quantos?”.", "Quantidade é qual tipo?"],
  ("cardinal", "Correto. Quarenta indica a quantidade de passageiros."),
  [("ordinal", "Ordinal seria “quadragésimo”, uma posição."),
   ("multiplicativo", "Multiplicativo seria dobro, triplo…"),
   ("fracionário", "Fracionário seria metade, um terço…")], ["P3-04"])
q("p3-numerals", "mock-b", "Qual destes numerais é multiplicativo?",
  ["Multiplicativo indica quantas vezes.", "Qual palavra significa “duas vezes”?"],
  ("dobro", "Correto. Dobro significa duas vezes a quantidade."),
  [("dois", "Dois é cardinal."),
   ("segundo", "Segundo é ordinal."),
   ("meio", "Meio indica parte: é fracionário.")], ["P3-04"])
q("p3-numerals", "mock-b", "“Rafael ficou em 1º lugar.” Como se escreve 1º por extenso?",
  ["O símbolo º indica ordinal.", "Qual palavra mostra a primeira posição?"],
  ("primeiro", "Correto. 1º lê-se primeiro, um numeral ordinal."),
  [("um", "Um é cardinal; 1º indica posição."),
   ("único", "Único não é a leitura de 1º."),
   ("primo", "Primo é um parente, não um numeral.")], ["P3-04"])

# ---------- Algarismos romanos ----------
q("p3-roman", "quiz", "Quanto vale XXVI?",
  ["Separe: XX + VI.", "XX = 20 e VI = 6."],
  ("26", "Correto. XX (20) + VI (6) = 26."),
  [("24", "24 seria XXIV; aqui o I vem depois do V, então soma."),
   ("31", "Não é 31: 31 se escreve XXXI."),
   ("16", "Não é 16: 16 se escreve XVI.")], ["P3-10"])
q("p3-roman", "quiz", "Como se escreve 9 em algarismos romanos?",
  ["9 é 1 a menos que 10.", "Símbolo menor antes do maior subtrai."],
  ("IX", "Correto. I antes de X subtrai: 10 − 1 = 9."),
  [("VIIII", "Não podemos repetir I quatro vezes seguidas."),
   ("XI", "XI vale 11: o I depois do X soma."),
   ("VIV", "VIV não é uma forma usada para escrever 9.")], ["P3-09"])
q("p3-roman", "quiz", "Em “Dom João VI”, que número aparece no nome?",
  ["V vale 5.", "O I depois do V soma."],
  ("6", "Correto. VI = 5 + 1 = 6: Dom João foi o sexto rei com esse nome em Portugal."),
  [("4", "4 seria IV, com o I antes do V."),
   ("5", "Não é 5: 5 se escreve apenas V."),
   ("7", "Não é 7: 7 se escreve VII.")], ["P3-10"])
q("p3-roman", "mock-a", "Quanto vale LX?",
  ["L = 50.", "O X vem depois do L: soma ou subtrai?"],
  ("60", "Correto. L (50) + X (10) = 60."),
  [("40", "40 seria XL, com o X antes do L."),
   ("15", "L não vale 5; L vale 50."),
   ("510", "Não se juntam os algarismos como no nosso sistema; somamos 50 + 10.")], ["P3-10"])
q("p3-roman", "mock-a", "A que século corresponde o número XXI?",
  ["XX = 20.", "Depois vem I = 1."],
  ("Século 21", "Correto. XXI = 20 + 1 = 21. É o século em que vivemos."),
  [("Século 19", "Século 19 seria XIX."),
   ("Século 22", "Século 22 seria XXII."),
   ("Século 12", "Século 12 seria XII.")], ["P3-10"])
q("p3-roman", "mock-a", "Qual afirmação sobre algarismos romanos é verdadeira?",
  ["Lembre quais símbolos podem se repetir.", "Confira o valor de cada símbolo."],
  ("V, L e D não se repetem.", "Correto. Só I, X, C e M podem se repetir, até três vezes."),
  [("I pode ser repetido quatro vezes seguidas.", "O limite é três vezes: III."),
   ("IV representa o número 6.", "IV representa 4; 6 é VI."),
   ("X representa o número 5.", "X representa 10; 5 é V.")], ["P3-10"])
q("p3-roman", "mock-b", "Como se escreve 35 em algarismos romanos?",
  ["35 = 30 + 5.", "30 = XXX e 5 = V."],
  ("XXXV", "Correto. XXX (30) + V (5) = 35."),
  [("XXV", "XXV vale 25, não 35."),
   ("VXXX", "O V antes do X não forma 35; a ordem está errada."),
   ("XXXIIIII", "Não podemos repetir I mais de três vezes.")], ["P3-09"])
q("p3-roman", "mock-b", "Quanto vale XLV?",
  ["Separe: XL + V.", "XL = 50 − 10."],
  ("45", "Correto. XL (40) + V (5) = 45."),
  [("55", "55 seria LV; aqui o X vem antes do L e subtrai."),
   ("65", "Não é 65: 65 se escreve LXV."),
   ("35", "Não é 35: 35 se escreve XXXV.")], ["P3-10"])
q("p3-roman", "mock-b", "Quando um símbolo menor vem antes de um maior, como em IV, o que fazemos?",
  ["Pense em IV = 4.", "4 é maior ou menor que 5?"],
  ("Subtraímos: 5 − 1 = 4.", "Correto. Menor antes do maior subtrai."),
  [("Somamos: 5 + 1 = 6.", "Somamos quando o menor vem depois: VI = 6."),
   ("Multiplicamos: 5 × 1 = 5.", "Algarismos romanos não usam multiplicação."),
   ("Ignoramos o símbolo menor.", "O símbolo menor muda o valor; não pode ser ignorado.")], ["P3-10"])

# ---------- Tonicidade ----------
q("p3-stress", "quiz", "Como separar e classificar a palavra “sabiá”?",
  ["Fale a palavra chamando: sa-bi-Á!", "Qual sílaba sai mais forte?"],
  ("sa-bi-á — oxítona", "Correto. A tônica é a última sílaba (á): oxítona."),
  [("sa-bi-á — paroxítona", "Paroxítona teria a tônica em “bi”, a penúltima."),
   ("sab-iá — oxítona", "A separação está errada: são três sílabas, sa-bi-á."),
   ("sa-bi-á — proparoxítona", "Proparoxítona teria a tônica em “sa”, a antepenúltima.")], ["P3-08"])
q("p3-stress", "quiz", "Qual grupo tem apenas palavras proparoxítonas?",
  ["Proparoxítonas têm a tônica na antepenúltima sílaba.", "Toda proparoxítona tem acento."],
  ("pássaro, árvore, sílaba", "Correto. PÁS-sa-ro, ÁR-vo-re, SÍ-la-ba: tônica na antepenúltima."),
  [("caneta, livro, mesa", "São paroxítonas: ca-NE-ta, LI-vro, ME-sa."),
   ("sofá, café, jiló", "São oxítonas: tônica na última sílaba."),
   ("lápis, médico, cipó", "Grupo misturado: lápis é paroxítona e cipó é oxítona.")], ["P3-09"])
q("p3-stress", "quiz", "O que é a sílaba tônica?",
  ["Fale “caderno” devagar.", "Uma sílaba sai com mais força."],
  ("A sílaba pronunciada com mais força.", "Correto. A tônica é a sílaba falada com mais intensidade."),
  [("Sempre a primeira sílaba da palavra.", "Nem sempre: em café, a tônica é a última."),
   ("Só a sílaba que tem acento gráfico.", "Caderno não tem acento, mas tem tônica: DER."),
   ("A última letra da palavra.", "A tônica é uma sílaba, não uma letra.")], ["P3-08"])
q("p3-stress", "mock-a", "Como separar e classificar a palavra “tomate”?",
  ["Fale chamando: to-MA-te!", "Conte as sílabas do fim para o começo."],
  ("to-ma-te — paroxítona", "Correto. A tônica é “ma”, a penúltima: paroxítona."),
  [("to-ma-te — oxítona", "Oxítona teria a tônica em “te”, e não é assim que falamos."),
   ("tom-a-te — paroxítona", "A separação está errada: to-ma-te."),
   ("to-ma-te — proparoxítona", "Proparoxítona teria a tônica em “to”.")], ["P3-08"])
q("p3-stress", "mock-a", "Qual destas palavras é oxítona?",
  ["Oxítona tem a tônica na última sílaba.", "Fale cada palavra em voz alta."],
  ("abacaxi", "Correto. a-ba-ca-XI: tônica na última sílaba."),
  [("lápis", "LÁ-pis é paroxítona."),
   ("árvore", "ÁR-vo-re é proparoxítona."),
   ("janela", "ja-NE-la é paroxítona.")], ["P3-09"])
q("p3-stress", "mock-a", "O que é verdade sobre as palavras proparoxítonas?",
  ["Pense em música, lâmpada, médico.", "O que essas palavras têm em comum na escrita?"],
  ("Todas têm acento gráfico, como lâmpada e música.", "Correto. Toda proparoxítona é acentuada."),
  [("Terminam sempre em sílaba tônica.", "Isso descreve as oxítonas."),
   ("Têm sempre só duas sílabas.", "Precisam de pelo menos três sílabas."),
   ("Nunca recebem acento.", "É o contrário: todas recebem acento.")], ["P3-09"])
q("p3-stress", "mock-b", "Como separar e classificar a palavra “relâmpago”?",
  ["O acento ajuda a achar a tônica.", "Conte do fim: go (1), pa (2), lâm (3)."],
  ("re-lâm-pa-go — proparoxítona", "Correto. A tônica “lâm” é a antepenúltima sílaba."),
  [("re-lâm-pa-go — paroxítona", "Paroxítona teria a tônica em “pa”."),
   ("rel-âm-pa-go — proparoxítona", "A separação está errada: re-lâm-pa-go."),
   ("re-lâm-pa-go — oxítona", "Oxítona teria a tônica em “go”.")], ["P3-08"])
q("p3-stress", "mock-b", "Qual grupo tem apenas palavras paroxítonas?",
  ["Paroxítona: tônica na penúltima sílaba.", "Fale cada palavra do grupo."],
  ("bola, caderno, fácil", "Correto. BO-la, ca-DER-no, FÁ-cil: tônica na penúltima."),
  [("boné, ônibus, mesa", "Grupo misturado: boné é oxítona e ônibus é proparoxítona."),
   ("sofá, Pará, você", "São oxítonas: tônica na última sílaba."),
   ("sábado, mágico, médico", "São proparoxítonas.")], ["P3-09"])
q("p3-stress", "mock-b", "Em “coração”, qual é a sílaba tônica e como a palavra se classifica?",
  ["Separe: co-ra-ção.", "Fale chamando: co-ra-ÇÃO!"],
  ("ção, por isso é oxítona.", "Correto. A tônica é a última sílaba: co-ra-ÇÃO."),
  [("ra, por isso é paroxítona.", "“Ra” é a penúltima, mas não é a mais forte."),
   ("co, por isso é proparoxítona.", "“Co” é a antepenúltima, mas não é a mais forte."),
   ("A palavra não tem sílaba tônica.", "Toda palavra com mais de uma sílaba tem uma tônica.")], ["P3-08", "P3-09"])

PRACTICE = [
    ("p3-reading", "Leia: “Na corrida da escola, participaram quinze crianças. Júlia chegou em segundo lugar e ganhou uma medalha. No caminho de volta, dividiu metade do lanche com o amigo.” Responda: quantas crianças participaram? Em que lugar Júlia chegou? O que ela fez no caminho de volta? Depois, retire do texto um numeral ordinal.",
     "Participaram quinze crianças. Júlia chegou em segundo lugar. No caminho de volta, dividiu metade do lanche com o amigo. Numeral ordinal retirado do texto: segundo.", ["P3-01", "P3-07"]),
    ("p3-tenses", "Reescreva no futuro: “Os alunos plantaram mudas e regaram a horta.” Depois escreva uma frase no presente usando a palavra “hoje” e circule o verbo.",
     "Os alunos plantarão mudas e regarão a horta. Exemplo no presente: “Hoje eu leio um livro.” (verbo: leio). Outras frases no presente também valem.", ["P3-02", "P3-05"]),
    ("p3-eu-mim", "Explique com suas palavras quando usamos EU e quando usamos MIM. Depois complete: “O bilhete é para ___.” e “O bilhete é para ___ ler.”",
     "Usamos EU quando o pronome faz a ação de um verbo (eu leio; para eu ler). Usamos MIM depois de preposições como para, de, por e entre, quando não há verbo que eu realize. Respostas: “O bilhete é para mim.” e “O bilhete é para eu ler.”", ["P3-03", "P3-07"]),
    ("p3-numerals", "Escreva uma frase com cada tipo de numeral: cardinal, ordinal, multiplicativo e fracionário. Sublinhe o numeral em cada frase.",
     "Exemplos: “Tenho sete lápis.” (cardinal) “Fiquei em quarto lugar.” (ordinal) “Meu irmão comeu o dobro de pipoca.” (multiplicativo) “Bebi metade do suco.” (fracionário). Outras frases valem se o numeral estiver correto.", ["P3-04", "P3-08"]),
    ("p3-roman", "Escreva em algarismos romanos: 8, 19, 33 e 44. Depois escreva o valor de XXIX e de LV. Explique por que IV vale 4.",
     "8 = VIII; 19 = XIX; 33 = XXXIII; 44 = XLIV. XXIX = 29; LV = 55. IV vale 4 porque o I (menor) vem antes do V (maior), então subtraímos: 5 − 1 = 4.", ["P3-09", "P3-10"]),
    ("p3-stress", "Separe as sílabas, sublinhe a sílaba tônica e classifique: sapato, picolé, pássaro, chocolate, Paraná.",
     "sa-PA-to: paroxítona. pi-co-LÉ: oxítona. PÁS-sa-ro: proparoxítona. cho-co-LA-te: paroxítona. Pa-ra-NÁ: oxítona.", ["P3-08", "P3-09"]),
]

INFOGRAPHICS = [
    {"src": "/infographics/portugues3-verbos.png", "alt": "Tempos verbais na linha do tempo e quando usar eu ou mim", "width": 1024, "height": 1536, "label": "Verbos e pronomes", "lessons": ["p3-tenses", "p3-eu-mim"]},
    {"src": "/infographics/portugues3-numerais.png", "alt": "Numerais cardinais, ordinais, multiplicativos e fracionários e algarismos romanos", "width": 1024, "height": 1536, "label": "Numerais", "lessons": ["p3-numerals", "p3-roman"]},
    {"src": "/infographics/portugues3-tonicidade.png", "alt": "Sílaba tônica: oxítonas, paroxítonas e proparoxítonas", "width": 1024, "height": 1536, "label": "Tonicidade", "lessons": ["p3-stress"]},
]


def build():
    titles = {l["id"]: l["title"] for l in LESSONS}
    questions = []
    counters = {"quiz": 0, "mock-a": 0, "mock-b": 0}
    base = {"quiz": 3500, "mock-a": 3600, "mock-b": 3700}
    for lesson, pool, prompt, hints, right, wrongs, refs in Q:
        i = counters[pool]
        counters[pool] += 1
        pos = (i + {"quiz": 0, "mock-a": 1, "mock-b": 2}[pool]) % 4
        opts = list(wrongs)
        opts.insert(pos, right)
        letters = "abcd"
        questions.append({
            "id": base[pool] + i, "topic": titles[lesson], "pool": pool,
            "prompt": prompt, "support": "Leia com atenção e use as dicas da aula.",
            "hints": hints, "correct": letters[pos],
            "options": [{"id": letters[k], "label": o[0], "explanation": o[1]} for k, o in enumerate(opts)],
            "sourceRefs": refs,
        })
    subject = {
        "key": "portuguese", "name": "Português", "icon": "📝", "eyebrow": "PORTUGUÊS • III TRIMESTRE",
        "title": "Verbos, números e sílabas",
        "description": "6 aulas • leitura, tempos verbais, eu e mim, numerais, algarismos romanos e tonicidade.",
        "assessmentDate": "", "quizId": "portuguese3-general",
        "lessons": [{k: v for k, v in l.items() if k != "deep"} for l in LESSONS],
    }
    deep = {l["id"]: l["deep"] for l in LESSONS}
    practice = [{"lesson": l, "prompt": p, "answer": a, "sourceRefs": r} for l, p, a, r in PRACTICE]
    content = {"subject": subject, "questions": questions, "practice": practice, "infographics": INFOGRAPHICS, "deepStudy": deep}
    (ROOT / "app/portuguese3-content.json").write_text(json.dumps(content, ensure_ascii=False, indent=1) + "\n")
    sources = {"term": 3, "sources": [{"id": i, "title": t, "section": s, "page": p} for i, t, s, p in SOURCES]}
    (ROOT / "app/portuguese3-sources.json").write_text(json.dumps(sources, ensure_ascii=False, indent=1) + "\n")
    print(f"{len(questions)} questões, {len(practice)} atividades escritas")


if __name__ == "__main__":
    build()
