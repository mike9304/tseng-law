import { Fragment } from 'react';

/**
 * 昊 V2 inner pages (2026-10-02): break opportunities for short Japanese display strings (labels, tile leads,
 * station titles) so that a narrow column never splits a word such as 方針 or 在台日本人. A `<wbr>` goes after
 * Japanese punctuation and after a hiragana particle that ends a phrase; the element carries `.ph`
 * (word-break: keep-all) from JaPagesV2.module.css, so lines break only there. The text itself is unchanged.
 * Never use it on body paragraphs or on strings that tests match verbatim in markup.
 *
 * Merge note: the home lane's `kou/JaPhrases` (BudouX, server only) does the same job with a model; when it
 * lands it can replace this heuristic.
 */
const AFTER = new Set(['、', '。', '・', '：', '）', '」', '』']);
const PARTICLES = new Set(['の', 'を', 'に', 'で', 'は', 'が', 'と', 'へ', 'も', 'や']);
const WORD_START = /[㐀-䶿一-鿿゠-ヿA-Za-z0-9（「『]/;
const JAPANESE = /[぀-ゟ゠-ヿ㐀-䶿一-鿿]/;

export function jaPhraseParts(text: string): string[] {
  const parts: string[] = [];
  let current = '';
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    current += char;
    if (next === undefined) break;
    const afterPunctuation = AFTER.has(char) && !AFTER.has(next);
    const afterParticle = PARTICLES.has(char) && WORD_START.test(next) && JAPANESE.test(text[index - 1] ?? '');
    if (afterPunctuation || afterParticle) {
      parts.push(current);
      current = '';
    }
  }
  if (current) parts.push(current);
  return parts;
}

export default function JaWrap({ text }: { text: string }) {
  const parts = jaPhraseParts(text);
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index ? <wbr /> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}
