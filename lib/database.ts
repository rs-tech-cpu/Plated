import * as SQLite from 'expo-sqlite';
import { PlatedEntry, NewEntryInput } from './types';

let _db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync('plated.db');
    await _db.execAsync(`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        image_uri TEXT,
        latitude REAL,
        longitude REAL,
        location_name TEXT,
        is_homemade INTEGER DEFAULT 0,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }
  return _db;
}

type Row = {
  id: number;
  title: string;
  description: string;
  image_uri: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  is_homemade: number;
  date: string;
  created_at: string;
};

function rowToEntry(row: Row): PlatedEntry {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    imageUri: row.image_uri,
    latitude: row.latitude,
    longitude: row.longitude,
    locationName: row.location_name,
    isHomemade: row.is_homemade === 1,
    date: row.date,
    createdAt: row.created_at,
  };
}

export async function getAllEntries(): Promise<PlatedEntry[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>('SELECT * FROM entries ORDER BY date DESC, created_at DESC');
  return rows.map(rowToEntry);
}

export async function getEntryById(id: number): Promise<PlatedEntry | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Row>('SELECT * FROM entries WHERE id = ?', id);
  return row ? rowToEntry(row) : null;
}

export async function createEntry(input: NewEntryInput): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO entries (title, description, image_uri, latitude, longitude, location_name, is_homemade, date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    input.title,
    input.description,
    input.imageUri,
    input.latitude,
    input.longitude,
    input.locationName,
    input.isHomemade ? 1 : 0,
    input.date,
    new Date().toISOString(),
  );
  return result.lastInsertRowId;
}

export async function updateEntry(id: number, input: NewEntryInput): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE entries SET title = ?, description = ?, image_uri = ?, latitude = ?, longitude = ?,
     location_name = ?, is_homemade = ?, date = ? WHERE id = ?`,
    input.title,
    input.description,
    input.imageUri,
    input.latitude,
    input.longitude,
    input.locationName,
    input.isHomemade ? 1 : 0,
    input.date,
    id,
  );
}

export async function deleteEntry(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM entries WHERE id = ?', id);
}
