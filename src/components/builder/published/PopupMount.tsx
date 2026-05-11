'use client';

import { useEffect } from 'react';
import type { BuilderPopup } from '@/lib/builder/site/types';

/**
 * Installs three things for site-level popups:
 *   1. Click delegator — opens a popup from any element with
 *      `data-popup-target="<slug>"` or anchor `href="popup:<slug>"`.
 *   2. Auto-triggers — on-load (delay), on-scroll, on-exit-intent.
 *   3. localStorage gate when `oncePerVisitor` is true.
 *
 * Each PopupOverlay listens for `builder-popup:open` events and reveals
 * itself if its slug matches.
 */
export default function PopupMount({ popups }: { popups: BuilderPopup[] }) {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const known = new Set(popups.filter((p) => p.active).map((p) => p.slug));

    const cleanups: Array<() => void> = [];

    function shouldSuppress(slug: string, oncePerVisitor: boolean): boolean {
      if (!oncePerVisitor) return false;
      try {
        return window.localStorage.getItem(`tw_popup_seen:${slug}`) === '1';
      } catch {
        return false;
      }
    }

    function markSeen(slug: string): void {
      try {
        window.localStorage.setItem(`tw_popup_seen:${slug}`, '1');
      } catch {
        /* ignore */
      }
    }

    function open(slug: string, gate: { oncePerVisitor: boolean }): void {
      if (!known.has(slug)) return;
      if (shouldSuppress(slug, gate.oncePerVisitor)) return;
      window.dispatchEvent(new CustomEvent('builder-popup:open', { detail: { slug } }));
      markSeen(slug);
    }

    function clickHandler(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>('[data-popup-target], a[href^="popup:"]');
      if (!trigger) return;
      const slug = trigger.dataset.popupTarget
        ?? trigger.getAttribute('href')?.replace(/^popup:/, '')
        ?? '';
      if (!slug || !known.has(slug)) return;
      event.preventDefault();
      event.stopPropagation();
      const matching = popups.find((p) => p.slug === slug);
      open(slug, { oncePerVisitor: matching?.oncePerVisitor ?? false });
    }

    document.addEventListener('click', clickHandler);
    cleanups.push(() => document.removeEventListener('click', clickHandler));

    // Auto: on-load
    for (const popup of popups) {
      if (!popup.active || popup.trigger !== 'on-load') continue;
      const timer = window.setTimeout(() => {
        open(popup.slug, { oncePerVisitor: popup.oncePerVisitor });
      }, Math.max(0, popup.delayMs));
      cleanups.push(() => window.clearTimeout(timer));
    }

    // Auto: on-scroll
    const scrollPopups = popups.filter((p) => p.active && p.trigger === 'on-scroll');
    if (scrollPopups.length > 0) {
      const fired = new Set<string>();
      function onScroll() {
        const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const pct = (window.scrollY / docHeight) * 100;
        for (const popup of scrollPopups) {
          if (fired.has(popup.slug)) continue;
          if (pct >= popup.scrollPercent) {
            fired.add(popup.slug);
            open(popup.slug, { oncePerVisitor: popup.oncePerVisitor });
          }
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener('scroll', onScroll));
    }

    // Auto: on-exit-intent (desktop only — pointer leaves top edge)
    const exitPopups = popups.filter((p) => p.active && p.trigger === 'on-exit-intent');
    if (exitPopups.length > 0) {
      const fired = new Set<string>();
      function onMouseOut(e: MouseEvent) {
        if (e.clientY > 10) return;
        for (const popup of exitPopups) {
          if (fired.has(popup.slug)) continue;
          fired.add(popup.slug);
          open(popup.slug, { oncePerVisitor: popup.oncePerVisitor });
        }
      }
      document.addEventListener('mouseout', onMouseOut);
      cleanups.push(() => document.removeEventListener('mouseout', onMouseOut));
    }

    return () => {
      for (const fn of cleanups) fn();
    };
  }, [popups]);

  return null;
}
