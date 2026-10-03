import { Fragment } from 'react';

/**
 * Phrase breaks for Japanese display strings (CONCEPT-V2 §3.4, §8.9), server-side and dependency-free: BudouX (L2) is a
 * lead decision that was not taken in this lane, so phrases are found with a small rule set instead.
 *
 * A break opportunity (<wbr>) is placed after punctuation (、。・：」） etc.) and after a run of hiragana when the next
 * character starts a new word (kanji, katakana, Latin or digit, or an opening bracket). Units in KEEP (and any `keep`
 * passed in) are never split. Used with `.ph { word-break: keep-all; overflow-wrap: anywhere }`, so a line can only break
 * at those points. Not used on body paragraphs.
 */
export const JA_KEEP_UNITS = [
  '在台日本人の方',
  '曾雋崴（JLPT N1）',
  '台湾弁護士',
  '台北',
  '台中',
  '高雄',
  '屏東',
  '日本語',
  '中国語',
  '英語',
  '韓国語',
  '分公司',
  '最低服務年限',
  '戸政事務所',
  '羈押',
  '存證信函',
  '假扣押',
  'お問い合わせ',
  'お申し込み',
  'お見積り',
  'ご依頼',
  'ご相談',
  'ことがあります',
] as const;

const HIRAGANA = /[ぁ-ゟ]/;
const KANJI = /[\u4e00-\u9fff\u3005]/;
const AFTER = /[、。・：，．！？」』）〕】\]）]/;
const OPENING = /[「『（〔【\[（]/;
const WORD_START = /[一-鿿々゠-ヿA-Za-z0-9０-９Ａ-Ｚａ-ｚ−]/;
const NEVER_BEFORE = /[、。・：，．！？」』）〕】ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ々]/;

/** Returns the phrases of `text` (joined, they equal `text`). */
export function splitJaPhrases(text: string, keep: readonly string[] = []): string[] {
  const units = [...JA_KEEP_UNITS, ...keep];
  const locked = new Uint8Array(text.length + 1);
  for (const unit of units) {
    let from = 0;
    for (;;) {
      const at = text.indexOf(unit, from);
      if (at < 0) break;
      for (let i = at + 1; i < at + unit.length; i += 1) locked[i] = 1;
      from = at + 1;
    }
  }
  const phrases: string[] = [];
  let start = 0;
  for (let i = 1; i < text.length; i += 1) {
    const prev = text[i - 1];
    const next = text[i];
    if (locked[i] || NEVER_BEFORE.test(next)) continue;
    const breakAfterPunct = AFTER.test(prev);
    const breakAfterKana = HIRAGANA.test(prev) && (WORD_START.test(next) || OPENING.test(next));
    // An honorific prefix (ご相談, お見積り) starts a new phrase after a particle: 日本語で|ご相談ください。
    const breakBeforeHonorific = HIRAGANA.test(prev) && (next === 'ご' || next === 'お') && KANJI.test(text[i + 1] ?? '');
    if (breakAfterPunct || breakAfterKana || breakBeforeHonorific) {
      phrases.push(text.slice(start, i));
      start = i;
    }
  }
  phrases.push(text.slice(start));
  return phrases.filter(Boolean);
}

export function JaPhrases({ text, keep }: { text: string; keep?: readonly string[] }) {
  const phrases = splitJaPhrases(text, keep);
  return (
    <>
      {phrases.map((phrase, index) => (
        <Fragment key={index}>
          {index ? <wbr /> : null}
          {phrase}
        </Fragment>
      ))}
    </>
  );
}

/** Body text: normal Japanese breaking, with the KEEP units held together (nowrap spans). */
export function JaKeepUnits({ text, keep }: { text: string; keep?: readonly string[] }) {
  const units = [...JA_KEEP_UNITS.filter((unit) => unit.length > 2 || /[^一-鿿]/.test(unit)), ...(keep ?? [])];
  const pattern = new RegExp(`(${units.map((unit) => unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, index) =>
        units.includes(part) ? (
          <span key={index} style={{ whiteSpace: 'nowrap' }}>
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
