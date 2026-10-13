'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SearchDocKind } from '@/lib/builder/search/types';
import JaSearchView from './JaSearchView';
import SearchPageView, { type SearchPageViewProps } from './SearchPageView';
import { formatSearchTotal, normalizeSearchQuery, SEARCH_TAB_KIND, searchKindLabel } from './search-labels';

/**
 * Search page for the static site (src/lib/static-site.ts). The snapshot holds one HTML file
 * for every `?q=`, so the query is read after hydration and matched against this locale's docs,
 * which the page embeds at snapshot time. Results link to the boards and columns.
 */

export type StaticSearchDoc = {
  id: string;
  kind: SearchDocKind;
  url: string;
  title: string;
  summary?: string;
  tags?: string[];
};

export type StaticSearchPageProps = Omit<
  SearchPageViewProps,
  'query' | 'activeKind' | 'tabs' | 'results' | 'totalLabel'
> & { docs: StaticSearchDoc[] };

const MAX_RESULTS = 50;

function normalizeText(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function matchStaticSearchDocs(
  docs: StaticSearchDoc[],
  query: string,
  kind: SearchDocKind | 'all',
): StaticSearchDoc[] {
  const tokens = normalizeText(query).split(' ').filter(Boolean);
  if (tokens.length === 0) return [];
  return docs
    .filter((doc) => kind === 'all' || doc.kind === kind)
    .filter((doc) => {
      const haystack = normalizeText([doc.title, doc.summary ?? '', ...(doc.tags ?? [])].join(' '));
      return tokens.every((token) => haystack.includes(token));
    })
    .slice(0, MAX_RESULTS);
}

export default function StaticSearchPage({ docs, ...viewBase }: StaticSearchPageProps) {
  const { locale } = viewBase;
  // Empty on the first render so the hydrated markup matches the snapshot HTML.
  const [query, setQuery] = useState('');
  const [activeKind, setActiveKind] = useState<SearchDocKind | 'all'>('all');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(normalizeSearchQuery(params.get('q') ?? ''));
    const tab = params.get('kinds')?.split(',')[0]?.trim() || params.get('tab') || 'all';
    setActiveKind(SEARCH_TAB_KIND[tab] ?? 'all');
  }, []);

  const availableKinds = useMemo(
    () => [...new Set(docs.map((doc) => doc.kind))],
    [docs],
  );
  const hits = useMemo(() => matchStaticSearchDocs(docs, query, activeKind), [docs, query, activeKind]);

  const viewProps: SearchPageViewProps = {
    ...viewBase,
    query,
    activeKind,
    tabs: (['all', ...availableKinds] as Array<SearchDocKind | 'all'>).map((id) => ({
      id,
      label: searchKindLabel(id, locale),
    })),
    results: hits.map((doc) => ({
      id: doc.id,
      kindLabel: searchKindLabel(doc.kind, locale),
      url: doc.url,
      title: doc.title,
      description: doc.summary,
    })),
    totalLabel: formatSearchTotal(locale, hits.length, MAX_RESULTS),
  };

  // `key` remounts the view once the query is known so the uncontrolled input shows it.
  return locale === 'ja'
    ? <JaSearchView key={query} {...viewProps} />
    : <SearchPageView key={query} {...viewProps} />;
}
