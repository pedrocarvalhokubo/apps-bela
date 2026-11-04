# Tutor da Bela

## Operação

Na conta da Bela, entre na área dos pais com o PIN e abra **Tutor da Bela**.

1. Salve uma chave de projeto OpenAI com acesso aos modelos indicados na tela. O app valida o acesso ao GPT‑6.1 Terra antes de guardar a chave.
2. Para uso por uma criança menor de 13 anos, o projeto OpenAI precisa ter **Zero Data Retention habilitado pela OpenAI**. A confirmação no formulário apenas registra a declaração do responsável; não configura o projeto. `store:false` sozinho não substitui ZDR.
3. Ajuste os limites de perguntas e imagens e ative o tutor. A cobrança é da API, separada da assinatura ChatGPT; configure também o orçamento do projeto OpenAI.
4. Em **Instruções do tutor**, edite as preferências ou peça uma revisão à IA por texto/voz. A proposta é um rascunho. **Salvar instruções** aplica a versão e registra o histórico.

O botão flutuante aparece nas matérias, aulas, infográficos e avaliações da Bela. Não aparece para convidados. **Iniciar conversa por voz** pede permissão e abre o microfone uma vez. A captura permanece ativa durante escuta, processamento e reprodução. O VAD local identifica o começo da fala, conserva cerca de 300 ms anteriores e envia a pergunta após aproximadamente um segundo de pausa. **Enviar minha fala** antecipa esse envio; silêncio e cliques não geram perguntas.

A estudante pode começar a falar para interromper uma resposta ou usar **Interromper e falar**. Isso interrompe a reprodução, cancela a requisição em andamento e impede que uma resposta atrasada volte a tocar. **Encerrar conversa** libera o microfone. Trocar de matéria, ocultar a aba, sair da página, perder conexão ou desmontar o componente também encerra a captura. Ao minimizar o painel, a conversa pode continuar e o botão de encerramento permanece visível. Nenhuma reconexão reabre o microfone automaticamente.

Este é um fluxo encadeado: fala → transcrição → tutor textual → revisão → síntese conferida → reprodução. A escuta é contínua e aceita interrupção por voz, mas a resposta ainda aguarda as verificações do servidor. Não é uma sessão GPT-Live nem fala simultânea direta do modelo. Essa escolha preserva a revisão independente antes da entrega, em vez de reproduzir conteúdo ainda não conferido. Texto, replay de respostas e imagens continuam disponíveis.

## Captura e compatibilidade

- AudioWorklet local com fallback PCM local para ScriptProcessor. Não usa o reconhecimento de voz do navegador nem outro provedor. O grafo não reproduz a própria entrada do microfone.
- WAV mono de até 16 kHz. Fala que atingir 30 segundos é descartada por inteiro com aviso para fazer uma pergunta mais curta; não envia trechos incompletos.
- Permissão/inicialização têm prazo de 45 segundos; ausência de frames e interrupção do contexto de áudio encerram a captura. Permissão concedida depois do cancelamento não reabre o microfone.
- A sessão fecha após 60 segundos aguardando fala. O limite de dez minutos é aplicado quando ela volta a aguardar, sem cortar uma pergunta ou resposta já em andamento.
- Requer HTTPS ou localhost, permissão de microfone e Web Audio. O código detecta recursos e solicita echoCancellation, noiseSuppression e autoGainControl; o suporte e o resultado acústico dependem do navegador e aparelho.
- Safari/iOS, Safari/macOS, Chrome/Android, Chrome/Edge/Firefox desktop atuais são alvos de compatibilidade, não uma lista de aparelhos já homologados. Testar gesto inicial, alto-falante/fones, eco, revogação de permissão, troca de dispositivo, aba oculta e retorno ao app em cada aparelho usado.
- Durante a reprodução, o limiar de interrupção é mais conservador para reduzir eco. Se o som do próprio tutor disparar interrupções ou a fala ficar baixa, usar fones ou o botão. A edição por texto não depende de microfone ou de Web Audio funcional.

Referências de implementação: [arquiteturas de voice agents](https://developers.openai.com/api/docs/guides/voice-agents), [áudio OpenAI](https://developers.openai.com/api/docs/guides/audio), [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet), [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

## Conteúdo e revisão

`content/tutor/instructions.md` contém as regras fixas. Cada módulo tem um arquivo `.md` com aulas, aprofundamentos e ampliação autoral; `enrichment.json` registra os exemplos adicionais e fontes de conferência. `catalog.json` controla matérias, aulas e páginas aceitas. Atualize tudo com `npm run tutor:content` após editar o currículo. Os arquivos `*-assessment.md` documentam exemplos e alternativas para o curador e **não são enviados ao tutor**.

Somente o módulo validado no servidor é enviado. O modelo não navega, não chama ferramentas externas e não acessa o banco. Preferências dos pais não mudam autenticação, limites ou regras fixas. O material é ponto de partida: o tutor também pode usar conhecimento geral confiável, analogias e exemplos novos ligados à matéria, sem fingir que pesquisou na internet ou que algo consta no livro. Uma segunda avaliação independente confere escopo, confiabilidade e segurança, usando o histórico para entender perguntas de continuação. Os IDs de fonte indicam vínculo curricular, não citação literal de cada ampliação. Na avaliação, o tutor dá pistas e exemplos análogos. Isso reduz erros de IA, mas não garante infalibilidade.

Pedidos visuais passam por roteiro, moderação, limite diário, geração PNG e revisão visual antes da entrega. A síntese recebe o texto revisado como mensagem explícita, com detecção de fala de entrada desativada. Há limites de tempo por etapa e um prazo total de 120 segundos compartilhado entre geração e revisão da voz; cancelar a requisição também encerra o WebSocket. Falhas registram somente etapa, código, tempo e contagem de bytes, sem texto, áudio, chave ou identificadores da criança. Voz usa o texto revisado; a transcrição da fala sintetizada é comparada e, se necessário, revisada antes de disponibilizar o áudio. As imagens e o áudio sintetizado são privados.

## Servidor e dados

- Defina `BELA_TUTOR_ENCRYPTION_KEY` com 32 bytes aleatórios em hexadecimal (64 caracteres), somente nas variáveis privadas do serviço. Não a inclua em Git, client bundles ou logs. Preserve essa chave entre deploys; trocá-la torna as chaves de API já salvas indecifráveis.
- A chave OpenAI fica no SQLite, cifrada com AES‑256‑GCM. As respostas da API de configuração mostram apenas se há uma chave configurada.
- Todos os endpoints exigem sessão HTTP da conta `bela-account-v2`; configurações e histórico completo também exigem sessão parental. O PIN não é transmitido à OpenAI.
- Perguntas transcritas, respostas, contexto, tópicos e sugestões ficam nas tabelas `tutor_*`. Não há gravação persistente da voz enviada pela criança. Respostas sintetizadas e PNGs ficam no volume persistente em `tutor-media`, fora de `public`, servidas mediante autorização. Não há expiração automática dos registros.
- Limites diários são atômicos e seguem o fuso `America/Bahia`. Pedidos iniciados contam mesmo quando falham. Há idempotência por mensagem, limite de frequência e até três tentativas de síntese por resposta. Replays de áudio pronto e imagens prontas usam cache privado do servidor.
- O volume SQLite e os arquivos precisam fazer parte do mesmo backup. Não copie chaves descriptografadas para backups ou logs.

## Diagnóstico seguro

Na área dos pais, **Testar voz com frase de exemplo** sintetiza apenas uma frase fixa sobre triângulos. Não lê preferências nem histórico, não usa a voz da criança e não salva o áudio no servidor. Consome uma chamada da API e testa somente a saída de voz. Não comprova captura do microfone nem ZDR.

**Verificar acesso aos modelos** consulta somente os metadados dos quatro modelos usando a chave já salva. Não envia perguntas, voz ou histórico. A consulta pode indicar acesso negado, modelo indisponível ou falha de conexão, mas não prova saldo disponível, geração funcionando nem ZDR. O editor de instruções por IA também exige a confirmação de ZDR salva, mantendo edição e salvamento manual disponíveis. A confirmação de ZDR no app é declaração parental, não comprovação por consulta à OpenAI. Nenhum teste com dados reais da criança deve ser executado sem essa verificação.

## Modelos e conferência

Implementação conferida na documentação oficial em novembro de 2026:

- Texto e revisão: `gpt-6.1-terra`, Responses, structured outputs, `store:false`.
- Entrada de voz: `gpt-transcribe`, Audio Transcriptions.
- Saída de voz: `gpt-realtime-2.1-mini`, Realtime WebSocket, voz `marin`, PCM 24 kHz convertido em WAV.
- Imagens: `gpt-image-2.5-flare`, Images API, PNG.
- Moderação: `omni-moderation-latest`.

Referências: [Terra](https://developers.openai.com/api/docs/models/gpt-6.1-terra), [voz](https://developers.openai.com/api/docs/guides/realtime-conversations), [imagens](https://developers.openai.com/api/reference/resources/images/methods/generate), [uso por menores](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance), [controles de dados](https://developers.openai.com/api/docs/guides/your-data).

`npm test` cobre isolamento de convidados, conta, PIN, criptografia, ativação, rascunhos de prompt, contexto, revisão, histórico, cotas, cache privado e contratos das APIs. Testes de geração usam transporte simulado, sem gastar API. A sessão contínua tem testes de VAD com tons sintéticos, pré-roll, eco simulado, interrupção, teardown, permissão tardia, limites, falhas de áudio e cancelamento do processamento no servidor. Esses testes não equivalem a ensaio acústico em dispositivo real. A integração real de voz e imagens precisa ser conferida após o responsável configurar a chave e ZDR, no aparelho usado pela Bela.

Na entrega do tutor, Next.js foi atualizado para 16.4.5 e as dependências transitivas de produção foram corrigidas. `npm audit --omit=dev` retornou zero alertas de produção. Isso não equivale a uma auditoria independente de toda a aplicação.
