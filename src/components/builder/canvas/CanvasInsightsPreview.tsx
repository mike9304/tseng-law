'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_BLOG_CATEGORIES, type BlogPost } from '@/lib/builder/blog/blog-engine';
import { loadInsightsPreviewPosts } from './insights-preview-cache';
import { stopEditorPreviewNavigation } from './canvasNodeUtils';
import styles from './CanvasInsightsPreview.module.css';

const INSIGHTS_PAGE_SIZE = 3;

const insightsCopyByLocale = {
  ko: {
    dateFallback: '게시일 확인중',
    prevLabel: '이전',
    nextLabel: '다음',
    readTimeSuffix: '분 읽기',
    readMore: '자세히 보기',
  },
  'zh-hant': {
    dateFallback: '日期待確認',
    prevLabel: '上一頁',
    nextLabel: '下一頁',
    readTimeSuffix: '分鐘閱讀',
    readMore: '閱讀全文',
  },
  en: {
    dateFallback: 'Date pending',
    prevLabel: 'Previous',
    nextLabel: 'Next',
    readTimeSuffix: 'min read',
    readMore: 'Read more',
  },
} as const;

type InsightsLocale = keyof typeof insightsCopyByLocale;

function insightsLocale(locale: string): InsightsLocale {
  return locale === 'zh-hant' || locale === 'en' ? locale : 'ko';
}

function insightCategoryLabel(category: string | undefined, locale: InsightsLocale): string {
  if (!category) return DEFAULT_BLOG_CATEGORIES.find((item) => item.slug === 'general')?.name[locale] ?? 'General';
  return DEFAULT_BLOG_CATEGORIES.find((item) => item.slug === category)?.name[locale] ?? category;
}

function insightDateLabel(post: BlogPost, locale: InsightsLocale): string {
  const value = post.publishedAt || post.updatedAt;
  if (!value) return insightsCopyByLocale[locale].dateFallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10) || insightsCopyByLocale[locale].dateFallback;
  return date.toISOString().slice(0, 10);
}

function insightReadTimeLabel(post: BlogPost, locale: InsightsLocale): string {
  return post.readingTimeMinutes > 0
    ? `${post.readingTimeMinutes}${locale === 'en' ? ' ' : ''}${insightsCopyByLocale[locale].readTimeSuffix}`
    : '';
}

export function InsightsArchiveListPreview({ locale }: { locale: string }) {
  const resolvedLocale = insightsLocale(locale);
  const copy = insightsCopyByLocale[resolvedLocale];
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setPage(0);
    loadInsightsPreviewPosts(resolvedLocale)
      .then((nextPosts) => {
        if (cancelled) return;
        setPosts(nextPosts);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [resolvedLocale]);

  const listPosts = useMemo(() => posts.slice(1), [posts]);
  const pageCount = Math.max(1, Math.ceil(listPosts.length / INSIGHTS_PAGE_SIZE));
  const visibleItems = useMemo(
    () => listPosts.slice(page * INSIGHTS_PAGE_SIZE, page * INSIGHTS_PAGE_SIZE + INSIGHTS_PAGE_SIZE),
    [listPosts, page],
  );

  if (!loaded || posts.length <= 1) return null;

  return (
    <div
      className={styles.nodeInsightsPreview}
      data-builder-insights-preview="true"
      data-builder-insights-page={`${page + 1} / ${pageCount}`}
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
            {copy.prevLabel}
          </button>
          <span className="insights-page-indicator">{page + 1} / {pageCount}</span>
          <button
            type="button"
            className="insights-nav-btn"
            aria-label={copy.nextLabel}
            onClick={() => setPage((current) => (current + 1) % pageCount)}
          >
            {copy.nextLabel}
          </button>
        </div>
      ) : null}
      <div className="insights-list" key={`builder-insights-page-${page}`}>
        {visibleItems.map((post) => {
          const image = post.featuredImage?.trim();
          return (
            <article key={post.postId} className="insights-list-item">
              <div className="insights-list-thumb">
                <div
                  className={styles.nodeInsightsThumbImage}
                  style={image ? { backgroundImage: `url(${image})` } : undefined}
                  aria-label={post.title}
                  role="img"
                />
                <span className="insights-category-badge insights-category-badge--compact">
                  {insightCategoryLabel(post.category, resolvedLocale)}
                </span>
              </div>
              <div className="insights-list-copy">
                <div className="insights-meta-row">
                  <time className="insights-date">{insightDateLabel(post, resolvedLocale)}</time>
                  <span className="insights-readtime">{insightReadTimeLabel(post, resolvedLocale)}</span>
                </div>
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
                <p className="insights-list-summary">{post.excerpt}</p>
                <a
                  className={styles.nodeInsightsReadMore}
                  href={`/${resolvedLocale}/columns/${post.slug}`}
                  aria-disabled="true"
                  draggable={false}
                  tabIndex={-1}
                >
                  {copy.readMore}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
