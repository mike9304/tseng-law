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
import { getBlogPostCardCopy } from './blog-post-card-copy';
import styles from '../BlogWidgetInspector.module.css';

export default function BlogPostCardInspector({ node, locale, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const fnode = node as BuilderBlogPostCardCanvasNode;
  const c = fnode.content;
  const [available, setAvailable] = useState<BlogPost[]>([]);
  const copy = getBlogPostCardCopy(locale);

  useEffect(() => {
    let cancelled = false;
    const resolvedLocale = typeof window === 'undefined'
      ? 'ko'
      : window.location.pathname.split('/').filter(Boolean)[0] || 'ko';
    fetch(`/api/builder/blog/posts?locale=${encodeURIComponent(resolvedLocale)}&limit=100&scope=all`)
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
    <div className={styles.root} data-builder-blog-post-card-inspector="true">
      <span className={styles.sectionLabel}>{copy.section.post}</span>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.postSlug}</span>
        <select
          className={styles.control}
          value={c.postId ?? ''}
          disabled={disabled}
          onChange={(e) => onUpdate({ postId: e.target.value || undefined })}
        >
          <option value="">{copy.inspector.postPlaceholder}</option>
          {available.map((p) => (
            <option key={p.postId} value={p.postId}>{p.title} ({p.slug})</option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.manualPostIdOverride}</span>
        <input
          type="text"
          value={c.postId ?? ''}
          disabled={disabled}
          className={styles.control}
          onChange={(e) => onUpdate({ postId: e.target.value || undefined })}
          placeholder={copy.inspector.manualPostIdPlaceholder}
        />
      </label>

      <span className={styles.sectionLabel}>{copy.section.cardStyle}</span>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.cardVariant}</span>
        <select
          className={styles.control}
          value={normalizeCardVariantKey(c.variant ?? legacyCardStyleToVariant(c.cardStyle))}
          disabled={disabled}
          onChange={(e) => onUpdate({ variant: e.target.value })}
        >
          {CARD_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {copy.variants[variant.key] ?? variant.label}
            </option>
          ))}
        </select>
      </label>

      <span className={styles.sectionLabel}>{copy.section.display}</span>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showFeaturedImage} disabled={disabled} onChange={(e) => onUpdate({ showFeaturedImage: e.target.checked })} />
        <span>{copy.inspector.featuredImage}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showCategory} disabled={disabled} onChange={(e) => onUpdate({ showCategory: e.target.checked })} />
        <span>{copy.inspector.category}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showExcerpt} disabled={disabled} onChange={(e) => onUpdate({ showExcerpt: e.target.checked })} />
        <span>{copy.inspector.excerpt}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showAuthor} disabled={disabled} onChange={(e) => onUpdate({ showAuthor: e.target.checked })} />
        <span>{copy.inspector.author}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showDate} disabled={disabled} onChange={(e) => onUpdate({ showDate: e.target.checked })} />
        <span>{copy.inspector.date}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showReadingTime} disabled={disabled} onChange={(e) => onUpdate({ showReadingTime: e.target.checked })} />
        <span>{copy.inspector.readingTime}</span>
      </label>
    </div>
  );
}
