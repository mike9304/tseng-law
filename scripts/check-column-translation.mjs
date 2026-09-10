#!/usr/bin/env node
/**
 * Structural isomorphism + claim-safety checker for column translations.
 *
 * Usage:
 *   node scripts/check-column-translation.mjs \
 *     --source src/content/columns/008-x.md --target <translated.md> --lang vi [--json out.json]
 *   node scripts/check-column-translation.mjs --dir src/content/columns-vi --lang vi
 *   node scripts/check-column-translation.mjs --dir … --lang vi --check nationality
 *
 * Exit 1 on any FAIL. WARN does not fail the process.
 */

import { createRequire } from 'node:module';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const matter = require('gray-matter');

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
export const repoRoot = resolve(scriptDirectory, '..');
export const DEFAULT_SOURCE_DIR = join(repoRoot, 'src/content/columns');

export const GUIDANCE_LANGS = ['vi', 'id', 'th', 'fil'];
export const HANZI_MIN = 5;
export const ENGLISH_WORD_MIN = 12;
export const ENGLISH_STOPWORD_MIN = 3;

const HANGUL_RE = /[가-힣]/;
const HAN_RE = /\p{Script=Han}/u;
const LATIN_LETTER_RE = /\p{Script=Latin}/u;
const LETTER_RE = /\p{L}/u;
const ZWSP = '\u200B';

const ENGLISH_STOPWORDS = new Set([
  'the', 'and', 'of', 'to', 'in', 'is', 'for', 'that', 'with', 'as', 'on',
  'are', 'this', 'was', 'be', 'by', 'or', 'an', 'from', 'at', 'which',
  'however', 'therefore', 'these', 'their', 'have', 'has', 'not', 'will',
  'can', 'into', 'than', 'then', 'also', 'only', 'when', 'after',
]);

/**
 * Forbidden-claim regexes per language.
 * Source: 번역 출처 브리프 6 — 광고/업무 확장 금지 묶음:
 *   {lang} 상담 가능 · 통역 제공 · 즉시 응답 · 성공률 · 비용/결과 보장.
 * Patterns are intentionally specific so ordinary legal-consultation wording
 * (tư vấn / konsultasi / ให้คำปรึกษา) does not false-positive.
 */
export const FORBIDDEN_PHRASES = {
  vi: [
    { id: 'vi-consult-lang', re: /tư\s*vấn\s+(bằng\s+)?tiếng\s*việt|tiếng\s*việt\s+(có\s+)?tư\s*vấn/i, note: 'vi 상담 가능' },
    { id: 'vi-interpreter', re: /có\s+(phiên|thông)\s*dịch|cung\s*cấp\s+(phiên|thông)\s*dịch|(phiên|thông)\s*dịch\s+(viên\s+)?(sẵn|có)/i, note: '통역 제공' },
    { id: 'vi-immediate', re: /phản\s*hồi\s+(ngay|tức\s*thì)|trả\s*lời\s+ngay|phản\s*hồi\s+trong\s+vài\s*phút/i, note: '즉시 응답' },
    { id: 'vi-success-rate', re: /tỷ\s*lệ\s+thành\s*công|tỷ\s*lệ\s+thắng|thắng\s*kiện\s+\d/i, note: '성공률' },
    { id: 'vi-win-100', re: /thắng\s*(kiện\s*)?100\s*%|100\s*%\s*thắng/i, note: '성공률 100%' },
    { id: 'vi-cost-guarantee', re: /đảm\s*bảo\s+(chi\s*phí|kết\s*quả|thắng)|cam\s*kết\s+(thắng|chi\s*phí|kết\s*quả)/i, note: '비용/결과 보장' },
    { id: 'vi-always-on', re: /tư\s*vấn\s*24\s*\/\s*7|luôn\s+sẵn\s+sàng\s+tư\s*vấn/i, note: '즉시/상시 상담' },
    { id: 'vi-free-consult', re: /tư\s*vấn\s+miễn\s*phí|miễn\s*phí\s+tư\s*vấn/i, note: '비용 보장(무료 상담)' },
  ],
  id: [
    { id: 'id-consult-lang', re: /konsultasi\s+(dalam\s+)?bahasa\s+indonesia|bahasa\s+indonesia\s+(tersedia\s+)?konsultasi/i, note: 'id 상담 가능' },
    { id: 'id-interpreter', re: /tersedia\s+(penerjemah|juru\s*bahasa)|layanan\s+(terjemahan|penerjemah)|interpreter\s+(disediakan|tersedia)/i, note: '통역 제공' },
    { id: 'id-immediate', re: /respon\s+segera|balasan\s+segera|langsung\s+dibalas|membalas\s+seketika/i, note: '즉시 응답' },
    { id: 'id-success-rate', re: /tingkat\s+keberhasilan|tingkat\s+kemenangan|menjamin\s+kemenangan/i, note: '성공률' },
    { id: 'id-win-100', re: /menang\s*100\s*%|100\s*%\s*menang/i, note: '성공률 100%' },
    { id: 'id-cost-guarantee', re: /jaminan\s+(biaya|hasil|kemenangan)|menjamin\s+(biaya|hasil)/i, note: '비용/결과 보장' },
    { id: 'id-always-on', re: /konsultasi\s*24\s*\/\s*7/i, note: '즉시/상시 상담' },
    { id: 'id-free-consult', re: /konsultasi\s+gratis|gratis\s+konsultasi/i, note: '비용 보장(무료 상담)' },
  ],
  th: [
    { id: 'th-consult-lang', re: /ให้คำปรึกษา(เป็น)?ภาษาไทย|ปรึกษา(ได้)?เป็นภาษาไทย|มีคำปรึกษาภาษาไทย/i, note: 'th 상담 가능' },
    { id: 'th-interpreter', re: /มีล่าม|บริการล่าม|บริการแปล(ภาษา)?|จัดล่าม/i, note: '통역 제공' },
    { id: 'th-immediate', re: /ตอบกลับทันที|ตอบทันที|ตอบในทันที|ตอบภายในไม่กี่นาที/i, note: '즉시 응답' },
    { id: 'th-success-rate', re: /อัตราความสำเร็จ|อัตราชนะคดี|โอกาสชนะคดี/i, note: '성공률' },
    { id: 'th-win-100', re: /ชนะ\s*100\s*%|100\s*%\s*ชนะ/i, note: '성공률 100%' },
    { id: 'th-cost-guarantee', re: /รับประกัน(ค่าใช้จ่าย|ผลลัพธ์|ชนะ)|รับประกันผล/i, note: '비용/결과 보장' },
    { id: 'th-always-on', re: /ปรึกษา\s*24\s*\/\s*7/i, note: '즉시/상시 상담' },
    { id: 'th-free-consult', re: /ปรึกษาฟรี|ให้คำปรึกษาฟรี/i, note: '비용 보장(무료 상담)' },
  ],
  fil: [
    { id: 'fil-consult-lang', re: /konsultasyon\s+sa\s+(filipino|tagalog)|filipino\s+consultation\s+available|tagalog\s+consultation\s+available/i, note: 'fil 상담 가능' },
    { id: 'fil-interpreter', re: /interpreter\s+(provided|available)|may\s+(interpreter|tagasalin)|translation\s+provided/i, note: '통역 제공' },
    { id: 'fil-immediate', re: /immediate(ly)?\s+(response|reply)|agad\s+na\s+(sagot|tugon)|instant\s+reply/i, note: '즉시 응답' },
    { id: 'fil-success-rate', re: /success\s+rate|winning\s+rate|rate\s+ng\s+tagumpay/i, note: '성공률' },
    { id: 'fil-win-100', re: /100\s*%\s*(panalo|panalo)|panalo\s*100\s*%/i, note: '성공률 100%' },
    { id: 'fil-cost-guarantee', re: /guaranteed\s+(cost|fee|result|outcome)|cost\s+guarantee|garantiya\s+sa\s+(gastos|resulta)|outcome\s+guarantee/i, note: '비용/결과 보장' },
    { id: 'fil-always-on', re: /24\s*\/\s*7\s+consult/i, note: '즉시/상시 상담' },
    { id: 'fil-free-consult', re: /libreng\s+konsultasyon|free\s+consultation/i, note: '비용 보장(무료 상담)' },
  ],
};

/** Locale-prefix swaps that are allowed; everything else must stay byte-identical to source href. */
export const ALLOWED_HREF_TRANSFORMS = [
  { id: 'columns', from: /^\/ko\/columns(\/.*)?$/, to: (lang, m) => `/${lang}/columns${m[1] ?? ''}` },
  { id: 'contact', from: /^\/ko\/contact$/, to: (lang) => `/${lang}/contact` },
  { id: 'services', from: /^\/ko\/services$/, to: (lang) => `/${lang}/services` },
  { id: 'faq', from: /^\/ko\/faq$/, to: (lang) => `/${lang}/faq` },
  { id: 'pricing', from: /^\/ko\/pricing$/, to: (lang) => `/${lang}/pricing` },
];

export const CHECK_IDS = [
  'frontmatter',
  'headings',
  'images',
  'blocks',
  'links',
  'hangul',
  'english',
  'forbidden',
  'hanzi',
  'numbers',
  'nationality',
  'langid',
];

export const DEFAULT_ADAPT_DIR = '/Users/son7/Projects/tseng-law-sea-state/columns/work';

/** Reader-nationality / country terms that must not appear unless the source block already names a country. */
export const NATIONALITY_TERMS = {
  vi: ['quốc tịch Việt Nam', 'Việt Nam', 'Việt'],
  id: ['kewarganegaraan Indonesia', 'Indonesia', 'WNI'],
  th: ['สัญชาติไทย', 'คนไทย', 'ไทย'],
  fil: ['pagkamamamayang Pilipino', 'Pilipinas', 'Pilipino', 'Filipino'],
};

export const NATIONALITY_LANGUAGE_NAMES = {
  vi: [/tiếng\s*việt/giu, /ngôn\s*ngữ\s*việt(?:\s*nam)?/giu],
  id: [/bahasa\s*indonesia/gi],
  th: [/ภาษาไทย/gu],
  fil: [/wikang\s+filipino/gi, /\bsa\s+filipino\b/gi, /filipino\s+language/gi],
};

export const SOURCE_LANGUAGE_NAME_RE = /한국어|베트남어|인도네시아어|태국어|필리핀어|영어|일본어|중국어|타이완어|대만어/g;

export const SOURCE_NATIONALITY_RE = /대한민국|한국인|한국적|한국|베트남인|베트남|인도네시아인|인도네시아|태국인|태국|필리핀인|필리핀|일본인|일본|중국인|중국|미국인|미국|국적|국민/;

/**
 * Thousand-separator convention for leftover numerals after 만/日期 consumption.
 * Ground (WO-G24 + live SEA columns): id/vi legal TWD amounts use EU/SEA dots
 * (`40.000`, `1.000.000`); th/fil use English commas (`40,000`, `1,000,000`);
 * ko uses commas plus 만/억 (`2,000만`, `1,000,000`). Prefer noise over misses.
 */
export const NUMBER_THOUSAND_STYLE = {
  ko: 'comma',
  vi: 'dot',
  id: 'dot',
  th: 'comma',
  fil: 'comma',
};

/**
 * Sino-Korean / Han unit multipliers applied on both source and target
 * (translations often keep 萬/億 inside 병기). Ground: WO-G24 examples
 * `4만`→40000, `157만`→1570000, `2,000만`→20000000; column 004 `20억` ↔
 * id `TWD 2.000.000.000`. 억 is included to avoid false FAILs on correctly
 * expanded 억 amounts; omitting it would miss less but yell more on every
 * 억 sentence — still prefer matching the unit the translator expanded.
 */
export const SINO_UNIT_MULTIPLIERS = [
  { unit: /억|億/u, factor: 100_000_000, name: 'eok' },
  { unit: /만|萬/u, factor: 10_000, name: 'man' },
];

/**
 * Frontmatter keys excluded from number extraction.
 * Ground: url/lastmod/featured_image are already byte-compared in checkFrontmatter
 * and inject path/ISO digits that are not legal quantities. read_time is
 * recomputed per language (006: ko `2분` vs vi `4 phút`) and is not a claim.
 */
export const NUMBER_SKIP_FRONTMATTER_KEYS = ['url', 'lastmod', 'featured_image', 'read_time'];

/**
 * Per-language values dropped after normalization. Empty on purpose — WO-G24
 * says prefer noise over misses. Add a cited false-positive here, not a regex
 * that swallows article numbers or fines.
 */
export const NUMBER_LANG_EXCEPTIONS = {
  ko: [],
  vi: [],
  id: [],
  th: [],
  fil: [],
};

/** Thai พ.ศ. year minus this offset is Gregorian. ค.ศ. is already Gregorian. */
export const THAI_BUDDHIST_ERA_OFFSET = 543;

/**
 * Large-unit words that multiply a preceding digit/decimal (`1.57 milyon` → 1570000).
 * Longer spellings first (milyong before milyon). Isolated unit with no coefficient
 * is NOT a value — leftover hits become 수사 미해석 WARN.
 */
export const MAGNITUDE_WORDS = {
  ko: [],
  vi: [
    { word: 'tỷ', factor: 1_000_000_000 },
    { word: 'triệu', factor: 1_000_000 },
    { word: 'nghìn', factor: 1_000 },
    { word: 'ngàn', factor: 1_000 },
    { word: 'trăm', factor: 100 },
  ],
  id: [
    { word: 'miliar', factor: 1_000_000_000 },
    { word: 'juta', factor: 1_000_000 },
    { word: 'ribu', factor: 1_000 },
    { word: 'ratus', factor: 100 },
  ],
  th: [
    { word: 'ล้าน', factor: 1_000_000 },
    { word: 'แสน', factor: 100_000 },
    { word: 'หมื่น', factor: 10_000 },
    { word: 'พัน', factor: 1_000 },
    { word: 'ร้อย', factor: 100 },
  ],
  fil: [
    { word: 'bilyon', factor: 1_000_000_000 },
    { word: 'milyong', factor: 1_000_000 },
    { word: 'milyon', factor: 1_000_000 },
    { word: 'libong', factor: 1_000 },
    { word: 'libo', factor: 1_000 },
    { word: 'daan', factor: 100 },
  ],
};

/** Approximation markers: do not emit a number; the adjacent numeral still does. */
export const APPROX_MARKERS = {
  ko: ['약', '여', '남짓', '가량', '정도'],
  vi: ['khoảng', 'xấp xỉ', 'gần', 'khoảng chừng'],
  id: ['sekitar', 'kira-kira', 'kurang lebih', 'hampir'],
  th: ['ประมาณ', 'ราว', 'ประมาณว่า'],
  fil: ['humigit-kumulang', 'halos', 'mga'],
};

/**
 * Leftover morphology that looks like a numeral construction we failed to reduce.
 * Applied only after dictionary consumption so known spellings do not warn.
 */
export const UNPARSED_NUMERAL_HINTS = {
  vi: /(?:[A-Za-z0-9]{2,})\s+(?:triệu|tỷ|nghìn|ngàn|trăm)\b|(?<!\p{L})mươi(?!\p{L})|(?<!\p{L})phần\s+(?:ba|hai|tư)(?!\p{L})/giu,
  id: /(?:[A-Za-z0-9]{2,})\s+(?:juta|miliar|ribu|ratus)\b|\b(?:belas|puluh|pertiga|perempat)\b/gi,
  th: /(?:[A-Za-z0-9]+)\s*(?:ล้าน|แสน|หมื่น|พัน|ร้อย)(?![\u0E00-\u0E7F])/gu,
  fil: /(?:[A-Za-z0-9]{2,})\s+milyon(?:g)?\b|\b(?:bilyon|katlo|labing-?\w+)\b/gi,
};

function pushPhrase(entries, phrase, values) {
  const normalized = String(phrase).normalize('NFC').trim();
  if (!normalized || !values.length) return;
  entries.push({ phrase: normalized, values: values.slice() });
}

function compilePhrases(entries) {
  const seen = new Set();
  const out = [];
  const sorted = entries.slice().sort((a, b) => {
    const byLen = b.phrase.length - a.phrase.length;
    if (byLen) return byLen;
    const byWords = (b.phrase.match(/\s+/g) || []).length - (a.phrase.match(/\s+/g) || []).length;
    if (byWords) return byWords;
    return a.phrase.localeCompare(b.phrase);
  });
  for (const entry of sorted) {
    if (seen.has(entry.phrase)) continue;
    seen.add(entry.phrase);
    const escaped = entry.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const thai = /[\u0E00-\u0E7F]/.test(entry.phrase);
    const re = thai ? new RegExp(escaped, 'gu') : new RegExp(`\\b${escaped}\\b`, 'giu');
    out.push({ phrase: entry.phrase, values: entry.values, re });
  }
  return out;
}

function buildViLexicon() {
  const entries = [];
  const units = ['năm', 'tháng', 'ngày', 'tuần', 'lần', 'giờ', 'người', 'cái', 'ngành', 'nghề'];
  const scales = [['tỷ', 1_000_000_000], ['triệu', 1_000_000], ['nghìn', 1_000], ['ngàn', 1_000], ['trăm', 100]];
  const atoms = [
    ['không', 0], ['một', 1], ['hai', 2], ['ba', 3], ['bốn', 4],
    ['sáu', 6], ['bảy', 7], ['tám', 8], ['chín', 9], ['mười', 10],
  ];
  pushPhrase(entries, 'hai phần ba', [2, 3]);
  pushPhrase(entries, 'một phần ba', [1, 3]);
  pushPhrase(entries, 'một phần hai', [1, 2]);
  pushPhrase(entries, 'hai phần tư', [2, 4]);
  pushPhrase(entries, 'một nửa', [1, 2]);
  const teens = ['một', 'hai', 'ba', 'bốn', 'lăm', 'sáu', 'bảy', 'tám', 'chín'];
  teens.forEach((word, i) => {
    const n = i === 4 ? 15 : 11 + i;
    if (i === 4) pushPhrase(entries, 'mười lăm', [15]);
    else pushPhrase(entries, `mười ${word}`, [n]);
  });
  const tens = [
    ['hai mươi', 20], ['ba mươi', 30], ['bốn mươi', 40], ['năm mươi', 50],
    ['sáu mươi', 60], ['bảy mươi', 70], ['tám mươi', 80], ['chín mươi', 90],
  ];
  const ones = [
    ['mốt', 1], ['một', 1], ['hai', 2], ['ba', 3], ['bốn', 4], ['tư', 4],
    ['lăm', 5], ['năm', 5], ['sáu', 6], ['bảy', 7], ['tám', 8], ['chín', 9],
  ];
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const [o, ov] of ones) pushPhrase(entries, `${t} ${o}`, [tv + ov]);
  }
  for (const [atom, value] of [...atoms, ['năm', 5], ['lăm', 5], ['tư', 4]]) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value >= 2 && atom !== 'năm' && atom !== 'tư') pushPhrase(entries, atom, [value]);
  }
  for (const unit of units) {
    pushPhrase(entries, `một ${unit}`, [1]);
    pushPhrase(entries, `mốt ${unit}`, [1]);
    pushPhrase(entries, `năm ${unit}`, [5]);
  }
  return compilePhrases(entries);
}

function buildIdLexicon() {
  const entries = [];
  const units = ['tahun', 'bulan', 'hari', 'minggu', 'kali', 'orang', 'bidang', 'pasal', 'buah', 'item'];
  const scales = [['miliar', 1_000_000_000], ['juta', 1_000_000], ['ribu', 1_000], ['ratus', 100]];
  const atoms = [
    ['nol', 0], ['satu', 1], ['dua', 2], ['tiga', 3], ['empat', 4], ['lima', 5],
    ['enam', 6], ['tujuh', 7], ['delapan', 8], ['sembilan', 9], ['sepuluh', 10],
  ];
  pushPhrase(entries, 'dua pertiga', [2, 3]);
  pushPhrase(entries, 'dua per tiga', [2, 3]);
  pushPhrase(entries, 'sepertiga', [1, 3]);
  pushPhrase(entries, 'se per tiga', [1, 3]);
  pushPhrase(entries, 'seperempat', [1, 4]);
  pushPhrase(entries, 'tiga perempat', [3, 4]);
  pushPhrase(entries, 'setengah', [1, 2]);
  pushPhrase(entries, 'separuh', [1, 2]);
  const teenWords = ['sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  teenWords.forEach((phrase, i) => pushPhrase(entries, phrase, [11 + i]));
  const tens = [
    ['dua puluh', 20], ['tiga puluh', 30], ['empat puluh', 40], ['lima puluh', 50],
    ['enam puluh', 60], ['tujuh puluh', 70], ['delapan puluh', 80], ['sembilan puluh', 90],
  ];
  const ones = atoms.filter(([, v]) => v >= 1 && v <= 9);
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const [o, ov] of ones) pushPhrase(entries, `${t} ${o}`, [tv + ov]);
  }
  pushPhrase(entries, 'seratus', [100]);
  pushPhrase(entries, 'seribu', [1000]);
  pushPhrase(entries, 'sejuta', [1_000_000]);
  pushPhrase(entries, 'setahun', [1]);
  pushPhrase(entries, 'sebulan', [1]);
  pushPhrase(entries, 'sehari', [1]);
  pushPhrase(entries, 'seminggu', [1]);
  pushPhrase(entries, 'sekali', [1]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildThLexicon() {
  const entries = [];
  const units = ['ปี', 'เดือน', 'วัน', 'สัปดาห์', 'ครั้ง', 'คน', 'ราย', 'ข้อ'];
  const scales = [['ล้าน', 1_000_000], ['แสน', 100_000], ['หมื่น', 10_000], ['พัน', 1_000], ['ร้อย', 100]];
  const atoms = [
    ['ศูนย์', 0], ['หนึ่ง', 1], ['เอ็ด', 1], ['สอง', 2], ['สาม', 3], ['สี่', 4],
    ['ห้า', 5], ['หก', 6], ['เจ็ด', 7], ['แปด', 8], ['เก้า', 9], ['สิบ', 10],
  ];
  pushPhrase(entries, 'สองในสาม', [2, 3]);
  pushPhrase(entries, 'หนึ่งในสาม', [1, 3]);
  pushPhrase(entries, 'หนึ่งในสอง', [1, 2]);
  pushPhrase(entries, 'สามในสี่', [3, 4]);
  pushPhrase(entries, 'กึ่งหนึ่ง', [1, 2]);
  pushPhrase(entries, 'ครึ่ง', [1, 2]);
  const teenOnes = ['เอ็ด', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  teenOnes.forEach((word, i) => pushPhrase(entries, `สิบ${word}`, [11 + i]));
  const tens = [
    ['ยี่สิบ', 20], ['สามสิบ', 30], ['สี่สิบ', 40], ['ห้าสิบ', 50],
    ['หกสิบ', 60], ['เจ็ดสิบ', 70], ['แปดสิบ', 80], ['เก้าสิบ', 90],
  ];
  const ones = [['เอ็ด', 1], ['หนึ่ง', 1], ['สอง', 2], ['สาม', 3], ['สี่', 4], ['ห้า', 5], ['หก', 6], ['เจ็ด', 7], ['แปด', 8], ['เก้า', 9]];
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const [o, ov] of ones) pushPhrase(entries, `${t}${o}`, [tv + ov]);
  }
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) {
        pushPhrase(entries, `${atom}${scale}`, [value * factor]);
        pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
      }
    }
    if (value === 1) {
      for (const unit of units) {
        pushPhrase(entries, `${atom}${unit}`, [value]);
        pushPhrase(entries, `${atom} ${unit}`, [value]);
      }
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function filForms(stem) {
  const forms = new Set([stem]);
  if (/[aeiou]$/i.test(stem) || /n$/i.test(stem)) {
    forms.add(`${stem}ng`);
    if (/n$/i.test(stem)) forms.add(`${stem}g`);
  } else {
    forms.add(`${stem} na`);
  }
  return [...forms];
}

function buildFilLexicon() {
  const entries = [];
  const units = ['taon', 'buwan', 'araw', 'linggo', 'beses', 'tao', 'uri', 'item', 'araw'];
  const scales = [['bilyon', 1_000_000_000], ['milyong', 1_000_000], ['milyon', 1_000_000], ['libo', 1_000], ['daan', 100]];
  const atomPairs = [
    ['isa', 1], ['dalawa', 2], ['tatlo', 3], ['apat', 4], ['lima', 5],
    ['anim', 6], ['pito', 7], ['walo', 8], ['siyam', 9], ['sampu', 10],
  ];
  pushPhrase(entries, 'dalawang katlo', [2, 3]);
  pushPhrase(entries, 'dalawa katlo', [2, 3]);
  pushPhrase(entries, 'ikatlo', [1, 3]);
  pushPhrase(entries, 'isang ikatlo', [1, 3]);
  pushPhrase(entries, 'isang katlo', [1, 3]);
  pushPhrase(entries, 'tig-isang katlo', [1, 3]);
  pushPhrase(entries, 'kalahati', [1, 2]);
  const teens = [
    ['labing-isa', 11], ['labing isa', 11], ['labingisa', 11],
    ['labindalawa', 12], ['labin dalawa', 12],
    ['labintatlo', 13], ['labin tatlo', 13],
    ['labing-apat', 14], ['labing apat', 14],
    ['labinlima', 15], ['labin lima', 15],
    ['labing-anim', 16], ['labing anim', 16],
    ['labimpito', 17], ['labin pito', 17],
    ['labingwalo', 18], ['labing-walo', 18], ['labing walo', 18],
    ['labinsiyam', 19], ['labin siyam', 19],
  ];
  for (const [phrase, value] of teens) {
    for (const form of filForms(phrase)) pushPhrase(entries, form, [value]);
    pushPhrase(entries, phrase, [value]);
  }
  const tens = [
    ['dalawampu', 20], ['tatlumpu', 30], ['apatnapu', 40], ['limampu', 50],
    ['animnapu', 60], ['pitumpu', 70], ['walumpu', 80], ['siyamnapu', 90],
  ];
  const ones = atomPairs.filter(([, v]) => v >= 1 && v <= 9);
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const form of filForms(t)) pushPhrase(entries, form, [tv]);
    for (const [o, ov] of ones) {
      pushPhrase(entries, `${t}'t ${o}`, [tv + ov]);
      pushPhrase(entries, `${t}t ${o}`, [tv + ov]);
      pushPhrase(entries, `${t} ${o}`, [tv + ov]);
    }
  }
  pushPhrase(entries, 'isandaan', [100]);
  pushPhrase(entries, 'isanlibo', [1000]);
  for (const [atom, value] of atomPairs) {
    const forms = filForms(atom);
    if (value >= 1) {
      for (const form of forms) {
        for (const [scale, factor] of scales) pushPhrase(entries, `${form} ${scale}`, [value * factor]);
      }
    }
    if (value === 1) {
      for (const form of forms) {
        for (const unit of units) pushPhrase(entries, `${form} ${unit}`, [value]);
      }
    }
    // Unlike vi/id/th, Filipino needs the bare 1 forms (`isa`, `isang`) in the
    // dictionary: `isang` is the normal way to write "one <noun>" for any noun,
    // including untranslated English ones outside `units` (`isang small truck`
    // = 소형 화물차 1대), and `isa` stands alone as "one" (`isa pataas` = 1명
    // 이상). `isang` doubles as the indefinite article, so the cost is an
    // occasional spurious 1 on the target side, which surfaces as a WARN
    // ("extra in translation"); a number that is missing from the target still
    // FAILs, because that comparison runs the other way.
    if (value >= 1) {
      for (const form of forms) pushPhrase(entries, form, [value]);
    }
  }
  return compilePhrases(entries);
}

export const WORD_NUMERAL_LEXICONS = {
  vi: buildViLexicon(),
  id: buildIdLexicon(),
  th: buildThLexicon(),
  fil: buildFilLexicon(),
};

export function lexiconEntryCount(lang) {
  return (WORD_NUMERAL_LEXICONS[lang] ?? []).length;
}

/**
 * Month name → 1..12. Longest keys must be matched first (built in
 * `monthNamePattern`). Mixes en/id/vi-not-used/th/fil because date_display is
 * localized (`2025년 9월 13일` / `13 September 2025` / `13 กันยายน ค.ศ. 2025`).
 */
export const DATE_MONTH_NAMES = {
  january: 1, jan: 1, januari: 1, enero: 1, 'มกราคม': 1, 'ม.ค.': 1,
  february: 2, feb: 2, februari: 2, pebrero: 2, 'กุมภาพันธ์': 2, 'ก.พ.': 2,
  march: 3, mar: 3, maret: 3, marso: 3, 'มีนาคม': 3, 'มี.ค.': 3,
  april: 4, apr: 4, abril: 4, 'เมษายน': 4, 'เม.ย.': 4,
  may: 5, mei: 5, mayo: 5, 'พฤษภาคม': 5, 'พ.ค.': 5,
  june: 6, jun: 6, juni: 6, hunyo: 6, 'มิถุนายน': 6, 'มิ.ย.': 6,
  july: 7, jul: 7, juli: 7, hulyo: 7, 'กรกฎาคม': 7, 'ก.ค.': 7,
  august: 8, aug: 8, agustus: 8, agosto: 8, 'สิงหาคม': 8, 'ส.ค.': 8,
  september: 9, sept: 9, sep: 9, setyembre: 9, 'กันยายน': 9, 'ก.ย.': 9,
  october: 10, oct: 10, oktober: 10, oktubre: 10, 'ตุลาคม': 10, 'ต.ค.': 10,
  november: 11, nov: 11, nobyembre: 11, 'พฤศจิกายน': 11, 'พ.ย.': 11,
  december: 12, dec: 12, desember: 12, disyembre: 12, 'ธันวาคม': 12, 'ธ.ค.': 12,
};

export function parseArgs(argv) {
  const out = {
    source: null,
    target: null,
    lang: null,
    dir: null,
    json: null,
    check: null,
    adaptDir: DEFAULT_ADAPT_DIR,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const take = () => {
      const value = argv[i + 1];
      if (value == null || value.startsWith('--')) {
        throw new Error(`${arg} requires a value`);
      }
      i += 1;
      return value;
    };
    if (arg === '--source') out.source = take();
    else if (arg === '--target') out.target = take();
    else if (arg === '--lang') out.lang = take();
    else if (arg === '--dir') out.dir = take();
    else if (arg === '--json') out.json = take();
    else if (arg === '--adapt-dir') out.adaptDir = take();
    else if (arg === '--check') {
      const value = take();
      out.check = out.check ?? [];
      for (const id of value.split(',').map((item) => item.trim()).filter(Boolean)) {
        if (!CHECK_IDS.includes(id)) throw new Error(`unknown check: ${id}`);
        out.check.push(id);
      }
    } else throw new Error(`unknown argument: ${arg}`);
  }
  if (!out.lang) throw new Error('--lang is required');
  if (out.dir) {
    if (out.target) throw new Error('--dir cannot be combined with --target');
  } else if (!out.source || !out.target) {
    throw new Error('either --source and --target, or --dir, is required');
  }
  return out;
}

export function parseMarkdown(raw) {
  const parsed = matter(raw);
  const data = parsed.data && typeof parsed.data === 'object' ? parsed.data : {};
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const rawMatter = fmMatch ? fmMatch[1] : '';
  const body = parsed.content ?? '';
  const bodyStartLine = fmMatch ? fmMatch[0].split(/\r?\n/).length : 1;
  return { data, rawMatter, body, bodyStartLine };
}

export function topLevelYamlKeys(rawMatter) {
  const keys = [];
  for (const line of rawMatter.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):/);
    if (match) keys.push(match[1]);
  }
  return keys;
}

export function rawYamlValue(rawMatter, key) {
  const prefix = `${key}:`;
  for (const line of rawMatter.split('\n')) {
    if (line.startsWith(prefix)) return line.slice(prefix.length).trim();
  }
  return undefined;
}

function faqItems(data) {
  return Array.isArray(data.faq) ? data.faq : [];
}

export function headingLevels(body) {
  const levels = [];
  for (const line of body.split('\n')) {
    const match = line.match(/^(#{1,6})\s+\S/);
    if (match) levels.push(match[1].length);
  }
  return levels;
}

export function extractImages(body) {
  const paths = [];
  const re = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(body)) !== null) {
    paths.push(match[2].trim());
  }
  return paths;
}

export function extractLinks(body) {
  const hrefs = [];
  const re = /(!)?\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(body)) !== null) {
    if (match[1] === '!') continue;
    hrefs.push(match[3].trim());
  }
  return hrefs;
}

export function nonEmptyBlocks(body) {
  return body
    .split(/\n[ \t]*\n/)
    .map((block) => block.replace(/\s+$/u, ''))
    .filter((block) => block.replace(/[ \t]/g, '').length > 0);
}

export function countZwsp(text) {
  return [...text].filter((ch) => ch === ZWSP).length;
}

export function countTableRows(body) {
  return body.split('\n').filter((line) => /^\s*\|/.test(line)).length;
}

export function countQuoteBlocks(body) {
  let count = 0;
  let inQuote = false;
  for (const line of body.split('\n')) {
    if (/^\s*>/.test(line)) {
      if (!inQuote) {
        count += 1;
        inQuote = true;
      }
    } else {
      inQuote = false;
    }
  }
  return count;
}

export function countListItems(body) {
  return body.split('\n').filter((line) => /^\s*(?:[-*+]|\d+\.)\s+\S/.test(line)).length;
}

export function swapAllowedHref(href, lang) {
  for (const rule of ALLOWED_HREF_TRANSFORMS) {
    const match = href.match(rule.from);
    if (match) return rule.to(lang, match);
  }
  return href;
}

export function isIllegalLocaleServicePath(href, lang) {
  return new RegExp(`^/${lang}/services/.+`).test(href);
}

function canonicalHrefSet(hrefs, lang) {
  return new Set(hrefs.map((href) => swapAllowedHref(href, lang)));
}

function sortedSet(set) {
  return [...set].sort();
}

export function findHangulHits(urlValue, body, bodyStartLine) {
  const hits = [];
  // frontmatter `url` must stay byte-identical to the source (check a), so a
  // Korean slug there is expected and is NOT a residual-Hangul defect.
  void urlValue;
  const lines = body.split('\n');
  lines.forEach((line, index) => {
    if (HANGUL_RE.test(line)) {
      hits.push({ line: bodyStartLine + index, text: line });
    }
  });
  return hits;
}

function latinOnlyLetters(text) {
  const letters = [...text].filter((ch) => LETTER_RE.test(ch));
  if (letters.length === 0) return false;
  return letters.every((ch) => LATIN_LETTER_RE.test(ch));
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function englishStopwordCount(text) {
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.toLowerCase().replace(/[^a-z']/g, ''))
    .filter((word) => ENGLISH_STOPWORDS.has(word)).length;
}

export function findEnglishSentences(body, bodyStartLine) {
  const hits = [];
  const lines = body.split('\n');
  const chunks = [];
  let buf = '';
  let startLine = bodyStartLine;

  const flush = (endLine) => {
    const text = buf.trim();
    if (text) chunks.push({ text, line: startLine, endLine });
    buf = '';
  };

  lines.forEach((line, index) => {
    const fileLine = bodyStartLine + index;
    if (line.trim() === '') {
      flush(fileLine - 1);
      startLine = fileLine + 1;
      return;
    }
    if (!buf) startLine = fileLine;
    buf = buf ? `${buf} ${line}` : line;
    const parts = buf.split(/(?<=[.!?。！？])\s+/);
    if (parts.length > 1) {
      for (let i = 0; i < parts.length - 1; i += 1) {
        chunks.push({ text: parts[i].trim(), line: startLine, endLine: fileLine });
      }
      buf = parts[parts.length - 1];
      startLine = fileLine;
    }
  });
  flush(bodyStartLine + lines.length - 1);

  for (const chunk of chunks) {
    if (wordCount(chunk.text) < ENGLISH_WORD_MIN) continue;
    if (!latinOnlyLetters(chunk.text)) continue;
    if (englishStopwordCount(chunk.text) < ENGLISH_STOPWORD_MIN) continue;
    hits.push(chunk);
  }
  return hits;
}

export function findForbiddenHits(body, lang, bodyStartLine) {
  const patterns = FORBIDDEN_PHRASES[lang] ?? [];
  const hits = [];
  const lines = body.split('\n');
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      if (pattern.re.test(line)) {
        hits.push({
          line: bodyStartLine + index,
          id: pattern.id,
          note: pattern.note,
          text: line,
        });
      }
    }
  });
  return hits;
}

export function countHanzi(body) {
  return [...body].filter((ch) => HAN_RE.test(ch)).length;
}

const FULLWIDTH_DIGIT_RE = /[０-９]/g;
const THAI_DIGIT_RE = /[๐-๙]/g;

function foldDigits(text) {
  return String(text)
    .normalize('NFC')
    .replace(FULLWIDTH_DIGIT_RE, (ch) => String(ch.codePointAt(0) - 0xFF10))
    .replace(THAI_DIGIT_RE, (ch) => String(ch.codePointAt(0) - 0x0E50));
}

function translatableText(parsed) {
  const skip = new Set(NUMBER_SKIP_FRONTMATTER_KEYS);
  const parts = [];
  const data = parsed.data && typeof parsed.data === 'object' ? parsed.data : {};
  for (const [key, value] of Object.entries(data)) {
    if (skip.has(key) || key === 'faq' || key === 'categories') continue;
    if (typeof value === 'string') parts.push(value);
  }
  for (const item of faqItems(data)) {
    if (item && typeof item.q === 'string') parts.push(item.q);
    if (item && typeof item.a === 'string') parts.push(item.a);
  }
  parts.push(parsed.body ?? '');
  return parts.join('\n');
}

function stripStructuralNoise(text) {
  let s = String(text);
  s = s.replace(/!\[[^\]]*\]\([^)]+\)/g, (match) => {
    const alt = match.match(/^!\[([^\]]*)\]/);
    return alt ? alt[1] : ' ';
  });
  s = s.replace(/(?<!!)\[([^\]]*)\]\([^)]+\)/g, '$1');
  s = s.replace(/\bhttps?:\/\/[^\s)]+/gi, ' ');
  s = s.replace(/\bwww\.[^\s)]+/gi, ' ');
  s = s.replace(/(^|\n)[ \t]*\d+\.[ \t]+/g, '$1');
  return s;
}

function isInHanzi(text, start, end) {
  const left = text.slice(Math.max(0, start - 4), start);
  const right = text.slice(end, Math.min(text.length, end + 4));
  if (HAN_RE.test(left) || HAN_RE.test(right)) return true;
  const open = Math.max(text.lastIndexOf('(', start), text.lastIndexOf('（', start));
  if (open < 0) return false;
  const closeCandidates = [text.indexOf(')', start), text.indexOf('）', start)]
    .filter((index) => index >= end);
  if (closeCandidates.length === 0) return false;
  const inner = text.slice(open, Math.min(...closeCandidates) + 1);
  return HAN_RE.test(inner);
}

function monthNamePattern() {
  const names = Object.keys(DATE_MONTH_NAMES).sort((a, b) => b.length - a.length);
  const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`(?:${escaped.join('|')})`, 'giu');
}

let CACHED_MONTH_RE;
function monthNameRe() {
  if (!CACHED_MONTH_RE) CACHED_MONTH_RE = monthNamePattern();
  return CACHED_MONTH_RE;
}

function monthNumber(name) {
  return DATE_MONTH_NAMES[name.toLowerCase()] ?? DATE_MONTH_NAMES[name] ?? null;
}

function parseGroupedInteger(raw) {
  const digits = String(raw).replace(/[.,\s]/g, '');
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : null;
}

function pushToken(tokens, value, inHanzi, lang) {
  if (value == null || !Number.isFinite(value)) return;
  const exceptions = NUMBER_LANG_EXCEPTIONS[lang] ?? [];
  if (exceptions.includes(value)) return;
  tokens.push({ value, inHanzi: Boolean(inHanzi) });
}

function blankReplace(str, re, handler) {
  const flags = re.global ? re.flags : `${re.flags}g`;
  const globalRe = new RegExp(re.source, flags);
  return str.replace(globalRe, (...args) => {
    const match = args[0];
    const offset = args[args.length - 2];
    const groups = args.slice(1, -2);
    const keep = handler(match, groups, offset);
    if (keep === false) return match;
    return ' '.repeat(match.length);
  });
}

function parseScaleCoefficient(raw) {
  const grouped = String(raw).match(/^(\d{1,3}(?:[.,]\d{3})+)(?:[.,](\d{1,2}))?$/);
  if (grouped) {
    const n = Number.parseInt(grouped[1].replace(/[.,]/g, ''), 10);
    if (!Number.isFinite(n)) return null;
    if (grouped[2]) return n + Number.parseInt(grouped[2], 10) / 10 ** grouped[2].length;
    return n;
  }
  const dec = String(raw).match(/^(\d+)[.,](\d{1,2})$/);
  if (dec) {
    return Number.parseInt(dec[1], 10) + Number.parseInt(dec[2], 10) / 10 ** dec[2].length;
  }
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

function magnitudePattern(lang) {
  const words = MAGNITUDE_WORDS[lang] ?? [];
  if (!words.length) return null;
  const body = words
    .slice()
    .sort((a, b) => b.word.length - a.word.length)
    .map((item) => item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const thai = lang === 'th';
  const unit = thai ? `(?:${body})` : `(?:${body})\\b`;
  const coeff = '(\\d{1,3}(?:[.,]\\d{3})+|\\d+[.,]\\d{1,2}|\\d+)';
  return {
    re: new RegExp(`${coeff}\\s*${unit}`, thai ? 'gu' : 'giu'),
    factors: new Map(words.map((item) => [item.word.toLowerCase(), item.factor])),
  };
}

function collectUnparsedNumerals(s, lang) {
  const hint = UNPARSED_NUMERAL_HINTS[lang];
  if (!hint) return [];
  const flags = hint.global ? hint.flags : `${hint.flags}g`;
  const re = new RegExp(hint.source, flags);
  const found = [];
  const seen = new Set();
  let match;
  while ((match = re.exec(s)) !== null) {
    if (!match[0].trim()) continue;
    const start = Math.max(0, match.index - 16);
    const end = Math.min(s.length, match.index + match[0].length + 16);
    const snippet = s.slice(start, end).replace(/\s+/g, ' ').trim().slice(0, 80);
    if (!snippet || seen.has(snippet)) continue;
    seen.add(snippet);
    found.push(snippet);
  }
  return found;
}

export function analyzeNumbers(text, lang = 'ko') {
  const tokens = [];
  const unparsed = [];
  let s = foldDigits(stripStructuralNoise(text));
  const style = NUMBER_THOUSAND_STYLE[lang] ?? 'comma';

  const consumeValues = (match, offset, values) => {
    const inHanzi = isInHanzi(s, offset, offset + match.length);
    for (const value of values) {
      const rounded = typeof value === 'number' && !Number.isInteger(value) && Math.abs(value) >= 1000
        ? Math.round(value)
        : value;
      pushToken(tokens, rounded, inHanzi, lang);
    }
  };

  const day = '(?:3[01]|[12]\\d|0?[1-9])';
  const mon = '(?:1[0-2]|0?[1-9])';

  s = blankReplace(s, new RegExp(`\\b((?:19|20)\\d{2})[-/.](${mon})[-/.](${day})\\b`, 'g'), (match, groups, offset) => {
    consumeValues(match, offset, [
      Number.parseInt(groups[0], 10),
      Number.parseInt(groups[1], 10),
      Number.parseInt(groups[2], 10),
    ]);
  });

  s = blankReplace(s, new RegExp(`((?:19|20)\\d{2})\\s*년\\s*(${mon})\\s*월\\s*(${day})\\s*일`, 'g'), (match, groups, offset) => {
    consumeValues(match, offset, [
      Number.parseInt(groups[0], 10),
      Number.parseInt(groups[1], 10),
      Number.parseInt(groups[2], 10),
    ]);
  });

  s = blankReplace(s, new RegExp(`ngày\\s*(${day})\\s*tháng\\s*(${mon})\\s*năm\\s*((?:19|20)\\d{2})`, 'gi'), (match, groups, offset) => {
    consumeValues(match, offset, [
      Number.parseInt(groups[0], 10),
      Number.parseInt(groups[1], 10),
      Number.parseInt(groups[2], 10),
    ]);
  });

  s = blankReplace(s, new RegExp(`tháng\\s*(${mon})\\s*năm\\s*((?:19|20)\\d{2})`, 'gi'), (match, groups, offset) => {
    consumeValues(match, offset, [
      Number.parseInt(groups[0], 10),
      Number.parseInt(groups[1], 10),
    ]);
  });

  const month = monthNameRe().source;
  s = blankReplace(s, new RegExp(`(${day})\\s+(${month})\\s+(?:ค\\.ศ\\.\\s*|พ\\.ศ\\.\\s*)?((?:19|20)\\d{2}|25\\d{2})`, 'giu'), (match, groups, offset) => {
    const monthN = monthNumber(groups[1]);
    if (!monthN) return false;
    let year = Number.parseInt(groups[2], 10);
    if (/พ\.ศ\./.test(match) || year >= 2400) year -= THAI_BUDDHIST_ERA_OFFSET;
    consumeValues(match, offset, [Number.parseInt(groups[0], 10), monthN, year]);
  });

  s = blankReplace(s, new RegExp(`(${month})\\.?\\s+(${day})(?:,)?\\s+((?:19|20)\\d{2})`, 'giu'), (match, groups, offset) => {
    const monthN = monthNumber(groups[0]);
    if (!monthN) return false;
    consumeValues(match, offset, [monthN, Number.parseInt(groups[1], 10), Number.parseInt(groups[2], 10)]);
  });

  s = blankReplace(s, new RegExp(`(${month})\\.?\\s+(${day})(?!\\s*(?:19|20)\\d{2})`, 'giu'), (match, groups, offset) => {
    const monthN = monthNumber(groups[0]);
    if (!monthN) return false;
    consumeValues(match, offset, [monthN, Number.parseInt(groups[1], 10)]);
  });

  for (const { unit, factor } of SINO_UNIT_MULTIPLIERS) {
    const unitSrc = unit.source;
    const re = new RegExp(`(\\d{1,3}(?:[.,]\\d{3})+|\\d+)\\s*(?:${unitSrc})`, 'gu');
    s = blankReplace(s, re, (match, groups, offset) => {
      const coeff = parseGroupedInteger(groups[0]);
      if (coeff == null) return false;
      consumeValues(match, offset, [coeff * factor]);
    });
  }

  const magnitude = magnitudePattern(lang);
  if (magnitude) {
    s = blankReplace(s, magnitude.re, (match, groups, offset) => {
      const coeff = parseScaleCoefficient(groups[0]);
      if (coeff == null) return false;
      const unitRaw = match.slice(groups[0].length).trim().toLowerCase();
      const factor = magnitude.factors.get(unitRaw);
      if (!factor) return false;
      consumeValues(match, offset, [coeff * factor]);
    });
  }

  const parseGroupedToken = (match, offset) => {
    const tail = match.match(/^(\d{1,3}(?:[.,]\d{3})+)(?:[.,](\d{1,2}))?$/);
    if (!tail) return false;
    const n = Number.parseInt(tail[1].replace(/[.,]/g, ''), 10);
    const frac = tail[2];
    consumeValues(match, offset, [frac ? n + Number.parseInt(frac, 10) / 10 ** frac.length : n]);
  };
  const groupedDot = /\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?/g;
  const groupedComma = /\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?/g;
  const ordered = style === 'dot' ? [groupedDot, groupedComma] : [groupedComma, groupedDot];
  for (const re of ordered) {
    s = blankReplace(s, re, (match, _groups, offset) => parseGroupedToken(match, offset));
  }
  s = blankReplace(s, /\d+[.,]\d{1,2}(?!\d)/g, (match, _groups, offset) => {
    consumeValues(match, offset, [Number.parseFloat(match.replace(',', '.'))]);
  });

  s = blankReplace(s, /\d+/g, (match, _groups, offset) => {
    consumeValues(match, offset, [Number.parseInt(match, 10)]);
  });

  for (const entry of WORD_NUMERAL_LEXICONS[lang] ?? []) {
    s = blankReplace(s, entry.re, (match, _groups, offset) => {
      consumeValues(match, offset, entry.values);
    });
  }

  unparsed.push(...collectUnparsedNumerals(s, lang));
  return { tokens, unparsed };
}

export function extractNormalizedNumbers(text, lang = 'ko') {
  return analyzeNumbers(text, lang).tokens;
}

function countMap(tokens) {
  const map = new Map();
  for (const token of tokens) {
    map.set(token.value, (map.get(token.value) ?? 0) + 1);
  }
  return map;
}

function collapseHanziDupes(sourceCounts, targetTokens) {
  const grouped = new Map();
  for (const token of targetTokens) {
    const bucket = grouped.get(token.value) ?? { hanzi: 0, other: 0 };
    if (token.inHanzi) bucket.hanzi += 1;
    else bucket.other += 1;
    grouped.set(token.value, bucket);
  }
  const result = new Map();
  for (const key of new Set([...sourceCounts.keys(), ...grouped.keys()])) {
    const sourceN = sourceCounts.get(key) ?? 0;
    const bucket = grouped.get(key) ?? { hanzi: 0, other: 0 };
    let count = bucket.other + bucket.hanzi;
    if (count > sourceN && bucket.hanzi > 0 && sourceN > 0) {
      count = Math.max(sourceN, bucket.other);
    }
    result.set(key, count);
  }
  return result;
}

function formatNumberDiff(items) {
  return items
    .sort((a, b) => a.value - b.value)
    .map((item) => (item.count > 1 ? `${item.value}×${item.count}` : String(item.value)))
    .join(', ');
}

function pass(id, details = []) {
  return { id, status: 'PASS', details };
}

function fail(id, details) {
  return { id, status: 'FAIL', details };
}

function warn(id, details) {
  return { id, status: 'WARN', details };
}

export function checkFrontmatter(source, target) {
  const details = [];
  const sourceKeys = topLevelYamlKeys(source.rawMatter);
  const targetKeys = topLevelYamlKeys(target.rawMatter);
  if (JSON.stringify(sourceKeys) !== JSON.stringify(targetKeys)) {
    details.push(`keys/order source=[${sourceKeys.join(', ')}] target=[${targetKeys.join(', ')}]`);
  }

  for (const key of ['url', 'lastmod', 'featured_image']) {
    const sourceValue = rawYamlValue(source.rawMatter, key);
    const targetValue = rawYamlValue(target.rawMatter, key);
    if (sourceValue !== targetValue) {
      details.push(`${key} bytes differ: source=${JSON.stringify(sourceValue)} target=${JSON.stringify(targetValue)}`);
    }
  }

  const sourceFaq = faqItems(source.data);
  const targetFaq = faqItems(target.data);
  if (sourceFaq.length !== targetFaq.length) {
    details.push(`faq count ${sourceFaq.length} → ${targetFaq.length}`);
  }
  targetFaq.forEach((item, index) => {
    const q = item && typeof item.q === 'string' ? item.q.trim() : '';
    const a = item && typeof item.a === 'string' ? item.a.trim() : '';
    if (!q || !a) details.push(`faq[${index}] empty q/a`);
  });

  return details.length ? fail('frontmatter', details) : pass('frontmatter');
}

export function checkHeadings(source, target) {
  const sourceLevels = headingLevels(source.body);
  const targetLevels = headingLevels(target.body);
  const details = [];
  if (JSON.stringify(sourceLevels) !== JSON.stringify(targetLevels)) {
    details.push(`levels source=[${sourceLevels.join(',')}] target=[${targetLevels.join(',')}]`);
  }
  const h1 = targetLevels.filter((level) => level === 1).length;
  if (h1 !== 1) details.push(`H1 count ${h1} (expected 1)`);
  return details.length ? fail('headings', details) : pass('headings', [`levels=[${targetLevels.join(',')}]`]);
}

export function checkImages(source, target) {
  const sourcePaths = extractImages(source.body);
  const targetPaths = extractImages(target.body);
  const details = [];
  if (sourcePaths.length !== targetPaths.length) {
    details.push(`count ${sourcePaths.length} → ${targetPaths.length}`);
  }
  const sourceSet = new Set(sourcePaths);
  const targetSet = new Set(targetPaths);
  for (const path of sourceSet) {
    if (!targetSet.has(path)) details.push(`missing ${path}`);
  }
  for (const path of targetSet) {
    if (!sourceSet.has(path)) details.push(`extra ${path}`);
  }
  return details.length ? fail('images', details) : pass('images', [`count=${targetPaths.length}`]);
}

export function checkBlocks(source, target) {
  const details = [];
  const sourceBlocks = nonEmptyBlocks(source.body).length;
  const targetBlocks = nonEmptyBlocks(target.body).length;
  if (sourceBlocks !== targetBlocks) details.push(`blocks ${sourceBlocks} → ${targetBlocks}`);

  const sourceTable = countTableRows(source.body);
  const targetTable = countTableRows(target.body);
  if (sourceTable !== targetTable) details.push(`table rows ${sourceTable} → ${targetTable}`);

  const sourceQuotes = countQuoteBlocks(source.body);
  const targetQuotes = countQuoteBlocks(target.body);
  if (sourceQuotes !== targetQuotes) details.push(`quote blocks ${sourceQuotes} → ${targetQuotes}`);

  const sourceLists = countListItems(source.body);
  const targetLists = countListItems(target.body);
  if (sourceLists !== targetLists) details.push(`list items ${sourceLists} → ${targetLists}`);

  const sourceZwsp = countZwsp(source.body);
  const targetZwsp = countZwsp(target.body);
  if (sourceZwsp !== targetZwsp) details.push(`ZWSP ${sourceZwsp} → ${targetZwsp}`);

  return details.length ? fail('blocks', details) : pass('blocks', [
    `blocks=${targetBlocks}`,
    `tables=${targetTable}`,
    `quotes=${targetQuotes}`,
    `lists=${targetLists}`,
    `zwsp=${targetZwsp}`,
  ]);
}

export function checkLinks(source, target, lang) {
  const sourceHrefs = extractLinks(source.body);
  const targetHrefs = extractLinks(target.body);
  const details = [];

  for (const href of targetHrefs) {
    if (isIllegalLocaleServicePath(href, lang)) {
      details.push(`non-existent path ${href}`);
    }
  }

  const expected = canonicalHrefSet(sourceHrefs, lang);
  const actual = canonicalHrefSet(targetHrefs, lang);
  const missing = sortedSet(expected).filter((href) => !actual.has(href));
  const extra = sortedSet(actual).filter((href) => !expected.has(href));
  for (const href of missing) details.push(`missing ${href}`);
  for (const href of extra) details.push(`extra/unallowed ${href}`);

  return details.length ? fail('links', details) : pass('links', [`hrefs=${targetHrefs.length}`]);
}

export function checkHangul(target) {
  const urlValue = rawYamlValue(target.rawMatter, 'url') ?? target.data.url ?? '';
  const hits = findHangulHits(urlValue, target.body, target.bodyStartLine);
  if (hits.length === 0) return pass('hangul');
  return fail(
    'hangul',
    hits.map((hit) => `L${hit.line}: ${hit.text.trim()}`),
  );
}

export function checkEnglish(target, lang) {
  const hits = findEnglishSentences(target.body, target.bodyStartLine);
  if (hits.length === 0) return pass('english');
  const details = hits.map((hit) => `L${hit.line}: ${hit.text.trim()}`);
  if (lang === 'fil') return warn('english', details);
  return fail('english', details);
}

export function checkForbidden(target, lang) {
  const hits = findForbiddenHits(target.body, lang, target.bodyStartLine);
  if (hits.length === 0) return pass('forbidden');
  return fail(
    'forbidden',
    hits.map((hit) => `L${hit.line} ${hit.id} (${hit.note}): ${hit.text.trim()}`),
  );
}

/**
 * langid — 로케일 블록에 다른 대상 언어의 고유 문자가 섞여 들어간 것을 잡는다.
 *
 * 구조적 공백이었다. 기존 `hangul`은 한글만, `english`는 영어 문장만 본다.
 * 한 로케일 파일에 다른 동남아 언어 문자열이 들어가도 어떤 항목도 실패하지
 * 않았다. 유니코드 스크립트 기준으로만 판정하며, 한자 병기는 이 사이트의
 * 관례이므로 제외한다(별도 `hanzi` 항목이 담당).
 *
 * 라틴 문자를 공유하는 id와 fil은 스크립트로 가를 수 없어 이 항목의 대상이
 * 아니다. 그쪽은 `english` 항목과 용어집 대조가 맡는다.
 */
const LANGID_SCRIPTS = [
  { id: 'thai', lang: 'th', re: /[\u0E00-\u0E7F]/u, label: '태국 문자' },
  { id: 'hangul', lang: 'ko', re: /[\uAC00-\uD7A3]/u, label: '한글' },
  { id: 'kana', lang: 'ja', re: /[\u3040-\u30FF]/u, label: '가나' },
];

// 베트남어 고유 결합 문자(다른 라틴 로케일에 나타나면 혼입)
const LANGID_VI_RE = /[\u01A0\u01A1\u01AF\u01B0\u0110\u0111\u1EA0-\u1EF9]/u;

export function findLangidHits(body, startLine, lang) {
  const hits = [];
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    // 한자 병기 괄호와 URL은 판정에서 제외한다
    const scrubbed = line
      .replace(/https?:\/\/\S+/gu, ' ')
      .replace(/\([^)]*[\u4E00-\u9FFF][^)]*\)/gu, ' ')
      .replace(/（[^）]*[\u4E00-\u9FFF][^）]*）/gu, ' ');
    for (const script of LANGID_SCRIPTS) {
      if (script.lang === lang) continue;
      const m = scrubbed.match(script.re);
      if (m) hits.push({ line: startLine + i, script: script.id, label: script.label, text: line });
    }
    if (lang !== 'vi' && LANGID_VI_RE.test(scrubbed)) {
      hits.push({ line: startLine + i, script: 'vi', label: '베트남어 고유 문자', text: line });
    }
  }
  return hits;
}

export function checkLangid(target, lang) {
  const hits = findLangidHits(target.body, target.bodyStartLine, lang);
  if (hits.length === 0) return pass('langid');
  // 총괄 판정(GOAL-4 P3): 현 코퍼스 68편에 오탐 0이므로 WARN이 아니라 FAIL로 둔다.
  // 다른 대상 언어의 고유 문자가 들어오는 것은 정상적인 번역 결과가 아니다.
  return fail(
    'langid',
    hits.map((hit) => `L${hit.line} ${hit.label} 혼입: ${hit.text.trim().slice(0, 90)}`),
  );
}

export function checkHanzi(target) {
  const count = countHanzi(target.body);
  if (count >= HANZI_MIN) return pass('hanzi', [`han=${count}`]);
  return warn('hanzi', [`han=${count} (min ${HANZI_MIN})`]);
}

export function checkNationality(source, target, lang, adaptLog = '') {
  const units = alignedTranslationUnits(source, target);
  const fails = [];
  const warns = [];
  for (const unit of units) {
    const hits = findNationalityHits(unit.target, lang);
    if (!hits.length) continue;
    if (sourceHasNationality(unit.source)) continue;
    const covered = adaptLogCovers(adaptLog, unit);
    const loc = typeof unit.index === 'number' ? `block[${unit.index}]` : String(unit.index);
    for (const hit of hits) {
      const line = `${hit.value} ${loc} src="${clipSentence(unit.source)}" tgt="${clipSentence(unit.target)}"`;
      if (covered) warns.push(`근거있음 ${line}`);
      else fails.push(line);
    }
  }
  if (fails.length) return fail('nationality', [...fails, ...warns]);
  if (warns.length) return warn('nationality', warns);
  return pass('nationality');
}

function clipSentence(text) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  return t.length <= 180 ? t : `${t.slice(0, 177)}...`;
}

const KO_ORDINAL_SPECS = [
  { kind: 'instance', re: /제?\s*(\d+)\s*심/g },
  { kind: 'paragraph', re: /제\s*(\d+)\s*항/g },
  { kind: 'item', re: /제\s*(\d+)\s*호/g },
  { kind: 'type', re: /제\s*(\d+)\s*종/g },
  { kind: 'party', re: /제\s*(\d+)\s*자/g },
  { kind: 'country', re: /제\s*(\d+)\s*국/g },
  { kind: 'perday', re: /(\d+)\s*일당/g },
];

const ORDINAL_WORD_N = {
  vi: { nhất: 1, một: 1, hai: 2, ba: 3, tư: 4, bốn: 4, năm: 5 },
  id: { pertama: 1, kesatu: 1, kedua: 2, ketiga: 3, keempat: 4, kelima: 5 },
  th: { หนึ่ง: 1, สอง: 2, สาม: 3, สี่: 4 },
  fil: {
    una: 1, unang: 1, first: 1,
    ikalawa: 2, pangalawa: 2, second: 2,
    ikatlo: 3, ikatlong: 3, third: 3,
  },
};

function ordinalWordN(lang, word) {
  const raw = String(word || '');
  const map = ORDINAL_WORD_N[lang] ?? {};
  if (map[raw] != null) return map[raw];
  const lower = raw.toLowerCase();
  if (map[lower] != null) return map[lower];
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

function collapseOrdinalHits(hits) {
  const sorted = hits.slice().sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return (b.end - a.start) - (a.end - a.start);
  });
  const out = [];
  let lastEnd = -1;
  for (const hit of sorted) {
    if (hit.start < lastEnd) continue;
    out.push(hit);
    lastEnd = hit.end;
  }
  return out;
}

function collectRegexHits(text, re, handler) {
  const flags = re.global ? re.flags : `${re.flags}g`;
  const globalRe = new RegExp(re.source, flags);
  const hits = [];
  let match;
  while ((match = globalRe.exec(text)) !== null) {
    const hit = handler(match);
    if (hit) hits.push(hit);
  }
  return hits;
}

export function extractKoOrdinals(text) {
  const s = String(text).normalize('NFC');
  const raw = [];
  for (const spec of KO_ORDINAL_SPECS) {
    raw.push(...collectRegexHits(s, spec.re, (match) => {
      const n = Number.parseInt(match[1], 10);
      if (!Number.isFinite(n)) return null;
      return {
        kind: spec.kind,
        n,
        start: match.index,
        end: match.index + match[0].length,
        phrase: match[0].trim(),
      };
    }));
  }
  raw.push(...collectRegexHits(s, /원당\s*1일(?:로|씩)?|(?<!월\s*)(?<!\d)1일로/g, (match) => ({
    kind: 'perday',
    n: 1,
    start: match.index,
    end: match.index + match[0].length,
    phrase: match[0].trim(),
  })));
  return collapseOrdinalHits(raw);
}

function targetOrdinalSpecs(lang) {
  const viUnit = (kind) => ({
    kind,
    re: new RegExp(`\\b${kind === 'paragraph' ? 'khoản' : kind === 'item' ? 'điểm' : 'loại'}\\s+(?:thứ\\s+)?(nhất|một|hai|ba|tư|bốn|năm|\\d+)\\b`, 'giu'),
    nFrom: (match) => ordinalWordN('vi', match[1]),
  });
  const tables = {
    vi: [
      { kind: 'instance', n: 1, re: /sơ\s*thẩm/giu },
      { kind: 'instance', n: 2, re: /phúc\s*thẩm/giu },
      { kind: 'party', n: 3, re: /(?:bên|người|phía)\s+thứ\s+ba/giu },
      { kind: 'country', n: 3, re: /nước\s+thứ\s+ba|quốc\s+gia\s+thứ\s+ba/giu },
      { kind: 'perday', n: 1, re: /(?:cho\s+)?mỗi\s+ngày/giu },
      viUnit('paragraph'),
      viUnit('item'),
      viUnit('type'),
    ],
    id: [
      { kind: 'party', n: 3, re: /pihak\s+ketiga/gi },
      { kind: 'country', n: 3, re: /negara\s+ketiga/gi },
      { kind: 'instance', n: 1, re: /tingkat\s+pertama/gi },
      { kind: 'instance', n: 2, re: /tingkat\s+(?:banding|kedua)/gi },
      { kind: 'type', re: /jenis\s+(pertama|kedua|ketiga|keempat)/gi, nFrom: (match) => ordinalWordN('id', match[1]) },
      { kind: 'type', n: 2, re: /type\s*II\b/gi },
      { kind: 'paragraph', re: /ayat\s+(pertama|kedua|ketiga|\d+)/gi, nFrom: (match) => ordinalWordN('id', match[1]) },
      { kind: 'item', re: /butir\s+(pertama|kedua|ketiga|\d+)/gi, nFrom: (match) => ordinalWordN('id', match[1]) },
      { kind: 'perday', n: 1, re: /per\s+hari/gi },
    ],
    th: [
      { kind: 'instance', n: 1, re: /ชั้นต้น/g },
      { kind: 'instance', n: 2, re: /อุทธรณ์/g },
      { kind: 'paragraph', re: /วรรค(หนึ่ง|สอง|สาม)/g, nFrom: (match) => ordinalWordN('th', match[1]) },
      { kind: 'item', re: /อนุมาตรา(หนึ่ง|สอง|สาม)?/g, nFrom: (match) => ordinalWordN('th', match[1] || 'หนึ่ง') },
      { kind: 'type', re: /ประเภทที่(หนึ่ง|สอง|สาม)/g, nFrom: (match) => ordinalWordN('th', match[1]) },
      { kind: 'party', n: 3, re: /บุคคลที่สาม|บุคคลภายนอก|บุคคลที่\s*3/g },
      { kind: 'country', n: 3, re: /ประเทศที่สาม|ประเทศที่\s*3/g },
      { kind: 'perday', n: 1, re: /วันละ|ต่อวัน/g },
    ],
    fil: [
      // `isang` here is the article of the ordinal noun phrase ("isang ikatlong
      // partido" = "a third party"), not the cardinal 1, so it is swallowed by
      // the ordinal span instead of being left behind as a stray numeral.
      { kind: 'party', n: 3, re: /(?:isang\s+)?(?:ikatlong\s+(?:partido|panig)|third[-\s]party)/gi },
      { kind: 'country', n: 3, re: /(?:isang\s+)?(?:ikatlong\s+bansa|third\s+country)/gi },
      { kind: 'instance', n: 1, re: /(?:isang\s+)?first\s+instance/gi },
      { kind: 'instance', n: 2, re: /(?:isang\s+)?second\s+instance/gi },
      { kind: 'type', n: 2, re: /(?:isang\s+)?(?:type\s*II\b|ikalawang\s+uri|pangalawang\s+uri)/gi },
      { kind: 'paragraph', n: 1, re: /(?:isang\s+)?(?:unang\s+talata|talata\s+una)/gi },
      { kind: 'paragraph', n: 2, re: /(?:isang\s+)?talata\s+ikalawa/gi },
      { kind: 'perday', n: 1, re: /bawat\s+araw|kada\s+araw|per\s+day|araw\s+kada/gi },
      { kind: 'type', re: /(?:isang\s+)?\b(unang|ikalawang|ikatlong)\s+uri\b/gi, nFrom: (match) => ordinalWordN('fil', match[1]) },
    ],
  };
  return tables[lang] ?? [];
}

export function extractTargetOrdinals(text, lang) {
  const s = String(text).normalize('NFC');
  const raw = [];
  for (const spec of targetOrdinalSpecs(lang)) {
    raw.push(...collectRegexHits(s, spec.re, (match) => {
      const n = spec.nFrom ? spec.nFrom(match) : spec.n;
      if (!Number.isFinite(n) || n < 1) return null;
      return {
        kind: spec.kind,
        n,
        start: match.index,
        end: match.index + match[0].length,
        phrase: match[0].trim(),
      };
    }));
  }
  return collapseOrdinalHits(raw);
}

function blankSpans(text, spans) {
  let s = String(text);
  const ordered = spans.slice().sort((a, b) => b.start - a.start);
  for (const span of ordered) {
    s = `${s.slice(0, span.start)}${' '.repeat(Math.max(0, span.end - span.start))}${s.slice(span.end)}`;
  }
  return s;
}

export function matchOrdinalExpressions(sourceText, targetText, lang) {
  const srcHits = extractKoOrdinals(sourceText);
  const tgtHits = extractTargetOrdinals(targetText, lang);
  const used = new Set();
  const matched = [];
  const unmatched = [];
  for (const hit of srcHits) {
    const index = tgtHits.findIndex((candidate, i) => (
      !used.has(i) && candidate.kind === hit.kind && candidate.n === hit.n
    ));
    if (index >= 0) {
      used.add(index);
      matched.push({ src: hit, tgt: tgtHits[index] });
    } else {
      unmatched.push(hit);
    }
  }
  return {
    sourceText: blankSpans(sourceText, matched.map((item) => item.src)),
    targetText: blankSpans(targetText, matched.map((item) => item.tgt)),
    unmatched,
    matched,
  };
}

/**
 * Replace every match of `patterns` with same-length spaces so later term
 * scans cannot see it. Exported so other gates (guidance-data country gate)
 * reuse the same "language-name PASS" mechanism instead of re-deriving it.
 */
export function blankRegexes(text, patterns) {
  let s = String(text);
  for (const re of patterns) {
    const flags = re.global ? re.flags : `${re.flags}g`;
    s = s.replace(new RegExp(re.source, flags), (match) => ' '.repeat(match.length));
  }
  return s;
}

export function findNationalityHits(text, lang) {
  const terms = (NATIONALITY_TERMS[lang] ?? []).slice().sort((a, b) => b.length - a.length);
  const s = blankRegexes(text, NATIONALITY_LANGUAGE_NAMES[lang] ?? []);
  const hits = [];
  const occupied = [];
  for (const term of terms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const needsBoundary = /^[A-Za-z]+$/.test(term);
    const re = needsBoundary
      ? new RegExp(`\\b${escaped}\\b`, 'gi')
      : new RegExp(escaped, 'giu');
    let match;
    while ((match = re.exec(s)) !== null) {
      const start = match.index;
      const end = match.index + match[0].length;
      if (occupied.some((span) => start < span.end && end > span.start)) continue;
      occupied.push({ start, end });
      hits.push({ value: term, start, end, phrase: match[0] });
    }
  }
  return hits;
}

export function sourceHasNationality(text) {
  const s = blankRegexes(text, [SOURCE_LANGUAGE_NAME_RE]);
  return SOURCE_NATIONALITY_RE.test(s);
}

export function adaptLogCovers(adaptLog, unit) {
  const log = String(adaptLog || '').normalize('NFC');
  if (!log.trim()) return false;
  const fragments = [unit.target, unit.source]
    .map((value) => String(value || '').normalize('NFC').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  for (const text of fragments) {
    if (text.length < 12) {
      if (log.includes(text)) return true;
      continue;
    }
    if (log.includes(text.slice(0, Math.min(40, text.length)))) return true;
    if (log.includes(text.slice(-Math.min(40, text.length)))) return true;
    for (let i = 0; i <= text.length - 16; i += 8) {
      if (log.includes(text.slice(i, i + 16))) return true;
    }
  }
  return false;
}

export function alignedTranslationUnits(source, target) {
  const units = [];
  const sourceBlocks = nonEmptyBlocks(source.body);
  const targetBlocks = nonEmptyBlocks(target.body);
  const blockCount = Math.max(sourceBlocks.length, targetBlocks.length);
  for (let i = 0; i < blockCount; i += 1) {
    units.push({ index: i, source: sourceBlocks[i] ?? '', target: targetBlocks[i] ?? '' });
  }
  const sourceFaq = faqItems(source.data);
  const targetFaq = faqItems(target.data);
  const faqCount = Math.max(sourceFaq.length, targetFaq.length);
  for (let i = 0; i < faqCount; i += 1) {
    units.push({ index: `faq[${i}].q`, source: sourceFaq[i]?.q ?? '', target: targetFaq[i]?.q ?? '' });
    units.push({ index: `faq[${i}].a`, source: sourceFaq[i]?.a ?? '', target: targetFaq[i]?.a ?? '' });
  }
  const sourceTitle = typeof source.data.title === 'string' ? source.data.title : '';
  const targetTitle = typeof target.data.title === 'string' ? target.data.title : '';
  if (sourceTitle || targetTitle) {
    units.push({ index: 'title', source: sourceTitle, target: targetTitle });
  }
  return units;
}

export function citeMissingNumbers(sourceText, targetText, lang, missingValues) {
  const quotes = [];
  const missingSet = new Set(missingValues);
  const sourceParas = String(sourceText).split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const targetParas = String(targetText).split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const limit = Math.max(sourceParas.length, targetParas.length);
  for (let i = 0; i < limit && quotes.length < 12; i += 1) {
    const src = sourceParas[i] ?? '';
    const tgt = targetParas[i] ?? '';
    const srcBag = countMap(extractNormalizedNumbers(src, 'ko'));
    const tgtBag = countMap(extractNormalizedNumbers(tgt, lang));
    const local = [];
    for (const value of missingSet) {
      if ((srcBag.get(value) ?? 0) > (tgtBag.get(value) ?? 0)) local.push(value);
    }
    if (local.length) {
      quotes.push(`[${local.join(',')}] src="${clipSentence(src)}" tgt="${clipSentence(tgt)}"`);
    }
  }
  return quotes;
}

export function checkNumbers(source, target, lang) {
  const sourceTextRaw = translatableText(source);
  const targetTextRaw = translatableText(target);
  const ordinal = matchOrdinalExpressions(sourceTextRaw, targetTextRaw, lang);
  const sourceText = ordinal.sourceText;
  const targetText = ordinal.targetText;
  const sourceAnalysis = analyzeNumbers(sourceText, 'ko');
  const targetAnalysis = analyzeNumbers(targetText, lang);
  const sourceBag = countMap(sourceAnalysis.tokens);
  const targetBag = collapseHanziDupes(sourceBag, targetAnalysis.tokens);

  const onlySource = [];
  const onlyTarget = [];
  for (const key of new Set([...sourceBag.keys(), ...targetBag.keys()])) {
    const sourceN = sourceBag.get(key) ?? 0;
    const targetN = targetBag.get(key) ?? 0;
    if (sourceN > targetN) onlySource.push({ value: key, count: sourceN - targetN });
    if (targetN > sourceN) onlyTarget.push({ value: key, count: targetN - sourceN });
  }

  const sourceTotal = [...sourceBag.values()].reduce((sum, n) => sum + n, 0);
  const targetTotal = [...targetBag.values()].reduce((sum, n) => sum + n, 0);
  const details = [];
  if (onlySource.length) {
    const n = onlySource.reduce((sum, item) => sum + item.count, 0);
    details.push(`missing from translation (${n}): ${formatNumberDiff(onlySource)}`);
  }
  if (onlyTarget.length) {
    const n = onlyTarget.reduce((sum, item) => sum + item.count, 0);
    details.push(`extra in translation (${n}): ${formatNumberDiff(onlyTarget)}`);
  }
  const unparsed = targetAnalysis.unparsed ?? [];
  if (unparsed.length) {
    details.push(`수사 미해석 (${unparsed.length}): ${unparsed.join('; ')}`);
  }
  if (ordinal.unmatched.length) {
    details.push(`수사미해석 (${ordinal.unmatched.length}): ${ordinal.unmatched.map((hit) => hit.phrase).join('; ')}`);
  }
  details.push(`sourceCount=${sourceTotal} targetCount=${targetTotal}`);
  if (onlySource.length) {
    for (const quote of citeMissingNumbers(sourceText, targetText, lang, onlySource.map((item) => item.value))) {
      details.push(quote);
    }
  }

  if (onlySource.length) return fail('numbers', details);
  if (onlyTarget.length || unparsed.length || ordinal.unmatched.length) return warn('numbers', details);
  return pass('numbers', details);
}

export function checkPair({ sourceRaw, targetRaw, sourcePath, targetPath, lang, adaptLog = '', checks }) {
  const source = parseMarkdown(sourceRaw);
  const target = parseMarkdown(targetRaw);
  const wanted = new Set(Array.isArray(checks) && checks.length ? checks : CHECK_IDS);
  const catalog = [
    ['frontmatter', () => checkFrontmatter(source, target)],
    ['headings', () => checkHeadings(source, target)],
    ['images', () => checkImages(source, target)],
    ['blocks', () => checkBlocks(source, target)],
    ['links', () => checkLinks(source, target, lang)],
    ['hangul', () => checkHangul(target)],
    ['english', () => checkEnglish(target, lang)],
    ['forbidden', () => checkForbidden(target, lang)],
    ['hanzi', () => checkHanzi(target)],
    ['numbers', () => checkNumbers(source, target, lang)],
    ['nationality', () => checkNationality(source, target, lang, adaptLog)],
    ['langid', () => checkLangid(target, lang)],
  ];
  const results = catalog.filter(([id]) => wanted.has(id)).map(([, run]) => run());
  const failed = results.some((check) => check.status === 'FAIL');
  return {
    ok: !failed,
    lang,
    sourcePath,
    targetPath,
    checks: results,
  };
}

export function formatPairTable(result) {
  const rows = [
    `${result.ok ? 'PASS' : 'FAIL'}  ${result.targetPath}  lang=${result.lang}`,
    'check          status  details',
    '-------------- ------  -------',
  ];
  for (const check of result.checks) {
    const first = check.details[0] ?? '';
    rows.push(`${check.id.padEnd(14)} ${check.status.padEnd(6)} ${first}`);
    if (check.status !== 'PASS') {
      for (const extra of check.details.slice(1)) {
        rows.push(`               ${''.padEnd(6)} ${extra}`);
      }
    }
  }
  return rows.join('\n');
}

async function readUtf8(path) {
  return readFile(path, 'utf8');
}

export async function checkFiles({
  sourcePath,
  targetPath,
  lang,
  adaptLog,
  adaptDir = DEFAULT_ADAPT_DIR,
  checks,
}) {
  if (!existsSync(sourcePath)) {
    return {
      ok: false,
      lang,
      sourcePath,
      targetPath,
      checks: [fail('frontmatter', [`missing source ${sourcePath}`])],
    };
  }
  if (!existsSync(targetPath)) {
    return {
      ok: false,
      lang,
      sourcePath,
      targetPath,
      checks: [fail('frontmatter', [`missing target ${targetPath}`])],
    };
  }
  const sourceRaw = await readUtf8(sourcePath);
  const targetRaw = await readUtf8(targetPath);
  let log = adaptLog ?? '';
  if (!log && adaptDir) {
    const slug = basename(targetPath, '.md');
    const adaptPath = join(adaptDir, lang, `${slug}.adapt-log.md`);
    if (existsSync(adaptPath)) log = await readUtf8(adaptPath);
  }
  return checkPair({
    sourceRaw,
    targetRaw,
    sourcePath,
    targetPath,
    lang,
    adaptLog: log,
    checks,
  });
}

export async function checkDirectory({
  dir,
  sourceDir = DEFAULT_SOURCE_DIR,
  lang,
  adaptDir = DEFAULT_ADAPT_DIR,
  checks,
}) {
  const absDir = resolve(dir);
  if (!existsSync(absDir)) {
    throw new Error(`directory not found: ${absDir}`);
  }
  const names = (await readdir(absDir)).filter((name) => name.endsWith('.md')).sort();
  const results = [];
  for (const name of names) {
    results.push(await checkFiles({
      sourcePath: join(sourceDir, name),
      targetPath: join(absDir, name),
      lang,
      adaptDir,
      checks,
    }));
  }
  return results;
}

export function summarizeResults(results) {
  const failed = results.filter((result) => !result.ok).length;
  return {
    ok: failed === 0,
    count: results.length,
    failed,
    passed: results.length - failed,
  };
}

export function formatReport(results) {
  const blocks = results.map((result) => formatPairTable(result));
  const summary = summarizeResults(results);
  blocks.push(`summary  ${summary.ok ? 'PASS' : 'FAIL'}  ${summary.passed}/${summary.count} files`);
  return blocks.join('\n\n');
}

export function toJson(results, lang) {
  const summary = summarizeResults(results);
  return {
    ok: summary.ok,
    lang,
    count: summary.count,
    passed: summary.passed,
    failed: summary.failed,
    pairs: results,
  };
}

export async function main(argv, options = {}) {
  const args = parseArgs(argv);
  const results = args.dir
    ? await checkDirectory({
      dir: args.dir,
      sourceDir: args.source ? resolve(args.source) : DEFAULT_SOURCE_DIR,
      lang: args.lang,
      adaptDir: args.adaptDir,
      checks: args.check,
    })
    : [await checkFiles({
      sourcePath: resolve(args.source),
      targetPath: resolve(args.target),
      lang: args.lang,
      adaptDir: args.adaptDir,
      checks: args.check,
    })];

  const report = formatReport(results);
  const log = options.log ?? console.log;
  log(report);

  if (args.json) {
    const jsonPath = resolve(args.json);
    await mkdir(dirname(jsonPath), { recursive: true });
    await writeFile(jsonPath, `${JSON.stringify(toJson(results, args.lang), null, 2)}\n`, 'utf8');
    log(`json: ${jsonPath}`);
  }

  return summarizeResults(results).ok ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
