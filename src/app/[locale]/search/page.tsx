import type { Metadata } from 'next';
import Link from 'next/link';
import { normalizeSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import SmartLink from '@/components/SmartLink';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { buildSeoMetadata } from '@/lib/seo';
import { loadSearchIndex } from '@/lib/builder/search/index-storage';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import { runSearchQuery } from '@/lib/builder/search/query-engine';
import type { SearchDocKind } from '@/lib/builder/search/types';

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
  services: 'page',
  videos: 'page',
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
  if (kind === 'blog') return locale === 'ko' ? '칼럼' : locale === 'zh-hant' ? '洞見' : locale === 'ja' ? 'コラム' : 'Columns';
  if (kind === 'faq') return locale === 'ko' ? '자주 묻는 질문' : locale === 'zh-hant' ? '常見問題' : locale === 'ja' ? 'よくある質問' : 'FAQ';
  return locale === 'ko' ? '포트폴리오' : locale === 'zh-hant' ? '作品集' : locale === 'ja' ? 'ポートフォリオ' : 'Portfolio';
}

function resultKindLabel(kind: SearchDocKind, locale: SiteLocale): string {
  return searchKindLabel(kind, locale);
}

async function loadNativeSearchIndex() {
  return (await loadSearchIndex()) ?? buildSearchIndex(await collectAllSearchDocs('default'));
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
  const activeKind = SEARCH_TAB_KIND[requestedTab] ?? 'all';
  const suggestedLabel = locale === 'ko' ? '추천' : locale === 'zh-hant' ? '建議' : locale === 'ja' ? 'おすすめ' : 'Suggested';
  const emptyLabel = locale === 'ko'
    ? '검색 결과가 없습니다.'
    : locale === 'zh-hant'
      ? '沒有搜尋結果。'
      : locale === 'ja'
        ? '検索結果が見つかりませんでした。'
        : 'No search results found.';
  const index = await loadNativeSearchIndex();
  const hits = query
    ? runSearchQuery({
        index,
        query,
        locale,
        limit: 50,
        kinds: activeKind === 'all' ? undefined : [activeKind],
      })
    : [];

  const results = hits.slice(0, 12);
  const totalLabel = locale === 'ko'
    ? `총 ${hits.length}건`
    : locale === 'zh-hant'
      ? `共 ${hits.length} 筆`
      : locale === 'ja'
        ? `全 ${hits.length} 件`
        : `Total ${hits.length}`;
  const tabs: Array<{ id: SearchDocKind | 'all'; label: string }> = [
    { id: 'all', label: searchKindLabel('all', locale) },
    { id: 'page', label: searchKindLabel('page', locale) },
    { id: 'blog', label: searchKindLabel('blog', locale) },
    { id: 'faq', label: searchKindLabel('faq', locale) },
    { id: 'portfolio', label: searchKindLabel('portfolio', locale) },
  ];

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description}>
        <form className="search-bar" action={`/${locale}/search`} method="get">
          <input
            className="search-input"
            type="search"
            name="q"
            defaultValue={query}
            maxLength={MAX_SEARCH_QUERY_LENGTH}
            aria-label={content.search.title}
            placeholder={content.search.placeholder}
          />
          <input type="hidden" name="tab" value={activeKind} />
          <button className="search-submit" type="submit">
            {content.search.title}
          </button>
        </form>
      </PageHeader>
      <section className="section search-results-section">
        <div className="container">
          <div className="search-tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                className={`tab-button ${activeKind === tab.id ? 'active' : ''}`}
                href={`/${locale}/search?q=${encodeURIComponent(query)}&tab=${tab.id}`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          <div className="search-results-total">{totalLabel}</div>
          <div className="list-rows">
            {results.length ? (
              results.map((hit) => (
                <div key={hit.doc.id} className="list-row">
                  <div className="list-meta">{resultKindLabel(hit.doc.kind, locale)}</div>
                  <div>
                    <SmartLink className="link-underline" href={hit.doc.url}>
                      {hit.doc.title}
                    </SmartLink>
                    <p className="search-results-desc">{hit.highlights[0] || hit.doc.summary}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="search-empty">{emptyLabel}</div>
            )}
          </div>
          <div className="search-results-suggested">
            <div className="section-label">{suggestedLabel}</div>
            <div className="chip-group">
              {content.search.suggestions.map((item) => (
                <Link key={item} className="chip" href={`/${locale}/search?q=${encodeURIComponent(item)}`}>
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
