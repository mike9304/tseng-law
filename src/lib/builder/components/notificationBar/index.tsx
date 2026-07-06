'use client';

import { useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderNotificationBarCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getNotificationBarCopy,
  localizedNotificationBarText,
  NOTIFICATION_BAR_LEGACY_DEFAULTS,
} from './notification-bar-copy';
import styles from './NotificationBarInspector.module.css';

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

function NotificationBarInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const notiNode = node as BuilderNotificationBarCanvasNode;
  const c = notiNode.content;
  const copy = getNotificationBarCopy(locale);
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
  return (
    <div className={styles.root} data-builder-notification-bar-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.message}</span>
        <textarea
          rows={2}
          value={message}
          disabled={disabled}
          className={`${styles.control} ${styles.textarea}`}
          onChange={(event) => onUpdate({ message: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.ctaLabel}</span>
        <input
          type="text"
          value={ctaLabel}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ ctaLabel: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.ctaHref}</span>
        <input
          type="text"
          value={c.ctaHref}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ ctaHref: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.tone}</span>
        <select
          value={c.tone}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ tone: event.target.value as BuilderNotificationBarCanvasNode['content']['tone'] })}
        >
          <option value="info">{copy.inspector.tones.info}</option>
          <option value="warning">{copy.inspector.tones.warning}</option>
          <option value="success">{copy.inspector.tones.success}</option>
          <option value="danger">{copy.inspector.tones.danger}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.position}</span>
        <select
          value={c.position}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ position: event.target.value as BuilderNotificationBarCanvasNode['content']['position'] })}
        >
          <option value="top">{copy.inspector.positions.top}</option>
          <option value="bottom">{copy.inspector.positions.bottom}</option>
        </select>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.dismissable}
          disabled={disabled}
          onChange={(event) => onUpdate({ dismissable: event.target.checked })}
        />
        <span>{copy.inspector.dismissable}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'notification-bar',
  displayName: '알림 바',
  category: 'advanced',
  icon: '🔔',
  defaultContent: {
    message: NOTIFICATION_BAR_LEGACY_DEFAULTS.message,
    ctaLabel: NOTIFICATION_BAR_LEGACY_DEFAULTS.ctaLabel,
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
