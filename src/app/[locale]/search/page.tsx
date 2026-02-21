import Link from 'next/link';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import SmartLink from '@/components/SmartLink';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { filterSearchIndex, getSearchIndex, type SearchCategory } from '@/lib/search';

export default function SearchPage({
  params,
  searchParams
}: {
  params: { locale: Locale };
  searchParams: { q?: string; tab?: string };
}) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].search;
  const content = siteContent[locale];
  const query = searchParams.q ?? '';
  const validTabs = content.search.tabs.map((tab) => tab.id);
  const activeTab = validTabs.includes(searchParams.tab ?? '') ? (searchParams.tab as string) : content.search.tabs[0].id;
  const activeCategory = activeTab as SearchCategory;
  const activeTabLabel =
    content.search.tabs.find((tab) => tab.id === activeTab)?.label ?? content.search.tabs[0].label;
  const suggestedLabel = locale === 'ko' ? '추천' : locale === 'zh-hant' ? '建議' : 'Suggested';
  const emptyLabel = locale === 'ko' ? '검색 결과가 없습니다.' : locale === 'zh-hant' ? '沒有搜尋結果。' : 'No search results found.';

  const index = getSearchIndex(locale);
  const filtered = filterSearchIndex(index, query, activeCategory);
  const results = filtered.slice(0, 12);
  const totalLabel = locale === 'ko' ? `총 ${filtered.length}건` : locale === 'zh-hant' ? `共 ${filtered.length} 筆` : `Total ${filtered.length}`;

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description}>
        <form className="search-bar" action={`/${locale}/search`} method="get">
          <input
            className="search-input"
            type="search"
            name="q"
            defaultValue={query}
            placeholder={content.search.placeholder}
          />
          <input type="hidden" name="tab" value={activeTab} />
          <button className="search-submit" type="submit">
            {content.search.title}
          </button>
        </form>
      </PageHeader>
      <section className="section search-results-section">
        <div className="container">
          <div className="search-tabs">
            {content.search.tabs.map((tab) => (
              <Link
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                href={`/${locale}/search?q=${encodeURIComponent(query)}&tab=${tab.id}`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          <div className="search-results-total">{totalLabel}</div>
          <div className="list-rows">
            {results.length ? (
              results.map((item) => (
                <div key={item.id} className="list-row">
                  <div className="list-meta">{activeTabLabel}</div>
                  <div>
                    <SmartLink className="link-underline" href={item.href}>
                      {item.title}
                    </SmartLink>
                    <p className="search-results-desc">{item.description}</p>
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
