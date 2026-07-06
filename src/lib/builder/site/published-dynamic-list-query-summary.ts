import {
  parseVisitorDatasetQuery,
  type VisitorDatasetQuery,
} from '@/lib/builder/datasets-visitor-filters';
import { normalizeVisitorSearchTerm } from '@/lib/builder/site/dynamic-list-record-query';

type SearchParams = Record<string, string | string[] | undefined>;

export interface PublishedDynamicListVisitorSummaryItem {
  readonly label: string;
  readonly href: string;
}

export function summarizeVisitorQueryItems({
  basePath,
  currentPerPage,
  query,
  searchParams,
}: {
  readonly basePath: string;
  readonly currentPerPage?: number;
  readonly query: ReturnType<typeof parseVisitorDatasetQuery>;
  readonly searchParams: SearchParams | undefined;
}): PublishedDynamicListVisitorSummaryItem[] {
  const items: PublishedDynamicListVisitorSummaryItem[] = [];
  const searchTerm = normalizeVisitorSearchTerm(query.q);
  if (searchTerm) {
    items.push({
      label: `search ${searchTerm}`,
      href: buildVisitorSummaryHref({
        basePath,
        currentPerPage,
        query,
        removal: { kind: 'search' },
        searchParams,
      }),
    });
  }
  for (const [fieldId, value] of Object.entries(query.filter ?? {})) {
    const filterValue = Array.isArray(value) ? value[0] : value;
    if (!filterValue) continue;
    const operator = query.filterOp?.[fieldId];
    const opValue = Array.isArray(operator) ? operator[0] : operator;
    items.push({
      label: `${fieldId} ${opValue === 'equals' ? '=' : 'contains'} ${filterValue}`,
      href: buildVisitorSummaryHref({
        basePath,
        currentPerPage,
        query,
        removal: { kind: 'filter', fieldId },
        searchParams,
      }),
    });
  }
  for (const token of normalizeSortTokens(query.sort)) {
    items.push({
      label: `sort ${token}`,
      href: buildVisitorSummaryHref({
        basePath,
        currentPerPage,
        query,
        removal: { kind: 'sort', token },
        searchParams,
      }),
    });
  }
  return items;
}

function buildVisitorSummaryHref({
  basePath,
  currentPerPage,
  query,
  removal,
  searchParams,
}: {
  readonly basePath: string;
  readonly currentPerPage?: number;
  readonly query: VisitorDatasetQuery;
  readonly removal:
    | { readonly kind: 'search' }
    | { readonly kind: 'filter'; readonly fieldId: string }
    | { readonly kind: 'sort'; readonly token: string };
  readonly searchParams: SearchParams | undefined;
}): string {
  const params = cloneSearchParams(searchParams);
  params.delete('page');
  if (removal.kind === 'search') {
    params.delete('q');
  } else if (removal.kind === 'filter') {
    params.delete(`filter[${removal.fieldId}]`);
    params.delete(`filterOp[${removal.fieldId}]`);
  } else {
    const sortTokens = normalizeSortTokens(query.sort).filter((token) => token !== removal.token);
    params.delete('sort');
    if (sortTokens.length > 0) {
      params.set('sort', sortTokens.join(','));
    }
  }
  if (typeof currentPerPage === 'number') {
    params.set('perPage', String(currentPerPage));
  }
  const serialized = params.toString();
  return serialized ? `${basePath}?${serialized}` : basePath;
}

function normalizeSortTokens(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  return (Array.isArray(raw) ? raw : [raw])
    .flatMap((entry) => entry.split(','))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function cloneSearchParams(input: SearchParams | undefined): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input ?? {})) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string' && item) params.append(key, item);
      }
      continue;
    }
    if (typeof value === 'string' && value) {
      params.set(key, value);
    }
  }
  return params;
}
