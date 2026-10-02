'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderNotificationBarCanvasNode } from '@/lib/builder/canvas/types';
import { getNotificationBarCopy, localizedNotificationBarText, NOTIFICATION_BAR_LEGACY_DEFAULTS } from './notification-bar-copy';
import styles from './NotificationBarInspector.module.css';

import NotificationBarRender from './Render';

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
