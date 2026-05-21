import { mkdir, mkdtemp, readFile, rm, writeFile, access } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  createOpsBackupStub,
  deleteOpsBackup,
  listOpsBackups,
} from '@/lib/builder/ops/backups-store';

let runtimeRoot: string;
let opsDir: string;

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
});