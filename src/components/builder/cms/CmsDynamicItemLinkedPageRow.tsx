'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CmsDynamicItemRouteActions } from '@/components/builder/cms/CmsDynamicItemRouteActions';
import {
  resolveLinkedItemRouteCoverage,
  type LinkedDynamicItemPage,
} from '@/components/builder/cms/cms-dynamic-linked-pages-model';
import type { BuilderCmsCollectionDetail } from '@/lib/builder/cms-types';
import type { Locale } from '@/lib/locales';

type CmsDynamicItemLinkedPageRowProps = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collection: BuilderCmsCollectionDetail;
  readonly page: LinkedDynamicItemPage;
};

export function CmsDynamicItemLinkedPageRow({
  locale,
  siteId,
  collection,
  page,
}: CmsDynamicItemLinkedPageRowProps) {
  const coverage = resolveLinkedItemRouteCoverage({
    page,
    collection,
    locale,
  });

  return (
    <div style={linkedPageRowStyle} data-cms-dynamic-item-linked-page={page.pageId}>
      <div style={routeSummaryStyle}>
        <strong>{page.title}</strong>
        <span style={linkedPagesHintStyle}>
          {page.slug}/{page.recordSlug} · {page.published ? 'published' : 'draft'} · {page.slugField} field
        </span>
        <span
          style={linkedPagesHintStyle}
          data-cms-dynamic-item-route-coverage={page.pageId}
        >
          {coverage.publishedRouteCount} published record routes ready · {coverage.draftRecordCount} draft held
          back · {coverage.missingSlugCount} missing {coverage.slugField} values · {coverage.slugConflictCount}
          {' '}duplicate {coverage.slugField} conflicts · {coverage.archivedRecordCount} archived item records
        </span>
        {coverage.sampleRoutes.length ? (
          <div
            style={recordRoutesStyle}
            data-cms-dynamic-item-route-samples={page.pageId}
          >
            {coverage.sampleRoutes.map((route) => (
              <Link
                key={route.recordId}
                href={route.publicHref}
                className="builder-link-inline"
                data-cms-dynamic-item-record-route={route.recordId}
              >
                {route.slug}
              </Link>
            ))}
          </div>
        ) : (
          <span style={linkedPagesHintStyle}>No published record routes are ready yet.</span>
        )}
        <CmsDynamicItemRouteActions
          collection={collection}
          coverage={coverage}
          locale={locale}
          page={page}
          siteId={siteId}
        />
      </div>
      <div className="builder-dashboard-page-actions">
        <Link
          href={page.editorHref}
          className="builder-action-btn"
          data-cms-dynamic-item-editor-link={page.pageId}
        >
          Open editor
        </Link>
        <Link
          href={page.publicHref}
          className="builder-link-inline"
          data-cms-dynamic-item-public-link={page.pageId}
        >
          Open public route
        </Link>
      </div>
    </div>
  );
}

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

const routeSummaryStyle = {
  flex: '1 1 220px',
  minWidth: 0,
} satisfies CSSProperties;

const linkedPagesHintStyle = {
  display: 'block',
  color: '#64748b',
  fontSize: 13,
} satisfies CSSProperties;

const recordRoutesStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 6,
} satisfies CSSProperties;
