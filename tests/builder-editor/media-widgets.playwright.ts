import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm12-media-widgets';
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

test.describe('/ko/admin-builder media widget pack', () => {
  test('adds the M12 media widget presets from the catalog', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-m12-media-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `M12 Media ${token}`);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&mediaWidgets=${token}`);
      await page.keyboard.press('Escape');

      const drawer = await openCatalogDrawer(page);
      await expect(drawer.getByText('Media widget pack')).toBeVisible();

      const presets = [
        'lightbox-trigger',
        'image-hotspots',
        'before-after',
        'hover-swap',
        'image-click-action',
        'inline-svg-color',
        'lottie-animation',
        'mp4-video-box',
        'youtube-embed',
        'vimeo-embed',
        'video-background',
        'audio-player',
        'spotify-soundcloud',
        'gif-giphy',
        'icon-library',
      ];

      for (const preset of presets) {
        await drawer.locator(`[data-builder-media-widget-preset="${preset}"]`).click();
      }

      await expect(page.locator('[data-builder-media-widget="before-after"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-before-after="true"]')).toHaveCount(1);
      await expect(page.locator('.builder-image-hotspot')).toHaveCount(2);
      await expect(page.locator('[data-builder-media-widget="inline-svg"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-media-widget="lottie"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-media-widget="video-empty"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-media-widget="video-background"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-media-widget="audio-player"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-media-widget="spotify"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-media-widget="gif"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-media-widget="icon-library"]')).toHaveCount(1);
      await expect(page.locator('iframe[src*="youtube.com/embed"]')).toHaveCount(1);
      await expect(page.locator('iframe[src*="player.vimeo.com/video"]')).toHaveCount(1);
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
