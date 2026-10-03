'use client';

import { useEffect } from 'react';

/**
 * One controller for every pinned stage on the ja home (about 1 KB). Renders nothing.
 *
 * - With motion allowed (no reduced motion, viewport at least 620 px tall, IntersectionObserver available) it sets
 *   `data-ja-motion` on the home wrapper: `timeline` where CSS scroll timelines run (WebKit, Chromium) and `steps`
 *   elsewhere (Firefox), so the CSS can pin the stages and, in `steps` mode, move the images in discrete steps.
 * - In every engine it writes `data-step` on each `[data-ja-stage]` from one-step-tall markers under a centre line
 *   (`[data-stage-marker]`), so a jump into the middle of a runway lands on the right state after one callback.
 * Never listens to scroll, never moves the page.
 */
export default function JaMotion({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const short = window.matchMedia('(max-height: 619px)');
    const timelines = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timeline: view()');
    const stages = Array.from(root.querySelectorAll<HTMLElement>('[data-ja-stage]'));
    let io: IntersectionObserver | null = null;

    const apply = () => {
      io?.disconnect();
      io = null;
      if (reduce.matches || short.matches) {
        delete root.dataset.jaMotion;
        for (const stage of stages) stage.dataset.step = 'static';
        return;
      }
      root.dataset.jaMotion = timelines ? 'timeline' : 'steps';
      for (const stage of stages) stage.dataset.step = '0';
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const marker = entry.target as HTMLElement;
            const stage = marker.closest<HTMLElement>('[data-ja-stage]');
            if (stage && marker.dataset.stageMarker) stage.dataset.step = marker.dataset.stageMarker;
          }
        },
        { rootMargin: '-50% 0px -50% 0px' },
      );
      root.querySelectorAll('[data-stage-marker]').forEach((marker) => io?.observe(marker));
    };

    apply();
    reduce.addEventListener('change', apply);
    short.addEventListener('change', apply);
    return () => {
      reduce.removeEventListener('change', apply);
      short.removeEventListener('change', apply);
      io?.disconnect();
      delete root.dataset.jaMotion;
      for (const stage of stages) delete stage.dataset.step;
    };
  }, [rootId]);
  return null;
}
