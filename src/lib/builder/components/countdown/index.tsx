'use client';

import { useEffect, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderCountdownCanvasNode } from '@/lib/builder/canvas/types';

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
}: {
  node: BuilderCountdownCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const content = node.content;
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (mode === 'edit') return undefined;
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
        <strong>{content.label}</strong>
        <span>{content.expiredText}</span>
      </div>
    );
  }

  const parts: Array<{ key: string; label: string; value: number; show: boolean }> = [
    { key: 'days', label: '일', value: segments.days, show: content.showDays },
    { key: 'hours', label: '시', value: segments.hours, show: content.showHours },
    { key: 'minutes', label: '분', value: segments.minutes, show: content.showMinutes },
    { key: 'seconds', label: '초', value: segments.seconds, show: content.showSeconds },
  ];

  return (
    <div
      className="builder-interactive-countdown"
      data-builder-interactive-widget="countdown"
      data-builder-countdown-variant={content.variant}
    >
      <strong>{content.label}</strong>
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
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const countdownNode = node as BuilderCountdownCanvasNode;
  const c = countdownNode.content;

  return (
    <>
      <label>
        <span>대상 시각 (ISO)</span>
        <input
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
      <label>
        <span>라벨</span>
        <input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>만료 텍스트</span>
        <input type="text" value={c.expiredText} disabled={disabled} onChange={(event) => onUpdate({ expiredText: event.target.value })} />
      </label>
      <label>
        <span>스타일</span>
        <select value={c.variant} disabled={disabled} onChange={(event) => onUpdate({ variant: event.target.value as BuilderCountdownCanvasNode['content']['variant'] })}>
          <option value="card">Card</option>
          <option value="compact">Compact</option>
          <option value="inline">Inline</option>
        </select>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showDays} disabled={disabled} onChange={(event) => onUpdate({ showDays: event.target.checked })} />
        <span>일 표시</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showHours} disabled={disabled} onChange={(event) => onUpdate({ showHours: event.target.checked })} />
        <span>시간 표시</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showMinutes} disabled={disabled} onChange={(event) => onUpdate({ showMinutes: event.target.checked })} />
        <span>분 표시</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showSeconds} disabled={disabled} onChange={(event) => onUpdate({ showSeconds: event.target.checked })} />
        <span>초 표시</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'countdown',
  displayName: '카운트다운',
  category: 'advanced',
  icon: '⏳',
  defaultContent: {
    targetAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    label: '카운트다운',
    expiredText: '마감되었습니다',
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
