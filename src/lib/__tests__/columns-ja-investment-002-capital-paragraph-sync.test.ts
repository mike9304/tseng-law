import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/002-withdraw-capital-taiwan-company.md',
);
const sourceBytes = fs.readFileSync(columnPath);

const immutablePrefixLength = 5_051;
const immutablePrefixSha256 =
  '948995afb691258eb6dc3637e938c5cdcfc2c2372c6a731a37caa31ea42ec208';
const immutableTailMarker = Buffer.from(
  '会社法（公司法）第9条は、会社が受け取るべき払込金（股款）について、',
  'utf8',
);
const immutableTailLength = 6_728;
const immutableTailSha256 =
  'adf97fe2db6b6273283b7234682e55e0ad67f8ccafd67a46a87f852158fb69f9';

const tailOffset = sourceBytes.indexOf(immutableTailMarker);
const insertionBytes =
  tailOffset === -1
    ? Buffer.alloc(0)
    : sourceBytes.subarray(immutablePrefixLength, tailOffset);
const insertion = insertionBytes.toString('utf8');
const paragraph = insertion.endsWith('\n\n') ? insertion.slice(0, -2) : '';

const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

describe('Japanese investment column 002 — capital explanation paragraph', () => {
  it('preserves the independently locked prefix and Article 9 tail byte-for-byte', () => {
    expect(tailOffset).toBeGreaterThanOrEqual(immutablePrefixLength);

    const prefix = sourceBytes.subarray(0, immutablePrefixLength);
    const tail = sourceBytes.subarray(tailOffset);

    expect(prefix).toHaveLength(immutablePrefixLength);
    expect(sha256(prefix)).toBe(immutablePrefixSha256);
    expect(tail).toHaveLength(immutableTailLength);
    expect(sha256(tail)).toBe(immutableTailSha256);
  });

  it('inserts exactly one plain prose paragraph followed by one blank line', () => {
    expect(insertion).toMatch(/^[^\r\n]+\n\n$/u);
    expect(paragraph).not.toHaveLength(0);
    expect(paragraph.trim()).toBe(paragraph);
    expect(paragraph).not.toMatch(/^(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/u);
    expect(paragraph).not.toMatch(/!?\[[^\r\n]*\]\([^)\r\n]*\)|<[^>\r\n]+>/u);
    expect(paragraph).not.toMatch(/[*_~`]{1,3}|\[\^[^\]\r\n]+\]/u);
  });

  it('defines capital as the accounting equity item contributed at incorporation or a capital increase', () => {
    expect(paragraph).toMatch(/資本金[^。]*(?:会計上|会計の)[^。]*(?:資本|純資産)[^。]*項目/u);
    expect(paragraph).toMatch(
      /(?:会社の)?設立時[^。]*(?:または|又は|もしくは|若しくは|や)[^。]*増資時[^。]*株主[^。]*(?:払い込んだ|払込んだ|拠出した|出資した)[^。]*(?:金額|額)/u,
    );
  });

  it('distinguishes capital from the current bank balance and all operating assets or liabilities', () => {
    expect(paragraph).toMatch(
      /(?:会社の)?(?:銀行)?口座[^。]*(?:現在|現時点)[^。]*(?:残高|預金残高)[^。]*(?:必ずしも|常に)[^。]*(?:一致しない|一致せず|一致するものではない|同一ではない|同じではない)/u,
    );
    expect(paragraph).toMatch(
      /(?:(?:事業|営業)[^。]*(?:取得した|取得する)[^。]*(?:資産|財産)[^。]*(?:負担した|負担する|生じた)[^。]*(?:負債|債務)[^。]*(?:すべて|全て|全部)[^。]*(?:資本金|一語)[^。]*(?:表すものではない|意味するものではない|含まれない|包含しない|説明できない)|事業活動中[^。]*取得した[^。]*すべての資産[^。]*負担した[^。]*すべての債務[^。]*含むものでも[^。]*それらを表すものでもありません|会社[^。]*事業活動を通じて[^。]*取得した資産[^。]*負担した債務[^。]*(?:すべて|全て|全部)[^。]*表すものでもありません)/u,
    );
  });

  it('requires every closure-check category and a combined assessment beyond book capital', () => {
    expect(paragraph).toMatch(
      /会社[^。]*(?:終了|閉鎖|廃止|清算)[^。]*(?:帳簿上|会計帳簿上)[^。]*資本金[^。]*(?:だけでなく|のみではなく|だけを見るのではなく|のみを見るのではなく)/u,
    );

    for (const category of [
      /実際の(?:資産|財産)/u,
      /実際の(?:負債|債務)|(?:資産|財産)[・と、及びおよび]+(?:負債|債務)/u,
      /未収金/u,
      /未払金/u,
      /税金|租税/u,
      /偶発債務/u,
      /清算費用/u,
    ]) {
      expect(paragraph).toMatch(category);
    }
    expect(paragraph).toMatch(/(?:併せて|合わせて|総合的に|一体として)(?:確認|検討|評価|把握)/u);
  });

  it('rejects misleading equations, distributable-capital claims, additions, and malformed copy', () => {
    expect(paragraph).not.toMatch(
      /資本金[^。]*(?:銀行)?口座[^。]*(?:残高|預金)[^。]*(?:である|です|に等しい|と同じ)(?:。|、|$)/u,
    );
    expect(paragraph).not.toMatch(
      /資本金[^。]*(?:(?:すべて|全て|全部)[^。]*(?:資産|財産)|(?:資産|財産)[^。]*(?:すべて|全て|全部))[^。]*(?:である|です|に等しい|含む|表す|意味する)(?:。|、|$)/u,
    );
    expect(paragraph).not.toMatch(
      /資本金[^。]*(?:株主[^。]*)?(?:(?:分配可能|分配できる|払い戻せる|返還できる)|(?:分配|払い戻し|返還)[^。]{0,20}(?:可能である|可能です|できます))(?:。|、|$)/u,
    );

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
      'お気軽に',
      'お問い合わせ',
      'ご相談',
    ]) {
      expect(paragraph).not.toContain(forbidden);
    }

    expect(insertion).not.toMatch(/[\uac00-\ud7af]/u);
    expect(insertion).not.toMatch(/[\u200b\ufeff\u00a0]/u);
    expect(insertion).not.toContain('\r');
    expect(insertion).not.toMatch(/[ \t]+$/mu);
    expect(insertion).not.toMatch(/(?:^|\n)[\t \u200b\ufeff\u00a0]+(?:\n|$)/u);
  });
});
