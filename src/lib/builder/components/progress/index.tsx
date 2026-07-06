import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderProgressCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  getInteractiveWidgetsCopy,
  INTERACTIVE_WIDGETS_LEGACY_DEFAULTS,
  localizedInteractiveWidgetText,
} from '../interactive-widgets-copy';
import styles from './ProgressInspector.module.css';

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

function ProgressInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const progressNode = node as BuilderProgressCanvasNode;
  const c = progressNode.content;
  const progressCopy = getInteractiveWidgetsCopy(locale).progress;
  const copy = progressCopy.inspector;
  const label = localizedInteractiveWidgetText(c.label, progressCopy.defaultLabel, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.progressLabel);
  return (
    <div className={styles.root} data-builder-progress-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.label}</span>
        <input type="text" value={label} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.value}</span>
        <input
          type="number"
          min={0}
          max={100}
          value={c.value}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ value: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.style}</span>
        <select
          value={c.variant}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderProgressCanvasNode['content']['variant'] })}
        >
          <option value="bar">{copy.variantOptions.bar}</option>
          <option value="ring">{copy.variantOptions.ring}</option>
          <option value="segments">{copy.variantOptions.segments}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.color}</span>
        <input type="text" value={c.color} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.trackColor}</span>
        <input type="text" value={c.trackColor} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ trackColor: event.target.value })} />
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showPercent} disabled={disabled} onChange={(event) => onUpdate({ showPercent: event.target.checked })} />
        <span>{copy.showPercent}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'progress',
  displayName: '진행률',
  category: 'advanced',
  icon: '▰',
  defaultContent: {
    label: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.progressLabel,
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
