import { expect, test } from '@playwright/test';
import { z } from 'zod';
import { mutationHeaders } from './helpers/cms-source-inline';

const serviceSourcePayloadSchema = z.object({
  ok: z.boolean().optional(),
  record: z.object({
    intro: z.object({ ko: z.string().optional() }).optional(),
    keyPoints: z.object({ ko: z.array(z.string()).optional() }).optional(),
    columnSlugs: z.array(z.string()).optional(),
  }).optional(),
  error: z.string().optional(),
});

test('/ko/admin-builder/services edits service details and related columns from the source editor', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `service-source-details-${token}`;
  const sourceRecordId = 'investment';
  const updatedIntro = `Service source intro ${token}: 전용 서비스 source editor에서 소개 문단을 저장했습니다.`;
  const updatedKeyPoints = [`전용 source 핵심 ${token}`, `관계형 칼럼 저장 ${token}`];
  const keptColumnSlug = 'taiwan-company-establishment-basics';
  const clearedColumnSlug = 'taiwan-company-subsidiary-vs-branch';
  const bulkAddedColumnSlug = 'taiwan-overtaking-accident-liability';

  try {
    await page.request.delete(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-service-source-manager]')).toBeVisible({ timeout: 30_000 });
    await page.locator(`[data-service-source-row="${sourceRecordId}"]`).click();

    const keyPointsInput = page.locator('[data-service-source-key-points-input]');
    await expect(keyPointsInput).toBeVisible();
    await expect(keyPointsInput).toHaveValue(/법인 형태는 자회사/);

    const relationSearch = page.locator('[data-service-source-column-search]');
    await expect(relationSearch).toBeVisible();
    const selectedColumns = page.locator('[data-service-source-selected-columns]');
    await expect(selectedColumns.locator(`[data-service-source-selected-column="${clearedColumnSlug}"]`)).toBeVisible();
    await page.locator('[data-service-source-selected-only]').check();
    await relationSearch.fill('subsidiary');
    await expect(page.locator(`[data-service-source-column="${clearedColumnSlug}"]`)).toBeVisible();
    await expect(page.locator(`[data-service-source-column="${keptColumnSlug}"]`)).toHaveCount(0);
    const clearSelectedButton = page.locator('[data-service-source-selected-clear]');
    const undoClearButton = page.locator('[data-service-source-selected-undo]');
    await expect(clearSelectedButton).toBeEnabled();
    await expect(undoClearButton).toBeDisabled();
    await clearSelectedButton.click();
    await expect(selectedColumns.locator(`[data-service-source-selected-column="${clearedColumnSlug}"]`)).toHaveCount(0);
    await expect(page.locator(`[data-service-source-column="${clearedColumnSlug}"]`)).toHaveCount(0);
    await expect(undoClearButton).toBeEnabled();
    await undoClearButton.click();
    await expect(selectedColumns.locator(`[data-service-source-selected-column="${clearedColumnSlug}"]`)).toBeVisible();
    await expect(page.locator(`[data-service-source-column="${clearedColumnSlug}"]`)).toBeVisible();
    await selectedColumns.locator(`[data-service-source-selected-column-remove="${clearedColumnSlug}"]`).click();
    await expect(selectedColumns.locator(`[data-service-source-selected-column="${clearedColumnSlug}"]`)).toHaveCount(0);
    await page.locator('[data-service-source-selected-only]').uncheck();
    await relationSearch.fill('overtaking');
    const bulkAddedColumn = page.locator(`[data-service-source-column="${bulkAddedColumnSlug}"]`);
    await expect(bulkAddedColumn).toBeVisible();
    await expect(bulkAddedColumn).not.toBeChecked();
    const selectShownButton = page.locator('[data-service-source-select-shown]');
    const clearShownButton = page.locator('[data-service-source-clear-shown]');
    await expect(selectShownButton).toBeEnabled();
    await expect(selectShownButton).toHaveAttribute('aria-keyshortcuts', 'Alt+S');
    await expect(clearShownButton).toBeDisabled();
    await relationSearch.focus();
    await page.keyboard.press('Alt+S');
    await expect(bulkAddedColumn).toBeChecked();
    await expect(selectedColumns.locator(`[data-service-source-selected-column="${bulkAddedColumnSlug}"]`)).toBeVisible();
    await expect(clearShownButton).toBeEnabled();
    await expect(clearShownButton).toHaveAttribute('aria-keyshortcuts', 'Alt+C');
    await page.keyboard.press('Alt+C');
    await expect(bulkAddedColumn).not.toBeChecked();
    await expect(selectedColumns.locator(`[data-service-source-selected-column="${bulkAddedColumnSlug}"]`)).toHaveCount(0);
    await expect(undoClearButton).toBeEnabled();
    await expect(undoClearButton).toHaveAttribute('aria-keyshortcuts', 'Alt+U');
    await page.keyboard.press('Alt+U');
    await expect(bulkAddedColumn).toBeChecked();
    await expect(selectedColumns.locator(`[data-service-source-selected-column="${bulkAddedColumnSlug}"]`)).toBeVisible();
    await relationSearch.focus();
    await page.keyboard.press('Escape');
    await expect(relationSearch).toHaveValue('');

    await page.locator('[data-service-source-intro-input]').fill(updatedIntro);
    await keyPointsInput.fill(updatedKeyPoints.join('\n'));
    await page.locator('[data-service-source-save]').click();
    await expect(page.locator('[data-service-source-status]')).toContainText('Saved.', { timeout: 30_000 });

    const serviceResponse = await page.request.get(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(serviceResponse.status()).toBe(200);
    const servicePayload = serviceSourcePayloadSchema.parse(await serviceResponse.json());
    expect(servicePayload.ok, servicePayload.error).toBe(true);
    expect(servicePayload.record?.intro?.ko).toBe(updatedIntro);
    expect(servicePayload.record?.keyPoints?.ko).toEqual(updatedKeyPoints);
    expect(servicePayload.record?.columnSlugs).toContain(keptColumnSlug);
    expect(servicePayload.record?.columnSlugs).toContain(bulkAddedColumnSlug);
    expect(servicePayload.record?.columnSlugs).not.toContain(clearedColumnSlug);
  } finally {
    await page.request.delete(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
      failOnStatusCode: false,
    }).catch(() => undefined);
  }
});
