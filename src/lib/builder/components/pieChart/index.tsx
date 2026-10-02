import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderPieChartCanvasNode } from '@/lib/builder/canvas/types';
import { DATA_WIDGETS_LEGACY_DEFAULTS, getDataWidgetsCopy, localizedDataWidgetSlices, localizedDataWidgetText } from '../data-widgets-copy';
import styles from '../DataWidgetInspector.module.css';

import PieChartRender from './Render';

function slicesToText(slices: BuilderPieChartCanvasNode['content']['slices']): string {
  return slices.map((s) => `${s.label} | ${s.value} | ${s.color ?? ''}`).join('\n');
}

function parseSlices(value: string): BuilderPieChartCanvasNode['content']['slices'] {
  const out: BuilderPieChartCanvasNode['content']['slices'] = [];
  for (const raw of value.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const [label, numRaw, color] = line.split('|').map((p) => p.trim());
    const num = Number(numRaw);
    if (!label || !Number.isFinite(num)) continue;
    const slice: { label: string; value: number; color?: string } = { label: label.slice(0, 40), value: num };
    if (color) slice.color = color.slice(0, 60);
    out.push(slice);
  }
  return out.slice(0, 12);
}

function PieChartInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const pcNode = node as BuilderPieChartCanvasNode;
  const c = pcNode.content;
  const copy = getDataWidgetsCopy(locale);
  const title = localizedDataWidgetText(c.title, copy.chart.defaults.pieTitle, DATA_WIDGETS_LEGACY_DEFAULTS.pieTitle);
  const slices = localizedDataWidgetSlices(c.slices, copy.chart.defaults.pieSlices);
  return (
    <div className={styles.root} data-builder-data-widget-inspector="pie-chart">
      <label className={styles.field}>
        <span className={styles.label}>{copy.chart.inspector.title}</span>
        <input className={styles.control} type="text" value={title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.chart.inspector.slices}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={6}
          value={slicesToText(slices)}
          disabled={disabled}
          onChange={(event) => onUpdate({ slices: parseSlices(event.target.value) })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showLegend} disabled={disabled} onChange={(event) => onUpdate({ showLegend: event.target.checked })} />
        <span>{copy.chart.inspector.showLegend}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.donut} disabled={disabled} onChange={(event) => onUpdate({ donut: event.target.checked })} />
        <span>{copy.chart.inspector.donut}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'pie-chart',
  displayName: 'Pie 차트',
  category: 'advanced',
  icon: '◔',
  defaultContent: {
    title: DATA_WIDGETS_LEGACY_DEFAULTS.pieTitle,
    slices: DATA_WIDGETS_LEGACY_DEFAULTS.pieSlices.map((slice) => ({ ...slice })),
    showLegend: true,
    donut: false,
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 220 },
  Render: PieChartRender,
  Inspector: PieChartInspector,
});
