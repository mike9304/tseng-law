import { splitTextIntoBoundaryParts } from './rich-text-boundary-parser';

export { isBoundarySeparatorText } from './rich-text-boundary-parser';

type WrittenTextReplacementSegment = {
  readonly separatorBefore?: string;
  readonly text: string;
  readonly separatorAfter?: string;
};

type DroppedTextReplacementSegment = {
  readonly drop: true;
};

export type TextReplacementSegment = WrittenTextReplacementSegment | DroppedTextReplacementSegment;

export type SourceTextSegment = {
  readonly text: string;
  readonly isBoundarySeparator: boolean;
};

export function toReplacementSegment(text: string): TextReplacementSegment {
  return { text };
}

function toDroppedSegment(): TextReplacementSegment {
  return { drop: true };
}

function hasWrittenText(segment: TextReplacementSegment): boolean {
  return !('drop' in segment) && segment.text.length > 0;
}

function toBoundaryReplacementSegment(
  text: string,
  separatorBefore: string | undefined,
  separatorAfter: string | undefined,
): TextReplacementSegment {
  if (separatorBefore && separatorAfter) return { separatorBefore, text, separatorAfter };
  if (separatorBefore) return { separatorBefore, text };
  if (separatorAfter) return { text, separatorAfter };
  return { text };
}

function splitTextByBoundarySeparators(
  text: string,
  sourceNodeCount: number,
): TextReplacementSegment[] | null {
  if (sourceNodeCount < 2) return null;

  const parts = splitTextIntoBoundaryParts(text, { allowCompactMarkBoundarySeparators: true });
  if (!parts) return null;
  if (parts.words.length !== sourceNodeCount) return null;
  if (parts.separators.length !== sourceNodeCount - 1) return null;

  return parts.words.map((word, index) =>
    toBoundaryReplacementSegment(
      word,
      index === 0 ? parts.leadingSeparator : undefined,
      index === sourceNodeCount - 1 ? parts.trailingSeparator : parts.separators[index],
    ),
  );
}

function countSourceWordSegments(sourceSegments: readonly SourceTextSegment[]): number {
  return sourceSegments.filter((segment) => !segment.isBoundarySeparator).length;
}

function countSourceSeparatorRuns(sourceSegments: readonly SourceTextSegment[]): number {
  let count = 0;
  let previousWasSeparator = false;

  for (const sourceSegment of sourceSegments) {
    if (!sourceSegment.isBoundarySeparator) {
      previousWasSeparator = false;
      continue;
    }

    if (!previousWasSeparator) count += 1;
    previousWasSeparator = true;
  }

  return count;
}

function splitSeparatorBySourceRun(
  separator: string,
  sourceSegments: readonly SourceTextSegment[],
): TextReplacementSegment[] | null {
  const sourceText = sourceSegments.map((segment) => segment.text).join('');
  if (sourceText === separator) return sourceSegments.map((segment) => toReplacementSegment(segment.text));
  if (separator.length < sourceSegments.length) {
    return [
      toReplacementSegment(separator),
      ...sourceSegments.slice(1).map(() => toDroppedSegment()),
    ];
  }

  const sourceLengths = sourceSegments.map((segment) => segment.text.length);
  const totalSourceLength = sourceLengths.reduce((sum, length) => sum + length, 0);
  if (totalSourceLength <= 0) return null;

  const segments: TextReplacementSegment[] = [];
  let consumedSourceLength = 0;
  let textOffset = 0;

  for (const sourceLength of sourceLengths.slice(0, -1)) {
    consumedSourceLength += sourceLength;
    const nextTextOffset = Math.round((consumedSourceLength / totalSourceLength) * separator.length);
    segments.push(toReplacementSegment(separator.slice(textOffset, nextTextOffset)));
    textOffset = nextTextOffset;
  }
  segments.push(toReplacementSegment(separator.slice(textOffset)));

  return segments.every(hasWrittenText) ? segments : null;
}

function splitTextByExplicitSourceSeparators(
  text: string,
  sourceSegments: readonly SourceTextSegment[],
): TextReplacementSegment[] | null {
  const sourceWordCount = countSourceWordSegments(sourceSegments);
  const sourceSeparatorRunCount = countSourceSeparatorRuns(sourceSegments);
  if (sourceSeparatorRunCount === 0) return null;

  const parts = splitTextIntoBoundaryParts(text, { allowCompactMiddleSeparators: true });
  if (!parts) return null;
  if (parts.words.length !== sourceWordCount) return null;
  if (parts.separators.length !== sourceSeparatorRunCount) return null;

  const segments: TextReplacementSegment[] = [];
  let wordIndex = 0;
  let separatorIndex = 0;
  let sourceIndex = 0;

  while (sourceIndex < sourceSegments.length) {
    const sourceSegment = sourceSegments[sourceIndex];
    if (sourceSegment === undefined) return null;

    if (sourceSegment.isBoundarySeparator) {
      const separator = parts.separators[separatorIndex];
      if (separator === undefined) return null;

      const separatorRun: SourceTextSegment[] = [];
      while (sourceIndex < sourceSegments.length) {
        const nextSegment = sourceSegments[sourceIndex];
        if (nextSegment === undefined || !nextSegment.isBoundarySeparator) break;
        separatorRun.push(nextSegment);
        sourceIndex += 1;
      }

      const separatorSegments = splitSeparatorBySourceRun(separator, separatorRun);
      if (!separatorSegments) return null;
      segments.push(...separatorSegments);
      separatorIndex += 1;
      continue;
    }

    const word = parts.words[wordIndex];
    if (word === undefined) return null;
    segments.push(
      toBoundaryReplacementSegment(
        word,
        wordIndex === 0 ? parts.leadingSeparator : undefined,
        wordIndex === sourceWordCount - 1 ? parts.trailingSeparator : undefined,
      ),
    );
    wordIndex += 1;
    sourceIndex += 1;
  }

  return segments;
}

export function splitTextBySourceSegments(
  text: string,
  sourceSegments: readonly SourceTextSegment[],
): TextReplacementSegment[] | null {
  if (sourceSegments.length < 2) return null;

  const explicitSeparatorSegments = splitTextByExplicitSourceSeparators(text, sourceSegments);
  if (explicitSeparatorSegments) return explicitSeparatorSegments;

  if (text.length < sourceSegments.length) return null;

  const wordSegments = splitTextByBoundarySeparators(text, sourceSegments.length);
  if (wordSegments) return wordSegments;

  const sourceLengths = sourceSegments.map((segment) => segment.text.length);
  const totalSourceLength = sourceLengths.reduce((sum, length) => sum + length, 0);
  if (totalSourceLength <= 0) return null;

  const segments: TextReplacementSegment[] = [];
  let consumedSourceLength = 0;
  let textOffset = 0;

  for (const sourceLength of sourceLengths.slice(0, -1)) {
    consumedSourceLength += sourceLength;
    const nextTextOffset = Math.round((consumedSourceLength / totalSourceLength) * text.length);
    segments.push(toReplacementSegment(text.slice(textOffset, nextTextOffset)));
    textOffset = nextTextOffset;
  }
  segments.push(toReplacementSegment(text.slice(textOffset)));

  return segments.every(hasWrittenText) ? segments : null;
}
