import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
);
const sourceBytes = fs.readFileSync(columnPath);

const immutablePrefixLength = 2_870;
const immutablePrefixSha256 =
  '7b9ba687afe25b5077611c11cba9396394b2ebb3431268bd70e7923ba1707497';
const immutableTailMarker = Buffer.from(
  '> まず事業拠点の組織形態を決める必要があります。',
  'utf8',
);
const immutableTailLength = 11_002;
const immutableTailSha256 =
  '90af3c78e70d78a7688f25d6577443aed22822f5c54e116ec1d9c1f7f0624cfc';

const tailOffset = sourceBytes.indexOf(immutableTailMarker);
const introBytes =
  tailOffset === -1
    ? Buffer.alloc(0)
    : sourceBytes.subarray(immutablePrefixLength, tailOffset);
const intro = introBytes.toString('utf8');
const paragraphs = intro.endsWith('\n\n') ? intro.slice(0, -2).split('\n\n') : [];

const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

describe('Japanese investment column 001 — synchronized introduction', () => {
  it('preserves the independently locked prefix and tail byte-for-byte', () => {
    expect(tailOffset).toBeGreaterThanOrEqual(immutablePrefixLength);

    const prefix = sourceBytes.subarray(0, immutablePrefixLength);
    const tail = sourceBytes.subarray(tailOffset);

    expect(prefix).toHaveLength(immutablePrefixLength);
    expect(sha256(prefix)).toBe(immutablePrefixSha256);
    expect(tail).toHaveLength(immutableTailLength);
    expect(sha256(tail)).toBe(immutableTailSha256);
  });

  it('contains exactly three prose paragraphs and ends immediately with one blank line', () => {
    expect(intro).toMatch(/^[^\r\n]+\n\n[^\r\n]+\n\n[^\r\n]+\n\n$/u);
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs.every((paragraph) => paragraph.trim() === paragraph)).toBe(true);
  });

  it('explains that the Taiwan entry setup depends on the actual business', () => {
    const first = paragraphs[0] ?? '';

    expect(first).toMatch(/事業(?:内容|モデル)[^。]*(?:進出|参入)[^。]*(?:方法|形態)[^。]*異/u);
    expect(first).toMatch(/(?:使用|利用|締結|用い)[^。]*契約/u);
    expect(first).toMatch(/(?:売上|収益)[^。]*(?:法人|会社|事業体|組織)/u);
    expect(first).toMatch(/台湾[^。]*(?:業務|仕事|就労)[^。]*(?:人|者|担当)/u);
    expect(first).toMatch(/(?:法的な?枠組み|法的な?体制|法的構成|必要な法的手続)/u);
  });

  it('separates connected procedures and states the registration caveats', () => {
    const second = paragraphs[1] ?? '';

    for (const concept of [
      /会社設立|法人設立/u,
      /外国投資/u,
      /銀行/u,
      /税務/u,
      /(?:営業場所|事業所|事業拠点|所在地)/u,
      /就業許可/u,
      /居留/u,
    ]) {
      expect(second).toMatch(concept);
    }

    expect(second).toMatch(/(?:相互に|互いに|関連|つなが)[^。]*(?:別個|別々|異なる|区別)/u);
    expect(second).toMatch(
      /(?:会社|法人)(?:設立)?登記[^。]*(?:だけ|のみ)[^。]*(?:投資審査|投資審議|投資許可)/u,
    );
    expect(second).toMatch(/(?:業種別|事業別)[^。]*(?:許認可|許可)/u);
    expect(second).toMatch(
      /(?:株主|経営者|管理者)[^。]*(?:直ちに|すぐに|直後から)[^。]*(?:就労|働|業務)/u,
    );
    expect(second).toMatch(/(?:完了|認められ|許され|可能になる)(?:する)?(?:わけではない|ものではない|とは限らない)/u);
  });

  it('integrates the early review and gives the complete article roadmap', () => {
    const third = paragraphs[2] ?? '';

    for (const concept of [
      /事業モデル/u,
      /投資者[^。]*(?:所在地|所在国|拠点)/u,
      /本店[^。]*(?:所在地|所在国|拠点)/u,
      /(?:予定|想定|見込)[^。]*(?:取引|取引関係)/u,
      /(?:資金の流れ|資金フロー)/u,
      /(?:人員|人材|スタッフ|従業員)/u,
      /(?:営業場所|事業所|事業拠点|所在地)/u,
    ]) {
      expect(third).toMatch(concept);
    }
    expect(third).toMatch(/(?:当初|初期|最初|初め)[^。]*(?:一体|総合|まとめて|併せて)[^。]*(?:検討|確認|整理)/u);

    for (const roadmapConcept of [
      /(?:組織|法人|会社)[^、。]*(?:形態|形式)/u,
      /子会社[^、。]*(?:設立|手続|プロセス)/u,
      /業種[^、。]*(?:確認|チェック|規制|許認可)/u,
      /(?:場所|所在地|立地)[^、。]*(?:確認|チェック|規制|要件)/u,
      /就業[^、。]*(?:許可|資格)/u,
      /居留/u,
      /資本/u,
      /(?:主要|主な)[^、。]*税/u,
    ]) {
      expect(third).toMatch(roadmapConcept);
    }
  });

  it('removes stale, personal, Korean, and invisible spacer copy from the intro only', () => {
    for (const forbidden of [
      'こんにちは',
      '台湾弁護士',
      '曾雋崴',
      'Wei Tseng',
      '動画',
      '私',
      '当事務所',
      '弊所',
      'お気軽に',
      'お問い合わせ',
    ]) {
      expect(intro).not.toContain(forbidden);
    }

    expect(intro).not.toMatch(/[\uac00-\ud7af]/u);
    expect(intro).not.toMatch(/[\u200b\ufeff\u00a0]/u);
    expect(intro).not.toMatch(/(?:^|\n)[\t \u200b\ufeff\u00a0]+(?:\n|$)/u);
  });
});
