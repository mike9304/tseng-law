import { expect, test, type Page } from '@playwright/test';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { openBuilder } from './helpers/editor';

type DynamicDraftNode = {
  id?: string;
  kind?: string;
  parentId?: string;
  dataBinding?: {
    targetId?: string;
    recordIndex?: number;
    fields?: Record<string, string>;
  };
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-list-pages';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeCmsCollection(
  collectionId: BuilderCmsCollection['collectionId'],
  overrides: Partial<BuilderCmsCollection> = {},
): BuilderCmsCollection {
  return {
    collectionId,
    name: collectionId === 'columns' ? 'Columns' : collectionId,
    slug: collectionId,
    description: collectionId === 'columns' ? 'CMS columns' : `CMS ${collectionId}`,
    localized: true,
    fields: [],
    indexes: [],
    records: [],
    permissions: { read: ['public'], create: ['staff'], update: ['staff'], delete: ['staff'] },
    createdAt: '2026-05-30T00:00:00.000Z',
    updatedAt: '2026-05-30T00:00:00.000Z',
    ...overrides,
  };
}

async function selectLayerNode(page: Page, nodeId: string): Promise<void> {
  const layersPanel = page.locator('[data-builder-layers-panel="true"]').first();
  if (!(await layersPanel.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /^Layers$|^레이어$/ }).click({ force: true });
    await expect(layersPanel).toBeVisible();
  }
  await page.locator('[data-builder-layer-search="true"]').fill(nodeId);
  const layerRow = page.locator(`[data-builder-layer-row="${nodeId}"]`).first();
  await expect(layerRow).toBeVisible();
  const canvasNode = page.locator(`[data-node-id="${nodeId}"]`).first();
  const isSelected = async () => (await canvasNode.getAttribute('data-selected').catch(() => null)) === 'true';

  await layerRow.click({ force: true, position: { x: 90, y: 18 } }).catch(() => undefined);
  if (!(await isSelected())) {
    await layerRow.press('Enter').catch(() => undefined);
  }
  if (!(await isSelected())) {
    await canvasNode.scrollIntoViewIfNeeded().catch(() => undefined);
    await canvasNode.click({ force: true, position: { x: 16, y: 16 } }).catch(() => undefined);
  }
  if (!(await isSelected())) {
    await canvasNode.scrollIntoViewIfNeeded().catch(() => undefined);
    await canvasNode.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const clientX = rect.left + Math.min(16, Math.max(1, rect.width / 2));
      const clientY = rect.top + Math.min(16, Math.max(1, rect.height / 2));
      element.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        button: 0,
        buttons: 1,
        clientX,
        clientY,
        pointerId: 1,
        pointerType: 'mouse',
      }));
      element.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true,
        cancelable: true,
        button: 0,
        buttons: 0,
        clientX,
        clientY,
        pointerId: 1,
        pointerType: 'mouse',
      }));
    }).catch(() => undefined);
  }
  await expect(canvasNode).toHaveAttribute('data-selected', 'true');
}

async function readDraftNodes(page: Page, pageId: string, scope: string): Promise<DynamicDraftNode[]> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { document?: { nodes?: DynamicDraftNode[] } };
  return payload.document?.nodes ?? [];
}

test('/ko/admin-builder creates, previews, and publishes a CMS dynamic list page', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-columns-${token}`;
  let pageId: string | null = null;

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Dynamic columns ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'columns',
        dynamicListFilters: [{ fieldId: 'title', operator: 'contains', value: '대만' }],
        dynamicListLimit: 2,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: {
        slug?: string;
        dynamicList?: {
          kind?: string;
          collectionId?: string;
          targetId?: string;
          filters?: Array<{ fieldId: string; operator: string; value: string }>;
          limit?: number;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicList).toMatchObject({
      kind: 'collection-list-v1',
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      filters: [{ fieldId: 'title', operator: 'contains', value: '대만' }],
      limit: 2,
    });

    const nodes = await readDraftNodes(page, pageId!, slug);
    const repeater = nodes.find((node) => node.id === 'dynamic-list-repeater-columns');
    const image = nodes.find((node) => node.id === 'dynamic-list-card-image-columns');
    const title = nodes.find((node) => node.id === 'dynamic-list-card-title-columns');
    const summary = nodes.find((node) => node.id === 'dynamic-list-card-summary-columns');
    const button = nodes.find((node) => node.id === 'dynamic-list-card-button-columns');
    expect(repeater?.dataBinding).toMatchObject({
      targetId: 'home.insights.feed',
      fields: { title: 'title', description: 'summary', src: 'featuredImage' },
    });
    expect(image?.dataBinding?.fields).toEqual({ src: 'featuredImage', alt: 'title', href: 'href' });
    expect(title?.dataBinding?.fields).toEqual({ text: 'title', href: 'href' });
    expect(summary?.dataBinding?.fields).toEqual({ text: 'summary' });
    expect(button?.dataBinding?.fields).toEqual({ href: 'href' });

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&dynamicListPage=${token}`);
    await selectLayerNode(page, 'dynamic-list-repeater-columns');
    const repeaterNode = page.locator('[data-node-id="dynamic-list-repeater-columns"]').first();
    const repeaterHud = repeaterNode.locator('[data-builder-repeater-template-hud="true"]').first();
    await expect(repeaterHud).toBeVisible();
    await expect(repeaterHud.locator('[data-builder-repeater-template-status="true"]')).toContainText(
      /Template 4\/4 bound|템플릿 4\/4개 연결됨/,
    );
    await expect(repeaterHud.locator('[data-builder-repeater-template-record="true"]')).toContainText(
      /Record 1 of 2|레코드 1 \/ 2/,
    );

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${published.slug ?? slug}`, { waitUntil: 'domcontentloaded' });
    const publishedRepeater = page.locator('[data-node-id="dynamic-list-repeater-columns"]');
    await expect(publishedRepeater).toBeVisible();
    await expect(publishedRepeater).not.toContainText('Record title');
    await expect(publishedRepeater).not.toContainText('Record summary');
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder published CMS dynamic list page honors visitor filters', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-columns-filter-${token}`;
  let pageId: string | null = null;

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Dynamic columns filter ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'columns',
        dynamicListLimit: 6,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: { dynamicList?: { kind?: string; collectionId?: string; targetId?: string; limit?: number } };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicList).toMatchObject({
      kind: 'collection-list-v1',
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      limit: 6,
    });

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${published.slug ?? slug}?filter[title]=헬스장`, { waitUntil: 'domcontentloaded' });
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toBeVisible();
    await expect(visitorFilters).toContainText('title contains 헬스장');
    const clearFiltersLink = visitorFilters.getByRole('link', { name: 'Clear filters' });
    await expect(clearFiltersLink).toHaveAttribute('href', `/ko/${published.slug ?? slug}`);
    await Promise.all([
      page.waitForURL((url) => url.pathname.endsWith(`/${published.slug ?? slug}`) && url.search === ''),
      clearFiltersLink.click(),
    ]);
    await expect(page.getByLabel('Dynamic list visitor filters')).toHaveCount(0);
    const publishedRepeater = page.locator('[data-node-id="dynamic-list-repeater-columns"]');
    await expect(publishedRepeater).toBeVisible();
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder published CMS dynamic list page preserves visitor filters on unmatched queries', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-columns-empty-${token}`;
  let pageId: string | null = null;

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Dynamic columns empty ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'columns',
        dynamicListLimit: 6,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: { dynamicList?: { kind?: string; collectionId?: string; targetId?: string; limit?: number } };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicList).toMatchObject({
      kind: 'collection-list-v1',
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      limit: 6,
    });

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${published.slug ?? slug}?filter[title]=${encodeURIComponent(`does-not-exist-${token}`)}`, {
      waitUntil: 'domcontentloaded',
    });
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toBeVisible();
    await expect(visitorFilters).toContainText('title contains');
    const publishedRepeater = page.locator('[data-node-id="dynamic-list-repeater-columns"]');
    await expect(publishedRepeater).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/ko/${published.slug ?? slug}?filter[title]=${encodeURIComponent(`does-not-exist-${token}`)}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByLabel('Dynamic list visitor filters')).toBeVisible();
    await expect(page.locator('[data-node-id="dynamic-list-repeater-columns"]')).toBeVisible();

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto(`/ko/${published.slug ?? slug}?filter[title]=${encodeURIComponent(`does-not-exist-${token}`)}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByLabel('Dynamic list visitor filters')).toBeVisible();
    await expect(page.locator('[data-node-id="dynamic-list-repeater-columns"]')).toBeVisible();
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder published CMS service dynamic list page matches filters against bound fields', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-service-fields-${token}`;
  const primarySlug = `cms-service-field-primary-${token}`;
  const secondarySlug = `cms-service-field-secondary-${token}`;
  let pageId: string | null = null;
  const originalSite = await readSiteDocument('default', 'ko');

  try {
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'service-areas'),
        makeCmsCollection('service-areas', {
          records: [
            {
              recordId: primarySlug,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: primarySlug,
                title: `Field Match Title ${token}`,
                subtitle: `Primary subtitle ${token}`,
                intro: `Primary intro ${token}`,
                keyPoints: [`${token} point A`, `${token} point B`],
                columnSlugs: ['cms-column-published'],
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
            {
              recordId: secondarySlug,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: secondarySlug,
                title: `Primary Service ${token}`,
                subtitle: `Field Match Title ${token} appears in subtitle only`,
                intro: `Field Match Title ${token} appears in subtitle only`,
                keyPoints: [`${token} point C`, `${token} point D`],
                columnSlugs: ['cms-column-published'],
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
        }),
      ],
      updatedAt: new Date().toISOString(),
    });

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `CMS service field filters ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'service-areas',
        dynamicListLimit: 2,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    const publicPath = `/ko/${published.slug ?? slug}`;
    await page.goto(`${publicPath}?filter[title]=Field%20Match%20Title%20${token}`, { waitUntil: 'domcontentloaded' });
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toBeVisible();
    await expect(visitorFilters).toContainText(`title contains Field Match Title ${token}`);
    await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"] [data-builder-repeater-item="true"]:visible')).toHaveCount(1);
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-service-areas"]').first()).toContainText(`Field Match Title ${token}`);
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-service-areas"]').first()).not.toContainText(`Primary Service ${token}`);

    await page.goto(`${publicPath}?filter[description]=appears%20in%20subtitle%20only`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('description contains appears in subtitle only');
    await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"] [data-builder-repeater-item="true"]:visible')).toHaveCount(1);
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-service-areas"]').first()).toContainText(`Primary Service ${token}`);
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-service-areas"]').first()).not.toContainText(`Field Match Title ${token}`);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder renders a CMS-backed dynamic list page from site.cmsCollections', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-cms-${token}`;
  let pageId: string | null = null;
  const originalSite = await readSiteDocument('default', 'ko');

  try {
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'columns'),
        makeCmsCollection('columns', {
          records: [
            {
              recordId: `cms-column-one-${token}`,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: `cms-column-one-${token}`,
                title: `CMS Column One ${token}`,
                summary: `CMS column summary one ${token}`,
                category: 'legal',
                categoryLabel: 'Legal Information',
                date: '2026-05-30',
                featuredImage: { url: '/images/placeholder-article-hero.jpg' },
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
            {
              recordId: `cms-column-two-${token}`,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: `cms-column-two-${token}`,
                title: `CMS Column Two ${token}`,
                summary: `CMS column summary two ${token}`,
                category: 'legal',
                categoryLabel: 'Legal Information',
                date: '2026-05-29',
                featuredImage: { url: '/images/placeholder-article-hero.jpg' },
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
        }),
      ],
      updatedAt: new Date().toISOString(),
    });

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `CMS dynamic columns ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'columns',
        dynamicListLimit: 2,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: {
        dynamicList?: {
          kind?: string;
          collectionId?: string;
          targetId?: string;
          limit?: number;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicList).toMatchObject({
      kind: 'collection-list-v1',
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      limit: 2,
    });

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; error?: string; slug?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${published.slug ?? slug}`, { waitUntil: 'domcontentloaded' });
    const publishedRepeater = page.locator('[data-node-id="dynamic-list-repeater-columns"]');
    await expect(publishedRepeater).toBeVisible();
    await expect(publishedRepeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
    const firstVisibleTitle = publishedRepeater.locator('[data-node-id^="dynamic-list-card-title-columns"]').first();
    await expect(firstVisibleTitle).toContainText(`CMS Column One ${token}`);
  } finally {
    if (pageId) {
    await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder published CMS dynamic list page reflects CMS record edits on reload', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-cms-update-${token}`;
  const initialFirstTitle = `CMS List One ${token}`;
  const updatedFirstTitle = `CMS List One Changed ${token}`;
  const initialFirstSummary = `CMS list summary one ${token}`;
  const updatedFirstSummary = `CMS list summary one changed ${token}`;
  let pageId: string | null = null;
  const originalSite = await readSiteDocument('default', 'ko');
  const seededSite = {
    ...originalSite,
    cmsCollections: [
      ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'columns'),
      makeCmsCollection('columns', {
        records: [
          {
            recordId: `cms-list-one-${token}`,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: `cms-list-one-${token}`,
              title: initialFirstTitle,
              summary: initialFirstSummary,
              category: 'legal',
              categoryLabel: 'Legal Information',
              date: '2026-05-30',
              featuredImage: { url: '/images/placeholder-article-hero.jpg' },
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
          {
            recordId: `cms-list-two-${token}`,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: `cms-list-two-${token}`,
              title: `CMS List Two ${token}`,
              summary: `CMS list summary two ${token}`,
              category: 'legal',
              categoryLabel: 'Legal Information',
              date: '2026-05-29',
              featuredImage: { url: '/images/placeholder-article-hero.jpg' },
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
        ],
      }),
    ],
    updatedAt: new Date().toISOString(),
  };

  try {
    await writeSiteDocument(seededSite);

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `CMS list update ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'columns',
        dynamicListLimit: 2,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: {
        dynamicList?: {
          kind?: string;
          collectionId?: string;
          targetId?: string;
          limit?: number;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicList).toMatchObject({
      kind: 'collection-list-v1',
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      limit: 2,
    });

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    const publicPath = `/ko/${published.slug ?? slug}`;
    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    const publishedRepeater = page.locator('[data-node-id="dynamic-list-repeater-columns"]');
    await expect(publishedRepeater).toBeVisible();
    await expect(publishedRepeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
    const firstVisibleTitle = publishedRepeater.locator('[data-node-id^="dynamic-list-card-title-columns"]').first();
    await expect(firstVisibleTitle).toContainText(initialFirstTitle);

    const updatedSite = {
      ...seededSite,
      cmsCollections: (seededSite.cmsCollections ?? []).map((collection) => {
        if (collection.collectionId !== 'columns') return collection;
        return {
          ...collection,
          records: collection.records.map((record) => (
            record.recordId === `cms-list-one-${token}`
              ? {
                  ...record,
                  fields: {
                    ...record.fields,
                    title: updatedFirstTitle,
                    summary: updatedFirstSummary,
                    content: updatedFirstSummary,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : record
          )),
          updatedAt: new Date().toISOString(),
        };
      }),
      updatedAt: new Date().toISOString(),
    };

    await writeSiteDocument(updatedSite);

    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-list-repeater-columns"]')).toBeVisible();
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-columns"]').first()).toContainText(updatedFirstTitle);
    await expect(page.locator('[data-node-id^="dynamic-list-card-summary-columns"]').first()).toContainText(updatedFirstSummary);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder published CMS service dynamic list page reflects CMS record edits on reload', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-service-runtime-update-${token}`;
  const serviceSlug = `cms-service-runtime-update-${token}`;
  const initialTitle = `CMS Service Runtime ${token}`;
  const updatedTitle = `CMS Service Runtime Changed ${token}`;
  const initialSubtitle = `CMS service runtime subtitle ${token}`;
  const updatedSubtitle = `CMS service runtime subtitle changed ${token}`;
  let pageId: string | null = null;
  const originalSite = await readSiteDocument('default', 'ko');
  const seededSite = {
    ...originalSite,
    cmsCollections: [
      ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'service-areas'),
      makeCmsCollection('service-areas', {
        records: [
          {
            recordId: serviceSlug,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: serviceSlug,
              title: initialTitle,
              subtitle: initialSubtitle,
              intro: initialSubtitle,
              keyPoints: [`${initialTitle} point A`, `${initialTitle} point B`],
              columnSlugs: ['cms-column-published'],
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
          {
            recordId: `cms-service-runtime-secondary-${token}`,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: `cms-service-runtime-secondary-${token}`,
              title: `CMS Service Runtime Secondary ${token}`,
              subtitle: `CMS service runtime secondary subtitle ${token}`,
              intro: `CMS service runtime secondary subtitle ${token}`,
              keyPoints: [`${token} point C`, `${token} point D`],
              columnSlugs: ['cms-column-published'],
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
        ],
      }),
    ],
    updatedAt: new Date().toISOString(),
  };

  try {
    await writeSiteDocument(seededSite);

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `CMS service runtime update ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'service-areas',
        dynamicListLimit: 2,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    const publicPath = `/ko/${published.slug ?? slug}`;
    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    const repeater = page.locator('[data-node-id="dynamic-list-repeater-service-areas"]').first();
    await expect(repeater).toBeVisible();
    await expect(repeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
    const initialSortedTitle = (await repeater.locator('[data-node-id^="dynamic-list-card-title-service-areas"]').first().innerText()).trim();
    await expect(repeater.locator('[data-node-id^="dynamic-list-card-summary-service-areas"]').first()).toContainText(initialSubtitle);

    await page.goto(`${publicPath}?sort=title:desc`, { waitUntil: 'domcontentloaded' });
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toBeVisible();
    await expect(visitorFilters).toContainText('sort title:desc');
    await expect(visitorFilters.getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', publicPath);
    const descSortedTitle = (await page.locator('[data-node-id^="dynamic-list-card-title-service-areas"]').first().innerText()).trim();
    expect(descSortedTitle).not.toBe(initialSortedTitle);

    await page.goto(`${publicPath}?filter[title]=Secondary`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Dynamic list visitor filters')).toBeVisible();
    await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('title contains Secondary');
    await expect(page.getByRole('link', { name: 'title contains Secondary' })).toHaveAttribute('href', `${publicPath}?perPage=12`);
    await expect(page.getByLabel('Dynamic list visitor filters').getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', publicPath);
    await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"] [data-builder-repeater-item="true"]:visible')).toHaveCount(1);
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-service-areas"]').first()).toContainText('Secondary');

    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    const visitorSearchForm = page.getByLabel('Dynamic list visitor search');
    await expect(visitorSearchForm).toBeVisible();
    const visitorSearch = page.getByLabel('Search records');
    await visitorSearch.fill('Secondary');
    await Promise.all([
      page.waitForURL((url) => url.pathname.endsWith(`/${published.slug ?? slug}`) && url.search.includes('q=Secondary')),
      visitorSearch.press('Enter'),
    ]);
    await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('search Secondary');
    await expect(page.getByRole('link', { name: 'search Secondary' })).toHaveAttribute('href', `${publicPath}?perPage=12`);
    await expect(page.getByLabel('Search records')).toHaveValue('Secondary');
    await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"] [data-builder-repeater-item="true"]:visible')).toHaveCount(1);
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-service-areas"]').first()).toContainText('Secondary');
    await expect(page.getByLabel('Dynamic list visitor filters').getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', publicPath);

    const updatedSite = {
      ...seededSite,
      cmsCollections: (seededSite.cmsCollections ?? []).map((collection) => {
        if (collection.collectionId !== 'service-areas') return collection;
        return {
          ...collection,
          records: collection.records.map((record) => (
            record.recordId === serviceSlug
              ? {
                  ...record,
                  fields: {
                    ...record.fields,
                    title: updatedTitle,
                    subtitle: updatedSubtitle,
                    intro: updatedSubtitle,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : record
          )),
          updatedAt: new Date().toISOString(),
        };
      }),
      updatedAt: new Date().toISOString(),
    };

    await writeSiteDocument(updatedSite);

    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"]')).toBeVisible();
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-service-areas"]').first()).toContainText(updatedTitle);
    await expect(page.locator('[data-node-id^="dynamic-list-card-summary-service-areas"]').first()).toContainText(updatedSubtitle);
    await page.goto(`${publicPath}?sort=title:desc`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('sort title:desc');
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-service-areas"]').first()).toBeVisible();
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder published CMS attorney dynamic list page reflects CMS record edits on reload', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-attorney-runtime-update-${token}`;
  const attorneySlug = `cms-attorney-runtime-update-${token}`;
  const initialName = `CMS Attorney Runtime ${token}`;
  const updatedName = `CMS Attorney Runtime Changed ${token}`;
  const initialRole = `Partner Runtime ${token}`;
  const updatedRole = `Partner Runtime Changed ${token}`;
  let pageId: string | null = null;
  const originalSite = await readSiteDocument('default', 'ko');
  const seededSite = {
    ...originalSite,
    cmsCollections: [
      ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'attorney-profiles'),
      makeCmsCollection('attorney-profiles', {
        records: [
          {
            recordId: attorneySlug,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: attorneySlug,
              name: initialName,
              role: initialRole,
              title: `${initialName} | ${initialRole}`,
              description: `CMS attorney runtime description ${token}`,
              summary: ['Litigation strategy', 'Dispute resolution'],
              email: `runtime-attorney-${token}@example.test`,
              image: { url: '/api/builder/assets/hero.webp' },
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
          {
            recordId: `cms-attorney-runtime-secondary-${token}`,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: `cms-attorney-runtime-secondary-${token}`,
              name: `CMS Attorney Runtime Secondary ${token}`,
              role: `Associate Runtime ${token}`,
              title: `CMS Attorney Runtime Secondary ${token} | Associate Runtime ${token}`,
              description: `CMS attorney runtime secondary description ${token}`,
              summary: ['Appeals', 'Research'],
              email: `runtime-attorney-secondary-${token}@example.test`,
              image: { url: '/api/builder/assets/hero.webp' },
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
        ],
      }),
    ],
    updatedAt: new Date().toISOString(),
  };

  try {
    await writeSiteDocument(seededSite);

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `CMS attorney runtime update ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'attorney-profiles',
        dynamicListLimit: 2,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    const publicPath = `/ko/${published.slug ?? slug}`;
    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    const repeater = page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"]').first();
    await expect(repeater).toBeVisible();
    await expect(repeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
    const initialSortedTitle = (await repeater.locator('[data-node-id^="dynamic-list-card-title-attorney-profiles"]').first().innerText()).trim();
    await expect(repeater.locator('[data-node-id^="dynamic-list-card-summary-attorney-profiles"]').first()).toContainText(initialRole);

    await page.goto(`${publicPath}?sort=name:desc`, { waitUntil: 'domcontentloaded' });
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toBeVisible();
    await expect(visitorFilters).toContainText('sort name:desc');
    await expect(visitorFilters.getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', publicPath);
    const descSortedTitle = (await page.locator('[data-node-id^="dynamic-list-card-title-attorney-profiles"]').first().innerText()).trim();
    expect(descSortedTitle).not.toBe(initialSortedTitle);

    await page.goto(`${publicPath}?filter[name]=Secondary`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Dynamic list visitor filters')).toBeVisible();
    await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('name contains Secondary');
    await expect(page.getByRole('link', { name: 'name contains Secondary' })).toHaveAttribute('href', `${publicPath}?perPage=12`);
    await expect(page.getByLabel('Dynamic list visitor filters').getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', publicPath);
    await expect(page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"] [data-builder-repeater-item="true"]:visible')).toHaveCount(1);
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-attorney-profiles"]').first()).toContainText('Secondary');

    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    const visitorSearchForm = page.getByLabel('Dynamic list visitor search');
    await expect(visitorSearchForm).toBeVisible();
    const visitorSearch = page.getByLabel('Search records');
    await visitorSearch.fill('Secondary');
    await Promise.all([
      page.waitForURL((url) => url.pathname.endsWith(`/${published.slug ?? slug}`) && url.search.includes('q=Secondary')),
      visitorSearch.press('Enter'),
    ]);
    await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('search Secondary');
    await expect(page.getByRole('link', { name: 'search Secondary' })).toHaveAttribute('href', `${publicPath}?perPage=12`);
    await expect(page.getByLabel('Search records')).toHaveValue('Secondary');
    await expect(page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"] [data-builder-repeater-item="true"]:visible')).toHaveCount(1);
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-attorney-profiles"]').first()).toContainText('Secondary');
    await expect(page.getByLabel('Dynamic list visitor filters').getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', publicPath);

    const updatedSite = {
      ...seededSite,
      cmsCollections: (seededSite.cmsCollections ?? []).map((collection) => {
        if (collection.collectionId !== 'attorney-profiles') return collection;
        return {
          ...collection,
          records: collection.records.map((record) => (
            record.recordId === attorneySlug
              ? {
                  ...record,
                  fields: {
                    ...record.fields,
                    name: updatedName,
                    role: updatedRole,
                    title: `${updatedName} | ${updatedRole}`,
                    description: `CMS attorney runtime description changed ${token}`,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : record
          )),
          updatedAt: new Date().toISOString(),
        };
      }),
      updatedAt: new Date().toISOString(),
    };

    await writeSiteDocument(updatedSite);

    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"]')).toBeVisible();
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-attorney-profiles"]').first()).toContainText(updatedName);
    await expect(page.locator('[data-node-id^="dynamic-list-card-summary-attorney-profiles"]').first()).toContainText(updatedRole);
    await page.goto(`${publicPath}?sort=name:desc`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('sort name:desc');
    await expect(page.locator('[data-node-id^="dynamic-list-card-title-attorney-profiles"]').first()).toBeVisible();
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder renders a CMS-backed dynamic list page with visitor filters and pagination', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-cms-query-${token}`;
  let pageId: string | null = null;
  const originalSite = await readSiteDocument('default', 'ko');

  try {
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'columns'),
        makeCmsCollection('columns', {
          records: [
            {
              recordId: `cms-query-one-${token}`,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: `cms-query-one-${token}`,
                title: `CMS Query One ${token}`,
                summary: `CMS query summary one ${token}`,
                category: 'legal',
                categoryLabel: 'Legal Information',
                date: '2026-05-30',
                featuredImage: { url: '/images/placeholder-article-hero.jpg' },
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
            {
              recordId: `cms-query-two-${token}`,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: `cms-query-two-${token}`,
                title: `CMS Query Two ${token}`,
                summary: `CMS query summary two ${token}`,
                category: 'legal',
                categoryLabel: 'Legal Information',
                date: '2026-05-29',
                featuredImage: { url: '/images/placeholder-article-hero.jpg' },
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
        }),
      ],
      updatedAt: new Date().toISOString(),
    });

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `CMS dynamic columns query ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'columns',
        dynamicListLimit: 1,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; error?: string; slug?: string };
    expect(published.ok, published.error).toBe(true);

    const visitorPath = `/ko/${published.slug ?? slug}?sort=title:asc&perPage=1`;
    await page.goto(visitorPath, { waitUntil: 'domcontentloaded' });
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toBeVisible();
    await expect(visitorFilters).toContainText('sort title:asc');
    const pagination = page.getByLabel('Dynamic list pagination');
    await expect(pagination).toBeVisible();
    await expect(pagination).toContainText('1 /');
    await expect(pagination).toContainText('Showing 1 of');
    const repeater = page.locator('[data-node-id="dynamic-list-repeater-columns"]').first();
    await expect(repeater).toBeVisible();
    await expect(repeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(1);
    await expect(repeater).toContainText(`CMS Query One ${token}`);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder published CMS dynamic list page preserves visitor filters in pagination links', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-services-pagination-${token}`;
  let pageId: string | null = null;
  const originalSite = await readSiteDocument('default', 'ko');

  try {
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'service-areas'),
        makeCmsCollection('service-areas', {
          records: [
            {
              recordId: `cms-service-pagination-primary-${token}`,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: `cms-service-pagination-primary-${token}`,
                title: `CMS Service Pagination Primary ${token}`,
                subtitle: `CMS service pagination primary subtitle ${token}`,
                intro: `CMS service pagination primary subtitle ${token}`,
                keyPoints: [`${token} point A`, `${token} point B`],
                columnSlugs: ['cms-column-published'],
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
            {
              recordId: `cms-service-pagination-secondary-${token}`,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: `cms-service-pagination-secondary-${token}`,
                title: `CMS Service Pagination Secondary ${token}`,
                subtitle: `CMS service pagination secondary subtitle ${token}`,
                intro: `CMS service pagination secondary subtitle ${token}`,
                keyPoints: [`${token} point C`, `${token} point D`],
                columnSlugs: ['cms-column-published'],
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
        }),
      ],
      updatedAt: new Date().toISOString(),
    });

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Dynamic services pagination ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'service-areas',
        dynamicListLimit: 6,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    const visitorPath = `/ko/${published.slug ?? slug}?sort=title:asc&perPage=1`;
    await page.goto(visitorPath, { waitUntil: 'domcontentloaded' });
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toBeVisible();
    await expect(visitorFilters).toContainText('sort title:asc');
    await expect(visitorFilters.getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', `/ko/${published.slug ?? slug}`);
    const pagination = page.getByLabel('Dynamic list pagination');
    await expect(pagination).toBeVisible();
    await expect(pagination).toContainText('1 /');
    await expect(pagination).toContainText('Showing 1 of');

    const nextLink = pagination.getByRole('link', { name: 'Next' });
    await expect(nextLink).toBeVisible();
    await expect(nextLink).toHaveAttribute('href', /sort=title%3Aasc.*perPage=1.*page=2|page=2.*perPage=1.*sort=title%3Aasc/);

    await Promise.all([
      page.waitForURL((url) => url.pathname.endsWith(`/${published.slug ?? slug}`) && url.search.includes('sort=title%3Aasc') && url.search.includes('page=2') && url.search.includes('perPage=1')),
      nextLink.click(),
    ]);
    await expect(pagination).toContainText('2 /');
    await expect(page).toHaveURL(/sort=title%3Aasc&perPage=1&page=2/);
    const previousLink = pagination.getByRole('link', { name: 'Previous' });
    await expect(previousLink).toBeVisible();
    await expect(previousLink).toHaveAttribute('href', /sort=title%3Aasc.*perPage=1|perPage=1.*sort=title%3Aasc/);

    await Promise.all([
      page.waitForURL((url) => url.pathname.endsWith(`/${published.slug ?? slug}`) && url.search.includes('sort=title%3Aasc') && url.search.includes('page=1') && url.search.includes('perPage=1')),
      previousLink.click(),
    ]);
    await expect(pagination).toContainText('1 /');
    await expect(page).toHaveURL(/sort=title%3Aasc&perPage=1&page=1/);
    await expect(visitorFilters.getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', `/ko/${published.slug ?? slug}`);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder published CMS attorney dynamic list page preserves visitor filters in pagination links', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-attorneys-pagination-${token}`;
  let pageId: string | null = null;
  const originalSite = await readSiteDocument('default', 'ko');

  try {
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'attorney-profiles'),
        makeCmsCollection('attorney-profiles', {
          records: [
            {
              recordId: `cms-attorney-pagination-primary-${token}`,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: `cms-attorney-pagination-primary-${token}`,
                name: `CMS Attorney Pagination Primary ${token}`,
                role: `Partner Runtime ${token}`,
                title: `CMS Attorney Pagination Primary ${token} | Partner Runtime ${token}`,
                description: `CMS attorney pagination primary description ${token}`,
                summary: [`${token} litigation strategy`, `${token} dispute resolution`],
                email: `pagination-attorney-${token}@example.test`,
                image: { url: '/api/builder/assets/hero.webp' },
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
            {
              recordId: `cms-attorney-pagination-secondary-${token}`,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: `cms-attorney-pagination-secondary-${token}`,
                name: `CMS Attorney Pagination Secondary ${token}`,
                role: `Associate Runtime ${token}`,
                title: `CMS Attorney Pagination Secondary ${token} | Associate Runtime ${token}`,
                description: `CMS attorney pagination secondary description ${token}`,
                summary: [`${token} appeals`, `${token} research`],
                email: `pagination-attorney-secondary-${token}@example.test`,
                image: { url: '/api/builder/assets/hero.webp' },
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
        }),
      ],
      updatedAt: new Date().toISOString(),
    });

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Dynamic attorneys pagination ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'attorney-profiles',
        dynamicListLimit: 1,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    const visitorPath = `/ko/${published.slug ?? slug}?sort=name:asc&perPage=1`;
    await page.goto(visitorPath, { waitUntil: 'domcontentloaded' });
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toBeVisible();
    await expect(visitorFilters).toContainText('sort name:asc');
    await expect(visitorFilters.getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', `/ko/${published.slug ?? slug}`);
    const pagination = page.getByLabel('Dynamic list pagination');
    await expect(pagination).toBeVisible();
    await expect(pagination).toContainText('1 /');
    await expect(pagination).toContainText('Showing 1 of');

    const nextLink = pagination.getByRole('link', { name: 'Next' });
    await expect(nextLink).toBeVisible();
    await expect(nextLink).toHaveAttribute('href', /sort=name%3Aasc.*perPage=1.*page=2|page=2.*perPage=1.*sort=name%3Aasc/);

    await Promise.all([
      page.waitForURL((url) => url.pathname.endsWith(`/${published.slug ?? slug}`) && url.search.includes('sort=name%3Aasc') && url.search.includes('page=2') && url.search.includes('perPage=1')),
      nextLink.click(),
    ]);
    await expect(pagination).toContainText('2 /');
    await expect(page).toHaveURL(/sort=name%3Aasc&perPage=1&page=2/);
    const previousLink = pagination.getByRole('link', { name: 'Previous' });
    await expect(previousLink).toBeVisible();
    await expect(previousLink).toHaveAttribute('href', /sort=name%3Aasc.*perPage=1|perPage=1.*sort=name%3Aasc/);

    await Promise.all([
      page.waitForURL((url) => url.pathname.endsWith(`/${published.slug ?? slug}`) && url.search.includes('sort=name%3Aasc') && url.search.includes('page=1') && url.search.includes('perPage=1')),
      previousLink.click(),
    ]);
    await expect(pagination).toContainText('1 /');
    await expect(page).toHaveURL(/sort=name%3Aasc&perPage=1&page=1/);
    await expect(visitorFilters.getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', `/ko/${published.slug ?? slug}`);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder published CMS dynamic list page exposes sort controls and sorts records', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-columns-sort-${token}`;
  let pageId: string | null = null;

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Dynamic columns sort ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'columns',
        dynamicListLimit: 6,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    const visitorPath = `/ko/${published.slug ?? slug}?sort=title:asc&perPage=1`;
    await page.goto(visitorPath, { waitUntil: 'domcontentloaded' });
    const visitorSort = page.getByLabel('Dynamic list sort');
    await expect(visitorSort).toBeVisible();
    await expect(visitorSort).toContainText('Title ascending');
    await expect(visitorSort).toContainText('Title descending');
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toBeVisible();
    await expect(visitorFilters).toContainText('sort title:asc');
    const repeater = page.locator('[data-node-id="dynamic-list-repeater-columns"]').first();
    await expect(repeater).toBeVisible();

    const descLink = visitorSort.getByRole('link', { name: 'Title descending' });
    await Promise.all([
      page.waitForURL((url) =>
        url.pathname.endsWith(`/${published.slug ?? slug}`)
        && url.search.includes('sort=title%3Adesc')
        && url.search.includes('perPage=1'),
      ),
      descLink.click(),
    ]);
    await expect(visitorFilters).toBeVisible();
    await expect(visitorSort).toContainText('Title descending');
    await expect(visitorFilters).toContainText('sort title:desc');
    await expect(visitorSort.getByRole('link', { name: 'Default order' })).toHaveAttribute(
      'href',
      `/ko/${published.slug ?? slug}?perPage=1`,
    );
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder Pages panel can quick-create a service dynamic list page', async ({ page }) => {
  test.setTimeout(90_000);

  await openBuilder(page, `/ko/admin-builder?dynamicListQuickCreate=${Date.now().toString(36)}`);
  await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click({ force: true });
  const createButton = page.locator('[data-builder-create-dynamic-list-page="service-areas"]').first();
  await expect(createButton).toBeVisible();

  const createResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/builder/site/pages')
      && response.request().method() === 'POST'
      && response.status() === 200,
    { timeout: 30_000 },
  );
  await createButton.click({ force: true });
  const response = await createResponse;
  const created = (await response.json()) as {
    pageId?: string;
    page?: { slug?: string; dynamicList?: { collectionId?: string; targetId?: string } };
  };
  const pageId = created.pageId;
  const pageScope = created.page?.slug ?? pageId ?? 'service-dynamic-list';
  expect(pageId).toBeTruthy();
  expect(created.page?.dynamicList).toMatchObject({
    collectionId: 'service-areas',
    targetId: 'home.services.list',
  });

  try {
    await expect(page.locator('aside[data-builder-drawer="pages"]')).toHaveCount(0, { timeout: 30_000 });
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click({ force: true });
    await expect(page.locator(`[data-builder-page-row="${pageId}"]`)).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"]').first()).toBeVisible();
    const nodes = await readDraftNodes(page, pageId!, pageScope);
    expect(nodes.find((node) => node.id === 'dynamic-list-repeater-service-areas')?.dataBinding).toMatchObject({
      targetId: 'home.services.list',
      fields: { title: 'title', description: 'description' },
    });
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(pageScope),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder Pages panel can quick-create a columns dynamic list page', async ({ page }) => {
  test.setTimeout(90_000);

  await openBuilder(page, `/ko/admin-builder?dynamicListQuickCreate=${Date.now().toString(36)}`);
  await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click({ force: true });
  const createButton = page.locator('[data-builder-create-dynamic-list-page="columns"]').first();
  await expect(createButton).toBeVisible();

  const createResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/builder/site/pages')
      && response.request().method() === 'POST'
      && response.status() === 200,
    { timeout: 30_000 },
  );
  await createButton.click({ force: true });
  const response = await createResponse;
  const created = (await response.json()) as {
    pageId?: string;
    page?: { slug?: string; dynamicList?: { collectionId?: string; targetId?: string; limit?: number } };
  };
  const pageId = created.pageId;
  const pageScope = created.page?.slug ?? pageId ?? 'columns-dynamic-list';
  expect(pageId).toBeTruthy();
  expect(created.page?.dynamicList).toMatchObject({
    collectionId: 'columns',
    targetId: 'home.insights.feed',
    limit: 4,
  });

  try {
    await expect(page.locator('aside[data-builder-drawer="pages"]')).toHaveCount(0, { timeout: 30_000 });
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click({ force: true });
    await expect(page.locator(`[data-builder-page-row="${pageId}"]`)).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-node-id="dynamic-list-repeater-columns"]').first()).toBeVisible();
    const nodes = await readDraftNodes(page, pageId!, pageScope);
    expect(nodes.find((node) => node.id === 'dynamic-list-repeater-columns')?.dataBinding).toMatchObject({
      targetId: 'home.insights.feed',
      fields: { title: 'title', description: 'summary', src: 'featuredImage' },
    });
    expect(nodes.find((node) => node.id === 'dynamic-list-card-image-columns')?.dataBinding?.fields).toEqual({
      src: 'featuredImage',
      alt: 'title',
      href: 'href',
    });
    expect(nodes.find((node) => node.id === 'dynamic-list-card-title-columns')?.dataBinding?.fields).toEqual({
      text: 'title',
      href: 'href',
    });

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(pageScope),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${published.slug ?? created.page?.slug ?? pageScope}`, { waitUntil: 'domcontentloaded' });
    const publishedRepeater = page.locator('[data-node-id="dynamic-list-repeater-columns"]');
    await expect(publishedRepeater).toBeVisible();
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(pageScope),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder Pages panel can quick-create and publish a lawyer dynamic list page', async ({ page }) => {
  test.setTimeout(90_000);

  await openBuilder(page, `/ko/admin-builder?dynamicLawyerListQuickCreate=${Date.now().toString(36)}`);
  await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click({ force: true });
  const createButton = page.locator('[data-builder-create-dynamic-list-page="attorney-profiles"]').first();
  await expect(createButton).toBeVisible();

  const createResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/builder/site/pages')
      && response.request().method() === 'POST'
      && response.status() === 200,
    { timeout: 30_000 },
  );
  await createButton.click({ force: true });
  const response = await createResponse;
  const created = (await response.json()) as {
    pageId?: string;
    page?: { slug?: string; dynamicList?: { collectionId?: string; targetId?: string; limit?: number } };
  };
  const pageId = created.pageId;
  const pageScope = created.page?.slug ?? pageId ?? 'lawyer-dynamic-list';
  expect(pageId).toBeTruthy();
  expect(created.page?.dynamicList).toMatchObject({
    collectionId: 'attorney-profiles',
    targetId: 'home.attorney.profile',
    limit: 3,
  });

  try {
    await expect(page.locator('aside[data-builder-drawer="pages"]')).toHaveCount(0, { timeout: 30_000 });
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click({ force: true });
    await expect(page.locator(`[data-builder-page-row="${pageId}"]`)).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"]').first()).toBeVisible();
    const nodes = await readDraftNodes(page, pageId!, pageScope);
    expect(nodes.find((node) => node.id === 'dynamic-list-repeater-attorney-profiles')?.dataBinding).toMatchObject({
      targetId: 'home.attorney.profile',
      fields: { title: 'name', description: 'role', src: 'image' },
    });
    expect(nodes.find((node) => node.id === 'dynamic-list-card-image-attorney-profiles')?.dataBinding?.fields).toEqual({
      src: 'image',
      alt: 'name',
      href: 'href',
    });
    expect(nodes.find((node) => node.id === 'dynamic-list-card-title-attorney-profiles')?.dataBinding?.fields).toEqual({
      text: 'name',
      href: 'href',
    });

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(pageScope),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${published.slug ?? created.page?.slug ?? pageScope}`, { waitUntil: 'domcontentloaded' });
    const publishedRepeater = page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"]');
    await expect(publishedRepeater).toBeVisible();
    await expect(publishedRepeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(1);
    await expect(publishedRepeater).toContainText('증준외 변호사');
    await expect(publishedRepeater).toContainText('대표 변호사');
    await expect(publishedRepeater).not.toContainText('Record title');
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(pageScope),
      }).catch(() => undefined);
    }
  }
});
