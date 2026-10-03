import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SmartLink from '@/components/SmartLink';
import type { SiteLocale } from '@/lib/locales';
import styles from './SearchPage.module.css';

export type SearchPageViewProps = {
  locale: SiteLocale;
  copy: { label: string; title: string; description: string };
  search: { title: string; placeholder: string; suggestions: readonly string[] };
  query: string;
  maxQueryLength: number;
  activeKind: string;
  tabs: { id: string; label: string }[];
  results: { id: string; kindLabel: string; url: string; title: string; description?: string }[];
  totalLabel: string;
  emptyLabel: string;
  initialLabel: string;
  suggestedLabel: string;
};

/** Same markup for the server view and the Japanese synchronous SSR boundary. */
export default function SearchPageView({ locale, copy, search, query, maxQueryLength, activeKind, tabs, results, totalLabel, emptyLabel, initialLabel, suggestedLabel }: SearchPageViewProps) {
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description}>
        <form className={`search-bar ${styles.searchBar}`} action={`/${locale}/search`} method="get">
          <input
            className="search-input"
            type="search"
            name="q"
            defaultValue={query}
            maxLength={maxQueryLength}
            aria-label={search.title}
            placeholder={search.placeholder}
          />
          <input type="hidden" name="tab" value={activeKind} />
          <button className="search-submit" type="submit">
            {search.title}
          </button>
        </form>
      </PageHeader>
      <section className={`section search-results-section ${styles.results}`}>
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
          {query && <div className="search-results-total">{totalLabel}</div>}
          <div className="list-rows">
            {!query ? (
              <p className="search-empty" data-search-initial="true">{initialLabel}</p>
            ) : results.length ? (
              results.map((hit) => (
                <div key={hit.id} className="list-row">
                  <div className="list-meta">{hit.kindLabel}</div>
                  <div>
                    <SmartLink className="link-underline" href={hit.url}>
                      {hit.title}
                    </SmartLink>
                    <p className="search-results-desc">{hit.description}</p>
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
              {search.suggestions.map((item) => (
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
