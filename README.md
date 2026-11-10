# Estudos da Bela + OBMEP Mirim

Aplicativo unificado com matérias, resumos, infográficos, quizzes e prova escrita. A área `/obmep` reúne 180 questões oficiais de 2023–2025, níveis Mirim 1 e 2, com pistas e soluções ilustradas.

O mesmo perfil conecta as duas áreas. Progresso e tentativas ficam no servidor; o PIN dos responsáveis e o pareamento por QR Code continuam disponíveis. Cada perfil é isolado. Os materiais públicos usam apenas o apelido Bela, sem escola ou agenda de provas.

## Executar

Node.js 24 ou superior:

```sh
npm ci
npm run build
npm start
```

`npm test` executa a verificação das APIs após o build. O teste usa um banco temporário e verifica isolamento de perfis, persistência após reiniciar, PIN, bloqueio após tentativas inválidas, uso único do pareamento e união de progresso OBMEP.

## Railway

O repositório inclui Dockerfile e `railway.toml`. Criar um serviço a partir deste repositório, branch `main`, com uma réplica. Anexar um volume persistente em `/data` antes da publicação. O app usa `RAILWAY_VOLUME_MOUNT_PATH/bela.sqlite` e se recusa a iniciar no Railway sem volume. A verificação de saúde é `/api/health`.

O plano e o consumo são cobrados conforme a conta Railway. Não há configuração de limite de gastos neste repositório. Conferir o custo e habilitar backups do volume na conta antes de encerrar os aplicativos antigos. Não escalar para várias réplicas com este banco SQLite.

## Migração dos dados anteriores

Ainda requer execução durante a publicação. Os domínios antigos têm armazenamento separado no navegador. Copiar os arquivos do app não transfere esse progresso.

1. Preservar os dois sites antigos até a nova publicação funcionar.
2. Exportar as tabelas D1 com ferramentas autenticadas do proprietário e importar usando `scripts/import-sites-db.mjs`. O arquivo contém dados privados: nunca incluir no Git ou em arquivos públicos.
3. Publicar temporariamente `migration/export-progress.html` como `/migrar.html` nos dois sites antigos. Cada aparelho exporta seu próprio progresso e, no app de matérias, sua chave de conexão. O arquivo deve ser tratado como uma chave de acesso pessoal.
4. Abrir `/migrar` no app novo e selecionar os arquivos exportados. O perfil só é trocado depois de a chave ser validada pelo servidor. O PIN antigo permanece válido quando a tabela `parent_settings` é migrada.
5. Confirmar aulas, notas, histórico e progresso OBMEP nos aparelhos. Só então retirar os sites antigos.

O importador é local e exige banco de destino ainda sem perfis. Não existe endpoint público de importação do banco. Importar novamente sem revisar o estado do destino não é permitido.

## Origem do conteúdo

Questões OBMEP Mirim: materiais oficiais do IMPA/OBMEP, com fontes preservadas no aplicativo. Os demais materiais foram trazidos do app de estudos existente. A aplicação não tem vínculo oficial com a OBMEP.

## Arquivos visuais

Os 463 arquivos públicos estão no pacote sem perdas `.asset-bundle`, com verificação SHA-256. `npm run build`, `npm run dev` e `npm start` restauram automaticamente `public/` antes de executar. Isso preserva cada imagem, PDF e recurso sem depender de links dos sites antigos. Para editar ou adicionar imagens: execute `node scripts/restore-assets.mjs`, edite `public/`, execute `npm run assets:pack` e inclua as alterações de `.asset-bundle` no commit. O build recusa arquivos locais divergentes, evitando sobrescrever edições não empacotadas.

## Science • III trimestre

O módulo Science inclui dez aulas bilíngues (oito do material original e duas de extensão), 74 vocabulários, quiz de vinte questões com duas pistas graduais e explicações, quatro atividades de associação, quatro infográficos e PDFs de prova/gabarito. Materiais derivados das fontes autorizadas; nenhuma foto original de apostila de aluno é publicada. Veja `docs/science-release-review.md` para validação e plano de publicação.

## Português • III trimestre

Seis aulas baseadas no guia de estudo: leitura e compreensão, tempos verbais, eu e mim, numerais, algarismos romanos e tonicidade. São 54 questões autorais com duas pistas e explicação para cada alternativa (quiz de revisão, simulado A e simulado B, 18 questões cada), seis atividades escritas com resposta de apoio, três infográficos ilustrados e uma página de impressão em `/portugues3/imprimir`. As questões treinam as habilidades do guia sem copiar os exercícios. O conteúdo é gerado por `python3 scripts/create-portuguese3-content.py`; os infográficos ficam no pacote suplementar criado por `scripts/pack-portuguese3-assets.py`. Depois de alterar as aulas, execute `npm run tutor:content`.

## Conversa com o gatinho e consumo da API

Na matéria aberta, um toque no PNG transparente inicia a voz GPT-Live 1. O botão quadrado encerra a sessão. O menu de três pontos permite acompanhar o chat, digitar ou pedir um infográfico. Abrir o chat ou pedir um infográfico mantém a voz; escolher digitação encerra a voz e continua em texto. O infográfico passa pelas mesmas revisões e limites do tutor e aparece no chat. Animações CSS indicam escuta, fala e preparação; respeitam `prefers-reduced-motion`.

Em Área dos pais → Tutor → Uso e gastos, o app mostra estimativas em USD para hoje, mês, modelo e dia. Não exige uma chave nova: usa a medição retornada pelas chamadas existentes. `tutor_api_costs` armazena somente perfil, modelo, operação, data, tokens/segundos e custo estimado; não guarda prompts, áudio ou chaves. Revisões, editor de instruções, imagens, transcrição e replay também são medidos. Durações de GPT-Live vêm de `tutor_live_sessions.used_seconds`, sem somar reservas como gasto, considerando o mínimo de inicialização WebRTC de 15 segundos por sessão (sem duplicar esse tempo). Sessões sem duração final são sinalizadas.

Tarifas Standard verificadas em 04/11/2026: GPT-Live 1 US$ 0,05/minuto; Terra US$ 1/5 por milhão de tokens de entrada/saída, leitura de cache US$ 0,05 e escrita US$ 1,25 (30 min) ou US$ 2,50 (12 h); Flare US$ 5/8/30 por milhão de tokens de entrada texto/imagem e saída; transcrição US$ 0,0045/minuto; replay mini US$ 0,60/2,40 para texto e US$ 10/20 para áudio por milhão de tokens, com taxas de cache separadas. Fonte: https://developers.openai.com/api/docs/pricing . Atualizar `lib/tutor-costs.ts` quando as tarifas ou modelos mudarem. Cache de imagens não identificável é estimado sem desconto. Chamadas sem dados ou falhas são sinalizadas como não precificadas, nunca como consumo gratuito. A medição não adiciona chamadas de geração.

O total é parcial e não é uma fatura: não reconstrói tokens de chamadas anteriores à atualização, não inclui impostos, câmbio, descontos negociados, custos Railway ou outros apps. A API oficial de custos organizacionais exige uma Admin API key separada (https://developers.openai.com/api/docs/guides/admin-apis); essa integração não está configurada. A tela fornece o link para conferir a cobrança oficial. Os limites diários de perguntas/imagens/minutos continuam valendo; não há teto financeiro automático em USD.
