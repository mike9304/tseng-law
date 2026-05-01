'use client';

import { useEffect, useState } from 'react';
import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderBlogPostCardCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import {
  CARD_VARIANTS,
  legacyCardStyleToVariant,
  normalizeCardVariantKey,
} from '@/lib/builder/site/component-variants';

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  marginTop: 12,
  marginBottom: 4,
  display: 'block',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 6px',
  fontSize: '0.85rem',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  background: '#fff',
};

export default function BlogPostCardInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const fnode = node as BuilderBlogPostCardCanvasNode;
  const c = fnode.content;
  const [available, setAvailable] = useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/builder/blog/posts?locale=ko&limit=100&scope=all`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.ok && Array.isArray(json.posts)) setAvailable(json.posts as BlogPost[]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <span style={sectionLabelStyle}>Post</span>
      <label>
        <span>Post (slug)</span>
        <select
          style={selectStyle}
          value={c.postId ?? ''}
          disabled={disabled}
          onChange={(e) => onUpdate({ postId: e.target.value || undefined })}
        >
          <option value="">— Select post —</option>
          {available.map((p) => (
            <option key={p.postId} value={p.postId}>{p.title} ({p.slug})</option>
          ))}
        </select>
      </label>
      <label>
        <span>Manual postId override</span>
        <input
          type="text"
          value={c.postId ?? ''}
          disabled={disabled}
          onChange={(e) => onUpdate({ postId: e.target.value || undefined })}
          placeholder="custom-slug"
        />
      </label>

      <span style={sectionLabelStyle}>Card style</span>
      <label>
        <span>Card variant</span>
        <select
          style={selectStyle}
          value={normalizeCardVariantKey(c.variant ?? legacyCardStyleToVariant(c.cardStyle))}
          disabled={disabled}
          onChange={(e) => onUpdate({ variant: e.target.value })}
        >
          {CARD_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {variant.label}
            </option>
          ))}
        </select>
      </label>

      <span style={sectionLabelStyle}>Display</span>
      <label>
        <input type="checkbox" checked={c.showFeaturedImage} disabled={disabled} onChange={(e) => onUpdate({ showFeaturedImage: e.target.checked })} />
        <span>Featured image</span>
      </label>
      <label>
        <input type="checkbox" checked={c.showCategory} disabled={disabled} onChange={(e) => onUpdate({ showCategory: e.target.checked })} />
        <span>Category</span>
      </label>
      <label>
        <input type="checkbox" checked={c.showExcerpt} disabled={disabled} onChange={(e) => onUpdate({ showExcerpt: e.target.checked })} />
        <span>Excerpt</span>
      </label>
      <label>
        <input type="checkbox" checked={c.showAuthor} disabled={disabled} onChange={(e) => onUpdate({ showAuthor: e.target.checked })} />
        <span>Author</span>
      </label>
      <label>
        <input type="checkbox" checked={c.showDate} disabled={disabled} onChange={(e) => onUpdate({ showDate: e.target.checked })} />
        <span>Date</span>
      </label>
      <label>
        <input type="checkbox" checked={c.showReadingTime} disabled={disabled} onChange={(e) => onUpdate({ showReadingTime: e.target.checked })} />
        <span>Reading time</span>
      </label>
    </>
  );
}
