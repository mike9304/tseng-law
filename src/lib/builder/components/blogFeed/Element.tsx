'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { BuilderBlogFeedCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import { DEFAULT_BLOG_CATEGORIES, filterPosts, sortPosts } from '@/lib/builder/blog/blog-engine';
import styles from './BlogFeed.module.css';

interface BlogFeedElementProps {
  node: BuilderBlogFeedCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}

type BlogFeedLayout = BuilderBlogFeedCanvasNode['content']['layout'];

interface FeedItem {
  postId: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  featured: boolean;
  featuredImage?: string;
  authorName: string;
  date: string;
  href: string;
}

type FeedRootStyle = CSSProperties & {
  '--blog-feed-columns': string;
  '--blog-feed-gap': string;
};

type CardStyle = CSSProperties & {
  '--blog-category-color': string;
  '--blog-category-bg': string;
  '--blog-image-bg': string;
};

const MOCK_POSTS: BlogPost[] = [
  {
    postId: 'mock-1',
    slug: 'mock-1',
    locale: 'ko',
    title: '대만 회사 설립 가이드',
    excerpt: '외국인이 대만에서 법인을 설립하는 절차와 필요한 서류를 알아봅니다.',
    bodyHtml: '',
    bodyMarkdown: '',
    category: 'company-setup',
    tags: ['외투'],
    readingTimeMinutes: 6,
    featured: true,
    author: { name: '호정국제 법률사무소' },
    publishedAt: '2026-04-12',
    updatedAt: '2026-04-12',
  },
  {
    postId: 'mock-2',
    slug: 'mock-2',
    locale: 'ko',
    title: '교통사고 합의금 산정 기준',
    excerpt: '대만 교통사고 처리 절차와 적정 합의금 산정 방법.',
    bodyHtml: '',
    bodyMarkdown: '',
    category: 'traffic-accident',
    tags: ['보험'],
    readingTimeMinutes: 4,
    featured: false,
    author: { name: '호정국제 법률사무소' },
    publishedAt: '2026-04-08',
    updatedAt: '2026-04-08',
  },
  {
    postId: 'mock-3',
    slug: 'mock-3',
    locale: 'ko',
    title: '대만 노동법 핵심 정리',
    excerpt: '연차/퇴직금/시간외 수당 등 외국인 근로자가 알아야 할 사항.',
    bodyHtml: '',
    bodyMarkdown: '',
    category: 'labor',
    tags: ['연차'],
    readingTimeMinutes: 7,
    featured: false,
    author: { name: '호정국제 법률사무소' },
    publishedAt: '2026-04-01',
    updatedAt: '2026-04-01',
  },
  {
    postId: 'mock-4',
    slug: 'mock-4',
    locale: 'ko',
    title: '국제이혼 관할권 분쟁',
    excerpt: '국적이 다른 부부의 이혼소송에서 어느 나라 법원에 제소할지.',
    bodyHtml: '',
    bodyMarkdown: '',
    category: 'family-law',
    tags: [],
    readingTimeMinutes: 5,
    featured: true,
    author: { name: '호정국제 법률사무소' },
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
  },
  {
    postId: 'mock-5',
    slug: 'mock-5',
    locale: 'ko',
    title: '형사 변호 조력 절차',
    excerpt: '경찰 조사부터 검찰 송치, 공판까지의 변호인 역할.',
    bodyHtml: '',
    bodyMarkdown: '',
    category: 'criminal',
    tags: [],
    readingTimeMinutes: 3,
    featured: false,
    author: { name: '호정국제 법률사무소' },
    publishedAt: '2026-03-19',
    updatedAt: '2026-03-19',
  },
  {
    postId: 'mock-6',
    slug: 'mock-6',
    locale: 'ko',
    title: '국제 상속 절차',
    excerpt: '대만에 자산을 둔 외국인 사망 시 상속 처리 흐름.',
    bodyHtml: '',
    bodyMarkdown: '',
    category: 'inheritance',
    tags: [],
    readingTimeMinutes: 6,
    featured: false,
    author: { name: '호정국제 법률사무소' },
    publishedAt: '2026-03-12',
    updatedAt: '2026-03-12',
  },
];

function clampInt(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function fmtDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function categoryMeta(slug?: string): { label: string; color: string } {
  const cat = DEFAULT_BLOG_CATEGORIES.find((c) => c.slug === slug);
  return {
    label: cat?.name.ko ?? slug ?? '일반',
    color: cat?.color ?? '#2d5c48',
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '').trim();
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return `rgba(45, 92, 72, ${alpha})`;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function imageGradient(color: string): string {
  return `linear-gradient(135deg, ${hexToRgba(color, 0.2)} 0%, #f8fafc 48%, ${hexToRgba(color, 0.12)} 100%)`;
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

function toFeedItem(post: BlogPost, isBuilder: boolean): FeedItem {
  return {
    postId: post.postId,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags ?? [],
    readingTimeMinutes: post.readingTimeMinutes,
    featured: post.featured,
    featuredImage: post.featuredImage,
    authorName: post.author?.name ?? '',
    date: fmtDate(post.publishedAt ?? post.updatedAt),
    href: isBuilder ? `#${post.slug}` : `/${post.locale}/columns/${post.slug}`,
  };
}

function getMockPosts(content: BuilderBlogFeedCanvasNode['content'], postsPerPage: number): BlogPost[] {
  const filtered = filterPosts(MOCK_POSTS, {
    category: content.filterByCategory,
    tag: content.filterByTag,
    locale: 'ko',
  });
  return sortPosts(filtered, content.sortBy).slice(0, postsPerPage);
}

export default function BlogFeedElement({ node, mode = 'edit' }: BlogFeedElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const layout = c.layout;
  const columns = clampInt(c.columns, 1, 4, 3);
  const gap = clampInt(c.gap, 0, 64, 24);
  const postsPerPage = clampInt(c.postsPerPage, 1, 50, 9);

  useEffect(() => {
    let cancelled = false;
    setPosts(null);
    setLoading(!isBuilder);
    setError(null);

    const params = new URLSearchParams();
    params.set('locale', 'ko');
    params.set('sort', c.sortBy);
    params.set('limit', String(postsPerPage));
    params.set('scope', isBuilder ? 'all' : 'public');
    if (c.filterByCategory) params.set('category', c.filterByCategory);
    if (c.filterByTag) params.set('tag', c.filterByTag);

    fetch(`/api/builder/blog/posts?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.ok && Array.isArray(json.posts)) setPosts(json.posts as BlogPost[]);
        else setError(json?.error || 'Failed to load posts');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'fetch_failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isBuilder, c.sortBy, c.filterByCategory, c.filterByTag, postsPerPage]);

  const items = useMemo(() => {
    const source = posts ?? (isBuilder ? getMockPosts(c, postsPerPage) : []);
    return source.slice(0, postsPerPage).map((post) => toFeedItem(post, isBuilder));
  }, [c, isBuilder, posts, postsPerPage]);

  const rootStyle: FeedRootStyle = {
    '--blog-feed-columns': String(columns),
    '--blog-feed-gap': `${gap}px`,
  };

  if (!isBuilder && loading) {
    return (
      <div className={styles.state} role="status">
        Loading posts...
      </div>
    );
  }

  if (!isBuilder && error) {
    return (
      <div className={`${styles.state} ${styles.stateError}`}>
        Blog feed error: {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        Blog Feed · 등록된 글이 없습니다.
      </div>
    );
  }

  return (
    <div
      className={[
        styles.feedRoot,
        layoutClass(layout),
        items.length === 1 ? styles.feedSingle : '',
        columns === 1 ? styles.feedOneColumn : '',
      ].filter(Boolean).join(' ')}
      style={rootStyle}
    >
      <div className={styles.feedSurface}>
        {items.map((item, index) => {
          const meta = categoryMeta(item.category);
          const isHero = layout === 'featured-hero' && index === 0;
          const cardStyle: CardStyle = {
            '--blog-category-color': meta.color,
            '--blog-category-bg': hexToRgba(meta.color, 0.1),
            '--blog-image-bg': imageGradient(meta.color),
          };
          const cardClassName = [
            styles.card,
            isHero ? styles.cardHero : '',
            !c.showFeaturedImage ? styles.cardNoImage : '',
          ].filter(Boolean).join(' ');

          return (
            <article key={item.postId} className={cardClassName} style={cardStyle}>
              <a className={styles.cardLink} href={item.href} aria-label={`${item.title} 글 보기`}>
                {c.showFeaturedImage ? (
                  <div className={styles.media}>
                    {item.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.featuredImage} alt="" loading="lazy" />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <span>{meta.label}</span>
                      </div>
                    )}
                    {item.featured ? <span className={styles.featuredBadge}>Featured</span> : null}
                  </div>
                ) : null}
                <div className={styles.body}>
                  {c.showCategory && item.category ? (
                    <span className={styles.categoryChip}>{meta.label}</span>
                  ) : null}
                  <h3 className={styles.title}>{item.title}</h3>
                  {c.showExcerpt && item.excerpt ? (
                    <p className={styles.excerpt}>{item.excerpt}</p>
                  ) : null}
                  <div className={styles.footer}>
                    <div className={styles.metaLine}>
                      {c.showAuthor && item.authorName ? <span>{item.authorName}</span> : null}
                      {c.showDate && item.date ? <span>{item.date}</span> : null}
                      {c.showReadingTime && item.readingTimeMinutes > 0 ? <span>{item.readingTimeMinutes}분 읽기</span> : null}
                    </div>
                    {c.showTags && item.tags.length > 0 ? (
                      <div className={styles.tags}>
                        {item.tags.slice(0, 4).map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    ) : null}
                    <span className={styles.readMore}>자세히 보기</span>
                  </div>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
