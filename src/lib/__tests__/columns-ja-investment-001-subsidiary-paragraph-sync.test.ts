import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
);
const sourceBytes = fs.readFileSync(columnPath);

const immutablePrefixLength = 4_551;
const immutablePrefixSha256 =
  'c93292788f5e6fed1bfe8063c3df5c0f786a2c0e5b202c3946c1b495aacf422c';
const oldTargetLength = 288;
const oldTargetSha256 =
  '2945ff5a83f93c296673a11c0f5427240d9b2d35e0cfdde3b9e93401ba872464';
const immutableTailMarker = Buffer.from(
  '\n\n**台湾・韓国所得税協定は2023年12月27日に発効し、',
  'utf8',
);
const immutableTailLength = 9_705;
const immutableTailSha256 =
  '96dd220b7373f4c36fb03c3b2a9f4bc40ac55cf0b02b9786985dfa8d30b323f4';

const tailOffset = sourceBytes.indexOf(immutableTailMarker);
const targetBytes =
  tailOffset === -1
    ? Buffer.alloc(0)
    : sourceBytes.subarray(immutablePrefixLength, tailOffset);
const paragraph = targetBytes.toString('utf8');

const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

describe('Japanese investment column 001 — subsidiary explanation paragraph', () => {
  it('preserves the independently locked prefix and tax-treaty tail byte-for-byte', () => {
    expect(tailOffset).toBeGreaterThanOrEqual(immutablePrefixLength);
    expect(sourceBytes.lastIndexOf(immutableTailMarker)).toBe(tailOffset);

    const prefix = sourceBytes.subarray(0, immutablePrefixLength);
    const tail = sourceBytes.subarray(tailOffset);

    expect(prefix).toHaveLength(immutablePrefixLength);
    expect(sha256(prefix)).toBe(immutablePrefixSha256);
    expect(tail).toHaveLength(immutableTailLength);
    expect(sha256(tail)).toBe(immutableTailSha256);
  });

  it('identifies the exact 288-byte legacy paragraph while the RED fixture remains', () => {
    const isLegacyTarget =
      targetBytes.length === oldTargetLength && sha256(targetBytes) === oldTargetSha256;

    if (targetBytes.length === oldTargetLength) {
      expect(sha256(targetBytes)).toBe(oldTargetSha256);
      expect(tailOffset).toBe(4_839);
      expect(isLegacyTarget).toBe(true);
    } else {
      expect(sha256(targetBytes)).not.toBe(oldTargetSha256);
      expect(isLegacyTarget).toBe(false);
    }
  });

  it('contains exactly one plain Japanese prose paragraph in the mutable slice', () => {
    expect(paragraph).toMatch(/^[^\r\n]+$/u);
    expect(paragraph).not.toHaveLength(0);
    expect(paragraph.trim()).toBe(paragraph);
    expect(paragraph).toMatch(/[\u3040-\u30ff\u3400-\u9fff]/u);
    expect(paragraph).not.toMatch(/^(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/u);
    expect(paragraph).not.toMatch(/!?\[[^\r\n]*\]\([^)\r\n]*\)|<[^>\r\n]+>/u);
    expect(paragraph).not.toMatch(/[*_~`]{1,3}|\[\^[^\]\r\n]+\]/u);
  });

  it('states the subsidiary’s separate identity, own contracting capacity, and rights and obligations', () => {
    expect(paragraph).toMatch(/台湾子会社[^。]*有限公司[^。]*股份有限公司/u);
    expect(paragraph).toMatch(
      /(?:(?:本店|本社|親会社)[^。]*(?:区別|別個|異なる|独立)|(?:区別|別個|異なる|独立)[^。]*(?:本店|本社|親会社))[^。]*法人/u,
    );
    expect(paragraph).toMatch(
      /(?:自己|自ら|自身|子会社)[^。]*(?:名義|名)[^。]*契約[^。]*(?:締結|当事者)/u,
    );
    expect(paragraph).toMatch(
      /(?:(?:権利|権限)[^。]*(?:義務|債務)[^。]*(?:主体|帰属|保有|有し|取得|負う)|(?:権利義務|権利・義務)[^。]*(?:主体|帰属|保有|有する))/u,
    );
  });

  it('requires both company forms and every factor used to choose between them', () => {
    expect(paragraph).toMatch(
      /(?:有限公司[^。]*股份有限公司|股份有限公司[^。]*有限公司)[^。]*(?:(?:選択|選定|選ぶ|いずれ)[^。]*(?:考慮|検討|判断)|(?:考慮|検討|判断)[^。]*(?:選択|選定|選ぶ))/u,
    );

    for (const selectionFactor of [
      /(?:持分(?:または|又は|・)株式|持分|株式|出資|資本)(?:の)?(?:構成|構造|設計)/u,
      /(?:会社|組織)?機関(?:構成|構造|設計)|ガバナンス(?:構成|構造|設計)/u,
      /意思決定(?:方法|方式|手続|プロセス|の仕組み)/u,
      /(?:資金調達|融資)(?:計画|方針|方法|手段)/u,
    ]) {
      expect(paragraph).toMatch(selectionFactor);
    }
  });

  it('rejects an automatic liability limit and requires every separately reviewed relationship', () => {
    expect(paragraph).toMatch(
      /(?:独立(?:した)?法人(?:格)?|法人格[^。]*(?:独立|別個|分離))[^。]*(?:だけ|のみ|それ自体|理由|からといって|であっても)[^。]*(?:(?:すべて|全て|あらゆる|一切)[^。]*(?:責任|債務)|(?:責任|債務)[^。]*(?:すべて|全て|あらゆる|一切))[^。]*(?:常に[^。]*)?(?:子会社[^。]*(?:限定|限ら|帰属)|子会社だけ[^。]*(?:負う|帰属))[^。]*(?:わけではない|とは限らない|とは限りません)/u,
    );

    for (const relationship of [
      /保証/u,
      /担保(?:権|設定|関係)?/u,
      /(?:親会社|本店|本社)[^。]*契約|契約[^。]*(?:親会社|本店|本社)/u,
      /(?:取締役|役員)[^。]*(?:責任|義務)/u,
    ]) {
      expect(paragraph).toMatch(relationship);
    }

    expect(paragraph).toMatch(
      /(?:これら|各|それぞれ|個別|個々)[^。]*(?:関係|法律関係|契約関係)[^。]*(?:確認|検討|審査)/u,
    );
  });

  it('rejects prohibited additions, structures, Hangul, and malformed copy', () => {
    expect(paragraph).not.toMatch(
      /(?:会社法|民法|商法|第\d+条|判例|裁判所|必ず責任を負わない|一切責任を負わない)/u,
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
      'おすすめ',
      '推奨します',
      'お気軽に',
      'お問い合わせ',
      'ご相談',
    ]) {
      expect(paragraph).not.toContain(forbidden);
    }

    expect(paragraph).not.toMatch(/[\uac00-\ud7af]/u);
    expect(paragraph).not.toMatch(/[\u200b\ufeff\u00a0]/u);
    expect(paragraph).not.toContain('\r');
    expect(paragraph).not.toContain('\n');
    expect(paragraph).not.toMatch(/[ \t]+$/u);
  });
});
