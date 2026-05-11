import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, put } from '@vercel/blob';
import type { CapturedError } from './types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'errors');
const BLOB_PATH = 'errors/log.json';
const CAP = 1000;

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

export function makeErrorId(): string {
  return `err_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

export async function appendErrorLog(entry: CapturedError): Promise<void> {
  const existing = await listErrorLog();
  const next = [...existing, entry].slice(-CAP);
  const body = JSON.stringify(next);
  if (backend() === 'blob') {
    await put(BLOB_PATH, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(ROOT, { recursive: true });
  await fs.writeFile(path.join(ROOT, 'log.json'), body, 'utf8');
}

export async function listErrorLog(): Promise<CapturedError[]> {
  try {
    if (backend() === 'blob') {
      const result = await get(BLOB_PATH, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as CapturedError[];
      }
      return [];
    }
    const raw = await fs.readFile(path.join(ROOT, 'log.json'), 'utf8');
    return JSON.parse(raw) as CapturedError[];
  } catch {
    return [];
  }
}
