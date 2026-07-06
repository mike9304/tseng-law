import { expect, test } from '@playwright/test';

const DEFAULT_SITE_ID = 'tseng-law-main-site';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseRequestJson(raw: string | null): unknown {
  if (!raw) throw new Error('request_body_missing');
  const parsed: unknown = JSON.parse(raw);
  return parsed;
}

test('/ko/builder collection detail can seed and open the first dataset editor', async ({ page }) => {
  test.setTimeout(60_000);
  const overviewResponse = await page.request.get(`/api/builder/sites/${DEFAULT_SITE_ID}/pages/home/datasets?locale=ko`);
  const overviewPayload: unknown = await overviewResponse.json();
  if (!overviewResponse.ok() || !isRecord(overviewPayload) || typeof overviewPayload.revision !== 'number') {
    throw new Error('dataset_overview_revision_missing');
  }
  const expectedQuickSeedRevision = overviewPayload.revision;
  let quickSeedPayload: unknown;

  await page.route(`**/api/builder/sites/${DEFAULT_SITE_ID}/pages/home/datasets/seed?locale=ko`, async (route) => {
    if (route.request().method() === 'POST' && quickSeedPayload === undefined) {
      quickSeedPayload = parseRequestJson(route.request().postData());
    }
    await route.continue();
  });

  await page.goto('/ko/builder/collections/service-areas', {
    waitUntil: 'domcontentloaded',
  });

  await expect(page.locator('aside[aria-label="빌더 탐색"]')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Service areas collection', { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-builder-collection-target="home.services.list"] [data-builder-dataset-seed-target="home.services.list"]')).toBeVisible(
    { timeout: 30_000 },
  );
  await Promise.all([
    page.waitForURL(/\/ko\/builder\/home\/datasets\?targetId=home\.services\.list/),
    page.locator('[data-builder-collection-target="home.services.list"] [data-builder-dataset-seed-target="home.services.list"]').click(),
  ]);
  await expect(page.getByRole('heading', { name: 'Services list' })).toBeVisible({ timeout: 30_000 });
  if (!isRecord(quickSeedPayload)) throw new Error('quick_seed_payload_missing');
  expect(quickSeedPayload.expectedRevision).toBe(expectedQuickSeedRevision);
  await expect(page.locator('input[type="number"]').first()).toHaveValue('6');
  await page.goto('/ko/admin-builder/cms?collectionId=service-areas', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'CMS', exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-cms-source-collection-focus="service-areas"]')).toBeVisible({ timeout: 30_000 });
  await expect(
    page.locator('[data-cms-source-collection-focus="service-areas"] [data-cms-source-lifecycle="service-areas"]').first(),
  ).toBeVisible({ timeout: 30_000 });
  const sourceFocusCard = page.locator('[data-cms-source-collection-focus="service-areas"]');
  await expect(
    sourceFocusCard.locator('[data-cms-source-target-seed="home.services.list"] [data-builder-dataset-seed-target="home.services.list"]'),
  ).toBeVisible({ timeout: 30_000 });
  await expect(sourceFocusCard.locator('[data-cms-source-target-chip-link="home.services.list"]')).toHaveAttribute(
    'href',
    /\/ko\/builder\/home\/datasets\?targetId=home\.services\.list/,
  );
  await Promise.all([
    page.waitForURL(/\/ko\/builder\/home\/datasets\?targetId=home\.services\.list/),
    sourceFocusCard.locator('[data-cms-source-target-chip-link="home.services.list"]').click(),
  ]);
  await expect(page.getByRole('heading', { name: 'Services list' })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('input[type="number"]').first()).toHaveValue('6');
  await page.goto('/ko/admin-builder/cms?collectionId=service-areas', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-cms-source-collection-focus="service-areas"]')).toBeVisible({ timeout: 30_000 });
  const refreshedSourceFocusCard = page.locator('[data-cms-source-collection-focus="service-areas"]');
  await Promise.all([
    page.waitForURL(/\/ko\/builder\/collections\/service-areas/),
    refreshedSourceFocusCard.locator('[data-cms-source-inventory-link="service-areas"]').click({ force: true }),
  ]);
  await expect(page.getByText('Service areas collection', { exact: true })).toBeVisible({ timeout: 30_000 });
  await page.goto('/ko/builder/collections/service-areas', {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.locator('aside[aria-label="빌더 탐색"]')).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Seed all defaults and open first editor' }).click();

  await expect(page.getByRole('heading', { name: 'Services list' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByLabel(/^Collection/)).toHaveValue('service-areas');
  await expect(page).toHaveURL(/\/ko\/builder\/home\/datasets\?targetId=home\.services\.list/);

  await page.goto('/zh-hant/builder/collections/service-areas', {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.locator('aside[aria-label="建構器導覽"]')).toBeVisible({ timeout: 30_000 });
});
