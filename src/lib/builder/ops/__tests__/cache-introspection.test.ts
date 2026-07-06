import { mkdir, mkdtemp, readFile, rm, stat, utimes, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  inspectCacheInventory,
  purgeCacheKeys,
  readLatestCachePurgeReport,
} from '@/lib/builder/ops/cache-introspection';

const EXPECTED_CACHE_STALE_MS = 24 * 60 * 60 * 1000;
const EXPECTED_CACHE_LARGE_KEY_BYTES = 1024 * 1024;

let runtimeRoot: string;
let cacheDir: string;
let opsDir: string;

beforeEach(async () => {
  runtimeRoot = await mkdtemp(path.join(os.tmpdir(), 'ops-cache-'));
  cacheDir = path.join(runtimeRoot, 'cache');
  opsDir = path.join(runtimeRoot, 'ops');
  await mkdir(cacheDir, { recursive: true });
  await mkdir(opsDir, { recursive: true });
  process.env.BUILDER_OPS_CACHE_PATH = cacheDir;
  process.env.BUILDER_OPS_DATA_PATH = opsDir;
});

afterEach(async () => {
  delete process.env.BUILDER_OPS_CACHE_PATH;
  delete process.env.BUILDER_OPS_DATA_PATH;
  await rm(runtimeRoot, { recursive: true, force: true });
});

function cacheFilePath(key: string): string {
  return path.join(cacheDir, key);
}

async function writeCacheFile(key: string, body: string | Buffer, writtenAt: Date): Promise<void> {
  const file = cacheFilePath(key);
  await writeFile(file, body);
  await utimes(file, writtenAt, writtenAt);
}

describe('cache inventory recovery', () => {
  it('classifies stale and large keys when cache files age out', async () => {
    const now = new Date('2026-06-21T12:00:00.000Z');
    const freshWrittenAt = new Date(now.getTime() - 60_000);
    const staleWrittenAt = new Date(now.getTime() - EXPECTED_CACHE_STALE_MS - 1_000);

    await writeCacheFile('fresh.json', '{}', freshWrittenAt);
    await writeCacheFile('large.json', Buffer.alloc(EXPECTED_CACHE_LARGE_KEY_BYTES + 1, 1), freshWrittenAt);
    await writeCacheFile('stale.json', '{}', staleWrittenAt);
    await writeCacheFile('ignored.txt', '{}', staleWrittenAt);

    const inventory = await inspectCacheInventory(now);

    expect(inventory.keys.map((item) => item.key)).toEqual(['fresh.json', 'large.json', 'stale.json']);
    expect(inventory.summary.totalKeys).toBe(3);
    expect(inventory.summary.staleKeys).toBe(1);
    expect(inventory.summary.largeKeys).toBe(1);
    expect(inventory.summary.oldestWrittenAt).toBe(staleWrittenAt.toISOString());
    expect(inventory.summary.newestWrittenAt).toBe(freshWrittenAt.toISOString());

    const stale = inventory.keys.find((item) => item.key === 'stale.json');
    const large = inventory.keys.find((item) => item.key === 'large.json');
    expect(stale?.stale).toBe(true);
    expect(stale?.large).toBe(false);
    expect(stale?.ageMs).toBe(EXPECTED_CACHE_STALE_MS + 1_000);
    expect(large?.stale).toBe(false);
    expect(large?.large).toBe(true);
  });

  it('purges stale keys only and persists a latest recovery report', async () => {
    const now = new Date('2026-06-21T13:00:00.000Z');
    const freshWrittenAt = new Date(now.getTime() - 60_000);
    const staleWrittenAt = new Date(now.getTime() - EXPECTED_CACHE_STALE_MS - 5_000);

    await writeCacheFile('fresh.json', '{}', freshWrittenAt);
    await writeCacheFile('large.json', Buffer.alloc(EXPECTED_CACHE_LARGE_KEY_BYTES + 1, 1), freshWrittenAt);
    await writeCacheFile('stale.json', '{"old":true}', staleWrittenAt);

    const report = await purgeCacheKeys({ mode: 'stale', now });

    expect(report.mode).toBe('stale');
    expect(report.clearedKeys).toEqual(['stale.json']);
    expect(report.failedKeys).toEqual([]);
    expect(report.totalBytesCleared).toBe(Buffer.byteLength('{"old":true}'));
    expect(report.before.totalKeys).toBe(3);
    expect(report.before.staleKeys).toBe(1);
    expect(report.after.totalKeys).toBe(2);
    expect(report.after.staleKeys).toBe(0);

    await expect(stat(cacheFilePath('stale.json'))).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(stat(cacheFilePath('fresh.json'))).resolves.toBeDefined();
    await expect(stat(cacheFilePath('large.json'))).resolves.toBeDefined();

    const latest = await readLatestCachePurgeReport();
    expect(latest?.id).toBe(report.id);
    expect(latest?.mode).toBe('stale');
    expect(JSON.parse(await readFile(path.join(opsDir, 'cache-purge-report.json'), 'utf8'))).toMatchObject({
      id: report.id,
      mode: 'stale',
      clearedKeys: ['stale.json'],
    });
  });
});
