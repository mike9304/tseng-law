import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderPieChartCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  DATA_WIDGETS_LEGACY_DEFAULTS,
  getDataWidgetsCopy,
  localizedDataWidgetSlices,
  localizedDataWidgetText,
} from '../data-widgets-copy';
import styles from '../DataWidgetInspector.module.css';

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
