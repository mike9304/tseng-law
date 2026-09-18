'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  resolvePublicLanguageSwitchTarget,
  type PublicLanguageSwitchOptions,
  type PublicLocale8,
} from '@/lib/public-guidance';
import {
  groupedPublicLanguages,
  LANGUAGE_PICKER_COPY,
  PUBLIC_LANGUAGE_REGISTRY,
  publicLanguageHtmlLang,
} from '@/lib/public-language-registry';
import { fallbackLanguageNotice } from '@/components/LocaleFlagSwitcher';
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
    const trigger = triggerRef.current;
    openerRef.current = resolvePublishedOverlayOpener(trigger) ?? trigger;
  }, []);

  const restoreTriggerFocus = useCallback(() => {
    triggerRef.current?.focus();
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    restoreTriggerFocus();
    if (typeof window !== 'undefined') {
      window.setTimeout(restoreTriggerFocus, 0);
    }
  }, [onClose, restoreTriggerFocus]);

  const handleOpen = useCallback(() => {
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

  const overlay = open ? (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleClose}
      onKeyDown={handleOverlayKeyDown}
    >
      <div
        className={styles.panel}
        dir={locale === 'ar' ? 'rtl' : undefined}
        onClick={(event) => event.stopPropagation()}
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
            <section key={group.region}>
              <h3 className={styles.regionTitle}>{group.heading}</h3>
              <ul className={styles.list}>
                {group.entries.map((entry) => {
                  const switchTarget = resolvePublicLanguageSwitchTarget(
                    pathname,
                    entry.locale,
                    switchOptions,
                  );
                  const isCurrent = locale === entry.locale;
                  const isFallback = switchTarget.fallback !== 'exact';
                  const notice = isFallback
                    ? fallbackLanguageNotice(locale, entry.locale)
                    : undefined;

                  return (
                    <li key={entry.locale}>
                      <Link
                        href={switchTarget.href}
                        className={styles.item}
                        lang={publicLanguageHtmlLang(entry.locale)}
                        aria-current={isCurrent ? true : undefined}
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
                        <span className={styles.regionLabel}>{entry.regionLabel}</span>
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
          aria-label={copy.open}
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
