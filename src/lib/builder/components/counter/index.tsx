'use client';

import { useEffect, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderCounterCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  DATA_WIDGETS_LEGACY_DEFAULTS,
  getDataWidgetsCopy,
  localizedDataWidgetText,
} from '../data-widgets-copy';
import styles from '../DataWidgetInspector.module.css';

function CounterRender({
  node,
  locale = 'ko',
  mode = 'edit',
}: {
  node: BuilderCounterCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const copy = getDataWidgetsCopy(locale);
  const title = localizedDataWidgetText(c.title, copy.counter.defaultTitle, DATA_WIDGETS_LEGACY_DEFAULTS.counterTitle);
  const suffix = localizedDataWidgetText(c.suffix, copy.counter.defaultSuffix, DATA_WIDGETS_LEGACY_DEFAULTS.counterSuffix);
  const [value, setValue] = useState<number>(mode === 'edit' ? c.target : 0);

  useEffect(() => {
    if (mode === 'edit') {
      setValue(c.target);
      return undefined;
    }
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / c.durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(eased * c.target);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [c.target, c.durationMs, mode]);

  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals,
  });

  return (
    <div className="builder-datadisplay-counter" data-builder-datadisplay-widget="counter">
      {title ? <strong>{title}</strong> : null}
      <span className="builder-datadisplay-counter-value">
        {c.prefix}{formatted}{suffix}
      </span>
    </div>
  );
}

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
