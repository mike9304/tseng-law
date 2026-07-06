import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { RelationColumnPickerDataAttributes } from '../RelationColumnPickerAttributes';
import { RelationColumnPickerList } from '../RelationColumnPickerList';
import { getRelationColumnListWindow } from '../RelationColumnPickerVirtualWindow';

const dataAttributes = {
  clearSelected: ['data-test-clear-selected'],
  clearShown: 'data-test-clear-shown',
  column: 'data-test-column',
  columnPicker: 'data-test-column-picker',
  search: 'data-test-search',
  searchClear: 'data-test-search-clear',
  selectShown: 'data-test-select-shown',
  selectedColumn: 'data-test-selected-column',
  selectedColumnRemove: 'data-test-selected-column-remove',
  selectedColumns: 'data-test-selected-columns',
  selectedOnly: 'data-test-selected-only',
  undo: ['data-test-undo'],
} satisfies RelationColumnPickerDataAttributes;

const windowConfig = {
  overscan: 2,
  rowHeight: 64,
  viewportHeight: 180,
} as const;

function options(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    slug: `column-${index}`,
    title: `Column ${index}`,
  }));
}

describe('RelationColumnPicker virtual window', () => {
  it('renders the top viewport plus overscan instead of the full relation set', () => {
    const window = getRelationColumnListWindow({
      itemCount: 120,
      scrollTop: 0,
      config: windowConfig,
    });

    expect(window).toEqual({
      bottomSpacerHeight: 7360,
      endIndex: 5,
      renderedCount: 5,
      startIndex: 0,
      topSpacerHeight: 0,
      totalHeight: 7680,
    });
  });

  it('moves the rendered window after scrolling into a large relation set', () => {
    const window = getRelationColumnListWindow({
      itemCount: 120,
      scrollTop: 640,
      config: windowConfig,
    });

    expect(window).toEqual({
      bottomSpacerHeight: 6720,
      endIndex: 15,
      renderedCount: 7,
      startIndex: 8,
      topSpacerHeight: 512,
      totalHeight: 7680,
    });
  });

  it('server-renders only the initial relation rows for large lists', () => {
    const initialWindow = getRelationColumnListWindow({
      itemCount: 120,
      scrollTop: 0,
    });
    const markup = renderToStaticMarkup(
      <RelationColumnPickerList
        columnOptions={options(120)}
        dataAttributes={dataAttributes}
        disabled={false}
        emptyMessage="No related columns."
        selectedColumnSlugs={new Set()}
        onColumnCheckedChange={() => undefined}
      />,
    );

    expect(markup.match(/data-test-column=/g)).toHaveLength(initialWindow.renderedCount);
    expect(markup).toContain('column-0');
    expect(markup).not.toContain('column-20');
  });
});
