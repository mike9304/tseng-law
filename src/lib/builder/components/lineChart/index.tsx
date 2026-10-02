import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderLineChartCanvasNode } from '@/lib/builder/canvas/types';
import { DATA_WIDGETS_LEGACY_DEFAULTS, getDataWidgetsCopy, localizedDataWidgetPoints, localizedDataWidgetText } from '../data-widgets-copy';
import styles from '../DataWidgetInspector.module.css';

import LineChartRender from './Render';

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
