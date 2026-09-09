// Run locally on the persistent volume, with services stopped during the cutover.
// Input: { tables: { profiles: [...], devices: [...], ... } }.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
const [source, destination] = process.argv.slice(2);
if (!source || !destination) throw new Error('Usage: node scripts/import-sites-db.mjs PRIVATE_EXPORT.json /data/bela.sqlite');
const snapshot = JSON.parse(readFileSync(source,'utf8'));
const order = ['profiles','devices','study_state','attempts','parent_settings','parent_sessions','pairing_codes'];
for (const table of order) if (!Array.isArray(snapshot.tables?.[table])) throw new Error('Missing table: '+table);
const db = new DatabaseSync(destination);
db.exec('PRAGMA foreign_keys=ON; BEGIN IMMEDIATE');
try {
  const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='profiles'").get();
  if (exists && Number(db.prepare('SELECT COUNT(*) AS n FROM profiles').get().n)>0) throw new Error('Destination is not empty; refusing to overwrite profiles');
  db.exec(readFileSync(new URL('../drizzle/0000_wise_toad.sql',import.meta.url),'utf8').replaceAll('CREATE TABLE ','CREATE TABLE IF NOT EXISTS ').replaceAll('CREATE INDEX ','CREATE INDEX IF NOT EXISTS '));
  for (const table of order) {
    const columns = db.prepare(`PRAGMA table_info("${table}")`).all().map(c=>c.name);
    const statement = db.prepare(`INSERT INTO "${table}" (${columns.map(c=>'"'+c+'"').join(',')}) VALUES (${columns.map(()=>'?').join(',')})`);
    for (const row of snapshot.tables[table]) {
      if (columns.some(c=>!(c in row)) || Object.keys(row).some(c=>!columns.includes(c))) throw new Error('Unexpected columns in '+table);
      statement.run(...columns.map(c=>row[c]));
    }
    console.log(table+': '+snapshot.tables[table].length+' rows');
  }
  if (db.prepare('PRAGMA foreign_key_check').all().length) throw new Error('Foreign key validation failed');
  db.exec('COMMIT');
} catch(error) { db.exec('ROLLBACK'); throw error; }
finally { db.close(); }
