import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);

function legacySiteJson() {
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
    settings: {
      phone: '+886 2 2751 5255',
    },
    pages: [],
    createdAt: '2026-05-10T00:00:00.000Z',
    updatedAt: '2026-05-10T00:00:00.000Z',
  });
}

async function createFixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'm07-mobile-schema-'));
  const siteDir = path.join(root, 'runtime-data', 'builder-site', 'm07-test-site');
  const sitePath = path.join(siteDir, 'site.json');
  await mkdir(siteDir, { recursive: true });
  await writeFile(sitePath, legacySiteJson(), 'utf8');
  return { root, sitePath };
}

describe('M07 mobile schema migration script', () => {
  it('dry-runs without changing site.json or creating a backup', async () => {
    const { root, sitePath } = await createFixture();
    const before = await readFile(sitePath, 'utf8');

    const { stdout } = await execFileAsync(process.execPath, [
      path.join(process.cwd(), 'scripts/migrate-builder-mobile-schema.mjs'),
      '--site',
      'm07-test-site',
      '--dry-run',
    ], { cwd: root });

    const summary = JSON.parse(stdout) as { dryRun: boolean; changed: boolean; changes: string[]; backupKey: string };
    expect(summary.dryRun).toBe(true);
    expect(summary.changed).toBe(true);
    expect(summary.changes).toContain('headerFooter.mobileSticky/mobileHamburger');
    expect(summary.changes).toContain('mobileBottomBar');
    expect(await readFile(sitePath, 'utf8')).toBe(before);
    await expect(stat(path.join(root, 'runtime-data', 'builder-site', 'm07-test-site', 'backups')))
      .rejects
      .toMatchObject({ code: 'ENOENT' });
  });

  it('applies defaults and writes a before-M07 backup', async () => {
    const { root, sitePath } = await createFixture();
    const before = await readFile(sitePath, 'utf8');

    const { stdout } = await execFileAsync(process.execPath, [
      path.join(process.cwd(), 'scripts/migrate-builder-mobile-schema.mjs'),
      '--site',
      'm07-test-site',
    ], { cwd: root });

    const summary = JSON.parse(stdout) as { dryRun: boolean; changed: boolean; backupKey: string };
    expect(summary.dryRun).toBe(false);
    expect(summary.changed).toBe(true);
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

    const backupPath = path.join(root, 'runtime-data', summary.backupKey);
    expect(await readFile(backupPath, 'utf8')).toBe(before);
  });
});
