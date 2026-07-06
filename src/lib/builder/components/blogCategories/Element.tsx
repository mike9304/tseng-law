'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { BuilderBlogCategoriesCanvasNode } from '@/lib/builder/canvas/types';
import { DEFAULT_BLOG_CATEGORIES, type BlogCategory } from '@/lib/builder/blog/blog-engine';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getBlogCategoriesCopy } from './blog-categories-copy';

function colorToCss(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'token' in (value as Record<string, unknown>)) {
    return `var(--builder-color-${(value as { token: string }).token})`;
  }
  return '#0b3b2e';
}

interface BlogCategoriesElementProps {
  node: BuilderBlogCategoriesCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

export default function BlogCategoriesElement({ node, mode = 'edit', locale }: BlogCategoriesElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = getBlogCategoriesCopy(effectiveLocale);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isBuilder || !c.showPostCount) return;
    let cancelled = false;
    fetch(`/api/builder/blog/posts?locale=${effectiveLocale}&limit=100`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.ok && Array.isArray(json.posts)) {
          const map: Record<string, number> = {};
          (json.posts as BlogPost[]).forEach((p) => {
            map[p.category] = (map[p.category] ?? 0) + 1;
          });
          setCounts(map);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [effectiveLocale, isBuilder, c.showPostCount]);

  const activeColorCss = useMemo(() => colorToCss(c.activeColor ?? '#0b3b2e'), [c.activeColor]);
  const items: Array<BlogCategory | { id: 'all'; slug: '__all'; name: { ko: string; 'zh-hant': string; en: string }; postCount: number }> = c.showAll
    ? [
        { id: 'all', slug: '__all' as const, name: { ko: copy.element.allLabel, 'zh-hant': copy.element.allLabel, en: copy.element.allLabel }, postCount: 0 },
        ...DEFAULT_BLOG_CATEGORIES,
      ]
    : DEFAULT_BLOG_CATEGORIES;

  const isVertical = c.layout === 'vertical';
  const isGrid = c.layout === 'grid';

  return (
    <nav
      data-builder-blog-categories="true"
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        display: isGrid ? 'grid' : 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        flexWrap: isVertical ? 'nowrap' : 'wrap',
        gridTemplateColumns: isGrid ? 'repeat(auto-fill, minmax(120px, 1fr))' : undefined,
        gap: 8,
        padding: 8,
        alignItems: isVertical ? 'stretch' : 'center',
        overflow: 'auto',
      }}
    >
      {items.map((cat) => {
        const slug = (cat as BlogCategory).slug;
        const isAll = slug === '__all';
        const href = isAll ? `/${effectiveLocale}/columns` : `/${effectiveLocale}/columns?category=${encodeURIComponent(slug)}`;
        const count = isAll
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : counts[slug] ?? 0;
        return (
          <a
            key={cat.id}
            href={href}
            data-builder-blog-category={slug}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              minHeight: 44,
              padding: isVertical ? '10px 14px' : '8px 14px',
              borderRadius: 999,
              border: `1px solid ${activeColorCss}`,
              color: activeColorCss,
              background: '#ffffff',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'background 120ms ease',
            }}
          >
            <span>{cat.name[effectiveLocale] ?? cat.name.ko ?? cat.id}</span>
            {c.showPostCount && !isBuilder && <span style={{ opacity: 0.7, fontSize: 11 }}>({count})</span>}
            {c.showPostCount && isBuilder && <span style={{ opacity: 0.7, fontSize: 11 }}>(0)</span>}
          </a>
        );
      })}
    </nav>
  );
}
