import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderComparisonTableCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  COMPARISON_TABLE_LEGACY_DEFAULT_COLUMNS,
  COMPARISON_TABLE_LEGACY_DEFAULT_ROWS,
  getMarketingWidgetsCopy,
  localizedComparisonTableDefaults,
} from '../marketing-widgets-copy';
import styles from './ComparisonTableInspector.module.css';

function ComparisonTableRender({
  node,
  locale = 'ko',
}: {
  node: BuilderComparisonTableCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getMarketingWidgetsCopy(locale);
  const table = localizedComparisonTableDefaults(
    c.columns,
    c.rows,
    copy.comparisonTable.defaultColumns,
    copy.comparisonTable.defaultRows,
  );
  return (
    <table className="builder-datadisplay-comparison-table" data-builder-datadisplay-widget="comparison-table">
      <thead>
        <tr>
          <th />
          {table.columns.map((col, idx) => <th key={`${col}-${idx}`}>{col}</th>)}
        </tr>
      </thead>
      <tbody>
        {table.rows.length === 0 ? (
          <tr><td colSpan={table.columns.length + 1}><em>{copy.comparisonTable.empty}</em></td></tr>
        ) : (
          table.rows.map((row, idx) => (
            <tr key={`${row.feature}-${idx}`}>
              <th scope="row">{row.feature}</th>
              {row.values.map((v, i) => <td key={i}>{v}</td>)}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function columnsToText(columns: string[]): string {
  return columns.join('\n');
}

function parseColumns(value: string): string[] {
  return value.split('\n').map((p) => p.trim()).filter(Boolean).map((p) => p.slice(0, 60)).slice(0, 8);
}

function rowsToText(rows: BuilderComparisonTableCanvasNode['content']['rows']): string {
  return rows.map((r) => `${r.feature} | ${r.values.join(' | ')}`).join('\n');
}

function parseRows(value: string): BuilderComparisonTableCanvasNode['content']['rows'] {
  const out: BuilderComparisonTableCanvasNode['content']['rows'] = [];
  for (const raw of value.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const parts = line.split('|').map((p) => p.trim());
    const [feature, ...values] = parts;
    if (!feature) continue;
    out.push({ feature: feature.slice(0, 120), values: values.slice(0, 8).map((v) => v.slice(0, 60)) });
  }
  return out.slice(0, 20);
}

function ComparisonTableInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const ctNode = node as BuilderComparisonTableCanvasNode;
  const c = ctNode.content;
  const copy = getMarketingWidgetsCopy(locale);
  const table = localizedComparisonTableDefaults(
    c.columns,
    c.rows,
    copy.comparisonTable.defaultColumns,
    copy.comparisonTable.defaultRows,
  );
  return (
    <div className={styles.root} data-builder-comparison-table-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.comparisonTable.inspector.columns}</span>
        <textarea
          className={styles.control}
          rows={4}
          value={columnsToText(table.columns)}
          disabled={disabled}
          onChange={(event) => onUpdate({ columns: parseColumns(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.comparisonTable.inspector.rows}</span>
        <textarea
          className={`${styles.control} ${styles.compactTextarea}`}
          rows={8}
          value={rowsToText(table.rows)}
          disabled={disabled}
          onChange={(event) => onUpdate({ rows: parseRows(event.target.value) })}
        />
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'comparison-table',
  displayName: '비교 표',
  category: 'advanced',
  icon: '⇄',
  defaultContent: {
    columns: COMPARISON_TABLE_LEGACY_DEFAULT_COLUMNS,
    rows: COMPARISON_TABLE_LEGACY_DEFAULT_ROWS,
  },
  defaultStyle: {},
  defaultRect: { width: 560, height: 280 },
  Render: ComparisonTableRender,
  Inspector: ComparisonTableInspector,
});
