import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
);
const source = fs.readFileSync(columnPath, 'utf8');
const sectionStart = source.indexOf(
  '## 1. 台湾への進出形態：子会社・支店・代表者事務所',
);
const sectionEnd = source.indexOf(
  '## 2. 台湾子会社設立の主要な手続',
  sectionStart,
);
const section =
  sectionStart === -1 || sectionEnd === -1
    ? ''
    : source.slice(sectionStart, sectionEnd);
const proseParagraphs = section
  .split(/\n{2,}/u)
  .map((block) => block.trim())
  .filter(
    (block) =>
      block.length > 0 &&
      !block.startsWith('#') &&
      !block.startsWith('!['),
  );
const paragraph = proseParagraphs[1] ?? '';

describe('Japanese investment column 001 — subsidiary explanation paragraph', () => {
  it('extracts the subsidiary paragraph from the local section boundary', () => {
    expect(sectionStart).toBeGreaterThanOrEqual(0);
    expect(sectionEnd).toBeGreaterThan(sectionStart);
    expect(proseParagraphs).toHaveLength(7);
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
