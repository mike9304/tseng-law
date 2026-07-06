'use client';

import { useMemo, useState } from 'react';
import { locales, type Locale } from '@/lib/locales';
import { getTranslationCopy } from './translation-copy';

interface Props {
  siteId: string;
  pageId: string;
  sourceLocale: Locale;
  defaultSlug: string;
  initialSlugByLocale: Partial<Record<Locale, string>>;
  /**
   * Render the editor as embedded UI inside the Translation Editor —
   * uses a compact two-row layout consistent with the SEO override section.
   */
  embedded?: boolean;
}

interface PatchResponse {
  ok?: boolean;
  error?: string;
  page?: { slugByLocale?: Partial<Record<Locale, string>> };
}

export default function LocaleSlugEditor({
  pageId,
  sourceLocale,
  defaultSlug,
  initialSlugByLocale,
  embedded = false,
}: Omit<Props, 'siteId'> & Partial<Pick<Props, 'siteId'>>) {
  const copy = getTranslationCopy(sourceLocale);
  const targetLocales = useMemo(
    () => locales.filter((candidate) => candidate !== sourceLocale),
    [sourceLocale],
  );
  const [slugs, setSlugs] = useState<Partial<Record<Locale, string>>>(
    () => ({ ...initialSlugByLocale }),
  );
  const [savingLocale, setSavingLocale] = useState<Locale | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function save(locale: Locale) {
    setSavingLocale(locale);
    setError('');
    setNotice('');
    try {
      const value = (slugs[locale] ?? '').trim();
      const slugByLocale: Partial<Record<Locale, string>> = {
        ...slugs,
        [locale]: value,
      };
      // Server expects undefined to mean "no override" — drop empty strings
      // so the persisted shape stays clean.
      if (value === '') delete slugByLocale[locale];
      const response = await fetch(
        `/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=${sourceLocale}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Keep title untouched — the route requires it, so echo a
            // sentinel that the route can resolve to the existing value.
            title: undefined,
            slugByLocale,
          }),
        },
      );
      const body = (await response.json().catch(() => null)) as PatchResponse | null;
      if (!response.ok || !body?.ok) {
        setError(body?.error ?? copy.editorSaveFailed);
        return;
      }
      setSlugs(body.page?.slugByLocale ?? slugByLocale);
      setNotice(copy.editorSavedSlug(locale));
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.editorSaveFailed);
    } finally {
      setSavingLocale(null);
    }
  }

  return (
    <section
      data-locale-slug-editor="true"
      style={{
        marginBottom: embedded ? 16 : 0,
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 16,
        background: '#f8fafc',
      }}
    >
      <h2 style={sectionHeading}>{copy.editorPerLanguageUrlSlug}</h2>
      <p style={{ fontSize: 12, color: '#475569', margin: '0 0 12px' }}>
        {copy.editorSourceSlugLabel} ({sourceLocale}): <code>{defaultSlug || '(home)'}</code>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {targetLocales.map((locale) => {
          const current = slugs[locale] ?? '';
          const isSaving = savingLocale === locale;
          return (
            <div
              key={locale}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 100px',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 12, color: '#475569' }}>{locale}</code>
              <input
                type="text"
                value={current}
                placeholder={defaultSlug}
                onChange={(event) =>
                  setSlugs((previous) => ({
                    ...previous,
                    [locale]: event.target.value,
                  }))
                }
                style={inputStyle}
                data-locale-slug-input={locale}
              />
              <button
                type="button"
                onClick={() => save(locale)}
                disabled={isSaving}
                style={btnPrimary}
                data-locale-slug-save={locale}
              >
                {isSaving ? copy.editorSaving : copy.editorSave}
              </button>
            </div>
          );
        })}
      </div>
      {notice && (
        <p style={{ fontSize: 12, color: '#166534', marginTop: 10 }}>{notice}</p>
      )}
      {error && (
        <p style={{ fontSize: 12, color: '#991b1b', marginTop: 10 }}>{error}</p>
      )}
    </section>
  );
}

const sectionHeading: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#1f2937',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  margin: '0 0 12px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  padding: '8px 10px',
  fontSize: 13,
  fontFamily: 'inherit',
  background: '#fff',
};

const btnPrimary: React.CSSProperties = {
  fontSize: 13,
  padding: '8px 14px',
  borderRadius: 6,
  border: '1px solid #123b63',
  background: '#123b63',
  color: '#fff',
  cursor: 'pointer',
};
