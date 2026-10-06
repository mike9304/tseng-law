import type { Metadata } from 'next';
import { normalizeSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { buildSeoMetadata } from '@/lib/seo';
import { searchCurrentPublication } from '@/lib/builder/search/current-search';
import type { SearchDocKind } from '@/lib/builder/search/types';
import SearchPageView, { type SearchPageViewProps } from './SearchPageView';
import JaSearchView from './JaSearchView';
import zhPageShellStyles from '@/components/zh-hant-pages/ZhHantPageShell.module.css';
import zhSearchStyles from './ZhHantSearch.module.css';
import { appleDesignRootProps, isAppleDesignLocale } from '@/lib/apple-design-locales';
import EnPageShell from '@/components/en-design/EnPageShell';
import enStyles from '@/components/en-design/EnSearch.module.css';

export async function generateMetadata(props: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const copy = pageCopy[locale].search;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/search',
    noindex: true,
    alternateLocales: siteLocales,
  });
}

const SEARCH_TAB_KIND: Record<string, SearchDocKind | 'all'> = {
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

const MAX_SEARCH_QUERY_LENGTH = 200;

function normalizeSearchQuery(value: string): string {
  let query = '';
  let length = 0;

  for (const character of value.trim()) {
    if (length >= MAX_SEARCH_QUERY_LENGTH) break;
    query += character;
    length += 1;
  }

  return query;
}

function searchKindLabel(kind: SearchDocKind | 'all', locale: SiteLocale): string {
  if (kind === 'all') return locale === 'ko' ? '전체' : locale === 'zh-hant' ? '全部' : locale === 'ja' ? 'すべて' : 'All';
  if (kind === 'page') return locale === 'ko' ? '페이지' : locale === 'zh-hant' ? '頁面' : locale === 'ja' ? 'ページ' : 'Pages';
  if (kind === 'blog') return locale === 'ko' ? '칼럼' : locale === 'zh-hant' ? '專欄' : locale === 'ja' ? 'コラム' : 'Insights';
  if (kind === 'faq') return locale === 'ko' ? '자주 묻는 질문' : locale === 'zh-hant' ? '常見問題' : locale === 'ja' ? 'よくある質問' : 'FAQ';
  return locale === 'ko' ? '포트폴리오' : locale === 'zh-hant' ? '作品集' : locale === 'ja' ? 'ポートフォリオ' : 'Portfolio';
}

function resultKindLabel(kind: SearchDocKind, locale: SiteLocale): string {
  return searchKindLabel(kind, locale);
}

export default async function SearchPage(
  props: {
    params: Promise<{ locale: SiteLocale }>;
    searchParams: Promise<{ q?: string; tab?: string; kinds?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const copy = pageCopy[locale].search;
  const content = siteContent[locale];
  const query = normalizeSearchQuery(searchParams.q ?? '');
  const requestedTab = searchParams.kinds?.split(',')[0]?.trim() || searchParams.tab || 'all';
  const suggestedLabel = locale === 'ko' ? '추천' : locale === 'zh-hant' ? '建議' : locale === 'ja' ? 'おすすめ' : 'Suggested';
  const emptyLabel = locale === 'ko'
    ? '검색 결과가 없습니다.'
    : locale === 'zh-hant'
      ? '沒有搜尋結果。'
      : locale === 'ja'
        ? '検索結果が見つかりませんでした。'
        : 'No search results found.';
  const initialLabel = locale === 'ko'
    ? '검색어를 입력하거나 아래 추천 주제를 선택해 주세요.'
    : locale === 'zh-hant'
      ? '請輸入關鍵字，或選擇下方的建議主題。'
      : locale === 'ja'
        ? 'キーワードを入力するか、下のおすすめのテーマを選んでください。'
        : 'Enter a keyword or choose a suggested topic below.';
  const activeKind = SEARCH_TAB_KIND[requestedTab] ?? 'all';
  const { hits, availableKinds } = await searchCurrentPublication({
    query,
    locale,
    limit: 50,
    kinds: activeKind === 'all' ? undefined : [activeKind],
  });
  const visibleKindIds: Array<SearchDocKind | 'all'> = ['all', ...availableKinds];

  const results = hits;
  const totalLabel = locale === 'ko'
    ? `${hits.length === 50 ? '상위' : '총'} ${hits.length}건`
    : locale === 'zh-hant'
      ? `${hits.length === 50 ? '前' : '共'} ${hits.length} 筆`
      : locale === 'ja'
        ? `${hits.length === 50 ? '上位' : '全'} ${hits.length} 件`
        : `${hits.length === 50 ? 'Top' : 'Total'} ${hits.length}`;
  const tabs: Array<{ id: SearchDocKind | 'all'; label: string }> = visibleKindIds.map((id) => ({
    id,
    label: searchKindLabel(id, locale),
  }));

  const viewProps: SearchPageViewProps = {
    locale,
    copy: { label: copy.label, title: copy.title, description: copy.description },
    search: { title: content.search.title, placeholder: content.search.placeholder, suggestions: content.search.suggestions },
    query,
    maxQueryLength: MAX_SEARCH_QUERY_LENGTH,
    activeKind,
    tabs,
    // Only the displayed hit fields cross the Japanese client boundary. Search
    // documents, full bodies, scores and publication internals remain server-side.
    results: results.map((hit) => ({
      id: hit.doc.id,
      kindLabel: resultKindLabel(hit.doc.kind, locale),
      url: hit.doc.url,
      title: hit.doc.title,
      description: hit.highlights[0] || hit.doc.summary,
    })),
    totalLabel,
    emptyLabel,
    initialLabel,
    suggestedLabel,
  };
  const body = locale === 'ja' ? <JaSearchView {...viewProps} /> : <SearchPageView {...viewProps} />;
  // zh-hant Apple pass (2026-10-01; ko since 2026-10-06): the same page inside a scoped wrapper.
  if (isAppleDesignLocale(locale)) {
    return (
      <div className={`${zhPageShellStyles.shell} ${zhSearchStyles.root}`} {...appleDesignRootProps(locale, 'search')}>
        {body}
      </div>
    );
  }
  // ja: the shared 間 shell carries the palette and page header treatment.
  // ja: the 昊 V2 shell is rendered inside JaSearchView (one synchronous client view).
  if (locale === 'ja') return body;
  // en (Clear Night inner pages): the same search body inside the en wrapper; other locales render it as before.
  return locale === 'en'
    ? <EnPageShell page="search"><div className={enStyles.search}>{body}</div></EnPageShell>
    : body;
}
