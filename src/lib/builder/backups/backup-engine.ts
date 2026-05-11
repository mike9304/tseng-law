import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import type { BackupEntry, BackupManifest, BackupSummary } from './types';
import { BACKUP_SOURCES } from './registry';

const RUNTIME_ROOT = path.join(process.cwd(), 'runtime-data');
const BLOB_BACKUP_PREFIX = 'backups/';
const FILE_BACKUP_ROOT = path.join(process.cwd(), 'runtime-data', 'backups');
const RETENTION_DAYS = 30;

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

function makeBackupId(): string {
  return `bkp_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

async function readBlobJson(pathname: string): Promise<unknown | null> {
  try {
    const result = await get(pathname, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      const text = await new Response(result.stream).text();
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function readFileJson(absPath: string): Promise<unknown | null> {
  try {
    const text = await fs.readFile(absPath, 'utf8');
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

async function walkFile(prefix: string): Promise<BackupEntry[]> {
  // prefix is a blob-style path like 'builder-bookings/'; on file backend we
  // map it to runtime-data/<prefix-without-trailing-slash>.
  const baseSegment = prefix.replace(/\/$/, '');
  const startDir = path.join(RUNTIME_ROOT, baseSegment);

  const out: BackupEntry[] = [];

  async function walk(dir: string): Promise<void> {
    let entries: import('fs').Dirent[] = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
        continue;
      }
      if (!entry.name.endsWith('.json')) continue;
      const rel = path.relative(RUNTIME_ROOT, abs).split(path.sep).join('/');
      const body = await readFileJson(abs);
      if (body !== null) out.push({ key: rel, body });
    }
  }

  await walk(startDir);
  return out;
}

async function walkBlob(prefix: string): Promise<BackupEntry[]> {
  try {
    const result = await list({ prefix });
    const out: BackupEntry[] = [];
    for (const blob of result.blobs) {
      if (!blob.pathname.endsWith('.json')) continue;
      const body = await readBlobJson(blob.pathname);
      if (body !== null) out.push({ key: blob.pathname, body });
    }
    return out;
  } catch {
    return [];
  }
}

export async function createBackupSnapshot(options: { triggeredBy?: 'manual' | 'cron' } = {}): Promise<BackupSummary> {
  const triggeredBy = options.triggeredBy ?? 'manual';
  const mode = backend();
  const entries: BackupEntry[] = [];
  for (const source of BACKUP_SOURCES) {
    const collected = mode === 'blob' ? await walkBlob(source.prefix) : await walkFile(source.prefix);
    entries.push(...collected);
  }

  const manifest: BackupManifest = {
    backupId: makeBackupId(),
    createdAt: new Date().toISOString(),
    triggeredBy,
    prefixes: BACKUP_SOURCES.map((s) => s.prefix),
    entries,
    backend: mode,
  };
  const body = JSON.stringify(manifest);
  manifest.sizeBytes = Buffer.byteLength(body, 'utf8');

  if (mode === 'blob') {
    await put(`${BLOB_BACKUP_PREFIX}${manifest.backupId}.json`, JSON.stringify(manifest), {
      access: 'private',
      allowOverwrite: false,
      contentType: 'application/json',
    });
  } else {
    await fs.mkdir(FILE_BACKUP_ROOT, { recursive: true });
    await fs.writeFile(path.join(FILE_BACKUP_ROOT, `${manifest.backupId}.json`), JSON.stringify(manifest), 'utf8');
  }

  await pruneOldBackups();

  return {
    backupId: manifest.backupId,
    createdAt: manifest.createdAt,
    triggeredBy: manifest.triggeredBy,
    prefixCount: manifest.prefixes.length,
    entryCount: entries.length,
    sizeBytes: manifest.sizeBytes,
  };
}

export async function listBackups(): Promise<BackupSummary[]> {
  const mode = backend();
  const summaries: BackupSummary[] = [];
  if (mode === 'blob') {
    try {
      const result = await list({ prefix: BLOB_BACKUP_PREFIX });
      for (const blob of result.blobs) {
        if (!blob.pathname.endsWith('.json')) continue;
        const manifest = (await readBlobJson(blob.pathname)) as BackupManifest | null;
        if (!manifest) continue;
        summaries.push({
          backupId: manifest.backupId,
          createdAt: manifest.createdAt,
          triggeredBy: manifest.triggeredBy,
          prefixCount: manifest.prefixes.length,
          entryCount: manifest.entries.length,
          sizeBytes: manifest.sizeBytes,
        });
      }
    } catch {
      /* ignore */
    }
  } else {
    try {
      const files = await fs.readdir(FILE_BACKUP_ROOT).catch(() => []);
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const manifest = (await readFileJson(path.join(FILE_BACKUP_ROOT, file))) as BackupManifest | null;
        if (!manifest) continue;
        summaries.push({
          backupId: manifest.backupId,
          createdAt: manifest.createdAt,
          triggeredBy: manifest.triggeredBy,
          prefixCount: manifest.prefixes.length,
          entryCount: manifest.entries.length,
          sizeBytes: manifest.sizeBytes,
        });
      }
    } catch {
      /* ignore */
    }
  }
  return summaries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function loadBackupManifest(backupId: string): Promise<BackupManifest | null> {
  const mode = backend();
  if (mode === 'blob') {
    return (await readBlobJson(`${BLOB_BACKUP_PREFIX}${backupId}.json`)) as BackupManifest | null;
  }
  return (await readFileJson(path.join(FILE_BACKUP_ROOT, `${backupId}.json`))) as BackupManifest | null;
}

async function pruneOldBackups(): Promise<void> {
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const mode = backend();
  if (mode === 'blob') {
    try {
      const result = await list({ prefix: BLOB_BACKUP_PREFIX });
      for (const blob of result.blobs) {
        if (Date.parse(blob.uploadedAt as unknown as string) < cutoff) {
          // Vercel Blob delete is best-effort; skip if it fails.
          try {
            const { del } = await import('@vercel/blob');
            await del(blob.url);
          } catch {
            /* ignore */
          }
        }
      }
    } catch {
      /* ignore */
    }
  } else {
    try {
      const files = await fs.readdir(FILE_BACKUP_ROOT).catch(() => []);
      for (const file of files) {
        const stat = await fs.stat(path.join(FILE_BACKUP_ROOT, file)).catch(() => null);
        if (stat && stat.mtimeMs < cutoff) {
          await fs.unlink(path.join(FILE_BACKUP_ROOT, file)).catch(() => undefined);
        }
      }
    } catch {
      /* ignore */
    }
  }
}
