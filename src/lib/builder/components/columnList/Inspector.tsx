import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderColumnListCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import { getDomainCardWidgetsCopy } from '../domain-card-widgets-copy';
import styles from './ColumnListInspector.module.css';

export default function ColumnListInspector({ node, locale = 'ko', onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const listNode = node as BuilderColumnListCanvasNode;
  const widgetCopy = getDomainCardWidgetsCopy(normalizeLocale(locale));
  const copy = widgetCopy.columnList.inspector;
  return (
    <div className={styles.root} data-builder-column-list-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.locale}</span>
        <select
          className={styles.control}
          value={listNode.content.locale}
          disabled={disabled}
          onChange={(e) => onUpdate({ locale: e.target.value })}
        >
          <option value="ko">{widgetCopy.localeOptions.ko}</option>
          <option value="zh-hant">{widgetCopy.localeOptions['zh-hant']}</option>
          <option value="en">{widgetCopy.localeOptions.en}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.limit(listNode.content.limit)}</span>
        <input
          className={styles.range}
          type="range"
          min={1}
          max={50}
          step={1}
          value={listNode.content.limit}
          disabled={disabled}
          onChange={(e) => onUpdate({ limit: Number(e.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.categoryFilter}</span>
        <input
          className={styles.control}
          type="text"
          value={listNode.content.category ?? ''}
          disabled={disabled}
          placeholder={copy.categoryPlaceholder}
          onChange={(e) => onUpdate({ category: e.target.value })}
        />
      </label>
      <span className={styles.hint}>
        {copy.autoItemsHint}
      </span>
    </div>
  );
}
