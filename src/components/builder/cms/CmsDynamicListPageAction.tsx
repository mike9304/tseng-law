'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { CmsDynamicListLinkedPages } from '@/components/builder/cms/CmsDynamicListLinkedPages';
import type { BuilderCmsCollectionDetail } from '@/lib/builder/cms-types';
import type { Locale } from '@/lib/locales';

const createDynamicPageResponseSchema = z.object({
  success: z.boolean().optional(),
  pageId: z.string().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  page: z.object({
    slug: z.string().optional(),
  }).optional(),
});

type CmsDynamicListPageActionProps = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collection: BuilderCmsCollectionDetail;
  readonly disabled?: boolean;
};

type CreatedPageState = {
  readonly pageId: string;
  readonly slug: string;
};

type CreateDynamicPagePayload = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly slug: string;
  readonly title: string;
  readonly addToNavigation: false;
  readonly dynamicListCmsCollectionId?: string;
  readonly dynamicListLimit?: number;
  readonly dynamicItemCmsCollectionId?: string;
  readonly dynamicItemRecordSlug?: string;
};

export function CmsDynamicListPageAction({
  locale,
  siteId,
  collection,
  disabled = false,
}: CmsDynamicListPageActionProps) {
  const router = useRouter();
  const [creatingList, setCreatingList] = useState(false);
  const [creatingItem, setCreatingItem] = useState(false);
  const [createdListPage, setCreatedListPage] = useState<CreatedPageState | null>(null);
  const [createdItemPage, setCreatedItemPage] = useState<CreatedPageState | null>(null);
  const [linkedPagesRefreshKey, setLinkedPagesRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const actionDisabled = disabled || creatingList || creatingItem;

  async function createDynamicListPage() {
    if (actionDisabled) return;
    const token = Date.now().toString(36);
    const slug = dynamicListPageSlug(collection, token);
    setCreatingList(true);
    setCreatedListPage(null);
    setError(null);
    try {
      const nextPage = await postCreatePage({
        locale,
        siteId,
        slug,
        title: `${collection.name} dynamic list ${token}`,
        addToNavigation: false,
        dynamicListCmsCollectionId: collection.collectionId,
        dynamicListLimit: dynamicListPageLimit(collection),
      });
      setCreatedListPage(nextPage);
      setLinkedPagesRefreshKey((current) => current + 1);
      router.push(`/${locale}/admin-builder?pageId=${encodeURIComponent(nextPage.pageId)}`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create dynamic list page.');
    } finally {
      setCreatingList(false);
    }
  }

  async function createDynamicItemPage() {
    if (actionDisabled) return;
    const token = Date.now().toString(36);
    const slug = dynamicItemPageSlug(collection, token);
    setCreatingItem(true);
    setCreatedItemPage(null);
    setError(null);
    try {
      const nextPage = await postCreatePage({
        locale,
        siteId,
        slug,
        title: `${collection.name} dynamic item ${token}`,
        addToNavigation: false,
        dynamicItemCmsCollectionId: collection.collectionId,
        dynamicItemRecordSlug: dynamicItemRecordSlug(collection),
      });
      setCreatedItemPage(nextPage);
      setLinkedPagesRefreshKey((current) => current + 1);
      router.push(`/${locale}/admin-builder?pageId=${encodeURIComponent(nextPage.pageId)}`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create dynamic item page.');
    } finally {
      setCreatingItem(false);
    }
  }

  return (
    <article className="builder-dashboard-page-card" data-cms-dynamic-list-page-action={collection.collectionId}>
      <div className="builder-dashboard-page-head">
        <div>
          <strong>Dynamic list page</strong>
          <span>Create a builder page that repeats records from this collection.</span>
        </div>
        <span className="builder-stage-pill">F20</span>
      </div>
      <div className="builder-dashboard-page-actions">
        <button
          type="button"
          className="builder-action-btn builder-action-btn--primary"
          data-cms-create-dynamic-list-page={collection.collectionId}
          disabled={actionDisabled}
          onClick={() => { void createDynamicListPage(); }}
        >
          {creatingList ? 'Creating page...' : 'Create dynamic list page'}
        </button>
        {createdListPage ? (
          <a
            className="builder-link-inline"
            href={`/${locale}/admin-builder?pageId=${encodeURIComponent(createdListPage.pageId)}`}
            data-cms-created-dynamic-list-page={createdListPage.pageId}
          >
            Open {createdListPage.slug}
          </a>
        ) : null}
      </div>
      <div className="builder-dashboard-page-head" style={{ marginTop: 12 }}>
        <div>
          <strong>Dynamic item page</strong>
          <span>Create a builder detail page for each record slug in this collection.</span>
        </div>
        <span className="builder-stage-pill">F21</span>
      </div>
      <div className="builder-dashboard-page-actions">
        <button
          type="button"
          className="builder-action-btn"
          data-cms-create-dynamic-item-page={collection.collectionId}
          disabled={actionDisabled}
          onClick={() => { void createDynamicItemPage(); }}
        >
          {creatingItem ? 'Creating page...' : 'Create dynamic item page'}
        </button>
        {createdItemPage ? (
          <a
            className="builder-link-inline"
            href={`/${locale}/admin-builder?pageId=${encodeURIComponent(createdItemPage.pageId)}`}
            data-cms-created-dynamic-item-page={createdItemPage.pageId}
          >
            Open {createdItemPage.slug}
          </a>
        ) : null}
      </div>
      {error ? (
        <span role="alert" style={{ color: '#b91c1c', fontSize: 13, fontWeight: 700 }}>
          {error}
        </span>
      ) : null}
      <CmsDynamicListLinkedPages
        locale={locale}
        siteId={siteId}
        collection={collection}
        refreshKey={linkedPagesRefreshKey}
      />
    </article>
  );
}

async function postCreatePage(payload: CreateDynamicPagePayload): Promise<CreatedPageState> {
  const response = await fetch('/api/builder/site/pages', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const parsed = createDynamicPageResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('Unexpected dynamic page response.');
  }
  const data = parsed.data;
  if (!response.ok || !data.success || !data.pageId) {
    throw new Error(data.error ?? data.message ?? 'Failed to create dynamic page.');
  }
  return {
    pageId: data.pageId,
    slug: data.page?.slug ?? payload.slug,
  };
}

function dynamicListPageSlug(collection: BuilderCmsCollectionDetail, token: string): string {
  const base = (collection.slug || collection.collectionId)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'cms-collection';
  return `${base}-list-${token}`.slice(0, 200).replace(/-+$/g, '');
}

function dynamicListPageLimit(collection: BuilderCmsCollectionDetail): number {
  const publishedCount = collection.records.filter((record) => record.status === 'published').length;
  if (publishedCount <= 6) return 6;
  return Math.min(12, publishedCount);
}

function dynamicItemPageSlug(collection: BuilderCmsCollectionDetail, token: string): string {
  const base = (collection.slug || collection.collectionId)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'cms-collection';
  return `${base}-item-${token}`.slice(0, 200).replace(/-+$/g, '');
}

function dynamicItemRecordSlug(collection: BuilderCmsCollectionDetail): string {
  const slugField = collection.fields.find((field) => field.type === 'slug')?.key
    ?? collection.fields.find((field) => field.key === 'slug')?.key;
  const record = collection.records.find((candidate) => candidate.status === 'published') ?? collection.records[0];
  if (!record || !slugField) return record?.recordId ?? 'sample';
  const value = record.fields[slugField];
  return typeof value === 'string' && value.trim() ? value.trim() : record.recordId;
}
