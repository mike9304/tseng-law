import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md',
);
const sourceBytes = fs.readFileSync(columnPath);

const immutablePrefixLength = 9_766;
const immutablePrefixSha256 =
  '885ca0716ebd87e80055a8e6464aaa900b67d09800b4318e0137451ad74c6d59';
const immutableTailMarker = Buffer.from(
  '保存場所、アクセス権限、バックアップ、版管理および契約終了後の資料引継ぎまで決めておくと、担当者や販売代理店が変わった場合の欠落を防ぎやすくなります。',
  'utf8',
);
const immutableTailLength = 7_137;
const immutableTailSha256 =
  '6a1788dfb3f7fa1054216572b0584850c07348681244281a4cebc15c04aafd77';

const tailOffset = sourceBytes.indexOf(immutableTailMarker);
const synchronizedBytes =
  tailOffset === -1
    ? Buffer.alloc(0)
    : sourceBytes.subarray(immutablePrefixLength, tailOffset);
const synchronizedCopy = synchronizedBytes.toString('utf8');
const structureMatch = synchronizedCopy.match(/^([^\r\n]+)\n\n([^\r\n]+)\n\n$/u);
const paragraphs = structureMatch?.slice(1) ?? [];

const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

describe('Japanese investment column 011 — synchronized PIF update and retention copy', () => {
  it('preserves the independently locked prefix and tail byte-for-byte', () => {
    expect(tailOffset).toBeGreaterThanOrEqual(immutablePrefixLength);
    expect(sourceBytes.lastIndexOf(immutableTailMarker)).toBe(tailOffset);

    const prefix = sourceBytes.subarray(0, immutablePrefixLength);
    const tail = sourceBytes.subarray(tailOffset);

    expect(prefix).toHaveLength(immutablePrefixLength);
    expect(sha256(prefix)).toBe(immutablePrefixSha256);
    expect(tail).toHaveLength(immutableTailLength);
    expect(sha256(tail)).toBe(immutableTailSha256);
  });

  it('contains exactly two non-empty Japanese prose paragraphs and no Markdown', () => {
    expect(structureMatch).not.toBeNull();
    expect(paragraphs).toHaveLength(2);

    for (const paragraph of paragraphs) {
      expect(paragraph.trim()).toBe(paragraph);
      expect(paragraph).toMatch(/[\u3040-\u30ff\u3400-\u9fff]/u);
      expect(paragraph).not.toMatch(/(?:^|\s)(?:#{1,6}|>|[-+*]|\d+\.)\s/u);
      expect(paragraph).not.toMatch(
        /!?\[[^\r\n]*\]\([^)\r\n]*\)|<[^>\r\n]+>|\*\*|__|~~|`/u,
      );
    }
  });

  it('keeps every change target and requires ongoing post-creation change management', () => {
    const first = paragraphs[0] ?? '';

    for (const changeTarget of [
      /原料/u,
      /処方/u,
      /製造方法/u,
      /製造場所/u,
      /ラベル[^。]*表示|表示[^。]*ラベル/u,
      /標榜(?:する)?機能/u,
      /安全性情報/u,
    ]) {
      expect(first).toMatch(changeTarget);
    }

    expect(first).toMatch(
      /変更[^。]*(?:影響を受ける|影響する)[^。]*PIF[^。]*資料[^。]*(?:見直|検討)[^。]*更新/u,
    );
    expect(first).toMatch(/消費者(?:から)?[^、。]*(?:苦情|クレーム)/u);
    expect(first).toMatch(/有害事象/u);
    expect(first).toMatch(/新たな試験結果/u);
    expect(first).toMatch(/既存(?:の)?評価[^。]*影響/u);
    expect(first).toMatch(
      /(?:初回|最初)(?:の)?作成後[^。]*(?:継続的な)?変更管理(?:手続|手順|プロセス)[^。]*必要/u,
    );
  });

  it('states the five-year period and the distinct statutory basis for the storage location', () => {
    const second = paragraphs[1] ?? '';

    expect(second).toMatch(
      /(?:(?:「化粧品製品情報ファイル管理弁法」|化粧品製品情報ファイル管理弁法)第7条[^。]*(?:保存|保管)期間|(?:保存|保管)期間[^。]*(?:「化粧品製品情報ファイル管理弁法」|化粧品製品情報ファイル管理弁法)第7条)/u,
    );
    expect(second).toMatch(/市場(?:へ|に)[^。]*最後(?:に)?供給した日(?:の)?翌日/u);
    expect(second).toMatch(/(?:最低|少なくとも)5年/u);
    expect(second).toMatch(
      /(?:保存|保管)場所[^。]*(?:同(?:弁法|規定)|「化粧品製品情報ファイル管理弁法」|化粧品製品情報ファイル管理弁法)第8条/u,
    );
    expect(second).toMatch(
      /(?:「化粧品衛生安全管理法」|化粧品衛生安全管理法)第7条第1項第7号/u,
    );
    expect(second).toMatch(/化粧品製造・輸入業者[^。]*表示住所/u);
    expect(second).toMatch(
      /(?:保存|保管)期間[^。]*第7条[^。]*(?:保存|保管)場所[^。]*第8条[^。]*(?:区別|分け)/u,
    );
    expect(second).not.toMatch(/第7条に基づく[^。]*(?:表示)?住所/u);
  });

  it('retains complete and promptly retrievable original or electronic records', () => {
    const second = paragraphs[1] ?? '';

    expect(second).toMatch(/原製造業者[^。]*原本/u);
    expect(second).toMatch(/安全[^。]*(?:電子[^。]*クラウド|クラウド[^。]*電子)/u);
    expect(second).toMatch(/完全な資料/u);
    expect(second).toMatch(
      /主管機関[^。]*(?:要求|求め)[^。]*速やか[^。]*(?:検索|取り出し)[^。]*提示/u,
    );
  });

  it('rejects Korean text, invisible characters, CRs, and whitespace corruption', () => {
    expect(synchronizedCopy).not.toMatch(/[\uac00-\ud7af]/u);
    expect(synchronizedCopy).not.toMatch(/[\u200b\ufeff\u00a0]/u);
    expect(synchronizedCopy).not.toContain('\r');
    expect(synchronizedCopy).not.toMatch(/[ \t]+$/mu);
    expect(synchronizedCopy).not.toMatch(
      /(?:^|\n)[\t \u200b\ufeff\u00a0]+(?:\n|$)/u,
    );
  });
});
