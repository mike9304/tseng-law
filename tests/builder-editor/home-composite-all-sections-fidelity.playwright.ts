import { expect, test, type Page } from '@playwright/test';
import {
  createPublishedCompositeHomeTestPage,
  deleteBuilderTestPage,
} from './helpers/composite-home-test-page';

type SectionSpec = {
  readonly nodeId: string;
  readonly selector: string;
};

type SectionMetric = {
  readonly y: number;
  readonly height: number;
  readonly nodeHeight?: number;
  readonly font: string;
  readonly text: string;
  readonly revealOpacity: string;
  readonly numbers: readonly string[];
  readonly imageCount: number;
  readonly incompleteImages: number;
};

const SECTION_SPECS: readonly SectionSpec[] = [
  { nodeId: 'home-hero', selector: '#hero' },
  { nodeId: 'home-insights', selector: '#insights' },
  { nodeId: 'home-services', selector: 'section' },
  { nodeId: 'home-attorney', selector: '#about' },
  { nodeId: 'home-case-results', selector: '#results' },
  { nodeId: 'home-stats', selector: '#stats' },
  { nodeId: 'home-faq', selector: '#faq' },
  { nodeId: 'home-offices', selector: '#offices' },
  { nodeId: 'home-contact', selector: '#contact' },
];

const overlayStabilizerCss = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
    caret-color: transparent !important;
  }
  [data-builder-toast],
  [data-save-status-chip],
  [data-builder-ruler],
  [data-builder-floating-ui],
  [data-builder-inspector-panel],
  [data-builder-stage-toolbar],
  [class*="inspectorColumn"],
  [class*="inspectorPlaceholder"],
  .builder-editor-ruler,
  [id*="chat" i],
  [class*="chat" i],
  [class*="eventPopup" i],
  [class*="floating-ai-chat" i],
  [class*="quick-contact" i],
  [class*="year-end-popup" i] {
    display: none !important;
  }
`;

async function stabilizeVisuals(page: Page): Promise<void> {
  await page.addStyleTag({ content: overlayStabilizerCss }).catch(() => undefined);
  await page.waitForFunction(() => document.fonts?.status === 'loaded').catch(() => undefined);
}

async function scrollBuilderSection(page: Page, nodeId: string): Promise<void> {
  await page
    .locator(`[data-builder-canvas-viewport="desktop"] [data-node-id="${nodeId}"]`)
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(nodeId === 'home-stats' ? 3_400 : 500);
}

async function scrollPublicSection(page: Page, spec: SectionSpec): Promise<void> {
  const locator = spec.nodeId === 'home-services'
    ? page.locator('section:has(.services-detail-list)').first()
    : page.locator(spec.selector).first();
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(spec.nodeId === 'home-stats' ? 3_400 : 500);
}

async function readBuilderSectionMetrics(page: Page): Promise<Record<string, SectionMetric>> {
  return page.evaluate((sectionSpecs) => {
    const stage = document.querySelector('[data-builder-canvas-viewport="desktop"]');
    if (!(stage instanceof HTMLElement)) throw new Error('builder_stage_missing');

    const stageRect = stage.getBoundingClientRect();
    const scale = stage.offsetWidth > 0 ? stageRect.width / stage.offsetWidth : 1;
    const metrics: Record<string, SectionMetric> = {};

    for (const spec of sectionSpecs) {
      const node = stage.querySelector(`[data-node-id="${spec.nodeId}"]`);
      const section = spec.nodeId === 'home-services'
        ? node?.querySelector('section')
        : node?.querySelector(spec.selector);
      if (!(node instanceof HTMLElement) || !(section instanceof HTMLElement)) {
        throw new Error(`builder_section_missing:${spec.nodeId}`);
      }

      const sectionRect = section.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const revealTarget = section.querySelector('.reveal-stagger') ?? section;
      const images = Array.from(section.querySelectorAll('img'));

      metrics[spec.nodeId] = {
        y: Math.round((sectionRect.y - stageRect.y) / scale),
        height: Math.round(sectionRect.height / scale),
        nodeHeight: Math.round(nodeRect.height / scale),
        font: getComputedStyle(section).fontFamily,
        text: section.textContent?.trim().replace(/\s+/g, ' ') ?? '',
        revealOpacity: getComputedStyle(revealTarget).opacity,
        numbers: Array.from(section.querySelectorAll('.stat-number')).map((element) => (
          element.textContent?.trim() ?? ''
        )),
        imageCount: images.length,
        incompleteImages: images.filter((image) => !image.complete || image.naturalWidth <= 0).length,
      };
    }

    return metrics;
  }, SECTION_SPECS);
}

async function readPublicSectionMetrics(page: Page): Promise<Record<string, SectionMetric>> {
  return page.evaluate((sectionSpecs) => {
    const hero = document.querySelector('#hero');
    if (!(hero instanceof HTMLElement)) throw new Error('public_hero_missing');

    const originY = hero.getBoundingClientRect().y + window.scrollY;
    const metrics: Record<string, SectionMetric> = {};

    for (const spec of sectionSpecs) {
      const section = spec.nodeId === 'home-services'
        ? Array.from(document.querySelectorAll('section')).find((candidate) => (
            candidate.querySelector('.services-detail-list') !== null
          )) ?? null
        : document.querySelector(spec.selector);
      if (!(section instanceof HTMLElement)) {
        throw new Error(`public_section_missing:${spec.nodeId}`);
      }

      const sectionRect = section.getBoundingClientRect();
      const revealTarget = section.querySelector('.reveal-stagger') ?? section;
      const images = Array.from(section.querySelectorAll('img'));

      metrics[spec.nodeId] = {
        y: Math.round(sectionRect.y + window.scrollY - originY),
        height: Math.round(sectionRect.height),
        font: getComputedStyle(section).fontFamily,
        text: section.textContent?.trim().replace(/\s+/g, ' ') ?? '',
        revealOpacity: getComputedStyle(revealTarget).opacity,
        numbers: Array.from(section.querySelectorAll('.stat-number')).map((element) => (
          element.textContent?.trim() ?? ''
        )),
        imageCount: images.length,
        incompleteImages: images.filter((image) => !image.complete || image.naturalWidth <= 0).length,
      };
    }

    return metrics;
  }, SECTION_SPECS);
}

test('/ko/admin-builder composite home sections match public page metrics after real scrolling', async ({ page }) => {
  test.setTimeout(120_000);
  const token = Date.now().toString(36);
  const slug = `pw-home-sections-${token}`;
  let pageId: string | null = null;

  try {
    pageId = await createPublishedCompositeHomeTestPage(
      page.request,
      slug,
      `Home Composite Sections ${token}`,
    );

    await page.setViewportSize({ width: 1280, height: 1000 });

    await page.goto(`/ko/admin-builder?pageId=${pageId}&homeAllSectionFidelity=${token}`, { waitUntil: 'domcontentloaded' });
    await stabilizeVisuals(page);
    await expect(page.locator('[data-editor-shell]').first()).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });

    for (const spec of SECTION_SPECS) {
      await scrollBuilderSection(page, spec.nodeId);
    }
    const builderMetrics = await readBuilderSectionMetrics(page);

    await page.goto(`/ko/${slug}?homeAllSectionFidelity=${token}`, { waitUntil: 'domcontentloaded' });
    await stabilizeVisuals(page);
    for (const spec of SECTION_SPECS) {
      await scrollPublicSection(page, spec);
    }
    const publicMetrics = await readPublicSectionMetrics(page);

    for (const [index, spec] of SECTION_SPECS.entries()) {
      const builder = builderMetrics[spec.nodeId];
      const published = publicMetrics[spec.nodeId];
      expect(builder, `builder metrics missing for ${spec.nodeId}`).toBeDefined();
      expect(published, `public metrics missing for ${spec.nodeId}`).toBeDefined();
      if (!builder || !published) continue;

      if (index > 0) {
        const previousSpec = SECTION_SPECS[index - 1];
        if (previousSpec) {
          const previousBuilder = builderMetrics[previousSpec.nodeId];
          const previousPublished = publicMetrics[previousSpec.nodeId];
          expect(previousBuilder, `previous builder metrics missing for ${spec.nodeId}`).toBeDefined();
          expect(previousPublished, `previous public metrics missing for ${spec.nodeId}`).toBeDefined();
          if (previousBuilder && previousPublished) {
            const builderGap = builder.y - previousBuilder.y;
            const publishedGap = published.y - previousPublished.y;
            expect(Math.abs(builderGap - publishedGap), `${spec.nodeId} stacked y gap`).toBeLessThanOrEqual(3);
          }
        }
      }
      expect(Math.abs(builder.height - published.height), `${spec.nodeId} height`).toBeLessThanOrEqual(3);
      expect(Math.abs((builder.nodeHeight ?? builder.height) - published.height), `${spec.nodeId} node height`).toBeLessThanOrEqual(3);
      expect(builder.font, `${spec.nodeId} font`).toBe(published.font);
      expect(builder.text, `${spec.nodeId} text`).toBe(published.text);
      expect(builder.revealOpacity, `${spec.nodeId} builder reveal opacity`).toBe('1');
      expect(published.revealOpacity, `${spec.nodeId} public reveal opacity`).toBe('1');
      expect(builder.numbers, `${spec.nodeId} stat numbers`).toEqual(published.numbers);
      expect(builder.imageCount, `${spec.nodeId} image count`).toBe(published.imageCount);
      expect(builder.incompleteImages, `${spec.nodeId} builder images`).toBe(0);
      expect(published.incompleteImages, `${spec.nodeId} public images`).toBe(0);
    }
  } finally {
    await deleteBuilderTestPage(page.request, pageId);
  }
});
