'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { BuilderBlogRecentPostsCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import { DEFAULT_BLOG_CATEGORIES } from '@/lib/builder/blog/blog-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { WidgetDataDisclosure } from '../_shared/WidgetDataDisclosure';
import { getBlogRecentPostsCopy, type BlogRecentPostMock } from './blog-recent-posts-copy';
import styles from './BlogRecentPosts.module.css';

interface BlogRecentPostsElementProps {
  node: BuilderBlogRecentPostsCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

type RecentPostItem = BlogRecentPostMock;

function clampLimit(value: number): number {
  if (!Number.isFinite(value)) return 5;
  return Math.min(20, Math.max(1, Math.round(value)));
}

function fmtDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function categoryLabel(slug: string, locale: Locale): string {
  const category = DEFAULT_BLOG_CATEGORIES.find((item) => item.slug === slug);
  return category?.name[locale] ?? category?.name.ko ?? slug;
}

function toItem(post: BlogPost): RecentPostItem {
  return {
    postId: post.postId,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    authorName: post.author?.name ?? '',
    date: fmtDate(post.publishedAt ?? post.updatedAt),
  };
}

export default function BlogRecentPostsElement({
  node,
  mode = 'edit',
  locale,
}: BlogRecentPostsElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = getBlogRecentPostsCopy(effectiveLocale);
  const limit = clampLimit(c.limit);
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPosts(null);
    setLoading(!isBuilder);

    const params = new URLSearchParams({
      locale: effectiveLocale,
      sort: 'newest',
      limit: String(limit),
      scope: isBuilder ? 'all' : 'public',
    });

    fetch(`/api/builder/blog/posts?${params.toString()}`)
      .then((response) => response.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.ok && Array.isArray(json.posts)) setPosts(json.posts as BlogPost[]);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveLocale, isBuilder, limit]);

  const items = useMemo(() => {
    const source = posts ? posts.map(toItem) : isBuilder ? copy.element.mockPosts : [];
    return source.slice(0, limit);
  }, [copy.element.mockPosts, isBuilder, limit, posts]);

  if (!isBuilder && loading) {
    return (
      <div className={styles.state} data-builder-blog-recent-posts="true" role="status">
        {copy.element.loading}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.state} data-builder-blog-recent-posts="true">
        {copy.element.emptyState}
      </div>
    );
  }

  return (
    <section
      className={`${styles.recentRoot} ${c.layout === 'cards' ? styles.recentCards : styles.recentList}`}
      data-builder-blog-recent-posts="true"
    >
      {isBuilder ? <WidgetDataDisclosure locale={effectiveLocale} /> : null}
      {items.map((item) => (
        <a
          key={item.postId}
          className={styles.recentItem}
          href={isBuilder ? `#${item.slug}` : `/${effectiveLocale}/columns/${item.slug}`}
        >
          {c.showCategory ? <span className={styles.category}>{categoryLabel(item.category, effectiveLocale)}</span> : null}
          <strong>{item.title}</strong>
          {c.showExcerpt && item.excerpt ? <span className={styles.excerpt}>{item.excerpt}</span> : null}
          <span className={styles.meta}>
            {c.showAuthor && item.authorName ? <span>{item.authorName}</span> : null}
            {c.showDate && item.date ? <time>{item.date}</time> : null}
          </span>
        </a>
      ))}
    </section>
  );
}
