import type { SiteLocale } from '@/lib/locales';

export type FaqStatus = 'draft' | 'published';
export type FaqSortBy = 'manual' | 'newest' | 'oldest';

export interface BuilderFaqCategory {
  categoryId: string;
  slug: string;
  label: Record<SiteLocale, string>;
  description?: Partial<Record<SiteLocale, string>>;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BuilderFaqItem {
  faqId: string;
  slug: string;
  locale: SiteLocale;
  question: string;
  answer: string;
  categoryId: string;
  tags: string[];
  status: FaqStatus;
  sortOrder: number;
  schemaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqListQuery {
  locale?: SiteLocale;
  status?: FaqStatus | 'all';
  categoryId?: string;
  q?: string;
  limit?: number;
  sortBy?: FaqSortBy;
  schemaOnly?: boolean;
}

const STATIC_SEED_DATE = '2026-05-20T00:00:00.000Z';

export const DEFAULT_FAQ_CATEGORIES: BuilderFaqCategory[] = [
  {
    categoryId: 'company-setup',
    slug: 'company-setup',
    label: { ko: '법인설립', 'zh-hant': '公司設立', en: 'Company Setup', ja: '会社設立' },
    description: {
      ko: '대만 법인, 지사, 투자 허가와 설립 절차',
      'zh-hant': '台灣公司、分公司、投資許可與設立流程',
      en: 'Taiwan entities, branches, permits, and incorporation steps',
    },
    sortOrder: 10,
    createdAt: STATIC_SEED_DATE,
    updatedAt: STATIC_SEED_DATE,
  },
  {
    categoryId: 'labor-law',
    slug: 'labor-law',
    label: { ko: '노동법', 'zh-hant': '勞動法', en: 'Labor Law', ja: '労働法' },
    description: {
      ko: '해고, 퇴직금, 의무재직 약정 등 고용 이슈',
      'zh-hant': '資遣、資遣費、最低服務年限等僱傭議題',
      en: 'Termination, severance, service-period agreements, and employment issues',
    },
    sortOrder: 20,
    createdAt: STATIC_SEED_DATE,
    updatedAt: STATIC_SEED_DATE,
  },
  {
    categoryId: 'civil-traffic',
    slug: 'civil-traffic',
    label: { ko: '민사·교통사고', 'zh-hant': '民事與交通事故', en: 'Civil & Traffic', ja: '民事・交通事故' },
    description: {
      ko: '교통사고, 시설 사고, 손해배상 청구',
      'zh-hant': '交通事故、設施受傷與損害賠償',
      en: 'Traffic accidents, facility injuries, and damages claims',
    },
    sortOrder: 30,
    createdAt: STATIC_SEED_DATE,
    updatedAt: STATIC_SEED_DATE,
  },
  {
    categoryId: 'family-divorce',
    slug: 'family-divorce',
    label: { ko: '가사·이혼', 'zh-hant': '家事與離婚', en: 'Family & Divorce', ja: '家事・離婚' },
    description: {
      ko: '국제이혼, 재산분할, 양육권과 친권',
      'zh-hant': '跨國離婚、財產分割、親權與監護',
      en: 'International divorce, property division, and custody',
    },
    sortOrder: 40,
    createdAt: STATIC_SEED_DATE,
    updatedAt: STATIC_SEED_DATE,
  },
  {
    categoryId: 'criminal-defense',
    slug: 'criminal-defense',
    label: { ko: '형사', 'zh-hant': '刑事', en: 'Criminal', ja: '刑事' },
    description: {
      ko: '수사 대응, 외국인 형사 사건, 출국금지와 구속 이슈',
      'zh-hant': '偵查應對、外國人刑事案件、限制出境與羈押',
      en: 'Investigations, foreign-national cases, travel bans, and detention',
    },
    sortOrder: 50,
    createdAt: STATIC_SEED_DATE,
    updatedAt: STATIC_SEED_DATE,
  },
  {
    categoryId: 'consultation',
    slug: 'consultation',
    label: { ko: '상담·비용', 'zh-hant': '諮詢與費用', en: 'Consultation', ja: '相談・費用' },
    description: {
      ko: '상담 방식, 준비 자료, 특수 업종 설립 문의',
      'zh-hant': '諮詢方式、準備資料與特殊產業設立',
      en: 'Consultation methods, preparation, and specialized industries',
    },
    sortOrder: 60,
    createdAt: STATIC_SEED_DATE,
    updatedAt: STATIC_SEED_DATE,
  },
];

export function getFaqCategoryLabel(categoryId: string, locale: SiteLocale): string {
  return DEFAULT_FAQ_CATEGORIES.find((category) => category.categoryId === categoryId)?.label[locale] ?? categoryId;
}

export function sortFaqItems(items: BuilderFaqItem[], sortBy: FaqSortBy = 'manual'): BuilderFaqItem[] {
  const sorted = [...items];
  if (sortBy === 'newest') return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (sortBy === 'oldest') return sorted.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
  return sorted.sort((a, b) =>
    a.sortOrder - b.sortOrder
    || a.categoryId.localeCompare(b.categoryId)
    || a.question.localeCompare(b.question),
  );
}
