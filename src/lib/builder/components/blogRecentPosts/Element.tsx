'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BuilderBlogRecentPostsCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import { DEFAULT_BLOG_CATEGORIES } from '@/lib/builder/blog/blog-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './BlogRecentPosts.module.css';

interface BlogRecentPostsElementProps {
  node: BuilderBlogRecentPostsCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

interface RecentPostItem {
  postId: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  date: string;
}

const MOCK_POSTS: RecentPostItem[] = [
  {
    postId: 'recent-1',
    slug: 'recent-1',
    title: '대만 회사설립 체크리스트',
    excerpt: '법인 설립 전 확인해야 할 절차와 실무 쟁점.',
    category: 'company-formation',
    authorName: '호정국제 법률사무소',
    date: '2026-04-12',
  },
  {
    postId: 'recent-2',
    slug: 'recent-2',
    title: '노동계약 분쟁 대응',
    excerpt: '근로계약, 퇴직금, 해고 통지 관련 핵심 정리.',
    category: 'labor-law',
    authorName: '대만 비즈니스 법무팀',
    date: '2026-04-08',
  },
  {
    postId: 'recent-3',
    slug: 'recent-3',
    title: '교통사고 합의 절차',
    excerpt: '보험사 협의와 손해 산정에서 놓치기 쉬운 항목.',
    category: 'traffic-accident',
    authorName: '분쟁대응팀',
    date: '2026-04-01',
  },
];

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
    const source = posts ? posts.map(toItem) : isBuilder ? MOCK_POSTS : [];
    return source.slice(0, limit);
  }, [isBuilder, limit, posts]);

  if (!isBuilder && loading) {
    return (
      <div className={styles.state} data-builder-blog-recent-posts="true" role="status">
        Loading posts...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.state} data-builder-blog-recent-posts="true">
        최근 공개 글이 없습니다.
      </div>
    );
  }

  return (
    <section
      className={`${styles.recentRoot} ${c.layout === 'cards' ? styles.recentCards : styles.recentList}`}
      data-builder-blog-recent-posts="true"
    >
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
