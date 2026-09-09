export type ProgressRecord = Record<string, { solved: boolean; attempts: number; firstTry: boolean }>;
export function mergeProgress(a: ProgressRecord, b: ProgressRecord): ProgressRecord {
  const result = { ...a };
  for (const [key, next] of Object.entries(b)) {
    const prior = result[key];
    result[key] = prior ? {
      solved: prior.solved || next.solved,
      attempts: Math.min(prior.attempts, next.attempts),
      firstTry: prior.firstTry || next.firstTry,
    } : next;
  }
  return result;
}
