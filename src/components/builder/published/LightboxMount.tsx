'use client';

import { useEffect } from 'react';
import type { PublishedOverlayOpenDetail } from './overlayFocus';

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

    function openFromTrigger(trigger: HTMLElement, event: MouseEvent | KeyboardEvent) {
      const slug = trigger.dataset.lightboxTarget;
      if (!slug || !known.has(slug)) return false;
      event.preventDefault();
      event.stopPropagation();
      window.dispatchEvent(
        new CustomEvent<PublishedOverlayOpenDetail>('builder-lightbox:open', { detail: { slug, opener: trigger } }),
      );
      return true;
    }

    function handler(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest('[data-lightbox-target]') as HTMLElement | null;
      if (!trigger) return;
      openFromTrigger(trigger, event);
    }

    function keyHandler(event: KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Space') return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest('[data-lightbox-target]') as HTMLElement | null;
      if (!trigger) return;
      openFromTrigger(trigger, event);
    }

    function openFromHash() {
      const hash = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '';
      if (!hash.startsWith('lb-')) return;
      const slug = hash.slice(3);
      if (!slug || !known.has(slug)) return;
      const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
      window.dispatchEvent(
        new CustomEvent<PublishedOverlayOpenDetail>('builder-lightbox:open', {
          detail: { slug, opener: activeElement },
        }),
      );
    }

    document.addEventListener('click', handler);
    document.addEventListener('keydown', keyHandler);
    window.addEventListener('hashchange', openFromHash);
    const initialHashTimer = window.setTimeout(openFromHash, 0);
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', keyHandler);
      window.removeEventListener('hashchange', openFromHash);
      window.clearTimeout(initialHashTimer);
    };
  }, [slugs]);

  return null;
}
