import { mkdir, mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  _setOpsBackupRuntimeRootForTests,
  listOpsBackups,
} from '@/lib/builder/ops/backups-store';
import {
  readLatestOpsBackupRestoreDrill,
  runOpsBackupRestoreDrill,
} from '@/lib/builder/ops/backup-restore-drill';

let runtimeRoot: string;
let sourceRoot: string;

beforeEach(async () => {
  runtimeRoot = await mkdtemp(path.join(os.tmpdir(), 'ops-restore-drill-'));
  sourceRoot = path.join(runtimeRoot, 'runtime-data');
  await mkdir(sourceRoot, { recursive: true });
  process.env.BUILDER_OPS_DATA_PATH = path.join(sourceRoot, 'ops');
  _setOpsBackupRuntimeRootForTests(sourceRoot);
});

afterEach(async () => {
  _setOpsBackupRuntimeRootForTests(null);
  delete process.env.BUILDER_OPS_DATA_PATH;
  await rm(runtimeRoot, { recursive: true, force: true });
});

describe('ops backup restore drill', () => {
  it('runs a non-destructive backup restore drill and persists the latest report', async () => {
    const report = await runOpsBackupRestoreDrill(new Date('2026-06-20T23:30:00.000Z'));

    expect(report.status, report.error ?? 'restore drill failed').toBe('ok');
    expect(report.verified).toBe(true);
    expect(report.backupDeleted).toBe(true);
    expect(report.checksumSha256).toHaveLength(64);
    expect(report.durationMs).toBeGreaterThanOrEqual(0);
    expect(report.error).toBeUndefined();
    expect(path.relative(sourceRoot, report.sourcePath)).not.toMatch(/^\.\.(?:\/|$)/);
    expect(await listOpsBackups()).toHaveLength(0);

    const latest = await readLatestOpsBackupRestoreDrill();
    expect(latest?.id).toBe(report.id);
    expect(latest?.status).toBe('ok');
    expect(latest?.verified).toBe(true);
  });
});
