import { readVisitorScalar } from '@/lib/builder/datasets-visitor-query';
import type { VisitorDatasetQuery } from '@/lib/builder/datasets-visitor-query';

const PAGE_MIN = 1;
const PAGE_MAX = 500;
const PER_PAGE_MIN = 1;
const PER_PAGE_MAX = 60;
const PER_PAGE_DEFAULT = 12;

export interface VisitorPagination {
  readonly page: number;
  readonly perPage: number;
  readonly offset: number;
}

export function parseVisitorPaginationParams(
  query: VisitorDatasetQuery | null | undefined,
  editorLimit?: number,
): VisitorPagination {
  const rawPage = readVisitorScalar(query?.page);
  const rawPerPage = readVisitorScalar(query?.perPage) ?? readVisitorScalar(query?.limit);
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
