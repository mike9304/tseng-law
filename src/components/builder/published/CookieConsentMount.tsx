'use client';

import { useEffect } from 'react';
import type { PublishedOverlayOpenDetail } from './overlayFocus';

/**
 * Allows any element with `href="cookie-consent:open"` or
 * `data-cookie-consent="open"` to re-open the consent banner manage panel.
 */
export default function CookieConsentMount() {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    function openFromTrigger(trigger: HTMLElement, event: MouseEvent | KeyboardEvent) {
      event.preventDefault();
      event.stopPropagation();
      window.dispatchEvent(
        new CustomEvent<PublishedOverlayOpenDetail>('builder-cookie-consent:open', {
          detail: { slug: 'cookie-consent', opener: trigger },
        }),
      );
    }

    function handler(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>('[data-cookie-consent="open"], a[href="cookie-consent:open"]');
      if (!trigger) return;
      openFromTrigger(trigger, event);
    }

    function keyHandler(event: KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Space') return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>('[data-cookie-consent="open"], a[href="cookie-consent:open"]');
      if (!trigger) return;
      openFromTrigger(trigger, event);
    }

    document.addEventListener('click', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, []);

  return null;
}
