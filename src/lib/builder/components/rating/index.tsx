import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderRatingCanvasNode } from '@/lib/builder/canvas/types';

function GLYPH_FOR(variant: BuilderRatingCanvasNode['content']['variant']): string {
  if (variant === 'hearts') return '♥';
  if (variant === 'dots') return '●';
  return '★';
}

function RatingRender({
  node,
}: {
  node: BuilderRatingCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const max = Math.max(3, Math.min(10, c.max));
  const value = Math.max(0, Math.min(max, c.value));
  const glyph = GLYPH_FOR(c.variant);
  const fillPct = (value / max) * 100;

  return (
    <div
      className="builder-interactive-rating"
      data-builder-interactive-widget="rating"
      data-builder-rating-variant={c.variant}
    >
      {c.label ? <strong>{c.label}</strong> : null}
      <div className="builder-interactive-rating-glyphs" aria-label={`${value} / ${max}`}>
        <span className="builder-interactive-rating-track" style={{ color: '#cbd5e1' }}>
          {Array.from({ length: max }, () => glyph).join('')}
        </span>
        <span
          className="builder-interactive-rating-fill"
          style={{ color: c.color, width: `${fillPct}%` }}
        >
          {Array.from({ length: max }, () => glyph).join('')}
        </span>
      </div>
      {c.showValue ? <small>{value.toFixed(1)} / {max}</small> : null}
    </div>
  );
}

function RatingInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const ratingNode = node as BuilderRatingCanvasNode;
  const c = ratingNode.content;
  return (
    <>
      <label>
        <span>라벨</span>
        <input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>값</span>
        <input
          type="number"
          step="0.1"
          min={0}
          max={c.max}
          value={c.value}
          disabled={disabled}
          onChange={(event) => onUpdate({ value: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>최대값</span>
        <input
          type="number"
          min={3}
          max={10}
          value={c.max}
          disabled={disabled}
          onChange={(event) => onUpdate({ max: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>스타일</span>
        <select
          value={c.variant}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderRatingCanvasNode['content']['variant'] })}
        >
          <option value="stars">Stars</option>
          <option value="hearts">Hearts</option>
          <option value="dots">Dots</option>
        </select>
      </label>
      <label>
        <span>색</span>
        <input type="text" value={c.color} disabled={disabled} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showValue} disabled={disabled} onChange={(event) => onUpdate({ showValue: event.target.checked })} />
        <span>숫자 표시</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'rating',
  displayName: '별점',
  category: 'advanced',
  icon: '★',
  defaultContent: {
    label: '별점',
    value: 4.5,
    max: 5,
    showValue: true,
    color: '#f59e0b',
    variant: 'stars' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 260, height: 80 },
  Render: RatingRender,
  Inspector: RatingInspector,
});
