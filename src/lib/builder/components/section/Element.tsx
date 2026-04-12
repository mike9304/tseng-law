import type { BuilderSectionCanvasNode } from '@/lib/builder/canvas/types';

export default function SectionElement({
  node,
}: {
  node: BuilderSectionCanvasNode;
}) {
  const guideWidth = Math.min(node.rect.width - 48, node.content.maxWidth);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: `${node.content.padding}px`,
        borderRadius: `${node.content.borderRadius}px`,
        border: `${node.content.borderWidth}px solid ${node.content.borderColor}`,
        background: node.content.background,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: `${node.content.padding}px`,
          borderRadius: `${Math.max(8, node.content.borderRadius - 6)}px`,
          border: '1px dashed rgba(71, 85, 105, 0.45)',
          width: `${Math.max(240, guideWidth)}px`,
          maxWidth: `calc(100% - ${node.content.padding * 2}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          color: '#334155',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {node.content.label}
      </div>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '12px',
          color: '#64748b',
          fontSize: '13px',
        }}
      >
        max width {node.content.maxWidth}px
      </div>
    </div>
  );
}
