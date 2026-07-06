import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { STANDARD_PAGE_DECOMPOSERS } from '@/lib/builder/canvas/seed-pages';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { openBuilder } from './helpers/editor';

type ApiResponse = Awaited<ReturnType<APIRequestContext['post']>>;

type ReviewLayoutMetric = {
  readonly root: { readonly height: number };
  readonly header: { readonly y: number; readonly height: number };
  readonly section: { readonly y: number; readonly height: number };
  readonly formWrap: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
  readonly note: { readonly y: number; readonly height: number };
  readonly listTitle: { readonly y: number; readonly height: number };
  readonly empty: { readonly y: number; readonly height: number };
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'reviews-layout-parity';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: ApiResponse): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

async function createPublishedPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  document: BuilderCanvasDocument,
): Promise<string> {
  const prewarmResponse = await request.get('/api/builder/site/pages?locale=ko', {
    headers: mutationHeaders(`${slug}-prewarm`),
  });
  const prewarmBody = await prewarmResponse.text();
  expect(prewarmResponse.status(), prewarmBody.slice(0, 500)).toBe(200);

  let response: ApiResponse | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await request.post('/api/builder/site/pages', {
      data: { locale: 'ko', slug, title, document },
      headers: mutationHeaders(slug),
    });
    if (!(await waitForRateLimit(response))) break;
  }
  if (!response) throw new Error('reviews_layout_create_missing_response');

  const createBody = await response.text();
  expect(response.status(), createBody.slice(0, 500)).toBe(200);
  const createPayload = JSON.parse(createBody) as { readonly success?: boolean; readonly pageId?: string; readonly error?: string };
  expect(createPayload.success, createPayload.error).toBe(true);
  if (!createPayload.pageId) throw new Error('reviews_layout_page_id_missing');

  const publishResponse = await request.post(`/api/builder/site/pages/${createPayload.pageId}/publish`, {
    data: {},
    headers: mutationHeaders(`${slug}-publish`),
  });
  const publishBody = await publishResponse.text();
  expect(publishResponse.status(), publishBody.slice(0, 500)).toBe(200);
  const publishPayload = JSON.parse(publishBody) as { readonly ok?: boolean; readonly error?: string };
  expect(publishPayload.ok, publishPayload.error).toBe(true);
  return createPayload.pageId;
}

async function deleteBuilderTestPage(request: APIRequestContext, pageId: string | null): Promise<void> {
  if (!pageId) return;
  await request
    .delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
      headers: mutationHeaders(`${pageId}-delete`),
      failOnStatusCode: false,
    })
    .catch(() => undefined);
}

async function readReviewLayoutMetric(page: Page): Promise<ReviewLayoutMetric> {
  return page.evaluate(() => {
    const root = document.querySelector('.builder-pub-main, main');
    const header = document.querySelector('.builder-pub-main .page-header, main .page-header');
    const section = document.querySelector('.builder-pub-main .review-section, main .review-section');
    const formWrap = document.querySelector('.builder-pub-main .review-form-wrap, main .review-form-wrap');
    const listTitle = document.querySelector('.builder-pub-main .review-list-title, main .review-list-title');
    const emptyNodes = Array.from(document.querySelectorAll('.builder-pub-main .review-empty, main .review-empty'))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);
    const note = emptyNodes[0];
    const empty = emptyNodes[emptyNodes.length - 1];
    if (
      !(root instanceof HTMLElement)
      || !(header instanceof HTMLElement)
      || !(section instanceof HTMLElement)
      || !(formWrap instanceof HTMLElement)
      || !(listTitle instanceof HTMLElement)
      || !(note instanceof HTMLElement)
      || !(empty instanceof HTMLElement)
    ) {
      throw new Error('reviews_layout_metric_missing');
    }

    const rootRect = root.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const rootY = headerRect.y + window.scrollY;
    const rootHeight = Math.round(
      Math.max(headerRect.bottom + window.scrollY, sectionRect.bottom + window.scrollY) - rootY,
    );
    const box = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.x - rootRect.x),
        y: Math.round(rect.y + window.scrollY - rootY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    };

    return {
      root: { height: rootHeight },
      header: box(header),
      section: box(section),
      formWrap: box(formWrap),
      note: box(note),
      listTitle: box(listTitle),
      empty: box(empty),
    };
  });
}

async function readBuilderReviewLayoutMetric(page: Page): Promise<ReviewLayoutMetric> {
  await expect(page.locator('[data-builder-canvas-viewport="desktop"] [data-node-id="page-reviews-section-root"]').first())
    .toBeAttached({ timeout: 15_000 });
  await page.waitForTimeout(200);

  return page.evaluate(() => {
    const stage = document.querySelector('[data-builder-canvas-viewport="desktop"]');
    if (!(stage instanceof HTMLElement)) throw new Error('reviews_builder_stage_missing');

    const stageRect = stage.getBoundingClientRect();
    const scale = stage.offsetWidth > 0 ? stageRect.width / stage.offsetWidth : 1;
    const boxForElement = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round((rect.x - stageRect.x) / scale),
        y: Math.round((rect.y - stageRect.y) / scale),
        width: Math.round(rect.width / scale),
        height: Math.round(rect.height / scale),
      };
    };
    const box = (selector: string) => {
      const element = stage.querySelector(selector);
      if (!(element instanceof HTMLElement)) throw new Error(`reviews_builder_metric_missing:${selector}`);
      return boxForElement(element);
    };
    const emptyNodes = Array.from(stage.querySelectorAll('.review-empty'))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);
    const note = emptyNodes[0];
    const empty = emptyNodes[emptyNodes.length - 1];
    if (!(note instanceof HTMLElement) || !(empty instanceof HTMLElement)) {
      throw new Error('reviews_builder_empty_metric_missing');
    }

    const header = box('[data-node-id="page-reviews-page-header-root"] .page-header');
    const section = box('[data-node-id="page-reviews-section-root"] .review-section');
    return {
      root: { height: section.y + section.height },
      header,
      section,
      formWrap: box('[data-node-id="page-reviews-form-wrap"] .review-form-wrap'),
      note: boxForElement(note),
      listTitle: box('[data-node-id="page-reviews-list-title"] .review-list-title'),
      empty: boxForElement(empty),
    };
  });
}

test('published decomposed reviews page matches canonical public reviews layout geometry', async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const slug = `decomposed-reviews-${token}`;
  let pageId: string | null = null;

  try {
    const buildReviewsDocument = STANDARD_PAGE_DECOMPOSERS.reviews;
    if (!buildReviewsDocument) throw new Error('Missing standard reviews page decomposer.');
    const reviewsDocument = {
      ...buildReviewsDocument('ko'),
      updatedAt: new Date().toISOString(),
      updatedBy: `reviews-layout-parity-${token}`,
    };
    pageId = await createPublishedPage(page.request, slug, `Decomposed reviews ${token}`, reviewsDocument);

    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto(`/ko/reviews?reviewsLayoutParity=${token}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.fonts?.status === 'loaded').catch(() => undefined);
    await page.locator('.builder-pub-main, main').first().screenshot({
      path: testInfo.outputPath('canonical-reviews-page.png'),
    });
    const canonical = await readReviewLayoutMetric(page);

    await page.goto(`/ko/${slug}?reviewsLayoutParity=${token}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.fonts?.status === 'loaded').catch(() => undefined);
    await page.locator('.builder-pub-main, main').first().screenshot({
      path: testInfo.outputPath('decomposed-reviews-page.png'),
    });
    const decomposed = await readReviewLayoutMetric(page);
    const { root: canonicalRoot, ...canonicalBoxes } = canonical;
    const { root: decomposedRoot, ...decomposedBoxes } = decomposed;

    expect(decomposedBoxes).toEqual(canonicalBoxes);
    expect(Math.abs(decomposedRoot.height - canonicalRoot.height)).toBeLessThanOrEqual(1);
    expect(canonicalRoot.height).toBe(1711);
    expect(decomposed.header).toMatchObject({ y: 0, height: 428 });
    expect(decomposed.section).toMatchObject({ y: 428, height: 1282 });

    await openBuilder(page, `/ko/admin-builder?pageId=${pageId}&reviewsLayoutParity=${token}`);
    await page.locator('[data-builder-canvas-viewport="desktop"]').first().screenshot({
      path: testInfo.outputPath('builder-reviews-canvas.png'),
    });
    const builder = await readBuilderReviewLayoutMetric(page);
    const { root: builderRoot, ...builderBoxes } = builder;
    await writeFile(
      testInfo.outputPath('reviews-layout-metrics.json'),
      `${JSON.stringify({ canonical, decomposed, builder }, null, 2)}\n`,
    );

    expect(builderBoxes).toEqual(canonicalBoxes);
    expect(Math.abs(builderRoot.height - canonicalRoot.height)).toBeLessThanOrEqual(1);
  } finally {
    await deleteBuilderTestPage(page.request, pageId);
  }
});
