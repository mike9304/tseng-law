import { mkdir, mkdtemp, readFile, rm, writeFile, access } from 'fs/promises';
import { createHash } from 'node:crypto';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  createOpsBackupStub,
  deleteOpsBackup,
  restoreOpsBackupStub,
  listOpsBackups,
} from '@/lib/builder/ops/backups-store';

let runtimeRoot: string;
let opsDir: string;

function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

beforeEach(async () => {
  runtimeRoot = await mkdtemp(path.join(os.tmpdir(), 'ops-backups-'));
  opsDir = path.join(runtimeRoot, 'ops');
  await mkdir(opsDir, { recursive: true });
  process.env.BUILDER_OPS_DATA_PATH = opsDir;
});

afterEach(async () => {
  delete process.env.BUILDER_OPS_DATA_PATH;
  await rm(runtimeRoot, { recursive: true, force: true });
});

describe('ops backups store', () => {
  it('refuses paths outside runtime-data/', async () => {
    const record = await createOpsBackupStub('/etc/passwd', 'nope');
    expect(record.status).toBe('failed');
    expect(record.sizeBytes).toBe(0);
  });

  it('copies a JSON file under runtime-data into the backups dir', async () => {
    const runtimeDir = path.join(process.cwd(), 'runtime-data', 'ops-store-test-fixture');
    await mkdir(runtimeDir, { recursive: true });
    const sourceFile = path.join(runtimeDir, 'doc.json');
    await writeFile(sourceFile, JSON.stringify({ x: 1 }), 'utf8');
    try {
      const record = await createOpsBackupStub(sourceFile, 'first stub');
      expect(record.status).toBe('ok');
      expect(record.sizeBytes).toBeGreaterThan(0);
      expect(record.checksumSha256).toBe(sha256Hex(JSON.stringify({ x: 1 })));
      const copyPath = path.join(opsDir, 'backups', `${record.id}.json.bak`);
      await expect(access(copyPath)).resolves.toBeUndefined();
      const copied = JSON.parse(await readFile(copyPath, 'utf8')) as { x: number };
      expect(copied.x).toBe(1);
      const list = await listOpsBackups();
      expect(list.find((b) => b.id === record.id)).toBeDefined();
      expect(await deleteOpsBackup(record.id)).toBe(true);
      expect((await listOpsBackups()).find((b) => b.id === record.id)).toBeUndefined();
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('restores an ok backup back to the source JSON path', async () => {
    const runtimeDir = path.join(process.cwd(), 'runtime-data', 'ops-store-restore-test');
    await mkdir(runtimeDir, { recursive: true });
    const sourceFile = path.join(runtimeDir, 'doc.json');
    await writeFile(sourceFile, JSON.stringify({ version: 1, name: 'before' }), 'utf8');
    try {
      const record = await createOpsBackupStub(sourceFile, 'restore test');
      expect(record.status).toBe('ok');

      await writeFile(sourceFile, JSON.stringify({ version: 2, name: 'after' }), 'utf8');
      const restored = await restoreOpsBackupStub(record.id);
      if (!restored.ok) throw new Error(restored.error);
      expect(restored.verified).toBe(true);
      expect(restored.checksumSha256).toBe(record.checksumSha256);
      const after = JSON.parse(await readFile(sourceFile, 'utf8')) as { version: number; name: string };
      expect(after.version).toBe(1);
      expect(after.name).toBe('before');
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('refuses to restore when the backup payload checksum no longer matches', async () => {
    const runtimeDir = path.join(process.cwd(), 'runtime-data', 'ops-store-integrity-test');
    await mkdir(runtimeDir, { recursive: true });
    const sourceFile = path.join(runtimeDir, 'doc.json');
    await writeFile(sourceFile, JSON.stringify({ version: 1, name: 'before' }), 'utf8');
    try {
      const record = await createOpsBackupStub(sourceFile, 'tamper test');
      expect(record.status).toBe('ok');
      const copyPath = path.join(opsDir, 'backups', `${record.id}.json.bak`);
      await writeFile(copyPath, JSON.stringify({ version: 999, name: 'tampered' }), 'utf8');
      await writeFile(sourceFile, JSON.stringify({ version: 2, name: 'after' }), 'utf8');

      const restored = await restoreOpsBackupStub(record.id);

      if (restored.ok) throw new Error('restore unexpectedly succeeded');
      expect(restored.error).toBe('backup payload checksum mismatch');
      const after = JSON.parse(await readFile(sourceFile, 'utf8')) as { version: number; name: string };
      expect(after.version).toBe(2);
      expect(after.name).toBe('after');
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });
});
