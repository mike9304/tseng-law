'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderCountdownCanvasNode } from '@/lib/builder/canvas/types';
import { getInteractiveWidgetsCopy, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS, localizedInteractiveWidgetText } from '../interactive-widgets-copy';
import styles from './CountdownInspector.module.css';

import CountdownRender from './Render';

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
