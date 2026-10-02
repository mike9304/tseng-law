'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderCounterCanvasNode } from '@/lib/builder/canvas/types';
import { DATA_WIDGETS_LEGACY_DEFAULTS, getDataWidgetsCopy, localizedDataWidgetText } from '../data-widgets-copy';
import styles from '../DataWidgetInspector.module.css';

import CounterRender from './Render';

function CounterInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const cNode = node as BuilderCounterCanvasNode;
  const c = cNode.content;
  const copy = getDataWidgetsCopy(locale);
  const title = localizedDataWidgetText(c.title, copy.counter.defaultTitle, DATA_WIDGETS_LEGACY_DEFAULTS.counterTitle);
  const suffix = localizedDataWidgetText(c.suffix, copy.counter.defaultSuffix, DATA_WIDGETS_LEGACY_DEFAULTS.counterSuffix);
  return (
    <div className={styles.root} data-builder-data-widget-inspector="counter">
      <label className={styles.field}>
        <span className={styles.label}>{copy.counter.inspector.title}</span>
        <input className={styles.control} type="text" value={title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.counter.inspector.target}</span>
        <input
          className={styles.control}
          type="number"
          value={c.target}
          disabled={disabled}
          onChange={(event) => onUpdate({ target: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.counter.inspector.prefixSuffix}</span>
        <div className={styles.inlineFields}>
          <input
            className={styles.control}
            type="text"
            placeholder={copy.counter.inspector.prefixPlaceholder}
            value={c.prefix}
            disabled={disabled}
            onChange={(event) => onUpdate({ prefix: event.target.value })}
          />
          <input
            className={styles.control}
            type="text"
            placeholder={copy.counter.inspector.suffixPlaceholder}
            value={suffix}
            disabled={disabled}
            onChange={(event) => onUpdate({ suffix: event.target.value })}
          />
        </div>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.counter.inspector.decimals}</span>
        <input
          className={styles.control}
          type="number"
          min={0}
          max={4}
          value={c.decimals}
          disabled={disabled}
          onChange={(event) => onUpdate({ decimals: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.counter.inspector.animationMs}</span>
        <input
          className={styles.control}
          type="number"
          min={200}
          max={20000}
          step={100}
          value={c.durationMs}
          disabled={disabled}
          onChange={(event) => onUpdate({ durationMs: Number(event.target.value) })}
        />
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'counter',
  displayName: '카운터',
  category: 'advanced',
  icon: '#',
  defaultContent: {
    title: DATA_WIDGETS_LEGACY_DEFAULTS.counterTitle,
    suffix: DATA_WIDGETS_LEGACY_DEFAULTS.counterSuffix,
    prefix: '',
    target: 1248,
    durationMs: 1500,
    decimals: 0,
  },
  defaultStyle: {},
  defaultRect: { width: 220, height: 120 },
  Render: CounterRender,
  Inspector: CounterInspector,
});
