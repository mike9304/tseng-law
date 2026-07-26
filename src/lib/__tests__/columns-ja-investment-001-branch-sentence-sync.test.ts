import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
);
const sourceBytes = fs.readFileSync(columnPath);

const immutablePrefixLength = 6_493;
const immutablePrefixSha256 =
  'd0304afd1fc83b10ad427a57f50e44702a2f729b7456b66324719173706004f7';
const immutableTailMarker = Buffer.from('\n\n**3. 代表者事務所：**', 'utf8');
const immutableTailLength = 8_971;
const immutableTailSha256 =
  '0561013c3ed1b5591a7b08949238ccb6ad1102e0a55e94b5308846a6420b8201';

const tailOffset = sourceBytes.indexOf(immutableTailMarker, immutablePrefixLength);
const insertionBytes =
  tailOffset === -1
    ? Buffer.alloc(0)
    : sourceBytes.subarray(immutablePrefixLength, tailOffset);
const insertion = insertionBytes.toString('utf8');

const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

describe('Japanese investment column 001 — branch transaction sentence', () => {
  it('preserves the independently locked branch prefix and representative-office tail', () => {
    expect(tailOffset).toBeGreaterThanOrEqual(immutablePrefixLength);
    expect(sourceBytes.lastIndexOf(immutableTailMarker)).toBe(tailOffset);

    const prefix = sourceBytes.subarray(0, immutablePrefixLength);
    const tail = sourceBytes.subarray(tailOffset);

    expect(prefix).toHaveLength(immutablePrefixLength);
    expect(sha256(prefix)).toBe(immutablePrefixSha256);
    expect(tail).toHaveLength(immutableTailLength);
    expect(sha256(tail)).toBe(immutableTailSha256);
  });

  it('uses the empty RED slice or exactly one plain Japanese prose sentence', () => {
    if (insertion.length === 0) {
      expect(insertionBytes).toHaveLength(0);
      return;
    }

    expect(insertion).toMatch(/^[^。\r\n]+。$/u);
    expect(insertion.trim()).toBe(insertion);
    expect(insertion).toMatch(/[\u3040-\u30ff\u3400-\u9fff]/u);
  });

  it('requires the head-office and Taiwan-branch caution with every transaction and treatment category', () => {
    expect(insertion).not.toHaveLength(0);
    expect(insertion).toMatch(
      /(?:本店|本社)[^。]*(?:台湾支店|台湾にある支店)|(?:台湾支店|台湾にある支店)[^。]*(?:本店|本社)/u,
    );
    expect(insertion).toMatch(/資金(?:の)?移動|資金移動/u);
    expect(insertion).toMatch(/利益(?:の)?送金|利益送金/u);
    expect(insertion).toMatch(
      /会計(?:上)?(?:の)?(?:処理|取扱い|取り扱い|扱い)|会計[・、／/](?:および|及び)?税務/u,
    );
    expect(insertion).toMatch(/税務(?:上)?(?:の)?(?:処理|取扱い|取り扱い|扱い)/u);
    expect(insertion).toMatch(
      /子会社[^。]*配当[^。]*(?:構造|仕組み|スキーム)|(?:構造|仕組み|スキーム)[^。]*子会社[^。]*配当/u,
    );
    expect(insertion).toMatch(
      /(?:同じ|同一|等しい)[^。]*(?:考え|みな|見な|扱|判断|理解|同一視)[^。]*(?:べきでは|ことはでき|とは限ら|てはなら|てはいけ)/u,
    );
  });

  it('rejects prohibited structure, additions, Hangul, and malformed copy within the insertion', () => {
    expect(insertion).not.toMatch(/^(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/u);
    expect(insertion).not.toMatch(/!?\[[^\r\n]*\]\([^)\r\n]*\)|<[^>\r\n]+>/u);
    expect(insertion).not.toMatch(/[*_~`]{1,3}|\[\^[^\]\r\n]+\]/u);
    expect(insertion).not.toMatch(
      /(?:会社法|民法|商法|第\d+条|判例|裁判所|必ず同じではない|絶対に同じではない)/u,
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
      expect(insertion).not.toContain(forbidden);
    }

    expect(insertion).not.toMatch(/[\uac00-\ud7af]/u);
    expect(insertion).not.toMatch(/[\u200b\ufeff\u00a0]/u);
    expect(insertion).not.toContain('\r');
    expect(insertion).not.toContain('\n');
    expect(insertion).not.toMatch(/^[\t ]|[\t ]$/u);
  });
});
