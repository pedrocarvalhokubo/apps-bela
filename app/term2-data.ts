import type { QuizQuestion } from "./quiz-data";
import type { StudySubject } from "./curriculum-data";

type Option = [string, string];

const associationConcepts: Record<string, string> = {
  "Division:6": "DIVISOR",
  "Data:11": "PICTOGRAPH KEY",
  "Data:12": "SCALE",
  "Data:14": "RANGE",
  "Time:16": "QUARTER PAST",
  "Time:17": "TWENTY TO",
  "Story elements:1": "SETTING",
  "Character traits:4": "PHYSICAL TRAIT",
  "5Ws & 1H:7": "WHY",
  "Chronological order:10": "CHRONOLOGICAL ORDER",
  "Imagery:13": "SOUND IMAGERY",
  "Main idea:15": "MAIN IDEA",
  "Mixed reading:20": "PLOT",
};

const visualForTopic = (topic: string): Pick<QuizQuestion, "visualKey" | "visualPrompt"> => {
  if (["Multiplication", "Division", "Remainders", "Mixed operations"].includes(topic)) return { visualKey: "math-groups", visualPrompt: "Use os grupos, as fileiras e a distribuição de objetos como pista visual." };
  if (["Data", "Time"].includes(topic)) return { visualKey: "math-data-time", visualPrompt: "Observe gráficos, símbolos, partes do todo e o relógio antes de calcular." };
  if (["Character traits", "The Thing About Georgie"].includes(topic)) return { visualKey: "ela-character", visualPrompt: "Observe as características, ações e mudanças das personagens." };
  if (["Imagery"].includes(topic)) return { visualKey: "ela-senses", visualPrompt: "Imagine o que a cena permite ver, ouvir, cheirar, provar e tocar." };
  return { visualKey: "ela-story", visualPrompt: "Observe cenário, personagens, pistas e sequência para organizar sua leitura." };
};

const q = (
  id: number,
  topic: string,
  prompt: string,
  support: string,
  correctIndex: number,
  options: Option[],
): QuizQuestion => {
  const letters = ["a", "b", "c", "d"];
  return {
    id,
    topic,
    prompt,
    support,
    ...(associationConcepts[`${topic}:${id}`] ? { format: "association" as const, concept: associationConcepts[`${topic}:${id}`] } : {}),
    ...visualForTopic(topic),
    correct: letters[correctIndex],
    options: options.map(([label, explanation], index) => ({
      id: letters[index],
      label,
      explanation,
    })),
  };
};

export const term2AddedSubjects: Record<"math" | "ela", StudySubject> = {
  math: {
    key: "math",
    name: "Math",
    icon: "➗",
    eyebrow: "MATH • TERM 2",
    title: "Numbers, data & time",
    description: "Learn with arrays, equal groups, graphs, clocks and story problems — one visual mission at a time.",
    assessmentDate: "Revisão livre",
    quizId: "math",
    lessons: [
      {
        id: "math-meaning-multiplication", number: "01", icon: "🟣", title: "Meaning of multiplication", subtitle: "Equal groups, arrays and repeated addition",
        intro: "Multiplication describes equal groups. Three rows with four dots in each row can be written as 4 + 4 + 4 or 3 × 4.",
        facts: [
          { term: "Factors", text: "are the numbers being multiplied." },
          { term: "Product", text: "is the answer to a multiplication." },
          { term: "An array", text: "organizes objects in equal rows and columns so the groups are easy to see." },
        ],
        remember: "Count the groups, count how many are in each group, then multiply.", tone: "purple",
      },
      {
        id: "math-facts", number: "02", icon: "🪜", title: "Facts and skip counting", subtitle: "Build facts from patterns you know",
        intro: "Skip counting helps you notice multiplication patterns: 6, 12, 18, 24 is counting by sixes.",
        facts: [
          { term: "Known facts", text: "can help build harder facts, such as using 7 × 5 and 7 × 2 to find 7 × 7." },
          { term: "Multiplication facts", text: "can be practiced with equal jumps and patterns in the multiplication table." },
          { term: "Multiples", text: "are the products in a number's multiplication sequence." },
        ],
        remember: "Use a fact you know as a bridge to the fact you need.", tone: "blue",
      },
      {
        id: "math-decompose", number: "03", icon: "🧩", title: "Decomposing factors", subtitle: "Break a hard multiplication into friendly parts",
        intro: "A factor can be split into smaller parts. For 6 × 14, think 6 × 10 plus 6 × 4.",
        facts: [
          { term: "Break down numbers", text: "keeps one factor and splits the other number into easier parts." },
          { term: "Place value", text: "makes tens and hundreds useful friendly parts." },
          { term: "Check", text: "the partial products must be added at the end." },
        ],
        remember: "Split, multiply each part, then add the partial products.", tone: "mint",
      },
      {
        id: "math-powers-ten", number: "04", icon: "💯", title: "Multiplying by 1, 10 and 100", subtitle: "Place-value patterns",
        intro: "When a whole number is multiplied by 10 or 100, each digit shifts to a place with a greater value.",
        facts: [
          { term: "× 1", text: "keeps the number the same." },
          { term: "× 10", text: "makes every digit worth ten times as much." },
          { term: "× 100", text: "makes every digit worth one hundred times as much." },
        ],
        remember: "Think about place value, not only about adding zeros.", tone: "sunny",
      },
      {
        id: "math-algorithm", number: "05", icon: "✏️", title: "Multiplication algorithm", subtitle: "Line up place values and regroup",
        intro: "The standard algorithm records partial products in a compact way. Ones stay under ones and tens under tens.",
        facts: [
          { term: "Start", text: "with the ones place." },
          { term: "Regroup", text: "when a partial product has more than nine ones or tens." },
          { term: "Write in columns", text: "with ones under ones and tens under tens." },
        ],
        remember: "Align, multiply from the ones place, regroup and check.", tone: "orange",
      },
      {
        id: "math-division-meaning", number: "06", icon: "🍪", title: "Meaning of division", subtitle: "Sharing and grouping equally",
        intro: "Division can mean sharing a total equally or finding how many equal groups fit in the total.",
        facts: [
          { term: "Dividend", text: "is the total being divided." },
          { term: "Divisor", text: "tells the number or size of the equal groups." },
          { term: "Quotient", text: "is the answer." },
        ],
        remember: "Ask: am I sharing into groups, or counting how many groups fit?", tone: "mint",
      },
      {
        id: "math-division-strategies", number: "07", icon: "↔️", title: "Division strategies", subtitle: "Arrays, fact families and repeated subtraction",
        intro: "Multiplication and division are inverse operations. If 7 × 8 = 56, then 56 ÷ 7 = 8 and 56 ÷ 8 = 7.",
        facts: [
          { term: "Fact families", text: "connect two multiplication facts and two division facts." },
          { term: "Repeated subtraction", text: "removes equal groups until nothing or a remainder is left." },
          { term: "A number line", text: "shows equal jumps and makes the number of groups visible." },
        ],
        remember: "When division feels hard, search for the related multiplication fact.", tone: "blue",
      },
      {
        id: "math-long-division", number: "08", icon: "🏗️", title: "Long division", subtitle: "Divide, multiply, subtract and bring down",
        intro: "Long division organizes a large problem into smaller place-value steps, including divisors with two digits.",
        facts: [
          { term: "Divide", text: "determine how many times the divisor fits into the current part of the dividend." },
          { term: "Multiply and subtract", text: "to find what remains at that step." },
          { term: "Bring down", text: "the next digit and repeat." },
        ],
        remember: "Divide → multiply → subtract → bring down → check.", tone: "purple",
      },
      {
        id: "math-remainders", number: "09", icon: "📦", title: "Remainders in context", subtitle: "The story decides what the remainder means",
        intro: "A remainder is what is left after making equal groups. In a story problem, it may be left over or require one more complete group.",
        facts: [
          { term: "Leave it", text: "when the problem asks what remains." },
          { term: "Check it", text: "the remainder must always be smaller than the divisor." },
          { term: "Round up", text: "when every person or object needs a complete box, bus or table." },
        ],
        remember: "Do not decide with the calculation alone — reread what the question asks.", tone: "orange",
      },
      {
        id: "math-bar-picto", number: "10", icon: "📊", title: "Bar graphs and pictographs", subtitle: "Read titles, axes, scales and keys",
        intro: "A graph represents data visually. Before answering, inspect the title, labels, scale and pictograph key.",
        facts: [
          { term: "A bar graph", text: "compares categories using bars measured against a scale." },
          { term: "A pictograph", text: "uses symbols; the key tells how much each symbol represents." },
          { term: "The key", text: "shows how many items each complete symbol represents." },
        ],
        remember: "Never count pictograph symbols before reading the key.", tone: "sunny",
      },
      {
        id: "math-line-pie", number: "11", icon: "📈", title: "Line and pie graphs", subtitle: "Change over time and parts of a whole",
        intro: "Line graphs show how a value changes, while pie charts show how a whole is divided into parts.",
        facts: [
          { term: "Line graph", text: "usually places time on the horizontal axis." },
          { term: "Pie chart", text: "represents a whole, so all sectors together equal 100%." },
          { term: "Range", text: "is the greatest value minus the least value." },
        ],
        remember: "Line = change; pie = parts of one whole.", tone: "blue",
      },
      {
        id: "math-time", number: "12", icon: "🕒", title: "Telling time", subtitle: "Past, to, quarters and elapsed time",
        intro: "The minute hand shows minutes and the hour hand moves gradually. After 30 minutes, English often counts how many minutes are left to the next hour.",
        facts: [
          { term: "Quarter past", text: "means 15 minutes after the hour; half past means 30 minutes after." },
          { term: "Quarter to", text: "means 15 minutes before the next hour." },
          { term: "Elapsed time", text: "can be found by jumping to a friendly hour, then to the ending time." },
        ],
        remember: "Build a timeline and add the jumps instead of guessing.", tone: "purple",
      },
    ],
  },
  ela: {
    key: "ela",
    name: "E.L.A.",
    icon: "📚",
    eyebrow: "E.L.A. • TERM 2",
    title: "Stories, characters & imagery",
    description: "Explore The Thing About Georgie and learn to understand, organize and write richer stories.",
    assessmentDate: "Revisão livre",
    quizId: "ela",
    lessons: [
      {
        id: "ela-story-elements", number: "01", icon: "🗺️", title: "Story elements", subtitle: "Setting, characters, plot, problem and solution",
        intro: "Story elements help a reader understand where a story happens, who takes part, what changes and how the central problem is resolved.",
        facts: [
          { term: "Setting", text: "tells when and where the story happens." },
          { term: "Plot", text: "is the sequence of important events." },
          { term: "Problem and solution", text: "show the main challenge and how it is addressed." },
        ],
        remember: "Ask: where, who, what happened, what went wrong and how did it change?", tone: "purple",
      },
      {
        id: "ela-character-traits", number: "02", icon: "🪞", title: "Character traits", subtitle: "Physical and personality traits",
        intro: "Physical traits describe appearance. Personality traits describe how a character usually thinks, feels or behaves.",
        facts: [
          { term: "Physical trait", text: "can be observed, such as curly hair or short height." },
          { term: "Personality trait", text: "is supported by actions, words and choices, such as patient or brave." },
          { term: "Description", text: "uses appearance or behavior to explain what a character is like." },
        ],
        remember: "Name the trait, then point to the action or words that prove it.", tone: "mint",
      },
      {
        id: "ela-georgie", number: "03", icon: "🎵", title: "The Thing About Georgie", subtitle: "Characters, conflicts and change",
        intro: "The worksheet asks readers to identify the settings, characters, problems, solutions, five important events and how Georgie, Jeanie and Andy change over time.",
        facts: [
          { term: "Settings and characters", text: "identify where the story happens and who takes part." },
          { term: "Problems and solutions", text: "show the difficulties the characters face and how they solve them." },
          { term: "Character change", text: "is found by comparing Georgie, Jeanie and Andy across the story." },
        ],
        remember: "Track what Georgie wants, what gets in the way and what he learns.", tone: "orange",
      },
      {
        id: "ela-5w1h", number: "04", icon: "🔎", title: "5Ws and 1H", subtitle: "Who, what, when, where, why and how",
        intro: "The 5Ws and 1H organize the essential information in a scene, chapter, event or summary.",
        facts: [
          { term: "Who", text: "identifies the people or characters involved." },
          { term: "What, when and where", text: "identify the event, time and place." },
          { term: "Why and how", text: "explain motivation, cause and process." },
        ],
        remember: "If one answer is missing, look back for a clue instead of inventing it.", tone: "blue",
      },
      {
        id: "ela-chronology", number: "05", icon: "🧵", title: "Chronological order", subtitle: "First, next, then and finally",
        intro: "Chronological order arranges events by when they happened and helps readers follow causes and effects.",
        facts: [
          { term: "Sequence words", text: "signal order: first, later, meanwhile, after and finally." },
          { term: "Important events", text: "should be selected before they are placed in order." },
          { term: "Beginning to end", text: "keeps the sequence clear for the reader." },
        ],
        remember: "Place each event on a timeline before writing the sequence.", tone: "sunny",
      },
      {
        id: "ela-summary", number: "06", icon: "📝", title: "Writing a summary", subtitle: "Main idea and essential details",
        intro: "A summary retells the most important ideas in fewer words, in your own language and in a logical order.",
        facts: [
          { term: "Main idea", text: "is the central message or most important point." },
          { term: "Key details", text: "are necessary to understand the main idea." },
          { term: "Minor details", text: "can be removed when they do not change the meaning." },
        ],
        remember: "Keep the spine of the text; remove decorations and repeated details.", tone: "mint",
      },
      {
        id: "ela-imagery", number: "07", icon: "🌈", title: "Imagery", subtitle: "Writing with the five senses",
        intro: "Imagery uses precise sensory details to help the reader picture, hear, smell, taste or feel a scene.",
        facts: [
          { term: "Sight and sound", text: "show color, movement, volume and rhythm." },
          { term: "Smell and taste", text: "can make a setting or memory feel immediate." },
          { term: "Touch", text: "describes texture, temperature, pressure and movement." },
        ],
        remember: "Choose one exact sensory detail instead of many vague adjectives.", tone: "purple",
      },
    ],
  },
};

export const mathQuiz: QuizQuestion[] = [
  q(1, "Multiplication", "Which expression matches 4 equal groups of 6?", "Count the groups first, then the objects in each group.", 1, [["4 + 6", "That adds the two numbers once; it does not show four equal groups."], ["4 × 6", "Correct. Four groups with six in each group are 4 × 6."], ["6 − 4", "Subtraction removes objects instead of making equal groups."], ["6 ÷ 4", "Division asks about sharing or grouping a total."]]),
  q(2, "Multiplication", "An array has 3 rows and 8 dots in each row. How many dots are there?", "Use rows × dots per row.", 2, [["11", "That is 3 + 8, but every row contains eight dots."], ["21", "Check the skip-counting pattern: 8, 16, 24."], ["24", "Correct. 3 × 8 = 24."], ["32", "That would be four groups of eight, not three."]]),
  q(3, "Multiplication", "What is the best way to decompose 7 × 13?", "Split 13 into friendly place-value parts.", 0, [["(7 × 10) + (7 × 3)", "Correct. Keep 7 and split 13 into 10 + 3."], ["7 × 10 × 3", "Multiplying all three numbers changes the value."], ["(7 + 10) × 3", "This changes both the grouping and the operation."], ["70 + 13", "The second partial product should be 7 × 3, not 13."]]),
  q(4, "Multiplication", "What is 46 × 10?", "Think about each digit becoming ten times as valuable.", 3, [["46", "Multiplying by one keeps a number the same; ×10 changes place value."], ["56", "Adding ten is different from multiplying by ten."], ["406", "The digits must shift together one place to the left."], ["460", "Correct. Each digit shifts one place to the left."]]),
  q(5, "Multiplication", "What is 38 × 6 using long multiplication?", "Multiply the ones, regroup, and then multiply the tens.", 1, [["208", "Check the regrouped tens after multiplying 8 × 6."], ["228", "Correct. 8 × 6 = 48; write 8, regroup 4 tens, then 3 × 6 + 4 = 22."], ["380", "That resembles 38 × 10, not ×6."], ["2,280", "The product has one extra place-value position."]]),
  q(6, "Division", "In 72 ÷ 8 = 9, which number is the divisor?", "The divisor tells what the total is divided by.", 2, [["72", "72 is the dividend, the total being divided."], ["9", "9 is the quotient, the answer."], ["8", "Correct. 8 is the divisor."], ["81", "81 does not appear in this division sentence."]]),
  q(7, "Division", "Which multiplication fact helps solve 56 ÷ 7?", "Find a fact with product 56 and one factor 7.", 0, [["7 × 8 = 56", "Correct. The related quotient is 8."], ["7 × 7 = 49", "This product is close but does not equal the dividend."], ["6 × 8 = 48", "Neither factor matches the divisor 7."], ["9 × 7 = 63", "This product is greater than 56."]]),
  q(8, "Division", "What is 95 ÷ 10?", "Make as many complete groups of ten as possible.", 1, [["8 R15", "A remainder must be smaller than the divisor."], ["9 R5", "Correct. Nine tens use 90 and leave 5."], ["10 R5", "Ten groups of ten would require 100."], ["9 R10", "A remainder of 10 can make one more group."]]),
  q(9, "Remainders", "95 students travel in vans that hold 10 students each. How many vans are needed?", "Every student needs a seat.", 3, [["9 vans", "Nine vans hold only 90 students, leaving five without seats."], ["9.5 vans", "A school cannot use half of a van."], ["5 vans", "That confuses the remainder with the number of groups."], ["10 vans", "Correct. The remainder means one more complete van is needed."]]),
  q(10, "Division", "Which sequence shows the long-division steps in the correct order?", "Follow the same cycle shown in the material.", 0, [["Divide, multiply, subtract, bring down", "Correct. Repeat this cycle until there are no more digits to bring down."], ["Add, multiply, bring down, divide", "Long division does not begin with addition."], ["Multiply, add, divide, subtract", "The quotient digit must be found before multiplying."], ["Bring down, ignore the divisor, add", "The divisor is needed in every cycle."]]),
  q(11, "Data", "A pictograph key says ★ = 4 books. What do 3 stars represent?", "Multiply the number of complete symbols by the key value.", 1, [["7 books", "That adds the number of symbols and the key value."], ["12 books", "Correct. 3 complete symbols × 4 books = 12 books."], ["14 books", "Recheck 3 × 4."], ["16 books", "That would represent four complete stars."]]),
  q(12, "Data", "Which feature tells what each tick mark on a bar graph means?", "Look along the numbered axis.", 1, [["The color", "Color can separate categories, but it does not define tick values."], ["The scale", "Correct. The scale shows the value between tick marks."], ["The border", "A border does not encode the measurements."], ["The font", "The typeface does not define the quantities."]]),
  q(13, "Data", "A line graph rises from 18 to 31. By how much did the value increase?", "Find the difference between the later and earlier values.", 0, [["13", "Correct. 31 − 18 = 13."], ["49", "That adds the values instead of finding the change."], ["18", "That is the starting value, not the increase."], ["31", "That is the ending value, not the increase."]]),
  q(14, "Data", "The greatest value is 42 and the least is 17. What is the range?", "Range = greatest − least.", 3, [["59", "That is the sum, not the range."], ["42", "That is only the greatest value."], ["17", "That is only the least value."], ["25", "Correct. 42 − 17 = 25."]]),
  q(15, "Data", "In a pie chart, one half of the circle represents which fraction?", "A pie chart represents one whole.", 2, [["1/4", "One fourth is a quarter of the circle."], ["2/3", "Two thirds is more than half."], ["1/2", "Correct. Half of a whole is 1/2."], ["1/8", "One eighth is much smaller than half."]]),
  q(16, "Time", "What time is quarter past 7?", "Quarter past means 15 minutes after the hour.", 0, [["7:15", "Correct. A quarter of an hour is 15 minutes."], ["7:45", "That is quarter to 8."], ["6:45", "That is quarter to 7."], ["7:30", "That is half past 7."]]),
  q(17, "Time", "What time is twenty to 6?", "Count 20 minutes back from 6:00.", 1, [["6:20", "That is twenty past 6."], ["5:40", "Correct. There are 20 minutes from 5:40 to 6:00."], ["5:20", "That is forty minutes before 6."], ["6:40", "That is after 6, not before it."]]),
  q(18, "Time", "A lesson starts at 9:35 and ends at 10:20. How long is it?", "Jump from 9:35 to 10:00, then to 10:20.", 2, [["35 minutes", "This misses part of the interval."], ["55 minutes", "Check the two jumps: 25 minutes and 20 minutes."], ["45 minutes", "Correct. 25 + 20 = 45 minutes."], ["1 hour 45 minutes", "The end is less than one hour after the start."]]),
  q(19, "Mixed operations", "A shop packs 6 pencils in each box. How many pencils are in 14 boxes?", "Equal groups suggest multiplication.", 3, [["20", "That adds boxes and pencils per box."], ["80", "Check by decomposing 14 into 10 + 4."], ["96", "That product does not match 6 × 14."], ["84", "Correct. 6 × 10 + 6 × 4 = 60 + 24 = 84."]]),
  q(20, "Mixed operations", "126 stickers are shared equally among 9 students. How many does each receive?", "Use the related multiplication fact 9 × ? = 126.", 1, [["12", "9 × 12 = 108, so some stickers remain unaccounted for."], ["14", "Correct. 9 × 14 = 126."], ["16", "9 × 16 = 144, which is too large."], ["18", "9 × 18 = 162, which is too large."]]),
];

export const elaQuiz: QuizQuestion[] = [
  q(1, "Story elements", "Which detail belongs to the setting?", "Setting tells when and where.", 2, [["Maya is patient", "That is a personality trait."], ["The friends solve the mystery", "That describes a plot event or solution."], ["On a rainy Tuesday in the school library", "Correct. It gives both time and place."], ["The missing key", "That may be part of the problem."]]),
  q(2, "Story elements", "What is the plot of a story?", "Think about what happens from beginning to end.", 1, [["Only the place", "Place is one part of the setting."], ["The sequence of important events", "Correct. The plot connects the important events."], ["A list of adjectives", "Adjectives can describe details but are not the plot."], ["Only the title", "A title may hint at the story but does not contain its full sequence."]]),
  q(3, "Character traits", "Lena returns a wallet she found even though nobody saw her. Which trait is best supported?", "Use the action as evidence.", 3, [["Noisy", "Returning the wallet does not show how loudly she behaves."], ["Shy", "The action does not prove that she avoids attention."], ["Careless", "She makes a responsible choice, not a careless one."], ["Honest", "Correct. Returning the wallet supports the trait honest."]]),
  q(4, "Character traits", "Which is a physical trait?", "Choose something that can be observed about appearance.", 0, [["Curly black hair", "Correct. This describes appearance."], ["Generous", "Generous is a personality trait."], ["Patient", "Patient describes behavior."], ["Clever", "Clever describes a mental quality."]]),
  q(5, "The Thing About Georgie", "What should a reader compare to explain how Georgie changes over time?", "Use information from different moments of the book.", 2, [["Only the number of pages", "Page count does not explain character change."], ["Only the cover illustration", "The cover cannot show all the important events."], ["Georgie's actions and feelings at the beginning and later in the story", "Correct. Comparing moments across the story reveals how Georgie changes."], ["Every punctuation mark", "Punctuation does not answer how the character changes."]]),
  q(6, "The Thing About Georgie", "Which list matches the worksheet about The Thing About Georgie?", "Recall the six prompts in the study material.", 1, [["Colors, numbers, rhymes and punctuation", "These are not the worksheet prompts."], ["Settings, characters, problems, solutions, important events and character changes", "Correct. These are the areas the material asks Bela to review."], ["Only the title and the cover", "The worksheet asks for much more information."], ["Weather, recipes and maps", "These do not match the book questions in the material."]]),
  q(7, "5Ws & 1H", "Which question helps identify motivation?", "Motivation explains a reason.", 3, [["Who?", "Who identifies a person or character."], ["When?", "When identifies time."], ["Where?", "Where identifies place."], ["Why?", "Correct. Why asks for the reason or motivation."]]),
  q(8, "5Ws & 1H", "Which answer best completes the 'how' of an event?", "How explains the process or manner.", 0, [["By following the map and checking each landmark", "Correct. This explains the process."], ["At the park", "That answers where."], ["On Friday", "That answers when."], ["Leo and Ana", "That answers who."]]),
  q(9, "Chronological order", "Which sequence is chronological?", "Put events in the order they happened.", 2, [["Finally, first, next", "The signal words are out of order."], ["Tomorrow, yesterday, today", "This moves backward and forward in time."], ["First, next, then, finally", "Correct. The sequence moves from beginning to end."], ["Effect, cause, title, setting", "These are not timeline markers."]]),
  q(10, "Chronological order", "Which step should come first when putting story events in chronological order?", "Chronological order follows the events from beginning to end.", 1, [["Start with the final solution", "The solution normally comes after the problem and important actions."], ["Identify what happened earliest", "Correct. Begin with the earliest event, then continue in time order."], ["Arrange events by sentence length", "Sentence length does not show when an event happened."], ["Choose the funniest event", "Preference does not determine chronological order."]]),
  q(11, "Summary", "Which detail belongs in a summary?", "Keep what is necessary to understand the main idea.", 0, [["The central problem and how it changes", "Correct. This is essential to the story's meaning."], ["The color of every character's socks", "That minor detail is usually unnecessary."], ["Every sentence copied from the text", "A summary is shorter and uses your own words."], ["A new event invented by the reader", "A summary must remain faithful to the text."]]),
  q(12, "Summary", "What should a strong summary avoid?", "A summary is concise and accurate.", 3, [["The main idea", "The main idea is essential."], ["Important events", "Key events may be necessary."], ["Logical order", "Logical order makes the summary clear."], ["Repeated and minor details", "Correct. These make a summary longer without improving meaning."]]),
  q(13, "Imagery", "Which sentence uses sound imagery?", "Listen for a detail you could hear.", 1, [["The lemon tasted sharp", "That is taste imagery."], ["The gate creaked and slammed", "Correct. Creaked and slammed appeal to hearing."], ["The blanket felt rough", "That is touch imagery."], ["The sunset glowed orange", "That is sight imagery."]]),
  q(14, "Imagery", "Which revision creates stronger imagery?", "Choose precise sensory language.", 2, [["The food was nice", "Nice is vague and gives no sensory detail."], ["There was food", "This only states that food existed."], ["Warm cinnamon drifted from the crisp apple pie", "Correct. Smell, temperature and texture make the scene vivid."], ["The food was very, very good", "Repeating a vague adjective is less effective than precise detail."]]),
  q(15, "Main idea", "How is a main idea different from a detail?", "Think central message versus support.", 0, [["The main idea is central; details explain or support it", "Correct. Details help develop the central idea."], ["A detail is always longer", "Length does not decide importance."], ["The main idea must be the first sentence", "It may be stated elsewhere or inferred."], ["There is no difference", "They have different roles in comprehension."]]),
  q(16, "Character traits", "Which sentence describes both a physical trait and a personality trait?", "Physical traits show appearance; personality traits show how someone behaves.", 3, [["Nina lives near a park", "This describes a place, not appearance and personality."], ["Nina opened the door", "This is an action but does not name both kinds of traits."], ["Nina visited her friend on Tuesday", "This gives an event and time."], ["Nina has curly brown hair and is generous", "Correct. Curly brown hair is physical, and generous is a personality trait."]]),
  q(17, "5Ws & 1H", "Which pair correctly matches a question with the information it finds?", "Use the six questions from the material.", 2, [["Who — the time", "Who identifies a person or character."], ["Where — the reason", "Where identifies the place."], ["When — the time", "Correct. When asks at what time the event happened."], ["Why — the place", "Why asks for a reason."]]),
  q(18, "Imagery", "Which sentence uses touch imagery?", "Look for texture or temperature.", 0, [["The kitten's fur was soft and smooth", "Correct. Soft and smooth describe what touch can feel."], ["The bell rang loudly", "That is sound imagery."], ["The roses smelled sweet", "That is smell imagery."], ["The lemonade tasted tangy", "That is taste imagery."]]),
  q(19, "Summary", "Which checklist belongs in the summary requested by the material?", "The worksheet says not to forget the 5Ws and 1H.", 1, [["Colors, shapes and sizes", "These do not organize the essential story information."], ["Who, what, when, where, why and how", "Correct. The material explicitly asks for these six parts in the summary."], ["Only the title and first sentence", "A summary needs the essential information from the story."], ["Every minor detail", "A summary should focus on the important information."]]),
  q(20, "Mixed reading", "A summary says: 'Kai missed the bus, asked a neighbor for help, and arrived before the play began.' Which story element is most visible?", "Notice the connected sequence of events.", 3, [["Only the setting", "The time and place are not the focus."], ["Only physical traits", "No appearance is described."], ["Only imagery", "The sentence does not emphasize sensory detail."], ["Plot", "Correct. It presents a sequence of important events."]]),
];
