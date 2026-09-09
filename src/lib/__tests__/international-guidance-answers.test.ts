import { describe, expect, it } from 'vitest';
import { intentPageSlugs } from '@/data/intent-pages';
import { guidanceAnswers } from '@/data/international-guidance-answers';
import type { GuidancePageKey } from '@/data/international-guidance-content';
import {
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  PUBLIC_LOCALES_8,
  guidancePublicPath,
} from '@/lib/public-guidance';

/** Page keys that must carry an answer-first block. */
const ANSWER_PAGE_KEYS = [
  'services',
  'about',
  'lawyers',
  'pricing',
  'contact',
  'faq',
] as const satisfies readonly GuidancePageKey[];

/** Page keys that must not carry one. */
const NO_ANSWER_PAGE_KEYS = GUIDANCE_PAGE_KEYS.filter(
  (key) => !(ANSWER_PAGE_KEYS as readonly string[]).includes(key),
);

const MIN_WORDS = 40;
const MAX_WORDS = 80;
const MIN_THAI_CHARS = 120;
const MAX_THAI_CHARS = 400;

/**
 * The four consultation languages, written the way each guidance language
 * writes them. Every answer must name all four, in its own language.
 */
const CONSULTATION_LANGUAGE_TERMS: Record<string, readonly string[]> = {
  vi: ['tiếng Anh', 'tiếng Trung', 'tiếng Nhật', 'tiếng Hàn'],
  id: ['Inggris', 'Tionghoa', 'Jepang', 'Korea'],
  th: ['ภาษาอังกฤษ', 'ภาษาจีน', 'ภาษาญี่ปุ่น', 'ภาษาเกาหลี'],
  fil: ['Ingles', 'Tsino', 'Hapon', 'Koreano'],
};

/**
 * Language-contract guard, part 1.
 *
 * The guidance languages are page languages only. No answer may name one of
 * them at all, so no sentence can be read as an offer of a consultation,
 * interpreting, or support in that language.
 */
const GUIDANCE_LANGUAGE_TOKENS: ReadonlyArray<readonly [string, RegExp]> = [
  ['Vietnamese', /\bVietnamese\b/i],
  ['Indonesian', /\bIndonesian\b/i],
  ['Thai', /\bThai\b/i],
  ['Filipino', /\bFilipino\b/i],
  ['Tagalog', /\bTagalog\b/i],
  ['tiếng Việt', /tiếng Việt/i],
  ['bahasa Indonesia', /bahasa Indonesia/i],
  ['ภาษาไทย', /ภาษาไทย/],
];

/**
 * Language-contract guard, part 2: the explicit forbidden-combination list.
 *
 * Each entry is a guidance-language token paired with a consultation token.
 * A single sentence may never contain both, in either order — that is the
 * shape any "consultation available in <guidance language>" claim would take.
 */
const FORBIDDEN_COMBINATIONS: ReadonlyArray<readonly [string, RegExp, RegExp]> = [
  ['Vietnamese + consultation', /\bVietnamese\b/i, /\bconsultation\b/i],
  ['Vietnamese + tư vấn', /\bVietnamese\b/i, /tư vấn/i],
  ['tiếng Việt + consultation', /tiếng Việt/i, /\bconsultation\b/i],
  ['tiếng Việt + tư vấn', /tiếng Việt/i, /tư vấn/i],
  ['Indonesian + consultation', /\bIndonesian\b/i, /\bconsultation\b/i],
  ['Indonesian + konsultasi', /\bIndonesian\b/i, /konsultasi/i],
  ['bahasa Indonesia + consultation', /bahasa Indonesia/i, /\bconsultation\b/i],
  ['bahasa Indonesia + konsultasi', /bahasa Indonesia/i, /konsultasi/i],
  ['Thai + consultation', /\bThai\b/i, /\bconsultation\b/i],
  ['Thai + ปรึกษา', /\bThai\b/i, /ปรึกษา/],
  ['ภาษาไทย + consultation', /ภาษาไทย/, /\bconsultation\b/i],
  ['ภาษาไทย + ปรึกษา', /ภาษาไทย/, /ปรึกษา/],
  ['Filipino + consultation', /\bFilipino\b/i, /\bconsultation\b/i],
  ['Filipino + konsultasyon', /\bFilipino\b/i, /konsultasyon/i],
  ['Tagalog + consultation', /\bTagalog\b/i, /\bconsultation\b/i],
  ['Tagalog + konsultasyon', /\bTagalog\b/i, /konsultasyon/i],
];

/** Every site-internal path an answer may cite. */
const ALLOWED_SOURCES = new Set<string>([
  ...PUBLIC_LOCALES_8.flatMap((locale) =>
    GUIDANCE_PAGE_KEYS.map((key) => guidancePublicPath(locale, key)),
  ),
  ...intentPageSlugs.map((slug) => `/en/${slug}`),
]);

/**
 * Thai has no sentence-final punctuation here, so the whole answer is treated
 * as a single sentence — a stricter check than splitting would give.
 */
function sentencesOf(locale: string, text: string): string[] {
  if (locale === 'th') return [text];
  return text.split(/(?<=[.!?])\s+/).filter((part) => part.trim().length > 0);
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const entries = GUIDANCE_LOCALES_4.flatMap((locale) =>
  ANSWER_PAGE_KEYS.map((key) => ({
    locale,
    key,
    entry: guidanceAnswers[locale][key],
  })),
);

describe('guidanceAnswers', () => {
  it('covers 4 locales x 6 page keys', () => {
    expect(GUIDANCE_LOCALES_4).toHaveLength(4);
    expect(ANSWER_PAGE_KEYS).toHaveLength(6);

    for (const locale of GUIDANCE_LOCALES_4) {
      expect(Object.keys(guidanceAnswers[locale]).sort()).toEqual(
        [...ANSWER_PAGE_KEYS].sort(),
      );
      for (const key of ANSWER_PAGE_KEYS) {
        const entry = guidanceAnswers[locale][key];
        expect(entry, `${locale}/${key} answer missing`).toBeDefined();
        expect(entry?.answer.trim().length, `${locale}/${key} answer empty`).toBeGreaterThan(0);
      }
    }
  });

  it('renders nothing for home, privacy, disclaimer and columns', () => {
    expect(NO_ANSWER_PAGE_KEYS).toEqual(['home', 'privacy', 'disclaimer', 'columns']);
    for (const locale of GUIDANCE_LOCALES_4) {
      for (const key of NO_ANSWER_PAGE_KEYS) {
        expect(guidanceAnswers[locale][key], `${locale}/${key} must have no answer`).toBeUndefined();
      }
    }
  });

  it('keeps every answer inside its length window', () => {
    for (const { locale, key, entry } of entries) {
      const answer = entry?.answer ?? '';
      if (locale === 'th') {
        const chars = [...answer].length;
        expect(chars, `${locale}/${key} chars=${chars}`).toBeGreaterThanOrEqual(MIN_THAI_CHARS);
        expect(chars, `${locale}/${key} chars=${chars}`).toBeLessThanOrEqual(MAX_THAI_CHARS);
      } else {
        const words = wordCount(answer);
        expect(words, `${locale}/${key} words=${words}`).toBeGreaterThanOrEqual(MIN_WORDS);
        expect(words, `${locale}/${key} words=${words}`).toBeLessThanOrEqual(MAX_WORDS);
      }
    }
  });

  it('names the four consultation languages in every answer', () => {
    for (const { locale, key, entry } of entries) {
      const answer = entry?.answer ?? '';
      for (const term of CONSULTATION_LANGUAGE_TERMS[locale] ?? []) {
        expect(answer, `${locale}/${key} is missing "${term}"`).toContain(term);
      }
    }
  });

  it('never names a guidance language', () => {
    for (const { locale, key, entry } of entries) {
      const answer = entry?.answer ?? '';
      for (const [label, pattern] of GUIDANCE_LANGUAGE_TOKENS) {
        expect(
          pattern.test(answer),
          `${locale}/${key} contains the guidance-language token "${label}"`,
        ).toBe(false);
      }
    }
  });

  it('has zero forbidden language/consultation combinations in any sentence', () => {
    for (const { locale, key, entry } of entries) {
      const answer = entry?.answer ?? '';
      for (const sentence of sentencesOf(locale, answer)) {
        for (const [label, languagePattern, consultationPattern] of FORBIDDEN_COMBINATIONS) {
          const hit = languagePattern.test(sentence) && consultationPattern.test(sentence);
          expect(hit, `${locale}/${key} matched forbidden combination "${label}"`).toBe(false);
        }
      }
    }
  });

  it('cites only existing site-internal paths', () => {
    for (const { locale, key, entry } of entries) {
      const sources = entry?.sources ?? [];
      expect(sources.length, `${locale}/${key} source count`).toBeGreaterThanOrEqual(1);
      expect(sources.length, `${locale}/${key} source count`).toBeLessThanOrEqual(2);
      expect(new Set(sources).size, `${locale}/${key} duplicate source`).toBe(sources.length);

      for (const href of sources) {
        expect(href.startsWith('/'), `${locale}/${key} source "${href}" must start with /`).toBe(true);
        expect(ALLOWED_SOURCES.has(href), `${locale}/${key} source "${href}" is not a known path`).toBe(true);
        const isSameLocaleGuidance = GUIDANCE_PAGE_KEYS.some(
          (pageKey) => guidancePublicPath(locale, pageKey) === href,
        );
        const isEnglishLanding = intentPageSlugs.some((slug) => href === `/en/${slug}`);
        expect(
          isSameLocaleGuidance || isEnglishLanding,
          `${locale}/${key} source "${href}" is neither a same-locale guidance page nor an /en landing`,
        ).toBe(true);
        expect(href, `${locale}/${key} must not cite itself`).not.toBe(
          guidancePublicPath(locale, key),
        );
      }
    }
  });
});
