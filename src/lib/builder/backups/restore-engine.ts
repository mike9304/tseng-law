import { promises as fs } from 'fs';
import path from 'path';
import { put } from '@vercel/blob';
import { loadBackupManifest } from './backup-engine';

const RUNTIME_ROOT = path.join(process.cwd(), 'runtime-data');

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

export interface RestoreResult {
  ok: boolean;
  restored: number;
  failed: number;
  errors: Array<{ key: string; reason: string }>;
}

/**
 * PR #18 — Restore a backup manifest.
 *
 * Writes every entry back to its original key. This is intentionally
 * "overwrite by default" — restores are admin-triggered and the caller
 * is expected to have decided that current state should be replaced.
 */
export async function restoreBackup(backupId: string, options: { dryRun?: boolean } = {}): Promise<RestoreResult> {
  const manifest = await loadBackupManifest(backupId);
  if (!manifest) {
    return { ok: false, restored: 0, failed: 0, errors: [{ key: '*', reason: 'backup not found' }] };
  }

  const result: RestoreResult = { ok: true, restored: 0, failed: 0, errors: [] };
  if (options.dryRun) {
    return { ...result, restored: manifest.entries.length };
  }

  const mode = backend();
  for (const entry of manifest.entries) {
    try {
      const body = typeof entry.body === 'string' ? entry.body : JSON.stringify(entry.body);
      if (mode === 'blob') {
        await put(entry.key, body, {
          access: 'private',
          allowOverwrite: true,
          contentType: 'application/json',
        });
      } else {
        const target = path.join(RUNTIME_ROOT, entry.key);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, body, 'utf8');
      }
      result.restored += 1;
    } catch (err) {
      result.failed += 1;
      result.errors.push({ key: entry.key, reason: err instanceof Error ? err.message : String(err) });
    }
  }
  result.ok = result.failed === 0;
  return result;
}
