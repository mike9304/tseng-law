import type { BuilderPieChartCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { DATA_WIDGETS_LEGACY_DEFAULTS, getDataWidgetsCopy, localizedDataWidgetSlices, localizedDataWidgetText } from '../data-widgets-copy';

const DEFAULT_COLORS = ['#1d4ed8', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#14b8a6', '#f43f5e'];

function PieChartRender({
  node,
  locale = 'ko',
}: {
  node: BuilderPieChartCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const copy = getDataWidgetsCopy(locale);
  const title = localizedDataWidgetText(c.title, copy.chart.defaults.pieTitle, DATA_WIDGETS_LEGACY_DEFAULTS.pieTitle);
  const slices = localizedDataWidgetSlices(c.slices, copy.chart.defaults.pieSlices);
  const total = slices.reduce((sum, s) => sum + Math.max(0, s.value), 0) || 1;
  let cumulative = 0;
  const radius = 50;
  const cx = 60;
  const cy = 60;

  return (
    <div className="builder-datadisplay-chart builder-datadisplay-pie" data-builder-datadisplay-widget="pie-chart">
      {title ? <strong>{title}</strong> : null}
      <div className="builder-datadisplay-pie-body">
        <svg viewBox="0 0 120 120" width={120} height={120} role="img" aria-label={title || copy.chart.pieAria}>
          {slices.map((slice, idx) => {
            const start = cumulative / total;
            cumulative += Math.max(0, slice.value);
            const end = cumulative / total;
            const startAngle = start * Math.PI * 2 - Math.PI / 2;
            const endAngle = end * Math.PI * 2 - Math.PI / 2;
            const x1 = cx + radius * Math.cos(startAngle);
            const y1 = cy + radius * Math.sin(startAngle);
            const x2 = cx + radius * Math.cos(endAngle);
            const y2 = cy + radius * Math.sin(endAngle);
            const largeArc = end - start > 0.5 ? 1 : 0;
            const color = slice.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
            return (
              <path
                key={`${slice.label}-${idx}`}
                d={`M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`}
                fill={color}
              />
            );
          })}
          {c.donut ? <circle cx={cx} cy={cy} r={radius * 0.55} fill="#ffffff" /> : null}
        </svg>
        {c.showLegend ? (
          <ul className="builder-datadisplay-pie-legend">
            {slices.map((slice, idx) => (
              <li key={`${slice.label}-${idx}`}>
                <span style={{ background: slice.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }} />
                <span>{slice.label}</span>
                <small>{Math.round((Math.max(0, slice.value) / total) * 100)}%</small>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default PieChartRender;
