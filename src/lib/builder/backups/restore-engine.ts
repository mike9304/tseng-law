import { lstat, realpath } from 'node:fs/promises';
import path from 'node:path';

import { put } from '@vercel/blob';

import { openSafeLocalFsRoot } from '@/lib/builder/storage/safe-local-fs';
import { withLocalJsonWriteLeases } from '@/lib/builder/storage/local-json-write-lease.mjs';
import type { LocalJsonLeaseOptions } from '@/lib/builder/storage/local-json-write-lease.mjs';

import { loadBackupManifest } from './backup-engine';
import type { BackupEntry } from './types';

const DEFAULT_RUNTIME_ROOT = path.join(process.cwd(), 'runtime-data');
const TEST_RUNTIME_ROOT_ENV = 'BUILDER_RESTORE_RUNTIME_ROOT';
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f-\u009f]/;

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

export interface RestoreResult {
  ok: boolean;
  restored: number;
  failed: number;
  errors: Array<{ key: string; reason: string }>;
}

interface PreparedFileEntry {
  entryIndex: number;
  key: string;
  relativePath: string;
  targetPath: string;
  body: string;
}

export type RestoreFileTestEvent =
  | { stage: 'all-leases-acquired'; targetPaths: string[] }
  | { stage: 'before-entry-write'; targetPath: string; key: string }
  | { stage: 'after-entry-write'; targetPath: string; key: string };

type RestoreFileTestHook = (event: RestoreFileTestEvent) => void | Promise<void>;
type RestoreLeaseTestOptions = Pick<
  LocalJsonLeaseOptions,
  'acquireTimeoutMs' | 'lockStaleMs' | 'retryDelayMs' | 'testHook'
>;

let restoreFileTestHook: RestoreFileTestHook | null = null;
let restoreLeaseTestOptions: RestoreLeaseTestOptions | null = null;

/** Test-only deterministic observation; never enables a production path. */
export function _setRestoreFileHookForTests(hook: RestoreFileTestHook | null): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('restore file hooks are only available under NODE_ENV=test');
  }
  restoreFileTestHook = hook;
}

/** Test-only bridge for deterministic primitive crash/recovery tests. */
export function _setRestoreLeaseOptionsForTests(options: RestoreLeaseTestOptions | null): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('restore lease options are only available under NODE_ENV=test');
  }
  restoreLeaseTestOptions = options;
}

async function runRestoreFileTestHook(event: RestoreFileTestEvent): Promise<void> {
  await restoreFileTestHook?.(event);
}

function runtimeRoot(): string {
  const testOverride = process.env.NODE_ENV === 'test'
    ? process.env[TEST_RUNTIME_ROOT_ENV]
    : undefined;
  return path.resolve(testOverride || DEFAULT_RUNTIME_ROOT);
}

function errorReason(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isContainedPath(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative.length > 0
    && relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative);
}

function validateRestoreKey(key: unknown): string {
  if (
    typeof key !== 'string'
    || key.length === 0
    || key.trim() !== key
    || CONTROL_CHARACTER_PATTERN.test(key)
    || key.includes('\\')
    || path.posix.isAbsolute(key)
    || path.win32.isAbsolute(key)
  ) {
    throw new Error('unsafe restore path');
  }

  const segments = key.split('/');
  if (
    segments.some((segment) => (
      segment.length === 0
      || segment === '.'
      || segment === '..'
      || segment.startsWith('.')
    ))
    || path.posix.normalize(key) !== key
    || !segments.at(-1)?.endsWith('.json')
  ) {
    throw new Error('unsafe restore path');
  }

  return segments.join(path.sep);
}

function serializeEntryBody(body: unknown): string {
  if (typeof body === 'string') return body;
  const serialized = JSON.stringify(body);
  if (typeof serialized !== 'string') {
    throw new Error('backup entry body is not serializable');
  }
  return serialized;
}

async function assertExistingPathComponentsAreSafe(root: string, targetPath: string): Promise<void> {
  if (!isContainedPath(root, targetPath)) throw new Error('unsafe restore path');

  const relative = path.relative(root, targetPath);
  const segments = relative.split(path.sep);
  let current = root;

  for (const segment of segments.slice(0, -1)) {
    current = path.join(current, segment);
    let stats: Awaited<ReturnType<typeof lstat>>;
    try {
      stats = await lstat(current);
    } catch (error) {
      if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') return;
      throw error;
    }
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      throw new Error('unsafe restore parent');
    }
    if (await realpath(current) !== current) throw new Error('unsafe restore parent');
  }

  try {
    const targetStats = await lstat(targetPath);
    if (targetStats.isSymbolicLink() || !targetStats.isFile()) {
      throw new Error('unsafe restore target');
    }
    const physicalTarget = await realpath(targetPath);
    if (physicalTarget !== targetPath || !isContainedPath(root, physicalTarget)) {
      throw new Error('unsafe restore target');
    }
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
}

function recordFailure(result: RestoreResult, key: string, error: unknown): void {
  result.failed += 1;
  result.errors.push({ key, reason: errorReason(error) });
}

async function restoreBlobEntries(entries: BackupEntry[], result: RestoreResult): Promise<void> {
  for (const entry of entries) {
    try {
      const body = serializeEntryBody(entry.body);
      await put(entry.key, body, {
        access: 'private',
        allowOverwrite: true,
        contentType: 'application/json',
      });
      result.restored += 1;
    } catch (error) {
      recordFailure(result, entry.key, error);
    }
  }
}

async function restoreFileEntries(entries: BackupEntry[], result: RestoreResult): Promise<void> {
  let safeRoot: Awaited<ReturnType<typeof openSafeLocalFsRoot>>;
  try {
    safeRoot = await openSafeLocalFsRoot(runtimeRoot());
  } catch (error) {
    for (const entry of entries) recordFailure(result, entry.key, error);
    return;
  }

  const prepared: PreparedFileEntry[] = [];
  const preflightFailures = new Map<number, unknown>();
  for (const [entryIndex, entry] of entries.entries()) {
    try {
      const relativePath = validateRestoreKey(entry.key);
      const targetPath = path.resolve(safeRoot.root, relativePath);
      await assertExistingPathComponentsAreSafe(safeRoot.root, targetPath);
      prepared.push({
        entryIndex,
        key: entry.key,
        relativePath,
        targetPath,
        body: serializeEntryBody(entry.body),
      });
    } catch (error) {
      preflightFailures.set(entryIndex, error);
    }
  }

  if (preflightFailures.size > 0) {
    for (const [entryIndex, entry] of entries.entries()) {
      recordFailure(
        result,
        entry.key,
        preflightFailures.get(entryIndex) ?? new Error('restore preflight blocked'),
      );
    }
    return;
  }
  if (prepared.length === 0) return;

  const completedEntryIndexes = new Set<number>();
  try {
    await withLocalJsonWriteLeases(
      prepared.map((entry) => entry.targetPath),
      {
        allowedRoot: safeRoot.root,
        ...(restoreLeaseTestOptions ?? {}),
      },
      async (leases) => {
        await runRestoreFileTestHook({
          stage: 'all-leases-acquired',
          targetPaths: leases.map((lease) => lease.targetPath),
        });
        const leasesByTarget = new Map(leases.map((lease) => [lease.targetPath, lease]));
        const failedParents = new Map<string, unknown>();
        const relativeParents = [...new Set(prepared.map((entry) => path.dirname(entry.relativePath)))];
        relativeParents.sort((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)));

        // All target leases are held before the first target-directory or data-file mutation.
        for (const relativeParent of relativeParents) {
          try {
            await safeRoot.ensureDirectory(relativeParent);
          } catch (error) {
            failedParents.set(relativeParent, error);
          }
        }

        for (const entry of prepared) {
          const parentFailure = failedParents.get(path.dirname(entry.relativePath));
          if (parentFailure) {
            recordFailure(result, entry.key, parentFailure);
            completedEntryIndexes.add(entry.entryIndex);
            continue;
          }

          try {
            const lease = leasesByTarget.get(entry.targetPath);
            if (!lease) throw new Error('restore lease missing for target');
            await lease.recover();
            const current = await lease.read();
            await runRestoreFileTestHook({
              stage: 'before-entry-write',
              targetPath: entry.targetPath,
              key: entry.key,
            });
            await lease.atomicWrite(entry.body, {
              expectedGeneration: current.kind === 'missing' ? null : current.generation,
            });
            await runRestoreFileTestHook({
              stage: 'after-entry-write',
              targetPath: entry.targetPath,
              key: entry.key,
            });
            result.restored += 1;
          } catch (error) {
            recordFailure(result, entry.key, error);
          }
          completedEntryIndexes.add(entry.entryIndex);
        }
      },
    );
  } catch (error) {
    let recordedEntryFailure = false;
    for (const entry of prepared) {
      if (completedEntryIndexes.has(entry.entryIndex)) continue;
      recordFailure(result, entry.key, error);
      recordedEntryFailure = true;
    }
    if (!recordedEntryFailure) {
      result.errors.push({ key: '*', reason: errorReason(error) });
    }
  }
}

/**
 * PR #18 — Restore a backup manifest.
 *
 * Blob restores retain their per-entry overwrite behavior. File restores first
 * reject unsafe manifest paths, then hold every unique target's OS lease before
 * creating a directory or atomically installing any entry.
 */
export async function restoreBackup(backupId: string, options: { dryRun?: boolean } = {}): Promise<RestoreResult> {
  const manifest = await loadBackupManifest(backupId);
  if (!manifest) {
    return { ok: false, restored: 0, failed: 0, errors: [{ key: '*', reason: 'backup not found' }] };
  }

  const result: RestoreResult = { ok: true, restored: 0, failed: 0, errors: [] };
  if (options.dryRun) {
    return { ...result, restored: manifest.entries.length };
  }

  if (backend() === 'blob') {
    await restoreBlobEntries(manifest.entries, result);
  } else {
    await restoreFileEntries(manifest.entries, result);
  }
  result.ok = result.failed === 0 && result.errors.length === 0;
  return result;
}
