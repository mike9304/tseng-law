'use client';

import type { Locale } from '@/lib/locales';
import type { TranslationEntry, TranslationStatus } from '@/lib/builder/translations/types';
import TranslationCell from './TranslationCell';
import styles from './TranslationManager.module.css';

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
  if (entries.length === 0) {
    return (
      <div className={styles.matrixWrap}>
        <div className={styles.empty}>No translation entries match the current filters.</div>
      </div>
    );
  }

  return (
    <div className={styles.matrixWrap}>
      <table className={styles.matrix}>
        <thead>
          <tr>
            <th>Content</th>
            <th>Source - {sourceLocale}</th>
            {targetLocales.map((locale) => (
              <th key={locale}>Target - {locale}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.key}>
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
    </div>
  );
}
