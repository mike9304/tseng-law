#!/usr/bin/env node
/**
 * Country-name gate for the guidance (vi/id/th/fil) TypeScript data files.
 *
 * Why this exists: `scripts/check-column-translation.mjs --check nationality`
 * only looks at column markdown. The guidance copy for the four new languages
 * lives in TypeScript data modules, so no country gate covered it, and
 * other-jurisdiction law statements shipped from there (WO-O32 finding A:
 * four disclaimers naming the reader's own country, four labour-dispute
 * sentences asserting how Taiwan `資遣費` compares with another country's
 * severance regime).
 *
 * Rule the gate enforces: guidance body copy names no country other than
 * Taiwan. Non-specific wording ("the law of where you live") is fine, and so
 * are language names, which are what the reader-country tokens most often
 * appear inside.
 *
 * Usage:
 *   node scripts/check-guidance-country-mentions.mjs
 *   node scripts/check-guidance-country-mentions.mjs --json
 *   node scripts/check-guidance-country-mentions.mjs path/to/other-copy.ts
 *
 * Exit code 0 = no violation, 1 = violations (each printed with file, line and
 * the offending sentence), 2 = usage/IO error.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { NATIONALITY_LANGUAGE_NAMES, blankRegexes } from './check-column-translation.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Guidance data modules whose vi/id/th/fil blocks are reader-facing copy. */
export const GUIDANCE_DATA_FILES = [
  'src/data/international-guidance-content.ts',
  'src/data/international-guidance-answers.ts',
  'src/data/international-guidance-team.ts',
  'src/data/international-inquiry-copy.ts',
];

export const GUIDANCE_LOCALES = ['vi', 'id', 'th', 'fil'];

/**
 * Country tokens that must not appear in guidance copy.
 *
 * Every reader country is listed in all four guidance languages plus English,
 * because a Vietnamese block naming Indonesia is the same defect as one naming
 * Vietnam. The United States is included because it was the first batch of
 * this defect class that shipped (WO-O32 preamble: eight US-law mentions).
 * Taiwan is deliberately absent: it is the firm's own jurisdiction.
 */
export const GUIDANCE_COUNTRY_TOKENS = {
  'United States': [
    'Hoa Kỳ',
    'Amerika Serikat',
    'สหรัฐอเมริกา',
    'สหรัฐฯ',
    'สหรัฐ',
    'Estados Unidos',
    'Estados Unidos ng Amerika',
    'United States',
    'U.S.',
    'U.S.A.',
    'USA',
    'Amerika',
    'Amerikano',
  ],
  Vietnam: ['Việt Nam', 'Việt', 'Vietnam', 'Viet Nam', 'เวียดนาม', 'Biyetnam', 'Byetnam'],
  Indonesia: ['Indonesia', 'Indonesian', 'อินโดนีเซีย', 'WNI'],
  Thailand: ['ประเทศไทย', 'ไทย', 'Thái Lan', 'Thailand', 'Tailandia', 'Thai'],
  Philippines: [
    'Philippines',
    'Pilipinas',
    'Pilipino',
    'Filipino',
    'Filipina',
    'ฟิลิปปินส์',
    'Phi-líp-pin',
    'Philippine',
  ],
};

/**
 * Language-name contexts that pass.
 *
 * The four per-language patterns come straight from the column checker
 * (`NATIONALITY_LANGUAGE_NAMES`) so both gates agree on what "this is a
 * language name, not a country" means; the extras below cover the language
 * names the guidance copy uses that columns never needed — every locale lists
 * the four consultation languages, and does so in its own language.
 */
export const GUIDANCE_LANGUAGE_NAME_PATTERNS = [
  ...Object.values(NATIONALITY_LANGUAGE_NAMES).flat(),
  // "<language word> + <name>" in each guidance language. The guidance copy
  // names languages constantly (every locale lists the four consultation
  // languages and asks which language the reader writes in), and in Tagalog,
  // Indonesian and Vietnamese the language name is spelled the same as the
  // country adjective, so the language word in front of it is what separates
  // "bahasa Vietnam" from "hukum Vietnam".
  /ti[eế]ng\s+[\p{L}\p{M}]+/giu, // vi: tiếng Việt / tiếng Indonesia / tiếng Thái
  /\b(?:ber)?bahasa\s+[\p{L}\p{M}]+/giu, // id: bahasa Indonesia / berbahasa Indonesia / bahasa Vietnam
  /ภาษา[\u0E00-\u0E7F]+/gu, // th: ภาษาไทย / ภาษาเวียดนาม / ภาษาอินโดนีเซีย
  /\bwikang?\s+[\p{L}\p{M}]+/giu, // fil: wika / wikang Filipino
  /\b[\p{L}\p{M}]{3,}ng\s+Filipino\b/giu, // fil linker: bersyong / tekstong / bahaging Filipino
  /\bsa\s+Filipino\b/giu, // fil: "gabay sa Filipino", "paliwanag sa Filipino"
];

/**
 * Field names whose value is, by definition, a list of language names.
 *
 * Only these keys are exempt wholesale. `originalLanguagePlaceholder` is the
 * one place the Filipino copy enumerates bare language names
 * ("Filipino, Vietnamese, Indonesian, Thai, o ibang wika") with no Tagalog
 * language word in front of them, so no pattern above can reach it.
 */
export const GUIDANCE_LANGUAGE_FIELD_KEYS = [
  'languageName',
  'originalLanguageLabel',
  'originalLanguagePlaceholder',
  'preferredConsultationLanguageLabel',
  'consultationLanguageLabel',
];

/**
 * Non-language contexts that pass, with the reason each one is allowed.
 *
 * These are structural labels, not statements about another country's law:
 * the guidance locales are keyed and labelled by their own language, and the
 * locale switcher/notice copy has to say which language the page is in.
 */
export const GUIDANCE_ALLOWED_CONTEXTS = [
  {
    id: 'locale-key',
    reason: 'object key / locale identifier, not reader-facing prose',
    test: (entry) => /^(?:vi|id|th|fil|en|ja|ko|zh-hant)$/.test(entry.key ?? ''),
  },
  {
    id: 'language-field',
    reason: 'field whose value is a list of language names',
    test: (entry) => GUIDANCE_LANGUAGE_FIELD_KEYS.includes(entry.key ?? ''),
  },
];

function toGlobal(re) {
  return re.global ? re : new RegExp(re.source, `${re.flags}g`);
}

/** Locale blocks are `  vi: {` … `  },` at the record's two-space indent. */
export function extractLocaleBlocks(text) {
  const lines = text.split('\n');
  const blocks = [];
  let current = null;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!current) {
      const open = /^ {2}'?(vi|id|th|fil)'?: \{\s*$/.exec(line);
      if (open) current = { locale: open[1], startLine: i + 1, lines: [] };
      continue;
    }
    if (/^ {2}\},?\s*$/.test(line)) {
      blocks.push(current);
      current = null;
      continue;
    }
    current.lines.push({ line: i + 1, text: line });
  }
  if (current) blocks.push(current);
  return blocks;
}

function allowedByContext(entry) {
  for (const rule of GUIDANCE_ALLOWED_CONTEXTS) {
    if (rule.test(entry)) return rule;
  }
  return null;
}

const KEY_RE = /^\s*(?:'([\w-]+)'|"([\w-]+)"|([A-Za-z_$][\w$]*))\s*:/u;

/** Property key owning this line: the key on the line, else the key above it. */
export function keyForLine(rawLine, inheritedKey) {
  const match = KEY_RE.exec(rawLine);
  if (!match) return inheritedKey;
  return match[1] ?? match[2] ?? match[3] ?? inheritedKey;
}

function clip(text, limit = 200) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  return t.length <= limit ? t : `${t.slice(0, limit - 3)}...`;
}

/** Every country token occurrence left after the language-name blanking. */
export function findCountryHits(rawLine) {
  const masked = blankRegexes(rawLine, GUIDANCE_LANGUAGE_NAME_PATTERNS.map(toGlobal));
  const entries = [];
  for (const [country, tokens] of Object.entries(GUIDANCE_COUNTRY_TOKENS)) {
    for (const token of tokens) entries.push({ country, token });
  }
  entries.sort((a, b) => b.token.length - a.token.length);

  const hits = [];
  const occupied = [];
  for (const { country, token } of entries) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const asciiOnly = /^[A-Za-z.\- ]+$/.test(token);
    const re = asciiOnly
      ? new RegExp(`(?<![\\p{L}])${escaped}(?![\\p{L}])`, 'giu')
      : new RegExp(escaped, 'giu');
    let match;
    while ((match = re.exec(masked)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (occupied.some((span) => start < span.end && end > span.start)) continue;
      occupied.push({ start, end });
      hits.push({ country, token, phrase: match[0], start, end });
      if (match[0].length === 0) re.lastIndex += 1;
    }
  }
  return hits.sort((a, b) => a.start - b.start);
}

export function scanGuidanceCountryMentions(files = GUIDANCE_DATA_FILES, root = REPO_ROOT) {
  const violations = [];
  const allowed = [];
  let scannedLines = 0;
  const scannedFiles = [];

  for (const relative of files) {
    const absolute = path.isAbsolute(relative) ? relative : path.join(root, relative);
    const text = readFileSync(absolute, 'utf8');
    const blocks = extractLocaleBlocks(text);
    scannedFiles.push({ file: relative, locales: blocks.map((block) => block.locale) });
    for (const block of blocks) {
      let key = null;
      for (const { line, text: rawLine } of block.lines) {
        scannedLines += 1;
        key = keyForLine(rawLine, key);
        const hits = findCountryHits(rawLine);
        if (!hits.length) continue;
        const context = allowedByContext({ key, rawLine });
        for (const hit of hits) {
          const record = {
            file: relative,
            line,
            locale: block.locale,
            key,
            country: hit.country,
            token: hit.token,
            phrase: hit.phrase,
            sentence: clip(rawLine),
          };
          if (context) allowed.push({ ...record, allowedBy: context.id, reason: context.reason });
          else violations.push(record);
        }
      }
    }
  }

  return { violations, allowed, scannedFiles, scannedLines };
}

export function formatReport(result) {
  const lines = [];
  for (const entry of result.scannedFiles) {
    lines.push(`scanned ${entry.file} [${entry.locales.join(', ')}]`);
  }
  lines.push(`lines scanned in guidance locale blocks: ${result.scannedLines}`);
  if (result.allowed.length) {
    lines.push(`allowed (language-name / structural context): ${result.allowed.length}`);
    for (const entry of result.allowed) {
      lines.push(`  ALLOW ${entry.file}:${entry.line} [${entry.locale}] ${entry.token} — ${entry.reason}`);
    }
  }
  if (!result.violations.length) {
    lines.push('PASS guidance-country-mentions: 0 violations');
    return lines.join('\n');
  }
  lines.push(`FAIL guidance-country-mentions: ${result.violations.length} violation(s)`);
  for (const v of result.violations) {
    lines.push(`  ${v.file}:${v.line} [${v.locale}] ${v.country} token "${v.phrase}"`);
    lines.push(`    ${v.sentence}`);
  }
  return lines.join('\n');
}

async function main(argv) {
  const json = argv.includes('--json');
  const files = argv.filter((arg) => !arg.startsWith('--'));
  const result = scanGuidanceCountryMentions(files.length ? files : GUIDANCE_DATA_FILES);
  if (json) console.log(JSON.stringify(result, null, 2));
  else console.log(formatReport(result));
  return result.violations.length ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = await main(process.argv.slice(2));
  } catch (error) {
    console.error(`check-guidance-country-mentions: ${error?.message ?? error}`);
    process.exitCode = 2;
  }
}
