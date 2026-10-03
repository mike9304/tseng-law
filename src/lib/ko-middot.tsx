import type { ReactNode } from 'react';

/**
 * Korean titles use "·" (U+00B7) between nouns (자회사·지점·대표사무소). With
 * `word-break: keep-all` the browser may still break *before* the dot, so a
 * line starts with "·" (design audit 2026-09-25: 8 live hits in H1s and card
 * titles). Each "X·" pair is wrapped in a no-wrap span, which forbids that break
 * while still allowing a break after the dot.
 *
 * A span, not a U+2060 WORD JOINER: the DOM text stays identical to the source
 * title, so builder inline editing (which reads textContent back), copy-paste
 * and on-page search never pick up an invisible control character. Visible
 * headings only — metadata, JSON-LD and alt text keep the raw string.
 */
export function typesetTitle(locale: string, text: string): ReactNode {
  // A long Traditional Chinese clause may use emergency wrapping under the
  // article's keep-all typography. Keep its closing punctuation with the last
  // character, just as Korean middle dots stay with their preceding character.
  // Spans preserve the exact visible/copyable string without control characters.
  if (locale === 'zh-hant' && /[，。！？；：、」』）】》〉]/u.test(text)) {
    const parts: ReactNode[] = [];
    const punctuation = /([^\s，。！？；：、」』）】》〉])[，。！？；：、」』）】》〉]+/gu;
    let end = 0;
    for (const match of text.matchAll(punctuation)) {
      if (match.index > end) parts.push(text.slice(end, match.index));
      parts.push(<span key={match.index} style={{ whiteSpace: 'nowrap' }}>{match[0]}</span>);
      end = match.index + match[0].length;
    }
    if (end < text.length) parts.push(text.slice(end));
    return parts;
  }
  if (locale !== 'ko' || !text.includes('·')) return text;
  const out: ReactNode[] = [];
  const pattern = /(\S)·/gu;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    out.push(
      <span key={match.index} style={{ whiteSpace: 'nowrap' }}>
        {match[1]}·
      </span>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
