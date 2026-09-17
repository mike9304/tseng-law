import { SEARCH_DOC_KINDS, type SearchDoc, type SearchDocKind } from '@/lib/builder/search/types';

export function countPublicSearchDocsByKind(docs: readonly SearchDoc[]): Record<SearchDocKind, number> {
  const counts: Record<SearchDocKind, number> = {
    page: 0,
    blog: 0,
    faq: 0,
    portfolio: 0,
  };
  for (const doc of docs) {
    counts[doc.kind] += 1;
  }
  return counts;
}

export function visiblePublicSearchKindIds(
  counts: Record<SearchDocKind, number>,
): Array<SearchDocKind | 'all'> {
  return ['all', ...SEARCH_DOC_KINDS.filter((kind) => counts[kind] > 0)];
}
