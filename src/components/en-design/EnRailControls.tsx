'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './EnHome.module.css';

/**
 * Previous / next buttons and a progress hairline for the practice-area rail on the en home.
 * It controls the existing `#practice .services-card-grid` scroller (ServicesBento markup is unchanged)
 * and sits above the rail, right-aligned, measured from the grid's own position.
 */
export default function EnRailControls() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState({ progress: 0, atStart: true, atEnd: false, scrollable: true });

  const getGrid = useCallback(() => rootRef.current?.parentElement?.querySelector<HTMLElement>('.services-card-grid') ?? null, []);

  useEffect(() => {
    const root = rootRef.current;
    const grid = getGrid();
    if (!root || !grid) return;
    const update = () => {
      const max = grid.scrollWidth - grid.clientWidth;
      const left = grid.scrollLeft;
      setState({
        scrollable: max > 8,
        progress: max > 0 ? Math.min(1, Math.max(0, left / max)) : 0,
        atStart: left <= 4,
        atEnd: left >= max - 4,
      });
      const wrapTop = root.parentElement?.getBoundingClientRect().top ?? 0;
      root.style.setProperty('--en-rail-top', `${Math.max(0, grid.getBoundingClientRect().top - wrapTop - 64)}px`);
    };
    update();
    grid.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(grid);
    return () => {
      grid.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [getGrid]);

  const step = (direction: 1 | -1) => {
    const grid = getGrid();
    if (!grid) return;
    const card = grid.querySelector<HTMLElement>('.services-card-grid-item');
    const distance = (card?.offsetWidth ?? 360) + 16;
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    grid.scrollBy({ left: direction * distance, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div ref={rootRef} className={styles.railControls} data-scrollable={state.scrollable ? 'true' : 'false'}>
      <div className={styles.railProgress} aria-hidden>
        <span style={{ transform: `scaleX(${0.18 + state.progress * 0.82})` }} />
      </div>
      <button type="button" className={styles.railButton} onClick={() => step(-1)} disabled={state.atStart} aria-label="Previous practice area">
        <span aria-hidden>←</span>
      </button>
      <button type="button" className={styles.railButton} onClick={() => step(1)} disabled={state.atEnd} aria-label="Next practice area">
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
