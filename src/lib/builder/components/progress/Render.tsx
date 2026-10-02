import type { BuilderProgressCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getInteractiveWidgetsCopy, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS, localizedInteractiveWidgetText } from '../interactive-widgets-copy';

function ProgressRender({
  node,
  locale = 'ko',
}: {
  node: BuilderProgressCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getInteractiveWidgetsCopy(locale);
  const label = localizedInteractiveWidgetText(c.label, copy.progress.defaultLabel, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.progressLabel);
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
        <svg viewBox="0 0 100 100" width={100} height={100} aria-label={copy.progress.ariaLabel(label, value)} role="img">
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
        <strong>{label}</strong>
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
        <strong>{label}</strong>
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
      <strong>{label}</strong>
      <div className="builder-interactive-progress-track" style={{ background: c.trackColor }}>
        <span style={{ width: `${value}%`, background: c.color }} />
      </div>
      {c.showPercent ? <small>{value}%</small> : null}
    </div>
  );
}

export default ProgressRender;
