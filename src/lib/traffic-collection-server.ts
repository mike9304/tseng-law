import type { ColumnPost } from './column-post';
import { getAllColumnPosts, getAllIssuePosts } from './columns';
import type { Locale, SiteLocale } from './locales';
import { buildTrafficCollection, type TrafficBoardItem } from './traffic-collection';

/**
 * Where the traffic hub reads posts from. Mirrors the public column index:
 * ko / zh-hant / en merge file columns with published CMS columns; Japanese is
 * file-only. Issue posts keep their own /columns/issues/<slug> URLs.
 * Injectable for tests.
 */
export type TrafficCollectionSources = {
  filePosts: (locale: SiteLocale) => ColumnPost[];
  mergedPosts: (locale: Locale) => Promise<ColumnPost[]>;
  issuePosts: (locale: SiteLocale) => ColumnPost[];
};

export const defaultTrafficCollectionSources: TrafficCollectionSources = {
  filePosts: (locale) => getAllColumnPosts(locale),
  mergedPosts: async (locale) => {
    // Loaded on demand so the client-safe collection module and its tests never pull in the Blob client.
    const { getAllColumnPostsIncludingBlob } = await import('./consultation/columns-blob-reader');
    return getAllColumnPostsIncludingBlob(locale);
  },
  issuePosts: (locale) => getAllIssuePosts(locale),
};

export async function loadTrafficCollection(
  locale: SiteLocale,
  sources: TrafficCollectionSources = defaultTrafficCollectionSources,
): Promise<TrafficBoardItem[]> {
  const columns = locale === 'ja' ? sources.filePosts(locale) : await sources.mergedPosts(locale);
  return buildTrafficCollection(locale, { columns, issues: sources.issuePosts(locale) });
}
