import {
  access,
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  symlink,
  unlink,
  utimes,
  writeFile,
} from 'fs/promises';
import { spawn, type ChildProcess } from 'node:child_process';
import { createHash } from 'node:crypto';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  _setOpsBackupRestoreFaultForTests,
  _setOpsBackupRestoreHookForTests,
  _setOpsBackupRuntimeRootForTests,
  createOpsBackup,
  deleteOpsBackup,
  restoreOpsBackup,
  listOpsBackups,
} from '@/lib/builder/ops/backups-store';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';

let runtimeRoot: string;
let sourceRoot: string;
let opsDir: string;

function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

type OpsWorkerMessage = {
  type: 'ready' | 'result' | 'error';
  pid: number;
  ids?: string[];
  error?: string;
};

class OpsWorkerHarness {
  private readonly queued: OpsWorkerMessage[] = [];
  private readonly waiters: Array<{
    predicate: (message: OpsWorkerMessage) => boolean;
    resolve: (message: OpsWorkerMessage) => void;
    reject: (error: Error) => void;
    timer: ReturnType<typeof setTimeout>;
  }> = [];
  private readonly stdout: string[] = [];
  private readonly stderr: string[] = [];

  constructor(readonly child: ChildProcess) {
    child.on('message', (message: OpsWorkerMessage) => {
      const index = this.waiters.findIndex((waiter) => waiter.predicate(message));
      if (index === -1) {
        this.queued.push(message);
        return;
      }
      const [waiter] = this.waiters.splice(index, 1);
      clearTimeout(waiter.timer);
      waiter.resolve(message);
    });
    child.stdout?.on('data', (chunk) => this.stdout.push(String(chunk)));
    child.stderr?.on('data', (chunk) => this.stderr.push(String(chunk)));
  }

  send(message: Record<string, unknown>): void {
    this.child.send(message);
  }

  waitFor(
    predicate: (message: OpsWorkerMessage) => boolean,
    timeoutMs = 20_000,
  ): Promise<OpsWorkerMessage> {
    const queuedIndex = this.queued.findIndex(predicate);
    if (queuedIndex !== -1) return Promise.resolve(this.queued.splice(queuedIndex, 1)[0]!);
    return new Promise((resolve, reject) => {
      const waiter = {
        predicate,
        resolve,
        reject,
        timer: setTimeout(() => {
          const index = this.waiters.indexOf(waiter);
          if (index !== -1) this.waiters.splice(index, 1);
          reject(new Error(`ops worker timed out: ${this.diagnostics()}`));
        }, timeoutMs),
      };
      this.waiters.push(waiter);
    });
  }

  diagnostics(): string {
    return JSON.stringify({
      pid: this.child.pid,
      exitCode: this.child.exitCode,
      signalCode: this.child.signalCode,
      queued: this.queued,
      stdout: this.stdout.join('').slice(-2_000),
      stderr: this.stderr.join('').slice(-2_000),
    });
  }

  async shutdown(): Promise<void> {
    if (this.child.exitCode !== null || this.child.signalCode !== null) return;
    if (this.child.connected) this.child.send({ type: 'shutdown' });
    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => this.child.kill('SIGKILL'), 5_000);
      this.child.once('exit', () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  async killAndWait(): Promise<void> {
    if (this.child.exitCode !== null || this.child.signalCode !== null) return;
    await new Promise<void>((resolve) => {
      this.child.once('exit', () => resolve());
      this.child.kill('SIGKILL');
    });
  }
}

async function createOpsWorkerFixture(repoRoot: string): Promise<string> {
  const workerPath = path.join(runtimeRoot, 'ops-backups-worker.ts');
  const modulePath = path.join(repoRoot, 'src/lib/builder/ops/backups-store.ts');
  const leaseModulePath = path.join(
    repoRoot,
    'src/lib/builder/storage/local-json-write-lease.mjs',
  );
  const workerSource = `
import {
  _setOpsBackupRuntimeRootForTests,
  createOpsBackup,
  deleteOpsBackup,
} from ${JSON.stringify(modulePath)};
import {
  acquireLocalJsonWriteLease,
  atomicWriteLocalJson,
  readLocalJsonFile,
} from ${JSON.stringify(leaseModulePath)};

_setOpsBackupRuntimeRootForTests(process.env.OPS_RUNTIME_DATA_ROOT ?? '');
const role = process.env.OPS_WORKER_ROLE;
const sourcePath = process.env.OPS_SOURCE_PATH ?? '';
const deleteIds = JSON.parse(process.env.OPS_DELETE_IDS ?? '[]');
const count = Number(process.env.OPS_ADD_COUNT ?? '0');

async function crashDuringIndexWrite() {
  const indexPath = process.env.OPS_INDEX_PATH ?? '';
  const allowedRoot = process.env.OPS_ALLOWED_ROOT ?? '';
  const lease = await acquireLocalJsonWriteLease(indexPath, {
    allowedRoot,
    lockStaleMs: 0,
    testHook: async ({ stage }) => {
      if (stage !== 'after-target-detach') return;
      process.send?.({ type: 'ready', pid: process.pid });
      await new Promise(() => {});
    },
  });
  try {
    const current = await readLocalJsonFile(lease);
    if (current.kind !== 'present') throw new Error('missing crash-test index');
    const index = JSON.parse(current.bytes.toString('utf8'));
    index.backups.push({
      id: 'opsbkp_20000101000000_deadbeef',
      createdAt: new Date(0).toISOString(),
      sourcePath,
      sizeBytes: 0,
      status: 'failed',
      note: 'crash candidate must not commit',
    });
    await atomicWriteLocalJson(
      lease,
      Buffer.from(JSON.stringify(index), 'utf8'),
      { expectedGeneration: current.generation },
    );
    process.send?.({ type: 'error', pid: process.pid, error: 'crash hook returned' });
  } finally {
    await lease.release();
  }
}

if (role === 'crash-index-write') {
  crashDuringIndexWrite().catch((error) => {
    process.send?.({
      type: 'error',
      pid: process.pid,
      error: error instanceof Error ? error.message : String(error),
    });
  });
} else {
  process.send?.({ type: 'ready', pid: process.pid });
  process.on('message', async (message) => {
    if (message?.type === 'shutdown') process.exit(0);
    if (message?.type !== 'go') return;
    try {
      const ids = [];
      if (role === 'add') {
        for (let index = 0; index < count; index += 1) {
          const record = await createOpsBackup(sourcePath, \`child-add-\${index}\`);
          if (record.status !== 'ok') throw new Error(\`create failed: \${record.note}\`);
          ids.push(record.id);
        }
      } else if (role === 'delete') {
        for (const id of deleteIds) {
          if (!await deleteOpsBackup(id)) throw new Error(\`delete failed: \${id}\`);
        }
      } else {
        throw new Error(\`unknown role: \${role}\`);
      }
      process.send?.({ type: 'result', pid: process.pid, ids });
    } catch (error) {
      process.send?.({
        type: 'error',
        pid: process.pid,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}
`;
  await writeFile(workerPath, workerSource, 'utf8');
  return workerPath;
}

function spawnOpsWorker(
  repoRoot: string,
  workerPath: string,
  role: 'add' | 'delete' | 'crash-index-write',
  sourcePath: string,
  deleteIds: string[],
  addCount: number,
): OpsWorkerHarness {
  const child = spawn(process.execPath, [
    path.join(repoRoot, 'node_modules/vite-node/vite-node.mjs'),
    '--root',
    repoRoot,
    '--config',
    path.join(repoRoot, 'vitest.config.ts'),
    workerPath,
  ], {
    cwd: repoRoot,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      BUILDER_OPS_DATA_PATH: opsDir,
      OPS_RUNTIME_DATA_ROOT: sourceRoot,
      OPS_WORKER_ROLE: role,
      OPS_SOURCE_PATH: sourcePath,
      OPS_DELETE_IDS: JSON.stringify(deleteIds),
      OPS_ADD_COUNT: String(addCount),
      OPS_INDEX_PATH: path.join(opsDir, 'backups.json'),
      OPS_ALLOWED_ROOT: opsDir,
    },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    serialization: 'json',
  });
  return new OpsWorkerHarness(child);
}

const TRANSACTION_ARTIFACT_SUFFIX = /\.(?:candidate|detached|manifest|previous|tmp|release|stale)$/;
const WRITER_CONTROL_ARTIFACT = /\.writer\.(?:lock|reclaim)/;

async function transactionArtifacts(directory: string): Promise<string[]> {
  return (await readdir(directory)).filter((name) => (
    TRANSACTION_ARTIFACT_SUFFIX.test(name)
    || WRITER_CONTROL_ARTIFACT.test(name)
  ));
}

async function indexLeaseArtifacts(): Promise<string[]> {
  return (await readdir(opsDir)).filter((name) => (
    name.startsWith('.backups.json.writer.')
    || name.startsWith('.backups.json.txn-')
  ));
}

beforeEach(async () => {
  runtimeRoot = await realpath(await mkdtemp(path.join(os.tmpdir(), 'ops-backups-')));
  sourceRoot = path.join(runtimeRoot, 'runtime-data');
  opsDir = path.join(runtimeRoot, 'ops');
  await mkdir(sourceRoot, { recursive: true });
  await mkdir(opsDir, { recursive: true });
  process.env.BUILDER_OPS_DATA_PATH = opsDir;
  _setOpsBackupRuntimeRootForTests(sourceRoot);
  _setOpsBackupRestoreFaultForTests(null);
  _setOpsBackupRestoreHookForTests(null);
});

afterEach(async () => {
  _setOpsBackupRestoreHookForTests(null);
  _setOpsBackupRestoreFaultForTests(null);
  _setOpsBackupRuntimeRootForTests(null);
  delete process.env.BUILDER_OPS_DATA_PATH;
  await rm(runtimeRoot, { recursive: true, force: true });
});

describe('ops backups store', () => {
  it('refuses paths outside runtime-data/', async () => {
    const record = await createOpsBackup('/etc/passwd', 'nope');
    expect(record.status).toBe('failed');
    expect(record.sizeBytes).toBe(0);
  });

  it('copies a JSON file under runtime-data into the backups dir', async () => {
    const runtimeDir = path.join(sourceRoot, 'ops-store-test-fixture');
    await mkdir(runtimeDir, { recursive: true });
    const sourceFile = path.join(runtimeDir, 'doc.json');
    await writeFile(sourceFile, JSON.stringify({ x: 1 }), 'utf8');
    try {
      const record = await createOpsBackup(sourceFile, 'first stub');
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
    const runtimeDir = path.join(sourceRoot, 'ops-store-restore-test');
    await mkdir(runtimeDir, { recursive: true });
    const sourceFile = path.join(runtimeDir, 'doc.json');
    await writeFile(sourceFile, JSON.stringify({ version: 1, name: 'before' }), 'utf8');
    try {
      const record = await createOpsBackup(sourceFile, 'restore test');
      expect(record.status).toBe('ok');

      await writeFile(sourceFile, JSON.stringify({ version: 2, name: 'after' }), 'utf8');
      const restored = await restoreOpsBackup(record.id);
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
    const runtimeDir = path.join(sourceRoot, 'ops-store-integrity-test');
    await mkdir(runtimeDir, { recursive: true });
    const sourceFile = path.join(runtimeDir, 'doc.json');
    await writeFile(sourceFile, JSON.stringify({ version: 1, name: 'before' }), 'utf8');
    try {
      const record = await createOpsBackup(sourceFile, 'tamper test');
      expect(record.status).toBe('ok');
      const copyPath = path.join(opsDir, 'backups', `${record.id}.json.bak`);
      await writeFile(copyPath, JSON.stringify({ version: 999, name: 'tampered' }), 'utf8');
      await writeFile(sourceFile, JSON.stringify({ version: 2, name: 'after' }), 'utf8');

      const restored = await restoreOpsBackup(record.id);

      if (restored.ok) throw new Error('restore unexpectedly succeeded');
      expect(restored.error).toBe('backup payload checksum mismatch');
      const after = JSON.parse(await readFile(sourceFile, 'utf8')) as { version: number; name: string };
      expect(after.version).toBe(2);
      expect(after.name).toBe('after');
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('fails closed when an ok backup record has no checksum', async () => {
    const runtimeDir = path.join(sourceRoot, 'ops-store-missing-checksum');
    const sourceFile = path.join(runtimeDir, 'doc.json');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"backup":true}', 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, 'missing checksum fixture');
      const indexPath = path.join(opsDir, 'backups.json');
      const index = JSON.parse(await readFile(indexPath, 'utf8')) as {
        backups: Array<{ id: string; checksumSha256?: string }>;
      };
      delete index.backups.find((entry) => entry.id === record.id)!.checksumSha256;
      await writeFile(indexPath, JSON.stringify(index), 'utf8');
      const currentBytes = Buffer.from('{"current":true}', 'utf8');
      await writeFile(sourceFile, currentBytes);

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'backup payload checksum missing',
      });
      expect(await readFile(sourceFile)).toEqual(currentBytes);
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('binds backup validation to the same regular-file inode that is read', async () => {
    const runtimeDir = path.join(sourceRoot, 'ops-payload-inode-swap');
    const sourceFile = path.join(runtimeDir, 'doc.json');
    const backupBytes = Buffer.from('{"backup":true}', 'utf8');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, backupBytes);

    try {
      const record = await createOpsBackup(sourceFile, 'payload inode swap fixture');
      const payloadPath = path.join(opsDir, 'backups', `${record.id}.json.bak`);
      const displacedPayloadPath = `${payloadPath}.old`;
      const currentBytes = Buffer.from('{"current":true}', 'utf8');
      await writeFile(sourceFile, currentBytes);
      let swapped = false;
      _setOpsBackupRestoreHookForTests(async (stage) => {
        if (stage !== 'after-backup-payload-resolve' || swapped) return;
        swapped = true;
        await rename(payloadPath, displacedPayloadPath);
        // Same bytes prove the inode binding, rather than the checksum, rejects the swap.
        await writeFile(payloadPath, backupBytes);
      });

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'backup payload changed during restore',
      });
      expect(await readFile(sourceFile)).toEqual(currentBytes);
      expect(swapped).toBe(true);
      await rm(displacedPayloadPath, { force: true });
    } finally {
      _setOpsBackupRestoreHookForTests(null);
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it.each([
    {
      name: 'duplicate page id',
      mutate: (site: BuilderSiteDocument) => {
        site.pages.push({ ...site.pages[0]!, slug: 'duplicate', isHomePage: false });
      },
    },
    {
      name: 'missing authored home page',
      mutate: (site: BuilderSiteDocument) => {
        site.pages[0]!.isHomePage = false;
      },
    },
    {
      name: 'unsafe page id',
      mutate: (site: BuilderSiteDocument) => {
        site.pages[0]!.pageId = '../outside';
      },
    },
  ])('rejects an invalid canonical site backup ($name) without changing a byte', async ({ mutate }) => {
    const siteId = `ops-invalid-${Math.random().toString(16).slice(2)}`;
    const runtimeDir = path.join(sourceRoot, 'builder-site', siteId);
    const sourceFile = path.join(runtimeDir, 'site.json');
    await mkdir(runtimeDir, { recursive: true });
    const invalidSite = createDefaultSiteDocument('ko', siteId);
    mutate(invalidSite);
    await writeFile(sourceFile, JSON.stringify(invalidSite), 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, 'invalid canonical fixture');
      expect(record.status).toBe('ok');
      const currentBytes = Buffer.from('current bytes must survive exactly\n', 'utf8');
      await writeFile(sourceFile, currentBytes);

      const restored = await restoreOpsBackup(record.id);

      expect(restored).toEqual({ ok: false, error: 'invalid builder site backup payload' });
      expect(await readFile(sourceFile)).toEqual(currentBytes);
      expect(await transactionArtifacts(runtimeDir)).toEqual([]);
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('rejects a canonical site backup whose embedded siteId does not match its directory', async () => {
    const siteId = `ops-site-id-${Math.random().toString(16).slice(2)}`;
    const runtimeDir = path.join(sourceRoot, 'builder-site', siteId);
    const sourceFile = path.join(runtimeDir, 'site.json');
    await mkdir(runtimeDir, { recursive: true });
    const mismatched = createDefaultSiteDocument('ko', `${siteId}-other`);
    await writeFile(sourceFile, JSON.stringify(mismatched), 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, 'site id mismatch fixture');
      const currentBytes = Buffer.from('{"current":true}\n', 'utf8');
      await writeFile(sourceFile, currentBytes);
      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'invalid builder site backup payload',
      });
      expect(await readFile(sourceFile)).toEqual(currentBytes);
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('restores a valid canonical site atomically and reports the checksum of restored bytes', async () => {
    const siteId = `ops-valid-${Math.random().toString(16).slice(2)}`;
    const runtimeDir = path.join(sourceRoot, 'builder-site', siteId);
    const sourceFile = path.join(runtimeDir, 'site.json');
    await mkdir(runtimeDir, { recursive: true });
    const originalBytes = Buffer.from(JSON.stringify(createDefaultSiteDocument('ko', siteId)), 'utf8');
    await writeFile(sourceFile, originalBytes);

    try {
      const record = await createOpsBackup(sourceFile, 'valid canonical fixture');
      await writeFile(sourceFile, JSON.stringify({ changed: true }), 'utf8');

      const restored = await restoreOpsBackup(record.id);

      expect(restored).toEqual({
        ok: true,
        restoredPath: sourceFile,
        verified: true,
        checksumSha256: sha256Hex(originalBytes.toString('utf8')),
        sizeBytes: originalBytes.byteLength,
      });
      expect(await readFile(sourceFile)).toEqual(originalBytes);
      expect(await transactionArtifacts(runtimeDir)).toEqual([]);
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it.each([
    ['post-rename-read', 'post-rename restored file read failed'],
    ['post-rename-invariant', 'invalid builder site backup payload'],
    ['post-rename-checksum', 'restored file checksum mismatch'],
  ] as const)('rolls back exact original bytes after a %s failure', async (fault, expectedError) => {
    const runtimeDir = path.join(sourceRoot, `ops-transaction-${fault}`);
    const sourceFile = path.join(runtimeDir, 'doc.json');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"backup":true}', 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, `${fault} fixture`);
      const currentBytes = Buffer.from(' current bytes must be restored exactly \n\u0000', 'utf8');
      await writeFile(sourceFile, currentBytes);
      await chmod(sourceFile, 0o640);
      const originalMode = (await stat(sourceFile)).mode & 0o7777;
      _setOpsBackupRestoreFaultForTests(fault);

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: expectedError,
        verified: false,
      });
      expect(await readFile(sourceFile)).toEqual(currentBytes);
      expect((await stat(sourceFile)).mode & 0o7777).toBe(originalMode);
      expect(await transactionArtifacts(runtimeDir)).toEqual([]);
    } finally {
      _setOpsBackupRestoreFaultForTests(null);
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('reports a distinct fail-closed result if post-rename rollback itself fails', async () => {
    const runtimeDir = path.join(sourceRoot, 'ops-rollback-failure');
    const sourceFile = path.join(runtimeDir, 'doc.json');
    const backupBytes = Buffer.from('{"backup":true}', 'utf8');
    const currentBytes = Buffer.from('{"current":true}', 'utf8');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, backupBytes);

    try {
      const record = await createOpsBackup(sourceFile, 'rollback failure fixture');
      await writeFile(sourceFile, currentBytes);
      _setOpsBackupRestoreFaultForTests('post-rename-read-and-rollback-write');

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'restore failed and rollback failed; source state is unverified',
        verified: false,
      });
      expect(await readFile(sourceFile)).toEqual(backupBytes);
      expect(await transactionArtifacts(runtimeDir)).toEqual([]);
    } finally {
      _setOpsBackupRestoreFaultForTests(null);
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('preserves a replacement-inode competitor at the final restore boundary', async () => {
    const runtimeDir = path.join(sourceRoot, 'ops-final-inode-race');
    const sourceFile = path.join(runtimeDir, 'doc.json');
    const parkedSource = path.join(runtimeDir, 'doc.parked.json');
    const competitorBytes = Buffer.from('{"winner":"replacement-inode"}\n', 'utf8');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"backup":true}', 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, 'final inode race fixture');
      await writeFile(sourceFile, '{"current":true}', 'utf8');
      let injected = false;
      _setOpsBackupRestoreHookForTests(async (stage) => {
        if (stage !== 'after-source-install-final-check' || injected) return;
        injected = true;
        await rename(sourceFile, parkedSource);
        await writeFile(sourceFile, competitorBytes);
      });

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'source path changed during restore',
      });
      expect(injected).toBe(true);
      expect(await readFile(sourceFile)).toEqual(competitorBytes);
      expect(await transactionArtifacts(runtimeDir)).toEqual([]);
    } finally {
      _setOpsBackupRestoreHookForTests(null);
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('preserves same-inode competitor bytes at the final restore boundary', async () => {
    const runtimeDir = path.join(sourceRoot, 'ops-final-same-inode-race');
    const sourceFile = path.join(runtimeDir, 'doc.json');
    const currentBytes = Buffer.from('{"winner":"current-12345678901"}\n', 'utf8');
    const competitorBytes = Buffer.from('{"winner":"same-inode-mutation"}\n', 'utf8');
    expect(competitorBytes.byteLength).toBe(currentBytes.byteLength);
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"backup":true}', 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, 'final same-inode race fixture');
      await writeFile(sourceFile, currentBytes);
      const expectedIdentity = await stat(sourceFile);
      let injected = false;
      _setOpsBackupRestoreHookForTests(async (stage) => {
        if (stage !== 'after-source-install-final-check' || injected) return;
        injected = true;
        await writeFile(sourceFile, competitorBytes);
        await utimes(sourceFile, expectedIdentity.atime, expectedIdentity.mtime);
        const competitorIdentity = await stat(sourceFile);
        expect(competitorIdentity.dev).toBe(expectedIdentity.dev);
        expect(competitorIdentity.ino).toBe(expectedIdentity.ino);
        expect(competitorIdentity.size).toBe(expectedIdentity.size);
      });

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'source file changed during restore',
      });
      expect(injected).toBe(true);
      expect(await readFile(sourceFile)).toEqual(competitorBytes);
      expect(await transactionArtifacts(runtimeDir)).toEqual([]);
    } finally {
      _setOpsBackupRestoreHookForTests(null);
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('preserves a replacement-inode competitor that appears during rollback', async () => {
    const runtimeDir = path.join(sourceRoot, 'ops-rollback-inode-race');
    const sourceFile = path.join(runtimeDir, 'doc.json');
    const parkedSource = path.join(runtimeDir, 'doc.parked.json');
    const competitorBytes = Buffer.from('{"winner":"rollback-replacement"}\n', 'utf8');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"backup":true}', 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, 'rollback inode race fixture');
      await writeFile(sourceFile, '{"current":true}', 'utf8');

      let installCount = 0;
      let injected = false;
      _setOpsBackupRestoreHookForTests(async (stage) => {
        if (stage !== 'after-source-install-final-check') return;
        installCount += 1;
        if (installCount !== 2 || injected) return;
        injected = true;
        await rename(sourceFile, parkedSource);
        await writeFile(sourceFile, competitorBytes);
      });
      _setOpsBackupRestoreFaultForTests('post-rename-read');

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'restore failed and rollback failed; source state is unverified',
        verified: false,
      });
      expect(injected).toBe(true);
      expect(await readFile(sourceFile)).toEqual(competitorBytes);
      expect(await transactionArtifacts(runtimeDir)).toEqual([]);
      await rm(parkedSource, { force: true });
    } finally {
      _setOpsBackupRestoreHookForTests(null);
      _setOpsBackupRestoreFaultForTests(null);
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('preserves same-inode competitor bytes that appear during rollback', async () => {
    const runtimeDir = path.join(sourceRoot, 'ops-rollback-same-inode-race');
    const sourceFile = path.join(runtimeDir, 'doc.json');
    const competitorBytes = Buffer.from('{"winner":"rollback-same-inode"}\n', 'utf8');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"backup":true}', 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, 'rollback same-inode race fixture');
      await writeFile(sourceFile, '{"current":true}', 'utf8');

      let installCount = 0;
      let injected = false;
      _setOpsBackupRestoreHookForTests(async (stage) => {
        if (stage !== 'after-source-install-final-check') return;
        installCount += 1;
        if (installCount !== 2 || injected) return;
        injected = true;
        await writeFile(sourceFile, competitorBytes);
      });
      _setOpsBackupRestoreFaultForTests('post-rename-read');

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'restore failed and rollback failed; source state is unverified',
        verified: false,
      });
      expect(injected).toBe(true);
      expect(await readFile(sourceFile)).toEqual(competitorBytes);
      expect(await transactionArtifacts(runtimeDir)).toEqual([]);
    } finally {
      _setOpsBackupRestoreHookForTests(null);
      _setOpsBackupRestoreFaultForTests(null);
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('serializes index additions and deletions across OS processes without losing records', async () => {
    const repoRoot = process.cwd();
    const runtimeDir = path.join(sourceRoot, 'ops-multiprocess-index');
    const sourceFile = path.join(runtimeDir, 'doc.json');
    const workers: OpsWorkerHarness[] = [];
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"multiprocess":true}', 'utf8');

    try {
      const sentinel = await createOpsBackup(sourceFile, 'multiprocess sentinel');
      expect(sentinel.status).toBe('ok');
      const deleteRecords = await Promise.all(Array.from({ length: 16 }, (_, index) => (
        createOpsBackup(sourceFile, `delete-seed-${index}`)
      )));
      const deleteIds = deleteRecords.map((record) => record.id);
      expect(deleteRecords.every((record) => record.status === 'ok')).toBe(true);

      const workerPath = await createOpsWorkerFixture(repoRoot);
      workers.push(
        spawnOpsWorker(repoRoot, workerPath, 'add', sourceFile, [], 16),
        spawnOpsWorker(repoRoot, workerPath, 'delete', sourceFile, deleteIds, 0),
      );
      const ready = await Promise.all(workers.map((worker) => worker.waitFor(
        (message) => message.type === 'ready',
      )));
      expect(new Set(ready.map((message) => message.pid)).size).toBe(2);
      expect(ready.map((message) => message.pid)).not.toContain(process.pid);

      workers.forEach((worker) => worker.send({ type: 'go' }));
      const results = await Promise.all(workers.map((worker) => worker.waitFor(
        (message) => message.type === 'result' || message.type === 'error',
      )));
      expect(results.every((message) => message.type === 'result')).toBe(true);
      const addedIds = results.flatMap((message) => message.ids ?? []);
      expect(addedIds).toHaveLength(16);

      const finalRecords = await listOpsBackups();
      const finalIds = finalRecords.map((record) => record.id);
      expect(new Set(finalIds).size).toBe(finalIds.length);
      expect(finalIds).toContain(sentinel.id);
      expect(finalIds).toEqual(expect.arrayContaining(addedIds));
      deleteIds.forEach((id) => expect(finalIds).not.toContain(id));

      const onDisk = JSON.parse(await readFile(path.join(opsDir, 'backups.json'), 'utf8')) as {
        backups: Array<{ id: string }>;
      };
      expect(new Set(onDisk.backups.map((record) => record.id))).toEqual(new Set(finalIds));
      await Promise.all(finalIds.map((id) => (
        expect(access(path.join(opsDir, 'backups', `${id}.json.bak`))).resolves.toBeUndefined()
      )));
      await Promise.all(deleteIds.map((id) => (
        expect(access(path.join(opsDir, 'backups', `${id}.json.bak`))).rejects.toMatchObject({ code: 'ENOENT' })
      )));
    } finally {
      await Promise.all(workers.map((worker) => worker.shutdown()));
      await rm(runtimeDir, { recursive: true, force: true });
    }
  }, 60_000);

  it('recovers the previous index and removes lease residue after a writer is killed mid-replace', async () => {
    const repoRoot = process.cwd();
    const runtimeDir = path.join(sourceRoot, 'ops-index-crash-recovery');
    const sourceFile = path.join(runtimeDir, 'doc.json');
    const workers: OpsWorkerHarness[] = [];
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"crashRecovery":true}', 'utf8');

    try {
      const sentinel = await createOpsBackup(sourceFile, 'pre-crash sentinel');
      expect(sentinel.status).toBe('ok');
      const workerPath = await createOpsWorkerFixture(repoRoot);
      const worker = spawnOpsWorker(
        repoRoot,
        workerPath,
        'crash-index-write',
        sourceFile,
        [],
        0,
      );
      workers.push(worker);

      const crashBoundary = await worker.waitFor(
        (message) => message.type === 'ready' || message.type === 'error',
      );
      expect(crashBoundary).toMatchObject({ type: 'ready', pid: worker.child.pid });
      await worker.killAndWait();

      const afterCrash = await createOpsBackup(sourceFile, 'post-crash record');
      expect(afterCrash.status).toBe('ok');
      const finalRecords = await listOpsBackups();
      expect(finalRecords.map((record) => record.id)).toEqual(expect.arrayContaining([
        sentinel.id,
        afterCrash.id,
      ]));
      expect(finalRecords.map((record) => record.id)).not.toContain(
        'opsbkp_20000101000000_deadbeef',
      );
      expect(await indexLeaseArtifacts()).toEqual([]);
    } finally {
      await Promise.all(workers.map((worker) => worker.shutdown()));
      await rm(runtimeDir, { recursive: true, force: true });
    }
  }, 30_000);

  it.each([
    ['database probe', 'db-probe-r04'],
    ['visual template', 'visual-template-r04'],
    ['QA fixture', 'g-editor-qa-r04'],
  ])('rejects an internal %s page from the canonical production site restore', async (_label, slug) => {
    const runtimeDir = path.join(sourceRoot, 'builder-site', DEFAULT_BUILDER_SITE_ID);
    const sourceFile = path.join(runtimeDir, 'site.json');
    const canonical = createDefaultSiteDocument('ko', DEFAULT_BUILDER_SITE_ID);
    canonical.pages.push({
      ...canonical.pages[0]!,
      pageId: `page-${slug}`,
      slug,
      title: { ko: slug, 'zh-hant': slug, en: slug },
      isHomePage: false,
    });
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, JSON.stringify(canonical), 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, `${slug} canonical fixture`);
      const currentBytes = Buffer.from('{"current":"canonical"}\n', 'utf8');
      await writeFile(sourceFile, currentBytes);

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'invalid builder site backup payload',
      });
      expect(await readFile(sourceFile)).toEqual(currentBytes);
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('allows an internal fixture page in a custom isolated site restore', async () => {
    const siteId = 'isolated-qa-site';
    const runtimeDir = path.join(sourceRoot, 'builder-site', siteId);
    const sourceFile = path.join(runtimeDir, 'site.json');
    const isolated = createDefaultSiteDocument('ko', siteId);
    isolated.pages.push({
      ...isolated.pages[0]!,
      pageId: 'page-db-probe-custom',
      slug: 'db-probe-custom',
      title: { ko: 'DB probe', 'zh-hant': 'DB probe', en: 'DB probe' },
      isHomePage: false,
    });
    const backupBytes = Buffer.from(JSON.stringify(isolated), 'utf8');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, backupBytes);

    try {
      const record = await createOpsBackup(sourceFile, 'isolated internal fixture');
      await writeFile(sourceFile, '{"current":true}', 'utf8');

      const result = await restoreOpsBackup(record.id);

      expect(result.ok).toBe(true);
      expect(await readFile(sourceFile)).toEqual(backupBytes);
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('rejects a symlink source without overwriting its target', async () => {
    const runtimeDir = path.join(sourceRoot, `ops-source-link-${Date.now()}`);
    const sourceFile = path.join(runtimeDir, 'doc.json');
    const externalDir = await mkdtemp(path.join(os.tmpdir(), 'ops-source-target-'));
    const externalFile = path.join(externalDir, 'outside.json');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"version":1}', 'utf8');
    await writeFile(externalFile, '{"outside":true}', 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, 'symlink source fixture');
      await unlink(sourceFile);
      await symlink(externalFile, sourceFile);

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'source path is not restorable',
      });
      expect(await readFile(externalFile, 'utf8')).toBe('{"outside":true}');
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
      await rm(externalDir, { recursive: true, force: true });
    }
  });

  it('rejects a symlinked source parent even when its target contains a regular JSON file', async () => {
    const runtimeDir = path.join(sourceRoot, `ops-parent-link-${Date.now()}`);
    const externalDir = await mkdtemp(path.join(os.tmpdir(), 'ops-parent-target-'));
    const externalFile = path.join(externalDir, 'outside.json');
    await writeFile(externalFile, '{"outside":true}', 'utf8');
    await symlink(externalDir, runtimeDir);

    try {
      const record = await createOpsBackup(path.join(runtimeDir, 'outside.json'), 'symlink parent fixture');
      expect(record.status).toBe('failed');
      expect(await readFile(externalFile, 'utf8')).toBe('{"outside":true}');
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
      await rm(externalDir, { recursive: true, force: true });
    }
  });

  it('rejects a symlink backup payload and preserves the source bytes', async () => {
    const runtimeDir = path.join(sourceRoot, `ops-payload-link-${Date.now()}`);
    const sourceFile = path.join(runtimeDir, 'doc.json');
    const externalDir = await mkdtemp(path.join(os.tmpdir(), 'ops-payload-target-'));
    const externalFile = path.join(externalDir, 'outside.json');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"version":1}', 'utf8');
    await writeFile(externalFile, '{"version":1}', 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, 'symlink payload fixture');
      const payload = path.join(opsDir, 'backups', `${record.id}.json.bak`);
      await unlink(payload);
      await symlink(externalFile, payload);
      const currentBytes = Buffer.from('{"version":2}\n', 'utf8');
      await writeFile(sourceFile, currentBytes);

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'backup payload missing or unsafe',
      });
      expect(await readFile(sourceFile)).toEqual(currentBytes);
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
      await rm(externalDir, { recursive: true, force: true });
    }
  });

  it('rejects a symlinked backup parent and preserves the source bytes', async () => {
    const runtimeDir = path.join(sourceRoot, `ops-backup-parent-link-${Date.now()}`);
    const sourceFile = path.join(runtimeDir, 'doc.json');
    await mkdir(runtimeDir, { recursive: true });
    await writeFile(sourceFile, '{"version":1}', 'utf8');

    try {
      const record = await createOpsBackup(sourceFile, 'symlink backup parent fixture');
      const backupsDir = path.join(opsDir, 'backups');
      const physicalBackupsDir = path.join(opsDir, 'backups-physical');
      await rename(backupsDir, physicalBackupsDir);
      await symlink(physicalBackupsDir, backupsDir);
      const currentBytes = Buffer.from('{"version":2}\n', 'utf8');
      await writeFile(sourceFile, currentBytes);

      expect(await restoreOpsBackup(record.id)).toEqual({
        ok: false,
        error: 'backup payload missing or unsafe',
      });
      expect(await readFile(sourceFile)).toEqual(currentBytes);
    } finally {
      await rm(runtimeDir, { recursive: true, force: true });
    }
  });

  it('detects every transaction suffix and writer-control artifact while ignoring an unrelated sentinel', async () => {
    const artifactDir = path.join(runtimeRoot, 'artifact-suffix-contract');
    await mkdir(artifactDir, { recursive: true });
    const suffixArtifactNames = [
      'candidate', 'detached', 'manifest', 'previous', 'tmp', 'release', 'stale',
    ].map((suffix) => `.doc.json.txn-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.${suffix}`);
    const writerControlNames = ['.doc.json.writer.lock', '.doc.json.writer.reclaim'];
    const sentinelName = 'doc.json';
    for (const name of [...suffixArtifactNames, ...writerControlNames, sentinelName]) {
      await writeFile(path.join(artifactDir, name), '', 'utf8');
    }

    const detected = await transactionArtifacts(artifactDir);

    expect([...detected].sort()).toEqual(
      [...suffixArtifactNames, ...writerControlNames].sort(),
    );
  });
});
