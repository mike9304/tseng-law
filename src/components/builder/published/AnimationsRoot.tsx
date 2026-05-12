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

function splitBackgroundPositions(value: string): string[] {
  const positions = value
    .split(',')
    .map((position) => position.trim())
    .filter(Boolean);
  return positions.length > 0 ? positions : ['center center'];
}

function composeBackgroundParallaxPosition(basePosition: string, offset: number): string {
  const positions = splitBackgroundPositions(basePosition);
  const imageLayerIndex = positions.length - 1;
  positions[imageLayerIndex] = `50% calc(50% + ${offset}px)`;
  return positions.join(', ');
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
        } else if (effect === 'background-parallax') {
          const computedStyle = getComputedStyle(node);
          const basePosition = node.style.getPropertyValue('--builder-bg-base-position').trim()
            || computedStyle.backgroundPosition
            || 'center center';
          const offset = Math.round(centeredProgress * -intensity);
          node.style.setProperty('--builder-bg-base-position', basePosition);
          node.style.setProperty('--builder-bg-parallax-position', composeBackgroundParallaxPosition(basePosition, offset));
        } else if (effect === 'scale-on-scroll') {
          effectTransform = `scale(${clamp(1 + centeredProgress * (intensity / 400), 0.75, 1.25).toFixed(3)})`;
        } else if (effect === 'rotate-on-scroll') {
          effectTransform = `rotate(${(centeredProgress * intensity).toFixed(2)}deg)`;
        } else if (effect === 'fade-on-scroll') {
          const opacity = clamp(0.35 + (1 - Math.abs(centeredProgress)) * 0.65, 0.35, 1);
          node.style.setProperty('--builder-scroll-opacity', opacity.toFixed(3));
        } else if (effect === 'scrub-translate') {
          node.style.setProperty('--builder-anim-scrub-progress', progress.toFixed(3));
          node.style.setProperty('--builder-anim-intensity', String(intensity));
          effectTransform = `translateY(${Math.round(progress * -intensity)}px)`;
        } else if (effect === 'scrub-opacity') {
          node.style.setProperty('--builder-anim-scrub-progress', progress.toFixed(3));
          node.style.setProperty('--builder-anim-intensity', String(intensity));
          const strength = clamp(Math.abs(intensity) / 100, 0, 1);
          const opacity = intensity < 0
            ? clamp((1 - strength) + progress * strength, 0, 1)
            : clamp(1 - progress * strength, 0, 1);
          node.style.setProperty('--builder-scroll-opacity', opacity.toFixed(3));
        } else if (effect === 'scrub-rotate') {
          node.style.setProperty('--builder-anim-scrub-progress', progress.toFixed(3));
          node.style.setProperty('--builder-anim-intensity', String(intensity));
          effectTransform = `rotate(${(progress * intensity).toFixed(2)}deg)`;
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

    // Phase 22 — Exit animation: trigger when node leaves viewport.
    const exitNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-anim-exit]'),
    ).filter((node) => node.dataset.animExit && node.dataset.animExit !== 'none');

    let exitObserver: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window && exitNodes.length > 0) {
      exitObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const node = entry.target as HTMLElement;
            const dur = node.dataset.animExitDuration ?? '400';
            node.style.setProperty('--builder-anim-exit-ms', `${dur}ms`);
            node.style.setProperty('--builder-anim-exit-easing', node.dataset.animExitEasing || 'ease-out');
            node.dataset.animExitState = entry.isIntersecting ? 'present' : 'leaving';
          }
        },
        { threshold: 0.05 },
      );
      exitNodes.forEach((node) => {
        node.dataset.animExitState = 'present';
        exitObserver?.observe(node);
      });
    }

    // Phase 22 — Loop animations: feed CSS variable for keyframe duration.
    const loopNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-anim-loop]'),
    ).filter((node) => node.dataset.animLoop && node.dataset.animLoop !== 'none');
    loopNodes.forEach((node) => {
      const dur = node.dataset.animLoopDuration ?? '2400';
      const intensity = clamp(Number(node.dataset.animLoopIntensity ?? 30), 0, 100);
      node.style.setProperty('--builder-anim-loop-duration', `${dur}ms`);
      node.style.setProperty('--builder-anim-loop-scale', (1 + intensity / 750).toFixed(3));
      node.style.setProperty('--builder-anim-loop-float-y', `${Math.round(intensity * -0.2)}px`);
      node.style.setProperty('--builder-anim-loop-bounce-y', `${Math.round(intensity * -0.4)}px`);
      const rotate = Math.max(1, intensity / 10);
      node.style.setProperty('--builder-anim-loop-rotate', `${rotate.toFixed(2)}deg`);
      node.style.setProperty('--builder-anim-loop-rotate-neg', `${(-rotate).toFixed(2)}deg`);
      node.style.setProperty('--builder-anim-loop-breath-scale', (1 - intensity / 3000).toFixed(3));
      node.style.setProperty('--builder-anim-loop-breath-opacity', (1 - intensity / 400).toFixed(3));
    });

    // Phase 22 W175 — Click trigger animations.
    const clickNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-anim-click]'),
    ).filter((node) => node.dataset.animClick && node.dataset.animClick !== 'none');
    const clickTimers = new Map<HTMLElement, number>();
    const clickListeners: Array<{ node: HTMLElement; listener: EventListener }> = [];
    clickNodes.forEach((node) => {
      const duration = clamp(Number(node.dataset.animClickDuration ?? 500), 100, 3000);
      const intensity = clamp(Number(node.dataset.animClickIntensity ?? 30), 0, 100);
      node.style.setProperty('--builder-anim-click-duration', `${duration}ms`);
      node.style.setProperty('--builder-anim-click-scale', (1 + intensity / 650).toFixed(3));
      node.style.setProperty('--builder-anim-click-y', `${Math.round(intensity * -0.32)}px`);
      node.style.setProperty('--builder-anim-click-x', `${Math.max(2, Math.round(intensity * 0.16))}px`);
      const clickBaseTransform = readBaseTransform(node);
      node.style.setProperty(
        '--builder-anim-click-base-transform',
        clickBaseTransform === 'none' ? '' : clickBaseTransform,
      );
      node.dataset.animClickState = 'idle';
      const listener: EventListener = () => {
        const previousTimer = clickTimers.get(node);
        if (previousTimer) window.clearTimeout(previousTimer);
        node.dataset.animClickState = 'idle';
        void node.offsetWidth;
        node.dataset.animClickState = 'active';
        const timer = window.setTimeout(() => {
          node.dataset.animClickState = 'idle';
          clickTimers.delete(node);
        }, duration);
        clickTimers.set(node, timer);
      };
      node.addEventListener('click', listener);
      clickListeners.push({ node, listener });
    });

    // Phase 22 W173 — Motion timeline runtime.
    interface ParsedKeyframe {
      offset?: number;
      timeOffset?: number;
      transform?: string;
      opacity?: number;
      properties?: {
        transform?: string;
        opacity?: number;
      };
      easing?: string;
    }
    interface RuntimeKeyframe {
      offset: number;
      transform?: string;
      opacity?: number;
      easing?: string;
    }
    const timelineNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-anim-timeline]'),
    );
    const timelineSpecs: Array<{ node: HTMLElement; keyframes: RuntimeKeyframe[]; mode: 'scroll' | 'time'; durationMs: number; startedAt: number }> = [];
    timelineNodes.forEach((node) => {
      try {
        const parsed = JSON.parse(node.dataset.animTimeline ?? '[]') as ParsedKeyframe[];
        if (!Array.isArray(parsed) || parsed.length === 0) return;
        const keyframes = parsed
          .map((keyframe) => ({
            offset: clamp(Number(keyframe.offset ?? keyframe.timeOffset ?? 0), 0, 1),
            transform: keyframe.transform ?? keyframe.properties?.transform,
            opacity: keyframe.opacity ?? keyframe.properties?.opacity,
            easing: keyframe.easing,
          }))
          .sort((a, b) => a.offset - b.offset);
        timelineSpecs.push({
          node,
          keyframes,
          mode: (node.dataset.animTimelineMode as 'scroll' | 'time') || 'time',
          durationMs: Number(node.dataset.animTimelineDuration) || 1200,
          startedAt: performance.now(),
        });
      } catch {
        /* ignore malformed timeline */
      }
    });

    function interpolate(spec: typeof timelineSpecs[number], progress: number): void {
      const kfs = spec.keyframes;
      let a = kfs[0];
      let b = kfs[kfs.length - 1];
      for (let i = 0; i < kfs.length - 1; i++) {
        if (progress >= kfs[i].offset && progress <= kfs[i + 1].offset) {
          a = kfs[i];
          b = kfs[i + 1];
          break;
        }
      }
      const span = b.offset - a.offset || 1;
      const t = (progress - a.offset) / span;
      if (a.transform || b.transform) {
        spec.node.style.setProperty('--builder-anim-timeline-transform', t > 0.5 ? (b.transform ?? 'none') : (a.transform ?? 'none'));
      }
      if (a.opacity !== undefined || b.opacity !== undefined) {
        const av = a.opacity ?? 1;
        const bv = b.opacity ?? 1;
        spec.node.style.setProperty('--builder-anim-timeline-opacity', String(av + (bv - av) * t));
      }
    }

    let timelineFrame: number | null = null;
    function tickTimeline(): void {
      const now = performance.now();
      for (const spec of timelineSpecs) {
        if (spec.mode === 'time') {
          const elapsed = (now - spec.startedAt) % spec.durationMs;
          interpolate(spec, elapsed / spec.durationMs);
        } else {
          const rect = spec.node.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          const raw = 1 - (rect.top + rect.height / 2) / vh;
          const progress = Math.max(0, Math.min(1, raw));
          interpolate(spec, progress);
        }
      }
      timelineFrame = window.requestAnimationFrame(tickTimeline);
    }
    if (timelineSpecs.length > 0) {
      timelineFrame = window.requestAnimationFrame(tickTimeline);
    }

    return () => {
      observer?.disconnect();
      exitObserver?.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (timelineFrame) window.cancelAnimationFrame(timelineFrame);
      clickTimers.forEach((timer) => window.clearTimeout(timer));
      clickListeners.forEach(({ node, listener }) => {
        node.removeEventListener('click', listener);
      });
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
      .builder-pub-node[data-anim-scroll-active='true']:not([data-anim-scroll='background-parallax']) {
        transform: var(--builder-scroll-transform, var(--builder-base-transform, none)) !important;
        opacity: var(--builder-scroll-opacity) !important;
      }
      .builder-pub-node[data-anim-scroll='background-parallax'][data-anim-scroll-active='true'] {
        background-position: var(--builder-bg-parallax-position, var(--builder-bg-base-position, center center)) !important;
        will-change: background-position;
      }
      .builder-pub-node[data-anim-timeline] {
        transform: var(--builder-anim-timeline-transform, var(--builder-base-transform, none));
        opacity: var(--builder-anim-timeline-opacity, 1);
        will-change: transform, opacity;
      }
      .builder-pub-node[data-anim-hover]:hover {
        opacity: var(--builder-anim-hover-opacity, var(--builder-anim-visible-opacity, 1)) !important;
        transform: var(--builder-anim-hover-transform, var(--builder-base-transform, none)) !important;
        box-shadow: var(--builder-anim-hover-box-shadow) !important;
        filter: var(--builder-anim-hover-filter) !important;
        transition:
          opacity var(--builder-anim-hover-transition, 200ms) ease,
          transform var(--builder-anim-hover-transition, 200ms) ease,
          box-shadow var(--builder-anim-hover-transition, 200ms) ease,
          filter var(--builder-anim-hover-transition, 200ms) ease;
      }
      .builder-pub-node[data-anim-click] {
        cursor: pointer;
      }
      .builder-pub-node[data-anim-click='pulse'][data-anim-click-state='active'] {
        animation: builder-click-pulse var(--builder-anim-click-duration, 500ms) ease-out 1;
      }
      .builder-pub-node[data-anim-click='bounce'][data-anim-click-state='active'] {
        animation: builder-click-bounce var(--builder-anim-click-duration, 500ms) cubic-bezier(0.34, 1.56, 0.64, 1) 1;
      }
      .builder-pub-node[data-anim-click='shake'][data-anim-click-state='active'] {
        animation: builder-click-shake var(--builder-anim-click-duration, 500ms) ease-in-out 1;
      }
      .builder-pub-node[data-anim-click='flash'][data-anim-click-state='active'] {
        animation: builder-click-flash var(--builder-anim-click-duration, 500ms) ease-out 1;
      }
      @keyframes builder-click-pulse {
        0%, 100% { transform: var(--builder-base-transform, none); }
        45% { transform: var(--builder-anim-click-base-transform) scale(var(--builder-anim-click-scale, 1.05)); }
      }
      @keyframes builder-click-bounce {
        0%, 100% { transform: var(--builder-base-transform, none); }
        45% { transform: var(--builder-anim-click-base-transform) translateY(var(--builder-anim-click-y, -10px)); }
      }
      @keyframes builder-click-shake {
        0%, 100% { transform: var(--builder-anim-click-base-transform) translateX(0); }
        20%, 60% { transform: var(--builder-anim-click-base-transform) translateX(calc(var(--builder-anim-click-x, 5px) * -1)); }
        40%, 80% { transform: var(--builder-anim-click-base-transform) translateX(var(--builder-anim-click-x, 5px)); }
      }
      @keyframes builder-click-flash {
        0%, 100% { opacity: var(--builder-anim-visible-opacity, 1); }
        45% { opacity: 0.5; }
      }
      @media (prefers-reduced-motion: reduce) {
        .builder-pub-node[data-anim-entrance],
        .builder-pub-node[data-anim-scroll-active='true'],
        .builder-pub-node[data-anim-loop],
        .builder-pub-node[data-anim-timeline],
        .builder-pub-node[data-anim-click],
        .builder-pub-node[data-anim-hover]:hover {
          opacity: var(--builder-anim-visible-opacity, 1) !important;
          transform: var(--builder-base-transform, none) !important;
          background-position: var(--builder-bg-base-position, revert) !important;
          clip-path: none !important;
          transition: none !important;
          animation: none !important;
          filter: none !important;
        }
      }
    `}</style>
  );
}
