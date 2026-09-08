import { Fragment, type ReactNode } from "react";

/** Exact compounds that must not split across lines. Not a dictionary. */
const PROTECTED_HEADING_UNITS = ["労働法", "雇用紛争"] as const;

type HeadingSegment =
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "unit"; readonly value: string };

function matchProtectedUnitAt(
  text: string,
  index: number,
  units: readonly string[],
): string | undefined {
  for (const unit of units) {
    if (text.startsWith(unit, index)) {
      return unit;
    }
  }
  return undefined;
}

function segmentHeadingText(text: string): HeadingSegment[] {
  const units = [...PROTECTED_HEADING_UNITS].sort((a, b) => b.length - a.length);
  const segments: HeadingSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const unit = matchProtectedUnitAt(text, cursor, units);
    if (unit) {
      segments.push({ kind: "unit", value: unit });
      cursor += unit.length;
      continue;
    }

    let end = cursor + 1;
    while (end < text.length && matchProtectedUnitAt(text, end, units) === undefined) {
      end += 1;
    }
    segments.push({ kind: "text", value: text.slice(cursor, end) });
    cursor = end;
  }

  return segments;
}

/**
 * Keep listed Japanese heading compounds on one line.
 * Does not nowrap the whole title or shrink type.
 * Unmatched strings (including empty) are returned unchanged.
 * Display helper only; not legal advice.
 */
export function protectJapaneseHeadingUnits(text: string): ReactNode {
  const segments = segmentHeadingText(text);
  if (!segments.some((segment) => segment.kind === "unit")) {
    return text;
  }

  return segments.map((segment, index) => {
    if (segment.kind === "unit") {
      return (
        <span key={`jp-heading-unit-${index}`} style={{ whiteSpace: "nowrap" }}>
          {segment.value}
        </span>
      );
    }

    return (
      <Fragment key={`jp-heading-text-${index}`}>{segment.value}</Fragment>
    );
  });
}
