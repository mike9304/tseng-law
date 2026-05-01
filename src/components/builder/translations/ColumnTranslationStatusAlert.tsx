'use client';

import { useEffect, useState } from 'react';
import type { TranslationManagerPayload } from '@/lib/builder/translations/types';

export default function ColumnTranslationStatusAlert({
  slug,
  routeLocale,
}: {
  slug: string;
  routeLocale: string;
}) {
  const [summary, setSummary] = useState<{ missing: number; outdated: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch('/api/builder/translations?sourceLocale=ko', {
          credentials: 'same-origin',
        });
        if (!response.ok || cancelled) return;
        const payload = await response.json() as TranslationManagerPayload;
        let missing = 0;
        let outdated = 0;
        for (const entry of payload.entries) {
          if (entry.content.columnSlug !== slug) continue;
          for (const locale of payload.targetLocales) {
            const status = entry.translations[locale]?.status ?? 'missing';
            if (status === 'missing') missing += 1;
            if (status === 'outdated') outdated += 1;
          }
        }
        setSummary({ missing, outdated });
      } catch {
        // Keep the editor usable if Translation Manager is unavailable.
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [slug]);

  if (!summary || (summary.missing === 0 && summary.outdated === 0)) return null;

  return (
    <a
      href={`/${routeLocale}/admin-builder/translations?category=columns`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        minHeight: 32,
        padding: '0 10px',
        borderRadius: 8,
        border: '1px solid #fde68a',
        background: '#fffbeb',
        color: '#92400e',
        fontSize: '0.78rem',
        fontWeight: 700,
        textDecoration: 'none',
      }}
      title="Translation Manager에서 이 칼럼의 번역 상태를 확인합니다."
    >
      번역 필요
      <span>
        {summary.outdated} outdated / {summary.missing} missing
      </span>
    </a>
  );
}
