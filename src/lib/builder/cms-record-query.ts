import type {
  BuilderCmsFieldDefinition,
  BuilderCmsFieldType,
  BuilderCmsRecord,
} from '@/lib/builder/cms-types';

export type BuilderCmsRecordSortDirection = 'asc' | 'desc';

export type BuilderCmsRecordFilterOperator =
  | 'is'
  | 'is-not'
  | 'contains'
  | 'not-contains'
  | 'empty'
  | 'not-empty'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'before'
  | 'after'
  | 'includes';

export interface BuilderCmsRecordFilter {
  filterId: string;
  fieldKey: string;
  operator: BuilderCmsRecordFilterOperator;
  value?: unknown;
}

export interface BuilderCmsRecordQueryOptions {
  query?: string;
  filters?: BuilderCmsRecordFilter[];
  sortBy?: string;
  sortDirection?: BuilderCmsRecordSortDirection;
  page?: number;
  pageSize?: number;
}

export interface BuilderCmsRecordQueryResult {
  records: BuilderCmsRecord[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  filteredRecordIds: string[];
}

export interface BuilderCmsRecordSavedView {
  viewId: string;
  name: string;
  query: string;
  filters: BuilderCmsRecordFilter[];
  sortBy: string;
  sortDirection: BuilderCmsRecordSortDirection;
  pageSize: number;
  createdAt: string;
  updatedAt: string;
}

export function queryBuilderCmsRecords(
  records: BuilderCmsRecord[],
  fields: BuilderCmsFieldDefinition[],
  options: BuilderCmsRecordQueryOptions = {},
): BuilderCmsRecordQueryResult {
  const query = options.query?.trim().toLowerCase() ?? '';
  const filters = normalizeBuilderCmsRecordFilters(options.filters);
  const sortBy = options.sortBy?.trim() || 'updatedAt';
  const sortDirection = options.sortDirection === 'asc' ? 'asc' : 'desc';

  const filtered = records.filter((record) => (
    matchesFreeTextQuery(record, fields, query) &&
    filters.every((filter) => matchesTypedFilter(record, fields, filter))
  ));

  const direction = sortDirection === 'asc' ? 1 : -1;
  const sorted = [...filtered].sort((left, right) => {
    const result = compareBuilderCmsRecordValues(
      getBuilderCmsRecordValue(left, sortBy),
      getBuilderCmsRecordValue(right, sortBy),
    );
    if (result !== 0) return result * direction;
    return left.recordId.localeCompare(right.recordId, 'en', {
      numeric: true,
      sensitivity: 'base',
    });
  });

  const pageSize = normalizePageSize(options.pageSize);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.min(pageCount, Math.max(1, Math.trunc(Number(options.page) || 1)));
  const startIndex = (page - 1) * pageSize;

  return {
    records: sorted.slice(startIndex, startIndex + pageSize),
    total: sorted.length,
    page,
    pageSize,
    pageCount,
    filteredRecordIds: sorted.map((record) => record.recordId),
  };
}

export function createBuilderCmsRecordSavedView(input: {
  name: string;
  query?: string;
  filters?: BuilderCmsRecordFilter[];
  sortBy?: string;
  sortDirection?: BuilderCmsRecordSortDirection;
  pageSize?: number;
  now?: string;
}): BuilderCmsRecordSavedView {
  const now = input.now ?? new Date().toISOString();
  return {
    viewId: `view-${now.replace(/[^0-9a-z]/gi, '').toLowerCase()}`,
    name: normalizeSavedViewName(input.name),
    query: input.query?.trim() ?? '',
    filters: normalizeBuilderCmsRecordFilters(input.filters),
    sortBy: input.sortBy?.trim() || 'updatedAt',
    sortDirection: input.sortDirection === 'asc' ? 'asc' : 'desc',
    pageSize: normalizePageSize(input.pageSize),
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeBuilderCmsRecordSavedViews(input: unknown): BuilderCmsRecordSavedView[] {
  const candidates = Array.isArray(input) ? input : [];
  const seen = new Set<string>();
  return candidates.flatMap((candidate) => {
    if (!candidate || typeof candidate !== 'object') return [];
    const source = candidate as Partial<BuilderCmsRecordSavedView>;
    const name = typeof source.name === 'string' ? source.name.trim() : '';
    if (!name) return [];
    const viewId = typeof source.viewId === 'string' && source.viewId.trim()
      ? source.viewId.trim()
      : `view-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (seen.has(viewId)) return [];
    seen.add(viewId);
    const createdAt = normalizeIsoString(source.createdAt) ?? new Date(0).toISOString();
    return [{
      viewId,
      name,
      query: typeof source.query === 'string' ? source.query : '',
      filters: normalizeBuilderCmsRecordFilters(source.filters),
      sortBy: typeof source.sortBy === 'string' && source.sortBy.trim() ? source.sortBy.trim() : 'updatedAt',
      sortDirection: source.sortDirection === 'asc' ? 'asc' : 'desc',
      pageSize: normalizePageSize(source.pageSize),
      createdAt,
      updatedAt: normalizeIsoString(source.updatedAt) ?? createdAt,
    }];
  });
}

export function normalizeBuilderCmsRecordFilters(input: unknown): BuilderCmsRecordFilter[] {
  const candidates = Array.isArray(input) ? input : [];
  return candidates.flatMap((candidate, index) => {
    if (!candidate || typeof candidate !== 'object') return [];
    const source = candidate as Partial<BuilderCmsRecordFilter>;
    const fieldKey = typeof source.fieldKey === 'string' ? source.fieldKey.trim() : '';
    if (!fieldKey || !isBuilderCmsRecordFilterOperator(source.operator)) return [];
    const filterId = typeof source.filterId === 'string' && source.filterId.trim()
      ? source.filterId.trim()
      : `filter-${index + 1}`;
    return [{
      filterId,
      fieldKey,
      operator: source.operator,
      value: source.operator === 'empty' || source.operator === 'not-empty' ? undefined : source.value,
    }];
  });
}

export function stringifyBuilderCmsRecordValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(stringifyBuilderCmsRecordValue).join(' ');
  if (value === null || value === undefined) return '';
  if (isRecordObject(value)) {
    const parts = [
      typeof value.url === 'string' ? value.url : '',
      typeof value.altText === 'string' ? value.altText : '',
      typeof value.filename === 'string' ? value.filename : '',
      typeof value.assetId === 'string' ? value.assetId : '',
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : JSON.stringify(value);
  }
  return String(value);
}

export function compareBuilderCmsRecordValues(left: unknown, right: unknown): number {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return stringifyBuilderCmsRecordValue(left).localeCompare(stringifyBuilderCmsRecordValue(right), 'en', {
    numeric: true,
    sensitivity: 'base',
  });
}

export function getBuilderCmsRecordValue(record: BuilderCmsRecord, key: string): unknown {
  if (key === 'recordId') return record.recordId;
  if (key === 'status') return record.status;
  if (key === 'locale') return record.locale ?? '';
  if (key === 'createdAt') return record.createdAt;
  if (key === 'updatedAt') return record.updatedAt;
  return record.fields[key];
}

function matchesFreeTextQuery(
  record: BuilderCmsRecord,
  fields: BuilderCmsFieldDefinition[],
  query: string,
): boolean {
  if (!query) return true;
  const searchable = [
    record.recordId,
    record.status,
    record.locale ?? '',
    ...fields.map((field) => stringifyBuilderCmsRecordValue(record.fields[field.key])),
  ].join(' ').toLowerCase();
  return searchable.includes(query);
}

function matchesTypedFilter(
  record: BuilderCmsRecord,
  fields: BuilderCmsFieldDefinition[],
  filter: BuilderCmsRecordFilter,
): boolean {
  const field = fields.find((candidate) => candidate.key === filter.fieldKey);
  const fieldType = field?.type ?? systemFieldType(filter.fieldKey);
  const recordValue = getBuilderCmsRecordValue(record, filter.fieldKey);

  switch (filter.operator) {
    case 'empty':
      return isEmptyRecordValue(recordValue);
    case 'not-empty':
      return !isEmptyRecordValue(recordValue);
    case 'contains':
      return stringifyBuilderCmsRecordValue(recordValue).toLowerCase().includes(
        stringifyBuilderCmsRecordValue(filter.value).toLowerCase(),
      );
    case 'not-contains':
      return !stringifyBuilderCmsRecordValue(recordValue).toLowerCase().includes(
        stringifyBuilderCmsRecordValue(filter.value).toLowerCase(),
      );
    case 'includes':
      return arrayValues(recordValue).some((item) => (
        stringifyBuilderCmsRecordValue(item).toLowerCase() === stringifyBuilderCmsRecordValue(filter.value).toLowerCase()
      ));
    case 'is':
      return compareComparableValues(recordValue, filter.value, fieldType) === 0;
    case 'is-not':
      return compareComparableValues(recordValue, filter.value, fieldType) !== 0;
    case 'gt':
      return compareComparableValues(recordValue, filter.value, fieldType) > 0;
    case 'gte':
      return compareComparableValues(recordValue, filter.value, fieldType) >= 0;
    case 'lt':
      return compareComparableValues(recordValue, filter.value, fieldType) < 0;
    case 'lte':
      return compareComparableValues(recordValue, filter.value, fieldType) <= 0;
    case 'before':
      return compareDateValues(recordValue, filter.value) < 0;
    case 'after':
      return compareDateValues(recordValue, filter.value) > 0;
    default:
      return true;
  }
}

function compareComparableValues(
  left: unknown,
  right: unknown,
  fieldType: BuilderCmsFieldType | 'system',
): number {
  if (fieldType === 'number') {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    if (!Number.isFinite(leftNumber) || !Number.isFinite(rightNumber)) return Number.NaN;
    return leftNumber - rightNumber;
  }
  if (fieldType === 'boolean') {
    const leftBoolean = normalizeBoolean(left);
    const rightBoolean = normalizeBoolean(right);
    if (leftBoolean === rightBoolean) return 0;
    return leftBoolean ? 1 : -1;
  }
  if (fieldType === 'date') return compareDateValues(left, right);
  return compareBuilderCmsRecordValues(left, right);
}

function compareDateValues(left: unknown, right: unknown): number {
  const leftTime = Date.parse(String(left ?? ''));
  const rightTime = Date.parse(String(right ?? ''));
  if (!Number.isFinite(leftTime) || !Number.isFinite(rightTime)) return Number.NaN;
  return leftTime - rightTime;
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  return String(value).trim().toLowerCase() === 'true';
}

function arrayValues(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split('\n').map((item) => item.trim()).filter(Boolean);
  return [];
}

function isEmptyRecordValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length === 0;
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (isRecordObject(value)) return Object.keys(value).length === 0 || !stringifyBuilderCmsRecordValue(value).trim();
  return false;
}

function systemFieldType(key: string): BuilderCmsFieldType | 'system' {
  if (key === 'createdAt' || key === 'updatedAt') return 'date';
  return 'system';
}

function normalizePageSize(value: unknown): number {
  const numberValue = Math.trunc(Number(value));
  if (!Number.isFinite(numberValue)) return 10;
  return Math.min(100, Math.max(1, numberValue));
}

function normalizeSavedViewName(value: string): string {
  const name = value.trim();
  if (!name) throw new Error('Saved view name is required.');
  return name.slice(0, 80);
}

function normalizeIsoString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

function isBuilderCmsRecordFilterOperator(value: unknown): value is BuilderCmsRecordFilterOperator {
  return value === 'is' ||
    value === 'is-not' ||
    value === 'contains' ||
    value === 'not-contains' ||
    value === 'empty' ||
    value === 'not-empty' ||
    value === 'gt' ||
    value === 'gte' ||
    value === 'lt' ||
    value === 'lte' ||
    value === 'before' ||
    value === 'after' ||
    value === 'includes';
}

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
