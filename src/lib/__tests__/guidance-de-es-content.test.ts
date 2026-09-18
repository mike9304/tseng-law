import { describe, expect, it } from 'vitest';
import { guidanceContent } from '@/data/international-guidance-content';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { GUIDANCE_LLMS_NOTICES } from '@/lib/llms-txt';

const CONSULTATION_FOUR_DE = [
  'Englisch',
  'Chinesisch',
  'Japanisch',
  'Koreanisch',
] as const;

const CONSULTATION_FOUR_ES = ['inglés', 'chino', 'japonés', 'coreano'] as const;

function allText(locale: 'de' | 'es'): string {
  const pack = guidanceContent[locale];
  const pages = Object.values(pack.pages)
    .map((page) =>
      [
        page.eyebrow,
        page.title,
        page.description,
        page.intro,
        ...page.sections.flatMap((section) => [
          section.heading,
          ...section.paragraphs,
          ...(section.items ?? []),
        ]),
        ...(page.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
      ].join('\n'),
    )
    .join('\n');
  return [
    pack.footerNotice,
    pack.contactCta,
    JSON.stringify(pack.home),
    pages,
    JSON.stringify(internationalInquiryCopy[locale]),
    JSON.stringify(GUIDANCE_LLMS_NOTICES[locale]),
  ].join('\n');
}

describe('de/es guidance is a page language, not a consultation language', () => {
  it('names the four consultation languages on the German contact and FAQ surfaces', () => {
    const contact = guidanceContent.de.pages.contact.sections.map((section) => section.paragraphs.join(' ')).join(' ');
    const faq = (guidanceContent.de.pages.faq.faqs ?? []).map((item) => item.answer).join(' ');
    for (const term of CONSULTATION_FOUR_DE) {
      expect(`${contact}\n${faq}`).toContain(term);
    }
  });

  it('names the four consultation languages on the Spanish contact and FAQ surfaces', () => {
    const contact = guidanceContent.es.pages.contact.sections.map((section) => section.paragraphs.join(' ')).join(' ');
    const faq = (guidanceContent.es.pages.faq.faqs ?? []).map((item) => item.answer).join(' ');
    for (const term of CONSULTATION_FOUR_ES) {
      expect(`${contact}\n${faq}`).toContain(term);
    }
  });

  it('does not offer a German-language consultation or interpreter', () => {
    const text = allText('de');
    expect(text).not.toMatch(/Beratung auf Deutsch/i);
    expect(text).not.toMatch(/deutschsprachige Beratung/i);
    expect(text).not.toMatch(/Dolmetscher wird gestellt/i);
    expect(internationalInquiryCopy.de.languageOptions).not.toHaveProperty('de');
  });

  it('does not offer a Spanish-language consultation or interpreter', () => {
    const text = allText('es');
    expect(text).not.toMatch(/consulta en español/i);
    expect(text).not.toMatch(/abogados que hablan español/i);
    expect(text).toMatch(/no (prometemos|ponemos) intérprete/i);
    expect(internationalInquiryCopy.es.languageOptions).not.toHaveProperty('es');
  });
});
