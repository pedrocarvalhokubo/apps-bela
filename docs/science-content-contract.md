# Science Term 3 editorial contract

Based on existing `StudySubject`, `StudyLesson`, `QuizQuestion`, and `DeepStudy`; no database or progress migration is needed. Keep the existing 33 lesson IDs and all quiz IDs. Add only `science` / `science-general` and eight unique `science-*` lesson IDs.

The canonical editorial JSON must contain:

- `scienceSubject`: `{key:"science",name:"Science",icon,eyebrow,title,description,assessmentDate:"",quizId:"science-general",lessons:[...]}`.
- Each lesson: `{id,number:string,icon,title,subtitle,intro,facts:[{term,text}],remember,tone,quizId:"science-general"}`. English teaching text with Portuguese support. Use existing tones (`blue`, `green`, etc.) as observed in curriculum-data.ts.
- `scienceQuiz`: 20 `{id:number,topic,prompt,support,format:"choice"|"association",concept?,correct,options:[{id,label,explanation}]}`. Option IDs `a,b,c,d`; `correct` equals one option ID. `support` is the hint. Every option has an explanation. Association questions display `concept` and selectable descriptions. Do not use a new visualKey unless engineering implements it.
- `scienceDeepStudyByLesson`: keyed by the eight lesson IDs, each `{title,paragraphs:string[],vocabulary:[emoji,English,Portuguese][],example,challenge}`.
- `scienceInfographicPages`: four `{src,alt,width:number,height:number,label}` using public-relative paths under `/infographics/`.
- `scienceDownloads`: `{exam:"/materials/science-term3-exam.pdf",answerKey:"/materials/science-term3-answer-key.pdf"}`.

Provide Library IDs for JSON, four images, exam PDF and answer key PDF. Images/PDFs must contain general instructional content only, with no photos of student worksheets, student/school names, schedule or new personal data. Canonical photo-derived content must be supplied by the editorial worker; do not substitute invented curriculum.

Preservation: deployment remains existing Railway service, same volume `/data`, single replica, `node scripts/start.mjs`, `/api/health`. New content must be asset-packed after pixel/PDF inspection. Production QA must not answer quizzes or toggle completion in Bela's real profile. API persistence tests use a disposable local DB.
