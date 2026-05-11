import { useEffect, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderBackToTopCanvasNode } from '@/lib/builder/canvas/types';

const ICON_GLYPH: Record<BuilderBackToTopCanvasNode['content']['icon'], string> = {
  'arrow-up': '↑',
  'chevron-up': '⌃',
  'rocket': '↟',
};

function BackToTopRender({
  node,
  mode = 'edit',
}: {
  node: BuilderBackToTopCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const [visible, setVisible] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit') {
      setVisible(true);
      return undefined;
    }
    const handler = () => {
      setVisible(window.scrollY >= c.showAfterPx);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [c.showAfterPx, mode]);

  function onClick() {
    if (mode === 'edit') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      type="button"
      className="builder-interactive-back-to-top"
      data-builder-interactive-widget="back-to-top"
      data-builder-back-to-top-placement={c.placement}
      data-builder-back-to-top-variant={c.variant}
      data-builder-back-to-top-visible={visible ? 'true' : 'false'}
      aria-label={c.label}
      onClick={onClick}
    >
      <span aria-hidden="true">{ICON_GLYPH[c.icon]}</span>
      <span className="builder-interactive-back-to-top-label">{c.label}</span>
    </button>
  );
}

function BackToTopInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const btNode = node as BuilderBackToTopCanvasNode;
  const c = btNode.content;
  return (
    <>
      <label>
        <span>라벨</span>
        <input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>표시 시작 (px)</span>
        <input
          type="number"
          min={0}
          max={4000}
          value={c.showAfterPx}
          disabled={disabled}
          onChange={(event) => onUpdate({ showAfterPx: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>아이콘</span>
        <select
          value={c.icon}
          disabled={disabled}
          onChange={(event) => onUpdate({ icon: event.target.value as BuilderBackToTopCanvasNode['content']['icon'] })}
        >
          <option value="arrow-up">화살표</option>
          <option value="chevron-up">셰브론</option>
          <option value="rocket">로켓</option>
        </select>
      </label>
      <label>
        <span>위치</span>
        <select
          value={c.placement}
          disabled={disabled}
          onChange={(event) => onUpdate({ placement: event.target.value as BuilderBackToTopCanvasNode['content']['placement'] })}
        >
          <option value="bottom-right">오른쪽 아래</option>
          <option value="bottom-left">왼쪽 아래</option>
          <option value="bottom-center">아래 중앙</option>
        </select>
      </label>
      <label>
        <span>모양</span>
        <select
          value={c.variant}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderBackToTopCanvasNode['content']['variant'] })}
        >
          <option value="circle">Circle</option>
          <option value="pill">Pill</option>
          <option value="square">Square</option>
        </select>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'back-to-top',
  displayName: '맨 위로',
  category: 'advanced',
  icon: '↑',
  defaultContent: {
    label: '맨 위로',
    showAfterPx: 400,
    icon: 'arrow-up' as const,
    placement: 'bottom-right' as const,
    variant: 'circle' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 64, height: 64 },
  Render: BackToTopRender,
  Inspector: BackToTopInspector,
});
