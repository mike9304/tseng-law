import { expect, test, type Page } from '@playwright/test';

type SectionMetric = {
  readonly height: number;
  readonly font: string;
  readonly featuredTitle: string;
  readonly featuredOpacity: string;
  readonly listWrapOpacity: string;
  readonly listTitles: readonly string[];
};

type PublicHomeMetric = {
  readonly heroHeight: number;
  readonly insights: SectionMetric;
};

type BuilderHomeMetric = {
  readonly insights: SectionMetric & {
    readonly nodeHeight: number;
    readonly y: number;
  };
  readonly servicesY: number;
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

async function stabilizeVisuals(page: Page, rootSelector: string): Promise<void> {
  await page.addStyleTag({ content: overlayStabilizerCss }).catch(() => undefined);
  await page.waitForFunction(() => document.fonts?.status === 'loaded').catch(() => undefined);
  await page.waitForFunction((selector) => {
    const images = Array.from(document.querySelectorAll(`${selector} img`));
    return images.every((image) => (
      image instanceof HTMLImageElement
        && image.complete
        && image.naturalWidth > 0
    ));
  }, rootSelector).catch(() => undefined);
  await page.waitForTimeout(500);
}

async function readPublicHomeMetric(page: Page): Promise<PublicHomeMetric> {
  return page.evaluate(() => {
    const hero = document.querySelector('#hero');
    const insights = document.querySelector('#insights');
    const featuredTitle = insights?.querySelector('.insights-featured-title');

    if (
      !(hero instanceof HTMLElement)
      || !(insights instanceof HTMLElement)
      || !(featuredTitle instanceof HTMLElement)
    ) {
      throw new Error('public_home_metric_missing');
    }

    const heroRect = hero.getBoundingClientRect();
    const insightsRect = insights.getBoundingClientRect();

    return {
      heroHeight: Math.round(heroRect.height),
      insights: {
        height: Math.round(insightsRect.height),
        font: getComputedStyle(insights).fontFamily,
        featuredTitle: featuredTitle.textContent?.trim().replace(/\s+/g, ' ') ?? '',
        featuredOpacity: getComputedStyle(insights.querySelector('.insights-featured') ?? insights).opacity,
        listWrapOpacity: getComputedStyle(insights.querySelector('.insights-list-wrap') ?? insights).opacity,
        listTitles: Array.from(insights.querySelectorAll('.insights-list-title')).map((title) => (
          title.textContent?.trim().replace(/\s+/g, ' ') ?? ''
        )),
      },
    };
  });
}

async function readBuilderHomeMetric(page: Page): Promise<BuilderHomeMetric> {
  return page.evaluate(() => {
    const stage = document.querySelector('[data-builder-canvas-viewport="desktop"]');
    const insightsNode = stage?.querySelector('[data-node-id="home-insights"]');
    const servicesNode = stage?.querySelector('[data-node-id="home-services"]');
    const insights = insightsNode?.querySelector('#insights');
    const featuredTitle = insights?.querySelector('.insights-featured-title');

    if (
      !(stage instanceof HTMLElement)
      || !(insightsNode instanceof HTMLElement)
      || !(servicesNode instanceof HTMLElement)
      || !(insights instanceof HTMLElement)
      || !(featuredTitle instanceof HTMLElement)
    ) {
      throw new Error('builder_home_metric_missing');
    }

    const stageRect = stage.getBoundingClientRect();
    const scale = stage.offsetWidth > 0 ? stageRect.width / stage.offsetWidth : 1;
    const toStageBox = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return {
        y: Math.round((rect.y - stageRect.y) / scale),
        height: Math.round(rect.height / scale),
      };
    };
    const insightsNodeBox = toStageBox(insightsNode);
    const insightsBox = toStageBox(insights);
    const servicesBox = toStageBox(servicesNode);

    return {
      insights: {
        y: insightsBox.y,
        nodeHeight: insightsNodeBox.height,
        height: insightsBox.height,
        font: getComputedStyle(insights).fontFamily,
        featuredTitle: featuredTitle.textContent?.trim().replace(/\s+/g, ' ') ?? '',
        featuredOpacity: getComputedStyle(insights.querySelector('.insights-featured') ?? insights).opacity,
        listWrapOpacity: getComputedStyle(insights.querySelector('.insights-list-wrap') ?? insights).opacity,
        listTitles: Array.from(insights.querySelectorAll('.insights-list-title')).map((title) => (
          title.textContent?.trim().replace(/\s+/g, ' ') ?? ''
        )),
      },
      servicesY: servicesBox.y,
    };
  });
}

test('/ko/admin-builder composite home insights matches public section height and typography', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1280, height: 1000 });

  await page.goto(`/ko/admin-builder?homeSectionFidelity=${Date.now().toString(36)}`, { waitUntil: 'domcontentloaded' });
  await stabilizeVisuals(page, '[data-node-id="home-insights"]');
  const shell = page.locator('[data-editor-shell]').first();
  await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
  const builderMetric = await readBuilderHomeMetric(page);

  await page.goto(`/ko?homeSectionFidelity=${Date.now().toString(36)}`, { waitUntil: 'domcontentloaded' });
  await stabilizeVisuals(page, '#insights');
  const publicMetric = await readPublicHomeMetric(page);

  expect(builderMetric.insights.featuredTitle).toBe(publicMetric.insights.featuredTitle);
  expect(builderMetric.insights.listTitles).toEqual(publicMetric.insights.listTitles);
  expect(builderMetric.insights.font).toBe(publicMetric.insights.font);
  expect(builderMetric.insights.featuredOpacity).toBe('1');
  expect(builderMetric.insights.listWrapOpacity).toBe('1');
  expect(publicMetric.insights.featuredOpacity).toBe('1');
  expect(publicMetric.insights.listWrapOpacity).toBe('1');
  expect(Math.abs(builderMetric.insights.height - publicMetric.insights.height)).toBeLessThanOrEqual(3);
  expect(Math.abs(builderMetric.insights.nodeHeight - publicMetric.insights.height)).toBeLessThanOrEqual(3);
  expect(Math.abs(builderMetric.servicesY - (publicMetric.heroHeight + publicMetric.insights.height))).toBeLessThanOrEqual(3);
});
