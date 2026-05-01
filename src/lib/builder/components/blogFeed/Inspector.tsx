import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderBlogFeedCanvasNode } from '@/lib/builder/canvas/types';
import { DEFAULT_BLOG_CATEGORIES } from '@/lib/builder/blog/blog-engine';

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

export default function BlogFeedInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const fnode = node as BuilderBlogFeedCanvasNode;
  const c = fnode.content;

  return (
    <>
      <span style={sectionLabelStyle}>Layout</span>
      <label>
        <span>Layout</span>
        <select style={selectStyle} value={c.layout} disabled={disabled} onChange={(e) => onUpdate({ layout: e.target.value })}>
          <option value="grid">Grid</option>
          <option value="list">List</option>
          <option value="masonry">Masonry</option>
          <option value="featured-hero">Featured Hero</option>
        </select>
      </label>
      <label>
        <span>Columns</span>
        <input
          type="number"
          min={1}
          max={4}
          value={c.columns}
          disabled={disabled}
          onChange={(e) => onUpdate({ columns: Math.max(1, Math.min(4, Number(e.target.value) || 1)) })}
        />
      </label>
      <label>
        <span>Gap (px)</span>
        <input
          type="number"
          min={0}
          max={64}
          value={c.gap}
          disabled={disabled}
          onChange={(e) => onUpdate({ gap: Math.max(0, Math.min(64, Number(e.target.value) || 0)) })}
        />
      </label>
      <label>
        <span>Posts per page</span>
        <input
          type="number"
          min={1}
          max={50}
          value={c.postsPerPage}
          disabled={disabled}
          onChange={(e) => onUpdate({ postsPerPage: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })}
        />
      </label>

      <span style={sectionLabelStyle}>Filter & Sort</span>
      <label>
        <span>Sort by</span>
        <select style={selectStyle} value={c.sortBy} disabled={disabled} onChange={(e) => onUpdate({ sortBy: e.target.value })}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="featured-first">Featured first</option>
        </select>
      </label>
      <label>
        <span>Filter by category</span>
        <select
          style={selectStyle}
          value={c.filterByCategory ?? ''}
          disabled={disabled}
          onChange={(e) => onUpdate({ filterByCategory: e.target.value || undefined })}
        >
          <option value="">All categories</option>
          {DEFAULT_BLOG_CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>{cat.name.ko ?? cat.slug}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Filter by tag</span>
        <input
          type="text"
          value={c.filterByTag ?? ''}
          disabled={disabled}
          onChange={(e) => onUpdate({ filterByTag: e.target.value || undefined })}
          placeholder="e.g. wage"
        />
      </label>

      <span style={sectionLabelStyle}>Display</span>
      <label>
        <input
          type="checkbox"
          checked={c.showFeaturedImage}
          disabled={disabled}
          onChange={(e) => onUpdate({ showFeaturedImage: e.target.checked })}
        />
        <span>Featured image</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={c.showCategory}
          disabled={disabled}
          onChange={(e) => onUpdate({ showCategory: e.target.checked })}
        />
        <span>Category</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={c.showExcerpt}
          disabled={disabled}
          onChange={(e) => onUpdate({ showExcerpt: e.target.checked })}
        />
        <span>Excerpt</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={c.showAuthor}
          disabled={disabled}
          onChange={(e) => onUpdate({ showAuthor: e.target.checked })}
        />
        <span>Author</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={c.showDate}
          disabled={disabled}
          onChange={(e) => onUpdate({ showDate: e.target.checked })}
        />
        <span>Date</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={c.showReadingTime}
          disabled={disabled}
          onChange={(e) => onUpdate({ showReadingTime: e.target.checked })}
        />
        <span>Reading time</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={c.showTags}
          disabled={disabled}
          onChange={(e) => onUpdate({ showTags: e.target.checked })}
        />
        <span>Tags</span>
      </label>
    </>
  );
}
