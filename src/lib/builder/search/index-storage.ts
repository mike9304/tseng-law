import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import type { SearchIndex, SearchQueryLog } from './types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'search');
const BLOB_PREFIX = 'search/';
const QUERIES_PREFIX = 'search/queries/';
const QUERIES_DIR = path.join(ROOT, 'queries');
const SOFT_CAP = 5000;

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

const INDEX_NAME = 'site-index.json';

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

/**
 * Per-query file write — single queries.json was lossy under concurrent
 * traffic. SOFT_CAP enforcement happens at list time via sort + slice.
 */
export async function appendQueryLog(entry: SearchQueryLog): Promise<void> {
  const dateKey = entry.at.slice(0, 10);
  const id = `${dateKey}/${entry.at.replace(/[^0-9]/g, '')}_${crypto.randomBytes(4).toString('hex')}`;
  const body = JSON.stringify(entry);
  if (backend() === 'blob') {
    await put(`${QUERIES_PREFIX}${id}.json`, body, {
      access: 'private',
      allowOverwrite: false,
      contentType: 'application/json',
    });
    return;
  }
  const target = path.join(QUERIES_DIR, `${id}.json`);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body, 'utf8');
}

export async function listQueryLogs(): Promise<SearchQueryLog[]> {
  try {
    const entries = backend() === 'blob' ? await listQueriesBlob() : await listQueriesFile();
    entries.sort((a, b) => a.at.localeCompare(b.at));
    return entries.slice(-SOFT_CAP);
  } catch {
    return [];
  }
}

async function listQueriesBlob(): Promise<SearchQueryLog[]> {
  const result = await list({ prefix: QUERIES_PREFIX });
  const out: SearchQueryLog[] = [];
  for (const blob of result.blobs) {
    try {
      const item = await get(blob.pathname, { access: 'private', useCache: false });
      if (item?.statusCode === 200 && item.stream) {
        out.push(JSON.parse(await new Response(item.stream).text()) as SearchQueryLog);
      }
    } catch {
      /* skip */
    }
  }
  return out;
}

async function listQueriesFile(): Promise<SearchQueryLog[]> {
  const out: SearchQueryLog[] = [];
  await walkQueries(QUERIES_DIR, out);
  return out;
}

async function walkQueries(dir: string, out: SearchQueryLog[]): Promise<void> {
  let entries: import('fs').Dirent[] = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkQueries(abs, out);
      continue;
    }
    if (!entry.name.endsWith('.json')) continue;
    try {
      const raw = await fs.readFile(abs, 'utf8');
      out.push(JSON.parse(raw) as SearchQueryLog);
    } catch {
      /* skip */
    }
  }
}
