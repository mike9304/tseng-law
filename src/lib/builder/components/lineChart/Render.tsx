import type { BuilderLineChartCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { DATA_WIDGETS_LEGACY_DEFAULTS, getDataWidgetsCopy, localizedDataWidgetPoints, localizedDataWidgetText } from '../data-widgets-copy';

function buildPath(points: { x: number; y: number }[], smooth: boolean): string {
  if (points.length === 0) return '';
  if (!smooth || points.length < 3) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  }
  const parts = [`M ${points[0].x},${points[0].y}`];
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const cur = points[i];
    const cpX = (prev.x + cur.x) / 2;
    parts.push(`C ${cpX},${prev.y} ${cpX},${cur.y} ${cur.x},${cur.y}`);
  }
  return parts.join(' ');
}

function LineChartRender({
  node,
  locale = 'ko',
}: {
  node: BuilderLineChartCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const copy = getDataWidgetsCopy(locale);
  const title = localizedDataWidgetText(c.title, copy.chart.defaults.lineTitle, DATA_WIDGETS_LEGACY_DEFAULTS.lineTitle);
  const points = localizedDataWidgetPoints(c.points, copy.chart.defaults.linePoints, DATA_WIDGETS_LEGACY_DEFAULTS.linePoints);
  const W = 360;
  const H = 180;
  const innerW = W - 32;
  const innerH = H - 32;
  if (points.length === 0) {
    return (
      <div className="builder-datadisplay-chart" data-builder-datadisplay-widget="line-chart">
        <em>{copy.chart.empty}</em>
      </div>
    );
  }
  const max = Math.max(...points.map((p) => p.value));
  const min = Math.min(...points.map((p) => p.value));
  const range = max - min || 1;
  const stepX = points.length > 1 ? innerW / (points.length - 1) : innerW;
  const mapped = points.map((p, i) => ({
    x: 16 + i * stepX,
    y: 16 + innerH - ((p.value - min) / range) * innerH,
  }));
  const path = buildPath(mapped, c.smooth);

  return (
    <div className="builder-datadisplay-chart" data-builder-datadisplay-widget="line-chart">
      {title ? <strong>{title}</strong> : null}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={title || copy.chart.lineAria}>
        <path d={path} fill="none" stroke={c.color} strokeWidth={2.5} strokeLinecap="round" />
        {c.showPoints ? mapped.map((p, idx) => (
          <circle key={idx} cx={p.x} cy={p.y} r={3} fill={c.color} />
        )) : null}
        {points.map((p, idx) => (
          <text key={`l-${idx}`} x={16 + idx * stepX} y={H - 4} fontSize={9} textAnchor="middle" fill="#64748b">
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default LineChartRender;
