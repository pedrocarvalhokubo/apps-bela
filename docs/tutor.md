# Tutor da Bela

## Operação

Na conta da Bela, entre na área dos pais com o PIN e abra **Tutor da Bela**.

1. Salve uma chave de projeto OpenAI com acesso aos modelos indicados na tela. O app valida o acesso ao GPT‑6.1 Terra antes de guardar a chave.
2. Para uso por uma criança menor de 13 anos, o projeto OpenAI precisa ter **Zero Data Retention habilitado pela OpenAI**. A confirmação no formulário apenas registra a declaração do responsável; não configura o projeto. `store:false` sozinho não substitui ZDR.
3. Ajuste os limites de perguntas e imagens e ative o tutor. A cobrança é da API, separada da assinatura ChatGPT; configure também o orçamento do projeto OpenAI.
4. Em **Instruções do tutor**, edite as preferências ou peça uma revisão à IA por texto/voz. A proposta é um rascunho. **Salvar instruções** aplica a versão e registra o histórico.

O botão flutuante aparece nas matérias da Bela autenticada. **Tocar no gatinho** abre diretamente uma sessão GPT-Live 1 por WebRTC. O PNG transparente é maior e recebe animações CSS de descanso, escuta, fala e preparação, respeitando movimento reduzido. O menu de três pontos permite digitar, acompanhar o chat ou pedir infográficos; o chat abre quando solicitado ou ao receber uma imagem. Pedir um infográfico mantém a mídia de voz ativa. Escolher digitação encerra a voz e envia texto silenciosamente, com replay opcional. O navegador envia a fala e recebe a voz por trilhas de mídia; não grava uma pergunta, faz upload e espera um novo arquivo de síntese a cada resposta. O áudio recebido é ligado automaticamente ao Web Audio desbloqueado pelo toque inicial.

O modelo de voz pode ouvir enquanto fala e reconhecer interrupções. **Interromper e falar** silencia a saída imediatamente e pede ao servidor para interromper a fala atual. **Encerrar conversa** (botão quadrado ao lado do gatinho), mudar de matéria, sair da página ou ocultar a aba interrompem a captura. A mídia e o canal de eventos são finalizados; nenhuma reconexão reabre o microfone sozinha.

O frontend da OpenAI só pode receber comandos de fechamento e mute/unmute do navegador. Instruções, chave e permissões de ferramentas permanecem no servidor. Um WebSocket lateral autenticado observa as transcrições, guarda os fragmentos com seus tempos e atende delegações pelo tutor textual existente, incluindo moderação, Terra e revisão independente. Cumprimentos e repetições de resultados já revisados podem ser tratados pelo próprio GPT-Live; novas dúvidas escolares e imagens pedem o backend. Isso permite confirmações de voz enquanto o conteúdo é consultado, sem inventar o resultado. As verificações independentes de texto foram paralelizadas em duas etapas para diminuir espera.

## Limites e compatibilidade da voz ao vivo

- Reutiliza a chave cifrada já salva; o projeto precisa ter acesso a `gpt-live-1`. A falta de acesso é exibida explicitamente, sem trocar silenciosamente para mensagens gravadas.
- Limite inicial de 20 minutos de voz ao vivo por dia, ajustável de 1 a 120 na área dos pais. Sessões de até 10 minutos; uma sessão ativa por perfil. Consultas ao tutor continuam consumindo o limite diário de perguntas e imagens.
- O servidor reserva o orçamento antes de criar a sessão e reconcilia com o uso final quando a API confirma o encerramento. Em uma perda sem confirmação, mantém a reserva de forma conservadora. Um heartbeat a cada dez segundos detecta uma página perdida; o servidor encerra após 35 segundos sem heartbeat. Uma reinicialização do servidor encerra a sessão no próximo status do navegador.
- Requer HTTPS, WebRTC, Web Audio e permissão para microfone. Safari/iOS, Safari/macOS, Chrome/Android e Chrome/Edge/Firefox desktop atuais são alvos; teste acústico real depende do dispositivo. O dispositivo precisa permitir microfone e saída de som.
- As transcrições em fluxo podem conter falas sobrepostas e erros de reconhecimento. São preservados fragmentos e tempos aproximados, sem gravação persistente da voz da criança.
- Histórico completo continua exigindo PIN dos pais. Imagens solicitadas aparecem depois de geradas e revisadas, sem bloquear a mídia de voz.
- O replay de respostas antigas e o teste de narração ainda usam `gpt-realtime-2.1-mini`; esses recursos são distintos da conversa ao vivo. A mensagem escrita permanece disponível.
- A documentação informa US$ 0,05 por minuto para GPT-Live 1, mais chamadas do backend. O início WebRTC tem cobrança mínima de 15 segundos creditada ao tempo em uso. A aplicação não garante latência: rede, permissões, disponibilidade da API e revisão de conteúdo influenciam o tempo.

Referências: [GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1), [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc), [delegações](https://developers.openai.com/api/docs/guides/live-delegation), [instruções de voz](https://developers.openai.com/api/docs/guides/live-prompting) e [dados](https://developers.openai.com/api/docs/guides/your-data).

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

Na área dos pais, **Testar narração e replay** sintetiza apenas uma frase fixa sobre triângulos. Não lê preferências nem histórico, não usa a voz da criança e não salva o áudio no servidor. Consome uma chamada da API e testa somente a saída de voz. Não comprova captura do microfone nem ZDR.

**Verificar acesso aos modelos** consulta somente os metadados dos cinco modelos usando a chave já salva. Não envia perguntas, voz ou histórico. A consulta pode indicar acesso negado, modelo indisponível ou falha de conexão, mas não prova saldo disponível, geração funcionando nem ZDR. O editor de instruções por IA também exige a confirmação de ZDR salva, mantendo edição e salvamento manual disponíveis. A confirmação de ZDR no app é declaração parental, não comprovação por consulta à OpenAI. Nenhum teste com dados reais da criança deve ser executado sem essa verificação.

## Modelos e conferência

Implementação conferida na documentação oficial em novembro de 2026:

- Texto e revisão: `gpt-6.1-terra`, Responses, structured outputs, `store:false`.
- Entrada de voz: `gpt-transcribe`, Audio Transcriptions.
- Conversa ao vivo: `gpt-live-1`, WebRTC, voz `marin`, com backend próprio usando Terra.
- Replay e narração: `gpt-realtime-2.1-mini`, Realtime WebSocket, voz `marin`, PCM 24 kHz convertido em WAV.
- Imagens: `gpt-image-2.5-flare`, Images API, PNG.
- Moderação: `omni-moderation-latest`.

Referências: [Terra](https://developers.openai.com/api/docs/models/gpt-6.1-terra), [voz](https://developers.openai.com/api/docs/guides/realtime-conversations), [imagens](https://developers.openai.com/api/reference/resources/images/methods/generate), [uso por menores](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance), [controles de dados](https://developers.openai.com/api/docs/guides/your-data).

`npm test` cobre isolamento de convidados, conta, PIN, criptografia, ativação, rascunhos de prompt, contexto, revisão, histórico, cotas, cache privado e contratos das APIs. Testes de geração usam transporte simulado, sem gastar API. A sessão contínua tem testes de VAD com tons sintéticos, pré-roll, eco simulado, interrupção, teardown, permissão tardia, limites, falhas de áudio e cancelamento do processamento no servidor. Esses testes não equivalem a ensaio acústico em dispositivo real. A integração real de voz e imagens precisa ser conferida após o responsável configurar a chave e ZDR, no aparelho usado pela Bela.

Na entrega do tutor, Next.js foi atualizado para 16.4.5 e as dependências transitivas de produção foram corrigidas. `npm audit --omit=dev` retornou zero alertas de produção. Isso não equivale a uma auditoria independente de toda a aplicação.

### Correção do transporte de voz — 04/11/2026

O bundle do servidor substituía o addon opcional de `ws` por um módulo incompleto. O envio de frames mascarados falhava com `mask is not a function`, antes de a síntese produzir áudio; a interface recebia texto, exibia erro e encerrava a conversa. `ws` agora está em `serverExternalPackages`, preservando o carregamento Node e o fallback JavaScript da biblioteca.

`tests/tutor-production-voice.test.mjs` executa as rotas Next compiladas, autenticação, cifra da chave fictícia, frames WebSocket reais, retorno WAV privado, replay em cache e teste parental. O destino é um servidor de teste local com PCM sintético, carregado somente pelo processo do teste. O teste falhou antes da correção e passou depois. Ele não usa a OpenAI, não comprova a chave real nem substitui validação acústica no dispositivo. Os testes anteriores de provider simulavam a biblioteca WebSocket e por isso não detectaram a falha de empacotamento.


### Acompanhamento de uso — 04/11/2026

A aba parental **Uso e gastos** consulta apenas o perfil autenticado e exige o PIN. Atualiza os valores a cada 30 segundos enquanto aberta. A implementação e as tarifas estão descritas na seção “Conversa com o gatinho e consumo da API” do README. O total é uma estimativa parcial em USD baseada nos dados retornados pela API, não uma fatura. Tokens de chamadas anteriores não são reconstruídos. A API organizacional de custos exige credencial administrativa separada e não está conectada.
