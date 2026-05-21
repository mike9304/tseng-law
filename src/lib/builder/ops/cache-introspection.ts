/**
 * Opaque key listing for the optional runtime cache.
 *
 * The "runtime cache" is whatever JSON the platform has decided to drop
 * into `runtime-data/cache/`. We treat each *.json file as one cache key
 * and expose only safe metadata (name, size, mtime). Bodies are never
 * exposed by this module.
 */
import { readdir, stat, unlink } from 'fs/promises';
import path from 'path';

import { cacheRoot } from './paths';

export interface CacheKeyMeta {
  key: string;
  sizeBytes: number;
  lastWrittenAt?: string;
}

function isSafeKey(key: string): boolean {
  if (!key || key.includes('..') || key.includes('/') || key.includes('\\')) return false;
  if (!key.endsWith('.json')) return false;
  return /^[a-zA-Z0-9_.\-]+\.json$/.test(key);
}

export async function listCacheKeys(): Promise<CacheKeyMeta[]> {
  const root = cacheRoot();
  let entries: import('fs').Dirent[] = [];
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: CacheKeyMeta[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    if (!isSafeKey(entry.name)) continue;
    try {
      const st = await stat(path.join(root, entry.name));
      out.push({
        key: entry.name,
        sizeBytes: st.size,
        lastWrittenAt: new Date(st.mtimeMs).toISOString(),
      });
    } catch {
      /* skip unreadable */
    }
  }
  return out.sort((a, b) => a.key.localeCompare(b.key));
}

export async function clearCacheKey(key: string): Promise<boolean> {
  if (!isSafeKey(key)) return false;
  const full = path.join(cacheRoot(), key);
  try {
    await unlink(full);
    return true;
  } catch {
    return false;
  }
}

export async function clearAllCacheKeys(): Promise<number> {
  const keys = await listCacheKeys();
  let cleared = 0;
  for (const meta of keys) {
    if (await clearCacheKey(meta.key)) cleared += 1;
  }
  return cleared;
}