'use client';

import { useEffect } from 'react';

/**
 * Installs the global click delegator that opens lightboxes from any element
 * with `data-lightbox-target="<slug>"`. Each LightboxOverlay listens for the
 * dispatched `builder-lightbox:open` custom event and reveals itself when the
 * slug matches.
 *
 * Also handles `#lb-<slug>` URL hashes so a deep-link can pre-open a lightbox.
 */
export default function LightboxMount({ slugs }: { slugs: string[] }) {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const known = new Set(slugs);

    function handler(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest('[data-lightbox-target]') as HTMLElement | null;
      if (!trigger) return;
      const slug = trigger.dataset.lightboxTarget;
      if (!slug || !known.has(slug)) return;
      event.preventDefault();
      event.stopPropagation();
      window.dispatchEvent(
        new CustomEvent('builder-lightbox:open', { detail: { slug } }),
      );
    }

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [slugs]);

  return null;
}
