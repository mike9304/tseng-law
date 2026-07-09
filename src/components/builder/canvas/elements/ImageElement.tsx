'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';
import { filtersToCSS, isDefaultFilters, type ImageFilters } from '@/lib/builder/canvas/filters';
import { ASPECT_RATIOS } from '@/lib/builder/canvas/crop';
import { sanitizeLinkValue } from '@/lib/builder/links';
import { getImageEditCopy } from '@/lib/builder/components/image/image-edit-copy';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor } from '@/lib/builder/site/theme';
import { normalizeLocale, type Locale } from '@/lib/locales';

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
  label,
}: {
  name: NonNullable<BuilderImageCanvasNode['content']['svg']>['name'];
  color: string;
  label: string;
}) {
  if (name === 'pricing-consultation') {
    return (
      <svg viewBox="0 0 32 32" role="img" aria-label={label}>
        <path d="M8.5 8.5h9a5.5 5.5 0 0 1 0 11h-2.8l-3.8 3v-3H8.5A4.5 4.5 0 0 1 4 15V13a4.5 4.5 0 0 1 4.5-4.5Z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M18 11.5h5.5A4.5 4.5 0 0 1 28 16v1.2a4.3 4.3 0 0 1-4.3 4.3h-1.6v3l-3.5-3" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M10.5 13h5M10.5 16h3.4" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <circle cx="22.3" cy="11.1" r="1.2" fill={color} stroke="none" opacity="0.9" />
      </svg>
    );
  }
  if (name === 'pricing-litigation') {
    return (
      <svg viewBox="0 0 32 32" role="img" aria-label={label}>
        <path d="M16 6v18" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M8 11.5h16" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M11 11.5 8.3 17a2.8 2.8 0 0 0 2.5 1.6h.4a2.8 2.8 0 0 0 2.5-1.6l-2.7-5.5Z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M21 11.5 18.3 17a2.8 2.8 0 0 0 2.5 1.6h.4a2.8 2.8 0 0 0 2.5-1.6L21 11.5Z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M11 23.5h10" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M13.2 6.8 16 4l2.8 2.8" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    );
  }
  if (name === 'pricing-company') {
    return (
      <svg viewBox="0 0 32 32" role="img" aria-label={label}>
        <path d="M6.5 25.5V11.8L15.5 8v17.5" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M15.5 25.5V13.8L25.5 10v15.5" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M10.3 15.5h1.8M10.3 19.2h1.8M19.5 15.5h1.8M19.5 19.2h1.8" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M4.5 25.5h23" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M21.5 6.5h4.2M23.6 4.4v4.2" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    );
  }
  if (name === 'pricing-retainer') {
    return (
      <svg viewBox="0 0 32 32" role="img" aria-label={label}>
        <rect x="8" y="6.5" width="16" height="20" rx="3.4" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M12 6.5h8v3.2h-8z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M12.2 14.2h7.6M12.2 18h7.6M12.2 21.8h4.4" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="m21.7 20.7 1.6 1.6 3.2-3.6" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <circle cx="23.4" cy="9.6" r="1.2" fill={color} stroke="none" opacity="0.9" />
      </svg>
    );
  }
  if (name === 'service-0') {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label={label}>
        <path d="M4 18h16" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M6 18V8h4v10" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M14 18V5h4v13" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M4 12l4-4 4 3 8-6" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === 'service-1') {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label={label}>
        <path d="M6 5h10l3 3v11H6z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M16 5v3h3" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M9 13h7M9 17h5" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === 'service-2') {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label={label}>
        <path d="M3 12h18" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M7 9l-4 3 4 3" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M17 9l4 3-4 3" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M10 7h4M10 17h4" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === 'service-3' || name === 'service-4') {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label={label}>
        <path d="M12 3l7 3v6c0 4.5-2.6 7.6-7 9-4.4-1.4-7-4.5-7-9V6l7-3z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M9 12l2 2 4-4" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === 'service-5') {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label={label}>
        <path d="M5 19V7l7-3 7 3v12" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M9 12h6M9 15h6" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 120 120" role="img" aria-label={label}>
        <path d="M60 10 102 26v30c0 27-17 45-42 54C35 101 18 83 18 56V26l42-16Z" fill={color} opacity="0.14" />
        <path d="M60 16 96 30v27c0 23-14 39-36 47-22-8-36-24-36-47V30l36-14Z" fill="none" stroke={color} strokeWidth="7" />
        <path d="m42 60 12 12 28-31" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
      </svg>
    );
  }
  if (name === 'building') {
    return (
      <svg viewBox="0 0 120 120" role="img" aria-label={label}>
        <rect x="26" y="22" width="68" height="78" rx="6" fill={color} opacity="0.12" />
        <path d="M28 100V26c0-3 2-5 5-5h54c3 0 5 2 5 5v74" fill="none" stroke={color} strokeWidth="7" />
        <path d="M43 42h10M67 42h10M43 60h10M67 60h10M43 78h10M67 78h10M18 100h84" stroke={color} strokeLinecap="round" strokeWidth="7" />
      </svg>
    );
  }
  if (name === 'spark') {
    return (
      <svg viewBox="0 0 120 120" role="img" aria-label={label}>
        <path d="M60 15 71 48l34 12-34 12-11 33-12-33-33-12 33-12 12-33Z" fill={color} opacity="0.16" />
        <path d="M60 15 71 48l34 12-34 12-11 33-12-33-33-12 33-12 12-33Z" fill="none" stroke={color} strokeLinejoin="round" strokeWidth="7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={label}>
      <path d="M60 15v84M32 35h56M60 35 36 72h48L60 35Z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
      <path d="M28 72c2 12 12 20 24 20s22-8 24-20M8 72h48M64 72h48M44 105h32" fill="none" stroke={color} strokeLinecap="round" strokeWidth="7" />
    </svg>
  );
}

export default function ImageElement({
  node,
  mode = 'edit',
  theme,
  locale = 'ko',
}: {
  node: BuilderImageCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  theme?: BuilderTheme;
  locale?: Locale;
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

  const copy = getImageEditCopy(normalizeLocale(locale)).runtime;
  const svg = node.content.svg?.enabled ? node.content.svg : null;
  const isServiceSvg = svg ? svg.name.startsWith('service-') : false;
  const compare = node.content.compare?.enabled ? node.content.compare : null;
  const imageAlt = node.content.alt || copy.fallbackAlt;
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
    if (mode === 'published') {
      return (
        <div
          data-builder-image-empty="true"
          aria-hidden="true"
          style={{ width: '100%', height: '100%' }}
        />
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
        aria-label={node.content.alt || copy.imagePlaceholder}
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
        <span>{copy.clickToAddImage}</span>
      </div>
    );
  }

  const isHeroBackground =
    /(^|-)hero(-|$)/i.test(node.id) && /(media|background|bg|image)/i.test(node.id);
  const imageObjectPosition = node.content.focalPoint
    ? `${node.content.focalPoint.x}% ${node.content.focalPoint.y}%`
    : undefined;
  const imageSizes = isHeroBackground
    ? '100vw'
    : '(max-width: 1280px) 100vw, 360px';
  const usesImageFallbackBackground =
    (mode !== 'published' || isHeroBackground) && !svg && !compare && !node.content.gif;
  const imageFallbackBackground = usesImageFallbackBackground
    ? {
        backgroundImage: `url(${JSON.stringify(node.content.src)})`,
        backgroundPosition: imageObjectPosition ?? 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: node.content.fit === 'contain' ? 'contain' : 'cover',
      }
    : null;

  const baseImage = (
    <Image
      src={node.content.src}
      alt={node.content.alt}
      fill
      draggable={false}
      sizes={imageSizes}
      unoptimized={Boolean(node.content.gif)}
      priority={isHeroBackground}
      style={{
        objectFit: node.content.fit,
        objectPosition: imageObjectPosition,
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
        background: svg && !isServiceSvg ? 'rgba(248, 250, 252, 0.92)' : undefined,
        ...imageFallbackBackground,
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
            padding: isServiceSvg ? 0 : '12%',
          }}
        >
          <InlineSvgArt name={svg.name} color={svgColor} label={copy.svgIconLabels[svg.name]} />
        </div>
      ) : compare ? (
        <div className="builder-image-compare" data-builder-before-after="true">
          <Image
            src={compare.beforeSrc}
            alt={copy.beforeImageAlt(imageAlt)}
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
              alt={copy.afterImageAlt(imageAlt)}
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
              aria-label={copy.beforeAfterComparison}
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
              sizes={imageSizes}
              className="builder-image-hover-swap"
              style={{
                objectFit: node.content.fit,
                objectPosition: imageObjectPosition,
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
      {mode !== 'published' ? (
        <div className="image-hover-overlay">
          {copy.changeImageOverlay}
        </div>
      ) : null}
    </div>
  );

  if (!interactive) return imageFrame;

  const modalImage = (
    <div className="builder-media-modal-image">
      {svg ? <InlineSvgArt name={svg.name} color={svgColor} label={copy.svgIconLabels[svg.name]} /> : (
        <Image
          src={compare?.afterSrc ?? node.content.src}
          alt={compare ? copy.afterImageAlt(imageAlt) : imageAlt}
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
      <button ref={lightboxCloseRef} type="button" className="builder-media-modal-close" onClick={closeLightbox} aria-label={copy.closeLightbox}>
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
      aria-label={copy.popupDialogLabel(imageAlt)}
      tabIndex={-1}
      onClick={closePopup}
    >
      <div className="builder-media-popup-card" onClick={(event) => event.stopPropagation()}>
        <button ref={popupCloseRef} type="button" className="builder-media-popup-close" onClick={closePopup} aria-label={copy.closePopup}>
          ×
        </button>
        <strong>{node.content.alt || copy.imageDetailFallback}</strong>
        <span>{node.content.hotspots?.[0]?.label ?? copy.popupContentFallback}</span>
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
        {lightboxModal && typeof document !== 'undefined' ? createPortal(lightboxModal, document.body) : lightboxModal}
      </>
    );
  }

  if (clickAction === 'popup') {
    return (
      <>
        <button ref={popupTriggerRef} type="button" className="builder-media-click-frame" onClick={() => setPopupOpen(true)}>
          {imageFrame}
        </button>
        {popupModal && typeof document !== 'undefined' ? createPortal(popupModal, document.body) : popupModal}
      </>
    );
  }

  return imageFrame;
}
