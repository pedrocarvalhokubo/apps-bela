import { mergeStudy, type StudyState } from "./study-merge";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { mergeProgress, type ProgressRecord } from "./obmep-progress";

let connection: DatabaseSync | undefined;
function connect() {
  if (connection) return connection;
  if (process.env.RAILWAY_ENVIRONMENT_ID && !process.env.RAILWAY_VOLUME_MOUNT_PATH) {
    throw new Error("Attach a persistent Railway volume before starting the application");
  }
  const path = process.env.DB_PATH || join(process.env.RAILWAY_VOLUME_MOUNT_PATH || "data", "bela.sqlite");
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec("BEGIN IMMEDIATE");
  try {
    const schema = readFileSync(join(process.cwd(), "drizzle/0000_wise_toad.sql"), "utf8")
      .replaceAll("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")
      .replaceAll("CREATE INDEX ", "CREATE INDEX IF NOT EXISTS ");
    db.exec(schema);
    db.exec(`CREATE TABLE IF NOT EXISTS obmep_progress (
      profile_id TEXT PRIMARY KEY REFERENCES profiles(id), state_json TEXT NOT NULL, updated_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS pin_failures (
      profile_id TEXT PRIMARY KEY REFERENCES profiles(id), count INTEGER NOT NULL, locked_until INTEGER NOT NULL);`);
    db.exec(`CREATE TABLE IF NOT EXISTS login_sessions (token_hash TEXT PRIMARY KEY, profile_id TEXT NOT NULL REFERENCES profiles(id), expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS auth_failures (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, window_start INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS history_imports (source_key TEXT PRIMARY KEY, profile_id TEXT NOT NULL, imported_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS written_drafts (profile_id TEXT NOT NULL REFERENCES profiles(id), task_id TEXT NOT NULL, answer TEXT NOT NULL, updated_at INTEGER NOT NULL, PRIMARY KEY(profile_id,task_id));`);
    db.exec("COMMIT");
  } catch (error) { db.exec("ROLLBACK"); db.close(); throw error; }
  connection = db;
  return db;
}

class Statement {
  constructor(readonly sql: string, readonly params: SQLInputValue[] = []) {}
  bind(...values: SQLInputValue[]) { return new Statement(this.sql, values); }
  async first<T = Record<string, unknown>>(): Promise<T | null> {
    return (connect().prepare(this.sql).get(...this.params) as T | undefined) ?? null;
  }
  async all<T = Record<string, unknown>>() {
    return { results: connect().prepare(this.sql).all(...this.params) as T[] };
  }
  runSync() { return connect().prepare(this.sql).run(...this.params); }
  async run() { return this.runSync(); }
}

export async function getDatabase() {
  const db = connect();
  return {
    prepare: (sql: string) => new Statement(sql),
    saveStudy(profileId: string, incoming: StudyState, revision: number) {
      db.exec("BEGIN IMMEDIATE");
      try {
        const row=db.prepare("SELECT state_json,updated_at FROM study_state WHERE profile_id=?").get(profileId);
        const conflict=Boolean(row && Number(row.updated_at)!==revision);
        const state=conflict ? mergeStudy(JSON.parse(String(row!.state_json)),incoming) : incoming;
        const updatedAt=Math.max(Date.now(),Number(row?.updated_at || 0)+1);
        db.prepare("INSERT INTO study_state(profile_id,state_json,updated_at) VALUES(?,?,?) ON CONFLICT(profile_id) DO UPDATE SET state_json=excluded.state_json,updated_at=excluded.updated_at").run(profileId,JSON.stringify(state),updatedAt);
        db.exec("COMMIT");return {state,updatedAt,conflict};
      } catch(error) {db.exec("ROLLBACK");throw error;}
    },
    importHistory(profileId: string, sourceId: string | null, sourceKey: string, local: StudyState, obmep: ProgressRecord, drafts: Record<string,string>) {
      db.exec("BEGIN IMMEDIATE");
      try {
        if(db.prepare("SELECT 1 FROM history_imports WHERE source_key=?").get(sourceKey)){db.exec("ROLLBACK");return false;}
        const readState=(id:string)=>{const r=db.prepare("SELECT state_json FROM study_state WHERE profile_id=?").get(id);return r?JSON.parse(String(r.state_json)):{};};
        const previous=sourceId?readState(sourceId):{};
        const state=mergeStudy(mergeStudy(previous,local),readState(profileId));
        db.prepare("INSERT INTO study_state(profile_id,state_json,updated_at) VALUES(?,?,?) ON CONFLICT(profile_id) DO UPDATE SET state_json=excluded.state_json,updated_at=excluded.updated_at").run(profileId,JSON.stringify(state),Date.now());
        if(sourceId && sourceId!==profileId) db.prepare(`INSERT OR IGNORE INTO attempts(id,profile_id,subject,quiz_id,question_id,topic,selected,correct,is_review,created_at)
          SELECT id || ':account-import', ?,subject,quiz_id,question_id,topic,selected,correct,is_review,created_at FROM attempts WHERE profile_id=?`).run(profileId,sourceId);
        const readObmep=(id:string)=>{const r=db.prepare("SELECT state_json FROM obmep_progress WHERE profile_id=?").get(id);return r?JSON.parse(String(r.state_json)):{};};
        const merged=mergeProgress(mergeProgress(sourceId?readObmep(sourceId):{},obmep),readObmep(profileId));
        db.prepare("INSERT INTO obmep_progress(profile_id,state_json,updated_at) VALUES(?,?,?) ON CONFLICT(profile_id) DO UPDATE SET state_json=excluded.state_json,updated_at=excluded.updated_at").run(profileId,JSON.stringify(merged),Date.now());
        for(const [key,value] of Object.entries(drafts))db.prepare("INSERT OR IGNORE INTO written_drafts(profile_id,task_id,answer,updated_at) VALUES(?,?,?,?)").run(profileId,key,value,Date.now());
        db.prepare("INSERT INTO history_imports(source_key,profile_id,imported_at) VALUES(?,?,?)").run(sourceKey,profileId,Date.now());
        db.exec("COMMIT");return true;
      } catch(error) {db.exec("ROLLBACK");throw error;}
    },
    mergeObmep(profileId: string, incoming: ProgressRecord) {
      db.exec("BEGIN IMMEDIATE");
      try {
        const row = db.prepare("SELECT state_json FROM obmep_progress WHERE profile_id = ?").get(profileId);
        const merged = mergeProgress(row ? JSON.parse(String(row.state_json)) : {}, incoming);
        db.prepare("INSERT INTO obmep_progress (profile_id, state_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(profile_id) DO UPDATE SET state_json = excluded.state_json, updated_at = excluded.updated_at")
          .run(profileId, JSON.stringify(merged), Date.now());
        db.exec("COMMIT");
      } catch (error) { db.exec("ROLLBACK"); throw error; }
    },
    redeemPair(codeHash: string, tokenHash: string, label: string) {
      db.exec("BEGIN IMMEDIATE");
      try {
        const timestamp = Date.now();
        const row = db.prepare("SELECT profile_id FROM pairing_codes WHERE code_hash = ? AND used_at IS NULL AND expires_at > ?").get(codeHash, timestamp);
        if (!row) { db.exec("ROLLBACK"); return false; }
        db.prepare("UPDATE pairing_codes SET used_at = ? WHERE code_hash = ?").run(timestamp, codeHash);
        db.prepare("INSERT INTO devices (token_hash, profile_id, label, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)")
          .run(tokenHash, row.profile_id, label, timestamp, timestamp);
        db.exec("COMMIT"); return true;
      } catch (error) { db.exec("ROLLBACK"); throw error; }
    },
    async batch(statements: Statement[]) {
      db.exec("BEGIN IMMEDIATE");
      try {
        const results = statements.map((s) => s.runSync());
        db.exec("COMMIT");
        return results;
      } catch (error) { db.exec("ROLLBACK"); throw error; }
    },
  };
}
