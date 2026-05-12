'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';
import { filtersToCSS, isDefaultFilters, type ImageFilters } from '@/lib/builder/canvas/filters';
import { ASPECT_RATIOS } from '@/lib/builder/canvas/crop';
import { sanitizeLinkValue } from '@/lib/builder/links';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor } from '@/lib/builder/site/theme';

const PLACEHOLDER_SRC = '/images/placeholder-image.svg';
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isPlaceholderOrEmpty(src: string): boolean {
  return !src || src === PLACEHOLDER_SRC;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => (
    !element.hidden &&
    !element.closest('[hidden]') &&
    element.getAttribute('aria-hidden') !== 'true' &&
    element.getClientRects().length > 0
  ));
}

function useMediaModalFocusTrap(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  initialFocusRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => {
      (initialFocusRef.current ?? getFocusableElements(dialog)[0] ?? dialog).focus({ preventScroll: true });
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
        return;
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    const handleFocusIn = (event: FocusEvent) => {
      if (dialog.contains(event.target as Node | null)) return;
      (initialFocusRef.current ?? getFocusableElements(dialog)[0] ?? dialog).focus({ preventScroll: true });
    };

    dialog.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      dialog.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('focusin', handleFocusIn);
      document.body.style.overflow = previousOverflow;
    };
  }, [dialogRef, initialFocusRef, onClose, open]);
}

/**
 * Parse a cropAspect string (e.g. "4:3") into a numeric ratio.
 * Returns null for empty / "Free" / unparseable values.
 */
function parseAspectRatio(cropAspect: string | undefined): number | null {
  if (!cropAspect || cropAspect === 'Free') return null;
  const preset = ASPECT_RATIOS.find((r) => r.label === cropAspect);
  if (preset && preset.value) return preset.value;
  const parts = cropAspect.split(':');
  if (parts.length === 2) {
    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);
    if (w > 0 && h > 0) return w / h;
  }
  return null;
}

function aspectToClipPath(
  containerWidth: number,
  containerHeight: number,
  targetRatio: number,
): string | undefined {
  const containerRatio = containerWidth / containerHeight;
  if (Math.abs(containerRatio - targetRatio) < 0.01) return undefined;

  if (containerRatio > targetRatio) {
    const visibleFraction = targetRatio / containerRatio;
    const insetPct = ((1 - visibleFraction) / 2) * 100;
    return `inset(0% ${insetPct.toFixed(1)}%)`;
  }
  const visibleFraction = containerRatio / targetRatio;
  const insetPct = ((1 - visibleFraction) / 2) * 100;
  return `inset(${insetPct.toFixed(1)}% 0%)`;
}

function InlineSvgArt({
  name,
  color,
}: {
  name: NonNullable<BuilderImageCanvasNode['content']['svg']>['name'];
  color: string;
}) {
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 120 120" role="img" aria-label="Shield icon">
        <path d="M60 10 102 26v30c0 27-17 45-42 54C35 101 18 83 18 56V26l42-16Z" fill={color} opacity="0.14" />
        <path d="M60 16 96 30v27c0 23-14 39-36 47-22-8-36-24-36-47V30l36-14Z" fill="none" stroke={color} strokeWidth="7" />
        <path d="m42 60 12 12 28-31" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
      </svg>
    );
  }
  if (name === 'building') {
    return (
      <svg viewBox="0 0 120 120" role="img" aria-label="Building icon">
        <rect x="26" y="22" width="68" height="78" rx="6" fill={color} opacity="0.12" />
        <path d="M28 100V26c0-3 2-5 5-5h54c3 0 5 2 5 5v74" fill="none" stroke={color} strokeWidth="7" />
        <path d="M43 42h10M67 42h10M43 60h10M67 60h10M43 78h10M67 78h10M18 100h84" stroke={color} strokeLinecap="round" strokeWidth="7" />
      </svg>
    );
  }
  if (name === 'spark') {
    return (
      <svg viewBox="0 0 120 120" role="img" aria-label="Spark icon">
        <path d="M60 15 71 48l34 12-34 12-11 33-12-33-33-12 33-12 12-33Z" fill={color} opacity="0.16" />
        <path d="M60 15 71 48l34 12-34 12-11 33-12-33-33-12 33-12 12-33Z" fill="none" stroke={color} strokeLinejoin="round" strokeWidth="7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="Scales icon">
      <path d="M60 15v84M32 35h56M60 35 36 72h48L60 35Z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
      <path d="M28 72c2 12 12 20 24 20s22-8 24-20M8 72h48M64 72h48M44 105h32" fill="none" stroke={color} strokeLinecap="round" strokeWidth="7" />
    </svg>
  );
}

export default function ImageElement({
  node,
  mode = 'edit',
  theme,
}: {
  node: BuilderImageCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  theme?: BuilderTheme;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [comparePosition, setComparePosition] = useState(node.content.compare?.position ?? 50);
  const lightboxTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxDialogRef = useRef<HTMLDivElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);
  const popupTriggerRef = useRef<HTMLButtonElement | null>(null);
  const popupDialogRef = useRef<HTMLDivElement | null>(null);
  const popupCloseRef = useRef<HTMLButtonElement | null>(null);
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
  const interactive = mode !== 'edit';
  const lightboxSlug = link?.href.startsWith('lightbox:')
    ? link.href.slice('lightbox:'.length).trim()
    : '';
  let clickAction = node.content.clickAction ?? 'none';
  if (lightboxSlug) clickAction = 'lightbox';
  if (clickAction === 'none' && link) clickAction = 'link';

  const svg = node.content.svg?.enabled ? node.content.svg : null;
  const compare = node.content.compare?.enabled ? node.content.compare : null;
  const imageAlt = node.content.alt || 'Image';
  const svgColor = svg
    ? (resolveThemeColor(svg.color, theme) ?? '#116dff')
    : '#116dff';

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    window.setTimeout(() => {
      if (lightboxTriggerRef.current?.isConnected) lightboxTriggerRef.current.focus({ preventScroll: true });
    }, 0);
  }, []);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
    window.setTimeout(() => {
      if (popupTriggerRef.current?.isConnected) popupTriggerRef.current.focus({ preventScroll: true });
    }, 0);
  }, []);

  useMediaModalFocusTrap(lightboxOpen, lightboxDialogRef, lightboxCloseRef, closeLightbox);
  useMediaModalFocusTrap(popupOpen, popupDialogRef, popupCloseRef, closePopup);

  const placeholder = isPlaceholderOrEmpty(node.content.src) && !svg && !compare;
  if (placeholder) {
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

  const baseImage = (
    <Image
      src={node.content.src}
      alt={node.content.alt}
      fill
      draggable={false}
      sizes="(max-width: 1280px) 100vw, 360px"
      unoptimized={Boolean(node.content.gif)}
      style={{
        objectFit: node.content.fit,
        objectPosition: node.content.focalPoint
          ? `${node.content.focalPoint.x}% ${node.content.focalPoint.y}%`
          : undefined,
        filter: cssFilter,
      }}
    />
  );

  const imageFrame = (
    <div
      className="builder-image-media-frame"
      data-builder-media-widget={compare ? 'before-after' : svg ? 'inline-svg' : node.content.gif ? 'gif' : 'image'}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        overflow: 'hidden',
        userSelect: 'none',
        clipPath: clipPath || undefined,
        background: svg ? 'rgba(248, 250, 252, 0.92)' : undefined,
      }}
    >
      {svg ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12%',
          }}
        >
          <InlineSvgArt name={svg.name} color={svgColor} />
        </div>
      ) : compare ? (
        <div className="builder-image-compare" data-builder-before-after="true">
          <Image
            src={compare.beforeSrc}
            alt={`${imageAlt} before`}
            fill
            draggable={false}
            sizes="(max-width: 1280px) 100vw, 360px"
            style={{ objectFit: node.content.fit }}
          />
          <div
            className="builder-image-compare-after"
            style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
          >
            <Image
              src={compare.afterSrc}
              alt={`${imageAlt} after`}
              fill
              draggable={false}
              sizes="(max-width: 1280px) 100vw, 360px"
              style={{ objectFit: node.content.fit }}
            />
          </div>
          <span
            className="builder-image-compare-handle"
            style={{ left: `${comparePosition}%` }}
            aria-hidden
          />
          {interactive ? (
            <input
              className="builder-image-compare-range"
              type="range"
              min={5}
              max={95}
              value={comparePosition}
              aria-label="Before after comparison"
              onChange={(event) => setComparePosition(Number(event.currentTarget.value))}
            />
          ) : null}
        </div>
      ) : (
        <>
          {baseImage}
          {node.content.hoverSrc ? (
            <Image
              src={node.content.hoverSrc}
              alt=""
              fill
              draggable={false}
              sizes="(max-width: 1280px) 100vw, 360px"
              className="builder-image-hover-swap"
              style={{
                objectFit: node.content.fit,
                objectPosition: node.content.focalPoint
                  ? `${node.content.focalPoint.x}% ${node.content.focalPoint.y}%`
                  : undefined,
              }}
            />
          ) : null}
        </>
      )}
      {(node.content.hotspots ?? []).map((hotspot, index) => (
        <a
          key={`${hotspot.label}-${index}`}
          href={interactive && hotspot.href ? hotspot.href : undefined}
          className="builder-image-hotspot"
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          aria-label={hotspot.label}
          tabIndex={interactive ? 0 : -1}
        >
          <span>{hotspot.label}</span>
        </a>
      ))}
      <div className="image-hover-overlay">
        이미지 변경
      </div>
    </div>
  );

  if (!interactive) return imageFrame;

  const modalImage = (
    <div className="builder-media-modal-image">
      {svg ? <InlineSvgArt name={svg.name} color={svgColor} /> : (
        <Image
          src={compare?.afterSrc ?? node.content.src}
          alt={node.content.alt}
          fill
          sizes="100vw"
          style={{ objectFit: 'contain' }}
          unoptimized={Boolean(node.content.gif)}
        />
      )}
    </div>
  );

  const lightboxModal = lightboxOpen ? (
    <div
      ref={lightboxDialogRef}
      className="builder-media-modal"
      role="dialog"
      aria-modal="true"
      aria-label={imageAlt}
      tabIndex={-1}
      onClick={closeLightbox}
    >
      <button ref={lightboxCloseRef} type="button" className="builder-media-modal-close" onClick={closeLightbox} aria-label="Close lightbox">
        ×
      </button>
      <div onClick={(event) => event.stopPropagation()} style={{ display: 'contents' }}>
        {modalImage}
      </div>
    </div>
  ) : null;

  const popupModal = popupOpen ? (
    <div
      ref={popupDialogRef}
      className="builder-media-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${imageAlt} popup`}
      tabIndex={-1}
      onClick={closePopup}
    >
      <div className="builder-media-popup-card" onClick={(event) => event.stopPropagation()}>
        <button ref={popupCloseRef} type="button" className="builder-media-popup-close" onClick={closePopup} aria-label="Close popup">
          ×
        </button>
        <strong>{node.content.alt || 'Image detail'}</strong>
        <span>{node.content.hotspots?.[0]?.label ?? '미디어 팝업 콘텐츠'}</span>
      </div>
    </div>
  ) : null;

  if (clickAction === 'link' && link) {
    return (
      <a
        href={link.href}
        target={link.target}
        rel={link.rel}
        title={link.title}
        aria-label={link.ariaLabel}
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

  if (clickAction === 'lightbox') {
    return (
      <>
        <button ref={lightboxTriggerRef} type="button" className="builder-media-click-frame" data-lightbox-target={lightboxSlug || node.id} onClick={() => setLightboxOpen(true)}>
          {imageFrame}
        </button>
        {lightboxModal}
      </>
    );
  }

  if (clickAction === 'popup') {
    return (
      <>
        <button ref={popupTriggerRef} type="button" className="builder-media-click-frame" onClick={() => setPopupOpen(true)}>
          {imageFrame}
        </button>
        {popupModal}
      </>
    );
  }

  return imageFrame;
}
