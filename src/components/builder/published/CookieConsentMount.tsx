'use client';

import { useEffect } from 'react';

/**
 * Allows any element with `href="cookie-consent:open"` or
 * `data-cookie-consent="open"` to re-open the consent banner manage panel.
 */
export default function CookieConsentMount() {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    function handler(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>('[data-cookie-consent="open"], a[href="cookie-consent:open"]');
      if (!trigger) return;
      event.preventDefault();
      event.stopPropagation();
      window.dispatchEvent(new CustomEvent('builder-cookie-consent:open'));
    }

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return null;
}
