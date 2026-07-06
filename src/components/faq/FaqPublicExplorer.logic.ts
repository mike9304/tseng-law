import type { BuilderFaqCategory, BuilderFaqItem } from '@/lib/builder/faq/faq-shared';
import type { Locale } from '@/lib/locales';

type FaqPublicExplorerText = {
  readonly all: string;
  readonly search: string;
  readonly clear: string;
  readonly count: (count: number) => string;
  readonly empty: string;
};

export const faqPublicExplorerCopy: Record<Locale, FaqPublicExplorerText> = {
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
};

export function categoryLabel(categories: readonly BuilderFaqCategory[], categoryId: string, locale: Locale): string {
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
  locale: Locale,
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
