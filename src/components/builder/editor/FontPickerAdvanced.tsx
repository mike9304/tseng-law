'use client';

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { FONT_CATALOG, buildGoogleFontsUrl, fontFamilyCSS, type FontOption } from '@/lib/builder/canvas/fonts';
import type { Locale } from '@/lib/locales';
import { useBuilderTheme } from './BuilderThemeContext';
import { getTextControlsCopy } from './text-controls-copy';
import styles from './FontPickerAdvanced.module.css';

export interface FontPickerProps {
  value: string;
  onChange: (fontFamily: string) => void;
  disabled?: boolean;
  locale?: Locale;
}

type FontCategory = 'all' | FontOption['category'];

type FontPickerStyleVars = CSSProperties & {
  '--font-picker-current-family'?: string;
  '--font-picker-preview-family'?: string;
};

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function currentFontStyle(fontFamily: string): FontPickerStyleVars {
  return {
    '--font-picker-current-family': fontFamilyCSS(fontFamily),
  };
}

function previewFontStyle(fontFamily: string): FontPickerStyleVars {
  return {
    '--font-picker-preview-family': fontFamilyCSS(fontFamily),
  };
}

function highlight(text: string, query: string) {
  const normalized = query.trim();
  if (!normalized) return text;
  const index = text.toLowerCase().indexOf(normalized.toLowerCase());
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className={styles.highlight}>{text.slice(index, index + normalized.length)}</mark>
      {text.slice(index + normalized.length)}
    </>
  );
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => (
    !element.hidden &&
    !element.closest('[hidden]') &&
    element.getAttribute('aria-hidden') !== 'true' &&
    element.getClientRects().length > 0
  ));
}

export default function FontPickerAdvanced({
  value,
  onChange,
  disabled = false,
  locale = 'en',
}: FontPickerProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const closingRef = useRef(false);
  const theme = useBuilderTheme();
  const copy = getTextControlsCopy(locale);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FontCategory>('all');
  const [previewText, setPreviewText] = useState('Aa 안녕하세요 你好 Hello');
  const [fontLoadFailed, setFontLoadFailed] = useState(false);

  const siteFonts = useMemo(() => {
    const deduped = new Set<string>();
    return [theme.fonts.heading, theme.fonts.body]
      .filter((family): family is string => {
        if (!family || deduped.has(family)) return false;
        deduped.add(family);
        return true;
      })
      .map((family, index) => ({
        family,
        category: 'sans-serif' as const,
        note: index === 0 ? copy.fontPicker.notes.heading : copy.fontPicker.notes.body,
      }));
  }, [copy.fontPicker.notes.body, copy.fontPicker.notes.heading, theme.fonts.body, theme.fonts.heading]);

  const fontItems = useMemo(() => {
    const catalog = FONT_CATALOG.map((font) => ({
      family: font.family,
      category: font.category,
      note: font.cjk ? copy.fontPicker.notes.cjk : copy.fontPicker.notes.generic,
    }));
    const systemFonts = [
      { family: 'system-ui', category: 'sans-serif' as const, note: copy.fontPicker.notes.system },
      { family: 'sans-serif', category: 'sans-serif' as const, note: copy.fontPicker.notes.generic },
      { family: 'serif', category: 'serif' as const, note: copy.fontPicker.notes.generic },
      { family: 'monospace', category: 'monospace' as const, note: copy.fontPicker.notes.generic },
    ];
    const byFamily = new Map<string, { family: string; category: FontOption['category']; note?: string }>();
    [...systemFonts, ...siteFonts, ...catalog].forEach((font) => {
      if (!byFamily.has(font.family)) byFamily.set(font.family, font);
    });
    return Array.from(byFamily.values());
  }, [copy.fontPicker.notes, siteFonts]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredFonts = fontItems.filter((font) => {
    const matchesQuery = !normalizedQuery || font.family.toLowerCase().includes(normalizedQuery);
    const matchesCategory = category === 'all' || font.category === category;
    return matchesQuery && matchesCategory;
  });
  const currentFont = value || 'system-ui';

  const closePopover = () => {
    closingRef.current = true;
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return undefined;
    const handleWindowClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handleWindowClick, true);
    return () => window.removeEventListener('click', handleWindowClick, true);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    closingRef.current = false;
    const panel = panelRef.current;
    if (!panel) return undefined;

    const trigger = triggerRef.current;
    const focusFrame = window.requestAnimationFrame(() => {
      (searchInputRef.current ?? getFocusableElements(panel)[0] ?? panel).focus({ preventScroll: true });
    });
    const handleFocusIn = (event: FocusEvent) => {
      if (wrapperRef.current?.contains(event.target as Node | null)) return;
      (searchInputRef.current ?? getFocusableElements(panel)[0] ?? panel).focus({ preventScroll: true });
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('focusin', handleFocusIn);
      if (!closingRef.current) return;
      window.setTimeout(() => {
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        closingRef.current = false;
      }, 0);
    };
  }, [open]);

  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closePopover();
      return;
    }
    if (event.key !== 'Tab') return;

    const panel = panelRef.current;
    if (!panel) return;
    const focusable = getFocusableElements(panel);
    if (focusable.length === 0) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
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

  useEffect(() => {
    if (!open) return undefined;
    const visibleGoogleFonts = filteredFonts.slice(0, 32).map((font) => font.family);
    const url = buildGoogleFontsUrl(visibleGoogleFonts);
    if (!url) return undefined;
    const link = window.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.dataset.builderFontPreview = 'true';
    link.addEventListener('error', () => setFontLoadFailed(true), { once: true });
    window.document.head.appendChild(link);
    return () => link.remove();
  }, [filteredFonts, open]);

  return (
    <div ref={wrapperRef} className={styles.root} data-font-picker>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className={styles.trigger}
        style={currentFontStyle(currentFont)}
        onClick={() => {
          if (open) {
            closePopover();
            return;
          }
          setOpen(true);
        }}
      >
        {currentFont}
      </button>

      {open ? (
        <div
          ref={panelRef}
          className={styles.popover}
          role="dialog"
          aria-label={copy.fontPicker.dialogTitle}
          tabIndex={-1}
          data-builder-font-picker-dialog="true"
          data-builder-popover-dialog="true"
          onKeyDownCapture={handlePanelKeyDown}
        >
          <div className={styles.header}>
            <strong className={styles.title}>{copy.fontPicker.dialogTitle}</strong>
            <span className={styles.description}>{copy.fontPicker.dialogDescription}</span>
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={query}
            placeholder={copy.fontPicker.searchPlaceholder}
            autoFocus
            className={styles.textInput}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className={styles.categoryRow}>
            {(['all', 'sans-serif', 'serif', 'display', 'monospace'] as FontCategory[]).map((item) => (
              <button
                key={item}
                type="button"
                className={styles.categoryButton}
                data-active={item === category ? 'true' : undefined}
                onClick={() => setCategory(item)}
              >
                {copy.fontPicker.categories[item]}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={previewText}
            className={styles.previewInput}
            onChange={(event) => setPreviewText(event.target.value)}
            aria-label={copy.fontPicker.previewAriaLabel}
          />

          {fontLoadFailed ? (
            <span className={styles.loadError}>{copy.fontPicker.fontLoadFailed}</span>
          ) : null}

          <div className={styles.list}>
            {filteredFonts.length > 0 ? filteredFonts.map((font) => (
              <button
                key={`${font.family}-${font.note ?? 'font'}`}
                type="button"
                className={styles.fontOption}
                data-active={font.family === currentFont ? 'true' : undefined}
                onClick={() => {
                  onChange(font.family);
                  closePopover();
                }}
              >
                <span className={styles.fontOptionHeader}>
                  <strong className={styles.fontFamily}>{highlight(font.family, query)}</strong>
                  {font.note ? <em className={styles.fontNote}>{font.note}</em> : null}
                </span>
                <span className={styles.fontPreview} style={previewFontStyle(font.family)}>
                  {previewText}
                </span>
              </button>
            )) : (
              <div className={styles.emptyState}>{copy.fontPicker.noMatches}</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
