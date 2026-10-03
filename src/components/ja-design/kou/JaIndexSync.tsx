'use client';

import { useEffect } from 'react';

/**
 * Sets aria-current="true" on the index link of the block crossing the viewport centre (CONCEPT-V2 §7.7). Blocks are
 * contiguous, so exactly one meets the centre line. In the horizontal tab row (below 1200 px) the active tab is kept in
 * view by scrolling the row itself, never the page.
 */
export default function JaIndexSync({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-index-link]'));
    const blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-index-block]'));
    const row = root.querySelector<HTMLElement>('[data-index-row]');
    const activate = (id: string) => {
      for (const link of links) {
        if (link.getAttribute('href') === `#${id}`) {
          link.setAttribute('aria-current', 'true');
          if (row && row.scrollWidth > row.clientWidth) {
            const target = link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2;
            row.scrollTo({ left: Math.max(0, target), behavior: 'auto' });
          }
        } else {
          link.removeAttribute('aria-current');
        }
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) activate(entry.target.id);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    blocks.forEach((block) => io.observe(block));
    return () => io.disconnect();
  }, [rootId]);
  return null;
}
