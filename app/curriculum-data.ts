import type { QuizQuestion } from "./quiz-data";
import { elaQuiz, mathQuiz, term2AddedSubjects } from "./term2-data";
import { geographyFieldCityQuiz, geographyGeneralQuiz, geographyMaterialsQuiz, geographyOriginQuiz, geographyRecyclingQuiz, geographySectorsQuiz, geographySubject } from "./geography-data";
import { portugueseQuiz, portugueseSubject } from "./portuguese-data";

export type SubjectKey = "math" | "ela" | "geography" | "history" | "portuguese";
export type QuizId =
  | "math"
  | "ela"
  | "geography-sectors"
  | "geography-field-city"
  | "geography-materials"
  | "geography-origin"
  | "geography-recycling"
  | "geography-general"
  | "history-trade"
  | "history-wildlife"
  | "history-technology"
  | "history-payments"
  | "history-general" | "portuguese-general";

export type StudyLesson = {
  id: string;
  number: string;
  icon: string;
  title: string;
  subtitle: string;
  intro: string;
  facts: { term: string; text: string }[];
  remember: string;
  tone: string;
  quizId?: QuizId;
};

export type StudySubject = {
  key: SubjectKey;
  name: string;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  assessmentDate: string;
  quizId: QuizId;
  lessons: StudyLesson[];
};

type OptionInput = [label: string, explanation: string];

const historyAssociationConcepts: Record<string, string> = {
  "Trocas comerciais:1": "ESCAMBO",
  "Trocas comerciais:3": "FEITORIA",
  "Tráfico de animais:1": "TRÁFICO DE ANIMAIS SILVESTRES",
  "Tráfico de animais:3": "CETAS",
  "Usos da tecnologia:2": "E-COMMERCE",
  "Usos da tecnologia:3": "EXCLUSÃO DIGITAL",
  "Novas tecnologias de pagamento:1": "PIX",
  "Novas tecnologias de pagamento:2": "PAGAMENTO POR APROXIMAÇÃO",
};

const historyVisuals: Record<string, { visualKey: QuizQuestion["visualKey"]; visualPrompt: string }> = {
  "Trocas comerciais": { visualKey: "history-trade", visualPrompt: "Observe a floresta, o pau-brasil, a feitoria, os navios e os objetos de troca." },
  "Tráfico de animais": { visualKey: "history-wildlife", visualPrompt: "Observe o caminho de proteção: habitat, resgate e cuidado especializado." },
  "Usos da tecnologia": { visualKey: "history-technology", visualPrompt: "Observe quantas atividades e realidades diferentes estão conectadas pela tecnologia." },
  "Novas tecnologias de pagamento": { visualKey: "history-payments", visualPrompt: "Observe como as formas de trocar e pagar mudaram com o tempo." },
};

const question = (
  id: number,
  topic: string,
  prompt: string,
  support: string,
  correctIndex: number,
  optionInputs: OptionInput[],
): QuizQuestion => {
  const letters = ["a", "b", "c", "d"];
  return {
    id,
    topic,
    prompt,
    support,
    ...(historyAssociationConcepts[`${topic}:${id}`] ? { format: "association" as const, concept: historyAssociationConcepts[`${topic}:${id}`] } : {}),
    ...historyVisuals[topic],
    correct: letters[correctIndex],
    options: optionInputs.map(([label, explanation], index) => ({
      id: letters[index],
      label,
      explanation,
    })),
  };
};

export const historyTradeQuiz: QuizQuestion[] = [
  question(1, "Trocas comerciais", "O que era o escambo?", "Procure a forma de troca em que não havia moeda como intermediária.", 1, [
    ["Um imposto cobrado nas feitorias", "Não. Escambo não era um imposto."],
    ["A troca direta de produtos ou serviços, sem dinheiro", "Correto. No escambo, cada parte entregava um bem ou serviço em troca de outro."],
    ["Uma compra feita pela internet", "Não. O comércio eletrônico apareceu muitos séculos depois."],
    ["A fabricação de moedas", "Não. O escambo acontecia justamente sem o uso de moeda."],
  ]),
  question(2, "Trocas comerciais", "Qual produto os portugueses começaram a extrair no Brasil Pré-Colonial para vender na Europa?", "A madeira tinha cor avermelhada e servia para produzir corante.", 2, [
    ["Cana-de-açúcar", "A cana se tornou central depois, com o cultivo colonial."],
    ["Café", "O café pertence a outro período da história econômica brasileira."],
    ["Pau-brasil", "Correto. A madeira da ibirapitanga era usada para produzir corante para tecidos."],
    ["Borracha", "A exploração da borracha ocorreu muito mais tarde."],
  ]),
  question(3, "Trocas comerciais", "Para que serviam as feitorias construídas no litoral?", "Pense no caminho da madeira entre a mata e os navios.", 0, [
    ["Eram armazéns fortificados onde os produtos do escambo ficavam guardados", "Correto. As feitorias armazenavam com segurança a madeira e outros produtos."],
    ["Eram escolas para ensinar a língua portuguesa", "Não. Essa não era a função das feitorias descritas no material."],
    ["Eram fábricas de cartões e moedas", "Não. Esses meios de pagamento não existiam naquele contexto."],
    ["Eram aldeias indígenas construídas pelos Tupi", "Não. As feitorias eram estruturas portuguesas na costa."],
  ]),
  question(4, "Trocas comerciais", "O que muitos indígenas recebiam em troca do pau-brasil?", "Observe quais objetos de metal podiam facilitar o trabalho cotidiano.", 3, [
    ["Somente moedas de ouro", "Não. O escambo não usava moeda como intermediária."],
    ["Apenas alimentos europeus", "Não. O material destaca principalmente objetos e ferramentas."],
    ["Terras e títulos de nobreza", "Não. Isso não fazia parte dessas trocas."],
    ["Machados, foices, facas, espelhos, tecidos e panelas", "Correto. Esses objetos eram oferecidos pelos portugueses nas trocas."],
  ]),
  question(5, "Trocas comerciais", "Qual consequência o comércio intenso de pau-brasil trouxe para a natureza?", "Pense no que acontece quando muitas árvores são retiradas por longo tempo.", 1, [
    ["A Mata Atlântica cresceu mais depressa", "Não. A retirada intensa reduziu a vegetação."],
    ["Houve devastação da Mata Atlântica e o pau-brasil ficou ameaçado", "Correto. A exploração intensa causou grande impacto ambiental."],
    ["Nenhuma mudança ocorreu nas florestas", "Não. O material destaca impactos importantes na Mata Atlântica."],
    ["Todas as árvores viraram plantações de café", "Não. Isso não explica o impacto apresentado na unidade."],
  ]),
  question(6, "Trocas comerciais", "Por que os portugueses dependiam dos conhecimentos e do trabalho dos povos nativos?", "Eles ainda não conheciam o território nem sabiam localizar a árvore.", 2, [
    ["Porque não possuíam navios", "Eles chegaram ao território por navios; essa não era a dificuldade."],
    ["Porque os indígenas fabricavam moedas", "As relações iniciais eram feitas por escambo."],
    ["Porque os povos nativos conheciam a mata, localizavam as árvores e ajudavam no corte e transporte", "Correto. O conhecimento do território foi essencial para a exploração portuguesa."],
    ["Porque os portugueses só queriam aprender a pescar", "Não. O objetivo central descrito era explorar e comercializar o pau-brasil."],
  ]),
];

export const historyWildlifeQuiz: QuizQuestion[] = [
  question(1, "Tráfico de animais", "O que caracteriza o tráfico de animais silvestres?", "Considere captura, transporte e comércio sem autorização.", 0, [
    ["Retirar, transportar ou vender animais da natureza ilegalmente", "Correto. O tráfico transforma animais silvestres em mercadoria fora da lei."],
    ["Observar aves em uma trilha", "Não. Observar sem capturar não é tráfico."],
    ["Cuidar de um animal em centro autorizado", "Não. Centros autorizados ajudam no resgate e na recuperação."],
    ["Fotografar animais em seu habitat", "Não. Fotografar sem interferir não caracteriza tráfico."],
  ]),
  question(2, "Tráfico de animais", "O tráfico de animais é legal ou ilegal no Brasil?", "O material mostra filhotes apreendidos pela Polícia Rodoviária Federal.", 2, [
    ["Legal quando o animal é pequeno", "Não. A idade não torna o comércio ilegal permitido."],
    ["Legal se o comprador gostar de animais", "Não. Gostar de animais não substitui autorização legal."],
    ["Ilegal; a captura e o comércio clandestinos são crimes", "Correto. Animais traficados são apreendidos e encaminhados para atendimento."],
    ["Sempre legal nas feiras", "Não. O local de venda não transforma uma prática ilegal em legal."],
  ]),
  question(3, "Tráfico de animais", "Para onde podem ser encaminhados animais resgatados do tráfico?", "A sigla apresentada no guia é Cetas.", 1, [
    ["Feitorias", "Não. Feitorias pertencem ao estudo das trocas no Brasil Pré-Colonial."],
    ["Centros de Triagem de Animais Silvestres", "Correto. Os Cetas recebem animais resgatados ou apreendidos."],
    ["Lojas virtuais", "Não. Animais resgatados não devem voltar ao comércio."],
    ["Fábricas de dinheiro", "Não. Isso não tem relação com proteção da fauna."],
  ]),
  question(4, "Tráfico de animais", "Por que comprar um animal silvestre ilegal prejudica a natureza?", "Cada espécie participa das relações do ecossistema.", 3, [
    ["Porque o animal aprende a usar tecnologia", "Não. O problema é a retirada ilegal e seus impactos."],
    ["Porque todo animal vira doméstico", "Não. Um animal silvestre não deixa de ser silvestre por ser capturado."],
    ["Porque aumenta o número de animais livres", "Acontece o contrário: a natureza perde indivíduos."],
    ["Porque incentiva novas capturas, causa sofrimento e pode desequilibrar o ambiente", "Correto. A compra mantém a rede ilegal e prejudica animais e ecossistemas."],
  ]),
  question(5, "Tráfico de animais", "Qual atitude ajuda a combater o tráfico?", "Não alimente o comércio ilegal.", 2, [
    ["Comprar para depois soltar sozinho", "Não. A compra financia o tráfico e a soltura sem orientação pode causar mais danos."],
    ["Compartilhar anúncios de venda", "Não. Isso ajuda o comércio ilegal a alcançar compradores."],
    ["Não comprar e avisar um adulto ou autoridade responsável", "Correto. Evitar a compra e denunciar protege a fauna."],
    ["Esconder o animal em casa", "Não. O animal precisa de atendimento adequado e a situação deve ser comunicada."],
  ]),
  question(6, "Tráfico de animais", "Segundo o material complementar, quantos animais silvestres são retirados ilegalmente da natureza por ano?", "O número apresentado é alarmante e está na casa dos milhões.", 1, [
    ["38 mil", "O texto apresenta um número muito maior."],
    ["Cerca de 38 milhões", "Correto. O guia usa essa estimativa para mostrar a dimensão do problema."],
    ["380", "Esse valor não corresponde ao dado do material."],
    ["Todos os animais do Brasil", "Não. A afirmação é exagerada e não é o dado apresentado."],
  ]),
];

export const historyTechnologyQuiz: QuizQuestion[] = [
  question(1, "Usos da tecnologia", "Quais atividades cresceram com o uso da internet durante o isolamento da COVID-19?", "Pense em comprar, estudar, trabalhar e cuidar da saúde sem sair de casa.", 3, [
    ["Somente jogos eletrônicos", "Não. O material destaca mudanças em várias áreas da vida."],
    ["Apenas fabricação de moedas", "Não. A unidade trata de comunicação, trabalho, educação, saúde e comércio."],
    ["Somente feiras ao ar livre", "Não. Muitas atividades presenciais foram reduzidas."],
    ["Comércio eletrônico, educação a distância, trabalho remoto e atendimento médico on-line", "Correto. Essas atividades se expandiram durante o isolamento."],
  ]),
  question(2, "Usos da tecnologia", "O que é e-commerce?", "A palavra também significa comércio eletrônico.", 0, [
    ["Compra e venda realizadas pela internet", "Correto. No e-commerce, a negociação acontece por meios digitais."],
    ["Troca direta sem moeda", "Isso descreve escambo."],
    ["Uma feira de animais", "Não. E-commerce não é um tipo de feira."],
    ["Uma moeda digital específica", "Não. É uma forma de comércio, não uma moeda."],
  ]),
  question(3, "Usos da tecnologia", "O que significa exclusão digital?", "Pense na desigualdade de acesso, equipamentos e habilidades.", 1, [
    ["Escolher não comprar pela internet", "Uma preferência pessoal não define exclusão digital."],
    ["Não ter acesso adequado à internet, a dispositivos ou às habilidades necessárias", "Correto. A exclusão impede a participação plena na sociedade digital."],
    ["Usar apenas um aplicativo", "Não. A definição envolve desigualdade de acesso e condições de uso."],
    ["Desligar o celular à noite", "Não. Isso pode ser um hábito, não exclusão digital."],
  ]),
  question(4, "Usos da tecnologia", "Usar celular ou internet faz um povo indígena deixar de ser indígena?", "Identidade e uso de ferramentas não são a mesma coisa.", 2, [
    ["Sim, porque toda tecnologia apaga a cultura", "Não. O material mostra que tecnologias podem ampliar conhecimentos sem apagar identidades."],
    ["Sim, se o aparelho for moderno", "Não. A idade do aparelho não define identidade cultural."],
    ["Não; tecnologias podem apoiar estudos, comunicação e proteção do território sem apagar a identidade", "Correto. Os exemplos mostram usos que fortalecem comunidades e conhecimentos."],
    ["Não, mas somente adultos podem usar", "Não. O texto cita inclusive estudos de jovens indígenas."],
  ]),
  question(5, "Usos da tecnologia", "Qual é uma vantagem das compras pela internet?", "Pense na possibilidade de comprar sem ir à loja.", 0, [
    ["Comprar de casa e receber o produto", "Correto. O comércio eletrônico facilita compras a distância."],
    ["Nunca precisar conferir o vendedor", "Não. Compras on-line também exigem cuidado e verificação."],
    ["Eliminar todas as lojas físicas", "Não. Lojas físicas e e-commerce coexistem."],
    ["Garantir que todo produto seja barato", "Não. Preços variam e não são uma garantia da tecnologia."],
  ]),
  question(6, "Usos da tecnologia", "Qual exemplo do material mostra a internet ajudando povos indígenas?", "Procure usos ligados a estudo, território e conexão entre comunidades.", 1, [
    ["Substituir todas as tradições por costumes urbanos", "Não. O texto afirma que o uso da tecnologia não apaga identidades."],
    ["Permitir estudos na comunidade e ajudar a fiscalizar possíveis invasões do território", "Correto. Esses são dois usos apresentados na unidade."],
    ["Impedir o uso das línguas indígenas", "Não. A internet também pode fortalecer vínculos linguísticos."],
    ["Obrigar jovens a deixar suas comunidades", "Não. Um exemplo mostra justamente jovens estudando sem precisar sair."],
  ]),
];

export const historyPaymentsQuiz: QuizQuestion[] = [
  question(1, "Novas tecnologias de pagamento", "O que é Pix?", "É usado pelo celular ou computador e funciona pela internet.", 1, [
    ["Uma moeda antiga", "Não. Pix é uma tecnologia atual."],
    ["Uma forma de pagamento e transferência feita pela internet", "Correto. O Pix movimenta valores por meios digitais."],
    ["Um tipo de feira", "Não. Pix não é um local de comércio."],
    ["Somente um cartão de crédito", "Não. Pix e cartão são formas diferentes de pagamento."],
  ]),
  question(2, "Novas tecnologias de pagamento", "O que é pagamento por aproximação?", "Observe como o cartão ou aparelho se comunica com a máquina.", 3, [
    ["Entregar moedas sem tocar nelas", "Não. A aproximação usa comunicação eletrônica."],
    ["Digitar a senha em qualquer site", "Não. Isso não define pagamento por aproximação e pode ser inseguro."],
    ["Enviar dinheiro somente por cheque", "Não. Cheque é outro meio de pagamento."],
    ["Aproximar cartão, celular ou relógio da máquina compatível", "Correto. A transação acontece sem inserir fisicamente o cartão."],
  ]),
  question(3, "Novas tecnologias de pagamento", "Qual cuidado é importante antes de confirmar um Pix?", "Confira quem vai receber e quanto será enviado.", 0, [
    ["Verificar destinatário e valor", "Correto. Conferir os dados ajuda a evitar erros e golpes."],
    ["Compartilhar a senha com quem pediu", "Não. Senhas e códigos devem ser protegidos."],
    ["Ignorar o nome do recebedor", "Não. O nome é uma pista importante para confirmar o destino."],
    ["Clicar rapidamente sem ler", "Não. Rapidez não substitui atenção."],
  ]),
  question(4, "Novas tecnologias de pagamento", "Qual frase é verdadeira?", "As novas formas se somaram às antigas.", 2, [
    ["O dinheiro deixou de existir", "Não. Dinheiro, cartões e pagamentos digitais continuam coexistindo."],
    ["Toda compra precisa ser feita pela internet", "Não. Compras presenciais continuam existindo."],
    ["O Pix permite pagamentos rápidos, mas exige cuidado com dados e senhas", "Correto. Tecnologia traz facilidade e também responsabilidade."],
    ["Senhas podem ser compartilhadas com desconhecidos", "Não. Isso coloca a conta em risco."],
  ]),
  question(5, "Novas tecnologias de pagamento", "Por que novas tecnologias facilitaram os pagamentos?", "Compare tempo, distância e registro da operação.", 1, [
    ["Porque eliminaram a necessidade de atenção", "Não. Atenção continua essencial."],
    ["Porque permitem transferências rápidas e registradas, mesmo a distância", "Correto. Essa é uma vantagem central dos pagamentos digitais."],
    ["Porque todo pagamento passou a ser gratuito", "Não. Custos e regras podem variar."],
    ["Porque ninguém mais usa cartões", "Não. Diferentes meios de pagamento coexistem."],
  ]),
  question(6, "Novas tecnologias de pagamento", "Uma mensagem pede o código de segurança do cartão. O que fazer?", "Dados secretos não devem ser enviados por mensagem.", 3, [
    ["Enviar para concluir mais rápido", "Não. Isso pode permitir uma fraude."],
    ["Publicar o código para pedir ajuda", "Não. Isso expõe uma informação protegida."],
    ["Mandar apenas metade da senha", "Não. Nenhuma parte de senha ou código deve ser compartilhada."],
    ["Não compartilhar e pedir ajuda a um adulto responsável", "Correto. Proteger os dados e buscar orientação é a atitude segura."],
  ]),
];

export const historyGeneralQuiz: QuizQuestion[] = [
  ...historyTradeQuiz.slice(0, 5),
  ...historyWildlifeQuiz.slice(0, 5),
  ...historyTechnologyQuiz.slice(0, 5),
  ...historyPaymentsQuiz.slice(0, 5),
].map((item, index) => ({ ...item, id: index + 1 }));

export const curriculumSubjects: Record<SubjectKey, StudySubject> = {
  ...term2AddedSubjects,
  geography: geographySubject,
  history: {
    key: "history",
    name: "História",
    icon: "🏛️",
    eyebrow: "HISTÓRIA • II TRIMESTRE",
    title: "Do escambo ao Pix",
    description: "Estude os quatro títulos indicados pela escola com explicações retiradas do SLM e do material complementar.",
    assessmentDate: "Revisão livre",
    quizId: "history-general",
    lessons: [
      {
        id: "history-trade", number: "01", icon: "🤝", title: "Trocas comerciais", subtitle: "Entre portugueses e povos indígenas", quizId: "history-trade",
        intro: "No Brasil Pré-Colonial, entre 1500 e a década de 1530, comerciantes portugueses buscaram riquezas no território e dependeram dos conhecimentos e do trabalho dos povos nativos para explorar o pau-brasil.",
        facts: [
          { term: "Pau-brasil ou ibirapitanga", text: "era uma madeira avermelhada usada para produzir corante de tecidos valorizados na Europa." },
          { term: "Escambo", text: "era a troca direta, sem moeda: madeira e trabalho eram trocados por machados, foices, facas, espelhos, tecidos e panelas." },
          { term: "Feitorias", text: "eram armazéns fortificados no litoral, usados para guardar os produtos antes do embarque." },
          { term: "Consequências", text: "a extração intensa devastou áreas da Mata Atlântica e deixou o pau-brasil ameaçado." },
        ],
        remember: "Os conhecimentos indígenas tornaram a exploração possível, mas os interesses portugueses por acumular riquezas produziram uma relação desigual e grande impacto ambiental.", tone: "orange",
      },
      {
        id: "history-wildlife", number: "02", icon: "🦜", title: "O tráfico de animais no Brasil", subtitle: "Crime, resgate e proteção da fauna", quizId: "history-wildlife",
        intro: "O tráfico retira animais silvestres da natureza, transporta-os e os vende ilegalmente. O material mostra que esse comércio clandestino movimenta muitos animais e causa sofrimento e perda para os ecossistemas.",
        facts: [
          { term: "É ilegal", text: "a captura e o comércio clandestinos de animais silvestres são crimes no Brasil." },
          { term: "Dimensão", text: "o material complementar cita cerca de 38 milhões de animais silvestres retirados ilegalmente da natureza por ano." },
          { term: "Resgate", text: "animais apreendidos podem ser encaminhados aos Centros de Triagem de Animais Silvestres (Cetas)." },
          { term: "Como ajudar", text: "não comprar, não divulgar vendas e comunicar a situação a um adulto ou autoridade responsável." },
        ],
        remember: "Animal silvestre não é mercadoria: retirar uma espécie da natureza causa sofrimento e pode desequilibrar todo o ambiente.", tone: "mint",
      },
      {
        id: "history-technology", number: "03", icon: "💻", title: "Os diferentes usos da tecnologia", subtitle: "Comércio, pandemia e inclusão digital", quizId: "history-technology",
        intro: "Durante a pandemia de COVID-19, o isolamento social acelerou o comércio eletrônico, a educação a distância, o trabalho remoto e o atendimento médico on-line, aumentando ainda mais a dependência da internet.",
        facts: [
          { term: "E-commerce", text: "é a compra e a venda realizadas pela internet, com possibilidade de receber produtos em casa." },
          { term: "Exclusão digital", text: "é a desigualdade de acesso à internet, aos equipamentos e às habilidades para participar do mundo digital." },
          { term: "Desigualdades", text: "o material relaciona dificuldades de acesso durante a pandemia a desigualdades históricas e sociais do Brasil." },
          { term: "Povos indígenas", text: "podem usar a internet para estudar, proteger territórios e fortalecer vínculos sem perder sua identidade." },
        ],
        remember: "Tecnologia pode aproximar, ensinar e facilitar o comércio, mas seus benefícios não chegam a todos da mesma forma.", tone: "blue",
      },
      {
        id: "history-payments", number: "04", icon: "💳", title: "Novas tecnologias para pagamento", subtitle: "Pix, aproximação e segurança", quizId: "history-payments",
        intro: "O comércio mudou do escambo para diferentes meios de pagamento. Hoje, Pix e pagamento por aproximação permitem transações rápidas, mas dinheiro e cartão continuam existindo.",
        facts: [
          { term: "Pix", text: "é uma forma de pagamento e transferência realizada pela internet." },
          { term: "Aproximação", text: "permite pagar aproximando um cartão ou aparelho compatível da máquina." },
          { term: "Vantagens", text: "incluem rapidez, uso a distância e registro das operações." },
          { term: "Cuidados", text: "conferir valor e destinatário e nunca compartilhar senhas ou códigos de segurança." },
        ],
        remember: "Pagamento digital é rápido, mas só deve ser confirmado depois de conferir os dados e proteger as informações pessoais.", tone: "purple",
      },
    ],
  },
  portuguese: portugueseSubject,
};

export const quizCatalog: Record<QuizId, { title: string; subject: SubjectKey; questions: QuizQuestion[] }> = {
  math: { title: "Math Term 2 Challenge", subject: "math", questions: mathQuiz },
  ela: { title: "E.L.A. Term 2 Challenge", subject: "ela", questions: elaQuiz },
  "geography-sectors": { title: "Quiz • Setores da economia", subject: "geography", questions: geographySectorsQuiz },
  "geography-field-city": { title: "Quiz • Campo e cidade", subject: "geography", questions: geographyFieldCityQuiz },
  "geography-materials": { title: "Quiz • Matérias-primas e produtos", subject: "geography", questions: geographyMaterialsQuiz },
  "geography-origin": { title: "Quiz • Origem e extrativismo", subject: "geography", questions: geographyOriginQuiz },
  "geography-recycling": { title: "Quiz • Reciclagem e responsabilidade", subject: "geography", questions: geographyRecyclingQuiz },
  "geography-general": { title: "Provinha geral de Geografia", subject: "geography", questions: geographyGeneralQuiz },
  "history-trade": { title: "Quiz • Trocas comerciais", subject: "history", questions: historyTradeQuiz },
  "history-wildlife": { title: "Quiz • Tráfico de animais", subject: "history", questions: historyWildlifeQuiz },
  "history-technology": { title: "Quiz • Usos da tecnologia", subject: "history", questions: historyTechnologyQuiz },
  "history-payments": { title: "Quiz • Tecnologias de pagamento", subject: "history", questions: historyPaymentsQuiz },
  "history-general": { title: "Provinha geral de História", subject: "history", questions: historyGeneralQuiz },
  "portuguese-general": { title: "Desafio de Português", subject: "portuguese", questions: portugueseQuiz },
};
