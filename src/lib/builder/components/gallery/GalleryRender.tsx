'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { createPortal } from 'react-dom';
import type { BuilderGalleryCanvasNode } from '@/lib/builder/canvas/types';
import { usePublishedOverlayFocus } from '@/components/builder/published/overlayFocus';

type GalleryImage = BuilderGalleryCanvasNode['content']['images'][number];

const FALLBACK_IMAGES: GalleryImage[] = [
  {
    src: '/images/header-skyline-buildings.webp',
    alt: 'Gallery skyline',
    caption: '상담 공간',
    tags: ['office'],
  },
  {
    src: '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
    alt: 'Gallery legal article',
    caption: '기업 법무',
    tags: ['service'],
  },
  {
    src: '/images/blog/010-taiwan-gym-injury-lawsuit/featured-01.jpg',
    alt: 'Gallery litigation article',
    caption: '분쟁 해결',
    tags: ['case'],
  },
  {
    src: '/images/team/son-jungmin.jpg',
    alt: 'Gallery attorney',
    caption: '한국어 상담',
    tags: ['team'],
  },
];

function uniqueTags(images: GalleryImage[]): string[] {
  const tags = new Set<string>();
  for (const image of images) {
    for (const tag of image.tags ?? []) {
      if (tag.trim()) tags.add(tag.trim());
    }
  }
  return [...tags];
}

function GalleryTile({
  image,
  index,
  showCaptions,
  captionMode,
  onClick,
  variant = 'grid',
}: {
  image: GalleryImage;
  index: number;
  showCaptions: boolean;
  captionMode: BuilderGalleryCanvasNode['content']['captionMode'];
  onClick?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  variant?: 'grid' | 'masonry' | 'pro';
}) {
  const caption = image.caption || image.alt;
  const ratio = variant === 'masonry'
    ? ['4 / 5', '1 / 1', '5 / 4', '3 / 4'][index % 4]
    : variant === 'pro'
      ? ['1.25 / 1', '1 / 1.35', '1 / 1', '1.6 / 1'][index % 4]
      : '4 / 3';

  return (
    <button
      type="button"
      className={`builder-gallery-tile builder-gallery-tile-${variant}`}
      data-builder-gallery-item="true"
      onClick={onClick}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={image.src}
        alt={image.alt || ''}
        fill
        draggable={false}
        sizes="(max-width: 1280px) 50vw, 320px"
        style={{ objectFit: 'cover' }}
      />
      {showCaptions && captionMode === 'overlay' && caption ? (
        <span className="builder-gallery-caption-overlay" data-builder-gallery-caption-overlay="true">
          {caption}
        </span>
      ) : null}
      {showCaptions && captionMode === 'below' && caption ? (
        <span className="builder-gallery-caption-below">
          {caption}
        </span>
      ) : null}
    </button>
  );
}

export default function GalleryRender({
  node,
  mode,
}: {
  node: BuilderGalleryCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const {
    images = [],
    layout = 'grid',
    columns = 3,
    gap = 8,
    showCaptions = false,
    captionMode = 'below',
    activeFilter = 'all',
    autoplay = false,
    interval = 4000,
    thumbnailPosition = 'bottom',
    proStyle = 'clean',
  } = node.content;
  const normalizedImages = images.length ? images : FALLBACK_IMAGES;
  const tags = useMemo(() => uniqueTags(normalizedImages), [normalizedImages]);
  const filteredImages = activeFilter === 'all'
    ? normalizedImages
    : normalizedImages.filter((image) => (image.tags ?? []).includes(activeFilter));
  const displayImages = filteredImages.length ? filteredImages : normalizedImages;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const interactive = mode === 'published';

  useEffect(() => {
    setActiveIndex(0);
  }, [layout, activeFilter, displayImages.length]);

  useEffect(() => {
    if (!autoplay || (layout !== 'slider' && layout !== 'slideshow') || displayImages.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % displayImages.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoplay, displayImages.length, interval, layout]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % displayImages.length : null));
  }, [displayImages.length]);
  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + displayImages.length) % displayImages.length : null));
  }, [displayImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      else if (event.key === 'ArrowRight') goNext();
      else if (event.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeLightbox, goNext, goPrev, lightboxIndex]);

  usePublishedOverlayFocus({
    open: lightboxIndex !== null,
    overlayRef: lightboxRef,
    initialFocusRef: closeButtonRef,
    openerRef,
  });

  const openLightbox = (index: number, event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    openerRef.current = event.currentTarget;
    setLightboxIndex(index);
  };

  const activeImage = displayImages[Math.min(activeIndex, displayImages.length - 1)] ?? displayImages[0];

  const filters = tags.length ? (
    <div className="builder-gallery-filterbar" data-builder-gallery-filterbar="true">
      {['all', ...tags].map((tag) => (
        <span
          key={tag}
          className="builder-gallery-filter-pill"
          data-builder-gallery-filter={tag}
          data-active={activeFilter === tag}
        >
          {tag === 'all' ? 'All' : tag}
        </span>
      ))}
    </div>
  ) : null;

  let content: JSX.Element;
  if (layout === 'masonry') {
    content = (
      <div
        className="builder-gallery-masonry"
        style={{ columnCount: columns, columnGap: gap }}
      >
        {displayImages.map((image, index) => (
          <GalleryTile
            key={`${image.src}-${index}`}
            image={image}
            index={index}
            showCaptions={showCaptions}
            captionMode={captionMode}
            onClick={(event) => openLightbox(index, event)}
            variant="masonry"
          />
        ))}
      </div>
    );
  } else if (layout === 'slider' || layout === 'slideshow') {
    content = (
      <div className={`builder-gallery-slider builder-gallery-slider-${layout}`} data-builder-gallery-slide="true">
        {activeImage ? (
          <div className="builder-gallery-slide-frame">
            <Image
              src={activeImage.src}
              alt={activeImage.alt || ''}
              fill
              draggable={false}
              sizes="(max-width: 1280px) 100vw, 760px"
              style={{ objectFit: layout === 'slideshow' ? 'cover' : 'contain' }}
            />
            {showCaptions && (activeImage.caption || activeImage.alt) ? (
              <span className="builder-gallery-caption-overlay" data-builder-gallery-caption-overlay="true">
                {activeImage.caption || activeImage.alt}
              </span>
            ) : null}
          </div>
        ) : null}
        {displayImages.length > 1 ? (
          <>
            <button
              type="button"
              className="builder-gallery-arrow builder-gallery-arrow-prev"
              aria-label="Previous gallery image"
              onClick={() => setActiveIndex((current) => (current - 1 + displayImages.length) % displayImages.length)}
            >
              ‹
            </button>
            <button
              type="button"
              className="builder-gallery-arrow builder-gallery-arrow-next"
              aria-label="Next gallery image"
              onClick={() => setActiveIndex((current) => (current + 1) % displayImages.length)}
            >
              ›
            </button>
            <div className="builder-gallery-dots">
              {displayImages.map((image, index) => (
                <button
                  key={`${image.src}-dot-${index}`}
                  type="button"
                  aria-label={`Go to gallery image ${index + 1}`}
                  data-active={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    );
  } else if (layout === 'thumbnail') {
    content = (
      <div
        className="builder-gallery-thumbnail"
        data-position={thumbnailPosition}
        data-builder-gallery-thumbnail="true"
      >
        <div className="builder-gallery-thumbnail-main">
          {activeImage ? (
            <Image
              src={activeImage.src}
              alt={activeImage.alt || ''}
              fill
              draggable={false}
              sizes="(max-width: 1280px) 100vw, 720px"
              style={{ objectFit: 'cover' }}
            />
          ) : null}
          {showCaptions && activeImage && (activeImage.caption || activeImage.alt) ? (
            <span className="builder-gallery-caption-overlay" data-builder-gallery-caption-overlay="true">
              {activeImage.caption || activeImage.alt}
            </span>
          ) : null}
        </div>
        <div className="builder-gallery-thumbnail-strip">
          {displayImages.map((image, index) => (
            <button
              key={`${image.src}-thumb-${index}`}
              type="button"
              data-active={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Select thumbnail ${index + 1}`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                draggable={false}
                sizes="96px"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      </div>
    );
  } else {
    content = (
      <div
        className={layout === 'pro' ? `builder-gallery-pro builder-gallery-pro-${proStyle}` : 'builder-gallery-grid'}
        data-builder-gallery-pro={layout === 'pro' ? proStyle : undefined}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap,
        }}
      >
        {displayImages.map((image, index) => (
          <GalleryTile
            key={`${image.src}-${index}`}
            image={image}
            index={index}
            showCaptions={showCaptions}
            captionMode={captionMode}
            onClick={(event) => openLightbox(index, event)}
            variant={layout === 'pro' ? 'pro' : 'grid'}
          />
        ))}
      </div>
    );
  }

  const lightboxImage = lightboxIndex !== null ? displayImages[lightboxIndex] : null;
  const lightbox = lightboxIndex !== null && lightboxImage ? (
    <div
      ref={lightboxRef}
      className="builder-gallery-lightbox"
      onClick={closeLightbox}
      role="dialog"
      aria-modal="true"
      aria-label={lightboxImage.alt || lightboxImage.caption || 'Gallery image'}
      tabIndex={-1}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="builder-gallery-lightbox-close"
        onClick={closeLightbox}
        aria-label="Close"
      >
        ×
      </button>
      {displayImages.length > 1 ? (
        <button type="button" className="builder-gallery-lightbox-prev" onClick={(event) => { event.stopPropagation(); goPrev(); }} aria-label="Previous">
          ‹
        </button>
      ) : null}
      <div className="builder-gallery-lightbox-image" onClick={(event) => event.stopPropagation()}>
        <Image
          src={lightboxImage.src}
          alt={lightboxImage.alt || ''}
          fill
          sizes="100vw"
          style={{ objectFit: 'contain' }}
        />
      </div>
      {displayImages.length > 1 ? (
        <button type="button" className="builder-gallery-lightbox-next" onClick={(event) => { event.stopPropagation(); goNext(); }} aria-label="Next">
          ›
        </button>
      ) : null}
      <div className="builder-gallery-lightbox-counter">
        {lightboxIndex + 1} / {displayImages.length}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        className="builder-gallery-root"
        data-builder-gallery-layout={layout}
        data-builder-gallery-caption-mode={captionMode}
        style={{ gap }}
      >
        {filters}
        {content}
      </div>

      {mode === 'published' && lightbox
        ? typeof document !== 'undefined'
          ? createPortal(lightbox, document.body)
          : lightbox
        : null}
    </>
  );
}
