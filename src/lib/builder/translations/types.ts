import type { Locale } from '@/lib/locales';

export const translationStatuses = ['translated', 'outdated', 'missing', 'manual'] as const;
export type TranslationStatus = (typeof translationStatuses)[number];

export type TranslationProvider = 'manual' | 'ai-openai' | 'ai-deepl' | 'mock';

export type TranslationContentType =
  | 'page-title'
  | 'page-meta'
  | 'node-text'
  | 'node-button-label'
  | 'node-image-alt'
  | 'node-form-label'
  | 'menu-item'
  | 'site-name'
  | 'site-setting'
  | 'column-title'
  | 'column-summary'
  | 'column-body';

export interface TranslationTargetValue {
  text: string;
  status: Exclude<TranslationStatus, 'missing'>;
  sourceHashAtTranslation: string;
  translatedBy: TranslationProvider;
  translatedAt: string;
  reviewedBy?: string;
}

export interface TranslationContentRef {
  pageId?: string;
  nodeId?: string;
  columnSlug?: string;
  navItemId?: string;
  contentType: TranslationContentType;
  contentRef: string;
  contentPath?: string;
  category: 'pages' | 'navigation' | 'site' | 'columns' | 'forms';
  label: string;
  pageTitle?: string;
}

export interface TranslationEntry {
  key: string;
  sourceLocale: Locale;
  sourceText: string;
  sourceHash: string;
  content: TranslationContentRef;
  translations: Partial<Record<Locale, TranslationTargetValue>>;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationProgress {
  locale: Locale;
  total: number;
  translated: number;
  manual: number;
  outdated: number;
  missing: number;
  percent: number;
}

export interface TranslationCategorySummary {
  key: 'all' | TranslationContentRef['category'];
  label: string;
  total: number;
  missing: number;
  outdated: number;
}

export interface TranslationManagerPayload {
  ok: true;
  siteId: string;
  sourceLocale: Locale;
  targetLocales: Locale[];
  entries: TranslationEntry[];
  categories: TranslationCategorySummary[];
  progress: TranslationProgress[];
  syncedAt: string;
}

export function getTranslationStatus(
  entry: TranslationEntry,
  locale: Locale,
): TranslationStatus {
  return entry.translations[locale]?.status ?? 'missing';
}
