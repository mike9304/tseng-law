import { readFile } from 'fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';
import { createFaqWithOverrides, deleteFaq } from './helpers/faq-app-fixture-api';

const SITE_ID = process.env.BUILDER_SITE_ID ?? 'tseng-law-main-site';

type FaqExplorerMetric = {
  readonly width: number;
  readonly height: number;
  readonly itemCount: number;
  readonly hasSearch: boolean;
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function resolveCanonicalFaqPageId(): Promise<string> {
  const rawSite = await readFile(`runtime-data/builder-site/${SITE_ID}/site.json`, 'utf8');
  const payload = JSON.parse(rawSite) as unknown;
  if (!isObjectRecord(payload) || !Array.isArray(payload.pages)) {
    throw new Error('standard_faq_pages_list_invalid');
  }

  const faqPage = payload.pages.find((page): page is Record<string, unknown> => (
    isObjectRecord(page)
      && page.locale === 'ko'
      && page.slug === 'faq'
      && typeof page.pageId === 'string'
  ));
  if (!faqPage) throw new Error('canonical_faq_page_missing');
  const pageId = faqPage.pageId;
  if (typeof pageId !== 'string') throw new Error('canonical_faq_page_id_missing');
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

async function readBuilderFaqMetric(page: Page): Promise<FaqExplorerMetric> {
  const explorer = page.locator('[data-builder-canvas-viewport="desktop"] [data-public-faq-explorer="true"]').first();
  await expect(explorer).toBeAttached({ timeout: 30_000 });
  await explorer.scrollIntoViewIfNeeded();
  await expect(explorer.locator('[data-public-faq-item]').first()).toBeAttached();

  return explorer.evaluate((explorerElement) => {
    const stage = explorerElement.closest('[data-builder-canvas-viewport="desktop"]');
    if (!(stage instanceof HTMLElement) || !(explorerElement instanceof HTMLElement)) {
      throw new Error('builder_faq_explorer_missing');
    }
    const stageRect = stage.getBoundingClientRect();
    const scale = stage.offsetWidth > 0 ? stageRect.width / stage.offsetWidth : 1;
    const rect = explorerElement.getBoundingClientRect();
    return {
      width: Math.round(rect.width / scale),
      height: Math.round(rect.height / scale),
      itemCount: explorerElement.querySelectorAll('[data-public-faq-item]').length,
      hasSearch: explorerElement.querySelector('input[type="search"]') !== null,
    };
  });
}

async function readPublicFaqMetric(page: Page): Promise<FaqExplorerMetric> {
  const explorer = page.locator('[data-public-faq-explorer="true"]').first();
  await expect(explorer).toBeAttached({ timeout: 30_000 });
  await expect(explorer.locator('[data-public-faq-item]').first()).toBeAttached();

  return page.evaluate(() => {
    const explorerElement = document.querySelector('[data-public-faq-explorer="true"]');
    if (!(explorerElement instanceof HTMLElement)) {
      throw new Error('public_faq_explorer_missing');
    }
    const rect = explorerElement.getBoundingClientRect();
    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      itemCount: explorerElement.querySelectorAll('[data-public-faq-item]').length,
      hasSearch: explorerElement.querySelector('input[type="search"]') !== null,
    };
  });
}

test('/ko/admin-builder FAQ page uses the same FAQ app layout data as the published FAQ page', async ({ page }) => {
  test.setTimeout(120_000);
  const token = Date.now().toString(36);
  const pageId = await resolveCanonicalFaqPageId();
  const faq = await createFaqWithOverrides(page.request, token, {
    question: `FAQ parity dynamic question ${token}`,
    answer: `FAQ parity dynamic answer ${token}`,
    categoryId: 'company-setup',
    sortOrder: 1,
  }, 'published');

  try {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await openBuilder(page, `/ko/admin-builder?pageId=${pageId}&standardFaqParity=${token}`);
    const builderExplorer = page.locator('[data-builder-canvas-viewport="desktop"] [data-public-faq-explorer="true"]').first();
    await expect(builderExplorer).toContainText(faq.question);
    const builderMetric = await readBuilderFaqMetric(page);

    await page.goto(`/ko/faq?standardFaqParity=${token}`, { waitUntil: 'domcontentloaded' });
    await stabilizePublicLayout(page);
    const publicExplorer = page.locator('[data-public-faq-explorer="true"]').first();
    await expect(publicExplorer).toContainText(faq.question);
    const publicMetric = await readPublicFaqMetric(page);

    expect(builderMetric.hasSearch).toBe(true);
    expect(publicMetric.hasSearch).toBe(true);
    expect(builderMetric.itemCount).toBe(publicMetric.itemCount);
    expect(Math.abs(builderMetric.width - publicMetric.width), 'FAQ explorer width').toBeLessThanOrEqual(3);
    expect(Math.abs(builderMetric.height - publicMetric.height), 'FAQ explorer height').toBeLessThanOrEqual(8);
  } finally {
    await deleteFaq(page.request, faq.faqId, token);
  }
});
