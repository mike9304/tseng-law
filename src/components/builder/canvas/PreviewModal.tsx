'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface DeviceSpec {
  mode: DeviceMode;
  label: string;
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
    label: 'Desktop',
    width: 1280,
    height: 800,
    bezel: 0,
    radius: 12,
    notch: false,
    homeIndicator: false,
  },
  tablet: {
    mode: 'tablet',
    label: 'Tablet',
    width: 768,
    height: 1024,
    bezel: 14,
    radius: 28,
    notch: false,
    homeIndicator: false,
  },
  mobile: {
    mode: 'mobile',
    label: 'Mobile',
    width: 390,
    height: 780,
    bezel: 12,
    radius: 44,
    notch: true,
    homeIndicator: true,
  },
};

const ICONS: Record<DeviceMode, string> = {
  desktop: '🖥',
  tablet: '⬜',
  mobile: '▯',
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

export default function PreviewModal({
  open,
  onClose,
  previewUrl,
  initialDevice = 'desktop',
}: {
  open: boolean;
  onClose: () => void;
  previewUrl: string | null;
  initialDevice?: DeviceMode;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);
  const [device, setDevice] = useState<DeviceMode>(initialDevice);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setDevice(initialDevice);
  }, [open, initialDevice]);

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
      aria-label="페이지 미리보기"
      tabIndex={-1}
      data-builder-preview-dialog="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10100,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(8, 12, 24, 0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        animation: 'previewBackdropIn 180ms ease',
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <style>{`
        @keyframes previewBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes previewShellIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .preview-device-btn { position: relative; display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px 7px 12px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: #cbd5e1; border-radius: 999px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 140ms ease; }
        .preview-device-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.22); }
        .preview-device-btn[aria-pressed="true"] { background: #fff; color: #0f172a; border-color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.35); }
        .preview-device-btn small { opacity: 0.7; font-weight: 500; font-variant-numeric: tabular-nums; }
        .preview-device-btn[aria-pressed="true"] small { opacity: 0.55; }
        .preview-action-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.04); color: #e2e8f0; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 140ms ease; }
        .preview-action-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); color: #fff; }
        .preview-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .preview-close-btn { width: 32px; height: 32px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.04); color: #e2e8f0; cursor: pointer; font-size: 1rem; display: inline-flex; align-items: center; justify-content: center; transition: all 140ms ease; }
        .preview-close-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }
      `}</style>

      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          padding: '14px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          color: '#fff',
          gap: 16,
          animation: 'previewShellIn 220ms ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{ fontSize: '0.92rem', fontWeight: 700, letterSpacing: '-0.01em' }}>미리보기</span>
          {previewUrl ? (
            <span
              title={previewUrl}
              style={{
                fontSize: '0.74rem',
                color: '#94a3b8',
                background: 'rgba(255,255,255,0.06)',
                padding: '3px 10px',
                borderRadius: 999,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 360,
              }}
            >
              {previewUrl}
            </span>
          ) : null}
        </div>

        <div role="group" aria-label="디바이스 선택" style={{ display: 'inline-flex', gap: 6, padding: 4, borderRadius: 999, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['desktop', 'tablet', 'mobile'] as const).map((mode) => {
            const d = DEVICES[mode];
            const active = device === mode;
            return (
              <button
                key={mode}
                type="button"
                className="preview-device-btn"
                aria-pressed={active}
                onClick={() => setDevice(mode)}
              >
                <span aria-hidden style={{ fontSize: '0.92rem', lineHeight: 1 }}>{ICONS[mode]}</span>
                <span>{d.label}</span>
                <small>{d.width}</small>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" className="preview-action-btn" onClick={reload} title="새로고침 (⌘R)">
            <span aria-hidden>↻</span>
            <span>새로고침</span>
          </button>
          <button type="button" className="preview-action-btn" onClick={openInNewTab} disabled={!previewUrl} title="새 탭에서 열기">
            <span aria-hidden>↗</span>
            <span>새 탭</span>
          </button>
          <button type="button" className="preview-close-btn" onClick={onClose} aria-label="미리보기 닫기" title="닫기 (Esc)">
            ×
          </button>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 24px 32px',
          overflow: 'auto',
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          aria-hidden={false}
          style={{
            transform: `scale(${stageScale})`,
            transformOrigin: 'center center',
            transition: 'transform 200ms ease',
            animation: 'previewShellIn 260ms ease',
          }}
        >
          <DeviceFrame spec={spec}>
            {previewUrl ? (
              <iframe
                key={`${device}-${reloadKey}-${previewUrl}`}
                src={previewUrl}
                title={`Preview ${spec.label}`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                  background: '#fff',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#0f172a',
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                먼저 페이지를 발행해야 미리보기가 가능합니다.
              </div>
            )}
          </DeviceFrame>
        </div>
      </div>

      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 24px',
          color: '#94a3b8',
          fontSize: '0.74rem',
          letterSpacing: '0.01em',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span>
          {spec.width} × {spec.height}px · 스케일 {Math.round(stageScale * 100)}% · Esc 또는 외곽 클릭으로 닫기
        </span>
      </footer>
    </div>
  );
}

function DeviceFrame({
  spec,
  children,
}: {
  spec: DeviceSpec;
  children: React.ReactNode;
}) {
  if (spec.mode === 'desktop') {
    return (
      <div
        style={{
          background: '#fff',
          borderRadius: spec.radius,
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
          width: spec.width,
        }}
      >
        <div
          style={{
            height: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 14px',
            background: 'linear-gradient(180deg, #f1f5f9, #e2e8f0)',
            borderBottom: '1px solid #cbd5e1',
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.1)' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.1)' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.1)' }} />
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>preview</span>
        </div>
        <div style={{ width: spec.width, height: spec.height, background: '#fff' }}>{children}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        background: '#0f172a',
        borderRadius: spec.radius,
        padding: spec.bezel,
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.55), 0 0 0 2px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04)',
        width: spec.width + spec.bezel * 2,
      }}
    >
      {spec.notch ? (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: spec.bezel + 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 110,
            height: 26,
            borderRadius: 14,
            background: '#000',
            zIndex: 2,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        />
      ) : null}
      <div
        style={{
          width: spec.width,
          height: spec.height,
          background: '#fff',
          borderRadius: spec.radius - spec.bezel + 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>
      {spec.homeIndicator ? (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            bottom: spec.bezel - 2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 110,
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.6)',
          }}
        />
      ) : null}
    </div>
  );
}
