'use client';

import JaPageShell from '@/components/ja-design/JaPageShell';
import SearchPageView, { type SearchPageViewProps } from './SearchPageView';
import jaSearchStyles from './JaSearch.module.css';

/**
 * Hydrate the observed Japanese search route from completed public data, with SSR.
 * The ja 昊 V2 shell renders inside this client view (as JaColumnsView does), so the route still returns one
 * synchronous view instead of streaming it as server-element children of the wrapper.
 */
export default function JaSearchView(props: SearchPageViewProps) {
  return (
    <JaPageShell page="search" className={jaSearchStyles.root}>
      <SearchPageView {...props} />
    </JaPageShell>
  );
}
