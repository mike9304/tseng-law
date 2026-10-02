import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderBarChartCanvasNode } from '@/lib/builder/canvas/types';
import { DATA_WIDGETS_LEGACY_DEFAULTS, getDataWidgetsCopy, localizedDataWidgetPoints, localizedDataWidgetText } from '../data-widgets-copy';
import styles from '../DataWidgetInspector.module.css';

import BarChartRender from './Render';

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
