import { expect, test } from '@playwright/test';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { getTranslationCopy } from '@/components/builder/translations/translation-copy';
import {
  emitBatchStreamProgress,
  emitBatchStreamResult,
  fulfillBatchStreamWithMockResult,
  installControlledBatchStream,
  installOutOfOrderBatchStream,
} from './helpers/translations-batch-stream';

function seededBatchSite(token: string, title: string) {
  const site = createDefaultSiteDocument('ko', 'default');
  const now = new Date().toISOString();
  const pageId = `translation-batch-page-${token}`;
  site.navigation = [];
  site.translations = [];
  site.pages = [
    {
      pageId,
      slug: `translation-batch-${token}`,
      title: {
        ko: title,
        en: '',
        'zh-hant': '',
      },
      locale: 'ko',
      createdAt: now,
      updatedAt: now,
    },
  ];
  return { site, pageId };
}

test.describe('/ko/admin-builder/translations batch provider route', () => {
  let originalSite: Awaited<ReturnType<typeof readSiteDocument>> | null = null;

  test.beforeEach(async () => {
    originalSite = await readSiteDocument('default', 'ko');
  });

  test.afterEach(async () => {
    if (originalSite) {
      await writeSiteDocument(originalSite).catch(() => undefined);
      originalSite = null;
    }
  });

  test('translates missing entries through the batch action and persists the result', async ({ page }) => {
    const token = Date.now().toString(36);
    const title = `Batch Translation Source ${token}`;
    const copy = getTranslationCopy('ko');
    const seeded = seededBatchSite(token, title);
    await writeSiteDocument(seeded.site, { preserveNextPageIds: [seeded.pageId] });
    await fulfillBatchStreamWithMockResult(page);

    await page.goto(
      `/ko/admin-builder/translations?sourceLocale=ko&target=en&search=${encodeURIComponent(title)}`,
      { waitUntil: 'domcontentloaded' },
    );

    const row = page.locator('tr', { hasText: title }).first();
    await expect(row).toBeVisible();
    await expect(row.getByLabel('missing')).toBeVisible();

    await page.getByRole('button', { name: copy.managerAiTranslateMissing('en', 1) }).click();

    await expect(row.getByLabel('translated')).toBeVisible();
    await expect(page.locator('body')).toContainText(copy.managerAiTranslatedBatch(1, 1, 'en'));
  });

  test('shows batch progress while translations are still running', async ({ page }) => {
    const token = Date.now().toString(36);
    const title = `Batch Progress Source ${token}`;
    const copy = getTranslationCopy('ko');
    const seeded = seededBatchSite(token, title);
    await writeSiteDocument(seeded.site, { preserveNextPageIds: [seeded.pageId] });

    let releaseSave: () => void = () => undefined;
    const saveGate = new Promise<void>((resolve) => {
      releaseSave = resolve;
    });

    await installControlledBatchStream(page, false);
    await page.route('**/api/builder/translations', async (route) => {
      if (route.request().method() !== 'PATCH') {
        await route.continue();
        return;
      }
      await saveGate;
      await route.continue();
    });

    await page.goto(
      `/ko/admin-builder/translations?sourceLocale=ko&target=en&search=${encodeURIComponent(title)}`,
      { waitUntil: 'domcontentloaded' },
    );

    const row = page.locator('tr', { hasText: title }).first();
    const batchButton = page.getByRole('button', { name: copy.managerAiTranslateMissing('en', 1) });
    await expect(row).toBeVisible();

    await batchButton.click();

    const progress = page.locator('[data-translation-batch-progress="true"]');
    await expect(progress).toBeVisible();
    await expect(progress).toContainText('en 번역 요청 중 1개');
    await expect(batchButton).toBeDisabled();
    await page.screenshot({ path: '/private/tmp/translations-batch-progress-ko.png', fullPage: true });

    await emitBatchStreamProgress(page);
    await emitBatchStreamResult(page);
    await expect(progress).toContainText('제공자 mock');
    await expect(progress).toContainText('native-batch');
    await expect(progress).toContainText('성공 1/1');
    await page.screenshot({ path: '/private/tmp/translations-batch-telemetry-ko.png', fullPage: true });
    releaseSave();
    await expect(row.getByLabel('translated')).toBeVisible();
  });

  test('shows provider telemetry from the live batch stream before final results arrive', async ({ page }) => {
    const token = Date.now().toString(36);
    const title = `Batch Stream Source ${token}`;
    const copy = getTranslationCopy('ko');
    const seeded = seededBatchSite(token, title);
    await writeSiteDocument(seeded.site, { preserveNextPageIds: [seeded.pageId] });
    await installControlledBatchStream(page, true);

    await page.goto(
      `/ko/admin-builder/translations?sourceLocale=ko&target=en&search=${encodeURIComponent(title)}`,
      { waitUntil: 'domcontentloaded' },
    );

    const row = page.locator('tr', { hasText: title }).first();
    const batchButton = page.getByRole('button', { name: copy.managerAiTranslateMissing('en', 1) });
    await expect(row).toBeVisible();

    await batchButton.click();

    const progress = page.locator('[data-translation-batch-progress="true"]');
    await expect(progress).toBeVisible();
    await expect(progress).toContainText('제공자 mock');
    await expect(progress).toContainText('성공 0/1');
    await expect(progress).toContainText('단계 provider-request');
    await expect(progress).toContainText('요청 1');
    await expect(progress).toContainText('응답 42ms');
    await page.screenshot({ path: '/private/tmp/translations-batch-live-telemetry-ko.png', fullPage: true });

    await emitBatchStreamResult(page);
    await expect(row.getByLabel('translated')).toBeVisible();
  });

  test('keeps newer provider telemetry when an older stream frame arrives late', async ({ page }) => {
    const token = Date.now().toString(36);
    const title = `Batch Stream Ordered Source ${token}`;
    const copy = getTranslationCopy('ko');
    const seeded = seededBatchSite(token, title);
    await writeSiteDocument(seeded.site, { preserveNextPageIds: [seeded.pageId] });
    await installOutOfOrderBatchStream(page);

    await page.goto(
      `/ko/admin-builder/translations?sourceLocale=ko&target=en&search=${encodeURIComponent(title)}`,
      { waitUntil: 'domcontentloaded' },
    );

    const row = page.locator('tr', { hasText: title }).first();
    const batchButton = page.getByRole('button', { name: copy.managerAiTranslateMissing('en', 1) });
    await expect(row).toBeVisible();

    await batchButton.click();

    const progress = page.locator('[data-translation-batch-progress="true"]');
    await expect(progress).toBeVisible();
    await expect(progress).toContainText('단계 provider-response');
    await expect(progress).toContainText('성공 1/1');
    await expect(progress).not.toContainText('성공 0/1');

    await emitBatchStreamResult(page);
    await expect(row.getByLabel('translated')).toBeVisible();
  });
});
