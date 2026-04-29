'use client';

import { useEffect } from 'react';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function readBaseTransform(el: HTMLElement): string {
  return getComputedStyle(el).getPropertyValue('--builder-base-transform').trim() || 'none';
}

function mergeTransform(baseTransform: string, effectTransform: string): string {
  return [baseTransform !== 'none' ? baseTransform : '', effectTransform]
    .filter(Boolean)
    .join(' ') || 'none';
}

export default function AnimationsRoot() {
  useEffect(() => {
    const entranceNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-anim-entrance]'),
    ).filter((node) => node.dataset.animEntrance && node.dataset.animEntrance !== 'none');

    let observer: IntersectionObserver | null = null;

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const node = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              node.dataset.animState = 'visible';
              if (node.dataset.animOnce !== 'false') {
                observer?.unobserve(node);
              }
            } else if (node.dataset.animOnce === 'false') {
              node.dataset.animState = 'pending';
            }
          }
        },
        { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
      );

      entranceNodes.forEach((node) => {
        node.dataset.animState = node.dataset.animState || 'pending';
        observer?.observe(node);
      });
    } else {
      entranceNodes.forEach((node) => {
        node.dataset.animState = 'visible';
      });
    }

    const scrollNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-anim-scroll]'),
    ).filter((node) => node.dataset.animScroll && node.dataset.animScroll !== 'none');

    let animationFrame = 0;

    const applyScrollEffects = () => {
      animationFrame = 0;
      const viewportHeight = window.innerHeight || 1;

      for (const node of scrollNodes) {
        const effect = node.dataset.animScroll;
        if (!effect || effect === 'none') continue;

        if (effect === 'pin') {
          node.dataset.animScrollActive = 'true';
          continue;
        }

        const rect = node.getBoundingClientRect();
        const intensity = Number(node.dataset.animIntensity ?? 20);
        const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
        const centeredProgress = (progress - 0.5) * 2;
        const baseTransform = readBaseTransform(node);
        let effectTransform = '';

        if (effect === 'parallax-y') {
          effectTransform = `translateY(${Math.round(centeredProgress * -intensity)}px)`;
        } else if (effect === 'scale-on-scroll') {
          effectTransform = `scale(${clamp(1 + centeredProgress * (intensity / 400), 0.75, 1.25).toFixed(3)})`;
        } else if (effect === 'rotate-on-scroll') {
          effectTransform = `rotate(${(centeredProgress * intensity).toFixed(2)}deg)`;
        } else if (effect === 'fade-on-scroll') {
          const opacity = clamp(0.35 + (1 - Math.abs(centeredProgress)) * 0.65, 0.35, 1);
          node.style.setProperty('--builder-scroll-opacity', opacity.toFixed(3));
        }

        if (effectTransform) {
          node.style.setProperty('--builder-scroll-transform', mergeTransform(baseTransform, effectTransform));
        }
        node.dataset.animScrollActive = 'true';
      }
    };

    const requestScrollEffects = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(applyScrollEffects);
    };

    requestScrollEffects();
    window.addEventListener('scroll', requestScrollEffects, { passive: true });
    window.addEventListener('resize', requestScrollEffects);

    return () => {
      observer?.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', requestScrollEffects);
      window.removeEventListener('resize', requestScrollEffects);
    };
  }, []);

  return (
    <style>{`
      .builder-pub-node[data-anim-entrance] {
        transform-origin: center center;
        will-change: opacity, transform, clip-path;
      }
      .builder-pub-node[data-anim-entrance][data-anim-state='pending'] {
        opacity: var(--builder-anim-initial-opacity, 0) !important;
        transform: var(--builder-anim-initial-transform, var(--builder-base-transform, none)) !important;
        clip-path: var(--builder-anim-initial-clip-path, inset(0 0 0 0));
      }
      .builder-pub-node[data-anim-entrance][data-anim-state='visible'] {
        opacity: var(--builder-anim-visible-opacity, 1) !important;
        transform: var(--builder-anim-visible-transform, var(--builder-base-transform, none)) !important;
        clip-path: var(--builder-anim-visible-clip-path, inset(0 0 0 0));
        transition:
          opacity var(--builder-anim-duration, 600ms) var(--builder-anim-easing, ease-out) var(--builder-anim-delay, 0ms),
          transform var(--builder-anim-duration, 600ms) var(--builder-anim-easing, ease-out) var(--builder-anim-delay, 0ms),
          clip-path var(--builder-anim-duration, 600ms) var(--builder-anim-easing, ease-out) var(--builder-anim-delay, 0ms);
      }
      .builder-pub-node[data-anim-scroll='pin'] {
        position: sticky !important;
        top: 24px;
      }
      .builder-pub-node[data-anim-scroll-active='true'] {
        transform: var(--builder-scroll-transform, var(--builder-base-transform, none)) !important;
        opacity: var(--builder-scroll-opacity) !important;
      }
      .builder-pub-node[data-anim-hover]:hover {
        transform: var(--builder-anim-hover-transform, var(--builder-base-transform, none)) !important;
        box-shadow: var(--builder-anim-hover-box-shadow) !important;
        filter: var(--builder-anim-hover-filter) !important;
        transition:
          transform var(--builder-anim-hover-transition, 200ms) ease,
          box-shadow var(--builder-anim-hover-transition, 200ms) ease,
          filter var(--builder-anim-hover-transition, 200ms) ease;
      }
      @media (prefers-reduced-motion: reduce) {
        .builder-pub-node[data-anim-entrance],
        .builder-pub-node[data-anim-scroll-active='true'],
        .builder-pub-node[data-anim-hover]:hover {
          opacity: var(--builder-anim-visible-opacity, 1) !important;
          transform: var(--builder-base-transform, none) !important;
          clip-path: none !important;
          transition: none !important;
          filter: none !important;
        }
      }
    `}</style>
  );
}
