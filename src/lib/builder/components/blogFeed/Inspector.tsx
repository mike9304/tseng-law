import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderBlogFeedCanvasNode } from '@/lib/builder/canvas/types';
import { DEFAULT_BLOG_CATEGORIES } from '@/lib/builder/blog/blog-engine';
import { getBlogFeedCopy } from './blog-feed-copy';
import styles from '../BlogWidgetInspector.module.css';

export default function BlogFeedInspector({ node, locale, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const fnode = node as BuilderBlogFeedCanvasNode;
  const c = fnode.content;
  const copy = getBlogFeedCopy(locale);

  return (
    <div className={styles.root} data-builder-blog-feed-inspector="true">
      <span className={styles.sectionLabel}>{copy.inspector.layoutSection}</span>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.layoutLabel}</span>
        <select className={styles.control} value={c.layout} disabled={disabled} onChange={(e) => onUpdate({ layout: e.target.value })}>
          <option value="grid">{copy.inspector.layoutOptions.grid}</option>
          <option value="list">{copy.inspector.layoutOptions.list}</option>
          <option value="masonry">{copy.inspector.layoutOptions.masonry}</option>
          <option value="featured-hero">{copy.inspector.layoutOptions['featured-hero']}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.columns}</span>
        <input
          type="number"
          min={1}
          max={4}
          value={c.columns}
          disabled={disabled}
          className={styles.control}
          onChange={(e) => onUpdate({ columns: Math.max(1, Math.min(4, Number(e.target.value) || 1)) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.gap}</span>
        <input
          type="number"
          min={0}
          max={64}
          value={c.gap}
          disabled={disabled}
          className={styles.control}
          onChange={(e) => onUpdate({ gap: Math.max(0, Math.min(64, Number(e.target.value) || 0)) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.postsPerPage}</span>
        <input
          type="number"
          min={1}
          max={50}
          value={c.postsPerPage}
          disabled={disabled}
          className={styles.control}
          onChange={(e) => onUpdate({ postsPerPage: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })}
        />
      </label>

      <span className={styles.sectionLabel}>{copy.inspector.filterSortSection}</span>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.sortBy}</span>
        <select className={styles.control} value={c.sortBy} disabled={disabled} onChange={(e) => onUpdate({ sortBy: e.target.value })}>
          <option value="newest">{copy.inspector.sortOptions.newest}</option>
          <option value="oldest">{copy.inspector.sortOptions.oldest}</option>
          <option value="featured-first">{copy.inspector.sortOptions['featured-first']}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.filterByCategory}</span>
        <select
          className={styles.control}
          value={c.filterByCategory ?? ''}
          disabled={disabled}
          onChange={(e) => onUpdate({ filterByCategory: e.target.value || undefined })}
        >
          <option value="">{copy.inspector.allCategories}</option>
          {DEFAULT_BLOG_CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name[locale ?? 'en'] ?? cat.name.en ?? cat.name.ko ?? cat.slug}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.filterByTag}</span>
        <input
          type="text"
          value={c.filterByTag ?? ''}
          disabled={disabled}
          className={styles.control}
          onChange={(e) => onUpdate({ filterByTag: e.target.value || undefined })}
          placeholder={copy.inspector.tagPlaceholder}
        />
      </label>

      <span className={styles.sectionLabel}>{copy.inspector.displaySection}</span>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showFeaturedImage}
          disabled={disabled}
          onChange={(e) => onUpdate({ showFeaturedImage: e.target.checked })}
        />
        <span>{copy.inspector.featuredImage}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showCategory}
          disabled={disabled}
          onChange={(e) => onUpdate({ showCategory: e.target.checked })}
        />
        <span>{copy.inspector.category}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showExcerpt}
          disabled={disabled}
          onChange={(e) => onUpdate({ showExcerpt: e.target.checked })}
        />
        <span>{copy.inspector.excerpt}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showAuthor}
          disabled={disabled}
          onChange={(e) => onUpdate({ showAuthor: e.target.checked })}
        />
        <span>{copy.inspector.author}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showDate}
          disabled={disabled}
          onChange={(e) => onUpdate({ showDate: e.target.checked })}
        />
        <span>{copy.inspector.date}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showReadingTime}
          disabled={disabled}
          onChange={(e) => onUpdate({ showReadingTime: e.target.checked })}
        />
        <span>{copy.inspector.readingTime}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showTags}
          disabled={disabled}
          onChange={(e) => onUpdate({ showTags: e.target.checked })}
        />
        <span>{copy.inspector.tags}</span>
      </label>
    </div>
  );
}
