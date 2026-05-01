'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BuilderFeaturedPostsCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import { DEFAULT_BLOG_CATEGORIES } from '@/lib/builder/blog/blog-engine';

interface FeaturedPostsElementProps {
  node: BuilderFeaturedPostsCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}

const MOCK = [
  { postId: 'm1', slug: 'm1', title: '대만 회사 설립 가이드', excerpt: '외국인 법인 설립 절차 총정리.', category: 'company-setup' },
  { postId: 'm2', slug: 'm2', title: '국제이혼 관할권 분쟁', excerpt: '국적이 다른 부부의 이혼소송 관할 결정.', category: 'family-law' },
  { postId: 'm3', slug: 'm3', title: '교통사고 합의금 산정', excerpt: '대만 교통사고 합의금 적정선 산출.', category: 'traffic-accident' },
];

function categoryLabel(slug: string): string {
  const cat = DEFAULT_BLOG_CATEGORIES.find((c) => c.slug === slug);
  return cat?.name.ko ?? slug;
}

export default function FeaturedPostsElement({ node, mode = 'edit' }: FeaturedPostsElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    if (isBuilder) return;
    let cancelled = false;
    fetch(`/api/builder/blog/posts?locale=ko&featured=true&limit=${c.limit}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.ok && Array.isArray(json.posts)) setPosts(json.posts as BlogPost[]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isBuilder, c.limit]);

  const items = useMemo(() => {
    if (isBuilder) return MOCK.slice(0, c.limit);
    return (posts ?? []).slice(0, c.limit).map((p) => ({
      postId: p.postId,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
    }));
  }, [isBuilder, posts, c.limit]);

  if (items.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', border: '2px dashed #cbd5e1', borderRadius: 8, color: '#94a3b8', fontSize: 13 }}>
        Featured Posts · 등록된 피처드 글이 없습니다.
      </div>
    );
  }

  if (c.layout === 'hero') {
    const [first, ...rest] = items;
    return (
      <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: rest.length ? '2fr 1fr' : '1fr', gap: 16, boxSizing: 'border-box' }}>
        <a
          href={isBuilder ? '#' : `/ko/columns/${first.slug}`}
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
            ★ {categoryLabel(first.category)}
          </span>
          <h2 style={{ margin: '8px 0', fontSize: 26, fontWeight: 800, lineHeight: 1.25 }}>{first.title}</h2>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>{first.excerpt}</p>
        </a>
        {rest.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rest.map((p) => (
              <a
                key={p.postId}
                href={isBuilder ? '#' : `/ko/columns/${p.slug}`}
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
                  ★ {categoryLabel(p.category)}
                </span>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{p.title}</h3>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (c.layout === 'side-by-side') {
    return (
      <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: 16 }}>
        {items.map((p) => (
          <a
            key={p.postId}
            href={isBuilder ? '#' : `/ko/columns/${p.slug}`}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0b3b2e', textTransform: 'uppercase' }}>★ {categoryLabel(p.category)}</span>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{p.title}</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{p.excerpt}</p>
          </a>
        ))}
      </div>
    );
  }

  // stacked
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
      {items.map((p) => (
        <a
          key={p.postId}
          href={isBuilder ? '#' : `/ko/columns/${p.slug}`}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0b3b2e', textTransform: 'uppercase' }}>★ {categoryLabel(p.category)}</span>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{p.title}</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>{p.excerpt}</p>
        </a>
      ))}
    </div>
  );
}
