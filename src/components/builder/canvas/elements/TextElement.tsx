import type { BuilderTextCanvasNode } from '@/lib/builder/canvas/types';
import { fontFamilyCSS } from '@/lib/builder/canvas/fonts';

export default function TextElement({
  node,
}: {
  node: BuilderTextCanvasNode;
}) {
  const fontFamily = node.content.fontFamily
    ? fontFamilyCSS(node.content.fontFamily)
    : 'system-ui, -apple-system, sans-serif';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        color: node.content.color,
        fontSize: `${node.content.fontSize}px`,
        fontFamily,
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
        alignItems: 'flex-start',
        overflow: 'hidden',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }}
    >
      {node.content.text}
    </div>
  );
}

