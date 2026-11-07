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
import { GUIDANCE_PAGE_KEYS } from '@/lib/public-guidance';

const CONSULTATION_FOUR_FR = ['anglais', 'chinois', 'japonais', 'coréen'] as const;
const CONSULTATION_FOUR_PT = ['inglês', 'chinês', 'japonês', 'coreano'] as const;

const FR_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['taux de réussite', /taux de réussite/i],
  ['garanti', /garanti/i],
  ['garantie de résultat', /garantie de résultat/i],
  ['meilleur', /meilleur/i],
  ['unique', /\bunique\b/i],
  ['24h/24', /24h\/24/i],
  ['gratuit', /gratuit/i],
  ['consultation en français', /consultation en français/i],
  ['interprète', /interprète/i],
];

const PT_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['taxa de sucesso', /taxa de sucesso/i],
  ['garantido', /garantido/i],
  ['garantia de resultado', /garantia de resultado/i],
  ['melhor', /melhor/i],
  ['único', /único/i],
  ['24 horas', /24 horas/i],
  ['gratuito', /gratuito/i],
  ['consulta em português', /consulta em português/i],
  ['intérprete', /intérprete/i],
];

const LANGUAGE_FAQ_QUESTION = {
  fr: 'La consultation en français est-elle possible\u00a0?',
  pt: 'Posso ter uma consulta em português?',
} as const;

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

function packStrings(locale: 'fr' | 'pt'): Labelled[] {
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

function allText(locale: 'fr' | 'pt'): string {
  return packStrings(locale).map(([, value]) => value).join('\n');
}

function guidanceContentShapeWithoutContact(locale: 'de' | 'fr' | 'pt'): unknown {
  const pack = guidanceContent[locale];
  const { contact, ...pagesWithoutContact } = pack.pages;
  return shapeOf({ ...pack, pages: pagesWithoutContact });
}

function assertContactPageSections(locale: 'fr' | 'pt', sectionCount = 3): void {
  const sections = guidanceContent[locale].pages.contact.sections;
  expect(sections, `${locale} contact section count`).toHaveLength(sectionCount);
  for (const [index, section] of sections.entries()) {
    expect(typeof section.heading, `${locale} contact.sections[${index}].heading type`).toBe('string');
    expect(section.heading.trim().length, `${locale} contact.sections[${index}].heading empty`).toBeGreaterThan(0);
    expect(Array.isArray(section.paragraphs), `${locale} contact.sections[${index}].paragraphs`).toBe(true);
    expect(section.paragraphs?.length ?? 0, `${locale} contact.sections[${index}].paragraphs empty`).toBeGreaterThan(0);
    for (const paragraph of section.paragraphs ?? []) {
      expect(typeof paragraph).toBe('string');
      expect(paragraph.trim().length).toBeGreaterThan(0);
    }
    if (section.items !== undefined) {
      expect(Array.isArray(section.items)).toBe(true);
      for (const item of section.items ?? []) {
        expect(typeof item).toBe('string');
        expect(item.trim().length).toBeGreaterThan(0);
      }
    }
  }
}

function composedContactSurface(locale: 'fr' | 'pt'): string {
  return [
    guidanceAnswers[locale].contact?.answer ?? '',
    ...guidanceContent[locale].pages.contact.sections.flatMap((section) => [
      ...(section.paragraphs ?? []),
      ...(section.items ?? []),
    ]),
  ].join(' ');
}

const FR_GUARANTEE_DENIAL_PATTERNS: readonly RegExp[] = [
  /ne garantit ni/gi,
  /n['’]est garanti\b/gi,
];

function stripFrGuaranteeDenials(value: string): string {
  return FR_GUARANTEE_DENIAL_PATTERNS.reduce(
    (text, pattern) => text.replace(pattern, ''),
    value,
  );
}

describe('fr/pt guidance is a page language, not a consultation language', () => {
  it('names the four consultation languages on the French contact and FAQ surfaces', () => {
    const contact = guidanceContent.fr.pages.contact.sections.map((section) => section.paragraphs.join(' ')).join(' ');
    const faq = (guidanceContent.fr.pages.faq.faqs ?? []).map((item) => item.answer).join(' ');
    for (const term of CONSULTATION_FOUR_FR) {
      expect(`${contact}\n${faq}`).toContain(term);
    }
  });

  it('names the four consultation languages on the Portuguese contact and FAQ surfaces', () => {
    const contact = guidanceContent.pt.pages.contact.sections.map((section) => section.paragraphs.join(' ')).join(' ');
    const faq = (guidanceContent.pt.pages.faq.faqs ?? []).map((item) => item.answer).join(' ');
    for (const term of CONSULTATION_FOUR_PT) {
      expect(`${contact}\n${faq}`).toContain(term);
    }
  });

  it('does not offer a French-language consultation or interpreter', () => {
    const text = allText('fr');
    expect(text).not.toMatch(/conseil en français|avocats? francophones/i);
    expect(text).toMatch(/ne promettons pas non plus de service d[’']interprétation/i);
    expect(internationalInquiryCopy.fr.languageOptions).not.toHaveProperty('fr');
    expect(internationalInquiryCopy.fr.languageOptions).toHaveProperty('en');
    expect(internationalInquiryCopy.fr.languageOptions).toHaveProperty('needs-method-confirmation');
  });

  it('does not offer a Portuguese-language consultation or interpreter', () => {
    const text = allText('pt');
    expect(text).toMatch(/não prometemos serviço de interpretação/i);
    expect(internationalInquiryCopy.pt.languageOptions).not.toHaveProperty('pt');
    expect(internationalInquiryCopy.pt.languageOptions).toHaveProperty('en');
    expect(internationalInquiryCopy.pt.languageOptions).toHaveProperty('needs-method-confirmation');
  });
});

describe('fr/pt guidance packs are complete', () => {
  it.each(['fr', 'pt'] as const)('publishes all ten %s guidance page keys', (locale) => {
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

  it.each(['fr', 'pt'] as const)('carries the same eight FAQ entries as German on %s', (locale) => {
    expect(guidanceContent[locale].pages.faq.faqs).toHaveLength(8);
    expect(guidanceContent.de.pages.faq.faqs).toHaveLength(8);
  });

  it.each(['fr', 'pt'] as const)('has the identical field set and section shape as de on %s', (locale) => {
    expect(guidanceContentShapeWithoutContact(locale)).toEqual(guidanceContentShapeWithoutContact('de'));
    assertContactPageSections(locale, 3);
    expect(shapeOf(guidanceOfficeCopy[locale])).toEqual(shapeOf(guidanceOfficeCopy.de));
    expect(shapeOf(guidanceFooterCopy[locale])).toEqual(shapeOf(guidanceFooterCopy.de));
    expect(shapeOf(guidanceTeamCopy[locale])).toEqual(shapeOf(guidanceTeamCopy.de));
    expect(shapeOf(guidanceTeamBios[locale])).toEqual(shapeOf(guidanceTeamBios.de));
    expect(shapeOf(internationalInquiryCopy[locale])).toEqual(shapeOf(internationalInquiryCopy.de));
  });

  it('uses French fixed spaces before ? : ; and inside guillemets', () => {
    const text = allText('fr');
    expect(text).not.toMatch(/ [?!:;]/);
    expect(text).not.toMatch(/« /);
    expect(text).not.toMatch(/ »/);
  });
});

describe('fr/pt attorney gender and language FAQ', () => {
  it('names Wei Tseng as a female attorney in French', () => {
    const text = allText('fr');
    expect(text).toMatch(/l[’']avocate Wei Tseng/);
    expect(guidanceContent.fr.home.columnsReviewLabel).toBe('Droit taïwanais');
  });

  it('names Wei Tseng as a female attorney in Portuguese', () => {
    const text = allText('pt');
    expect(text).toMatch(/a advogada Wei Tseng/i);
    expect(guidanceContent.pt.home.columnsReviewLabel).toBe('Direito de Taiwan');
  });

  it('answers the French consultation-language FAQ in the negative', () => {
    const faq = (guidanceContent.fr.pages.faq.faqs ?? []).find(
      (item) => item.question === LANGUAGE_FAQ_QUESTION.fr,
    );
    expect(faq, 'French language FAQ missing').toBeDefined();
    expect(faq?.answer).toMatch(/^Non\./);
    expect(faq?.answer).toMatch(/seulement en anglais, en chinois \(中文\), en japonais et en coréen/);
  });

  it('answers the Portuguese consultation-language FAQ in the negative', () => {
    const faq = (guidanceContent.pt.pages.faq.faqs ?? []).find(
      (item) => item.question === LANGUAGE_FAQ_QUESTION.pt,
    );
    expect(faq, 'Portuguese language FAQ missing').toBeDefined();
    expect(faq?.answer).toMatch(/^Não\./);
    expect(faq?.answer).toMatch(/apenas em inglês, chinês \(中文\), japonês e coreano/);
  });
});

describe('fr guarantee denial stripping (regression)', () => {
  const garantiPattern = /garanti/i;

  it('accepts negative-only copy after stripping exact denial phrases', () => {
    expect(stripFrGuaranteeDenials('Le cabinet ne garantit ni résultat ni délai')).not.toMatch(garantiPattern);
    expect(stripFrGuaranteeDenials("Ce service n'est garanti par aucune promesse commerciale")).not.toMatch(
      garantiPattern,
    );
  });

  it('rejects positive-only copy', () => {
    expect(stripFrGuaranteeDenials('Nous garantissons un accompagnement dédié')).toMatch(garantiPattern);
  });

  it('rejects mixed negative then positive garanti', () => {
    const mixed = 'Le cabinet ne garantit ni délai, mais garantit un suivi personnalisé';
    expect(stripFrGuaranteeDenials(mixed)).toMatch(garantiPattern);
  });

  it('rejects mixed positive then negative garanti', () => {
    const mixed = 'garantit un accompagnement; le cabinet ne garantit ni résultat';
    expect(stripFrGuaranteeDenials(mixed)).toMatch(garantiPattern);
  });

  it('does not strip n’est garantie as the allowed n’est garanti denial token', () => {
    const feminine = 'La conformité n’est garantie par le cadre contractuel';
    expect(stripFrGuaranteeDenials(feminine)).toBe(feminine);
    expect(stripFrGuaranteeDenials(feminine)).toMatch(garantiPattern);
  });
});

describe('fr/pt forbidden-token scan', () => {
  it('uses exclusive limiters on French and Portuguese GEO answers and composed contact surfaces', () => {
    for (const [key, entry] of Object.entries(guidanceAnswers.fr)) {
      if (key === 'contact') continue;
      expect(entry.answer).toMatch(/seulement/i);
    }
    for (const [key, entry] of Object.entries(guidanceAnswers.pt)) {
      if (key === 'contact') continue;
      expect(entry.answer).toMatch(/apenas/i);
    }
    expect(composedContactSurface('fr')).toMatch(/seulement/i);
    expect(composedContactSurface('pt')).toMatch(/apenas/i);
  });

  it('keeps French copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('fr')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.fr;
      for (const [label, pattern] of FR_FORBIDDEN) {
        if (isLanguageFaqQuestion && label === 'consultation en français') continue;
        const scanned = label === 'garanti' ? stripFrGuaranteeDenials(value) : value;
        expect(scanned, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });

  it('keeps Portuguese copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('pt')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.pt;
      for (const [label, pattern] of PT_FORBIDDEN) {
        if (isLanguageFaqQuestion && label === 'consulta em português') continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });
});
