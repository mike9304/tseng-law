import Image from 'next/image';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';

const PLACEHOLDER_SRC = '/images/placeholder-image.svg';

function isPlaceholderOrEmpty(src: string): boolean {
  return !src || src === PLACEHOLDER_SRC;
}

export default function ImageElement({
  node,
}: {
  node: BuilderImageCanvasNode;
}) {
  if (isPlaceholderOrEmpty(node.content.src)) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          overflow: 'hidden',
          userSelect: 'none',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: '#f1f5f9',
          border: '2px dashed #cbd5e1',
          color: '#64748b',
          fontSize: 13,
          fontWeight: 500,
        }}
        aria-label={node.content.alt || 'Image placeholder'}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span>Click to add image</span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <Image
        src={node.content.src}
        alt={node.content.alt}
        fill
        draggable={false}
        sizes="(max-width: 1280px) 100vw, 360px"
        style={{ objectFit: node.content.fit }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: 600,
          opacity: 0,
          transition: 'opacity 200ms ease',
          pointerEvents: 'none',
        }}
        className="image-hover-overlay"
      >
        이미지 변경
      </div>
      <style>{`.image-hover-overlay { opacity: 0 !important; } *:hover > .image-hover-overlay { opacity: 1 !important; }`}</style>
    </div>
  );
}
