import type { Locale } from '@/lib/locales';
import type { TranslationEntry, TranslationStatus } from './types';
import { getTranslationStatus, translationStatuses } from './types';

export interface TranslationReviewLocaleSummary {
  locale: Locale;
  total: number;
  translated: number;
  manual: number;
  outdated: number;
  missing: number;
  batchCandidates: number;
}

export interface TranslationReviewSummary {
  totalEntries: number;
  locales: TranslationReviewLocaleSummary[];
  statusCounts: Record<TranslationStatus, number>;
}

export function buildTranslationReviewSummary(
  entries: TranslationEntry[],
  targetLocales: Locale[],
): TranslationReviewSummary {
  const statusCounts: Record<TranslationStatus, number> = {
    translated: 0,
    outdated: 0,
    missing: 0,
    manual: 0,
  };

  for (const entry of entries) {
    for (const locale of targetLocales) {
      const status = getTranslationStatus(entry, locale);
      statusCounts[status] += 1;
    }
  }

  const locales = targetLocales.map((locale) => {
    let translated = 0;
    let manual = 0;
    let outdated = 0;
    let missing = 0;
    for (const entry of entries) {
      const status = getTranslationStatus(entry, locale);
      if (status === 'translated') translated += 1;
      if (status === 'manual') manual += 1;
      if (status === 'outdated') outdated += 1;
      if (status === 'missing') missing += 1;
    }

    return {
      locale,
      total: entries.length,
      translated,
      manual,
      outdated,
      missing,
      batchCandidates: missing + outdated,
    };
  });

  return {
    totalEntries: entries.length,
    locales,
    statusCounts,
  };
}

export function countTranslationStatuses(
  entries: TranslationEntry[],
  targetLocales: Locale[],
): number {
  return buildTranslationReviewSummary(entries, targetLocales).locales
    .reduce((sum, locale) => sum + locale.batchCandidates, 0);
}

export function translationReviewStatusOrder(): TranslationStatus[] {
  return [...translationStatuses];
}
