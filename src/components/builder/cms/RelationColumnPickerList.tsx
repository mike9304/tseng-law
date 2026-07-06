'use client';

import { useEffect, useMemo, useRef, useState, type UIEvent } from 'react';
import type { BuilderCollectionRecordRelationOption } from '@/lib/builder/cms';
import {
  checkboxStyle,
  columnSlugStyle,
  columnTextStyle,
  columnTitleStyle,
  helperTextStyle,
  relationListStyle,
  virtualColumnListSpacerStyle,
  virtualColumnRowStyle,
} from './SourceRecordRelationPickerStyles';
import {
  dataFlag,
  dataValue,
  type RelationColumnPickerDataAttributes,
} from './RelationColumnPickerAttributes';
import {
  getRelationColumnListWindow,
  relationColumnListDefaultWindowConfig,
} from './RelationColumnPickerVirtualWindow';

type RelationColumnPickerListProps = {
  readonly columnOptions: readonly BuilderCollectionRecordRelationOption[];
  readonly dataAttributes: RelationColumnPickerDataAttributes;
  readonly disabled: boolean;
  readonly emptyMessage: string;
  readonly onColumnCheckedChange: (slug: string, checked: boolean) => void;
  readonly selectedColumnSlugs: ReadonlySet<string>;
};

export function RelationColumnPickerList({
  columnOptions,
  dataAttributes,
  disabled,
  emptyMessage,
  onColumnCheckedChange,
  selectedColumnSlugs,
}: RelationColumnPickerListProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const window = useMemo(() => getRelationColumnListWindow({
    itemCount: columnOptions.length,
    scrollTop,
  }), [columnOptions.length, scrollTop]);
  const visibleColumnOptions = useMemo(
    () => columnOptions.slice(window.startIndex, window.endIndex),
    [columnOptions, window.endIndex, window.startIndex],
  );

  useEffect(() => {
    setScrollTop(0);
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [columnOptions]);

  function updateScrollTop(event: UIEvent<HTMLDivElement>) {
    setScrollTop(event.currentTarget.scrollTop);
  }

  return (
    <div
      ref={listRef}
      {...dataFlag(dataAttributes.columnPicker)}
      style={relationListStyle}
      onScroll={updateScrollTop}
    >
      <div
        style={{
          ...virtualColumnListSpacerStyle,
          blockSize: window.totalHeight,
        }}
      >
        {visibleColumnOptions.map((option, index) => (
          <label
            key={option.slug}
            style={{
              ...virtualColumnRowStyle,
              transform: `translateY(${window.topSpacerHeight + (index * relationColumnListDefaultWindowConfig.rowHeight)}px)`,
            }}
          >
            <input
              {...dataValue(dataAttributes.column, option.slug)}
              style={checkboxStyle}
              type="checkbox"
              checked={selectedColumnSlugs.has(option.slug)}
              disabled={disabled}
              onChange={(event) => onColumnCheckedChange(option.slug, event.target.checked)}
            />
            <span style={columnTextStyle}>
              <span style={columnTitleStyle}>{option.title}</span>
              <span style={columnSlugStyle}>{option.slug}</span>
            </span>
          </label>
        ))}
      </div>
      {columnOptions.length ? null : (
        <span style={helperTextStyle}>{emptyMessage}</span>
      )}
    </div>
  );
}
