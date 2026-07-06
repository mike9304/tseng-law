import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderLineChartCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  DATA_WIDGETS_LEGACY_DEFAULTS,
  getDataWidgetsCopy,
  localizedDataWidgetPoints,
  localizedDataWidgetText,
} from '../data-widgets-copy';
import styles from '../DataWidgetInspector.module.css';

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

function pointsToText(points: BuilderLineChartCanvasNode['content']['points']): string {
  return points.map((p) => `${p.label} | ${p.value}`).join('\n');
}

function parsePoints(value: string): BuilderLineChartCanvasNode['content']['points'] {
  const out: BuilderLineChartCanvasNode['content']['points'] = [];
  for (const raw of value.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const [label, numRaw] = line.split('|').map((p) => p.trim());
    const num = Number(numRaw);
    if (!label || !Number.isFinite(num)) continue;
    out.push({ label: label.slice(0, 40), value: num });
  }
  return out.slice(0, 40);
}

function LineChartInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const lcNode = node as BuilderLineChartCanvasNode;
  const c = lcNode.content;
  const copy = getDataWidgetsCopy(locale);
  const title = localizedDataWidgetText(c.title, copy.chart.defaults.lineTitle, DATA_WIDGETS_LEGACY_DEFAULTS.lineTitle);
  const points = localizedDataWidgetPoints(c.points, copy.chart.defaults.linePoints, DATA_WIDGETS_LEGACY_DEFAULTS.linePoints);
  return (
    <div className={styles.root} data-builder-data-widget-inspector="line-chart">
      <label className={styles.field}>
        <span className={styles.label}>{copy.chart.inspector.title}</span>
        <input className={styles.control} type="text" value={title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.chart.inspector.points}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={6}
          value={pointsToText(points)}
          disabled={disabled}
          onChange={(event) => onUpdate({ points: parsePoints(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.chart.inspector.color}</span>
        <input className={styles.control} type="text" value={c.color} disabled={disabled} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.smooth} disabled={disabled} onChange={(event) => onUpdate({ smooth: event.target.checked })} />
        <span>{copy.chart.inspector.smoothCurve}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showPoints} disabled={disabled} onChange={(event) => onUpdate({ showPoints: event.target.checked })} />
        <span>{copy.chart.inspector.showPoints}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'line-chart',
  displayName: 'Line 차트',
  category: 'advanced',
  icon: '⌇',
  defaultContent: {
    title: DATA_WIDGETS_LEGACY_DEFAULTS.lineTitle,
    points: DATA_WIDGETS_LEGACY_DEFAULTS.linePoints.map((point) => ({ ...point })),
    color: '#0ea5e9',
    smooth: true,
    showPoints: true,
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 240 },
  Render: LineChartRender,
  Inspector: LineChartInspector,
});
