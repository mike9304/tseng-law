import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'add-panel-widget-drag';
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
  const pageId = payload.pageId;
  if (!pageId) throw new Error('page_id_missing');
  return pageId;
}

async function dragCatalogPresetToCanvas(
  page: Page,
  selector: string,
  canvasPoint: { x: number; y: number },
): Promise<void> {
  await page.evaluate(({ point, sourceSelector }) => {
    const source = document.querySelector<HTMLElement>(sourceSelector);
    const stage = document.querySelector<HTMLElement>('[role="application"][aria-label="Canvas editor"]');
    if (!source || !stage) throw new Error('catalog_preset_drag_target_missing');

    const stageRect = stage.getBoundingClientRect();
    const clientX = stageRect.left + point.x * (stageRect.width / stage.offsetWidth);
    const clientY = stageRect.top + point.y * (stageRect.height / stage.offsetHeight);
    const dataTransfer = new DataTransfer();

    source.dispatchEvent(new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      dataTransfer,
    }));
    stage.dispatchEvent(new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }));
    stage.dispatchEvent(new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }));
  }, { point: canvasPoint, sourceSelector: selector });
}

async function expectCanvasNodeAtPoint(
  page: Page,
  selector: string,
  canvasPoint: { x: number; y: number },
): Promise<void> {
  const actual = await page.locator(selector).last().evaluate((element) => {
    const node = element.closest<HTMLElement>('[data-node-id]');
    const rect = (node ?? element).getBoundingClientRect();
    return { x: rect.x, y: rect.y };
  });
  const expected = await page.getByRole('application', { name: 'Canvas editor' }).evaluate((stage, point) => {
    if (!(stage instanceof HTMLElement)) throw new Error('canvas_stage_not_html_element');
    const rect = stage.getBoundingClientRect();
    return {
      x: rect.left + point.x * (rect.width / stage.offsetWidth),
      y: rect.top + point.y * (rect.height / stage.offsetHeight),
    };
  }, canvasPoint);

  expect(Math.abs(actual.x - expected.x)).toBeLessThanOrEqual(2);
  expect(Math.abs(actual.y - expected.y)).toBeLessThanOrEqual(2);
}

test.describe('/ko/admin-builder Add panel widget preset drag/drop', () => {
  test('drops text, media, gallery, and navigation presets at the dragged canvas positions and persists them', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-widget-drag-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `Widget Drag ${token}`);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&widgetDrag=${token}`);
      await page.keyboard.press('Escape');

      const drawer = await openCatalogDrawer(page);
      await expect(drawer.locator('[data-builder-text-widget-preset="rich-text"]')).toBeAttached();
      await expect(drawer.locator('[data-builder-media-widget-preset="before-after"]')).toBeAttached();
      await expect(drawer.locator('[data-builder-gallery-widget-preset="gallery-slider"]')).toBeAttached();
      await expect(drawer.locator('[data-builder-navigation-widget-preset="nav-anchor-menu"]')).toBeAttached();

      const richTextPoint = { x: 244, y: 148 };
      const beforeAfterPoint = { x: 320, y: 316 };
      const sliderPoint = { x: 408, y: 520 };
      const anchorMenuPoint = { x: 520, y: 648 };

      await dragCatalogPresetToCanvas(page, '[data-builder-text-widget-preset="rich-text"]', richTextPoint);
      await dragCatalogPresetToCanvas(page, '[data-builder-media-widget-preset="before-after"]', beforeAfterPoint);
      await dragCatalogPresetToCanvas(page, '[data-builder-gallery-widget-preset="gallery-slider"]', sliderPoint);
      await dragCatalogPresetToCanvas(page, '[data-builder-navigation-widget-preset="nav-anchor-menu"]', anchorMenuPoint);

      const richText = page.locator('[data-node-id^="text-"]').filter({ hasText: '굵게, 기울임' }).last();
      const beforeAfter = page.locator('[data-builder-media-widget="before-after"]').last();
      const slider = page.locator('[data-builder-gallery-layout="slider"]').last();
      const anchorMenu = page.locator('[data-builder-nav-widget="anchor-menu"]').last();
      await expect(richText).toBeVisible();
      await expect(beforeAfter).toBeAttached();
      await expect(slider).toBeAttached();
      await expect(anchorMenu).toBeVisible();

      await expectCanvasNodeAtPoint(page, '[data-node-id^="text-"]:has-text("굵게, 기울임")', richTextPoint);
      await expectCanvasNodeAtPoint(page, '[data-builder-media-widget="before-after"]', beforeAfterPoint);
      await expectCanvasNodeAtPoint(page, '[data-builder-gallery-layout="slider"]', sliderPoint);
      await expectCanvasNodeAtPoint(page, '[data-builder-nav-widget="anchor-menu"]', anchorMenuPoint);

      await expect(page.locator('[data-save-status-chip="error"]')).toHaveCount(0);
      await expect(page.locator('[data-save-status-chip]')).toBeHidden({ timeout: 30_000 });

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&widgetDragReload=${token}`);
      await expect(page.locator('[data-node-id^="text-"]').filter({ hasText: '굵게, 기울임' }).first()).toBeVisible();
      await expect(page.locator('[data-builder-media-widget="before-after"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-gallery-layout="slider"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-nav-widget="anchor-menu"]').first()).toBeVisible();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          failOnStatusCode: false,
          headers: mutationHeaders(slug),
        });
      }
    }
  });
});
