'use client';

import { useEffect, useState } from 'react';
import type { BuilderCounterCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { DATA_WIDGETS_LEGACY_DEFAULTS, getDataWidgetsCopy, localizedDataWidgetText } from '../data-widgets-copy';

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

export default CounterRender;
