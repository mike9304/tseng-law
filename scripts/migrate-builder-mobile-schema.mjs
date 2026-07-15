#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { constants as fsConstants } from 'node:fs';
import { link, open, lstat, realpath, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  acquireLocalJsonWriteLease,
  LocalJsonWriteInvalidPathError,
} from '../src/lib/builder/storage/local-json-write-lease.mjs';

const DEFAULT_SITE_ID = 'tseng-law-main-site';
const LOCKED_AT = '2026-05-10T03:00:00+09:00';
const HAMBURGER_MODES = new Set(['auto', 'off', 'force']);
const SAFE_SITE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const PATH_SAFETY_MESSAGE = 'Migration target path failed safety validation.';
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const viteNodePath = path.join(repoRoot, 'node_modules', 'vite-node', 'vite-node.mjs');
const viteConfigPath = path.join(repoRoot, 'vitest.config.ts');
const validatorPath = path.join(scriptDir, 'validate-builder-site-document.ts');
const BOUND_BACKUP_WRITER_SOURCE = String.raw`
const fs = require('node:fs');
const payload = JSON.parse(fs.readFileSync(0, 'utf8'));
const expectedDir = payload.siteDirIdentity;
const sameObject = (stats, expected) => String(stats.dev) === String(expected.dev) && String(stats.ino) === String(expected.ino);
const assertLogicalDirectory = (logicalPath, expected, expectedReal) => {
  const stats = fs.lstatSync(logicalPath, { bigint: true });
  if (stats.isSymbolicLink() || !stats.isDirectory() || !sameObject(stats, expected)) throw new Error('unsafe namespace');
  if (fs.realpathSync(logicalPath) !== expectedReal) throw new Error('unsafe namespace');
};
const assertBoundDirectory = (expected) => {
  const stats = fs.lstatSync('.', { bigint: true });
  if (stats.isSymbolicLink() || !stats.isDirectory() || !sameObject(stats, expected)) throw new Error('unsafe cwd');
  const realStats = fs.lstatSync(fs.realpathSync('.'), { bigint: true });
  if (realStats.isSymbolicLink() || !realStats.isDirectory() || !sameObject(realStats, expected)) throw new Error('unsafe cwd');
};
const pauseForTest = (name) => {
  if (process.env.NODE_ENV !== 'test') return;
  const duration = Number(process.env[name] ?? 0);
  if (Number.isFinite(duration) && duration > 0 && duration <= 2000) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, duration);
  }
};
let created = false;
try {
  assertBoundDirectory(expectedDir);
  assertLogicalDirectory(payload.logicalSiteDir, expectedDir, payload.siteDirReal);
  try {
    fs.mkdirSync('backups', { mode: 0o700 });
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error;
  }
  const backupDirStats = fs.lstatSync('backups', { bigint: true });
  if (backupDirStats.isSymbolicLink() || !backupDirStats.isDirectory()) throw new Error('unsafe backup dir');
  const backupDirReal = fs.realpathSync('backups');
  process.chdir('backups');
  assertBoundDirectory({ dev: String(backupDirStats.dev), ino: String(backupDirStats.ino) });
  pauseForTest('M07_TEST_BACKUP_BIND_PAUSE_MS');
  assertLogicalDirectory(payload.logicalSiteDir, expectedDir, payload.siteDirReal);
  assertLogicalDirectory(
    payload.logicalBackupDir,
    { dev: String(backupDirStats.dev), ino: String(backupDirStats.ino) },
    backupDirReal,
  );
  if (!/^before-M07-[A-Za-z0-9-]+\.json$/.test(payload.backupName)) throw new Error('unsafe backup name');
  const fd = fs.openSync(
    payload.backupName,
    fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW,
    0o600,
  );
  created = true;
  try {
    fs.writeFileSync(fd, payload.raw, 'utf8');
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  const backupStats = fs.lstatSync(payload.backupName, { bigint: true });
  if (backupStats.isSymbolicLink() || !backupStats.isFile()) throw new Error('unsafe backup file');
  process.stdout.write('{"ok":true}\n');
} catch {
  if (created) {
    try { fs.unlinkSync(payload.backupName); } catch {}
  }
  process.exitCode = 1;
}
`;

function argValue(name, fallback = undefined) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} requires a value.`);
  return value;
}

function hasArg(name) {
  return process.argv.includes(name);
}

function assertSafeSiteId(siteId) {
  const serializedMissingId = siteId.toLowerCase() === 'undefined' || siteId.toLowerCase() === 'null';
  if (!SAFE_SITE_ID.test(siteId) || siteId === '.' || siteId === '..' || serializedMissingId) {
    throw new Error('--site must be a safe single path segment.');
  }
}

function pathSafetyError() {
  return new Error(PATH_SAFETY_MESSAGE);
}

function isPathSafetyCause(error) {
  return error instanceof LocalJsonWriteInvalidPathError
    || (error instanceof Error && new Set(['ELOOP', 'ENOENT', 'ENOTDIR', 'EISDIR', 'EINVAL']).has(error.code));
}

function identityOf(stats) {
  return {
    dev: stats.dev,
    ino: stats.ino,
    size: stats.size,
    mtimeNs: stats.mtimeNs,
    ctimeNs: stats.ctimeNs,
  };
}

function sameObjectIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

function sameFileGeneration(left, right) {
  return sameObjectIdentity(left, right)
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs;
}

function physicallyContained(parentPath, childPath) {
  const relative = path.relative(parentPath, childPath);
  return relative.length > 0 && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

async function inspectTargetPaths(workspaceRoot, runtimeDataDir, runtimeRoot, siteDir, sitePath) {
  try {
    const workspaceReal = await realpath(workspaceRoot);
    const workspaceStat = await lstat(workspaceReal, { bigint: true });
    if (workspaceStat.isSymbolicLink() || !workspaceStat.isDirectory()) throw pathSafetyError();

    const runtimeDataStat = await lstat(runtimeDataDir, { bigint: true });
    if (runtimeDataStat.isSymbolicLink() || !runtimeDataStat.isDirectory()) throw pathSafetyError();
    const runtimeDataReal = await realpath(runtimeDataDir);
    const runtimeDataRealStat = await lstat(runtimeDataReal, { bigint: true });
    if (runtimeDataRealStat.isSymbolicLink() || !runtimeDataRealStat.isDirectory()
      || !sameObjectIdentity(identityOf(runtimeDataStat), identityOf(runtimeDataRealStat))
      || !physicallyContained(workspaceReal, runtimeDataReal)) {
      throw pathSafetyError();
    }

    const runtimeStat = await lstat(runtimeRoot, { bigint: true });
    if (runtimeStat.isSymbolicLink() || !runtimeStat.isDirectory()) throw pathSafetyError();
    const runtimeReal = await realpath(runtimeRoot);
    const runtimeRealStat = await lstat(runtimeReal, { bigint: true });
    if (runtimeRealStat.isSymbolicLink() || !runtimeRealStat.isDirectory()
      || !sameObjectIdentity(identityOf(runtimeStat), identityOf(runtimeRealStat))) {
      throw pathSafetyError();
    }
    if (!physicallyContained(runtimeDataReal, runtimeReal)) throw pathSafetyError();

    const siteDirStat = await lstat(siteDir, { bigint: true });
    if (siteDirStat.isSymbolicLink() || !siteDirStat.isDirectory()) throw pathSafetyError();
    const siteDirReal = await realpath(siteDir);
    const siteDirRealStat = await lstat(siteDirReal, { bigint: true });
    if (siteDirRealStat.isSymbolicLink() || !siteDirRealStat.isDirectory()
      || !sameObjectIdentity(identityOf(siteDirStat), identityOf(siteDirRealStat))
      || !physicallyContained(runtimeReal, siteDirReal)) {
      throw pathSafetyError();
    }

    const siteFileStat = await lstat(sitePath, { bigint: true });
    if (siteFileStat.isSymbolicLink() || !siteFileStat.isFile()) throw pathSafetyError();
    const siteFileReal = await realpath(sitePath);
    const siteFileRealStat = await lstat(siteFileReal, { bigint: true });
    if (siteFileRealStat.isSymbolicLink() || !siteFileRealStat.isFile()
      || !sameObjectIdentity(identityOf(siteFileStat), identityOf(siteFileRealStat))
      || !physicallyContained(siteDirReal, siteFileReal)) {
      throw pathSafetyError();
    }

    return {
      workspaceReal,
      runtimeDataReal,
      runtimeReal,
      siteDirReal,
      siteFileReal,
      runtimeDataIdentity: identityOf(runtimeDataStat),
      runtimeIdentity: identityOf(runtimeStat),
      siteDirIdentity: identityOf(siteDirStat),
      siteFileIdentity: identityOf(siteFileStat),
    };
  } catch (error) {
    if (error instanceof Error && error.message === PATH_SAFETY_MESSAGE) throw error;
    throw pathSafetyError();
  }
}

async function readBoundSiteFile(sitePath, expectedIdentity) {
  let handle;
  try {
    handle = await open(sitePath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
    const before = identityOf(await handle.stat({ bigint: true }));
    if (!sameFileGeneration(before, expectedIdentity)) throw pathSafetyError();
    const raw = await handle.readFile({ encoding: 'utf8' });
    const after = identityOf(await handle.stat({ bigint: true }));
    if (!sameFileGeneration(before, after)) throw pathSafetyError();
    return raw;
  } catch (error) {
    if (error instanceof Error && error.message === PATH_SAFETY_MESSAGE) throw error;
    throw pathSafetyError();
  } finally {
    await handle?.close().catch(() => {});
  }
}

async function assertTargetUnchanged(targetPaths, expected, expectedRaw) {
  const current = await inspectTargetPaths(
    targetPaths.workspaceRoot,
    targetPaths.runtimeDataDir,
    targetPaths.runtimeRoot,
    targetPaths.siteDir,
    targetPaths.sitePath,
  );
  if (current.workspaceReal !== expected.workspaceReal
    || current.runtimeDataReal !== expected.runtimeDataReal
    || current.runtimeReal !== expected.runtimeReal
    || current.siteDirReal !== expected.siteDirReal
    || current.siteFileReal !== expected.siteFileReal
    || !sameObjectIdentity(current.runtimeDataIdentity, expected.runtimeDataIdentity)
    || !sameObjectIdentity(current.runtimeIdentity, expected.runtimeIdentity)
    || !sameObjectIdentity(current.siteDirIdentity, expected.siteDirIdentity)
    || !sameFileGeneration(current.siteFileIdentity, expected.siteFileIdentity)) {
    throw pathSafetyError();
  }
  const currentRaw = await readBoundSiteFile(targetPaths.sitePath, expected.siteFileIdentity);
  if (currentRaw !== expectedRaw) throw pathSafetyError();
}

function serializeIdentity(identity) {
  return Object.fromEntries(Object.entries(identity).map(([key, value]) => [key, String(value)]));
}

async function runBoundHelper(source, cwd, payload, failureMessage) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['-e', source], {
      cwd,
      stdio: ['pipe', 'ignore', 'ignore'],
    });
    let settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      if (error) reject(error);
      else resolve();
    };
    child.once('error', () => finish(new Error(failureMessage)));
    child.once('close', (code) => finish(code === 0 ? undefined : new Error(failureMessage)));
    child.stdin.on('error', () => {});
    child.stdin.end(JSON.stringify(payload));
  });
}

async function writeBoundBackup(siteDir, backupDir, backupName, raw, expected) {
  await runBoundHelper(BOUND_BACKUP_WRITER_SOURCE, siteDir, {
    siteDirIdentity: serializeIdentity(expected.siteDirIdentity),
    siteDirReal: expected.siteDirReal,
    logicalSiteDir: siteDir,
    logicalBackupDir: backupDir,
    backupName,
    raw,
  }, 'Migration backup could not be written safely.');
}

async function inspectBoundBackup(backupDir, backupPath, expectedSiteDirReal, expectedRaw) {
  try {
    const backupStat = await lstat(backupDir, { bigint: true });
    if (backupStat.isSymbolicLink() || !backupStat.isDirectory()) throw pathSafetyError();
    const backupReal = await realpath(backupDir);
    const backupRealStat = await lstat(backupReal, { bigint: true });
    if (backupRealStat.isSymbolicLink() || !backupRealStat.isDirectory()
      || !sameObjectIdentity(identityOf(backupStat), identityOf(backupRealStat))
      || !physicallyContained(expectedSiteDirReal, backupReal)) {
      throw pathSafetyError();
    }
    const backupFileStat = await lstat(backupPath, { bigint: true });
    if (backupFileStat.isSymbolicLink() || !backupFileStat.isFile()) throw pathSafetyError();
    const backupFileReal = await realpath(backupPath);
    const backupFileRealStat = await lstat(backupFileReal, { bigint: true });
    if (backupFileRealStat.isSymbolicLink() || !backupFileRealStat.isFile()
      || !sameObjectIdentity(identityOf(backupFileStat), identityOf(backupFileRealStat))
      || !physicallyContained(backupReal, backupFileReal)) {
      throw pathSafetyError();
    }
    const actualRaw = await readBoundSiteFile(backupPath, identityOf(backupFileStat));
    if (actualRaw !== expectedRaw) throw pathSafetyError();
    return {
      backupDirIdentity: identityOf(backupStat),
      backupFileIdentity: identityOf(backupFileStat),
    };
  } catch (error) {
    if (error instanceof Error && error.message === PATH_SAFETY_MESSAGE) throw error;
    throw pathSafetyError();
  }
}

async function pauseBeforeConditionalInstallForTest() {
  if (process.env.NODE_ENV !== 'test') return;
  const duration = Number(process.env.M07_TEST_SOURCE_BIND_PAUSE_MS ?? 0);
  if (!Number.isFinite(duration) || duration <= 0 || duration > 2000) return;
  await new Promise((resolve) => setTimeout(resolve, duration));
}

function sameSerializedLeaseObject(stats, expected) {
  return String(stats.dev) === expected.dev
    && String(stats.ino) === expected.ino
    && String(stats.size) === expected.size;
}

async function inspectOwnedBoundLeaseControl(controlPath, ownedLock) {
  if (!ownedLock?.generation || typeof ownedLock.nonce !== 'string') return 'other';
  let handle;
  try {
    handle = await open(controlPath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
    const before = await handle.stat({ bigint: true });
    if (!before.isFile() || !sameSerializedLeaseObject(before, ownedLock.generation)) return 'other';
    const bytes = await handle.readFile();
    const after = await handle.stat({ bigint: true });
    if (!after.isFile() || !sameSerializedLeaseObject(after, ownedLock.generation)) return 'other';
    let envelope;
    try {
      envelope = JSON.parse(bytes.toString('utf8'));
    } catch {
      return 'other';
    }
    return createHash('sha256').update(bytes).digest('hex') === ownedLock.generation.sha256
      && envelope?.nonce === ownedLock.nonce
      && envelope?.pid === process.pid
      ? 'owned'
      : 'other';
  } catch (error) {
    if (error instanceof Error && error.code === 'ENOENT') return 'missing';
    return 'other';
  } finally {
    await handle?.close().catch(() => {});
  }
}

async function releaseOwnedLeaseFromBoundSiteDirectory(ownedLock) {
  const controlPath = '.site.json.writer.lock';
  const initial = await inspectOwnedBoundLeaseControl(controlPath, ownedLock);
  if (initial === 'missing') return true;
  if (initial !== 'owned') return false;
  const quarantine = `.site.json.writer.lock.${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.migration-release`;
  try {
    await rename(controlPath, quarantine);
  } catch (error) {
    if (error instanceof Error && error.code === 'ENOENT') return true;
    throw error;
  }
  const moved = await inspectOwnedBoundLeaseControl(quarantine, ownedLock);
  if (moved !== 'owned') {
    try {
      await link(quarantine, controlPath);
      await unlink(quarantine);
    } catch (error) {
      if (!(error instanceof Error && error.code === 'EEXIST')) throw error;
    }
    throw pathSafetyError();
  }
  await unlink(quarantine);
  return true;
}

async function bindProcessToSiteDirectory(siteDir, workspaceRoot, expectedIdentity) {
  let handle;
  let changedDirectory = false;
  try {
    handle = await open(siteDir, fsConstants.O_RDONLY | fsConstants.O_DIRECTORY | fsConstants.O_NOFOLLOW);
    const before = await handle.stat({ bigint: true });
    if (!before.isDirectory() || !sameObjectIdentity(identityOf(before), expectedIdentity)) throw pathSafetyError();
    process.chdir(siteDir);
    changedDirectory = true;
    const bound = await lstat('.', { bigint: true });
    if (!bound.isDirectory() || !sameObjectIdentity(identityOf(bound), expectedIdentity)) throw pathSafetyError();
  } catch {
    if (changedDirectory) process.chdir(workspaceRoot);
    throw pathSafetyError();
  } finally {
    await handle?.close().catch(() => {});
  }
}

async function assertAppliedTarget(targetPaths, expected, nextRaw) {
  const current = await inspectTargetPaths(
    targetPaths.workspaceRoot,
    targetPaths.runtimeDataDir,
    targetPaths.runtimeRoot,
    targetPaths.siteDir,
    targetPaths.sitePath,
  );
  if (current.workspaceReal !== expected.workspaceReal
    || current.runtimeDataReal !== expected.runtimeDataReal
    || current.runtimeReal !== expected.runtimeReal
    || current.siteDirReal !== expected.siteDirReal
    || current.siteFileReal !== expected.siteFileReal
    || !sameObjectIdentity(current.runtimeDataIdentity, expected.runtimeDataIdentity)
    || !sameObjectIdentity(current.runtimeIdentity, expected.runtimeIdentity)
    || !sameObjectIdentity(current.siteDirIdentity, expected.siteDirIdentity)) {
    throw pathSafetyError();
  }
  const currentRaw = await readBoundSiteFile(targetPaths.sitePath, current.siteFileIdentity);
  if (currentRaw !== nextRaw) throw pathSafetyError();
}

function sanitizePhoneHref(phone) {
  const cleaned = String(phone ?? '').replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : 'tel:+886227515255';
}

function defaultBottomBarActions(settings = {}) {
  return [
    {
      id: 'call',
      label: '전화',
      href: sanitizePhoneHref(settings.phone),
      kind: 'phone',
    },
    {
      id: 'consultation',
      label: '상담 예약',
      href: '#contact',
      kind: 'booking',
    },
  ];
}

function normalizeHeaderFooter(headerFooter = {}) {
  const mode = HAMBURGER_MODES.has(headerFooter.mobileHamburger)
    ? headerFooter.mobileHamburger
    : 'auto';
  return {
    ...headerFooter,
    mobileSticky: headerFooter.mobileSticky === true,
    mobileHamburger: mode,
  };
}

function normalizeBottomBar(input = {}, settings = {}) {
  const fallbackActions = defaultBottomBarActions(settings);
  const incoming = Array.isArray(input.actions) ? input.actions.slice(0, 3) : [];
  const actions = fallbackActions.map((fallback, index) => {
    const action = incoming[index] ?? {};
    const kind = ['phone', 'booking', 'custom'].includes(action.kind) ? action.kind : fallback.kind;
    return {
      id: typeof action.id === 'string' && action.id.trim() ? action.id.trim().slice(0, 80) : fallback.id,
      label: typeof action.label === 'string' && action.label.trim() ? action.label.trim().slice(0, 40) : fallback.label,
      href: typeof action.href === 'string' && action.href.trim() ? action.href.trim().slice(0, 500) : fallback.href,
      kind,
    };
  });
  return {
    enabled: input.enabled === true,
    actions,
  };
}

function normalizeSite(site) {
  return {
    ...site,
    headerFooter: normalizeHeaderFooter(site.headerFooter),
    mobileBottomBar: normalizeBottomBar(site.mobileBottomBar, site.settings),
  };
}

function changedKeys(before, after) {
  const keys = [];
  if (JSON.stringify(before.headerFooter ?? null) !== JSON.stringify(after.headerFooter ?? null)) {
    keys.push('headerFooter.mobileSticky/mobileHamburger');
  }
  if (JSON.stringify(before.mobileBottomBar ?? null) !== JSON.stringify(after.mobileBottomBar ?? null)) {
    keys.push('mobileBottomBar');
  }
  return keys;
}

async function validateTransformedDocument(document, siteId) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      viteNodePath,
      '--config', viteConfigPath,
      validatorPath,
      '--site', siteId,
      '--mode', 'migration',
    ], {
      cwd: repoRoot,
      stdio: ['pipe', 'ignore', 'pipe'],
    });
    let stderr = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => {
      if (stderr.length < 4096) stderr += chunk.slice(0, 4096 - stderr.length);
    });
    child.once('error', () => reject(new Error('Site document validator could not be started.')));
    child.once('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.includes('SITE_DOCUMENT_INVALID')
        ? 'Transformed site document failed invariant validation.'
        : 'Site document validator failed.'));
    });
    child.stdin.on('error', () => {});
    child.stdin.end(JSON.stringify(document));
  });
}

async function prepareMigration(targetPaths, siteId, lease = null) {
  const targetSnapshot = await inspectTargetPaths(
    targetPaths.workspaceRoot,
    targetPaths.runtimeDataDir,
    targetPaths.runtimeRoot,
    targetPaths.siteDir,
    targetPaths.sitePath,
  );
  const leasedSource = lease ? await lease.read() : null;
  if (leasedSource?.kind === 'missing') throw pathSafetyError();
  const raw = await readBoundSiteFile(targetPaths.sitePath, targetSnapshot.siteFileIdentity);
  if (leasedSource && !leasedSource.bytes.equals(Buffer.from(raw))) throw pathSafetyError();

  let before;
  try {
    before = JSON.parse(raw);
  } catch {
    throw new Error('Site document JSON could not be parsed.');
  }
  if (before?.siteId !== siteId) throw new Error('Stored siteId does not match the requested site.');
  const after = normalizeSite(before);
  const changes = changedKeys(before, after);
  await validateTransformedDocument(after, siteId);
  return {
    targetSnapshot,
    raw,
    after,
    changes,
    sourceGeneration: leasedSource?.generation ?? null,
  };
}

async function main() {
  const siteId = argValue('--site', DEFAULT_SITE_ID);
  assertSafeSiteId(siteId);
  const apply = hasArg('--apply');
  if (apply && hasArg('--dry-run')) throw new Error('--apply and --dry-run cannot be used together.');
  const dryRun = !apply;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const workspaceRoot = process.cwd();
  const runtimeDataDir = path.join(workspaceRoot, 'runtime-data');
  const runtimeRoot = path.join(runtimeDataDir, 'builder-site');
  const siteDir = path.join(runtimeRoot, siteId);
  const sitePath = path.join(siteDir, 'site.json');
  const backupKey = `builder-site/${siteId}/backups/before-M07-${timestamp}.json`;
  const backupDir = path.join(siteDir, 'backups');
  const backupPath = path.join(siteDir, 'backups', `before-M07-${timestamp}.json`);

  const targetPaths = { workspaceRoot, runtimeDataDir, runtimeRoot, siteDir, sitePath };
  let migration;
  if (apply) {
    const preflight = await inspectTargetPaths(workspaceRoot, runtimeDataDir, runtimeRoot, siteDir, sitePath);
    await bindProcessToSiteDirectory(siteDir, workspaceRoot, preflight.siteDirIdentity);
    let lease;
    try {
      try {
        lease = await acquireLocalJsonWriteLease(sitePath, {
          allowedRoot: await realpath(workspaceRoot),
        });
      } catch (error) {
        if (isPathSafetyCause(error)) throw pathSafetyError();
        throw error;
      }
      migration = await prepareMigration(targetPaths, siteId, lease);
      const backupName = path.basename(backupPath);
      await assertTargetUnchanged(targetPaths, migration.targetSnapshot, migration.raw);
      await writeBoundBackup(siteDir, backupDir, backupName, migration.raw, migration.targetSnapshot);
      await assertTargetUnchanged(targetPaths, migration.targetSnapshot, migration.raw);
      await inspectBoundBackup(backupDir, backupPath, migration.targetSnapshot.siteDirReal, migration.raw);
      await pauseBeforeConditionalInstallForTest();
      await assertTargetUnchanged(targetPaths, migration.targetSnapshot, migration.raw);
      await inspectBoundBackup(backupDir, backupPath, migration.targetSnapshot.siteDirReal, migration.raw);
      const nextRaw = JSON.stringify(migration.after);
      try {
        await lease.atomicWrite(nextRaw, { expectedGeneration: migration.sourceGeneration });
      } catch {
        throw new Error('Atomic site write failed safety validation.');
      }
      await assertAppliedTarget(targetPaths, migration.targetSnapshot, nextRaw);
    } finally {
      try {
        if (lease) {
          let releaseError;
          try {
            await lease.release();
          } catch (error) {
            releaseError = error;
          }
          const releasedFromBoundDirectory = await releaseOwnedLeaseFromBoundSiteDirectory(lease.ownedLock);
          if (releaseError && !releasedFromBoundDirectory) throw releaseError;
        }
      } finally {
        process.chdir(workspaceRoot);
      }
    }
  } else {
    migration = await prepareMigration(targetPaths, siteId);
  }

  const summary = {
    dryRun,
    applied: apply,
    lockedAt: LOCKED_AT,
    siteId,
    backupKey,
    changed: migration.changes.length > 0,
    changes: migration.changes,
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Migration failed.';
  process.stderr.write(`M07 migration aborted: ${message}\n`);
  process.exitCode = 1;
});
