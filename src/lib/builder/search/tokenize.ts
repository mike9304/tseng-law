/**
 * PR #5 — Search tokenizer.
 *
 * Pure ASCII + CJK aware: lowercases, drops most punctuation, splits on
 * whitespace AND boundaries between CJK and ASCII so 「호정law」 produces
 * 「호정」+「law」. CJK characters become 2-gram tokens (Bigram) so partial
 * Korean/Chinese queries still match.
 */

const PUNCT_RE = /[!-/:-@\[-`{-~。、，、？！「」『』（）()\[\]【】＿—\-–—…·"'·]/g;

function isCJK(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  if (code >= 0x3040 && code <= 0x30ff) return true; // hiragana/katakana
  if (code >= 0x3400 && code <= 0x9fff) return true; // CJK unified
  if (code >= 0xac00 && code <= 0xd7af) return true; // Hangul syllables
  if (code >= 0xf900 && code <= 0xfaff) return true; // CJK compat
  return false;
}

export function tokenize(input: string): string[] {
  const cleaned = input.toLowerCase().replace(PUNCT_RE, ' ');
  const tokens: string[] = [];
  let buffer = '';
  let mode: 'word' | 'cjk' | 'space' = 'space';
  for (const ch of cleaned) {
    const ws = /\s/.test(ch);
    if (ws) {
      if (buffer) tokens.push(buffer);
      buffer = '';
      mode = 'space';
      continue;
    }
    const cjk = isCJK(ch);
    if (cjk) {
      if (mode === 'word' && buffer) {
        tokens.push(buffer);
        buffer = '';
      }
      mode = 'cjk';
      tokens.push(ch);
      continue;
    }
    if (mode === 'cjk' && buffer) {
      tokens.push(buffer);
      buffer = '';
    }
    mode = 'word';
    buffer += ch;
  }
  if (buffer) tokens.push(buffer);

  // Build CJK bigrams alongside individual characters.
  const out: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    out.push(tok);
    if (tok.length === 1 && isCJK(tok)) {
      const next = tokens[i + 1];
      if (next && next.length === 1 && isCJK(next)) {
        out.push(tok + next);
      }
    }
  }
  return out.filter((t) => t.length > 0);
}
