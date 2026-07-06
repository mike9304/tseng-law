import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { STANDARD_PAGE_DECOMPOSERS } from '@/lib/builder/canvas/seed-pages';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

type ApiResponse = Awaited<ReturnType<APIRequestContext['post']>>;

type ContainmentIssue = {
  readonly parentId: string;
  readonly childId: string;
  readonly parent: { readonly left: number; readonly right: number; readonly top: number; readonly bottom: number };
  readonly child: { readonly left: number; readonly right: number; readonly top: number; readonly bottom: number };
};

type OverlapIssue = {
  readonly leftId: string;
  readonly rightId: string;
  readonly overlapWidth: number;
  readonly overlapHeight: number;
};

type PageHeaderLayout = {
  readonly headerBottom: number;
  readonly titleBottom: number;
};

const SERVICE_ICON_NODE_PATTERN = /^home-services-card-([0-5])-icon-svg$/;

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'decomposed-standard';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function createLegacyServicesIconDocument(document: BuilderCanvasDocument): BuilderCanvasDocument {
  return {
    ...document,
    nodes: document.nodes.map((node) => {
      if (node.kind !== 'image') return node;
      const iconIndex = SERVICE_ICON_NODE_PATTERN.exec(node.id)?.[1];
      if (typeof iconIndex !== 'string') return node;
      const { svg: _svg, ...contentWithoutSvg } = node.content;
      return {
        ...node,
        content: {
          ...contentWithoutSvg,
          src: `/images/home-services/icon-${iconIndex}.svg`,
        },
      };
    }),
  };
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
  let response: ApiResponse | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await request.post('/api/builder/site/pages', {
      data: { locale: 'ko', slug, title, document },
      headers: mutationHeaders(slug),
    });
    if (!(await waitForRateLimit(response))) break;
  }
  if (!response) {
    throw new Error('Failed to create a standard-page fidelity fixture.');
  }

  const createPayload = (await response.json()) as { readonly success?: boolean; readonly pageId?: string; readonly error?: string };
  expect(response.status(), JSON.stringify(createPayload)).toBe(200);
  expect(createPayload.success, createPayload.error).toBe(true);
  const pageId = createPayload.pageId;
  if (typeof pageId !== 'string' || pageId.length === 0) {
    throw new Error('Standard-page fidelity fixture did not return a page id.');
  }

  const publishResponse = await request.post(`/api/builder/site/pages/${pageId}/publish`, {
    data: {},
    headers: mutationHeaders(`${slug}-publish`),
  });
  const publishPayload = (await publishResponse.json()) as { readonly ok?: boolean; readonly error?: string };
  expect(publishResponse.status(), JSON.stringify(publishPayload)).toBe(200);
  expect(publishPayload.ok, publishPayload.error).toBe(true);

  return pageId;
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

async function readAttorneyCardLayoutIssues(page: Page): Promise<{
  readonly containmentIssues: readonly ContainmentIssue[];
  readonly overlapIssues: readonly OverlapIssue[];
  readonly visibleCardCount: number;
}> {
  return page.evaluate(() => {
    const rectFor = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
      };
    };

    const cardNodes = Array.from(document.querySelectorAll('[data-node-id^="page-lawyers-staff-card-"]'))
      .filter((element): element is HTMLElement => {
        const nodeId = element.getAttribute('data-node-id') ?? '';
        return /^page-lawyers-staff-card-\d+$/.test(nodeId) && element instanceof HTMLElement;
      });

    const containmentIssues: ContainmentIssue[] = [];
    const childGroups = [
      ['photo'],
      ['info'],
      ['name-link', 'name'],
      ['role'],
      ['email'],
      ['actions'],
    ] as const;
    for (const card of cardNodes) {
      const parentId = card.getAttribute('data-node-id') ?? '';
      const parent = rectFor(card);
      for (const group of childGroups) {
        const child = group
          .map((suffix) => ({
            id: `${parentId}-${suffix}`,
            element: document.querySelector(`[data-node-id="${parentId}-${suffix}"]`),
          }))
          .find((candidate): candidate is { readonly id: string; readonly element: HTMLElement } => (
            candidate.element instanceof HTMLElement
          ));
        if (!child) {
          containmentIssues.push({
            parentId,
            childId: group.map((suffix) => `${parentId}-${suffix}`).join('|'),
            parent,
            child: { left: 0, right: 0, top: 0, bottom: 0 },
          });
          continue;
        }

        const childRect = rectFor(child.element);
        if (
          childRect.left < parent.left - 2
          || childRect.right > parent.right + 2
          || childRect.top < parent.top - 2
          || childRect.bottom > parent.bottom + 2
        ) {
          containmentIssues.push({ parentId, childId: child.id, parent, child: childRect });
        }
      }
    }

    const overlapIssues: OverlapIssue[] = [];
    for (let leftIndex = 0; leftIndex < cardNodes.length; leftIndex += 1) {
      const left = cardNodes[leftIndex];
      if (!left) continue;
      const leftRect = left.getBoundingClientRect();
      for (let rightIndex = leftIndex + 1; rightIndex < cardNodes.length; rightIndex += 1) {
        const right = cardNodes[rightIndex];
        if (!right) continue;
        const rightRect = right.getBoundingClientRect();
        const overlapWidth = Math.max(0, Math.min(leftRect.right, rightRect.right) - Math.max(leftRect.left, rightRect.left));
        const overlapHeight = Math.max(0, Math.min(leftRect.bottom, rightRect.bottom) - Math.max(leftRect.top, rightRect.top));
        if (overlapWidth > 2 && overlapHeight > 2) {
          overlapIssues.push({
            leftId: left.getAttribute('data-node-id') ?? '',
            rightId: right.getAttribute('data-node-id') ?? '',
            overlapWidth: Math.round(overlapWidth),
            overlapHeight: Math.round(overlapHeight),
          });
        }
      }
    }

    return {
      containmentIssues,
      overlapIssues,
      visibleCardCount: cardNodes.filter((card) => {
        const rect = card.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }).length,
    };
  });
}

async function readPageHeaderLayout(page: Page): Promise<PageHeaderLayout> {
  return page.evaluate(() => {
    const header = document.querySelector('[data-node-id="page-lawyers-page-header-root"] .page-header');
    const title = document.querySelector('[data-node-id="page-lawyers-page-header-title"]');
    if (!(header instanceof HTMLElement) || !(title instanceof HTMLElement)) {
      throw new Error('Published lawyers page header nodes were not rendered.');
    }
    const headerRect = header.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    return {
      headerBottom: Math.round(headerRect.bottom),
      titleBottom: Math.round(titleRect.bottom),
    };
  });
}

test('published decomposed lawyers page keeps staff card content inside each card', async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const slug = `decomposed-lawyers-${token}`;
  let pageId: string | null = null;

  try {
    const buildLawyersDocument = STANDARD_PAGE_DECOMPOSERS['lawyers'];
    if (!buildLawyersDocument) {
      throw new Error('Missing standard lawyers page decomposer.');
    }
    const lawyersDocument = {
      ...buildLawyersDocument('ko'),
      updatedAt: new Date().toISOString(),
      updatedBy: `decomposed-standard-fidelity-${token}`,
    };
    const expectedStaffCardCount = lawyersDocument.nodes.filter((node) => (
      /^page-lawyers-staff-card-\d+$/.test(node.id)
    )).length;
    expect(expectedStaffCardCount).toBeGreaterThan(0);
    pageId = await createPublishedPage(page.request, slug, `Decomposed lawyers ${token}`, lawyersDocument);

    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto(`/ko/${slug}?decomposedStandard=${token}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.fonts?.status === 'loaded').catch(() => undefined);
    await expect(page.locator('[data-node-id="page-lawyers-staff-grid"]')).toBeVisible();
    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath('decomposed-lawyers-page.png'),
    });

    const layoutIssues = await readAttorneyCardLayoutIssues(page);
    const pageHeaderLayout = await readPageHeaderLayout(page);
    expect(layoutIssues.visibleCardCount).toBe(expectedStaffCardCount);
    expect(layoutIssues.containmentIssues).toEqual([]);
    expect(layoutIssues.overlapIssues).toEqual([]);
    expect(pageHeaderLayout.headerBottom).toBeGreaterThan(pageHeaderLayout.titleBottom + 24);
  } finally {
    await deleteBuilderTestPage(page.request, pageId);
  }
});

test('published decomposed services page normalizes legacy service icon assets to inline SVGs', async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const slug = `decomposed-services-${token}`;
  let pageId: string | null = null;

  try {
    const buildServicesDocument = STANDARD_PAGE_DECOMPOSERS['services'];
    if (!buildServicesDocument) {
      throw new Error('Missing standard services page decomposer.');
    }
    const servicesDocument = createLegacyServicesIconDocument({
      ...buildServicesDocument('ko'),
      updatedAt: new Date().toISOString(),
      updatedBy: `decomposed-standard-services-icons-${token}`,
    });
    const expectedIconCount = servicesDocument.nodes.filter((node) => (
      node.kind === 'image' && /^home-services-card-\d+-icon-svg$/.test(node.id)
    )).length;
    expect(expectedIconCount).toBeGreaterThan(0);
    pageId = await createPublishedPage(page.request, slug, `Decomposed services ${token}`, servicesDocument);

    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto(`/ko/${slug}?decomposedStandard=${token}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.fonts?.status === 'loaded').catch(() => undefined);
    await expect(page.locator('[data-node-id="home-services-card-0-icon-svg"] [data-builder-media-widget="inline-svg"] svg')).toBeVisible();
    for (let index = 0; index < expectedIconCount; index += 1) {
      await page.locator(`[data-node-id="home-services-card-${index}"]`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath('decomposed-services-icons.png'),
    });

    const iconReport = await page.evaluate(() => (
      Array.from(document.querySelectorAll('[data-node-id^="home-services-card-"][data-node-id$="-icon-svg"]'))
        .map((element) => {
          const media = element.querySelector('[data-builder-media-widget]');
          const svg = media?.querySelector('svg') ?? null;
          const svgRect = svg?.getBoundingClientRect();
          return {
            nodeId: element.getAttribute('data-node-id') ?? '',
            widget: media?.getAttribute('data-builder-media-widget') ?? null,
            viewBox: svg?.getAttribute('viewBox') ?? null,
            imageSrcs: Array.from(element.querySelectorAll('img')).map((image) => image.getAttribute('src') ?? ''),
            pathData: Array.from(svg?.querySelectorAll('path') ?? []).map((path) => path.getAttribute('d') ?? ''),
            width: svgRect ? Math.round(svgRect.width) : 0,
            height: svgRect ? Math.round(svgRect.height) : 0,
          };
        })
    ));
    const cardOpacities = await page.evaluate(() => (
      Array.from(document.querySelectorAll('[data-node-id^="home-services-card-"]'))
        .filter((element) => /^home-services-card-\d+$/.test(element.getAttribute('data-node-id') ?? ''))
        .map((element) => Number.parseFloat(window.getComputedStyle(element).opacity))
    ));

    expect(iconReport).toHaveLength(expectedIconCount);
    expect(iconReport.every((icon) => icon.widget === 'inline-svg')).toBe(true);
    expect(iconReport.every((icon) => icon.viewBox === '0 0 24 24')).toBe(true);
    expect(iconReport.every((icon) => icon.imageSrcs.length === 0)).toBe(true);
    expect(iconReport.every((icon) => icon.width > 0 && icon.height > 0)).toBe(true);
    expect(iconReport[0]?.pathData).toContain('M4 18h16');
    expect(cardOpacities).toHaveLength(expectedIconCount);
    expect(cardOpacities.every((opacity) => opacity > 0.99)).toBe(true);
  } finally {
    await deleteBuilderTestPage(page.request, pageId);
  }
});
