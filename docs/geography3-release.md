# Geografia • III trimestre

Implementação conduzida por Codex nesta frente, a partir da versão `91abd053dac9480853fdada59f6f70c68bd4f022`, confirmada como ativa no Railway. A pasta escolar canônica e o guia fotografado atual foram conferidos; as fotos enviadas são a fonte do conteúdo. Não foram copiados originais, anotações, nome completo, turma, escola ou agenda para o repositório público.

## Comportamento

Geografia passa a aparecer no 3º trimestre, com quatro aulas sobre lugares/pontos de vista; ritmos/caminhos; povos/culturas; proteção/deslocamentos forçados. O segundo trimestre e seus identificadores permanecem disponíveis. A retomada de aulas, quizzes e simulados considera o trimestre correto.

Quatro infográficos novos em PNG, ilustrados com gatos conforme as referências atuais de Bela, aparecem tanto na revisão visual quanto dentro das aulas. É possível ampliar e baixar cada PNG. Não há PDF embutido no estudo. A impressão é uma opção separada, com os simulados A e B, atividades de escrita e gabarito consultado depois.

O quiz tem 20 questões; os simulados A e B têm 20 questões cada. Os três conjuntos têm IDs, enunciados e situações independentes, com cinco questões por área em cada conjunto e respostas corretas equilibradas entre A/B/C/D. Os quizzes por aula são atalhos para as cinco questões daquele tema no quiz de descoberta, e não novas provas. Cada tentativa usa o conjunto escolhido; reabrir o mesmo simulado repete aquele simulado. As quatro atividades escritas têm outros contextos e salvam pelo mecanismo de rascunhos já existente.

A data da avaliação usa `BELA_GEOGRAPHY_ASSESSMENT_DATE` no ambiente do servidor. `/api/study-plan` exige a sessão da conta e responde com `private, no-store`. Não há data escolar em conteúdo público ou modo convidado. O volume SQLite, autenticação e histórico existentes são preservados.

## Contrato pedagógico para próximas provas

- Aumentar o desafio por aplicação, comparação, justificativa e leitura de evidências; evitar vocabulário desnecessariamente difícil e pegadinhas.
- Não gerar prova B apenas trocando nomes ou cidades da prova A. Variar o contexto, o tipo de evidência e a operação de raciocínio.
- Não reciclar as mesmas questões do quiz em simulados apresentados como novos. Repetição de definições e respostas únicas pode ser inevitável; repetição de cenário deve ser deliberada e identificada.
- Distinguir conceito de critério: interna/externa descreve fronteiras; pendular/sazonal descreve ritmo; êxodo rural descreve campo–cidade. Classificações podem coexistir.
- Explicar que interna não é sinônimo de entrada. Não inferir êxodo rural de qualquer visita à cidade.
- Não tratar povos indígenas só no passado, não hierarquizar grupos, e não apresentar escravização como migração voluntária.
- Desastres podem forçar deslocamentos, mas não conferem automaticamente reconhecimento de refúgio. Não testar requisitos jurídicos adicionais; os casos focam os conceitos do material.
- Não repetir a afirmação de que a umbanda teria vindo pronta da África nem dar origem exclusiva a comidas com história complexa.

## Fontes de apoio à revisão de precisão

A matéria e o recorte vêm das fotos autorizadas; os links abaixo apenas conferem duas distinções:

- ACNUR: https://www.acnur.org/br/o-que-fazemos/temas-especificos/mudancas-climaticas-e-deslocamento
- ACNUR, guia conceitual: https://www.acnur.org/br/sites/br/files/2025-12/202512-as-relacoes-entre-as-mudancas-climaticas-e-o-deslocamento-forcado.pdf
- IPHAN, ofício das baianas: https://sicg.iphan.gov.br/sicg/bemImaterial/rel/106/

## Validação

Verificação dos três bancos separados, distribuição por temas, alternativas, hashes dos PNGs, rotas entre trimestres, autenticação da agenda e persistência dos rascunhos. Build de produção concluído e 29 testes aprovados. Os quatro PNGs foram inspecionados visualmente e o transporte dos arquivos foi verificado por SHA-256. Testes usam banco e credenciais sintéticos; QA de produção usa modo convidado para preservar o histórico real.
