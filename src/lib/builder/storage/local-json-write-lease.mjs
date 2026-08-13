import { createHash, randomBytes } from 'node:crypto';
import { constants as fsConstants } from 'node:fs';
import {
  lstat,
  link,
  mkdir,
  open,
  readdir,
  realpath,
  rename,
  unlink,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const LOCK_FORMAT = 'local-json-writer-lock-v1';
const TXN_FORMAT = 'local-json-transaction-v1';
const DEFAULT_ACQUIRE_TIMEOUT_MS = 5_000;
const DEFAULT_LOCK_STALE_MS = 30_000;
const DEFAULT_RETRY_DELAY_MS = 10;
const LEASE_MARK = Symbol('local-json-write-lease');

export class LocalJsonWriteConflictError extends Error {
  constructor(message = 'local JSON write conflict', options = {}) {
    super(message, options);
    this.name = 'LocalJsonWriteConflictError';
    this.code = 'LOCAL_JSON_WRITE_CONFLICT';
  }
}

export class LocalJsonWriteUnavailableError extends Error {
  constructor(message = 'local JSON writer is unavailable', options = {}) {
    super(message, options);
    this.name = 'LocalJsonWriteUnavailableError';
    this.code = 'LOCAL_JSON_WRITE_UNAVAILABLE';
  }
}

export class LocalJsonWriteInvalidPathError extends Error {
  constructor(message = 'local JSON path failed safety validation', options = {}) {
    super(message, options);
    this.name = 'LocalJsonWriteInvalidPathError';
    this.code = 'LOCAL_JSON_WRITE_INVALID_PATH';
  }
}

function isErrno(error, code) {
  return error instanceof Error && error.code === code;
}

function errno(code, message, cause) {
  const error = new Error(message, cause === undefined ? undefined : { cause });
  error.code = code;
  return error;
}

function finiteNonNegative(value, fallback, name) {
  const resolved = value ?? fallback;
  if (!Number.isFinite(resolved) || resolved < 0) {
    throw new LocalJsonWriteInvalidPathError(`${name} must be a non-negative finite number`);
  }
  return resolved;
}

function secureNonce() {
  return randomBytes(16).toString('hex');
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function insideOrEqual(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (
    relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

function sameIdentity(left, right) {
  return Boolean(left && right && left.dev === right.dev && left.ino === right.ino);
}

function sameGeneration(left, right) {
  return Boolean(
    left
    && right
    && left.dev === right.dev
    && left.ino === right.ino
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs
    && left.sha256 === right.sha256,
  );
}

// link(2)/rename(2) may update ctime. This comparison still binds the inode and
// its bytes, and catches same-inode writes through size/mtime/hash.
function sameTransactionObject(left, right) {
  return Boolean(
    left
    && right
    && left.dev === right.dev
    && left.ino === right.ino
    && left.size === right.size
    && left.sha256 === right.sha256,
  );
}

function generationFromStats(stats, bytes) {
  return {
    dev: String(stats.dev),
    ino: String(stats.ino),
    size: String(stats.size),
    mtimeNs: String(stats.mtimeNs),
    ctimeNs: String(stats.ctimeNs),
    sha256: sha256(bytes),
  };
}

async function closeQuietly(handle) {
  if (!handle) return;
  try { await handle.close(); } catch { /* retain the primary failure */ }
}

async function stableRead(filePath, { missing = false } = {}) {
  let handle = null;
  try {
    // A dangling symlink must not be collapsed into a genuine missing record.
    const pathStat = await lstat(filePath, { bigint: true });
    if (pathStat.isSymbolicLink()) {
      try { await realpath(filePath); } catch (error) {
        if (error && typeof error === 'object') error.localJsonUnsafePath = true;
        throw error;
      }
      throw errno('ELOOP', 'local JSON leaf is a symbolic link');
    }
    if (pathStat.isDirectory()) throw errno('EISDIR', 'local JSON leaf is a directory');
    if (!pathStat.isFile()) throw errno('EINVAL', 'local JSON leaf is not a regular file');
    handle = await open(filePath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
    const before = await handle.stat({ bigint: true });
    if (!before.isFile()) {
      throw errno('EINVAL', 'local JSON leaf is not a regular file');
    }
    if (pathStat.dev !== before.dev || pathStat.ino !== before.ino) {
      throw new LocalJsonWriteConflictError('local JSON path changed before it was opened');
    }
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    if (
      !after.isFile()
      || before.dev !== after.dev
      || before.ino !== after.ino
      || before.size !== after.size
      || before.mtimeNs !== after.mtimeNs
      || before.ctimeNs !== after.ctimeNs
      || after.size !== BigInt(bytes.byteLength)
    ) {
      throw new LocalJsonWriteConflictError('local JSON file changed while being read');
    }
    let finalPathStat;
    try {
      finalPathStat = await lstat(filePath, { bigint: true });
    } catch (error) {
      if (isErrno(error, 'ENOENT')) {
        throw new LocalJsonWriteConflictError('local JSON path disappeared while being read', { cause: error });
      }
      throw error;
    }
    if (
      finalPathStat.isSymbolicLink()
      || !finalPathStat.isFile()
      || finalPathStat.dev !== after.dev
      || finalPathStat.ino !== after.ino
    ) {
      throw new LocalJsonWriteConflictError('local JSON path changed while being read');
    }
    await handle.close();
    return { kind: 'present', bytes, generation: generationFromStats(after, bytes) };
  } catch (error) {
    await closeQuietly(handle);
    if (missing && isErrno(error, 'ENOENT') && !error.localJsonUnsafePath) return { kind: 'missing' };
    throw error;
  }
}

async function syncDirectory(directory) {
  let handle = null;
  try {
    handle = await open(
      directory,
      fsConstants.O_RDONLY | fsConstants.O_DIRECTORY | fsConstants.O_NOFOLLOW,
    );
    const stats = await handle.stat();
    if (!stats.isDirectory()) throw new LocalJsonWriteInvalidPathError('writer parent is not a directory');
    await handle.sync();
    await handle.close();
  } catch (error) {
    await closeQuietly(handle);
    throw error;
  }
}

async function writeExclusiveFile(filePath, bytes, mode = 0o600) {
  let handle = null;
  try {
    handle = await open(
      filePath,
      fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_WRONLY | fsConstants.O_NOFOLLOW,
      mode,
    );
    const opened = await handle.stat({ bigint: true });
    if (!opened.isFile()) throw new LocalJsonWriteInvalidPathError('writer artifact is not a regular file');
    await handle.writeFile(bytes);
    await handle.sync();
    const completed = await handle.stat({ bigint: true });
    if (opened.dev !== completed.dev || opened.ino !== completed.ino) {
      throw new LocalJsonWriteConflictError('writer artifact identity changed');
    }
    await handle.close();
    return stableRead(filePath);
  } catch (error) {
    await closeQuietly(handle);
    throw error;
  }
}

async function statOptional(filePath) {
  try {
    return await lstat(filePath, { bigint: true });
  } catch (error) {
    if (isErrno(error, 'ENOENT')) return null;
    throw error;
  }
}

async function assertRootStable(boundary) {
  const stats = await lstat(boundary.allowedRoot, { bigint: true });
  if (stats.isSymbolicLink() || !stats.isDirectory() || !sameIdentity(boundary.rootIdentity, {
    dev: String(stats.dev),
    ino: String(stats.ino),
  })) {
    throw new LocalJsonWriteUnavailableError('allowed root identity changed');
  }
  const physical = await realpath(boundary.allowedRoot);
  if (physical !== boundary.allowedRoot) {
    throw new LocalJsonWriteUnavailableError('allowed root is no longer canonical');
  }
}

async function assertParentStable(boundary) {
  await assertRootStable(boundary);
  const relative = path.relative(boundary.allowedRoot, boundary.parentPath);
  let current = boundary.allowedRoot;
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    const stats = await lstat(current, { bigint: true });
    if (stats.isSymbolicLink()) {
      try { await realpath(current); } catch (error) { throw error; }
      throw errno('ELOOP', 'writer parent is a symbolic link');
    }
    if (!stats.isDirectory()) throw errno('ENOTDIR', 'writer parent is not a directory');
    const physical = await realpath(current);
    if (physical !== current || !insideOrEqual(boundary.allowedRoot, physical)) {
      throw new LocalJsonWriteInvalidPathError('writer parent escaped its allowed root');
    }
  }
  const parentStats = await lstat(boundary.parentPath, { bigint: true });
  const currentIdentity = { dev: String(parentStats.dev), ino: String(parentStats.ino) };
  if (!sameIdentity(boundary.parentIdentity, currentIdentity)) {
    throw new LocalJsonWriteUnavailableError('writer parent identity changed');
  }
}

async function ensureSafeParent(allowedRoot, parentPath, rootIdentity) {
  const relative = path.relative(allowedRoot, parentPath);
  let current = allowedRoot;
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    const parent = current;
    current = path.join(current, segment);
    const parentStat = await lstat(parent, { bigint: true });
    if (parentStat.isSymbolicLink()) throw errno('ELOOP', 'writer ancestor is a symbolic link');
    if (!parentStat.isDirectory()) throw errno('ENOTDIR', 'writer ancestor is not a directory');
    try {
      await mkdir(current, { mode: 0o700 });
    } catch (error) {
      if (!isErrno(error, 'EEXIST')) throw error;
    }
    const stats = await lstat(current, { bigint: true });
    if (stats.isSymbolicLink()) {
      try { await realpath(current); } catch (error) { throw error; }
      throw errno('ELOOP', 'writer parent is a symbolic link');
    }
    if (!stats.isDirectory()) throw errno('ENOTDIR', 'writer parent is not a directory');
    const physical = await realpath(current);
    if (physical !== current || !insideOrEqual(allowedRoot, physical)) {
      throw new LocalJsonWriteInvalidPathError('writer parent escaped its allowed root');
    }
    const rootStats = await lstat(allowedRoot, { bigint: true });
    if (!sameIdentity(rootIdentity, { dev: String(rootStats.dev), ino: String(rootStats.ino) })) {
      throw new LocalJsonWriteUnavailableError('allowed root changed while creating a writer parent');
    }
  }
}

async function prepareBoundary(targetPath, options, { createParent = true } = {}) {
  if (!options || typeof options.allowedRoot !== 'string' || !options.allowedRoot.trim()) {
    throw new LocalJsonWriteInvalidPathError('options.allowedRoot is required');
  }
  if (typeof targetPath !== 'string' || !targetPath || targetPath.includes('\0')) {
    throw new LocalJsonWriteInvalidPathError('local JSON target path is invalid');
  }
  const configuredRoot = path.resolve(options.allowedRoot);
  const rootStat = await lstat(configuredRoot, { bigint: true }).catch((error) => {
    throw new LocalJsonWriteInvalidPathError('allowed root must already exist', { cause: error });
  });
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    throw new LocalJsonWriteInvalidPathError('allowed root must be a real directory');
  }
  const allowedRoot = await realpath(configuredRoot);
  if (allowedRoot !== configuredRoot) {
    throw new LocalJsonWriteInvalidPathError('allowed root path must already be canonical');
  }
  const target = path.resolve(targetPath);
  if (!insideOrEqual(allowedRoot, target) || target === allowedRoot) {
    throw new LocalJsonWriteInvalidPathError('local JSON target is outside allowed root');
  }
  const parentPath = path.dirname(target);
  const rootIdentity = { dev: String(rootStat.dev), ino: String(rootStat.ino) };
  if (createParent) await ensureSafeParent(allowedRoot, parentPath, rootIdentity);
  const parentStat = await lstat(parentPath, { bigint: true });
  if (parentStat.isSymbolicLink()) throw errno('ELOOP', 'writer parent is a symbolic link');
  if (!parentStat.isDirectory()) throw errno('ENOTDIR', 'writer parent is not a directory');
  const physicalParent = await realpath(parentPath);
  if (physicalParent !== parentPath || !insideOrEqual(allowedRoot, physicalParent)) {
    throw new LocalJsonWriteInvalidPathError('writer parent is not physically contained');
  }
  const base = path.basename(target);
  const artifactPrefix = `.${base}.txn-`;
  const boundary = {
    targetPath: target,
    allowedRoot,
    parentPath,
    rootIdentity,
    parentIdentity: { dev: String(parentStat.dev), ino: String(parentStat.ino) },
    lockPath: path.join(parentPath, `.${base}.writer.lock`),
    reclaimPath: path.join(parentPath, `.${base}.writer.reclaim`),
    artifactPrefix,
    base,
  };
  await assertParentStable(boundary);
  return boundary;
}

async function assertCanonicalRootIdentity(allowedRoot, rootIdentity) {
  const stats = await lstat(allowedRoot, { bigint: true }).catch((error) => {
    throw new LocalJsonWriteUnavailableError('allowed root changed during read', { cause: error });
  });
  if (
    stats.isSymbolicLink()
    || !stats.isDirectory()
    || !sameIdentity(rootIdentity, { dev: String(stats.dev), ino: String(stats.ino) })
    || await realpath(allowedRoot) !== allowedRoot
  ) {
    throw new LocalJsonWriteUnavailableError('allowed root changed during read');
  }
}

async function assertMissingParentIsGenuine(allowedRoot, parentPath, rootIdentity) {
  let current = allowedRoot;
  for (const segment of path.relative(allowedRoot, parentPath).split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    let stats;
    try { stats = await lstat(current, { bigint: true }); }
    catch (error) {
      if (isErrno(error, 'ENOENT')) {
        await assertCanonicalRootIdentity(allowedRoot, rootIdentity);
        return true;
      }
      throw error;
    }
    if (stats.isSymbolicLink()) {
      // Preserve the underlying ENOENT for a dangling ancestor symlink while
      // refusing to classify it as an absent JSON record.
      try { await realpath(current); } catch (error) { throw error; }
      throw errno('ELOOP', 'writer ancestor is a symbolic link');
    }
    if (!stats.isDirectory()) throw errno('ENOTDIR', 'writer ancestor is not a directory');
    if (await realpath(current) !== current) {
      throw new LocalJsonWriteInvalidPathError('writer ancestor is not canonical');
    }
  }
  await assertCanonicalRootIdentity(allowedRoot, rootIdentity);
  return false;
}

function lockEnvelope(boundary, nonce) {
  return {
    format: LOCK_FORMAT,
    targetPath: boundary.targetPath,
    nonce,
    hostname: os.hostname(),
    pid: process.pid,
    createdAtMs: Date.now(),
  };
}

function parseLock(bytes, boundary) {
  let value;
  try { value = JSON.parse(bytes.toString('utf8')); } catch (error) {
    throw new LocalJsonWriteUnavailableError('writer lock is corrupt', { cause: error });
  }
  if (
    !value
    || value.format !== LOCK_FORMAT
    || value.targetPath !== boundary.targetPath
    || typeof value.nonce !== 'string'
    || !/^[a-f0-9]{32}$/.test(value.nonce)
    || typeof value.hostname !== 'string'
    || !Number.isSafeInteger(value.pid)
    || value.pid <= 0
    || !Number.isFinite(value.createdAtMs)
  ) {
    throw new LocalJsonWriteUnavailableError('writer lock has an invalid envelope');
  }
  return value;
}

async function inspectControl(filePath, boundary) {
  // Publishing/removing the candidate hard-link legitimately updates the
  // shared inode ctime. Retry that narrow transient instead of reporting a
  // false lock conflict to another process.
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const snapshot = await stableRead(filePath, { missing: true });
      if (snapshot.kind === 'missing') return null;
      return { ...parseLock(snapshot.bytes, boundary), generation: snapshot.generation };
    } catch (error) {
      if (!(error instanceof LocalJsonWriteConflictError) || attempt === 3) throw error;
      await sleep(0);
    }
  }
}

async function unlinkIfIdentity(filePath, generation) {
  const stats = await statOptional(filePath);
  if (!stats) return false;
  if (stats.isSymbolicLink() || !stats.isFile()) return false;
  if (String(stats.dev) !== generation.dev || String(stats.ino) !== generation.ino) return false;
  await unlink(filePath);
  return true;
}

async function publishControl(boundary, canonicalPath, label) {
  const nonce = secureNonce();
  const envelope = lockEnvelope(boundary, nonce);
  const candidatePath = `${canonicalPath}.${nonce}.candidate`;
  const candidate = await writeExclusiveFile(
    candidatePath,
    Buffer.from(`${JSON.stringify(envelope)}\n`, 'utf8'),
  );
  try {
    await assertParentStable(boundary);
    try {
      await link(candidatePath, canonicalPath);
    } catch (error) {
      if (isErrno(error, 'EEXIST')) return null;
      throw error;
    }
    await syncDirectory(boundary.parentPath);
    const canonical = await inspectControl(canonicalPath, boundary);
    if (
      !canonical
      || canonical.nonce !== nonce
      || !sameIdentity(canonical.generation, candidate.generation)
    ) {
      throw new LocalJsonWriteConflictError(`${label} publication identity changed`);
    }
    // Removing the candidate hard-link changes the shared inode ctime. Return
    // the post-cleanup generation so release/recovery code does not retain a
    // deliberately stale control generation.
    await unlinkIfIdentity(candidatePath, candidate.generation);
    await syncDirectory(boundary.parentPath);
    const refreshed = await inspectControl(canonicalPath, boundary);
    if (
      !refreshed
      || refreshed.nonce !== nonce
      || !sameIdentity(refreshed.generation, canonical.generation)
    ) {
      throw new LocalJsonWriteConflictError(`${label} identity changed after candidate cleanup`);
    }
    return refreshed;
  } finally {
    await unlinkIfIdentity(candidatePath, candidate.generation).catch(() => false);
    await syncDirectory(boundary.parentPath).catch(() => {});
  }
}

function processIsAlive(pid) {
  if (pid === process.pid) return true;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return !isErrno(error, 'ESRCH');
  }
}

function isReclaimable(lock, options) {
  const age = Date.now() - lock.createdAtMs;
  return Number.isFinite(age)
    && age >= options.lockStaleMs
    && lock.hostname === os.hostname()
    && !processIsAlive(lock.pid);
}

async function restoreQuarantinedOnlyIfAbsent(boundary, quarantine, destination) {
  try {
    await link(quarantine, destination);
    await syncDirectory(boundary.parentPath);
    return true;
  } catch (error) {
    if (isErrno(error, 'EEXIST') || isErrno(error, 'ENOENT')) return false;
    throw error;
  }
}

async function releaseOwnedControl(boundary, canonicalPath, owned, label) {
  const current = await inspectControl(canonicalPath, boundary);
  if (!current || current.nonce !== owned.nonce || !sameIdentity(current.generation, owned.generation)) return;
  const quarantine = `${canonicalPath}.${secureNonce()}.release`;
  await assertParentStable(boundary);
  try {
    await rename(canonicalPath, quarantine);
  } catch (error) {
    if (isErrno(error, 'ENOENT')) return;
    throw error;
  }
  const moved = await inspectControl(quarantine, boundary);
  if (!moved || moved.nonce !== owned.nonce || !sameIdentity(moved.generation, owned.generation)) {
    await restoreQuarantinedOnlyIfAbsent(boundary, quarantine, canonicalPath);
    throw new LocalJsonWriteConflictError(`${label} ownership changed during release`);
  }
  await unlink(quarantine);
  await syncDirectory(boundary.parentPath);
}

async function tryReclaim(boundary, options) {
  const first = await inspectControl(boundary.lockPath, boundary);
  if (!first) return true;
  if (!isReclaimable(first, options)) return false;
  const guard = await publishControl(boundary, boundary.reclaimPath, 'writer reclaim guard');
  if (!guard) {
    const existing = await inspectControl(boundary.reclaimPath, boundary);
    if (existing && isReclaimable(existing, options)) {
      throw new LocalJsonWriteUnavailableError('stale writer reclaim guard requires operator review');
    }
    return false;
  }
  try {
    const confirmed = await inspectControl(boundary.lockPath, boundary);
    if (!confirmed) return true;
    if (
      confirmed.nonce !== first.nonce
      || !sameIdentity(confirmed.generation, first.generation)
      || !isReclaimable(confirmed, options)
    ) return false;
    const quarantine = `${boundary.lockPath}.${secureNonce()}.stale`;
    await rename(boundary.lockPath, quarantine);
    const moved = await inspectControl(quarantine, boundary);
    if (!moved || moved.nonce !== confirmed.nonce || !sameIdentity(moved.generation, confirmed.generation)) {
      await restoreQuarantinedOnlyIfAbsent(boundary, quarantine, boundary.lockPath);
      throw new LocalJsonWriteUnavailableError('stale writer lock identity changed during reclaim');
    }
    await unlink(quarantine);
    await syncDirectory(boundary.parentPath);
    return true;
  } finally {
    await releaseOwnedControl(boundary, boundary.reclaimPath, guard, 'writer reclaim guard');
  }
}

function normalizeOptions(options) {
  return {
    ...options,
    acquireTimeoutMs: finiteNonNegative(
      options.acquireTimeoutMs,
      DEFAULT_ACQUIRE_TIMEOUT_MS,
      'acquireTimeoutMs',
    ),
    lockStaleMs: finiteNonNegative(
      options.lockStaleMs,
      DEFAULT_LOCK_STALE_MS,
      'lockStaleMs',
    ),
    retryDelayMs: finiteNonNegative(options.retryDelayMs, DEFAULT_RETRY_DELAY_MS, 'retryDelayMs'),
  };
}

async function runHook(lease, stage, nonce) {
  if (!lease.options.testHook) return;
  if (process.env.NODE_ENV !== 'test') {
    throw new LocalJsonWriteInvalidPathError('local JSON writer testHook is test-only');
  }
  await lease.options.testHook({ stage, targetPath: lease.targetPath, nonce });
}

async function runReadPreflightHook(options, stage, targetPath) {
  if (!options.testHook) return;
  if (process.env.NODE_ENV !== 'test') {
    throw new LocalJsonWriteInvalidPathError('local JSON writer testHook is test-only');
  }
  await options.testHook({ stage, targetPath, nonce: '' });
}

function artifactPaths(boundary, nonce) {
  const prefix = path.join(boundary.parentPath, `${boundary.artifactPrefix}${nonce}`);
  return {
    manifest: `${prefix}.manifest`,
    candidate: `${prefix}.candidate`,
    previous: `${prefix}.previous`,
    detached: `${prefix}.detached`,
  };
}

function assertManifestArtifact(boundary, nonce, value, suffix) {
  const expected = path.basename(artifactPaths(boundary, nonce)[suffix]);
  if (value !== expected) throw new LocalJsonWriteUnavailableError('transaction manifest artifact is invalid');
  return path.join(boundary.parentPath, value);
}

function parseManifest(bytes, boundary, manifestPath) {
  let value;
  try { value = JSON.parse(bytes.toString('utf8')); } catch (error) {
    throw new LocalJsonWriteUnavailableError('transaction manifest is corrupt', { cause: error });
  }
  const filename = path.basename(manifestPath);
  const match = filename.match(new RegExp(`^\\.${escapeRegExp(boundary.base)}\\.txn-([a-f0-9]{32})\\.manifest$`));
  if (
    !match
    || !value
    || value.format !== TXN_FORMAT
    || value.targetPath !== boundary.targetPath
    || value.nonce !== match[1]
    || (value.operation !== 'write' && value.operation !== 'remove')
    || !Object.prototype.hasOwnProperty.call(value, 'previousGeneration')
    || !Object.prototype.hasOwnProperty.call(value, 'candidateGeneration')
  ) {
    throw new LocalJsonWriteUnavailableError('transaction manifest has an invalid envelope');
  }
  const nonce = value.nonce;
  return {
    ...value,
    paths: {
      manifest: manifestPath,
      candidate: assertManifestArtifact(boundary, nonce, value.artifacts.candidate, 'candidate'),
      previous: assertManifestArtifact(boundary, nonce, value.artifacts.previous, 'previous'),
      detached: assertManifestArtifact(boundary, nonce, value.artifacts.detached, 'detached'),
    },
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listTransactionManifests(boundary) {
  await assertParentStable(boundary);
  const entries = await readdir(boundary.parentPath);
  const transactionEntries = entries
    .filter((entry) => entry.startsWith(boundary.artifactPrefix));
  const manifests = transactionEntries
    .filter((entry) => entry.startsWith(boundary.artifactPrefix) && entry.endsWith('.manifest'))
    .sort((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)))
    .map((entry) => path.join(boundary.parentPath, entry));
  if (manifests.length === 0 && transactionEntries.length > 0) {
    throw new LocalJsonWriteUnavailableError(
      'orphan local JSON transaction artifacts require operator review',
    );
  }
  return manifests;
}

async function readArtifact(filePath) {
  return stableRead(filePath, { missing: true });
}

async function cleanupKnownTransaction(boundary, manifest, snapshots = {}) {
  for (const key of ['detached', 'previous', 'candidate']) {
    const snapshot = snapshots[key] ?? await readArtifact(manifest.paths[key]);
    if (snapshot.kind === 'present') {
      const removed = await unlinkIfIdentity(manifest.paths[key], snapshot.generation);
      if (!removed) throw new LocalJsonWriteUnavailableError('transaction artifact ownership changed');
    }
  }
  const manifestSnapshot = snapshots.manifest ?? await readArtifact(manifest.paths.manifest);
  if (manifestSnapshot.kind !== 'present') {
    throw new LocalJsonWriteUnavailableError('transaction manifest disappeared during cleanup');
  }
  if (!await unlinkIfIdentity(manifest.paths.manifest, manifestSnapshot.generation)) {
    throw new LocalJsonWriteUnavailableError('transaction manifest ownership changed');
  }
  await syncDirectory(boundary.parentPath);
}

async function loadSingleManifest(boundary) {
  const manifests = await listTransactionManifests(boundary);
  if (manifests.length === 0) return null;
  if (manifests.length !== 1) {
    throw new LocalJsonWriteUnavailableError('multiple local JSON transactions require operator review');
  }
  const snapshot = await stableRead(manifests[0]);
  return {
    manifest: parseManifest(snapshot.bytes, boundary, manifests[0]),
    snapshot,
  };
}

async function recoverTransaction(lease) {
  lease.assertActive();
  await assertParentStable(lease.boundary);
  const loaded = await loadSingleManifest(lease.boundary);
  if (!loaded) return;
  const { manifest, snapshot: manifestSnapshot } = loaded;
  const [target, candidate, previous, detached] = await Promise.all([
    readArtifact(lease.targetPath),
    readArtifact(manifest.paths.candidate),
    readArtifact(manifest.paths.previous),
    readArtifact(manifest.paths.detached),
  ]);
  const targetIsCandidate = target.kind === 'present' && (
    (candidate.kind === 'present' && sameTransactionObject(target.generation, candidate.generation))
    || sameTransactionObject(target.generation, manifest.candidateGeneration)
  );
  const targetIsPrevious = target.kind === 'present' && (
    (previous.kind === 'present' && sameTransactionObject(target.generation, previous.generation))
    || sameTransactionObject(target.generation, manifest.previousGeneration)
  );

  if (manifest.operation === 'write' && targetIsCandidate) {
    await cleanupKnownTransaction(lease.boundary, manifest, {
      manifest: manifestSnapshot, candidate, previous, detached,
    });
    return;
  }
  if (targetIsPrevious) {
    await cleanupKnownTransaction(lease.boundary, manifest, {
      manifest: manifestSnapshot, candidate, previous, detached,
    });
    return;
  }
  if (target.kind === 'missing') {
    if (manifest.operation === 'remove') {
      const old = detached.kind === 'present' ? detached : previous;
      if (manifest.previousGeneration && (
        old.kind !== 'present' || !sameTransactionObject(old.generation, manifest.previousGeneration)
      )) {
        throw new LocalJsonWriteUnavailableError('remove transaction lost its known previous bytes');
      }
      await cleanupKnownTransaction(lease.boundary, manifest, {
        manifest: manifestSnapshot, candidate, previous, detached,
      });
      return;
    }
    if (manifest.previousGeneration) {
      const old = detached.kind === 'present' ? detached : previous;
      if (old.kind !== 'present' || !sameTransactionObject(old.generation, manifest.previousGeneration)) {
        throw new LocalJsonWriteUnavailableError('transaction missing its known previous bytes');
      }
      try {
        await link(detached.kind === 'present' ? manifest.paths.detached : manifest.paths.previous, lease.targetPath);
      } catch (error) {
        if (isErrno(error, 'EEXIST')) {
          throw new LocalJsonWriteConflictError('competitor appeared during transaction recovery');
        }
        throw error;
      }
      await syncDirectory(lease.boundary.parentPath);
      const restored = await stableRead(lease.targetPath);
      if (!sameTransactionObject(restored.generation, manifest.previousGeneration)) {
        throw new LocalJsonWriteUnavailableError('recovered previous bytes did not verify');
      }
      await cleanupKnownTransaction(lease.boundary, manifest, {
        manifest: manifestSnapshot, candidate, previous, detached,
      });
      return;
    }
    if (candidate.kind === 'present' && sameTransactionObject(candidate.generation, manifest.candidateGeneration)) {
      try {
        await link(manifest.paths.candidate, lease.targetPath);
      } catch (error) {
        if (isErrno(error, 'EEXIST')) {
          throw new LocalJsonWriteConflictError('competitor appeared during transaction recovery');
        }
        throw error;
      }
      await syncDirectory(lease.boundary.parentPath);
      await cleanupKnownTransaction(lease.boundary, manifest, {
        manifest: manifestSnapshot, candidate, previous, detached,
      });
      return;
    }
  }
  throw new LocalJsonWriteConflictError('unknown local JSON transaction state; competitor bytes preserved');
}

async function beginTransaction(lease, operation, candidateBytes, expectedGeneration) {
  lease.assertActive();
  await assertParentStable(lease.boundary);
  const before = await stableRead(lease.targetPath, { missing: true });
  if (expectedGeneration !== undefined) {
    if (expectedGeneration === null) {
      if (before.kind !== 'missing') throw new LocalJsonWriteConflictError('local JSON target already exists');
    } else if (before.kind !== 'present' || !sameGeneration(before.generation, expectedGeneration)) {
      throw new LocalJsonWriteConflictError('local JSON expected generation changed');
    }
  }
  const nonce = secureNonce();
  const paths = artifactPaths(lease.boundary, nonce);
  let candidate = { kind: 'missing' };
  let previous = { kind: 'missing' };
  if (operation === 'write') {
    candidate = await writeExclusiveFile(paths.candidate, candidateBytes);
  }
  if (before.kind === 'present') {
    await assertParentStable(lease.boundary);
    try {
      await link(lease.targetPath, paths.previous);
    } catch (error) {
      if (isErrno(error, 'EEXIST')) throw new LocalJsonWriteUnavailableError('transaction previous artifact already exists');
      throw error;
    }
    await syncDirectory(lease.boundary.parentPath);
    const [recheckedTarget, linkedPrevious] = await Promise.all([
      stableRead(lease.targetPath),
      stableRead(paths.previous),
    ]);
    if (!sameTransactionObject(recheckedTarget.generation, linkedPrevious.generation)) {
      throw new LocalJsonWriteConflictError('local JSON target changed while snapshotting previous bytes');
    }
    if (!sameTransactionObject(recheckedTarget.generation, before.generation)) {
      throw new LocalJsonWriteConflictError('local JSON target changed before transaction publication');
    }
    previous = linkedPrevious;
  }
  const manifestValue = {
    format: TXN_FORMAT,
    targetPath: lease.targetPath,
    nonce,
    operation,
    previousGeneration: previous.kind === 'present' ? previous.generation : null,
    candidateGeneration: candidate.kind === 'present' ? candidate.generation : null,
    artifacts: {
      candidate: path.basename(paths.candidate),
      previous: path.basename(paths.previous),
      detached: path.basename(paths.detached),
    },
  };
  const manifest = await writeExclusiveFile(
    paths.manifest,
    Buffer.from(`${JSON.stringify(manifestValue)}\n`, 'utf8'),
  );
  await syncDirectory(lease.boundary.parentPath);
  await runHook(lease, 'after-manifest-fsync', nonce);
  return {
    before,
    nonce,
    paths,
    candidate,
    previous,
    manifest,
    manifestValue,
  };
}

async function detachExpectedTarget(lease, transaction) {
  if (transaction.before.kind === 'missing') {
    if (await statOptional(lease.targetPath)) {
      throw new LocalJsonWriteConflictError('competitor created local JSON target before install');
    }
    return { kind: 'missing' };
  }
  const current = await stableRead(lease.targetPath);
  if (!sameTransactionObject(current.generation, transaction.manifestValue.previousGeneration)) {
    throw new LocalJsonWriteConflictError('local JSON target changed before detach');
  }
  await assertParentStable(lease.boundary);
  await rename(lease.targetPath, transaction.paths.detached);
  await syncDirectory(lease.boundary.parentPath);
  await runHook(lease, 'after-target-detach', transaction.nonce);
  const detached = await stableRead(transaction.paths.detached);
  if (!sameTransactionObject(detached.generation, transaction.manifestValue.previousGeneration)) {
    await restoreQuarantinedOnlyIfAbsent(lease.boundary, transaction.paths.detached, lease.targetPath);
    throw new LocalJsonWriteConflictError('detached competitor bytes did not match expected generation');
  }
  return detached;
}

async function atomicWriteWithLease(lease, data, options = {}) {
  await recoverTransaction(lease);
  const bytes = Buffer.isBuffer(data) ? Buffer.from(data) : Buffer.from(data);
  const expected = Object.prototype.hasOwnProperty.call(options, 'expectedGeneration')
    ? options.expectedGeneration
    : undefined;
  const transaction = await beginTransaction(lease, 'write', bytes, expected);
  const detached = await detachExpectedTarget(lease, transaction);
  await assertParentStable(lease.boundary);
  try {
    await link(transaction.paths.candidate, lease.targetPath);
  } catch (error) {
    if (isErrno(error, 'EEXIST')) {
      throw new LocalJsonWriteConflictError('competitor won local JSON conditional install');
    }
    throw error;
  }
  await syncDirectory(lease.boundary.parentPath);
  await runHook(lease, 'after-candidate-link', transaction.nonce);
  const after = await stableRead(lease.targetPath);
  if (!sameTransactionObject(after.generation, transaction.candidate.generation)) {
    throw new LocalJsonWriteConflictError('installed local JSON candidate failed verification');
  }
  await cleanupKnownTransaction(lease.boundary, {
    ...transaction.manifestValue,
    paths: { ...transaction.paths },
  }, {
    manifest: transaction.manifest,
    candidate: transaction.candidate,
    previous: transaction.previous,
    detached,
  });
  // Candidate cleanup removes a hard-link and therefore changes target ctime.
  // Return the post-cleanup generation so callers can immediately use it as
  // the expected generation for the next conditional write.
  const refreshedAfter = await stableRead(lease.targetPath);
  if (!sameTransactionObject(refreshedAfter.generation, transaction.candidate.generation)) {
    throw new LocalJsonWriteConflictError('installed local JSON target changed during cleanup');
  }
  return { before: transaction.before, after: refreshedAfter };
}

async function atomicRemoveWithLease(lease, options = {}) {
  await recoverTransaction(lease);
  const before = await stableRead(lease.targetPath, { missing: true });
  const expected = Object.prototype.hasOwnProperty.call(options, 'expectedGeneration')
    ? options.expectedGeneration
    : undefined;
  if (before.kind === 'missing') {
    if (expected !== undefined && expected !== null) {
      throw new LocalJsonWriteConflictError('local JSON target disappeared before remove');
    }
    return { before, removed: false };
  }
  const transaction = await beginTransaction(lease, 'remove', Buffer.alloc(0), expected);
  const detached = await detachExpectedTarget(lease, transaction);
  await runHook(lease, 'after-remove-detach', transaction.nonce);
  await cleanupKnownTransaction(lease.boundary, {
    ...transaction.manifestValue,
    paths: { ...transaction.paths },
  }, {
    manifest: transaction.manifest,
    candidate: transaction.candidate,
    previous: transaction.previous,
    detached,
  });
  return { before: transaction.before, removed: true };
}

class LocalJsonLease {
  constructor(boundary, ownedLock, options) {
    this[LEASE_MARK] = true;
    this.boundary = boundary;
    this.targetPath = boundary.targetPath;
    this.allowedRoot = boundary.allowedRoot;
    this.ownedLock = ownedLock;
    this.options = options;
    this.released = false;
  }

  assertActive() {
    if (this.released) throw new LocalJsonWriteUnavailableError('local JSON lease is already released');
  }

  async assertOwned() {
    this.assertActive();
    await assertParentStable(this.boundary);
    const current = await inspectControl(this.boundary.lockPath, this.boundary);
    if (
      !current
      || current.nonce !== this.ownedLock.nonce
      || !sameIdentity(current.generation, this.ownedLock.generation)
    ) {
      throw new LocalJsonWriteUnavailableError('local JSON lease ownership was lost');
    }
  }

  async read() {
    await this.assertOwned();
    await recoverTransaction(this);
    await assertParentStable(this.boundary);
    return stableRead(this.targetPath, { missing: true });
  }

  async atomicWrite(data, options = {}) {
    await this.assertOwned();
    return atomicWriteWithLease(this, data, options);
  }

  async atomicRemove(options = {}) {
    await this.assertOwned();
    return atomicRemoveWithLease(this, options);
  }

  async recover() {
    await this.assertOwned();
    return recoverTransaction(this);
  }

  async release() {
    if (this.released) return;
    try {
      await releaseOwnedControl(this.boundary, this.boundary.lockPath, this.ownedLock, 'writer lock');
    } finally {
      this.released = true;
    }
  }
}

function isLease(value) {
  return Boolean(value && value[LEASE_MARK] === true);
}

export async function acquireLocalJsonWriteLease(targetPath, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const boundary = await prepareBoundary(targetPath, options, { createParent: true });
  const startedAt = Date.now();
  for (;;) {
    await assertParentStable(boundary);
    const owned = await publishControl(boundary, boundary.lockPath, 'writer lock');
    if (owned) {
      const lease = new LocalJsonLease(boundary, owned, options);
      try {
        await recoverTransaction(lease);
        return lease;
      } catch (error) {
        await lease.release().catch(() => {});
        throw error;
      }
    }
    if (await tryReclaim(boundary, options)) continue;
    if (Date.now() - startedAt >= options.acquireTimeoutMs) {
      throw new LocalJsonWriteUnavailableError('local JSON writer lock acquisition timed out');
    }
    await sleep(options.retryDelayMs);
  }
}

export async function releaseLocalJsonWriteLease(lease) {
  if (!isLease(lease)) throw new LocalJsonWriteInvalidPathError('release requires a local JSON lease');
  await lease.release();
}

export async function withLocalJsonWriteLease(targetPath, options, operation) {
  const lease = await acquireLocalJsonWriteLease(targetPath, options);
  try {
    return await operation(lease);
  } finally {
    await lease.release();
  }
}

export async function withLocalJsonWriteLeases(targetPaths, options, operation) {
  if (!Array.isArray(targetPaths)) {
    throw new LocalJsonWriteInvalidPathError('targetPaths must be an array');
  }
  const sorted = [...new Set(targetPaths.map((target) => path.resolve(target)))]
    .sort((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)));
  const leases = [];
  try {
    for (const target of sorted) leases.push(await acquireLocalJsonWriteLease(target, options));
    return await operation(leases);
  } finally {
    for (let index = leases.length - 1; index >= 0; index -= 1) {
      await leases[index].release();
    }
  }
}

export async function readLocalJsonFile(targetOrLease, options = {}) {
  if (isLease(targetOrLease)) return targetOrLease.read();
  const target = path.resolve(targetOrLease);
  const normalizedOptions = normalizeOptions(options);
  // A missing parent cannot contain an active sibling transaction. Avoid
  // creating directories for a genuine read-only miss.
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      await lstat(path.dirname(target));
      const boundary = await prepareBoundary(target, normalizedOptions, { createParent: false });
      const startedAt = Date.now();
      for (;;) {
        await assertParentStable(boundary);
        const writer = await inspectControl(boundary.lockPath, boundary);
        if (writer) {
          // Readers never publish their own writer lock. A live writer may
          // temporarily detach the target while atomically installing its
          // replacement, so wait for that namespace gap to close. A crashed
          // same-host writer still needs the existing exclusive recovery path.
          if (isReclaimable(writer, normalizedOptions)) {
            return withLocalJsonWriteLease(
              target,
              normalizedOptions,
              (lease) => lease.read(),
            );
          }
          if (Date.now() - startedAt >= normalizedOptions.acquireTimeoutMs) {
            throw new LocalJsonWriteUnavailableError('local JSON writer lock wait timed out');
          }
          await sleep(normalizedOptions.retryDelayMs);
          continue;
        }

        let snapshot;
        try {
          snapshot = await stableRead(target, { missing: true });
        } catch (error) {
          if (
            error instanceof LocalJsonWriteConflictError
            && Date.now() - startedAt < normalizedOptions.acquireTimeoutMs
          ) {
            await sleep(normalizedOptions.retryDelayMs);
            continue;
          }
          throw error;
        }
        if (snapshot.kind === 'present') return snapshot;

        // A writer can acquire its lease after the preflight probe and detach
        // an existing target before stableRead observes it. Recheck the lock so
        // that transient gap is never reported as a genuine missing record.
        await assertParentStable(boundary);
        if (await inspectControl(boundary.lockPath, boundary)) {
          if (Date.now() - startedAt >= normalizedOptions.acquireTimeoutMs) {
            throw new LocalJsonWriteUnavailableError('local JSON writer lock wait timed out');
          }
          await sleep(normalizedOptions.retryDelayMs);
          continue;
        }
        return snapshot;
      }
    } catch (error) {
      if (isErrno(error, 'ENOENT') && !error.localJsonUnsafePath) {
        if (!normalizedOptions.allowedRoot) {
          throw new LocalJsonWriteInvalidPathError('options.allowedRoot is required');
        }
        const allowedRoot = path.resolve(normalizedOptions.allowedRoot);
        const rootStat = await lstat(allowedRoot, { bigint: true });
        const rootIdentity = { dev: String(rootStat.dev), ino: String(rootStat.ino) };
        if (
          rootStat.isSymbolicLink()
          || !rootStat.isDirectory()
          || await realpath(allowedRoot) !== allowedRoot
          || !insideOrEqual(allowedRoot, target)
        ) {
          throw new LocalJsonWriteInvalidPathError('read target is outside a canonical root');
        }
        await runReadPreflightHook(normalizedOptions, 'after-missing-parent-probe', target);
        if (await assertMissingParentIsGenuine(
          allowedRoot,
          path.dirname(target),
          rootIdentity,
        )) {
          return { kind: 'missing' };
        }
        continue;
      }
      throw error;
    }
  }
  throw new LocalJsonWriteConflictError('local JSON parent changed repeatedly during read');
}

export async function atomicWriteLocalJson(targetOrLease, data, options = {}) {
  if (isLease(targetOrLease)) return targetOrLease.atomicWrite(data, options);
  const { allowedRoot, acquireTimeoutMs, lockStaleMs, retryDelayMs, testHook } = options;
  return withLocalJsonWriteLease(
    targetOrLease,
    { allowedRoot, acquireTimeoutMs, lockStaleMs, retryDelayMs, testHook },
    (lease) => lease.atomicWrite(data, options),
  );
}

export async function atomicRemoveLocalJson(targetOrLease, options = {}) {
  if (isLease(targetOrLease)) return targetOrLease.atomicRemove(options);
  const { allowedRoot, acquireTimeoutMs, lockStaleMs, retryDelayMs, testHook } = options;
  return withLocalJsonWriteLease(
    targetOrLease,
    { allowedRoot, acquireTimeoutMs, lockStaleMs, retryDelayMs, testHook },
    (lease) => lease.atomicRemove(options),
  );
}

export async function recoverLocalJsonTransaction(lease) {
  if (!isLease(lease)) throw new LocalJsonWriteInvalidPathError('recovery requires a local JSON lease');
  await lease.recover();
}
