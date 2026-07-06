'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { TranslationEntry, TranslationStatus } from '@/lib/builder/translations/types';
import TranslationCell from './TranslationCell';
import { getTranslationCopy } from './translation-copy';
import styles from './TranslationManager.module.css';

const PAGE_SIZE = 100;

export default function TranslationMatrix({
  entries,
  sourceLocale,
  targetLocales,
  savingKeys,
  translatingKeys,
  onSave,
  onTranslate,
}: {
  entries: TranslationEntry[];
  sourceLocale: Locale;
  targetLocales: Locale[];
  savingKeys: Set<string>;
  translatingKeys: Set<string>;
  onSave: (key: string, locale: Locale, text: string, status: TranslationStatus) => Promise<void>;
  onTranslate: (entry: TranslationEntry, locale: Locale) => Promise<void>;
}) {
  const copy = getTranslationCopy(sourceLocale);
  // Deduplicate entries by key — the server can return duplicates (e.g.
  // the same string appearing in multiple content surfaces), which
  // triggers a React "two children with the same key" warning and
  // wastes DOM. Keep the first occurrence.
  const uniqueEntries = useMemo(() => {
    const seen = new Set<string>();
    const out: TranslationEntry[] = [];
    for (const entry of entries) {
      if (seen.has(entry.key)) continue;
      seen.add(entry.key);
      out.push(entry);
    }
    return out;
  }, [entries]);

  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(uniqueEntries.length / PAGE_SIZE));
  // Clamp page when the filtered set shrinks.
  useEffect(() => {
    if (page >= pageCount) setPage(0);
  }, [page, pageCount]);
  const visibleEntries = useMemo(
    () => uniqueEntries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [uniqueEntries, page],
  );

  if (uniqueEntries.length === 0) {
    return (
      <div className={styles.matrixWrap}>
        <div className={styles.empty}>{copy.matrixNoEntries}</div>
      </div>
    );
  }

  return (
    <div className={styles.matrixWrap}>
      <table className={styles.matrix}>
        <thead>
          <tr>
            <th>{copy.matrixContent}</th>
            <th>{copy.matrixSource} - {sourceLocale}</th>
            {targetLocales.map((locale) => (
              <th key={locale}>{copy.matrixTarget} - {locale}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleEntries.map((entry) => (
            <tr key={entry.key} data-translation-entry={entry.key}>
              <td className={styles.labelCell}>
                <div className={styles.rowLabel}>{entry.content.label}</div>
                <div className={styles.rowMeta}>{entry.content.contentType}</div>
              </td>
              <td className={styles.sourceCell}>{entry.sourceText}</td>
              {targetLocales.map((locale) => {
                const operationKey = `${entry.key}:${locale}`;
                return (
                  <td className={styles.translationCell} key={operationKey}>
                    <TranslationCell
                      entry={entry}
                      locale={locale}
                      saving={savingKeys.has(operationKey)}
                      translating={translatingKeys.has(operationKey)}
                      onSave={onSave}
                      onTranslate={onTranslate}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {pageCount > 1 ? (
        <nav
          aria-label="Translation pagination"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '12px 16px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
          }}
        >
          <span style={{ color: '#475569', fontSize: 13 }}>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, uniqueEntries.length)} / {uniqueEntries.length}
          </span>
          <div style={{ display: 'inline-flex', gap: 4 }}>
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: page === 0 ? '#e2e8f0' : '#ffffff',
                color: '#0f172a',
                fontSize: 13,
                fontWeight: 600,
                cursor: page === 0 ? 'default' : 'pointer',
              }}
            >
              ← Prev
            </button>
            <span style={{ alignSelf: 'center', padding: '0 8px', color: '#0f172a', fontSize: 13, fontWeight: 700 }}>
              {page + 1} / {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: page >= pageCount - 1 ? '#e2e8f0' : '#ffffff',
                color: '#0f172a',
                fontSize: 13,
                fontWeight: 600,
                cursor: page >= pageCount - 1 ? 'default' : 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
