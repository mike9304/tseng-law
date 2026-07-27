import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
);
const source = fs.readFileSync(columnPath, 'utf8');
const listEnd =
  '10. 輸出入、業種別許認可、就業許可・居留等の追加手続（該当する場合）';
const nextParagraph = '委任状、法人の存続証明、';
const listEndOffset = source.indexOf(listEnd);
const sentenceStart = listEndOffset === -1 ? -1 : listEndOffset + listEnd.length + 2;
const sentenceEnd =
  sentenceStart === -1 ? -1 : source.indexOf(`\n\n${nextParagraph}`, sentenceStart);
const sentence =
  sentenceStart === -1 || sentenceEnd === -1
    ? ''
    : source.slice(sentenceStart, sentenceEnd);
const insertion = sentence.length > 0 ? `\n\n${sentence}` : '';

describe('Japanese investment column 001 — preliminary-review caution', () => {
  it('bounds the caution between the final list item and following paragraph', () => {
    expect(listEndOffset).toBeGreaterThanOrEqual(0);
    expect(sentenceStart).toBeGreaterThan(listEndOffset);
    expect(sentenceEnd).toBeGreaterThan(sentenceStart);
    expect(source.slice(sentenceEnd)).toMatch(/^\n\n委任状、法人の存続証明、/u);
  });

  it('inserts exactly two line feeds and one non-empty Japanese prose paragraph', () => {
    expect(insertion).toMatch(/^\n\n[^\r\n]+$/u);
    expect(sentence.trim()).toBe(sentence);
  });

  it('keeps preliminary-review passage as the premise for both required cautions', () => {
    expect(sentence).toMatch(/予備審査[^。]*(?:通過|合格|適合)/u);
    expect(sentence).toContain('その業種に必要な別途の許可をすでに受けていること');
    expect(sentence).toContain('予定する場所で直ちに営業できること');
    expect(sentence).toContain('意味するものではありません');
  });

  it('rejects prohibited structure, additions, Hangul, and malformed copy in the insertion only', () => {
    expect(sentence).not.toMatch(/^(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/u);
    expect(sentence).not.toMatch(/!?\[[^\r\n]*\]\([^)\r\n]*\)|<[^>\r\n]+>/u);
    expect(sentence).not.toMatch(/[*_~`]{1,3}|\[\^[^\]\r\n]+\]/u);

    for (const forbidden of [
      '投資審査',
      '銀行',
      '税',
      '就業',
      '居留',
      'こんにちは',
      '台湾弁護士',
      '曾雋崴',
      'Wei Tseng',
      '動画',
      '私',
      '私たち',
      '当事務所',
      '弊所',
      'お気軽に',
      'お問い合わせ',
      'ご相談',
    ]) {
      expect(sentence).not.toContain(forbidden);
    }

    expect(insertion).not.toMatch(/[\uac00-\ud7af]/u);
    expect(insertion).not.toMatch(/[\u200b\ufeff\u00a0]/u);
    expect(insertion).not.toContain('\r');
    expect(insertion).not.toMatch(/[ \t]+$/mu);
  });
});
