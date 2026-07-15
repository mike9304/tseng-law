import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, realpath, rename, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const repoRoot = process.cwd();
const migrationScript = path.join(repoRoot, 'scripts/migrate-builder-mobile-schema.mjs');
const leaseModule = path.join(repoRoot, 'src/lib/builder/storage/local-json-write-lease.mjs');
const validatorScript = path.join(repoRoot, 'scripts/validate-builder-site-document.ts');
const viteNode = path.join(repoRoot, 'node_modules/vite-node/vite-node.mjs');
const viteConfig = path.join(repoRoot, 'vitest.config.ts');
const LEASE_WRITER_SOURCE = String.raw`
import { stat, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const { acquireLocalJsonWriteLease } = await import(pathToFileURL(process.env.M07_LEASE_MODULE).href);
const lease = await acquireLocalJsonWriteLease(process.env.M07_SITE_PATH, {
  allowedRoot: process.env.M07_ALLOWED_ROOT,
  timeoutMs: 5_000,
});
try {
  await writeFile(process.env.M07_WRITER_READY, 'ready', 'utf8');
  while (true) {
    const released = await stat(process.env.M07_WRITER_RELEASE).then(() => true, () => false);
    if (released) break;
    await delay(5);
  }
  const source = await lease.read();
  if (source.kind !== 'present') throw new Error('writer source missing');
  const document = JSON.parse(source.bytes.toString('utf8'));
  document.name = process.env.M07_WRITER_NAME;
  await lease.atomicWrite(JSON.stringify(document), { expectedGeneration: source.generation });
  process.stdout.write('{"ok":true}\n');
} finally {
  await lease.release();
}
`;

type Page = {
  pageId: string;
  slug: string;
  title: { ko: string };
  locale: 'ko';
  isHomePage?: boolean;
  createdAt: string;
  updatedAt: string;
};

function validHomePage(overrides: Partial<Page> = {}): Page {
  return {
    pageId: 'home',
    slug: '',
    title: { ko: 'Home' },
    locale: 'ko',
    isHomePage: true,
    createdAt: '2026-05-10T00:00:00.000Z',
    updatedAt: '2026-05-10T00:00:00.000Z',
    ...overrides,
  };
}

function legacySiteJson(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    version: 1,
    siteId: 'm07-test-site',
    name: 'M07 Test',
    locale: 'ko',
    navigation: [],
    theme: {
      colors: {
        primary: '#123b63',
        secondary: '#1e5a96',
        accent: '#e8a838',
        text: '#1f2937',
        background: '#ffffff',
        muted: '#f3f4f6',
      },
      fonts: { heading: 'system-ui', body: 'system-ui' },
      radii: { sm: 4, md: 8, lg: 16 },
    },
    settings: { phone: '+886 2 2751 5255' },
    pages: [validHomePage()],
    createdAt: '2026-05-10T00:00:00.000Z',
    updatedAt: '2026-05-10T00:00:00.000Z',
    ...overrides,
  });
}

async function createFixture(siteJson = legacySiteJson(), siteId = 'm07-test-site') {
  const root = await mkdtemp(path.join(tmpdir(), 'm07-mobile-schema-'));
  const siteDir = path.join(root, 'runtime-data', 'builder-site', siteId);
  const sitePath = path.join(siteDir, 'site.json');
  await mkdir(siteDir, { recursive: true });
  await writeFile(sitePath, siteJson, 'utf8');
  return { root, siteDir, sitePath };
}

async function expectCommandFailure(command: string, args: string[], cwd: string) {
  try {
    await execFileAsync(command, args, { cwd });
  } catch (error) {
    return error as Error & { stdout: string; stderr: string; code: number };
  }
  throw new Error('Expected command to fail.');
}

async function expectNoMigrationArtifacts(directory: string) {
  const entries = await readdir(directory);
  expect(entries).not.toContain('backups');
  expect(entries.filter((name) => name.includes('.tmp'))).toEqual([]);
  expect(entries.filter((name) => name.startsWith('.'))).toEqual([]);
}

function startMigration(args: string[], cwd: string, extraEnv: Record<string, string> = {}) {
  const child = execFile(process.execPath, [migrationScript, ...args], {
    cwd,
    env: { ...process.env, ...extraEnv },
  });
  let stdout = '';
  let stderr = '';
  child.stdout?.setEncoding('utf8');
  child.stderr?.setEncoding('utf8');
  child.stdout?.on('data', (chunk) => { stdout += chunk; });
  child.stderr?.on('data', (chunk) => { stderr += chunk; });
  const completion = new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve) => {
    child.once('close', (code) => resolve({ code, stdout, stderr }));
  });
  return { child, completion };
}

function startLeaseWriter(
  root: string,
  sitePath: string,
  readyPath: string,
  releasePath: string,
  writerName: string,
) {
  const child = execFile(process.execPath, ['--input-type=module', '--eval', LEASE_WRITER_SOURCE], {
    cwd: root,
    env: {
      ...process.env,
      M07_LEASE_MODULE: leaseModule,
      M07_SITE_PATH: sitePath,
      M07_ALLOWED_ROOT: root,
      M07_WRITER_READY: readyPath,
      M07_WRITER_RELEASE: releasePath,
      M07_WRITER_NAME: writerName,
    },
  });
  let stdout = '';
  let stderr = '';
  child.stdout?.setEncoding('utf8');
  child.stderr?.setEncoding('utf8');
  child.stdout?.on('data', (chunk) => { stdout += chunk; });
  child.stderr?.on('data', (chunk) => { stderr += chunk; });
  const completion = new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve) => {
    child.once('close', (code) => resolve({ code, stdout, stderr }));
  });
  return { child, completion };
}

async function waitForCondition(child: ReturnType<typeof startMigration>['child'], check: () => Promise<boolean>) {
  const deadline = Date.now() + 4_000;
  while (Date.now() < deadline && child.exitCode === null) {
    if (await check()) return;
    await delay(5);
  }
  throw new Error('Timed out waiting for migration race checkpoint.');
}

describe('M07 mobile schema migration script', () => {
  it.each([
    ['by default', []],
    ['with --dry-run', ['--dry-run']],
  ])('dry-runs %s without changing site.json or creating a backup', async (_label, extraArgs) => {
    const { root, sitePath } = await createFixture();
    const before = await readFile(sitePath, 'utf8');

    const { stdout } = await execFileAsync(process.execPath, [
      migrationScript,
      '--site',
      'm07-test-site',
      ...extraArgs,
    ], { cwd: root });

    const summary = JSON.parse(stdout) as { dryRun: boolean; applied: boolean; changed: boolean; changes: string[] };
    expect(summary).toMatchObject({ dryRun: true, applied: false, changed: true });
    expect(summary.changes).toContain('headerFooter.mobileSticky/mobileHamburger');
    expect(summary.changes).toContain('mobileBottomBar');
    expect(await readFile(sitePath, 'utf8')).toBe(before);
    await expect(stat(path.join(root, 'runtime-data', 'builder-site', 'm07-test-site', 'backups')))
      .rejects
      .toMatchObject({ code: 'ENOENT' });
  });

  it('requires --apply, preserves an exact backup, and atomically replaces site.json', async () => {
    const { root, siteDir, sitePath } = await createFixture();
    const before = await readFile(sitePath, 'utf8');

    const { stdout } = await execFileAsync(process.execPath, [
      migrationScript,
      '--site',
      'm07-test-site',
      '--apply',
    ], { cwd: root });

    const summary = JSON.parse(stdout) as { dryRun: boolean; applied: boolean; changed: boolean; backupKey: string };
    expect(summary).toMatchObject({ dryRun: false, applied: true, changed: true });
    expect(summary.backupKey).toMatch(/^builder-site\/m07-test-site\/backups\/before-M07-/);

    const migrated = JSON.parse(await readFile(sitePath, 'utf8')) as {
      headerFooter?: { mobileSticky?: boolean; mobileHamburger?: string };
      mobileBottomBar?: { enabled?: boolean; actions?: Array<{ href?: string; kind?: string }> };
    };
    expect(migrated.headerFooter).toMatchObject({ mobileSticky: false, mobileHamburger: 'auto' });
    expect(migrated.mobileBottomBar).toMatchObject({
      enabled: false,
      actions: [
        { href: 'tel:+886227515255', kind: 'phone' },
        { href: '#contact', kind: 'booking' },
      ],
    });
    expect(await readFile(path.join(root, 'runtime-data', summary.backupKey), 'utf8')).toBe(before);
    expect((await readdir(siteDir)).filter((name) => name.includes('.tmp'))).toEqual([]);
    expect((await readdir(siteDir)).filter((name) => name.startsWith('.'))).toEqual([]);
  });

  it('serializes a real lease writer behind the migration transaction without lost updates', async () => {
    const { root, siteDir, sitePath } = await createFixture();
    const before = await readFile(sitePath, 'utf8');
    const backupDir = path.join(siteDir, 'backups');
    const readyPath = path.join(root, 'lease-writer.ready');
    const releasePath = path.join(root, 'lease-writer.release');
    const migration = startMigration(['--site', 'm07-test-site', '--apply'], root, {
      NODE_ENV: 'test',
      M07_TEST_BACKUP_BIND_PAUSE_MS: '800',
    });

    const migrationCheckpoint = await Promise.race([
      waitForCondition(migration.child, async () => stat(backupDir).then(() => true, () => false))
        .then(() => ({ kind: 'ready' as const })),
      migration.completion.then((result) => ({ kind: 'exited' as const, result })),
    ]);
    if (migrationCheckpoint.kind === 'exited') {
      throw new Error(`migration exited before the backup checkpoint: ${migrationCheckpoint.result.stderr}`);
    }
    const writer = startLeaseWriter(
      await realpath(root),
      await realpath(sitePath),
      readyPath,
      releasePath,
      'LEASE WRITER WON AFTER MIGRATION',
    );
    const firstOwner = await Promise.race([
      migration.completion.then(() => 'migration' as const),
      waitForCondition(writer.child, async () => stat(readyPath).then(() => true, () => false))
        .then(() => 'writer' as const),
      writer.completion.then(() => 'writer-exited' as const),
    ]);

    if (firstOwner === 'writer-exited') {
      const writerResult = await writer.completion;
      throw new Error(`lease writer exited before acquiring: ${writerResult.stderr}`);
    }
    expect(firstOwner).toBe('migration');
    const migrationResult = await migration.completion;
    expect(migrationResult.code, migrationResult.stderr).toBe(0);
    await waitForCondition(writer.child, async () => stat(readyPath).then(() => true, () => false));
    await writeFile(releasePath, 'release', 'utf8');
    const writerResult = await writer.completion;
    expect(writerResult.code, writerResult.stderr).toBe(0);

    const finalDocument = JSON.parse(await readFile(sitePath, 'utf8')) as {
      name?: string;
      headerFooter?: { mobileSticky?: boolean; mobileHamburger?: string };
      mobileBottomBar?: { enabled?: boolean };
    };
    expect(finalDocument).toMatchObject({
      name: 'LEASE WRITER WON AFTER MIGRATION',
      headerFooter: { mobileSticky: false, mobileHamburger: 'auto' },
      mobileBottomBar: { enabled: false },
    });
    const backupNames = await readdir(backupDir);
    expect(backupNames).toHaveLength(1);
    expect(await readFile(path.join(backupDir, backupNames[0]), 'utf8')).toBe(before);
    expect((await readdir(siteDir)).filter((name) => name.startsWith('.'))).toEqual([]);
  });

  it.each([
    '../escape',
    'nested/site',
    '.',
    '..',
    'site id',
    'undefined',
    'Undefined',
    'null',
    'NULL',
  ])('rejects unsafe --site value %j before filesystem access', async (siteId) => {
    const root = await mkdtemp(path.join(tmpdir(), 'm07-mobile-schema-unsafe-'));
    const failure = await expectCommandFailure(process.execPath, [migrationScript, '--site', siteId, '--apply'], root);
    expect(failure.stderr).toContain('--site must be a safe single path segment');
    await expect(stat(path.join(root, 'runtime-data'))).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it.each([
    ['missing value', ['--site']],
    ['flag in place of value', ['--site', '--apply']],
  ])('rejects a %s before filesystem access', async (_label, args) => {
    const root = await mkdtemp(path.join(tmpdir(), 'm07-mobile-schema-missing-site-'));
    const failure = await expectCommandFailure(process.execPath, [migrationScript, ...args], root);
    expect(failure.stderr).toContain('--site requires a value');
    await expect(stat(path.join(root, 'runtime-data'))).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it.each([
    ['runtime data directory', 'runtime-data', []],
    ['runtime data directory', 'runtime-data', ['--apply']],
    ['runtime root', 'runtime-root', []],
    ['runtime root', 'runtime-root', ['--apply']],
    ['site directory', 'site-dir', []],
    ['site directory', 'site-dir', ['--apply']],
    ['site file', 'site-file', []],
    ['site file', 'site-file', ['--apply']],
  ])('rejects a symlinked %s during %s without touching the external target', async (_label, targetKind, extraArgs) => {
    const siteId = 'm07-test-site';
    const root = await mkdtemp(path.join(tmpdir(), 'm07-mobile-schema-symlink-'));
    const externalRoot = await mkdtemp(path.join(tmpdir(), 'm07-mobile-schema-external-'));
    const runtimeDataDir = path.join(root, 'runtime-data');
    const runtimeRoot = path.join(runtimeDataDir, 'builder-site');
    const logicalSiteDir = path.join(runtimeRoot, siteId);
    const logicalSitePath = path.join(logicalSiteDir, 'site.json');
    const externalSiteDir = targetKind === 'runtime-data'
      ? path.join(externalRoot, 'builder-site', siteId)
      : path.join(externalRoot, siteId);
    const externalSitePath = path.join(externalSiteDir, 'site.json');
    const original = legacySiteJson({ name: 'EXTERNAL TARGET MUST REMAIN UNTOUCHED' });
    const artifactDirectories = new Set<string>();

    if (targetKind === 'runtime-data') {
      await mkdir(externalSiteDir, { recursive: true });
      await writeFile(externalSitePath, original, 'utf8');
      await symlink(externalRoot, runtimeDataDir, 'dir');
      artifactDirectories.add(externalSiteDir);
    } else if (targetKind === 'runtime-root') {
      await mkdir(externalSiteDir, { recursive: true });
      await writeFile(externalSitePath, original, 'utf8');
      await mkdir(runtimeDataDir, { recursive: true });
      await symlink(externalRoot, runtimeRoot, 'dir');
      artifactDirectories.add(externalSiteDir);
    } else if (targetKind === 'site-dir') {
      await mkdir(externalSiteDir, { recursive: true });
      await writeFile(externalSitePath, original, 'utf8');
      await mkdir(runtimeRoot, { recursive: true });
      await symlink(externalSiteDir, logicalSiteDir, 'dir');
      artifactDirectories.add(externalSiteDir);
    } else {
      await mkdir(logicalSiteDir, { recursive: true });
      await mkdir(externalSiteDir, { recursive: true });
      await writeFile(externalSitePath, original, 'utf8');
      await symlink(externalSitePath, logicalSitePath, 'file');
      artifactDirectories.add(logicalSiteDir);
      artifactDirectories.add(externalSiteDir);
    }

    const failure = await expectCommandFailure(process.execPath, [
      migrationScript, '--site', siteId, ...extraArgs,
    ], root);

    expect(failure.stderr).toContain('Migration target path failed safety validation');
    expect(failure.stderr).not.toContain(externalRoot);
    expect(failure.stderr).not.toContain('EXTERNAL TARGET MUST REMAIN UNTOUCHED');
    expect(await readFile(externalSitePath, 'utf8')).toBe(original);
    for (const directory of artifactDirectories) await expectNoMigrationArtifacts(directory);
  });

  it('never follows a backups-directory swap to an external target during apply', async () => {
    const { root, siteDir, sitePath } = await createFixture();
    const externalDir = await mkdtemp(path.join(tmpdir(), 'm07-backup-race-external-'));
    const backupDir = path.join(siteDir, 'backups');
    const renamedBackupDir = path.join(siteDir, 'backups-original');
    const before = await readFile(sitePath, 'utf8');
    const migration = startMigration(['--site', 'm07-test-site', '--apply'], root, {
      NODE_ENV: 'test',
      M07_TEST_BACKUP_BIND_PAUSE_MS: '800',
    });

    await waitForCondition(migration.child, async () => stat(backupDir).then(() => true, () => false));
    await rename(backupDir, renamedBackupDir);
    await symlink(externalDir, backupDir, 'dir');
    const result = await migration.completion;

    expect(result.code).not.toBe(0);
    expect(result.stderr).not.toContain(externalDir);
    expect(await readFile(sitePath, 'utf8')).toBe(before);
    expect(await readdir(externalDir)).toEqual([]);
    expect(await readdir(renamedBackupDir)).toEqual([]);
    expect((await readdir(siteDir)).filter((name) => name.includes('.tmp'))).toEqual([]);
    expect((await readdir(siteDir)).filter((name) => name.startsWith('.'))).toEqual([]);
  });

  it('aborts a runtime-data namespace swap before replacing the bound source', async () => {
    const { root, siteDir, sitePath } = await createFixture();
    const before = await readFile(sitePath, 'utf8');
    const runtimeDataDir = path.join(root, 'runtime-data');
    const renamedRuntimeDataDir = path.join(root, 'runtime-data-original');
    const externalRuntimeData = await mkdtemp(path.join(tmpdir(), 'm07-runtime-race-external-'));
    const externalSiteDir = path.join(externalRuntimeData, 'builder-site', 'm07-test-site');
    const externalSitePath = path.join(externalSiteDir, 'site.json');
    const externalBytes = legacySiteJson({ name: 'EXTERNAL RUNTIME MUST REMAIN UNTOUCHED' });
    await mkdir(externalSiteDir, { recursive: true });
    await writeFile(externalSitePath, externalBytes, 'utf8');
    const migration = startMigration(['--site', 'm07-test-site', '--apply'], root, {
      NODE_ENV: 'test',
      M07_TEST_SOURCE_BIND_PAUSE_MS: '800',
    });

    await waitForCondition(migration.child, async () => stat(path.join(siteDir, 'backups')).then(() => true, () => false));
    await rename(runtimeDataDir, renamedRuntimeDataDir);
    await symlink(externalRuntimeData, runtimeDataDir, 'dir');
    const result = await migration.completion;
    const originalSiteDir = path.join(renamedRuntimeDataDir, 'builder-site', 'm07-test-site');

    expect(result.code).not.toBe(0);
    expect(result.stderr).not.toContain(externalRuntimeData);
    expect(await readFile(path.join(originalSiteDir, 'site.json'), 'utf8')).toBe(before);
    expect(await readFile(externalSitePath, 'utf8')).toBe(externalBytes);
    expect((await readdir(originalSiteDir)).filter((name) => name.startsWith('.'))).toEqual([]);
    await expectNoMigrationArtifacts(externalSiteDir);
  });

  it.each(['replacement inode', 'same-inode generation'])('aborts when the source %s changes before final replace', async (mutationKind) => {
    const { root, siteDir, sitePath } = await createFixture();
    const before = await readFile(sitePath, 'utf8');
    const attackerBytes = legacySiteJson({ name: `ATTACKER ${mutationKind}` });
    const migration = startMigration(['--site', 'm07-test-site', '--apply'], root, {
      NODE_ENV: 'test',
      M07_TEST_SOURCE_BIND_PAUSE_MS: '800',
    });

    const backupDir = path.join(siteDir, 'backups');
    await waitForCondition(migration.child, async () => (
      readdir(backupDir).then((entries) => entries.some((name) => name.startsWith('before-M07-')), () => false)
    ));
    if (mutationKind === 'replacement inode') {
      await rename(sitePath, path.join(siteDir, 'site-before-attacker.json'));
    }
    await writeFile(sitePath, attackerBytes, 'utf8');
    const result = await migration.completion;

    expect(result.code).not.toBe(0);
    expect(result.stderr).not.toContain(`ATTACKER ${mutationKind}`);
    expect(await readFile(sitePath, 'utf8')).toBe(attackerBytes);
    expect((await readdir(siteDir)).filter((name) => name.startsWith('.'))).toEqual([]);
    const backupNames = await readdir(backupDir);
    expect(backupNames).toHaveLength(1);
    expect(await readFile(path.join(siteDir, 'backups', backupNames[0]), 'utf8')).toBe(before);
  });

  it.each(['replacement inode', 'same-inode generation'])('aborts when the backup %s changes before final replace', async (mutationKind) => {
    const { root, siteDir, sitePath } = await createFixture();
    const before = await readFile(sitePath, 'utf8');
    const attackerBytes = `ATTACKER BACKUP ${mutationKind}`;
    const migration = startMigration(['--site', 'm07-test-site', '--apply'], root, {
      NODE_ENV: 'test',
      M07_TEST_SOURCE_BIND_PAUSE_MS: '800',
    });

    const backupDir = path.join(siteDir, 'backups');
    await waitForCondition(migration.child, async () => (
      readdir(backupDir).then((entries) => entries.some((name) => name.startsWith('before-M07-')), () => false)
    ));
    const backupName = (await readdir(backupDir))[0];
    const backupPath = path.join(backupDir, backupName);
    if (mutationKind === 'replacement inode') {
      await rename(backupPath, path.join(backupDir, 'backup-before-attacker.json'));
    }
    await writeFile(backupPath, attackerBytes, 'utf8');
    const result = await migration.completion;

    expect(result.code).not.toBe(0);
    expect(result.stderr).not.toContain(attackerBytes);
    expect(await readFile(sitePath, 'utf8')).toBe(before);
    expect(await readFile(backupPath, 'utf8')).toBe(attackerBytes);
    expect((await readdir(siteDir)).filter((name) => name.startsWith('.'))).toEqual([]);
  });

  it('rejects a stored siteId mismatch without writing or backing up', async () => {
    const { root, sitePath } = await createFixture(legacySiteJson({ siteId: 'different-site' }));
    const before = await readFile(sitePath, 'utf8');
    const failure = await expectCommandFailure(process.execPath, [
      migrationScript, '--site', 'm07-test-site', '--apply',
    ], root);
    expect(failure.stderr).toContain('Stored siteId does not match');
    expect(await readFile(sitePath, 'utf8')).toBe(before);
    await expect(stat(path.join(path.dirname(sitePath), 'backups'))).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it.each([
    ['dry-run', []],
    ['apply', ['--apply']],
  ])('reports malformed site JSON safely during %s without changing bytes', async (_label, extraArgs) => {
    const secret = 'PRIVATE-MALFORMED-CUSTOMER-CONTENT';
    const malformed = `{"siteId":"m07-test-site","name":"${secret}",BROKEN`;
    const { root, siteDir, sitePath } = await createFixture(malformed);

    const failure = await expectCommandFailure(process.execPath, [
      migrationScript, '--site', 'm07-test-site', ...extraArgs,
    ], root);

    expect(failure.stderr).toContain('Site document JSON could not be parsed');
    expect(failure.stderr).not.toContain(secret);
    expect(await readFile(sitePath, 'utf8')).toBe(malformed);
    await expect(stat(path.join(siteDir, 'backups'))).rejects.toMatchObject({ code: 'ENOENT' });
    expect((await readdir(siteDir)).filter((name) => name.includes('.tmp'))).toEqual([]);
  });

  it.each([
    ['dry-run', []],
    ['apply', ['--apply']],
  ])('rejects an internal sandbox page for the canonical site during %s without changing bytes', async (_label, extraArgs) => {
    const siteId = 'tseng-law-main-site';
    const internalPage = validHomePage({
      pageId: 'db-probe-r04',
      slug: 'db-probe-r04',
      title: { ko: 'PRIVATE QA TITLE' },
      isHomePage: false,
    });
    const siteJson = legacySiteJson({
      siteId,
      pages: [validHomePage(), internalPage],
    });
    const { root, siteDir, sitePath } = await createFixture(siteJson, siteId);
    const before = await readFile(sitePath, 'utf8');

    const failure = await expectCommandFailure(process.execPath, [
      migrationScript, '--site', siteId, ...extraArgs,
    ], root);

    expect(failure.stderr).toContain('failed invariant validation');
    expect(failure.stderr).not.toContain('PRIVATE QA TITLE');
    expect(await readFile(sitePath, 'utf8')).toBe(before);
    await expect(stat(path.join(siteDir, 'backups'))).rejects.toMatchObject({ code: 'ENOENT' });
    expect((await readdir(siteDir)).filter((name) => name.includes('.tmp'))).toEqual([]);
  });

  it('allows internal sandbox pages for an isolated custom fixture site', async () => {
    const internalPage = validHomePage({
      pageId: 'db-probe-r04',
      slug: 'db-probe-r04',
      title: { ko: 'Fixture probe' },
      isHomePage: false,
    });
    const { root, sitePath } = await createFixture(legacySiteJson({
      pages: [validHomePage(), internalPage],
    }));

    const { stdout } = await execFileAsync(process.execPath, [
      migrationScript, '--site', 'm07-test-site', '--dry-run',
    ], { cwd: root });

    expect(JSON.parse(stdout)).toMatchObject({
      siteId: 'm07-test-site',
      dryRun: true,
      applied: false,
    });
    expect(JSON.parse(await readFile(sitePath, 'utf8')).pages).toContainEqual(internalPage);
  });

  it.each([
    ['duplicate page id', [validHomePage(), validHomePage({ slug: 'other', isHomePage: false })]],
    ['missing authored home', [validHomePage({ slug: 'landing', isHomePage: false })]],
    ['unsafe page id', [validHomePage({ pageId: '../private' })]],
  ])('leaves bytes and backup state untouched when transformed invariants fail: %s', async (_label, pages) => {
    const { root, sitePath } = await createFixture(legacySiteJson({ pages, name: 'DO_NOT_LEAK_THIS_NAME' }));
    const before = await readFile(sitePath, 'utf8');
    const failure = await expectCommandFailure(process.execPath, [
      migrationScript, '--site', 'm07-test-site', '--apply',
    ], root);

    expect(failure.stderr).toContain('failed invariant validation');
    expect(failure.stderr).not.toContain('DO_NOT_LEAK_THIS_NAME');
    expect(await readFile(sitePath, 'utf8')).toBe(before);
    await expect(stat(path.join(path.dirname(sitePath), 'backups'))).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('validator exits nonzero with sanitized invariant codes only', async () => {
    const secret = 'PRIVATE-CUSTOMER-CONTENT';
    const invalid = legacySiteJson({
      name: secret,
      pages: [validHomePage({ pageId: '../private', title: { ko: secret } })],
    });
    const child = execFile(
      process.execPath,
      [viteNode, '--config', viteConfig, validatorScript, '--site', 'm07-test-site', '--mode', 'migration'],
      { cwd: repoRoot },
      () => {},
    );
    let stderr = '';
    child.stderr?.setEncoding('utf8');
    child.stderr?.on('data', (chunk) => { stderr += chunk; });
    child.stdin?.end(invalid);
    const code = await new Promise<number | null>((resolve) => child.once('close', resolve));

    expect(code).not.toBe(0);
    expect(stderr).toContain('SITE_DOCUMENT_INVALID');
    expect(stderr).toContain('PAGE_ID_UNSAFE');
    expect(stderr).not.toContain(secret);
    expect(stderr).not.toContain('../private');
  });
});
