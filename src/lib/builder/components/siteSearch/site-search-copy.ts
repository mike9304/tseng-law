import type { Locale } from '@/lib/locales';

export interface SiteSearchCopy {
  defaultPlaceholder: string;
  defaultSubmitLabel: string;
  placeholderLabel: string;
  searchButtonLabel: string;
  showInlineResultsLabel: string;
  searchScopeLegend: string;
  searchScopeHint: string;
  maxResultsLabel: string;
  localeOverrideLabel: string;
  localeOverridePlaceholder: string;
  kindLabels: Record<'page' | 'blog' | 'faq' | 'portfolio', string>;
}

export const SITE_SEARCH_LEGACY_DEFAULTS = {
  placeholder: '어떻게 도와드릴까요?',
  submitLabel: '검색',
} as const;

export const SITE_SEARCH_SCHEMA_LEGACY_DEFAULTS = {
  placeholder: '검색...',
  submitLabel: 'Search',
} as const;

export const SITE_SEARCH_LEGACY_DEFAULT_VALUES = {
  placeholder: [SITE_SEARCH_LEGACY_DEFAULTS.placeholder, SITE_SEARCH_SCHEMA_LEGACY_DEFAULTS.placeholder],
  submitLabel: [SITE_SEARCH_LEGACY_DEFAULTS.submitLabel, SITE_SEARCH_SCHEMA_LEGACY_DEFAULTS.submitLabel],
} as const;

export function localizedSiteSearchLegacyText(
  value: string | undefined,
  localized: string,
  legacyDefault: string | readonly string[],
): string {
  const current = value ?? '';
  const legacyDefaults = Array.isArray(legacyDefault) ? legacyDefault : [legacyDefault];
  return legacyDefaults.includes(current) ? localized : current;
}

const SITE_SEARCH_COPY: Record<Locale, SiteSearchCopy> = {
  ko: {
    defaultPlaceholder: SITE_SEARCH_LEGACY_DEFAULTS.placeholder,
    defaultSubmitLabel: SITE_SEARCH_LEGACY_DEFAULTS.submitLabel,
    placeholderLabel: '플레이스홀더',
    searchButtonLabel: '검색 버튼 라벨',
    showInlineResultsLabel: '결과 인라인 표시',
    searchScopeLegend: '검색 범위',
    searchScopeHint: '선택하지 않으면 전체 검색',
    maxResultsLabel: '최대 결과수',
    localeOverrideLabel: '로케일 override',
    localeOverridePlaceholder: '페이지 로케일 사용',
    kindLabels: {
      page: '페이지',
      blog: '칼럼',
      faq: 'FAQ',
      portfolio: '포트폴리오',
    },
  },
  'zh-hant': {
    defaultPlaceholder: '請問我可以怎麼幫您？',
    defaultSubmitLabel: '搜尋',
    placeholderLabel: '預留文字',
    searchButtonLabel: '搜尋按鈕標籤',
    showInlineResultsLabel: '內嵌顯示結果',
    searchScopeLegend: '搜尋範圍',
    searchScopeHint: '未勾選時搜尋全部',
    maxResultsLabel: '最大結果數',
    localeOverrideLabel: '語系覆寫',
    localeOverridePlaceholder: '使用頁面語系',
    kindLabels: {
      page: '頁面',
      blog: '專欄',
      faq: 'FAQ',
      portfolio: '作品集',
    },
  },
  en: {
    defaultPlaceholder: 'How can we help?',
    defaultSubmitLabel: 'Search',
    placeholderLabel: 'Placeholder',
    searchButtonLabel: 'Search button label',
    showInlineResultsLabel: 'Show inline results',
    searchScopeLegend: 'Search scope',
    searchScopeHint: 'Search all when none selected',
    maxResultsLabel: 'Max results',
    localeOverrideLabel: 'Locale override',
    localeOverridePlaceholder: 'Use page locale',
    kindLabels: {
      page: 'Page',
      blog: 'Blog',
      faq: 'FAQ',
      portfolio: 'Portfolio',
    },
  },
};

export function getSiteSearchCopy(locale: Locale): SiteSearchCopy {
  return SITE_SEARCH_COPY[locale] ?? SITE_SEARCH_COPY.ko;
}
