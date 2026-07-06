import type { Locale } from '@/lib/locales';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import type {
  TranslationContentRef,
  TranslationEntry,
  TranslationTargetValue,
} from '@/lib/builder/translations/types';

export const DASHBOARD_TEST_LOCALES = ['ko', 'zh-hant'] as const;

export const DASHBOARD_REFRESH_LABELS: Record<Locale, string> = {
  ko: '대시보드 새로고침',
  'zh-hant': '重新整理儀表板',
  en: 'Refresh dashboard',
};

const now = '2026-05-30T00:00:00.000Z';

function targetValue(
  status: TranslationTargetValue['status'],
): TranslationTargetValue {
  return {
    text: `${status} text`,
    status,
    sourceHashAtTranslation: 'source-hash',
    translatedBy: status === 'manual' ? 'manual' : 'mock',
    translatedAt: now,
  };
}

function translationEntry({
  key,
  category,
  contentType,
  translations,
}: {
  key: string;
  category: TranslationContentRef['category'];
  contentType: TranslationContentRef['contentType'];
  translations: Partial<Record<Locale, TranslationTargetValue>>;
}): TranslationEntry {
  return {
    key,
    sourceLocale: 'ko',
    sourceText: `Source ${key}`,
    sourceHash: `hash-${key}`,
    content: {
      contentType,
      contentRef: key,
      category,
      label: key,
    },
    translations,
    createdAt: now,
    updatedAt: now,
  };
}

export function seededTranslationSite() {
  const site = createDefaultSiteDocument('ko', 'default');
  site.navigation = [];
  site.pages = [
    ...site.pages,
    {
      pageId: 'page-about-ko',
      slug: 'about',
      title: { ko: '소개', 'zh-hant': '關於', en: 'About' },
      locale: 'ko',
      createdAt: now,
      updatedAt: '2026-05-30T03:00:00.000Z',
    },
    {
      pageId: 'page-about-en',
      slug: 'about',
      title: { ko: '소개', 'zh-hant': '關於', en: 'About' },
      locale: 'en',
      createdAt: now,
      updatedAt: '2026-05-30T01:00:00.000Z',
    },
    {
      pageId: 'page-contact-ko',
      slug: 'contact',
      title: { ko: '연락처', 'zh-hant': '聯絡', en: 'Contact' },
      locale: 'ko',
      createdAt: now,
      updatedAt: '2026-05-30T02:00:00.000Z',
    },
  ];
  site.translations = [
    translationEntry({
      key: 'column:immigration:title',
      category: 'columns',
      contentType: 'column-title',
      translations: {
        en: targetValue('manual'),
        'zh-hant': targetValue('outdated'),
      },
    }),
    translationEntry({
      key: 'page:home:hero:image:alt',
      category: 'pages',
      contentType: 'node-image-alt',
      translations: {
        en: targetValue('translated'),
      },
    }),
    translationEntry({
      key: 'app:faq-manager:content:faq-1:question',
      category: 'apps',
      contentType: 'app-content',
      translations: {
        'zh-hant': targetValue('manual'),
      },
    }),
  ];
  return site;
}

export function refreshedTranslationSite() {
  const site = seededTranslationSite();
  site.translations = (site.translations ?? []).map((entry) => {
    if (entry.key !== 'column:immigration:title') return entry;
    return {
      ...entry,
      translations: {
        en: targetValue('manual'),
        'zh-hant': targetValue('manual'),
      },
      updatedAt: '2026-06-19T00:00:00.000Z',
    };
  });
  return site;
}
