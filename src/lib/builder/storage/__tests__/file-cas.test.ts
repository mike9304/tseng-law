import { createHash } from 'node:crypto';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  readdir,
  rename,
  rm,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  PersistenceBackendFailureError,
  PersistenceBackendUnavailableError,
  PersistenceConflictError,
  PersistenceInvalidDataError,
  PersistenceMissingError,
} from '../persistence-errors';
import {
  createFileCasStore,
  createFileVersionedJsonStore,
  type FileCasStoreOptions,
} from '../file-cas';

interface ExampleValue {
  revision: number;
  label: string;
}

let root: string;

function keyHash(key: string): string {
  return createHash('sha256').update(key, 'utf8').digest('hex');
}

function dataPath(key: string): string {
  return path.join(root, `cas-${keyHash(key)}.json`);
}

function lockPath(key: string): string {
  return path.join(root, `.cas-${keyHash(key)}.lock`);
}

function orphanTempPath(key: string, owner = 'dead-owner'): string {
  return path.join(root, `.cas-${keyHash(key)}.${owner}.tmp`);
}

function fakeClock(initial = 10_000): {
  now: () => number;
  sleep: (milliseconds: number) => Promise<void>;
} {
  let current = initial;
  return {
    now: () => current,
    sleep: async (milliseconds) => {
      current += Math.max(1, milliseconds);
      await new Promise<void>((resolve) => setImmediate(resolve));
    },
  };
}

function staleLock(key: string, pid: number, ownerId = 'stale-owner'): string {
  return `${JSON.stringify({
    format: 'file-cas-lock-v1',
    keyHash: keyHash(key),
    ownerId,
    hostname: os.hostname(),
    pid,
    createdAtMs: 1,
  })}\n`;
}

async function deadLocalPid(): Promise<number> {
  for (let pid = 2_000_000_000; pid > 1_999_999_900; pid -= 1) {
    try {
      process.kill(pid, 0);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ESRCH') return pid;
    }
  }
  throw new Error('could not find an unused pid for stale-lock fixture');
}

beforeEach(async () => {
  const created = await mkdtemp(path.join(os.tmpdir(), 'builder-file-cas-'));
  root = await realpath(created);
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await rm(root, { recursive: true, force: true });
});

describe('FileCasStore', () => {
  it('creates, reads, updates, and conditionally deletes a JSON record', async () => {
    const store = createFileCasStore<ExampleValue>({ root });

    const created = await store.create('booking/alpha', { revision: 1, label: 'created' });
    expect(created.value).toEqual({ revision: 1, label: 'created' });
    expect(created.version).toMatch(/^file-v1:[a-f0-9]{32}:[a-f0-9]{64}$/);
    await expect(store.read('booking/alpha')).resolves.toEqual(created);

    const updated = await store.compareAndSet(
      'booking/alpha',
      created.version,
      { revision: 2, label: 'updated' },
    );
    expect(updated.value).toEqual({ revision: 2, label: 'updated' });
    expect(updated.version).not.toBe(created.version);

    await expect(store.compareAndDelete('booking/alpha', updated.version)).resolves.toBeUndefined();
    await expect(store.read('booking/alpha')).rejects.toBeInstanceOf(PersistenceMissingError);
    expect((await readdir(root)).filter((entry) => entry.startsWith('.cas-'))).toEqual([]);
  });

  it('allows exactly one compare-and-set for the same version across store instances', async () => {
    const firstStore = createFileCasStore<ExampleValue>({ root, retryDelayMs: 0 });
    const secondStore = createFileCasStore<ExampleValue>({ root, retryDelayMs: 0 });
    const initial = await firstStore.create('shared', { revision: 0, label: 'initial' });

    const results = await Promise.allSettled([
      firstStore.compareAndSet('shared', initial.version, { revision: 1, label: 'first' }),
      secondStore.compareAndSet('shared', initial.version, { revision: 2, label: 'second' }),
    ]);

    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    const rejected = results.find((result): result is PromiseRejectedResult => result.status === 'rejected');
    expect(rejected?.reason).toBeInstanceOf(PersistenceConflictError);
    const final = await firstStore.read('shared');
    expect([1, 2]).toContain(final.value.revision);
    expect(final.version).not.toBe(initial.version);
  });

  it('rejects duplicate create without changing the original record', async () => {
    const store = createFileCasStore<ExampleValue>({ root });
    const original = await store.create('duplicate', { revision: 1, label: 'original' });

    await expect(
      store.create('duplicate', { revision: 2, label: 'replacement' }),
    ).rejects.toBeInstanceOf(PersistenceConflictError);
    await expect(store.read('duplicate')).resolves.toEqual(original);
  });

  it('never lets an old conditional delete remove a newer value', async () => {
    const store = createFileCasStore<ExampleValue>({ root });
    const old = await store.create('delete-race', { revision: 1, label: 'old' });
    const newer = await store.compareAndSet(
      'delete-race',
      old.version,
      { revision: 2, label: 'newer' },
    );

    await expect(store.compareAndDelete('delete-race', old.version)).rejects.toBeInstanceOf(
      PersistenceConflictError,
    );
    await expect(store.read('delete-race')).resolves.toEqual(newer);
  });

  it('prevents ABA when an identical JSON value is deleted and recreated', async () => {
    const store = createFileCasStore<ExampleValue>({ root });
    const value = { revision: 1, label: 'identical bytes at the value layer' };
    const first = await store.create('aba', value);
    await store.compareAndDelete('aba', first.version);
    const recreated = await store.create('aba', value);

    expect(recreated.value).toEqual(first.value);
    expect(recreated.version).not.toBe(first.version);
    await expect(store.compareAndSet('aba', first.version, value)).rejects.toBeInstanceOf(
      PersistenceConflictError,
    );
    await expect(store.compareAndDelete('aba', first.version)).rejects.toBeInstanceOf(
      PersistenceConflictError,
    );
    await expect(store.read('aba')).resolves.toEqual(recreated);
  });

  it('maps a disappeared conditional target to conflict instead of missing', async () => {
    const store = createFileCasStore<ExampleValue>({ root });

    await expect(
      store.compareAndSet('gone', 'file-v1:expected', { revision: 2, label: 'no recreate' }),
    ).rejects.toBeInstanceOf(PersistenceConflictError);
    await expect(store.compareAndDelete('gone', 'file-v1:expected')).rejects.toBeInstanceOf(
      PersistenceConflictError,
    );
    await expect(store.read('gone')).rejects.toBeInstanceOf(PersistenceMissingError);
  });

  it('makes concurrent update versus delete of one token choose one winner and one conflict', async () => {
    const firstStore = createFileCasStore<ExampleValue>({ root, retryDelayMs: 0 });
    const secondStore = createFileCasStore<ExampleValue>({ root, retryDelayMs: 0 });
    const initial = await firstStore.create('update-delete', { revision: 1, label: 'initial' });

    const results = await Promise.allSettled([
      firstStore.compareAndSet(
        'update-delete',
        initial.version,
        { revision: 2, label: 'updated' },
      ),
      secondStore.compareAndDelete('update-delete', initial.version),
    ]);

    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    const rejected = results.find((result): result is PromiseRejectedResult => result.status === 'rejected');
    expect(rejected?.reason).toBeInstanceOf(PersistenceConflictError);
    const readResult = await firstStore.read('update-delete').then(
      (record) => ({ kind: 'record' as const, record }),
      (error: unknown) => ({ kind: 'error' as const, error }),
    );
    if (readResult.kind === 'record') {
      expect(readResult.record.value).toEqual({ revision: 2, label: 'updated' });
    } else {
      expect(readResult.error).toBeInstanceOf(PersistenceMissingError);
    }
  });

  it('distinguishes a missing record from invalid data', async () => {
    const store = createFileCasStore<ExampleValue>({ root });
    await expect(store.read('missing')).rejects.toBeInstanceOf(PersistenceMissingError);

    await store.create('invalid', { revision: 1, label: 'valid first' });
    await writeFile(dataPath('invalid'), '{broken-json', 'utf8');
    await expect(store.read('invalid')).rejects.toBeInstanceOf(PersistenceInvalidDataError);
    await expect(
      store.compareAndSet('invalid', 'not-a-real-version', { revision: 2, label: 'nope' }),
    ).rejects.toBeInstanceOf(PersistenceInvalidDataError);
  });

  it.each([
    '../escape',
    'a/../escape',
    '/absolute',
    'a//b',
    './dot',
    'windows\\escape',
    'nul\0byte',
    '',
  ])('rejects unsafe key %j before touching the filesystem', async (key) => {
    const store = createFileCasStore<ExampleValue>({ root });
    const before = await readdir(root);
    await expect(store.read(key)).rejects.toBeInstanceOf(PersistenceInvalidDataError);
    expect(await readdir(root)).toEqual(before);
  });

  it('rejects a symlinked or non-canonical root', async () => {
    const alias = `${root}-alias`;
    await symlink(root, alias, 'dir');
    try {
      const store = createFileCasStore<ExampleValue>({ root: alias });
      await expect(store.read('anything')).rejects.toBeInstanceOf(PersistenceInvalidDataError);
    } finally {
      await unlink(alias);
    }
  });

  it('rejects relative, normalized-through-parent, and filesystem-root store roots', () => {
    expect(() => createFileCasStore<ExampleValue>({ root: 'relative/store' })).toThrow(
      PersistenceInvalidDataError,
    );
    expect(() => createFileCasStore<ExampleValue>({ root: `${root}/../${path.basename(root)}` })).toThrow(
      PersistenceInvalidDataError,
    );
    expect(() => createFileCasStore<ExampleValue>({ root: path.parse(root).root })).toThrow(
      PersistenceInvalidDataError,
    );
  });

  it('rejects a symbolic-link data record and does not read its target', async () => {
    const store = createFileCasStore<ExampleValue>({ root });
    await store.create('symlink-data', { revision: 1, label: 'before' });
    const outside = path.join(path.dirname(root), `outside-${path.basename(root)}.json`);
    await writeFile(outside, JSON.stringify({ secret: true }), 'utf8');
    await unlink(dataPath('symlink-data'));
    await symlink(outside, dataPath('symlink-data'));
    try {
      await expect(store.read('symlink-data')).rejects.toBeInstanceOf(PersistenceInvalidDataError);
      expect(await readFile(outside, 'utf8')).toBe(JSON.stringify({ secret: true }));
    } finally {
      await rm(outside, { force: true });
    }
  });

  it('rejects a symbolic-link lock instead of following or replacing it', async () => {
    const key = 'symlink-lock';
    const outside = path.join(path.dirname(root), `outside-${path.basename(root)}.lock`);
    await writeFile(outside, 'outside lock', 'utf8');
    await symlink(outside, lockPath(key));
    const store = createFileCasStore<ExampleValue>({ root, acquireTimeoutMs: 0, maxLockAttempts: 1 });
    try {
      await expect(store.create(key, { revision: 1, label: 'blocked' })).rejects.toBeInstanceOf(
        PersistenceInvalidDataError,
      );
      expect(await readFile(outside, 'utf8')).toBe('outside lock');
      expect((await lstat(lockPath(key))).isSymbolicLink()).toBe(true);
    } finally {
      await rm(outside, { force: true });
    }
  });

  it('reclaims only a stale local lock whose owning process is confirmed dead', async () => {
    const key = 'dead-owner';
    await writeFile(lockPath(key), staleLock(key, await deadLocalPid()), { mode: 0o600 });
    const clock = fakeClock();
    const store = createFileCasStore<ExampleValue>({
      root,
      staleLockPolicy: 'recover-local-dead-owner',
      lockStaleMs: 10,
      acquireTimeoutMs: 100,
      maxLockAttempts: 20,
      ...clock,
    });

    const created = await store.create(key, { revision: 1, label: 'recovered' });
    expect(created.value.label).toBe('recovered');
    await expect(lstat(lockPath(key))).rejects.toMatchObject({ code: 'ENOENT' });
    expect((await readdir(root)).filter((entry) => entry.endsWith('.stale'))).toEqual([]);
  });

  it('fails closed for a stale-looking lock whose local owner is still alive', async () => {
    const key = 'live-owner';
    const original = staleLock(key, process.pid, 'still-live');
    await writeFile(lockPath(key), original, { mode: 0o600 });
    const clock = fakeClock();
    const store = createFileCasStore<ExampleValue>({
      root,
      staleLockPolicy: 'recover-local-dead-owner',
      lockStaleMs: 10,
      acquireTimeoutMs: 0,
      maxLockAttempts: 1,
      ...clock,
    });

    await expect(store.create(key, { revision: 1, label: 'must not write' })).rejects.toBeInstanceOf(
      PersistenceBackendUnavailableError,
    );
    expect(await readFile(lockPath(key), 'utf8')).toBe(original);
    await expect(store.read(key)).rejects.toBeInstanceOf(PersistenceMissingError);
  });

  it('fails closed without deleting a valid crashed stale reclaim guard', async () => {
    const key = 'crashed-reclaimer';
    const pid = await deadLocalPid();
    const lockBytes = staleLock(key, pid, 'original-dead-writer');
    const guardBytes = staleLock(key, pid, 'crashed-reclaimer');
    const reclaimPath = path.join(root, `.cas-${keyHash(key)}.reclaim`);
    await writeFile(lockPath(key), lockBytes, { mode: 0o600 });
    await writeFile(reclaimPath, guardBytes, { mode: 0o600 });
    const clock = fakeClock();
    const store = createFileCasStore<ExampleValue>({
      root,
      staleLockPolicy: 'recover-local-dead-owner',
      lockStaleMs: 10,
      acquireTimeoutMs: 100,
      maxLockAttempts: 20,
      ...clock,
    });

    await expect(store.create(key, { revision: 1, label: 'blocked safely' })).rejects.toBeInstanceOf(
      PersistenceBackendUnavailableError,
    );
    expect(await readFile(lockPath(key), 'utf8')).toBe(lockBytes);
    expect(await readFile(reclaimPath, 'utf8')).toBe(guardBytes);
    await expect(store.read(key)).rejects.toBeInstanceOf(PersistenceMissingError);
  });

  it('ignores empty or partial orphan control candidates left before atomic publication', async () => {
    const key = 'orphan-control-candidates';
    const prefix = `.cas-${keyHash(key)}.`;
    const emptyCandidate = path.join(root, `${prefix}dead.lock-candidate`);
    const partialCandidate = path.join(root, `${prefix}dead.reclaim-candidate`);
    await writeFile(emptyCandidate, '', { mode: 0o600 });
    await writeFile(partialCandidate, '{partial-owner-envelope', { mode: 0o600 });
    const store = createFileCasStore<ExampleValue>({ root });

    await expect(store.create(key, { revision: 1, label: 'published atomically' })).resolves.toMatchObject({
      value: { revision: 1, label: 'published atomically' },
    });
    expect(await readFile(emptyCandidate, 'utf8')).toBe('');
    expect(await readFile(partialCandidate, 'utf8')).toBe('{partial-owner-envelope');
    await expect(store.read(key)).resolves.toMatchObject({
      value: { revision: 1, label: 'published atomically' },
    });
  });

  it('serializes competing stale-lock reclaimers without deleting the winner lock', async () => {
    const key = 'two-reclaimers';
    await writeFile(lockPath(key), staleLock(key, await deadLocalPid()), { mode: 0o600 });
    const options = {
      root,
      staleLockPolicy: 'recover-local-dead-owner' as const,
      lockStaleMs: 10,
      acquireTimeoutMs: 5_000,
      retryDelayMs: 0,
      maxLockAttempts: 5_000,
    };
    const stores = [createFileCasStore<ExampleValue>(options), createFileCasStore<ExampleValue>(options)];

    const results = await Promise.allSettled([
      stores[0]!.create(key, { revision: 1, label: 'first' }),
      stores[1]!.create(key, { revision: 2, label: 'second' }),
    ]);

    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    const rejected = results.find((result): result is PromiseRejectedResult => result.status === 'rejected');
    expect(rejected?.reason).toBeInstanceOf(PersistenceConflictError);
    expect((await readdir(root)).filter((entry) => entry.endsWith('.lock') || entry.endsWith('.stale'))).toEqual([]);
    expect([1, 2]).toContain((await stores[0]!.read(key)).value.revision);
  });

  it('ignores an orphan temp for recovery while never deleting a temp it does not own', async () => {
    const key = 'orphan-temp';
    const orphan = orphanTempPath(key);
    await writeFile(orphan, 'partial bytes from a dead writer', { mode: 0o600 });
    const store = createFileCasStore<ExampleValue>({ root, orphanTempPolicy: 'ignore' });

    await expect(store.create(key, { revision: 1, label: 'canonical' })).resolves.toMatchObject({
      value: { revision: 1, label: 'canonical' },
    });
    expect(await readFile(orphan, 'utf8')).toBe('partial bytes from a dead writer');
    await expect(store.read(key)).resolves.toMatchObject({ value: { revision: 1, label: 'canonical' } });
  });

  it('offers a fail-closed mutation policy when an orphan temp needs operator review', async () => {
    const key = 'orphan-fail-closed';
    const orphan = orphanTempPath(key);
    await writeFile(orphan, 'partial bytes', { mode: 0o600 });
    const store = createFileCasStore<ExampleValue>({
      root,
      orphanTempPolicy: 'fail-closed',
      acquireTimeoutMs: 0,
    });

    await expect(store.create(key, { revision: 1, label: 'blocked' })).rejects.toBeInstanceOf(
      PersistenceBackendUnavailableError,
    );
    expect(await readFile(orphan, 'utf8')).toBe('partial bytes');
    await expect(store.read(key)).rejects.toBeInstanceOf(PersistenceMissingError);
  });

  it('fails closed if the canonical root is replaced after first use', async () => {
    const store = createFileCasStore<ExampleValue>({ root });
    await expect(store.read('missing')).rejects.toBeInstanceOf(PersistenceMissingError);

    const originalRoot = `${root}-original`;
    await rename(root, originalRoot);
    await mkdir(root, { mode: 0o700 });
    try {
      await expect(store.read('missing')).rejects.toBeInstanceOf(PersistenceBackendUnavailableError);
    } finally {
      await rm(root, { recursive: true, force: true });
      await rename(originalRoot, root);
    }
  });

  it('returns the JSON-persisted representation rather than a lossy in-memory input', async () => {
    const store = createFileCasStore<{ finite: number | null; omitted?: string }>({ root });
    const value = { finite: Number.NaN, omitted: undefined } as unknown as {
      finite: number | null;
      omitted?: string;
    };

    const created = await store.create('json-semantics', value);
    expect(created.value).toEqual({ finite: null });
    await expect(store.read('json-semantics')).resolves.toEqual(created);
  });

  it('defaults production local mutations to fail-closed while keeping reads available', async () => {
    const setupStore = createFileCasStore<ExampleValue>({
      root,
      productionMutationPolicy: 'allow',
    });
    const existing = await setupStore.create('production-existing', {
      revision: 1,
      label: 'readable',
    });
    vi.stubEnv('NODE_ENV', 'production');
    const store = createFileVersionedJsonStore<ExampleValue>({ root });
    const before = await readdir(root);

    await expect(store.read('production-existing')).resolves.toEqual(existing);
    await expect(
      store.create('production-new', { revision: 1, label: 'blocked' }),
    ).rejects.toBeInstanceOf(PersistenceBackendUnavailableError);
    await expect(
      store.compareAndSet('production-existing', existing.version, {
        revision: 2,
        label: 'blocked',
      }),
    ).rejects.toBeInstanceOf(PersistenceBackendUnavailableError);
    await expect(
      store.compareAndDelete('production-existing', existing.version),
    ).rejects.toBeInstanceOf(PersistenceBackendUnavailableError);
    expect(await readdir(root)).toEqual(before);

    const explicitlyAllowed = createFileCasStore<ExampleValue>({
      root,
      productionMutationPolicy: 'allow',
    });
    await expect(
      explicitlyAllowed.compareAndSet('production-existing', existing.version, {
        revision: 2,
        label: 'explicitly allowed',
      }),
    ).resolves.toMatchObject({
      value: { revision: 2, label: 'explicitly allowed' },
    });
  });

  it('rejects invalid runtime policy enum values instead of widening safety', () => {
    const invalidOptions: Array<Partial<FileCasStoreOptions>> = [
      { staleLockPolicy: 'unsafe' as FileCasStoreOptions['staleLockPolicy'] },
      { orphanTempPolicy: 'delete' as FileCasStoreOptions['orphanTempPolicy'] },
      { productionMutationPolicy: 'maybe' as FileCasStoreOptions['productionMutationPolicy'] },
    ];

    for (const invalid of invalidOptions) {
      expect(() => createFileCasStore<ExampleValue>({ root, ...invalid })).toThrow(
        PersistenceInvalidDataError,
      );
    }
  });

  it('normalizes injected clock and retry-wait failures without mutating data', async () => {
    const invalidClock = createFileCasStore<ExampleValue>({ root, now: () => Number.NaN });
    await expect(
      invalidClock.create('clock-failure', { revision: 1, label: 'blocked' }),
    ).rejects.toBeInstanceOf(PersistenceBackendFailureError);
    expect(await readdir(root)).toEqual([]);

    const key = 'sleep-failure';
    const liveLock = staleLock(key, process.pid, 'live-during-sleep');
    await writeFile(lockPath(key), liveLock, { mode: 0o600 });
    const store = createFileCasStore<ExampleValue>({
      root,
      now: () => 10_000,
      sleep: async () => {
        throw new Error('injected retry wait failure');
      },
      acquireTimeoutMs: 100,
      retryDelayMs: 1,
      maxLockAttempts: 2,
    });

    await expect(
      store.create(key, { revision: 1, label: 'blocked' }),
    ).rejects.toBeInstanceOf(PersistenceBackendFailureError);
    expect(await readFile(lockPath(key), 'utf8')).toBe(liveLock);
    await expect(store.read(key)).rejects.toBeInstanceOf(PersistenceMissingError);
  });
});
