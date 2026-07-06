import type { Locale } from '@/lib/locales';
import type { BuilderRichText } from '@/lib/builder/rich-text/types';
import {
  buildRichTextLineSignalProfiles,
  TranslationEditorSegmentSignals,
} from './TranslationEditorSegmentSignals';
import { TranslationEditorSegmentTargetControls } from './TranslationEditorSegmentTargetControls';
import { SEGMENT_COPY } from './TranslationEditorSegmentReview.copy';
import {
  alignTargetSegmentsToSource,
  buildSegmentReviewRows,
  copySourceSegmentLineToTarget,
  hasSegmentReviewIssue,
  splitSegmentLines,
  type SegmentReviewStatus,
} from './TranslationEditorSegmentReview.model';

interface TranslationEditorSegmentReviewProps {
  readonly nodeId: string;
  readonly sourceLocale: Locale;
  readonly targetLocale: Locale;
  readonly sourceText: string;
  readonly sourceRichText?: BuilderRichText | null;
  readonly targetText: string;
  readonly onTargetTextChange: (value: string) => void;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled segment review status: ${value}`);
}

export function TranslationEditorSegmentReview({
  nodeId,
  sourceLocale,
  targetLocale,
  sourceText,
  sourceRichText,
  targetText,
  onTargetTextChange,
}: TranslationEditorSegmentReviewProps) {
  const sourceLines = splitSegmentLines(sourceText);
  const targetLines = splitSegmentLines(targetText);
  if (sourceLines.length < 2 && targetLines.length < 2) return null;

  const rows = buildSegmentReviewRows(sourceText, targetText);
  const sourceSignalProfiles = buildRichTextLineSignalProfiles(sourceRichText);
  const hasIssue = hasSegmentReviewIssue(rows);
  const copy = SEGMENT_COPY[targetLocale];
  const issueLabel = (status: SegmentReviewStatus) => {
    switch (status) {
      case 'aligned':
        return '';
      case 'empty-target':
        return copy.emptyTarget;
      case 'missing-target':
        return copy.missingTarget;
      case 'extra-target':
        return copy.extraTarget;
      default:
        return assertNever(status);
    }
  };

  return (
    <div
      data-translation-segment-review={nodeId}
      data-translation-segment-status={hasIssue ? 'needs-review' : 'aligned'}
      style={{ marginTop: 10, border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: 8 }}>
        <div>
          <strong style={{ display: 'block', fontSize: 12, color: '#1f2937' }}>{copy.title}</strong>
          <span style={{ fontSize: 11, color: hasIssue ? '#9a3412' : '#166534' }}>
            {copy.summary(sourceLines.length, targetLines.length)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onTargetTextChange(alignTargetSegmentsToSource(sourceText, targetText))}
          disabled={sourceLines.length === targetLines.length}
          style={{ alignSelf: 'center', fontSize: 11, padding: '5px 8px', borderRadius: 5 }}
          data-translation-segment-align={nodeId}
        >
          {copy.align}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 1fr', borderTop: '1px solid #e2e8f0' }}>
        <span style={{ padding: 6, fontSize: 11, color: '#64748b' }}>#</span>
        <span style={{ padding: 6, fontSize: 11, color: '#64748b' }}>{copy.source} ({sourceLocale})</span>
        <span style={{ padding: 6, fontSize: 11, color: '#64748b' }}>{copy.target} ({targetLocale})</span>
        {rows.map((row) => (
          <div
            key={row.index}
            style={{ display: 'contents' }}
            data-translation-segment-row={`${nodeId}-${row.index}`}
            data-translation-segment-row-status={row.status}
          >
            <span style={{ padding: 6, fontSize: 11, color: '#64748b' }}>{row.index}</span>
            <div style={{ padding: 6, fontSize: 12, color: '#1f2937' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ whiteSpace: 'pre-wrap' }}>{row.source}</span>
                <button
                  type="button"
                  onClick={() => onTargetTextChange(copySourceSegmentLineToTarget(sourceText, targetText, row.index - 1))}
                  disabled={row.source.length === 0}
                  style={{ flex: '0 0 auto', fontSize: 11, padding: '4px 7px', borderRadius: 5 }}
                  data-translation-segment-copy-source={`${nodeId}-${row.index}`}
                >
                  {copy.copySourceLine}
                </button>
              </div>
              <TranslationEditorSegmentSignals
                locale={targetLocale}
                nodeId={nodeId}
                profile={sourceSignalProfiles[row.index - 1]}
              />
            </div>
            <TranslationEditorSegmentTargetControls
              copy={copy}
              nodeId={nodeId}
              row={row}
              rowCount={rows.length}
              sourceLines={sourceLines}
              sourceText={sourceText}
              targetText={targetText}
              placeholder={issueLabel(row.status)}
              onTargetTextChange={onTargetTextChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
