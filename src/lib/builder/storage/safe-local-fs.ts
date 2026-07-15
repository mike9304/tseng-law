import { createHash, randomBytes } from 'node:crypto';
import { constants as fsConstants, type Stats } from 'node:fs';
import {
  lstat,
  link,
  mkdir,
  open,
  readdir,
  realpath,
  rename,
  unlink,
  type FileHandle,
} from 'node:fs/promises';
import path from 'node:path';

/**
 * Node does not expose openat(2)/renameat2(2), so pathname traversal cannot be
 * made perfectly race-free against a hostile process that can replace an
 * ancestor between the final identity check and the pathname-based syscall.
 *
 * This helper fails closed for every race it can observe: it uses a canonical,
 * identity-pinned root; rejects symlinks; validates every existing component
 * with lstat + realpath before sensitive I/O; opens leaves with O_NOFOLLOW;
 * compares fstat with the pathname's lstat identity; and validates again after
 * I/O. Consumers that require a proof against a malicious local process must
 * use a native dirfd/openat sandbox instead of this portable Node helper.
 */
export const SAFE_LOCAL_FS_SECURITY_MODEL = Object.freeze({
  ancestorTraversal: 'detect-but-cannot-portably-eliminate' as const,
  requiredForHostileLocalWriters: 'native-dirfd-openat-sandbox' as const,
});

export type SafeLocalFsSafetyCode =
  | 'unsafe_root'
  | 'unsafe_path'
  | 'symlink_rejected'
  | 'hardlink_rejected'
  | 'wrong_file_type'
  | 'identity_race'
  | 'not_found'
  | 'already_exists'
  | 'io_failure'
  | 'unsupported_platform';

export class SafeLocalFsSafetyError extends Error {
  constructor(
    public readonly code: SafeLocalFsSafetyCode,
    message: string,
    options: { errno?: string } = {},
  ) {
    super(message);
    this.name = 'SafeLocalFsSafetyError';
    this.errno = options.errno;
  }

  readonly errno?: string;
}

/** Lets read/list consumers retain their existing "missing means empty" API. */
export function isSafeLocalFsNotFoundError(error: unknown): boolean {
  return error instanceof SafeLocalFsSafetyError
    ? error.code === 'not_found' || (error.code === 'unsafe_root' && error.errno === 'ENOENT')
    : isErrno(error, 'ENOENT');
}

/**
 * Internal fail-closed marker: the durable exclusive public link was already
 * committed (link(2) + parent-directory fsync succeeded). Any later failure
 * must NOT drive the outer writer's rollback, because that rollback would
 * unlink the durable public target. The error still propagates so callers see
 * the post-commit fault, but the committed target is left in place and stays
 * rejected until an operator resolves it.
 */
class SafeLocalFsCommittedExclusiveMarker extends SafeLocalFsSafetyError {
  constructor(message: string) {
    super('identity_race', message);
    this.name = 'SafeLocalFsCommittedExclusiveMarker';
  }
}

function isCommittedExclusiveMarker(error: unknown): boolean {
  return error instanceof SafeLocalFsCommittedExclusiveMarker;
}

export function isSafeLocalFsPlatformSupported(
  platform: NodeJS.Platform = process.platform,
  constants: Pick<typeof fsConstants, 'O_NOFOLLOW' | 'O_DIRECTORY'> = fsConstants,
): boolean {
  return platform !== 'win32'
    && typeof constants.O_NOFOLLOW === 'number'
    && constants.O_NOFOLLOW > 0
    && typeof constants.O_DIRECTORY === 'number'
    && constants.O_DIRECTORY > 0;
}

export interface SafeLocalFileInfo {
  name: string;
  size: number;
  mtime: Date;
  dev: number;
  ino: number;
}

export interface SafeLocalWriteOptions {
  /** Defaults to false. Exclusive writes never replace an existing leaf. */
  overwrite?: boolean;
  mode?: number;
}

export type SafeLocalFsTestHookStage =
  | 'after-preflight-before-open'
  | 'after-open-before-identity-check'
  | 'after-identity-check-before-read'
  | 'after-identity-check-before-write'
  | 'after-preflight-before-directory-io'
  | 'after-preflight-before-rename'
  | 'after-exclusive-link-before-cleanup'
  | 'before-committed-temp-unlink'
  | 'after-preflight-before-unlink'
  | 'after-quarantine-before-delete'
  | 'before-directory-sync'
  | 'after-directory-sync';

type SafeLocalFsTestHook = (
  stage: SafeLocalFsTestHookStage,
  absolutePath: string,
) => void | Promise<void>;

let testHook: SafeLocalFsTestHook | null = null;

/** Test-only deterministic race injection. */
export function _setSafeLocalFsHookForTests(hook: SafeLocalFsTestHook | null): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('safe local fs hooks are only available under NODE_ENV=test');
  }
  testHook = hook;
}

async function runTestHook(stage: SafeLocalFsTestHookStage, absolutePath: string): Promise<void> {
  await testHook?.(stage, absolutePath);
}

function isErrno(error: unknown, code: string): error is NodeJS.ErrnoException {
  return error instanceof Error && (error as NodeJS.ErrnoException).code === code;
}

function errnoOf(error: unknown): string | undefined {
  return error instanceof Error && typeof (error as NodeJS.ErrnoException).code === 'string'
    ? (error as NodeJS.ErrnoException).code
    : undefined;
}

function redactFsError(error: unknown, operation: string): SafeLocalFsSafetyError {
  if (error instanceof SafeLocalFsSafetyError) return error;
  const errno = errnoOf(error);
  if (errno === 'ENOENT') {
    return new SafeLocalFsSafetyError('not_found', `safe local fs ${operation} target was not found`, { errno });
  }
  if (errno === 'EEXIST') {
    return new SafeLocalFsSafetyError('already_exists', `safe local fs ${operation} target already exists`, { errno });
  }
  if (errno === 'ENOTSUP' || errno === 'EOPNOTSUPP' || errno === 'ENOSYS') {
    return new SafeLocalFsSafetyError(
      'unsupported_platform',
      `safe local fs ${operation} is unsupported on this filesystem`,
      { errno },
    );
  }
  return new SafeLocalFsSafetyError('io_failure', `safe local fs ${operation} failed`, { errno });
}

function sameIdentity(left: Pick<Stats, 'dev' | 'ino'>, right: Pick<Stats, 'dev' | 'ino'>): boolean {
  return left.dev === right.dev && left.ino === right.ino;
}

function isInsideOrEqual(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === '' || (
    relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

function normalizeRelativePath(relativePath: string, allowRoot: boolean): string {
  const rawParts = typeof relativePath === 'string' ? relativePath.split(/[\\/]+/) : [];
  if (
    typeof relativePath !== 'string'
    || relativePath.includes('\0')
    || relativePath.includes('\\')
    || path.isAbsolute(relativePath)
    || /^[a-zA-Z]:/.test(relativePath)
    || rawParts.some((part) => part === '..')
  ) {
    throw new SafeLocalFsSafetyError('unsafe_path', 'safe local fs path must be relative');
  }

  const normalized = path.normalize(relativePath || '.');
  const parts = normalized.split(path.sep);
  if (
    normalized === '..'
    || normalized.startsWith(`..${path.sep}`)
    || parts.some((part) => part === '..')
    || (!allowRoot && (normalized === '.' || normalized === ''))
  ) {
    throw new SafeLocalFsSafetyError('unsafe_path', 'safe local fs path escapes its root');
  }
  return normalized;
}

const INTERNAL_ENTRY_PREFIX = '.safe-local-fs-';

function targetNameDigest(targetName: string): string {
  return createHash('sha256').update(targetName, 'utf8').digest('hex').slice(0, 32);
}

type WriteTempState = 'pending' | 'ready';

function randomWriteTempName(state: WriteTempState, targetName: string): string {
  return `${INTERNAL_ENTRY_PREFIX}write-${state}-${targetNameDigest(targetName)}-${randomBytes(16).toString('hex')}.tmp`;
}

function readyWriteTempName(pendingName: string): string {
  if (!/^\.safe-local-fs-write-pending-[a-f0-9]{32}-[a-f0-9]{32}\.tmp$/.test(pendingName)) {
    throw new SafeLocalFsSafetyError('unsafe_path', 'safe local fs pending write name is invalid');
  }
  return pendingName.replace(
    `${INTERNAL_ENTRY_PREFIX}write-pending-`,
    `${INTERNAL_ENTRY_PREFIX}write-ready-`,
  );
}

type DeleteQuarantineState = 'pending' | 'committed';

function randomDeleteQuarantineName(state: DeleteQuarantineState, targetName: string): string {
  const encodedTarget = Buffer.from(targetName, 'utf8').toString('base64url');
  const name = `${INTERNAL_ENTRY_PREFIX}delete-${state}-${encodedTarget}.${randomBytes(16).toString('hex')}.tmp`;
  if (Buffer.byteLength(name, 'utf8') > 240) {
    throw new SafeLocalFsSafetyError('unsafe_path', 'safe local fs filename is too long for removal');
  }
  return name;
}

function parseDeleteQuarantine(
  name: string,
): { state: DeleteQuarantineState; targetName: string } | null {
  const match = /^\.safe-local-fs-delete-(pending|committed)-([A-Za-z0-9_-]+)\.[a-f0-9]{32}\.tmp$/.exec(name);
  if (!match) return null;
  try {
    const decoded = Buffer.from(match[2]!, 'base64url').toString('utf8');
    if (
      !decoded
      || decoded === '.'
      || decoded === '..'
      || decoded.includes('/')
      || decoded.includes('\\')
      || decoded.includes('\0')
      || Buffer.from(decoded, 'utf8').toString('base64url') !== match[2]
    ) return null;
    return { state: match[1]! as DeleteQuarantineState, targetName: decoded };
  } catch {
    return null;
  }
}

type ReplaceBackupState = 'pending' | 'committed';

function randomReplaceBackupName(state: ReplaceBackupState, targetName: string): string {
  const encodedTarget = Buffer.from(targetName, 'utf8').toString('base64url');
  const name = `${INTERNAL_ENTRY_PREFIX}replace-${state}-${encodedTarget}.${randomBytes(16).toString('hex')}.tmp`;
  if (Buffer.byteLength(name, 'utf8') > 240) {
    throw new SafeLocalFsSafetyError('unsafe_path', 'safe local fs filename is too long for replacement');
  }
  return name;
}

function parseReplaceBackup(
  name: string,
): { state: ReplaceBackupState; targetName: string } | null {
  const match = /^\.safe-local-fs-replace-(pending|committed)-([A-Za-z0-9_-]+)\.[a-f0-9]{32}\.tmp$/.exec(name);
  if (!match) return null;
  try {
    const targetName = Buffer.from(match[2]!, 'base64url').toString('utf8');
    if (
      !targetName
      || targetName === '.'
      || targetName === '..'
      || targetName.includes('/')
      || targetName.includes('\\')
      || targetName.includes('\0')
      || Buffer.from(targetName, 'utf8').toString('base64url') !== match[2]
    ) return null;
    return { state: match[1]! as ReplaceBackupState, targetName };
  } catch {
    return null;
  }
}

function isInternalEntryName(name: string): boolean {
  return name.startsWith(INTERNAL_ENTRY_PREFIX) && name.endsWith('.tmp');
}

function assertNoInternalPathSegments(normalizedPath: string): void {
  if (normalizedPath.split(path.sep).some(isInternalEntryName)) {
    throw new SafeLocalFsSafetyError('unsafe_path', 'safe local fs internal paths are reserved');
  }
}

async function closeIgnoringFailure(handle: FileHandle | null): Promise<void> {
  if (handle) {
    try {
      await handle.close();
    } catch {
      // The original safety/I/O failure is more actionable than close failure.
    }
  }
}

export class SafeLocalFsRoot {
  private constructor(
    public readonly root: string,
    private readonly rootIdentity: Pick<Stats, 'dev' | 'ino'>,
  ) {}

  static async open(allowedRoot: string): Promise<SafeLocalFsRoot> {
    try {
      if (!isSafeLocalFsPlatformSupported()) {
        throw new SafeLocalFsSafetyError(
          'unsupported_platform',
          'safe local fs requires O_NOFOLLOW and directory descriptor support',
        );
      }
      if (typeof allowedRoot !== 'string' || !allowedRoot || allowedRoot.includes('\0')) {
        throw new SafeLocalFsSafetyError('unsafe_root', 'safe local fs root is required');
      }

      const configured = path.resolve(allowedRoot);
      let configuredStat: Stats;
      try {
        configuredStat = await lstat(configured);
      } catch (error) {
        if (!isErrno(error, 'ENOENT')) throw redactFsError(error, 'inspect root');
        throw new SafeLocalFsSafetyError('unsafe_root', 'safe local fs root must already exist', {
          errno: errnoOf(error),
        });
      }
      if (configuredStat.isSymbolicLink()) {
        throw new SafeLocalFsSafetyError('symlink_rejected', 'safe local fs root cannot be a symlink');
      }
      if (!configuredStat.isDirectory()) {
        throw new SafeLocalFsSafetyError('wrong_file_type', 'safe local fs root must be a directory');
      }

      const canonicalRoot = await realpath(configured);
      const canonicalStat = await lstat(canonicalRoot);
      if (
        canonicalStat.isSymbolicLink()
        || !canonicalStat.isDirectory()
        || !sameIdentity(configuredStat, canonicalStat)
      ) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs root changed during validation');
      }

      const instance = new SafeLocalFsRoot(canonicalRoot, {
        dev: canonicalStat.dev,
        ino: canonicalStat.ino,
      });
      await instance.assertRootIdentity();
      return instance;
    } catch (error) {
      throw redactFsError(error, 'open root');
    }
  }

  async ensureDirectory(relativeDirectory: string): Promise<void> {
    try {
      const normalized = normalizeRelativePath(relativeDirectory, true);
      assertNoInternalPathSegments(normalized);
      if (normalized === '.') {
        await this.assertRootIdentity();
        return;
      }

      let current = this.root;
      for (const part of normalized.split(path.sep).filter((segment) => segment && segment !== '.')) {
        const parent = current;
        current = path.join(current, part);
        await this.assertDirectory(parent);

        try {
          await this.assertDirectory(current);
          continue;
        } catch (error) {
          if (!isSafeLocalFsNotFoundError(error)) throw error;
        }

        await runTestHook('after-preflight-before-directory-io', current);
        // Revalidation after the hook catches deterministic post-preflight swaps.
        await this.assertDirectory(parent);
        try {
          await mkdir(current, { mode: 0o700 });
        } catch (error) {
          if (!isErrno(error, 'EEXIST')) throw error;
        }
        await this.assertDirectory(current);
        await this.syncDirectory(parent);
      }
    } catch (error) {
      throw redactFsError(error, 'ensure directory');
    }
  }

  async readFile(relativeFile: string): Promise<Buffer> {
    let handle: FileHandle | null = null;
    try {
      const target = this.resolve(relativeFile, false);
      await this.reconcileReplacementForTarget(target);
      await this.reconcileQuarantinedTarget(target);
      await this.reconcileOwnedCommittedLink(target);
      await this.assertRegularFile(target);
      await runTestHook('after-preflight-before-open', target);
      await this.assertRegularFile(target);
      handle = await open(target, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
      await runTestHook('after-open-before-identity-check', target);
      await this.assertOpenRegularFile(target, handle);
      await runTestHook('after-identity-check-before-read', target);
      await this.assertOpenRegularFile(target, handle);
      const bytes = await handle.readFile();
      await this.assertOpenRegularFile(target, handle);
      await handle.close();
      handle = null;
      return bytes;
    } catch (error) {
      await closeIgnoringFailure(handle);
      throw redactFsError(error, 'read');
    }
  }

  async statFile(relativeFile: string): Promise<SafeLocalFileInfo> {
    let handle: FileHandle | null = null;
    try {
      const target = this.resolve(relativeFile, false);
      await this.reconcileReplacementForTarget(target);
      await this.reconcileQuarantinedTarget(target);
      await this.reconcileOwnedCommittedLink(target);
      await this.assertRegularFile(target);
      await runTestHook('after-preflight-before-open', target);
      await this.assertRegularFile(target);
      handle = await open(target, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
      await runTestHook('after-open-before-identity-check', target);
      const stats = await this.assertOpenRegularFile(target, handle);
      await handle.close();
      handle = null;
      return {
        name: path.basename(target),
        size: stats.size,
        mtime: stats.mtime,
        dev: stats.dev,
        ino: stats.ino,
      };
    } catch (error) {
      await closeIgnoringFailure(handle);
      throw redactFsError(error, 'stat');
    }
  }

  async writeFile(
    relativeFile: string,
    data: string | Buffer | Uint8Array,
    options: SafeLocalWriteOptions = {},
  ): Promise<void> {
    try {
      const target = this.resolve(relativeFile, false);
      const parent = path.dirname(target);
      await this.assertDirectory(parent);
      await this.reconcileReplacementForTarget(target);
      await this.reconcileQuarantinedTarget(target);
      await this.reconcileOwnedCommittedLink(target);
      const existing = await this.lstatOptional(target);
      let existingIdentity: Pick<Stats, 'dev' | 'ino'> | null = null;
      if (existing) {
        const validatedExisting = await this.assertRegularFile(target);
        existingIdentity = { dev: validatedExisting.dev, ino: validatedExisting.ino };
        if (!options.overwrite) {
          throw new SafeLocalFsSafetyError(
            'already_exists',
            'safe local fs write target already exists',
            { errno: 'EEXIST' },
          );
        }
      }

      if (!existing) {
        const pendingTemp = path.join(
          parent,
          randomWriteTempName('pending', path.basename(target)),
        );
        const tempIdentity = await this.createAndWriteOwnedFile(
          pendingTemp,
          target,
          data,
          options.mode ?? 0o600,
        );
        let temp = pendingTemp;
        try {
          temp = await this.promoteWriteTempToReady(pendingTemp, tempIdentity);
          // The complete temp must have a durable directory entry before its
          // inode can become reachable through the public target name.
          await this.syncDirectory(parent);
          await this.installExclusiveTemp(temp, target, tempIdentity);
        } catch (error) {
          if (isCommittedExclusiveMarker(error)) {
            // The durable public link is committed; never roll it back.
            throw error;
          }
          if (!await this.cleanupFailedWrite(temp, target, tempIdentity)) {
            throw new SafeLocalFsSafetyError(
              'identity_race',
              'safe local fs could not prove failed exclusive-write cleanup',
            );
          }
          throw error;
        }
        return;
      }

      const pendingTemp = path.join(
        parent,
        randomWriteTempName('pending', path.basename(target)),
      );
      const tempIdentity = await this.createAndWriteOwnedFile(
        pendingTemp,
        target,
        data,
        options.mode ?? 0o600,
      );
      let temp = pendingTemp;
      try {
        temp = await this.promoteWriteTempToReady(pendingTemp, tempIdentity);
        await this.syncDirectory(parent);
        await this.installReplacementTemp(temp, target, tempIdentity, existingIdentity!);
      } catch (error) {
        if (isCommittedExclusiveMarker(error)) {
          // Defensive: the replacement path never raises this marker, but a
          // durably committed target is never rolled back regardless of path.
          throw error;
        }
        if (!await this.cleanupFailedWrite(temp, target, tempIdentity)) {
          throw new SafeLocalFsSafetyError(
            'identity_race',
            'safe local fs could not prove failed replacement cleanup',
          );
        }
        throw error;
      }
    } catch (error) {
      throw redactFsError(error, 'write');
    }
  }

  async listRegularFiles(relativeDirectory = '.'): Promise<SafeLocalFileInfo[]> {
    try {
      const directory = this.resolve(relativeDirectory, true);
      await this.assertDirectory(directory);
      await this.reconcileReplacementsInDirectory(directory);
      await this.reconcileQuarantinesInDirectory(directory);
      await runTestHook('after-preflight-before-directory-io', directory);
      await this.assertDirectory(directory);
      const entries = await readdir(directory, { withFileTypes: true });
      await this.assertDirectory(directory);

      const files: SafeLocalFileInfo[] = [];
      for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        const stats = await lstat(entryPath);
        if (stats.isSymbolicLink()) {
          throw new SafeLocalFsSafetyError(
            'symlink_rejected',
            'safe local fs directory contains a symlink',
          );
        }
        if (isInternalEntryName(entry.name)) {
          if (!stats.isFile()) {
            throw new SafeLocalFsSafetyError(
              'wrong_file_type',
              'safe local fs internal entry has an unsafe type',
            );
          }
          continue;
        }
        if (!stats.isFile()) continue;
        files.push(await this.statFile(path.relative(this.root, entryPath)));
      }

      // Single-link hidden internals may be live writers and are left
      // untouched; only their safety shape is enforced. A multi-link internal
      // (e.g. a crash-left alias of a committed public target) is rejected
      // fail-closed instead of being auto-promoted by a reader.
      for (const entry of entries) {
        if (!isInternalEntryName(entry.name)) continue;
        const internal = await this.lstatOptional(path.join(directory, entry.name));
        if (!internal) continue;
        if (internal.isSymbolicLink()) {
          throw new SafeLocalFsSafetyError('symlink_rejected', 'safe local fs internal entry is a symlink');
        }
        if (!internal.isFile()) {
          throw new SafeLocalFsSafetyError('wrong_file_type', 'safe local fs internal entry has an unsafe type');
        }
        if (internal.nlink !== 1) {
          throw new SafeLocalFsSafetyError('hardlink_rejected', 'safe local fs internal entry is not owned');
        }
      }
      return files;
    } catch (error) {
      throw redactFsError(error, 'list');
    }
  }

  async removeFile(relativeFile: string): Promise<boolean> {
    try {
      const target = this.resolve(relativeFile, false);
      const parent = path.dirname(target);
      let identity: Pick<Stats, 'dev' | 'ino'>;
      try {
        await this.reconcileReplacementForTarget(target);
        await this.reconcileQuarantinedTarget(target);
        await this.reconcileOwnedCommittedLink(target);
        const stats = await this.assertRegularFile(target);
        identity = { dev: stats.dev, ino: stats.ino };
      } catch (error) {
        if (isSafeLocalFsNotFoundError(error)) return false;
        throw error;
      }

      await runTestHook('after-preflight-before-unlink', target);
      const current = await this.assertRegularFile(target);
      if (!sameIdentity(identity, current)) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs target changed before removal');
      }

      const quarantine = path.join(
        parent,
        randomDeleteQuarantineName('pending', path.basename(target)),
      );
      if (await this.lstatOptional(quarantine)) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs quarantine unexpectedly exists');
      }
      await this.assertDirectory(parent);
      await rename(target, quarantine);
      try {
        await this.syncDirectory(parent);
      } catch (error) {
        await this.restoreQuarantineIfPossible(quarantine, target, identity);
        throw error;
      }

      let moved: Stats;
      try {
        moved = await this.assertRegularFile(quarantine);
      } catch (error) {
        await this.restoreQuarantineIfPossible(quarantine, target, identity);
        throw error;
      }
      if (!sameIdentity(identity, moved)) {
        await this.restoreQuarantineIfPossible(quarantine, target, identity);
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs removed a competing path');
      }

      await runTestHook('after-quarantine-before-delete', quarantine);
      const beforeDelete = await this.assertRegularFile(quarantine);
      if (!sameIdentity(identity, beforeDelete)) {
        await this.restoreQuarantineIfPossible(quarantine, target, identity);
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs quarantine changed before delete');
      }

      const committed = path.join(
        parent,
        path.basename(quarantine).replace(
          `${INTERNAL_ENTRY_PREFIX}delete-pending-`,
          `${INTERNAL_ENTRY_PREFIX}delete-committed-`,
        ),
      );
      let deletionMarker = quarantine;
      try {
        if (await this.lstatOptional(committed)) {
          throw new SafeLocalFsSafetyError(
            'identity_race',
            'safe local fs committed delete marker unexpectedly exists',
          );
        }
        await rename(quarantine, committed);
        deletionMarker = committed;
        await this.syncDirectory(parent);
      } catch (error) {
        await this.restoreQuarantineIfPossible(deletionMarker, target, identity);
        throw error;
      }

      // Deletion is now durably represented by the committed tombstone. Its
      // physical cleanup is best-effort and cannot turn a committed remove
      // into an error merely because the cleanup fsync fails.
      await this.cleanupCommittedDelete(committed, identity);
      return true;
    } catch (error) {
      throw redactFsError(error, 'remove');
    }
  }

  private resolve(relativePath: string, allowRoot: boolean): string {
    const normalized = normalizeRelativePath(relativePath, allowRoot);
    assertNoInternalPathSegments(normalized);
    const candidate = path.resolve(this.root, normalized);
    if (!isInsideOrEqual(this.root, candidate) || (!allowRoot && candidate === this.root)) {
      throw new SafeLocalFsSafetyError('unsafe_path', 'safe local fs path escapes its root');
    }
    return candidate;
  }

  private async assertRootIdentity(): Promise<Stats> {
    let stats: Stats;
    try {
      stats = await lstat(this.root);
    } catch (error) {
      if (!isErrno(error, 'ENOENT')) throw redactFsError(error, 'inspect root');
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs root disappeared', {
        errno: errnoOf(error),
      });
    }
    if (stats.isSymbolicLink()) {
      throw new SafeLocalFsSafetyError('symlink_rejected', 'safe local fs root became a symlink');
    }
    if (!stats.isDirectory()) {
      throw new SafeLocalFsSafetyError('wrong_file_type', 'safe local fs root is no longer a directory');
    }
    if (!sameIdentity(this.rootIdentity, stats)) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs root identity changed');
    }
    const physical = await realpath(this.root);
    if (physical !== this.root) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs root canonical path changed');
    }
    const rechecked = await lstat(this.root);
    if (
      rechecked.isSymbolicLink()
      || !rechecked.isDirectory()
      || !sameIdentity(stats, rechecked)
      || !sameIdentity(this.rootIdentity, rechecked)
    ) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs root changed during validation');
    }
    return rechecked;
  }

  private async assertDirectory(directory: string): Promise<Stats> {
    if (!isInsideOrEqual(this.root, directory)) {
      throw new SafeLocalFsSafetyError('unsafe_path', 'safe local fs directory escapes its root');
    }
    await this.assertRootIdentity();
    if (directory === this.root) return lstat(this.root);

    const relative = path.relative(this.root, directory);
    let current = this.root;
    let currentStats = await lstat(this.root);
    for (const part of relative.split(path.sep).filter(Boolean)) {
      current = path.join(current, part);
      try {
        currentStats = await lstat(current);
      } catch (error) {
        if (!isErrno(error, 'ENOENT')) throw redactFsError(error, 'inspect directory');
        throw new SafeLocalFsSafetyError('not_found', 'safe local fs directory is missing', {
          errno: errnoOf(error),
        });
      }
      if (currentStats.isSymbolicLink()) {
        throw new SafeLocalFsSafetyError('symlink_rejected', 'safe local fs directory contains a symlink');
      }
      if (!currentStats.isDirectory()) {
        throw new SafeLocalFsSafetyError('wrong_file_type', 'safe local fs ancestor is not a directory');
      }
      const physical = await realpath(current);
      if (!isInsideOrEqual(this.root, physical) || physical !== current) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs directory changed during validation');
      }
      const rechecked = await lstat(current);
      if (
        rechecked.isSymbolicLink()
        || !rechecked.isDirectory()
        || !sameIdentity(currentStats, rechecked)
      ) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs directory identity changed');
      }
      currentStats = rechecked;
    }
    return currentStats;
  }

  private async assertRegularFile(
    file: string,
    options: { allowMultipleLinks?: boolean } = {},
  ): Promise<Stats> {
    await this.assertDirectory(path.dirname(file));
    let stats: Stats;
    try {
      stats = await lstat(file);
    } catch (error) {
      if (!isErrno(error, 'ENOENT')) throw redactFsError(error, 'inspect file');
      throw new SafeLocalFsSafetyError('not_found', 'safe local fs file is missing', {
        errno: errnoOf(error),
      });
    }
    if (stats.isSymbolicLink()) {
      throw new SafeLocalFsSafetyError('symlink_rejected', 'safe local fs file cannot be a symlink');
    }
    if (!stats.isFile()) {
      throw new SafeLocalFsSafetyError('wrong_file_type', 'safe local fs leaf is not a regular file');
    }
    if (!options.allowMultipleLinks && stats.nlink !== 1) {
      throw new SafeLocalFsSafetyError(
        'hardlink_rejected',
        'safe local fs leaf must not have aliases outside its root',
      );
    }
    const physical = await realpath(file);
    if (!isInsideOrEqual(this.root, physical) || physical !== file) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs file changed during validation');
    }
    const rechecked = await lstat(file);
    if (
      rechecked.isSymbolicLink()
      || !rechecked.isFile()
      || !sameIdentity(stats, rechecked)
      || (!options.allowMultipleLinks && rechecked.nlink !== 1)
    ) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs file identity changed');
    }
    return rechecked;
  }

  private async assertOpenRegularFile(file: string, handle: FileHandle): Promise<Stats> {
    const descriptorStats = await handle.stat();
    if (!descriptorStats.isFile()) {
      throw new SafeLocalFsSafetyError('wrong_file_type', 'safe local fs descriptor is not a regular file');
    }
    const pathnameStats = await this.assertRegularFile(file);
    if (!sameIdentity(descriptorStats, pathnameStats)) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs descriptor/path identity mismatch');
    }
    return descriptorStats;
  }

  private async createAndWriteOwnedFile(
    file: string,
    associatedTarget: string,
    data: string | Buffer | Uint8Array,
    mode: number,
  ): Promise<Pick<Stats, 'dev' | 'ino'>> {
    let handle: FileHandle | null = null;
    let identity: Pick<Stats, 'dev' | 'ino'> | null = null;
    try {
      await runTestHook('after-preflight-before-open', file);
      await this.assertDirectory(path.dirname(file));
      handle = await open(
        file,
        fsConstants.O_WRONLY
          | fsConstants.O_CREAT
          | fsConstants.O_EXCL
          | fsConstants.O_NOFOLLOW,
        mode,
      );

      // Capture descriptor identity before any injectable boundary so cleanup
      // can remove only the inode created by this operation.
      const descriptorStats = await handle.stat();
      if (!descriptorStats.isFile() || descriptorStats.nlink !== 1) {
        throw new SafeLocalFsSafetyError('wrong_file_type', 'safe local fs created a non-regular leaf');
      }
      identity = { dev: descriptorStats.dev, ino: descriptorStats.ino };

      await runTestHook('after-open-before-identity-check', file);
      await this.assertOpenRegularFile(file, handle);
      await runTestHook('after-identity-check-before-write', file);
      await this.assertOpenRegularFile(file, handle);
      await handle.writeFile(data);
      await handle.sync();
      await this.assertOpenRegularFile(file, handle);
      await handle.close();
      handle = null;
      return identity;
    } catch (error) {
      if (handle && !identity) {
        try {
          const descriptorStats = await handle.stat();
          if (descriptorStats.isFile()) {
            identity = { dev: descriptorStats.dev, ino: descriptorStats.ino };
          }
        } catch {
          // Without descriptor identity, pathname cleanup would be unsafe.
        }
      }
      await closeIgnoringFailure(handle);
      if (identity) {
        if (!await this.cleanupFailedWrite(file, associatedTarget, identity)) {
          throw new SafeLocalFsSafetyError(
            'identity_race',
            'safe local fs could not prove failed-write cleanup ownership',
          );
        }
      }
      throw error;
    }
  }

  private async promoteWriteTempToReady(
    pending: string,
    identity: Pick<Stats, 'dev' | 'ino'>,
  ): Promise<string> {
    const parent = path.dirname(pending);
    const ready = path.join(parent, readyWriteTempName(path.basename(pending)));
    const pendingStats = await this.assertRegularFile(pending);
    if (!sameIdentity(identity, pendingStats)) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs pending write changed');
    }
    if (await this.lstatOptional(ready)) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs ready write unexpectedly exists');
    }
    await this.assertDirectory(parent);
    // No fallible work follows this rename before the caller records `ready`.
    // A crash at this boundary can expose only a file whose bytes were already
    // fsynced and whose descriptor/path identity was revalidated.
    await rename(pending, ready);
    return ready;
  }

  private async installExclusiveTemp(
    temp: string,
    target: string,
    identity: Pick<Stats, 'dev' | 'ino'>,
  ): Promise<void> {
    const parent = path.dirname(target);
    const tempStats = await this.assertRegularFile(temp);
    if (!sameIdentity(identity, tempStats)) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs temporary file changed');
    }
    if (await this.lstatOptional(target)) {
      throw new SafeLocalFsSafetyError(
        'already_exists',
        'safe local fs write target already exists',
        { errno: 'EEXIST' },
      );
    }

    let linked = false;
    let commitDurable = false;
    try {
      await runTestHook('after-preflight-before-rename', target);
      const recheckedTemp = await this.assertRegularFile(temp);
      if (!sameIdentity(identity, recheckedTemp)) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs temporary file changed before install');
      }
      if (await this.lstatOptional(target)) {
        throw new SafeLocalFsSafetyError(
          'already_exists',
          'safe local fs write target appeared before install',
          { errno: 'EEXIST' },
        );
      }
      await this.assertDirectory(parent);

      // link(2) is the atomic no-overwrite commit point. The final name is not
      // visible until the fully written and fsynced inode is linked into place.
      await link(temp, target);
      linked = true;
      const linkedTarget = await this.assertRegularFile(target, { allowMultipleLinks: true });
      const linkedTemp = await this.assertRegularFile(temp, { allowMultipleLinks: true });
      if (
        linkedTarget.nlink !== 2
        || linkedTemp.nlink !== 2
        || !sameIdentity(identity, linkedTarget)
        || !sameIdentity(identity, linkedTemp)
      ) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs exclusive link identity mismatch');
      }
      await this.syncDirectory(parent);
      commitDurable = true;

      await runTestHook('after-exclusive-link-before-cleanup', target);
      if (!await this.cleanupCommittedExclusiveTemp(temp, target, identity)) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs committed target changed');
      }
    } catch (error) {
      if (commitDurable) {
        // Once the target link is durably committed, temp cleanup is
        // recovery-only and a post-commit failure must never let the outer
        // writer unlink the durable public target. Surface the committed
        // fail-closed marker so the outer rollback bypasses the target.
        if (await this.cleanupCommittedExclusiveTemp(temp, target, identity)) return;
        throw new SafeLocalFsCommittedExclusiveMarker(
          'safe local fs committed exclusive target is fail-closed',
        );
      }
      if (linked && !await this.removeOwnedPath(target, identity)) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs exclusive rollback failed');
      }
      throw error;
    }
  }

  private async cleanupCommittedExclusiveTemp(
    temp: string,
    target: string,
    identity: Pick<Stats, 'dev' | 'ino'>,
  ): Promise<boolean> {
    try {
      const targetStats = await this.assertRegularFile(target, { allowMultipleLinks: true });
      if (!sameIdentity(identity, targetStats) || (targetStats.nlink !== 1 && targetStats.nlink !== 2)) {
        return false;
      }

      if (targetStats.nlink === 2) {
        const tempStats = await this.assertRegularFile(temp, { allowMultipleLinks: true });
        if (tempStats.nlink !== 2 || !sameIdentity(identity, tempStats)) return false;
        try {
          await runTestHook('before-committed-temp-unlink', temp);
          await unlink(temp);
          try { await this.syncDirectory(path.dirname(temp)); } catch { /* target is already committed */ }
        } catch {
          // A validated ready-temp alias is safe residue, but readers/lists
          // intentionally never retry or trust it. Cleanup is only complete
          // when the alias is gone; otherwise the committed public leaf must
          // stay fail-closed until an operator removes the validated alias.
        }
      }

      // Success requires the committed target to be the sole remaining link to
      // its inode. A still-present same-identity temp alias (nlink === 2) is
      // safe residue but is not successful cleanup, so the public leaf stays
      // rejected until an operator removes the validated alias.
      const finalTarget = await this.assertRegularFile(target, { allowMultipleLinks: true });
      return sameIdentity(identity, finalTarget) && finalTarget.nlink === 1;
    } catch {
      return false;
    }
  }

  /**
   * Intentionally fail-closed: a public leaf plus a hidden "ready" alias is
   * never reclaimed or promoted here. Without a descriptor-bound secret, a
   * hostile local writer can forge every pathname-only "ready" marker, so the
   * public hard-link stays rejected (hardlink_rejected) until an operator
   * intervenes — even when its bytes happen to be complete. The preflight only
   * re-asserts the parent directory; no internal temp is ever unlinked by a
   * reader/stat/write/remove preflight.
   */
  private async reconcileOwnedCommittedLink(target: string): Promise<void> {
    const parent = path.dirname(target);
    await this.assertDirectory(parent);
  }

  private async reconcileQuarantinedTarget(target: string): Promise<void> {
    const parent = path.dirname(target);
    await this.assertDirectory(parent);
    const targetName = path.basename(target);
    const entries = await readdir(parent, { withFileTypes: true });
    const quarantines = entries
      .map((entry) => ({ entry, metadata: parseDeleteQuarantine(entry.name) }))
      .filter((item) => item.metadata?.targetName === targetName);
    if (quarantines.length === 0) return;
    if (quarantines.length !== 1) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs removal recovery is ambiguous');
    }

    const quarantine = path.join(parent, quarantines[0]!.entry.name);
    const stats = await this.assertRegularFile(quarantine);
    if (stats.nlink !== 1) {
      throw new SafeLocalFsSafetyError('hardlink_rejected', 'safe local fs quarantine is not owned');
    }

    // Recovery never promotes marker bytes into a public target: a syntactically
    // valid marker alone is not durable ownership proof after process death.
    // A crashed remove may resolve to either atomic outcome; both pending and
    // committed tombstones therefore converge on the deleted outcome.
    const currentTarget = await this.lstatOptional(target);
    if (currentTarget) await this.assertRegularFile(target, { allowMultipleLinks: true });
    await this.cleanupCommittedDelete(quarantine, { dev: stats.dev, ino: stats.ino });
  }

  private async reconcileReplacementForTarget(target: string): Promise<void> {
    const parent = path.dirname(target);
    await this.assertDirectory(parent);
    const targetName = path.basename(target);
    const entries = await readdir(parent, { withFileTypes: true });
    const backups = entries
      .map((entry) => ({ entry, metadata: parseReplaceBackup(entry.name) }))
      .filter((item) => item.metadata?.targetName === targetName);
    if (backups.length === 0) return;
    if (backups.length !== 1) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs replacement recovery is ambiguous');
    }

    const backupPath = path.join(parent, backups[0]!.entry.name);
    const backupStats = await this.assertRegularFile(backupPath, { allowMultipleLinks: true });
    const oldIdentity = { dev: backupStats.dev, ino: backupStats.ino };
    const targetStats = await this.lstatOptional(target);

    if (!targetStats) {
      throw new SafeLocalFsSafetyError(
        'identity_race',
        'safe local fs replacement recovery target is missing',
      );
    }

    if (sameIdentity(oldIdentity, targetStats)) {
      const targetAgain = await this.assertRegularFile(target, { allowMultipleLinks: true });
      if (backupStats.nlink !== 2 || targetAgain.nlink !== 2) {
        throw new SafeLocalFsSafetyError('hardlink_rejected', 'safe local fs replacement alias is unsafe');
      }
      if (!await this.removeOwnedPath(backupPath, oldIdentity)) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs replacement alias cleanup failed');
      }
      return;
    }

    // A different complete target means rename reached its atomic public-name
    // transition. Pending and committed markers both preserve that target;
    // recovery must never overwrite it from unauthenticated marker bytes.
    if (backupStats.nlink !== 1) {
      throw new SafeLocalFsSafetyError('hardlink_rejected', 'safe local fs replacement backup is not owned');
    }
    await this.assertRegularFile(target);
    await this.cleanupCommittedReplacement(backupPath, oldIdentity);
  }

  private async reconcileReplacementsInDirectory(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.name.startsWith(`${INTERNAL_ENTRY_PREFIX}replace-`)) continue;
      const metadata = parseReplaceBackup(entry.name);
      if (!metadata) {
        throw new SafeLocalFsSafetyError('unsafe_path', 'safe local fs replacement metadata is invalid');
      }
      await this.reconcileReplacementForTarget(path.join(directory, metadata.targetName));
    }
  }

  private async reconcileQuarantinesInDirectory(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.name.startsWith(`${INTERNAL_ENTRY_PREFIX}delete-`)) continue;
      const metadata = parseDeleteQuarantine(entry.name);
      if (!metadata) {
        throw new SafeLocalFsSafetyError('unsafe_path', 'safe local fs quarantine metadata is invalid');
      }
      await this.reconcileQuarantinedTarget(path.join(directory, metadata.targetName));
    }
  }

  private async cleanupCommittedDelete(
    tombstone: string,
    identity: Pick<Stats, 'dev' | 'ino'>,
  ): Promise<void> {
    try {
      const stats = await this.assertRegularFile(tombstone);
      if (!sameIdentity(identity, stats)) return;
      await unlink(tombstone);
      try { await this.syncDirectory(path.dirname(tombstone)); } catch { /* delete is already committed */ }
    } catch {
      // A durable committed tombstone is safe to leave and hide until retry.
    }
  }

  private async installReplacementTemp(
    temp: string,
    target: string,
    identity: Pick<Stats, 'dev' | 'ino'>,
    expectedOldIdentity: Pick<Stats, 'dev' | 'ino'>,
  ): Promise<void> {
    const parent = path.dirname(target);
    const tempStats = await this.assertRegularFile(temp);
    if (!sameIdentity(identity, tempStats)) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs temporary file changed');
    }

    const targetStats = await this.assertRegularFile(target);
    if (!sameIdentity(expectedOldIdentity, targetStats)) {
      throw new SafeLocalFsSafetyError('identity_race', 'safe local fs replacement generation changed');
    }
    const oldIdentity = { dev: targetStats.dev, ino: targetStats.ino };
    const pendingBackup = path.join(
      parent,
      randomReplaceBackupName('pending', path.basename(target)),
    );
    let backupPath = pendingBackup;
    let commitMarkerDurable = false;

    let backupCreated = false;
    try {
      await link(target, pendingBackup);
      backupCreated = true;
      const linkedOld = await this.assertRegularFile(target, { allowMultipleLinks: true });
      const linkedBackup = await this.assertRegularFile(pendingBackup, { allowMultipleLinks: true });
      if (
        linkedOld.nlink !== 2
        || linkedBackup.nlink !== 2
        || !sameIdentity(oldIdentity, linkedOld)
        || !sameIdentity(oldIdentity, linkedBackup)
      ) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs replacement backup mismatch');
      }
      await this.syncDirectory(parent);
    } catch (error) {
      if (backupCreated) {
        const restored = await this.restoreReplacementBackup(
          pendingBackup,
          target,
          oldIdentity,
          { allowMissing: true },
        );
        if (!restored) {
          throw new SafeLocalFsSafetyError('identity_race', 'safe local fs replacement backup rollback failed');
        }
      }
      throw error;
    }

    try {
      await runTestHook('after-preflight-before-rename', target);
      const recheckedTemp = await this.assertRegularFile(temp);
      if (!sameIdentity(identity, recheckedTemp)) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs temporary file changed before install');
      }
      const recheckedTarget = await this.assertRegularFile(target, { allowMultipleLinks: true });
      const recheckedBackup = await this.assertRegularFile(
        pendingBackup,
        { allowMultipleLinks: true },
      );
      if (
        recheckedTarget.nlink !== 2
        || recheckedBackup.nlink !== 2
        || !sameIdentity(targetStats, recheckedTarget)
        || !sameIdentity(oldIdentity, recheckedBackup)
        || !sameIdentity(recheckedTarget, recheckedBackup)
      ) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs target changed before install');
      }

      await rename(temp, target);
      await this.syncDirectory(parent);

      const installed = await this.assertRegularFile(target);
      if (!sameIdentity(identity, installed)) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs installed file identity mismatch');
      }

      const committedBackup = path.join(
        parent,
        path.basename(pendingBackup).replace(
          `${INTERNAL_ENTRY_PREFIX}replace-pending-`,
          `${INTERNAL_ENTRY_PREFIX}replace-committed-`,
        ),
      );
      if (await this.lstatOptional(committedBackup)) {
        throw new SafeLocalFsSafetyError(
          'identity_race',
          'safe local fs committed replacement marker unexpectedly exists',
        );
      }
      await rename(pendingBackup, committedBackup);
      backupPath = committedBackup;
      await this.syncDirectory(parent);
      commitMarkerDurable = true;
      await this.cleanupCommittedReplacement(committedBackup, oldIdentity);
    } catch (error) {
      if (!commitMarkerDurable) {
        const restored = await this.restoreReplacementBackup(
          backupPath,
          target,
          oldIdentity,
          { allowMissing: true, replaceIdentity: identity },
        );
        if (!restored) {
          throw new SafeLocalFsSafetyError('identity_race', 'safe local fs replacement rollback failed');
        }
      }
      throw error;
    }
  }

  private async restoreReplacementBackup(
    backup: string,
    target: string,
    oldIdentity: Pick<Stats, 'dev' | 'ino'>,
    options: {
      allowMissing?: boolean;
      replaceIdentity?: Pick<Stats, 'dev' | 'ino'>;
    } = {},
  ): Promise<boolean> {
    try {
      const backupStats = await this.assertRegularFile(backup, { allowMultipleLinks: true });
      if (!sameIdentity(oldIdentity, backupStats)) return false;
      const current = await this.lstatOptional(target);
      if (current && sameIdentity(oldIdentity, current)) {
        if (backupStats.nlink !== 2 || current.nlink !== 2) return false;
        if (!await this.removeOwnedPath(backup, oldIdentity)) return false;
        const preserved = await this.assertRegularFile(target);
        return sameIdentity(oldIdentity, preserved);
      }
      if (current && (!options.replaceIdentity || !sameIdentity(options.replaceIdentity, current))) {
        return false;
      }
      if (!current && !options.allowMissing) return false;
      if (backupStats.nlink !== 1) return false;
      await rename(backup, target);
      await this.syncDirectory(path.dirname(target));
      const restored = await this.assertRegularFile(target);
      return sameIdentity(oldIdentity, restored);
    } catch {
      return false;
    }
  }

  private async cleanupCommittedReplacement(
    backup: string,
    oldIdentity: Pick<Stats, 'dev' | 'ino'>,
  ): Promise<void> {
    try {
      const stats = await this.assertRegularFile(backup);
      if (!sameIdentity(oldIdentity, stats)) return;
      await unlink(backup);
      try { await this.syncDirectory(path.dirname(backup)); } catch { /* commit is already durable */ }
    } catch {
      // A durable committed marker is safe to leave for later recovery cleanup.
    }
  }

  private async removeOwnedPath(
    file: string,
    identity: Pick<Stats, 'dev' | 'ino'>,
  ): Promise<boolean> {
    try {
      const current = await this.assertRegularFile(file, { allowMultipleLinks: true });
      if (!sameIdentity(identity, current)) return false;
      await unlink(file);
      await this.syncDirectory(path.dirname(file));
      return true;
    } catch (error) {
      if (isSafeLocalFsNotFoundError(error)) return true;
      // Cleanup must never mutate a replacement path.
      return false;
    }
  }

  private async removeAssociatedOwnedLink(
    target: string,
    identity: Pick<Stats, 'dev' | 'ino'>,
  ): Promise<void> {
    try {
      const candidate = await this.lstatOptional(target);
      if (!candidate || candidate.isSymbolicLink() || !candidate.isFile()) return;
      if (!sameIdentity(identity, candidate)) return;
      if (!await this.removeOwnedPath(target, identity)) {
        throw new SafeLocalFsSafetyError('identity_race', 'safe local fs partial target cleanup failed');
      }
    } catch (error) {
      if (isSafeLocalFsNotFoundError(error)) return;
      throw error;
    }
  }

  private async cleanupFailedWrite(
    temp: string,
    target: string,
    identity: Pick<Stats, 'dev' | 'ino'>,
  ): Promise<boolean> {
    let cleanupProven = true;
    try {
      await this.removeAssociatedOwnedLink(target, identity);
    } catch {
      cleanupProven = false;
    }
    if (!await this.removeOwnedPath(temp, identity)) cleanupProven = false;
    // A sync hook can relink the still-present temp while the first target
    // unlink is being durably recorded. Once temp removal has been attempted,
    // make one final identity-scoped pass over the public name.
    try {
      await this.removeAssociatedOwnedLink(target, identity);
    } catch {
      cleanupProven = false;
    }

    const remainingTemp = await this.lstatOptional(temp);
    const remainingTarget = await this.lstatOptional(target);
    if (remainingTemp && sameIdentity(identity, remainingTemp)) cleanupProven = false;
    if (remainingTarget && sameIdentity(identity, remainingTarget)) cleanupProven = false;
    return cleanupProven;
  }

  private async restoreQuarantineIfPossible(
    quarantine: string,
    target: string,
    identity: Pick<Stats, 'dev' | 'ino'>,
  ): Promise<boolean> {
    try {
      const quarantined = await this.assertRegularFile(quarantine);
      if (!sameIdentity(identity, quarantined)) return false;
      if (await this.lstatOptional(target)) return false;
      await this.assertDirectory(path.dirname(target));
      await rename(quarantine, target);
      await this.syncDirectory(path.dirname(target));
      const restored = await this.assertRegularFile(target);
      return sameIdentity(identity, restored);
    } catch {
      // A competitor is preserved at one of the two paths; never unlink it.
      return false;
    }
  }

  private async syncDirectory(directory: string): Promise<void> {
    await this.assertDirectory(directory);
    let handle: FileHandle | null = null;
    try {
      handle = await open(
        directory,
        fsConstants.O_RDONLY | fsConstants.O_DIRECTORY | fsConstants.O_NOFOLLOW,
      );
      const descriptorStats = await handle.stat();
      const pathnameStats = await this.assertDirectory(directory);
      if (!descriptorStats.isDirectory() || !sameIdentity(descriptorStats, pathnameStats)) {
        throw new SafeLocalFsSafetyError(
          'identity_race',
          'safe local fs directory descriptor/path identity mismatch',
        );
      }
      await runTestHook('before-directory-sync', directory);
      await handle.sync();
      await this.assertDirectory(directory);
      await runTestHook('after-directory-sync', directory);
      await handle.close();
      handle = null;
    } catch (error) {
      await closeIgnoringFailure(handle);
      throw error;
    }
  }

  private async lstatOptional(file: string): Promise<Stats | null> {
    try {
      return await lstat(file);
    } catch (error) {
      if (isErrno(error, 'ENOENT')) return null;
      throw error;
    }
  }
}

export async function openSafeLocalFsRoot(allowedRoot: string): Promise<SafeLocalFsRoot> {
  return SafeLocalFsRoot.open(allowedRoot);
}
