import type { SubjectKey } from "../../curriculum-data";

export function LessonVisual({ subject, lessonId }: { subject: SubjectKey; lessonId: string }) {
  if (subject === "math") {
    if (lessonId === "math-time") return <div className="lesson-visual clock-visual" aria-label="Clock showing quarter past three"><div className="clock-face"><b>12</b><b>3</b><b>6</b><b>9</b><i className="hour-hand" /><i className="minute-hand" /><span /></div><p><strong>3:15</strong><small>quarter past three</small></p></div>;
    if (["math-bar-picto", "math-line-pie"].includes(lessonId)) return <div className="lesson-visual graph-visual" aria-label="Example bar graph"><div><i style={{ height: "38%" }} /><i style={{ height: "72%" }} /><i style={{ height: "54%" }} /><i style={{ height: "90%" }} /></div><p><strong>Read the data story</strong><small>title → labels → scale → compare</small></p></div>;
    if (lessonId === "math-remainders") return <div className="lesson-visual box-visual"><div><span>10</span><span>10</span><span>10</span><span>+5</span></div><p><strong>35 ÷ 10 = 3 R5</strong><small>Does the story need one more box?</small></p></div>;
    if (["math-division-meaning", "math-division-strategies", "math-long-division"].includes(lessonId)) return <div className="lesson-visual groups-visual"><div>{[0, 1, 2, 3].map((group) => <span key={group}>{[0, 1, 2].map((dot) => <i key={dot} />)}</span>)}</div><p><strong>12 ÷ 4 = 3</strong><small>Share equally • count each group</small></p></div>;
    return <div className="lesson-visual array-visual"><div>{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><p><strong>3 rows × 4 dots = 12</strong><small>array • repeated addition • product</small></p></div>;
  }
  if (subject === "ela") {
    if (lessonId === "ela-5w1h") return <div className="lesson-visual wh-visual">{["WHO", "WHAT", "WHEN", "WHERE", "WHY", "HOW"].map((word) => <span key={word}>{word}</span>)}</div>;
    if (lessonId === "ela-chronology") return <div className="lesson-visual timeline-visual"><span>First</span><i /><span>Next</span><i /><span>Then</span><i /><span>Finally</span></div>;
    if (lessonId === "ela-imagery") return <div className="lesson-visual senses-visual"><strong>IMAGERY</strong>{[["👁", "sight"], ["👂", "sound"], ["👃", "smell"], ["👅", "taste"], ["✋", "touch"]].map(([icon, label]) => <span key={label}>{icon}<small>{label}</small></span>)}</div>;
    if (lessonId === "ela-summary") return <div className="lesson-visual summary-visual"><div><span>whole text</span><span>main idea + key details</span><span>clear summary</span></div></div>;
    if (lessonId === "ela-character-traits") return <div className="lesson-visual traits-visual"><span>👧🏽</span><div><b>PHYSICAL</b><small>curly hair • brown eyes</small><b>PERSONALITY</b><small>brave • patient • loyal</small></div></div>;
    return <div className="lesson-visual story-map-visual"><span><b>SETTING</b><small>where + when</small></span><i>→</i><span><b>PROBLEM</b><small>what changes?</small></span><i>→</i><span><b>SOLUTION</b><small>how does it end?</small></span></div>;
  }
  if (subject === "history") {
    if (lessonId === "history-trade") return <div className="lesson-visual history-trade-visual"><span><b>🌳 Pau-brasil</b><small>conhecimento + trabalho indígena</small></span><i>⇄</i><span><b>🪓 Ferramentas</b><small>troca direta, sem moeda</small></span></div>;
    if (lessonId === "history-wildlife") return <div className="lesson-visual history-wildlife-visual"><span>🦜</span><i>→</i><span className="danger-cage">▦</span><i>→</i><span>🏥</span><p><strong>Tráfico é crime</strong><small>não comprar • comunicar • proteger</small></p></div>;
    if (lessonId === "history-technology") return <div className="lesson-visual history-tech-visual"><span>🛒<small>comprar</small></span><span>📚<small>estudar</small></span><span>💼<small>trabalhar</small></span><span>🩺<small>consultar</small></span><p><strong>Internet durante a pandemia</strong><small>mais possibilidades, mas acesso desigual</small></p></div>;
    return <div className="lesson-visual history-payment-visual"><span><b>🤝</b><small>escambo</small></span><i>→</i><span><b>💵</b><small>dinheiro</small></span><i>→</i><span><b>💳</b><small>cartão</small></span><i>→</i><span><b>📱</b><small>Pix</small></span></div>;
  }
  if (subject === "geography") {
    if (lessonId === "geography-sectors") return <div className="lesson-visual geography-chain-visual"><span><b>🌾</b><small>primário</small></span><i>→</i><span><b>🏭</b><small>secundário</small></span><i>→</i><span><b>🛍️</b><small>terciário</small></span></div>;
    if (lessonId === "geography-field-city") return <div className="lesson-visual geography-field-visual"><span><b>🚜 CAMPO</b><small>alimentos • matérias-primas</small></span><i>⇄</i><span><b>🏙️ CIDADE</b><small>serviços • indústrias • comércio</small></span></div>;
    if (lessonId === "geography-materials") return <div className="lesson-visual geography-product-visual"><span>🌾<small>trigo</small></span><i>→</i><span>🌾<small>farinha</small></span><i>→</i><span>🍞<small>pão</small></span><i>→</i><span>🏪<small>venda</small></span></div>;
    if (lessonId === "geography-origin") return <div className="lesson-visual geography-origin-visual"><span>🐝<small>animal</small></span><span>🌳<small>vegetal</small></span><span>⛰️<small>mineral</small></span></div>;
    return <div className="lesson-visual geography-recycling-visual"><span>📄</span><i>→</i><span>♻️</span><i>→</i><span>📒</span><p><strong>Um novo ciclo</strong><small>menos resíduos • menos matéria-prima nova</small></p></div>;
  }
  return null;
}

export function GeographyQuestionVisual({ topic }: { topic: string }) {
  if (topic === "Setores da economia") return <div className="geography-question-visual"><span>🌾<small>produzir</small></span><i>→</i><span>🏭<small>transformar</small></span><i>→</i><span>🛍️<small>vender e servir</small></span></div>;
  if (topic === "Campo e cidade") return <div className="geography-question-visual"><span>🚜<small>campo</small></span><i>⇄</i><span>🚚<small>circulação</small></span><i>⇄</i><span>🏙️<small>cidade</small></span></div>;
  if (topic === "Matéria-prima e produtos") return <div className="geography-question-visual"><span>🌳<small>matéria-prima</small></span><i>→</i><span>⚙️<small>transformação</small></span><i>→</i><span>📒<small>produto</small></span></div>;
  if (topic === "Origem e extrativismo") return <div className="geography-question-visual"><span>🐝<small>animal</small></span><span>🌱<small>vegetal</small></span><span>⛰️<small>mineral</small></span></div>;
  return <div className="geography-question-visual"><span>📄<small>usar</small></span><i>→</i><span>♻️<small>reciclar</small></span><i>→</i><span>📒<small>novo produto</small></span></div>;
}
