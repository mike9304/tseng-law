import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/004-taiwan-company-subsidiary-vs-branch.md',
);
const sourceBytes = fs.readFileSync(columnPath);

const immutablePrefixLength = 2_274;
const immutablePrefixSha256 =
  'ca0ceb7801a6df1447cd6a1d819fcaca7df7d181f4eebd5c87647f10549db283';
const immutableTailMarker = Buffer.from('## 1. 法人格と出資関係', 'utf8');
const immutableTailLength = 10_174;
const immutableTailSha256 =
  'a6a59ae4a040317215fdd6c62d733d16acdcf6fe825dd4414ddcc01acd283a83';
const imageLine =
  '![](../images/004-taiwan-company-subsidiary-vs-branch/img-01.jpg)';

const tailOffset = sourceBytes.indexOf(immutableTailMarker);
const introBytes =
  tailOffset === -1
    ? Buffer.alloc(0)
    : sourceBytes.subarray(immutablePrefixLength, tailOffset);
const intro = introBytes.toString('utf8');
const structureMatch = intro.match(
  /^([^\r\n]+)\n\n!\[\]\(\.\.\/images\/004-taiwan-company-subsidiary-vs-branch\/img-01\.jpg\)\n\n([^\r\n]+)\n\n([^\r\n]+)\n\n$/u,
);
const paragraphs = structureMatch?.slice(1) ?? [];

const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

describe('Japanese investment column 004 — synchronized introduction', () => {
  it('preserves the independently locked prefix and tail byte-for-byte', () => {
    expect(tailOffset).toBeGreaterThanOrEqual(immutablePrefixLength);

    const prefix = sourceBytes.subarray(0, immutablePrefixLength);
    const tail = sourceBytes.subarray(tailOffset);

    expect(prefix).toHaveLength(immutablePrefixLength);
    expect(sha256(prefix)).toBe(immutablePrefixSha256);
    expect(tail).toHaveLength(immutableTailLength);
    expect(sha256(tail)).toBe(immutableTailSha256);
  });

  it('contains exactly three prose paragraphs around the unchanged image line', () => {
    expect(structureMatch).not.toBeNull();
    expect(paragraphs).toHaveLength(3);
    expect(intro.split('\n').filter((line) => line === imageLine)).toHaveLength(1);
    expect(paragraphs.every((paragraph) => paragraph.trim() === paragraph)).toBe(true);

    for (const paragraph of paragraphs) {
      expect(paragraph).not.toMatch(/^(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/u);
      expect(paragraph).not.toMatch(/!?\[[^\r\n]*\]\([^)\r\n]*\)|<[^>\r\n]+>/u);
    }
  });

  it('compares both forms across the complete business lifecycle', () => {
    const first = paragraphs[0] ?? '';

    expect(first).toMatch(
      /台湾[^。]*(?:継続的|継続して|継続する|恒常的)[^。]*(?:事業|営業)[^。]*(?:外国企業|外国会社)/u,
    );
    expect(first).toMatch(/台湾子会社[^。]*(?:外国会社の)?台湾支店[^。]*(?:比較|検討)/u);
    expect(first).toMatch(/(?:いずれも|両者)[^。]*台湾[^。]*事業拠点/u);

    for (const difference of [
      /(?:契約(?:の)?当事者|契約主体)/u,
      /(?:債務|責任)[^、。]*(?:負担|負う|帰属|主体)/u,
      /第三者[^、。]*(?:出資|投資)[^、。]*(?:受け|受入|受け入れ|可能)/u,
      /利益[^、。]*(?:国外|海外|本国|親会社|本店)[^、。]*(?:送金|移転)[^、。]*(?:手続|方法)/u,
    ]) {
      expect(first).toMatch(difference);
    }

    expect(first).toMatch(
      /設立[^。]*(?:便宜|利便|容易|簡便)[^。]*(?:だけ|のみ)[^。]*(?:比較|判断|選択)/u,
    );
    expect(first).toMatch(
      /運営|事業運営|事業開始後/u,
    );
    expect(first).toMatch(/(?:予想外|想定外)[^。]*(?:責任|債務)[^。]*(?:税務|税金|課税)/u);
    expect(first).toMatch(
      /(?:事業の)?(?:全ライフサイクル|ライフサイクル全体|全期間|開始から終了まで)[^。]*(?:検討|比較|考慮)/u,
    );
  });

  it('defines both legal forms and fixes the terminology used by the article', () => {
    const second = paragraphs[1] ?? '';

    expect(second).toMatch(
      /台湾子会社[^。]*台湾法[^。]*(?:設立|成立)[^。]*(?:独立した法人|独立法人|独立した法的主体)/u,
    );
    expect(second).toMatch(/外国[^。]*(?:親会社|本社)[^。]*(?:株主|出資者)/u);
    expect(second).toMatch(
      /(?:親会社|本社)[^。]*(?:別|異なる|独立)[^。]*(?:権利義務の主体|権利を有し[^。]*義務を負う|権利と義務の主体)/u,
    );
    expect(second).toMatch(
      /(?:外国会社の)?台湾支店[^。]*(?:外国本店|外国会社|本社)[^。]*(?:一部|構成部分)/u,
    );
    expect(second).toMatch(
      /台湾支店[^。]*(?:独立した法人格を持たない|別個の法人格を有しない|独立した法的主体ではない)[^。]*(?:事業拠点|営業拠点)/u,
    );
    expect(second).toMatch(/支社[^。]*(?:日常|一般|通称|俗称)[^。]*(?:呼|表現|用語)/u);
    expect(second).toMatch(
      /(?:本記事|この記事)[^。]*(?:法的関係|法律関係)[^。]*(?:明確|明らか)[^。]*支店/u,
    );
  });

  it('individualizes the selection and gives the complete cross-border roadmap', () => {
    const third = paragraphs[2] ?? '';

    for (const selectionFactor of [
      /業種/u,
      /(?:投資者|出資者|株主)[^、。]*(?:構成|組成)/u,
      /契約[^、。]*(?:構造|関係|形態)/u,
      /台湾[^、。]*(?:許認可|許可)/u,
      /(?:従業員数|(?:人員|人材|スタッフ|従業員)[^、。]*(?:配置|構成|雇用|計画))/u,
      /資金調達/u,
      /利益[^、。]*(?:利用|活用)[^、。]*(?:回収|還流)/u,
      /(?:パートナー|共同投資者|新規株主)[^、。]*(?:参加|受入|受け入れ)/u,
      /上場/u,
      /(?:事業|営業)[^、。]*(?:中止|終了|撤退|廃止)/u,
    ]) {
      expect(third).toMatch(selectionFactor);
    }

    expect(third).toMatch(/韓国[^。]*(?:親会社|企業)[^。]*台湾[^。]*(?:進出|参入)/u);
    expect(third).toMatch(
      /台湾法[^。]*韓国[^。]*(?:会計|税務)[^。]*(?:海外投資|国外投資)[^。]*(?:手続|手続き)[^。]*(?:併せて|ともに|一緒に)[^。]*(?:検討|確認)/u,
    );

    for (const roadmapConcept of [
      /法人格/u,
      /税(?:務|制|金)/u,
      /責任/u,
      /資金調達/u,
      /投資税額控除/u,
      /所得税協定/u,
      /(?:退出|撤退|事業終了|廃業)/u,
    ]) {
      expect(third).toMatch(roadmapConcept);
    }
  });

  it('removes stale, personal, marketing, Korean, and malformed copy from the intro only', () => {
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
      expect(intro).not.toContain(forbidden);
    }

    expect(intro).not.toMatch(/[\uac00-\ud7af]/u);
    expect(intro).not.toMatch(/[\u200b\ufeff\u00a0]/u);
    expect(intro).not.toContain('\r');
    expect(intro).not.toMatch(/[ \t]+$/mu);
    expect(intro).not.toMatch(/(?:^|\n)[\t \u200b\ufeff\u00a0]+(?:\n|$)/u);
  });
});
