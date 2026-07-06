'use client';

import { useEffect, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderCountdownCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  getInteractiveWidgetsCopy,
  INTERACTIVE_WIDGETS_LEGACY_DEFAULTS,
  localizedInteractiveWidgetText,
} from '../interactive-widgets-copy';
import styles from './CountdownInspector.module.css';

interface Segments {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function diffSegments(targetAt: string, now: number): Segments {
  const target = Date.parse(targetAt);
  if (!Number.isFinite(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const remaining = Math.max(0, target - now);
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  return { days, hours, minutes, seconds, expired: remaining === 0 };
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function CountdownRender({
  node,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderCountdownCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const content = node.content;
  const copy = getInteractiveWidgetsCopy(locale);
  const label = localizedInteractiveWidgetText(content.label, copy.countdown.defaultLabel, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownLabel);
  const expiredText = localizedInteractiveWidgetText(
    content.expiredText,
    copy.countdown.defaultExpiredText,
    INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownExpiredText,
  );
  // Use the parsed target as a deterministic SSR initial so server + client
  // first paint agree (Date.now() in the initializer would otherwise hydrate
  // with a different value than the server rendered).
  const ssrInitial = Date.parse(content.targetAt);
  const [now, setNow] = useState<number>(() => (Number.isFinite(ssrInitial) ? ssrInitial : 0));

  useEffect(() => {
    if (mode === 'edit') {
      setNow(Date.now());
      return undefined;
    }
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [mode]);

  const segments = diffSegments(content.targetAt, now);

  if (segments.expired) {
    return (
      <div
        className="builder-interactive-countdown"
        data-builder-interactive-widget="countdown"
        data-builder-countdown-variant={content.variant}
        data-builder-countdown-expired="true"
      >
        <strong>{label}</strong>
        <span>{expiredText}</span>
      </div>
    );
  }

  const parts: Array<{ key: string; label: string; value: number; show: boolean }> = [
    { key: 'days', label: copy.countdown.segments.days, value: segments.days, show: content.showDays },
    { key: 'hours', label: copy.countdown.segments.hours, value: segments.hours, show: content.showHours },
    { key: 'minutes', label: copy.countdown.segments.minutes, value: segments.minutes, show: content.showMinutes },
    { key: 'seconds', label: copy.countdown.segments.seconds, value: segments.seconds, show: content.showSeconds },
  ];

  return (
    <div
      className="builder-interactive-countdown"
      data-builder-interactive-widget="countdown"
      data-builder-countdown-variant={content.variant}
    >
      <strong>{label}</strong>
      <div className="builder-interactive-countdown-segments">
        {parts.filter((p) => p.show).map((p) => (
          <span key={p.key} data-builder-countdown-segment={p.key}>
            <em>{p.key === 'days' ? p.value : pad(p.value)}</em>
            <small>{p.label}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

function CountdownInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const countdownNode = node as BuilderCountdownCanvasNode;
  const c = countdownNode.content;
  const countdownCopy = getInteractiveWidgetsCopy(locale).countdown;
  const copy = countdownCopy.inspector;
  const label = localizedInteractiveWidgetText(c.label, countdownCopy.defaultLabel, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownLabel);
  const expiredText = localizedInteractiveWidgetText(
    c.expiredText,
    countdownCopy.defaultExpiredText,
    INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownExpiredText,
  );

  return (
    <div className={styles.root} data-builder-countdown-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.targetAt}</span>
        <input
          className={styles.control}
          type="datetime-local"
          value={c.targetAt ? c.targetAt.slice(0, 16) : ''}
          disabled={disabled}
          onChange={(event) => {
            const raw = event.target.value;
            const iso = raw ? new Date(raw).toISOString() : '';
            onUpdate({ targetAt: iso });
          }}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.label}</span>
        <input className={styles.control} type="text" value={label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.expiredText}</span>
        <input className={styles.control} type="text" value={expiredText} disabled={disabled} onChange={(event) => onUpdate({ expiredText: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.style}</span>
        <select className={styles.control} value={c.variant} disabled={disabled} onChange={(event) => onUpdate({ variant: event.target.value as BuilderCountdownCanvasNode['content']['variant'] })}>
          <option value="card">{copy.variantOptions.card}</option>
          <option value="compact">{copy.variantOptions.compact}</option>
          <option value="inline">{copy.variantOptions.inline}</option>
        </select>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showDays} disabled={disabled} onChange={(event) => onUpdate({ showDays: event.target.checked })} />
        <span>{copy.showDays}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showHours} disabled={disabled} onChange={(event) => onUpdate({ showHours: event.target.checked })} />
        <span>{copy.showHours}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showMinutes} disabled={disabled} onChange={(event) => onUpdate({ showMinutes: event.target.checked })} />
        <span>{copy.showMinutes}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showSeconds} disabled={disabled} onChange={(event) => onUpdate({ showSeconds: event.target.checked })} />
        <span>{copy.showSeconds}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'countdown',
  displayName: '카운트다운',
  category: 'advanced',
  icon: '⏳',
  defaultContent: {
    targetAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    label: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownLabel,
    expiredText: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownExpiredText,
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    variant: 'card' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 120 },
  Render: CountdownRender,
  Inspector: CountdownInspector,
});
