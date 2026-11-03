# Tutor da Bela

## Operação

Na conta da Bela, entre na área dos pais com o PIN e abra **Tutor da Bela**.

1. Salve uma chave de projeto OpenAI com acesso aos modelos indicados na tela. O app valida o acesso ao GPT‑6.1 Terra antes de guardar a chave.
2. Para uso por uma criança menor de 13 anos, o projeto OpenAI precisa ter **Zero Data Retention habilitado pela OpenAI**. A confirmação no formulário apenas registra a declaração do responsável; não configura o projeto. `store:false` sozinho não substitui ZDR.
3. Ajuste os limites de perguntas e imagens e ative o tutor. A cobrança é da API, separada da assinatura ChatGPT; configure também o orçamento do projeto OpenAI.
4. Em **Instruções do tutor**, edite as preferências ou peça uma revisão à IA por texto/voz. A proposta é um rascunho. **Salvar instruções** aplica a versão e registra o histórico.

O botão flutuante aparece nas matérias, aulas, infográficos e avaliações da Bela. Não aparece para convidados. O microfone começa somente após um toque. A conversa alterna gravação, transcrição, resposta revisada e fala; não é áudio simultâneo de duas vias. Pode ser minimizada enquanto o material permanece visível. Pausar, mudar de matéria, sair do app ou ocultar a aba interrompe a captura. Perguntas por texto e replay do áudio também estão disponíveis. Permissões e reprodução automática dependem do navegador.

## Conteúdo e revisão

`content/tutor/instructions.md` contém as regras fixas. Cada módulo tem um arquivo `.md` com aulas, aprofundamentos e ampliação autoral; `enrichment.json` registra os exemplos adicionais e fontes de conferência. `catalog.json` controla matérias, aulas e páginas aceitas. Atualize tudo com `npm run tutor:content` após editar o currículo. Os arquivos `*-assessment.md` documentam exemplos e alternativas para o curador e **não são enviados ao tutor**.

Somente o módulo validado no servidor é enviado. O modelo não navega, não chama ferramentas externas e não acessa o banco. Preferências dos pais não mudam autenticação, limites ou regras fixas. Uma segunda avaliação independente confere escopo e apoio no conteúdo. Na avaliação, o tutor dá pistas e exemplos análogos. Isso reduz erros de IA, mas não garante infalibilidade.

Pedidos visuais passam por roteiro, moderação, limite diário, geração PNG e revisão visual antes da entrega. Voz usa o texto revisado; a transcrição da fala sintetizada é comparada e, se necessário, revisada antes de disponibilizar o áudio. As imagens e o áudio sintetizado são privados.

## Servidor e dados

- Defina `BELA_TUTOR_ENCRYPTION_KEY` com 32 bytes aleatórios em hexadecimal (64 caracteres), somente nas variáveis privadas do serviço. Não a inclua em Git, client bundles ou logs. Preserve essa chave entre deploys; trocá-la torna as chaves de API já salvas indecifráveis.
- A chave OpenAI fica no SQLite, cifrada com AES‑256‑GCM. As respostas da API de configuração mostram apenas se há uma chave configurada.
- Todos os endpoints exigem sessão HTTP da conta `bela-account-v2`; configurações e histórico completo também exigem sessão parental. O PIN não é transmitido à OpenAI.
- Perguntas transcritas, respostas, contexto, tópicos e sugestões ficam nas tabelas `tutor_*`. Não há gravação persistente da voz enviada pela criança. Respostas sintetizadas e PNGs ficam no volume persistente em `tutor-media`, fora de `public`, servidas mediante autorização. Não há expiração automática dos registros.
- Limites diários são atômicos e seguem o fuso `America/Bahia`. Pedidos iniciados contam mesmo quando falham. Há idempotência por mensagem, limite de frequência e até três tentativas de síntese por resposta. Replays de áudio pronto e imagens prontas usam cache privado do servidor.
- O volume SQLite e os arquivos precisam fazer parte do mesmo backup. Não copie chaves descriptografadas para backups ou logs.

## Modelos e conferência

Implementação conferida na documentação oficial em novembro de 2026:

- Texto e revisão: `gpt-6.1-terra`, Responses, structured outputs, `store:false`.
- Entrada de voz: `gpt-transcribe`, Audio Transcriptions.
- Saída de voz: `gpt-realtime-2.1-mini`, Realtime WebSocket, voz `marin`, PCM 24 kHz convertido em WAV.
- Imagens: `gpt-image-2.5-flare`, Images API, PNG.
- Moderação: `omni-moderation-latest`.

Referências: [Terra](https://developers.openai.com/api/docs/models/gpt-6.1-terra), [voz](https://developers.openai.com/api/docs/guides/realtime-conversations), [imagens](https://developers.openai.com/api/reference/resources/images/methods/generate), [uso por menores](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance), [controles de dados](https://developers.openai.com/api/docs/guides/your-data).

`npm test` cobre isolamento de convidados, conta, PIN, criptografia, ativação, rascunhos de prompt, contexto, revisão, histórico, cotas, cache privado e contratos das APIs. Testes de geração usam transporte simulado, sem gastar API. A integração real de voz e imagens precisa ser conferida após o responsável configurar a chave e ZDR, no aparelho usado pela Bela.

Na entrega do tutor, Next.js foi atualizado para 16.4.5 e as dependências transitivas de produção foram corrigidas. `npm audit --omit=dev` retornou zero alertas de produção. Isso não equivale a uma auditoria independente de toda a aplicação.
