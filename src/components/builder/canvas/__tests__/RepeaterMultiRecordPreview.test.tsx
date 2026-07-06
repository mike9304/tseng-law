import { describe, expect, it } from 'vitest';
import {
  REPEATER_PREVIEW_MAX_VISIBLE_CARDS,
  resolveRepeaterPreviewWindow,
  type RepeaterPreviewRecord,
} from '@/components/builder/canvas/RepeaterMultiRecordPreview';

function makeRecord(recordId: string): RepeaterPreviewRecord {
  return {
    recordId,
    primaryLabel: `Record ${recordId}`,
    secondaryLabel: `Secondary ${recordId}`,
    routePath: `/ko/columns/${recordId}`,
  };
}

const records = [
  makeRecord('record-1'),
  makeRecord('record-2'),
  makeRecord('record-3'),
  makeRecord('record-4'),
] as const;

describe('resolveRepeaterPreviewWindow', () => {
  it('returns every record when the collection fits inside the preview limit', () => {
    const window = resolveRepeaterPreviewWindow(
      records.slice(0, REPEATER_PREVIEW_MAX_VISIBLE_CARDS),
      'record-2',
    );

    expect(window.map((record) => record.recordId)).toEqual(['record-1', 'record-2', 'record-3']);
  });

  it('keeps the active overflow record in the visible preview window', () => {
    const window = resolveRepeaterPreviewWindow(records, 'record-4');

    expect(window.map((record) => record.recordId)).toEqual(['record-2', 'record-3', 'record-4']);
  });

  it('falls back to the first preview window when the active record is missing', () => {
    const window = resolveRepeaterPreviewWindow(records, 'missing-record');

    expect(window.map((record) => record.recordId)).toEqual(['record-1', 'record-2', 'record-3']);
  });
});
