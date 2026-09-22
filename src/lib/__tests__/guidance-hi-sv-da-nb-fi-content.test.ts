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

const CONSULTATION_FOUR_HI = ['अंग्रेज़ी', 'चीनी', 'जापानी', 'कोरियाई'] as const;
const CONSULTATION_FOUR_SV = ['engelska', 'kinesiska', 'japanska', 'koreanska'] as const;
const CONSULTATION_FOUR_DA = ['engelsk', 'kinesisk', 'japansk', 'koreansk'] as const;
const CONSULTATION_FOUR_NB = ['engelsk', 'kinesisk', 'japansk', 'koreansk'] as const;
const CONSULTATION_FOUR_FI = ['englanniksi', 'kiinaksi', 'japaniksi', 'koreaksi'] as const;

const HI_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['जीत की दर', /जीत की दर/],
  ['गारंटी', /गारंटी/],
  ['सर्वश्रेष्ठ', /सर्वश्रेष्ठ/],
  ['एकमात्र', /एकमात्र/],
  ['मुफ्त परामर्श', /मुफ्त परामर्श/],
  ['24 घंटे', /24 घंटे/],
  ['हिंदी में परामर्श', /हिंदी में परामर्श|हिन्दी में परामर्श/],
];

const SV_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['framgångsgrad', /framgångsgrad/i],
  ['garanti', /garanti/i],
  ['bäst', /\bbäst\b/i],
  ['enda', /\benda\b/i],
  ['gratis konsultation', /gratis konsultation/i],
  ['24/7', /24\/7/],
];

const DA_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['succesrate', /succesrate/i],
  ['garanti', /garanti/i],
  ['bedst', /\bbedst\b/i],
  ['eneste', /\beneste\b/i],
  ['gratis rådgivning', /gratis rådgivning/i],
  ['24/7', /24\/7/],
];

const NB_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['suksessrate', /suksessrate/i],
  ['garanti', /garanti/i],
  ['best', /\bbest\b/i],
  ['eneste', /\beneste\b/i],
  ['gratis konsultasjon', /gratis konsultasjon/i],
  ['24/7', /24\/7/],
];

const FI_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['voittoprosentti', /voittoprosentti/i],
  ['takuu', /takuu/i],
  ['paras', /\bparas\b/i],
  ['ainoa', /\bainoa\b/i],
  ['ilmainen konsultaatio', /ilmainen konsultaatio/i],
  ['24/7', /24\/7/],
];

const LANGUAGE_FAQ_QUESTION = {
  hi: 'क्या हिंदी में परामर्श संभव है?',
  sv: 'Kan jag få rådgivning på svenska?',
  da: 'Kan jeg få rådgivning på dansk?',
  nb: 'Kan jeg få rådgivning på norsk?',
  fi: 'Voitteko saada neuvontaa suomeksi?',
} as const;

type NewGuidanceLocale = 'hi' | 'sv' | 'da' | 'nb' | 'fi';
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

describe('hi/sv/da/nb/fi guidance language contract', () => {
  it('names the four consultation languages on the contact and FAQ surfaces', () => {
    const packs = [
      ['hi', CONSULTATION_FOUR_HI],
      ['sv', CONSULTATION_FOUR_SV],
      ['da', CONSULTATION_FOUR_DA],
      ['nb', CONSULTATION_FOUR_NB],
      ['fi', CONSULTATION_FOUR_FI],
    ] as const;
    for (const [locale, terms] of packs) {
      const contact = guidanceContent[locale].pages.contact.sections.map((section) => section.paragraphs.join(' ')).join(' ');
      const faq = (guidanceContent[locale].pages.faq.faqs ?? []).map((item) => item.answer).join(' ');
      for (const term of terms) {
        expect(`${contact}\n${faq}`, `${locale} missing ${term}`).toContain(term);
      }
    }
  });

  it('does not treat Hindi, Swedish, Danish, Norwegian or Finnish as consultation languages', () => {
    expect(GUIDANCE_CONSULTATION_LANGUAGE_LOCALES).toEqual(['zh-hans']);
    expect(isGuidanceConsultationLanguageLocale('hi')).toBe(false);
    expect(isGuidanceConsultationLanguageLocale('sv')).toBe(false);
    expect(isGuidanceConsultationLanguageLocale('da')).toBe(false);
    expect(isGuidanceConsultationLanguageLocale('nb')).toBe(false);
    expect(isGuidanceConsultationLanguageLocale('fi')).toBe(false);
  });

  it('does not offer the five locales as consultation languages on the inquiry form', () => {
    expect(internationalInquiryCopy.hi.languageOptions).not.toHaveProperty('hi');
    expect(internationalInquiryCopy.sv.languageOptions).not.toHaveProperty('sv');
    expect(internationalInquiryCopy.da.languageOptions).not.toHaveProperty('da');
    expect(internationalInquiryCopy.nb.languageOptions).not.toHaveProperty('nb');
    expect(internationalInquiryCopy.fi.languageOptions).not.toHaveProperty('fi');
    expect(internationalInquiryCopy.hi.languageOptions).toHaveProperty('en');
    expect(internationalInquiryCopy.sv.languageOptions).toHaveProperty('needs-method-confirmation');
  });
});

describe('hi/sv/da/nb/fi guidance packs are complete', () => {
  it.each(['hi', 'sv', 'da', 'nb', 'fi'] as const)('publishes all ten %s guidance page keys', (locale) => {
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

  it.each(['hi', 'sv', 'da', 'nb', 'fi'] as const)('carries the same eight FAQ entries as German on %s', (locale) => {
    expect(guidanceContent[locale].pages.faq.faqs).toHaveLength(8);
    expect(guidanceContent.de.pages.faq.faqs).toHaveLength(8);
  });

  it.each(['hi', 'sv', 'da', 'nb', 'fi'] as const)('has the identical field set and section shape as de on %s', (locale) => {
    expect(shapeOf(guidanceContent[locale])).toEqual(shapeOf(guidanceContent.de));
    expect(shapeOf(guidanceOfficeCopy[locale])).toEqual(shapeOf(guidanceOfficeCopy.de));
    expect(shapeOf(guidanceFooterCopy[locale])).toEqual(shapeOf(guidanceFooterCopy.de));
    expect(shapeOf(guidanceTeamCopy[locale])).toEqual(shapeOf(guidanceTeamCopy.de));
    expect(shapeOf(guidanceTeamBios[locale])).toEqual(shapeOf(guidanceTeamBios.de));
    expect(shapeOf(internationalInquiryCopy[locale])).toEqual(shapeOf(internationalInquiryCopy.de));
  });

  it.each(['hi', 'sv', 'da', 'nb', 'fi'] as const)('keeps every %s nav label at or under 14 characters', (locale) => {
    for (const [key, label] of Object.entries(guidanceContent[locale].nav)) {
      expect(label.length, `${locale}.nav.${key}="${label}"`).toBeLessThanOrEqual(14);
    }
  });
});

describe('hi/sv/da/nb/fi attorney gender and language FAQ', () => {
  it('names Wei Tseng as अधिवक्ता with feminine agreement in Hindi, not वकीला', () => {
    const text = allText('hi');
    expect(text).toMatch(/अधिवक्ता Wei Tseng/);
    expect(text).not.toMatch(/वकीला/);
    expect(guidanceTeamBios.hi['tseng-junwei'].intro.join(' ')).toMatch(/उन्होंने|वह/);
  });

  it('names Wei Tseng as advokat with hon/henne in Swedish', () => {
    expect(allText('sv')).toMatch(/advokat Wei Tseng/i);
    expect(guidanceTeamBios.sv['tseng-junwei'].intro.join(' ')).toMatch(/\b[Hh]on\b/);
  });

  it('names Wei Tseng as advokat with hun/hende in Danish', () => {
    expect(allText('da')).toMatch(/advokat Wei Tseng/i);
    expect(guidanceTeamBios.da['tseng-junwei'].intro.join(' ')).toMatch(/\b[Hh]un\b/);
  });

  it('names Wei Tseng as advokat with hun/henne in Norwegian', () => {
    expect(allText('nb')).toMatch(/advokat Wei Tseng/i);
    expect(guidanceTeamBios.nb['tseng-junwei'].intro.join(' ')).toMatch(/\b[Hh]un\b/);
  });

  it('names Wei Tseng as asianajaja in Finnish', () => {
    expect(allText('fi')).toMatch(/asianajaja Wei Tseng/i);
  });

  it.each(['hi', 'sv', 'da', 'nb', 'fi'] as const)('answers the %s consultation-language FAQ in the negative', (locale) => {
    expect(isGuidanceConsultationLanguageLocale(locale)).toBe(false);
    const faq = (guidanceContent[locale].pages.faq.faqs ?? []).find(
      (item) => item.question === LANGUAGE_FAQ_QUESTION[locale],
    );
    expect(faq, `${locale} language FAQ missing`).toBeDefined();
    if (locale === 'hi') {
      expect(faq?.answer).toMatch(/^नहीं।/);
      expect(faq?.answer).toMatch(/अंग्रेज़ी, चीनी \(中文\), जापानी और कोरियाई/);
    }
    if (locale === 'sv') {
      expect(faq?.answer).toMatch(/^Nej\./);
      expect(faq?.answer).toMatch(/engelska, kinesiska \(中文\), japanska och koreanska/);
    }
    if (locale === 'da') {
      expect(faq?.answer).toMatch(/^Nej\./);
      expect(faq?.answer).toMatch(/engelsk, kinesisk \(中文\), japansk og koreansk/);
    }
    if (locale === 'nb') {
      expect(faq?.answer).toMatch(/^Nei\./);
      expect(faq?.answer).toMatch(/engelsk, kinesisk \(中文\), japansk og koreansk/);
    }
    if (locale === 'fi') {
      expect(faq?.answer).toMatch(/^Ei\./);
      expect(faq?.answer).toMatch(/englanniksi, kiinaksi \(中文\), japaniksi ja koreaksi/);
    }
  });
});

describe('hi/sv/da/nb/fi forbidden-token scan', () => {
  it('keeps Hindi copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('hi')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.hi;
      for (const [label, pattern] of HI_FORBIDDEN) {
        if (isLanguageFaqQuestion && label === 'हिंदी में परामर्श') continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });

  it('keeps Swedish copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('sv')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.sv;
      for (const [label, pattern] of SV_FORBIDDEN) {
        if (isLanguageFaqQuestion) continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });

  it('keeps Danish copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('da')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.da;
      for (const [label, pattern] of DA_FORBIDDEN) {
        if (isLanguageFaqQuestion) continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });

  it('keeps Norwegian copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('nb')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.nb;
      for (const [label, pattern] of NB_FORBIDDEN) {
        if (isLanguageFaqQuestion) continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });

  it('keeps Finnish copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('fi')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.fi;
      for (const [label, pattern] of FI_FORBIDDEN) {
        if (isLanguageFaqQuestion) continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });
});
