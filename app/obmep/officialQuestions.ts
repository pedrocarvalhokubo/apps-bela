export type ThemeId =
  | "geometria"
  | "aritmetica"
  | "logica"
  | "tempo"
  | "percurso"
  | "combinatoria"
  | "numerico"
  | "medidas"
  | "graficos";

export type LevelId = "m1" | "m2";

export type OfficialQuestion = {
  id: string;
  theme: ThemeId;
  year: number;
  phase: 1 | 2;
  level: LevelId;
  number: number;
  answer: number;
  questionImage: string;
  solutionImages: string[];
  altText: string;
  hints: [string, string, string];
};

export const officialQuestions: OfficialQuestion[] = [
  {
    "id": "2023-f1-m1-q01",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 1,
    "answer": 2,
    "questionImage": "/obmep/2023-f1-m1-q01.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q01-s1.webp"
    ],
    "altText": "1. QUAL DAS FRUTAS DA FEIRA APARECE EM QUANTIDADE DIFERENTE DAS OUTRAS? ABACAXI BANANA LARANJA MAÇÃ PERA",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f1-m1-q02",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 2,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m1-q02.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q02-s1.webp"
    ],
    "altText": "3 4 5 6 7 2. OLHE PARA AS PLACAS DE TRÂNSITO AO LADO. QUANTAS PLACAS TÊM A FORMA DE UM CÍRCULO, MAS NÃO TÊM NENHUMA SETA?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f1-m1-q03",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 3,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m1-q03.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q03-s1.webp"
    ],
    "altText": "30 33 34 36 39 3. CADA TANGERINA QUE DANIEL ABRIU TINHA 9 GOMOS E CADA GOMO TINHA 2 SEMENTES. SE DANIEL ABRIU 2 TANGERINAS, QUANTAS SEMENTES ELE ENCONTROU NO TOTAL?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f1-m1-q04",
    "theme": "geometria",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 4,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m1-q04.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q04-s1.webp",
      "/obmep/2023-f1-m1-q04-s2.webp"
    ],
    "altText": "2 3 4 5 6 4. JOÃO RECORTOU BANDEIRINHAS EM FORMA DE TRIÂNGULO PARA A FESTA JUNINA DA ESCOLA, DEPOIS COLOU AS BANDEIRINHAS EM UMA LINHA, COMO MOSTRADO NA FIGURA. QUANDO JOÃO ESTICAR ESSA LINHA, QUANTAS BANDEIRINHAS TRIANGULARES APONTARÃO PARA ELE?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f1-m1-q05",
    "theme": "geometria",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 5,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m1-q05.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q05-s1.webp"
    ],
    "altText": "8 9 10 11 12 5. MARCELA CANTOU UMA MÚSICA COMO INDICADO NA FIGURA. ELA SE ESQUECEU DE CANTAR 2 NÚMEROS QUE ESTÃO ENTRE 1 E 10. QUAL É A SOMA DESSES NÚMEROS?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f1-m1-q06",
    "theme": "geometria",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 6,
    "answer": 2,
    "questionImage": "/obmep/2023-f1-m1-q06.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q06-s1.webp"
    ],
    "altText": "6. QUAL FIGURA DEVE SER COLOCADA NA CASA COM PONTO DE INTERROGAÇÃO PARA QUE, EM CADA LINHA E EM CADA COLUNA DO QUADRICULADO, HAJA UM PAR DE TRIÂNGULOS, UM PAR DE RETÂNGULOS E UM PAR DE ESTRELAS? ?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f1-m1-q07",
    "theme": "medidas",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 7,
    "answer": 4,
    "questionImage": "/obmep/2023-f1-m1-q07.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q07-s1.webp"
    ],
    "altText": "7. TODOS OS CAMINHOS AO LADO FORAM FEITOS EM UM MESMO QUADRICULADO. QUAL DELES TEM O MAIOR COMPRIMENTO? A B C D E A B C D E",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2023-f1-m1-q08",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 8,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m1-q08.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q08-s1.webp"
    ],
    "altText": "8. OLHE O CARTAZ AO LADO COM OS ANIVERSARIANTES DA SALA DA PROFESSORA ALINE. QUANTAS CRIANÇAS FAZEM ANIVERSÁRIO NO MÊS ANTERIOR AO MÊS EM QUE ISABEL NASCEU? 1 2 3 4 5 DEZEMBRO RUI LEONARDO TOMAS PAULO AGOSTO LUZIA FELIPE ABRIL NOVEMBRO ROGER RENAN JULHO MARÇO CRISTINA MARIA OUTUBRO MAURICIO AGNALDO JUNHO PEDRO OTO WAGNER FEVEREIRO LEANDRO JOSÉ ANA SETEMBRO ANDRÉ ARTHUR ZULEICA MAIO SOFIA JOSEFA ELISA JANEIRO ISABEL",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f1-m1-q09",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 9,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m1-q09.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q09-s1.webp",
      "/obmep/2023-f1-m1-q09-s2.webp"
    ],
    "altText": "9. LEONARDO FEZ AS 3 CONTAS INDICADAS PELAS FLECHAS E FOI ESCREVENDO OS RESULTADOS NOS QUADRADINHOS. QUE NÚMERO ELE ESCREVEU NO ÚLTIMO QUADRADINHO? 13 15 17 26 29 + 5 10 + 15 ̶ 4",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f1-m1-q10",
    "theme": "numerico",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 10,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m1-q10.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q10-s1.webp"
    ],
    "altText": "10. O PAI DE MARCOS COMPROU, EM UMA LOJA DE MATERIAIS DE CONSTRUÇÃO, OS TRÊS ALGARISMOS ABAIXO PARA IDENTIFICAR O NÚMERO DA CASA ONDE ELES MORAM. QUAL DOS NÚMEROS ABAIXO NÃO PODE SER O NÚMERO DA CASA DELES? 193 631 361 169 913",
    "hints": [
      "Observe os algarismos, a ordem dos números e qualquer padrão que se repita.",
      "Compare o que muda de um número para o seguinte e teste a regra nos primeiros exemplos.",
      "Aplique a mesma regra até a posição pedida e confira se ela funciona em toda a sequência."
    ]
  },
  {
    "id": "2023-f1-m1-q11",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 11,
    "answer": 2,
    "questionImage": "/obmep/2023-f1-m1-q11.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q11-s1.webp"
    ],
    "altText": "3 BOLINHAS 4 BOLINHAS 5 BOLINHAS 6 BOLINHAS 9 BOLINHAS 11. OLHE O QUE DIZEM OS 4 AMIGOS. QUANTAS BOLINHAS SAMUEL TEM?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f1-m1-q12",
    "theme": "tempo",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 12,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m1-q12.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q12-s1.webp"
    ],
    "altText": "15 MINUTOS 30 MINUTOS 45 MINUTOS 55 MINUTOS 75 MINUTOS 12. A FIGURA MOSTRA O RELÓGIO DO GINÁSIO DE ESPORTES ANTES DE UM JOGO COMEÇAR. ESSE JOGO VAI COMEÇAR ÀS 4 HORAS E 5 MINUTOS. QUANTOS MINUTOS FALTAM PARA O INÍCIO DO JOGO?",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2023-f1-m1-q13",
    "theme": "geometria",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 13,
    "answer": 1,
    "questionImage": "/obmep/2023-f1-m1-q13.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q13-s1.webp",
      "/obmep/2023-f1-m1-q13-s2.webp"
    ],
    "altText": "13. QUAL MOEDA DEVE SER LEVADA DE UM QUADRADO PARA OUTRO PARA QUE O VALOR TOTAL DAS MOEDAS NOS DOIS QUADRADOS SEJA O MESMO?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f1-m1-q14",
    "theme": "medidas",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 14,
    "answer": 2,
    "questionImage": "/obmep/2023-f1-m1-q14.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q14-s1.webp"
    ],
    "altText": "18 20 22 24 26 14. DÉBORA TEM DUAS CAIXAS IGUAIS. ELA EMPILHA ESSAS DUAS CAIXAS DE TRÊS MANEIRAS DIFERENTES E MEDE A ALTURA DAS PILHAS, CONFORME MOSTRADO NA FIGURA. QUANTOS CENTÍMETROS DE ALTURA TEM A TERCEIRA PILHA? 10 cm 16 cm ?",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2023-f1-m1-q15",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m1",
    "number": 15,
    "answer": 2,
    "questionImage": "/obmep/2023-f1-m1-q15.webp",
    "solutionImages": [
      "/obmep/2023-f1-m1-q15-s1.webp"
    ],
    "altText": "4 5 6 7 8 15. IRENE TEM TRÊS TIPOS DE ERVAS PARA FAZER SEU CHÁ. ÀS VEZES ELA USA SOMENTE UM TIPO DE ERVA, ÀS VEZES ELA MISTURA DOIS TIPOS DE ERVAS. QUANTOS TIPOS DIFERENTES DE CHÁ ELA CONSEGUE PREPARAR?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f1-m2-q01",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 1,
    "answer": 4,
    "questionImage": "/obmep/2023-f1-m2-q01.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q01-s1.webp"
    ],
    "altText": "1. QUAL DAS CONTAS A SEGUIR TEM O MAIOR RESULTADO? 2 + 0 + 2 + 3 20 + 2 + 3 2 + 0 + 23 20 + 23 202 + 3",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f1-m2-q02",
    "theme": "geometria",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 2,
    "answer": 0,
    "questionImage": "/obmep/2023-f1-m2-q02.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q02-s1.webp"
    ],
    "altText": "AS FIGURAS SE REPETEM DE 4 EM 4. QUAIS SÃO AS PRÓXIMAS 3 FIGURAS DA FILA DE VALENTINA? 2. VALENTINA COMEÇOU A MONTAR UMA FILA COM FIGURAS GEOMÉTRICAS. ESSAS SÃO AS 9 PRIMEIRAS FIGURAS:",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f1-m2-q03",
    "theme": "geometria",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 3,
    "answer": 2,
    "questionImage": "/obmep/2023-f1-m2-q03.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q03-s1.webp"
    ],
    "altText": "1 2 3 4 5 3. MARÍLIA CARIMBOU COM TINTA SUAS MÃOS EM UMA FOLHA DE PAPEL E O RESULTADO FICOU COMO NA FIGURA AO LADO. QUANTAS VEZES ELA CARIMBOU SUA MÃO ESQUERDA?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f1-m2-q04",
    "theme": "geometria",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 4,
    "answer": 4,
    "questionImage": "/obmep/2023-f1-m2-q04.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q04-s1.webp"
    ],
    "altText": "269 258 348 368 268 4. O ÁBACO DA FIGURA REPRESENTA O NÚMERO 369. QUAL DOS NÚMEROS ABAIXO PODEMOS OBTER RETIRANDO EXATAMENTE DUAS DE SUAS PEÇAS?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f1-m2-q05",
    "theme": "graficos",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 5,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m2-q05.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q05-s1.webp",
      "/obmep/2023-f1-m2-q05-s2.webp"
    ],
    "altText": "8 9 10 11 12 5. A TABELA A SEGUIR MOSTRA O NÚMERO DE MENINOS E MENINAS EM DUAS SALAS, MAS O NÚMERO DE MENINOS DA SALA 2 ESTÁ APAGADO. AS DUAS SALAS TÊM O MESMO NÚMERO DE ESTUDANTES. QUANTOS MENINOS HÁ NA SALA 2? SALA 1 SALA 2 MENINAS 8 6 MENINOS 9",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2023-f1-m2-q06",
    "theme": "tempo",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 6,
    "answer": 2,
    "questionImage": "/obmep/2023-f1-m2-q06.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q06-s1.webp"
    ],
    "altText": "6. MÔNICA DISSE: — HOJE É DIA 15 E AMANHÃ SERÁ SEXTA-FEIRA! MAGALI RESPONDEU: — QUE LEGAL, MEU ANIVERSÁRIO SERÁ NA PRÓXIMA QUARTA-FEIRA. EM QUE DIA DO MÊS MAGALI FAZ ANIVERSÁRIO? 19 20 21 22 23",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2023-f1-m2-q07",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 7,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m2-q07.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q07-s1.webp"
    ],
    "altText": "7. EM QUAL DOS COLARES A SEGUIR UM TERÇO DAS MIÇANGAS É DA COR PRETA?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f1-m2-q08",
    "theme": "medidas",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 8,
    "answer": 4,
    "questionImage": "/obmep/2023-f1-m2-q08.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q08-s1.webp"
    ],
    "altText": "8. OBSERVE AS BALANÇAS DE 2 PRATOS DA FIGURA. QUAL BOLINHA É A MAIS PESADA?",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2023-f1-m2-q09",
    "theme": "numerico",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 9,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m2-q09.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q09-s1.webp",
      "/obmep/2023-f1-m2-q09-s2.webp"
    ],
    "altText": "9. JANAÍNA ESCOLHE DOIS ALGARISMOS DO NÚMERO 1023 E, EM SEGUIDA, MULTIPLICA ESSES DOIS ALGARISMOS. QUANTOS RESULTADOS DIFERENTES ELA PODE OBTER? 1 2 3 4 6",
    "hints": [
      "Observe os algarismos, a ordem dos números e qualquer padrão que se repita.",
      "Compare o que muda de um número para o seguinte e teste a regra nos primeiros exemplos.",
      "Aplique a mesma regra até a posição pedida e confira se ela funciona em toda a sequência."
    ]
  },
  {
    "id": "2023-f1-m2-q10",
    "theme": "geometria",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 10,
    "answer": 3,
    "questionImage": "/obmep/2023-f1-m2-q10.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q10-s1.webp"
    ],
    "altText": "10. VALENTINA OLHOU UMA PILHA DE CUBOS DE FRENTE: , DE LADO: E DE CIMA: . QUAL DAS SEGUINTES PILHAS É A QUE ELA OLHOU?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f1-m2-q11",
    "theme": "medidas",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 11,
    "answer": 2,
    "questionImage": "/obmep/2023-f1-m2-q11.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q11-s1.webp"
    ],
    "altText": "9 10 11 12 13 5 cm 8 cm ? 11. DÉBORA TEM DUAS CAIXAS IGUAIS. ELA EMPILHA ESSAS DUAS CAIXAS DE 3 MANEIRAS DIFERENTES E MEDE A ALTURA DAS PILHAS, CONFORME MOSTRADO NA FIGURA. QUANTOS CENTÍMETROS DE ALTURA TEM A TERCEIRA PILHA?",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2023-f1-m2-q12",
    "theme": "graficos",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 12,
    "answer": 4,
    "questionImage": "/obmep/2023-f1-m2-q12.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q12-s1.webp",
      "/obmep/2023-f1-m2-q12-s2.webp"
    ],
    "altText": "SEXTA-FEIRA SÁBADO DOMINGO SEXTA-FEIRA SÁBADO DOMINGO SEXTA-FEIRA SÁBADO DOMINGO SEXTA-FEIRA SÁBADO DOMINGO SEXTA-FEIRA SÁBADO DOMINGO 12. ARLINDO DESENHOU COPINHOS PARA MARCAR A QUANTIDADE DE COPOS DE ÁGUA QUE ELE BEBEU DEPOIS DE FAZER GINÁSTICA NA SEXTA, NO SÁBADO E NO DOMINGO. QUAL DOS GRÁFICOS ABAIXO REPRESENTA A QUANTIDADE DE COPOS DE ÁGUA QUE ARLINDO BEBEU? DIA MARCAÇÃO COM COPINHOS SEXTA-FEIRA SÁBADO DOMINGO",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2023-f1-m2-q13",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 13,
    "answer": 1,
    "questionImage": "/obmep/2023-f1-m2-q13.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q13-s1.webp"
    ],
    "altText": "1 2 3 4 5 13. DANIEL ABRIU UMA TANGERINA COM 9 GOMOS, CADA GOMO COM 2 OU 3 SEMENTES. APÓS ABRIR E COMER UMA TANGERINA, ELE RECOLHEU 20 SEMENTES. QUANTOS GOMOS DESSA TANGERINA TINHAM 3 SEMENTES?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f1-m2-q14",
    "theme": "geometria",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 14,
    "answer": 2,
    "questionImage": "/obmep/2023-f1-m2-q14.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q14-s1.webp"
    ],
    "altText": "21 27 30 36 37 14. NA RODA GIGANTE REPRESENTADA NA FIGURA, AS CABINES SÃO TODAS IGUALMENTE ESPAÇADAS E NUMERADAS EM 1, 2, 3 ETC. QUANDO A CABINE DE NÚMERO 6 ESTÁ NO PONTO MAIS BAIXO DA RODA GIGANTE, A CABINE DE NÚMERO 21 ESTÁ NO PONTO MAIS ALTO. NO TOTAL, QUANTAS CABINES TEM ESSA RODA GIGANTE? 21 6",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f1-m2-q15",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 1,
    "level": "m2",
    "number": 15,
    "answer": 4,
    "questionImage": "/obmep/2023-f1-m2-q15.webp",
    "solutionImages": [
      "/obmep/2023-f1-m2-q15-s1.webp"
    ],
    "altText": "6 8 9 10 11 15. IRENE USA 4 TIPOS DE ERVAS PARA FAZER SEU CHÁ: ERVA-CIDREIRA, ERVA-DOCE, ANIS OU HORTELÃ. ÀS VEZES ELA USA SOMENTE UM TIPO DE ERVA, ÀS VEZES ELA MISTURA 2 OU MAIS TIPOS DE ERVAS. ELA NÃO FAZ CHÁS COM ANIS E HORTELÃ JUNTOS. QUANTOS TIPOS DIFERENTES DE CHÁ ELA PODE PREPARAR?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f2-m1-q01",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 1,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m1-q01.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q01-s1.webp"
    ],
    "altText": "1. QUAL DOS QUADROS A SEGUIR TEM MAIS VOGAIS DO QUE CONSOANTES? A E C B T L E J A U D M E Z C D U V O B E G A U R A G S F I",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f2-m1-q02",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 2,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m1-q02.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q02-s1.webp"
    ],
    "altText": "9 10 12 16 18 2. UM DOS DINOSSAUROS DA FIGURA NÃO BOTOU OVOS E CADA UM DOS OUTROS BOTOU 2 OVOS. NO TOTAL, QUANTOS OVOS ELES BOTARAM?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m1-q03",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 3,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m1-q03.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q03-s1.webp"
    ],
    "altText": "3. QUAL DOS QUADRICULADOS TEM MAIS QUADRADINHOS PINTADOS?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m1-q04",
    "theme": "tempo",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 4,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m1-q04.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q04-s1.webp",
      "/obmep/2023-f2-m1-q04-s2.webp"
    ],
    "altText": "13 17 37 47 87 4. O RELÓGIO DA FIGURA ACABA DE MOSTRAR QUE SÃO 9h13. QUANTOS MINUTOS AINDA FALTAM PARA O RELÓGIO MARCAR 10h00?",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2023-f2-m1-q05",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 5,
    "answer": 2,
    "questionImage": "/obmep/2023-f2-m1-q05.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q05-s1.webp"
    ],
    "altText": "1 2 4 5 8 5. QUANTOS CÍRCULOS ESTÃO ENTRE O TERCEIRO QUADRADO E O QUINTO TRIÂNGULO?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m1-q06",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 6,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m1-q06.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q06-s1.webp"
    ],
    "altText": "6. QUAL DAS FIGURAS ABAIXO TEM MENOS MAÇÃS?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m1-q07",
    "theme": "medidas",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 7,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m1-q07.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q07-s1.webp"
    ],
    "altText": "5 CENTÍMETROS 10 CENTÍMETROS 11 CENTÍMETROS 13 CENTÍMETROS 18 CENTÍMETROS 7. QUAL É O COMPRIMENTO DA CANETA?",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2023-f2-m1-q08",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 8,
    "answer": 2,
    "questionImage": "/obmep/2023-f2-m1-q08.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q08-s1.webp"
    ],
    "altText": "VINTE E QUATRO DE MARÇO DE DOIS MIL E SETE. DOIS DE JULHO DE DOIS MIL E DEZESSETE. VINTE E QUATRO DE FEVEREIRO DE DOIS MIL E DEZESSETE. DEZESSETE DE FEVEREIRO DE DOIS MIL E VINTE E UM. SETE DE NOVEMBRO DE DOIS MIL E DOZE. 8. AS DATAS PODEM SER ESCRITAS COM NÚMEROS. POR EXEMPLO, 23/4/2015 É UMA MANEIRA DE ESCREVER O DIA VINTE E TRÊS DE ABRIL DE DOIS MIL E QUINZE, POIS ABRIL É O QUARTO MÊS DO ANO. JOSÉ ESCREVEU DE TRÁS PARA FRENTE A DATA DE SEU NASCIMENTO E FICOU ASSIM: 7102/2/42. EM QUE DIA JOSÉ NASCEU?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f2-m1-q09",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 9,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m1-q09.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q09-s1.webp",
      "/obmep/2023-f2-m1-q09-s2.webp"
    ],
    "altText": "10 15 20 25 30 9. EM VEZ DE ADICIONAR 10 A UM NÚMERO, MARIA SUBTRAIU 10 DESSE MESMO NÚMERO E OBTEVE 5 COMO RESULTADO. QUAL RESULTADO ELA TERIA OBTIDO SE TIVESSE FEITO A ADIÇÃO?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f2-m1-q10",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 10,
    "answer": 4,
    "questionImage": "/obmep/2023-f2-m1-q10.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q10-s1.webp"
    ],
    "altText": "10. MATEUS TEM AS SEGUINTES FIGURAS DE PAPEL: QUAL DAS SEGUINTES MONTAGENS ELE NÃO CONSEGUE FAZER COLOCANDO ESSAS FIGURAS UMAS SOBRE AS OUTRAS?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m1-q11",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 11,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m1-q11.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q11-s1.webp"
    ],
    "altText": "11. TIAGO PASSOU UM FIO POR ALGUNS BURACOS DE UMA PLACA. A FIGURA AO LADO MOSTRA A PLACA VISTA DE FRENTE. QUAL DAS ALTERNATIVAS MOSTRA A PLACA VISTA POR TRÁS?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m1-q12",
    "theme": "graficos",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 12,
    "answer": 1,
    "questionImage": "/obmep/2023-f2-m1-q12.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q12-s1.webp"
    ],
    "altText": "12. OS ALUNOS DO PRIMEIRO ANO DA ESCOLA DE JULIANA FORAM VISITAR UMA CHÁCARA. DEPOIS DO ALMOÇO, CADA CRIANÇA ESCOLHEU EXATAMENTE UMA FRUTA DE SOBREMESA. O GRÁFICO AO LADO MOSTRA QUANTOS ALUNOS ESCOLHERAM CADA FRUTA. QUANTOS ALUNOS FORAM VISITAR A CHÁCARA? 4 8 12 16 20 LARANJA ABACATE MAÇÃ 20 36 48 56 60",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2023-f2-m1-q13",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 13,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m1-q13.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q13-s1.webp",
      "/obmep/2023-f2-m1-q13-s2.webp"
    ],
    "altText": "1 2 3 4 5 13. JÚLIA E CARLOS TÊM, JUNTOS, AS FIGURINHAS AO LADO. CARLOS TEM 3 FIGURINHAS A MAIS DO QUE JÚLIA. QUANTAS FIGURINHAS JÚLIA TEM?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f2-m1-q14",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 14,
    "answer": 2,
    "questionImage": "/obmep/2023-f2-m1-q14.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q14-s1.webp",
      "/obmep/2023-f2-m1-q14-s2.webp"
    ],
    "altText": "14. PAULINHO DOBROU O CARTÃO AO LADO E OBTEVE O CUBO, CONFORME MOSTRADO NA FIGURA. QUAL É O DESENHO QUE ESTÁ NA FACE COM PONTO DE INTERROGAÇÃO? ?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m1-q15",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m1",
    "number": 15,
    "answer": 2,
    "questionImage": "/obmep/2023-f2-m1-q15.webp",
    "solutionImages": [
      "/obmep/2023-f2-m1-q15-s1.webp"
    ],
    "altText": "15. JOANA TEM MOEDAS DE 3 TIPOS DIFERENTES, QUE TÊM FIGURAS NAS SUAS DUAS FACES. ELA COLOCOU TODAS ESSAS MOEDAS SOBRE SOBRE A MESA. SEM QUE ELA VISSE, SEU IRMÃO MISTUROU AS MOEDAS, VIROU ALGUMAS DO LADO CONTRÁRIO E VOLTOU A COLOCAR AS MOEDAS SOBRE A MESA. UMA DAS ALTERNATIVAS ABAIXO MOSTRA COMO O IRMÃO DE JOANA COLOCOU AS MOEDAS NA MESA. QUAL É ESSA ALTERNATIVA? MOEDA 2 FRENTE VERSO MOEDA 1 FRENTE VERSO MOEDA 3 FRENTE VERSO",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m2-q01",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 1,
    "answer": 4,
    "questionImage": "/obmep/2023-f2-m2-q01.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q01-s1.webp"
    ],
    "altText": "2 + 0 + 2 – 3 20 X 2 + 3 2 X 0 X 23 20 + 23 202 – 3 1. QUAL DAS CONTAS ABAIXO TEM O MAIOR RESULTADO?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f2-m2-q02",
    "theme": "tempo",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 2,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m2-q02.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q02-s1.webp"
    ],
    "altText": "8 15 22 27 29 2. O DIA PRIMEIRO DE JULHO DE 2023 CAIU EM UM SÁBADO. DENTRE OS DIAS DESSE MÊS LISTADOS ABAIXO, QUAL NÃO CAIU EM UM SÁBADO?",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2023-f2-m2-q03",
    "theme": "tempo",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 3,
    "answer": 2,
    "questionImage": "/obmep/2023-f2-m2-q03.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q03-s1.webp"
    ],
    "altText": "2h55 3h05 3h15 3h25 3h35 3. O RELÓGIO DA FIGURA ESTÁ 10 MINUTOS ATRASADO. SE ELE NÃO ESTIVESSE ATRASADO, QUAL HORÁRIO ESTARIA MARCANDO? 12 1 3 2 4 5 6 7 8 9 10 11",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2023-f2-m2-q04",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 4,
    "answer": 2,
    "questionImage": "/obmep/2023-f2-m2-q04.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q04-s1.webp"
    ],
    "altText": "15 16 17 18 19 4. AS CASAS DAS DIAGONAIS DOS TABULEIROS ABAIXO FORAM PINTADAS DE PRETO. O TABULEIRO MAIOR ESTÁ PARCIALMENTE COBERTO POR UM TECIDO AZUL. QUANTOS QUADRADINHOS PRETOS FORAM PINTADOS NO TABULEIRO MAIOR?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f2-m2-q05",
    "theme": "logica",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 5,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m2-q05.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q05-s1.webp",
      "/obmep/2023-f2-m2-q05-s2.webp"
    ],
    "altText": "10 8 6 4 2 5. EM UM HOTEL, 20 QUARTOS ESTÃO LOCALIZADOS EM UM ÚNICO CORREDOR, 10 DE CADA LADO, COM PORTAS FRENTE A FRENTE. OS QUARTOS DE UM LADO SÃO IDENTIFICADOS COM NÚMEROS ÍMPARES EM ORDEM CRESCENTE E OS DO OUTRO LADO, COM NÚMEROS PARES EM ORDEM DECRESCENTE. QUAL QUARTO ESTÁ EM FRENTE AO QUARTO 17? 1 3",
    "hints": [
      "Não tente adivinhar. Releia cada condição e marque o que obrigatoriamente precisa acontecer.",
      "Teste uma alternativa por vez e veja se ela contradiz alguma informação do enunciado.",
      "Elimine os casos impossíveis. A resposta é a única possibilidade que respeita todas as condições."
    ]
  },
  {
    "id": "2023-f2-m2-q06",
    "theme": "graficos",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 6,
    "answer": 4,
    "questionImage": "/obmep/2023-f2-m2-q06.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q06-s1.webp"
    ],
    "altText": "6 12 14 16 20 6. A TABELA MOSTRA O NÚMERO DE MENINOS E MENINAS DA SALA 1 E SOMENTE O NÚMERO DE MENINOS DA SALA 2 DE UMA ESCOLA. O NÚMERO DE ESTUDANTES DA SALA 2 É O DOBRO DO NÚMERO DE ESTUDANTES DA SALA 1. QUAL É A QUANTIDADE DE MENINAS DA SALA 2? SALA 1 SALA 2 MENINAS 8 MENINOS 6 8",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2023-f2-m2-q07",
    "theme": "tempo",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 7,
    "answer": 1,
    "questionImage": "/obmep/2023-f2-m2-q07.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q07-s1.webp"
    ],
    "altText": "16h20 17h00 17h12 17h32 18h00 7. O TEMPO QUE MARIAZINHA LEVA PARA IR DE SUA CASA PARA A ESCOLA É O MESMO QUE ELA LEVA DA ESCOLA PARA CASA. A QUE HORAS MARIAZINHA CHEGOU EM CASA HOJE, SE ELA SAIU DA ESCOLA ÀS 15h32? ? IDA VOLTA",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2023-f2-m2-q08",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 8,
    "answer": 0,
    "questionImage": "/obmep/2023-f2-m2-q08.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q08-s1.webp"
    ],
    "altText": "1 2 3 5 6 8. NO DADO DA FIGURA, A SOMA DOS NÚMEROS EM FACES OPOSTAS SEMPRE É 7. A FACE DE CIMA ESTÁ COBERTA POR UM CARTÃO AZUL, MAS SABEMOS QUE ELA NÃO TEM UM NÚMERO PAR DE PONTOS. QUANTOS PONTOS HÁ NA FACE DE CIMA?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m2-q09",
    "theme": "numerico",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 9,
    "answer": 4,
    "questionImage": "/obmep/2023-f2-m2-q09.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q09-s1.webp",
      "/obmep/2023-f2-m2-q09-s2.webp"
    ],
    "altText": "23 28 32 36 37 9. MARIANA ESCREVEU EM SEU CADERNO TODOS OS NÚMEROS DE 2000 A 2023, INCLUINDO ESSES DOIS NÚMEROS. QUANTAS VEZES MARIANA ESCREVEU O ALGARISMO ZERO?",
    "hints": [
      "Observe os algarismos, a ordem dos números e qualquer padrão que se repita.",
      "Compare o que muda de um número para o seguinte e teste a regra nos primeiros exemplos.",
      "Aplique a mesma regra até a posição pedida e confira se ela funciona em toda a sequência."
    ]
  },
  {
    "id": "2023-f2-m2-q10",
    "theme": "numerico",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 10,
    "answer": 1,
    "questionImage": "/obmep/2023-f2-m2-q10.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q10-s1.webp"
    ],
    "altText": "1023 2023 7051 + 12 13 14 15 18 10. PEDRINHO FEZ UMA CONTA, MAS SEU IRMÃOZINHO DEIXOU CAIR PINGOS DE TINTA SOBRE O PAPEL. QUAL É A SOMA DOS ALGARISMOS QUE FORAM BORRADOS?",
    "hints": [
      "Observe os algarismos, a ordem dos números e qualquer padrão que se repita.",
      "Compare o que muda de um número para o seguinte e teste a regra nos primeiros exemplos.",
      "Aplique a mesma regra até a posição pedida e confira se ela funciona em toda a sequência."
    ]
  },
  {
    "id": "2023-f2-m2-q11",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 11,
    "answer": 0,
    "questionImage": "/obmep/2023-f2-m2-q11.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q11-s1.webp"
    ],
    "altText": "11. SETE CUBINHOS FORAM EMPILHADOS SOBRE UMA MESA. NA FIGURA, VEMOS 6 DELES, POIS UM CUBINHO FICOU ESCONDIDO ATRÁS DA PILHA. QUAL PODE SER A VISTA DE CIMA DESSES 7 CUBINHOS?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m2-q12",
    "theme": "aritmetica",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 12,
    "answer": 3,
    "questionImage": "/obmep/2023-f2-m2-q12.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q12-s1.webp",
      "/obmep/2023-f2-m2-q12-s2.webp",
      "/obmep/2023-f2-m2-q12-s3.webp"
    ],
    "altText": "12. OS 5 CARTÕES DEVEM SER COLOCADOS NAS 5 CASAS AO LADO. DOIS CARTÕES SÓ PODEM SER UNIDOS QUANDO OS LADOS EM CONTATO TIVEREM NÚMEROS IGUAIS. QUAL CARTÃO DEVE SER COLOCADO NA CASA CINZA? 1 1 1 2 1 1 1 6 1 1 3 2 1 5 6 1 5 9 1 3 1 1 1 2 1 1 1 6 1 1 3 2 1 5 6 1 5 9 1 3",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2023-f2-m2-q13",
    "theme": "geometria",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 13,
    "answer": 1,
    "questionImage": "/obmep/2023-f2-m2-q13.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q13-s1.webp",
      "/obmep/2023-f2-m2-q13-s2.webp"
    ],
    "altText": "13. PAULINHO DOBROU O CARTÃO AO LADO E OBTEVE O CUBO, CONFORME MOSTRADO NA FIGURA. QUAL É O DESENHO QUE ESTÁ NA FACE COM PONTO DE INTERROGAÇÃO? ?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2023-f2-m2-q14",
    "theme": "medidas",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 14,
    "answer": 4,
    "questionImage": "/obmep/2023-f2-m2-q14.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q14-s1.webp",
      "/obmep/2023-f2-m2-q14-s2.webp"
    ],
    "altText": "14. UM CUBO DE 2 CENTÍMETROS DE LADO FOI DIVIDIDO EM 4 PEÇAS IGUAIS. QUAL DAS ALTERNATIVAS ABAIXO PODE SER UMA DESSAS PEÇAS? 2 cm 2 cm 2 cm 2 cm 2 cm 2 cm 2 cm 2 cm 2 cm 2 cm 1 cm 1 cm 1 cm 1 cm 1 cm",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2023-f2-m2-q15",
    "theme": "numerico",
    "year": 2023,
    "phase": 2,
    "level": "m2",
    "number": 15,
    "answer": 2,
    "questionImage": "/obmep/2023-f2-m2-q15.webp",
    "solutionImages": [
      "/obmep/2023-f2-m2-q15-s1.webp"
    ],
    "altText": "10 11 12 13 14 15. NUMA PRATELEIRA, HÁ 6 LIVROS À ESQUERDA DO LIVRO MAIS GROSSO E 7 LIVROS À DIREITA DO LIVRO MAIS FINO. O LIVRO MAIS GROSSO E O LIVRO MAIS FINO ESTÃO AO LADO DO LIVRO MAIS VELHO. QUAL É O MENOR NÚMERO POSSÍVEL DE LIVROS NESSA PRATELEIRA?",
    "hints": [
      "Observe os algarismos, a ordem dos números e qualquer padrão que se repita.",
      "Compare o que muda de um número para o seguinte e teste a regra nos primeiros exemplos.",
      "Aplique a mesma regra até a posição pedida e confira se ela funciona em toda a sequência."
    ]
  },
  {
    "id": "2024-f1-m1-q01",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 1,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m1-q01.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q01-s1.webp"
    ],
    "altText": "1. A ABELHINHA VAI POUSAR NA FLOR COM MAIS PÉTALAS. QUAL É ESSA FLOR?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f1-m1-q02",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 2,
    "answer": 0,
    "questionImage": "/obmep/2024-f1-m1-q02.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q02-s1.webp"
    ],
    "altText": "2. CARLOS PRECISA DE UMA DAS PEÇAS ABAIXO PARA COMPLETAR O QUEBRA-CABEÇAS QUAL É ESSA PEÇA?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f1-m1-q03",
    "theme": "geometria",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 3,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m1-q03.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q03-s1.webp"
    ],
    "altText": "1 2 3 4 5 3. UM JOGO DE DOMINÓ COMPLETO TEM 28 PEÇAS, COMO MOSTRA A FIGURA. MARCELA SEPAROU TODAS AS PEÇAS COM 10 PONTOS NO TOTAL. QUANTAS PEÇAS ELA SEPAROU?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f1-m1-q04",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 4,
    "answer": 2,
    "questionImage": "/obmep/2024-f1-m1-q04.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q04-s1.webp",
      "/obmep/2024-f1-m1-q04-s2.webp"
    ],
    "altText": "4. SUZANA VAI MOVER A ESTRELA 4 CASAS PARA CIMA E 2 CASAS PARA A ESQUERDA. A ESTRELA VAI FICAR NA MESMA CASA DE QUAL PEÇA?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f1-m1-q05",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 5,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m1-q05.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q05-s1.webp"
    ],
    "altText": "16 18 20 22 24 5. MARIANA ESTAVA PULANDO CORDA E CONTANDO DE DOIS EM DOIS. NO 1º PULO ELA FALOU: — DOIS, NO 2º PULO ELA FALOU: — QUATRO, E ASSIM POR DIANTE. QUAL FOI O NÚMERO QUE ELA FALOU QUANDO DEU O 9º PULO? DOIS, QUATRO, SEIS, OITO, DEZ,...",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f1-m1-q06",
    "theme": "geometria",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 6,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m1-q06.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q06-s1.webp"
    ],
    "altText": "6. MARINA TEM UMA FOLHA DE PAPEL, BRANCA DE UM LADO E CINZA DO OUTRO. ELA DOBROU A FOLHA DUAS VEZES, CORTOU E RETIROU UM CANTINHO, COMO MOSTRA A FIGURA. COMO FICOU A FOLHA QUE MARINA CORTOU DEPOIS DE DESDOBRADA?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f1-m1-q07",
    "theme": "tempo",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 7,
    "answer": 2,
    "questionImage": "/obmep/2024-f1-m1-q07.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q07-s1.webp"
    ],
    "altText": "7. CARLOS SAIU DE CASA, CAMINHOU 15 MINUTOS E CHEGOU NO CAMPO DE FUTEBOL ÀS 9 HORAS DA MANHÃ. A QUE HORAS ELE SAIU DE CASA?",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2024-f1-m1-q08",
    "theme": "geometria",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 8,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m1-q08.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q08-s1.webp"
    ],
    "altText": "8. UM PAPEL QUADRICULADO TEM 5 FUROS QUADRADOS, QUE SÃO OS QUADRADINHOS EM BRANCO. A B C D E A B C D E QUANDO ESSE PAPEL FOR DOBRADO AO MEIO NA LINHA TRACEJADA, COMO SE FOSSE UM LIVRO SE FECHANDO, QUAL LETRA NÃO VAI FICAR VISÍVEL?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f1-m1-q09",
    "theme": "medidas",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 9,
    "answer": 3,
    "questionImage": "/obmep/2024-f1-m1-q09.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q09-s1.webp",
      "/obmep/2024-f1-m1-q09-s2.webp"
    ],
    "altText": "9. QUAL É A DIFERENÇA ENTRE OS COMPRIMENTOS DO LÁPIS E DO PINCEL? 11 CENTÍMETROS 5 CENTÍMETROS 3 CENTÍMETROS 2 CENTÍMETROS 1 CENTÍMETROS",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2024-f1-m1-q10",
    "theme": "percurso",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 10,
    "answer": 4,
    "questionImage": "/obmep/2024-f1-m1-q10.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q10-s1.webp"
    ],
    "altText": "10. UMA GALINHA, UM PATO E UM SAPO PERCORRERAM UM MESMO CAMINHO E DEIXARAM AS SUAS PEGADAS NO CHÃO. EM QUE ORDEM OS ANIMAIS PERCORRERAM ESSE CAMINHO? SAPO, GALINHA E PATO PATO, SAPO E GALINHA PATO, GALINHA E SAPO GALINHA, SAPO E PATO GALINHA, PATO E SAPO Galinha Pato Sapo",
    "hints": [
      "Acompanhe o caminho com o dedo e identifique o ponto de partida, o destino e as regras do percurso.",
      "Conte por etapas, anotando cada possibilidade para não repetir nem esquecer caminhos.",
      "Confira se todos os percursos contados obedecem às direções e restrições do enunciado."
    ]
  },
  {
    "id": "2024-f1-m1-q11",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 11,
    "answer": 0,
    "questionImage": "/obmep/2024-f1-m1-q11.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q11-s1.webp"
    ],
    "altText": "20 25 30 35 40 11. QUATRO LARANJAS CUSTAM 15 CENTAVOS A MAIS DO QUE UMA LARANJA. QUANTOS CENTAVOS CUSTAM QUATRO LARANJAS?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f1-m1-q12",
    "theme": "medidas",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 12,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m1-q12.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q12-s1.webp",
      "/obmep/2024-f1-m1-q12-s2.webp"
    ],
    "altText": "6 METROS 8 METROS 10 METROS 12 METROS 14 METROS 12. NA FIGURA, VEMOS UMA MESMA LOCOMOTIVA PUXANDO 2 OU 3 VAGÕES IGUAIS. O PRIMEIRO TREM TEM 28 METROS DE COMPRIMENTO NO TOTAL E O SEGUNDO TREM TEM 38 METROS DE COMPRIMENTO NO TOTAL QUAL É O COMPRIMENTO DA LOCOMOTIVA?",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2024-f1-m1-q13",
    "theme": "logica",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 13,
    "answer": 3,
    "questionImage": "/obmep/2024-f1-m1-q13.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q13-s1.webp"
    ],
    "altText": "MARCELO NUNCA VAI CHEGAR AO TESOURO. MARCELO PODE SER PEGO PELO PIRATA DEPOIS DAS 4 JOGADAS. MARCELO PODE TERMINAR O JOGO NA CASA 9. MARCELO PODE TERMINAR O JOGO NA CASA 6 ONDE COMEÇOU. MARCELO PODE TERMINAR O JOGO NA CASA 5. 13. NO JOGO DO PIRATA, A PEÇA DE MARCELO ESTÁ NA CASA DE NÚMERO 6. ELE JOGA UMA MOEDA; SE SAIR CARA, ANDA COM A PEÇA UMA CASA PARA A DIREITA, SE SAIR COROA, VOLTA UMA CASA PARA A ESQUERDA. ELE PODE JOGAR SÓ MAIS 4 VEZES PARA TENTAR CHEGAR COM A PEÇA ATÉ O TESOURO. O QUE PODEMOS DIZER COM CERTEZA? 1 0 2 3 4 5 6 7 8 9 10",
    "hints": [
      "Não tente adivinhar. Releia cada condição e marque o que obrigatoriamente precisa acontecer.",
      "Teste uma alternativa por vez e veja se ela contradiz alguma informação do enunciado.",
      "Elimine os casos impossíveis. A resposta é a única possibilidade que respeita todas as condições."
    ]
  },
  {
    "id": "2024-f1-m1-q14",
    "theme": "numerico",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 14,
    "answer": 4,
    "questionImage": "/obmep/2024-f1-m1-q14.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q14-s1.webp"
    ],
    "altText": "5 10 15 20 25 14. QUANTOS SÃO OS NÚMEROS DE 2 ALGARISMOS QUE TÊM A DEZENA ÍMPAR E A UNIDADE PAR?",
    "hints": [
      "Observe os algarismos, a ordem dos números e qualquer padrão que se repita.",
      "Compare o que muda de um número para o seguinte e teste a regra nos primeiros exemplos.",
      "Aplique a mesma regra até a posição pedida e confira se ela funciona em toda a sequência."
    ]
  },
  {
    "id": "2024-f1-m1-q15",
    "theme": "tempo",
    "year": 2024,
    "phase": 1,
    "level": "m1",
    "number": 15,
    "answer": 4,
    "questionImage": "/obmep/2024-f1-m1-q15.webp",
    "solutionImages": [
      "/obmep/2024-f1-m1-q15-s1.webp",
      "/obmep/2024-f1-m1-q15-s2.webp"
    ],
    "altText": "ALCEU BRUNO CÉLIO DAVI ERNESTO 15. CINCO AMIGOS ESTAVAM JUNTOS DURANTE AS FÉRIAS E SE ESQUECERAM EM QUE DIA DA SEMANA ESTAVAM. AO TENTAR DESCOBRIR QUE DIA ERA, CADA UM DELES DISSE O SEGUINTE: ALCEU: “ONTEM FOI QUARTA-FEIRA”. BRUNO: “AMANHÃ SERÁ SEXTA-FEIRA”. CÉLIO: “ANTEONTEM FOI TERÇA-FEIRA”. DAVI: “DEPOIS DE AMANHÃ SERÁ SÁBADO”. ERNESTO: “HOJE É SEGUNDA-FEIRA”. APENAS UM DOS AMIGOS ESTAVA ERRADO. QUAL DELES ERROU?",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2024-f1-m2-q01",
    "theme": "medidas",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 1,
    "answer": 3,
    "questionImage": "/obmep/2024-f1-m2-q01.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q01-s1.webp"
    ],
    "altText": "1. JOANA COLOCOU 1 TIJOLO EM UM PRATO DA BALANÇA E NO OUTRO PRATO COLOCOU MEIO TIJOLO JUNTO COM 1 QUILO. A BALANÇA FICOU EQUILIBRADA, COMO MOSTRA A FIGURA. QUANTO PESA UM TIJOLO INTEIRO? MEIO QUILO 1 QUILO 1 QUILO E MEIO 2 QUILOS 4 QUILOS",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2024-f1-m2-q02",
    "theme": "combinatoria",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 2,
    "answer": 3,
    "questionImage": "/obmep/2024-f1-m2-q02.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q02-s1.webp"
    ],
    "altText": "2. QUANTOS CONJUNTOS COM 1 LÁPIS, 1 BORRACHA E 1 APONTADOR PODEM SER FORMADOS COM OS OBJETOS DA FIGURA? 8 7 6 5 4",
    "hints": [
      "Liste algumas possibilidades de forma organizada antes de tentar contar todas.",
      "Escolha uma primeira opção e combine-a com cada uma das opções restantes; depois repita.",
      "Use uma tabela ou árvore de possibilidades e confira se nenhum caso foi repetido."
    ]
  },
  {
    "id": "2024-f1-m2-q03",
    "theme": "medidas",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 3,
    "answer": 3,
    "questionImage": "/obmep/2024-f1-m2-q03.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q03-s1.webp",
      "/obmep/2024-f1-m2-q03-s2.webp"
    ],
    "altText": "3. QUAL É A DIFERENÇA ENTRE OS COMPRIMENTOS DO LÁPIS E DO PINCEL? 11 CENTÍMETROS 5 CENTÍMETROS 3 CENTÍMETROS 2 CENTÍMETROS 1 CENTÍMETROS",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2024-f1-m2-q04",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 4,
    "answer": 4,
    "questionImage": "/obmep/2024-f1-m2-q04.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q04-s1.webp"
    ],
    "altText": "4. ANDRÉ JOGOU UM DADO TRÊS VEZES SEGUIDAS E CONTOU 17 PONTOS NAS FACES QUE FICARAM VIRADAS PARA CIMA. QUAL DAS SEGUINTES FACES APARECEU ENTRE AS VIRADAS PARA CIMA?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f1-m2-q05",
    "theme": "medidas",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 5,
    "answer": 2,
    "questionImage": "/obmep/2024-f1-m2-q05.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q05-s1.webp"
    ],
    "altText": "10 METROS 11 METROS 12 METROS 13 METROS 14 METROS 5. NA FIGURA, VEMOS UMA MESMA LOCOMOTIVA PUXANDO 2 OU 3 VAGÕES IGUAIS. O PRIMEIRO TREM TEM 34 METROS DE COMPRIMENTO NO TOTAL E O SEGUNDO TREM TEM 45 METROS DE COMPRIMENTO NO TOTAL QUAL É O COMPRIMENTO DA LOCOMOTIVA?",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2024-f1-m2-q06",
    "theme": "geometria",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 6,
    "answer": 3,
    "questionImage": "/obmep/2024-f1-m2-q06.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q06-s1.webp"
    ],
    "altText": "6. ANA FEZ UM DESENHO FORMADO POR UM TRIÂNGULO, UM CÍRCULO E UM QUADRADO EM SEU CADERNO. ELA DECIDIU QUE, SE PINTASSE UMA DAS FIGURAS DE BRANCO, PELO MENOS UMA OUTRA FIGURA DEVERIA SER PINTADA DE PRETO. QUAL DESENHO NÃO PODE TER SIDO AQUELE QUE ANA FEZ?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f1-m2-q07",
    "theme": "medidas",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 7,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m2-q07.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q07-s1.webp",
      "/obmep/2024-f1-m2-q07-s2.webp"
    ],
    "altText": "7. O TAMANHO NORMAL DO NARIZ DE PINÓQUIO É 3 CENTÍMETROS. SEU NARIZ AUMENTA 5 CENTÍMETROS CADA VEZ QUE ELE FALA UMA MENTIRA E VOLTA PARA O TAMANHO NORMAL QUANDO FALA UMA VERDADE. PINÓQUIO DISSE 5 AFIRMAÇÕES E, AO FINAL, SEU NARIZ FICOU COM 18 CENTÍMETROS. QUAL DAS AFIRMAÇÕES QUE ELE DISSE FOI, COM CERTEZA, VERDADEIRA? A PRIMEIRA A SEGUNDA A TERCEIRA A QUARTA A QUINTA",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2024-f1-m2-q08",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 8,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m2-q08.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q08-s1.webp"
    ],
    "altText": "8. UMA FÁBRICA DE BRINQUEDOS PRODUZIA BOLAS PEQUENAS, MÉDIAS E GRANDES, NAS CORES VERDE, AZUL E AMARELA. ELA DEIXOU DE FABRICAR BOLAS VERDES PEQUENAS E BOLAS AMARELAS DE TODOS OS TAMANHOS. QUANTOS TIPOS DIFERENTES DE BOLAS ELA PRODUZ AGORA? 4 5 6 7 8",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f1-m2-q09",
    "theme": "medidas",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 9,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m2-q09.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q09-s1.webp"
    ],
    "altText": "9. A FIGURA É FORMADA POR 2 QUADRADOS IGUAIS E 2 TRIÂNGULOS IGUAIS. OS LADOS DOS TRIÂNGULOS SÃO TODOS DE MESMO TAMANHO. O COMPRIMENTO DO CONTORNO DA FIGURA, DESTACADO EM LINHA MAIS GROSSA, É IGUAL A 24 CM. QUAL É O COMPRIMENTO DO CONTORNO DE TODA A REGIÃO CINZA? 10 CENTÍMETROS 12 CENTÍMETROS 14 CENTÍMETROS 16 CENTÍMETROS 20 CENTÍMETROS",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2024-f1-m2-q10",
    "theme": "logica",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 10,
    "answer": 2,
    "questionImage": "/obmep/2024-f1-m2-q10.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q10-s1.webp",
      "/obmep/2024-f1-m2-q10-s2.webp"
    ],
    "altText": "1º 2º 3º 4º 5º 10. ABEL, BETO, CARLOS, DUDU E EMANUEL DISPUTARAM UMA CORRIDA. ABEL CHEGOU EM 2O LUGAR, NEM CARLOS NEM DUDU CHEGARAM EM 3O LUGAR, E BETO CHEGOU LOGO ATRÁS DE EMANUEL. ALÉM DISSO, NÃO HOUVE EMPATES. EM QUE LUGAR EMANUEL CHEGOU?",
    "hints": [
      "Não tente adivinhar. Releia cada condição e marque o que obrigatoriamente precisa acontecer.",
      "Teste uma alternativa por vez e veja se ela contradiz alguma informação do enunciado.",
      "Elimine os casos impossíveis. A resposta é a única possibilidade que respeita todas as condições."
    ]
  },
  {
    "id": "2024-f1-m2-q11",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 11,
    "answer": 2,
    "questionImage": "/obmep/2024-f1-m2-q11.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q11-s1.webp"
    ],
    "altText": "11. A SOMA DOS NÚMEROS NA LINHA DE CIMA É IGUAL À SOMA DOS NÚMEROS NA LINHA DE BAIXO. QUAL É O VALOR DE ? 4 12 16 18 24 1 2 3 4 5 6 7 2 3 4 5 6 7 8 9",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f1-m2-q12",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 12,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m2-q12.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q12-s1.webp",
      "/obmep/2024-f1-m2-q12-s2.webp"
    ],
    "altText": "UMA DUAS TRÊS QUATRO CINCO 12. CINCO JOGADORES DISPUTARAM ENTRE SI UM CAMPEONATO. CADA JOGADOR JOGOU NO MÁXIMO UMA VEZ. O 1º JOGADOR JOGOU SOMENTE UMA VEZ. O 3º JOGADOR JOGOU DUAS VEZES, O 4º JOGOU TRÊS VEZES E O 5º JOGOU QUATRO VEZES. QUANTAS VEZES JOGOU O 2º JOGADOR?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f1-m2-q13",
    "theme": "tempo",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 13,
    "answer": 4,
    "questionImage": "/obmep/2024-f1-m2-q13.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q13-s1.webp"
    ],
    "altText": "ALCEU BRUNO CÉLIO DAVI ERNESTO 13. CINCO AMIGOS ESTAVAM JUNTOS DURANTE AS FÉRIAS E SE ESQUECERAM EM QUE DIA DA SEMANA ESTAVAM. AO TENTAR DESCOBRIR QUE DIA ERA, CADA UM DELES DISSE O SEGUINTE: SSE O SEGUINTE: ALCEU: “ONTEM FOI QUARTA-FEIRA”. BRUNO: “AMANHÃ SERÁ SEXTA-FEIRA”. CÉLIO: “ANTEONTEM FOI TERÇA-FEIRA”. DAVI: “DEPOIS DE AMANHÃ SERÁ SÁBADO”. ERNESTO: “HOJE É SEGUNDA-FEIRA”. APENAS UM DOS AMIGOS ESTAVA ERRADO. QUAL DELES ERROU?",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2024-f1-m2-q14",
    "theme": "combinatoria",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 14,
    "answer": 1,
    "questionImage": "/obmep/2024-f1-m2-q14.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q14-s1.webp"
    ],
    "altText": "4 6 8 10 12 14. JANAÍNA TEM 2 VASOS DIFERENTES, 4 ROSAS IGUAIS E 3 MARGARIDAS IGUAIS. A FIGURA MOSTRA UMA POSSÍVEL MANEIRA DE COLOCAR AS FLORES NOS VASOS, COM 3 ROSAS E 1 MARGARIDA EM UM DOS VASOS E 1 ROSA E 2 MARGARIDAS NO OUTRO. DE QUANTAS MANEIRAS DIFERENTES ELA PODE FAZER ISSO, DE MODO QUE HAJA PELO MENOS UMA FLOR DE CADA TIPO EM CADA VASO?",
    "hints": [
      "Liste algumas possibilidades de forma organizada antes de tentar contar todas.",
      "Escolha uma primeira opção e combine-a com cada uma das opções restantes; depois repita.",
      "Use uma tabela ou árvore de possibilidades e confira se nenhum caso foi repetido."
    ]
  },
  {
    "id": "2024-f1-m2-q15",
    "theme": "logica",
    "year": 2024,
    "phase": 1,
    "level": "m2",
    "number": 15,
    "answer": 2,
    "questionImage": "/obmep/2024-f1-m2-q15.webp",
    "solutionImages": [
      "/obmep/2024-f1-m2-q15-s1.webp"
    ],
    "altText": "UMA MOEDA DE UM REAL. UMA MOEDA DE CADA TIPO. PELO MENOS DUAS MOEDAS DE UM MESMO TIPO. MAIS DO QUE UM REAL E CINQUENTA CENTAVOS. MENOS DO QUE TRÊS REAIS. 15. VINÍCIUS COLOCA DENTRO DE UMA CAIXA 3 MOEDAS DE UM REAL, 3 MOEDAS DE CINQUENTA CENTAVOS E 3 MOEDAS DE VINTE E CINCO CENTAVOS. ELE CHACOALHA A CAIXA PARA MISTURAR AS MOEDAS E, SEM OLHAR, RETIRA 4 MOEDAS DA CAIXA. PODEMOS DIZER, COM CERTEZA, QUE VINÍCIUS TERÁ EM MÃOS:",
    "hints": [
      "Não tente adivinhar. Releia cada condição e marque o que obrigatoriamente precisa acontecer.",
      "Teste uma alternativa por vez e veja se ela contradiz alguma informação do enunciado.",
      "Elimine os casos impossíveis. A resposta é a única possibilidade que respeita todas as condições."
    ]
  },
  {
    "id": "2024-f2-m1-q01",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 1,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m1-q01.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q01-s1.webp"
    ],
    "altText": "PRIMEIRO SEGUNDO TERCEIRO QUARTO QUINTO 1. O ATLETA DA PISTA 1 ESTAVA EM ÚLTIMO LUGAR, COMO MOSTRA A FIGURA. ELE ULTRAPASSOU EXATAMENTE 5 ATLETAS ANTES DA CHEGADA E NÃO FOI ULTRAPASSADO POR NINGUÉM. EM QUE LUGAR ELE TERMINOU A CORRIDA?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m1-q02",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 2,
    "answer": 3,
    "questionImage": "/obmep/2024-f2-m1-q02.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q02-s1.webp"
    ],
    "altText": "2. QUAL DAS PLANTAS ABAIXO TEM MAIS PÉTALAS DO QUE FOLHAS?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f2-m1-q03",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 3,
    "answer": 3,
    "questionImage": "/obmep/2024-f2-m1-q03.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q03-s1.webp",
      "/obmep/2024-f2-m1-q03-s2.webp"
    ],
    "altText": "3. O TIME VERMELHO JOGOU UMA PARTIDA DE FUTEBOL CONTRA O TIME AZUL. OS DOIS TIMES MARCARAM GOLS E O TIME AZUL VENCEU O JOGO. QUAL FOI O PLACAR FINAL DESSA PARTIDA? VERMELHO AZUL 0 X PLACAR 4 VERMELHO AZUL 1 X PLACAR 3 VERMELHO AZUL 2 X PLACAR 2 VERMELHO AZUL 3 X PLACAR 1 VERMELHO AZUL 4 X PLACAR 0",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f2-m1-q04",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 4,
    "answer": 1,
    "questionImage": "/obmep/2024-f2-m1-q04.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q04-s1.webp"
    ],
    "altText": "4. DANILO COLOU ALGUNS ADESIVOS NO VIDRO DE SUA JANELA PELO LADO DE DENTRO, COMO MOSTRA A FIGURA AO LADO. O QUE ELE VERÁ QUANDO OLHAR A JANELA PELO LADO DE FORA?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m1-q05",
    "theme": "combinatoria",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 5,
    "answer": 1,
    "questionImage": "/obmep/2024-f2-m1-q05.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q05-s1.webp"
    ],
    "altText": "1 2 3 4 6 5. QUANTAS SÃO AS MANEIRAS DIFERENTES DE EMPILHAR OS TRÊS CUBOS SOBRE A MESA, SEM QUE O CUBO VERDE FIQUE JUNTO COM O CUBO AMARELO?",
    "hints": [
      "Liste algumas possibilidades de forma organizada antes de tentar contar todas.",
      "Escolha uma primeira opção e combine-a com cada uma das opções restantes; depois repita.",
      "Use uma tabela ou árvore de possibilidades e confira se nenhum caso foi repetido."
    ]
  },
  {
    "id": "2024-f2-m1-q06",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 6,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m1-q06.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q06-s1.webp",
      "/obmep/2024-f2-m1-q06-s2.webp"
    ],
    "altText": "6. UMA FILA TEM 11 PESSOAS. HELENA ESTÁ EXATAMENTE NO MEIO DA FILA E GABRIEL É O ÚLTIMO DA FILA. QUANTAS PESSOAS ESTÃO ENTRE HELENA E GABRIEL? 2 3 4 5 6",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f2-m1-q07",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 7,
    "answer": 3,
    "questionImage": "/obmep/2024-f2-m1-q07.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q07-s1.webp"
    ],
    "altText": "5 8 10 15 20 7. A FIGURA MOSTRA A FRENTE DE UM PRÉDIO. O NÚMERO DE JANELAS DE TRÁS É O DOBRO DO NÚMERO DE JANELAS DA FRENTE E NÃO HÁ OUTRAS JANELAS NO PRÉDIO. QUANTAS JANELAS HÁ NO PRÉDIO INTEIRO?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m1-q08",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 8,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m1-q08.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q08-s1.webp"
    ],
    "altText": "4 5 6 7 8 8. A FIGURA MOSTRA ALGUMAS MARCAS DOS PÉS DE GABRIELA NA AREIA. QUANTAS DESSAS MARCAS SÃO DO PÉ DIREITO DE GABRIELA?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m1-q09",
    "theme": "tempo",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 9,
    "answer": 0,
    "questionImage": "/obmep/2024-f2-m1-q09.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q09-s1.webp",
      "/obmep/2024-f2-m1-q09-s2.webp"
    ],
    "altText": "6 HORAS E 25 MINUTOS 6 HORAS E 30 MINUTOS 6 HORAS E 35 MINUTOS 6 HORAS E 40 MINUTOS 6 HORAS E 45 MINUTOS 9. FRANCISCO ACORDA ÀS 5 HORAS E 50 MINUTOS E COMEÇA A FAZER AS ATIVIDADES ABAIXO, UMA DEPOIS DA OUTRA. A QUE HORAS ELE TERMINA DE FAZER ESSAS ATIVIDADES? ATIVIDADE DURAÇÃO IR AO BANHEIRO 10 MINUTOS TOMAR CAFÉ DA MANHÃ 15 MINUTOS ESCOVAR OS DENTES 10 MINUTOS",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2024-f2-m1-q10",
    "theme": "numerico",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 10,
    "answer": 1,
    "questionImage": "/obmep/2024-f2-m1-q10.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q10-s1.webp"
    ],
    "altText": "6 7 8 9 10 10. MARTINA QUER RETIRAR TODAS AS ESTRELAS DO COLAR PELO CORDÃO, SEM CORTAR O CORDÃO. QUAL É O MENOR NÚMERO DE BOLINHAS QUE ELA TERÁ QUE RETIRAR?",
    "hints": [
      "Observe os algarismos, a ordem dos números e qualquer padrão que se repita.",
      "Compare o que muda de um número para o seguinte e teste a regra nos primeiros exemplos.",
      "Aplique a mesma regra até a posição pedida e confira se ela funciona em toda a sequência."
    ]
  },
  {
    "id": "2024-f2-m1-q11",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 11,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m1-q11.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q11-s1.webp"
    ],
    "altText": "11. PEDRO SOBE UMA ESCADA DE UM JEITO DIFERENTE. DEPOIS QUE ELE PISA COM O PÉ DIREITO EM UM DEGRAU, ELE PISA COM O PÉ ESQUERDO NO DEGRAU SEGUINTE. DEPOIS QUE ELE PISA COM O PÉ ESQUERDO EM UM DEGRAU, ELE PULA UM DEGRAU E PISA COM O PÉ DIREITO NO DEGRAU SEGUINTE. NONO DÉCIMO DÉCIMO PRIMEIRO DÉCIMO SEGUNDO DÉCIMO TERCEIRO PEDRO COMEÇA A SUBIR A ESCADA PISANDO COM O PÉ DIREITO NO PRIMEIRO DEGRAU. EM QUE DEGRAU ELE ESTARÁ QUANDO PISAR PELA QUARTA VEZ COM SEU PÉ ESQUERDO?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f2-m1-q12",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 12,
    "answer": 3,
    "questionImage": "/obmep/2024-f2-m1-q12.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q12-s1.webp",
      "/obmep/2024-f2-m1-q12-s2.webp"
    ],
    "altText": "? 12. FALTA UM AZULEJO PARA ANA COMPLETAR SEU MURAL. ELA QUER QUE A QUANTIDADE DE TRIÂNGULOS PEQUENOS PRETOS FIQUE IGUAL À QUANTIDADE DE TRIÂNGULOS PEQUENOS AMARELOS. QUAL DOS AZULEJOS ABAIXO ELA DEVE COLOCAR NO MURAL?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m1-q13",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 13,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m1-q13.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q13-s1.webp"
    ],
    "altText": "4 12 15 30 37 13. PAULO TEM AS CÉDULAS DE 2, 5, 10 E 20 REAIS, UMA DE CADA, MOSTRADAS ABAIXO. QUANTOS VALORES DIFERENTES EM REAIS ELE PODE PAGAR USANDO UMA OU MAIS DESSAS CÉDULAS? 2 REAIS REPUBLICA FEDERATIVA DO BRASIL O D A V U O L A J E S S U E D 20 20 20 REALS REPUBLICA FEDERATIVA DO BRASIL S U E D E S O D A V U O L A J 2 REAIS DEUS SEJ 10 10 10 REAIS REPUBLICA FEDERATIVA DO BRASIL O D A V U O L A J E S S U E D 20 ATIVA DO BRASIL 5 REAIS REPUBLICA FEDERATIVA DO BRASIL O D A V U O L A J E S S U E D",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f2-m1-q14",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 14,
    "answer": 0,
    "questionImage": "/obmep/2024-f2-m1-q14.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q14-s1.webp"
    ],
    "altText": "14. LUCIMARA USOU CUBOS AZUIS E CUBOS AMARELOS PARA MONTAR O CUBO MAIOR DA FIGURA. CUBOS DE MESMA COR TÊM O MESMO TAMANHO. QUAL É O MENOR NÚMERO DE CUBOS AZUIS QUE ELA PODE TER USADO PARA MONTAR O CUBO MAIOR? 32 26 27 43 64 D",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m1-q15",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m1",
    "number": 15,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m1-q15.webp",
    "solutionImages": [
      "/obmep/2024-f2-m1-q15-s1.webp",
      "/obmep/2024-f2-m1-q15-s2.webp",
      "/obmep/2024-f2-m1-q15-s3.webp",
      "/obmep/2024-f2-m1-q15-s4.webp"
    ],
    "altText": "15. EM UM JOGO DE DOMINÓ, AS PEÇAS DEVEM SER UNIDAS PELAS SUAS PARTES COM A MESMA QUANTIDADE DE PONTOS. QUATRO DAS CINCO PEÇAS ABAIXO DEVEM SER COLOCADAS EM LINHA COMO MOSTRA A FIGURA AO LADO. QUAL DAS PEÇAS ABAIXO NÃO SERÁ UTILIZADA?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m2-q01",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 1,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m2-q01.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q01-s1.webp"
    ],
    "altText": "4 8 12 16 20 1. QUANTOS TRIÂNGULOS BRANCOS HÁ NA FIGURA?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m2-q02",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 2,
    "answer": 3,
    "questionImage": "/obmep/2024-f2-m2-q02.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q02-s1.webp"
    ],
    "altText": "1 2 3 4 5 2. QUANTAS BOLINHAS BRANCAS DEVEM SER PINTADAS DE PRETO PARA QUE O NÚMERO DE BOLINHAS PRETAS FIQUE IGUAL AO DOBRO DO NÚMERO DE BOLINHAS BRANCAS?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f2-m2-q03",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 3,
    "answer": 0,
    "questionImage": "/obmep/2024-f2-m2-q03.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q03-s1.webp",
      "/obmep/2024-f2-m2-q03-s2.webp"
    ],
    "altText": "3. LAURA FEZ A MONTAGEM AO LADO USANDO 21 CUBINHOS IGUAIS. ELA OLHOU A MONTAGEM DE CIMA E FEZ UM DESENHO DO QUE VIU. QUAL DOS DESENHOS ABAIXO PODE SER O QUE LAURA FEZ?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m2-q04",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 4,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m2-q04.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q04-s1.webp"
    ],
    "altText": "3 4 5 6 7 4. S O L E N I H C S E S S E D S N U G L A . O Ã Ç A T A N E D A L U A A A R A P S O L E N I H C S U E S M A R A R I T E R S O N U L A S O ESTÃO MOSTRADOS NA FIGURA ABAIXO. QUAL É O MENOR NÚMERO DE ALUNOS QUE PODEM TER PARTICIPADO DESSA AULA?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m2-q05",
    "theme": "medidas",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 5,
    "answer": 0,
    "questionImage": "/obmep/2024-f2-m2-q05.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q05-s1.webp"
    ],
    "altText": "FIGURA 1 FIGURA 2 FIGURA 3 FIGURA 4 FIGURA 5 FIGURA 1 FIGURA 2 FIGURA 3 FIGURA 4 FIGURA 5 5. AS FIGURAS ABAIXO FORAM CONSTRUÍDAS LIGANDO PONTOS DE UMA MALHA DE QUADRADINHOS DE MESMO TAMANHO. QUAL DELAS POSSUI O MAIOR CONTORNO?",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2024-f2-m2-q06",
    "theme": "graficos",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 6,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m2-q06.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q06-s1.webp",
      "/obmep/2024-f2-m2-q06-s2.webp"
    ],
    "altText": "M P C I M P C I M P C I M P C I M P C I NO DE ALUNOS NO DE ALUNOS NO DE ALUNOS NO DE ALUNOS NO DE ALUNOS 6. EM UMA ESCOLA, O NÚMERO DE ALUNOS QUE PREFEREM MATEMÁTICA É O DOBRO DOS QUE PREFEREM PORTUGUÊS, O DOBRO DOS QUE PREFEREM CIÊNCIAS E O TRIPLO DOS QUE PREFEREM INGLÊS. QUAL DOS GRÁFICOS ABAIXO REPRESENTA MELHOR ESSA SITUAÇÃO? M = MATEMÁTICA P = PORTUGUÊS C = CIÊNCIAS I = INGLÊS",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2024-f2-m2-q07",
    "theme": "numerico",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 7,
    "answer": 1,
    "questionImage": "/obmep/2024-f2-m2-q07.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q07-s1.webp",
      "/obmep/2024-f2-m2-q07-s2.webp"
    ],
    "altText": "6 7 8 9 10 7. MARTINA QUER RETIRAR TODAS AS ESTRELAS DO COLAR PELO CORDÃO, SEM CORTAR O CORDÃO. QUAL É O MENOR NÚMERO DE BOLINHAS QUE ELA TERÁ QUE RETIRAR?",
    "hints": [
      "Observe os algarismos, a ordem dos números e qualquer padrão que se repita.",
      "Compare o que muda de um número para o seguinte e teste a regra nos primeiros exemplos.",
      "Aplique a mesma regra até a posição pedida e confira se ela funciona em toda a sequência."
    ]
  },
  {
    "id": "2024-f2-m2-q08",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 8,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m2-q08.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q08-s1.webp"
    ],
    "altText": "8 9 10 11 12 8. JULIANO TEM UMA CAMISETA BRANCA, UMA PRETA, UMA AZUL E UMA VERMELHA. ELE TAMBÉM TEM UMA BERMUDA BRANCA, UMA AZUL E UMA CINZA. QUANTAS SÃO AS MANEIRAS DE JULIANO SE VESTIR COM UMA CAMISETA E UMA BERMUDA DE CORES DIFERENTES?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f2-m2-q09",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 9,
    "answer": 1,
    "questionImage": "/obmep/2024-f2-m2-q09.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q09-s1.webp",
      "/obmep/2024-f2-m2-q09-s2.webp"
    ],
    "altText": "6 7 9 15 25 9. NA CLASSE DE PEDRINHO HÁ 36 ALUNOS PRESENTES. A PROFESSORA PERGUNTA QUEM GOSTA DE PORTUGUÊS E 28 ALUNOS LEVANTAM A MÃO. ELA TAMBÉM PERGUNTA QUEM GOSTA DE MATEMÁTICA E 32 ALUNOS LEVANTAM A MÃO. PEDRINHO FOI O ÚNICO QUE NÃO LEVANTOU A MÃO EM NENHUMA DAS VEZES. QUANTOS ALUNOS DA CLASSE GOSTAM DE MATEMÁTICA, MAS NÃO GOSTAM DE PORTUGUÊS?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f2-m2-q10",
    "theme": "tempo",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 10,
    "answer": 0,
    "questionImage": "/obmep/2024-f2-m2-q10.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q10-s1.webp"
    ],
    "altText": "4 HORAS E 30 MINUTOS 5 HORAS E 30 MINUTOS 6 HORAS E 30 MINUTOS 7 HORAS E 30 MINUTOS 7 HORAS E 6 MINUTOS 10. BENÍCIO VIU UM RELÓGIO PELO ESPELHO RETROVISOR DE SEU CARRO, COMO MOSTRA A FIGURA. QUE HORAS O RELÓGIO ESTAVA MARCANDO? 12 9 6 3",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2024-f2-m2-q11",
    "theme": "medidas",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 11,
    "answer": 3,
    "questionImage": "/obmep/2024-f2-m2-q11.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q11-s1.webp"
    ],
    "altText": "11. ANA, BETO, CRIS, DUDA E ENZO MORAM NAS CASAS DE NÚMERO 10, 30, 50, 60 E 80 DE UMA RUA, NESSA ORDEM. NESSA RUA, O NÚMERO DE UMA CASA CORRESPONDE À SUA DISTÂNCIA, EM METROS, DO INÍCIO DA RUA. CERTO DIA, OS AMIGOS FORAM ESTUDAR JUNTOS NA CASA DE UM DELES, E PERCEBERAM QUE A SOMA DAS DISTÂNCIAS PERCORRIDAS POR TODOS FOI DE 110 METROS. NA CASA DE QUEM ELES FORAM ESTUDAR? ANA BETO CRIS DUDA ENZO 10 30 50 60 80",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2024-f2-m2-q12",
    "theme": "aritmetica",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 12,
    "answer": 4,
    "questionImage": "/obmep/2024-f2-m2-q12.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q12-s1.webp",
      "/obmep/2024-f2-m2-q12-s2.webp"
    ],
    "altText": "12. OS CHAPÉUS, GRAVATAS E SAPATOS DOS PALHAÇOS PIRILAMPO, ZÉ GRILO E XURUPITA ESTÃO NAS PRATELEIRAS AO LADO. SABE-SE QUE: PIRILAMPO E XURUPITA NÃO POSSUEM CHAPÉUS IGUAIS; PIRILAMPO E XURUPITA POSSUEM GRAVATAS IGUAIS; PIRILAMPO E ZÉ GRILO NÃO POSSUEM SAPATOS IGUAIS; XURUPITA E ZÉ GRILO NÃO POSSUEM SAPATOS IGUAIS. QUAIS SÃO O CHAPÉU, A GRAVATA E O SAPATO DE ZÉ GRILO?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2024-f2-m2-q13",
    "theme": "graficos",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 13,
    "answer": 1,
    "questionImage": "/obmep/2024-f2-m2-q13.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q13-s1.webp"
    ],
    "altText": "13. O GRÁFICO ABAIXO MOSTRA OS HORÁRIOS DE MODALIDADES OLÍMPICAS EM UM DIA. NÃO É POSSÍVEL ASSISTIR A DUAS MODALIDADES AO VIVO AO MESMO TEMPO. 3 4 5 6 7 QUAL É O MAIOR NÚMERO DE MODALIDADES A QUE ALGUÉM PODE ASSISTIR AO VIVO DO INÍCIO AO FIM? NATAÇÃO CANOAGEM BASQUETE JUDÔ SURFE VÔLEI FUTEBOL 12h 14h 16h 18h 20h 13h 15h 17h 19h 21h",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2024-f2-m2-q14",
    "theme": "geometria",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 14,
    "answer": 1,
    "questionImage": "/obmep/2024-f2-m2-q14.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q14-s1.webp"
    ],
    "altText": "3 4 5 6 7 14. EMILIANO TERMINOU DE PREENCHER O QUADRICULADO DA FIGURA COM PEÇAS IGUAIS ÀS QUE ELE JÁ COLOCOU, SEM SOBREPOSIÇÕES. ALÉM DAS 3 PEÇAS COLOCADAS, ELE COLOCOU MAIS 3 PEÇAS VERDES, 2 PEÇAS AMARELAS E ALGUMAS VERMELHAS. AO TODO, QUANTAS PEÇAS VERMELHAS ELE USOU?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2024-f2-m2-q15",
    "theme": "medidas",
    "year": 2024,
    "phase": 2,
    "level": "m2",
    "number": 15,
    "answer": 2,
    "questionImage": "/obmep/2024-f2-m2-q15.webp",
    "solutionImages": [
      "/obmep/2024-f2-m2-q15-s1.webp",
      "/obmep/2024-f2-m2-q15-s2.webp"
    ],
    "altText": "A MESMA QUE A DE 4 QUADRADINHOS PRETOS A MESMA QUE A DE 5 QUADRADINHOS PRETOS A MESMA QUE A DE 6 QUADRADINHOS PRETOS A MESMA QUE A DE 8 QUADRADINHOS PRETOS A MESMA QUE A DE 10 QUADRADINHOS PRETOS 15. NA FIGURA PODEMOS VER 4 QUADRADOS. O QUADRADO MAIOR ESTÁ DIVIDIDO EM 5 REGIÕES. A ÁREA DA REGIÃO AZUL É IGUAL À DE 15 QUADRADINHOS PRETOS, E A ÁREA DA REGIÃO AMARELA É IGUAL À DE 8 QUADRADINHOS PRETOS. QUAL É A ÁREA DE CADA UM DOS RETÂNGULOS COR-DE-ROSA? 15 8 1",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2025-f1-m1-q01",
    "theme": "geometria",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 1,
    "answer": 3,
    "questionImage": "/obmep/2025-f1-m1-q01.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q01-s1.webp"
    ],
    "altText": "1. EM QUAL DAS FIGURAS ABAIXO APARECEM MAIS PALITOS?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f1-m1-q02",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 2,
    "answer": 2,
    "questionImage": "/obmep/2025-f1-m1-q02.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q02-s1.webp"
    ],
    "altText": "4 2 1 3 3 2 1 4 3 2 4 1 2 4 3 1 1 2 3 4 2. JOANA MONTOU UM GATINHO COM AS PEÇAS ABAIXO. COMO JOANA PODE TER COLOCADO AS PEÇAS? 1 2 3 4",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f1-m1-q03",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 3,
    "answer": 3,
    "questionImage": "/obmep/2025-f1-m1-q03.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q03-s1.webp",
      "/obmep/2025-f1-m1-q03-s2.webp"
    ],
    "altText": "1 2 3 4 5 3. QUANTOS BOIS DEVEM PASSAR DA ESQUERDA PARA A DIREITA PARA QUE OS DOIS CERCADOS FIQUEM COM A MESMA QUANTIDADE DE BOIS?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f1-m1-q04",
    "theme": "geometria",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 4,
    "answer": 2,
    "questionImage": "/obmep/2025-f1-m1-q04.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q04-s1.webp"
    ],
    "altText": "4. A FORMIGA ANDA NA VERTICAL E NA HORIZONTAL PELAS CASAS DO QUADRICULADO. A CADA ETAPA, ELA ANDA PARA PEGAR A FOLHA MAIS PRÓXIMA. QUAL É A ÚLTIMA FOLHA QUE A FORMIGA VAI PEGAR?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f1-m1-q05",
    "theme": "medidas",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 5,
    "answer": 1,
    "questionImage": "/obmep/2025-f1-m1-q05.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q05-s1.webp",
      "/obmep/2025-f1-m1-q05-s2.webp"
    ],
    "altText": "3 4 5 6 7 5. UMA FORMIGUINHA ESTAVA NA MARCA DE 12 CENTÍMETROS DE UMA RÉGUA, COMO MOSTRA A FIGURA. ELA CAMINHOU 5 CENTÍMETROS PARA A DIREITA, DEPOIS 9 CENTÍMETROS PARA A ESQUERDA E PAROU PARA DESCANSAR. QUANTOS CENTÍMETROS ELA DEVE CAMINHAR PARA A DIREITA PARA RETORNAR AO PONTO DE PARTIDA?",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2025-f1-m1-q06",
    "theme": "tempo",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 6,
    "answer": 1,
    "questionImage": "/obmep/2025-f1-m1-q06.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q06-s1.webp"
    ],
    "altText": "6. JOSÉ DEVE TOMAR 8 COMPRIMIDOS. ELE VAI TOMAR UM COMPRIMIDO A CADA 8 HORAS, COMEÇANDO NA SEGUNDA FEIRA ÀS 8 HORAS DA MANHÃ. QUANDO JOSÉ VAI TOMAR O ÚLTIMO COMPRIMIDO? NA QUARTA-FEIRA DE MANHÃ. NA QUARTA-FEIRA À TARDE. NA QUARTA-FEIRA À NOITE. NA QUINTA-FEIRA DE MANHÃ. NA QUINTA-FEIRA À TARDE. MANHÃ TARDE SEG NOITE TER QUA QUI SEX SÁB DOM PLANEJAMENTO SEMANAL",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2025-f1-m1-q07",
    "theme": "geometria",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 7,
    "answer": 1,
    "questionImage": "/obmep/2025-f1-m1-q07.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q07-s1.webp"
    ],
    "altText": "7. MARINA CORTOU O PAPEL RETANGULAR DA FIGURA AO LADO EM DOIS QUADRADOS. DEPOIS, ELA USOU OS QUADRADOS CORTADOS PARA FORMAR UM NOVO RETÂNGULO. QUAL DOS RETÂNGULOS ABAIXO ELA NÃO PODE TER FORMADO?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f1-m1-q08",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 8,
    "answer": 2,
    "questionImage": "/obmep/2025-f1-m1-q08.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q08-s1.webp",
      "/obmep/2025-f1-m1-q08-s2.webp"
    ],
    "altText": "8. ÁGATA DEU UM TERÇO DO CHOCOLATE AO LADO PARA SUA AMIGA JADE. DEPOIS, DEU METADE DO QUE RESTOU PARA SUA AMIGA ESMERALDA. COM QUANTOS QUADRADINHOS DO CHOCOLATE ÁGATA FICOU? 1 2 3 4 5",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f1-m1-q09",
    "theme": "logica",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 9,
    "answer": 1,
    "questionImage": "/obmep/2025-f1-m1-q09.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q09-s1.webp"
    ],
    "altText": "9. QUEM ESTÁ FALANDO A VERDADE? PEDRO PAULO HÉLIO EMILIANO LÉO .",
    "hints": [
      "Não tente adivinhar. Releia cada condição e marque o que obrigatoriamente precisa acontecer.",
      "Teste uma alternativa por vez e veja se ela contradiz alguma informação do enunciado.",
      "Elimine os casos impossíveis. A resposta é a única possibilidade que respeita todas as condições."
    ]
  },
  {
    "id": "2025-f1-m1-q10",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 10,
    "answer": 2,
    "questionImage": "/obmep/2025-f1-m1-q10.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q10-s1.webp"
    ],
    "altText": "10. UM CAMPEONATO DE BASQUETE É DISPUTADO POR 4 TIMES. CADA TIME ENFRENTA CADA UM DOS OUTROS UMA VEZ. NO TOTAL, QUANTAS PARTIDAS SÃO DISPUTADAS? 3 4 6 9 10",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f1-m1-q11",
    "theme": "geometria",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 11,
    "answer": 3,
    "questionImage": "/obmep/2025-f1-m1-q11.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q11-s1.webp",
      "/obmep/2025-f1-m1-q11-s2.webp"
    ],
    "altText": "11. JOÃO FEZ UM CORTE EM UM PAPEL QUADRADO. DEPOIS ELE FEZ OUTRO CORTE EM UM DOS PEDAÇOS CORTADOS E FICOU COM TRÊS TRIÂNGULOS. QUAL É A FIGURA QUE MOSTRA UM CORTE QUE JOÃO PODE TER FEITO NO PAPEL QUADRADO?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f1-m1-q12",
    "theme": "numerico",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 12,
    "answer": 2,
    "questionImage": "/obmep/2025-f1-m1-q12.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q12-s1.webp"
    ],
    "altText": "54 53 45 43 34 12. JOANA COLOCOU CINCO CARTÕES NUMERADOS NA MESA, COMO MOSTRADO ABAIXO. ELA VAI TIRAR TRÊS CARTÕES DA MESA. QUAL É O MAIOR NÚMERO QUE ELA PODE FORMAR JUNTANDO OS OUTROS DOIS NA ORDEM EM QUE ESTÃO? 1 4 3 2 5",
    "hints": [
      "Observe os algarismos, a ordem dos números e qualquer padrão que se repita.",
      "Compare o que muda de um número para o seguinte e teste a regra nos primeiros exemplos.",
      "Aplique a mesma regra até a posição pedida e confira se ela funciona em toda a sequência."
    ]
  },
  {
    "id": "2025-f1-m1-q13",
    "theme": "geometria",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 13,
    "answer": 2,
    "questionImage": "/obmep/2025-f1-m1-q13.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q13-s1.webp",
      "/obmep/2025-f1-m1-q13-s2.webp"
    ],
    "altText": "13. JOAQUIM MONTOU O CUBO AO LADO USANDO OITO CUBINHOS IGUAIS. NESSES CUBINHOS, QUAL É A FIGURA QUE ESTÁ NA FACE OPOSTA À FACE EM QUE ESTÁ O CIRCULO?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f1-m1-q14",
    "theme": "graficos",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 14,
    "answer": 2,
    "questionImage": "/obmep/2025-f1-m1-q14.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q14-s1.webp"
    ],
    "altText": "1 2 3 4 5 14. O GRÁFICO MOSTRA A TEMPERATURA MÍNIMA REGISTRADA EM CINCO CIDADES NO MÊS DE JULHO. EM QUANTAS DESSAS CIDADES A TEMPERATURA MÍNIMA ESTEVE ENTRE 4 E 8 GRAUS? TEMPERATURA MÍNIMA (GRAUS CELCIUS) CIDADES 10 9 8 7 6 5 4 3 2 1 A B C D E A = CIDADE DE ALAGOAS B = CIDADE DA BAHIA C = CIDADE DO CEARÁ D = CIDADE DO DISTRITO FEDERAL E = CIDADE DO ESPÍRITO SANTO",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2025-f1-m1-q15",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 1,
    "level": "m1",
    "number": 15,
    "answer": 3,
    "questionImage": "/obmep/2025-f1-m1-q15.webp",
    "solutionImages": [
      "/obmep/2025-f1-m1-q15-s1.webp"
    ],
    "altText": "15. AS CAIXAS ABAIXO FORAM DIVIDIDAS ENTRE TRÊS CRIANÇAS. CADA CRIANÇA FICOU COM DUAS CAIXAS. UMA CRIANÇA FICOU SÓ COM CAIXAS GRANDES, OUTRA FICOU SÓ COM CAIXAS DE BOLINHA E QUAL ALTERNATIVA MOSTRA AS CAIXAS COM QUE UMA DAS CRIANÇAS FICOU? OUTRA FICOU SÓ COM CAIXAS PEQUENAS.",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f1-m2-q01",
    "theme": "graficos",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 1,
    "answer": 2,
    "questionImage": "/obmep/2025-f1-m2-q01.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q01-s1.webp"
    ],
    "altText": "1. JUSSARA PREENCHEU AS CASAS DA TABELA AO LADO ATÉ O NÚMERO 22, SEGUINDO A ORDEM NATURAL DOS NÚMEROS. SE ELA CONTINUAR ATÉ O NÚMERO 50, QUAL DAS PEÇAS ABAIXO PODERÁ SER RECORTADA DA TABELA? 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 22 32 33 44 22 32 34 44 22 32 33 43 22 33 34 45 22 32 33 42",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2025-f1-m2-q02",
    "theme": "percurso",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 2,
    "answer": 3,
    "questionImage": "/obmep/2025-f1-m2-q02.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q02-s1.webp"
    ],
    "altText": "R$ 60,00 R$ 62,00 R$ 65,00 R$ 70,00 R$ 78,00 2. OS PREÇOS DOS PRESENTES ESTÃO ESCRITOS EM SUAS ETIQUETAS. QUAL É A DIFERENÇA ENTRE O PREÇO DO PRESENTE MAIS CARO E O PREÇO DO MAIS BARATO? R$ 177,00 R$ 170,00 R$ 127,00 R$ 107,00 R$ 172,00",
    "hints": [
      "Acompanhe o caminho com o dedo e identifique o ponto de partida, o destino e as regras do percurso.",
      "Conte por etapas, anotando cada possibilidade para não repetir nem esquecer caminhos.",
      "Confira se todos os percursos contados obedecem às direções e restrições do enunciado."
    ]
  },
  {
    "id": "2025-f1-m2-q03",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 3,
    "answer": 2,
    "questionImage": "/obmep/2025-f1-m2-q03.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q03-s1.webp"
    ],
    "altText": "3 2 1 2 3 1 3 1 2 1 3 2 1 2 3 3. MARIA SOLTOU, AO MESMO TEMPO, TRÊS BOLAS NUMERADAS NOS TUBOS AO LADO. COMO AS BOLAS FICARAM POSICIONADAS AO SAIR DO TUBO? ? 1 2 3 ? ?",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f1-m2-q04",
    "theme": "medidas",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 4,
    "answer": 1,
    "questionImage": "/obmep/2025-f1-m2-q04.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q04-s1.webp",
      "/obmep/2025-f1-m2-q04-s2.webp"
    ],
    "altText": "145 150 155 160 165 4. DOIS ATLETAS MEDIRAM SUAS ALTURAS USANDO MARCAS IGUALMENTE ESPAÇADAS DESENHADAS EM UMA PAREDE, COMO MOSTRA A ILUSTRAÇÃO. O ATLETA MAIOR MEDE 175 CENTÍMETROS. QUAL É A ALTURA, EM CENTÍMETROS, DO ATLETA MENOR?",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2025-f1-m2-q05",
    "theme": "combinatoria",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 5,
    "answer": 4,
    "questionImage": "/obmep/2025-f1-m2-q05.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q05-s1.webp"
    ],
    "altText": "5 6 10 12 22 5. EM UMA GARAGEM, OS CARROS ESTACIONAM DE FRENTE OU DE RÉ, UM EM CADA VAGA. NESSA GARAGEM ESTÃO ESTACIONADOS 3 CARROS. O CARRO QUE ESTÁ CHEGANDO PODERÁ ESTACIONAR DE QUANTAS MANEIRAS DIFERENTES?",
    "hints": [
      "Liste algumas possibilidades de forma organizada antes de tentar contar todas.",
      "Escolha uma primeira opção e combine-a com cada uma das opções restantes; depois repita.",
      "Use uma tabela ou árvore de possibilidades e confira se nenhum caso foi repetido."
    ]
  },
  {
    "id": "2025-f1-m2-q06",
    "theme": "geometria",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 6,
    "answer": 0,
    "questionImage": "/obmep/2025-f1-m2-q06.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q06-s1.webp"
    ],
    "altText": "6. JOÃO TEM OS QUATRO ADESIVOS ABAIXO. QUAL DAS FIGURAS ELE VAI OBTER SE COLAR TODOS OS ADESIVOS UNS SOBRE OS OUTROS, CENTRALIZADOS, SEM GIRAR NENHUM DELES?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f1-m2-q07",
    "theme": "graficos",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 7,
    "answer": 3,
    "questionImage": "/obmep/2025-f1-m2-q07.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q07-s1.webp",
      "/obmep/2025-f1-m2-q07-s2.webp"
    ],
    "altText": "7. DE ACORDO COM A TABELA, QUANTOS GRAMAS DE RAÇÃO DEVEM SER COLOCADOS POR DIA NO AQUÁRIO? 70 95 100 105 110 QUANTIDADE DE RAÇÃO POR DIA (EM GRAMAS) 25 15 20 10",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2025-f1-m2-q08",
    "theme": "medidas",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 8,
    "answer": 3,
    "questionImage": "/obmep/2025-f1-m2-q08.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q08-s1.webp"
    ],
    "altText": "8. A FAIXA DECORATIVA FOI FEITA COM PALITOS DE FÓSFORO DE 3 CENTÍMETROS DE COMPRIMENTO. QUANTOS PALITOS DE FÓSFORO FORAM USADOS? 15 41 50 51 55 30 CENTÍMETROS",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2025-f1-m2-q09",
    "theme": "graficos",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 9,
    "answer": 0,
    "questionImage": "/obmep/2025-f1-m2-q09.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q09-s1.webp",
      "/obmep/2025-f1-m2-q09-s2.webp"
    ],
    "altText": "9. AS CASAS DO TABULEIRO AO LADO DEVEM SER PREENCHIDAS COM OS NÚMEROS DE 1 A 9 DE FORMA QUE AS SOMAS DOS NÚMEROS NAS DUAS PRIMEIRAS LINHAS E COLUNAS SEJAM AS INDICADAS. QUAL NÚMERO DEVE SER ESCRITO NA CASA CINZA? 4 5 6 7 8 6 14 20 22",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2025-f1-m2-q10",
    "theme": "medidas",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 10,
    "answer": 1,
    "questionImage": "/obmep/2025-f1-m2-q10.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q10-s1.webp"
    ],
    "altText": "10. A FIGURA AO LADO É FORMADA POR 3 QUADRADOS. QUAL É A MEDIDA, EM CENTÍMETROS, DO CONTORNO DESSA FIGURA? 20 22 24 28 30 3 CENTÍMETROS 4 CENTÍMETROS",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2025-f1-m2-q11",
    "theme": "geometria",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 11,
    "answer": 3,
    "questionImage": "/obmep/2025-f1-m2-q11.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q11-s1.webp",
      "/obmep/2025-f1-m2-q11-s2.webp"
    ],
    "altText": "0 1 2 3 4 11. QUANTOS QUADRADOS DA COR CINZA SERÃO FORMADOS QUANDO AS QUATRO PEÇAS DE QUEBRA- CABEÇA FOREM ENCAIXADAS CORRETAMENTE, RESPEITANDO A FORMA E A COR?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f1-m2-q12",
    "theme": "geometria",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 12,
    "answer": 2,
    "questionImage": "/obmep/2025-f1-m2-q12.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q12-s1.webp",
      "/obmep/2025-f1-m2-q12-s2.webp"
    ],
    "altText": "12. JOÃO MONTOU AS CINCO PEÇAS ABAIXO COM CUBINHOS. ELE USOU UM PINGO DE COLA PARA UNIR DUAS FACES EM CONTATO. EM QUAL PEÇA ELE USOU MAIS PINGOS DE COLA?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f1-m2-q13",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 13,
    "answer": 0,
    "questionImage": "/obmep/2025-f1-m2-q13.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q13-s1.webp"
    ],
    "altText": "A B C D E 13. ROBERTO ANDA EM LINHA RETA E VIRA À DIREITA SEMPRE QUE ENCONTRA UMA PAREDE, COMO MOSTRA O EXEMPLO AO LADO. NO LABIRINTO ABAIXO, POR QUAL PONTO ELE DEVERÁ SAIR? B A ENTRADA ENTRADA E D C",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f1-m2-q14",
    "theme": "geometria",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 14,
    "answer": 3,
    "questionImage": "/obmep/2025-f1-m2-q14.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q14-s1.webp",
      "/obmep/2025-f1-m2-q14-s2.webp"
    ],
    "altText": "14. ERNESTO QUER COLOCAR AS PEÇAS DE UM QUEBRA-CABEÇAS SOBRE UM QUADRICULADO, SEM GIRAR OU VIRAR AS PEÇAS. ELE JÁ COLOCOU ALGUMAS DELAS, CONFORME MOSTRADO NA FIGURA E AINDA FALTA COLOCAR CINCO PEÇAS, MOSTRADAS ABAIXO. QUAL DESSAS PEÇAS IRÁ COBRIR O QUADRADO COM O PONTO DE INTERROGAÇÃO?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f1-m2-q15",
    "theme": "logica",
    "year": 2025,
    "phase": 1,
    "level": "m2",
    "number": 15,
    "answer": 3,
    "questionImage": "/obmep/2025-f1-m2-q15.webp",
    "solutionImages": [
      "/obmep/2025-f1-m2-q15-s1.webp"
    ],
    "altText": "DUDA, ANA, CLÉO, BIA, EVA DUDA, ANA, CLÉO, EVA, BIA EVA, BIA, DUDA, ANA, CLÉO EVA, BIA, CLÉO, ANA, DUDA BIA, EVA, CLÉO, DUDA, ANA 15. OBSERVE AS MENINAS: ● ANA, BIA E CLÉO ESTÃO DE OLHOS ABERTOS; ● CLÉO, DUDA E EVA ESTÃO DE BOCA ABERTA; ● BIA, CLÉO E EVA ESTÃO COM LAÇO NA CABEÇA; ● DUDA E ANA ESTÃO LADO A LADO. QUAL É A ORDEM DAS MENINAS, DA ESQUERDA PARA A DIREITA?",
    "hints": [
      "Não tente adivinhar. Releia cada condição e marque o que obrigatoriamente precisa acontecer.",
      "Teste uma alternativa por vez e veja se ela contradiz alguma informação do enunciado.",
      "Elimine os casos impossíveis. A resposta é a única possibilidade que respeita todas as condições."
    ]
  },
  {
    "id": "2025-f2-m1-q01",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 1,
    "answer": 3,
    "questionImage": "/obmep/2025-f2-m1-q01.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q01-s1.webp"
    ],
    "altText": "1. PAULINHO ESCREVEU OS NUMEROS DE 1 ATE 10 EM SEUS DEDOS, OLHOU PARA ELES E VIU QUE FICARAM COMO NA FIGURAAO LADO. DEPOIS ELE VIROU AS MAOS, CRUZOU OS BRAGOS E DOBROU UM DE SEUS DEDOS; FICOU ASSIM: SB QUAL E O NUMERO ESCRITO NO DEDO QUE ELE DOBROU? @® 2 3 © 7 © 8 © 9",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m1-q02",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 2,
    "answer": 3,
    "questionImage": "/obmep/2025-f2-m1-q02.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q02-s1.webp"
    ],
    "altText": "2. O PROFESSOR DE EDUCAGAO FISICA CONTOU 13 ALUNOS NA SUA AULA. ELE ESCOLHEU UM DOS ALUNOS PARA APITAR O JOGO E DIVIDIU OS DEMAIS EM DOIS TIMES COM A MESMA QUANTIDADE DE JOGADORES. QUANTOS JOGADORES FICARAM EM CADA TIME? _ a ©: Se ee ee 4 — 2 —— se 2? © 5 = AS ae) Wi = © 6 , Ps a P, x 5 vw, © © 7 4",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f2-m1-q03",
    "theme": "tempo",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 3,
    "answer": 4,
    "questionImage": "/obmep/2025-f2-m1-q03.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q03-s1.webp"
    ],
    "altText": "3. AFIGURAAO LADO MOSTRA COMO ESTAVA UM PAINEL DUAS HORAS ATRAS. pEpoIG) DAQUELE INSTANTE ATE AGORA, A TEMPERATURA DIMINUIU 3 GRAUS. | 6:20] QUAL FIGURA MOSTRA O PAINEL AGORA? TEMPERATURA ote le) RELOGIO RELOGIO RELOGIO RELOGIO RELOGIO @ TEMPERATURA TEMPERATURA © TEMPERATURA © TEMPERATURA © TEMPERATURA [23 fe 2D fe | fe 2 3}e | fe fe) le) le) le) fe)",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2025-f2-m1-q04",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 4,
    "answer": 2,
    "questionImage": "/obmep/2025-f2-m1-q04.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q04-s1.webp",
      "/obmep/2025-f2-m1-q04-s2.webp"
    ],
    "altText": "4. AMANDA TEM SEIS CARTOES, COM OS NUMEROS 1, 2, 3, 4, 5 E 6. AMANDA ESCOLHEU TRES DESSES CARTOES E SOMOU OS NUMEROS QUE ESTAVAM ESCRITOS NOS CARTOES ESCOLHIDOS. QUAL E A MAIOR SOMA QUE ELA PODE TER OBTIDO? @® 13 \"4 123456 © 15 ) ) @© 16 © 17",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f2-m1-q05",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 5,
    "answer": 3,
    "questionImage": "/obmep/2025-f2-m1-q05.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q05-s1.webp"
    ],
    "altText": "5. QUAL PULSEIRA ABAIXO E DIFERENTE DAS OUTRAS QUATRO? ° '? a, © 3 ° {3 © -",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f2-m1-q06",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 6,
    "answer": 3,
    "questionImage": "/obmep/2025-f2-m1-q06.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q06-s1.webp"
    ],
    "altText": "6. COM 6 REAIS LUISINHO PODE COMPRAR TRES LAPIS OU COMPRAR UM LAPIS E UMA CANETA, SEM RECEBER TROCO. QUANTO CUSTAA CANETA? @ 2REAIS E 50 CENTAVOS ; : 3 REAIS © 3REAIS E50 CENTAVOS @© 4REAIS © 4REAIS E 50 CENTAVOS",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f2-m1-q07",
    "theme": "tempo",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 7,
    "answer": 1,
    "questionImage": "/obmep/2025-f2-m1-q07.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q07-s1.webp"
    ],
    "altText": "7. JOSE OLHOU O RELOGIO PELA MANHA E ELE MARCAVA NO OUTRO DIAA TARDE, ELE OLHOU NOVAMENTE PARA O RELOGIO E VIU QUE ELE MARCAVA QUANTAS HORAS SE PASSARAM ENTRE ESSES DOIS MOMENTOS? @ 28HORAS 30 HORAS © 32HORAS @ 33HORAS © 34HORAS",
    "hints": [
      "Observe com atenção as horas, os minutos, os dias e a ordem em que os acontecimentos ocorrem.",
      "Use grupos completos: 60 minutos formam uma hora e 7 dias formam uma semana.",
      "Monte uma pequena linha do tempo e avance apenas o intervalo pedido."
    ]
  },
  {
    "id": "2025-f2-m1-q08",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 8,
    "answer": 4,
    "questionImage": "/obmep/2025-f2-m1-q08.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q08-s1.webp",
      "/obmep/2025-f2-m1-q08-s2.webp"
    ],
    "altText": "8. JULIA QUER TERMINAR DE PREENCHER O TABULEIRO AO LADO COM TRIANGULOS, CIRCULOS E ESTRELAS NAS CORES BRANCA, CINZA E PRETA. S ¢ ELA QUER QUE CADA LINHA E CADA COLUNA DO TABULEIRO TENHA FIGURAS DE TODAS ESSAS FORMAS E CORES. QUAL FIGURA JULIA DEVE COLOCAR NO LUGAR DA INTERROGAGAO? oA oA oO o@ o%| | |?",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m1-q09",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 9,
    "answer": 4,
    "questionImage": "/obmep/2025-f2-m1-q09.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q09-s1.webp",
      "/obmep/2025-f2-m1-q09-s2.webp"
    ],
    "altText": "9. QUAL DAS PEGAS ABAIXO PODE SER ENCAIXADA EM ALGUM ESPAGO EM BRANCO NO TABULEIRO AO LADO? oF oF OE 0 Oh o afl Ae",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f2-m1-q10",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 10,
    "answer": 4,
    "questionImage": "/obmep/2025-f2-m1-q10.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q10-s1.webp"
    ],
    "altText": "10. CAROLINA CORTOU UM TRIANGULO GRANDE EM 3 PEDAGOS: UM QUADRADO E DOIS TRIANGULOS IGUAIS, COMO NA FIGURAAO LADO. Qe QUAL DAS FIGURAS A SEGUIR NAO PODE SER MONTADA JUNTANDO ESSES 3 PEDAGOS, LADO ALADO? y , i a a a",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m1-q11",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 11,
    "answer": 0,
    "questionImage": "/obmep/2025-f2-m1-q11.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q11-s1.webp",
      "/obmep/2025-f2-m1-q11-s2.webp"
    ],
    "altText": "11. CAMILA QUER MONTAR A FIGURA PONTILHADA COM QUATRO DAS CINCO PEGAS DAS ws ALTERNATIVAS. fo DUAS PEGAS SO SE JUNTAM SE OS ENCAIXES NAS PONTAS FOREM IGUAIS. fore, QUAL PEGA ELA NAO VAI USAR? fx. fs SJ LA Ly A LA",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m1-q12",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 12,
    "answer": 2,
    "questionImage": "/obmep/2025-f2-m1-q12.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q12-s1.webp"
    ],
    "altText": "12. OS BONEQUINHOS ABAIXO FORMARAM UMA RODA E CADA UM DELES DEU UMA MAO PARA SEU VIZINHO DA ESQUERDA E OUTRA MAO PARA SEU VIZINHO DA DIREITA. QUANTAS MAOS FICARAM LIVRES? @® 4 5 © 6 @ 7 © 8",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f2-m1-q13",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 13,
    "answer": 1,
    "questionImage": "/obmep/2025-f2-m1-q13.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q13-s1.webp",
      "/obmep/2025-f2-m1-q13-s2.webp"
    ],
    "altText": "13. RENATO QUER PREENCHER TODA A FIGURA PONTILHADA USANDO A MENOR as QUANTIDADE POSSIVEL DAS PEGAS ABAIXO. aa TRIANGULO LOSANGO / \\ va \\ QUANTAS PEGAS EM FORMA DE LOSANGO ELE VAI USAR? foie 3 5S © 4 @ 5 © 6",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m1-q14",
    "theme": "medidas",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 14,
    "answer": 3,
    "questionImage": "/obmep/2025-f2-m1-q14.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q14-s1.webp"
    ],
    "altText": "14. 0 CACHORRO E O GATO PESAM, JUNTOS, 16 QUILOGRAMAS. O CACHORRO E O COELHO, 14 QUILOGRAMAS. O GATO E O COELHO, 10 QUILOGRAMAS. QUAL E O PESO, EM QUILOGRAMAS, DOS TRES ANIMAIS JUNTOS? @® 17 18 © 19 / 8 x £7 || Mat © 21 MM. > 16 QUILOGRAMAS, 14 QUILOGRAMAS 10 QUILOGRAMAS, ?",
    "hints": [
      "Identifique o que está sendo medido e a unidade usada: comprimento, massa, capacidade, área ou tempo.",
      "Coloque todas as medidas na mesma unidade antes de comparar ou calcular.",
      "Estime o resultado primeiro e depois faça a conta para verificar se a resposta é razoável."
    ]
  },
  {
    "id": "2025-f2-m1-q15",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m1",
    "number": 15,
    "answer": 3,
    "questionImage": "/obmep/2025-f2-m1-q15.webp",
    "solutionImages": [
      "/obmep/2025-f2-m1-q15-s1.webp"
    ],
    "altText": "15. JOAO TEM UMA ROLETA COM DOIS CiIRCULOS, UM AZUL CLARO POR CIMA E OUTRO AZUL ESCURO POR BAIXO. CADA CIRCULO ESTA DIVIDIDO EM SEIS A = _) PARTES E, EM CADA PARTE, HA UMA FIGURA. JOAO PODE GIRAR UM C/RCULO 4 oy Nn DE CADA VEZ. N [aasSartilnrrn ELE GIROU UM CiRCULO E ESTAS FIGURAS FICARAM JUNTAS: mM » ew - QUAIS FIGURAS TAMBEM PODEM TER FICADO JUNTAS? y 3X : v a a © .«& Cc © .& © ,& © *&",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m2-q01",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 1,
    "answer": 2,
    "questionImage": "/obmep/2025-f2-m2-q01.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q01-s1.webp"
    ],
    "altText": "1. PAULINHO ESCREVEU OS NUMEROS DE 1 ATE 10 EM SEUS DEDOS, OLHOU pA . PARA ELES E VIU QUE FICARAM COMO NA FIGURAAO LADO. 6 DEPOIS ELE VIROU AS MAOS, CRUZOU OS BRAGOS E DOBROU 2 DE SEUS DEDOS; FICOU ASSIM: SY QUAL E A SOMA DOS NUMEROS ESCRITOS NOS DEDOS QUE ELE DOBROU? ® 10 ® © 12 © 13 © 14",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m2-q02",
    "theme": "numerico",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 2,
    "answer": 2,
    "questionImage": "/obmep/2025-f2-m2-q02.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q02-s1.webp"
    ],
    "altText": "2. RAFAEL ESCREVEU EM SEU CADERNO OS NUMEROS DE 10 A 30. QUANTAS VEZES ELE ESCREVEU O ALGARISMO 1? ® 9 10 © 12 ® 13 © 14",
    "hints": [
      "Observe os algarismos, a ordem dos números e qualquer padrão que se repita.",
      "Compare o que muda de um número para o seguinte e teste a regra nos primeiros exemplos.",
      "Aplique a mesma regra até a posição pedida e confira se ela funciona em toda a sequência."
    ]
  },
  {
    "id": "2025-f2-m2-q03",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 3,
    "answer": 2,
    "questionImage": "/obmep/2025-f2-m2-q03.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q03-s1.webp",
      "/obmep/2025-f2-m2-q03-s2.webp"
    ],
    "altText": "3. TRES CARRINHOS ESTAO POSICIONADOS NUMA PISTA, COMO NA FIGURA AO LADO. OS TRES CARRINHOS ANDAM SEMPRE COM A MESMA VELOCIDADE E DAO UMA VOLTA COMPLETA NA PISTA EM 10 SEGUNDOS. COMO OS CARRINHOS ESTARAO DEPOIS DE 5 SEGUNDOS ANDANDO NO SENTIDO INDICADO PELA SETA? wee @ = a © aaa Y © © ap a 4 43",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m2-q04",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 4,
    "answer": 1,
    "questionImage": "/obmep/2025-f2-m2-q04.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q04-s1.webp"
    ],
    "altText": "4. ANA, BIA, CARLA E DUDA SAO AS UNICAS NA FILA DA LANCHONETE. ANA E A ULTIMA DA FILA E DUDA ESTA JUNTO DE BIA E ANA NA FILA. QUEM SAO AS DUAS PRIMEIRAS MENINAS DA FILA? @® BIAE DUDA ¢ CARLA E BIA hy © CARLAE DUDA ig! T! VaweY. ws\" @ BIAEANA iy weer © CARLAE ANA 2a ae",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f2-m2-q05",
    "theme": "combinatoria",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 5,
    "answer": 3,
    "questionImage": "/obmep/2025-f2-m2-q05.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q05-s1.webp",
      "/obmep/2025-f2-m2-q05-s2.webp"
    ],
    "altText": "5. MARCELINA QUER GUARDAR 4 LIVROS DIFERENTES EM UMA ESTANTE, EM PE, LADO ALADO. SAO 2 LIVROS DE PORTUGUES E 2 DE MATEMATICA. ELA QUER QUE OS LIVROS DA MESMA MATERIA FIQUEM JUNTOS. DE QUANTAS MANEIRAS DIFERENTES ELA PODE FAZER ISSO? @® 2 4 © 6 © 8 © 12",
    "hints": [
      "Liste algumas possibilidades de forma organizada antes de tentar contar todas.",
      "Escolha uma primeira opção e combine-a com cada uma das opções restantes; depois repita.",
      "Use uma tabela ou árvore de possibilidades e confira se nenhum caso foi repetido."
    ]
  },
  {
    "id": "2025-f2-m2-q06",
    "theme": "graficos",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 6,
    "answer": 3,
    "questionImage": "/obmep/2025-f2-m2-q06.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q06-s1.webp"
    ],
    "altText": "6. ATABELA MOSTRA A QUANTIDADE DE RAGAO QUE CADATIPO DE PEIXEE O POLVO COMEM POR DIA. PARA MANTER O AQUARIO DA FIGURA E PRECISO tom 105 GRAMAS DE RAGAO POR DIA. & 7 QUANTOS GRAMAS DE RACAO O QUANTIDADE DE RAGAO POR DIA >» ae POLVO COME POR DIA? (EM GRAMAS) & I: @® 10 | & | ? GRAMAS 15 15 GRAMAS \" © 20 ® 25 20 GRAMAS © 30 10 GRAMAS",
    "hints": [
      "Leia primeiro o título, as categorias e a legenda da tabela ou do gráfico.",
      "Localize somente os dados pedidos e compare as linhas, colunas ou símbolos correspondentes.",
      "Transforme a informação visual em números e só então faça a operação necessária."
    ]
  },
  {
    "id": "2025-f2-m2-q07",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 7,
    "answer": 1,
    "questionImage": "/obmep/2025-f2-m2-q07.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q07-s1.webp"
    ],
    "altText": "7. UM CUBO DE MADEIRA FOI PINTADO DE VERMELHO E DEPOIS CORTADO EM 27 CUBINHOS DE MESMO TAMANHO, COMO INDICADO NA FIGURA. QUANTOS DOS 27 CUBINHOS POSSUEM APENAS UMA DE SUAS FACES PINTADAS DE VERMELHO? @® 4 6 © 8 ® 10 © 27",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m2-q08",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 8,
    "answer": 0,
    "questionImage": "/obmep/2025-f2-m2-q08.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q08-s1.webp",
      "/obmep/2025-f2-m2-q08-s2.webp"
    ],
    "altText": "8. DEZ FIGURAS, DUAS DE CADA TIPO, FORAM DISTRIBUIDAS PARA ANA, BETO, CARLA, DANIEL E ELISA, COMO ABAIXO: ANA BETO CARLA DANIEL ELISA He AY @x AH ? QUAIS FIGURAS ELISA RECEBEU? oxcKY ok OY AD °x®@",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m2-q09",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 9,
    "answer": 1,
    "questionImage": "/obmep/2025-f2-m2-q09.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q09-s1.webp"
    ],
    "altText": "9. O CUBO DE MARTINA TEMAS LETRAS A, B, C, D, E E F, UMAEM CADA FACE. MARTINA ROLOU SEU CUBO SOBRE A MESA, COMO MOSTRADO ABAIXO: QUAL E ALETRA QUE ESTA NA FACE OPOSTA A FACE COM ALETRA F? @A B ©c @bd ©E",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m2-q10",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 10,
    "answer": 1,
    "questionImage": "/obmep/2025-f2-m2-q10.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q10-s1.webp"
    ],
    "altText": "10. SE PAULINHO DESSE TODO SEU DINHEIRO PARA ANINHA, ELA FICARIA COM 25 REAIS. SE ANINHA DESSE METADE DO SEU DINHEIRO PARA PAULINHO, ELE FICARIA COM 19 REAIS. QUANTOS REAIS TEM PAULINHO? @ 12 13 © 15 © 16 © 18",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f2-m2-q11",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 11,
    "answer": 3,
    "questionImage": "/obmep/2025-f2-m2-q11.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q11-s1.webp",
      "/obmep/2025-f2-m2-q11-s2.webp"
    ],
    "altText": "11. AS DUAS FIGURAS FORAM FEITAS COM QUADRADINHOS BRANCOS DE UM LADO E PRETOS DO OUTRO. SE UM QUADRADINHO FOR VIRADO, ELE DEVE PERMANECER NA MESMA POSICAO EM QUE ESTAVA. QUANTOS QUADRADINHOS DA FIGURA DA ESQUERDA DEVEM SER VIRADOS PARA QUE ELA SE TRANSFORME NA FIGURA DA DIREITA? @® 12 14 © 16 > © 18 © 20",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m2-q12",
    "theme": "geometria",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 12,
    "answer": 4,
    "questionImage": "/obmep/2025-f2-m2-q12.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q12-s1.webp"
    ],
    "altText": "12. MILENA TINHA UM COLAR COM 8 MIGANGAS, COMO MOSTRA A FIGURA AO LADO. ELA REMOVEU 4 MIGANGAS PELAS PONTAS DO COLAR. QUAL ALTERNATIVA NAO MOSTRA COMO O COLAR PODE TER FICADO? @ i 0 Yue 0 Mag 3 Mag o ‘eg",
    "hints": [
      "Observe a figura com calma: lados, posições, partes escondidas e o que muda entre as alternativas.",
      "Tente imaginar a figura girando, dobrando ou vista por outro lado. Se ajudar, desenhe uma versão bem simples.",
      "Compare as alternativas uma a uma e elimine as que não respeitam todas as partes da figura."
    ]
  },
  {
    "id": "2025-f2-m2-q13",
    "theme": "percurso",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 13,
    "answer": 4,
    "questionImage": "/obmep/2025-f2-m2-q13.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q13-s1.webp",
      "/obmep/2025-f2-m2-q13-s2.webp"
    ],
    "altText": "13. MARCELO VAI PINTAR UM CARTAZ E TEM 4 CORES DE TINTA A SUA DISPOSICAO: AMARELA, BRANCA, CINZA E DOURADA. ELE PRECISA USAR DUAS OU TRES DESSAS CORES, POREM, ¢ SEUSAR TINTAAMARELA, NAO PODE USAR BRANCA. ¢ —SEUSARTINTACINZA, NAO PODE USAR DOURADA. ¢ —SEUSARTINTACINZA, TAMBEM DEVE USAR BRANCA. QUAL DAS ALTERNATIVAS MOSTRA UMA POSSIVEL COMBINACAO DE CORES PARA MARCELO PINTAR O CARTAZ? ® AMARELAE CINZA. BRANCA, CINZA E DOURADA. © AMARELAE BRANCA. @ CINZA, DOURADA E AMARELA. © BRANCAE DOURADA.",
    "hints": [
      "Acompanhe o caminho com o dedo e identifique o ponto de partida, o destino e as regras do percurso.",
      "Conte por etapas, anotando cada possibilidade para não repetir nem esquecer caminhos.",
      "Confira se todos os percursos contados obedecem às direções e restrições do enunciado."
    ]
  },
  {
    "id": "2025-f2-m2-q14",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 14,
    "answer": 4,
    "questionImage": "/obmep/2025-f2-m2-q14.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q14-s1.webp"
    ],
    "altText": "14. ANAE BIA TEM JUNTAS ESTES SEIS DOCES: 9% O* * 0% 0* * ELAS DIVIDEM OS DOCES EM QUANTIDADES IGUAIS E DE ACORDO COM O QUE CADA UMA GOSTA. GOSTA costa | NAO GOSTA costa |NAOGOSTA| GOSTA QUAL ALTERNATIVA MOSTRA OS DOCES COM QUE UMA DELAS FICOU? @ Ana: OF 4 * ANA: 4Of9@* @* © BIA: gO, OF a © BA ,OF, 0% o* © BA: 40% gB* e*",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  },
  {
    "id": "2025-f2-m2-q15",
    "theme": "aritmetica",
    "year": 2025,
    "phase": 2,
    "level": "m2",
    "number": 15,
    "answer": 0,
    "questionImage": "/obmep/2025-f2-m2-q15.webp",
    "solutionImages": [
      "/obmep/2025-f2-m2-q15-s1.webp"
    ],
    "altText": "15. UM MAGICO TRANSFORMA 4 CHAPEUS EM UMA VARINHA E 4 VARINHAS EM UM CHAPEU. SEMPRE QUE O MAGICO PODE, ELE FAZ UMA TRANSFORMAGAO. AGORA ELE ESTA COM 3 CHAPEUS E 7 VARINHAS. APOS FAZER AS TRANSFORMACOES POSSIVEIS, COM O QUE VAI FICAR O MAGICO? @ 1CHAPEU 1 VARINHA © 2CHAPEUS > > @ 2VARINHAS © 1CHAPEU E 1 VARINHA",
    "hints": [
      "Separe os números do enunciado e diga com suas palavras o que acontece com cada um.",
      "Resolva uma etapa de cada vez. Pergunte se a quantidade aumenta, diminui, se repete ou é repartida.",
      "Faça a conta e depois confira se o resultado combina com a situação descrita."
    ]
  }
] as OfficialQuestion[];
