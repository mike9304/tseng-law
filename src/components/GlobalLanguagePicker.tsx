'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  isRtlPublicLocale,
  publicDocumentLanguage,
  resolvePublicLanguageSwitchTarget,
  type PublicLanguageSwitchOptions,
  type PublicLocale8,
} from '@/lib/public-guidance';
import {
  groupedPublicLanguages,
  LANGUAGE_PICKER_COPY,
  PUBLIC_LANGUAGE_REGISTRY,
} from '@/lib/public-language-registry';
import { fallbackLanguageNotice, localeFlagHref } from '@/components/LocaleFlagSwitcher';
import {
  usePublicColumnSlugs,
  type PublicColumnSlugsByLocale,
} from '@/components/PublicColumnSlugsContext';
import {
  resolvePublishedOverlayOpener,
  usePublishedOverlayFocus,
} from '@/components/builder/published/overlayFocus';
import styles from './GlobalLanguagePicker.module.css';

export type GlobalLanguagePickerProps = {
  locale: PublicLocale8;
  className?: string;
  onBeforeOpen?: () => void;
  onClosed?: () => void;
  returnFocusTo?: () => HTMLElement | null;
};

export function closeLanguagePickerOnEscape(
  event: { key: string; preventDefault: () => void; stopPropagation: () => void },
  onClose: () => void,
): void {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  event.stopPropagation();
  onClose();
}

function dismissOpenSearchOverlay(): void {
  if (typeof document === 'undefined') return;
  document.querySelector<HTMLElement>('.search-overlay[data-open="true"]')?.click();
}

function resolvePickerInertRoot(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  const nextRoot = document.getElementById('__next');
  if (nextRoot instanceof HTMLElement) return nextRoot;
  const siteRoot = document.querySelector('.site');
  return siteRoot instanceof HTMLElement ? siteRoot : null;
}

function GlobeIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className={styles.check} viewBox="0 0 16 16" aria-hidden>
      <polyline points="2.5 8.5 6.2 12.2 13.5 3.8" />
    </svg>
  );
}

export function GlobalLanguagePickerView({
  locale,
  pathname,
  columnSlugsByLocale,
  className,
  open,
  onOpen,
  onClose,
  onBeforeOpen,
  onClosed,
  returnFocusTo,
}: GlobalLanguagePickerProps & {
  pathname: string;
  columnSlugsByLocale?: PublicColumnSlugsByLocale | null;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const copy = LANGUAGE_PICKER_COPY[locale];
  const titleId = useId();
  const currentAutonym =
    PUBLIC_LANGUAGE_REGISTRY.find((entry) => entry.locale === locale)?.autonym ?? locale;
  const switchOptions: PublicLanguageSwitchOptions | undefined = columnSlugsByLocale
    ? { columnSlugsByLocale }
    : undefined;
  const groups = groupedPublicLanguages(locale);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const rootClassName = [styles.root, className].filter(Boolean).join(' ');

  const captureTriggerAsOpener = useCallback(() => {
    const custom = returnFocusTo?.();
    if (custom) {
      openerRef.current = custom;
      return;
    }
    const trigger = triggerRef.current;
    openerRef.current = resolvePublishedOverlayOpener(trigger) ?? trigger;
  }, [returnFocusTo]);

  const restoreTriggerFocus = useCallback(() => {
    const custom = returnFocusTo?.();
    if (custom) {
      custom.focus();
      return;
    }
    triggerRef.current?.focus();
  }, [returnFocusTo]);

  const handleClose = useCallback(() => {
    onClose();
    restoreTriggerFocus();
    onClosed?.();
    if (typeof window !== 'undefined') {
      window.setTimeout(restoreTriggerFocus, 0);
    }
  }, [onClose, onClosed, restoreTriggerFocus]);

  const handleOpen = useCallback(() => {
    dismissOpenSearchOverlay();
    captureTriggerAsOpener();
    onBeforeOpen?.();
    onOpen();
  }, [captureTriggerAsOpener, onBeforeOpen, onOpen]);

  useLayoutEffect(() => {
    if (open) {
      captureTriggerAsOpener();
      wasOpenRef.current = true;
      return;
    }
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    restoreTriggerFocus();
  }, [captureTriggerAsOpener, open, restoreTriggerFocus]);

  usePublishedOverlayFocus({
    open,
    overlayRef,
    initialFocusRef: closeButtonRef,
    openerRef,
  });

  const handleOverlayKeyDown = useCallback(
    (event: { key: string; preventDefault: () => void; stopPropagation: () => void }) => {
      closeLanguagePickerOnEscape(event, handleClose);
    },
    [handleClose],
  );

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      handleOverlayKeyDown(event);
    };
    document.addEventListener('keydown', handler, true);
    return () => document.removeEventListener('keydown', handler, true);
  }, [handleOverlayKeyDown, open]);

  useEffect(() => {
    if (!open) return;
    const root = resolvePickerInertRoot();
    if (!root) return;
    const hadInert = root.hasAttribute('inert');
    root.setAttribute('inert', '');
    return () => {
      if (hadInert) {
        root.setAttribute('inert', '');
        return;
      }
      root.removeAttribute('inert');
    };
  }, [open]);

  const overlay = open ? (
    <div ref={overlayRef} className={styles.overlay} onClick={handleClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir={isRtlPublicLocale(locale) ? 'rtl' : undefined}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleOverlayKeyDown}
      >
        <div className={styles.header}>
          <h2 className={styles.title} id={titleId}>
            {copy.title}
          </h2>
          <button
            ref={closeButtonRef}
            className={styles.close}
            type="button"
            onClick={handleClose}
            aria-label={copy.close}
          >
            ×
          </button>
        </div>
        <div className={styles.regions}>
          {groups.map((group) => (
            // Regions stack full width and each list wraps into as many
            // columns as fit. Europe carries 19 of the 31 languages; in a
            // narrow region column that became one tall list the reader had to
            // scroll past.
            <section key={group.region} data-region={group.region}>
              <h3 className={styles.regionTitle}>{group.heading}</h3>
              <ul className={styles.list}>
                {group.entries.map((entry) => {
                  const switchTarget = resolvePublicLanguageSwitchTarget(
                    pathname,
                    entry.locale,
                    switchOptions,
                  );
                  const href = localeFlagHref(pathname, entry.locale, switchOptions);
                  const isCurrent = locale === entry.locale;
                  const isFallback = switchTarget.fallback !== 'exact';
                  const notice = isFallback
                    ? fallbackLanguageNotice(locale, entry.locale)
                    : undefined;

                  return (
                    <li key={entry.locale}>
                      <Link
                        href={href}
                        className={styles.item}
                        lang={publicDocumentLanguage(entry.locale)}
                        dir={isRtlPublicLocale(entry.locale) ? 'rtl' : undefined}
                        aria-current={isCurrent ? 'page' : undefined}
                        aria-label={notice ? `${entry.autonym}. ${notice}` : undefined}
                        title={notice}
                        onClick={handleClose}
                      >
                        <span className={styles.autonym}>
                          {isCurrent ? <CheckIcon /> : null}
                          {entry.autonym}
                          {isCurrent ? (
                            <span className={styles.badge}>{copy.current}</span>
                          ) : null}
                        </span>
                        <span className={styles.englishName}>{entry.englishName}</span>
                        {notice ? <span className={styles.notice}>{notice}</span> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className={rootClassName}>
        <button
          ref={triggerRef}
          className={styles.trigger}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`${copy.open}: ${currentAutonym}`}
          onClick={open ? handleClose : handleOpen}
        >
          <GlobeIcon />
          <span className={styles.currentLabel}>{currentAutonym}</span>
        </button>
      </div>
      {overlay
        ? typeof document === 'undefined'
          ? overlay
          : createPortal(overlay, document.body)
        : null}
    </>
  );
}

export default function GlobalLanguagePicker(props: GlobalLanguagePickerProps) {
  const pathname = usePathname() ?? `/${props.locale}`;
  const columnSlugsByLocale = usePublicColumnSlugs();
  const [open, setOpen] = useState(false);

  return (
    <GlobalLanguagePickerView
      {...props}
      pathname={pathname}
      columnSlugsByLocale={columnSlugsByLocale}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    />
  );
}
