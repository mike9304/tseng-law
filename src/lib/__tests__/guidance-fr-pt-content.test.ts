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
  fr: 'La consultation en français est-elle possible ?',
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
    expect(text).not.toMatch(/Beratung auf Deutsch/i);
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
    expect(shapeOf(guidanceContent[locale])).toEqual(shapeOf(guidanceContent.de));
    expect(shapeOf(guidanceOfficeCopy[locale])).toEqual(shapeOf(guidanceOfficeCopy.de));
    expect(shapeOf(guidanceFooterCopy[locale])).toEqual(shapeOf(guidanceFooterCopy.de));
    expect(shapeOf(guidanceTeamCopy[locale])).toEqual(shapeOf(guidanceTeamCopy.de));
    expect(shapeOf(guidanceTeamBios[locale])).toEqual(shapeOf(guidanceTeamBios.de));
    expect(shapeOf(internationalInquiryCopy[locale])).toEqual(shapeOf(internationalInquiryCopy.de));
  });
});

describe('fr/pt attorney gender and language FAQ', () => {
  it('names Wei Tseng as a female attorney in French', () => {
    const text = allText('fr');
    expect(text).toMatch(/l[’']avocate Wei Tseng/);
    expect(guidanceContent.fr.home.columnsReviewLabel).toMatch(/avocate Wei Tseng/);
  });

  it('names Wei Tseng as a female attorney in Portuguese', () => {
    const text = allText('pt');
    expect(text).toMatch(/a advogada Wei Tseng/i);
    expect(guidanceContent.pt.home.columnsReviewLabel).toMatch(/advogada Wei Tseng/);
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

describe('fr/pt forbidden-token scan', () => {
  it('keeps French copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('fr')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.fr;
      for (const [label, pattern] of FR_FORBIDDEN) {
        if (isLanguageFaqQuestion && label === 'consultation en français') continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
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
