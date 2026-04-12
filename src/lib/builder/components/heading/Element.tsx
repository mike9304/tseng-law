import type { BuilderHeadingCanvasNode } from '@/lib/builder/canvas/types';
import { fontFamilyCSS } from '@/lib/builder/canvas/fonts';

const LEVEL_TO_SIZE = {
  1: 48,
  2: 40,
  3: 32,
  4: 28,
  5: 24,
  6: 20,
} as const;

export default function HeadingElement({
  node,
}: {
  node: BuilderHeadingCanvasNode;
}) {
  const level = Math.max(1, Math.min(6, node.content.level)) as keyof typeof LEVEL_TO_SIZE;
  const Tag = `h${level}` as const;
  const fontFamily = node.content.fontFamily
    ? fontFamilyCSS(node.content.fontFamily)
    : 'system-ui, -apple-system, sans-serif';

  return (
    <Tag
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        color: node.content.color,
        fontSize: `${LEVEL_TO_SIZE[level]}px`,
        fontFamily,
        fontWeight: 800,
        textAlign: node.content.align,
        lineHeight: 1.05,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {node.content.text}
    </Tag>
  );
}
