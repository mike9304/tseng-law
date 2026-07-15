/**
 * Disk-backed store for the ops backup register. The actual backup
 * payload (a JSON copy of the source file) is written next to the index
 * under runtime-data/ops/backups/${id}.json.bak.
 */
import { lstat, mkdir, open, realpath, unlink } from 'fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'path';
import crypto from 'node:crypto';
import { z } from 'zod';

import {
  emptyBackupsIndex,
  type BuilderBackupRecord,
  type BuilderBackupsIndex,
  type BuilderRestoreResult,
} from './backups-model';
import { opsBackupsDir, opsBackupsIndexFile, opsRoot } from './paths';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import { assertSiteDocumentInvariants } from '@/lib/builder/site/site-invariants';
import {
  LocalJsonWriteConflictError,
  LocalJsonWriteInvalidPathError,
  LocalJsonWriteUnavailableError,
  atomicRemoveLocalJson,
  atomicWriteLocalJson,
  readLocalJsonFile,
  withLocalJsonWriteLease,
  type LocalJsonGeneration,
  type LocalJsonWriteLease,
} from '@/lib/builder/storage/local-json-write-lease.mjs';

const backupRecordSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  sourcePath: z.string(),
  sizeBytes: z.number(),
  checksumSha256: z.string().optional(),
  status: z.union([z.literal('ok'), z.literal('failed')]),
  note: z.string().optional(),
});

const backupsIndexSchema = z.object({
  backups: z.array(backupRecordSchema),
});

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function parseIndex(bytes: Buffer): BuilderBackupsIndex {
  try {
    return backupsIndexSchema.parse(JSON.parse(bytes.toString('utf8')));
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof z.ZodError) {
      throw new Error('ops backup index is invalid');
    }
    throw error;
  }
}

type LeasedIndex = {
  index: BuilderBackupsIndex;
  generation: LocalJsonGeneration | null;
};

async function opsIndexLeaseBoundary(): Promise<{ allowedRoot: string; targetPath: string }> {
  await mkdir(opsRoot(), { recursive: true });
  const allowedRoot = await realpath(path.resolve(opsRoot()));
  return {
    allowedRoot,
    targetPath: path.join(allowedRoot, path.basename(opsBackupsIndexFile())),
  };
}

async function readIndexUnderLease(lease: LocalJsonWriteLease): Promise<LeasedIndex> {
  const snapshot = await readLocalJsonFile(lease);
  if (snapshot.kind === 'missing') {
    return { index: emptyBackupsIndex(), generation: null };
  }
  return { index: parseIndex(snapshot.bytes), generation: snapshot.generation };
}

// In-process callers race each other for the same cross-process lock file
// (create-candidate -> link -> EEXIST-retry) whenever more than a handful of
// `createOpsBackup`/`deleteOpsBackup` calls run concurrently in the same
// Node process. That thundering herd can exhaust the lease's fixed
// acquisition timeout under load even though every caller is well-behaved,
// which surfaces as a successful backup being demoted to `status: 'failed'`.
// Funnel all in-process index-lease acquisitions through a single FIFO
// queue so at most one acquisition attempt from this process is ever
// outstanding against the lock file at a time. This only removes redundant
// intra-process contention: the underlying cross-process lock semantics
// (still provided by `withLocalJsonWriteLease`, untouched here) are exactly
// as before, so cross-process serialization is unaffected.
let opsIndexQueue: Promise<void> = Promise.resolve();

function enqueueOpsIndexOperation<T>(operation: () => Promise<T>): Promise<T> {
  const settled = opsIndexQueue.then(operation, operation);
  opsIndexQueue = settled.then(
    () => undefined,
    () => undefined,
  );
  return settled;
}

async function withOpsIndexLease<T>(
  operation: (lease: LocalJsonWriteLease) => Promise<T>,
): Promise<T> {
  return enqueueOpsIndexOperation(async () => {
    const boundary = await opsIndexLeaseBoundary();
    return withLocalJsonWriteLease(
      boundary.targetPath,
      { allowedRoot: boundary.allowedRoot, lockStaleMs: 0 },
      operation,
    );
  });
}

async function readIndex(): Promise<BuilderBackupsIndex> {
  return withOpsIndexLease(async (lease) => (await readIndexUnderLease(lease)).index);
}

async function unlinkIfExists(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
  } catch (error) {
    if (isMissingFileError(error)) return;
    throw error;
  }
}

async function writeIndexUnderLease(
  lease: LocalJsonWriteLease,
  index: BuilderBackupsIndex,
  expectedGeneration: LocalJsonGeneration | null,
): Promise<void> {
  await atomicWriteLocalJson(
    lease,
    Buffer.from(JSON.stringify(index), 'utf8'),
    { expectedGeneration },
  );
}

function makeBackupId(now: Date): string {
  const stamp = now.toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  return `opsbkp_${stamp}_${crypto.randomBytes(4).toString('hex')}`;
}

type SafeSource = {
  path: string;
  mode: number;
  dev: number;
  ino: number;
  canonicalSiteId: string | null;
};

type SourceSnapshot = {
  bytes: Buffer;
  mode: number;
  uid: number;
  gid: number;
  atimeMs: number;
  mtimeMs: number;
};

type OpsRestoreFaultForTests =
  | 'post-rename-read'
  | 'post-rename-invariant'
  | 'post-rename-checksum'
  | 'rollback-write'
  | 'post-rename-read-and-rollback-write';

type OpsRestoreHookStageForTests =
  | 'after-backup-payload-resolve'
  | 'after-source-install-final-check';

type SafeRegularFile = {
  path: string;
  dev: number;
  ino: number;
};

let runtimeDataRootForTests: string | null = null;
let restoreFaultForTests: OpsRestoreFaultForTests | null = null;
let restoreHookForTests: ((stage: OpsRestoreHookStageForTests) => void | Promise<void>) | null = null;

function runtimeDataRoot(): string {
  return runtimeDataRootForTests ?? path.resolve(process.cwd(), 'runtime-data');
}

function assertTestOnlyHook(): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('ops backup test hooks are only available under NODE_ENV=test');
  }
}

/** Test-only root isolation. Production callers always use `<cwd>/runtime-data`. */
export function _setOpsBackupRuntimeRootForTests(root: string | null): void {
  assertTestOnlyHook();
  runtimeDataRootForTests = root ? path.resolve(root) : null;
}

/** Deterministic failure injection for the transactional restore tests. */
export function _setOpsBackupRestoreFaultForTests(fault: OpsRestoreFaultForTests | null): void {
  assertTestOnlyHook();
  restoreFaultForTests = fault;
}

/** Test-only race hook used to replace files at exact restore boundaries. */
export function _setOpsBackupRestoreHookForTests(
  hook: ((stage: OpsRestoreHookStageForTests) => void | Promise<void>) | null,
): void {
  assertTestOnlyHook();
  restoreHookForTests = hook;
}

async function runRestoreHookForTests(stage: OpsRestoreHookStageForTests): Promise<void> {
  await restoreHookForTests?.(stage);
}

function isContainedPath(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative.length > 0
    && !relative.startsWith(`..${path.sep}`)
    && relative !== '..'
    && !path.isAbsolute(relative);
}

async function assertDirectoryChainHasNoSymlinks(root: string, relativeDirectory: string): Promise<void> {
  const rootStat = await lstat(root);
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) throw new Error('unsafe root');

  let current = root;
  for (const segment of relativeDirectory.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    const currentStat = await lstat(current);
    if (currentStat.isSymbolicLink() || !currentStat.isDirectory()) throw new Error('unsafe parent');
  }
}

async function resolveSafeSource(sourcePath: string): Promise<SafeSource> {
  if (!sourcePath || path.extname(sourcePath).toLowerCase() !== '.json') throw new Error('unsafe source');

  const runtimeRoot = runtimeDataRoot();
  const resolvedSource = path.resolve(sourcePath);
  if (!isContainedPath(runtimeRoot, resolvedSource)) throw new Error('unsafe source');

  const relativeSource = path.relative(runtimeRoot, resolvedSource);
  await assertDirectoryChainHasNoSymlinks(runtimeRoot, path.dirname(relativeSource));
  const sourceStat = await lstat(resolvedSource);
  if (sourceStat.isSymbolicLink() || !sourceStat.isFile()) throw new Error('unsafe source');

  const physicalRoot = await realpath(runtimeRoot);
  const physicalSource = await realpath(resolvedSource);
  if (!isContainedPath(physicalRoot, physicalSource)) throw new Error('unsafe source');

  const segments = path.relative(physicalRoot, physicalSource).split(path.sep);
  const canonicalSiteId = segments.length === 3
    && segments[0] === 'builder-site'
    && /^[a-z0-9][a-z0-9_-]*$/i.test(segments[1] ?? '')
    && segments[2] === 'site.json'
    ? segments[1]!
    : null;

  return {
    path: resolvedSource,
    mode: sourceStat.mode,
    dev: sourceStat.dev,
    ino: sourceStat.ino,
    canonicalSiteId,
  };
}

async function resolveSafeBackupPayload(id: string): Promise<SafeRegularFile> {
  try {
    if (!/^opsbkp_[0-9]+_[a-f0-9]+$/.test(id)) throw new Error('unsafe backup id');

    const root = path.resolve(opsRoot());
    const backupsRoot = path.resolve(opsBackupsDir());
    if (!isContainedPath(root, backupsRoot)) throw new Error('unsafe backup root');
    await assertDirectoryChainHasNoSymlinks(root, path.relative(root, backupsRoot));

    const payloadPath = path.join(backupsRoot, `${id}.json.bak`);
    const payloadStat = await lstat(payloadPath);
    if (payloadStat.isSymbolicLink() || !payloadStat.isFile()) throw new Error('unsafe backup payload');

    const physicalBackupsRoot = await realpath(backupsRoot);
    const physicalPayload = await realpath(payloadPath);
    if (!isContainedPath(physicalBackupsRoot, physicalPayload)) throw new Error('unsafe backup payload');
    return {
      path: physicalPayload,
      dev: payloadStat.dev,
      ino: payloadStat.ino,
    };
  } catch {
    throw new Error('unsafe backup payload');
  }
}

function validateCanonicalSiteBackup(backupBuffer: Buffer, siteId: string): boolean {
  try {
    const parsed = JSON.parse(backupBuffer.toString('utf8')) as BuilderSiteDocument;
    if (!parsed || typeof parsed !== 'object' || parsed.siteId !== siteId) return false;
    assertSiteDocumentInvariants(parsed, {
      forbidInternalSandboxPages: siteId === DEFAULT_BUILDER_SITE_ID,
    });
    return true;
  } catch {
    return false;
  }
}

function hasSameIdentity(left: Pick<SafeSource, 'dev' | 'ino'>, right: Pick<SafeSource, 'dev' | 'ino'>): boolean {
  return left.dev === right.dev && left.ino === right.ino;
}

async function readRegularFileNoFollow(filePath: string): Promise<Buffer> {
  const handle = await open(filePath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
  try {
    const fileStat = await handle.stat();
    if (!fileStat.isFile()) throw new Error('not a regular file');
    return await handle.readFile();
  } finally {
    await handle.close();
  }
}

async function readExpectedRegularFileNoFollow(file: SafeRegularFile): Promise<Buffer> {
  const handle = await open(file.path, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
  try {
    const before = await handle.stat();
    if (!before.isFile() || before.dev !== file.dev || before.ino !== file.ino) {
      throw new Error('backup payload changed during restore');
    }
    const bytes = await handle.readFile();
    const after = await handle.stat();
    if (
      !after.isFile()
      || after.dev !== before.dev
      || after.ino !== before.ino
      || after.size !== before.size
      || after.size !== bytes.byteLength
      || after.mtimeMs !== before.mtimeMs
      || after.ctimeMs !== before.ctimeMs
    ) {
      throw new Error('backup payload changed during restore');
    }
    return bytes;
  } finally {
    await handle.close();
  }
}

async function readStableSourceSnapshot(source: SafeSource): Promise<SourceSnapshot> {
  const handle = await open(source.path, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
  try {
    const before = await handle.stat();
    if (!before.isFile() || before.dev !== source.dev || before.ino !== source.ino) {
      throw new Error('source path changed during restore');
    }
    const bytes = await handle.readFile();
    const after = await handle.stat();
    if (
      !after.isFile()
      || after.dev !== before.dev
      || after.ino !== before.ino
      || after.size !== before.size
      || after.size !== bytes.byteLength
      || after.mtimeMs !== before.mtimeMs
      || after.ctimeMs !== before.ctimeMs
      || after.mode !== before.mode
      || after.uid !== before.uid
      || after.gid !== before.gid
    ) {
      throw new Error('source file changed while it was being snapshotted');
    }

    const rechecked = await resolveSafeSource(source.path);
    if (!hasSameIdentity(rechecked, source) || rechecked.canonicalSiteId !== source.canonicalSiteId) {
      throw new Error('source path changed during restore');
    }

    return {
      bytes,
      mode: after.mode,
      uid: after.uid,
      gid: after.gid,
      atimeMs: after.atimeMs,
      mtimeMs: after.mtimeMs,
    };
  } finally {
    await handle.close();
  }
}

function hasSameSnapshotGeneration(left: SourceSnapshot, right: SourceSnapshot): boolean {
  return left.bytes.equals(right.bytes)
    && left.mode === right.mode
    && left.uid === right.uid
    && left.gid === right.gid;
}

async function assertExpectedSourceGeneration(
  source: SafeSource,
  expectedSource: SafeSource,
  expectedSnapshot: SourceSnapshot,
): Promise<void> {
  const currentSource = await resolveSafeSource(source.path);
  if (
    !hasSameIdentity(currentSource, expectedSource)
    || currentSource.canonicalSiteId !== source.canonicalSiteId
  ) {
    throw new Error('source path changed during restore');
  }
  const currentSnapshot = await readStableSourceSnapshot(currentSource);
  if (!hasSameSnapshotGeneration(currentSnapshot, expectedSnapshot)) {
    throw new Error('source file changed during restore');
  }
}

async function syncDirectory(directory: string): Promise<void> {
  const handle = await open(directory, fsConstants.O_RDONLY);
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function writeSnapshotMetadata(
  handle: Awaited<ReturnType<typeof open>>,
  snapshot: SourceSnapshot,
): Promise<void> {
  const current = await handle.stat();
  if (current.uid !== snapshot.uid || current.gid !== snapshot.gid) {
    await handle.chown(snapshot.uid, snapshot.gid);
  }
  await handle.chmod(snapshot.mode & 0o7777);
  await handle.utimes(new Date(snapshot.atimeMs), new Date(snapshot.mtimeMs));
}

type InstalledRestore = {
  source: SafeSource;
  generation: LocalJsonGeneration;
};

async function atomicInstallSnapshot(
  lease: LocalJsonWriteLease,
  source: SafeSource,
  snapshot: SourceSnapshot,
  expectedCurrent: SafeSource,
  expectedCurrentSnapshot: SourceSnapshot,
  expectedGeneration: LocalJsonGeneration,
  onInstalled: (installed: InstalledRestore) => void,
): Promise<InstalledRestore> {
  await assertExpectedSourceGeneration(source, expectedCurrent, expectedCurrentSnapshot);
  await runRestoreHookForTests('after-source-install-final-check');

  try {
    await atomicWriteLocalJson(lease, snapshot.bytes, { expectedGeneration });
  } catch (error) {
    if (!(error instanceof LocalJsonWriteConflictError)) throw error;
    try {
      const current = await resolveSafeSource(source.path);
      if (!hasSameIdentity(current, expectedCurrent)) {
        throw new Error('source path changed during restore');
      }
    } catch (currentError) {
      if (currentError instanceof Error && currentError.message === 'source path changed during restore') {
        throw currentError;
      }
      throw new Error('source path changed during restore');
    }
    throw new Error('source file changed during restore');
  }

  const metadataHandle = await open(
    source.path,
    fsConstants.O_RDWR | fsConstants.O_NOFOLLOW,
  );
  try {
    await writeSnapshotMetadata(metadataHandle, snapshot);
    await metadataHandle.sync();
  } finally {
    await metadataHandle.close();
  }

  const installedSnapshot = await readLocalJsonFile(lease);
  if (installedSnapshot.kind !== 'present') {
    throw new Error('source path changed during restore');
  }
  const installedSource = await resolveSafeSource(source.path);
  if (
    String(installedSource.dev) !== installedSnapshot.generation.dev
    || String(installedSource.ino) !== installedSnapshot.generation.ino
    || installedSource.canonicalSiteId !== source.canonicalSiteId
  ) {
    throw new Error('source path changed during restore');
  }
  const installed = { source: installedSource, generation: installedSnapshot.generation };
  onInstalled(installed);
  return installed;
}

async function verifyInstalledRestore(source: SafeSource, expectedChecksum: string): Promise<Buffer> {
  if (
    restoreFaultForTests === 'post-rename-read'
    || restoreFaultForTests === 'post-rename-read-and-rollback-write'
  ) {
    throw new Error('post-rename restored file read failed');
  }
  const restoredSnapshot = await readStableSourceSnapshot(source);

  if (restoreFaultForTests === 'post-rename-invariant') {
    throw new Error('invalid builder site backup payload');
  }
  if (
    source.canonicalSiteId
    && !validateCanonicalSiteBackup(restoredSnapshot.bytes, source.canonicalSiteId)
  ) {
    throw new Error('invalid builder site backup payload');
  }

  const restoredChecksum = restoreFaultForTests === 'post-rename-checksum'
    ? 'fault-injected-checksum-mismatch'
    : sha256Hex(restoredSnapshot.bytes);
  if (restoredChecksum !== expectedChecksum) {
    throw new Error('restored file checksum mismatch');
  }
  return restoredSnapshot.bytes;
}

async function rollbackInstalledRestore(
  lease: LocalJsonWriteLease,
  source: SafeSource,
  installedCandidate: InstalledRestore,
  installedSnapshot: SourceSnapshot,
  originalSnapshot: SourceSnapshot,
): Promise<void> {
  if (
    restoreFaultForTests === 'rollback-write'
    || restoreFaultForTests === 'post-rename-read-and-rollback-write'
  ) {
    throw new Error('fault-injected rollback write failure');
  }

  const restoredOriginal = await atomicInstallSnapshot(
    lease,
    source,
    originalSnapshot,
    installedCandidate.source,
    installedSnapshot,
    installedCandidate.generation,
    () => undefined,
  );
  const rollbackSnapshot = await readStableSourceSnapshot(restoredOriginal.source);
  if (
    !rollbackSnapshot.bytes.equals(originalSnapshot.bytes)
    || (rollbackSnapshot.mode & 0o7777) !== (originalSnapshot.mode & 0o7777)
  ) {
    throw new Error('rollback verification failed');
  }
}

function sha256Hex(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export async function listOpsBackups(): Promise<BuilderBackupRecord[]> {
  const index = await readIndex();
  return [...index.backups].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOpsBackupById(id: string): Promise<BuilderBackupRecord | null> {
  const index = await readIndex();
  return index.backups.find((backup) => backup.id === id) ?? null;
}

export async function createOpsBackup(
  sourcePath: string,
  note?: string,
  now: Date = new Date(),
): Promise<BuilderBackupRecord> {
  const id = makeBackupId(now);
  const createdAt = now.toISOString();
  let safeSource: SafeSource;
  try {
    safeSource = await resolveSafeSource(sourcePath);
  } catch {
    const failed: BuilderBackupRecord = {
      id,
      createdAt,
      sourcePath,
      sizeBytes: 0,
      status: 'failed',
      note: note ?? 'source must be a .json file under runtime-data/',
    };
    await persistRecord(failed);
    return failed;
  }

  try {
    const sourceBuffer = await readRegularFileNoFollow(safeSource.path);
    await mkdir(opsBackupsDir(), { recursive: true });
    const dest = path.join(opsBackupsDir(), `${id}.json.bak`);
    const resolvedOpsRoot = path.resolve(opsRoot());
    const resolvedBackupsDir = path.resolve(opsBackupsDir());
    await assertDirectoryChainHasNoSymlinks(
      resolvedOpsRoot,
      path.relative(resolvedOpsRoot, resolvedBackupsDir),
    );
    const handle = await open(dest, 'wx');
    try {
      await handle.writeFile(sourceBuffer);
      await handle.sync();
    } finally {
      await handle.close();
    }
    await syncDirectory(resolvedBackupsDir);
    const record: BuilderBackupRecord = {
      id,
      createdAt,
      sourcePath,
      sizeBytes: sourceBuffer.byteLength,
      checksumSha256: sha256Hex(sourceBuffer),
      status: 'ok',
      note,
    };
    await persistRecord(record);
    return record;
  } catch (error) {
    const failed: BuilderBackupRecord = {
      id,
      createdAt,
      sourcePath,
      sizeBytes: 0,
      status: 'failed',
      note: note ?? (error instanceof Error ? error.message : 'copy failed'),
    };
    await persistRecord(failed);
    return failed;
  }
}

async function sourceLeaseBoundary(sourcePath: string): Promise<{
  allowedRoot: string;
  targetPath: string;
}> {
  if (!sourcePath || path.extname(sourcePath).toLowerCase() !== '.json') {
    throw new Error('unsafe source');
  }
  const configuredRoot = path.resolve(runtimeDataRoot());
  const configuredTarget = path.resolve(sourcePath);
  if (!isContainedPath(configuredRoot, configuredTarget)) throw new Error('unsafe source');
  const allowedRoot = await realpath(configuredRoot);
  return {
    allowedRoot,
    targetPath: path.join(allowedRoot, path.relative(configuredRoot, configuredTarget)),
  };
}

export async function restoreOpsBackup(id: string): Promise<BuilderRestoreResult> {
  const record = await getOpsBackupById(id);
  if (!record) {
    return { ok: false, error: 'backup not found' };
  }
  if (record.status !== 'ok') {
    return { ok: false, error: 'backup failed and cannot be restored' };
  }
  let boundary: { allowedRoot: string; targetPath: string };
  try {
    boundary = await sourceLeaseBoundary(record.sourcePath);
  } catch {
    return { ok: false, error: 'source path is not restorable' };
  }

  try {
    return await withLocalJsonWriteLease(
      boundary.targetPath,
      { allowedRoot: boundary.allowedRoot, lockStaleMs: 0 },
      async (lease) => {
        let safeSource: SafeSource;
        try {
          safeSource = await resolveSafeSource(record.sourcePath);
        } catch {
          return { ok: false, error: 'source path is not restorable' };
        }
        if (!record.checksumSha256) {
          return { ok: false, error: 'backup payload checksum missing' };
        }
        const backupFile = await resolveSafeBackupPayload(id);
        await runRestoreHookForTests('after-backup-payload-resolve');
        const backupBuffer = await readExpectedRegularFileNoFollow(backupFile);
        const recheckedBackup = await resolveSafeBackupPayload(id);
        if (!hasSameIdentity(recheckedBackup, backupFile)) {
          return { ok: false, error: 'backup payload changed during restore' };
        }
        const backupChecksum = sha256Hex(backupBuffer);
        if (record.checksumSha256 !== backupChecksum) {
          return { ok: false, error: 'backup payload checksum mismatch' };
        }
        if (
          safeSource.canonicalSiteId
          && !validateCanonicalSiteBackup(backupBuffer, safeSource.canonicalSiteId)
        ) {
          return { ok: false, error: 'invalid builder site backup payload' };
        }

        const leasedOriginal = await readLocalJsonFile(lease);
        if (
          leasedOriginal.kind !== 'present'
          || leasedOriginal.generation.dev !== String(safeSource.dev)
          || leasedOriginal.generation.ino !== String(safeSource.ino)
        ) {
          return { ok: false, error: 'source path changed during restore' };
        }
        const originalSnapshot = await readStableSourceSnapshot(safeSource);
        if (!leasedOriginal.bytes.equals(originalSnapshot.bytes)) {
          return { ok: false, error: 'source file changed during restore' };
        }
        let installedCandidate: InstalledRestore | null = null;
        let restoredBuffer: Buffer;
        const candidateSnapshot: SourceSnapshot = {
          ...originalSnapshot,
          bytes: backupBuffer,
        };
        try {
          const restored = await atomicInstallSnapshot(
            lease,
            safeSource,
            candidateSnapshot,
            safeSource,
            originalSnapshot,
            leasedOriginal.generation,
            (installed) => {
              installedCandidate = installed;
            },
          );
          restoredBuffer = await verifyInstalledRestore(restored.source, backupChecksum);
        } catch (restoreError) {
          if (!installedCandidate) throw restoreError;
          try {
            await rollbackInstalledRestore(
              lease,
              safeSource,
              installedCandidate,
              candidateSnapshot,
              originalSnapshot,
            );
          } catch {
            return {
              ok: false,
              error: 'restore failed and rollback failed; source state is unverified',
              verified: false,
            };
          }
          return {
            ok: false,
            error: restoreError instanceof Error ? restoreError.message : 'restore verification failed',
            verified: false,
          };
        }

        const restoredChecksum = sha256Hex(restoredBuffer);
        return {
          ok: true,
          restoredPath: record.sourcePath,
          verified: true,
          checksumSha256: restoredChecksum,
          sizeBytes: restoredBuffer.byteLength,
        };
      },
    );
  } catch (error) {
    if (isMissingFileError(error) || (error instanceof Error && error.message.startsWith('unsafe backup'))) {
      return { ok: false, error: 'backup payload missing or unsafe' };
    }
    if (error instanceof LocalJsonWriteInvalidPathError) {
      return { ok: false, error: 'source path is not restorable' };
    }
    if (error instanceof LocalJsonWriteConflictError) {
      return { ok: false, error: 'source file changed during restore' };
    }
    if (error instanceof LocalJsonWriteUnavailableError) {
      return { ok: false, error: 'restore failed' };
    }
    return { ok: false, error: error instanceof Error ? error.message : 'restore failed' };
  }
}

async function persistRecord(record: BuilderBackupRecord): Promise<void> {
  await withOpsIndexLease(async (lease) => {
    const current = await readIndexUnderLease(lease);
    current.index.backups.push(record);
    await writeIndexUnderLease(lease, current.index, current.generation);
  });
}

export async function deleteOpsBackup(id: string): Promise<boolean> {
  if (!/^opsbkp_[0-9]+_[a-f0-9]+$/.test(id)) return false;
  const removed = await withOpsIndexLease(async (lease) => {
    const current = await readIndexUnderLease(lease);
    const next = current.index.backups.filter((backup) => backup.id !== id);
    if (next.length === current.index.backups.length) return false;
    await writeIndexUnderLease(lease, { backups: next }, current.generation);
    return true;
  });
  if (!removed) return false;
  const dest = path.join(opsBackupsDir(), `${id}.json.bak`);
  await unlinkIfExists(dest);
  return true;
}

/** Test helper — wipes the disk state. */
export async function _resetOpsBackupsForTests(): Promise<void> {
  await withOpsIndexLease(async (lease) => {
    await atomicRemoveLocalJson(lease);
  });
}
