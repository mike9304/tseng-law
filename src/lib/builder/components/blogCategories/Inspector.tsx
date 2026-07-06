import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderBlogCategoriesCanvasNode } from '@/lib/builder/canvas/types';
import { getBlogCategoriesCopy } from './blog-categories-copy';
import styles from '../BlogWidgetInspector.module.css';

export default function BlogCategoriesInspector({ node, locale, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const fnode = node as BuilderBlogCategoriesCanvasNode;
  const c = fnode.content;
  const copy = getBlogCategoriesCopy(locale);

  const activeColorString =
    typeof c.activeColor === 'string' ? c.activeColor : '#0b3b2e';

  return (
    <div className={styles.root} data-builder-blog-categories-inspector="true">
      <span className={styles.sectionLabel}>{copy.inspector.layoutSection}</span>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.layoutLabel}</span>
        <select className={styles.control} value={c.layout} disabled={disabled} onChange={(e) => onUpdate({ layout: e.target.value })}>
          <option value="horizontal">{copy.inspector.layoutOptions.horizontal}</option>
          <option value="vertical">{copy.inspector.layoutOptions.vertical}</option>
          <option value="grid">{copy.inspector.layoutOptions.grid}</option>
        </select>
      </label>

      <span className={styles.sectionLabel}>{copy.inspector.displaySection}</span>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showAll} disabled={disabled} onChange={(e) => onUpdate({ showAll: e.target.checked })} />
        <span>{copy.inspector.showAll}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showPostCount} disabled={disabled} onChange={(e) => onUpdate({ showPostCount: e.target.checked })} />
        <span>{copy.inspector.showPostCount}</span>
      </label>

      <span className={styles.sectionLabel}>{copy.inspector.activeColorSection}</span>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.colorLabel}</span>
        <input
          type="text"
          value={activeColorString}
          disabled={disabled}
          className={styles.control}
          onChange={(e) => onUpdate({ activeColor: e.target.value || undefined })}
          placeholder={copy.inspector.colorPlaceholder}
        />
      </label>
    </div>
  );
}
