/**
 * WO-O33 — contract for the translated guidance biographies.
 *
 * The reported defect was that the attorney profiles read differently in the
 * four Southeast Asian languages: `guidanceTeamCopy` was localized but the
 * intro / education / experience lines under it were the English original,
 * introduced by a note saying so. `team-members.ts` already translates those
 * same lines for ko, zh-hant and ja — degree names and institution names
 * included — so `en` was the only original and the guidance four were the
 * exception. WO-O33 translated them.
 *
 * Translation is where facts drift, so this file pins the translation to the
 * canonical record instead of trusting it:
 *   - line counts equal `teamContent.en`, member by member and field by field;
 *   - every figure, currency code and institution name the English line
 *     carries survives byte-identically in every language;
 *   - the column checker's own `english` and `forbidden` rules see zero hits,
 *     so no line is silently left in English and no banned claim is smuggled
 *     into a biography;
 *   - no Hangul and no Han character appears where the English canonical has
 *     none.
 *
 * `guidanceLanguageNames` and the key-facts block are pinned the same way:
 * their value sets come from `attorney-profiles.en`, so adding a language or
 * a practice area to the canonical profile fails here until the guidance
 * languages name it.
 */

import { describe, expect, it } from 'vitest';

import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import {
  guidanceContent,
  type GuidanceLocale,
  type GuidancePageKey,
} from '@/data/international-guidance-content';
import {
  GUIDANCE_BIO_CODE_EXPANSIONS,
  GUIDANCE_BIO_PRESERVED_TERMS,
  GUIDANCE_TEAM_MEMBER_IDS,
  buildGuidanceQualificationSentence,
  guidanceLanguageNames,
  guidanceMemberLanguages,
  guidancePracticeAreaNames,
  guidanceTeamBios,
  guidanceTeamCopy,
  isGuidanceTeamMemberId,
  type GuidanceTeamMemberId,
} from '@/data/international-guidance-team';
import { teamContent } from '@/data/team-members';
import { buildGuidanceAttorneyFacts } from '@/lib/guidance-attorney-facts';
import { guidanceRosterTextBlocks } from '@/lib/guidance-roster-text';
import {
  findEnglishSentences,
  findForbiddenHits,
} from '../../../scripts/check-column-translation.mjs';

const LOCALES: GuidanceLocale[] = ['vi', 'id', 'th', 'fil'];
const BIO_FIELDS = ['intro', 'education', 'experience'] as const;

const HANGUL_RE = /[가-힣]/u;
const HAN_RE = /\p{Script=Han}/u;
/** Figures, with their decimal separator: "1.57" must not become "1,57". */
const NUMBER_RE = /\d[\d.,]*\d|\d/gu;
/** Currency and other all-caps codes: "TWD", "CPA". */
const CODE_RE = /\b[A-Z]{3,}\b/gu;

function canonicalMember(id: GuidanceTeamMemberId) {
  const member = teamContent.en.members.find((entry) => entry.id === id);
  if (!member) throw new Error(`teamContent.en has no member ${id}`);
  return member;
}

/** Every guidance-language string a reader sees inside the roster cards. */
function bioLines(locale: GuidanceLocale): string[] {
  return GUIDANCE_TEAM_MEMBER_IDS.flatMap((id) =>
    BIO_FIELDS.flatMap((field) => guidanceTeamBios[locale][id][field]),
  );
}

/**
 * Roster + key-facts strings, one entry per rendered text block.
 *
 * This is the same list the page renders — the browser gate asserts every
 * rendered line is a member of it — so running the checker rules here covers
 * the rendered surface, not a parallel copy of it.
 */
function rosterTextBlocks(locale: GuidanceLocale): string[] {
  return guidanceRosterTextBlocks(locale, { showIntro: true, includeFacts: true });
}

describe('guidance team biographies', () => {
  it('the roster covers exactly the canonical member ids', () => {
    expect(teamContent.en.members.filter((m) => isGuidanceTeamMemberId(m.id)).map((m) => m.id))
      .toEqual([...GUIDANCE_TEAM_MEMBER_IDS]);
  });

  it.each(LOCALES)('%s has one bio per canonical member', (locale) => {
    expect(Object.keys(guidanceTeamBios[locale]).sort()).toEqual(
      [...GUIDANCE_TEAM_MEMBER_IDS].sort(),
    );
  });

  for (const locale of LOCALES) {
    for (const id of GUIDANCE_TEAM_MEMBER_IDS) {
      for (const field of BIO_FIELDS) {
        it(`${locale} ${id} ${field} keeps the canonical line count`, () => {
          expect(guidanceTeamBios[locale][id][field]).toHaveLength(
            canonicalMember(id)[field].length,
          );
        });

        it(`${locale} ${id} ${field} keeps every canonical figure, code and name`, () => {
          const canonical = canonicalMember(id)[field];
          const localized = guidanceTeamBios[locale][id][field];
          canonical.forEach((sourceLine, index) => {
            const targetLine = localized[index];
            expect(targetLine, `${locale} ${id} ${field}[${index}] must not be empty`).toBeTruthy();

            for (const term of GUIDANCE_BIO_PRESERVED_TERMS) {
              if (!sourceLine.includes(term)) continue;
              expect(
                targetLine.includes(term),
                `${locale} ${id} ${field}[${index}] must keep "${term}" byte-identical`,
              ).toBe(true);
            }
            for (const figure of sourceLine.match(NUMBER_RE) ?? []) {
              expect(
                targetLine.includes(figure),
                `${locale} ${id} ${field}[${index}] must keep the figure "${figure}"`,
              ).toBe(true);
            }
            for (const code of sourceLine.match(CODE_RE) ?? []) {
              // An abbreviation may be written out, but only into the exact
              // expansion `GUIDANCE_BIO_CODE_EXPANSIONS` records — and that
              // record is itself checked against `teamContent.en` below.
              const expansion = GUIDANCE_BIO_CODE_EXPANSIONS[code];
              const kept = targetLine.includes(code)
                || (Boolean(expansion) && targetLine.includes(expansion));
              expect(
                kept,
                `${locale} ${id} ${field}[${index}] must keep the code "${code}"`
                  + (expansion ? ` or its canonical expansion "${expansion}"` : ''),
              ).toBe(true);
            }
          });
        });
      }
    }
  }

  it('every preserved term is a string the canonical record actually publishes', () => {
    const canonical = JSON.stringify(teamContent.en);
    for (const term of GUIDANCE_BIO_PRESERVED_TERMS) {
      expect(canonical.includes(term), `"${term}" is not in teamContent.en`).toBe(true);
    }
  });

  it('every abbreviation expansion is the canonical record\'s own wording', () => {
    const canonical = JSON.stringify(teamContent.en);
    for (const [code, expansion] of Object.entries(GUIDANCE_BIO_CODE_EXPANSIONS)) {
      expect(canonical.includes(code), `"${code}" is not in teamContent.en`).toBe(true);
      expect(
        canonical.includes(expansion),
        `"${expansion}" is not in teamContent.en, so it is an invention`,
      ).toBe(true);
    }
  });

  it.each(LOCALES)('%s roster and key facts contain no English sentence', (locale) => {
    const hits = rosterTextBlocks(locale).flatMap((block) => findEnglishSentences(block, 1));
    expect(hits.map((hit) => hit.text)).toEqual([]);
  });

  it.each(LOCALES)('%s roster and key facts contain no forbidden claim', (locale) => {
    const hits = rosterTextBlocks(locale).flatMap((block) => findForbiddenHits(block, locale, 1));
    expect(hits.map((hit) => `${hit.id}: ${hit.text}`)).toEqual([]);
  });

  it.each(LOCALES)('%s biographies add no Hangul and no Han character', (locale) => {
    const canonicalHasHan = teamContent.en.members.some((member) =>
      BIO_FIELDS.some((field) => member[field].some((line) => HAN_RE.test(line))),
    );
    expect(canonicalHasHan, 'teamContent.en bios are expected to carry no Han').toBe(false);
    for (const line of bioLines(locale)) {
      expect(HANGUL_RE.test(line), `Hangul in ${locale}: ${line}`).toBe(false);
      expect(HAN_RE.test(line), `Han in ${locale}: ${line}`).toBe(false);
    }
  });

  it.each(LOCALES)('%s biographies are not the English original', (locale) => {
    for (const id of GUIDANCE_TEAM_MEMBER_IDS) {
      const canonical = canonicalMember(id);
      // `experience` can legitimately be nothing but an organisation name.
      for (const field of ['intro', 'education'] as const) {
        canonical[field].forEach((sourceLine, index) => {
          expect(
            guidanceTeamBios[locale][id][field][index],
            `${locale} ${id} ${field}[${index}] is still the English line`,
          ).not.toBe(sourceLine);
        });
      }
    }
  });
});

describe('guidance key facts', () => {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);

  it('the canonical profile is readable', () => {
    expect(profile).toBeTruthy();
  });

  it.each(LOCALES)('%s names every canonical language and no other', (locale) => {
    expect(Object.keys(guidanceLanguageNames[locale]).sort()).toEqual(
      [...(profile?.languages ?? [])].sort(),
    );
    expect(guidanceMemberLanguages(locale, primaryAttorneySlug)).toHaveLength(
      profile?.languages.length ?? 0,
    );
  });

  it.each(LOCALES)('%s renders no language for a member the record has none for', (locale) => {
    expect(guidanceMemberLanguages(locale, undefined)).toEqual([]);
    expect(guidanceMemberLanguages(locale, 'not-a-slug')).toEqual([]);
  });

  it.each(LOCALES)('%s qualification sentence is a template over canonical values', (locale) => {
    const template = guidanceTeamCopy[locale].qualificationSentence;
    expect(template).toContain('{name}');
    expect(template).toContain('{firm}');
    const sentence = buildGuidanceQualificationSentence(locale, 'Wei Tseng', 'Some Firm');
    expect(sentence).toContain('Wei Tseng');
    expect(sentence).toContain('Some Firm');
    expect(sentence).not.toContain('{');
  });

  it.each(LOCALES)('%s key facts carry the canonical name and firm', (locale) => {
    const facts = buildGuidanceAttorneyFacts(locale);
    const member = teamContent.en.members.find((m) => m.profileSlug === primaryAttorneySlug);
    expect(facts).toBeTruthy();
    expect(facts?.qualification).toContain(member?.name);
    expect(facts?.qualification).toContain('Hovering International Law Firm');
    expect(facts?.heading).toContain('Wei Tseng');
  });

  /**
   * WO-O34. The practice list is the canonical `practiceAreas` array from
   * `attorney-profiles.en` — the same six areas, in the same order, that
   * `/en/lawyers` publishes — named in the page language. It is NOT the
   * services page's section headings, which are a different classification
   * (no "Visa and residency"; family and labour split in two).
   */
  it.each(LOCALES)('%s names exactly the canonical practice areas, no more and no fewer', (locale) => {
    expect(Object.keys(guidancePracticeAreaNames[locale])).toEqual(profile?.practiceAreas);
  });

  it.each(LOCALES)('%s practice list is the canonical six, in canonical order', (locale) => {
    const facts = buildGuidanceAttorneyFacts(locale);
    expect(facts?.practiceAreas).toEqual(
      (profile?.practiceAreas ?? []).map((area) => guidancePracticeAreaNames[locale][area]),
    );
    expect(facts?.practiceAreas).toHaveLength(profile?.practiceAreas.length ?? 0);
    for (const area of facts?.practiceAreas ?? []) {
      expect(area.trim()).not.toBe('');
    }
  });

  /**
   * The classification must be the same one in every language: the guidance
   * key facts may not fall back to the services headings, which is the defect
   * WO-O34 fixed.
   */
  it.each(LOCALES)('%s practice list is not the services page headings', (locale) => {
    const facts = buildGuidanceAttorneyFacts(locale);
    const headings = guidanceContent[locale].pages.services.sections.map((s) => s.heading);
    expect(facts?.practiceAreas).not.toEqual(headings.slice(0, facts?.practiceAreas.length ?? 0));
  });

  it.each(LOCALES)('%s practice values are distinct', (locale) => {
    const values = Object.values(guidancePracticeAreaNames[locale]);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe('guidance lawyers page composition', () => {
  it.each(LOCALES)('%s lawyers h1 is the team name, as on /en and /ja', (locale) => {
    expect(guidanceContent[locale].pages.lawyers.title).toBe(guidanceTeamCopy[locale].title);
    expect(guidanceContent[locale].pages.lawyers.description).toBe(
      guidanceTeamCopy[locale].description,
    );
  });

  it.each(LOCALES)('%s lawyers publishes no prose cards', (locale) => {
    const page = guidanceContent[locale].pages.lawyers;
    expect(page.sections).toEqual([]);
    expect(page.intro).toBe('');
  });

  it.each(LOCALES)('%s lawyers answer states no year the canonical record lacks', (locale) => {
    const answer = guidanceContent[locale].pages.lawyers;
    expect(answer.title).not.toMatch(/\b(19|20)\d{2}\b/u);
  });

  /**
   * K7. Not the `lawyers` page alone: all ten guidance pages must have the
   * same shape in all four languages, otherwise one language quietly carries
   * a section the others do not.
   */
  const PAGE_KEYS = Object.keys(guidanceContent.vi.pages) as GuidancePageKey[];

  it.each(PAGE_KEYS)('%s has the same section and FAQ counts in all four languages', (pageKey) => {
    const shape = LOCALES.map((locale) => {
      const page = guidanceContent[locale].pages[pageKey];
      return {
        locale,
        sections: page.sections.length,
        faqs: page.faqs?.length ?? 0,
      };
    });
    const [first, ...rest] = shape;
    for (const entry of rest) {
      expect(entry.sections, `${pageKey} sections ${entry.locale} vs ${first.locale}`).toBe(
        first.sections,
      );
      expect(entry.faqs, `${pageKey} faqs ${entry.locale} vs ${first.locale}`).toBe(first.faqs);
    }
  });
});
