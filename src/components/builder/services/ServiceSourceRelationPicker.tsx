'use client';

import type { BuilderCollectionRecordRelationOption } from '@/lib/builder/cms';
import { RelationColumnPicker } from '@/components/builder/cms/RelationColumnPicker';

type ServiceSourceRelationPickerProps = {
  readonly columnOptions?: readonly BuilderCollectionRecordRelationOption[];
  readonly columnSlugs: readonly string[];
  readonly disabled: boolean;
  readonly onColumnSlugsChange: (columnSlugs: readonly string[]) => void;
};

export function ServiceSourceRelationPicker({
  columnOptions = [],
  columnSlugs,
  disabled,
  onColumnSlugsChange,
}: ServiceSourceRelationPickerProps) {
  return (
    <RelationColumnPicker
      columnOptions={columnOptions}
      columnSlugs={columnSlugs}
      copy={serviceRelationCopy}
      dataAttributes={serviceRelationDataAttributes}
      disabled={disabled}
      onColumnSlugsChange={onColumnSlugsChange}
    />
  );
}

const serviceRelationCopy = {
  clearSearchAriaLabel: 'Clear service related column search',
  columnSearchAriaLabel: 'Search service related columns',
  emptyList: 'No related columns match this search.',
  emptySelectedList: 'Select related columns to show them here.',
  emptySelectedSearch: 'No selected related columns match this search.',
  legend: 'Related columns',
  noSelectedColumns: 'No related columns selected.',
  removeColumnAriaLabel: (title: string) => `Remove service related column ${title}`,
  selectedColumnsAriaLabel: 'Selected service related columns',
} as const;

const serviceRelationDataAttributes = {
  clearSelected: ['data-service-source-selected-clear'],
  clearShown: 'data-service-source-clear-shown',
  column: 'data-service-source-column',
  columnPicker: 'data-service-source-column-picker',
  search: 'data-service-source-column-search',
  searchClear: 'data-service-source-column-search-clear',
  selectShown: 'data-service-source-select-shown',
  selectedColumn: 'data-service-source-selected-column',
  selectedColumnRemove: 'data-service-source-selected-column-remove',
  selectedColumns: 'data-service-source-selected-columns',
  selectedOnly: 'data-service-source-selected-only',
  undo: ['data-service-source-selected-undo'],
} as const;
