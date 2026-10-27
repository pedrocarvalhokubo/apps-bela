# Science • revisão completa do 3º trimestre

Atualização de 27/10/2026 a partir das 23 páginas enviadas e da autorização para concluir Ciências. Base: `22d413bcb8c4a9184f4c38ff889adf7e6d989b38`.

## Conteúdo

Dez aulas em inglês com apoio em português: som; audição; rochas e minerais; formação das rochas; fósseis; paisagens e relevo; intemperismo, erosão e deposição; proteção do solo; leitura sobre Gondwanax paraisensis; leitura sobre o furacão Matthew.

A extensão acrescenta exemplos de minerais e usos, vocabulário de relevo, usos e transformações das rochas e as duas leituras finais. Cada aula tem quatro questões com duas pistas e explicações para todas as alternativas, além de duas atividades escritas. Os dois simulados distribuem as 40 questões sem repetição, com duas de cada assunto em cada simulado. As quatro atividades de associação existentes continuam disponíveis.

Os quatro infográficos aprovados de massinha 3D são preservados e agora aparecem também dentro das aulas correspondentes. A comparação de satélite do rio Cavaillon é uma imagem pública da NASA, com crédito e datas. A comparação das dunas é tratada em texto, com link à fonte USGS.

## Compatibilidade

Os oito IDs anteriores de aulas, o quiz `science-general` e suas 20 questões permanecem intactos para retomada e histórico. Novos quizzes usam o prefixo `science3-`. Não há migração de banco, alteração da sincronização ou do volume `/data`. Os rascunhos escritos ficam no aparelho, identificados por atividade, como os de ELA. O 3º trimestre continua selecionado ao abrir o app.

O contrato e o validador de `science-content.json` continuam descrevendo o conjunto original. A ampliação está em `science-extension.json`, integrada por `science-data.ts`, com testes próprios. Os PDFs anteriores continuam acessíveis nos endereços antigos.

## Revisão e fontes

Os textos escolares fotografados foram usados como referência privada; fotografias, nomes de aluna/escola e datas de avaliação não foram publicados. Conteúdo público: explicações e questões autorais, recursos já aprovados e imagem pública com atribuição.

- [UFSM / CAPPA: Gondwanax paraisensis](https://www.ufsm.br/2024/10/14/descoberto-em-paraiso-do-sul-um-dos-mais-antigos-precursores-dos-dinossauros): local, idade aproximada, descobridor, pesquisador e debate sobre a posição evolutiva. O animal não é apresentado como cachorro nem como dinossauro incontestável.
- [NASA Earth Observatory: Haiti](https://science.nasa.gov/earth/earth-observatory/hurricane-matthews-aftermath-in-haiti-88933/): comparação de 26/09/2016 e 12/10/2016, vegetação e sedimentos. Imagem de Jesse Allen com dados Landsat do USGS; fonte de imagem: https://science.nasa.gov/wp-content/uploads/2025/10/cavaillon_oli_2016286.jpg .
- [USGS: dunas após Matthew](https://www.usgs.gov/news/featured-story/and-after-photos-se-beach-dunes-lost-hurricane-matthew): o novo canal perto de St. Augustine fica na Flórida, não no Haiti; fotos de 06/09/2014 e 13/10/2016. Essa distinção corrige a mistura geográfica do material.

Intemperismo fragmenta/altera no local; erosão remove e transporta; deposição acumula. Metamorfismo não exige fusão. Altura e intensidade do som são distinguidas. O canal construído do vocabulário não é classificado como relevo natural.

## Impressão e validação

`scripts/build-science-review.py` gera dois PDFs A4: revisão de dez páginas com 20 atividades e gabarito separado de cinco páginas. As duas leituras são incluídas na folha, que funciona sem abrir o app. As 15 páginas foram renderizadas e inspecionadas; textos e linhas de resposta não se sobrepõem.

14 testes aprovados: compatibilidade de IDs e perguntas antigas, distribuição dos simulados, quizzes por aula, materiais, pistas, roteamento de trimestres, isolamento de perfis, persistência e pareamento. Build de produção e TypeScript aprovados. O suplemento preserva os pacotes anteriores e verifica 479 arquivos por hash.
