import type { Locale } from '@/lib/locales';
import type {
  TranslationDashboardRow,
  TranslationDashboardSummary,
} from './dashboard-model';

export type {
  TranslationDashboardSummary,
} from './dashboard-model';

export function buildTranslationDashboardSummary(
  rows: TranslationDashboardRow[],
  targetLocales: Locale[],
): TranslationDashboardSummary {
  const totalPages = rows.length;
  const totalCells = totalPages * targetLocales.length;
  const summary: TranslationDashboardSummary = {
    totalPages,
    totalCells,
    untranslated: 0,
    draft: 0,
    published: 0,
    outdated: 0,
    needsAttention: 0,
    locales: targetLocales.map((locale) => ({
      locale,
      totalCells: totalPages,
      untranslated: 0,
      draft: 0,
      published: 0,
      outdated: 0,
      needsAttention: 0,
      completionRate: 0,
    })),
  };

  const localeIndex = new Map(
    summary.locales.map((entry, index) => [entry.locale, index] as const),
  );

  for (const row of rows) {
    for (const entry of row.entries) {
      summary[entry.status] += 1;
      const localeSummary = summary.locales[localeIndex.get(entry.locale) ?? 0];
      localeSummary[entry.status] += 1;
      if (entry.status !== 'published') {
        summary.needsAttention += 1;
        localeSummary.needsAttention += 1;
      }
    }
  }

  for (const localeSummary of summary.locales) {
    localeSummary.completionRate =
      localeSummary.totalCells === 0
        ? 0
        : Math.round((localeSummary.published / localeSummary.totalCells) * 100);
  }

  return summary;
}
