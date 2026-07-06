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
let errorsDir: string;
let runtimeRoot: string;
const DEPLOY_ENV_KEYS = [
  'VERCEL_DEPLOYMENT_CREATED_AT',
  'NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF_TIME',
  'VERCEL_ENV',
  'VERCEL_URL',
  'VERCEL_GIT_COMMIT_REF',
  'VERCEL_GIT_COMMIT_SHA',
] as const;
type DeployEnvKey = typeof DEPLOY_ENV_KEYS[number];
let previousDeployEnv: Map<DeployEnvKey, string | undefined>;

beforeEach(async () => {
  previousDeployEnv = new Map(DEPLOY_ENV_KEYS.map((key) => [key, process.env[key]]));
  DEPLOY_ENV_KEYS.forEach((key) => {
    delete process.env[key];
  });
  runtimeRoot = await mkdtemp(path.join(os.tmpdir(), 'ops-health-'));
  opsDir = path.join(runtimeRoot, 'ops');
  cacheDir = path.join(runtimeRoot, 'cache');
  auditDir = path.join(runtimeRoot, 'audit');
  errorsDir = path.join(runtimeRoot, 'errors');
  await mkdir(opsDir, { recursive: true });
  await mkdir(cacheDir, { recursive: true });
  await mkdir(auditDir, { recursive: true });
  await mkdir(errorsDir, { recursive: true });
  process.env.BUILDER_OPS_DATA_PATH = opsDir;
  process.env.BUILDER_OPS_CACHE_PATH = cacheDir;
  process.env.BUILDER_AUDIT_LOG_PATH = path.join(auditDir, 'audit.jsonl');
  // 에러 로그도 격리 — 미설정 시 전역 runtime-data/errors 를 세어 last24hCount 오염
  process.env.BUILDER_ERROR_LOG_PATH = errorsDir;
});

afterEach(async () => {
  previousDeployEnv.forEach((value, key) => {
    if (value === undefined) {
      delete process.env[key];
      return;
    }
    process.env[key] = value;
  });
  delete process.env.BUILDER_OPS_DATA_PATH;
  delete process.env.BUILDER_OPS_CACHE_PATH;
  delete process.env.BUILDER_AUDIT_LOG_PATH;
  delete process.env.BUILDER_ERROR_LOG_PATH;
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

  it('projects Vercel deployment identity into deploy health', async () => {
    process.env.VERCEL_DEPLOYMENT_CREATED_AT = '2026-06-20T22:00:00.000Z';
    process.env.VERCEL_ENV = 'production';
    process.env.VERCEL_URL = 'tseng-law.com';
    process.env.VERCEL_GIT_COMMIT_REF = 'main';
    process.env.VERCEL_GIT_COMMIT_SHA = 'abcdef1234567890';

    const snapshot = await collectHealthSnapshot(new Date('2026-06-20T22:30:00.000Z'));

    expect(snapshot.deploys).toMatchObject({
      status: 'ok',
      source: 'vercel',
      lastDeployAt: '2026-06-20T22:00:00.000Z',
      environment: 'production',
      url: 'https://tseng-law.com',
      gitRef: 'main',
      gitCommitSha: 'abcdef1234567890',
    });
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
