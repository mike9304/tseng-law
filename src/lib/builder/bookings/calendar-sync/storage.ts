import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import type { CalendarConnection, CalendarProvider } from './types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'calendar-sync');
const BLOB_PREFIX = 'calendar-sync/';

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

export function makeConnectionId(staffId: string, provider: CalendarProvider): string {
  return `cs_${provider}_${staffId.replace(/[^a-z0-9_-]/gi, '_')}`;
}

function blobPath(id: string): string {
  return `${BLOB_PREFIX}${id}.json`;
}
function filePath(id: string): string {
  return path.join(ROOT, `${id}.json`);
}

export async function saveConnection(connection: CalendarConnection): Promise<void> {
  const body = JSON.stringify({ ...connection, updatedAt: new Date().toISOString() }, null, 2);
  if (backend() === 'blob') {
    await put(blobPath(connection.connectionId), body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(ROOT, { recursive: true });
  await fs.writeFile(filePath(connection.connectionId), body, 'utf8');
}

export async function getConnection(connectionId: string): Promise<CalendarConnection | null> {
  try {
    if (backend() === 'blob') {
      const result = await get(blobPath(connectionId), { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as CalendarConnection;
      }
      return null;
    }
    const raw = await fs.readFile(filePath(connectionId), 'utf8');
    return JSON.parse(raw) as CalendarConnection;
  } catch {
    return null;
  }
}

export async function listConnections(): Promise<CalendarConnection[]> {
  try {
    if (backend() === 'blob') {
      const result = await list({ prefix: BLOB_PREFIX });
      const out: CalendarConnection[] = [];
      for (const blob of result.blobs) {
        try {
          const item = await get(blob.pathname, { access: 'private', useCache: false });
          if (item?.statusCode === 200 && item.stream) {
            out.push(JSON.parse(await new Response(item.stream).text()) as CalendarConnection);
          }
        } catch {
          /* skip */
        }
      }
      return out;
    }
    const files = await fs.readdir(ROOT).catch(() => []);
    const out: CalendarConnection[] = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const raw = await fs.readFile(path.join(ROOT, file), 'utf8');
        out.push(JSON.parse(raw) as CalendarConnection);
      } catch {
        /* skip */
      }
    }
    return out;
  } catch {
    return [];
  }
}

export function makeOauthState(): string {
  return crypto.randomBytes(16).toString('hex');
}
