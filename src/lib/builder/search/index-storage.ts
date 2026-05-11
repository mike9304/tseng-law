import { promises as fs } from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';
import type { SearchIndex, SearchQueryLog } from './types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'search');
const BLOB_PREFIX = 'search/';

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

const INDEX_NAME = 'site-index.json';
const QUERIES_NAME = 'queries.json';

export async function saveSearchIndex(index: SearchIndex): Promise<void> {
  const body = JSON.stringify(index);
  if (backend() === 'blob') {
    await put(`${BLOB_PREFIX}${INDEX_NAME}`, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(ROOT, { recursive: true });
  await fs.writeFile(path.join(ROOT, INDEX_NAME), body, 'utf8');
}

export async function loadSearchIndex(): Promise<SearchIndex | null> {
  try {
    if (backend() === 'blob') {
      const result = await get(`${BLOB_PREFIX}${INDEX_NAME}`, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as SearchIndex;
      }
      return null;
    }
    const raw = await fs.readFile(path.join(ROOT, INDEX_NAME), 'utf8');
    return JSON.parse(raw) as SearchIndex;
  } catch {
    return null;
  }
}

export async function appendQueryLog(entry: SearchQueryLog): Promise<void> {
  const existing = await listQueryLogs();
  const next = [...existing, entry].slice(-5000); // cap
  const body = JSON.stringify(next);
  if (backend() === 'blob') {
    await put(`${BLOB_PREFIX}${QUERIES_NAME}`, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(ROOT, { recursive: true });
  await fs.writeFile(path.join(ROOT, QUERIES_NAME), body, 'utf8');
}

export async function listQueryLogs(): Promise<SearchQueryLog[]> {
  try {
    if (backend() === 'blob') {
      const result = await get(`${BLOB_PREFIX}${QUERIES_NAME}`, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as SearchQueryLog[];
      }
      return [];
    }
    const raw = await fs.readFile(path.join(ROOT, QUERIES_NAME), 'utf8');
    return JSON.parse(raw) as SearchQueryLog[];
  } catch {
    return [];
  }
}
