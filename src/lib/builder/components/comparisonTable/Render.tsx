import type { BuilderComparisonTableCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getMarketingWidgetsCopy, localizedComparisonTableDefaults } from '../marketing-widgets-copy';

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

export default ComparisonTableRender;
