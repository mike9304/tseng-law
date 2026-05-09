import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm11-text-widgets';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createBuilderPage(request: APIRequestContext, slug: string, title: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title, blank: true },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

test.describe('/ko/admin-builder text widget pack', () => {
  test('adds the M11 text widget presets from the catalog', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-m11-text-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `M11 Text ${token}`);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&textWidgets=${token}`);
      await page.keyboard.press('Escape');

      const drawer = await openCatalogDrawer(page);
      await expect(drawer.getByText('Text widget pack')).toBeVisible();

      const presets = [
        'heading-h1-h6',
        'rich-text',
        'inspector-rte',
        'text-on-path',
        'multi-column',
        'quote',
        'list',
        'marquee',
        'typography-preset',
        'link-text',
      ];

      for (const preset of presets) {
        await drawer.locator(`[data-builder-text-widget-preset="${preset}"]`).click();
      }

      await expect(page.locator('[data-node-id^="heading-"]').filter({ hasText: '승소 전략' })).toBeVisible();
      await expect(page.locator('[data-node-id^="text-"]').filter({ hasText: 'Hojung Law Group' })).toBeVisible();
      await expect(page.locator('[data-node-id^="text-"]').filter({ hasText: '무료 상담 예약 가능' })).toBeVisible();
      await expect(page.locator('[data-node-id^="text-"]').filter({ hasText: '상담 예약으로 이동' })).toBeVisible();
      await expect(page.locator('svg textPath')).toHaveCount(1);
      await expect(page.locator('.builder-text-marquee')).toHaveCount(1);

      await page.locator('[data-node-id^="text-"]').filter({ hasText: '상담 예약으로 이동' }).click({ force: true });
      const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
      await inspector.getByRole('button', { name: 'content' }).click();
      await expect(inspector.locator('[data-builder-href-input="true"]').first()).toHaveValue('/ko/contact');
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });
});
