'use client';

import { useEffect } from 'react';

/**
 * zh-hant home, phones: the practice tiles form a horizontal scroll-snap row. When keyboard focus
 * enters a tile that sits off to the side, bring that tile into view (post-deploy a11y check
 * 2026-10-01: tiles 2/4/6 kept focus while 78% off screen). Renders nothing.
 */
export default function ZhHantPracticeFocus() {
  useEffect(() => {
    const grid = document.querySelector<HTMLElement>('#zh-hant-home #practice .services-card-grid');
    if (!grid) return;
    const onFocusIn = (event: FocusEvent) => {
      if (grid.scrollWidth <= grid.clientWidth + 1) return;
      const item = (event.target as HTMLElement | null)?.closest<HTMLElement>('.services-card-grid-item');
      if (!item) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Next frame: a smooth scroll started inside focusin is cancelled by WebKit's own focus scroll.
      window.requestAnimationFrame(() => {
        item.scrollIntoView({ block: 'nearest', inline: 'start', behavior: reduce ? 'auto' : 'smooth' });
      });
    };
    grid.addEventListener('focusin', onFocusIn);
    return () => grid.removeEventListener('focusin', onFocusIn);
  }, []);
  return null;
}
