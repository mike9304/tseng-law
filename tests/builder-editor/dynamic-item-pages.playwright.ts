import { expect, test } from '@playwright/test';
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
