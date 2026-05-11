import { useEffect, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderCounterCanvasNode } from '@/lib/builder/canvas/types';

function CounterRender({
  node,
  mode = 'edit',
}: {
  node: BuilderCounterCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
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
      {c.title ? <strong>{c.title}</strong> : null}
      <span className="builder-datadisplay-counter-value">
        {c.prefix}{formatted}{c.suffix}
      </span>
    </div>
  );
}

function CounterInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const cNode = node as BuilderCounterCanvasNode;
  const c = cNode.content;
  return (
    <>
      <label>
        <span>제목</span>
        <input type="text" value={c.title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label>
        <span>목표값</span>
        <input
          type="number"
          value={c.target}
          disabled={disabled}
          onChange={(event) => onUpdate({ target: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>접두/접미</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            placeholder="prefix"
            value={c.prefix}
            disabled={disabled}
            onChange={(event) => onUpdate({ prefix: event.target.value })}
          />
          <input
            type="text"
            placeholder="suffix"
            value={c.suffix}
            disabled={disabled}
            onChange={(event) => onUpdate({ suffix: event.target.value })}
          />
        </div>
      </label>
      <label>
        <span>소수점 자릿수</span>
        <input
          type="number"
          min={0}
          max={4}
          value={c.decimals}
          disabled={disabled}
          onChange={(event) => onUpdate({ decimals: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>애니메이션 (ms)</span>
        <input
          type="number"
          min={200}
          max={20000}
          step={100}
          value={c.durationMs}
          disabled={disabled}
          onChange={(event) => onUpdate({ durationMs: Number(event.target.value) })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'counter',
  displayName: '카운터',
  category: 'advanced',
  icon: '#',
  defaultContent: {
    title: '누적 자문',
    suffix: '+ 건',
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
