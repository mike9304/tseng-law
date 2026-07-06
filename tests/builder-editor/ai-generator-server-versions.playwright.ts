import { expect, test } from '@playwright/test';

const LOCALE = 'ko';
const AI_GENERATE_TIMEOUT_MS = 30_000;
const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('/ko/admin-builder/ai-generator lists, diffs, and restores server intake versions', async ({ page }) => {
  test.setTimeout(90_000);
  const runId = Date.now().toString(36);
  const siteId = `f85-ledger-${runId}`;
  const firstCompany = `F85 Ledger One ${runId}`;
  const secondCompany = `F85 Ledger Two ${runId}`;

  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.addInitScript((historyKey) => {
    window.localStorage.removeItem(historyKey);
  }, `builder-ai-generator-history:${LOCALE}`);
  await page.goto(`/${LOCALE}/admin-builder/ai-generator?siteId=${siteId}`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-ai-generator-server-versions]')).toBeVisible();

  await page.getByRole('button', { name: /브랜드/ }).click();
  await page.getByLabel('회사명').fill(firstCompany);
  await page.getByRole('button', { name: /스타일/ }).click();
  await page.locator('[data-ai-generator-generate]').click();
  await expect(page.locator('[data-ai-generator-sitemap]')).toBeVisible({ timeout: AI_GENERATE_TIMEOUT_MS });
  await expect(page.locator('[data-ai-generator-server-versions]')).toContainText(firstCompany);

  await page.getByRole('button', { name: /브랜드/ }).click();
  await page.getByLabel('회사명').fill(secondCompany);
  await page.getByRole('button', { name: /스타일/ }).click();
  await page.locator('[data-ai-generator-generate]').click();
  await expect(page.locator('[data-ai-generator-sitemap]')).toBeVisible({ timeout: AI_GENERATE_TIMEOUT_MS });
  await expect(page.locator('[data-ai-generator-server-versions]')).toContainText(secondCompany);

  const serverVersions = page.locator('[data-ai-generator-server-version-id]');
  await expect(serverVersions).toHaveCount(2);
  const latestVersion = serverVersions.first();
  const previousVersion = serverVersions.nth(1);
  await latestVersion.locator('[data-ai-generator-server-version-diff]').click();
  await expect(page.locator('[data-ai-generator-server-version-diff-panel]')).toBeVisible();
  await expect(page.locator('[data-ai-generator-server-version-diff-panel]')).toContainText('companyName');
  await expect(page.locator('[data-ai-generator-server-version-diff-panel]')).toContainText(firstCompany);
  await expect(page.locator('[data-ai-generator-server-version-diff-panel]')).toContainText(secondCompany);

  await previousVersion.locator('[data-ai-generator-server-version-restore]').click();
  await expect(page.locator('[data-ai-generator-server-versions]')).toContainText('서버 버전을 복원했습니다');
  await page.getByRole('button', { name: /브랜드/ }).click();
  await expect(page.getByLabel('회사명')).toHaveValue(firstCompany);
});
