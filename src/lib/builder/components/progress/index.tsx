import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderProgressCanvasNode } from '@/lib/builder/canvas/types';

function ProgressRender({
  node,
}: {
  node: BuilderProgressCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const value = Math.max(0, Math.min(100, c.value));

  if (c.variant === 'ring') {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - value / 100);
    return (
      <div
        className="builder-interactive-progress"
        data-builder-interactive-widget="progress"
        data-builder-progress-variant="ring"
      >
        <svg viewBox="0 0 100 100" width={100} height={100} aria-label={c.label} role="img">
          <circle cx="50" cy="50" r={radius} fill="none" stroke={c.trackColor} strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={c.color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <strong>{c.label}</strong>
        {c.showPercent ? <span>{value}%</span> : null}
      </div>
    );
  }

  if (c.variant === 'segments') {
    const segments = Array.from({ length: 10 }, (_, idx) => idx + 1);
    const filled = Math.round((value / 100) * 10);
    return (
      <div
        className="builder-interactive-progress"
        data-builder-interactive-widget="progress"
        data-builder-progress-variant="segments"
      >
        <strong>{c.label}</strong>
        <div className="builder-interactive-progress-segments">
          {segments.map((idx) => (
            <span
              key={idx}
              data-builder-progress-segment-filled={idx <= filled ? 'true' : 'false'}
              style={{ background: idx <= filled ? c.color : c.trackColor }}
            />
          ))}
        </div>
        {c.showPercent ? <small>{value}%</small> : null}
      </div>
    );
  }

  return (
    <div
      className="builder-interactive-progress"
      data-builder-interactive-widget="progress"
      data-builder-progress-variant="bar"
    >
      <strong>{c.label}</strong>
      <div className="builder-interactive-progress-track" style={{ background: c.trackColor }}>
        <span style={{ width: `${value}%`, background: c.color }} />
      </div>
      {c.showPercent ? <small>{value}%</small> : null}
    </div>
  );
}

function ProgressInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const progressNode = node as BuilderProgressCanvasNode;
  const c = progressNode.content;
  return (
    <>
      <label>
        <span>라벨</span>
        <input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>값 (0~100)</span>
        <input
          type="number"
          min={0}
          max={100}
          value={c.value}
          disabled={disabled}
          onChange={(event) => onUpdate({ value: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>스타일</span>
        <select
          value={c.variant}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderProgressCanvasNode['content']['variant'] })}
        >
          <option value="bar">Bar</option>
          <option value="ring">Ring</option>
          <option value="segments">Segments</option>
        </select>
      </label>
      <label>
        <span>전경색</span>
        <input type="text" value={c.color} disabled={disabled} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label>
        <span>트랙색</span>
        <input type="text" value={c.trackColor} disabled={disabled} onChange={(event) => onUpdate({ trackColor: event.target.value })} />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showPercent} disabled={disabled} onChange={(event) => onUpdate({ showPercent: event.target.checked })} />
        <span>퍼센트 표시</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'progress',
  displayName: '진행률',
  category: 'advanced',
  icon: '▰',
  defaultContent: {
    label: '진행률',
    value: 60,
    showPercent: true,
    variant: 'bar' as const,
    color: '#1d4ed8',
    trackColor: '#e2e8f0',
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 80 },
  Render: ProgressRender,
  Inspector: ProgressInspector,
});
