import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderBlogArchiveCanvasNode } from '@/lib/builder/canvas/types';
import { getBlogArchiveCopy } from './blog-archive-copy';
import styles from '../BlogWidgetInspector.module.css';

export default function BlogArchiveInspector({ node, locale, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const fnode = node as BuilderBlogArchiveCanvasNode;
  const c = fnode.content;
  const copy = getBlogArchiveCopy(locale);

  return (
    <div className={styles.root} data-builder-blog-archive-inspector="true">
      <span className={styles.sectionLabel}>{copy.inspector.groupSection}</span>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.groupBy}</span>
        <select className={styles.control} value={c.groupBy} disabled={disabled} onChange={(e) => onUpdate({ groupBy: e.target.value })}>
          <option value="month">{copy.inspector.month}</option>
          <option value="year">{copy.inspector.year}</option>
        </select>
      </label>
      <span className={styles.sectionLabel}>{copy.inspector.displaySection}</span>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.expandLatest} disabled={disabled} onChange={(e) => onUpdate({ expandLatest: e.target.checked })} />
        <span>{copy.inspector.expandLatest}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showCount} disabled={disabled} onChange={(e) => onUpdate({ showCount: e.target.checked })} />
        <span>{copy.inspector.showCount}</span>
      </label>
    </div>
  );
}
