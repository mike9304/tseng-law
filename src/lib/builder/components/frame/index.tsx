import type { CSSProperties } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderFrameCanvasNode } from '@/lib/builder/canvas/types';

function frameStyle(c: BuilderFrameCanvasNode['content']): CSSProperties {
  switch (c.style) {
    case 'double':
      return {
        border: `${c.width}px double ${c.color}`,
        borderRadius: c.radius,
      };
    case 'corner':
      return {
        border: `${c.width}px solid ${c.color}`,
        borderRadius: c.radius,
        boxShadow: `inset 0 0 0 4px rgba(255,255,255,0.4)`,
        outline: `2px solid ${c.color}`,
        outlineOffset: 6,
      };
    case 'photo':
      return {
        border: `${c.width}px solid ${c.color}`,
        borderRadius: c.radius,
        boxShadow: '0 18px 40px rgba(15,23,42,0.18)',
        background: '#ffffff',
        padding: 14,
      };
    case 'tag':
      return {
        border: `${c.width}px solid ${c.color}`,
        borderRadius: c.radius,
        background: `${c.color}11`,
      };
    case 'solid':
    default:
      return {
        border: `${c.width}px solid ${c.color}`,
        borderRadius: c.radius,
      };
  }
}

function FrameRender({
  node,
}: {
  node: BuilderFrameCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  return (
    <div
      className="builder-decorative-frame"
      data-builder-decorative-widget="frame"
      data-builder-frame-style={c.style}
      style={{ width: '100%', height: '100%', position: 'relative', boxSizing: 'border-box', ...frameStyle(c) }}
    >
      {c.label ? (
        <span
          className="builder-decorative-frame-label"
          style={{
            position: 'absolute',
            top: -10,
            left: 16,
            background: '#ffffff',
            padding: '0 8px',
            color: c.color,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {c.label}
        </span>
      ) : null}
    </div>
  );
}

function FrameInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const fNode = node as BuilderFrameCanvasNode;
  const c = fNode.content;
  return (
    <>
      <label>
        <span>스타일</span>
        <select
          value={c.style}
          disabled={disabled}
          onChange={(event) => onUpdate({ style: event.target.value as BuilderFrameCanvasNode['content']['style'] })}
        >
          <option value="solid">Solid</option>
          <option value="double">Double</option>
          <option value="corner">Corner accent</option>
          <option value="photo">Photo</option>
          <option value="tag">Tag</option>
        </select>
      </label>
      <label>
        <span>색</span>
        <input type="text" value={c.color} disabled={disabled} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label>
        <span>두께</span>
        <input
          type="number"
          min={1}
          max={40}
          value={c.width}
          disabled={disabled}
          onChange={(event) => onUpdate({ width: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>모서리 (px)</span>
        <input
          type="number"
          min={0}
          max={120}
          value={c.radius}
          disabled={disabled}
          onChange={(event) => onUpdate({ radius: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>라벨</span>
        <input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'frame',
  displayName: '프레임',
  category: 'advanced',
  icon: '▢',
  defaultContent: {
    style: 'solid' as const,
    color: '#0f172a',
    width: 4,
    radius: 12,
    label: '',
  },
  defaultStyle: {},
  defaultRect: { width: 220, height: 220 },
  Render: FrameRender,
  Inspector: FrameInspector,
});
