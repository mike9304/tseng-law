import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/014-taiwan-mandatory-employment-period.md',
);
const sourceBytes = fs.readFileSync(columnPath);

const immutablePrefixLength = 5_281;
const immutablePrefixSha256 =
  '2fd069c0f3de2825c61b58227264811eedfbe9eacf6ebdd3a92d5c78bca87ed9';
const immutableTailMarker = Buffer.from(
  '## 1. 最低勤務期間条項はいつ有効となり得るか',
  'utf8',
);
const immutableTailLength = 26_574;
const immutableTailSha256 =
  'd66816f840cbcdc3b88f3316e9d09c6afcc9533d4b9b94e7dd58967d78ef5403';

const tailOffset = sourceBytes.indexOf(immutableTailMarker);
const closingBytes =
  tailOffset === -1
    ? Buffer.alloc(0)
    : sourceBytes.subarray(immutablePrefixLength, tailOffset);
const closing = closingBytes.toString('utf8');
const structureMatch = closing.match(/^([^\r\n]+)\n\n$/u);
const paragraph = structureMatch?.[1] ?? '';

const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

describe('Japanese labor column 014 — synchronized introduction closing', () => {
  it('preserves the independently locked prefix and H2-to-EOF tail byte-for-byte', () => {
    expect(tailOffset).toBeGreaterThanOrEqual(immutablePrefixLength);

    const prefix = sourceBytes.subarray(0, immutablePrefixLength);
    const tail = sourceBytes.subarray(tailOffset);

    expect(prefix).toHaveLength(immutablePrefixLength);
    expect(sha256(prefix)).toBe(immutablePrefixSha256);
    expect(tail).toHaveLength(immutableTailLength);
    expect(sha256(tail)).toBe(immutableTailSha256);
  });

  it('contains exactly one non-empty plain Japanese prose paragraph', () => {
    expect(structureMatch).not.toBeNull();
    expect(paragraph).toMatch(/[\u3040-\u30ff\u3400-\u9fff]/u);
    expect(paragraph.trim()).toBe(paragraph);
    expect(paragraph).not.toMatch(/^(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/u);
    expect(paragraph).not.toMatch(
      /!?\[[^\r\n]*\]\([^)\r\n]*\)|<[^>\r\n]+>/u,
    );
  });

  it('states that all four issues may appear in the same contract', () => {
    expect(paragraph).toMatch(
      /(?:(?:同じ|同一の)契約(?:書)?[^。]*(?:四つ|4つ)[^。]*(?:問題|事項|論点)|(?:四つ|4つ)[^。]*(?:問題|事項|論点)[^。]*(?:同じ|同一の)契約(?:書)?)/u,
    );
    expect(paragraph).toMatch(
      /(?:記載|定め|盛り込|含まれ|併記|並ん|書かれ)/u,
    );
  });

  it('distinguishes the applicable provisions from the required evidence', () => {
    expect(paragraph).toMatch(
      /適用[^。]*(?:条文|条項|法令|規定)[^。]*(?:異な|違)/u,
    );
    expect(paragraph).toMatch(
      /必要[^。]*(?:証拠|立証資料)[^。]*(?:異な|違)/u,
    );
  });

  it('requires a separate assessment of clause validity', () => {
    expect(paragraph).toMatch(
      /(?:それぞれ|各問題|各事項)[^。]*(?:分けて|個別に|別々に)[^。]*(?:検討|確認|判断|評価)/u,
    );
    expect(paragraph).toMatch(
      /(?:最低勤務期間)?(?:条項|約定)[^。]*(?:有効か|有効性)/u,
    );
  });

  it('separately tests when the resignation notice takes effect', () => {
    expect(paragraph).toMatch(
      /退職[^。]*(?:意思表示|通知|申出)[^。]*(?:いつ|時点|時期)[^。]*(?:効力|有効)/u,
    );
  });

  it('separately tests responsibility to return advance-type benefits or training costs', () => {
    expect(paragraph).toMatch(/(?:前払|前払い|先払|先払い)[^。]*(?:給付|金|手当)/u);
    expect(paragraph).toMatch(/(?:研修費|訓練費)/u);
    expect(paragraph).toMatch(/(?:返還|返す|返却)/u);
    expect(paragraph).toMatch(/(?:責任|義務)/u);
  });

  it('separately tests whether distinct damage actually occurred', () => {
    expect(paragraph).toMatch(
      /(?:別個|別途|別の|独立した)[^。]*損害[^。]*(?:実際に)?(?:発生|生じ)/u,
    );
  });

  it('rejects Korean, invisible characters, malformed whitespace, additions, and marketing', () => {
    expect(closing).not.toMatch(/[\uac00-\ud7af]/u);
    expect(closing).not.toMatch(/[\u200b\ufeff\u00a0]/u);
    expect(closing).not.toContain('\r');
    expect(closing).not.toMatch(/[ \t]+$/mu);
    expect(closing).not.toMatch(
      /(?:^|\n)[\t \u200b\ufeff\u00a0]+(?:\n|$)/u,
    );

    for (const forbidden of [
      /労働基準法/u,
      /第\d+条/u,
      /\d+日/u,
      /(?:新台湾ドル|台湾ドル|TWD|NT\$)/u,
      /例えば/u,
      /ただし/u,
      /例外/u,
      /(?:推奨|おすすめ|助言)/u,
      /こんにちは/u,
      /(?:台湾弁護士|弁護士法人|法律事務所|当事務所|弊所)/u,
      /(?:曾雋崴|Wei Tseng)/u,
      /(?:お気軽に|お問い合わせ|ご相談)/u,
    ]) {
      expect(closing).not.toMatch(forbidden);
    }
  });
});
