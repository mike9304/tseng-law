'use client';

import { useEffect, useRef } from 'react';
import { KOU_WALL_SEQUENCE, kouSequenceFrame } from './ja-kou-media';

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

/**
 * Scroll-scrubbed image sequence on a canvas (operator amendment 2026-10-02; TEARDOWN R4): the morning light on the
 * plaster wall moves to noon as the reader scrolls through the needs and numbers chapters. Frames are webp stills
 * (80 desktop / 48 phone), fetched only when the wall is within one viewport, drawn on requestAnimationFrame only while
 * the wall intersects the viewport and only when the frame index changes. No video is scrubbed; the page is never
 * moved. With reduced motion or Save-Data nothing is fetched and the morning still underneath stays.
 *
 * The same progress also turns the numerals' cast shadows (`[data-sun-shadow]`, a `--sun` value from 0 to 1), so the
 * shadows swing with the light in every engine, Firefox included.
 */
export default function JaSequence({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas?.closest<HTMLElement>('[data-ja-light]');
    if (!canvas || !wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ((navigator as NavigatorWithConnection).connection?.saveData) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const set = window.matchMedia(KOU_WALL_SEQUENCE.phoneQuery).matches ? KOU_WALL_SEQUENCE.phone : KOU_WALL_SEQUENCE.desktop;
    canvas.width = set.width;
    canvas.height = set.height;
    const frames: Array<HTMLImageElement | null> = new Array(set.count).fill(null);
    const shadows = Array.from(wrap.querySelectorAll<HTMLElement>('[data-sun-shadow]'));
    const header = document.querySelector<HTMLElement>('header.header');
    let drawn = -1;
    let sun = -1;
    let frame = 0;
    let active = false;
    let started = false;
    let cancelled = false;

    const progress = () => {
      const rect = wrap.getBoundingClientRect();
      const top = header ? header.getBoundingClientRect().height : 0;
      const travel = rect.height - (window.innerHeight - top);
      if (travel <= 0) return 0;
      return Math.min(1, Math.max(0, (top - rect.top) / travel));
    };

    const nearestLoaded = (index: number) => {
      for (let step = 0; step < set.count; step += 1) {
        if (frames[index - step]) return index - step;
        if (frames[index + step]) return index + step;
      }
      return -1;
    };

    const render = () => {
      frame = 0;
      const p = progress();
      const index = nearestLoaded(Math.round(p * (set.count - 1)));
      if (index >= 0 && index !== drawn) {
        context.drawImage(frames[index] as HTMLImageElement, 0, 0, set.width, set.height);
        drawn = index;
        canvas.dataset.frame = String(index);
        if (canvas.dataset.ready !== 'true') canvas.dataset.ready = 'true';
      }
      const rounded = Math.round(p * 200) / 200;
      if (rounded !== sun) {
        sun = rounded;
        for (const shadow of shadows) shadow.style.setProperty('--sun', String(rounded));
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    // Coarse-to-fine order: ends first, then halving strides, so any scroll position has a near frame early.
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (index: number) => { if (!seen.has(index) && index >= 0 && index < set.count) { seen.add(index); order.push(index); } };
    push(0);
    push(set.count - 1);
    for (let stride = 2 ** Math.ceil(Math.log2(set.count)); stride >= 1; stride /= 2) {
      for (let index = 0; index < set.count; index += stride) push(index);
    }

    const load = () => {
      if (started) return;
      started = true;
      let next = 0;
      const worker = async () => {
        while (!cancelled && next < order.length) {
          const index = order[next];
          next += 1;
          const image = new Image();
          image.decoding = 'async';
          image.src = kouSequenceFrame(set.base, index);
          try {
            await image.decode();
          } catch {
            continue;
          }
          if (cancelled) return;
          frames[index] = image;
          if (active) schedule();
        }
      };
      for (let lane = 0; lane < 4; lane += 1) void worker();
    };

    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          load();
          near.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    const onScroll = () => schedule();
    const visible = new IntersectionObserver(([entry]) => {
      const now = Boolean(entry?.isIntersecting);
      if (now === active) return;
      active = now;
      if (active) {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        schedule();
      } else {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    });
    near.observe(wrap);
    visible.observe(wrap);

    return () => {
      cancelled = true;
      near.disconnect();
      visible.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      delete canvas.dataset.ready;
      for (const shadow of shadows) shadow.style.removeProperty('--sun');
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
