'use client';

import { useCallback, useMemo, useState, type CSSProperties } from 'react';
import ColumnContent from '@/components/ColumnContent';
import ColumnEditor from '@/components/builder/columns/ColumnEditor';
import ColumnFrontmatterPanel from '@/components/builder/columns/ColumnFrontmatterPanel';
import ColumnLocaleLinker from '@/components/builder/columns/ColumnLocaleLinker';
import { getColumnEditCopy } from '@/components/builder/columns/column-edit-copy';
import {
  estimateReadingTime,
  getCategoryLabel,
  getColumnBlogCategory,
} from '@/components/builder/columns/blogAdminMeta';
import { resolveTypography } from '@/lib/builder/columns/typography';
import type { ColumnDocument, ColumnLinkedSlugs, ColumnTypography } from '@/lib/builder/columns/types';
import type { Locale } from '@/lib/locales';

interface ColumnEditWorkspaceProps {
  slug: string;
  locale: Locale;
  column: ColumnDocument;
  hasPublished: boolean;
}

export default function ColumnEditWorkspace({
  slug,
  locale,
  column,
  hasPublished,
}: ColumnEditWorkspaceProps) {
  const copy = getColumnEditCopy(locale);
  const [typography, setTypography] = useState<ColumnTypography | null>(
    column.frontmatter.typography ?? null,
  );

  const handleTypographyChange = useCallback((next: ColumnTypography) => {
    setTypography(next);
  }, []);

  const resolved = useMemo(
    () => resolveTypography(locale, typography ?? column.frontmatter.typography),
    [locale, typography, column.frontmatter.typography],
  );

  const category = getColumnBlogCategory(column.frontmatter);
  const authorName = column.frontmatter.author?.name ?? '호정국제 법률사무소';
  const readingTime = estimateReadingTime(`${column.summary} ${column.bodyMarkdown} ${column.bodyHtml}`);
  const dateLocale = locale === 'zh-hant' ? 'zh-Hant-TW' : locale === 'ko' ? 'ko-KR' : 'en-US';
  const previewMarkdown = column.bodyMarkdown?.trim()
    || column.summary
    || copy.previewFallback;

  return (
    <div className="column-editor-grid column-editor-grid--writer">
      <div className="column-editor-main-rail">
        <ColumnEditor
          slug={slug}
          locale={locale}
          initialContent={{
            title: column.title,
            summary: column.summary,
            bodyHtml: column.bodyHtml,
            bodyMarkdown: column.bodyMarkdown,
          }}
          initialTypography={column.frontmatter.typography}
          typography={typography}
        />
        <details className="column-editor-advanced-shell">
          <summary>
            <span>{copy.advancedSummaryTitle}</span>
            <strong>{copy.advancedSummaryDescription}</strong>
          </summary>
          <div className="column-editor-advanced-grid">
            <div className="column-editor-meta-rail">
              <ColumnFrontmatterPanel
                slug={slug}
                locale={locale}
                initial={column.frontmatter}
                hasPublished={hasPublished}
                onTypographyChange={handleTypographyChange}
              />
              <ColumnLocaleLinker
                slug={slug}
                locale={locale}
                linkedSlugs={(column.linkedSlugs || {}) as ColumnLinkedSlugs}
              />
            </div>
            <aside className="column-editor-preview-rail">
              <div className="column-preview-card">
                <div className="column-preview-toolbar">
                  <span>{copy.previewLabel}</span>
                  <strong>
                    {readingTime}
                    {copy.previewReadingTimeSuffix}
                  </strong>
                </div>
                <p className="column-preview-note">{copy.previewMarkdownNote}</p>
                {column.frontmatter.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="column-preview-image" src={column.frontmatter.featuredImage} alt="" />
                ) : (
                  <div className="column-preview-image column-preview-image-placeholder">
                    {column.title.slice(0, 2).toUpperCase() || 'HJ'}
                  </div>
                )}
                <div className="column-preview-body">
                  <span className="column-category-chip" style={{ background: category.color }}>
                    {getCategoryLabel(category, locale)}
                  </span>
                  <h2>{column.title}</h2>
                  <p className="column-preview-summary">{column.summary}</p>
                  <div className="column-preview-meta">
                    <span>{authorName}</span>
                    <span>
                      {column.frontmatter.publishedAt
                        ? new Date(column.frontmatter.publishedAt).toLocaleDateString(dateLocale)
                        : copy.draftLabel}
                    </span>
                  </div>
                  <article
                    className={`column-preview-article ${resolved.className}`}
                    data-column-typography={resolved.presetId}
                    data-preview-mode="markdown"
                    style={resolved.cssVars as CSSProperties}
                  >
                    <ColumnContent content={previewMarkdown} />
                  </article>
                </div>
              </div>
            </aside>
          </div>
        </details>
      </div>
    </div>
  );
}
