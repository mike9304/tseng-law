#!/usr/bin/env node
/**
 * Structural isomorphism + claim-safety checker for column translations.
 *
 * Usage:
 *   node scripts/check-column-translation.mjs \
 *     --source src/content/columns/008-x.md --target <translated.md> --lang vi [--json out.json]
 *   node scripts/check-column-translation.mjs --dir src/content/columns-vi --lang vi
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
];

export function parseArgs(argv) {
  const out = { source: null, target: null, lang: null, dir: null, json: null };
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
    else throw new Error(`unknown argument: ${arg}`);
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

export function checkHanzi(target) {
  const count = countHanzi(target.body);
  if (count >= HANZI_MIN) return pass('hanzi', [`han=${count}`]);
  return warn('hanzi', [`han=${count} (min ${HANZI_MIN})`]);
}

export function checkPair({ sourceRaw, targetRaw, sourcePath, targetPath, lang }) {
  const source = parseMarkdown(sourceRaw);
  const target = parseMarkdown(targetRaw);
  const checks = [
    checkFrontmatter(source, target),
    checkHeadings(source, target),
    checkImages(source, target),
    checkBlocks(source, target),
    checkLinks(source, target, lang),
    checkHangul(target),
    checkEnglish(target, lang),
    checkForbidden(target, lang),
    checkHanzi(target),
  ];
  const failed = checks.some((check) => check.status === 'FAIL');
  return {
    ok: !failed,
    lang,
    sourcePath,
    targetPath,
    checks,
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

export async function checkFiles({ sourcePath, targetPath, lang }) {
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
  return checkPair({ sourceRaw, targetRaw, sourcePath, targetPath, lang });
}

export async function checkDirectory({ dir, sourceDir = DEFAULT_SOURCE_DIR, lang }) {
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
    })
    : [await checkFiles({
      sourcePath: resolve(args.source),
      targetPath: resolve(args.target),
      lang: args.lang,
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
