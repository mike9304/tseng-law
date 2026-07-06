import type { Locale } from '@/lib/locales';

export type PublishedSiteHeaderCopy = {
  mainNavLabel: string;
  untitled: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', PublishedSiteHeaderCopy> = {
  ko: {
    mainNavLabel: '주요 메뉴',
    untitled: '제목 없음',
  },
  'zh-hant': {
    mainNavLabel: '主要選單',
    untitled: '未命名',
  },
  en: {
    mainNavLabel: 'Main',
    untitled: 'Untitled',
  },
};

export function getPublishedSiteHeaderCopy(locale: Locale): PublishedSiteHeaderCopy {
  return COPY[locale as 'ko' | 'zh-hant' | 'en'] ?? COPY.en;
}
