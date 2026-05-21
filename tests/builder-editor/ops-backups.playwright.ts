import { expect, test } from '@playwright/test';
import path from 'path';
import { mkdir, writeFile, rm } from 'fs/promises';

const LOCALE = 'ko';
const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('/ko/admin-builder/ops backups tab: create, list, delete', async ({ page }) => {
  const fixtureDir = path.join(process.cwd(), 'runtime-data', 'ops-pw-fixture');
  const fixtureFile = path.join(fixtureDir, 'snapshot.json');
  await mkdir(fixtureDir, { recursive: true });
  await writeFile(fixtureFile, JSON.stringify({ ts: Date.now() }), 'utf8');

  try {
    await page.setExtraHTTPHeaders({ Authorization: authHeader, 'x-forwarded-for': 'pw-ops-backups' });
    await page.goto(`/${LOCALE}/admin-builder/ops`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-ops-tab="backups"]').click();
    await expect(page.locator('[data-ops-backups-panel="true"]')).toBeVisible();

    await page.locator('[data-ops-backup-source="true"]').fill(fixtureFile);
    await page.locator('[data-ops-backup-note="true"]').fill('playwright');
    await page.locator('[data-ops-backup-create="true"]').click();

    const row = page.locator('[data-ops-backup-row^="opsbkp_"]').first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    const rowId = await row.getAttribute('data-ops-backup-row');
    expect(rowId).toBeTruthy();

    page.once('dialog', (dialog) => { void dialog.accept(); });
    await page.locator(`[data-ops-backup-delete="${rowId}"]`).click();
    await expect(page.locator(`[data-ops-backup-row="${rowId}"]`)).toHaveCount(0, { timeout: 15_000 });
  } finally {
    await rm(fixtureDir, { recursive: true, force: true });
  }
});