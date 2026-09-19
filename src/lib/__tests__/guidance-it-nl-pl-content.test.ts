import { describe, expect, it } from 'vitest';
import { guidanceAnswers } from '@/data/international-guidance-answers';
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
import { GUIDANCE_LLMS_NOTICES } from '@/lib/llms-txt';
import {
  GUIDANCE_CONSULTATION_LANGUAGE_LOCALES,
  GUIDANCE_PAGE_KEYS,
  isGuidanceConsultationLanguageLocale,
} from '@/lib/public-guidance';

const CONSULTATION_FOUR_IT = ['inglese', 'cinese', 'giapponese', 'coreano'] as const;
const CONSULTATION_FOUR_NL = ['Engels', 'Chinees', 'Japans', 'Koreaans'] as const;
const CONSULTATION_FOUR_PL = ['angielsk', 'chińsk', 'japońsk', 'koreańsk'] as const;

const IT_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['tasso di successo', /tasso di successo/i],
  ['garantiamo', /garantiamo/i],
  ['il migliore', /il migliore/i],
  ['l’unico', /l’unico/i],
  ['consulenza gratuita', /consulenza gratuita/i],
  ['24 ore su 24', /24 ore su 24/i],
  ['consulenza in italiano', /consulenza in italiano/i],
];

const NL_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['succespercentage', /succespercentage/i],
  ['we garanderen', /we garanderen/i],
  ['de beste', /de beste/i],
  ['de enige', /de enige/i],
  ['gratis consultatie', /gratis consultatie/i],
  ['24 uur per dag', /24 uur per dag/i],
  ['advies in het Nederlands', /advies in het Nederlands/i],
];

const PL_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['wskaźnik sukcesu', /wskaźnik sukcesu/i],
  ['gwarantujemy', /gwarantujemy/i],
  ['najlepsz', /najlepsz/i],
  ['jedyna', /jedyna/i],
  ['bezpłatna konsultacja', /bezpłatna konsultacja/i],
  ['całodobowo', /całodobowo/i],
  ['konsultacja po polsku', /konsultacja po polsku/i],
];

const LANGUAGE_FAQ_QUESTION = {
  it: 'È possibile una consulenza in italiano?',
  nl: 'Kan ik in het Nederlands worden geadviseerd?',
  pl: 'Czy możliwa jest konsultacja po polsku?',
} as const;

type NewGuidanceLocale = 'it' | 'nl' | 'pl';
type Labelled = readonly [path: string, value: string];

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

function packStrings(locale: NewGuidanceLocale): Labelled[] {
  return [
    ...collectStrings(guidanceContent[locale], `guidanceContent.${locale}`),
    ...collectStrings(guidanceOfficeCopy[locale], `guidanceOfficeCopy.${locale}`),
    ...collectStrings(guidanceFooterCopy[locale], `guidanceFooterCopy.${locale}`),
    ...collectStrings(guidanceTeamCopy[locale], `guidanceTeamCopy.${locale}`),
    ...collectStrings(guidanceLanguageNames[locale], `guidanceLanguageNames.${locale}`),
    ...collectStrings(guidancePracticeAreaNames[locale], `guidancePracticeAreaNames.${locale}`),
    ...collectStrings(guidanceTeamBios[locale], `guidanceTeamBios.${locale}`),
    ...collectStrings(internationalInquiryCopy[locale], `internationalInquiryCopy.${locale}`),
    ...collectStrings(GUIDANCE_LLMS_NOTICES[locale], `GUIDANCE_LLMS_NOTICES.${locale}`),
    ...collectStrings(guidanceAnswers[locale], `guidanceAnswers.${locale}`),
  ];
}

function allText(locale: NewGuidanceLocale): string {
  return packStrings(locale).map(([, value]) => value).join('\n');
}

describe('it/nl/pl guidance language contract', () => {
  it('names the four consultation languages on the Italian, Dutch and Polish contact and FAQ surfaces', () => {
    const packs = [
      ['it', CONSULTATION_FOUR_IT],
      ['nl', CONSULTATION_FOUR_NL],
      ['pl', CONSULTATION_FOUR_PL],
    ] as const;
    for (const [locale, terms] of packs) {
      const contact = guidanceContent[locale].pages.contact.sections.map((section) => section.paragraphs.join(' ')).join(' ');
      const faq = (guidanceContent[locale].pages.faq.faqs ?? []).map((item) => item.answer).join(' ');
      for (const term of terms) {
        expect(`${contact}\n${faq}`, `${locale} missing ${term}`).toContain(term);
      }
    }
  });

  it('does not treat Italian, Dutch or Polish as consultation languages', () => {
    expect(GUIDANCE_CONSULTATION_LANGUAGE_LOCALES).toEqual(['zh-hans']);
    expect(isGuidanceConsultationLanguageLocale('it')).toBe(false);
    expect(isGuidanceConsultationLanguageLocale('nl')).toBe(false);
    expect(isGuidanceConsultationLanguageLocale('pl')).toBe(false);
  });

  it('does not offer Italian, Dutch or Polish as a consultation language on the inquiry form', () => {
    expect(internationalInquiryCopy.it.languageOptions).not.toHaveProperty('it');
    expect(internationalInquiryCopy.nl.languageOptions).not.toHaveProperty('nl');
    expect(internationalInquiryCopy.pl.languageOptions).not.toHaveProperty('pl');
    expect(internationalInquiryCopy.it.languageOptions).toHaveProperty('en');
    expect(internationalInquiryCopy.nl.languageOptions).toHaveProperty('needs-method-confirmation');
  });
});

describe('it/nl/pl guidance packs are complete', () => {
  it.each(['it', 'nl', 'pl'] as const)('publishes all ten %s guidance page keys', (locale) => {
    const pack: GuidanceLocaleContent = guidanceContent[locale];
    expect(Object.keys(pack.pages).sort()).toEqual([...GUIDANCE_PAGE_KEYS].sort());
    expect(GUIDANCE_PAGE_KEYS).toHaveLength(10);
    for (const key of GUIDANCE_PAGE_KEYS) {
      const page = pack.pages[key];
      expect(page, `pages.${key} missing`).toBeDefined();
      expect(page.title.trim().length, `pages.${key}.title empty`).toBeGreaterThan(0);
      expect(page.description.trim().length, `pages.${key}.description empty`).toBeGreaterThan(0);
    }
  });

  it.each(['it', 'nl', 'pl'] as const)('carries the same eight FAQ entries as German on %s', (locale) => {
    expect(guidanceContent[locale].pages.faq.faqs).toHaveLength(8);
    expect(guidanceContent.de.pages.faq.faqs).toHaveLength(8);
  });

  it.each(['it', 'nl', 'pl'] as const)('has the identical field set and section shape as de on %s', (locale) => {
    expect(shapeOf(guidanceContent[locale])).toEqual(shapeOf(guidanceContent.de));
    expect(shapeOf(guidanceOfficeCopy[locale])).toEqual(shapeOf(guidanceOfficeCopy.de));
    expect(shapeOf(guidanceFooterCopy[locale])).toEqual(shapeOf(guidanceFooterCopy.de));
    expect(shapeOf(guidanceTeamCopy[locale])).toEqual(shapeOf(guidanceTeamCopy.de));
    expect(shapeOf(guidanceTeamBios[locale])).toEqual(shapeOf(guidanceTeamBios.de));
    expect(shapeOf(internationalInquiryCopy[locale])).toEqual(shapeOf(internationalInquiryCopy.de));
  });

  it.each(['it', 'nl', 'pl'] as const)('keeps every %s nav label at or under 14 characters', (locale) => {
    for (const [key, label] of Object.entries(guidanceContent[locale].nav)) {
      expect(label.length, `${locale}.nav.${key}="${label}"`).toBeLessThanOrEqual(14);
    }
  });
});

describe('it/nl/pl attorney gender and language FAQ', () => {
  it('names Wei Tseng as l’avvocata in Italian', () => {
    const text = allText('it');
    expect(text).toMatch(/l’avvocata Wei Tseng/i);
    expect(guidanceContent.it.home.columnsReviewLabel).toMatch(/avvocata Wei Tseng/);
  });

  it('names Wei Tseng with gender-neutral advocaat and feminine pronouns in Dutch', () => {
    expect(allText('nl')).toMatch(/advocaat Wei Tseng/i);
    expect(guidanceTeamBios.nl['tseng-junwei'].intro.join(' ')).toMatch(/\bzij\b/i);
  });

  it('names Wei Tseng as adwokat with feminine agreement in Polish, not adwokatka', () => {
    const text = allText('pl');
    expect(text).toMatch(/[Aa]dwokat Wei Tseng/);
    expect(text).not.toMatch(/adwokatka/i);
    expect(guidanceTeamCopy.pl.qualificationSentence).toMatch(/uprawniona/);
  });

  it.each(['it', 'nl', 'pl'] as const)('answers the %s consultation-language FAQ in the negative', (locale) => {
    expect(isGuidanceConsultationLanguageLocale(locale)).toBe(false);
    const faq = (guidanceContent[locale].pages.faq.faqs ?? []).find(
      (item) => item.question === LANGUAGE_FAQ_QUESTION[locale],
    );
    expect(faq, `${locale} language FAQ missing`).toBeDefined();
    if (locale === 'it') {
      expect(faq?.answer).toMatch(/^No\./);
      expect(faq?.answer).toMatch(/inglese, cinese \(中文\), giapponese e coreano/);
    }
    if (locale === 'nl') {
      expect(faq?.answer).toMatch(/^Nee\./);
      expect(faq?.answer).toMatch(/Engels, Chinees \(中文\), Japans en Koreaans/);
    }
    if (locale === 'pl') {
      expect(faq?.answer).toMatch(/^Nie\./);
      expect(faq?.answer).toMatch(/angielskim, chińskim \(中文\), japońskim i koreańskim/);
    }
  });
});

describe('it/nl/pl forbidden-token scan', () => {
  it('keeps Italian copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('it')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.it;
      for (const [label, pattern] of IT_FORBIDDEN) {
        if (isLanguageFaqQuestion && label === 'consulenza in italiano') continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });

  it('keeps Dutch copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('nl')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.nl;
      for (const [label, pattern] of NL_FORBIDDEN) {
        if (isLanguageFaqQuestion) continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });

  it('keeps Polish copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('pl')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.pl;
      for (const [label, pattern] of PL_FORBIDDEN) {
        if (isLanguageFaqQuestion && label === 'konsultacja po polsku') continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });
});
