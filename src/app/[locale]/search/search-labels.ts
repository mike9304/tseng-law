import type { SiteLocale } from '@/lib/locales';
import type { SearchDocKind } from '@/lib/builder/search/types';

// Shared by the server search page and the static-site client search (StaticSearchPage.tsx).

export const SEARCH_TAB_KIND: Record<string, SearchDocKind | 'all'> = {
  all: 'all',
  page: 'page',
  pages: 'page',
  // Historic overlay categories do not describe the page-kind collection.
  services: 'all',
  videos: 'all',
  blog: 'blog',
  columns: 'blog',
  insights: 'blog',
  faq: 'faq',
  portfolio: 'portfolio',
};

export const MAX_SEARCH_QUERY_LENGTH = 200;

export function normalizeSearchQuery(value: string): string {
  let query = '';
  let length = 0;

  for (const character of value.trim()) {
    if (length >= MAX_SEARCH_QUERY_LENGTH) break;
    query += character;
    length += 1;
  }

  return query;
}

export function searchKindLabel(kind: SearchDocKind | 'all', locale: SiteLocale): string {
  if (kind === 'all') return locale === 'ko' ? '전체' : locale === 'zh-hant' ? '全部' : locale === 'ja' ? 'すべて' : 'All';
  if (kind === 'page') return locale === 'ko' ? '페이지' : locale === 'zh-hant' ? '頁面' : locale === 'ja' ? 'ページ' : 'Pages';
  if (kind === 'blog') return locale === 'ko' ? '칼럼' : locale === 'zh-hant' ? '專欄' : locale === 'ja' ? 'コラム' : 'Insights';
  if (kind === 'faq') return locale === 'ko' ? '자주 묻는 질문' : locale === 'zh-hant' ? '常見問題' : locale === 'ja' ? 'よくある質問' : 'FAQ';
  return locale === 'ko' ? '포트폴리오' : locale === 'zh-hant' ? '作品集' : locale === 'ja' ? 'ポートフォリオ' : 'Portfolio';
}

export function resultKindLabel(kind: SearchDocKind, locale: SiteLocale): string {
  return searchKindLabel(kind, locale);
}

export function formatSearchTotal(locale: SiteLocale, count: number, limit = 50): string {
  const capped = count === limit;
  if (locale === 'ko') return `${capped ? '상위' : '총'} ${count}건`;
  if (locale === 'zh-hant') return `${capped ? '前' : '共'} ${count} 筆`;
  if (locale === 'ja') return `${capped ? '上位' : '全'} ${count} 件`;
  return `${capped ? 'Top' : 'Total'} ${count}`;
}
