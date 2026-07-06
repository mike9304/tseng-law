'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { resolveHomeInsightsCardLabels } from '@/lib/builder/home-insights-card-format';
import type { Locale } from '@/lib/locales';
import { useBuilderColumnPosts } from './BuilderDatasetPreviewContext';
import { stopEditorPreviewNavigation } from './canvasNodeUtils';
import styles from './CanvasInsightsPreview.module.css';

const INSIGHTS_PAGE_SIZE = 3;

const insightsCopyByLocale = {
  ko: {
    dateFallback: '게시일 확인중',
    prevLabel: '이전',
    nextLabel: '다음',
  },
  'zh-hant': {
    dateFallback: '日期待確認',
    prevLabel: '上一頁',
    nextLabel: '下一頁',
  },
  en: {
    dateFallback: 'Date pending',
    prevLabel: 'Previous',
    nextLabel: 'Next',
  },
} as const;

type InsightsLocale = keyof typeof insightsCopyByLocale;

function insightsLocale(locale: string): Locale {
  return locale === 'zh-hant' || locale === 'en' ? locale : 'ko';
}

const nodeInsightsPreviewStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 20000,
  overflow: 'hidden',
  boxSizing: 'border-box',
  borderRadius: 'inherit',
  padding: '0.9rem 1rem 0.2rem',
  pointerEvents: 'auto',
};

function authorLabelForLocale(locale: InsightsLocale): string {
  if (locale === 'zh-hant') return '曾俊瑋律師審閱';
  if (locale === 'en') return 'Reviewed by Wei Tseng';
  return '증준외 변호사 검토';
}

export function InsightsArchiveListPreview({ locale }: { locale: string }) {
  const resolvedLocale = insightsLocale(locale);
  const copy = insightsCopyByLocale[resolvedLocale];
  const posts = useBuilderColumnPosts();
  const [page, setPage] = useState(0);
  const authorHref = getAttorneyProfilePath(resolvedLocale);
  const authorLabel = authorLabelForLocale(resolvedLocale);

  useEffect(() => {
    setPage(0);
  }, [posts.length, resolvedLocale]);

  const listPosts = useMemo(() => posts.slice(1), [posts]);
  const pageCount = Math.max(1, Math.ceil(listPosts.length / INSIGHTS_PAGE_SIZE));
  const visibleItems = useMemo(
    () => listPosts.slice(page * INSIGHTS_PAGE_SIZE, page * INSIGHTS_PAGE_SIZE + INSIGHTS_PAGE_SIZE),
    [listPosts, page],
  );

  if (posts.length <= 1) return null;

  return (
    <div
      data-builder-insights-preview="true"
      data-builder-insights-page={`${page + 1} / ${pageCount}`}
      style={nodeInsightsPreviewStyle}
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={stopEditorPreviewNavigation}
      onAuxClick={stopEditorPreviewNavigation}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          stopEditorPreviewNavigation(event);
        }
      }}
    >
      {pageCount > 1 ? (
        <div className="insights-controls">
          <button
            type="button"
            className="insights-nav-btn"
            aria-label={copy.prevLabel}
            onClick={() => setPage((current) => (current - 1 + pageCount) % pageCount)}
          >
            ‹ {copy.prevLabel}
          </button>
          <span className="insights-page-indicator">{page + 1} / {pageCount}</span>
          <button
            type="button"
            className="insights-nav-btn"
            aria-label={copy.nextLabel}
            onClick={() => setPage((current) => (current + 1) % pageCount)}
          >
            {copy.nextLabel} ›
          </button>
        </div>
      ) : null}
      <div className="insights-list" key={`builder-insights-page-${page}`}>
        {visibleItems.map((post) => {
          const image = post.featuredImage?.trim();
          const labels = resolveHomeInsightsCardLabels(post, copy.dateFallback);
          return (
            <article key={post.slug} className="insights-list-item">
              <div className="insights-list-thumb">
                <div
                  className={styles.nodeInsightsThumbImage}
                  style={image ? { backgroundImage: `url(${image})` } : undefined}
                  aria-label={post.title}
                  role="img"
                />
                <span className="insights-category-badge insights-category-badge--compact">
                  {post.categoryLabel}
                </span>
              </div>
              <div className="insights-list-copy">
                <div className="insights-meta-row">
                  <time className="insights-date">{labels.date}</time>
                  {labels.readTime ? <span className="insights-readtime">{labels.readTime}</span> : null}
                </div>
                <a
                  className="insights-byline"
                  href={authorHref}
                  aria-disabled="true"
                  draggable={false}
                  tabIndex={-1}
                >
                  {authorLabel}
                </a>
                <h4 className="insights-list-title">
                  <a
                    className="link-underline"
                    href={`/${resolvedLocale}/columns/${post.slug}`}
                    aria-disabled="true"
                    draggable={false}
                    tabIndex={-1}
                  >
                    {post.title}
                  </a>
                </h4>
                <p className="insights-list-summary">{post.summary}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
