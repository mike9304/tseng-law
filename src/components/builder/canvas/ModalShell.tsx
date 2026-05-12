'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './ModalShell.module.css';

export type ModalShellSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalShellTone = 'default' | 'neutral';

export interface ModalShellAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}

export interface ModalShellProps {
  open?: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  size?: ModalShellSize;
  tone?: ModalShellTone;
  nested?: boolean;
  dismissable?: boolean;
  toolbar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  footerHint?: ReactNode;
  actions?: ModalShellAction[];
  className?: string;
  bodyFlush?: boolean;
  fullViewport?: boolean;
  ariaLabel?: string;
  panelRef?: MutableRefObject<HTMLDivElement | null>;
}

const SIZE_WIDTHS: Record<ModalShellSize, string> = {
  sm: 'min(440px, 92vw)',
  md: 'min(560px, 92vw)',
  lg: 'min(760px, 92vw)',
  xl: 'min(1080px, 94vw)',
  full: '90vw',
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

const scrollLock = (() => {
  let count = 0;
  let savedOverflow = '';
  let savedPaddingRight = '';
  return {
    acquire() {
      if (typeof document === 'undefined') return;
      if (count === 0) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        savedOverflow = document.body.style.overflow;
        savedPaddingRight = document.body.style.paddingRight;
        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      count += 1;
    },
    release() {
      if (typeof document === 'undefined') return;
      count = Math.max(0, count - 1);
      if (count === 0) {
        document.body.style.overflow = savedOverflow;
        document.body.style.paddingRight = savedPaddingRight;
      }
    },
  };
})();

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function getFocusableElements(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((node) => (
    !node.hasAttribute('disabled') &&
    node.tabIndex !== -1 &&
    !node.hidden &&
    !node.closest('[hidden]') &&
    node.getAttribute('aria-hidden') !== 'true' &&
    node.getClientRects().length > 0
  ));
}

function getActionStyle(variant: ModalShellAction['variant']): string {
  if (variant === 'primary') return styles.actionPrimary;
  if (variant === 'danger') return styles.actionDanger;
  if (variant === 'warning') return styles.actionWarning;
  if (variant === 'ghost') return styles.actionGhost;
  return styles.actionSecondary;
}

export default function ModalShell({
  open = true,
  onClose,
  title,
  subtitle,
  description,
  size = 'md',
  tone = 'default',
  nested = false,
  dismissable = true,
  toolbar,
  children,
  footer,
  footerHint,
  actions,
  className,
  bodyFlush = false,
  fullViewport = false,
  ariaLabel,
  panelRef,
}: ModalShellProps) {
  const titleId = useId();
  const subtitleId = useId();
  const internalPanelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useMemo(() => prefersReducedMotion(), []);
  const resolvedSubtitle = subtitle ?? description;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    scrollLock.acquire();
    return () => scrollLock.release();
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !mounted) return undefined;
    restoreFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    const panel = internalPanelRef.current;
    if (panel) {
      const focusables = getFocusableElements(panel);
      (focusables[0] ?? panel).focus({ preventScroll: true });
    }
    return () => {
      const previous = restoreFocusRef.current;
      if (previous && typeof previous.focus === 'function') {
        try {
          previous.focus({ preventScroll: true });
        } catch {
          // Ignore detached focus target.
        }
      }
    };
  }, [mounted, open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event: KeyboardEvent) {
      const currentShell = internalPanelRef.current?.closest('[data-modal-shell="true"]');
      const modalShells = Array.from(document.querySelectorAll('[data-modal-shell="true"]'));
      const topmostShell = modalShells[modalShells.length - 1] ?? null;
      if (currentShell && topmostShell && currentShell !== topmostShell) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (!dismissable) return;
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = internalPanelRef.current;
      if (!panel) return;
      const nodes = getFocusableElements(panel);
      if (nodes.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || active === panel) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
    function handleFocusIn(event: FocusEvent) {
      const panel = internalPanelRef.current;
      if (!panel) return;
      const currentShell = panel.closest('[data-modal-shell="true"]');
      const modalShells = Array.from(document.querySelectorAll('[data-modal-shell="true"]'));
      const topmostShell = modalShells[modalShells.length - 1] ?? null;
      if (currentShell && topmostShell && currentShell !== topmostShell) return;
      if (panel.contains(event.target as Node | null)) return;
      const nodes = getFocusableElements(panel);
      (nodes[0] ?? panel).focus({ preventScroll: true });
    }
    window.addEventListener('keydown', handleKey, true);
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      window.removeEventListener('keydown', handleKey, true);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [dismissable, onClose, open]);

  const handleBackdropClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!dismissable) return;
      if (event.target === event.currentTarget) onClose();
    },
    [dismissable, onClose],
  );

  const setPanel = useCallback(
    (node: HTMLDivElement | null) => {
      internalPanelRef.current = node;
      if (panelRef) panelRef.current = node;
    },
    [panelRef],
  );

  if (!open || !mounted) return null;

  const shell = (
    <div
      className={[styles.backdrop, nested ? styles.backdropNested : '', className ?? ''].filter(Boolean).join(' ')}
      data-modal-shell="true"
      data-modal-nested={nested ? 'true' : 'false'}
      data-modal-tone={tone}
      data-reduce-motion={reduceMotion ? 'true' : 'false'}
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={setPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={resolvedSubtitle ? subtitleId : undefined}
        aria-label={ariaLabel}
        tabIndex={-1}
        className={[
          styles.panel,
          tone === 'neutral' ? styles.panelNeutral : '',
          fullViewport || size === 'full' ? styles.panelFull : '',
        ].filter(Boolean).join(' ')}
        style={{ width: fullViewport ? '90vw' : SIZE_WIDTHS[size] }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h2 id={titleId} className={styles.title}>{title}</h2>
            {resolvedSubtitle ? <p id={subtitleId} className={styles.subtitle}>{resolvedSubtitle}</p> : null}
          </div>
          <button type="button" aria-label="Close" className={styles.closeButton} onClick={onClose} disabled={!dismissable}>
            <span aria-hidden>x</span>
          </button>
        </header>

        {toolbar ? <div className={styles.toolbar}>{toolbar}</div> : null}

        <div className={[styles.body, bodyFlush ? styles.bodyFlush : ''].filter(Boolean).join(' ')}>
          {children}
        </div>

        {footer ? (
          <footer className={styles.footer}>{footer}</footer>
        ) : actions?.length || footerHint ? (
          <footer className={styles.footer}>
            <div className={styles.footerHint}>{footerHint}</div>
            <div className={styles.actions}>
              {actions?.map((action, index) => (
                <button
                  key={`${action.label}-${index}`}
                  type="button"
                  className={[styles.actionButton, getActionStyle(action.variant)].join(' ')}
                  disabled={action.disabled || action.loading}
                  aria-label={action.ariaLabel ?? action.label}
                  onClick={action.onClick}
                >
                  {action.loading ? <span className={styles.spinner} aria-hidden /> : null}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </footer>
        ) : null}
      </div>
    </div>
  );

  return createPortal(shell, document.body);
}
