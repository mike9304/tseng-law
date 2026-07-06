import type { Dirent } from 'fs';
import { mkdir, readFile, readdir, stat, unlink, writeFile } from 'fs/promises';
import crypto from 'node:crypto';
import path from 'path';

import { cacheRoot, opsCachePurgeReportFile, opsRoot } from './paths';
import {
  CACHE_LARGE_KEY_BYTES,
  CACHE_STALE_MS,
  isCachePurgeReportPayloadError,
  parseCachePurgeReportPayload,
  type CacheInventory,
  type CacheInventorySummary,
  type CacheKeyMeta,
  type CachePurgeMode,
  type CachePurgeReport,
} from './cache-model';

export {
  CACHE_LARGE_KEY_BYTES,
  CACHE_STALE_MS,
  type CacheInventory,
  type CacheInventorySummary,
  type CacheKeyMeta,
  type CachePurgeMode,
  type CachePurgeReport,
} from './cache-model';

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function isSafeKey(key: string): boolean {
  if (!key || key.includes('..') || key.includes('/') || key.includes('\\')) return false;
  if (!key.endsWith('.json')) return false;
  return /^[a-zA-Z0-9_.\-]+\.json$/.test(key);
}

function summarizeCacheKeys(keys: readonly CacheKeyMeta[]): CacheInventorySummary {
  let totalBytes = 0;
  let staleKeys = 0;
  let largeKeys = 0;
  let oldestMs: number | null = null;
  let newestMs: number | null = null;

  for (const key of keys) {
    totalBytes += key.sizeBytes;
    if (key.stale) staleKeys += 1;
    if (key.large) largeKeys += 1;
    if (!key.lastWrittenAt) continue;
    const writtenMs = Date.parse(key.lastWrittenAt);
    if (!Number.isFinite(writtenMs)) continue;
    oldestMs = oldestMs === null ? writtenMs : Math.min(oldestMs, writtenMs);
    newestMs = newestMs === null ? writtenMs : Math.max(newestMs, writtenMs);
  }

  return {
    totalKeys: keys.length,
    totalBytes,
    staleKeys,
    largeKeys,
    ...(oldestMs === null ? {} : { oldestWrittenAt: new Date(oldestMs).toISOString() }),
    ...(newestMs === null ? {} : { newestWrittenAt: new Date(newestMs).toISOString() }),
  };
}

function makeCachePurgeReportId(now: Date): string {
  const stamp = now.toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  return `opscache_${stamp}_${crypto.randomBytes(4).toString('hex')}`;
}

async function readCacheDirEntries(root: string): Promise<readonly Dirent[]> {
  try {
    return await readdir(root, { withFileTypes: true });
  } catch (error) {
    if (isMissingFileError(error)) return [];
    throw error;
  }
}

async function persistCachePurgeReport(report: CachePurgeReport): Promise<CachePurgeReport> {
  await mkdir(opsRoot(), { recursive: true });
  await writeFile(opsCachePurgeReportFile(), JSON.stringify(report), 'utf8');
  return report;
}

export async function inspectCacheInventory(now: Date = new Date()): Promise<CacheInventory> {
  const root = cacheRoot();
  const entries = await readCacheDirEntries(root);
  const out: CacheKeyMeta[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    if (!isSafeKey(entry.name)) continue;
    try {
      const st = await stat(path.join(root, entry.name));
      const ageMs = Math.max(0, Math.round(now.getTime() - st.mtimeMs));
      out.push({
        key: entry.name,
        sizeBytes: st.size,
        lastWrittenAt: new Date(st.mtimeMs).toISOString(),
        ageMs,
        stale: ageMs > CACHE_STALE_MS,
        large: st.size > CACHE_LARGE_KEY_BYTES,
      });
    } catch (error) {
      if (!isMissingFileError(error)) throw error;
    }
  }
  const keys = out.sort((a, b) => a.key.localeCompare(b.key));
  return {
    keys,
    summary: summarizeCacheKeys(keys),
  };
}

export async function listCacheKeys(): Promise<CacheKeyMeta[]> {
  const inventory = await inspectCacheInventory();
  return [...inventory.keys];
}

export async function clearCacheKey(key: string): Promise<boolean> {
  if (!isSafeKey(key)) return false;
  const full = path.join(cacheRoot(), key);
  try {
    await unlink(full);
    return true;
  } catch (error) {
    if (isMissingFileError(error)) return false;
    throw error;
  }
}

export async function purgeCacheKeys(options: {
  readonly mode: CachePurgeMode;
  readonly now?: Date;
}): Promise<CachePurgeReport> {
  const now = options.now ?? new Date();
  const before = await inspectCacheInventory(now);
  const selected = options.mode === 'all'
    ? before.keys
    : before.keys.filter((key) => key.stale);
  const clearedKeys: string[] = [];
  const failedKeys: string[] = [];
  let totalBytesCleared = 0;

  for (const meta of selected) {
    try {
      await unlink(path.join(cacheRoot(), meta.key));
      clearedKeys.push(meta.key);
      totalBytesCleared += meta.sizeBytes;
    } catch (error) {
      if (error instanceof Error) {
        failedKeys.push(meta.key);
        continue;
      }
      throw error;
    }
  }

  const after = await inspectCacheInventory(now);
  return persistCachePurgeReport({
    id: makeCachePurgeReportId(now),
    purgedAt: now.toISOString(),
    mode: options.mode,
    clearedKeys,
    failedKeys,
    totalBytesCleared,
    before: before.summary,
    after: after.summary,
  });
}

export async function readLatestCachePurgeReport(): Promise<CachePurgeReport | null> {
  try {
    const text = await readFile(opsCachePurgeReportFile(), 'utf8');
    const parsed: unknown = JSON.parse(text);
    return parseCachePurgeReportPayload(parsed);
  } catch (error) {
    if (
      isMissingFileError(error)
      || error instanceof SyntaxError
      || isCachePurgeReportPayloadError(error)
    ) {
      return null;
    }
    throw error;
  }
}

export async function clearAllCacheKeys(): Promise<number> {
  const report = await purgeCacheKeys({ mode: 'all' });
  return report.clearedKeys.length;
}
