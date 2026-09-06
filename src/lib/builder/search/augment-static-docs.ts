import type { SiteLocale } from '@/lib/locales';
import { buildSearchIndex } from './index-builder';
import type { SearchDoc, SearchIndex } from './types';

/**
 * In-memory merge of static public docs into a stored search index.
 * Preserves other locales, existing ids/order, and original builtAt.
 * Does not read storage, the filesystem, or the network.
 */
export function augmentStaticDocs(
  index: SearchIndex,
  locale: SiteLocale,
  docs: SearchDoc[],
): SearchIndex {
  if (locale !== 'en' && locale !== 'ja') {
    return index;
  }

  const existing = index.byLocale[locale] ?? [];
  const seenUrls = new Set(existing.map((doc) => doc.url));
  const added: SearchDoc[] = [];

  for (const doc of docs) {
    if (doc.locale !== locale) continue;
    if (seenUrls.has(doc.url)) continue;
    seenUrls.add(doc.url);
    added.push(doc);
  }

  if (added.length === 0) {
    return index;
  }

  const rebuilt = buildSearchIndex([...existing, ...added]);

  return {
    ...index,
    builtAt: index.builtAt,
    byLocale: {
      ...index.byLocale,
      [locale]: rebuilt.byLocale[locale],
    },
    invertedByLocale: {
      ...index.invertedByLocale,
      [locale]: rebuilt.invertedByLocale[locale],
    },
  };
}
