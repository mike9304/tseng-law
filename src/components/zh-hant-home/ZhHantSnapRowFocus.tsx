'use client';

import { useEffect } from 'react';

/** The horizontal scroll-snap row that holds `target`, if it overflows (phones). */
export function findOverflowingSnapRow(target: Element, root: Element): HTMLElement | null {
  for (let el = target.parentElement; el && el !== root; el = el.parentElement) {
    const style = window.getComputedStyle(el);
    if (style.scrollSnapType === 'none' || style.scrollSnapType === '') continue;
    if (style.overflowX !== 'auto' && style.overflowX !== 'scroll') continue;
    if (el.scrollWidth > el.clientWidth + 1) return el;
  }
  return null;
}

/**
 * zh-hant Apple pass, phones: category tiles, service groups, related columns and FAQ topic chips
 * sit in horizontal scroll-snap rows. When keyboard focus enters an item that is off to the side,
 * bring the whole item into view (Astra 2026-10-01: Tab to the second card under 訴訟與糾紛 left
 * scrollLeft at 0 and 21% of the card visible). The home's #practice row has ZhHantPracticeFocus.
 * Renders nothing.
 */
export default function ZhHantSnapRowFocus({ rootSelector }: { rootSelector: string }) {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const onFocusIn = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const row = findOverflowingSnapRow(target, root);
      if (!row) return;
      let item: Element = target;
      while (item.parentElement && item.parentElement !== row) item = item.parentElement;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Next frame: a smooth scroll started inside focusin is cancelled by WebKit's own focus scroll.
      window.requestAnimationFrame(() => {
        item.scrollIntoView({ block: 'nearest', inline: 'start', behavior: reduce ? 'auto' : 'smooth' });
      });
    };
    root.addEventListener('focusin', onFocusIn);
    return () => root.removeEventListener('focusin', onFocusIn);
  }, [rootSelector]);
  return null;
}
