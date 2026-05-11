import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderComparisonTableCanvasNode } from '@/lib/builder/canvas/types';

function ComparisonTableRender({
  node,
}: {
  node: BuilderComparisonTableCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  return (
    <table className="builder-datadisplay-comparison-table" data-builder-datadisplay-widget="comparison-table">
      <thead>
        <tr>
          <th />
          {c.columns.map((col, idx) => <th key={`${col}-${idx}`}>{col}</th>)}
        </tr>
      </thead>
      <tbody>
        {c.rows.length === 0 ? (
          <tr><td colSpan={c.columns.length + 1}><em>비교 항목을 인스펙터에서 추가하세요</em></td></tr>
        ) : (
          c.rows.map((row, idx) => (
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
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const ctNode = node as BuilderComparisonTableCanvasNode;
  const c = ctNode.content;
  return (
    <>
      <label>
        <span>컬럼 (한 줄에 하나)</span>
        <textarea
          rows={4}
          style={{ fontFamily: 'inherit' }}
          value={columnsToText(c.columns)}
          disabled={disabled}
          onChange={(event) => onUpdate({ columns: parseColumns(event.target.value) })}
        />
      </label>
      <label>
        <span>행 (feature | value1 | value2 ...)</span>
        <textarea
          rows={8}
          style={{ fontFamily: 'inherit', fontSize: 11 }}
          value={rowsToText(c.rows)}
          disabled={disabled}
          onChange={(event) => onUpdate({ rows: parseRows(event.target.value) })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'comparison-table',
  displayName: '비교 표',
  category: 'advanced',
  icon: '⇄',
  defaultContent: {
    columns: ['기본', '표준', '프리미엄'],
    rows: [
      { feature: '월 상담 건수', values: ['1회', '5회', '무제한'] },
      { feature: '계약 검토', values: ['—', '✓', '✓'] },
      { feature: '소송 대응', values: ['—', '—', '✓'] },
      { feature: '한·대 양국 협업', values: ['—', '✓', '✓'] },
    ],
  },
  defaultStyle: {},
  defaultRect: { width: 560, height: 280 },
  Render: ComparisonTableRender,
  Inspector: ComparisonTableInspector,
});
