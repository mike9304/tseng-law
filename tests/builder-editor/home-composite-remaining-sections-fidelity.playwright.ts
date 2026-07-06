import { expect, test, type Page } from '@playwright/test';

type SectionConfig = {
  readonly key: string;
  readonly nodeId: string;
  readonly publicSelector: string;
  readonly titleSelector: string;
  readonly visibleSelector: string;
};

type SectionMetric = {
  readonly key: string;
  readonly height: number;
  readonly title: string;
  readonly font: string;
  readonly visibleOpacity: string;
};

type BuilderSectionMetric = SectionMetric & {
  readonly nodeHeight: number;
  readonly y: number;
};

const SECTION_CONFIGS = [
  {
    key: 'hero',
    nodeId: 'home-hero',
    publicSelector: '#hero',
    titleSelector: '.hero-title',
    visibleSelector: '.hero-title',
  },
  {
    key: 'insights',
    nodeId: 'home-insights',
    publicSelector: '#insights',
    titleSelector: '.insights-featured-title',
    visibleSelector: '.insights-featured',
  },
  {
    key: 'services',
    nodeId: 'home-services',
    publicSelector: '#practice',
    titleSelector: '.section-title',
    visibleSelector: '.services-detail-card',
  },
  {
    key: 'attorney',
    nodeId: 'home-attorney',
    publicSelector: '#about',
    titleSelector: '.split-title',
    visibleSelector: '.split-content',
  },
  {
    key: 'case-results',
    nodeId: 'home-case-results',
    publicSelector: '#results',
    titleSelector: '.split-title',
    visibleSelector: '.split-content',
  },
  {
    key: 'stats',
    nodeId: 'home-stats',
    publicSelector: '#stats',
    titleSelector: '.section-title',
    visibleSelector: '.stats-grid',
  },
  {
    key: 'faq',
    nodeId: 'home-faq',
    publicSelector: '#faq',
    titleSelector: '.section-title',
    visibleSelector: '.faq-list',
  },
  {
    key: 'offices',
    nodeId: 'home-offices',
    publicSelector: '#offices',
    titleSelector: '.section-title',
    visibleSelector: '.office-layout',
  },
  {
    key: 'contact',
    nodeId: 'home-contact',
    publicSelector: '#contact',
    titleSelector: '.section-title',
    visibleSelector: '.home-contact-actions',
  },
] satisfies readonly SectionConfig[];

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
  await page.addStyleTag({ content: overlayStabilizerCss });
  await page.waitForFunction(() => document.fonts?.status === 'loaded');
  await page.waitForTimeout(500);
}

async function readPublicMetrics(page: Page): Promise<readonly SectionMetric[]> {
  return page.evaluate((configs) => configs.map((config) => {
    const section = document.querySelector(config.publicSelector);
    const title = section?.querySelector(config.titleSelector);
    const visible = section?.querySelector(config.visibleSelector);

    if (
      !(section instanceof HTMLElement)
      || !(title instanceof HTMLElement)
      || !(visible instanceof HTMLElement)
    ) {
      throw new Error(`public_section_metric_missing:${config.key}`);
    }

    return {
      key: config.key,
      height: Math.round(section.getBoundingClientRect().height),
      title: title.textContent?.trim().replace(/\s+/g, ' ') ?? '',
      font: getComputedStyle(section).fontFamily,
      visibleOpacity: getComputedStyle(visible).opacity,
    };
  }), SECTION_CONFIGS);
}

async function readBuilderMetrics(page: Page): Promise<readonly BuilderSectionMetric[]> {
  return page.evaluate((configs) => {
    const stage = document.querySelector('[data-builder-canvas-viewport="desktop"]');
    if (!(stage instanceof HTMLElement)) {
      throw new Error('builder_stage_missing');
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

    return configs.map((config) => {
      const node = stage.querySelector(`[data-node-id="${config.nodeId}"]`);
      if (!(node instanceof HTMLElement)) {
        throw new Error(`builder_section_metric_missing:${config.key}`);
      }

      const section = node.matches(config.publicSelector)
        ? node
        : node.querySelector(config.publicSelector);
      const title = section?.querySelector(config.titleSelector);
      const visible = section?.querySelector(config.visibleSelector);

      if (
        !(section instanceof HTMLElement)
        || !(title instanceof HTMLElement)
        || !(visible instanceof HTMLElement)
      ) {
        throw new Error(`builder_section_metric_missing:${config.key}`);
      }

      const nodeBox = toStageBox(node);
      const sectionBox = toStageBox(section);

      return {
        key: config.key,
        y: sectionBox.y,
        nodeHeight: nodeBox.height,
        height: sectionBox.height,
        title: title.textContent?.trim().replace(/\s+/g, ' ') ?? '',
        font: getComputedStyle(section).fontFamily,
        visibleOpacity: getComputedStyle(visible).opacity,
      };
    });
  }, SECTION_CONFIGS);
}

function indexByKey<T extends { readonly key: string }>(metrics: readonly T[]): ReadonlyMap<string, T> {
  return new Map(metrics.map((metric) => [metric.key, metric]));
}

function compactText(value: string): string {
  return value.replace(/\s+/g, '');
}

test('/ko/admin-builder home composite sections preserve public titles without overlapping', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1280, height: 1000 });

  await page.goto(`/ko/admin-builder?homeRemainingSectionFidelity=${Date.now().toString(36)}`, { waitUntil: 'domcontentloaded' });
  await stabilizeVisuals(page);
  await expect(page.locator('[data-editor-shell]').first()).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
  const builderMetrics = await readBuilderMetrics(page);

  await page.goto(`/ko?homeRemainingSectionFidelity=${Date.now().toString(36)}`, { waitUntil: 'domcontentloaded' });
  await stabilizeVisuals(page);
  const publicMetrics = await readPublicMetrics(page);

  const publicByKey = indexByKey(publicMetrics);
  let previousBottom = 0;

  for (const builderMetric of builderMetrics) {
    const publicMetric = publicByKey.get(builderMetric.key);
    expect(publicMetric, `missing public metric for ${builderMetric.key}`).toBeDefined();
    if (!publicMetric) continue;

    expect(compactText(builderMetric.title)).toBe(compactText(publicMetric.title));
    expect(builderMetric.font).toBe(publicMetric.font);
    expect(builderMetric.visibleOpacity).toBe('1');
    expect(publicMetric.visibleOpacity).toBe('1');
    expect(builderMetric.nodeHeight, `${builderMetric.key} node height`).toBeGreaterThan(0);
    expect(builderMetric.y - previousBottom, `${builderMetric.key} must not overlap previous section`).toBeGreaterThanOrEqual(-4);

    previousBottom = builderMetric.y + builderMetric.nodeHeight;
  }
});
