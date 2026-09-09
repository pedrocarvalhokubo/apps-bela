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

Os 457 arquivos públicos estão no pacote sem perdas `.asset-bundle`, com verificação SHA-256. `npm run build`, `npm run dev` e `npm start` restauram automaticamente `public/` antes de executar. Isso preserva cada imagem, PDF e recurso sem depender de links dos sites antigos. Para editar ou adicionar imagens: execute `node scripts/restore-assets.mjs`, edite `public/`, execute `npm run assets:pack` e inclua as alterações de `.asset-bundle` no commit. O build recusa arquivos locais divergentes, evitando sobrescrever edições não empacotadas.
