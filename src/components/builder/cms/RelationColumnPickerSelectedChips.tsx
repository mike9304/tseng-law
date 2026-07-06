'use client';

import type { BuilderCollectionRecordRelationOption } from '@/lib/builder/cms';
import {
  helperTextStyle,
  removeSelectedColumnStyle,
  selectedColumnChipStyle,
  selectedColumnsStyle,
  selectedColumnTitleStyle,
} from './SourceRecordRelationPickerStyles';
import {
  dataFlag,
  dataValue,
  type RelationColumnPickerCopy,
  type RelationColumnPickerDataAttributes,
} from './RelationColumnPickerAttributes';

type RelationColumnPickerSelectedChipsProps = {
  readonly copy: RelationColumnPickerCopy;
  readonly dataAttributes: RelationColumnPickerDataAttributes;
  readonly disabled: boolean;
  readonly onColumnRemove: (slug: string) => void;
  readonly selectedColumnOptions: readonly BuilderCollectionRecordRelationOption[];
};

export function RelationColumnPickerSelectedChips({
  copy,
  dataAttributes,
  disabled,
  onColumnRemove,
  selectedColumnOptions,
}: RelationColumnPickerSelectedChipsProps) {
  return (
    <div
      {...dataFlag(dataAttributes.selectedColumns)}
      aria-label={copy.selectedColumnsAriaLabel}
      style={selectedColumnsStyle}
    >
      {selectedColumnOptions.length ? selectedColumnOptions.map((option) => (
        <span
          key={option.slug}
          {...dataValue(dataAttributes.selectedColumn, option.slug)}
          style={selectedColumnChipStyle}
        >
          <span style={selectedColumnTitleStyle}>{option.title}</span>
          <button
            {...dataValue(dataAttributes.selectedColumnRemove, option.slug)}
            aria-label={copy.removeColumnAriaLabel(option.title)}
            disabled={disabled}
            style={removeSelectedColumnStyle}
            type="button"
            onClick={() => onColumnRemove(option.slug)}
          >
            x
          </button>
        </span>
      )) : (
        <span style={helperTextStyle}>{copy.noSelectedColumns}</span>
      )}
    </div>
  );
}
