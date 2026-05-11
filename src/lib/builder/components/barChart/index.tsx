import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderBarChartCanvasNode } from '@/lib/builder/canvas/types';

function BarChartRender({
  node,
}: {
  node: BuilderBarChartCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const max = Math.max(1, ...c.points.map((p) => p.value));
  const W = 320;
  const H = 160;
  const innerW = W - 24;
  const innerH = H - 24;
  const barW = c.points.length > 0 ? Math.max(8, (innerW - 8 * (c.points.length - 1)) / c.points.length) : 0;

  return (
    <div className="builder-datadisplay-chart" data-builder-datadisplay-widget="bar-chart">
      {c.title ? <strong>{c.title}</strong> : null}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={c.title || 'Bar chart'}>
        {c.points.map((p, idx) => {
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
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const bcNode = node as BuilderBarChartCanvasNode;
  const c = bcNode.content;
  return (
    <>
      <label>
        <span>제목</span>
        <input type="text" value={c.title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label>
        <span>데이터 (label | value)</span>
        <textarea
          rows={6}
          style={{ fontFamily: 'inherit', resize: 'vertical' }}
          value={pointsToText(c.points)}
          disabled={disabled}
          onChange={(event) => onUpdate({ points: parsePoints(event.target.value) })}
        />
      </label>
      <label>
        <span>색</span>
        <input type="text" value={c.color} disabled={disabled} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showValueLabel} disabled={disabled} onChange={(event) => onUpdate({ showValueLabel: event.target.checked })} />
        <span>값 라벨 표시</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'bar-chart',
  displayName: 'Bar 차트',
  category: 'advanced',
  icon: '▮',
  defaultContent: {
    title: '월별 자문 건수',
    points: [
      { label: 'Jan', value: 32 },
      { label: 'Feb', value: 28 },
      { label: 'Mar', value: 40 },
      { label: 'Apr', value: 35 },
      { label: 'May', value: 46 },
      { label: 'Jun', value: 52 },
    ],
    color: '#1d4ed8',
    showValueLabel: true,
  },
  defaultStyle: {},
  defaultRect: { width: 360, height: 220 },
  Render: BarChartRender,
  Inspector: BarChartInspector,
});
