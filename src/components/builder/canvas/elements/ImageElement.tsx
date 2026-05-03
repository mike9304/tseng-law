import Image from 'next/image';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';
import { filtersToCSS, isDefaultFilters, type ImageFilters } from '@/lib/builder/canvas/filters';
import { ASPECT_RATIOS } from '@/lib/builder/canvas/crop';
import { sanitizeLinkValue } from '@/lib/builder/links';

const PLACEHOLDER_SRC = '/images/placeholder-image.svg';

function isPlaceholderOrEmpty(src: string): boolean {
  return !src || src === PLACEHOLDER_SRC;
}

/**
 * Parse a cropAspect string (e.g. "4:3") into a numeric ratio.
 * Returns null for empty / "Free" / unparseable values.
 */
function parseAspectRatio(cropAspect: string | undefined): number | null {
  if (!cropAspect || cropAspect === 'Free') return null;
  // Try matching from the known presets first
  const preset = ASPECT_RATIOS.find((r) => r.label === cropAspect);
  if (preset && preset.value) return preset.value;
  // Fallback: parse "W:H" format
  const parts = cropAspect.split(':');
  if (parts.length === 2) {
    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);
    if (w > 0 && h > 0) return w / h;
  }
  return null;
}

/**
 * Build a CSS clip-path inset() that crops the element to the given
 * aspect ratio, centered within the container rect.
 */
function aspectToClipPath(
  containerWidth: number,
  containerHeight: number,
  targetRatio: number,
): string | undefined {
  const containerRatio = containerWidth / containerHeight;
  if (Math.abs(containerRatio - targetRatio) < 0.01) return undefined; // already matches

  if (containerRatio > targetRatio) {
    // Container is wider than target — clip left/right
    const visibleFraction = targetRatio / containerRatio;
    const insetPct = ((1 - visibleFraction) / 2) * 100;
    return `inset(0% ${insetPct.toFixed(1)}%)`;
  }
  // Container is taller than target — clip top/bottom
  const visibleFraction = containerRatio / targetRatio;
  const insetPct = ((1 - visibleFraction) / 2) * 100;
  return `inset(${insetPct.toFixed(1)}% 0%)`;
}

export default function ImageElement({
  node,
  mode = 'edit',
}: {
  node: BuilderImageCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
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

  const filters = (node.content as { filters?: ImageFilters }).filters;
  const cssFilter =
    filters && !isDefaultFilters(filters)
      ? filtersToCSS(filters)
      : undefined;

  const targetRatio = parseAspectRatio(node.content.cropAspect);
  const clipPath = targetRatio
    ? aspectToClipPath(node.rect.width, node.rect.height, targetRatio)
    : undefined;

  const link = sanitizeLinkValue(node.content.link);
  const interactive = mode === 'published';
  const lightboxSlug = link?.href.startsWith('lightbox:')
    ? link.href.slice('lightbox:'.length).trim()
    : '';

  const imageFrame = (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        overflow: 'hidden',
        userSelect: 'none',
        clipPath: clipPath || undefined,
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
          objectPosition: node.content.focalPoint
            ? `${node.content.focalPoint.x}% ${node.content.focalPoint.y}%`
            : undefined,
          filter: cssFilter,
        }}
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

  if (!link || !interactive) return imageFrame;

  return (
    <a
      href={lightboxSlug ? '#' : link.href}
      target={lightboxSlug ? undefined : link.target}
      rel={lightboxSlug ? undefined : link.rel}
      title={link.title}
      aria-label={link.ariaLabel}
      data-lightbox-target={lightboxSlug || undefined}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      {imageFrame}
    </a>
  );
}
