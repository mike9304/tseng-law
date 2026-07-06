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
import {
  clampVisitorValue,
  readVisitorScalar,
  sanitizeVisitorFieldId,
  type VisitorDatasetQuery,
} from '@/lib/builder/datasets-visitor-query';
import {
  parseVisitorPaginationParams,
  type VisitorPagination,
} from '@/lib/builder/datasets-visitor-pagination';

export {
  buildVisitorQueryString,
  parseVisitorDatasetQuery,
  type VisitorDatasetQuery,
} from '@/lib/builder/datasets-visitor-query';
export {
  parseVisitorPaginationParams,
  sliceVisitorRecords,
  type VisitorPagination,
} from '@/lib/builder/datasets-visitor-pagination';

const MAX_VISITOR_FILTERS = 6;
const MAX_VISITOR_SORTS = 3;

export interface VisitorDatasetFieldDefinition {
  readonly fieldId: string;
  readonly label: string;
}

export interface VisitorDatasetFieldAccess {
  readonly filterFields: readonly VisitorDatasetFieldDefinition[];
  readonly sortFields: readonly VisitorDatasetFieldDefinition[];
  readonly defaultLimit?: number;
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
  fieldAccess,
}: {
  targetId: BuilderDatasetTargetId;
  binding: BuilderPageDatasetBinding;
  query: VisitorDatasetQuery | null | undefined;
  fieldAccess?: VisitorDatasetFieldAccess;
}): VisitorDatasetComposition {
  const definition = getBuilderBindableTarget(targetId);
  const resolvedFieldAccess = fieldAccess ?? definition;
  const filterWhitelist = new Set(resolvedFieldAccess.filterFields.map((field) => field.fieldId));
  const sortWhitelist = new Set(resolvedFieldAccess.sortFields.map((field) => field.fieldId));

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

  const editorLimit = typeof binding.limit === 'number'
    ? binding.limit
    : resolvedFieldAccess.defaultLimit;
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

function readFilterPairs(
  raw: VisitorDatasetQuery['filter'] | undefined,
  operatorRaw: VisitorDatasetQuery['filterOp'] | undefined,
): BuilderPageDatasetFilter[] {
  if (!raw) return [];
  const pairs: BuilderPageDatasetFilter[] = [];
  for (const key of Object.keys(raw)) {
    const fieldId = sanitizeVisitorFieldId(key);
    if (!fieldId) continue;
    const value = clampVisitorValue(readVisitorScalar(raw[key]));
    if (!value) continue;
    const operator = readFilterOperator(readVisitorScalar(operatorRaw?.[key]));
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
    const fieldId = sanitizeVisitorFieldId(rawField);
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

function readFilterOperator(input: string | undefined): BuilderDatasetFilterOperator {
  return input === 'equals' ? 'equals' : 'contains';
}
