'use client';

import { useCallback, useEffect, useState } from 'react';
import { locales, type Locale } from '@/lib/locales';

interface LinkedPageInfo {
  pageId: string;
  locale: Locale;
  slug: string;
  title: string;
}

const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  'zh-hant': '繁體中文',
  en: 'English',
};

const dropdownContainerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
};

const triggerStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  minHeight: 34,
  padding: '0.2rem 0.8rem',
  borderRadius: 999,
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#334155',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'background 150ms ease, border-color 150ms ease',
};

const menuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: 4,
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,.12)',
  padding: 4,
  minWidth: 180,
  zIndex: 1000,
};

function menuItemStyle(active: boolean, disabled: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: 'none',
    background: active ? '#eff6ff' : 'transparent',
    color: disabled ? '#94a3b8' : active ? '#123b63' : '#334155',
    fontSize: '0.82rem',
    fontWeight: active ? 600 : 400,
    cursor: disabled ? 'default' : 'pointer',
    textAlign: 'left',
    transition: 'background 100ms ease',
  };
}

export default function LocaleSwitcher({
  currentLocale,
  activePageId,
  onLocaleChange,
}: {
  currentLocale: Locale;
  activePageId: string | null;
  onLocaleChange: (locale: Locale, linkedPageId: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [linkedPages, setLinkedPages] = useState<Record<string, LinkedPageInfo | null>>({});
  const [showCreatePrompt, setShowCreatePrompt] = useState<Locale | null>(null);

  // Fetch linked pages for current page
  useEffect(() => {
    if (!activePageId) return;
    let cancelled = false;

    async function fetchLinked() {
      try {
        const response = await fetch(
          `/api/builder/site/pages/${activePageId}/linked`,
          { credentials: 'same-origin' },
        );
        if (response.ok && !cancelled) {
          const data = (await response.json()) as { linkedPages: Record<string, LinkedPageInfo | null> };
          setLinkedPages(data.linkedPages ?? {});
        }
      } catch {
        // silent — linked pages API may not exist yet
      }
    }

    fetchLinked();
    return () => { cancelled = true; };
  }, [activePageId]);

  const handleLocaleClick = useCallback(
    (locale: Locale) => {
      if (locale === currentLocale) {
        setOpen(false);
        return;
      }

      const linked = linkedPages[locale];
      if (linked) {
        onLocaleChange(locale, linked.pageId);
        setOpen(false);
      } else {
        setShowCreatePrompt(locale);
        setOpen(false);
      }
    },
    [currentLocale, linkedPages, onLocaleChange],
  );

  const handleCreateLinkedPage = useCallback(
    async (locale: Locale) => {
      if (!activePageId) return;
      try {
        const response = await fetch('/api/builder/site/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            locale,
            slug: `page-${Date.now().toString(36)}`,
            title: `${LOCALE_LABELS[locale]} translation`,
            linkedFromPageId: activePageId,
          }),
        });
        if (response.ok) {
          const data = (await response.json()) as { pageId?: string };
          if (data.pageId) {
            onLocaleChange(locale, data.pageId);
          }
        }
      } catch {
        // silent fail
      } finally {
        setShowCreatePrompt(null);
      }
    },
    [activePageId, onLocaleChange],
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-locale-switcher]')) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handler, true);
    return () => window.removeEventListener('click', handler, true);
  }, [open]);

  return (
    <>
      <div style={dropdownContainerStyle} data-locale-switcher>
        <button
          type="button"
          style={triggerStyle}
          title="다국어 전환"
          onClick={() => setOpen((v) => !v)}
        >
          {LOCALE_LABELS[currentLocale] ?? currentLocale}
          <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>{open ? '\u25B2' : '\u25BC'}</span>
        </button>

        {open && (
          <div style={menuStyle}>
            {locales.map((loc) => {
              const isActive = loc === currentLocale;
              const linked = linkedPages[loc];
              const hasLinked = isActive || !!linked;
              return (
                <button
                  key={loc}
                  type="button"
                  style={menuItemStyle(isActive, false)}
                  onClick={() => handleLocaleClick(loc)}
                >
                  <span>{LOCALE_LABELS[loc]}</span>
                  {isActive && (
                    <span style={{ fontSize: '0.7rem', color: '#123b63', fontWeight: 700 }}>
                      current
                    </span>
                  )}
                  {!isActive && !hasLinked && (
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      no translation
                    </span>
                  )}
                  {!isActive && hasLinked && (
                    <span style={{ fontSize: '0.68rem', color: '#22c55e' }}>
                      linked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showCreatePrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 10000,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreatePrompt(null); }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 24px 64px rgba(0,0,0,.18)',
              padding: 32,
              maxWidth: 400,
              width: '90vw',
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              번역 페이지 없음
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 20 }}>
              이 locale ({LOCALE_LABELS[showCreatePrompt]}) 에 번역이 없습니다. 만들기?
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowCreatePrompt(null)}
                style={{ padding: '6px 16px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => handleCreateLinkedPage(showCreatePrompt)}
                style={{ padding: '6px 16px', background: '#123b63', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                만들기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
