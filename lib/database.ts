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
