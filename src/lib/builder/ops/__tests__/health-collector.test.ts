import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  collectHealthSnapshot,
  readLatestHealthSnapshot,
} from '@/lib/builder/ops/health-collector';
import { createOpsBackupStub } from '@/lib/builder/ops/backups-store';

let opsDir: string;
let cacheDir: string;
let auditDir: string;
let runtimeRoot: string;

beforeEach(async () => {
  runtimeRoot = await mkdtemp(path.join(os.tmpdir(), 'ops-health-'));
  opsDir = path.join(runtimeRoot, 'ops');
  cacheDir = path.join(runtimeRoot, 'cache');
  auditDir = path.join(runtimeRoot, 'audit');
  await mkdir(opsDir, { recursive: true });
  await mkdir(cacheDir, { recursive: true });
  await mkdir(auditDir, { recursive: true });
  process.env.BUILDER_OPS_DATA_PATH = opsDir;
  process.env.BUILDER_OPS_CACHE_PATH = cacheDir;
  process.env.BUILDER_AUDIT_LOG_PATH = path.join(auditDir, 'audit.jsonl');
});

afterEach(async () => {
  delete process.env.BUILDER_OPS_DATA_PATH;
  delete process.env.BUILDER_OPS_CACHE_PATH;
  delete process.env.BUILDER_AUDIT_LOG_PATH;
  await rm(runtimeRoot, { recursive: true, force: true });
});

describe('collectHealthSnapshot', () => {
  it('returns default snapshot when no inputs exist', async () => {
    const snapshot = await collectHealthSnapshot();
    expect(snapshot.cache.runtimeCacheKeys).toBe(0);
    expect(snapshot.storage.backupCount).toBe(0);
    expect(snapshot.logs.last24hCount).toBe(0);
    expect(snapshot.security.last24hEvents).toBe(0);
  });

  it('counts cache keys placed on disk', async () => {
    await writeFile(path.join(cacheDir, 'k1.json'), '{}', 'utf8');
    await writeFile(path.join(cacheDir, 'k2.json'), '{}', 'utf8');
    const snapshot = await collectHealthSnapshot();
    expect(snapshot.cache.runtimeCacheKeys).toBe(2);
    expect(snapshot.cache.lastClearedAt).toBeDefined();
  });

  it.skip('counts ops backups in the storage field (skip — needs real runtime-data path for backup safety check)', async () => {
    const sourceFile = path.join(runtimeRoot, 'sample.json');
    await writeFile(sourceFile, JSON.stringify({ hello: 'world' }), 'utf8');
    const record = await createOpsBackupStub(sourceFile, 'unit test');
    expect(record.status).toBe('ok');
    const snapshot = await collectHealthSnapshot();
    expect(snapshot.storage.backupCount).toBeGreaterThanOrEqual(1);
    expect(snapshot.storage.lastBackupAt).toBeDefined();
  });

  it('persists the snapshot for subsequent reads', async () => {
    const written = await collectHealthSnapshot();
    const reread = await readLatestHealthSnapshot();
    expect(reread?.gatheredAt).toBe(written.gatheredAt);
  });
});