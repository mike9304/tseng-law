import Image from 'next/image';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';

export default function ImageElement({
  node,
}: {
  node: BuilderImageCanvasNode;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <Image
        src={node.content.src}
        alt={node.content.alt}
        fill
        draggable={false}
        sizes="(max-width: 1280px) 100vw, 360px"
        style={{
          objectFit: node.content.fit,
        }}
      />
    </div>
  );
}
