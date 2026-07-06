'use client';

import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import { CmsDynamicItemLinkedPagesSection } from '@/components/builder/cms/CmsDynamicItemLinkedPagesSection';
import {
  linkedPagesResponseSchema,
  resolveLinkedItemPages,
  resolveLinkedListPages,
  type LinkedDynamicItemPage,
  type LinkedDynamicListPage,
} from '@/components/builder/cms/cms-dynamic-linked-pages-model';
import type { BuilderCmsCollectionDetail } from '@/lib/builder/cms-types';
import type { Locale } from '@/lib/locales';

type CmsDynamicListLinkedPagesProps = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collection: BuilderCmsCollectionDetail;
  readonly refreshKey: number;
};

export function CmsDynamicListLinkedPages({
  locale,
  siteId,
  collection,
  refreshKey,
}: CmsDynamicListLinkedPagesProps) {
  const collectionId = collection.collectionId;
  const [listPages, setListPages] = useState<readonly LinkedDynamicListPage[]>([]);
  const [itemPages, setItemPages] = useState<readonly LinkedDynamicItemPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadPages() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ locale, siteId });
        const response = await fetch(`/api/builder/site/pages?${params.toString()}`, {
          credentials: 'same-origin',
          signal: controller.signal,
        });
        const parsed = linkedPagesResponseSchema.safeParse(await response.json());
        if (!response.ok || !parsed.success) {
          throw new Error('Unable to load linked dynamic list pages.');
        }
        const pages = parsed.data.pages ?? [];
        setListPages(resolveLinkedListPages({
          pages,
          locale,
          collectionId,
        }));
        setItemPages(resolveLinkedItemPages({
          pages,
          locale,
          collectionId,
        }));
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === 'AbortError') return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load linked dynamic list pages.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadPages();
    return () => controller.abort();
  }, [collectionId, locale, refreshKey, siteId]);

  if (loading) {
    return <span style={linkedPagesHintStyle}>Loading linked dynamic list pages...</span>;
  }

  if (error) {
    return <span role="alert" style={linkedPagesErrorStyle}>{error}</span>;
  }

  if (!listPages.length && !itemPages.length) {
    return <span style={linkedPagesHintStyle}>No dynamic pages are linked yet.</span>;
  }

  return (
    <div style={linkedPagesListStyle} data-cms-dynamic-linked-pages={collectionId}>
      {listPages.length ? (
        <section style={linkedPagesSectionStyle} data-cms-dynamic-list-linked-pages={collectionId}>
          <strong style={linkedPagesTitleStyle}>Linked dynamic list pages</strong>
          {listPages.map((page) => (
            <div key={page.pageId} style={linkedPageRowStyle} data-cms-dynamic-list-linked-page={page.pageId}>
              <div>
                <strong>{page.title}</strong>
                <span style={linkedPagesHintStyle}>
                  {page.slug} · {page.published ? 'published' : 'draft'} · {page.limit ?? 0} items
                </span>
              </div>
              <div className="builder-dashboard-page-actions">
                <Link
                  href={page.editorHref}
                  className="builder-action-btn"
                  data-cms-dynamic-list-editor-link={page.pageId}
                >
                  Open editor
                </Link>
                <Link
                  href={page.publicHref}
                  className="builder-link-inline"
                  data-cms-dynamic-list-public-link={page.pageId}
                >
                  Open public route
                </Link>
              </div>
            </div>
          ))}
        </section>
      ) : null}
      {itemPages.length ? (
        <CmsDynamicItemLinkedPagesSection
          collection={collection}
          itemPages={itemPages}
          locale={locale}
          siteId={siteId}
        />
      ) : null}
    </div>
  );
}

const linkedPagesListStyle = {
  display: 'grid',
  gap: 8,
  marginTop: 12,
  minWidth: 0,
  width: '100%',
} satisfies CSSProperties;

const linkedPagesSectionStyle = {
  display: 'grid',
  gap: 8,
  minWidth: 0,
  width: '100%',
} satisfies CSSProperties;

const linkedPageRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  border: '1px solid #dbe4f0',
  borderRadius: 8,
  minWidth: 0,
  padding: 12,
  width: '100%',
} satisfies CSSProperties;

const linkedPagesTitleStyle = {
  color: '#0f172a',
  fontSize: 13,
} satisfies CSSProperties;

const linkedPagesHintStyle = {
  display: 'block',
  color: '#64748b',
  fontSize: 13,
} satisfies CSSProperties;

const linkedPagesErrorStyle = {
  color: '#b91c1c',
  fontSize: 13,
  fontWeight: 700,
} satisfies CSSProperties;
