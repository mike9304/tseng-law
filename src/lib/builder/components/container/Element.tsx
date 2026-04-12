import type { BuilderContainerCanvasNode } from '@/lib/builder/canvas/types';

export default function ContainerElement({
  node,
}: {
  node: BuilderContainerCanvasNode;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: `${node.content.padding}px`,
        borderRadius: `${node.content.borderRadius}px`,
        border: `${node.content.borderWidth}px ${node.content.borderStyle} ${node.content.borderColor}`,
        background: node.content.background,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        color: '#475569',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    >
      {node.content.label}
    </div>
  );
}
