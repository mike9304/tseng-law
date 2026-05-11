import { promises as fs } from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';
import type { MigrationJournal } from './types';
import { JOURNAL_VERSION } from './types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'migrations');
const BLOB_PATH = 'migrations/journal.json';

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

const EMPTY: MigrationJournal = { version: JOURNAL_VERSION, applied: [] };

export async function loadMigrationJournal(): Promise<MigrationJournal> {
  try {
    if (backend() === 'blob') {
      const result = await get(BLOB_PATH, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as MigrationJournal;
      }
      return EMPTY;
    }
    const raw = await fs.readFile(path.join(ROOT, 'journal.json'), 'utf8');
    return JSON.parse(raw) as MigrationJournal;
  } catch {
    return EMPTY;
  }
}

export async function saveMigrationJournal(journal: MigrationJournal): Promise<void> {
  const body = JSON.stringify(journal, null, 2);
  if (backend() === 'blob') {
    await put(BLOB_PATH, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(ROOT, { recursive: true });
  await fs.writeFile(path.join(ROOT, 'journal.json'), body, 'utf8');
}
