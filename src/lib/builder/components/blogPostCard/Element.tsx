'use client';

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import type { BuilderBlogPostCardCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import { DEFAULT_BLOG_CATEGORIES } from '@/lib/builder/blog/blog-engine';
import {
  legacyCardStyleToVariant,
  resolveCardVariantStyle,
} from '@/lib/builder/site/component-variants';
import styles from './BlogPostCard.module.css';

interface BlogPostCardElementProps {
  node: BuilderBlogPostCardCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  theme?: BuilderTheme;
}

type CardContent = BuilderBlogPostCardCanvasNode['content'];

interface CardItem {
  postId: string;
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  category: string;
  readingTimeMinutes: number;
  featured: boolean;
  featuredImage?: string;
  authorName: string;
  authorPhoto?: string;
  authorTitle?: string;
  date: string;
}

type CardVars = CSSProperties & {
  '--blog-card-category-color': string;
  '--blog-card-category-bg': string;
  '--blog-card-image-bg': string;
};

const MOCK_POST: CardItem = {
  postId: 'mock',
  slug: 'mock',
  locale: 'ko',
  title: '대만 회사 설립 가이드',
  excerpt: '외국인이 대만에서 법인을 설립하는 절차와 필요한 서류를 알아봅니다.',
  category: 'company-setup',
  authorName: '호정국제 법률사무소',
  authorTitle: 'Taiwan Legal Desk',
  date: '2026-04-12',
  readingTimeMinutes: 6,
  featured: true,
};

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

function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'BL';
  return Array.from(trimmed).slice(0, 2).join('').toUpperCase();
}

function toCardItem(post: BlogPost): CardItem {
  return {
    postId: post.postId,
    slug: post.slug,
    locale: post.locale,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    readingTimeMinutes: post.readingTimeMinutes,
    featured: post.featured,
    featuredImage: post.featuredImage,
    authorName: post.author?.name ?? '',
    authorPhoto: post.author?.photo,
    authorTitle: post.author?.title,
    date: fmtDate(post.publishedAt ?? post.updatedAt),
  };
}

function CardShell({
  item,
  content,
  href,
  notice,
  theme,
  tone = 'normal',
}: {
  item: CardItem;
  content: CardContent;
  href?: string;
  notice?: string;
  theme?: BuilderTheme;
  tone?: 'normal' | 'muted' | 'error';
}) {
  const meta = categoryMeta(item.category);
  const variantStyle = resolveCardVariantStyle(
    content.variant ?? legacyCardStyleToVariant(content.cardStyle),
    theme,
  );
  const vars: CardVars = {
    '--blog-card-category-color': meta.color,
    '--blog-card-category-bg': hexToRgba(meta.color, 0.1),
    '--blog-card-image-bg': imageGradient(meta.color),
    ...variantStyle,
  };
  const className = [
    styles.card,
    tone === 'muted' ? styles.cardMuted : '',
    tone === 'error' ? styles.cardError : '',
    !content.showFeaturedImage ? styles.cardNoImage : '',
  ].filter(Boolean).join(' ');

  const body: ReactNode = (
    <>
      {content.showFeaturedImage ? (
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
          {notice ? <span className={styles.noticeBadge}>{notice}</span> : null}
        </div>
      ) : null}
      <div className={styles.body}>
        <div className={styles.topline}>
          {content.showCategory && item.category ? (
            <span className={styles.categoryChip}>{meta.label}</span>
          ) : null}
          {!content.showFeaturedImage && notice ? <span className={styles.inlineNotice}>{notice}</span> : null}
        </div>
        <h3 className={styles.title}>{item.title}</h3>
        {content.showExcerpt && item.excerpt ? <p className={styles.excerpt}>{item.excerpt}</p> : null}
        <div className={styles.footer}>
          <div className={styles.metaBlock}>
            {content.showAuthor && item.authorName ? (
              <span className={styles.author}>
                <span className={styles.avatar}>
                  {item.authorPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.authorPhoto} alt="" loading="lazy" />
                  ) : (
                    <span>{initials(item.authorName)}</span>
                  )}
                </span>
                <span className={styles.authorCopy}>
                  <span>{item.authorName}</span>
                  {item.authorTitle ? <small>{item.authorTitle}</small> : null}
                </span>
              </span>
            ) : null}
            <span className={styles.metaLine}>
              {content.showDate && item.date ? <span>{item.date}</span> : null}
              {content.showReadingTime && item.readingTimeMinutes > 0 ? <span>{item.readingTimeMinutes}분 읽기</span> : null}
            </span>
          </div>
          <span className={styles.readMore}>자세히 보기</span>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <a className={className} href={href} aria-label={`${item.title} 글 보기`} style={vars}>
        {body}
      </a>
    );
  }

  return (
    <article className={className} style={vars}>
      {body}
    </article>
  );
}

export default function BlogPostCardElement({ node, mode = 'edit', theme }: BlogPostCardElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!c.postId) {
      setPost(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setPost(null);
    setError(null);
    setLoading(true);

    const params = new URLSearchParams({
      locale: 'ko',
      limit: '100',
      scope: isBuilder ? 'all' : 'public',
    });

    fetch(`/api/builder/blog/posts?${params.toString()}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.ok && Array.isArray(json.posts)) {
          const match = (json.posts as BlogPost[]).find((p) => p.postId === c.postId || p.slug === c.postId);
          setPost(match ?? null);
          if (!match) setError('Post not found');
        } else {
          setError(json?.error || 'Failed to load post');
        }
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
  }, [c.postId, isBuilder]);

  const selectedItem = useMemo(() => (post ? toCardItem(post) : null), [post]);

  if (!c.postId) {
    return <CardShell item={MOCK_POST} content={c} notice="Select post" theme={theme} tone="muted" />;
  }

  if (loading && !selectedItem) {
    return <CardShell item={{ ...MOCK_POST, title: 'Loading post...', excerpt: '선택한 블로그 글을 불러오는 중입니다.' }} content={c} notice="Loading" theme={theme} tone="muted" />;
  }

  if (!selectedItem) {
    return (
      <CardShell
        item={{
          ...MOCK_POST,
          title: error ? `${error}: ${c.postId}` : `Post not found: ${c.postId}`,
          excerpt: '블로그 관리자에서 공개 상태 또는 slug 값을 확인하세요.',
          featured: false,
        }}
        content={c}
        notice="Unavailable"
        theme={theme}
        tone="error"
      />
    );
  }

  return (
    <CardShell
      item={selectedItem}
      content={c}
      href={isBuilder ? `#${selectedItem.slug}` : `/${selectedItem.locale}/columns/${selectedItem.slug}`}
      theme={theme}
    />
  );
}
