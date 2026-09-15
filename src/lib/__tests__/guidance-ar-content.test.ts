import { describe, expect, it } from 'vitest';
import {
  guidanceContent,
  type GuidanceLocaleContent,
} from '@/data/international-guidance-content';
import {
  guidanceFooterCopy,
  guidanceOfficeCopy,
} from '@/data/international-guidance-offices';
import {
  guidanceLanguageNames,
  guidancePracticeAreaNames,
  guidanceTeamBios,
  guidanceTeamCopy,
} from '@/data/international-guidance-team';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { GUIDANCE_PAGE_KEYS } from '@/lib/public-guidance';

/**
 * WO-M3-AR-CONTENT — contract tests for the Arabic guidance locale.
 *
 * `ar` is a PAGE language, never a consultation language. The firm's
 * consultations are held in English, Chinese, Japanese and Korean only, and
 * `GUIDANCE_CONSULTATION_LANGUAGES` in `src/lib/seo.ts` must stay at those
 * four. Every assertion below exists to make the Arabic pages impossible to
 * read as an offer of an Arabic-language consultation or of interpreting.
 *
 * The suite deliberately does not import `GUIDANCE_LOCALES_4` /
 * `PUBLIC_LOCALES_8`: the routing constants land on a separate branch, and
 * this file must pass on either side of that merge.
 */

/** The one wording every consultation-language statement must use verbatim. */
const CONSULTATION_SENTENCE =
  'الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية';

/** The four consultation languages, as the Arabic pages name them. */
const CONSULTATION_LANGUAGE_TERMS = [
  'بالإنجليزية',
  'الصينية',
  'اليابانية',
  'الكورية',
] as const;

/**
 * Any mention of the Arabic language. `عربي` is the shared stem, so it also
 * matches العربية / بالعربية / عربية / العربي.
 */
const ARABIC_LANGUAGE_TOKEN = /عربي/;

/**
 * Consultation / interpreting vocabulary. A single sentence may never contain
 * one of these together with {@link ARABIC_LANGUAGE_TOKEN} — that is the shape
 * any "consultation available in Arabic" claim would take.
 */
const CONSULTATION_TOKENS: ReadonlyArray<readonly [string, RegExp]> = [
  ['استشارة', /استشار/],
  ['مستشار', /مستشار/],
  ['ترجمة فورية', /ترجمة فورية/],
  ['مترجم', /مترجم/],
  ['consultation', /\bconsultation\b/i],
  ['interpreting', /\binterpret/i],
];

/** Placeholders and review markers that must never ship in a string. */
const MARKER_PATTERNS: ReadonlyArray<readonly [string, RegExp]> = [
  ['TODO', /\bTODO\b/i],
  ['FIXME', /\bFIXME\b/i],
  ['TBD', /\bTBD\b/i],
  ['XXX', /XXX/],
  ['???', /\?\?\?/],
  ['확인 필요', /확인\s*필요/],
  ['[[…]]', /\[\[/],
  ['{{…}}', /\{\{/],
  ['lorem ipsum', /lorem ipsum/i],
  ['미확인', /미확인/],
];

/** Arabic-Indic and extended Arabic-Indic digits. Western 0-9 only. */
const NON_WESTERN_DIGITS = /[٠-٩۰-۹]/;

/** Thai script and Vietnamese-only letters: no other guidance locale may leak in. */
const FOREIGN_SCRIPT_LEAKS: ReadonlyArray<readonly [string, RegExp]> = [
  ['Thai script', /[฀-๿]/],
  [
    'Vietnamese diacritics',
    /[ạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹđ]/i,
  ],
];

/** Advertising claims the firm never makes. */
const ADVERTISING_PATTERNS: ReadonlyArray<readonly [string, RegExp]> = [
  ['نضمن النتيجة', /نضمن النتيجة/],
  ['نضمن لك', /نضمن لك/],
  ['معدل الفوز', /معدل الفوز/],
  ['نسبة النجاح', /نسبة النجاح/],
  ['أفضل مكتب', /أفضل مكتب/],
  ['المكتب الوحيد', /المكتب الوحيد/],
  ['الأفضل في', /الأفضل في/],
];

type Labelled = readonly [path: string, value: string];

/** Every string reachable from `value`, with a dotted path for the message. */
function collectStrings(value: unknown, path = ''): Labelled[] {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      collectStrings(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

/**
 * Structural fingerprint: key sets (sorted), array lengths and leaf types.
 * Comparing `ar` to `vi` this way proves the field set — and the section /
 * paragraph / item / FAQ counts — are identical, without comparing prose.
 */
function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, shapeOf(record[key])]),
    );
  }
  return typeof value;
}

function sentencesOf(text: string): string[] {
  return text
    .split(/(?<=[.!?؟])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

const ar: GuidanceLocaleContent = guidanceContent.ar;

/** Every Arabic string the guidance surface renders, content plus side packs. */
const AR_STRINGS: Labelled[] = [
  ...collectStrings(ar, 'guidanceContent.ar'),
  ...collectStrings(guidanceOfficeCopy.ar, 'guidanceOfficeCopy.ar'),
  ...collectStrings(guidanceFooterCopy.ar, 'guidanceFooterCopy.ar'),
  ...collectStrings(guidanceTeamCopy.ar, 'guidanceTeamCopy.ar'),
  ...collectStrings(guidanceLanguageNames.ar, 'guidanceLanguageNames.ar'),
  ...collectStrings(guidancePracticeAreaNames.ar, 'guidancePracticeAreaNames.ar'),
  ...collectStrings(guidanceTeamBios.ar, 'guidanceTeamBios.ar'),
  ...collectStrings(internationalInquiryCopy.ar, 'internationalInquiryCopy.ar'),
];

describe('guidanceContent.ar', () => {
  it('publishes all ten guidance page keys', () => {
    expect(Object.keys(ar.pages).sort()).toEqual([...GUIDANCE_PAGE_KEYS].sort());
    expect(GUIDANCE_PAGE_KEYS).toHaveLength(10);

    for (const key of GUIDANCE_PAGE_KEYS) {
      const page = ar.pages[key];
      expect(page, `pages.${key} missing`).toBeDefined();
      expect(page.title.trim().length, `pages.${key}.title empty`).toBeGreaterThan(0);
      expect(page.description.trim().length, `pages.${key}.description empty`).toBeGreaterThan(0);
    }
  });

  it('carries the same eight FAQ entries the other guidance locales carry', () => {
    expect(ar.pages.faq.faqs).toHaveLength(8);
    expect(guidanceContent.vi.pages.faq.faqs).toHaveLength(8);

    for (const [index, faq] of (ar.pages.faq.faqs ?? []).entries()) {
      expect(faq.question.trim().length, `faq ${index} question empty`).toBeGreaterThan(0);
      expect(faq.answer.trim().length, `faq ${index} answer empty`).toBeGreaterThan(0);
    }
  });

  it('has the identical field set and section shape as vi', () => {
    expect(shapeOf(guidanceContent.ar)).toEqual(shapeOf(guidanceContent.vi));
  });

  it('gives every side pack an ar entry', () => {
    expect(shapeOf(guidanceOfficeCopy.ar)).toEqual(shapeOf(guidanceOfficeCopy.vi));
    expect(shapeOf(guidanceFooterCopy.ar)).toEqual(shapeOf(guidanceFooterCopy.vi));
    expect(shapeOf(guidanceTeamCopy.ar)).toEqual(shapeOf(guidanceTeamCopy.vi));
    expect(shapeOf(guidanceTeamBios.ar)).toEqual(shapeOf(guidanceTeamBios.vi));
    expect(Object.keys(guidanceLanguageNames.ar).sort()).toEqual(
      Object.keys(guidanceLanguageNames.vi).sort(),
    );
    expect(Object.keys(guidancePracticeAreaNames.ar).sort()).toEqual(
      Object.keys(guidancePracticeAreaNames.vi).sort(),
    );
    expect(shapeOf(internationalInquiryCopy.ar)).toEqual(shapeOf(internationalInquiryCopy.vi));
  });

  it('is written in Arabic', () => {
    const arabicLetter = /[؀-ۿ]/;
    for (const [path, value] of collectStrings(ar, 'guidanceContent.ar')) {
      if (value.trim().length === 0) continue;
      expect(arabicLetter.test(value), `${path} has no Arabic script`).toBe(true);
    }
  });

  it('states the consultation languages with the one approved sentence', () => {
    const withSentence = AR_STRINGS.filter(([, value]) => value.includes(CONSULTATION_SENTENCE));
    expect(withSentence.length, 'the approved consultation sentence never appears').toBeGreaterThan(
      0,
    );

    const paths = withSentence.map(([path]) => path);
    expect(paths.some((path) => path.startsWith('guidanceContent.ar.pages.home'))).toBe(true);
    expect(paths.some((path) => path.startsWith('guidanceContent.ar.pages.contact'))).toBe(true);
    expect(paths.some((path) => path.startsWith('guidanceContent.ar.pages.faq'))).toBe(true);
    expect(internationalInquiryCopy.ar.consultationNotice).toContain(CONSULTATION_SENTENCE);

    for (const term of CONSULTATION_LANGUAGE_TERMS) {
      expect(CONSULTATION_SENTENCE).toContain(term);
    }
  });

  it('never pairs the Arabic language with a consultation or interpreting claim', () => {
    for (const [path, value] of AR_STRINGS) {
      for (const sentence of sentencesOf(value)) {
        if (!ARABIC_LANGUAGE_TOKEN.test(sentence)) continue;
        for (const [label, pattern] of CONSULTATION_TOKENS) {
          expect(
            pattern.test(sentence),
            `${path} pairs the Arabic language with "${label}": ${sentence}`,
          ).toBe(false);
        }
      }
    }
  });

  it('carries no review markers or placeholders', () => {
    for (const [path, value] of AR_STRINGS) {
      for (const [label, pattern] of MARKER_PATTERNS) {
        expect(pattern.test(value), `${path} contains the marker "${label}"`).toBe(false);
      }
    }
  });

  it('uses Western Arabic numerals only', () => {
    for (const [path, value] of AR_STRINGS) {
      expect(
        NON_WESTERN_DIGITS.test(value),
        `${path} uses Arabic-Indic digits: ${value}`,
      ).toBe(false);
    }
    // The years the English record already publishes survive the rule.
    const about = JSON.stringify(ar.pages.about);
    expect(about).toContain('2016');
    expect(about).toContain('2020');
  });

  it('does not leak another guidance locale', () => {
    for (const [path, value] of AR_STRINGS) {
      for (const [label, pattern] of FOREIGN_SCRIPT_LEAKS) {
        expect(pattern.test(value), `${path} contains ${label}`).toBe(false);
      }
    }
  });

  it('makes no advertising claim', () => {
    for (const [path, value] of AR_STRINGS) {
      for (const [label, pattern] of ADVERTISING_PATTERNS) {
        expect(pattern.test(value), `${path} contains the claim "${label}"`).toBe(false);
      }
    }
  });
});
