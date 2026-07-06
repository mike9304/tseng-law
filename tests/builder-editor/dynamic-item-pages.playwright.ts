import { expect, test, type Locator, type Page } from '@playwright/test';
import type { BuilderCmsCollection, BuilderCmsFieldDefinition } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { openBuilder } from './helpers/editor';

type DynamicRouteRecord = {
  recordId: string;
  primaryLabel: string;
};

type DynamicDraftNode = {
  id?: string;
  kind?: string;
  dataBinding?: {
    targetId?: string;
    fields?: Record<string, string>;
  };
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-item-pages';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function openPagesDrawer(page: Page): Promise<Locator> {
  const drawer = page.locator('aside[data-builder-drawer="pages"]').first();
  const switcher = drawer.locator('[data-page-switcher="true"]');
  if (await switcher.isVisible().catch(() => false)) return drawer;

  await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click({ force: true });
  await expect(switcher).toBeVisible({ timeout: 30_000 });
  return drawer;
}

async function expectQuickCreatedDynamicItemPageVisible(
  page: Page,
  pageId: string | null,
  titleNodeId: string,
): Promise<void> {
  if (!pageId) throw new Error('Expected a quick-created dynamic item page id.');

  await expect(page.locator(`[data-node-id="${titleNodeId}"]`).first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('aside[data-builder-drawer="pages"]')).toHaveCount(0, { timeout: 15_000 });
  const drawer = await openPagesDrawer(page);
  await expect(drawer.locator(`[data-builder-page-row="${pageId}"]`)).toBeVisible({ timeout: 30_000 });
}

function makeCmsCollection(
  collectionId: BuilderCmsCollection['collectionId'],
  overrides: Partial<BuilderCmsCollection> = {},
): BuilderCmsCollection {
  const fields: BuilderCmsFieldDefinition[] =
    collectionId === 'columns'
      ? [
          { fieldId: 'field-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true, unique: true },
          { fieldId: 'field-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
          { fieldId: 'field-summary', key: 'summary', label: 'Summary', type: 'rich-text', localized: false, repeated: false, required: false },
          { fieldId: 'field-content', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
          { fieldId: 'field-category', key: 'category', label: 'Category', type: 'text', localized: false, repeated: false, required: false },
          { fieldId: 'field-date', key: 'date', label: 'Date', type: 'date', localized: false, repeated: false, required: false },
          { fieldId: 'field-featured-image', key: 'featuredImage', label: 'Featured Image', type: 'image', localized: false, repeated: false, required: false },
        ]
      : [];

  return {
    collectionId,
    name: collectionId === 'attorney-profiles' ? 'Attorney Profiles' : 'Service Areas',
    slug: collectionId,
    description: collectionId === 'attorney-profiles' ? 'CMS attorney profiles' : 'CMS service areas',
    localized: true,
    fields,
    indexes: [],
    records: [],
    permissions: { read: ['public'], create: ['staff'], update: ['staff'], delete: ['staff'] },
    createdAt: '2026-05-30T00:00:00.000Z',
    updatedAt: '2026-05-30T00:00:00.000Z',
    ...overrides,
  };
}

test('/ko/admin-builder creates and publishes a CMS dynamic item page resolved by record slug', async ({ page }) => {
  test.setTimeout(120_000);

  const routeResponse = await page.request.get('/api/builder/sites/default/dynamic-routes/columns.item?locale=ko');
  expect(routeResponse.status()).toBe(200);
  const routePayload = (await routeResponse.json()) as { detail?: { sampleRecords?: DynamicRouteRecord[] } };
  const records = routePayload.detail?.sampleRecords ?? [];
  expect(records.length).toBeGreaterThan(1);
  const firstRecord = records[0];
  const secondRecord = records.find((record) => record.recordId !== firstRecord.recordId) ?? records[1];
  expect(firstRecord?.recordId).toBeTruthy();
  expect(secondRecord?.recordId).toBeTruthy();

  const token = Date.now().toString(36);
  const slug = `dynamic-item-columns-${token}`;
  let pageId: string | null = null;

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Dynamic item ${token}`,
        addToNavigation: false,
        dynamicItemCollectionId: 'columns',
        dynamicItemRecordSlug: firstRecord.recordId,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: {
        dynamicItem?: {
          collectionId?: string;
          targetId?: string;
          slugField?: string;
          defaultRecordSlug?: string;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicItem).toMatchObject({
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      slugField: 'slug',
      defaultRecordSlug: firstRecord.recordId,
    });

    const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(draftResponse.status()).toBe(200);
    const draftPayload = (await draftResponse.json()) as { document?: { nodes?: DynamicDraftNode[] } };
    const nodes = draftPayload.document?.nodes ?? [];
    expect(nodes.find((node) => node.id === 'dynamic-item-title-columns')?.dataBinding).toMatchObject({
      targetId: 'home.insights.feed',
      fields: { text: 'title' },
    });
    expect(nodes.find((node) => node.id === 'dynamic-item-summary-columns')?.dataBinding).toMatchObject({
      targetId: 'home.insights.feed',
      fields: { text: 'content' },
    });
    expect(nodes.find((node) => node.id === 'dynamic-item-image-columns')?.dataBinding?.fields).toEqual({
      src: 'featuredImage',
      alt: 'title',
      href: 'href',
    });

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&dynamicItemPage=${token}`);
    await expect(page.locator('[data-node-id="dynamic-item-title-columns"]').first()).toContainText(
      firstRecord.primaryLabel,
    );

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${slug}/${firstRecord.recordId}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-item-title-columns"]').first()).toContainText(
      firstRecord.primaryLabel,
    );

    await page.goto(`/ko/${slug}/${secondRecord.recordId}`, { waitUntil: 'domcontentloaded' });
    const publishedTitle = page.locator('[data-node-id="dynamic-item-title-columns"]').first();
    await expect(publishedTitle).toContainText(secondRecord.primaryLabel);
    await expect(publishedTitle).not.toContainText(firstRecord.primaryLabel);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});
test('/ko/admin-builder creates a lawyer CMS dynamic item page resolved by profile slug', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-item-lawyers-${token}`;
  let pageId: string | null = null;

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Lawyer dynamic item ${token}`,
        addToNavigation: false,
        dynamicItemCollectionId: 'attorney-profiles',
        dynamicItemRecordSlug: 'wei-tseng',
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: {
        dynamicItem?: {
          collectionId?: string;
          targetId?: string;
          slugField?: string;
          defaultRecordSlug?: string;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicItem).toMatchObject({
      collectionId: 'attorney-profiles',
      targetId: 'home.attorney.profile',
      slugField: 'slug',
      defaultRecordSlug: 'wei-tseng',
    });

    const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(draftResponse.status()).toBe(200);
    const draftPayload = (await draftResponse.json()) as { document?: { nodes?: DynamicDraftNode[] } };
    const nodes = draftPayload.document?.nodes ?? [];
    expect(nodes.find((node) => node.id === 'dynamic-item-title-attorney-profiles')?.dataBinding).toMatchObject({
      targetId: 'home.attorney.profile',
      fields: { text: 'name' },
    });
    expect(nodes.find((node) => node.id === 'dynamic-item-summary-attorney-profiles')?.dataBinding).toMatchObject({
      targetId: 'home.attorney.profile',
      fields: { text: 'description' },
    });
    expect(nodes.find((node) => node.id === 'dynamic-item-image-attorney-profiles')?.dataBinding?.fields).toEqual({
      src: 'image',
      alt: 'name',
      href: 'href',
    });

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&dynamicItemLawyer=${token}`);
    await expect(page.locator('[data-node-id="dynamic-item-title-attorney-profiles"]').first()).toContainText(
      '증준외 변호사',
    );

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${slug}/wei-tseng`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-item-title-attorney-profiles"]').first()).toContainText(
      '증준외 변호사',
    );
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder Pages panel can quick-create a columns dynamic item page', async ({ page }) => {
  test.setTimeout(90_000);

  await openBuilder(page, `/ko/admin-builder?dynamicItemQuickCreate=${Date.now().toString(36)}`);
  await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click({ force: true });
  const createButton = page.locator('[data-builder-create-dynamic-item-page="columns"]').first();
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
    success?: boolean;
    pageId?: string;
    page?: {
      slug?: string;
      dynamicItem?: {
        collectionId?: string;
        targetId?: string;
        slugField?: string;
        defaultRecordSlug?: string;
      };
    };
    error?: string;
  };
  expect(created.success, created.error).toBe(true);
  const pageId = created.pageId ?? null;
  expect(pageId).toBeTruthy();
  expect(created.page?.dynamicItem).toMatchObject({
    collectionId: 'columns',
    targetId: 'home.insights.feed',
    slugField: 'slug',
  });
  expect(created.page?.dynamicItem?.defaultRecordSlug).toBeTruthy();

  try {
    await expectQuickCreatedDynamicItemPageVisible(page, pageId, 'dynamic-item-title-columns');

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(created.page?.slug ?? pageId ?? 'columns-dynamic-item'),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    const publicSlug = created.page?.slug ?? pageId ?? 'columns-dynamic-item';
    const recordSlug = created.page?.dynamicItem?.defaultRecordSlug ?? '';
    await page.goto(`/ko/${published.slug ?? publicSlug}/${recordSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-item-title-columns"]').first()).toBeVisible();
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(created.page?.slug ?? pageId ?? 'columns-dynamic-item'),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder Pages panel can quick-create a service dynamic item page', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-item-service-quick-${token}`;
  const serviceSlug = 'investment';
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
              title: `CMS Service Quick ${token}`,
              subtitle: `CMS service quick subtitle ${token}`,
              intro: `CMS service quick subtitle ${token}`,
              keyPoints: [`CMS service quick point ${token}`],
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
  let pageId: string | null = null;

  try {
    await writeSiteDocument(seededSite);
    await openBuilder(page, `/ko/admin-builder?dynamicItemQuickCreate=${Date.now().toString(36)}`);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click({ force: true });
    const createButton = page.locator('[data-builder-create-dynamic-item-page="service-areas"]').first();
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
      success?: boolean;
      pageId?: string;
      page?: {
        slug?: string;
        dynamicItem?: {
          collectionId?: string;
          targetId?: string;
          slugField?: string;
          defaultRecordSlug?: string;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicItem).toMatchObject({
      collectionId: 'service-areas',
      targetId: 'home.services.list',
      slugField: 'slug',
      defaultRecordSlug: serviceSlug,
    });

    await expectQuickCreatedDynamicItemPageVisible(page, pageId, 'dynamic-item-title-service-areas');

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(created.page?.slug ?? pageId ?? 'service-dynamic-item'),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    const publicSlug = created.page?.slug ?? pageId ?? 'service-dynamic-item';
    await page.goto(`/ko/${published.slug ?? publicSlug}/${serviceSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-item-title-service-areas"]').first()).toBeVisible();
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder Pages panel can quick-create a lawyer dynamic item page', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-item-lawyer-quick-${token}`;
  // attorney-profiles is source-backed (src/data/attorney-profiles.ts +
  // site.sourceCollectionOverrides.attorneyProfiles); quick-create resolves its
  // default record slug from that source, so no cmsCollections seeding is needed.
  const attorneySlug = 'wei-tseng';
  let pageId: string | null = null;

  try {
    await openBuilder(page, `/ko/admin-builder?dynamicItemQuickCreate=${Date.now().toString(36)}`);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click({ force: true });
    const createButton = page.locator('[data-builder-create-dynamic-item-page="attorney-profiles"]').first();
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
      success?: boolean;
      pageId?: string;
      page?: {
        slug?: string;
        dynamicItem?: {
          collectionId?: string;
          targetId?: string;
          slugField?: string;
          defaultRecordSlug?: string;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicItem).toMatchObject({
      collectionId: 'attorney-profiles',
      targetId: 'home.attorney.profile',
      slugField: 'slug',
      defaultRecordSlug: attorneySlug,
    });

    await expectQuickCreatedDynamicItemPageVisible(page, pageId, 'dynamic-item-title-attorney-profiles');

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(created.page?.slug ?? pageId ?? 'lawyer-dynamic-item'),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    const publicSlug = created.page?.slug ?? pageId ?? 'lawyer-dynamic-item';
    await page.goto(`/ko/${published.slug ?? publicSlug}/${attorneySlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-item-title-attorney-profiles"]').first()).toBeVisible();
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder renders a columns CMS dynamic item page from site.cmsCollections', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-item-columns-cms-${token}`;
  const columnSlug = `cms-column-${token}`;
  const columnTitle = `CMS Column ${token}`;
  const columnSummary = `CMS column summary ${token}`;
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
              recordId: columnSlug,
              status: 'published',
              locale: 'ko',
              fields: {
                slug: columnSlug,
                title: columnTitle,
                summary: columnSummary,
                content: `<p>${columnSummary}</p>`,
                category: 'news',
                date: '2026-05-30',
                featuredImage: { url: '/api/builder/assets/hero.webp' },
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
        title: `Columns dynamic item ${token}`,
        addToNavigation: false,
        dynamicItemCollectionId: 'columns',
        dynamicItemRecordSlug: columnSlug,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: {
        dynamicItem?: {
          collectionId?: string;
          targetId?: string;
          slugField?: string;
          defaultRecordSlug?: string;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicItem).toMatchObject({
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      slugField: 'slug',
      defaultRecordSlug: columnSlug,
    });

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${slug}/${columnSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', columnSummary);
    await expect(page.locator('[data-node-id="dynamic-item-title-columns"]').first()).toContainText(columnTitle);
    await expect(page.locator('[data-node-id="dynamic-item-summary-columns"]').first()).toContainText(columnSummary);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder published CMS dynamic item page reflects CMS record edits on reload', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-item-columns-update-${token}`;
  const columnSlug = `cms-column-update-${token}`;
  const initialTitle = `CMS Column Update ${token}`;
  const updatedTitle = `CMS Column Update Changed ${token}`;
  const initialSummary = `CMS column update summary ${token}`;
  const updatedSummary = `CMS column update summary changed ${token}`;
  let pageId: string | null = null;
  const originalSite = await readSiteDocument('default', 'ko');
  const seededSite = {
    ...originalSite,
    cmsCollections: [
      ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'columns'),
      makeCmsCollection('columns', {
        records: [
          {
            recordId: columnSlug,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: columnSlug,
              title: initialTitle,
              summary: initialSummary,
              content: `<p>${initialSummary}</p>`,
              category: 'news',
              date: '2026-05-30',
              featuredImage: { url: '/api/builder/assets/hero.webp' },
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
        title: `Columns update ${token}`,
        addToNavigation: false,
        dynamicItemCollectionId: 'columns',
        dynamicItemRecordSlug: columnSlug,
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

    const publicPath = `/ko/${published.slug ?? slug}/${columnSlug}`;
    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-item-title-columns"]').first()).toContainText(initialTitle);
    await expect(page.locator('[data-node-id="dynamic-item-summary-columns"]').first()).toContainText(initialSummary);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', initialSummary);

    const updatedSite = {
      ...seededSite,
      cmsCollections: (seededSite.cmsCollections ?? []).map((collection) => {
        if (collection.collectionId !== 'columns') return collection;
        return {
          ...collection,
          records: collection.records.map((record) => (
            record.recordId === columnSlug
              ? {
                  ...record,
                  fields: {
                    ...record.fields,
                    title: updatedTitle,
                    summary: updatedSummary,
                    content: `<p>${updatedSummary}</p>`,
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
    await expect(page.locator('[data-node-id="dynamic-item-title-columns"]').first()).toContainText(updatedTitle);
    await expect(page.locator('[data-node-id="dynamic-item-summary-columns"]').first()).toContainText(updatedSummary);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', updatedSummary);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});

test('/ko/admin-builder renders a service dynamic item page from the source-backed collection', async ({ page }) => {
  test.setTimeout(120_000);

  // service-areas records are source-backed: static src/data/service-details.ts
  // merged with site.sourceCollectionOverrides.serviceAreas — they no longer
  // resolve from site.cmsCollections. The published dynamic item canvas binds
  // the first resolved source record, so assert against sampleRecords[0].
  const routeResponse = await page.request.get('/api/builder/sites/default/dynamic-routes/service-areas.item?locale=ko');
  expect(routeResponse.status()).toBe(200);
  const routePayload = (await routeResponse.json()) as {
    detail?: { sampleRecords?: Array<{ recordId: string; primaryLabel: string; seo?: { description?: string } }> };
  };
  const records = routePayload.detail?.sampleRecords ?? [];
  expect(records.length).toBeGreaterThan(0);
  const serviceRecord = records[0]!;
  expect(serviceRecord.recordId).toBeTruthy();
  expect(serviceRecord.seo?.description).toBeTruthy();

  const token = Date.now().toString(36);
  const slug = `dynamic-item-service-${token}`;
  const sourceUrl = `/api/builder/services/${serviceRecord.recordId}?locale=ko`;
  let pageId: string | null = null;

  // Self-heal: drop any stale source override left by an interrupted run so
  // the merged source record equals the static record the canvas renders.
  let sourceResponse = await page.request.get(sourceUrl, { headers: mutationHeaders(slug) });
  expect(sourceResponse.status()).toBe(200);
  let sourcePayload = (await sourceResponse.json()) as {
    ok?: boolean;
    record?: { title?: Record<string, string>; keyPoints?: Record<string, string[]>; updatedAt?: string };
  };
  if (sourcePayload.record?.updatedAt) {
    await page.request.delete(sourceUrl, { headers: mutationHeaders(slug) });
    sourceResponse = await page.request.get(sourceUrl, { headers: mutationHeaders(slug) });
    expect(sourceResponse.status()).toBe(200);
    sourcePayload = (await sourceResponse.json()) as typeof sourcePayload;
  }
  const serviceTitle = sourcePayload.record?.title?.ko ?? '';
  const servicePoint = sourcePayload.record?.keyPoints?.ko?.[0] ?? '';
  expect(serviceTitle).toBeTruthy();
  expect(servicePoint).toBeTruthy();

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Service dynamic item ${token}`,
        addToNavigation: false,
        dynamicItemCollectionId: 'service-areas',
        dynamicItemRecordSlug: serviceRecord.recordId,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: {
        dynamicItem?: {
          collectionId?: string;
          targetId?: string;
          slugField?: string;
          defaultRecordSlug?: string;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicItem).toMatchObject({
      collectionId: 'service-areas',
      targetId: 'home.services.list',
      slugField: 'slug',
      defaultRecordSlug: serviceRecord.recordId,
    });

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${slug}/${serviceRecord.recordId}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', serviceRecord.seo?.description ?? '');
    await expect(page.locator('[data-node-id="dynamic-item-title-service-areas"]').first()).toContainText(serviceTitle);
    await expect(page.locator('[data-node-id="dynamic-item-summary-service-areas"]').first()).toContainText(servicePoint);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder published service dynamic item page tracks source record edits', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-item-service-update-${token}`;
  const routeResponse = await page.request.get('/api/builder/sites/default/dynamic-routes/service-areas.item?locale=ko');
  expect(routeResponse.status()).toBe(200);
  const routePayload = (await routeResponse.json()) as {
    detail?: { sampleRecords?: Array<{ recordId: string }> };
  };
  const serviceSlug = routePayload.detail?.sampleRecords?.[0]?.recordId ?? '';
  expect(serviceSlug).toBeTruthy();
  const sourceUrl = `/api/builder/services/${serviceSlug}?locale=ko`;
  const updatedTitle = `Source service title ${token}`;
  const updatedPoint = `Source service key point ${token}`;
  let pageId: string | null = null;

  try {
    // Reset the record override so initial expectations start from the
    // pristine static source record (the reset response carries the record).
    const resetResponse = await page.request.delete(sourceUrl, { headers: mutationHeaders(slug) });
    expect(resetResponse.status()).toBe(200);
    const pristine = (await resetResponse.json()) as {
      ok?: boolean;
      record?: { title?: Record<string, string>; keyPoints?: Record<string, string[]> };
    };
    expect(pristine.ok).toBe(true);
    const initialTitle = pristine.record?.title?.ko ?? '';
    const initialPoint = pristine.record?.keyPoints?.ko?.[0] ?? '';
    expect(initialTitle).toBeTruthy();
    expect(initialPoint).toBeTruthy();

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Service update ${token}`,
        addToNavigation: false,
        dynamicItemCollectionId: 'service-areas',
        dynamicItemRecordSlug: serviceSlug,
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

    const publicPath = `/ko/${published.slug ?? slug}/${serviceSlug}`;
    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-item-title-service-areas"]').first()).toContainText(initialTitle);
    await expect(page.locator('[data-node-id="dynamic-item-summary-service-areas"]').first()).toContainText(initialPoint);

    // Edit the record through the source admin API — the editable layer for
    // source-backed collections (site.sourceCollectionOverrides.serviceAreas).
    const patchResponse = await page.request.patch(sourceUrl, {
      headers: mutationHeaders(slug),
      data: {
        title: { ko: updatedTitle },
        keyPoints: { ko: [updatedPoint, `Source service follow-up ${token}`] },
      },
    });
    expect(patchResponse.status()).toBe(200);
    const patched = (await patchResponse.json()) as {
      ok?: boolean;
      record?: { title?: Record<string, string>; keyPoints?: Record<string, string[]> };
    };
    expect(patched.ok).toBe(true);
    expect(patched.record?.title?.ko).toBe(updatedTitle);
    expect(patched.record?.keyPoints?.ko?.[0]).toBe(updatedPoint);

    // The source-backed public record route reflects the edit on reload.
    // dynamic-template-preview can transiently publish the hero/body blocks as
    // hidden while the suite runs in parallel — reload until its afterEach
    // restores the baseline visibility.
    await expect(async () => {
      await page.goto(`/ko/services/${serviceSlug}?source-edit-check=${Date.now()}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.svc-hero-title')).toContainText(updatedTitle, { timeout: 5_000 });
      await expect(page.locator('.svc-keypoints-list')).toContainText(updatedPoint, { timeout: 5_000 });
    }).toPass({ timeout: 60_000 });

    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-item-title-service-areas"]').first()).toContainText(updatedTitle);
    await expect(page.locator('[data-node-id="dynamic-item-summary-service-areas"]').first()).toContainText(updatedPoint);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await page.request.delete(sourceUrl, { headers: mutationHeaders(slug) }).catch(() => undefined);
  }
});

test('/ko/admin-builder published attorney dynamic item page tracks source record edits', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-item-attorney-update-${token}`;
  const routeResponse = await page.request.get('/api/builder/sites/default/dynamic-routes/attorney-profiles.item?locale=ko');
  expect(routeResponse.status()).toBe(200);
  const routePayload = (await routeResponse.json()) as {
    detail?: { sampleRecords?: Array<{ recordId: string }> };
  };
  const attorneySlug = routePayload.detail?.sampleRecords?.[0]?.recordId ?? '';
  expect(attorneySlug).toBeTruthy();
  const sourceUrl = `/api/builder/lawyers/${attorneySlug}?locale=ko`;
  const updatedName = `Source attorney name ${token}`;
  const updatedDescription = `Source attorney description ${token}`;
  let pageId: string | null = null;

  try {
    // Reset the profile override so initial expectations start from the
    // pristine static source record (the reset response carries the record).
    const resetResponse = await page.request.delete(sourceUrl, { headers: mutationHeaders(slug) });
    expect(resetResponse.status()).toBe(200);
    const pristine = (await resetResponse.json()) as {
      ok?: boolean;
      record?: { name?: string; description?: string };
    };
    expect(pristine.ok).toBe(true);
    const initialName = pristine.record?.name ?? '';
    const initialDescription = pristine.record?.description ?? '';
    expect(initialName).toBeTruthy();
    expect(initialDescription).toBeTruthy();

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Attorney update ${token}`,
        addToNavigation: false,
        dynamicItemCollectionId: 'attorney-profiles',
        dynamicItemRecordSlug: attorneySlug,
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

    const publicPath = `/ko/${published.slug ?? slug}/${attorneySlug}`;
    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-item-title-attorney-profiles"]').first()).toContainText(initialName);
    await expect(page.locator('[data-node-id="dynamic-item-summary-attorney-profiles"]').first()).toContainText(initialDescription);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', initialDescription);

    // Edit the record through the source admin API — the editable layer for
    // source-backed collections (site.sourceCollectionOverrides.attorneyProfiles).
    const patchResponse = await page.request.patch(sourceUrl, {
      headers: mutationHeaders(slug),
      data: {
        localized: { ko: { name: updatedName, description: updatedDescription } },
      },
    });
    expect(patchResponse.status()).toBe(200);
    const patched = (await patchResponse.json()) as {
      ok?: boolean;
      record?: { name?: string; description?: string };
    };
    expect(patched.ok).toBe(true);
    expect(patched.record?.name).toBe(updatedName);
    expect(patched.record?.description).toBe(updatedDescription);

    // The source-backed public record route reflects the edit on reload.
    await page.goto(`/ko/lawyers/${attorneySlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.profile-hero-title')).toContainText(updatedName);

    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="dynamic-item-title-attorney-profiles"]').first()).toContainText(updatedName);
    await expect(page.locator('[data-node-id="dynamic-item-summary-attorney-profiles"]').first()).toContainText(updatedDescription);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await page.request.delete(sourceUrl, { headers: mutationHeaders(slug) }).catch(() => undefined);
  }
});

test('/ko/admin-builder renders an attorney dynamic item page from the source-backed collection', async ({ page }) => {
  test.setTimeout(120_000);

  // attorney-profiles records are source-backed: static
  // src/data/attorney-profiles.ts merged with
  // site.sourceCollectionOverrides.attorneyProfiles — they no longer resolve
  // from site.cmsCollections.
  const routeResponse = await page.request.get('/api/builder/sites/default/dynamic-routes/attorney-profiles.item?locale=ko');
  expect(routeResponse.status()).toBe(200);
  const routePayload = (await routeResponse.json()) as {
    detail?: { sampleRecords?: Array<{ recordId: string; primaryLabel: string }> };
  };
  const records = routePayload.detail?.sampleRecords ?? [];
  expect(records.length).toBeGreaterThan(0);
  const attorneyRecord = records[0]!;
  expect(attorneyRecord.recordId).toBeTruthy();

  const token = Date.now().toString(36);
  const slug = `dynamic-item-attorney-${token}`;
  const sourceUrl = `/api/builder/lawyers/${attorneyRecord.recordId}?locale=ko`;
  let pageId: string | null = null;

  // Self-heal: drop any stale source override left by an interrupted run so
  // the merged source record equals the static record the canvas renders.
  let sourceResponse = await page.request.get(sourceUrl, { headers: mutationHeaders(slug) });
  expect(sourceResponse.status()).toBe(200);
  let sourcePayload = (await sourceResponse.json()) as {
    ok?: boolean;
    record?: { name?: string; description?: string; updatedAt?: string };
  };
  if (sourcePayload.record?.updatedAt) {
    await page.request.delete(sourceUrl, { headers: mutationHeaders(slug) });
    sourceResponse = await page.request.get(sourceUrl, { headers: mutationHeaders(slug) });
    expect(sourceResponse.status()).toBe(200);
    sourcePayload = (await sourceResponse.json()) as typeof sourcePayload;
  }
  const attorneyName = sourcePayload.record?.name ?? '';
  const attorneyDescription = sourcePayload.record?.description ?? '';
  expect(attorneyName).toBeTruthy();
  expect(attorneyDescription).toBeTruthy();

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Attorney dynamic item ${token}`,
        addToNavigation: false,
        dynamicItemCollectionId: 'attorney-profiles',
        dynamicItemRecordSlug: attorneyRecord.recordId,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: {
        dynamicItem?: {
          collectionId?: string;
          targetId?: string;
          slugField?: string;
          defaultRecordSlug?: string;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicItem).toMatchObject({
      collectionId: 'attorney-profiles',
      targetId: 'home.attorney.profile',
      slugField: 'slug',
      defaultRecordSlug: attorneyRecord.recordId,
    });

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${slug}/${attorneyRecord.recordId}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', attorneyDescription);
    await expect(page.locator('[data-node-id="dynamic-item-title-attorney-profiles"]').first()).toContainText(attorneyName);
    await expect(page.locator('[data-node-id="dynamic-item-summary-attorney-profiles"]').first()).toContainText(attorneyDescription);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});
