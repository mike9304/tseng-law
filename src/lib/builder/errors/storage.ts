import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import type { CapturedError } from './types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'errors');
const BLOB_PREFIX = 'errors/entries/';
const SOFT_CAP = 1000;

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

export function makeErrorId(): string {
  return `err_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

/**
 * Per-error file write — appending to a single JSON array under concurrent
 * traffic was losing entries. SOFT_CAP enforcement now happens at list time.
 */
export async function appendErrorLog(entry: CapturedError): Promise<void> {
  const dateKey = entry.capturedAt.slice(0, 10);
  const id = `${dateKey}/${entry.errorId}`;
  const body = JSON.stringify(entry);
  if (backend() === 'blob') {
    await put(`${BLOB_PREFIX}${id}.json`, body, {
      access: 'private',
      allowOverwrite: false,
      contentType: 'application/json',
    });
    return;
  }
  const target = path.join(ROOT, `${id}.json`);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body, 'utf8');
}

export async function listErrorLog(): Promise<CapturedError[]> {
  try {
    const entries = backend() === 'blob' ? await listBlob() : await listFile();
    entries.sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
    return entries.slice(-SOFT_CAP);
  } catch {
    return [];
  }
}

async function listBlob(): Promise<CapturedError[]> {
  const result = await list({ prefix: BLOB_PREFIX });
  const out: CapturedError[] = [];
  for (const blob of result.blobs) {
    try {
      const item = await get(blob.pathname, { access: 'private', useCache: false });
      if (item?.statusCode === 200 && item.stream) {
        out.push(JSON.parse(await new Response(item.stream).text()) as CapturedError);
      }
    } catch {
      /* skip */
    }
  }
  return out;
}

async function listFile(): Promise<CapturedError[]> {
  const out: CapturedError[] = [];
  await walkDir(ROOT, out);
  return out;
}

async function walkDir(dir: string, out: CapturedError[]): Promise<void> {
  let entries: import('fs').Dirent[] = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(abs, out);
      continue;
    }
    if (!entry.name.endsWith('.json')) continue;
    try {
      const raw = await fs.readFile(abs, 'utf8');
      out.push(JSON.parse(raw) as CapturedError);
    } catch {
      /* skip */
    }
  }
}
