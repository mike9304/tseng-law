'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { BuilderBlogFeedCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { BlogFeedCard } from './BlogFeedCard';
import { getBlogFeedCopy } from './blog-feed-copy';
import { getMockPosts, parseBlogPostsPayload, toFeedItem } from './blog-feed-items';
import {
  PublishedBlogFeedArchiveControls,
  PublishedBlogFeedArchivePagination,
} from './PublishedBlogFeedArchiveControls';
import {
  usePublishedBlogFeedArchive,
  type PublishedBlogFeedArchiveState,
} from './usePublishedBlogFeedArchive';
import styles from './BlogFeed.module.css';

interface BlogFeedElementProps {
  node: BuilderBlogFeedCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

type BlogFeedLayout = BuilderBlogFeedCanvasNode['content']['layout'];

type FeedRootStyle = CSSProperties & {
  '--blog-feed-columns': string;
  '--blog-feed-gap': string;
};

function clampInt(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function layoutClass(layout: BlogFeedLayout): string {
  switch (layout) {
    case 'list':
      return styles.layoutList;
    case 'masonry':
      return styles.layoutMasonry;
    case 'featured-hero':
      return styles.layoutFeatured;
    case 'grid':
    default:
      return styles.layoutGrid;
  }
}

export default function BlogFeedElement(props: BlogFeedElementProps) {
  const mode = props.mode ?? 'edit';
  const isPublishedColumnsArchive = mode === 'published' && props.node.id === 'columns-feed';
  if (isPublishedColumnsArchive) return <PublishedColumnsBlogFeedElement {...props} mode={mode} />;
  return <BlogFeedElementCore {...props} mode={mode} archive={null} />;
}

function PublishedColumnsBlogFeedElement(props: BlogFeedElementProps) {
  const postsPerPage = clampInt(props.node.content.postsPerPage, 1, 50, 9);
  const archive = usePublishedBlogFeedArchive({
    enabled: true,
    postsPerPage,
  });

  return <BlogFeedElementCore {...props} archive={archive} />;
}

function BlogFeedElementCore({
  node,
  mode = 'edit',
  locale,
  archive,
}: BlogFeedElementProps & { archive: PublishedBlogFeedArchiveState | null }) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const archiveEnabled = Boolean(archive?.enabled);
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = getBlogFeedCopy(effectiveLocale);
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const layout = c.layout;
  const columns = clampInt(c.columns, 1, 4, 3);
  const gap = clampInt(c.gap, 0, 64, 24);
  const postsPerPage = clampInt(c.postsPerPage, 1, 50, 9);
  const archiveVisibleLimit = archive?.visibleLimit ?? postsPerPage;
  const archiveCategory = archive?.category ?? '';
  const archiveTag = archive?.tag ?? '';
  const archiveAuthor = archive?.author ?? '';
  const archiveQuery = archive?.query ?? '';

  useEffect(() => {
    let cancelled = false;
    setPosts(null);
    setTotalPosts(0);
    setLoading(!isBuilder);
    setHasError(false);

    const params = new URLSearchParams();
    params.set('locale', effectiveLocale);
    params.set('sort', c.sortBy);
    params.set('limit', String(archiveEnabled ? archiveVisibleLimit : postsPerPage));
    params.set('scope', isBuilder ? 'all' : 'public');
    const categoryFilter = c.filterByCategory || (archiveEnabled ? archiveCategory : '');
    const tagFilter = c.filterByTag || (archiveEnabled ? archiveTag : '');
    if (categoryFilter) params.set('category', categoryFilter);
    if (tagFilter) params.set('tag', tagFilter);
    if (archiveEnabled && archiveAuthor) params.set('author', archiveAuthor);
    if (archiveEnabled && archiveQuery) params.set('q', archiveQuery);

    fetch(`/api/builder/blog/posts?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const payload = parseBlogPostsPayload(json);
        if (payload) {
          setPosts(payload.posts);
          setTotalPosts(payload.total);
        } else {
          setHasError(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    archiveAuthor,
    archiveCategory,
    archiveQuery,
    archiveTag,
    archiveVisibleLimit,
    archiveEnabled,
    c.filterByCategory,
    c.filterByTag,
    c.sortBy,
    effectiveLocale,
    isBuilder,
    postsPerPage,
  ]);

  const items = useMemo(() => {
    const source = posts ?? (isBuilder ? getMockPosts(c, postsPerPage, effectiveLocale, copy) : []);
    const limit = archiveEnabled ? archiveVisibleLimit : postsPerPage;
    return source.slice(0, limit).map((post) => toFeedItem(post, isBuilder, effectiveLocale));
  }, [archiveEnabled, archiveVisibleLimit, c, copy, effectiveLocale, isBuilder, posts, postsPerPage]);

  const rootStyle: FeedRootStyle = {
    '--blog-feed-columns': String(columns),
    '--blog-feed-gap': `${gap}px`,
  };

  if (!isBuilder && loading) {
    return (
      <div className={styles.state} role="status">
        {copy.element.loading}
      </div>
    );
  }

  if (!isBuilder && hasError) {
    return (
      <div className={`${styles.state} ${styles.stateError}`}>
        {copy.element.errorPrefix} {copy.element.loadError}
      </div>
    );
  }

  if (!archiveEnabled && items.length === 0) {
    return (
      <div className={styles.emptyState}>
        {copy.element.emptyState}
      </div>
    );
  }

  const remainingCount = archiveEnabled ? Math.max(0, totalPosts - items.length) : 0;
  const rootClassName = [
    styles.feedRoot,
    archiveEnabled ? styles.archiveRoot : '',
    layoutClass(layout),
    items.length === 1 ? styles.feedSingle : '',
    columns === 1 ? styles.feedOneColumn : '',
  ].filter(Boolean).join(' ');
  const feedSurfaceClassName = [
    styles.feedSurface,
    archiveEnabled ? 'columns-grid' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      data-builder-blog-feed="true"
      className={rootClassName}
      style={rootStyle}
    >
      {archive ? (
        <PublishedBlogFeedArchiveControls
          locale={effectiveLocale}
          query={archive.query}
          category={archive.category}
          searchInput={archive.searchInput}
          totalCount={totalPosts}
          setSearchInput={archive.setSearchInput}
          submitSearch={archive.submitSearch}
          clearSearch={archive.clearSearch}
          setCategory={archive.setCategory}
        />
      ) : null}
      {items.length === 0 ? (
        <div className={`${styles.emptyState} columns-empty`}>
          {copy.element.emptyState}
        </div>
      ) : (
        <div
          className={feedSurfaceClassName}
          data-columns-visible-count={archiveEnabled ? items.length : undefined}
        >
          {items.map((item, index) => (
            <BlogFeedCard
              key={item.postId}
              item={item}
              index={index}
              content={c}
              layout={layout}
              locale={effectiveLocale}
              copy={copy}
              archiveEnabled={archiveEnabled}
            />
          ))}
        </div>
      )}
      {archive ? (
        <PublishedBlogFeedArchivePagination
          locale={effectiveLocale}
          remainingCount={remainingCount}
          loadMore={archive.loadMore}
        />
      ) : null}
    </div>
  );
}
