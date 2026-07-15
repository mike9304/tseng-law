import { spawn, type ChildProcess } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BackupManifest } from '../types';

const mocks = vi.hoisted(() => ({
  manifest: null as BackupManifest | null,
  put: vi.fn(),
}));

vi.mock('../backup-engine', () => ({
  loadBackupManifest: vi.fn(async () => mocks.manifest),
}));

vi.mock('@vercel/blob', () => ({
  put: mocks.put,
}));

import {
  _setRestoreFileHookForTests,
  _setRestoreLeaseOptionsForTests,
  restoreBackup,
  type RestoreFileTestEvent,
} from '../restore-engine';

interface WorkerMessage extends Record<string, unknown> {
  type: string;
  pid?: number;
  backupId?: string;
  result?: { ok: boolean; restored: number; failed: number };
}

interface WorkerWaiter {
  predicate: (message: WorkerMessage) => boolean;
  resolve: (message: WorkerMessage) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
}

class RestoreWorkerHarness {
  private readonly messages: WorkerMessage[] = [];
  private readonly waiters: WorkerWaiter[] = [];
  private readonly stdout: string[] = [];
  private readonly stderr: string[] = [];

  constructor(readonly child: ChildProcess) {
    child.on('message', (message: WorkerMessage) => {
      const waiterIndex = this.waiters.findIndex((waiter) => waiter.predicate(message));
      if (waiterIndex >= 0) {
        const [waiter] = this.waiters.splice(waiterIndex, 1);
        clearTimeout(waiter.timeout);
        waiter.resolve(message);
      } else {
        this.messages.push(message);
      }
    });
    child.stdout?.on('data', (chunk) => this.stdout.push(String(chunk)));
    child.stderr?.on('data', (chunk) => this.stderr.push(String(chunk)));
  }

  send(message: Record<string, unknown>): void {
    if (!this.child.connected) throw new Error(`restore worker disconnected: ${this.diagnostics()}`);
    this.child.send(message);
  }

  waitFor(predicate: (message: WorkerMessage) => boolean, timeoutMs = 15_000): Promise<WorkerMessage> {
    const queuedIndex = this.messages.findIndex(predicate);
    if (queuedIndex >= 0) return Promise.resolve(this.messages.splice(queuedIndex, 1)[0]);

    return new Promise<WorkerMessage>((resolve, reject) => {
      const waiter: WorkerWaiter = {
        predicate,
        resolve,
        reject,
        timeout: setTimeout(() => {
          const index = this.waiters.indexOf(waiter);
          if (index >= 0) this.waiters.splice(index, 1);
          reject(new Error(`restore worker timed out: ${this.diagnostics()}`));
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
      queued: this.messages,
      stdout: this.stdout.join('').slice(-4_000),
      stderr: this.stderr.join('').slice(-4_000),
    });
  }

  async shutdown(): Promise<void> {
    if (this.child.exitCode !== null || this.child.signalCode !== null) return;
    if (this.child.connected) this.child.send({ type: 'shutdown' });
    await new Promise<void>((resolve) => {
      const terminate = setTimeout(() => this.child.kill('SIGTERM'), 3_000);
      const kill = setTimeout(() => this.child.kill('SIGKILL'), 5_000);
      this.child.once('exit', () => {
        clearTimeout(terminate);
        clearTimeout(kill);
        resolve();
      });
    });
  }

  async killAndWait(signal: NodeJS.Signals = 'SIGKILL'): Promise<void> {
    if (this.child.exitCode !== null || this.child.signalCode !== null) return;
    await new Promise<void>((resolve) => {
      this.child.once('exit', () => resolve());
      this.child.kill(signal);
    });
  }
}

function manifest(entries: BackupManifest['entries'], backupId = 'bkp_test'): BackupManifest {
  return {
    backupId,
    createdAt: '2026-07-13T00:00:00.000Z',
    triggeredBy: 'manual',
    prefixes: [],
    entries,
    backend: 'file',
  };
}

function checksum(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}

async function listFiles(root: string, relative = '.'): Promise<string[]> {
  const directory = path.join(root, relative);
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const files: string[] = [];
  for (const entry of entries) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(root, child));
    else files.push(child);
  }
  return files;
}

function spawnRestoreWorker(repoRoot: string, fixtureRoot: string): RestoreWorkerHarness {
  const child = spawn(process.execPath, [
    path.join(repoRoot, 'node_modules/vite-node/vite-node.mjs'),
    '--root',
    repoRoot,
    '--config',
    path.join(repoRoot, 'vitest.config.ts'),
    path.join(repoRoot, 'src/lib/builder/backups/__tests__/restore-engine-worker.ts'),
  ], {
    cwd: fixtureRoot,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      BLOB_READ_WRITE_TOKEN: '',
      BUILDER_RESTORE_RUNTIME_ROOT: path.join(fixtureRoot, 'runtime-data'),
    },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    serialization: 'json',
  });
  return new RestoreWorkerHarness(child);
}

describe.sequential('backup restore engine shared local writer boundary', () => {
  let fixtureRoot = '';
  let runtimeRoot = '';
  const workers: RestoreWorkerHarness[] = [];

  beforeEach(async () => {
    fixtureRoot = await realpath(await mkdtemp(path.join(os.tmpdir(), 'builder-restore-engine-')));
    runtimeRoot = path.join(fixtureRoot, 'runtime-data');
    await mkdir(runtimeRoot);
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('BUILDER_RESTORE_RUNTIME_ROOT', runtimeRoot);
    mocks.manifest = null;
    mocks.put.mockReset();
  });

  afterEach(async () => {
    _setRestoreFileHookForTests(null);
    _setRestoreLeaseOptionsForTests(null);
    await Promise.all(workers.splice(0).map((worker) => worker.shutdown()));
    vi.unstubAllEnvs();
    await rm(fixtureRoot, { recursive: true, force: true });
  });

  it('preserves missing-backup and dry-run result semantics without touching storage', async () => {
    await expect(restoreBackup('missing')).resolves.toEqual({
      ok: false,
      restored: 0,
      failed: 0,
      errors: [{ key: '*', reason: 'backup not found' }],
    });

    mocks.manifest = manifest([
      { key: '../unsafe.json', body: { ignored: true } },
      { key: 'safe/value.json', body: { ignored: true } },
    ]);
    await expect(restoreBackup('bkp_test', { dryRun: true })).resolves.toEqual({
      ok: true,
      restored: 2,
      failed: 0,
      errors: [],
    });
    expect(await listFiles(runtimeRoot)).toEqual([]);
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it('atomically restores string and object bodies under nested safe parents', async () => {
    mocks.manifest = manifest([
      { key: 'builder-site/site-a/site.json', body: { siteId: 'site-a' } },
      { key: 'search/index.json', body: '{"raw":true}' },
    ]);

    await expect(restoreBackup('bkp_test')).resolves.toEqual({
      ok: true,
      restored: 2,
      failed: 0,
      errors: [],
    });
    expect(await readFile(path.join(runtimeRoot, 'builder-site/site-a/site.json'), 'utf8'))
      .toBe('{"siteId":"site-a"}');
    expect(await readFile(path.join(runtimeRoot, 'search/index.json'), 'utf8'))
      .toBe('{"raw":true}');

    const residue = (await listFiles(runtimeRoot)).filter((file) => (
      file.includes('.tmp') || file.includes('.lock') || file.includes('.lease')
    ));
    expect(residue).toEqual([]);
  });

  it('preserves Blob key behavior and reports Blob failures per entry', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token');
    mocks.manifest = manifest([
      { key: '/blob/absolute-looking.json', body: { first: true } },
      { key: '../blob-traversal-looking.json', body: '{"second":true}' },
    ]);
    mocks.put.mockRejectedValueOnce(new Error('provider unavailable')).mockResolvedValueOnce({});

    await expect(restoreBackup('bkp_test')).resolves.toEqual({
      ok: false,
      restored: 1,
      failed: 1,
      errors: [{ key: '/blob/absolute-looking.json', reason: 'provider unavailable' }],
    });
    expect(mocks.put).toHaveBeenNthCalledWith(1, '/blob/absolute-looking.json', '{"first":true}', {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    expect(mocks.put).toHaveBeenNthCalledWith(2, '../blob-traversal-looking.json', '{"second":true}', {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
  });

  it.each([
    '',
    '/absolute.json',
    'C:/absolute.json',
    '../escape.json',
    'safe/../../escape.json',
    'safe\\escape.json',
    'safe//empty.json',
    'safe/./dot.json',
    'safe/not-json.txt',
    'safe/file.json.bak',
    '.local-json-write-leases/control.json',
    'safe/.target.json',
    'safe/control\u0000.json',
    'safe/control\n.json',
  ])('rejects the unsafe file restore key %j before leasing or writing', async (unsafeKey) => {
    mocks.manifest = manifest([{ key: unsafeKey, body: { unsafe: true } }]);
    const events: RestoreFileTestEvent[] = [];
    _setRestoreFileHookForTests((event) => { events.push(event); });

    const result = await restoreBackup('bkp_test');
    expect(result).toMatchObject({ ok: false, restored: 0, failed: 1 });
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatchObject({ key: unsafeKey, reason: 'unsafe restore path' });
    expect(events).toEqual([]);
    expect(await listFiles(runtimeRoot)).toEqual([]);
  });

  it('blocks the entire file manifest when one entry fails preflight', async () => {
    const validPath = path.join(runtimeRoot, 'safe/value.json');
    await mkdir(path.dirname(validPath), { recursive: true });
    await writeFile(validPath, '{"original":true}', 'utf8');
    const before = checksum(await readFile(validPath));
    mocks.manifest = manifest([
      { key: 'safe/value.json', body: { replacement: true } },
      { key: '../escape.json', body: { escape: true } },
    ]);
    const events: RestoreFileTestEvent[] = [];
    _setRestoreFileHookForTests((event) => { events.push(event); });

    const result = await restoreBackup('bkp_test');
    expect(result).toEqual({
      ok: false,
      restored: 0,
      failed: 2,
      errors: [
        { key: 'safe/value.json', reason: 'restore preflight blocked' },
        { key: '../escape.json', reason: 'unsafe restore path' },
      ],
    });
    expect(checksum(await readFile(validPath))).toBe(before);
    expect(events).toEqual([]);
  });

  it('rejects symlink parents and leaf symlinks without mutating an outside sentinel', async () => {
    const outsideRoot = path.join(fixtureRoot, 'outside');
    const sentinel = path.join(outsideRoot, 'sentinel.json');
    await mkdir(outsideRoot);
    await writeFile(sentinel, '{"outside":"preserve"}', 'utf8');
    const sentinelBefore = checksum(await readFile(sentinel));
    await symlink(outsideRoot, path.join(runtimeRoot, 'linked-parent'), 'dir');
    await symlink(sentinel, path.join(runtimeRoot, 'linked-leaf.json'));

    mocks.manifest = manifest([
      { key: 'linked-parent/escaped.json', body: { unsafe: true } },
      { key: 'linked-leaf.json', body: { unsafe: true } },
    ]);
    const result = await restoreBackup('bkp_test');

    expect(result).toMatchObject({ ok: false, restored: 0, failed: 2 });
    expect(result.errors.map((entry) => entry.reason)).toEqual([
      'unsafe restore parent',
      'unsafe restore target',
    ]);
    expect(checksum(await readFile(sentinel))).toBe(sentinelBefore);
  });

  it('fails closed if a validated target parent is swapped for an outside symlink before install', async () => {
    const safeParent = path.join(runtimeRoot, 'safe');
    const parkedParent = path.join(runtimeRoot, 'safe-parked');
    const outsideRoot = path.join(fixtureRoot, 'outside-race');
    const outsideTarget = path.join(outsideRoot, 'value.json');
    await mkdir(safeParent);
    await mkdir(outsideRoot);
    mocks.manifest = manifest([{ key: 'safe/value.json', body: { escaped: true } }]);

    let swapped = false;
    _setRestoreFileHookForTests(async (event) => {
      if (swapped || event.stage !== 'before-entry-write') return;
      swapped = true;
      await rename(safeParent, parkedParent);
      await symlink(outsideRoot, safeParent, 'dir');
    });

    const result = await restoreBackup('bkp_test');
    expect(result).toMatchObject({ ok: false, restored: 0, failed: 1 });
    await expect(readFile(outsideTarget, 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(readFile(path.join(parkedParent, 'value.json'), 'utf8'))
      .rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('holds unique canonical targets in bytewise order before the first write', async () => {
    const keys = [
      'z.json',
      'A.json',
      'a/0.json',
      'aa.json',
      'A.json',
      '\uE000.json',
      '\u{10000}.json',
    ];
    mocks.manifest = manifest(keys.map((key, index) => ({ key, body: { index } })));
    const events: RestoreFileTestEvent[] = [];
    _setRestoreFileHookForTests((event) => { events.push(event); });

    const result = await restoreBackup('bkp_test');
    expect(result).toMatchObject({ ok: true, restored: keys.length, failed: 0 });

    const acquired = events.find((event) => event.stage === 'all-leases-acquired');
    expect(acquired?.stage).toBe('all-leases-acquired');
    if (!acquired || acquired.stage !== 'all-leases-acquired') throw new Error('missing lease event');
    const expectedTargets = [...new Set(keys.map((key) => path.join(runtimeRoot, key)))];
    expectedTargets.sort((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)));
    expect(acquired.targetPaths).toEqual(expectedTargets);
    expect(events[0]).toEqual(acquired);
    expect(events.filter((event) => event.stage === 'before-entry-write')).toHaveLength(keys.length);
  });

  it('reports an exact file entry failure and continues later entries while holding the batch', async () => {
    mocks.manifest = manifest([
      { key: 'partial/first.json', body: { first: true } },
      { key: 'partial/second.json', body: { second: true } },
    ]);
    let injected = false;
    _setRestoreFileHookForTests((event) => {
      if (!injected && event.stage === 'before-entry-write' && event.key === 'partial/first.json') {
        injected = true;
        throw new Error('fault-injected atomic install failure');
      }
    });

    await expect(restoreBackup('bkp_test')).resolves.toEqual({
      ok: false,
      restored: 1,
      failed: 1,
      errors: [{
        key: 'partial/first.json',
        reason: 'fault-injected atomic install failure',
      }],
    });
    await expect(readFile(path.join(runtimeRoot, 'partial/first.json'), 'utf8'))
      .rejects.toMatchObject({ code: 'ENOENT' });
    expect(await readFile(path.join(runtimeRoot, 'partial/second.json'), 'utf8'))
      .toBe('{"second":true}');
  });

  it('does not deadlock when two OS processes restore reverse-ordered manifests', async () => {
    const repoRoot = process.cwd();
    const backupsRoot = path.join(runtimeRoot, 'backups');
    await mkdir(backupsRoot);
    await writeFile(path.join(backupsRoot, 'forward.json'), JSON.stringify(manifest([
      { key: 'race/a.json', body: { writer: 'forward' } },
      { key: 'race/b.json', body: { writer: 'forward' } },
    ], 'forward')));
    await writeFile(path.join(backupsRoot, 'reverse.json'), JSON.stringify(manifest([
      { key: 'race/b.json', body: { writer: 'reverse' } },
      { key: 'race/a.json', body: { writer: 'reverse' } },
    ], 'reverse')));

    workers.push(
      spawnRestoreWorker(repoRoot, fixtureRoot),
      spawnRestoreWorker(repoRoot, fixtureRoot),
    );
    const booted = await Promise.all(workers.map((worker) => (
      worker.waitFor((message) => message.type === 'booted', 20_000)
    )));
    expect(new Set(booted.map((message) => message.pid)).size).toBe(2);

    workers[0].send({ type: 'start', backupId: 'forward' });
    workers[1].send({ type: 'start', backupId: 'reverse' });
    const results = await Promise.all(workers.map((worker) => (
      worker.waitFor((message) => message.type === 'result', 20_000)
    )));
    expect(results).toHaveLength(2);
    expect(results.map((message) => message.result)).toEqual([
      expect.objectContaining({ ok: true, restored: 2, failed: 0 }),
      expect.objectContaining({ ok: true, restored: 2, failed: 0 }),
    ]);

    const [a, b] = await Promise.all([
      readFile(path.join(runtimeRoot, 'race/a.json'), 'utf8').then(JSON.parse),
      readFile(path.join(runtimeRoot, 'race/b.json'), 'utf8').then(JSON.parse),
    ]);
    expect(a.writer).toBe(b.writer);
    expect(['forward', 'reverse']).toContain(a.writer);
  }, 30_000);

  it('recovers an atomic restore killed after detach before a competitor installs', async () => {
    const repoRoot = process.cwd();
    const backupsRoot = path.join(runtimeRoot, 'backups');
    const target = path.join(runtimeRoot, 'crash/value.json');
    await mkdir(backupsRoot);
    await mkdir(path.dirname(target));
    await writeFile(target, '{"writer":"original"}', 'utf8');
    await writeFile(path.join(backupsRoot, 'crash.json'), JSON.stringify(manifest([
      { key: 'crash/value.json', body: { writer: 'crashed-restore' } },
    ], 'crash')));
    await writeFile(path.join(backupsRoot, 'competitor.json'), JSON.stringify(manifest([
      { key: 'crash/value.json', body: { writer: 'competitor' } },
    ], 'competitor')));

    const crashed = spawnRestoreWorker(repoRoot, fixtureRoot);
    workers.push(crashed);
    await crashed.waitFor((message) => message.type === 'booted', 20_000);
    crashed.send({
      type: 'start',
      backupId: 'crash',
      crashStage: 'after-target-detach',
      lockStaleMs: 0,
    });
    await crashed.waitFor((message) => (
      message.type === 'paused' && message.stage === 'after-target-detach'
    ), 20_000);
    await crashed.killAndWait();

    const competitor = spawnRestoreWorker(repoRoot, fixtureRoot);
    workers.push(competitor);
    await competitor.waitFor((message) => message.type === 'booted', 20_000);
    competitor.send({ type: 'start', backupId: 'competitor', lockStaleMs: 0 });
    const completed = await competitor.waitFor((message) => message.type === 'result', 20_000);
    expect(completed.result).toEqual(expect.objectContaining({ ok: true, restored: 1, failed: 0 }));
    expect(await readFile(target, 'utf8')).toBe('{"writer":"competitor"}');

    const residue = (await listFiles(runtimeRoot)).filter((file) => (
      file.includes('.writer.')
      || file.includes('.local-json-write-leases')
      || file.includes('.tmp')
    ));
    expect(residue).toEqual([]);
  }, 40_000);
});
