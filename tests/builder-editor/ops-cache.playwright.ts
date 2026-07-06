import { expect, test } from '@playwright/test';
import { mkdir, rm, utimes, writeFile } from 'fs/promises';
import path from 'path';

const LOCALE = 'ko';
const CACHE_STALE_MS = 24 * 60 * 60 * 1000;
const CACHE_LARGE_KEY_BYTES = 1024 * 1024;
const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

function cacheRoot(): string {
  return process.env.BUILDER_OPS_CACHE_PATH
    ?? path.join(process.cwd(), 'runtime-data', 'cache');
}

async function writeCacheFile(key: string, body: string | Buffer, writtenAt: Date): Promise<void> {
  const file = path.join(cacheRoot(), key);
  await writeFile(file, body);
  await utimes(file, writtenAt, writtenAt);
}

test('/ko/admin-builder/ops cache tab: inventory classifications and stale purge report', async ({ page }) => {
  const cacheDir = cacheRoot();
  const prefix = `pw-cache-${Date.now()}`;
  const freshKey = `${prefix}-fresh.json`;
  const largeKey = `${prefix}-large.json`;
  const staleKey = `${prefix}-stale.json`;
  const now = new Date();
  const freshWrittenAt = new Date(now.getTime() - 60_000);
  const staleWrittenAt = new Date(now.getTime() - CACHE_STALE_MS - 60_000);

  await mkdir(cacheDir, { recursive: true });
  await writeCacheFile(freshKey, '{}', freshWrittenAt);
  await writeCacheFile(largeKey, Buffer.alloc(CACHE_LARGE_KEY_BYTES + 1, 1), freshWrittenAt);
  await writeCacheFile(staleKey, '{"old":true}', staleWrittenAt);

  try {
    await page.setExtraHTTPHeaders({ Authorization: authHeader, 'x-forwarded-for': 'pw-ops-cache' });
    await page.goto(`/${LOCALE}/admin-builder/ops`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-ops-tab="cache"]').click();
    await expect(page.locator('[data-ops-cache-panel="true"]')).toBeVisible();

    const staleRow = page.locator(`[data-ops-cache-row="${staleKey}"]`);
    const largeRow = page.locator(`[data-ops-cache-row="${largeKey}"]`);
    const freshRow = page.locator(`[data-ops-cache-row="${freshKey}"]`);
    await expect(staleRow).toHaveAttribute('data-ops-cache-stale', 'true');
    await expect(largeRow).toHaveAttribute('data-ops-cache-large', 'true');
    await expect(freshRow).toHaveAttribute('data-ops-cache-stale', 'false');
    await expect(page.locator('[data-ops-cache-summary="stale"]')).toContainText(/오래된 키\s*[1-9]/);

    await page.locator('[data-ops-cache-purge-stale="true"]').click();
    await expect(staleRow).toHaveCount(0, { timeout: 15_000 });
    await expect(freshRow).toBeVisible();
    await expect(largeRow).toBeVisible();
    await expect(page.locator('[data-ops-cache-report="true"]')).toContainText('최근 캐시 정리 리포트');
    await expect(page.locator('[data-ops-cache-field="mode"]')).toHaveText('stale');
    await expect(page.locator('[data-ops-cache-field="cleared"]')).toHaveText(/[1-9]\d*/);
  } finally {
    await rm(path.join(cacheDir, freshKey), { force: true });
    await rm(path.join(cacheDir, largeKey), { force: true });
    await rm(path.join(cacheDir, staleKey), { force: true });
  }
});
