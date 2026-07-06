type BoundarySeparator = {
  readonly text: string;
  readonly hasWhitespace: boolean;
  readonly nextOffset: number;
};

export type BoundaryTextParts = {
  readonly leadingSeparator?: string;
  readonly words: readonly string[];
  readonly separators: readonly string[];
  readonly trailingSeparator?: string;
};

type BoundaryTextPartsOptions = {
  readonly allowCompactMiddleSeparators?: boolean;
  readonly allowCompactMarkBoundarySeparators?: boolean;
};

const boundarySeparatorCharacters = [
  ',',
  '.',
  ';',
  ':',
  '!',
  '?',
  '-',
  '–',
  '—',
  '/',
  '|',
  '·',
  '+',
  '×',
  '(',
  ')',
  '"',
  '“',
  '”',
  '&',
  '[',
  ']',
  '{',
  '}',
] as const;

const compactMarkBoundarySeparatorCharacters = ['-', '–', '—', '/', ':', ';', '|', '·'] as const;
const guardedCompactMarkBoundarySeparatorCharacters = ['&', '+', '×'] as const;

function isWhitespaceCharacter(character: string): boolean {
  return character.trim().length === 0;
}

function isBoundarySeparatorCharacter(character: string): boolean {
  return (
    isWhitespaceCharacter(character) ||
    boundarySeparatorCharacters.some((separator) => separator === character)
  );
}

function isSeparatorTextInSet(text: string, separators: readonly string[]): boolean {
  if (text.length === 0) return false;

  for (const character of text) {
    if (!separators.some((separator) => separator === character)) return false;
  }

  return true;
}

function isCompactMarkBoundarySeparatorText(text: string): boolean {
  return isSeparatorTextInSet(text, compactMarkBoundarySeparatorCharacters);
}

function readBoundaryWordLength(text: string, offset: number): number | null {
  let nextOffset = offset;

  while (nextOffset < text.length) {
    const character = text[nextOffset];
    if (character === undefined) return null;
    if (isBoundarySeparatorCharacter(character)) break;
    nextOffset += 1;
  }

  const length = nextOffset - offset;
  return length > 0 ? length : null;
}

function acceptsGuardedCompactMarkBoundarySeparator(
  separatorText: string,
  previousWord: string,
  text: string,
  nextOffset: number,
): boolean {
  if (!isSeparatorTextInSet(separatorText, guardedCompactMarkBoundarySeparatorCharacters)) return false;
  const nextWordLength = readBoundaryWordLength(text, nextOffset);
  return previousWord.length > 1 && nextWordLength !== null && nextWordLength > 1;
}

export function isBoundarySeparatorText(text: string): boolean {
  if (text.length === 0) return false;

  for (const character of text) {
    if (!isBoundarySeparatorCharacter(character)) return false;
  }

  return true;
}

function readBoundarySeparator(text: string, offset: number): BoundarySeparator | null {
  let nextOffset = offset;
  let hasWhitespace = false;

  while (nextOffset < text.length) {
    const character = text[nextOffset];
    if (character === undefined) return null;
    if (!isBoundarySeparatorCharacter(character)) break;
    hasWhitespace ||= isWhitespaceCharacter(character);
    nextOffset += 1;
  }

  if (nextOffset === offset) return null;

  return {
    text: text.slice(offset, nextOffset),
    hasWhitespace,
    nextOffset,
  };
}

export function splitTextIntoBoundaryParts(
  text: string,
  options: BoundaryTextPartsOptions = {},
): BoundaryTextParts | null {
  const words: string[] = [];
  const separators: string[] = [];
  let leadingSeparator: string | undefined;
  let trailingSeparator: string | undefined;
  let offset = 0;

  const firstSeparator = readBoundarySeparator(text, offset);
  if (firstSeparator) {
    if (firstSeparator.hasWhitespace || firstSeparator.nextOffset >= text.length) return null;
    leadingSeparator = firstSeparator.text;
    offset = firstSeparator.nextOffset;
  }

  while (offset < text.length) {
    const wordStart = offset;
    while (offset < text.length) {
      const character = text[offset];
      if (character === undefined) return null;
      if (isBoundarySeparatorCharacter(character)) break;
      offset += 1;
    }

    const word = text.slice(wordStart, offset);
    if (!word) return null;
    words.push(word);
    if (offset >= text.length) break;

    const separator = readBoundarySeparator(text, offset);
    if (!separator) return null;
    const isTrailingSeparator = separator.nextOffset >= text.length;
    const acceptsCompactMarkBoundarySeparator =
      options.allowCompactMarkBoundarySeparators === true &&
      (
        isCompactMarkBoundarySeparatorText(separator.text) ||
        acceptsGuardedCompactMarkBoundarySeparator(separator.text, word, text, separator.nextOffset)
      );
    if (
      !options.allowCompactMiddleSeparators &&
      !acceptsCompactMarkBoundarySeparator &&
      !separator.hasWhitespace &&
      !isTrailingSeparator
    ) {
      return null;
    }

    if (isTrailingSeparator) {
      trailingSeparator = separator.text;
      break;
    }

    separators.push(separator.text);
    offset = separator.nextOffset;
  }

  return { leadingSeparator, words, separators, trailingSeparator };
}
