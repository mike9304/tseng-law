'use client';

import { useState } from 'react';
import type { BuilderNotificationBarCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getNotificationBarCopy, localizedNotificationBarText, NOTIFICATION_BAR_LEGACY_DEFAULTS } from './notification-bar-copy';

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
  locale,
  mode = 'edit',
}: {
  node: BuilderNotificationBarCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const copy = getNotificationBarCopy(normalizeLocale(locale || 'ko'));
  const [dismissed, setDismissed] = useState(false);
  const palette = TONE_COLORS[c.tone];
  const ctaHref = safeHref(c.ctaHref);
  const message = localizedNotificationBarText(
    c.message,
    copy.defaults.message,
    NOTIFICATION_BAR_LEGACY_DEFAULTS.message,
  );
  const ctaLabel = localizedNotificationBarText(
    c.ctaLabel,
    copy.defaults.ctaLabel,
    NOTIFICATION_BAR_LEGACY_DEFAULTS.ctaLabel,
  );

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
      <span className="builder-interactive-notification-message">{message}</span>
      {ctaHref && ctaLabel ? (
        <a
          className="builder-interactive-notification-cta"
          href={ctaHref}
          rel="noopener noreferrer"
          style={{ color: palette.fg }}
        >
          {ctaLabel}
        </a>
      ) : null}
      {c.dismissable ? (
        <button
          type="button"
          aria-label={copy.dismiss}
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

export default NotificationBarRender;
