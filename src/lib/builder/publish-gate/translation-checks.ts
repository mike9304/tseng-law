import { defaultLocale, type Locale } from '@/lib/locales';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import {
  buildTranslationPublishWarnings,
  type TranslationPublishWarning,
} from '@/lib/builder/translations/publish-warnings';
import { buildTranslationPublishWarningReviewQuery } from '@/lib/builder/translations/query';
import type { CheckResult } from './check-types';

function warningId(warning: TranslationPublishWarning): string {
  return `translation-${warning.kind}-${warning.pageId}-${warning.locale}`;
}

function severityForWarning(warning: TranslationPublishWarning): CheckResult['severity'] {
  return warning.severity === 'error' ? 'blocker' : 'warning';
}

function fixHintForWarning(warning: TranslationPublishWarning): string {
  switch (warning.kind) {
    case 'broken-link':
      return `Open Translation Manager for ${warning.locale} and reconnect or remove the missing language page before publishing.`;
    case 'outdated':
      return `Open Translation Manager for ${warning.locale}, refresh the stale translation, then rerun publish checks.`;
    case 'untranslated':
      return `Open Translation Manager for ${warning.locale} and create the missing translation before publishing.`;
  }
}

function reviewHrefForWarning(
  warning: TranslationPublishWarning,
  sourceLocale: Locale,
): string {
  const query = buildTranslationPublishWarningReviewQuery(warning, sourceLocale);
  return `/${sourceLocale}/admin-builder/translations?${query}`;
}

export function checkTranslationPublishWarnings(
  page: BuilderPageMeta | null | undefined,
  site: BuilderSiteDocument | null | undefined,
  sourceLocale: Locale = defaultLocale,
): CheckResult[] {
  if (!page || !site || page.locale !== sourceLocale) {
    return [];
  }

  return buildTranslationPublishWarnings(site, sourceLocale)
    .filter((warning) => warning.pageId === page.pageId)
    .map((warning): CheckResult => ({
      id: warningId(warning),
      severity: severityForWarning(warning),
      category: 'translations',
      message: warning.message,
      fixHint: fixHintForWarning(warning),
      action: { href: reviewHrefForWarning(warning, sourceLocale) },
    }));
}
