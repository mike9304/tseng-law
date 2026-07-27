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
const branchParagraph =
  section
    .split(/\n{2,}/u)
    .map((block) => block.trim())
    .find((block) => block.includes('本店と台湾支店との間の資金移動')) ?? '';
const insertion = branchParagraph.split('。').filter(Boolean).at(2)?.concat('。') ?? '';

describe('Japanese investment column 001 — branch transaction sentence', () => {
  it('extracts the branch caution from local section boundaries', () => {
    expect(sectionStart).toBeGreaterThanOrEqual(0);
    expect(sectionEnd).toBeGreaterThan(sectionStart);
    expect(branchParagraph).not.toHaveLength(0);
  });

  it('uses exactly one plain Japanese prose sentence', () => {
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
