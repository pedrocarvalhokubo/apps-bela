export type StudyState = Record<string, unknown>;
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter(x => typeof x === 'string').slice(0,1000) : [];
const object = (v: unknown): Record<string, unknown> => v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {};
// Used only for concurrent writes/imports: never erase another device's achievements.
export function mergeStudy(current: StudyState, incoming: StudyState): StudyState {
  const stats: Record<string, unknown> = {...object(current.quizStatsById)};
  for (const [id,value] of Object.entries(object(incoming.quizStatsById))) {
    const a=object(stats[id]),b=object(value);
    stats[id]=Object.fromEntries(['bestScore','attempts','totalAnswered'].map(k=>[k,Math.max(Number(a[k])||0,Number(b[k])||0)]));
  }
  return {...current,...incoming,
    completedLessons:[...new Set([...strings(current.completedLessons),...strings(incoming.completedLessons)])],
    doubtQuestionIds:[...new Set([...strings(current.doubtQuestionIds),...strings(incoming.doubtQuestionIds)])],
    quizStatsById:stats,
    studyNotes:incoming.studyNotes || current.studyNotes || '',
  };
}

export function validStudy(value:unknown):value is StudyState {
 if(!value || typeof value!=='object' || Array.isArray(value))return false;
 const s=value as StudyState;
 for(const key of ['completedLessons','doubtQuestionIds'])if(s[key]!==undefined && (!Array.isArray(s[key]) || !(s[key] as unknown[]).every(v=>typeof v==='string')))return false;
 for(const key of ['quizAnswers','resultAnswers'])if(s[key]!==undefined && !Array.isArray(s[key]))return false;
 for(const key of ['studyNotes','activeSubject','activeQuizId','openLesson','lastStudyView'])if(s[key]!==undefined && typeof s[key]!=='string')return false;
 if(s.quizIndex!==undefined && (!Number.isInteger(s.quizIndex)||Number(s.quizIndex)<0))return false;
 if(s.quizStatsById!==undefined && (!s.quizStatsById||typeof s.quizStatsById!=='object'||Array.isArray(s.quizStatsById)))return false;
 return true;
}
