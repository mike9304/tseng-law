import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFeaturedPostsCanvasNode } from '@/lib/builder/canvas/types';
import { getFeaturedPostsCopy } from './featured-posts-copy';
import styles from '../BlogWidgetInspector.module.css';

export default function FeaturedPostsInspector({ node, locale, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const fnode = node as BuilderFeaturedPostsCanvasNode;
  const c = fnode.content;
  const copy = getFeaturedPostsCopy(locale);

  return (
    <div className={styles.root} data-builder-featured-posts-inspector="true">
      <span className={styles.sectionLabel}>{copy.inspector.featuredSection}</span>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.limit}</span>
        <input
          type="number"
          min={1}
          max={10}
          value={c.limit}
          disabled={disabled}
          className={styles.control}
          onChange={(e) => onUpdate({ limit: Math.max(1, Math.min(10, Number(e.target.value) || 1)) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.layout}</span>
        <select className={styles.control} value={c.layout} disabled={disabled} onChange={(e) => onUpdate({ layout: e.target.value })}>
          <option value="hero">{copy.inspector.layoutOptions.hero}</option>
          <option value="side-by-side">{copy.inspector.layoutOptions['side-by-side']}</option>
          <option value="stacked">{copy.inspector.layoutOptions.stacked}</option>
        </select>
      </label>
    </div>
  );
}
