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
import { useBuilderTheme } from './BuilderThemeContext';

export interface FontPickerProps {
  value: string;
  onChange: (fontFamily: string) => void;
  disabled?: boolean;
}

type FontCategory = 'all' | FontOption['category'];

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const SYSTEM_FONTS = [
  { family: 'system-ui', category: 'sans-serif' as const, note: 'System' },
  { family: 'sans-serif', category: 'sans-serif' as const, note: 'Generic' },
  { family: 'serif', category: 'serif' as const, note: 'Generic' },
  { family: 'monospace', category: 'monospace' as const, note: 'Generic' },
];

const wrapperStyle: CSSProperties = {
  position: 'relative',
  width: 220,
  maxWidth: '100%',
};

const triggerStyle: CSSProperties = {
  width: '100%',
  minHeight: 36,
  padding: '8px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  background: '#fff',
  color: '#0f172a',
  fontSize: 13,
  fontWeight: 750,
  textAlign: 'left',
  cursor: 'pointer',
};

const popoverStyle: CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  zIndex: 70,
  display: 'grid',
  gap: 10,
  width: 320,
  maxWidth: 'min(320px, calc(100vw - 32px))',
  maxHeight: 460,
  overflow: 'hidden',
  padding: 12,
  border: '1px solid rgba(15, 23, 42, 0.12)',
  borderRadius: 16,
  background: '#fff',
  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22)',
};

const listStyle: CSSProperties = {
  display: 'grid',
  gap: 5,
  maxHeight: 270,
  overflowY: 'auto',
  paddingRight: 2,
};

function categoryLabel(category: FontCategory): string {
  if (category === 'all') return 'All';
  if (category === 'sans-serif') return 'Sans';
  if (category === 'monospace') return 'Mono';
  return category[0]!.toUpperCase() + category.slice(1);
}

function highlight(text: string, query: string) {
  const normalized = query.trim();
  if (!normalized) return text;
  const index = text.toLowerCase().indexOf(normalized.toLowerCase());
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark style={{ background: '#fef08a', color: 'inherit', padding: 0 }}>{text.slice(index, index + normalized.length)}</mark>
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
}: FontPickerProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const closingRef = useRef(false);
  const theme = useBuilderTheme();
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
        note: index === 0 ? 'Heading' : 'Body',
      }));
  }, [theme.fonts.body, theme.fonts.heading]);

  const fontItems = useMemo(() => {
    const catalog = FONT_CATALOG.map((font) => ({
      family: font.family,
      category: font.category,
      note: font.cjk ? 'CJK' : font.category,
    }));
    const byFamily = new Map<string, { family: string; category: FontOption['category']; note?: string }>();
    [...SYSTEM_FONTS, ...siteFonts, ...catalog].forEach((font) => {
      if (!byFamily.has(font.family)) byFamily.set(font.family, font);
    });
    return Array.from(byFamily.values());
  }, [siteFonts]);

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
        if (triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true });
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
    <div ref={wrapperRef} style={wrapperStyle} data-font-picker>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        style={{
          ...triggerStyle,
          fontFamily: fontFamilyCSS(currentFont),
          opacity: disabled ? 0.6 : 1,
        }}
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
          style={popoverStyle}
          role="dialog"
          aria-label="Advanced font picker"
          tabIndex={-1}
          data-builder-font-picker-dialog="true"
          data-builder-popover-dialog="true"
          onKeyDownCapture={handlePanelKeyDown}
        >
          <div style={{ display: 'grid', gap: 4 }}>
            <strong style={{ color: '#0f172a', fontSize: 13 }}>Fonts</strong>
            <span style={{ color: '#64748b', fontSize: 11 }}>
              Search, filter, and preview site and Google fonts
            </span>
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={query}
            placeholder="Search fonts"
            autoFocus
            style={{
              minHeight: 34,
              padding: '7px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 9,
              color: '#0f172a',
              fontSize: 13,
              outline: 'none',
            }}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(['all', 'sans-serif', 'serif', 'display', 'monospace'] as FontCategory[]).map((item) => (
              <button
                key={item}
                type="button"
                style={{
                  minHeight: 28,
                  padding: '0 9px',
                  border: item === category ? '1px solid #116dff' : '1px solid #cbd5e1',
                  borderRadius: 999,
                  background: item === category ? '#eff6ff' : '#fff',
                  color: item === category ? '#1d4ed8' : '#475569',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                onClick={() => setCategory(item)}
              >
                {categoryLabel(item)}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={previewText}
            style={{
              minHeight: 32,
              padding: '6px 9px',
              border: '1px solid #e2e8f0',
              borderRadius: 9,
              color: '#334155',
              fontSize: 12,
            }}
            onChange={(event) => setPreviewText(event.target.value)}
            aria-label="Font preview text"
          />

          {fontLoadFailed ? (
            <span style={{ color: '#92400e', fontSize: 11 }}>Google Fonts failed. Showing local fallbacks.</span>
          ) : null}

          <div style={listStyle}>
            {filteredFonts.length > 0 ? filteredFonts.map((font) => (
              <button
                key={`${font.family}-${font.note ?? 'font'}`}
                type="button"
                style={{
                  width: '100%',
                  minHeight: 44,
                  padding: '7px 10px',
                  border: font.family === currentFont ? '1px solid #116dff' : '1px solid transparent',
                  borderRadius: 11,
                  background: font.family === currentFont ? '#eff6ff' : '#fff',
                  color: '#0f172a',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => {
                  onChange(font.family);
                  closePopover();
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <strong style={{ fontSize: 13 }}>{highlight(font.family, query)}</strong>
                  {font.note ? <em style={{ color: '#64748b', fontSize: 11, fontStyle: 'normal' }}>{font.note}</em> : null}
                </span>
                <span style={{ display: 'block', marginTop: 3, color: '#475569', fontFamily: fontFamilyCSS(font.family), fontSize: 14 }}>
                  {previewText}
                </span>
              </button>
            )) : (
              <div style={{ padding: 10, color: '#94a3b8', fontSize: 12 }}>No matching fonts.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
