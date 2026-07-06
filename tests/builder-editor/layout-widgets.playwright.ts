import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm14-layout-widgets';
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

async function expectLayoutWidgetsAttached(page: Page) {
  await expect(page.locator('[data-builder-layout-mode="strip"]').first()).toBeAttached();
  await expect(page.locator('[data-builder-layout-mode="box"]').first()).toBeAttached();
  await expect(page.locator('[data-builder-layout-mode="columns"]').first()).toBeAttached();
  await expect(page.locator('[data-builder-layout-mode="repeater"]').first()).toBeAttached();
  await expect(page.locator('[data-builder-layout-mode="grid"]').first()).toBeAttached();
  await expect(page.locator('[data-builder-layout-widget="tabs"]').first()).toBeAttached();
  await expect(page.locator('[data-builder-layout-widget="accordion"]').first()).toBeAttached();
  await expect(page.locator('[data-builder-layout-widget="slideshow"]').first()).toBeAttached();
  await expect(page.locator('[data-builder-layout-widget="hoverBox"]').first()).toBeAttached();
  await expect(page.locator('[data-builder-layout-widget="repeater"]').first()).toBeAttached();
  await expect(page.locator('[data-builder-layout-sticky="true"]').first()).toBeAttached();
}

async function dragLayoutPresetToCanvas(
  page: Page,
  presetId: string,
  canvasPoint: { x: number; y: number },
): Promise<void> {
  await page.evaluate(({ point, preset }) => {
    const source = document.querySelector<HTMLElement>(`[data-builder-layout-widget-preset="${preset}"]`);
    const stage = document.querySelector<HTMLElement>('[role="application"][aria-label="Canvas editor"]');
    if (!source || !stage) throw new Error('layout_preset_drag_target_missing');

    const stageRect = stage.getBoundingClientRect();
    const scaleX = stageRect.width / stage.offsetWidth;
    const scaleY = stageRect.height / stage.offsetHeight;
    const clientX = stageRect.left + point.x * scaleX;
    const clientY = stageRect.top + point.y * scaleY;
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
  }, { point: canvasPoint, preset: presetId });
}

async function getCanvasNodeScreenBox(
  page: Page,
  selector: string,
): Promise<{ x: number; y: number; width: number; height: number }> {
  return page.locator(selector).last().evaluate((element) => {
    const node = element.closest<HTMLElement>('[data-node-id]');
    const rect = (node ?? element).getBoundingClientRect();
    return {
      height: rect.height,
      width: rect.width,
      x: rect.x,
      y: rect.y,
    };
  });
}

async function getCanvasPointScreenPosition(
  page: Page,
  canvasPoint: { x: number; y: number },
): Promise<{ x: number; y: number }> {
  return page.getByRole('application', { name: 'Canvas editor' }).evaluate((stage, point) => {
    const stageElement = stage as HTMLElement;
    const rect = stageElement.getBoundingClientRect();
    return {
      x: rect.left + point.x * (rect.width / stageElement.offsetWidth),
      y: rect.top + point.y * (rect.height / stageElement.offsetHeight),
    };
  }, canvasPoint);
}

test.describe('/ko/admin-builder layout widget pack', () => {
  test('adds the M14 layout widget presets from the catalog and persists them after reload', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-m14-layout-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `M14 Layout ${token}`);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&layoutWidgets=${token}`);
      await page.keyboard.press('Escape');

      const drawer = await openCatalogDrawer(page);
      await expect(drawer.getByText(/Layout widget pack|레이아웃 위젯 팩/)).toBeVisible();

      const presets = [
        'layout-strip',
        'layout-box',
        'layout-columns',
        'layout-repeater',
        'layout-tabs',
        'layout-accordion',
        'layout-slideshow-container',
        'layout-hover-box',
        'layout-sticky-anchor',
        'layout-grid',
      ];

      for (const preset of presets) {
        await drawer.locator(`[data-builder-layout-widget-preset="${preset}"]`).click();
      }

      await expectLayoutWidgetsAttached(page);
      await expect(page.locator('[data-builder-save-status]').first()).toHaveAttribute('data-builder-save-status', /saving|saved/);
      await expect(page.locator('[data-save-status-chip="error"]')).toHaveCount(0);
      await expect(page.locator('[data-save-status-chip]')).toBeHidden({ timeout: 30_000 });

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&layoutWidgetsReload=${token}`);
      await expectLayoutWidgetsAttached(page);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('drops a layout widget preset at the dragged canvas position and persists it', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-layout-drop-${token}`;
    const dropPoint = { x: 312, y: 188 };
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `Layout Drop ${token}`);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&layoutDrop=${token}`);
      await page.keyboard.press('Escape');

      const drawer = await openCatalogDrawer(page);
      await expect(drawer.locator('[data-builder-layout-widget-preset="layout-tabs"]')).toBeVisible();

      await dragLayoutPresetToCanvas(page, 'layout-tabs', dropPoint);

      const tabsWidget = page.locator('[data-builder-layout-widget="tabs"]').last();
      await expect(tabsWidget).toBeAttached();

      const expected = await getCanvasPointScreenPosition(page, dropPoint);
      const actual = await getCanvasNodeScreenBox(page, '[data-builder-layout-widget="tabs"]');
      expect(Math.abs(actual.x - expected.x)).toBeLessThanOrEqual(2);
      expect(Math.abs(actual.y - expected.y)).toBeLessThanOrEqual(2);

      await expect(page.locator('[data-save-status-chip="error"]')).toHaveCount(0);
      await expect(page.locator('[data-save-status-chip]')).toBeHidden({ timeout: 30_000 });

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&layoutDropReload=${token}`);
      await expect(page.locator('[data-builder-layout-widget="tabs"]').first()).toBeAttached();
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
