import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
);
const source = fs.readFileSync(columnPath, 'utf8');
const requiredJapaneseTarget =
  '会社設立自体について一律の法定最低資本金があるわけではありません。ただし、業種別の最低資本額、事業計画の合理性、銀行審査および就業許可上の雇用主要件は別途確認が必要です。';
const bodyFaqHeading = '**5. 最低資本金の制限はありますか？**';
const nextBodyFaqHeading = '**6. 居留を続ければ永久居留を申請できますか？**';

const firstTargetOffset = source.indexOf(requiredJapaneseTarget);
const insertion =
  firstTargetOffset === -1
    ? ''
    : source.slice(
        firstTargetOffset,
        firstTargetOffset + requiredJapaneseTarget.length,
      );
const countOccurrences = (haystack: string, needle: string) =>
  haystack.split(needle).length - 1;

describe('Japanese investment column 001 — FAQ 3 direct minimum-capital answer', () => {
  it('preserves the reviewed body repetition within local FAQ boundaries', () => {
    const bodyStart = source.indexOf(bodyFaqHeading);
    const bodyEnd = source.indexOf(nextBodyFaqHeading, bodyStart);
    const bodyFaqFive =
      bodyStart === -1 || bodyEnd === -1 ? '' : source.slice(bodyStart, bodyEnd);

    expect(bodyStart).toBeGreaterThanOrEqual(0);
    expect(bodyEnd).toBeGreaterThan(bodyStart);
    expect(countOccurrences(bodyFaqFive, requiredJapaneseTarget)).toBe(1);
  });

  it('inserts the fixed target and repeats it exactly in FAQ 3 and the body', () => {
    expect(insertion).toBe(requiredJapaneseTarget);
    expect(countOccurrences(source, requiredJapaneseTarget)).toBe(2);
  });

  it('uses exactly two sentences preserving the direct answer and all four considerations', () => {
    expect(insertion).toMatch(/^[^。\r\n]+。[^。\r\n]+。$/u);
    expect(insertion.match(/。/gu)).toHaveLength(2);
    expect(insertion).toMatch(
      /会社設立自体[^。]*一律[^。]*法定最低資本金[^。]*あるわけではありません/u,
    );
    expect(insertion).toMatch(/業種別[^。]*最低資本額/u);
    expect(insertion).toMatch(/事業計画[^。]*合理性/u);
    expect(insertion).toMatch(/銀行審査/u);
    expect(insertion).toMatch(/就業許可上[^。]*雇用主要件[^。]*別途確認/u);
  });

  it('keeps the insertion YAML-safe and rejects prohibited or malformed copy', () => {
    expect(insertion.trim()).toBe(insertion);
    expect(insertion).not.toMatch(/^(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/u);
    expect(insertion).not.toMatch(/!?\[[^\r\n]*\]\([^)\r\n]*\)|<[^>\r\n]+>/u);
    expect(insertion).not.toMatch(/[*_~`]{1,3}|\[\^[^\]\r\n]+\]/u);
    expect(insertion).not.toMatch(/(?:会社法|民法|商法|第\d+条|判例|裁判所)/u);

    for (const forbidden of [
      'こんにちは',
      '台湾弁護士',
      '曾雋崴',
      'Wei Tseng',
      '動画',
      '私',
      '私たち',
      '当事務所',
      '弊所',
      'おすすめ',
      '推奨します',
      'お気軽に',
      'お問い合わせ',
      'ご相談',
    ]) {
      expect(insertion).not.toContain(forbidden);
    }

    expect(insertion).not.toMatch(/[\uac00-\ud7af]/u);
    expect(insertion).not.toMatch(/[\u200b\ufeff\u00a0]/u);
    expect(insertion).not.toContain('\r');
    expect(insertion).not.toContain('\n');
    expect(insertion).not.toMatch(/^[\t ]|[\t ]$/u);
  });
});
