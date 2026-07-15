import { createHash, randomBytes } from 'node:crypto';
import { constants as fsConstants } from 'node:fs';
import {
  lstat,
  link,
  open,
  readdir,
  realpath,
  rename,
  unlink,
  type FileHandle,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  PersistenceBackendFailureError,
  PersistenceBackendUnavailableError,
  PersistenceConflictError,
  PersistenceInvalidDataError,
  PersistenceMissingError,
  isPersistenceError,
} from './persistence-errors';
import type { VersionedJsonRecord, VersionedJsonStore } from './versioned-json-store';

const DATA_FORMAT = 'file-cas-v1';
const LOCK_FORMAT = 'file-cas-lock-v1';
const DEFAULT_LOCK_STALE_MS = 30_000;
const DEFAULT_ACQUIRE_TIMEOUT_MS = 5_000;
const DEFAULT_RETRY_DELAY_MS = 10;
const DEFAULT_MAX_LOCK_ATTEMPTS = 1_000;

type StaleLockPolicy = 'fail-closed' | 'recover-local-dead-owner';
type OrphanTempPolicy = 'ignore' | 'fail-closed';

export interface FileCasStoreOptions {
  /**
   * Existing, dedicated, trusted directory. The supplied path must already be
   * canonical. Other processes may use this adapter, but hostile pathname
   * replacement inside the directory is outside the portable Node fs model.
   */
  root: string;
  lockStaleMs?: number;
  acquireTimeoutMs?: number;
  retryDelayMs?: number;
  maxLockAttempts?: number;
  staleLockPolicy?: StaleLockPolicy;
  orphanTempPolicy?: OrphanTempPolicy;
  /** Defaults to fail-closed in NODE_ENV=production and allow otherwise. */
  productionMutationPolicy?: 'allow' | 'fail-closed';
  now?: () => number;
  sleep?: (milliseconds: number) => Promise<void>;
}

export type FileVersionedJsonStoreOptions = FileCasStoreOptions;

interface RootIdentity {
  dev: number;
  ino: number;
}

interface DataEnvelope<T> {
  format: typeof DATA_FORMAT;
  key: string;
  generation: string;
  value: T;
}

interface LockEnvelope {
  format: typeof LOCK_FORMAT;
  keyHash: string;
  ownerId: string;
  hostname: string;
  pid: number;
  createdAtMs: number;
}

interface LockIdentity extends LockEnvelope {
  dev: number;
  ino: number;
}

interface OwnedLock {
  path: string;
  identity: LockIdentity;
}

interface KeyPaths {
  hash: string;
  data: string;
  lock: string;
  reclaim: string;
  tempPrefix: string;
}

function isErrno(error: unknown, code: string): error is NodeJS.ErrnoException {
  return error instanceof Error && (error as NodeJS.ErrnoException).code === code;
}

function positiveFinite(value: number | undefined, fallback: number, name: string): number {
  const resolved = value ?? fallback;
  if (!Number.isFinite(resolved) || resolved < 0) {
    throw new PersistenceInvalidDataError(`${name} must be a non-negative finite number`);
  }
  return resolved;
}

function positiveInteger(value: number | undefined, fallback: number, name: string): number {
  const resolved = value ?? fallback;
  if (!Number.isSafeInteger(resolved) || resolved < 1) {
    throw new PersistenceInvalidDataError(`${name} must be a positive safe integer`);
  }
  return resolved;
}

function validateKey(key: string): string {
  if (
    typeof key !== 'string'
    || key.length === 0
    || key.includes('\0')
    || key.includes('\\')
    || path.isAbsolute(key)
  ) {
    throw new PersistenceInvalidDataError('file CAS key is unsafe');
  }

  const segments = key.split('/');
  if (segments.some((segment) => segment.length === 0 || segment === '.' || segment === '..')) {
    throw new PersistenceInvalidDataError('file CAS key is unsafe');
  }
  return key;
}

function hashKey(key: string): string {
  return createHash('sha256').update(key, 'utf8').digest('hex');
}

function versionFor(bytes: Buffer, generation: string): string {
  const contentHash = createHash('sha256').update(bytes).digest('hex');
  return `file-v1:${generation}:${contentHash}`;
}

function secureId(): string {
  try {
    return randomBytes(16).toString('hex');
  } catch (error) {
    throw new PersistenceBackendFailureError('file CAS secure identifier generation failed', {
      cause: error,
    });
  }
}

function sameIdentity(left: Pick<LockIdentity, 'dev' | 'ino'>, right: Pick<LockIdentity, 'dev' | 'ino'>): boolean {
  return left.dev === right.dev && left.ino === right.ino;
}

function sameLock(left: LockIdentity, right: LockIdentity): boolean {
  return sameIdentity(left, right) && left.ownerId === right.ownerId && left.keyHash === right.keyHash;
}

function parseLockEnvelope(bytes: Buffer, expectedHash: string): LockEnvelope {
  let parsed: unknown;
  try {
    parsed = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new PersistenceInvalidDataError('file CAS lock contains malformed JSON', { cause: error });
  }

  if (
    !parsed
    || typeof parsed !== 'object'
    || (parsed as Partial<LockEnvelope>).format !== LOCK_FORMAT
    || (parsed as Partial<LockEnvelope>).keyHash !== expectedHash
    || typeof (parsed as Partial<LockEnvelope>).ownerId !== 'string'
    || !(parsed as Partial<LockEnvelope>).ownerId
    || typeof (parsed as Partial<LockEnvelope>).hostname !== 'string'
    || !(parsed as Partial<LockEnvelope>).hostname
    || !Number.isSafeInteger((parsed as Partial<LockEnvelope>).pid)
    || ((parsed as Partial<LockEnvelope>).pid ?? 0) <= 0
    || !Number.isFinite((parsed as Partial<LockEnvelope>).createdAtMs)
  ) {
    throw new PersistenceInvalidDataError('file CAS lock has an invalid envelope');
  }
  return parsed as LockEnvelope;
}

function parseDataEnvelope<T>(bytes: Buffer, expectedKey: string): VersionedJsonRecord<T> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new PersistenceInvalidDataError('file CAS record contains malformed JSON', { cause: error });
  }

  if (
    !parsed
    || typeof parsed !== 'object'
    || (parsed as Partial<DataEnvelope<T>>).format !== DATA_FORMAT
    || (parsed as Partial<DataEnvelope<T>>).key !== expectedKey
    || typeof (parsed as Partial<DataEnvelope<T>>).generation !== 'string'
    || !/^[a-f0-9]{32}$/.test((parsed as Partial<DataEnvelope<T>>).generation ?? '')
    || !Object.prototype.hasOwnProperty.call(parsed, 'value')
  ) {
    throw new PersistenceInvalidDataError('file CAS record has an invalid envelope');
  }

  const envelope = parsed as DataEnvelope<T>;
  return {
    value: envelope.value,
    version: versionFor(bytes, envelope.generation),
  };
}

function serializeData<T>(key: string, value: T, generation: string): Buffer {
  let text: string | undefined;
  try {
    text = JSON.stringify({ format: DATA_FORMAT, key, generation, value });
  } catch (error) {
    throw new PersistenceInvalidDataError('file CAS value is not JSON serializable', { cause: error });
  }
  if (text === undefined) {
    throw new PersistenceInvalidDataError('file CAS value is not JSON serializable');
  }
  const bytes = Buffer.from(`${text}\n`, 'utf8');
  // Round-trip here so undefined properties and unsupported top-level values fail before mutation.
  parseDataEnvelope<T>(bytes, key);
  return bytes;
}

async function defaultSleep(milliseconds: number): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

async function captureCloseFailure(handle: FileHandle | null): Promise<unknown | null> {
  if (!handle) return null;
  try {
    await handle.close();
    return null;
  } catch (error) {
    return error;
  }
}

export class FileCasStore<T> implements VersionedJsonStore<T> {
  private readonly root: string;
  private readonly lockStaleMs: number;
  private readonly acquireTimeoutMs: number;
  private readonly retryDelayMs: number;
  private readonly maxLockAttempts: number;
  private readonly staleLockPolicy: StaleLockPolicy;
  private readonly orphanTempPolicy: OrphanTempPolicy;
  private readonly productionMutationPolicy: 'allow' | 'fail-closed';
  private readonly now: () => number;
  private readonly sleep: (milliseconds: number) => Promise<void>;
  private readonly hostname = os.hostname();
  private rootIdentity: RootIdentity | null = null;

  constructor(options: FileCasStoreOptions) {
    if (!options || typeof options.root !== 'string' || options.root.length === 0 || options.root.includes('\0')) {
      throw new PersistenceInvalidDataError('file CAS root is required');
    }
    const resolvedRoot = path.resolve(options.root);
    if (
      !path.isAbsolute(options.root)
      || path.normalize(options.root) !== options.root
      || resolvedRoot !== options.root
      || path.dirname(resolvedRoot) === resolvedRoot
    ) {
      throw new PersistenceInvalidDataError('file CAS root must be an absolute canonical store directory');
    }
    this.root = resolvedRoot;
    this.lockStaleMs = positiveFinite(options.lockStaleMs, DEFAULT_LOCK_STALE_MS, 'lockStaleMs');
    this.acquireTimeoutMs = positiveFinite(
      options.acquireTimeoutMs,
      DEFAULT_ACQUIRE_TIMEOUT_MS,
      'acquireTimeoutMs',
    );
    this.retryDelayMs = positiveFinite(options.retryDelayMs, DEFAULT_RETRY_DELAY_MS, 'retryDelayMs');
    this.maxLockAttempts = positiveInteger(
      options.maxLockAttempts,
      DEFAULT_MAX_LOCK_ATTEMPTS,
      'maxLockAttempts',
    );
    this.staleLockPolicy = options.staleLockPolicy ?? 'fail-closed';
    if (
      this.staleLockPolicy !== 'fail-closed'
      && this.staleLockPolicy !== 'recover-local-dead-owner'
    ) {
      throw new PersistenceInvalidDataError('file CAS staleLockPolicy is invalid');
    }
    this.orphanTempPolicy = options.orphanTempPolicy ?? 'ignore';
    if (this.orphanTempPolicy !== 'ignore' && this.orphanTempPolicy !== 'fail-closed') {
      throw new PersistenceInvalidDataError('file CAS orphanTempPolicy is invalid');
    }
    this.productionMutationPolicy = options.productionMutationPolicy
      ?? (process.env.NODE_ENV === 'production' ? 'fail-closed' : 'allow');
    if (
      this.productionMutationPolicy !== 'allow'
      && this.productionMutationPolicy !== 'fail-closed'
    ) {
      throw new PersistenceInvalidDataError('file CAS productionMutationPolicy is invalid');
    }
    this.now = options.now ?? Date.now;
    this.sleep = options.sleep ?? defaultSleep;
  }

  async read(key: string): Promise<VersionedJsonRecord<T>> {
    const safeKey = validateKey(key);
    const keyPaths = this.pathsFor(safeKey);
    await this.assertRootStable();
    return this.readData(safeKey, keyPaths.data);
  }

  async create(key: string, value: T): Promise<VersionedJsonRecord<T>> {
    const safeKey = validateKey(key);
    this.assertMutationsAllowed();
    return this.withKeyLock(safeKey, async (keyPaths, ownedLock) => {
      await this.assertNoBlockingOrphanTemps(keyPaths);
      try {
        await this.readData(safeKey, keyPaths.data);
      } catch (error) {
        if (!(error instanceof PersistenceMissingError)) throw error;
        return this.writeData(safeKey, value, keyPaths, ownedLock);
      }
      throw new PersistenceConflictError('file CAS record already exists');
    });
  }

  async compareAndSet(key: string, expectedVersion: string, value: T): Promise<VersionedJsonRecord<T>> {
    const safeKey = validateKey(key);
    if (typeof expectedVersion !== 'string' || expectedVersion.length === 0) {
      throw new PersistenceInvalidDataError('file CAS expected version is required');
    }
    this.assertMutationsAllowed();
    return this.withKeyLock(safeKey, async (keyPaths, ownedLock) => {
      await this.assertNoBlockingOrphanTemps(keyPaths);
      const current = await this.readConditionalData(safeKey, keyPaths.data);
      if (current.version !== expectedVersion) {
        throw new PersistenceConflictError('file CAS version conflict');
      }
      return this.writeData(safeKey, value, keyPaths, ownedLock);
    });
  }

  async compareAndDelete(key: string, expectedVersion: string): Promise<void> {
    const safeKey = validateKey(key);
    if (typeof expectedVersion !== 'string' || expectedVersion.length === 0) {
      throw new PersistenceInvalidDataError('file CAS expected version is required');
    }
    this.assertMutationsAllowed();
    return this.withKeyLock(safeKey, async (keyPaths, ownedLock) => {
      await this.assertNoBlockingOrphanTemps(keyPaths);
      const current = await this.readConditionalData(safeKey, keyPaths.data);
      if (current.version !== expectedVersion) {
        throw new PersistenceConflictError('file CAS version conflict');
      }
      await this.assertOwnsLock(ownedLock);
      const quarantine = path.join(
        this.root,
        `${keyPaths.tempPrefix}${ownedLock.identity.ownerId}.${secureId()}.delete`,
      );
      try {
        await rename(keyPaths.data, quarantine);
      } catch (error) {
        if (isErrno(error, 'ENOENT')) {
          await this.assertRootStable();
          throw new PersistenceConflictError('file CAS record changed during delete', { cause: error });
        }
        throw new PersistenceBackendFailureError('file CAS delete quarantine failed', { cause: error });
      }

      let quarantined: VersionedJsonRecord<T>;
      try {
        quarantined = await this.readData(safeKey, quarantine);
      } catch (error) {
        await this.restoreQuarantinedPath(quarantine, keyPaths.data);
        if (error instanceof PersistenceMissingError) {
          throw new PersistenceConflictError('file CAS record changed during delete', { cause: error });
        }
        throw error;
      }
      if (quarantined.version !== expectedVersion) {
        await this.restoreQuarantinedPath(quarantine, keyPaths.data);
        throw new PersistenceConflictError('file CAS record changed during delete');
      }
      try {
        await unlink(quarantine);
      } catch (error) {
        if (!isErrno(error, 'ENOENT')) {
          throw new PersistenceBackendFailureError('file CAS quarantined delete failed', { cause: error });
        }
      }
      await this.syncRootDirectory();
    });
  }

  private pathsFor(key: string): KeyPaths {
    const hash = hashKey(key);
    return {
      hash,
      data: path.join(this.root, `cas-${hash}.json`),
      lock: path.join(this.root, `.cas-${hash}.lock`),
      reclaim: path.join(this.root, `.cas-${hash}.reclaim`),
      tempPrefix: `.cas-${hash}.`,
    };
  }

  private assertMutationsAllowed(): void {
    if (this.productionMutationPolicy === 'fail-closed') {
      throw new PersistenceBackendUnavailableError('file CAS local mutations are fail-closed');
    }
  }

  private readNow(): number {
    try {
      const value = this.now();
      if (!Number.isFinite(value) || value < 0) {
        throw new TypeError('clock returned an invalid timestamp');
      }
      return value;
    } catch (error) {
      if (isPersistenceError(error)) throw error;
      throw new PersistenceBackendFailureError('file CAS clock failed', { cause: error });
    }
  }

  private async waitForRetry(milliseconds: number): Promise<void> {
    try {
      await this.sleep(milliseconds);
    } catch (error) {
      if (isPersistenceError(error)) throw error;
      throw new PersistenceBackendFailureError('file CAS retry wait failed', { cause: error });
    }
  }

  private async assertRootStable(): Promise<void> {
    try {
      const rootStat = await lstat(this.root);
      if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
        throw new PersistenceInvalidDataError('file CAS root must be a real directory');
      }
      const physicalRoot = await realpath(this.root);
      if (physicalRoot !== this.root) {
        throw new PersistenceInvalidDataError('file CAS root path must already be canonical');
      }
      const current = { dev: rootStat.dev, ino: rootStat.ino };
      if (this.rootIdentity && !sameIdentity(this.rootIdentity, current)) {
        throw new PersistenceBackendUnavailableError('file CAS root identity changed');
      }
      this.rootIdentity ??= current;
    } catch (error) {
      if (isPersistenceError(error)) throw error;
      if (isErrno(error, 'ENOENT')) {
        throw new PersistenceBackendUnavailableError('file CAS root is missing', { cause: error });
      }
      throw new PersistenceBackendFailureError('file CAS root validation failed', { cause: error });
    }
  }

  private async readData(key: string, filePath: string): Promise<VersionedJsonRecord<T>> {
    let handle: FileHandle | null = null;
    try {
      handle = await open(filePath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
      const before = await handle.stat();
      if (!before.isFile()) throw new PersistenceInvalidDataError('file CAS record is not a regular file');
      const bytes = await handle.readFile();
      const after = await handle.stat();
      if (
        !after.isFile()
        || before.dev !== after.dev
        || before.ino !== after.ino
        || before.size !== after.size
        || before.size !== bytes.byteLength
        || before.mtimeMs !== after.mtimeMs
      ) {
        throw new PersistenceBackendFailureError('file CAS record changed while being read');
      }
      await this.assertRootStable();
      return parseDataEnvelope<T>(bytes, key);
    } catch (error) {
      if (isPersistenceError(error)) throw error;
      if (isErrno(error, 'ENOENT')) {
        await this.assertRootStable();
        throw new PersistenceMissingError('file CAS record is missing', { cause: error });
      }
      if (isErrno(error, 'ELOOP')) {
        throw new PersistenceInvalidDataError('file CAS record must not be a symbolic link', { cause: error });
      }
      throw new PersistenceBackendFailureError('file CAS read failed', { cause: error });
    } finally {
      const closeError = await captureCloseFailure(handle);
      if (closeError) {
        throw new PersistenceBackendFailureError('file CAS read handle close failed', {
          cause: closeError,
        });
      }
    }
  }

  private async withKeyLock<R>(
    key: string,
    operation: (keyPaths: KeyPaths, lock: OwnedLock) => Promise<R>,
  ): Promise<R> {
    const keyPaths = this.pathsFor(key);
    await this.assertRootStable();
    const ownedLock = await this.acquireLock(keyPaths);
    try {
      return await operation(keyPaths, ownedLock);
    } finally {
      await this.releaseOwnedLock(ownedLock);
    }
  }

  private async readConditionalData(key: string, filePath: string): Promise<VersionedJsonRecord<T>> {
    try {
      return await this.readData(key, filePath);
    } catch (error) {
      if (error instanceof PersistenceMissingError) {
        throw new PersistenceConflictError('file CAS conditional target no longer exists', {
          cause: error,
        });
      }
      throw error;
    }
  }

  private async acquireLock(keyPaths: KeyPaths): Promise<OwnedLock> {
    const startedAt = this.readNow();
    let attempts = 0;

    while (attempts < this.maxLockAttempts) {
      attempts += 1;
      const ownerId = `${process.pid}-${secureId()}`;
      const envelope: LockEnvelope = {
        format: LOCK_FORMAT,
        keyHash: keyPaths.hash,
        ownerId,
        hostname: this.hostname,
        pid: process.pid,
        createdAtMs: this.readNow(),
      };
      const candidatePath = path.join(
        this.root,
        `${keyPaths.tempPrefix}${ownerId}.lock-candidate`,
      );
      const acquired = await this.tryPublishControlFile(
        keyPaths.lock,
        candidatePath,
        envelope,
        'file CAS lock',
      );
      if (acquired) return acquired;

      const reclaimed = await this.tryReclaimStaleLock(keyPaths);
      if (reclaimed) continue;

      const elapsed = Math.max(0, this.readNow() - startedAt);
      if (elapsed >= this.acquireTimeoutMs || attempts >= this.maxLockAttempts) break;
      await this.waitForRetry(
        Math.min(this.retryDelayMs, Math.max(0, this.acquireTimeoutMs - elapsed)),
      );
    }

    throw new PersistenceBackendUnavailableError('file CAS lock acquisition timed out');
  }

  private async tryPublishControlFile(
    canonicalPath: string,
    candidatePath: string,
    envelope: LockEnvelope,
    label: string,
  ): Promise<OwnedLock | null> {
    let handle: FileHandle | null = null;
    let candidate: OwnedLock | null = null;
    let canonicalLinked = false;
    try {
      handle = await open(
        candidatePath,
        fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_WRONLY | fsConstants.O_NOFOLLOW,
        0o600,
      );
      const openedStat = await handle.stat();
      if (!openedStat.isFile()) {
        throw new PersistenceInvalidDataError(`${label} candidate is not a regular file`);
      }
      candidate = {
        path: candidatePath,
        identity: { ...envelope, dev: openedStat.dev, ino: openedStat.ino },
      };
      await handle.writeFile(`${JSON.stringify(envelope)}\n`, 'utf8');
      await handle.sync();
      const completedStat = await handle.stat();
      if (
        !completedStat.isFile()
        || completedStat.dev !== openedStat.dev
        || completedStat.ino !== openedStat.ino
      ) {
        throw new PersistenceBackendFailureError(`${label} candidate identity changed`);
      }
      const closeError = await captureCloseFailure(handle);
      handle = null;
      if (closeError) {
        throw new PersistenceBackendFailureError(`${label} candidate close failed`, {
          cause: closeError,
        });
      }

      try {
        await link(candidatePath, canonicalPath);
        canonicalLinked = true;
      } catch (error) {
        if (isErrno(error, 'EEXIST')) {
          await this.cleanupOwnedCandidate(candidate);
          return null;
        }
        throw new PersistenceBackendFailureError(`${label} atomic publication failed`, { cause: error });
      }

      await this.syncRootDirectory();
      const published = await this.inspectLock(canonicalPath, envelope.keyHash);
      if (!published || !sameLock(published, candidate.identity)) {
        throw new PersistenceBackendFailureError(`${label} publication identity changed`);
      }
      await this.cleanupOwnedCandidate(candidate);
      return { path: canonicalPath, identity: published };
    } catch (error) {
      const closeError = await captureCloseFailure(handle);
      handle = null;
      if (canonicalLinked && candidate) {
        await this.cleanupOwnedCandidate({ ...candidate, path: canonicalPath });
      }
      if (candidate) await this.cleanupOwnedCandidate(candidate);
      if (isPersistenceError(error)) throw error;
      throw new PersistenceBackendFailureError(`${label} candidate preparation failed`, {
        cause: closeError ? { error, closeError } : error,
      });
    }
  }

  private async tryReclaimStaleLock(keyPaths: KeyPaths): Promise<boolean> {
    let first: LockIdentity | null;
    try {
      first = await this.inspectLock(keyPaths.lock, keyPaths.hash);
    } catch (error) {
      // Canonical control files are atomically hard-linked only after fsync.
      // An unreadable regular canonical file is therefore legacy/corrupt state:
      // keep it fail-closed and never guess that it is safe to reclaim.
      if (
        error instanceof PersistenceInvalidDataError
        || error instanceof PersistenceBackendFailureError
      ) {
        try {
          const lockStat = await lstat(keyPaths.lock);
          if (lockStat.isSymbolicLink() || !lockStat.isFile()) throw error;
          return false;
        } catch (statError) {
          if (isErrno(statError, 'ENOENT')) return true;
          if (statError === error) throw error;
          throw new PersistenceBackendFailureError('file CAS contended lock validation failed', {
            cause: statError,
          });
        }
      }
      throw error;
    }
    if (!first) return true;
    if (this.staleLockPolicy !== 'recover-local-dead-owner') return false;
    if (!this.isReclaimable(first)) return false;

    const reclaimerId = `${process.pid}-${secureId()}`;
    const guard = await this.tryAcquireReclaimGuard(keyPaths, reclaimerId);
    if (!guard) return false;

    try {
      const confirmed = await this.inspectLock(keyPaths.lock, keyPaths.hash);
      if (!confirmed) return true;
      if (!sameLock(first, confirmed) || !this.isReclaimable(confirmed)) return false;

      const quarantine = path.join(this.root, `${keyPaths.tempPrefix}${reclaimerId}.stale`);
      try {
        await rename(keyPaths.lock, quarantine);
      } catch (error) {
        if (isErrno(error, 'ENOENT')) return true;
        throw new PersistenceBackendFailureError('file CAS stale lock quarantine failed', { cause: error });
      }

      const quarantined = await this.inspectLock(quarantine, keyPaths.hash);
      if (!quarantined || !sameLock(confirmed, quarantined)) {
        await this.restoreQuarantinedPath(quarantine, keyPaths.lock);
        throw new PersistenceBackendFailureError('file CAS stale lock identity changed during quarantine');
      }
      await unlink(quarantine);
      await this.syncRootDirectory();
      return true;
    } finally {
      await this.releaseReclaimGuard(guard);
    }
  }

  private isReclaimable(lock: LockIdentity): boolean {
    const age = this.readNow() - lock.createdAtMs;
    if (!Number.isFinite(age) || age < this.lockStaleMs) return false;
    if (lock.hostname !== this.hostname) return false;
    return !this.isProcessAlive(lock.pid);
  }

  private isProcessAlive(pid: number): boolean {
    if (pid === process.pid) return true;
    try {
      process.kill(pid, 0);
      return true;
    } catch (error) {
      return !isErrno(error, 'ESRCH');
    }
  }

  private async tryAcquireReclaimGuard(keyPaths: KeyPaths, ownerId: string): Promise<OwnedLock | null> {
    const envelope: LockEnvelope = {
      format: LOCK_FORMAT,
      keyHash: keyPaths.hash,
      ownerId,
      hostname: this.hostname,
      pid: process.pid,
      createdAtMs: this.readNow(),
    };
    const candidatePath = path.join(
      this.root,
      `${keyPaths.tempPrefix}${ownerId}.reclaim-candidate`,
    );
    const acquired = await this.tryPublishControlFile(
      keyPaths.reclaim,
      candidatePath,
      envelope,
      'file CAS reclaim guard',
    );
    if (acquired) return acquired;

    let existing: LockIdentity | null;
    try {
      existing = await this.inspectLock(keyPaths.reclaim, keyPaths.hash);
    } catch (error) {
      if (
        error instanceof PersistenceInvalidDataError
        || error instanceof PersistenceBackendFailureError
      ) {
        throw new PersistenceBackendUnavailableError(
          'file CAS reclaim guard cannot be safely recovered',
          { cause: error },
        );
      }
      throw error;
    }
    if (!existing) return null;
    if (this.isReclaimable(existing)) {
      // Reclaiming the reclaimer would require another continuously-held
      // cross-process guard. Portable Node has no conditional unlink/rename,
      // so recursively recovering this pathname can briefly vacate a live
      // successor guard. Preserve both files and require operator review.
      throw new PersistenceBackendUnavailableError(
        'file CAS stale reclaim guard requires operator review',
      );
    }
    return null;
  }

  private async releaseReclaimGuard(guard: OwnedLock): Promise<void> {
    await this.releaseOwnedPath(guard, 'file CAS reclaim guard');
  }

  private async inspectLock(filePath: string, expectedHash: string): Promise<LockIdentity | null> {
    let handle: FileHandle | null = null;
    try {
      handle = await open(filePath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
      const before = await handle.stat();
      if (!before.isFile()) throw new PersistenceInvalidDataError('file CAS lock is not a regular file');
      const bytes = await handle.readFile();
      const after = await handle.stat();
      if (
        !after.isFile()
        || before.dev !== after.dev
        || before.ino !== after.ino
        || before.size !== after.size
        || before.size !== bytes.byteLength
        || before.mtimeMs !== after.mtimeMs
      ) {
        throw new PersistenceBackendFailureError('file CAS lock changed while being read');
      }
      return { ...parseLockEnvelope(bytes, expectedHash), dev: after.dev, ino: after.ino };
    } catch (error) {
      if (isErrno(error, 'ENOENT')) return null;
      if (isPersistenceError(error)) throw error;
      if (isErrno(error, 'ELOOP')) {
        throw new PersistenceInvalidDataError('file CAS lock must not be a symbolic link', { cause: error });
      }
      throw new PersistenceBackendFailureError('file CAS lock inspection failed', { cause: error });
    } finally {
      const closeError = await captureCloseFailure(handle);
      if (closeError) {
        throw new PersistenceBackendFailureError('file CAS lock inspection handle close failed', {
          cause: closeError,
        });
      }
    }
  }

  private async assertOwnsLock(owned: OwnedLock): Promise<void> {
    const current = await this.inspectLock(owned.path, owned.identity.keyHash);
    if (!current || !sameLock(current, owned.identity)) {
      throw new PersistenceConflictError('file CAS lock ownership was lost');
    }
    await this.assertRootStable();
  }

  private async releaseOwnedLock(owned: OwnedLock): Promise<void> {
    await this.releaseOwnedPath(owned, 'file CAS lock');
  }

  private async cleanupOwnedCandidate(owned: OwnedLock): Promise<void> {
    try {
      const current = await lstat(owned.path);
      if (
        current.isSymbolicLink()
        || !current.isFile()
        || current.dev !== owned.identity.dev
        || current.ino !== owned.identity.ino
      ) {
        return;
      }
      const quarantine = path.join(
        this.root,
        `.cas-${owned.identity.keyHash}.${secureId()}.candidate-cleanup`,
      );
      await rename(owned.path, quarantine);
      const quarantined = await lstat(quarantine);
      if (
        quarantined.isSymbolicLink()
        || !quarantined.isFile()
        || quarantined.dev !== owned.identity.dev
        || quarantined.ino !== owned.identity.ino
      ) {
        await this.restoreQuarantinedPath(quarantine, owned.path);
        return;
      }
      await unlink(quarantine);
      await this.syncRootDirectory();
    } catch (error) {
      // Preserve the acquisition failure. A missing or identity-mismatched path
      // is not ours, and cleanup must never widen into deleting it.
      if (!isErrno(error, 'ENOENT')) return;
    }
  }

  private async releaseOwnedPath(owned: OwnedLock, label: string): Promise<void> {
    const current = await this.inspectLock(owned.path, owned.identity.keyHash);
    if (!current || !sameLock(current, owned.identity)) return;
    const quarantine = path.join(
      this.root,
      `.cas-${owned.identity.keyHash}.${secureId()}.release`,
    );
    try {
      await rename(owned.path, quarantine);
      const quarantined = await this.inspectLock(quarantine, owned.identity.keyHash);
      if (!quarantined || !sameLock(quarantined, owned.identity)) {
        await this.restoreQuarantinedPath(quarantine, owned.path);
        throw new PersistenceConflictError(`${label} ownership changed during release`);
      }
      await unlink(quarantine);
      await this.syncRootDirectory();
    } catch (error) {
      if (isErrno(error, 'ENOENT')) return;
      if (isPersistenceError(error)) throw error;
      throw new PersistenceBackendFailureError(`${label} release failed`, { cause: error });
    }
  }

  private async restoreQuarantinedPath(quarantine: string, destination: string): Promise<boolean> {
    try {
      await link(quarantine, destination);
    } catch (error) {
      if (isErrno(error, 'ENOENT') || isErrno(error, 'EEXIST')) return false;
      throw new PersistenceBackendFailureError('file CAS quarantine restore failed', { cause: error });
    }
    try {
      await unlink(quarantine);
      await this.syncRootDirectory();
      return true;
    } catch (error) {
      if (isErrno(error, 'ENOENT')) {
        await this.syncRootDirectory();
        return true;
      }
      throw new PersistenceBackendFailureError('file CAS quarantine cleanup failed', { cause: error });
    }
  }

  private async assertNoBlockingOrphanTemps(keyPaths: KeyPaths): Promise<void> {
    if (this.orphanTempPolicy !== 'fail-closed') return;
    let entries: string[];
    try {
      entries = await readdir(this.root);
    } catch (error) {
      throw new PersistenceBackendFailureError('file CAS orphan temp scan failed', { cause: error });
    }
    if (entries.some((entry) => entry.startsWith(keyPaths.tempPrefix) && entry.endsWith('.tmp'))) {
      throw new PersistenceBackendUnavailableError('file CAS orphan temp requires operator review');
    }
  }

  private async writeData(
    key: string,
    value: T,
    keyPaths: KeyPaths,
    ownedLock: OwnedLock,
  ): Promise<VersionedJsonRecord<T>> {
    const generation = secureId();
    const bytes = serializeData(key, value, generation);
    const tempPath = path.join(this.root, `${keyPaths.tempPrefix}${ownedLock.identity.ownerId}.tmp`);
    let handle: FileHandle | null = null;
    let tempOwned = false;
    try {
      await this.assertSafeDataDestination(keyPaths.data);
      handle = await open(
        tempPath,
        fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_WRONLY | fsConstants.O_NOFOLLOW,
        0o600,
      );
      tempOwned = true;
      await handle.writeFile(bytes);
      await handle.sync();
      await handle.close();
      handle = null;
      await this.assertOwnsLock(ownedLock);
      await this.assertSafeDataDestination(keyPaths.data);
      await rename(tempPath, keyPaths.data);
      tempOwned = false;
      await this.syncRootDirectory();
      await this.assertRootStable();
      return parseDataEnvelope<T>(bytes, key);
    } catch (error) {
      if (isPersistenceError(error)) throw error;
      throw new PersistenceBackendFailureError('file CAS atomic write failed', { cause: error });
    } finally {
      const closeError = await captureCloseFailure(handle);
      if (tempOwned) {
        try {
          await unlink(tempPath);
        } catch (error) {
          if (!isErrno(error, 'ENOENT')) {
            // Preserve the primary failure. This unique path can only be ours.
          }
        }
      }
      if (closeError) {
        throw new PersistenceBackendFailureError('file CAS temp handle close failed', {
          cause: closeError,
        });
      }
    }
  }

  private async assertSafeDataDestination(filePath: string): Promise<void> {
    try {
      const fileStat = await lstat(filePath);
      if (fileStat.isSymbolicLink() || !fileStat.isFile()) {
        throw new PersistenceInvalidDataError('file CAS destination must be a regular file or absent');
      }
    } catch (error) {
      if (isErrno(error, 'ENOENT')) return;
      if (isPersistenceError(error)) throw error;
      throw new PersistenceBackendFailureError('file CAS destination validation failed', { cause: error });
    }
  }

  private async syncRootDirectory(): Promise<void> {
    let handle: FileHandle | null = null;
    try {
      handle = await open(this.root, fsConstants.O_RDONLY | fsConstants.O_DIRECTORY | fsConstants.O_NOFOLLOW);
      const rootStat = await handle.stat();
      if (!rootStat.isDirectory()) throw new PersistenceInvalidDataError('file CAS root is not a directory');
      if (this.rootIdentity && !sameIdentity(this.rootIdentity, rootStat)) {
        throw new PersistenceBackendUnavailableError('file CAS root identity changed');
      }
      await handle.sync();
    } catch (error) {
      if (isPersistenceError(error)) throw error;
      throw new PersistenceBackendFailureError('file CAS directory fsync failed', { cause: error });
    } finally {
      const closeError = await captureCloseFailure(handle);
      if (closeError) {
        throw new PersistenceBackendFailureError('file CAS directory handle close failed', {
          cause: closeError,
        });
      }
    }
  }
}

export function createFileCasStore<T>(options: FileCasStoreOptions): VersionedJsonStore<T> {
  return new FileCasStore<T>(options);
}

export function createFileVersionedJsonStore<T>(
  options: FileVersionedJsonStoreOptions,
): VersionedJsonStore<T> {
  return createFileCasStore<T>(options);
}
