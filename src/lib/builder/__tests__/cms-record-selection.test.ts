import { describe, expect, test } from 'vitest';
import { resolveCmsRecordSelectionRange } from '@/lib/builder/cms-record-selection';

describe('resolveCmsRecordSelectionRange', () => {
  test('extends the current selection across a visible range when shift is held', () => {
    const result = resolveCmsRecordSelectionRange({
      anchorRecordId: 'record-a',
      currentSelectedRecordIds: ['record-a'],
      selected: true,
      shiftKey: true,
      targetRecordId: 'record-c',
      visibleRecordIds: ['record-a', 'record-b', 'record-c'],
    });

    expect(result).toEqual({
      nextAnchorRecordId: 'record-a',
      nextSelectedRecordIds: ['record-a', 'record-b', 'record-c'],
    });
  });

  test('falls back to a single-record selection when shift is not held', () => {
    const result = resolveCmsRecordSelectionRange({
      anchorRecordId: 'record-a',
      currentSelectedRecordIds: ['record-a'],
      selected: true,
      shiftKey: false,
      targetRecordId: 'record-c',
      visibleRecordIds: ['record-a', 'record-b', 'record-c'],
    });

    expect(result).toEqual({
      nextAnchorRecordId: 'record-c',
      nextSelectedRecordIds: ['record-a', 'record-c'],
    });
  });

  test('clears the anchor when the last selected record is removed', () => {
    const result = resolveCmsRecordSelectionRange({
      anchorRecordId: 'record-a',
      currentSelectedRecordIds: ['record-a'],
      selected: false,
      shiftKey: false,
      targetRecordId: 'record-a',
      visibleRecordIds: ['record-a', 'record-b', 'record-c'],
    });

    expect(result).toEqual({
      nextAnchorRecordId: null,
      nextSelectedRecordIds: [],
    });
  });
});
