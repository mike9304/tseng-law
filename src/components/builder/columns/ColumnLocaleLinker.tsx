'use client';

import { useCallback, useState } from 'react';

const LOCALE_LABELS: Record<string, string> = {
  ko: '한국어',
  'zh-hant': '繁體中文',
  en: 'English',
};

interface ColumnLocaleLinkerProps {
  slug: string;
  locale: string;
  linkedSlugs: { ko?: string; 'zh-hant'?: string; en?: string };
  onSaveStatus?: (status: 'saving' | 'saved' | 'error') => void;
}

export default function ColumnLocaleLinker({
  slug,
  locale,
  linkedSlugs: initial,
  onSaveStatus,
}: ColumnLocaleLinkerProps) {
  const [links, setLinks] = useState(initial);

  const otherLocales = Object.keys(LOCALE_LABELS).filter((l) => l !== locale) as Array<'ko' | 'zh-hant' | 'en'>;

  const handleLink = useCallback(
    async (targetLocale: 'ko' | 'zh-hant' | 'en', targetSlug: string) => {
      const trimmed = targetSlug.trim();
      const newLinks = { ...links, [targetLocale]: trimmed || undefined };
      setLinks(newLinks);

      onSaveStatus?.('saving');
      try {
        const res = await fetch(
          `/api/builder/columns/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ linkedSlugs: newLinks }),
          },
        );
        onSaveStatus?.(res.ok ? 'saved' : 'error');

        if (res.ok && trimmed) {
          fetch(
            `/api/builder/columns/${encodeURIComponent(trimmed)}?locale=${encodeURIComponent(targetLocale)}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                linkedSlugs: { ...newLinks, [locale]: slug, [targetLocale]: undefined },
              }),
            },
          ).catch(() => {});
        }
      } catch {
        onSaveStatus?.('error');
      }
    },
    [slug, locale, links, onSaveStatus],
  );

  return (
    <aside className="column-frontmatter-panel" style={{ marginTop: '1rem' }}>
      <h3>다국어 연결</h3>
      {otherLocales.map((otherLocale) => (
        <label key={otherLocale} className="column-editor-field">
          <span>{LOCALE_LABELS[otherLocale]}</span>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <input
              type="text"
              value={links[otherLocale] || ''}
              placeholder="연결할 slug"
              onChange={(e) => {
                setLinks((prev) => ({ ...prev, [otherLocale]: e.target.value }));
              }}
              onBlur={(e) => handleLink(otherLocale, e.target.value)}
              style={{ flex: 1 }}
            />
            {links[otherLocale] && (
              <a
                href={`/${otherLocale}/admin-builder/columns/${links[otherLocale]}/edit`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: '#123b63',
                  whiteSpace: 'nowrap',
                }}
              >
                열기
              </a>
            )}
          </div>
        </label>
      ))}
    </aside>
  );
}
