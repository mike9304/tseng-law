'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { Locale } from '@/lib/locales';
import { getPreviewModalCopy } from './preview-modal-copy';
import styles from './PreviewModal.module.css';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface DeviceSpec {
  mode: DeviceMode;
  width: number;
  height: number;
  bezel: number;
  radius: number;
  notch: boolean;
  homeIndicator: boolean;
}

const DEVICES: Record<DeviceMode, DeviceSpec> = {
  desktop: {
    mode: 'desktop',
    width: 1280,
    height: 800,
    bezel: 0,
    radius: 12,
    notch: false,
    homeIndicator: false,
  },
  tablet: {
    mode: 'tablet',
    width: 768,
    height: 1024,
    bezel: 14,
    radius: 28,
    notch: false,
    homeIndicator: false,
  },
  mobile: {
    mode: 'mobile',
    width: 390,
    height: 780,
    bezel: 12,
    radius: 44,
    notch: true,
    homeIndicator: true,
  },
};

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])',
].join(',');

type PreviewStageStyle = CSSProperties & {
  '--preview-stage-scale': string;
};

type PreviewDeviceStyle = CSSProperties & {
  '--preview-device-bezel': string;
  '--preview-device-height': string;
  '--preview-device-radius': string;
  '--preview-device-screen-radius': string;
  '--preview-device-shell-width': string;
  '--preview-device-width': string;
};

function stageShellStyle(stageScale: number): PreviewStageStyle {
  return {
    '--preview-stage-scale': String(stageScale),
  };
}

function deviceFrameStyle(spec: DeviceSpec): PreviewDeviceStyle {
  return {
    '--preview-device-bezel': `${spec.bezel}px`,
    '--preview-device-height': `${spec.height}px`,
    '--preview-device-radius': `${spec.radius}px`,
    '--preview-device-screen-radius': `${Math.max(8, spec.radius - spec.bezel + 4)}px`,
    '--preview-device-shell-width': `${spec.width + spec.bezel * 2}px`,
    '--preview-device-width': `${spec.width}px`,
  };
}

export default function PreviewModal({
  open,
  locale,
  onClose,
  previewUrl,
  initialDevice = 'desktop',
}: {
  open: boolean;
  locale?: Locale | string;
  onClose: () => void;
  previewUrl: string | null;
  initialDevice?: DeviceMode;
}) {
  const copy = getPreviewModalCopy(locale);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);
  const [device, setDevice] = useState<DeviceMode>(initialDevice);
  const [reloadKey, setReloadKey] = useState(0);
  const [frameLoading, setFrameLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDevice(initialDevice);
  }, [open, initialDevice]);

  useEffect(() => {
    if (!open) {
      setFrameLoading(false);
      return;
    }
    setFrameLoading(Boolean(previewUrl));
  }, [device, open, previewUrl, reloadKey]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        onClose();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        event.stopPropagation();
        setReloadKey((prev) => prev + 1);
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1);
      if (focusables.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || active === dialog) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
        return;
      }
      if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    closingRef.current = false;
    restoreFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    const dialog = dialogRef.current;
    if (dialog) {
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? dialog).focus({ preventScroll: true });
    }
    return () => {
      closingRef.current = true;
      const previous = restoreFocusRef.current;
      if (!previous || typeof previous.focus !== 'function') return;
      try {
        previous.focus({ preventScroll: true });
      } catch {
        // Ignore detached focus targets.
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleFocusIn(event: FocusEvent) {
      if (closingRef.current) return;
      const dialog = dialogRef.current;
      if (!dialog || !event.target || dialog.contains(event.target as Node)) return;
      event.preventDefault();
      event.stopPropagation();
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? dialog).focus({ preventScroll: true });
    }
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [open]);

  const spec = DEVICES[device];

  const stageScale = useMemo(() => {
    if (typeof window === 'undefined') return 1;
    const usableW = Math.min(window.innerWidth * 0.86, 1500);
    const usableH = window.innerHeight * 0.7;
    const totalW = spec.width + spec.bezel * 2;
    const totalH = spec.height + spec.bezel * 2 + (spec.notch ? 22 : 0);
    const scale = Math.min(usableW / totalW, usableH / totalH, 1);
    return Math.max(0.4, scale);
  }, [spec]);

  const reload = useCallback(() => setReloadKey((prev) => prev + 1), []);

  const openInNewTab = useCallback(() => {
    if (previewUrl) window.open(previewUrl, '_blank', 'noopener,noreferrer');
  }, [previewUrl]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={copy.ariaLabel}
      tabIndex={-1}
      data-builder-preview-dialog="true"
      className={styles.dialog}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <header className={styles.header}>
        <div className={styles.titleBar}>
          <span className={styles.title}>{copy.title}</span>
          {previewUrl ? (
            <span
              title={previewUrl}
              className={styles.urlPill}
            >
              {previewUrl}
            </span>
          ) : null}
        </div>

        <div role="group" aria-label={copy.deviceGroupAriaLabel} className={styles.deviceGroup}>
          {(['desktop', 'tablet', 'mobile'] as const).map((mode) => {
            const d = DEVICES[mode];
            const active = device === mode;
            return (
              <button
                key={mode}
                type="button"
                className={styles.deviceButton}
                aria-pressed={active}
                onClick={() => setDevice(mode)}
              >
                <span aria-hidden className={styles.deviceIcon} data-mode={mode} />
                <span>{copy.deviceLabels[mode]}</span>
                <small>{d.width}</small>
              </button>
            );
          })}
        </div>

        <div className={styles.actionGroup}>
          <button type="button" className={styles.actionButton} onClick={reload} aria-label={copy.reloadLabel} title={copy.reloadTitle}>
            <span aria-hidden>↻</span>
            <span>{copy.reloadLabel}</span>
          </button>
          <button type="button" className={styles.actionButton} onClick={openInNewTab} aria-label={copy.openInNewTabLabel} disabled={!previewUrl} title={copy.openInNewTabTitle}>
            <span aria-hidden>↗</span>
            <span>{copy.openInNewTabLabel}</span>
          </button>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label={copy.closeAriaLabel} title={copy.closeTitle}>
            ×
          </button>
        </div>
      </header>

      <div
        className={styles.stageBody}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          aria-hidden={false}
          className={styles.stageShell}
          style={stageShellStyle(stageScale)}
        >
          <DeviceFrame spec={spec} browserChromeLabel={copy.browserChromeLabel}>
            {previewUrl ? (
              <>
                <iframe
                  key={`${device}-${reloadKey}-${previewUrl}`}
                  src={previewUrl}
                  title={copy.iframeTitle(copy.deviceLabels[spec.mode])}
                  className={styles.previewFrame}
                  onLoad={() => setFrameLoading(false)}
                />
                {frameLoading ? (
                  <div className={styles.previewLoadingOverlay} role="status" aria-live="polite">
                    <span className={styles.previewLoadingSpinner} aria-hidden="true" />
                    <span>{copy.loadingMessage}</span>
                  </div>
                ) : null}
              </>
            ) : (
              <div className={styles.unpublished}>
                {copy.unpublishedMessage}
              </div>
            )}
          </DeviceFrame>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>
          {copy.footerSummary(spec.width, spec.height, Math.round(stageScale * 100))}
        </span>
      </footer>
    </div>
  );
}

function DeviceFrame({
  spec,
  browserChromeLabel,
  children,
}: {
  spec: DeviceSpec;
  browserChromeLabel: string;
  children: ReactNode;
}) {
  if (spec.mode === 'desktop') {
    return (
      <div
        className={styles.desktopFrame}
        data-mode={spec.mode}
        style={deviceFrameStyle(spec)}
      >
        <div className={styles.browserBar}>
          <span className={styles.browserDot} data-tone="red" />
          <span className={styles.browserDot} data-tone="yellow" />
          <span className={styles.browserDot} data-tone="green" />
          <span className={styles.browserSpacer} />
          <span className={styles.browserLabel}>{browserChromeLabel}</span>
        </div>
        <div className={styles.desktopScreen}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={styles.deviceFrame}
      data-mode={spec.mode}
      style={deviceFrameStyle(spec)}
    >
      {spec.notch ? (
        <span
          aria-hidden
          className={styles.notch}
        />
      ) : null}
      <div className={styles.deviceScreen}>
        {children}
      </div>
      {spec.homeIndicator ? (
        <span
          aria-hidden
          className={styles.homeIndicator}
        />
      ) : null}
    </div>
  );
}
