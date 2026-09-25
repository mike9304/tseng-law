import type { BuilderFaqCategory, BuilderFaqItem } from '@/lib/builder/faq/faq-shared';
import type { SiteLocale } from '@/lib/locales';

type FaqPublicExplorerText = {
  readonly all: string;
  readonly search: string;
  readonly clear: string;
  readonly count: (count: number) => string;
  readonly empty: string;
};

export const faqPublicExplorerCopy: Record<SiteLocale, FaqPublicExplorerText> = {
  ko: {
    all: '전체',
    search: 'FAQ 검색',
    clear: '초기화',
    count: (count) => `${count}개 질문`,
    empty: '조건에 맞는 질문이 없습니다.',
  },
  'zh-hant': {
    all: '全部',
    search: '搜尋 FAQ',
    clear: '清除',
    count: (count) => `${count} 個問題`,
    empty: '沒有符合條件的問題。',
  },
  en: {
    all: 'All',
    search: 'Search FAQ',
    clear: 'Clear',
    count: (count) => `${count} questions`,
    empty: 'No questions match these filters.',
  },
  ja: {
    all: 'すべて',
    search: 'FAQ を検索',
    clear: 'クリア',
    count: (count) => `${count}件の質問`,
    empty: '条件に一致する質問がありません。',
  },
};

export function categoryLabel(categories: readonly BuilderFaqCategory[], categoryId: string, locale: SiteLocale): string {
  return categories.find((category) => category.categoryId === categoryId)?.label[locale] ?? categoryId;
}

export function decodeHash(hash: string): string {
  return decodeURIComponent(hash.replace(/^#/, ''));
}

export function buildHref(pathname: string, searchParams: URLSearchParams, hash: string | null): string {
  const query = searchParams.toString();
  const base = query ? `${pathname}?${query}` : pathname;
  return hash ? `${base}#${encodeURIComponent(hash)}` : base;
}

export function filterFaqItems(
  items: readonly BuilderFaqItem[],
  categories: readonly BuilderFaqCategory[],
  locale: SiteLocale,
  categoryId: string,
  query: string,
): BuilderFaqItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesCategory = categoryId === 'all' || item.categoryId === categoryId;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return [
      item.question,
      item.answer,
      categoryLabel(categories, item.categoryId, locale),
      ...item.tags,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
  });
}

export type FaqRelatedLink = {
  readonly lead: string;
  readonly label: string;
  readonly href: string;
};

/**
 * Internal "see also" links rendered inside an answer panel, keyed by FAQ id.
 * The answer text (and therefore FAQPage JSON-LD) is untouched, and panels are
 * collapsed by default, so the page's initial height does not change.
 */
export const faqRelatedLinks: Partial<Record<SiteLocale, Readonly<Record<string, FaqRelatedLink>>>> = {
  'zh-hant': {
    // 韓國人在台灣離婚需要什麼程序？
    'seed-zh-hant-9': {
      lead: '可以用韓文找台灣律師嗎？',
      label: '會說韓文的台灣律師（台北）',
      href: '/zh-hant/korean-lawyer-in-taiwan',
    },
    // 諮詢方式如何進行？
    'seed-zh-hant-12': {
      lead: '可以用韓文找台灣律師嗎？',
      label: '會說韓文的台灣律師（台北）',
      href: '/zh-hant/korean-lawyer-in-taiwan',
    },
  },
};

export function getFaqRelatedLink(locale: SiteLocale, faqId: string): FaqRelatedLink | null {
  return faqRelatedLinks[locale]?.[faqId] ?? null;
}
