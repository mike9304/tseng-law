import { expect, test, type Page } from '@playwright/test';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { openBuilder } from './helpers/editor';

type Box = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function stringField(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' ? value : null;
}

function recordField(record: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const value = record[key];
  return isRecord(value) ? value : null;
}

function optionalNumberField(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  return typeof value === 'number' ? value : null;
}

function isHomePageEntry(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && stringField(value, 'pageId') !== null && value.isHomePage === true;
}

async function homePageId(page: Page): Promise<string | null> {
  const response = await page.request.get(
    `/api/builder/site/pages?locale=ko&siteId=${encodeURIComponent(DEFAULT_BUILDER_SITE_ID)}`,
  );
  if (!response.ok()) return null;
  const payload: unknown = await response.json();
  if (!isRecord(payload) || !Array.isArray(payload.pages)) return null;
  const home = payload.pages.find(isHomePageEntry);
  return home ? stringField(home, 'pageId') : null;
}

function findNode(payload: unknown, nodeId: string): Record<string, unknown> | null {
  if (!isRecord(payload)) return null;
  const document = recordField(payload, 'document') ?? recordField(recordField(payload, 'snapshot') ?? {}, 'document');
  const nodes = document ? document.nodes : null;
  if (!Array.isArray(nodes)) return null;
  return nodes.find((node) => isRecord(node) && stringField(node, 'id') === nodeId) ?? null;
}

function mobileRectWidth(node: Record<string, unknown> | null): number | null {
  if (!node) return null;
  const responsive = recordField(node, 'responsive');
  const mobile = responsive ? recordField(responsive, 'mobile') : null;
  const rect = mobile ? recordField(mobile, 'rect') : null;
  return rect ? optionalNumberField(rect, 'width') : null;
}

function mobileFontSize(node: Record<string, unknown> | null): number | null {
  if (!node) return null;
  const responsive = recordField(node, 'responsive');
  const mobile = responsive ? recordField(responsive, 'mobile') : null;
  return mobile ? optionalNumberField(mobile, 'fontSize') : null;
}

async function siteScopedMobileAutoFitState(page: Page): Promise<string> {
  const pageId = await homePageId(page);
  if (!pageId) return 'no-home';
  const response = await page.request.get(
    `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko&siteId=${encodeURIComponent(DEFAULT_BUILDER_SITE_ID)}`,
  );
  if (!response.ok()) return 'draft-failed';
  const payload: unknown = await response.json();
  const rootWidth = mobileRectWidth(findNode(payload, 'home-services-root'));
  if (rootWidth === null) return 'no-mobile-rect';
  if (rootWidth <= 0 || rootWidth > 375) return `width-${rootWidth}`;
  const fontSize = mobileFontSize(findNode(payload, 'home-services-title'));
  if (fontSize === null || fontSize < 8 || fontSize > 40) return `font-${fontSize}`;
  return 'ok';
}

async function requiredBox(page: Page, selector: string): Promise<Box> {
  const box = await page.locator(selector).first().boundingBox();
  if (box === null) {
    throw new Error(`Missing bounds for ${selector}.`);
  }
  return box;
}

test.describe('/ko/admin-builder mobile auto-fit', () => {
  test('persists valid mobile overrides when entering mobile mode', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?mobileAutoFit=${Date.now().toString(36)}`);

    await page.locator('[data-builder-topbar-viewport="mobile"]').click();
    await expect(page.locator('[data-builder-topbar-viewport="mobile"]')).toHaveAttribute('aria-pressed', 'true');
    const hamburger = page.locator('[data-builder-mobile-hamburger="true"]').first();
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await expect(page.locator('[data-builder-mobile-drawer="open"]').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await page.mouse.click(20, 120);

    // Mobile preview renders the canvas inside a 375px stage viewport (the
    // inner stage keeps desktop coordinates and is scaled down), so per-node
    // computed widths stay at desktop values. Assert the stage contract...
    await expect
      .poll(async () => page.locator('[class*="stageViewport"]').first().evaluate((el) => getComputedStyle(el).width))
      .toBe('375px');
    const servicesRoot = page.locator('[data-node-id="home-services-root"]').first();
    await expect(servicesRoot).toBeVisible();
    await expect(servicesRoot).toHaveAttribute('data-viewport', 'mobile');

    await expect.poll(() => siteScopedMobileAutoFitState(page), { timeout: 30_000 }).toBe('ok');

    // Visually, the scaled title must stay inside the scaled section bounds.
    const servicesTitle = page.locator('[data-node-id="home-services-title"]').first();
    await expect(servicesTitle).toBeVisible();
    const titleBox = await requiredBox(page, '[data-node-id="home-services-title"]');
    const rootBox = await requiredBox(page, '[data-node-id="home-services-root"]');
    expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(rootBox.x + rootBox.width + 1);

    await page.screenshot({
      path: '/tmp/tseng-law-mobile-auto-fit.png',
      fullPage: true,
    });
  });
});
