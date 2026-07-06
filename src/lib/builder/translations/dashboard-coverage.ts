import type { Locale } from '@/lib/locales';
import type { TranslationEntry, TranslationStatus } from './types';

export type TranslationDashboardCoverageKind = 'cms' | 'media' | 'apps';

export type TranslationDashboardCoverageLocaleSummary = {
  readonly locale: Locale;
  readonly totalCells: number;
  readonly translated: number;
  readonly manual: number;
  readonly missing: number;
  readonly outdated: number;
  readonly needsAttention: number;
  readonly completionRate: number;
};

export type TranslationDashboardCoverageSummary = {
  readonly key: TranslationDashboardCoverageKind;
  readonly totalStrings: number;
  readonly totalCells: number;
  readonly translated: number;
  readonly manual: number;
  readonly missing: number;
  readonly outdated: number;
  readonly needsAttention: number;
  readonly completionRate: number;
  readonly locales: readonly TranslationDashboardCoverageLocaleSummary[];
};

const COVERAGE_KINDS: readonly TranslationDashboardCoverageKind[] = [
  'cms',
  'media',
  'apps',
] as const;

type MutableCoverageLocaleSummary = {
  locale: Locale;
  totalCells: number;
  translated: number;
  manual: number;
  missing: number;
  outdated: number;
  needsAttention: number;
  completionRate: number;
};

type MutableCoverageSummary = {
  key: TranslationDashboardCoverageKind;
  totalStrings: number;
  totalCells: number;
  translated: number;
  manual: number;
  missing: number;
  outdated: number;
  needsAttention: number;
  completionRate: number;
  locales: MutableCoverageLocaleSummary[];
};

function coverageKindForEntry(entry: TranslationEntry): TranslationDashboardCoverageKind | null {
  if (entry.content.contentType === 'node-image-alt') return 'media';
  if (entry.content.category === 'columns') return 'cms';
  if (entry.content.category === 'apps') return 'apps';
  return null;
}

function createLocaleSummary(locale: Locale, totalCells: number): MutableCoverageLocaleSummary {
  return {
    locale,
    totalCells,
    translated: 0,
    manual: 0,
    missing: 0,
    outdated: 0,
    needsAttention: 0,
    completionRate: 0,
  };
}

function addStatus(
  summary: Pick<MutableCoverageSummary, 'translated' | 'manual' | 'missing' | 'outdated' | 'needsAttention'>,
  status: TranslationStatus,
) {
  switch (status) {
    case 'translated':
      summary.translated += 1;
      return;
    case 'manual':
      summary.manual += 1;
      return;
    case 'missing':
      summary.missing += 1;
      summary.needsAttention += 1;
      return;
    case 'outdated':
      summary.outdated += 1;
      summary.needsAttention += 1;
      return;
  }
}

function completionRate(complete: number, total: number): number {
  return total === 0 ? 0 : Math.round((complete / total) * 100);
}

function finalizeSummary(summary: MutableCoverageSummary): TranslationDashboardCoverageSummary {
  summary.completionRate = completionRate(summary.translated + summary.manual, summary.totalCells);
  for (const localeSummary of summary.locales) {
    localeSummary.completionRate = completionRate(
      localeSummary.translated + localeSummary.manual,
      localeSummary.totalCells,
    );
  }
  return summary;
}

export function buildTranslationDashboardCoverageSummaries(
  entries: readonly TranslationEntry[],
  targetLocales: readonly Locale[],
): readonly TranslationDashboardCoverageSummary[] {
  return COVERAGE_KINDS.map((key) => {
    const scopedEntries = entries.filter((entry) => coverageKindForEntry(entry) === key);
    const summary: MutableCoverageSummary = {
      key,
      totalStrings: scopedEntries.length,
      totalCells: scopedEntries.length * targetLocales.length,
      translated: 0,
      manual: 0,
      missing: 0,
      outdated: 0,
      needsAttention: 0,
      completionRate: 0,
      locales: targetLocales.map((locale) => createLocaleSummary(locale, scopedEntries.length)),
    };

    for (const entry of scopedEntries) {
      for (const localeSummary of summary.locales) {
        const status = entry.translations[localeSummary.locale]?.status ?? 'missing';
        addStatus(summary, status);
        addStatus(localeSummary, status);
      }
    }

    return finalizeSummary(summary);
  });
}
