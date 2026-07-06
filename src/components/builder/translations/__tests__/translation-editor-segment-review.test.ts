import { describe, expect, it } from 'vitest';
import { BUILDER_RICH_TEXT_FORMAT, type BuilderRichText } from '@/lib/builder/rich-text/types';
import {
  alignTargetSegmentsToSource,
  appendSourceSegmentLineToTargetLine,
  buildSegmentReviewRows,
  copySourceSegmentLineToTarget,
  copySourceSegmentLineToTargetLine,
  deleteTargetSegmentLine,
  hasSegmentReviewIssue,
  insertTargetSegmentLineAfter,
  mergeTargetSegmentLineDown,
  moveTargetSegmentLine,
  updateTargetSegmentLine,
} from '../TranslationEditorSegmentReview.model';
import { buildRichTextLineSignalProfiles } from '../TranslationEditorSegmentSignals';

function richTextLineSignalFixture(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '첫째\n둘째',
    doc: {
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '첫째', marks: [{ type: 'bold' }] }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '둘째',
                      marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

describe('TranslationEditorSegmentReview helpers', () => {
  it('marks missing target lines when the translation has fewer segments than the source', () => {
    const rows = buildSegmentReviewRows('첫째\n둘째', 'First');

    expect(rows).toEqual([
      { index: 1, source: '첫째', target: 'First', status: 'aligned' },
      { index: 2, source: '둘째', target: '', status: 'missing-target' },
    ]);
    expect(hasSegmentReviewIssue(rows)).toBe(true);
  });

  it('aligns target line count to the source while preserving existing target lines', () => {
    expect(alignTargetSegmentsToSource('첫째\n둘째\n셋째', 'First\nSecond\nThird\nExtra')).toBe(
      'First\nSecond\nThird',
    );
    expect(alignTargetSegmentsToSource('첫째\n둘째', 'First')).toBe('First\n');
  });

  it('updates a single target segment while preserving the surrounding target lines', () => {
    expect(updateTargetSegmentLine('첫째\n둘째', 'First', 1, 'Second')).toBe('First\nSecond');
    expect(updateTargetSegmentLine('첫째\n둘째', 'First\nSecond\nExtra', 0, 'Updated first')).toBe(
      'Updated first\nSecond\nExtra',
    );
  });

  it('copies one source segment into the matching target line while preserving surrounding lines', () => {
    expect(copySourceSegmentLineToTarget('첫째\n둘째', 'First\nSecond', 1)).toBe('First\n둘째');
    expect(copySourceSegmentLineToTarget('첫째\n둘째\n셋째', 'First', 2)).toBe('First\n\n셋째');
  });

  it('copies any source segment into any target line for non-proportional remaps', () => {
    expect(copySourceSegmentLineToTargetLine('첫째\n둘째\n셋째', 'First\nSecond', 2, 0)).toBe('셋째\nSecond\n');
    expect(copySourceSegmentLineToTargetLine('첫째\n둘째', 'First', 0, 2)).toBe('First\n\n첫째');
  });

  it('appends any source segment into a target line for multi-source merge edits', () => {
    expect(appendSourceSegmentLineToTargetLine('첫째\n둘째', 'First', 1, 0)).toBe('First 둘째\n');
    expect(appendSourceSegmentLineToTargetLine('첫째\n둘째\n셋째', 'First\nSecond', 2, 0)).toBe(
      'First 셋째\nSecond\n',
    );
    expect(appendSourceSegmentLineToTargetLine('첫째\n둘째', '', 1, 0)).toBe('둘째\n');
  });

  it('inserts a blank target segment below a row for split edits', () => {
    expect(insertTargetSegmentLineAfter('첫째\n둘째', 'First\nSecond', 0)).toBe('First\n\nSecond');
    expect(insertTargetSegmentLineAfter('첫째\n둘째', 'First\n', 0)).toBe('First\n\n');
    expect(insertTargetSegmentLineAfter('첫째\n둘째', '', 0)).toBe('\n\n');
  });

  it('deletes one target segment while preserving the source-aligned row count', () => {
    expect(deleteTargetSegmentLine('첫째\n둘째', 'First\n\nSecond', 1)).toBe('First\nSecond');
    expect(deleteTargetSegmentLine('첫째\n둘째', 'First\nSecond', 0)).toBe('Second\n');
    expect(deleteTargetSegmentLine('첫째\n둘째', '', 0)).toBe('\n');
  });

  it('reorders target segments while preserving the normalized row count', () => {
    expect(moveTargetSegmentLine('첫째\n둘째', 'First\nSecond', 0, 1)).toBe('Second\nFirst');
    expect(moveTargetSegmentLine('첫째\n둘째', 'First\nSecond\nThird', 2, 1)).toBe('First\nThird\nSecond');
    expect(moveTargetSegmentLine('첫째\n둘째', 'First', 0, 1)).toBe('\nFirst');
    expect(moveTargetSegmentLine('첫째\n둘째', 'First\nSecond', 0, -1)).toBe('First\nSecond');
  });

  it('merges a target segment with the next target segment while preserving the normalized row count', () => {
    expect(mergeTargetSegmentLineDown('첫째\n둘째', 'First\nSecond', 0)).toBe('First Second\n');
    expect(mergeTargetSegmentLineDown('첫째\n둘째\n셋째', 'First\nSecond\nThird', 1)).toBe(
      'First\nSecond Third\n',
    );
    expect(mergeTargetSegmentLineDown('첫째\n둘째', 'First\nSecond', 1)).toBe('First\nSecond');
  });

  it('profiles source rich-text signals by segment line', () => {
    const profiles = buildRichTextLineSignalProfiles(richTextLineSignalFixture());

    expect(profiles).toEqual([
      { lineIndex: 1, listDepth: 1, signals: ['bold', 'bulletList'] },
      { lineIndex: 2, listDepth: 1, signals: ['link', 'bulletList'] },
    ]);
  });
});
