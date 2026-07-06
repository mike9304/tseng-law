import type { SegmentCopy } from './TranslationEditorSegmentReview.copy';
import {
  appendSourceSegmentLineToTargetLine,
  copySourceSegmentLineToTargetLine,
  deleteTargetSegmentLine,
  insertTargetSegmentLineAfter,
  mergeTargetSegmentLineDown,
  moveTargetSegmentLine,
  type SegmentReviewRow,
  updateTargetSegmentLine,
} from './TranslationEditorSegmentReview.model';

type TranslationEditorSegmentTargetControlsProps = {
  readonly copy: SegmentCopy;
  readonly nodeId: string;
  readonly row: SegmentReviewRow;
  readonly rowCount: number;
  readonly sourceLines: readonly string[];
  readonly sourceText: string;
  readonly targetText: string;
  readonly placeholder: string;
  readonly onTargetTextChange: (value: string) => void;
};

export function TranslationEditorSegmentTargetControls({
  copy,
  nodeId,
  row,
  rowCount,
  sourceLines,
  sourceText,
  targetText,
  placeholder,
  onTargetTextChange,
}: TranslationEditorSegmentTargetControlsProps) {
  const targetLineIndex = row.index - 1;
  const canMoveUp = targetLineIndex > 0;
  const canMoveDown = targetLineIndex < rowCount - 1;
  const canMergeDown = targetLineIndex < rowCount - 1;

  return (
    <div style={{ padding: 6 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 5,
          marginBottom: 5,
        }}
      >
        <select
          aria-label={`${copy.remapSourceLine} ${row.index}`}
          value=""
          onChange={(event) => {
            const sourceLineIndex = Number(event.currentTarget.value);
            if (!Number.isInteger(sourceLineIndex)) return;
            onTargetTextChange(
              copySourceSegmentLineToTargetLine(sourceText, targetText, sourceLineIndex, targetLineIndex),
            );
          }}
          disabled={sourceLines.length === 0}
          data-translation-segment-remap-source={`${nodeId}-${row.index}`}
          style={{ width: '100%', fontSize: 11, padding: '4px 6px', borderRadius: 4 }}
        >
          <option value="" disabled>
            {copy.remapSourceLine}
          </option>
          {sourceLines.map((sourceLine, sourceIndex) => (
            <option key={`${sourceIndex}-${sourceLine}`} value={sourceIndex}>
              {copy.sourceLineOption(sourceIndex + 1)}
            </option>
          ))}
        </select>
        <select
          aria-label={`${copy.appendSourceLine} ${row.index}`}
          value=""
          onChange={(event) => {
            const sourceLineIndex = Number(event.currentTarget.value);
            if (!Number.isInteger(sourceLineIndex)) return;
            onTargetTextChange(
              appendSourceSegmentLineToTargetLine(sourceText, targetText, sourceLineIndex, targetLineIndex),
            );
          }}
          disabled={sourceLines.length === 0}
          data-translation-segment-append-source={`${nodeId}-${row.index}`}
          style={{ width: '100%', fontSize: 11, padding: '4px 6px', borderRadius: 4 }}
        >
          <option value="" disabled>
            {copy.appendSourceLine}
          </option>
          {sourceLines.map((sourceLine, sourceIndex) => (
            <option key={`${sourceIndex}-${sourceLine}`} value={sourceIndex}>
              {copy.sourceLineOption(sourceIndex + 1)}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, marginBottom: 5 }}>
        <button
          type="button"
          aria-label={`${copy.moveTargetLineUp} ${row.index}`}
          title={copy.moveTargetLineUp}
          onClick={() =>
            onTargetTextChange(moveTargetSegmentLine(sourceText, targetText, targetLineIndex, targetLineIndex - 1))
          }
          disabled={!canMoveUp}
          data-translation-segment-move-target-up={`${nodeId}-${row.index}`}
          style={{ width: 30, fontSize: 13, lineHeight: '16px', padding: '3px 0', borderRadius: 4 }}
        >
          ↑
        </button>
        <button
          type="button"
          aria-label={`${copy.moveTargetLineDown} ${row.index}`}
          title={copy.moveTargetLineDown}
          onClick={() =>
            onTargetTextChange(moveTargetSegmentLine(sourceText, targetText, targetLineIndex, targetLineIndex + 1))
          }
          disabled={!canMoveDown}
          data-translation-segment-move-target-down={`${nodeId}-${row.index}`}
          style={{ width: 30, fontSize: 13, lineHeight: '16px', padding: '3px 0', borderRadius: 4 }}
        >
          ↓
        </button>
        <button
          type="button"
          aria-label={`${copy.mergeTargetLineDown} ${row.index}`}
          title={copy.mergeTargetLineDown}
          onClick={() => onTargetTextChange(mergeTargetSegmentLineDown(sourceText, targetText, targetLineIndex))}
          disabled={!canMergeDown}
          data-translation-segment-merge-target-down={`${nodeId}-${row.index}`}
          style={{ width: 30, fontSize: 13, lineHeight: '16px', padding: '3px 0', borderRadius: 4 }}
        >
          ↴
        </button>
        <button
          type="button"
          aria-label={`${copy.splitTargetLine} ${row.index}`}
          title={copy.splitTargetLine}
          onClick={() => onTargetTextChange(insertTargetSegmentLineAfter(sourceText, targetText, targetLineIndex))}
          data-translation-segment-split-target={`${nodeId}-${row.index}`}
          style={{ width: 30, fontSize: 14, lineHeight: '16px', padding: '3px 0', borderRadius: 4 }}
        >
          +
        </button>
        <button
          type="button"
          aria-label={`${copy.deleteTargetLine} ${row.index}`}
          title={copy.deleteTargetLine}
          onClick={() => onTargetTextChange(deleteTargetSegmentLine(sourceText, targetText, targetLineIndex))}
          data-translation-segment-delete-target={`${nodeId}-${row.index}`}
          style={{ width: 30, fontSize: 14, lineHeight: '16px', padding: '3px 0', borderRadius: 4 }}
        >
          -
        </button>
      </div>
      <textarea
        aria-label={`${copy.target} ${row.index}`}
        value={row.target}
        onChange={(event) => {
          onTargetTextChange(updateTargetSegmentLine(sourceText, targetText, targetLineIndex, event.currentTarget.value));
        }}
        rows={1}
        placeholder={placeholder}
        data-translation-segment-target-input={`${nodeId}-${row.index}`}
        style={{
          width: '100%',
          minHeight: 30,
          boxSizing: 'border-box',
          border: `1px solid ${row.status === 'aligned' ? '#cbd5e1' : '#fdba74'}`,
          borderRadius: 4,
          padding: 6,
          fontSize: 12,
          color: '#1f2937',
          resize: 'vertical',
          background: '#fff',
        }}
      />
    </div>
  );
}
