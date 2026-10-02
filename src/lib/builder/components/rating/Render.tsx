import type { BuilderRatingCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getInteractiveWidgetsCopy, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS, localizedInteractiveWidgetText } from '../interactive-widgets-copy';

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

export default RatingRender;
