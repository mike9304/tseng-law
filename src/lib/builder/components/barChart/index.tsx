import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderBarChartCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  DATA_WIDGETS_LEGACY_DEFAULTS,
  getDataWidgetsCopy,
  localizedDataWidgetPoints,
  localizedDataWidgetText,
} from '../data-widgets-copy';
import styles from '../DataWidgetInspector.module.css';

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

function pointsToText(points: BuilderBarChartCanvasNode['content']['points']): string {
  return points.map((p) => `${p.label} | ${p.value}`).join('\n');
}

function parsePoints(value: string): BuilderBarChartCanvasNode['content']['points'] {
  const out: BuilderBarChartCanvasNode['content']['points'] = [];
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

function BarChartInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const bcNode = node as BuilderBarChartCanvasNode;
  const c = bcNode.content;
  const copy = getDataWidgetsCopy(locale);
  const title = localizedDataWidgetText(c.title, copy.chart.defaults.barTitle, DATA_WIDGETS_LEGACY_DEFAULTS.barTitle);
  const points = localizedDataWidgetPoints(c.points, copy.chart.defaults.barPoints, DATA_WIDGETS_LEGACY_DEFAULTS.barPoints);
  return (
    <div className={styles.root} data-builder-data-widget-inspector="bar-chart">
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
        <input type="checkbox" checked={c.showValueLabel} disabled={disabled} onChange={(event) => onUpdate({ showValueLabel: event.target.checked })} />
        <span>{copy.chart.inspector.showValueLabels}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'bar-chart',
  displayName: 'Bar 차트',
  category: 'advanced',
  icon: '▮',
  defaultContent: {
    title: DATA_WIDGETS_LEGACY_DEFAULTS.barTitle,
    points: DATA_WIDGETS_LEGACY_DEFAULTS.barPoints.map((point) => ({ ...point })),
    color: '#1d4ed8',
    showValueLabel: true,
  },
  defaultStyle: {},
  defaultRect: { width: 360, height: 220 },
  Render: BarChartRender,
  Inspector: BarChartInspector,
});
