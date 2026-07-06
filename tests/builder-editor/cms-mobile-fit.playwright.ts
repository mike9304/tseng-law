import { expect, test } from '@playwright/test';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  makeMobileFitCollection,
  makeReferencePickerMobileFitCollection,
  readWidthMetrics,
} from './helpers/cms-mobile-fit';

test('/ko/admin-builder/cms fits the mobile admin viewport', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`/ko/admin-builder/cms?mobileFit=${Date.now().toString(36)}`, {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.locator('[data-cms-content-manager]')).toBeVisible();
  await page.screenshot({
    path: '/private/tmp/tseng-law-cms-mobile-fit.png',
    fullPage: true,
  });

  const metrics = await readWidthMetrics(page);
  expect(metrics.scrollWidth, JSON.stringify(metrics, null, 2)).toBeLessThanOrEqual(metrics.clientWidth + 1);
  expect(metrics.overflowBoxes).toEqual([]);
});

test('/ko/admin-builder/cms collection detail record grid fits the mobile viewport', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const collection = makeMobileFitCollection(token);
  const originalSite = await readSiteDocument('default', 'ko');

  try {
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((item) => item.collectionId !== collection.collectionId),
        collection,
      ],
      updatedAt: new Date().toISOString(),
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.locator('[data-cms-record-grid]')).toBeVisible();
    await expect(page.locator(`[data-cms-record-grid-row-summary="record-${token}"]`)).toBeVisible();
    await page.screenshot({
      path: '/private/tmp/tseng-law-cms-detail-mobile-fit.png',
      fullPage: true,
    });

    const metrics = await readWidthMetrics(page);
    expect(metrics.scrollWidth, JSON.stringify(metrics, null, 2)).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.overflowBoxes).toEqual([]);
  } finally {
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder/cms reference picker dialog fits the mobile viewport', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const { collection, primaryRecordId, secondaryRecordId } = makeReferencePickerMobileFitCollection(token);
  const originalSite = await readSiteDocument('default', 'ko');

  try {
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((item) => item.collectionId !== collection.collectionId),
        collection,
      ],
      updatedAt: new Date().toISOString(),
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      `/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}&recordId=${encodeURIComponent(primaryRecordId)}`,
      { waitUntil: 'domcontentloaded' },
    );
    await expect(page.getByRole('heading', { name: `Edit ${primaryRecordId}` })).toBeVisible();
    await page.getByRole('button', { name: 'Expanded rows' }).click();
    await page.locator(`[data-cms-record-field-edit="${primaryRecordId}:related"]`).click();
    await expect(page.getByRole('button', { name: 'Pick record' })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'Pick record' }).click();

    const picker = page.locator('[data-cms-reference-picker-card="true"]');
    await expect(picker).toBeVisible();
    await expect(picker.locator(`[data-cms-reference-picker-row="${secondaryRecordId}"]`)).toBeVisible();
    await page.screenshot({
      path: '/private/tmp/tseng-law-cms-reference-picker-mobile-fit.png',
    });
    await picker.screenshot({
      path: '/private/tmp/tseng-law-cms-reference-picker-mobile-card.png',
    });

    const pickerBox = await picker.boundingBox();
    if (!pickerBox) {
      throw new Error('Reference picker dialog did not expose a measurable bounding box.');
    }
    const metrics = await readWidthMetrics(page);
    expect(Math.floor(pickerBox.x)).toBeGreaterThanOrEqual(0);
    expect(Math.ceil(pickerBox.x + pickerBox.width)).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.scrollWidth, JSON.stringify(metrics, null, 2)).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.overflowBoxes).toEqual([]);
  } finally {
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});
