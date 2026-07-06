import type { Locale } from '@/lib/locales';

export const orderedSectionIds = ['hero', 'insights', 'practice', 'about', 'results', 'stats', 'faq', 'offices', 'contact'] as const;

export type HomeSectionId = (typeof orderedSectionIds)[number];

export type DotItem = {
  readonly id: HomeSectionId;
  readonly label: string;
};

export const sectionLabelsByLocale: Record<Locale, Record<HomeSectionId, string>> = {
  ko: {
    hero: '메인',
    insights: '칼럼',
    practice: '업무',
    about: '변호사',
    results: '사례',
    stats: '성과',
    faq: 'FAQ',
    offices: '오시는길',
    contact: '연락처',
  },
  'zh-hant': {
    hero: '首頁',
    insights: '洞見',
    practice: '服務',
    about: '律師',
    results: '案例',
    stats: '成果',
    faq: '常見問題',
    offices: '據點',
    contact: '聯絡',
  },
  en: {
    hero: 'Home',
    insights: 'Columns',
    practice: 'Services',
    about: 'Lawyers',
    results: 'Cases',
    stats: 'About',
    faq: 'FAQ',
    offices: 'Offices',
    contact: 'Contact',
  },
};
