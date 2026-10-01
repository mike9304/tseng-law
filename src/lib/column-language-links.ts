import { fileBackedColumnAlternateLocales, getAllColumnPosts } from '@/lib/columns';
import {
  PUBLIC_LOCALES_8,
  type PublicColumnLanguageIndex,
  type PublicLocale8,
} from '@/lib/public-guidance';

/**
 * Languages that publish the column `slug`: the column page's hreflang cluster
 * (one markdown file per language under the same slug) plus `renderedLocale`,
 * the language the page is rendered in. A builder/Blob-only column has no
 * markdown file; without its own language its cluster would be empty and
 * x-default would name an English URL that does not exist.
 */
export function columnAlternateLocales(slug: string, renderedLocale: PublicLocale8): PublicLocale8[] {
  const locales = new Set<PublicLocale8>(fileBackedColumnAlternateLocales(slug));
  locales.add(renderedLocale);
  return PUBLIC_LOCALES_8.filter((locale) => locales.has(locale));
}

/**
 * What the language switchers on `locale` pages need, from one read of every
 * language's columns: which languages publish each column of `locale` (the
 * markdown cluster `fileBackedColumnAlternateLocales` gives hreflang), and
 * which languages have any column at all (for the column-language suggestion).
 */
export function publicColumnSwitcherData(locale: PublicLocale8): {
  index: PublicColumnLanguageIndex;
  columnLocales: PublicLocale8[];
} {
  const slugsByLocale = new Map(
    PUBLIC_LOCALES_8.map((target) => [target, new Set(getAllColumnPosts(target).map((post) => post.slug))]),
  );
  const clusters: PublicLocale8[][] = [];
  const clusterIds = new Map<string, number>();
  const columns: Record<string, number> = {};
  for (const slug of slugsByLocale.get(locale)!) {
    const cluster = PUBLIC_LOCALES_8.filter((target) => slugsByLocale.get(target)!.has(slug));
    const key = cluster.join(' ');
    if (!clusterIds.has(key)) {
      clusterIds.set(key, clusters.length);
      clusters.push(cluster);
    }
    columns[slug] = clusterIds.get(key)!;
  }
  return {
    index: { locale, clusters, columns },
    columnLocales: PUBLIC_LOCALES_8.filter((target) => slugsByLocale.get(target)!.size > 0),
  };
}
