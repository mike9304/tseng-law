import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import GuidancePageBody, { GuidanceNotFoundBody } from '@/components/GuidancePageBody';
import JsonLd from '@/components/JsonLd';
import {
  guidanceContent,
  type GuidanceLocale,
  type GuidancePageKey,
} from '@/data/international-guidance-content';
import { GUIDANCE_LOCALES_4, guidanceCanonicalUrl } from '@/lib/public-guidance';
import {
  ATTORNEY_PERSON_ID,
  GUIDANCE_CONSULTATION_LANGUAGES,
  buildGuidanceFaqJsonLd,
  buildGuidanceLegalServiceJsonLd,
  buildLegalServiceJsonLd,
} from '@/lib/seo';

const CONSULTATION_LANGUAGES = ['en', 'zh-Hant', 'ja', 'ko'];
const SCRIPT_PATTERN = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu;

/**
 * Renders the component that actually serves a guidance page since O14:
 * `[locale]/[[...slug]]/page.tsx` → `GuidancePageBody`. The old
 * `InternationalGuidance` shell no longer renders pages (only its
 * `OriginalLanguageColumnsSection` export survives), so the JSON-LD contract is
 * asserted against the real render path.
 */
function renderGuidance(locale: GuidanceLocale, pageKey: GuidancePageKey): string {
  return renderToStaticMarkup(GuidancePageBody({ locale, pageKey }) as ReactElement);
}

/** The localized 404 body, which must stay free of structured data. */
function renderNotFound(locale: GuidanceLocale): string {
  return renderToStaticMarkup(GuidanceNotFoundBody({ locale }) as ReactElement);
}

function parseJsonLdNodes(markup: string): Array<Record<string, unknown>> {
  const nodes: Array<Record<string, unknown>> = [];
  for (const match of markup.matchAll(SCRIPT_PATTERN)) {
    // JSON.parse must succeed on the escaped payload the page actually ships.
    nodes.push(JSON.parse(match[1]) as Record<string, unknown>);
  }
  return nodes;
}

function nodeOfType(markup: string, type: string): Record<string, unknown> | undefined {
  return parseJsonLdNodes(markup).find((node) => node['@type'] === type);
}

describe('guidance FAQPage JSON-LD', () => {
  it.each(GUIDANCE_LOCALES_4)(
    'emits every %s FAQ verbatim on the faq page',
    (locale) => {
      const faqs = guidanceContent[locale].pages.faq.faqs ?? [];
      expect(faqs.length).toBeGreaterThan(0);

      const faqPage = nodeOfType(renderGuidance(locale, 'faq'), 'FAQPage');
      expect(faqPage).toBeDefined();

      const mainEntity = faqPage!.mainEntity as Array<Record<string, unknown>>;
      expect(mainEntity).toHaveLength(faqs.length);

      mainEntity.forEach((entity, index) => {
        expect(entity['@type']).toBe('Question');
        expect(entity.name).toBe(faqs[index].question);
        expect(entity.acceptedAnswer).toEqual({
          '@type': 'Answer',
          text: faqs[index].answer,
        });
      });
    },
  );

  it.each(GUIDANCE_LOCALES_4)('tags the %s FAQPage with the page language', (locale) => {
    const faqPage = nodeOfType(renderGuidance(locale, 'faq'), 'FAQPage');
    expect(faqPage!.inLanguage).toBe(locale);
    expect(faqPage!['@context']).toBe('https://schema.org');
  });

  it('emits no FAQPage on a page without FAQs', () => {
    const markup = renderGuidance('th', 'about');
    expect(guidanceContent.th.pages.about.faqs).toBeUndefined();
    expect(nodeOfType(markup, 'FAQPage')).toBeUndefined();
    expect(nodeOfType(markup, 'LegalService')).toBeDefined();
  });

  it('emits no structured data on the localized 404 body', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      expect(parseJsonLdNodes(renderNotFound(locale))).toHaveLength(0);
    }
  });

  it('returns null instead of an empty FAQPage', () => {
    expect(buildGuidanceFaqJsonLd([], 'th')).toBeNull();
    expect(buildGuidanceFaqJsonLd(undefined, 'th')).toBeNull();
    expect(buildGuidanceFaqJsonLd([{ question: '', answer: '' }], 'th')).toBeNull();
  });

  it('escapes a closing script tag inside answer text', () => {
    const node = buildGuidanceFaqJsonLd(
      [{ question: 'q</script><script>alert(1)</script>', answer: 'a' }],
      'th',
    );
    // Same escaping path the page uses, exercised through the shared JsonLd component.
    const markup = renderToStaticMarkup(JsonLd({ data: node! }) as ReactElement);
    expect(markup).not.toContain('</script><script>');
    const parsed = parseJsonLdNodes(markup)[0];
    const mainEntity = parsed.mainEntity as Array<Record<string, unknown>>;
    expect(mainEntity[0].name).toBe('q</script><script>alert(1)</script>');
  });
});

describe('guidance LegalService JSON-LD', () => {
  it.each(GUIDANCE_LOCALES_4)(
    'keeps the consultation languages at four on the %s pages',
    (locale) => {
      const legalService = nodeOfType(renderGuidance(locale, 'faq'), 'LegalService');
      expect(legalService).toBeDefined();

      const availableLanguage = legalService!.availableLanguage as string[];
      expect(availableLanguage).toEqual(CONSULTATION_LANGUAGES);
      expect(availableLanguage).toHaveLength(4);
      for (const guidanceLocale of GUIDANCE_LOCALES_4) {
        expect(availableLanguage).not.toContain(guidanceLocale);
      }
    },
  );

  it('exports the consultation languages as the fixed four', () => {
    expect([...GUIDANCE_CONSULTATION_LANGUAGES]).toEqual(CONSULTATION_LANGUAGES);
  });

  it.each(GUIDANCE_LOCALES_4)('points %s at the existing firm and attorney entities', (locale) => {
    const legalService = nodeOfType(renderGuidance(locale, 'contact'), 'LegalService');
    const provider = legalService!.provider as Record<string, unknown>;

    expect(provider['@id']).toBe(ATTORNEY_PERSON_ID);
    // No new @id: the node reuses the organization identifier the site already emits.
    expect(legalService!['@id']).toBe(buildLegalServiceJsonLd('en')['@id']);
  });

  it.each(GUIDANCE_LOCALES_4)('sets inLanguage and url from the %s page itself', (locale) => {
    const legalService = nodeOfType(renderGuidance(locale, 'pricing'), 'LegalService');
    expect(legalService!.inLanguage).toBe(locale);
    expect(legalService!.url).toBe(guidanceCanonicalUrl(locale, 'pricing'));
    expect(legalService!.description).toBe(guidanceContent[locale].pages.pricing.description);
  });

  it('builds the same node shape outside the component', () => {
    const node = buildGuidanceLegalServiceJsonLd({
      inLanguage: 'th',
      url: 'https://tseng-law.com/th/faq',
    });
    expect(node['@type']).toBe('LegalService');
    expect(node.availableLanguage).toEqual(CONSULTATION_LANGUAGES);
    expect(node.provider).toEqual({ '@type': 'Person', '@id': ATTORNEY_PERSON_ID });
    expect(node).not.toHaveProperty('description');
  });
});
