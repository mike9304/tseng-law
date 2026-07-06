import { expect, test } from '@playwright/test';
import { z } from 'zod';
import { mutationHeaders } from './helpers/cms-source-inline';

const serviceSourcePayloadSchema = z.object({
  ok: z.boolean().optional(),
  record: z.object({
    columnSlugs: z.array(z.string()).optional(),
  }).optional(),
  error: z.string().optional(),
});

test('/ko/admin-builder/cms filters and saves service source related columns inline', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `cms-source-relation-${token}`;
  const sourceRecordId = 'civil';
  const visibleColumnSlug = 'taiwan-overtaking-accident-liability';
  const hiddenColumnSlug = 'taiwan-traffic-accident-procedure';
  const unselectedColumnSlug = 'taiwan-company-establishment-basics';

  try {
    await page.request.delete(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/cms?collectionId=service-areas', { waitUntil: 'domcontentloaded' });

    const servicesRecordPreview = page.locator('[data-cms-source-record-preview="service-areas"]').first();
    await expect(servicesRecordPreview).toBeVisible({ timeout: 30_000 });
    const serviceSourceRow = servicesRecordPreview.locator(`[data-cms-source-record-row="${sourceRecordId}"]`);
    await expect(serviceSourceRow).toBeVisible();

    await serviceSourceRow.locator('[data-cms-source-record-inline-edit]').click();
    const inlineEditor = serviceSourceRow.locator('[data-cms-source-record-inline-editor]');
    await expect(inlineEditor).toBeVisible();

    const relationSearch = inlineEditor.locator('[data-cms-source-record-inline-column-search]');
    await expect(relationSearch).toBeVisible();
    const selectedColumns = inlineEditor.locator('[data-cms-source-record-inline-selected-columns]');
    await expect(selectedColumns).toBeVisible();
    await expect(selectedColumns.locator(`[data-cms-source-record-inline-selected-column="${hiddenColumnSlug}"]`)).toBeVisible();
    const selectedOnlyToggle = inlineEditor.locator('[data-cms-source-record-inline-selected-only]');
    await expect(selectedOnlyToggle).toBeVisible();
    await selectedOnlyToggle.check();
    await expect(inlineEditor.locator(`[data-cms-source-record-inline-column="${hiddenColumnSlug}"]`)).toBeVisible();
    await expect(inlineEditor.locator(`[data-cms-source-record-inline-column="${unselectedColumnSlug}"]`)).toHaveCount(0);
    const clearSelectedButton = inlineEditor.locator('[data-cms-source-record-inline-clear-selected]');
    await expect(clearSelectedButton).toBeVisible();
    await clearSelectedButton.click();
    await expect(selectedColumns.locator('[data-cms-source-record-inline-selected-column]')).toHaveCount(0);
    await expect(inlineEditor.locator('[data-cms-source-record-inline-column-picker]')).toContainText(
      'Select related columns to show them here.',
    );
    const undoClearButton = inlineEditor.locator('[data-cms-source-record-inline-undo-clear]');
    await expect(undoClearButton).toBeVisible();
    await undoClearButton.click();
    await expect(selectedColumns.locator(`[data-cms-source-record-inline-selected-column="${hiddenColumnSlug}"]`)).toBeVisible();
    await expect(inlineEditor.locator(`[data-cms-source-record-inline-column="${hiddenColumnSlug}"]`)).toBeVisible();
    await relationSearch.fill('overtaking');

    const visibleColumn = inlineEditor.locator(`[data-cms-source-record-inline-column="${visibleColumnSlug}"]`);
    await expect(visibleColumn).toBeVisible();
    await expect(inlineEditor.locator(`[data-cms-source-record-inline-column="${hiddenColumnSlug}"]`)).toHaveCount(0);
    await expect(visibleColumn).toBeChecked();
    await inlineEditor.locator('[data-cms-source-record-inline-column-search-clear]').click();
    await expect(relationSearch).toHaveValue('');
    await expect(inlineEditor.locator(`[data-cms-source-record-inline-column="${hiddenColumnSlug}"]`)).toBeVisible();
    const clearSelectedAfterSearchButton = inlineEditor.locator('[data-cms-source-record-inline-selected-clear]');
    const undoClearAfterSearchButton = inlineEditor.locator('[data-cms-source-record-inline-selected-undo]');
    await expect(clearSelectedAfterSearchButton).toBeEnabled();
    await expect(undoClearAfterSearchButton).toBeDisabled();
    await clearSelectedAfterSearchButton.click();
    await expect(selectedColumns.locator(`[data-cms-source-record-inline-selected-column="${hiddenColumnSlug}"]`)).toHaveCount(0);
    await expect(inlineEditor.locator(`[data-cms-source-record-inline-column="${hiddenColumnSlug}"]`)).toHaveCount(0);
    await expect(undoClearAfterSearchButton).toBeEnabled();
    await undoClearAfterSearchButton.click();
    await expect(selectedColumns.locator(`[data-cms-source-record-inline-selected-column="${hiddenColumnSlug}"]`)).toBeVisible();
    await expect(inlineEditor.locator(`[data-cms-source-record-inline-column="${hiddenColumnSlug}"]`)).toBeVisible();
    await selectedOnlyToggle.uncheck();
    await relationSearch.fill('company-establishment-basics');
    const unselectedColumn = inlineEditor.locator(`[data-cms-source-record-inline-column="${unselectedColumnSlug}"]`);
    await expect(unselectedColumn).toBeVisible();
    await expect(unselectedColumn).not.toBeChecked();
    const selectShownButton = inlineEditor.locator('[data-cms-source-record-inline-select-shown]');
    const clearShownButton = inlineEditor.locator('[data-cms-source-record-inline-clear-shown]');
    await expect(selectShownButton).toBeEnabled();
    await expect(selectShownButton).toHaveAttribute('aria-keyshortcuts', 'Alt+S');
    await expect(clearShownButton).toBeDisabled();
    await relationSearch.focus();
    await page.keyboard.press('Alt+S');
    await expect(unselectedColumn).toBeChecked();
    await expect(selectedColumns.locator(`[data-cms-source-record-inline-selected-column="${unselectedColumnSlug}"]`)).toBeVisible();
    await expect(clearShownButton).toBeEnabled();
    await expect(clearShownButton).toHaveAttribute('aria-keyshortcuts', 'Alt+C');
    await page.keyboard.press('Alt+C');
    await expect(unselectedColumn).not.toBeChecked();
    await expect(selectedColumns.locator(`[data-cms-source-record-inline-selected-column="${unselectedColumnSlug}"]`)).toHaveCount(0);
    await expect(undoClearAfterSearchButton).toBeEnabled();
    await expect(undoClearAfterSearchButton).toHaveAttribute('aria-keyshortcuts', 'Alt+U');
    await page.keyboard.press('Alt+U');
    await expect(unselectedColumn).toBeChecked();
    await expect(selectedColumns.locator(`[data-cms-source-record-inline-selected-column="${unselectedColumnSlug}"]`)).toBeVisible();
    await relationSearch.focus();
    await page.keyboard.press('Escape');
    await expect(relationSearch).toHaveValue('');
    await selectedOnlyToggle.check();
    await selectedColumns.locator(`[data-cms-source-record-inline-selected-column-remove="${hiddenColumnSlug}"]`).click();
    await expect(selectedColumns.locator(`[data-cms-source-record-inline-selected-column="${hiddenColumnSlug}"]`)).toHaveCount(0);

    await inlineEditor.getByRole('button', { name: 'Save source record' }).click();
    await expect(inlineEditor).toBeHidden({ timeout: 30_000 });

    const serviceSourceResponse = await page.request.get(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(serviceSourceResponse.status()).toBe(200);
    const serviceSourcePayload = serviceSourcePayloadSchema.parse(await serviceSourceResponse.json());
    expect(serviceSourcePayload.ok, serviceSourcePayload.error).toBe(true);
    expect(serviceSourcePayload.record?.columnSlugs).toContain(visibleColumnSlug);
    expect(serviceSourcePayload.record?.columnSlugs).toContain(unselectedColumnSlug);
    expect(serviceSourcePayload.record?.columnSlugs).not.toContain(hiddenColumnSlug);
  } finally {
    await page.request.delete(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
  }
});
