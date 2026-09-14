/**
 * The same fact, stated in two modules, must move in both.
 *
 * WO-O35 C. `ba159c3c` added the Taipei office to
 * `international-guidance-content.ts` (home + about), taking the firm from
 * three offices to four, and left `international-guidance-answers.ts` naming
 * three. WO-O34 corrected the four answers by hand; nothing stopped the next
 * edit from splitting them again, because no test read the two modules
 * together.
 *
 * What this file asserts, entirely from the canonical modules — no city name,
 * office count or client country is written down here:
 *
 * 1. `office-locations.ts` is the register of offices. `guidanceOfficeCopy`
 *    must name exactly those offices, so the locale city-name map below has a
 *    value for every office and no value for an office that does not exist.
 * 2. Any guidance string that enumerates offices (two or more of them) must
 *    enumerate all of them. That is the shape the regression took: an answer
 *    listing three of four offices.
 * 3. `guidanceAnswers[locale].about` is such a string in every locale — the
 *    one an engine quotes for "where is the firm" — so it is asserted directly
 *    rather than only by the general rule.
 * 4. The Wei Tseng client sentence in `guidanceAnswers[locale].lawyers` may not
 *    name a client country the `guidanceContent[locale]` sentence does not.
 *    Containment, not equality: the answer is a summary and may say less.
 */

import { describe, expect, it } from 'vitest';

import { guidanceAnswers } from '@/data/international-guidance-answers';
import { guidanceContent, type GuidanceLocale } from '@/data/international-guidance-content';
import {
  guidanceOfficeCopy,
  type GuidanceOfficeId,
} from '@/data/international-guidance-offices';
import { taiwanOfficeData } from '@/data/office-locations';

const LOCALES: GuidanceLocale[] = ['vi', 'id', 'th', 'fil'];

/**
 * The office register. `office-locations.ts` is the canonical record every
 * other module renders from (`OfficeMapTabs` and the guidance office band both
 * read `taiwanOfficeData`), so the office set is read from it and never typed
 * out here. Any locale would do — the ids are locale-independent — and `en` is
 * the one the guidance band itself reads.
 */
const CANONICAL_OFFICE_IDS: readonly string[] = taiwanOfficeData.en.map((office) => office.id);

/**
 * The single locale→city-name map: the office band's own labels.
 *
 * The guidance answers write city names in the page language ("Đài Bắc",
 * "ไทเป"), so comparing them with `office-locations.ts` needs a translation of
 * the office id into each language. `guidanceOfficeCopy[locale].officeTitles`
 * already is that translation — it is what the office band prints — so this
 * test uses it instead of introducing a second list that could itself drift.
 */
function cityNames(locale: GuidanceLocale): string[] {
  const titles = guidanceOfficeCopy[locale].officeTitles;
  return CANONICAL_OFFICE_IDS.map((id) => titles[id as GuidanceOfficeId]);
}

/** Every string reachable in a locale's content/answers record, with its path. */
function collectStrings(value: unknown, path = ''): Array<{ path: string; text: string }> {
  if (typeof value === 'string') return [{ path, text: value }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      collectStrings(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

function namedCities(text: string, cities: string[]): string[] {
  return cities.filter((city) => text.includes(city));
}

/**
 * Client countries the Wei Tseng sentences name, per language.
 *
 * The one table this file does write down, because no data module holds the
 * country vocabulary of the four guidance languages. It maps a country to the
 * word each language uses for it, so the assertion compares country sets and
 * not spellings: Tagalog says "Koreano"/"Hapon" in the bio and "Korea"/"Japan"
 * elsewhere, and both must resolve to the same two countries.
 */
const CLIENT_COUNTRY_TERMS: Record<GuidanceLocale, Record<string, string[]>> = {
  vi: { Korea: ['Hàn Quốc'], Japan: ['Nhật Bản'] },
  id: { Korea: ['Korea'], Japan: ['Jepang'] },
  th: { Korea: ['เกาหลี'], Japan: ['ญี่ปุ่น'] },
  fil: { Korea: ['Korea'], Japan: ['Hapon', 'Japan'] },
};

/** The attorney's Chinese name; how the same sentence is found in both modules. */
const WEI_TSENG_HANZI = '曾雋崴';

function clientCountries(locale: GuidanceLocale, text: string): string[] {
  return Object.entries(CLIENT_COUNTRY_TERMS[locale])
    .filter(([, terms]) => terms.some((term) => text.includes(term)))
    .map(([country]) => country)
    .sort();
}

describe('guidance office facts stay in sync with the canonical records', () => {
  it('names every office in the register, and no other', () => {
    expect(CANONICAL_OFFICE_IDS.length).toBeGreaterThan(0);
    for (const locale of LOCALES) {
      expect(Object.keys(guidanceOfficeCopy[locale].officeTitles).sort()).toEqual(
        [...CANONICAL_OFFICE_IDS].sort(),
      );
      for (const city of cityNames(locale)) {
        expect(city, `${locale} office title`).toBeTruthy();
      }
    }
  });

  it.each(LOCALES)('%s: the about answer names all four offices', (locale) => {
    const answer = guidanceAnswers[locale].about?.answer;
    expect(answer, `${locale} about answer`).toBeTruthy();
    const cities = cityNames(locale);
    expect(namedCities(answer as string, cities)).toEqual(cities);
  });

  it.each(LOCALES)(
    '%s: any guidance string that enumerates offices enumerates all of them',
    (locale) => {
      const cities = cityNames(locale);
      const sources = [
        ...collectStrings(guidanceContent[locale], 'content'),
        ...collectStrings(guidanceAnswers[locale], 'answers'),
      ];
      const partial = sources
        .map((entry) => ({ ...entry, named: namedCities(entry.text, cities) }))
        .filter((entry) => entry.named.length >= 2 && entry.named.length < cities.length);
      expect(
        partial.map((entry) => `${entry.path}: ${entry.named.join(', ')}`),
        `these ${locale} strings list some offices but not all — office-locations.ts has ${cities.join(', ')}`,
      ).toEqual([]);
      // The rule is only a guard if something is actually enumerating offices.
      const full = sources.filter((entry) => namedCities(entry.text, cities).length === cities.length);
      expect(full.length, `${locale} strings enumerating every office`).toBeGreaterThan(0);
    },
  );

  it.each(LOCALES)(
    '%s: the answer names no Wei Tseng client country the page copy omits',
    (locale) => {
      const answer = guidanceAnswers[locale].lawyers?.answer;
      expect(answer, `${locale} lawyers answer`).toContain(WEI_TSENG_HANZI);

      const contentSentences = collectStrings(guidanceContent[locale])
        .map((entry) => entry.text)
        .filter((text) => text.includes(WEI_TSENG_HANZI) && clientCountries(locale, text).length > 0);
      expect(contentSentences.length, `${locale} content sentence naming ${WEI_TSENG_HANZI}`).toBeGreaterThan(0);

      const inContent = new Set(contentSentences.flatMap((text) => clientCountries(locale, text)));
      const inAnswer = clientCountries(locale, answer as string);
      expect(inAnswer.length, `${locale} answer client countries`).toBeGreaterThan(0);
      expect(
        inAnswer.filter((country) => !inContent.has(country)),
        `${locale} answer claims client countries the page copy does not`,
      ).toEqual([]);
    },
  );
});
