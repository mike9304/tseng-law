import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import {
  lstat,
  link,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  SAFE_LOCAL_FS_SECURITY_MODEL,
  SafeLocalFsSafetyError,
  _setSafeLocalFsHookForTests,
  isSafeLocalFsNotFoundError,
  isSafeLocalFsPlatformSupported,
  openSafeLocalFsRoot,
  type SafeLocalFsTestHookStage,
} from '../safe-local-fs';

function checksum(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}

async function waitForPath(filePath: string, child: ReturnType<typeof spawn>): Promise<void> {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      await lstat(filePath);
      return;
    } catch (error) {
      if (!(error instanceof Error) || (error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error('safe local fs crash worker exited before reaching its marker');
    }
    await new Promise<void>((resolve) => setTimeout(resolve, 10));
  }
  throw new Error('safe local fs crash worker marker timed out');
}

describe.sequential('safe local fs physical containment', () => {
  let fixtureRoot: string;
  let allowedRoot: string;
  let outsideRoot: string;
  let sentinelPath: string;
  let sentinelChecksum: string;

  beforeEach(async () => {
    fixtureRoot = await mkdtemp(path.join(os.tmpdir(), 'safe-local-fs-'));
    allowedRoot = path.join(fixtureRoot, 'allowed');
    outsideRoot = path.join(fixtureRoot, 'outside');
    sentinelPath = path.join(outsideRoot, 'sentinel.txt');
    await mkdir(allowedRoot);
    await mkdir(outsideRoot);
    await writeFile(sentinelPath, 'outside sentinel: never mutate', 'utf8');
    sentinelChecksum = checksum(await readFile(sentinelPath));
  });

  afterEach(async () => {
    _setSafeLocalFsHookForTests(null);
    await rm(fixtureRoot, { recursive: true, force: true });
  });

  async function expectSentinelUnchanged(): Promise<void> {
    expect(checksum(await readFile(sentinelPath))).toBe(sentinelChecksum);
  }

  function injectOnce(
    expectedStage: SafeLocalFsTestHookStage,
    injection: (absolutePath: string) => void | Promise<void>,
  ): void {
    let injected = false;
    _setSafeLocalFsHookForTests(async (stage, absolutePath) => {
      if (!injected && stage === expectedStage) {
        injected = true;
        await injection(absolutePath);
      }
    });
  }

  it('documents the portable Node residual ancestor race instead of claiming openat safety', () => {
    expect(SAFE_LOCAL_FS_SECURITY_MODEL).toEqual({
      ancestorTraversal: 'detect-but-cannot-portably-eliminate',
      requiredForHostileLocalWriters: 'native-dirfd-openat-sandbox',
    });
  });

  it('requires an existing non-symlink directory as the allowed root', async () => {
    const rootLink = path.join(fixtureRoot, 'allowed-link');
    await symlink(allowedRoot, rootLink, 'dir');

    await expect(openSafeLocalFsRoot(rootLink)).rejects.toMatchObject({
      code: 'symlink_rejected',
    });
    await expect(openSafeLocalFsRoot(path.join(fixtureRoot, 'missing'))).rejects.toMatchObject({
      code: 'unsafe_root',
    });
  });

  it('creates directories and uses exclusive or overwrite semantics without path escapes', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await safe.ensureDirectory('assets/ko');
    await safe.writeFile('assets/ko/image.bin', Buffer.from('first'));

    await expect(safe.writeFile('assets/ko/image.bin', Buffer.from('second'))).rejects.toMatchObject({
      code: 'already_exists',
      errno: 'EEXIST',
    });
    await safe.writeFile('assets/ko/image.bin', Buffer.from('second'), { overwrite: true });

    expect(await safe.readFile('assets/ko/image.bin')).toEqual(Buffer.from('second'));
    const files = await safe.listRegularFiles('assets/ko');
    expect(files).toHaveLength(1);
    expect(files[0]).toMatchObject({ name: 'image.bin', size: 6 });
    await expect(safe.readFile('../outside/sentinel.txt')).rejects.toBeInstanceOf(SafeLocalFsSafetyError);
    await expect(safe.readFile('assets/../outside.txt')).rejects.toMatchObject({ code: 'unsafe_path' });
    await expect(safe.readFile('assets\\..\\outside.txt')).rejects.toMatchObject({ code: 'unsafe_path' });
    await expectSentinelUnchanged();
  });

  it('rejects an existing ancestor symlink and a leaf symlink', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await symlink(outsideRoot, path.join(allowedRoot, 'linked-parent'), 'dir');
    await symlink(sentinelPath, path.join(allowedRoot, 'linked-file'));

    await expect(safe.readFile('linked-parent/sentinel.txt')).rejects.toMatchObject({
      code: 'symlink_rejected',
    });
    await expect(safe.readFile('linked-file')).rejects.toMatchObject({
      code: 'symlink_rejected',
    });
    await expectSentinelUnchanged();
  });

  it('rejects a hard-linked outside leaf so containment is not only lexical', async () => {
    const linkedSentinel = path.join(allowedRoot, 'hard-linked-sentinel.txt');
    await link(sentinelPath, linkedSentinel);
    const safe = await openSafeLocalFsRoot(allowedRoot);

    await expect(safe.readFile('hard-linked-sentinel.txt')).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    await expect(
      safe.writeFile('hard-linked-sentinel.txt', 'must not mutate', { overwrite: true }),
    ).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(safe.removeFile('hard-linked-sentinel.txt')).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    await expectSentinelUnchanged();
  });

  it('fails closed when a read leaf is replaced by a symlink after preflight', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    await writeFile(target, 'inside', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);

    injectOnce('after-preflight-before-open', async (absolutePath) => {
      expect(absolutePath).toBe(path.join(safe.root, 'target.txt'));
      await unlink(target);
      await symlink(sentinelPath, target);
    });

    await expect(safe.readFile('target.txt')).rejects.toMatchObject({ code: 'symlink_rejected' });
    await expectSentinelUnchanged();
  });

  it('fails closed when a read path is replaced after the descriptor opens', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    const parked = path.join(allowedRoot, 'target.parked');
    await writeFile(target, 'inside', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);

    injectOnce('after-open-before-identity-check', async (absolutePath) => {
      expect(absolutePath).toBe(path.join(safe.root, 'target.txt'));
      await rename(target, parked);
      await symlink(sentinelPath, target);
    });

    await expect(safe.readFile('target.txt')).rejects.toBeInstanceOf(SafeLocalFsSafetyError);
    await expectSentinelUnchanged();
  });

  it('revalidates descriptor identity immediately before reading bytes', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    const parked = path.join(allowedRoot, 'target.parked');
    await writeFile(target, 'inside', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);

    injectOnce('after-identity-check-before-read', async (absolutePath) => {
      expect(absolutePath).toBe(path.join(safe.root, 'target.txt'));
      await rename(target, parked);
      await symlink(sentinelPath, target);
    });

    await expect(safe.readFile('target.txt')).rejects.toMatchObject({ code: 'symlink_rejected' });
    await expectSentinelUnchanged();
  });

  it('does not create outside the root when an ancestor is swapped after write preflight', async () => {
    const parent = path.join(allowedRoot, 'assets');
    const parked = path.join(allowedRoot, 'assets.parked');
    await mkdir(parent);
    const safe = await openSafeLocalFsRoot(allowedRoot);

    injectOnce('after-preflight-before-open', async (tempPath) => {
      expect(path.dirname(tempPath)).toBe(path.join(safe.root, 'assets'));
      await rename(parent, parked);
      await symlink(outsideRoot, parent, 'dir');
    });

    await expect(safe.writeFile('assets/new.txt', Buffer.from('never outside'))).rejects.toMatchObject({
      code: 'symlink_rejected',
    });
    await expect(readFile(path.join(outsideRoot, 'new.txt'))).rejects.toMatchObject({ code: 'ENOENT' });
    await expectSentinelUnchanged();
  });

  it('does not overwrite an outside sentinel when a target leaf is swapped before install', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    await writeFile(target, 'inside', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);

    injectOnce('after-preflight-before-rename', async (absolutePath) => {
      expect(absolutePath).toBe(path.join(safe.root, 'target.txt'));
      await unlink(target);
      await symlink(sentinelPath, target);
    });

    await expect(
      safe.writeFile('target.txt', Buffer.from('must not reach sentinel'), { overwrite: true }),
    ).rejects.toMatchObject({ code: 'identity_race' });
    await expectSentinelUnchanged();
  });

  it('rejects a directory listing containing a symlink rather than silently following it', async () => {
    const directory = path.join(allowedRoot, 'assets');
    await mkdir(directory);
    await writeFile(path.join(directory, 'inside.txt'), 'inside', 'utf8');
    await symlink(sentinelPath, path.join(directory, 'outside.txt'));
    const safe = await openSafeLocalFsRoot(allowedRoot);

    await expect(safe.listRegularFiles('assets')).rejects.toMatchObject({
      code: 'symlink_rejected',
    });
    await expectSentinelUnchanged();
  });

  it('fails closed when an unlink leaf is replaced after preflight', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    await writeFile(target, 'inside', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);

    injectOnce('after-preflight-before-unlink', async (absolutePath) => {
      expect(absolutePath).toBe(path.join(safe.root, 'target.txt'));
      await unlink(target);
      await symlink(sentinelPath, target);
    });

    await expect(safe.removeFile('target.txt')).rejects.toMatchObject({ code: 'symlink_rejected' });
    await expectSentinelUnchanged();
  });

  it.each([
    'after-open-before-identity-check',
    'after-identity-check-before-write',
  ] as const)('cleans an owned replacement temp after %s failure', async (stage) => {
    const target = path.join(allowedRoot, 'target.txt');
    await writeFile(target, 'original', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);
    let tempPath = '';
    injectOnce(stage, (absolutePath) => {
      if (!path.basename(absolutePath).startsWith('.safe-local-fs-write-')) return;
      tempPath = absolutePath;
      throw new Error(`synthetic failure containing private path ${safe.root}`);
    });

    const failure = await safe.writeFile('target.txt', 'replacement', { overwrite: true })
      .then(() => null, (error: unknown) => error);
    expect(failure).toMatchObject({ code: 'io_failure' });
    expect(String(failure)).not.toContain(safe.root);
    expect(tempPath).not.toBe('');
    await expect(lstat(tempPath)).rejects.toMatchObject({ code: 'ENOENT' });
    expect(await readFile(target, 'utf8')).toBe('original');
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-'))).toEqual([]);
    await expectSentinelUnchanged();
  });

  it('removes an attacker-linked empty temp instead of exposing a partial exclusive target', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    const target = path.join(allowedRoot, 'target.txt');
    let tempPath = '';
    injectOnce('after-open-before-identity-check', async (absolutePath) => {
      if (!path.basename(absolutePath).startsWith('.safe-local-fs-write-')) return;
      tempPath = absolutePath;
      await link(absolutePath, target);
    });

    await expect(safe.writeFile('target.txt', 'complete payload')).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    expect(tempPath).not.toBe('');
    await expect(lstat(target)).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(lstat(tempPath)).rejects.toMatchObject({ code: 'ENOENT' });
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-'))).toEqual([]);
    await expectSentinelUnchanged();
  });

  it('never promotes a pending empty-temp alias after SIGKILL', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    const marker = path.join(fixtureRoot, 'linked-empty-worker-ready');
    const child = spawn(
      path.join(process.cwd(), 'node_modules', '.bin', 'vite-node'),
      [
        path.join(
          process.cwd(),
          'src/lib/builder/storage/__tests__/fixtures/safe-local-fs-crash-worker.ts',
        ),
        allowedRoot,
        marker,
        'after-open-before-identity-check',
        'false',
        'link-temp-to-target',
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'test' },
        stdio: ['ignore', 'ignore', 'pipe'],
      },
    );
    try {
      await waitForPath(marker, child);
      const exited = once(child, 'exit');
      child.kill('SIGKILL');
      await exited;
    } finally {
      if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    }

    expect((await lstat(target)).size).toBe(0);
    expect((await lstat(target)).nlink).toBe(2);
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await expect(safe.readFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });
    expect((await lstat(target)).nlink).toBe(2);
    await expectSentinelUnchanged();
  }, 20_000);

  it.each([
    { overwrite: false, expected: null },
    { overwrite: true, expected: 'old payload' },
  ])(
    'SIGKILL before temp write never exposes a partial final (overwrite=$overwrite)',
    async ({ overwrite, expected }) => {
      const target = path.join(allowedRoot, 'target.txt');
      if (overwrite) await writeFile(target, expected!, 'utf8');
      const marker = path.join(fixtureRoot, 'crash-worker-ready');
      const child = spawn(
        path.join(process.cwd(), 'node_modules', '.bin', 'vite-node'),
        [
          path.join(
            process.cwd(),
            'src/lib/builder/storage/__tests__/fixtures/safe-local-fs-crash-worker.ts',
          ),
          allowedRoot,
          marker,
          'after-identity-check-before-write',
          String(overwrite),
        ],
        {
          cwd: process.cwd(),
          env: { ...process.env, NODE_ENV: 'test' },
          stdio: ['ignore', 'ignore', 'pipe'],
        },
      );
      try {
        await waitForPath(marker, child);
        const exited = once(child, 'exit');
        child.kill('SIGKILL');
        await exited;
      } finally {
        if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
      }

      if (expected === null) {
        await expect(lstat(target)).rejects.toMatchObject({ code: 'ENOENT' });
      } else {
        expect(await readFile(target, 'utf8')).toBe(expected);
        expect((await lstat(target)).size).toBe(Buffer.byteLength(expected));
      }
      const safe = await openSafeLocalFsRoot(allowedRoot);
      expect((await safe.listRegularFiles()).map((entry) => entry.name)).toEqual(
        expected === null ? [] : ['target.txt'],
      );
      // A crashed single-link pending temp may remain hidden (it may be a live
      // writer); only its single-link safety shape is enforced, never promotion.
      const residue = (await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-write-'));
      for (const name of residue) {
        expect((await lstat(path.join(allowedRoot, name))).nlink).toBe(1);
      }
      await expectSentinelUnchanged();
    },
    20_000,
  );

  it('stays fail-closed after SIGKILL between link and temp cleanup', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    const marker = path.join(fixtureRoot, 'link-crash-worker-ready');
    const child = spawn(
      path.join(process.cwd(), 'node_modules', '.bin', 'vite-node'),
      [
        path.join(
          process.cwd(),
          'src/lib/builder/storage/__tests__/fixtures/safe-local-fs-crash-worker.ts',
        ),
        allowedRoot,
        marker,
        'after-exclusive-link-before-cleanup',
        'false',
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'test' },
        stdio: ['ignore', 'ignore', 'pipe'],
      },
    );
    try {
      await waitForPath(marker, child);
      const exited = once(child, 'exit');
      child.kill('SIGKILL');
      await exited;
    } finally {
      if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    }

    // The durable public link and its hidden ready alias both survive the
    // crash with complete bytes. A pathname-only alias is not trusted proof of
    // ownership, so the public target stays fail-closed and is never promoted.
    const targetStats = await lstat(target);
    expect(targetStats.size).toBe(Buffer.byteLength('complete payload'));
    expect(targetStats.nlink).toBe(2);
    expect(await readFile(target, 'utf8')).toBe('complete payload');

    const safe = await openSafeLocalFsRoot(allowedRoot);
    await expect(safe.readFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });

    // No reader-driven auto-promotion: both links and the identity remain.
    const afterRead = await lstat(target);
    expect(afterRead.nlink).toBe(2);
    expect(afterRead.dev).toBe(targetStats.dev);
    expect(afterRead.ino).toBe(targetStats.ino);
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-write-ready-'))).toHaveLength(1);
    await expectSentinelUnchanged();
  }, 20_000);

  it('rejects every safe API on an attacker-hardlinked public target and keeps both links', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    const targetDigest = createHash('sha256').update('target.txt', 'utf8').digest('hex').slice(0, 32);
    const alias = path.join(
      allowedRoot,
      `.safe-local-fs-write-ready-${targetDigest}-${'a'.repeat(32)}.tmp`,
    );
    // A hostile local writer forges a syntactically valid "ready" name with
    // arbitrary bytes and hard-links the public target to it.
    await writeFile(alias, 'hostile bytes', 'utf8');
    await link(alias, target);
    const identity = await lstat(target);
    expect(identity.nlink).toBe(2);

    const safe = await openSafeLocalFsRoot(allowedRoot);
    await expect(safe.readFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(safe.statFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(safe.listRegularFiles()).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(safe.writeFile('target.txt', 'attacker payload')).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    await expect(safe.writeFile('target.txt', 'attacker payload', { overwrite: true })).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    await expect(safe.removeFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });

    // No safe API mutated the durable bytes, identity, or link count.
    const after = await lstat(target);
    expect(after.nlink).toBe(2);
    expect(after.dev).toBe(identity.dev);
    expect(after.ino).toBe(identity.ino);
    expect(await readFile(target, 'utf8')).toBe('hostile bytes');
    expect(await readFile(alias, 'utf8')).toBe('hostile bytes');
    await expectSentinelUnchanged();
  });

  it('keeps a legitimate post-link SIGKILL fail-closed across stat, list, write, and remove', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    const marker = path.join(fixtureRoot, 'link-crash-worker-broad-ready');
    const child = spawn(
      path.join(process.cwd(), 'node_modules', '.bin', 'vite-node'),
      [
        path.join(
          process.cwd(),
          'src/lib/builder/storage/__tests__/fixtures/safe-local-fs-crash-worker.ts',
        ),
        allowedRoot,
        marker,
        'after-exclusive-link-before-cleanup',
        'false',
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'test' },
        stdio: ['ignore', 'ignore', 'pipe'],
      },
    );
    try {
      await waitForPath(marker, child);
      const exited = once(child, 'exit');
      child.kill('SIGKILL');
      await exited;
    } finally {
      if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    }

    const before = await lstat(target);
    expect(before.nlink).toBe(2);
    expect(await readFile(target, 'utf8')).toBe('complete payload');

    const safe = await openSafeLocalFsRoot(allowedRoot);
    await expect(safe.statFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(safe.listRegularFiles()).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(safe.writeFile('target.txt', 'competing')).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    await expect(safe.writeFile('target.txt', 'competing', { overwrite: true })).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    await expect(safe.removeFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });

    // Both links and the complete legitimate bytes remain untouched.
    const after = await lstat(target);
    expect(after.nlink).toBe(2);
    expect(after.dev).toBe(before.dev);
    expect(after.ino).toBe(before.ino);
    expect(await readFile(target, 'utf8')).toBe('complete payload');
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-write-ready-'))).toHaveLength(1);
    await expectSentinelUnchanged();
  }, 20_000);

  it('keeps a paused writer pending temp hidden from a concurrent list and then completes', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    let pendingTemp = '';
    let paused = false;
    let resumeWriter: () => void = () => undefined;
    const resumePromise = new Promise<void>((resolve) => {
      resumeWriter = resolve;
    });
    let notifyPaused: () => void = () => undefined;
    const pausedPromise = new Promise<void>((resolve) => {
      notifyPaused = resolve;
    });
    _setSafeLocalFsHookForTests(async (stage, absolutePath) => {
      if (paused || stage !== 'after-open-before-identity-check') return;
      if (!path.basename(absolutePath).startsWith('.safe-local-fs-write-pending-')) return;
      pendingTemp = absolutePath;
      paused = true;
      notifyPaused();
      await resumePromise;
    });

    const writePromise = safe.writeFile('target.txt', 'complete payload');
    await pausedPromise;

    // The live writer's single-link pending temp is present but unwritten.
    const pendingStats = await lstat(pendingTemp);
    expect(pendingStats.nlink).toBe(1);
    expect(pendingStats.size).toBe(0);

    // A concurrent reader sees no public files and never reclaims the live temp.
    const reader = await openSafeLocalFsRoot(allowedRoot);
    expect((await reader.listRegularFiles()).map((entry) => entry.name)).toEqual([]);
    const stillPending = await lstat(pendingTemp);
    expect(stillPending.nlink).toBe(1);

    resumeWriter();
    await expect(writePromise).resolves.toBeUndefined();
    _setSafeLocalFsHookForTests(null);

    expect(await readFile(path.join(allowedRoot, 'target.txt'), 'utf8')).toBe('complete payload');
    await expect(lstat(pendingTemp)).rejects.toMatchObject({ code: 'ENOENT' });
    await expectSentinelUnchanged();
  });

  it('keeps a durably committed target fail-closed when a third hardlink appears after commit', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    const target = path.join(safe.root, 'target.txt');
    const hostileAlias = path.join(safe.root, 'hostile-alias.txt');
    _setSafeLocalFsHookForTests(async (stage, absolutePath) => {
      if (stage !== 'after-exclusive-link-before-cleanup' || absolutePath !== target) return;
      await link(target, hostileAlias);
    });

    await expect(safe.writeFile('target.txt', 'complete payload')).rejects.toMatchObject({
      code: 'identity_race',
    });

    // The durable target bytes/identity remain; the public link is never rolled back.
    const targetStats = await lstat(target);
    expect(targetStats.nlink).toBe(3);
    expect(await readFile(target, 'utf8')).toBe('complete payload');
    expect(await readFile(hostileAlias, 'utf8')).toBe('complete payload');

    // A later safe read is fail-closed because the leaf is multi-linked.
    await expect(safe.readFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expectSentinelUnchanged();
  });

  it('preserves the complete new overwrite generation after SIGKILL post-rename fsync', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    await writeFile(target, 'old payload', 'utf8');
    const marker = path.join(fixtureRoot, 'overwrite-crash-worker-ready');
    const child = spawn(
      path.join(process.cwd(), 'node_modules', '.bin', 'vite-node'),
      [
        path.join(
          process.cwd(),
          'src/lib/builder/storage/__tests__/fixtures/safe-local-fs-crash-worker.ts',
        ),
        allowedRoot,
        marker,
        'after-directory-sync',
        'true',
        'pause-third-match',
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'test' },
        stdio: ['ignore', 'ignore', 'pipe'],
      },
    );
    try {
      await waitForPath(marker, child);
      const exited = once(child, 'exit');
      child.kill('SIGKILL');
      await exited;
    } finally {
      if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    }

    expect(await readFile(target, 'utf8')).toBe('complete payload');
    expect((await readdir(allowedRoot)).some((name) => name.startsWith('.safe-local-fs-replace-pending-'))).toBe(true);
    const safe = await openSafeLocalFsRoot(allowedRoot);
    expect(await safe.readFile('target.txt')).toEqual(Buffer.from('complete payload'));
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-'))).toEqual([]);
  }, 20_000);

  it('converges a SIGKILL-left pending delete tombstone to the deleted outcome', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    await writeFile(target, 'old payload', 'utf8');
    const marker = path.join(fixtureRoot, 'delete-crash-worker-ready');
    const child = spawn(
      path.join(process.cwd(), 'node_modules', '.bin', 'vite-node'),
      [
        path.join(
          process.cwd(),
          'src/lib/builder/storage/__tests__/fixtures/safe-local-fs-crash-worker.ts',
        ),
        allowedRoot,
        marker,
        'after-quarantine-before-delete',
        'false',
        'remove',
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'test' },
        stdio: ['ignore', 'ignore', 'pipe'],
      },
    );
    try {
      await waitForPath(marker, child);
      const exited = once(child, 'exit');
      child.kill('SIGKILL');
      await exited;
    } finally {
      if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    }

    await expect(lstat(target)).rejects.toMatchObject({ code: 'ENOENT' });
    expect((await readdir(allowedRoot)).some((name) => name.startsWith('.safe-local-fs-delete-pending-'))).toBe(true);
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await expect(safe.readFile('target.txt')).rejects.toMatchObject({ code: 'not_found' });
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-'))).toEqual([]);
  }, 30_000);

  it('fsyncs the containing directory after mkdir, installs, temp cleanup, and removal stages', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    const synced: string[] = [];
    _setSafeLocalFsHookForTests((stage, absolutePath) => {
      if (stage === 'after-directory-sync') synced.push(absolutePath);
    });

    await safe.ensureDirectory('durable');
    const durableRoot = path.join(safe.root, 'durable');
    await safe.writeFile('durable/item.txt', 'one');
    await safe.writeFile('durable/item.txt', 'two', { overwrite: true });
    await safe.removeFile('durable/item.txt');

    expect(synced.filter((entry) => entry === safe.root)).toHaveLength(1);
    expect(synced.filter((entry) => entry === durableRoot)).toHaveLength(11);
  });

  it('rolls an exclusive link back when its parent-directory commit fsync fails', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    const target = path.join(allowedRoot, 'target.txt');
    let syncCount = 0;
    _setSafeLocalFsHookForTests((stage, absolutePath) => {
      if (stage !== 'before-directory-sync' || absolutePath !== safe.root) return;
      syncCount += 1;
      if (syncCount === 2) throw new Error(`synthetic exclusive commit sync failure ${safe.root}`);
    });

    const failure = await safe.writeFile('target.txt', 'complete payload')
      .then(() => null, (error: unknown) => error);
    expect(failure).toMatchObject({ code: 'io_failure' });
    expect(String(failure)).not.toContain(safe.root);
    await expect(lstat(target)).rejects.toMatchObject({ code: 'ENOENT' });
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-'))).toEqual([]);
  });

  it('removes an associated target alias when the ready-temp directory fsync fails', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    const target = path.join(allowedRoot, 'target.txt');
    let pendingTemp = '';
    let injected = false;
    _setSafeLocalFsHookForTests(async (stage, absolutePath) => {
      if (stage === 'after-open-before-identity-check') pendingTemp = absolutePath;
      if (injected || stage !== 'before-directory-sync' || absolutePath !== safe.root) return;
      injected = true;
      const readyTemp = pendingTemp.replace('.safe-local-fs-write-pending-', '.safe-local-fs-write-ready-');
      await link(readyTemp, target);
      throw new Error(`synthetic ready sync failure ${safe.root}`);
    });

    await expect(safe.writeFile('target.txt', 'complete payload')).rejects.toMatchObject({
      code: 'io_failure',
    });
    await expect(lstat(target)).rejects.toMatchObject({ code: 'ENOENT' });
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-write-'))).toEqual([]);
  });

  it('rechecks an associated target after a failed exclusive rollback sync', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    const target = path.join(allowedRoot, 'target.txt');
    let readyTemp = '';
    let syncCount = 0;
    _setSafeLocalFsHookForTests(async (stage, absolutePath) => {
      if (stage === 'after-open-before-identity-check') {
        readyTemp = absolutePath.replace(
          '.safe-local-fs-write-pending-',
          '.safe-local-fs-write-ready-',
        );
      }
      if (stage !== 'before-directory-sync' || absolutePath !== safe.root) return;
      syncCount += 1;
      if (syncCount === 2) throw new Error('synthetic exclusive commit sync failure');
      if (syncCount === 3) {
        await link(readyTemp, target);
        throw new Error('synthetic rollback sync failure after relink');
      }
    });

    await expect(safe.writeFile('target.txt', 'complete payload')).rejects.toMatchObject({
      code: 'identity_race',
    });
    await expect(lstat(target)).rejects.toMatchObject({ code: 'ENOENT' });
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-write-'))).toEqual([]);
  });

  it('keeps a durably committed exclusive target when only temp-cleanup fsync fails', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    let syncCount = 0;
    _setSafeLocalFsHookForTests((stage, absolutePath) => {
      if (stage !== 'before-directory-sync' || absolutePath !== safe.root) return;
      syncCount += 1;
      if (syncCount === 3) throw new Error('synthetic exclusive cleanup sync failure');
    });

    await expect(safe.writeFile('target.txt', 'complete payload')).resolves.toBeUndefined();
    expect(await readFile(path.join(allowedRoot, 'target.txt'), 'utf8')).toBe('complete payload');
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-write-'))).toEqual([]);
  });

  it('rejects a committed write whose ready-temp unlink stays linked and stays fail-closed until operator cleanup', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    const target = path.join(allowedRoot, 'target.txt');
    let aliasPath = '';
    _setSafeLocalFsHookForTests(async (stage, absolutePath) => {
      if (stage !== 'before-committed-temp-unlink') return;
      aliasPath = absolutePath;
      throw new Error(`synthetic persistent temp unlink failure ${safe.root}`);
    });

    const failure = await safe.writeFile('target.txt', 'complete payload')
      .then(() => null, (error: unknown) => error);
    expect(failure).toMatchObject({ code: 'identity_race' });
    expect(String(failure)).not.toContain(safe.root);

    // The committed public target and its hidden ready alias still share one
    // inode with nlink === 2 and the committed bytes intact.
    expect(aliasPath).not.toBe('');
    const targetStats = await lstat(target);
    const aliasStats = await lstat(aliasPath);
    expect(targetStats.nlink).toBe(2);
    expect(aliasStats.nlink).toBe(2);
    expect(targetStats.dev).toBe(aliasStats.dev);
    expect(targetStats.ino).toBe(aliasStats.ino);
    expect(await readFile(target, 'utf8')).toBe('complete payload');
    expect(await readFile(aliasPath, 'utf8')).toBe('complete payload');

    // No safe API ever reported success for the unusable multi-linked leaf,
    // and every subsequent API stays fail-closed without mutating it.
    await expect(safe.readFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(safe.statFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(safe.listRegularFiles()).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(safe.writeFile('target.txt', 'again')).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(safe.writeFile('target.txt', 'again', { overwrite: true })).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    await expect(safe.removeFile('target.txt')).rejects.toMatchObject({ code: 'hardlink_rejected' });

    const after = await lstat(target);
    expect(after.nlink).toBe(2);
    expect(after.dev).toBe(targetStats.dev);
    expect(after.ino).toBe(targetStats.ino);
    expect(await readFile(target, 'utf8')).toBe('complete payload');
    expect(await readFile(aliasPath, 'utf8')).toBe('complete payload');

    // Explicit operator removal of the validated alias restores safe
    // readability without changing the committed target bytes or identity.
    await unlink(aliasPath);
    const restored = await lstat(target);
    expect(restored.nlink).toBe(1);
    expect(restored.dev).toBe(targetStats.dev);
    expect(restored.ino).toBe(targetStats.ino);
    expect(await readFile(target, 'utf8')).toBe('complete payload');
    expect(await safe.readFile('target.txt')).toEqual(Buffer.from('complete payload'));
    expect((await safe.listRegularFiles()).map((entry) => entry.name)).toEqual(['target.txt']);
    await expectSentinelUnchanged();
  });

  it('succeeds only after a transient ready-temp unlink failure once the retry removes the alias', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    const target = path.join(allowedRoot, 'target.txt');
    let aliasPath = '';
    let thrown = false;
    _setSafeLocalFsHookForTests(async (stage, absolutePath) => {
      if (stage !== 'before-committed-temp-unlink') return;
      aliasPath = absolutePath;
      if (thrown) return;
      thrown = true;
      throw new Error(`synthetic transient temp unlink failure ${safe.root}`);
    });

    await expect(safe.writeFile('target.txt', 'complete payload')).resolves.toBeUndefined();

    // Success is reported only after the alias is actually gone and the target
    // is the sole remaining link to its inode.
    expect(aliasPath).not.toBe('');
    await expect(lstat(aliasPath)).rejects.toMatchObject({ code: 'ENOENT' });
    const targetStats = await lstat(target);
    expect(targetStats.nlink).toBe(1);
    expect(await readFile(target, 'utf8')).toBe('complete payload');
    expect(await safe.readFile('target.txt')).toEqual(Buffer.from('complete payload'));
    expect((await safe.listRegularFiles()).map((entry) => entry.name)).toEqual(['target.txt']);
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-write-'))).toEqual([]);
    await expectSentinelUnchanged();
  });

  it.each([1, 2, 3, 4])(
    'restores old bytes when overwrite directory fsync stage %i fails before commit',
    async (failureAt) => {
      const target = path.join(allowedRoot, 'target.txt');
      await writeFile(target, 'old payload', 'utf8');
      const safe = await openSafeLocalFsRoot(allowedRoot);
      let syncCount = 0;
      _setSafeLocalFsHookForTests((stage, absolutePath) => {
        if (stage !== 'before-directory-sync' || absolutePath !== safe.root) return;
        syncCount += 1;
        if (syncCount === failureAt) {
          throw new Error(`synthetic overwrite sync failure ${failureAt} ${safe.root}`);
        }
      });

      const failure = await safe.writeFile('target.txt', 'new payload', { overwrite: true })
        .then(() => null, (error: unknown) => error);
      expect(failure).toMatchObject({ code: 'io_failure' });
      expect(String(failure)).not.toContain(safe.root);
      expect(await readFile(target, 'utf8')).toBe('old payload');
      expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-'))).toEqual([]);
    },
  );

  it('keeps new bytes when only committed overwrite-backup cleanup fsync fails', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    await writeFile(target, 'old payload', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);
    let syncCount = 0;
    _setSafeLocalFsHookForTests((stage, absolutePath) => {
      if (stage !== 'before-directory-sync' || absolutePath !== safe.root) return;
      syncCount += 1;
      if (syncCount === 5) throw new Error(`synthetic committed cleanup sync failure ${safe.root}`);
    });

    await expect(
      safe.writeFile('target.txt', 'new payload', { overwrite: true }),
    ).resolves.toBeUndefined();
    expect(await readFile(target, 'utf8')).toBe('new payload');
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-'))).toEqual([]);
  });

  it('rejects a regular-file generation swap during overwrite without deleting the competitor', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    const parkedOriginal = path.join(allowedRoot, 'target.original');
    await writeFile(target, 'original bytes', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);
    injectOnce('after-identity-check-before-write', async (absolutePath) => {
      if (!path.basename(absolutePath).startsWith('.safe-local-fs-write-pending-')) return;
      await rename(target, parkedOriginal);
      await writeFile(target, 'competitor bytes', 'utf8');
    });

    await expect(
      safe.writeFile('target.txt', 'replacement bytes', { overwrite: true }),
    ).rejects.toMatchObject({ code: 'identity_race' });
    expect(await readFile(target, 'utf8')).toBe('competitor bytes');
    expect(await readFile(parkedOriginal, 'utf8')).toBe('original bytes');
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-'))).toEqual([]);
  });

  it('preserves a competitor that appears while overwrite rollback is required', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    const parkedNew = path.join(allowedRoot, 'replacement.parked');
    await writeFile(target, 'old payload', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);
    let syncCount = 0;
    _setSafeLocalFsHookForTests(async (stage, absolutePath) => {
      if (stage !== 'before-directory-sync' || absolutePath !== safe.root) return;
      syncCount += 1;
      if (syncCount !== 3) return;
      await rename(target, parkedNew);
      await writeFile(target, 'competitor payload', 'utf8');
      throw new Error('synthetic post-rename sync failure');
    });

    await expect(
      safe.writeFile('target.txt', 'new payload', { overwrite: true }),
    ).rejects.toMatchObject({ code: 'identity_race' });
    expect(await readFile(target, 'utf8')).toBe('competitor payload');
    expect(await readFile(parkedNew, 'utf8')).toBe('new payload');

    _setSafeLocalFsHookForTests(null);
    expect(await safe.readFile('target.txt')).toEqual(Buffer.from('competitor payload'));
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-replace-'))).toEqual([]);
  });

  it('never replaces a public target from forged pending replacement marker bytes', async () => {
    const targetName = 'victim.txt';
    const target = path.join(allowedRoot, targetName);
    await writeFile(target, 'trusted target bytes', 'utf8');
    const encoded = Buffer.from(targetName, 'utf8').toString('base64url');
    const forgedMarker = path.join(
      allowedRoot,
      `.safe-local-fs-replace-pending-${encoded}.${'e'.repeat(32)}.tmp`,
    );
    await writeFile(forgedMarker, 'forged marker bytes', 'utf8');

    const safe = await openSafeLocalFsRoot(allowedRoot);
    expect(await safe.readFile(targetName)).toEqual(Buffer.from('trusted target bytes'));
    await expect(lstat(forgedMarker)).rejects.toMatchObject({ code: 'ENOENT' });

    await unlink(target);
    await writeFile(forgedMarker, 'forged marker bytes', 'utf8');
    await expect(safe.readFile(targetName)).rejects.toMatchObject({ code: 'identity_race' });
    expect(await readFile(forgedMarker, 'utf8')).toBe('forged marker bytes');
    await expect(lstat(target)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('preserves a competitor and the removed bytes when quarantine identity changes', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await safe.writeFile('victim.txt', 'original bytes');
    const parkedOriginal = path.join(outsideRoot, 'parked-original.txt');

    injectOnce('after-quarantine-before-delete', async (quarantine) => {
      await rename(quarantine, parkedOriginal);
      await writeFile(quarantine, 'competitor bytes', 'utf8');
    });

    await expect(safe.removeFile('victim.txt')).rejects.toMatchObject({ code: 'identity_race' });
    await expect(lstat(path.join(allowedRoot, 'victim.txt'))).rejects.toMatchObject({ code: 'ENOENT' });
    expect(await readFile(parkedOriginal, 'utf8')).toBe('original bytes');
    const competitorQuarantine = (await readdir(allowedRoot)).find((name) => (
      name.startsWith('.safe-local-fs-delete-pending-')
    ));
    expect(competitorQuarantine).toBeDefined();
    expect(await readFile(path.join(allowedRoot, competitorQuarantine!), 'utf8')).toBe('competitor bytes');
    await expectSentinelUnchanged();
  });

  it.each([1, 2])(
    'rolls a quarantine back to its target when pre-commit directory fsync stage %i fails',
    async (failureAt) => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await safe.writeFile('victim.txt', 'original bytes');
    let syncCount = 0;
    _setSafeLocalFsHookForTests((stage, absolutePath) => {
      if (stage !== 'before-directory-sync' || absolutePath !== safe.root) return;
      syncCount += 1;
      if (syncCount === failureAt) throw new Error(`synthetic sync failure ${safe.root}`);
    });

    const failure = await safe.removeFile('victim.txt').then(() => null, (error: unknown) => error);
    expect(failure).toMatchObject({ code: 'io_failure' });
    expect(String(failure)).not.toContain(safe.root);
    expect(await readFile(path.join(allowedRoot, 'victim.txt'), 'utf8')).toBe('original bytes');
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-delete-'))).toEqual([]);
    },
  );

  it('reports success when only committed delete-tombstone cleanup fsync fails', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await safe.writeFile('victim.txt', 'original bytes');
    let syncCount = 0;
    _setSafeLocalFsHookForTests((stage, absolutePath) => {
      if (stage !== 'before-directory-sync' || absolutePath !== safe.root) return;
      syncCount += 1;
      if (syncCount === 3) throw new Error(`synthetic committed delete cleanup failure ${safe.root}`);
    });

    await expect(safe.removeFile('victim.txt')).resolves.toBe(true);
    await expect(lstat(path.join(allowedRoot, 'victim.txt'))).rejects.toMatchObject({ code: 'ENOENT' });
    expect((await readdir(allowedRoot)).filter((name) => name.startsWith('.safe-local-fs-delete-'))).toEqual([]);
  });

  it('derives committed marker names from the basename without rewriting an ancestor path', async () => {
    const deleteRoot = path.join(fixtureRoot, '.safe-local-fs-delete-pending-zone');
    const deleteSibling = path.join(fixtureRoot, '.safe-local-fs-delete-committed-zone');
    const replaceRoot = path.join(fixtureRoot, '.safe-local-fs-replace-pending-zone');
    const replaceSibling = path.join(fixtureRoot, '.safe-local-fs-replace-committed-zone');
    await mkdir(deleteRoot);
    await mkdir(deleteSibling);
    await mkdir(replaceRoot);
    await mkdir(replaceSibling);

    const deleteSafe = await openSafeLocalFsRoot(deleteRoot);
    await deleteSafe.writeFile('victim.txt', 'delete bytes');
    await expect(deleteSafe.removeFile('victim.txt')).resolves.toBe(true);
    expect(await readdir(deleteSibling)).toEqual([]);

    const replaceSafe = await openSafeLocalFsRoot(replaceRoot);
    await replaceSafe.writeFile('victim.txt', 'old bytes');
    await replaceSafe.writeFile('victim.txt', 'new bytes', { overwrite: true });
    expect(await replaceSafe.readFile('victim.txt')).toEqual(Buffer.from('new bytes'));
    expect(await readdir(replaceSibling)).toEqual([]);
  });

  it.each(['pending', 'committed'] as const)(
    'never promotes crash-left %s delete marker bytes into a public target',
    async (state) => {
    const targetName = 'victim.txt';
    const target = path.join(allowedRoot, targetName);
    await writeFile(target, 'original bytes', 'utf8');
    const encoded = Buffer.from(targetName, 'utf8').toString('base64url');
    const quarantine = path.join(
      allowedRoot,
      `.safe-local-fs-delete-${state}-${encoded}.${'a'.repeat(32)}.tmp`,
    );
    await rename(target, quarantine);

    const safe = await openSafeLocalFsRoot(allowedRoot);
    await expect(safe.readFile(targetName)).rejects.toMatchObject({ code: 'not_found' });
    expect((await safe.listRegularFiles()).map((entry) => entry.name)).toEqual([]);
    await expect(lstat(quarantine)).rejects.toMatchObject({ code: 'ENOENT' });
    },
  );

  it('recovers pending and committed overwrite markers without mixing generations', async () => {
    const targetName = 'victim.txt';
    const target = path.join(allowedRoot, targetName);
    const encoded = Buffer.from(targetName, 'utf8').toString('base64url');
    const pending = path.join(
      allowedRoot,
      `.safe-local-fs-replace-pending-${encoded}.${'b'.repeat(32)}.tmp`,
    );
    await writeFile(target, 'old pending bytes', 'utf8');
    await link(target, pending);
    const pendingNew = path.join(allowedRoot, 'pending-new.tmp');
    await writeFile(pendingNew, 'new pending bytes', 'utf8');
    await rename(pendingNew, target);

    let safe = await openSafeLocalFsRoot(allowedRoot);
    expect(await safe.readFile(targetName)).toEqual(Buffer.from('new pending bytes'));
    await expect(lstat(pending)).rejects.toMatchObject({ code: 'ENOENT' });

    const committed = path.join(
      allowedRoot,
      `.safe-local-fs-replace-committed-${encoded}.${'c'.repeat(32)}.tmp`,
    );
    await link(target, committed);
    const committedNew = path.join(allowedRoot, 'committed-new.tmp');
    await writeFile(committedNew, 'new committed bytes', 'utf8');
    await rename(committedNew, target);

    safe = await openSafeLocalFsRoot(allowedRoot);
    expect(await safe.readFile(targetName)).toEqual(Buffer.from('new committed bytes'));
    await expect(lstat(committed)).rejects.toMatchObject({ code: 'ENOENT' });
    expect((await lstat(target)).nlink).toBe(1);
  });

  it('hides crash-left internal temps without reclaiming them while consumers reopen normal files safely', async () => {
    const orphanTarget = 'orphan-target.txt';
    const orphanDigest = createHash('sha256').update(orphanTarget, 'utf8').digest('hex').slice(0, 32);
    const orphan = path.join(
      allowedRoot,
      `.safe-local-fs-write-pending-${orphanDigest}-${'d'.repeat(32)}.tmp`,
    );
    await writeFile(orphan, 'orphan', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await safe.writeFile('visible.txt', 'visible');

    expect((await safe.listRegularFiles()).map((entry) => entry.name)).toEqual(['visible.txt']);
    await expect(
      safe.readFile(path.basename(orphan)),
    ).rejects.toMatchObject({ code: 'unsafe_path' });
    expect(await safe.readFile('visible.txt')).toEqual(Buffer.from('visible'));
    // A single-link hidden internal may be a live writer, so it is left
    // untouched rather than reclaimed by a reader/list preflight.
    const orphanStats = await lstat(orphan);
    expect(orphanStats.isFile()).toBe(true);
    expect(orphanStats.nlink).toBe(1);
    expect(await readFile(orphan, 'utf8')).toBe('orphan');

    // A symlinked internal entry is still rejected fail-closed by a listing.
    await unlink(orphan);
    await symlink(sentinelPath, orphan);
    await expect(safe.listRegularFiles()).rejects.toMatchObject({ code: 'symlink_rejected' });
    await expectSentinelUnchanged();
  });

  it('reserves internal temp names for directory creation as well as file access', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await expect(
      safe.ensureDirectory('.safe-local-fs-write-0123456789abcdef.tmp'),
    ).rejects.toMatchObject({ code: 'unsafe_path' });
    await expect(
      lstat(path.join(allowedRoot, '.safe-local-fs-write-0123456789abcdef.tmp')),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('redacts raw filesystem paths and exposes only stable error metadata', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    const failure = await safe.readFile('missing.txt').then(() => null, (error: unknown) => error);

    expect(failure).toBeInstanceOf(SafeLocalFsSafetyError);
    expect(failure).toMatchObject({ code: 'not_found', errno: 'ENOENT' });
    expect(String(failure)).not.toContain(safe.root);
    expect(JSON.stringify(failure)).not.toContain(safe.root);
    expect(failure).not.toHaveProperty('cause');
    expect(isSafeLocalFsNotFoundError(failure)).toBe(true);
  });

  it('classifies only ordinary missing targets and initially absent roots as not found', () => {
    expect(isSafeLocalFsNotFoundError(
      new SafeLocalFsSafetyError('not_found', 'missing', { errno: 'ENOENT' }),
    )).toBe(true);
    expect(isSafeLocalFsNotFoundError(
      new SafeLocalFsSafetyError('unsafe_root', 'missing root', { errno: 'ENOENT' }),
    )).toBe(true);
    expect(isSafeLocalFsNotFoundError(
      new SafeLocalFsSafetyError('identity_race', 'root disappeared', { errno: 'ENOENT' }),
    )).toBe(false);
  });

  it('fails capability checks on Windows or without nonzero no-follow flags', () => {
    expect(isSafeLocalFsPlatformSupported('win32')).toBe(false);
    expect(isSafeLocalFsPlatformSupported('linux', { O_NOFOLLOW: 0, O_DIRECTORY: 1 })).toBe(false);
    expect(isSafeLocalFsPlatformSupported('linux', { O_NOFOLLOW: 1, O_DIRECTORY: 0 })).toBe(false);
    expect(isSafeLocalFsPlatformSupported(process.platform)).toBe(true);
  });

  it('pins the root identity and rejects replacement after the handle is created', async () => {
    const target = path.join(allowedRoot, 'target.txt');
    const parkedRoot = path.join(fixtureRoot, 'allowed.parked');
    await writeFile(target, 'inside', 'utf8');
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await rename(allowedRoot, parkedRoot);
    await mkdir(allowedRoot);
    await writeFile(path.join(allowedRoot, 'target.txt'), 'replacement', 'utf8');

    await expect(safe.readFile('target.txt')).rejects.toMatchObject({ code: 'identity_race' });
    await expectSentinelUnchanged();
  });

  it('does not treat a disappeared pinned root as an ordinary missing remove target', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await rename(allowedRoot, path.join(fixtureRoot, 'allowed.parked'));

    await expect(safe.removeFile('target.txt')).rejects.toMatchObject({
      code: 'identity_race',
      errno: 'ENOENT',
    });
  });

  it('removes only an identity-checked regular file', async () => {
    const safe = await openSafeLocalFsRoot(allowedRoot);
    await safe.writeFile('remove-me.txt', 'inside');
    expect(await safe.removeFile('remove-me.txt')).toBe(true);
    expect(await safe.removeFile('remove-me.txt')).toBe(false);
    await expect(lstat(path.join(allowedRoot, 'remove-me.txt'))).rejects.toMatchObject({ code: 'ENOENT' });
    try {
      await safe.readFile('remove-me.txt');
      throw new Error('expected missing read to fail');
    } catch (error) {
      expect(isSafeLocalFsNotFoundError(error)).toBe(true);
    }
    await expectSentinelUnchanged();
  });
});
