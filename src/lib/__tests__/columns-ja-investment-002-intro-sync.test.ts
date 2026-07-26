import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/002-withdraw-capital-taiwan-company.md',
);
const sourceBytes = fs.readFileSync(columnPath);

const immutablePrefixLength = 2_297;
const immutablePrefixSha256 =
  'db5d39499cce6213879785f6e7c3900041dc1f626b99a108a09f79415ce9b041';
const immutableTailMarker = Buffer.from(
  '![](../images/002-withdraw-capital-taiwan-company/img-01.png)',
  'utf8',
);
const immutableTailLength = 6_838;
const immutableTailSha256 =
  '26d381e58eb15ae28b6ef05c03065ce393b93855ed31c9086c52e4672d8e3ca0';
const imageLine = immutableTailMarker.toString('utf8');

const tailOffset = sourceBytes.indexOf(immutableTailMarker);
const introBytes =
  tailOffset === -1
    ? Buffer.alloc(0)
    : sourceBytes.subarray(immutablePrefixLength, tailOffset);
const intro = introBytes.toString('utf8');
const paragraphs = intro.endsWith('\n\n') ? intro.slice(0, -2).split('\n\n') : [];

const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

describe('Japanese investment column 002 — synchronized introduction', () => {
  it('preserves the independently locked prefix and tail byte-for-byte', () => {
    expect(tailOffset).toBeGreaterThanOrEqual(immutablePrefixLength);

    const prefix = sourceBytes.subarray(0, immutablePrefixLength);
    const tail = sourceBytes.subarray(tailOffset);

    expect(prefix).toHaveLength(immutablePrefixLength);
    expect(sha256(prefix)).toBe(immutablePrefixSha256);
    expect(tail).toHaveLength(immutableTailLength);
    expect(sha256(tail)).toBe(immutableTailSha256);
  });

  it('keeps exactly one unchanged body image marker outside the introduction', () => {
    const source = sourceBytes.toString('utf8');

    expect(source.split(imageLine)).toHaveLength(2);
    expect(intro).not.toContain(imageLine);
    expect(sourceBytes.subarray(tailOffset, tailOffset + immutableTailMarker.length)).toEqual(
      immutableTailMarker,
    );
  });

  it('contains exactly five plain Japanese prose paragraphs and no Markdown blocks', () => {
    expect(intro).toMatch(/^(?:[^\r\n]+\n\n){5}$/u);
    expect(paragraphs).toHaveLength(5);
    expect(paragraphs.every((paragraph) => paragraph.trim() === paragraph)).toBe(true);

    for (const paragraph of paragraphs) {
      expect(paragraph).not.toMatch(/^(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/u);
      expect(paragraph).not.toMatch(/!?\[[^\r\n]*\]\([^)\r\n]*\)|<[^>\r\n]+>/u);
    }
  });

  it('explains why paid-in capital cannot simply be moved to the shareholder', () => {
    const first = paragraphs[0] ?? '';

    expect(first).toMatch(
      /台湾[^。]*(?:設立|登記)[^。]*(?:会社|法人)[^。]*(?:終了|終える|廃止|廃業)/u,
    );
    expect(first).toMatch(
      /(?:当初|最初|設立時)[^。]*(?:払い込んだ|払込)[^。]*(?:資本金|資本|出資金)[^。]*(?:直ちに|すぐに)[^。]*株主[^。]*口座[^。]*(?:移す|移転|送金|振り込)[^。]*(?:問題|確認|論点)/u,
    );
    expect(first).toMatch(
      /(?:出資金|払込金|払い込まれた資金)[^。]*会社[^。]*口座[^。]*(?:会社財産|会社の財産|会社資産|会社の資産)/u,
    );
    expect(first).toMatch(
      /(?:会社財産|会社の財産|会社資産|会社の資産)[^。]*会社[^。]*帰属[^。]*株主[^。]*(?:個人財産|個人の財産)[^。]*(?:ではない|でない)/u,
    );
    expect(first).toMatch(
      /株主[^。]*(?:全て|すべて|全部|100％|100%)[^。]*(?:所有|保有)[^。]*(?:唯一|単独)[^。]*(?:取締役|董事)[^。]*(?:原則|考え方)[^。]*(?:変わらない|異ならない)/u,
    );
  });

  it('covers company assets and the proof required for a genuine shareholder debt', () => {
    const second = paragraphs[1] ?? '';

    expect(second).toMatch(
      /(?:過去|以前)[^。]*(?:出資|払込)[^。]*(?:だけ|のみ)[^。]*(?:預金|資産)[^。]*(?:自由に|任意に)[^。]*(?:引き出|払い戻|回収)[^。]*(?:できない|認められない)/u,
    );

    for (const asset of [
      /会社名義[^、。]*預金/u,
      /売掛金|売掛債権|売上債権/u,
      /設備|機器/u,
      /車両/u,
      /不動産/u,
      /保証金|敷金/u,
      /知的財産権/u,
    ]) {
      expect(second).toMatch(asset);
    }
    expect(second).toMatch(
      /(?:会社の|会社における)[^。]*(?:権利義務|権利・義務)[^。]*(?:関係|枠組み)[^。]*(?:処理|整理)/u,
    );
    expect(second).toMatch(
      /会社[^。]*株主[^。]*(?:真正|実在|実際|正当)[^。]*(?:債務|負債)[^。]*(?:契約|送金記録|送金履歴|振込記録|振込履歴|会計帳簿|帳簿|決議)[^。]*(?:存在|返済根拠|返済の根拠)/u,
    );
    for (const evidence of [
      /契約/u,
      /送金(?:記録|履歴)|振込(?:記録|履歴)/u,
      /会計帳簿|帳簿/u,
      /決議/u,
    ]) {
      expect(second).toMatch(evidence);
    }
  });

  it('separates the five kinds of company-fund outflow and their procedures', () => {
    const third = paragraphs[2] ?? '';

    for (const category of [
      /解散[^、。]*(?:清算|清算手続)/u,
      /会社[^、。]*(?:存続|維持)[^、。]*減資/u,
      /通常[^、。]*(?:事業|営業)[^、。]*(?:費用|経費)/u,
      /利益[^、。]*(?:前提|原資|基づ)[^、。]*配当/u,
      /会社[^、。]*(?:実際|真正|正当)[^、。]*(?:借入金|債務)[^、。]*返済/u,
    ]) {
      expect(third).toMatch(category);
    }
    expect(third).toMatch(
      /(?:異なる|別々の|別の)[^。]*(?:法的|法律上)[^。]*(?:税務|税務上)[^。]*(?:区分|分類|カテゴリー)/u,
    );
    expect(third).toMatch(
      /会社[^。]*口座[^。]*(?:資金|金銭|金)[^。]*(?:出る|流出|支出)[^。]*(?:同じ|同様)[^。]*(?:決議|債権者保護|証憑|証拠書類|会計処理|源泉徴収|申告)[^。]*(?:同じではない|異なる)/u,
    );
    for (const procedure of [
      /決議/u,
      /債権者保護/u,
      /証憑|証拠書類/u,
      /会計処理/u,
      /源泉徴収/u,
      /申告/u,
    ]) {
      expect(third).toMatch(procedure);
    }
  });

  it('distinguishes permanent dissolution from merely suspending operations', () => {
    const fourth = paragraphs[3] ?? '';

    expect(fourth).toMatch(
      /(?:営業|事業|業務)[^。]*(?:中止|停止|止め)[^。]*(?:だけ|のみ)[^。]*(?:法人格|会社の存在)[^。]*(?:申告義務|届出義務)[^。]*(?:消えない|なくならない|終了しない)/u,
    );
    expect(fourth).toMatch(
      /(?:恒久的|永久に)[^。]*(?:終了|廃止)[^。]*解散登記[^。]*清算[^。]*(?:契約|債権|債務|税金|租税|残余財産)[^。]*(?:整理|処理)/u,
    );
    for (const item of [/契約/u, /債権/u, /債務/u, /税金|租税/u, /残余財産/u]) {
      expect(fourth).toMatch(item);
    }
    expect(fourth).toMatch(
      /(?:事業|営業)[^。]*(?:再開|再開する)[^。]*(?:可能性|余地)[^。]*(?:休業|営業停止)[^。]*(?:検討|選択)/u,
    );
    expect(fourth).toMatch(
      /(?:休業|営業停止)[^。]*(?:会社|法人)[^。]*(?:存在|法人格)[^。]*(?:終わらせる|終了させる|消滅させる)[^。]*(?:手続|制度)[^。]*(?:ではない|でない)/u,
    );
  });

  it('gives the complete roadmap and preserves the source-specific limitations', () => {
    const fifth = paragraphs[4] ?? '';

    for (const roadmapConcept of [
      /会社財産|会社の財産/u,
      /払込(?:株金|金)|払込済み?資本|出資金/u,
      /減資/u,
      /解散/u,
      /清算/u,
      /破産[^、。]*(?:申立|申請)/u,
      /残余財産[^、。]*分配/u,
      /休業|営業停止/u,
    ]) {
      expect(fifth).toMatch(roadmapConcept);
    }
    for (const factor of [
      /会社[^、。]*(?:形態|種類)/u,
      /定款/u,
      /財務[^、。]*(?:状態|状況)/u,
      /債権者/u,
      /許認可/u,
      /(?:労働|雇用)[^、。]*(?:関係|状況)/u,
      /外国(?:人)?投資/u,
      /送金[^、。]*(?:構造|仕組み)/u,
    ]) {
      expect(fifth).toMatch(factor);
    }
    expect(fifth).toMatch(
      /(?:実際|具体的)[^。]*(?:順序|手順)[^。]*(?:書類|文書)[^。]*(?:異なる|変わる)/u,
    );
    expect(fifth).toMatch(
      /(?:各段階|それぞれの段階)[^。]*(?:現在|最新)[^。]*(?:資料|情報)[^。]*(?:判断|確認)/u,
    );
  });

  it('rejects stale, personal, marketing, Korean, and malformed intro copy', () => {
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
