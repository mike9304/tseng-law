import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

type ApiResponse = Awaited<ReturnType<APIRequestContext['post']>>;

type NodeMetric = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly visibility: string;
  readonly ornamentDrawn?: boolean;
};

type LayoutTarget = {
  readonly id: string;
  readonly builderSelector: string;
  readonly publicSelector: string;
};

type ResponsiveViewport = 'tablet' | 'mobile';

type ResponsiveViewportConfig = {
  readonly mode: ResponsiveViewport;
  readonly width: number;
  readonly height: number;
};

type DividerMetric = {
  readonly dividerWidth: number;
  readonly dividerHeight: number;
  readonly markWidth: number;
  readonly markHeight: number;
  readonly markCenterOffset: number;
  readonly ornamentDrawn: boolean;
};

const SERVICE_PARITY_TARGETS = [
  {
    id: 'page-header',
    builderSelector: '[data-node-id="page-services-page-header-root"]',
    publicSelector: '.builder-pub-main .page-header',
  },
  {
    id: 'services-section',
    builderSelector: '[data-node-id="home-services-root"]',
    publicSelector: '.builder-pub-main section:has(.services-detail-list)',
  },
  {
    id: 'services-list',
    builderSelector: '[data-node-id="home-services-list"] .services-detail-list',
    publicSelector: '.builder-pub-main .services-detail-list',
  },
  {
    id: 'services-divider',
    builderSelector: '[data-node-id="home-services-divider"] .ornament-divider',
    publicSelector: '.builder-pub-main section:has(.services-detail-list) .ornament-divider',
  },
  {
    id: 'services-divider-mark',
    builderSelector: '[data-node-id="home-services-divider-mark"] .ornament',
    publicSelector: '.builder-pub-main section:has(.services-detail-list) .ornament-divider .ornament',
  },
  ...[
    ['0', 'investment'],
    ['1', 'civil'],
    ['2', 'family'],
    ['3', 'labor'],
    ['4', 'criminal'],
    ['5', 'ip'],
  ].flatMap(([index, slug]) => [
    {
      id: `service-card-${index}`,
      builderSelector: `[data-node-id="home-services-card-${index}"]`,
      publicSelector: `#${slug}.services-detail-card`,
    },
    {
      id: `service-card-${index}-toggle`,
      builderSelector: `[data-node-id="home-services-card-${index}-toggle"]`,
      publicSelector: `#${slug}.services-detail-card .services-detail-toggle`,
    },
    {
      id: `service-card-${index}-body`,
      builderSelector: `[data-node-id="home-services-card-${index}-body"]`,
      publicSelector: `#${slug}.services-detail-card .services-detail-body`,
    },
  ]),
] as const satisfies readonly LayoutTarget[];

const NODE_TOLERANCE_PX = 3;
const RESPONSIVE_VIEWPORTS = [
  { mode: 'tablet', width: 768, height: 1000 },
  { mode: 'mobile', width: 375, height: 1000 },
] as const satisfies readonly ResponsiveViewportConfig[];

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'services-layout-parity';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readStringField(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

async function waitForRateLimit(response: ApiResponse): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

async function resolveCanonicalServicesPageId(
  request: APIRequestContext,
): Promise<string> {
  let response: Awaited<ReturnType<APIRequestContext['get']>> | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await request.get('/api/builder/site/pages?locale=ko', {
      headers: mutationHeaders('canonical-services-pages-list'),
    });
    if (!(await waitForRateLimit(response))) break;
  }
  if (!response) throw new Error('services_parity_pages_list_missing_response');

  const payload = await response.json();
  expect(response.status(), JSON.stringify(payload)).toBe(200);
  if (!isObjectRecord(payload)) throw new Error('services_parity_pages_list_payload_invalid');
  const pages = payload.pages;
  if (!Array.isArray(pages)) throw new Error('services_parity_pages_list_invalid');

  const servicesPage = pages.find((page): page is Record<string, unknown> => (
    isObjectRecord(page)
      && page.locale === 'ko'
      && page.slug === 'services'
      && typeof page.pageId === 'string'
  ));
  if (!servicesPage) throw new Error('canonical_services_page_missing');

  const pageId = readStringField(servicesPage, 'pageId');
  if (!pageId) throw new Error('canonical_services_page_id_missing');
  return pageId;
}

async function stabilizePublicLayout(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
      [class*="chat" i],
      [class*="quick-contact" i],
      [class*="eventPopup" i] {
        display: none !important;
      }
    `,
  }).catch(() => undefined);
  await page.waitForFunction(() => document.fonts?.status === 'loaded').catch(() => undefined);
}

async function waitForCollapsedBuilderServicesBodies(page: Page): Promise<void> {
  await expect(page.locator('[data-node-id="home-services-card-0-body"]').first())
    .toHaveCSS('height', '0px', { timeout: 15_000 });
  await expect(page.locator('[data-node-id="home-services-card-5-body"]').first())
    .toHaveCSS('height', '0px', { timeout: 15_000 });
}

async function waitForCollapsedPublicServicesBodies(page: Page): Promise<void> {
  await expect(page.locator('#investment.services-detail-card .services-detail-body').first())
    .toHaveCSS('height', '0px', { timeout: 15_000 });
  await expect(page.locator('#ip.services-detail-card .services-detail-body').first())
    .toHaveCSS('height', '0px', { timeout: 15_000 });
}

async function readBuilderMetrics(page: Page): Promise<Record<string, NodeMetric>> {
  await expect(page.locator('[data-builder-canvas-viewport="desktop"] [data-node-id="home-services-card-5"]').first())
    .toBeAttached({ timeout: 15_000 });
  await page.waitForTimeout(200);

  return page.evaluate((targets) => {
    const stage = document.querySelector('[data-builder-canvas-viewport="desktop"]');
    if (!(stage instanceof HTMLElement)) throw new Error('builder_stage_missing');
    const stageRect = stage.getBoundingClientRect();
    const scale = stage.offsetWidth > 0 ? stageRect.width / stage.offsetWidth : 1;
    const metrics: Record<string, NodeMetric> = {};
    const isOrnamentDrawn = (element: Element): boolean | undefined => {
      if (!element.classList.contains('ornament')) return undefined;
      if (element instanceof SVGElement) return element.querySelector('line, circle, path') !== null;
      const before = window.getComputedStyle(element, '::before');
      const after = window.getComputedStyle(element, '::after');
      return before.content !== 'none' && after.content !== 'none';
    };

    for (const target of targets) {
      const element = stage.querySelector(target.builderSelector);
      if (!(element instanceof Element)) throw new Error(`builder_node_missing:${target.id}`);
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      metrics[target.id] = {
        x: Math.round((rect.x - stageRect.x) / scale),
        y: Math.round((rect.y - stageRect.y) / scale),
        width: Math.round(rect.width / scale),
        height: Math.round(rect.height / scale),
        visibility: style.visibility,
        ornamentDrawn: isOrnamentDrawn(element),
      };
    }

    return metrics;
  }, SERVICE_PARITY_TARGETS);
}

async function readPublicMetrics(page: Page): Promise<Record<string, NodeMetric>> {
  await expect(page.locator('#ip.services-detail-card').first()).toBeAttached({ timeout: 15_000 });
  await page.waitForTimeout(200);

  return page.evaluate((targets) => {
    const origin = document.querySelector('.builder-pub-main .page-header');
    if (!(origin instanceof HTMLElement)) throw new Error('public_origin_missing');
    const originRect = origin.getBoundingClientRect();
    const metrics: Record<string, NodeMetric> = {};
    const isOrnamentDrawn = (element: Element): boolean | undefined => {
      if (!element.classList.contains('ornament')) return undefined;
      if (element instanceof SVGElement) return element.querySelector('line, circle, path') !== null;
      const before = window.getComputedStyle(element, '::before');
      const after = window.getComputedStyle(element, '::after');
      return before.content !== 'none' && after.content !== 'none';
    };

    for (const target of targets) {
      const element = document.querySelector(target.publicSelector);
      if (!(element instanceof Element)) throw new Error(`public_node_missing:${target.id}`);
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      metrics[target.id] = {
        x: Math.round(rect.x - originRect.x),
        y: Math.round(rect.y + window.scrollY - (originRect.y + window.scrollY)),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        visibility: style.visibility,
        ornamentDrawn: isOrnamentDrawn(element),
      };
    }

    return metrics;
  }, SERVICE_PARITY_TARGETS);
}

async function switchBuilderViewport(page: Page, viewport: ResponsiveViewport): Promise<void> {
  await page.locator(`[data-builder-topbar-viewport="${viewport}"]`).click();
  await expect(page.locator(`[data-builder-topbar-viewport="${viewport}"]`)).toHaveAttribute('aria-pressed', 'true');
  const expectedWidth = RESPONSIVE_VIEWPORTS.find((config) => config.mode === viewport)?.width;
  if (expectedWidth) {
    await expect.poll(async () => (
      page.getByRole('application', { name: 'Canvas editor' }).evaluate((element) => (
        Math.round(Number.parseFloat(getComputedStyle(element).width))
      ))
    ), { timeout: 5_000 }).toBe(expectedWidth);
  }
}

async function readBuilderResponsiveDividerMetric(
  page: Page,
  viewport: ResponsiveViewport,
): Promise<DividerMetric> {
  await expect(page.locator(`[data-builder-canvas-viewport="${viewport}"] [data-node-id="home-services-divider"] .ornament-divider`).first())
    .toBeAttached({ timeout: 15_000 });

  return page.evaluate((currentViewport) => {
    const stage = document.querySelector(`[data-builder-canvas-viewport="${currentViewport}"]`);
    const divider = stage?.querySelector('[data-node-id="home-services-divider"] .ornament-divider');
    const mark = stage?.querySelector('[data-node-id="home-services-divider-mark"] .ornament');
    if (!(stage instanceof HTMLElement) || !(divider instanceof Element) || !(mark instanceof Element)) {
      throw new Error(`builder_responsive_divider_missing:${currentViewport}`);
    }

    const stageRect = stage.getBoundingClientRect();
    const scale = stage.offsetWidth > 0 ? stageRect.width / stage.offsetWidth : 1;
    const dividerRect = divider.getBoundingClientRect();
    const markRect = mark.getBoundingClientRect();
    const before = window.getComputedStyle(mark, '::before');
    const after = window.getComputedStyle(mark, '::after');

    return {
      dividerWidth: Math.round(dividerRect.width / scale),
      dividerHeight: Math.round(dividerRect.height / scale),
      markWidth: Math.round(markRect.width / scale),
      markHeight: Math.round(markRect.height / scale),
      markCenterOffset: Math.round((
        (markRect.x + markRect.width / 2) -
        (dividerRect.x + dividerRect.width / 2)
      ) / scale),
      ornamentDrawn: before.content !== 'none' && after.content !== 'none',
    };
  }, viewport);
}

async function readPublicResponsiveDividerMetric(page: Page): Promise<DividerMetric> {
  await expect(page.locator('.builder-pub-main section:has(.services-detail-list) .ornament-divider .ornament').first())
    .toBeAttached({ timeout: 15_000 });

  return page.evaluate(() => {
    const divider = document.querySelector('.builder-pub-main section:has(.services-detail-list) .ornament-divider');
    const mark = divider?.querySelector('.ornament');
    if (!(divider instanceof Element) || !(mark instanceof Element)) {
      throw new Error('public_responsive_divider_missing');
    }

    const dividerRect = divider.getBoundingClientRect();
    const markRect = mark.getBoundingClientRect();
    const ornamentDrawn = mark instanceof SVGElement
      ? mark.querySelector('line, circle, path') !== null
      : window.getComputedStyle(mark, '::before').content !== 'none'
        && window.getComputedStyle(mark, '::after').content !== 'none';

    return {
      dividerWidth: Math.round(dividerRect.width),
      dividerHeight: Math.round(dividerRect.height),
      markWidth: Math.round(markRect.width),
      markHeight: Math.round(markRect.height),
      markCenterOffset: Math.round(
        (markRect.x + markRect.width / 2) -
        (dividerRect.x + dividerRect.width / 2),
      ),
      ornamentDrawn,
    };
  });
}

test('/ko/admin-builder standard services layout matches the published services page', async ({ page }) => {
  test.setTimeout(120_000);
  const token = Date.now().toString(36);
  const pageId = await resolveCanonicalServicesPageId(page.request);
  await page.setViewportSize({ width: 1280, height: 1000 });

  await openBuilder(page, `/ko/admin-builder?pageId=${pageId}&standardServicesParity=${token}`);
  await waitForCollapsedBuilderServicesBodies(page);
  const builderMetrics = await readBuilderMetrics(page);

  await page.goto(`/ko/services?standardServicesParity=${token}`, { waitUntil: 'domcontentloaded' });
  await stabilizePublicLayout(page);
  await waitForCollapsedPublicServicesBodies(page);
  const publicMetrics = await readPublicMetrics(page);

  for (const target of SERVICE_PARITY_TARGETS) {
    const builder = builderMetrics[target.id];
    const published = publicMetrics[target.id];
    expect(builder, `builder metric missing for ${target.id}`).toBeDefined();
    expect(published, `public metric missing for ${target.id}`).toBeDefined();
    if (!builder || !published) continue;

    expect(builder.visibility, `${target.id} visibility`).toBe(published.visibility);
    expect(Math.abs(builder.x - published.x), `${target.id} x`).toBeLessThanOrEqual(NODE_TOLERANCE_PX);
    expect(Math.abs(builder.y - published.y), `${target.id} y`).toBeLessThanOrEqual(NODE_TOLERANCE_PX);
    expect(Math.abs(builder.width - published.width), `${target.id} width`).toBeLessThanOrEqual(NODE_TOLERANCE_PX);
    expect(Math.abs(builder.height - published.height), `${target.id} height`).toBeLessThanOrEqual(NODE_TOLERANCE_PX);
    if (target.id === 'services-divider-mark') {
      expect(builder.ornamentDrawn, `${target.id} builder ornament drawn`).toBe(true);
      expect(published.ornamentDrawn, `${target.id} public ornament drawn`).toBe(true);
    }
  }
});

test('/ko/admin-builder responsive services divider remains centered like the published services page', async ({ page }) => {
  test.setTimeout(120_000);
  const token = Date.now().toString(36);
  const pageId = await resolveCanonicalServicesPageId(page.request);
  await page.setViewportSize({ width: 1280, height: 1000 });

  await openBuilder(page, `/ko/admin-builder?pageId=${pageId}&responsiveServicesDivider=${token}`);

  for (const viewport of RESPONSIVE_VIEWPORTS) {
    await switchBuilderViewport(page, viewport.mode);
    const builderMetric = await readBuilderResponsiveDividerMetric(page, viewport.mode);

    const publicPage = await page.context().newPage();
    let publicMetric: DividerMetric;
    try {
      await publicPage.setViewportSize({ width: viewport.width, height: viewport.height });
      await publicPage.goto(`/ko/services?responsiveServicesDivider=${token}-${viewport.mode}`, { waitUntil: 'domcontentloaded' });
      await stabilizePublicLayout(publicPage);
      await waitForCollapsedPublicServicesBodies(publicPage);
      publicMetric = await readPublicResponsiveDividerMetric(publicPage);
    } finally {
      await publicPage.close().catch(() => undefined);
    }

    expect(builderMetric.ornamentDrawn, `${viewport.mode} builder ornament drawn`).toBe(true);
    expect(publicMetric.ornamentDrawn, `${viewport.mode} public ornament drawn`).toBe(true);
    expect(builderMetric.dividerWidth, `${viewport.mode} builder divider width`).toBeGreaterThan(0);
    expect(publicMetric.dividerWidth, `${viewport.mode} public divider width`).toBeGreaterThan(0);
    expect(Math.abs(builderMetric.dividerHeight - publicMetric.dividerHeight), `${viewport.mode} divider height`).toBeLessThanOrEqual(2);
    expect(Math.abs(builderMetric.markWidth - publicMetric.markWidth), `${viewport.mode} ornament width`).toBeLessThanOrEqual(2);
    expect(Math.abs(builderMetric.markHeight - publicMetric.markHeight), `${viewport.mode} ornament height`).toBeLessThanOrEqual(2);
    expect(Math.abs(builderMetric.markCenterOffset), `${viewport.mode} builder ornament centered`).toBeLessThanOrEqual(2);
    expect(Math.abs(publicMetric.markCenterOffset), `${viewport.mode} public ornament centered`).toBeLessThanOrEqual(2);
    expect(Math.abs(builderMetric.markCenterOffset - publicMetric.markCenterOffset), `${viewport.mode} ornament center parity`).toBeLessThanOrEqual(2);
  }
});
