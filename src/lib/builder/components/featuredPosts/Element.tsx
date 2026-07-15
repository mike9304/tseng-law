'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { BuilderFeaturedPostsCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import { DEFAULT_BLOG_CATEGORIES } from '@/lib/builder/blog/blog-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { WidgetDataDisclosure } from '../_shared/WidgetDataDisclosure';
import { getFeaturedPostsCopy } from './featured-posts-copy';

interface FeaturedPostsElementProps {
  node: BuilderFeaturedPostsCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

function categoryLabel(slug: string, locale: Locale): string {
  const cat = DEFAULT_BLOG_CATEGORIES.find((c) => c.slug === slug);
  return cat?.name[locale] ?? cat?.name.ko ?? slug;
}

export default function FeaturedPostsElement({ node, mode = 'edit', locale }: FeaturedPostsElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = getFeaturedPostsCopy(effectiveLocale);
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    if (isBuilder) return;
    let cancelled = false;
    fetch(`/api/builder/blog/posts?locale=${effectiveLocale}&featured=true&limit=${c.limit}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.ok && Array.isArray(json.posts)) setPosts(json.posts as BlogPost[]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [effectiveLocale, isBuilder, c.limit]);

  const items = useMemo(() => {
    if (isBuilder) return copy.element.mockPosts.slice(0, c.limit);
    return (posts ?? []).slice(0, c.limit).map((p) => ({
      postId: p.postId,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
    }));
  }, [copy.element.mockPosts, isBuilder, posts, c.limit]);

  let content: React.ReactNode;
  if (items.length === 0) {
    content = (
      <div data-builder-featured-posts="true" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', border: '2px dashed #cbd5e1', borderRadius: 8, color: '#94a3b8', fontSize: 13 }}>
        {copy.element.emptyState}
      </div>
    );
  } else if (c.layout === 'hero') {
    const [first, ...rest] = items;
    content = (
      <div data-builder-featured-posts="true" style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: rest.length ? '2fr 1fr' : '1fr', gap: 16, boxSizing: 'border-box' }}>
        <a
          href={isBuilder ? '#' : `/${effectiveLocale}/columns/${first.slug}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background: 'linear-gradient(135deg, #0b3b2e, #1a5c47)',
            color: '#ffffff',
            borderRadius: 12,
            padding: 24,
            textDecoration: 'none',
            overflow: 'hidden',
          }}
        >
            <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, textTransform: 'uppercase' }}>
            {copy.element.featuredMarker} {copy.element.categoryPrefix} {categoryLabel(first.category, effectiveLocale)}
            </span>
          <h2 style={{ margin: '8px 0', fontSize: 26, fontWeight: 800, lineHeight: 1.25 }}>{first.title}</h2>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>{first.excerpt}</p>
        </a>
        {rest.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rest.map((p) => (
              <a
                key={p.postId}
                href={isBuilder ? '#' : `/${effectiveLocale}/columns/${p.slug}`}
                style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 16,
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0b3b2e', textTransform: 'uppercase' }}>
                  {copy.element.featuredMarker} {copy.element.categoryPrefix} {categoryLabel(p.category, effectiveLocale)}
                </span>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{p.title}</h3>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  } else if (c.layout === 'side-by-side') {
    content = (
      <div data-builder-featured-posts="true" style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: 16 }}>
        {items.map((p) => (
          <a
            key={p.postId}
            href={isBuilder ? '#' : `/${effectiveLocale}/columns/${p.slug}`}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0b3b2e', textTransform: 'uppercase' }}>{copy.element.featuredMarker} {copy.element.categoryPrefix} {categoryLabel(p.category, effectiveLocale)}</span>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{p.title}</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{p.excerpt}</p>
          </a>
        ))}
      </div>
    );
  } else {
    content = (
      <div data-builder-featured-posts="true" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
        {items.map((p) => (
          <a
            key={p.postId}
            href={isBuilder ? '#' : `/${effectiveLocale}/columns/${p.slug}`}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0b3b2e', textTransform: 'uppercase' }}>{copy.element.featuredMarker} {copy.element.categoryPrefix} {categoryLabel(p.category, effectiveLocale)}</span>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{p.title}</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>{p.excerpt}</p>
          </a>
        ))}
      </div>
    );
  }

  return (
    <>
      {isBuilder ? <WidgetDataDisclosure locale={effectiveLocale} /> : null}
      {content}
    </>
  );
}
