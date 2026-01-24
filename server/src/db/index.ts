import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { drizzle } from 'drizzle-orm/sql-js';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';
import * as schema from './schema.js';

const databasePath = resolve(process.env.DATABASE_URL || './data/tora.db');

// Ensure data directory exists
await mkdir(dirname(databasePath), { recursive: true });

// Initialize sql.js
const SQL = await initSqlJs();

let sqlite: SqlJsDatabase;

// Load existing database or create new one
if (existsSync(databasePath)) {
  const buffer = await readFile(databasePath);
  sqlite = new SQL.Database(buffer);
  console.log('📂 Loaded existing database from', databasePath);
} else {
  sqlite = new SQL.Database();
  console.log('🆕 Created new database');
}

// Enable foreign keys
sqlite.run('PRAGMA foreign_keys = ON');

// Create tables if they don't exist
const createTablesSQL = `
  CREATE TABLE IF NOT EXISTS curriculums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT,
    platform TEXT,
    platform_url TEXT,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'planned',
    start_date INTEGER,
    end_date INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    curriculum_id INTEGER NOT NULL REFERENCES curriculums(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'other',
    status TEXT NOT NULL DEFAULT 'not_started',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`;

sqlite.run(createTablesSQL);

// Migrate existing tables to add date columns if they don't exist
try {
  // Check if start_date column exists
  const tableInfo = sqlite.exec("PRAGMA table_info(curriculums)");
  if (tableInfo.length > 0 && tableInfo[0].values) {
    const columns = tableInfo[0].values;
    const columnNames = columns.map((col: any[]) => col[1] as string);
    
    if (!columnNames.includes('start_date')) {
      sqlite.run('ALTER TABLE curriculums ADD COLUMN start_date INTEGER');
      console.log('✅ Added start_date column to curriculums table');
    }
    
    if (!columnNames.includes('end_date')) {
      sqlite.run('ALTER TABLE curriculums ADD COLUMN end_date INTEGER');
      console.log('✅ Added end_date column to curriculums table');
    }
  }
} catch (error) {
  // Table might not exist yet, or columns already exist, which is fine
  console.log('Migration check completed');
}

// Function to persist database to disk
export async function saveDatabase(): Promise<void> {
  try {
    const data = sqlite.export();
    await writeFile(databasePath, data);
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

// Auto-save every 5 seconds if there were changes
let saveScheduled = false;
export function scheduleSave(): void {
  if (!saveScheduled) {
    saveScheduled = true;
    setTimeout(async () => {
      await saveDatabase();
      saveScheduled = false;
    }, 5000);
  }
}

// Save on process exit
process.on('exit', () => {
  const data = sqlite.export();
  writeFileSync(databasePath, data);
  console.log('💾 Database saved on exit');
});

process.on('SIGINT', async () => {
  await saveDatabase();
  console.log('💾 Database saved on SIGINT');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await saveDatabase();
  console.log('💾 Database saved on SIGTERM');
  process.exit(0);
});

export const db = drizzle(sqlite, { schema });
export { schema };
