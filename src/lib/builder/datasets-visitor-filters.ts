/**
 * F24 — Visitor-supplied filter/sort/pagination helpers for dataset bindings.
 *
 * Translates query-string parameters supplied by public visitors
 * (`?filter[field]=value&sort=field:asc&page=2&perPage=12`) into a
 * `BuilderPageDatasetBindingPatch` that can be fed through
 * `replaceBuilderPageDatasetBinding` to produce a request-scoped binding for
 * the dynamic list page render. The functions here are pure — they only see
 * the binding target definition (which already declares its safe filterable
 * and sortable fields), the existing binding, and the visitor input.
 *
 * Security posture
 * ----------------
 * Visitors must never be able to filter on arbitrary fields, because some
 * collection fields are intentionally not exposed (e.g. internal status).
 * The whitelist is sourced from `getBuilderBindableTarget(targetId)` —
 * `filterFields` for `filter[...]` keys and `sortFields` for `sort=...` keys.
 * Anything outside the whitelist is dropped silently. Values are length-
 * clamped, trimmed, and the count is capped to prevent quadratic filter
 * explosions.
 *
 * Output shape
 * ------------
 * - `composeVisitorDatasetPatch` returns the patch (filters, sort, limit).
 * - `parseVisitorPaginationParams` returns `{ page, perPage, offset }` so
 *   the page renderer can slice the resolved records and emit
 *   previous/next links.
 *
 * Both pieces are exposed independently because pagination is a render-time
 * concern (number of records to show) while the filter/sort patch is a
 * binding-time concern (which records reach the page document).
 */
import {
  getBuilderBindableTarget,
} from '@/lib/builder/datasets';
import type {
  BuilderDatasetFilterOperator,
  BuilderDatasetSortDirection,
  BuilderDatasetTargetId,
  BuilderPageDatasetBinding,
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';
import type { BuilderPageDatasetBindingPatch } from '@/lib/builder/datasets';

const FILTER_VALUE_MAX_LEN = 120;
const MAX_VISITOR_FILTERS = 6;
const MAX_VISITOR_SORTS = 3;
const PAGE_MIN = 1;
const PAGE_MAX = 500;
const PER_PAGE_MIN = 1;
const PER_PAGE_MAX = 60;
const PER_PAGE_DEFAULT = 12;

export interface VisitorDatasetQuery {
  /** `filter[field]=value` form, decoded by the framework. */
  filter?: Record<string, string | string[] | undefined>;
  /** Comma-separated list of `field:dir` pairs (`title:asc,date:desc`). */
  sort?: string | string[];
  page?: string | string[];
  perPage?: string | string[];
  limit?: string | string[];
  /** Optional operator hint per filter — defaults to `contains`. */
  filterOp?: Record<string, string | string[] | undefined>;
}

export interface VisitorPagination {
  page: number;
  perPage: number;
  offset: number;
}

export interface VisitorDatasetComposition {
  patch: BuilderPageDatasetBindingPatch;
  pagination: VisitorPagination;
  appliedFilters: BuilderPageDatasetFilter[];
  appliedSort: BuilderPageDatasetSort[];
  /** Fields the visitor tried to filter on but were not whitelisted. */
  rejectedFilterFields: string[];
  rejectedSortFields: string[];
}

/**
 * Compose a binding patch for a single target id from visitor query params.
 *
 * Honors the existing binding's `limit` as the per-page cap unless the
 * visitor explicitly opts into a smaller `perPage` value. The resulting
 * patch never widens the limit beyond what the editor authored.
 */
export function composeVisitorDatasetPatch({
  targetId,
  binding,
  query,
}: {
  targetId: BuilderDatasetTargetId;
  binding: BuilderPageDatasetBinding;
  query: VisitorDatasetQuery | null | undefined;
}): VisitorDatasetComposition {
  const definition = getBuilderBindableTarget(targetId);
  const filterWhitelist = new Set(definition.filterFields.map((field) => field.fieldId));
  const sortWhitelist = new Set(definition.sortFields.map((field) => field.fieldId));

  const filterPairs = readFilterPairs(query?.filter, query?.filterOp);
  const appliedFilters: BuilderPageDatasetFilter[] = [];
  const rejectedFilterFields: string[] = [];
  const seenFilterKeys = new Set<string>();
  for (const pair of filterPairs) {
    if (!filterWhitelist.has(pair.fieldId)) {
      rejectedFilterFields.push(pair.fieldId);
      continue;
    }
    const dedupeKey = `${pair.fieldId}::${pair.operator}::${pair.value}`;
    if (seenFilterKeys.has(dedupeKey)) continue;
    seenFilterKeys.add(dedupeKey);
    appliedFilters.push(pair);
    if (appliedFilters.length >= MAX_VISITOR_FILTERS) break;
  }

  const { sort: appliedSort, rejected: rejectedSortFields } = readSortPairs(
    query?.sort,
    sortWhitelist,
  );

  const editorLimit = typeof binding.limit === 'number' ? binding.limit : definition.defaultLimit;
  const pagination = parseVisitorPaginationParams(query, editorLimit);

  const patch: BuilderPageDatasetBindingPatch = {
    filters: mergeFilters(binding.filters ?? [], appliedFilters),
    sort: appliedSort.length > 0 ? appliedSort : binding.sort ?? [],
  };
  if (typeof editorLimit === 'number') {
    patch.limit = Math.min(editorLimit, pagination.perPage * pagination.page);
  }

  return {
    patch,
    pagination,
    appliedFilters,
    appliedSort,
    rejectedFilterFields,
    rejectedSortFields,
  };
}

/**
 * Resolve `page` / `perPage` / `limit` from a visitor query into a normalized
 * pagination triple. `perPage` falls back to the editor-authored binding
 * limit so the visitor cannot widen the per-page count beyond what the
 * editor configured.
 */
export function parseVisitorPaginationParams(
  query: VisitorDatasetQuery | null | undefined,
  editorLimit?: number,
): VisitorPagination {
  const rawPage = readScalar(query?.page);
  const rawPerPage = readScalar(query?.perPage) ?? readScalar(query?.limit);
  const page = clampInt(rawPage, PAGE_MIN, PAGE_MAX, PAGE_MIN);
  const perPageCeiling = typeof editorLimit === 'number'
    ? Math.max(PER_PAGE_MIN, Math.min(PER_PAGE_MAX, editorLimit))
    : PER_PAGE_MAX;
  const perPage = clampInt(rawPerPage, PER_PAGE_MIN, perPageCeiling, PER_PAGE_DEFAULT);
  return {
    page,
    perPage,
    offset: (page - 1) * perPage,
  };
}

/**
 * Slice the resolved record list to the visitor's pagination window.
 * Mirrors the binding-level limit but is exposed so renderers that already
 * received the full filtered list can compute the visible window plus
 * pagination chrome (prev/next labels, total count).
 */
export function sliceVisitorRecords<TRecord>(
  records: readonly TRecord[],
  pagination: VisitorPagination,
): { items: TRecord[]; hasPrev: boolean; hasNext: boolean; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(records.length / pagination.perPage));
  const start = pagination.offset;
  const end = start + pagination.perPage;
  return {
    items: records.slice(start, end),
    hasPrev: pagination.page > 1,
    hasNext: end < records.length,
    totalPages,
  };
}

/**
 * Build the visitor-facing query string (used by pagination chrome and
 * "clear filter" affordances). Empty/blank values are stripped.
 */
export function buildVisitorQueryString(input: {
  filters?: BuilderPageDatasetFilter[];
  sort?: BuilderPageDatasetSort[];
  page?: number;
  perPage?: number;
}): string {
  const params = new URLSearchParams();
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

function readFilterPairs(
  raw: VisitorDatasetQuery['filter'] | undefined,
  operatorRaw: VisitorDatasetQuery['filterOp'] | undefined,
): BuilderPageDatasetFilter[] {
  if (!raw) return [];
  const pairs: BuilderPageDatasetFilter[] = [];
  for (const key of Object.keys(raw)) {
    const fieldId = sanitizeFieldId(key);
    if (!fieldId) continue;
    const value = clampValue(readScalar(raw[key]));
    if (!value) continue;
    const operator = readFilterOperator(readScalar(operatorRaw?.[key]));
    pairs.push({ fieldId, operator, value });
  }
  return pairs;
}

function readSortPairs(
  raw: string | string[] | undefined,
  whitelist: ReadonlySet<string>,
): { sort: BuilderPageDatasetSort[]; rejected: string[] } {
  const sort: BuilderPageDatasetSort[] = [];
  const rejected: string[] = [];
  if (!raw) return { sort, rejected };
  const tokens = (Array.isArray(raw) ? raw : [raw])
    .flatMap((entry) => entry.split(','))
    .map((entry) => entry.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  for (const token of tokens) {
    const [rawField, rawDir] = token.split(':');
    const fieldId = sanitizeFieldId(rawField);
    if (!fieldId) continue;
    if (!whitelist.has(fieldId)) {
      rejected.push(fieldId);
      continue;
    }
    if (seen.has(fieldId)) continue;
    seen.add(fieldId);
    const direction: BuilderDatasetSortDirection = rawDir === 'desc' ? 'desc' : 'asc';
    sort.push({ fieldId, direction });
    if (sort.length >= MAX_VISITOR_SORTS) break;
  }
  return { sort, rejected };
}

function mergeFilters(
  authored: BuilderPageDatasetFilter[],
  visitor: BuilderPageDatasetFilter[],
): BuilderPageDatasetFilter[] {
  const seen = new Set<string>();
  const merged: BuilderPageDatasetFilter[] = [];
  for (const entry of [...authored, ...visitor]) {
    if (!entry.fieldId || !entry.value) continue;
    const key = `${entry.fieldId}::${entry.operator}::${entry.value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push({ ...entry });
    if (merged.length >= MAX_VISITOR_FILTERS) break;
  }
  return merged;
}

function sanitizeFieldId(value: string | null | undefined): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.length > 64) return '';
  if (!/^[A-Za-z0-9_.-]+$/.test(trimmed)) return '';
  return trimmed;
}

function clampValue(value: string | null | undefined): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.slice(0, FILTER_VALUE_MAX_LEN);
}

function readScalar(input: string | string[] | undefined): string | undefined {
  if (input === undefined) return undefined;
  if (Array.isArray(input)) return input.find((entry) => typeof entry === 'string' && entry.length > 0);
  return input;
}

function readFilterOperator(input: string | undefined): BuilderDatasetFilterOperator {
  return input === 'equals' ? 'equals' : 'contains';
}

function clampInt(
  raw: string | undefined,
  min: number,
  max: number,
  fallback: number,
): number {
  if (typeof raw !== 'string') return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}