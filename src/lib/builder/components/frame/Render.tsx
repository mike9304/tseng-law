import type { CSSProperties } from 'react';
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

export default FrameRender;
