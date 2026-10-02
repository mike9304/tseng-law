'use client';

import { useEffect, useState } from 'react';
import type { BuilderCountdownCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getInteractiveWidgetsCopy, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS, localizedInteractiveWidgetText } from '../interactive-widgets-copy';

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

export default CountdownRender;
