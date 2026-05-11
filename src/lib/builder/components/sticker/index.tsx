import type { CSSProperties } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderStickerCanvasNode } from '@/lib/builder/canvas/types';

function StickerRender({
  node,
}: {
  node: BuilderStickerCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const baseStyle: CSSProperties = {
    background: c.background,
    color: c.color,
    transform: `rotate(${c.rotation}deg)`,
  };

  return (
    <div
      className="builder-decorative-sticker"
      data-builder-decorative-widget="sticker"
      data-builder-sticker-variant={c.variant}
      style={baseStyle}
    >
      <span aria-hidden="true">{c.emoji}</span>
      {c.label ? <strong>{c.label}</strong> : null}
    </div>
  );
}

function StickerInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sNode = node as BuilderStickerCanvasNode;
  const c = sNode.content;
  return (
    <>
      <label>
        <span>이모지/심볼</span>
        <input type="text" value={c.emoji} disabled={disabled} onChange={(event) => onUpdate({ emoji: event.target.value })} />
      </label>
      <label>
        <span>라벨</span>
        <input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>배경</span>
        <input type="text" value={c.background} disabled={disabled} onChange={(event) => onUpdate({ background: event.target.value })} />
      </label>
      <label>
        <span>글자색</span>
        <input type="text" value={c.color} disabled={disabled} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label>
        <span>회전 (deg, -45~45)</span>
        <input
          type="number"
          min={-45}
          max={45}
          value={c.rotation}
          disabled={disabled}
          onChange={(event) => onUpdate({ rotation: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>스타일</span>
        <select
          value={c.variant}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderStickerCanvasNode['content']['variant'] })}
        >
          <option value="badge">Badge</option>
          <option value="pill">Pill</option>
          <option value="banner">Banner</option>
        </select>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'sticker',
  displayName: '스티커',
  category: 'advanced',
  icon: '⭐',
  defaultContent: {
    emoji: '⭐',
    label: '추천',
    background: '#fde68a',
    color: '#92400e',
    rotation: -8,
    variant: 'badge' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 120, height: 60 },
  Render: StickerRender,
  Inspector: StickerInspector,
});
