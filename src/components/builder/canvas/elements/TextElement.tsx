import type { BuilderTextCanvasNode } from '@/lib/builder/canvas/types';

export default function TextElement({
  node,
}: {
  node: BuilderTextCanvasNode;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        color: node.content.color,
        fontSize: `${node.content.fontSize}px`,
        fontWeight:
          node.content.fontWeight === 'bold'
            ? 700
            : node.content.fontWeight === 'medium'
              ? 600
              : 400,
        textAlign: node.content.align,
        lineHeight: node.content.lineHeight ?? 1.25,
        letterSpacing: `${node.content.letterSpacing ?? 0}px`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {node.content.text}
    </div>
  );
}

