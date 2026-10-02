import type { BuilderBarChartCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { DATA_WIDGETS_LEGACY_DEFAULTS, getDataWidgetsCopy, localizedDataWidgetPoints, localizedDataWidgetText } from '../data-widgets-copy';

function BarChartRender({
  node,
  locale = 'ko',
}: {
  node: BuilderBarChartCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const copy = getDataWidgetsCopy(locale);
  const title = localizedDataWidgetText(c.title, copy.chart.defaults.barTitle, DATA_WIDGETS_LEGACY_DEFAULTS.barTitle);
  const points = localizedDataWidgetPoints(c.points, copy.chart.defaults.barPoints, DATA_WIDGETS_LEGACY_DEFAULTS.barPoints);
  const max = Math.max(1, ...points.map((p) => p.value));
  const W = 320;
  const H = 160;
  const innerW = W - 24;
  const innerH = H - 24;
  const barW = points.length > 0 ? Math.max(8, (innerW - 8 * (points.length - 1)) / points.length) : 0;

  return (
    <div className="builder-datadisplay-chart" data-builder-datadisplay-widget="bar-chart">
      {title ? <strong>{title}</strong> : null}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={title || copy.chart.barAria}>
        {points.map((p, idx) => {
          const h = (p.value / max) * (innerH - 18);
          const x = 12 + idx * (barW + 8);
          const y = H - 12 - h;
          return (
            <g key={`${p.label}-${idx}`} data-builder-bar-segment={p.label}>
              <rect x={x} y={y} width={barW} height={h} fill={c.color} rx={3} />
              <text x={x + barW / 2} y={H - 2} fontSize={9} textAnchor="middle" fill="#64748b">
                {p.label}
              </text>
              {c.showValueLabel ? (
                <text x={x + barW / 2} y={y - 3} fontSize={9} textAnchor="middle" fill="#0f172a">
                  {p.value}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default BarChartRender;
