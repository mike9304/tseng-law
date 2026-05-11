import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderLineChartCanvasNode } from '@/lib/builder/canvas/types';

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
}: {
  node: BuilderLineChartCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const W = 360;
  const H = 180;
  const innerW = W - 32;
  const innerH = H - 32;
  if (c.points.length === 0) {
    return (
      <div className="builder-datadisplay-chart" data-builder-datadisplay-widget="line-chart">
        <em>데이터 없음</em>
      </div>
    );
  }
  const max = Math.max(...c.points.map((p) => p.value));
  const min = Math.min(...c.points.map((p) => p.value));
  const range = max - min || 1;
  const stepX = c.points.length > 1 ? innerW / (c.points.length - 1) : innerW;
  const mapped = c.points.map((p, i) => ({
    x: 16 + i * stepX,
    y: 16 + innerH - ((p.value - min) / range) * innerH,
  }));
  const path = buildPath(mapped, c.smooth);

  return (
    <div className="builder-datadisplay-chart" data-builder-datadisplay-widget="line-chart">
      {c.title ? <strong>{c.title}</strong> : null}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={c.title || 'Line chart'}>
        <path d={path} fill="none" stroke={c.color} strokeWidth={2.5} strokeLinecap="round" />
        {c.showPoints ? mapped.map((p, idx) => (
          <circle key={idx} cx={p.x} cy={p.y} r={3} fill={c.color} />
        )) : null}
        {c.points.map((p, idx) => (
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
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const lcNode = node as BuilderLineChartCanvasNode;
  const c = lcNode.content;
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
        <input type="checkbox" checked={c.smooth} disabled={disabled} onChange={(event) => onUpdate({ smooth: event.target.checked })} />
        <span>부드러운 곡선</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showPoints} disabled={disabled} onChange={(event) => onUpdate({ showPoints: event.target.checked })} />
        <span>포인트 표시</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'line-chart',
  displayName: 'Line 차트',
  category: 'advanced',
  icon: '⌇',
  defaultContent: {
    title: '연간 자문 추세',
    points: [
      { label: '2021', value: 120 },
      { label: '2022', value: 154 },
      { label: '2023', value: 168 },
      { label: '2024', value: 195 },
      { label: '2025', value: 230 },
    ],
    color: '#0ea5e9',
    smooth: true,
    showPoints: true,
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 240 },
  Render: LineChartRender,
  Inspector: LineChartInspector,
});
