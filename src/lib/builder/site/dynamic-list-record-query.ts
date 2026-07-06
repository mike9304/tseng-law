import type {
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';
import type { DynamicListPublicRecord } from '@/lib/builder/site/dynamic-list-records';

export function filterAndSortDynamicListRecords(
  records: readonly DynamicListPublicRecord[],
  filters: readonly BuilderPageDatasetFilter[],
  sort: readonly BuilderPageDatasetSort[],
): readonly DynamicListPublicRecord[] {
  const filtered = filters.length > 0
    ? records.filter((record) => filters.every((filter) => matchesDynamicListRecordFilter(record, filter)))
    : records;
  if (sort.length === 0) return filtered;
  return [...filtered].sort((left, right) => {
    for (const sortItem of sort) {
      const leftValue = readDynamicListRecordSortValue(left, sortItem.fieldId);
      const rightValue = readDynamicListRecordSortValue(right, sortItem.fieldId);
      const compared = leftValue.localeCompare(rightValue, 'ko', { numeric: true, sensitivity: 'base' });
      if (compared !== 0) return sortItem.direction === 'desc' ? -compared : compared;
    }
    return left.primaryLabel.localeCompare(right.primaryLabel, 'ko', { numeric: true, sensitivity: 'base' });
  });
}

export function normalizeVisitorSearchTerm(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === 'string' ? raw.trim().slice(0, 120) : '';
}

export function filterDynamicListRecordsBySearch(
  records: readonly DynamicListPublicRecord[],
  term: string,
): DynamicListPublicRecord[] {
  if (!term.trim()) return [...records];
  return records.filter((record) => matchesDynamicListRecordSearch(record, term));
}

function matchesDynamicListRecordFilter(
  record: DynamicListPublicRecord,
  filter: BuilderPageDatasetFilter,
): boolean {
  const needle = filter.value.trim().toLocaleLowerCase();
  if (!needle) return true;
  const fieldValue = readDynamicListRecordFieldValue(record, filter.fieldId);
  if (!fieldValue) return false;
  const haystack = fieldValue.toLocaleLowerCase();
  return filter.operator === 'equals'
    ? haystack === needle
    : haystack.includes(needle);
}

function readDynamicListRecordSortValue(
  record: DynamicListPublicRecord,
  fieldId: string,
): string {
  const fieldValue = readDynamicListRecordFieldValue(record, fieldId);
  if (fieldValue) return fieldValue;
  switch (fieldId) {
    case 'title':
    case 'name':
      return record.primaryLabel;
    case 'description':
    case 'subtitle':
    case 'role':
    case 'email':
      return record.secondaryLabel;
    case 'href':
    case 'slug':
      return record.routePath;
    case 'recordId':
      return record.recordId;
    default:
      return `${record.primaryLabel} ${record.secondaryLabel} ${record.routePath} ${record.recordId}`;
  }
}

function readDynamicListRecordFieldValue(
  record: DynamicListPublicRecord,
  fieldId: string,
): string | null {
  const value = record.fieldValues[fieldId];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function matchesDynamicListRecordSearch(record: DynamicListPublicRecord, term: string): boolean {
  const normalizedTerm = term.trim().toLowerCase();
  if (!normalizedTerm) return true;
  return [
    ...Object.values(record.fieldValues),
    record.primaryLabel,
    record.secondaryLabel,
    record.routePath,
    record.recordId,
  ].some((value) => value.toLowerCase().includes(normalizedTerm));
}
