'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  resolvePublishedOverlayOpener,
  usePublishedOverlayFocus,
  type PublishedOverlayOpenDetail,
} from './overlayFocus';

export interface PopupOverlayConfig {
  id: string;
  slug: string;
  width?: number;
  height?: number;
  closeOnOutsideClick: boolean;
  closeOnEsc: boolean;
  dismissable: boolean;
  backdropOpacity: number;
}

export default function PopupOverlay({
  config,
  children,
}: {
  config: PopupOverlayConfig;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    function handleOpen(e: Event) {
      const ce = e as CustomEvent<PublishedOverlayOpenDetail>;
      if (ce.detail?.slug === config.slug) {
        openerRef.current = resolvePublishedOverlayOpener(ce.detail.opener);
        setOpen(true);
      }
    }
    function handleClose(e: Event) {
      const ce = e as CustomEvent<{ slug?: string }>;
      if (!ce.detail?.slug || ce.detail.slug === config.slug) setOpen(false);
    }
    window.addEventListener('builder-popup:open', handleOpen as EventListener);
    window.addEventListener('builder-popup:close', handleClose as EventListener);
    return () => {
      window.removeEventListener('builder-popup:open', handleOpen as EventListener);
      window.removeEventListener('builder-popup:close', handleClose as EventListener);
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

  if (!open) return null;

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current && config.closeOnOutsideClick) {
      close();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={onBackdropClick}
      data-popup-overlay={config.slug}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
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
          borderRadius: 14,
          boxShadow: '0 24px 60px rgba(0,0,0,0.32)',
          overflow: 'auto',
          width: config.width ?? 520,
          maxWidth: '92vw',
          minHeight: config.height ?? 240,
          maxHeight: '88vh',
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
              top: 10,
              right: 10,
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
        <div style={{ padding: 28 }}>{children}</div>
      </div>
    </div>
  );
}
