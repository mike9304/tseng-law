import { expect, type Page } from '@playwright/test';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';

type CreatedDynamicItemPage = {
  readonly pageId: string;
  readonly slug: string;
};

export async function gotoCmsCollectionDetail(page: Page, collectionId: string): Promise<void> {
  await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collectionId)}`, {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.locator(`[data-cms-dynamic-list-page-action="${collectionId}"]`))
    .toBeVisible({ timeout: 20_000 });
}

export async function useCmsPolicyTestRequestScope(page: Page, collectionId: string): Promise<void> {
  await page.setExtraHTTPHeaders(scopedMutationHeaders(collectionId));
}

export async function createDynamicItemPageViaApi(
  page: Page,
  collection: BuilderCmsCollection,
): Promise<CreatedDynamicItemPage> {
  const token = Date.now().toString(36);
  const slug = dynamicItemPageSlug(collection, token);
  const response = await page.request.post('/api/builder/site/pages', {
    headers: scopedMutationHeaders(collection.collectionId),
    data: {
      locale: 'ko',
      siteId: 'default',
      slug,
      title: `${collection.name} dynamic item ${token}`,
      addToNavigation: false,
      dynamicItemCmsCollectionId: collection.collectionId,
      dynamicItemRecordSlug: dynamicItemRecordSlug(collection),
    },
  });
  expect(response.status()).toBe(200);
  const payload = await response.json() as {
    success?: boolean;
    pageId?: unknown;
    error?: string;
    page?: { slug?: unknown };
  };
  expect(payload.success, payload.error).toBe(true);
  if (typeof payload.pageId !== 'string') {
    throw new Error('Dynamic item page creation did not return pageId.');
  }
  const publicSlug = typeof payload.page?.slug === 'string' ? payload.page.slug : slug;
  return { pageId: payload.pageId, slug: publicSlug };
}

function scopedMutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-item-policy';
  return { 'x-forwarded-for': `pw-create-${safeScope}` };
}

function dynamicItemPageSlug(collection: BuilderCmsCollection, token: string): string {
  const base = (collection.slug || collection.collectionId)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'cms-collection';
  return `${base}-item-${token}`.slice(0, 200).replace(/-+$/g, '');
}

function dynamicItemRecordSlug(collection: BuilderCmsCollection): string {
  const slugField = collection.fields.find((field) => field.type === 'slug')?.key
    ?? collection.fields.find((field) => field.key === 'slug')?.key;
  const record = collection.records.find((candidate) => candidate.status === 'published') ?? collection.records[0];
  if (!record || !slugField) return record?.recordId ?? 'sample';
  const value = record.fields[slugField];
  return typeof value === 'string' && value.trim() ? value.trim() : record.recordId;
}
