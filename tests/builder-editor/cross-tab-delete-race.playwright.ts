import { expect, test, type APIRequestContext } from '@playwright/test';
import { readSiteDocument, writeSiteDocument } from '../../src/lib/builder/site/persistence';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm00-delete-race';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

async function createBlankBuilderPage(
  request: APIRequestContext,
  slug: string,
  title: string,
): Promise<string> {
  let response: Awaited<ReturnType<APIRequestContext['post']>> | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await request.post('/api/builder/site/pages', {
      data: { locale: 'ko', slug, title, blank: true },
      headers: mutationHeaders(slug),
    });
    if (!(await waitForRateLimit(response))) break;
  }
  expect(response).toBeTruthy();
  response = response!;
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function deleteBuilderPage(
  request: APIRequestContext,
  pageId: string,
  scope: string,
): Promise<void> {
  const response = await request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
    headers: mutationHeaders(scope),
  });
  expect([200, 404]).toContain(response.status());
}

async function listBuilderPages(
  request: APIRequestContext,
  scope: string,
): Promise<Array<{ pageId: string }>> {
  const response = await request.get('/api/builder/site/pages?locale=ko', {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { pages?: Array<{ pageId: string }> };
  return payload.pages ?? [];
}

test.describe('M00 cross-tab page deletion reconciliation', () => {
  test('does not resurrect a deleted stale-tab page while preserving concurrent additions', async ({ page }) => {
    const token = `m00-${Date.now().toString(36)}-${test.info().parallelIndex}`;
    const deletedSlug = `${token}-deleted`;
    const concurrentSlug = `${token}-concurrent`;
    let deletedPageId: string | null = null;
    let concurrentPageId: string | null = null;
    const staleTab = await page.context().newPage();

    try {
      await page.setExtraHTTPHeaders(mutationHeaders(`${token}-tab-a`));
      await staleTab.setExtraHTTPHeaders(mutationHeaders(`${token}-tab-b`));

      deletedPageId = await createBlankBuilderPage(
        page.request,
        deletedSlug,
        `M00 deleted race ${token}`,
      );

      await page.goto(`/ko/admin-builder?pageId=${encodeURIComponent(deletedPageId)}&m00=${token}-a`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();

      await staleTab.goto(`/ko/admin-builder?pageId=${encodeURIComponent(deletedPageId)}&m00=${token}-b`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(staleTab.getByRole('application', { name: 'Canvas editor' })).toBeVisible();

      const staleSite = structuredClone(await readSiteDocument('default', 'ko'));
      expect(staleSite.pages.map((entry) => entry.pageId)).toContain(deletedPageId);

      await page.waitForTimeout(50);
      concurrentPageId = await createBlankBuilderPage(
        page.request,
        concurrentSlug,
        `M00 concurrent page ${token}`,
      );

      await page.waitForTimeout(50);
      await deleteBuilderPage(page.request, deletedPageId, `${token}-delete`);

      staleSite.updatedAt = new Date().toISOString();
      await writeSiteDocument(staleSite);

      const pageIds = (await listBuilderPages(page.request, `${token}-list`))
        .map((entry) => entry.pageId);

      expect(pageIds).not.toContain(deletedPageId);
      expect(pageIds).toContain(concurrentPageId);
    } finally {
      if (deletedPageId) {
        await deleteBuilderPage(page.request, deletedPageId, `${token}-cleanup-deleted`).catch(() => undefined);
      }
      if (concurrentPageId) {
        await deleteBuilderPage(page.request, concurrentPageId, `${token}-cleanup-concurrent`).catch(() => undefined);
      }
      await staleTab.close().catch(() => undefined);
    }
  });
});
