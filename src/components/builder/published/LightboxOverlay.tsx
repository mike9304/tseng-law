'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { usePublishedOverlayFocus, type PublishedOverlayOpenDetail } from './overlayFocus';

export interface LightboxOverlayConfig {
  id: string;
  slug: string;
  sizeMode: 'auto' | 'fixed';
  width?: number;
  height?: number;
  closeOnOutsideClick: boolean;
  closeOnEsc: boolean;
  dismissable: boolean;
  backdropOpacity: number;
}

export default function LightboxOverlay({
  config,
  children,
}: {
  config: LightboxOverlayConfig;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    if (typeof window !== 'undefined' && window.location.hash === `#lb-${config.slug}`) {
      // Clear the hash so the same lightbox can be re-opened later.
      const url = new URL(window.location.href);
      url.hash = '';
      window.history.replaceState(null, '', url.toString());
    }
  }, [config.slug]);

  useEffect(() => {
    function handleOpen(e: Event) {
      const ce = e as CustomEvent<PublishedOverlayOpenDetail>;
      if (ce.detail?.slug === config.slug) {
        openerRef.current = ce.detail.opener instanceof HTMLElement ? ce.detail.opener : null;
        setOpen(true);
      }
    }
    function handleClose(e: Event) {
      const ce = e as CustomEvent<{ slug?: string }>;
      if (!ce.detail?.slug || ce.detail.slug === config.slug) {
        setOpen(false);
      }
    }
    function handleHash() {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (hash === `#lb-${config.slug}`) setOpen(true);
    }
    window.addEventListener('builder-lightbox:open', handleOpen as EventListener);
    window.addEventListener('builder-lightbox:close', handleClose as EventListener);
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => {
      window.removeEventListener('builder-lightbox:open', handleOpen as EventListener);
      window.removeEventListener('builder-lightbox:close', handleClose as EventListener);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [config.slug]);

  useEffect(() => {
    if (!open || !config.closeOnEsc) return undefined;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, config.closeOnEsc, close]);

  usePublishedOverlayFocus({
    open,
    overlayRef,
    initialFocusRef: closeButtonRef,
    openerRef,
  });

  if (!open) {
    // Render nothing while closed — keeps the canvas markup out of the DOM
    // until the user actually triggers it (matches expected modal UX).
    return null;
  }

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current && config.closeOnOutsideClick) {
      close();
    }
  };

  const innerStyle: React.CSSProperties = config.sizeMode === 'fixed'
    ? {
        width: config.width ?? 600,
        height: config.height ?? 400,
      }
    : {
        width: config.width ?? 'auto',
        maxWidth: '90vw',
        maxHeight: '90vh',
      };

  return (
    <div
      ref={overlayRef}
      onClick={onBackdropClick}
      data-lightbox-overlay={config.slug}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: `rgba(0, 0, 0, ${(config.backdropOpacity ?? 60) / 100})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          overflow: 'auto',
          ...innerStyle,
        }}
      >
        {config.dismissable && (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              border: 'none',
              borderRadius: '50%',
              background: 'rgba(15,23,42,0.08)',
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            ×
          </button>
        )}
        <div
          style={{
            position: 'relative',
            width: config.width ?? '100%',
            height: config.sizeMode === 'fixed' ? config.height ?? '100%' : 'auto',
            minHeight: config.sizeMode === 'fixed' ? undefined : (config.height ?? 200),
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
