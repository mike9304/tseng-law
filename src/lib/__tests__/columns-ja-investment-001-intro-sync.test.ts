import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
);
const source = fs.readFileSync(columnPath, 'utf8');
const articleHeading =
  '# 台湾での会社設立の基礎：子会社・支店・代表者事務所、手続と就業許可';
const introStartMarker =
  '![](../images/001-taiwan-company-establishment-basics/img-01.jpg)\n\n';
const introEndMarker =
  '\n\n## 1. 台湾への進出形態：子会社・支店・代表者事務所';
const introStartOffset = source.indexOf(introStartMarker);
const introEndOffset = source.indexOf(
  introEndMarker,
  introStartOffset + introStartMarker.length,
);
const intro =
  introStartOffset === -1 || introEndOffset === -1
    ? ''
    : source.slice(introStartOffset + introStartMarker.length, introEndOffset);
const paragraphs = intro.split('\n\n');

describe('Japanese investment column 001 — synchronized introduction', () => {
  it('preserves the article, image, introduction, and section-1 boundaries', () => {
    const headingOffset = source.indexOf(articleHeading);
    const featuredImageOffset = source.indexOf(
      '![代表画像](../images/001-taiwan-company-establishment-basics/featured-01.jpg)',
      headingOffset,
    );

    expect(headingOffset).toBeGreaterThanOrEqual(0);
    expect(featuredImageOffset).toBeGreaterThan(headingOffset);
    expect(introStartOffset).toBeGreaterThan(featuredImageOffset);
    expect(introEndOffset).toBeGreaterThan(
      introStartOffset + introStartMarker.length,
    );
    expect(source.slice(introEndOffset, introEndOffset + introEndMarker.length)).toBe(
      introEndMarker,
    );
  });

  it('contains exactly three prose paragraphs immediately before section 1', () => {
    expect(intro).toMatch(/^[^\r\n]+\n\n[^\r\n]+\n\n[^\r\n]+$/u);
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs.every((paragraph) => paragraph.trim() === paragraph)).toBe(true);
  });

  it('explains that the Taiwan entry setup depends on the actual business', () => {
    const first = paragraphs[0] ?? '';

    expect(first).toMatch(/事業(?:内容|モデル)[^。]*(?:進出|参入)[^。]*(?:方法|形態)[^。]*異/u);
    expect(first).toMatch(/誰[^。]*どのような契約[^。]*締結/u);
    expect(first).toMatch(
      /(?:どの|いずれの)[^。]*(?:法人|会社|事業体|組織)[^。]*(?:売上|収益)[^。]*(?:得|上げ)/u,
    );
    expect(first).toMatch(/(?:現地|台湾)[^。]*(?:誰|人|者|担当)[^。]*(?:業務|仕事|就労)/u);
    expect(first).toMatch(/(?:法律関係|法的な?枠組み|法的な?体制|法的構成|必要な法的手続)/u);
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
      /(?:会社|法人)(?:設立)?登記[^。]*(?:終えたからといって|だけ|のみ)[^。]*(?:投資額の審査|投資審査|投資審議|投資許可)/u,
    );
    expect(second).toMatch(/(?:業種別|事業別)[^。]*(?:許認可|許可)/u);
    expect(second).toMatch(
      /(?:株主|経営者|管理者)[^。]*(?:直ちに|すぐに|直後から)[^。]*(?:就労|働|業務)/u,
    );
    expect(second).toMatch(
      /(?:完了|認められ|許され|可能になる)(?:する)?(?:わけではな(?:い|く)|ものではない|とは限らない)/u,
    );
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
