/**
 * Country-name gate for the guidance (vi/id/th/fil) data modules.
 *
 * WO-O32 B. The column checker's `nationality` rule only reads column
 * markdown, so the guidance copy in `src/data/international-*.ts` had no
 * country gate at all — which is how four disclaimers naming the reader's own
 * country and four sentences asserting how Taiwan's `資遣費` compares with
 * another country's severance regime reached production.
 *
 * The scan itself lives in `scripts/check-guidance-country-mentions.mjs` so it
 * can also be run on its own (`node scripts/check-guidance-country-mentions.mjs`).
 * This file is what makes it fail the build.
 */

import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  GUIDANCE_COUNTRY_TOKENS,
  GUIDANCE_DATA_FILES,
  findCountryHits,
  formatReport,
  scanGuidanceCountryMentions,
} from '../../../scripts/check-guidance-country-mentions.mjs';

function writeFixture(name: string, body: string): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'guidance-country-gate-'));
  const file = path.join(dir, name);
  writeFileSync(file, body, 'utf8');
  return file;
}

/** A minimal module shaped like the real ones: `  <locale>: {` … `  },`. */
function fixtureModule(entries: Array<[locale: string, key: string, value: string]>): string {
  const body = entries
    .map(([locale, key, value]) => `  ${locale}: {\n    ${key}:\n      '${value}',\n  },`)
    .join('\n');
  return `export const fixture = {\n${body}\n};\n`;
}

describe('guidance data country-name gate', () => {
  it('reports zero violations across every guidance data module', () => {
    const result = scanGuidanceCountryMentions();
    expect(
      result.violations,
      `guidance copy must name no country but Taiwan:\n${formatReport(result)}`,
    ).toEqual([]);
  });

  it('scans all four locale blocks in every guidance data module', () => {
    const result = scanGuidanceCountryMentions();
    expect(result.scannedFiles.map((entry) => entry.file)).toEqual([...GUIDANCE_DATA_FILES]);
    // A module may export more than one per-locale record — WO-O33 added
    // `guidanceTeamBios` next to `guidanceTeamCopy` — so a file yields one
    // vi/id/th/fil cycle per record. Every record must still carry all four
    // locales, in the same order: a missing or reordered block would mean a
    // locale whose copy the country gate never reads.
    for (const entry of result.scannedFiles) {
      const cycle = ['vi', 'id', 'th', 'fil'] as const;
      expect(entry.locales.length, `${entry.file} locale blocks`).toBeGreaterThan(0);
      expect(entry.locales.length % cycle.length, `${entry.file} partial locale record`).toBe(0);
      expect(entry.locales, `${entry.file} locale blocks`).toEqual(
        entry.locales.map((_, index) => cycle[index % cycle.length]),
      );
    }
    expect(result.scannedLines).toBeGreaterThan(1000);
  });

  // The gate is only worth having if it fails. These fixtures are the eight
  // sentences WO-O32 A removed, re-expressed, plus a US-law claim per locale.
  it.each([
    ['vi', 'Nội dung này không phải ý kiến pháp lý theo pháp luật Việt Nam.', 'Việt Nam'],
    ['id', 'Isi ini bukan nasihat menurut hukum Indonesia.', 'Indonesia'],
    ['th', 'เนื้อหานี้ไม่ใช่ความเห็นตามกฎหมายไทย', 'ไทย'],
    ['fil', 'Hindi ito payo sa ilalim ng batas ng Pilipinas.', 'Pilipinas'],
    ['vi', 'Quy định này khác với pháp luật Hoa Kỳ.', 'Hoa Kỳ'],
    ['id', 'Ketentuan ini berbeda dari hukum Amerika Serikat.', 'Amerika Serikat'],
    ['th', 'หลักเกณฑ์นี้ต่างจากกฎหมายสหรัฐอเมริกา', 'สหรัฐอเมริกา'],
    ['fil', 'Iba ito sa batas ng United States.', 'United States'],
    ['vi', 'Chế độ này khác với pháp luật Thái Lan.', 'Thái Lan'],
    ['id', 'Aturan ini berbeda dari hukum Vietnam.', 'Vietnam'],
  ])('fails on a %s sentence naming another jurisdiction (%s)', (locale, sentence, token) => {
    const file = writeFixture('fixture.ts', fixtureModule([[locale, 'disclaimer', sentence]]));
    const result = scanGuidanceCountryMentions([file], '/');
    expect(result.violations.map((v) => v.token)).toContain(token);
    expect(result.violations[0].sentence).toContain(sentence);
    expect(result.violations[0].line).toBeGreaterThan(0);
    expect(formatReport(result)).toContain('FAIL guidance-country-mentions');
  });

  // Rule (1) of the allow list: a language name is not a country name.
  it.each([
    ['vi', 'Tư vấn bằng tiếng Việt, tiếng Indonesia và tiếng Thái.'],
    ['id', 'Konsultasi dilayani dalam bahasa Indonesia, bahasa Vietnam dan bahasa Thai.'],
    ['th', 'ให้บริการเป็นภาษาไทย ภาษาเวียดนาม และภาษาอินโดนีเซีย'],
    ['fil', 'Nasa wikang Filipino ang gabay, at may bersyong Filipino ang teksto.'],
  ])('passes %s language-name contexts', (locale, sentence) => {
    const file = writeFixture('fixture.ts', fixtureModule([[locale, 'note', sentence]]));
    expect(scanGuidanceCountryMentions([file], '/').violations).toEqual([]);
  });

  // Rule (3) of the allow list: Taiwan is the firm's own jurisdiction.
  it('passes sentences that name Taiwan', () => {
    const file = writeFixture(
      'fixture.ts',
      fixtureModule([
        ['vi', 'scope', 'Văn phòng hành nghề theo pháp luật Đài Loan.'],
        ['id', 'scope', 'Kantor menjalankan praktik menurut hukum Taiwan.'],
        ['th', 'scope', 'สำนักงานประกอบวิชาชีพตามกฎหมายไต้หวัน'],
        ['fil', 'scope', 'Nagpapraktis ang tanggapan sa ilalim ng batas ng Taiwan.'],
      ]),
    );
    expect(scanGuidanceCountryMentions([file], '/').violations).toEqual([]);
  });

  // Rule (2) of the allow list: Korea/Japan stay readable where the guidance
  // copy renders the English canonical statement about Wei Tseng's clients.
  // They are not detection tokens, so this is a regression guard on that
  // decision rather than an exemption bolted onto the scan.
  it('does not treat Korea or Japan as country tokens', () => {
    const tokens = Object.values(GUIDANCE_COUNTRY_TOKENS).flat().join('|');
    expect(tokens).not.toMatch(/Korea|Japan|Hàn Quốc|Nhật Bản|Jepang|เกาหลี|ญี่ปุ่น/);
    const hits = findCountryHits(
      "'Wei Tseng works with clients from Korea and Japan (曾雋崴), Korea Operations Manager.'",
    );
    expect(hits).toEqual([]);
  });

  it('covers every reader country in all four guidance languages plus English', () => {
    expect(Object.keys(GUIDANCE_COUNTRY_TOKENS).sort()).toEqual([
      'Indonesia',
      'Philippines',
      'Thailand',
      'United States',
      'Vietnam',
    ]);
    for (const [country, tokens] of Object.entries(GUIDANCE_COUNTRY_TOKENS)) {
      expect(tokens.length, `${country} needs variants in each guidance language`).toBeGreaterThanOrEqual(4);
    }
  });
});
