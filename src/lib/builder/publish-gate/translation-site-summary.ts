import { createHash } from 'node:crypto';
import { defaultLocale, locales, type Locale } from '@/lib/locales';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import { buildTranslationPublishWarnings } from '@/lib/builder/translations/publish-warnings';
import type { TranslationPublishWarning } from '@/lib/builder/translations/publish-warning-types';
import { buildTranslationManagerQuery } from '@/lib/builder/translations/query';

export interface TranslationSiteWarningSummary {
  readonly sourceLocale: Locale;
  readonly syncedAt: string;
  readonly totalCount: number;
  readonly currentPageCount: number;
  readonly otherPageCount: number;
  readonly warningCount: number;
  readonly errorCount: number;
  readonly reviewHref: string;
  readonly warningFingerprint: string;
}

function buildTranslationSiteReviewHref(sourceLocale: Locale): string {
  const targetLocales = locales.filter((locale) => locale !== sourceLocale);
  const query = buildTranslationManagerQuery({
    sourceLocale,
    selectedCategory: 'pages',
    search: '',
    statusFilter: 'all',
    visibleTargets: targetLocales,
    allTargetLocales: targetLocales,
  });
  return `/${sourceLocale}/admin-builder/translations?${query}`;
}

function buildWarningFingerprint(warnings: readonly TranslationPublishWarning[]): string {
  const stable = warnings
    .map((warning) => [
      warning.severity,
      warning.kind,
      warning.pageId,
      warning.locale,
      warning.message,
    ].join('\u001f'))
    .sort()
    .join('\n');
  return createHash('sha256').update(stable).digest('hex').slice(0, 32);
}

export function buildTranslationSiteWarningSummary(
  site: BuilderSiteDocument,
  currentPageId: string,
  sourceLocale: Locale = defaultLocale,
  syncedAt: string = new Date().toISOString(),
): TranslationSiteWarningSummary {
  const warnings = buildTranslationPublishWarnings(site, sourceLocale);
  const currentPageCount = warnings.filter((warning) => warning.pageId === currentPageId).length;
  const errorCount = warnings.filter((warning) => warning.severity === 'error').length;

  return {
    sourceLocale,
    syncedAt,
    totalCount: warnings.length,
    currentPageCount,
    otherPageCount: warnings.length - currentPageCount,
    warningCount: warnings.length - errorCount,
    errorCount,
    reviewHref: buildTranslationSiteReviewHref(sourceLocale),
    warningFingerprint: buildWarningFingerprint(warnings),
  };
}
