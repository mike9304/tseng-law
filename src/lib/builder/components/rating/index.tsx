import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderRatingCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  getInteractiveWidgetsCopy,
  INTERACTIVE_WIDGETS_LEGACY_DEFAULTS,
  localizedInteractiveWidgetText,
} from '../interactive-widgets-copy';
import styles from './RatingInspector.module.css';

function GLYPH_FOR(variant: BuilderRatingCanvasNode['content']['variant']): string {
  if (variant === 'hearts') return '♥';
  if (variant === 'dots') return '●';
  return '★';
}

function RatingRender({
  node,
  locale = 'ko',
}: {
  node: BuilderRatingCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getInteractiveWidgetsCopy(locale);
  const label = localizedInteractiveWidgetText(c.label, copy.rating.defaultLabel, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.ratingLabel);
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
      {label ? <strong>{label}</strong> : null}
      <div className="builder-interactive-rating-glyphs" aria-label={copy.rating.ariaLabel(value, max)}>
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
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const ratingNode = node as BuilderRatingCanvasNode;
  const c = ratingNode.content;
  const ratingCopy = getInteractiveWidgetsCopy(locale).rating;
  const copy = ratingCopy.inspector;
  const label = localizedInteractiveWidgetText(c.label, ratingCopy.defaultLabel, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.ratingLabel);
  return (
    <div className={styles.root} data-builder-rating-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.label}</span>
        <input type="text" value={label} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.value}</span>
        <input
          type="number"
          step="0.1"
          min={0}
          max={c.max}
          value={c.value}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ value: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.max}</span>
        <input
          type="number"
          min={3}
          max={10}
          value={c.max}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ max: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.style}</span>
        <select
          value={c.variant}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderRatingCanvasNode['content']['variant'] })}
        >
          <option value="stars">{copy.variantOptions.stars}</option>
          <option value="hearts">{copy.variantOptions.hearts}</option>
          <option value="dots">{copy.variantOptions.dots}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.color}</span>
        <input type="text" value={c.color} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showValue} disabled={disabled} onChange={(event) => onUpdate({ showValue: event.target.checked })} />
        <span>{copy.showValue}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'rating',
  displayName: '별점',
  category: 'advanced',
  icon: '★',
  defaultContent: {
    label: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.ratingLabel,
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
