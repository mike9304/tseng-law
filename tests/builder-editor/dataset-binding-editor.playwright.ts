import { expect, test } from '@playwright/test';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseRequestJson(raw: string | null): unknown {
  if (!raw) throw new Error('request_body_missing');
  const parsed: unknown = JSON.parse(raw);
  return parsed;
}

const DEFAULT_SITE_ID = 'tseng-law-main-site';
const DEFAULT_BASIC_AUTH_USERNAME = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
const DEFAULT_BASIC_AUTH_PASSWORD =
  process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';

function buildBasicAuthUrl(baseURL: string | undefined, pathname: string): string {
  const url = new URL(pathname, baseURL ?? process.env.BASE_URL ?? 'http://127.0.0.1:3000');
  url.username = DEFAULT_BASIC_AUTH_USERNAME;
  url.password = DEFAULT_BASIC_AUTH_PASSWORD;
  return url.toString();
}

test('/ko/builder dataset binding editor preserves draft state per target', async ({ page }) => {
  test.setTimeout(60_000);

  const filters = JSON.stringify([{ fieldId: 'title', operator: 'contains', value: 'law' }]);
  const sort = JSON.stringify([{ fieldId: 'title', direction: 'asc' }]);
  const initialSearch = new URLSearchParams({
    targetId: 'home.services.list',
    limit: '9',
    filters,
    sort,
  });

  await page.goto(`/ko/builder/home/datasets?${initialSearch.toString()}`, {
    waitUntil: 'domcontentloaded',
  });

  await expect(page.getByRole('heading', { name: 'Services list' })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('input[type="number"]').first()).toHaveValue('9');
  await expect(page.getByLabel('Filter 1 field')).toHaveValue('title');
  await expect(page.getByLabel('Filter 1 operator')).toHaveValue('contains');
  await expect(page.getByLabel('Filter 1 value')).toHaveValue('law');
  await expect(page.getByLabel('Sort 1 field')).toHaveValue('title');
  await expect(page.getByLabel('Sort 1 direction')).toHaveValue('asc');
  await expect(page).toHaveURL(/targetId=home\.services\.list/);
  await expect(page).toHaveURL(/limit=9/);
  await expect(page).toHaveURL(/filters=/);
  await expect(page).toHaveURL(/sort=/);

  await page.getByRole('button', { name: 'Insights feed' }).click();

  await expect(page.getByRole('heading', { name: 'Insights feed' })).toBeVisible();
  await expect(page.getByLabel(/^Collection/)).toHaveValue('columns');
  await expect(page.locator('input[type="number"]').first()).toHaveValue('4');
  await expect(page).toHaveURL(/targetId=home\.insights\.feed/);
  await expect(page).not.toHaveURL(/filters=/);
  await expect(page).not.toHaveURL(/sort=/);

  await page.locator('input[type="number"]').first().fill('8');

  await expect(page).toHaveURL(/limit=8/);
  await expect(page).not.toHaveURL(/filters=/);
  await expect(page).not.toHaveURL(/sort=/);

  await page.getByRole('button', { name: 'Insights feed' }).click();

  await expect(page.getByRole('heading', { name: 'Insights feed' })).toBeVisible();
  await expect(page).toHaveURL(/targetId=home\.insights\.feed/);

  await page.getByRole('button', { name: 'Services list' }).click();

  await expect(page.getByRole('heading', { name: 'Services list' })).toBeVisible();
  await expect(page.locator('input[type="number"]').first()).toHaveValue('9');
  await expect(page.getByLabel('Filter 1 field')).toHaveValue('title');
  await expect(page.getByLabel('Filter 1 operator')).toHaveValue('contains');
  await expect(page.getByLabel('Filter 1 value')).toHaveValue('law');
  await expect(page.getByLabel('Sort 1 field')).toHaveValue('title');
  await expect(page.getByLabel('Sort 1 direction')).toHaveValue('asc');
  await expect(page).toHaveURL(/targetId=home\.services\.list/);
  await expect(page).toHaveURL(/limit=9/);
  await expect(page).toHaveURL(/filters=/);
  await expect(page).toHaveURL(/sort=/);

  await page.getByRole('button', { name: 'Insights feed' }).click();

  await expect(page.getByRole('heading', { name: 'Insights feed' })).toBeVisible();
  await page.getByLabel('Copy binding from').selectOption('home.services.list');
  await page.getByRole('button', { name: 'Copy draft' }).click();

  await expect(page.getByRole('status')).toContainText('Copied from Services list.');
  await expect(page.locator('input[type="number"]').first()).toHaveValue('9');
  await expect(page.getByLabel('Filter 1 field')).toHaveValue('title');
  await expect(page.getByLabel('Filter 1 operator')).toHaveValue('contains');
  await expect(page.getByLabel('Filter 1 value')).toHaveValue('law');
  await expect(page.getByLabel('Sort 1 field')).toHaveValue('title');
  await expect(page.getByLabel('Sort 1 direction')).toHaveValue('asc');
  await expect(page).toHaveURL(/targetId=home\.insights\.feed/);
  await expect(page).toHaveURL(/limit=9/);
  await expect(page).toHaveURL(/filters=/);
  await expect(page).toHaveURL(/sort=/);
  await expect(page).toHaveURL(/copyFromTargetId=home\.services\.list/);

  await page.goto('/ko/builder/home/datasets?targetId=home.services.list', {
    waitUntil: 'domcontentloaded',
  });

  await expect(page.getByRole('heading', { name: 'Services list' })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('input[type="number"]').first()).toHaveValue('9');
  await expect(page.getByLabel('Filter 1 field')).toHaveValue('title');
  await expect(page.getByLabel('Filter 1 operator')).toHaveValue('contains');
  await expect(page.getByLabel('Filter 1 value')).toHaveValue('law');
  await expect(page.getByLabel('Sort 1 field')).toHaveValue('title');
  await expect(page.getByLabel('Sort 1 direction')).toHaveValue('asc');
  await expect(page).toHaveURL(/targetId=home\.services\.list/);
  await expect(page).toHaveURL(/filters=/);
  await expect(page).toHaveURL(/sort=/);
  await expect(page).not.toHaveURL(/copyFromTargetId=/);
});

test('/ko/builder dataset binding editor sends expected revision on save and seed', async ({ page }) => {
  test.setTimeout(60_000);

  const overviewResponse = await page.request.get(`/api/builder/sites/${DEFAULT_SITE_ID}/pages/home/datasets?locale=ko`);
  const overviewPayload: unknown = await overviewResponse.json();
  if (!overviewResponse.ok() || !isRecord(overviewPayload) || typeof overviewPayload.revision !== 'number' || !Array.isArray(overviewPayload.targets)) {
    throw new Error('dataset_overview_revision_missing');
  }
  const initialRevision = overviewPayload.revision;
  const targets = overviewPayload.targets;
  let savePayload: unknown;
  let seedPayload: unknown;

  await page.route(`**/api/builder/sites/${DEFAULT_SITE_ID}/pages/home/datasets?locale=ko`, async (route) => {
    if (route.request().method() !== 'PUT') {
      await route.continue();
      return;
    }
    savePayload = parseRequestJson(route.request().postData());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, revision: initialRevision + 1, targets }),
    });
  });
  await page.route(`**/api/builder/sites/${DEFAULT_SITE_ID}/pages/home/datasets/seed?locale=ko`, async (route) => {
    seedPayload = parseRequestJson(route.request().postData());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, revision: initialRevision + 2, targets }),
    });
  });

  await page.goto('/ko/builder/home/datasets?targetId=home.services.list', {
    waitUntil: 'domcontentloaded',
  });

  await expect(page.getByRole('heading', { name: 'Services list' })).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Save binding' }).click();
  await expect(page.getByRole('status')).toContainText('Dataset binding saved.');
  if (!isRecord(savePayload)) throw new Error('save_payload_missing');
  expect(savePayload.expectedRevision).toBe(initialRevision);

  await page.getByRole('button', { name: 'Seed defaults and save' }).click();
  await expect(page.getByRole('status')).toContainText('Default binding seeded.');
  if (!isRecord(seedPayload)) throw new Error('seed_payload_missing');
  expect(seedPayload.expectedRevision).toBe(initialRevision + 1);
});

test('/ko/builder dataset binding preview works from a basic-auth URL', async ({ page, baseURL }) => {
  test.setTimeout(60_000);

  await page.goto(buildBasicAuthUrl(baseURL, '/ko/builder/home/datasets?targetId=home.services.list'), {
    waitUntil: 'domcontentloaded',
  });

  await expect(page.getByRole('heading', { name: 'Services list' })).toBeVisible({ timeout: 30_000 });
  const preview = page.locator('.builder-dataset-binding-preview');
  await expect.poll(async () => preview.innerText(), {
    timeout: 10_000,
  }).toMatch(/Showing \d+ preview records?|Failed to execute|Request cannot/);
  await expect(preview).not.toContainText(/Request cannot be constructed from a URL that includes credentials/);
  await expect(preview).not.toContainText(/Failed to execute 'fetch'/);
});

test('/ko/builder page diagnostics can open the dataset editor with a copied draft', async ({ page }) => {
  test.setTimeout(60_000);

  await page.goto('/ko/builder/home/datasets?targetId=home.services.list', {
    waitUntil: 'domcontentloaded',
  });

  await expect(page.getByRole('heading', { name: 'Services list' })).toBeVisible({ timeout: 30_000 });
  await page.locator('input[type="number"]').first().fill('8');
  await page.getByRole('button', { name: 'Add filter' }).click();
  await page.getByLabel('Filter 1 field').selectOption('title');
  await page.getByLabel('Filter 1 operator').selectOption('contains');
  await page.getByLabel('Filter 1 value').fill('law');
  await page.getByRole('button', { name: 'Add sort' }).click();
  await page.getByLabel('Sort 1 field').selectOption('title');
  await page.getByLabel('Sort 1 direction').selectOption('asc');

  await expect(page).toHaveURL(/targetId=home\.services\.list/);
  await expect(page).toHaveURL(/limit=8/);
  await expect(page).toHaveURL(/filters=/);
  await expect(page).toHaveURL(/sort=/);

  await page.goto('/ko/builder/home?mode=edit', { waitUntil: 'domcontentloaded' });

  await page.locator('summary').getByText(/^Page diagnostics$|^페이지 진단$/).click();
  const seam = page.locator('[data-builder-dataset-seam="home.insights.feed"]');
  await expect(seam).toBeVisible({ timeout: 30_000 });
  await expect(seam.locator('[data-builder-dataset-seam-primary-link="home.insights.feed"]')).toHaveAttribute(
    'href',
    /\/ko\/builder\/home\/datasets\?targetId=home\.insights\.feed/,
  );
  await Promise.all([
    page.waitForURL(/\/ko\/builder\/home\/datasets\?targetId=home\.insights\.feed/, { waitUntil: 'domcontentloaded' }),
    seam.locator('[data-builder-dataset-seed-target="home.insights.feed"]').click(),
  ]);
  await expect(page.getByRole('heading', { name: 'Insights feed' })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('input[type="number"]').first()).toHaveValue('4');
  await page.goto('/ko/builder/home?mode=edit', { waitUntil: 'domcontentloaded' });
  await page.locator('summary').getByText(/^Page diagnostics$|^페이지 진단$/).click();
  await expect(page.locator('[data-builder-dataset-seam="home.insights.feed"]')).toBeVisible({ timeout: 30_000 });
  const seamAfterReturn = page.locator('[data-builder-dataset-seam="home.insights.feed"]');
  await expect(seamAfterReturn.locator('[data-builder-dataset-seam-primary-link="home.insights.feed"]')).toHaveAttribute(
    'href',
    /\/ko\/builder\/home\/datasets\?targetId=home\.insights\.feed/,
  );
  await seamAfterReturn.getByRole('link', { name: 'Services list' }).click();

  await expect(page.getByRole('heading', { name: 'Insights feed' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByLabel(/^Collection/)).toHaveValue('columns');
  await expect(page.locator('input[type="number"]').first()).toHaveValue('4');
  await expect(page).toHaveURL(/targetId=home\.insights\.feed/);
  await expect(page).toHaveURL(/copyFromTargetId=home\.services\.list/);
});
