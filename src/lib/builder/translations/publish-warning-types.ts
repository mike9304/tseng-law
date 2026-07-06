import type { Locale } from '@/lib/locales';

export type TranslationPublishWarningSeverity = 'warning' | 'error';
export type TranslationPublishWarningKind = 'untranslated' | 'outdated' | 'broken-link';

export interface TranslationPublishWarning {
  severity: TranslationPublishWarningSeverity;
  kind: TranslationPublishWarningKind;
  pageId: string;
  locale: Locale;
  message: string;
}

export interface TranslationPublishWarningsPayload {
  ok: true;
  siteId: string;
  sourceLocale: Locale;
  syncedAt: string;
  warnings: TranslationPublishWarning[];
}
