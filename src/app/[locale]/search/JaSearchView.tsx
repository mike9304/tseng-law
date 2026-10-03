'use client';

import SearchPageView, { type SearchPageViewProps } from './SearchPageView';

/** Hydrate the observed Japanese search route from completed public data, with SSR. */
export default function JaSearchView(props: SearchPageViewProps) {
  return <SearchPageView {...props} />;
}
