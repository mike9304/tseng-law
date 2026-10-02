import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderProgressCanvasNode } from '@/lib/builder/canvas/types';
import { getInteractiveWidgetsCopy, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS, localizedInteractiveWidgetText } from '../interactive-widgets-copy';
import styles from './ProgressInspector.module.css';

import ProgressRender from './Render';

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
