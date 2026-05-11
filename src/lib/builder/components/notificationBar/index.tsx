import { useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderNotificationBarCanvasNode } from '@/lib/builder/canvas/types';

function safeHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'mailto:' || url.protocol === 'tel:') {
      return url.toString();
    }
  } catch {
    /* fall through */
  }
  return null;
}

const TONE_COLORS: Record<BuilderNotificationBarCanvasNode['content']['tone'], { bg: string; fg: string; border: string }> = {
  info: { bg: '#eff6ff', fg: '#1e3a8a', border: '#bfdbfe' },
  warning: { bg: '#fffbeb', fg: '#92400e', border: '#fde68a' },
  success: { bg: '#ecfdf5', fg: '#065f46', border: '#a7f3d0' },
  danger: { bg: '#fef2f2', fg: '#991b1b', border: '#fecaca' },
};

function NotificationBarRender({
  node,
  mode = 'edit',
}: {
  node: BuilderNotificationBarCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const [dismissed, setDismissed] = useState(false);
  const palette = TONE_COLORS[c.tone];
  const ctaHref = safeHref(c.ctaHref);

  if (dismissed && mode !== 'edit') return null;

  return (
    <div
      className="builder-interactive-notification-bar"
      data-builder-interactive-widget="notification-bar"
      data-builder-notification-tone={c.tone}
      data-builder-notification-position={c.position}
      role="status"
      style={{ background: palette.bg, color: palette.fg, borderColor: palette.border }}
    >
      <span className="builder-interactive-notification-message">{c.message}</span>
      {ctaHref && c.ctaLabel ? (
        <a
          className="builder-interactive-notification-cta"
          href={ctaHref}
          rel="noopener noreferrer"
          style={{ color: palette.fg }}
        >
          {c.ctaLabel}
        </a>
      ) : null}
      {c.dismissable ? (
        <button
          type="button"
          aria-label="dismiss notification"
          className="builder-interactive-notification-dismiss"
          onClick={() => mode !== 'edit' && setDismissed(true)}
          style={{ color: palette.fg }}
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

function NotificationBarInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const notiNode = node as BuilderNotificationBarCanvasNode;
  const c = notiNode.content;
  return (
    <>
      <label>
        <span>메시지</span>
        <textarea
          rows={2}
          value={c.message}
          disabled={disabled}
          onChange={(event) => onUpdate({ message: event.target.value })}
        />
      </label>
      <label>
        <span>CTA 라벨</span>
        <input type="text" value={c.ctaLabel} disabled={disabled} onChange={(event) => onUpdate({ ctaLabel: event.target.value })} />
      </label>
      <label>
        <span>CTA 링크</span>
        <input type="text" value={c.ctaHref} disabled={disabled} onChange={(event) => onUpdate({ ctaHref: event.target.value })} />
      </label>
      <label>
        <span>톤</span>
        <select
          value={c.tone}
          disabled={disabled}
          onChange={(event) => onUpdate({ tone: event.target.value as BuilderNotificationBarCanvasNode['content']['tone'] })}
        >
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="success">Success</option>
          <option value="danger">Danger</option>
        </select>
      </label>
      <label>
        <span>위치</span>
        <select
          value={c.position}
          disabled={disabled}
          onChange={(event) => onUpdate({ position: event.target.value as BuilderNotificationBarCanvasNode['content']['position'] })}
        >
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type="checkbox"
          checked={c.dismissable}
          disabled={disabled}
          onChange={(event) => onUpdate({ dismissable: event.target.checked })}
        />
        <span>닫기 버튼 표시</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'notification-bar',
  displayName: '알림 바',
  category: 'advanced',
  icon: '🔔',
  defaultContent: {
    message: '새 공지가 도착했습니다.',
    ctaLabel: '자세히 보기',
    ctaHref: '',
    dismissable: true,
    tone: 'info' as const,
    position: 'top' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 720, height: 56 },
  Render: NotificationBarRender,
  Inspector: NotificationBarInspector,
});
