import type {
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';

export const VISITOR_FILTER_VALUE_MAX_LEN = 120;

export interface VisitorDatasetQuery {
  filter?: Record<string, string | string[] | undefined>;
  sort?: string | string[];
  q?: string | string[];
  page?: string | string[];
  perPage?: string | string[];
  limit?: string | string[];
  filterOp?: Record<string, string | string[] | undefined>;
}

export function parseVisitorDatasetQuery(
  searchParams: Record<string, string | string[] | undefined> | undefined,
): VisitorDatasetQuery {
  const query: VisitorDatasetQuery = {};
  const filter: Record<string, string | string[] | undefined> = {};
  const filterOp: Record<string, string | string[] | undefined> = {};

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (typeof value !== 'string' && !Array.isArray(value)) continue;
    if (key === 'sort') {
      query.sort = value;
      continue;
    }
    if (key === 'q') {
      query.q = value;
      continue;
    }
    if (key === 'page') {
      query.page = value;
      continue;
    }
    if (key === 'perPage') {
      query.perPage = value;
      continue;
    }
    if (key === 'limit') {
      query.limit = value;
      continue;
    }
    const filterMatch = key.match(/^filter\[(.+)\]$/);
    if (filterMatch) {
      filter[filterMatch[1]] = value;
      continue;
    }
    const filterOpMatch = key.match(/^filterOp\[(.+)\]$/);
    if (filterOpMatch) {
      filterOp[filterOpMatch[1]] = value;
    }
  }

  if (Object.keys(filter).length > 0) query.filter = filter;
  if (Object.keys(filterOp).length > 0) query.filterOp = filterOp;
  return query;
}

export function buildVisitorQueryString(input: {
  filters?: readonly BuilderPageDatasetFilter[];
  sort?: readonly BuilderPageDatasetSort[];
  search?: string;
  page?: number;
  perPage?: number;
}): string {
  const params = new URLSearchParams();
  const search = typeof input.search === 'string'
    ? input.search.trim().slice(0, VISITOR_FILTER_VALUE_MAX_LEN)
    : '';
  if (search) params.set('q', search);
  for (const filter of input.filters ?? []) {
    if (!filter.fieldId || !filter.value) continue;
    params.append(`filter[${filter.fieldId}]`, filter.value);
    if (filter.operator && filter.operator !== 'contains') {
      params.append(`filterOp[${filter.fieldId}]`, filter.operator);
    }
  }
  const sortSegments = (input.sort ?? [])
    .filter((entry) => entry.fieldId)
    .map((entry) => `${entry.fieldId}:${entry.direction === 'desc' ? 'desc' : 'asc'}`);
  if (sortSegments.length > 0) params.set('sort', sortSegments.join(','));
  if (typeof input.page === 'number' && input.page > 1) params.set('page', String(input.page));
  if (typeof input.perPage === 'number') params.set('perPage', String(input.perPage));
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export function sanitizeVisitorFieldId(value: string | null | undefined): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.length > 64) return '';
  if (!/^[A-Za-z0-9_.-]+$/.test(trimmed)) return '';
  return trimmed;
}

export function clampVisitorValue(value: string | null | undefined): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.slice(0, VISITOR_FILTER_VALUE_MAX_LEN);
}

export function readVisitorScalar(input: string | string[] | undefined): string | undefined {
  if (input === undefined) return undefined;
  if (Array.isArray(input)) return input.find((entry) => typeof entry === 'string' && entry.length > 0);
  return input;
}
