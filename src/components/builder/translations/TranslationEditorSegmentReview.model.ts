export type SegmentReviewStatus = 'aligned' | 'empty-target' | 'missing-target' | 'extra-target';

export interface SegmentReviewRow {
  readonly index: number;
  readonly source: string;
  readonly target: string;
  readonly status: SegmentReviewStatus;
}

export function splitSegmentLines(text: string): readonly string[] {
  return text.split(/\r\n?|\n/g);
}

function statusFor(source: string | undefined, target: string | undefined): SegmentReviewStatus {
  if (source === undefined) return 'extra-target';
  if (target === undefined) return 'missing-target';
  if (source.trim().length > 0 && target.trim().length === 0) return 'empty-target';
  return 'aligned';
}

export function buildSegmentReviewRows(sourceText: string, targetText: string): readonly SegmentReviewRow[] {
  const sourceLines = splitSegmentLines(sourceText);
  const targetLines = splitSegmentLines(targetText);
  const count = Math.max(sourceLines.length, targetLines.length);
  return Array.from({ length: count }, (_, index) => {
    const source = sourceLines[index];
    const target = targetLines[index];
    return {
      index: index + 1,
      source: source ?? '',
      target: target ?? '',
      status: statusFor(source, target),
    };
  });
}

export function hasSegmentReviewIssue(rows: readonly SegmentReviewRow[]): boolean {
  return rows.some((row) => row.status !== 'aligned');
}

export function updateTargetSegmentLine(
  sourceText: string,
  targetText: string,
  lineIndex: number,
  value: string,
): string {
  const sourceLines = splitSegmentLines(sourceText);
  const targetLines = splitSegmentLines(targetText);
  const count = Math.max(sourceLines.length, targetLines.length, lineIndex + 1);
  return Array.from({ length: count }, (_, index) => (index === lineIndex ? value : targetLines[index] ?? '')).join(
    '\n',
  );
}

export function copySourceSegmentLineToTargetLine(
  sourceText: string,
  targetText: string,
  sourceLineIndex: number,
  targetLineIndex: number,
): string {
  const sourceLines = splitSegmentLines(sourceText);
  return updateTargetSegmentLine(sourceText, targetText, targetLineIndex, sourceLines[sourceLineIndex] ?? '');
}

export function appendSourceSegmentLineToTargetLine(
  sourceText: string,
  targetText: string,
  sourceLineIndex: number,
  targetLineIndex: number,
): string {
  const sourceLines = splitSegmentLines(sourceText);
  const targetLines = splitSegmentLines(targetText);
  const sourceLine = sourceLines[sourceLineIndex] ?? '';
  const targetLine = targetLines[targetLineIndex] ?? '';
  const mergedLine =
    targetLine.trim().length > 0 && sourceLine.length > 0 ? `${targetLine} ${sourceLine}` : targetLine || sourceLine;
  return updateTargetSegmentLine(sourceText, targetText, targetLineIndex, mergedLine);
}

export function insertTargetSegmentLineAfter(sourceText: string, targetText: string, lineIndex: number): string {
  const sourceLines = splitSegmentLines(sourceText);
  const targetLines = splitSegmentLines(targetText);
  const count = Math.max(sourceLines.length, targetLines.length, lineIndex + 1);
  const normalizedTargetLines = Array.from({ length: count }, (_, index) => targetLines[index] ?? '');
  const insertionIndex = Math.min(lineIndex + 1, normalizedTargetLines.length);
  return [
    ...normalizedTargetLines.slice(0, insertionIndex),
    '',
    ...normalizedTargetLines.slice(insertionIndex),
  ].join('\n');
}

export function deleteTargetSegmentLine(sourceText: string, targetText: string, lineIndex: number): string {
  const sourceLines = splitSegmentLines(sourceText);
  const targetLines = splitSegmentLines(targetText);
  const normalizedCount = Math.max(sourceLines.length, targetLines.length, lineIndex + 1);
  const normalizedTargetLines = Array.from({ length: normalizedCount }, (_, index) => targetLines[index] ?? '');
  const nextTargetLines = normalizedTargetLines.filter((_, index) => index !== lineIndex);
  const count = Math.max(sourceLines.length, nextTargetLines.length);
  return Array.from({ length: count }, (_, index) => nextTargetLines[index] ?? '').join('\n');
}

export function moveTargetSegmentLine(
  sourceText: string,
  targetText: string,
  fromLineIndex: number,
  toLineIndex: number,
): string {
  const sourceLines = splitSegmentLines(sourceText);
  const targetLines = splitSegmentLines(targetText);
  const count = Math.max(sourceLines.length, targetLines.length);
  const normalizedTargetLines = Array.from({ length: count }, (_, index) => targetLines[index] ?? '');

  if (
    fromLineIndex < 0 ||
    toLineIndex < 0 ||
    fromLineIndex >= count ||
    toLineIndex >= count ||
    fromLineIndex === toLineIndex
  ) {
    return normalizedTargetLines.join('\n');
  }

  const movingLine = normalizedTargetLines[fromLineIndex] ?? '';
  const remainingLines = normalizedTargetLines.filter((_, index) => index !== fromLineIndex);
  const insertionIndex = Math.min(toLineIndex, remainingLines.length);
  return [
    ...remainingLines.slice(0, insertionIndex),
    movingLine,
    ...remainingLines.slice(insertionIndex),
  ].join('\n');
}

export function mergeTargetSegmentLineDown(sourceText: string, targetText: string, lineIndex: number): string {
  const sourceLines = splitSegmentLines(sourceText);
  const targetLines = splitSegmentLines(targetText);
  const count = Math.max(sourceLines.length, targetLines.length);
  const normalizedTargetLines = Array.from({ length: count }, (_, index) => targetLines[index] ?? '');

  if (lineIndex < 0 || lineIndex >= count - 1) {
    return normalizedTargetLines.join('\n');
  }

  const currentLine = normalizedTargetLines[lineIndex] ?? '';
  const nextLine = normalizedTargetLines[lineIndex + 1] ?? '';
  const mergedLine =
    currentLine.trim().length > 0 && nextLine.trim().length > 0
      ? `${currentLine} ${nextLine}`
      : currentLine || nextLine;
  const nextTargetLines = [
    ...normalizedTargetLines.slice(0, lineIndex),
    mergedLine,
    ...normalizedTargetLines.slice(lineIndex + 2),
  ];
  const nextCount = Math.max(sourceLines.length, nextTargetLines.length);
  return Array.from({ length: nextCount }, (_, index) => nextTargetLines[index] ?? '').join('\n');
}

export function copySourceSegmentLineToTarget(sourceText: string, targetText: string, lineIndex: number): string {
  return copySourceSegmentLineToTargetLine(sourceText, targetText, lineIndex, lineIndex);
}

export function alignTargetSegmentsToSource(sourceText: string, targetText: string): string {
  const sourceLines = splitSegmentLines(sourceText);
  const targetLines = splitSegmentLines(targetText);
  return sourceLines.map((_, index) => targetLines[index] ?? '').join('\n');
}
