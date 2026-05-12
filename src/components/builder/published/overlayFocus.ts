'use client';

import { useEffect, type MutableRefObject, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export type PublishedOverlayOpenDetail = {
  slug: string;
  opener?: HTMLElement | null;
};

export function resolvePublishedOverlayOpener(candidate?: HTMLElement | null): HTMLElement | null {
  if (candidate instanceof HTMLElement && candidate.isConnected) return candidate;

  const activeElement = document.activeElement;
  if (
    activeElement instanceof HTMLElement &&
    activeElement !== document.body &&
    activeElement !== document.documentElement &&
    activeElement.isConnected
  ) {
    return activeElement;
  }

  return null;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => (
    !element.hidden &&
    !element.closest('[hidden]') &&
    element.getAttribute('aria-hidden') !== 'true' &&
    element.getClientRects().length > 0
  ));
}

export function usePublishedOverlayFocus({
  open,
  overlayRef,
  initialFocusRef,
  openerRef,
}: {
  open: boolean;
  overlayRef: RefObject<HTMLElement | null>;
  initialFocusRef: RefObject<HTMLElement | null>;
  openerRef: MutableRefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!open) return undefined;
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFirst = () => {
      (initialFocusRef.current ?? getFocusableElements(overlay)[0] ?? overlay).focus({ preventScroll: true });
    };

    const focusFrame = window.requestAnimationFrame(focusFirst);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = getFocusableElements(overlay);
      if (focusable.length === 0) {
        event.preventDefault();
        overlay.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
        return;
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    const handleFocusIn = (event: FocusEvent) => {
      if (overlay.contains(event.target as Node | null)) return;
      focusFirst();
    };

    overlay.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      overlay.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('focusin', handleFocusIn);
      document.body.style.overflow = previousOverflow;
      const opener = openerRef.current;
      openerRef.current = null;
      window.setTimeout(() => {
        if (opener?.isConnected) opener.focus({ preventScroll: true });
      }, 0);
    };
  }, [initialFocusRef, openerRef, open, overlayRef]);
}
