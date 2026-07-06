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
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getBlogPostCardCopy, type BlogPostCardCopy } from './blog-post-card-copy';
import styles from './BlogPostCard.module.css';

interface BlogPostCardElementProps {
  node: BuilderBlogPostCardCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  theme?: BuilderTheme;
  locale?: Locale;
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

function fmtDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function categoryMeta(slug: string | undefined, locale: Locale, fallbackLabel: string): { label: string; color: string } {
  const cat = DEFAULT_BLOG_CATEGORIES.find((c) => c.slug === slug);
  return {
    label: cat?.name[locale] ?? cat?.name.ko ?? slug ?? fallbackLabel,
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

function createMockPost(locale: Locale, copy: BlogPostCardCopy): CardItem {
  return {
    postId: 'mock',
    slug: 'mock',
    locale,
    title: copy.runtime.mockPost.title,
    excerpt: copy.runtime.mockPost.excerpt,
    category: 'company-formation',
    authorName: copy.runtime.mockPost.authorName,
    authorTitle: copy.runtime.mockPost.authorTitle,
    date: '2026-04-12',
    readingTimeMinutes: 6,
    featured: true,
  };
}

function CardShell({
  item,
  content,
  href,
  notice,
  theme,
  copy,
  locale,
  tone = 'normal',
}: {
  item: CardItem;
  content: CardContent;
  href?: string;
  notice?: string;
  theme?: BuilderTheme;
  copy: BlogPostCardCopy;
  locale: Locale;
  tone?: 'normal' | 'muted' | 'error';
}) {
  const meta = categoryMeta(item.category, locale, copy.runtime.generalCategory);
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
          {item.featured ? <span className={styles.featuredBadge}>{copy.runtime.featuredBadge}</span> : null}
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
              {content.showReadingTime && item.readingTimeMinutes > 0 ? <span>{copy.runtime.readingTime(item.readingTimeMinutes)}</span> : null}
            </span>
          </div>
          <span className={styles.readMore}>{copy.runtime.readMore}</span>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <a className={className} href={href} aria-label={copy.runtime.cardAriaLabel(item.title)} style={vars} data-builder-blog-card="true">
        {body}
      </a>
    );
  }

  return (
    <article className={className} style={vars} data-builder-blog-card="true">
      {body}
    </article>
  );
}

export default function BlogPostCardElement({ node, mode = 'edit', theme, locale }: BlogPostCardElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = getBlogPostCardCopy(effectiveLocale);
  const mockPost = useMemo(() => createMockPost(effectiveLocale, copy), [copy, effectiveLocale]);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<'not-found' | 'load-failed' | null>(null);

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
      locale: effectiveLocale,
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
          if (!match) setError('not-found');
        } else {
          setError('load-failed');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError('load-failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [c.postId, effectiveLocale, isBuilder]);

  const selectedItem = useMemo(() => (post ? toCardItem(post) : null), [post]);

  if (!c.postId) {
    return <CardShell item={mockPost} content={c} notice={copy.runtime.selectPostNotice} theme={theme} copy={copy} locale={effectiveLocale} tone="muted" />;
  }

  if (loading && !selectedItem) {
    return (
      <CardShell
        item={{ ...mockPost, title: copy.runtime.loadingTitle, excerpt: copy.runtime.loadingExcerpt }}
        content={c}
        notice={copy.runtime.loadingNotice}
        theme={theme}
        copy={copy}
        locale={effectiveLocale}
        tone="muted"
      />
    );
  }

  if (!selectedItem) {
    return (
      <CardShell
        item={{
          ...mockPost,
          title: error === 'load-failed'
            ? copy.runtime.failedToLoadPost(c.postId)
            : copy.runtime.postNotFound(c.postId),
          excerpt: copy.runtime.errorExcerpt,
          featured: false,
        }}
        content={c}
        notice={copy.runtime.unavailableNotice}
        theme={theme}
        copy={copy}
        locale={effectiveLocale}
        tone="error"
      />
    );
  }

  return (
    <CardShell
      item={selectedItem}
      content={c}
      href={isBuilder ? `#${selectedItem.slug}` : `/${effectiveLocale}/columns/${selectedItem.slug}`}
      theme={theme}
      copy={copy}
      locale={effectiveLocale}
    />
  );
}
