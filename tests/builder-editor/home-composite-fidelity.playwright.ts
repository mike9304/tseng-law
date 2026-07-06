import { expect, test, type Page } from '@playwright/test';
import {
  createPublishedCompositeHomeTestPage,
  deleteBuilderTestPage,
} from './helpers/composite-home-test-page';

const PUBLIC_SCREENSHOT_PATH = '/tmp/tseng-fidelity-public-home-hero.png';
const BUILDER_SCREENSHOT_PATH = '/tmp/tseng-fidelity-builder-home-hero.png';

type BoxMetric = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

type HeroMetrics = {
  readonly hero: BoxMetric;
  readonly title: BoxMetric;
  readonly subtitle: BoxMetric;
  readonly search: BoxMetric;
  readonly fonts: {
    readonly hero: string;
    readonly title: string;
    readonly subtitle: string;
    readonly search: string;
  };
};

const overlayStabilizerCss = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
    caret-color: transparent !important;
  }
  .cyber-cursor,
  [data-builder-toast],
  [data-save-status-chip],
  [data-live-chat],
  [data-builder-ruler],
  [data-builder-floating-ui],
  [data-builder-inspector-panel],
  [data-builder-public-chrome-control],
  [data-builder-stage-toolbar],
  [id*="chat" i],
  [class*="chat" i],
  [class*="chatWidget"],
  [class*="eventPopup" i],
  [class*="floating-ai-chat" i],
  [class*="inspectorColumn"],
  [class*="inspectorPlaceholder"],
  [class*="quick-contact" i],
  [class*="year-end-popup" i],
  .builder-editor-ruler,
  .builder-site-header {
    display: none !important;
  }
`;

async function stabilizeVisuals(page: Page): Promise<void> {
  await page.addStyleTag({ content: overlayStabilizerCss }).catch(() => undefined);
  await page.waitForFunction(() => document.fonts?.status === 'loaded').catch(() => undefined);
}

async function waitForHeroImage(page: Page, rootSelector: string): Promise<void> {
  await page.waitForFunction((selector) => {
    const root = document.querySelector(selector);
    const image = root?.querySelector('.hero-media-image');
    return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
  }, rootSelector);
}

async function readPublicHeroMetrics(page: Page): Promise<HeroMetrics> {
  const metrics = await page.evaluate(() => {
    const toRoundedBox = (rect: DOMRect, origin: DOMRect, scale = 1) => ({
      x: Math.round((rect.x - origin.x) / scale),
      y: Math.round((rect.y - origin.y) / scale),
      width: Math.round(rect.width / scale),
      height: Math.round(rect.height / scale),
    });
    const hero = document.querySelector('.hero');
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const search = document.querySelector('.hero-search-bar');
    if (!(hero instanceof HTMLElement)
      || !(title instanceof HTMLElement)
      || !(subtitle instanceof HTMLElement)
      || !(search instanceof HTMLElement)) {
      throw new Error('public_hero_metrics_missing');
    }
    const origin = hero.getBoundingClientRect();
    return {
      hero: toRoundedBox(origin, origin),
      title: toRoundedBox(title.getBoundingClientRect(), origin),
      subtitle: toRoundedBox(subtitle.getBoundingClientRect(), origin),
      search: toRoundedBox(search.getBoundingClientRect(), origin),
      fonts: {
        hero: getComputedStyle(hero).fontFamily,
        title: getComputedStyle(title).fontFamily,
        subtitle: getComputedStyle(subtitle).fontFamily,
        search: getComputedStyle(search).fontFamily,
      },
    };
  });
  return metrics;
}

async function readBuilderHeroMetrics(page: Page): Promise<HeroMetrics> {
  const metrics = await page.evaluate(() => {
    const toRoundedBox = (rect: DOMRect, origin: DOMRect, scale = 1) => ({
      x: Math.round((rect.x - origin.x) / scale),
      y: Math.round((rect.y - origin.y) / scale),
      width: Math.round(rect.width / scale),
      height: Math.round(rect.height / scale),
    });
    const stage = document.querySelector('[data-builder-canvas-viewport="desktop"]');
    const hero = stage?.querySelector('.hero');
    const title = stage?.querySelector('.hero-title');
    const subtitle = stage?.querySelector('.hero-subtitle');
    const search = stage?.querySelector('.hero-search-bar');
    if (!(stage instanceof HTMLElement)
      || !(hero instanceof HTMLElement)
      || !(title instanceof HTMLElement)
      || !(subtitle instanceof HTMLElement)
      || !(search instanceof HTMLElement)) {
      throw new Error('builder_hero_metrics_missing');
    }
    const stageRect = stage.getBoundingClientRect();
    const scale = stage.offsetWidth > 0 ? stageRect.width / stage.offsetWidth : 1;
    const origin = stageRect;
    return {
      hero: toRoundedBox(hero.getBoundingClientRect(), origin, scale),
      title: toRoundedBox(title.getBoundingClientRect(), origin, scale),
      subtitle: toRoundedBox(subtitle.getBoundingClientRect(), origin, scale),
      search: toRoundedBox(search.getBoundingClientRect(), origin, scale),
      fonts: {
        hero: getComputedStyle(hero).fontFamily,
        title: getComputedStyle(title).fontFamily,
        subtitle: getComputedStyle(subtitle).fontFamily,
        search: getComputedStyle(search).fontFamily,
      },
    };
  });
  return metrics;
}

function expectCloseBox(actual: BoxMetric, expected: BoxMetric, tolerance: number): void {
  expect(Math.abs(actual.x - expected.x), `x mismatch: ${JSON.stringify({ actual, expected })}`).toBeLessThanOrEqual(tolerance);
  expect(Math.abs(actual.y - expected.y), `y mismatch: ${JSON.stringify({ actual, expected })}`).toBeLessThanOrEqual(tolerance);
  expect(Math.abs(actual.width - expected.width), `width mismatch: ${JSON.stringify({ actual, expected })}`).toBeLessThanOrEqual(tolerance);
  expect(Math.abs(actual.height - expected.height), `height mismatch: ${JSON.stringify({ actual, expected })}`).toBeLessThanOrEqual(tolerance);
}

test('/ko/admin-builder opens a composite home mirror without mutating the shared home draft', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const slug = `pw-home-open-${token}`;
  let pageId: string | null = null;

  try {
    pageId = await createPublishedCompositeHomeTestPage(
      page.request,
      slug,
      `Home Composite Open ${token}`,
    );

    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto(`/ko/admin-builder?pageId=${pageId}&homeCompositeOpen=${token}`, {
      waitUntil: 'domcontentloaded',
    });
    await stabilizeVisuals(page);
    await expect(page.locator('[data-editor-shell]').first()).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });

    const stage = page.locator('[data-builder-canvas-viewport="desktop"]').first();
    await expect(stage.locator('[data-node-id="home-hero"]')).toBeVisible();
    await expect(stage.locator('[data-node-id="home-hero-root"]')).toHaveCount(0);
  } finally {
    await deleteBuilderTestPage(page.request, pageId);
  }
});

test('/ko/admin-builder composite home hero matches public first section metrics', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const slug = `pw-home-hero-${token}`;
  let pageId: string | null = null;

  try {
    pageId = await createPublishedCompositeHomeTestPage(
      page.request,
      slug,
      `Home Composite Hero ${token}`,
    );

    await page.setViewportSize({ width: 1280, height: 1000 });

    await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
    await stabilizeVisuals(page);
    await expect(page.locator('.hero').first()).toBeVisible();
    await waitForHeroImage(page, '.hero');
    const publicMetrics = await readPublicHeroMetrics(page);
    const publicHeroBox = await page.locator('.hero').first().boundingBox();
    expect(publicHeroBox).not.toBeNull();
    if (!publicHeroBox) throw new Error('public_hero_box_missing');
    await page.screenshot({
      path: PUBLIC_SCREENSHOT_PATH,
      clip: {
        x: publicHeroBox.x,
        y: publicHeroBox.y,
        width: publicHeroBox.width,
        height: Math.min(publicHeroBox.height, 900),
      },
    });

    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto(`/ko/admin-builder?pageId=${pageId}&homeCompositeFidelity=${token}`, { waitUntil: 'domcontentloaded' });
    await stabilizeVisuals(page);
    const shell = page.locator('[data-editor-shell]').first();
    await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
    const stage = page.locator('[data-builder-canvas-viewport="desktop"]').first();
    await expect(stage.locator('[data-node-id="home-hero"]')).toBeVisible();
    await expect(stage.locator('[data-node-id="home-hero-root"]')).toHaveCount(0);
    await waitForHeroImage(page, '[data-builder-canvas-viewport="desktop"]');
    const builderMetrics = await readBuilderHeroMetrics(page);
    await stage.locator('.hero').first().screenshot({ path: BUILDER_SCREENSHOT_PATH });

    expectCloseBox(builderMetrics.hero, publicMetrics.hero, 3);
    expectCloseBox(builderMetrics.title, publicMetrics.title, 3);
    expectCloseBox(builderMetrics.subtitle, publicMetrics.subtitle, 3);
    expectCloseBox(builderMetrics.search, publicMetrics.search, 4);
    expect(builderMetrics.fonts).toEqual(publicMetrics.fonts);
  } finally {
    await deleteBuilderTestPage(page.request, pageId);
  }
});

test('/ko/admin-builder composite home hero uses mobile typography inside mobile canvas', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const slug = `pw-home-mobile-${token}`;
  let pageId: string | null = null;

  try {
    pageId = await createPublishedCompositeHomeTestPage(
      page.request,
      slug,
      `Home Composite Mobile ${token}`,
    );

    await page.setViewportSize({ width: 1476, height: 900 });

    await page.goto(`/ko/admin-builder?pageId=${pageId}&homeCompositeMobile=${token}`, { waitUntil: 'domcontentloaded' });
    await stabilizeVisuals(page);
    const shell = page.locator('[data-editor-shell]').first();
    await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });

    const mobileToggle = page.locator('[data-builder-topbar-viewport="mobile"]');
    await mobileToggle.click();
    await expect(mobileToggle).toHaveAttribute('aria-pressed', 'true');

    const stage = page.locator('[data-builder-canvas-viewport="mobile"]').first();
    const compositeHero = stage.locator('[data-node-id="home-hero"]').first();
    const title = compositeHero.locator('.hero-title').first();
    await expect(compositeHero).toBeVisible();
    await expect(title).toBeVisible();
    await waitForHeroImage(page, '[data-builder-canvas-viewport="mobile"] [data-node-id="home-hero"]');

    const metrics = await title.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return {
        fontSize: Number.parseFloat(styles.fontSize),
        lineHeight: Number.parseFloat(styles.lineHeight),
        width: rect.width,
        height: rect.height,
      };
    });

    expect(metrics.fontSize).toBeGreaterThanOrEqual(30);
    expect(metrics.fontSize).toBeLessThanOrEqual(34);
    expect(metrics.lineHeight).toBeLessThanOrEqual(38);
    expect(metrics.width).toBeGreaterThan(250);
    expect(metrics.height).toBeLessThan(120);
  } finally {
    await deleteBuilderTestPage(page.request, pageId);
  }
});
