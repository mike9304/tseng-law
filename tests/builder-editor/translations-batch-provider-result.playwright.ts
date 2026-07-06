import { expect, test, type Page } from '@playwright/test';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { getTranslationCopy } from '@/components/builder/translations/translation-copy';
import { emitBatchStreamResult } from './helpers/translations-batch-stream';

function seededBatchSite(token: string, title: string) {
  const site = createDefaultSiteDocument('ko', 'default');
  const now = new Date().toISOString();
  const pageId = `translation-batch-provider-result-page-${token}`;
  site.navigation = [];
  site.translations = [];
  site.pages = [{
    pageId,
    slug: `translation-batch-provider-result-${token}`,
    title: { ko: title, en: '', 'zh-hant': '' },
    locale: 'ko',
    createdAt: now,
    updatedAt: now,
  }];
  return { site, pageId };
}

async function installProviderResultBatchStream(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof Request
          ? input.url
          : input.toString();
      if (!url.includes('/api/builder/translations/translate-batch/stream')) {
        return originalFetch(input, init);
      }

      const bodyText = typeof init?.body === 'string' ? init.body : '{}';
      const parsed = JSON.parse(bodyText);
      const firstEntry = parsed.entries[0];
      const encoder = new TextEncoder();
      let streamController: ReadableStreamDefaultController<Uint8Array> | null = null;
      const providerResult = `event: progress\ndata: ${JSON.stringify({
        type: 'progress',
        sequence: 1,
        summary: {
          provider: 'mock',
          mode: 'native-batch',
          requested: 1,
          succeeded: 1,
          failed: 0,
          step: {
            name: 'provider-result',
            provider: 'mock',
            mode: 'native-batch',
            requested: 1,
            cached: 0,
            sent: 1,
            succeeded: 1,
            failed: 0,
            durationMs: 84,
          },
        },
      })}\n\n`;

      Reflect.set(window, '__emitTranslationStreamResult', () => {
        if (!streamController) throw new Error('Translation stream controller is not ready');
        streamController.enqueue(encoder.encode(
          `event: result\ndata: ${JSON.stringify({
            type: 'result',
            sequence: 2,
            payload: {
              ok: true,
              results: [{ key: firstEntry.key, ok: true, text: `Stream translated ${firstEntry.sourceText}` }],
              summary: { provider: 'mock', mode: 'native-batch', requested: 1, succeeded: 1, failed: 0 },
            },
          })}\n\n`,
        ));
        streamController.close();
      });

      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          streamController = controller;
          controller.enqueue(encoder.encode(providerResult));
        },
      });

      return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      });
    };
  });
}

test('/ko/admin-builder/translations shows provider-result telemetry before final stream results arrive', async ({ page }) => {
  const originalSite = await readSiteDocument('default', 'ko');
  const token = Date.now().toString(36);
  const title = `Batch Provider Result Source ${token}`;
  const copy = getTranslationCopy('ko');
  const seeded = seededBatchSite(token, title);

  try {
    await writeSiteDocument(seeded.site, { preserveNextPageIds: [seeded.pageId] });
    await installProviderResultBatchStream(page);

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
    await expect(progress).toContainText('단계 provider-result');
    await expect(progress).toContainText('성공 1/1');
    await expect(progress).toContainText('응답 84ms');

    await emitBatchStreamResult(page);
    await expect(row.getByLabel('translated')).toBeVisible();
  } finally {
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});
