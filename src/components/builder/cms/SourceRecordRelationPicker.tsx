'use client';

import type { BuilderCollectionRecordRelationOption } from '@/lib/builder/cms';
import { RelationColumnPicker } from './RelationColumnPicker';

type SourceRecordRelationPickerProps = {
  readonly columnOptions: readonly BuilderCollectionRecordRelationOption[];
  readonly columnSlugs: readonly string[];
  readonly disabled: boolean;
  readonly onColumnSlugsChange: (columnSlugs: readonly string[]) => void;
};

export function SourceRecordRelationPicker({
  columnOptions,
  columnSlugs,
  disabled,
  onColumnSlugsChange,
}: SourceRecordRelationPickerProps) {
  return (
    <RelationColumnPicker
      columnOptions={columnOptions}
      columnSlugs={columnSlugs}
      copy={cmsRelationCopy}
      dataAttributes={cmsRelationDataAttributes}
      disabled={disabled}
      onColumnSlugsChange={onColumnSlugsChange}
    />
  );
}

const cmsRelationCopy = {
  clearSearchAriaLabel: 'Clear related column search',
  columnSearchAriaLabel: 'Search related columns',
  emptyList: 'No related columns match this search.',
  emptySelectedList: 'Select related columns to show them here.',
  emptySelectedSearch: 'No selected related columns match this search.',
  legend: 'Related columns',
  noSelectedColumns: 'No related columns selected.',
  removeColumnAriaLabel: (title: string) => `Remove related column ${title}`,
  selectedColumnsAriaLabel: 'Selected related columns',
} as const;

const cmsRelationDataAttributes = {
  clearSelected: ['data-cms-source-record-inline-clear-selected', 'data-cms-source-record-inline-selected-clear'],
  clearShown: 'data-cms-source-record-inline-clear-shown',
  column: 'data-cms-source-record-inline-column',
  columnPicker: 'data-cms-source-record-inline-column-picker',
  search: 'data-cms-source-record-inline-column-search',
  searchClear: 'data-cms-source-record-inline-column-search-clear',
  selectShown: 'data-cms-source-record-inline-select-shown',
  selectedColumn: 'data-cms-source-record-inline-selected-column',
  selectedColumnRemove: 'data-cms-source-record-inline-selected-column-remove',
  selectedColumns: 'data-cms-source-record-inline-selected-columns',
  selectedOnly: 'data-cms-source-record-inline-selected-only',
  undo: ['data-cms-source-record-inline-undo-clear', 'data-cms-source-record-inline-selected-undo'],
} as const;
