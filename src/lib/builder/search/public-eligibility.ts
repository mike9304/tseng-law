import { listPages } from '@/lib/builder/site/persistence';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import { isLocale, type SiteLocale } from '@/lib/locales';
import { getPublicIntentSearchDocs } from './public-intent-docs';
import type { SearchHit } from './types';

export function isPubliclySearchablePage(page: BuilderPageMeta): boolean {
  if (!page.publishedAt) return false;
  if (page.noIndex || page.seo?.noIndex) return false;
  if (page.memberAccess?.requireLogin) return false;
  if (page.password) return false;
  return true;
}

export async function retainPublicPageHits(
  hits: SearchHit[],
  locale: SiteLocale,
  siteId = 'default',
): Promise<SearchHit[]> {
  if (!hits.some((hit) => hit.doc.kind === 'page')) return hits;

  const intentIds = new Set(getPublicIntentSearchDocs(locale).map((doc) => doc.id));
  const needsLivePageLookup = hits.some(
    (hit) => hit.doc.kind === 'page' && !intentIds.has(hit.doc.id),
  );
  if (!needsLivePageLookup) return hits;

  if (!isLocale(locale)) {
    return hits.filter((hit) => hit.doc.kind !== 'page' || intentIds.has(hit.doc.id));
  }

  let pages: BuilderPageMeta[] = [];
  try {
    pages = await listPages(siteId, locale);
  } catch {
    return hits.filter((hit) => hit.doc.kind !== 'page' || intentIds.has(hit.doc.id));
  }

  const byId = new Map(pages.map((page) => [page.pageId, page]));
  const prefix = `page:${locale}:`;

  return hits.filter((hit) => {
    if (hit.doc.kind !== 'page') return true;
    if (intentIds.has(hit.doc.id)) return true;
    if (!hit.doc.id.startsWith(prefix)) return false;
    const page = byId.get(hit.doc.id.slice(prefix.length));
    if (!page) return false;
    return isPubliclySearchablePage(page);
  });
}
