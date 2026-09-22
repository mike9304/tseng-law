import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import GuidanceHomeBody, {
  type GuidanceHomeColumnSource,
} from '@/components/GuidanceHomeBody';
import GuidancePageBody, { GuidanceNotFoundBody } from '@/components/GuidancePageBody';
import JsonLd from '@/components/JsonLd';
import {
  guidanceContent,
  type GuidanceLocale,
  type GuidancePageKey,
} from '@/data/international-guidance-content';
import { GUIDANCE_LOCALES_4, guidanceCanonicalUrl, publicDocumentLanguage } from '@/lib/public-guidance';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import {
  GUIDANCE_TEAM_MEMBER_IDS,
  guidanceTeamCopy,
} from '@/data/international-guidance-team';
import { teamContent } from '@/data/team-members';
import {
  ATTORNEY_PERSON_ID,
  GUIDANCE_CONSULTATION_LANGUAGES,
  buildGuidanceFaqJsonLd,
  buildGuidanceLegalServiceJsonLd,
  buildGuidanceWebsiteJsonLd,
  buildLegalServiceJsonLd,
  buildWebsiteJsonLd,
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

/**
 * The guidance home is served by `GuidanceHomeBody`, not `GuidancePageBody`, so
 * its structured data has to be asserted against its own render path. An empty
 * column source keeps the archive section (and `next/image`) out of the markup;
 * the JSON-LD does not depend on it.
 */
const EMPTY_COLUMN_SOURCE: GuidanceHomeColumnSource = {
  sourceLocale: 'en',
  isOriginalLanguage: true,
  posts: [],
};

function renderGuidanceHome(locale: GuidanceLocale): string {
  return renderToStaticMarkup(
    GuidanceHomeBody({ locale, columns: EMPTY_COLUMN_SOURCE }) as ReactElement,
  );
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

function nodesOfType(markup: string, type: string): Array<Record<string, unknown>> {
  return parseJsonLdNodes(markup).filter((node) => node['@type'] === type);
}

/** Undo the entities `renderToStaticMarkup` emits so visible FAQ text can be compared verbatim. */
function decodeVisibleText(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

/** Questions and answers actually rendered by the home `FAQAccordion`. */
function visibleHomeFaqs(markup: string): Array<{ question: string; answer: string }> {
  const questions = [
    ...markup.matchAll(/<h3 class="faq-question">[\s\S]*?<span>([\s\S]*?)<\/span>/g),
  ].map((match) => decodeVisibleText(match[1]));
  const answers = [...markup.matchAll(/<p class="faq-answer">([\s\S]*?)<\/p>/g)].map((match) =>
    decodeVisibleText(match[1]),
  );
  return questions.map((question, index) => ({ question, answer: answers[index] }));
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
    expect(faqPage!.inLanguage).toBe(publicDocumentLanguage(locale));
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
    expect(legalService!.inLanguage).toBe(publicDocumentLanguage(locale));
    expect(legalService!.url).toBe(guidanceCanonicalUrl(locale, 'pricing'));
    expect(legalService!.description).toBe(guidanceContent[locale].pages.pricing.description);
  });

  it.each(GUIDANCE_LOCALES_4)('emits exactly one LegalService on the %s home', (locale) => {
    const markup = renderGuidanceHome(locale);
    const legalServices = nodesOfType(markup, 'LegalService');
    expect(legalServices, `${locale} home LegalService count`).toHaveLength(1);

    const availableLanguage = legalServices[0].availableLanguage as string[];
    expect(availableLanguage).toEqual(CONSULTATION_LANGUAGES);
    expect(availableLanguage, `${locale} home consultation languages`).toHaveLength(4);
    for (const guidanceLocale of GUIDANCE_LOCALES_4) {
      expect(availableLanguage).not.toContain(guidanceLocale);
    }
  });

  it.each(GUIDANCE_LOCALES_4)('sets inLanguage, url and description from the %s home', (locale) => {
    const legalService = nodeOfType(renderGuidanceHome(locale), 'LegalService');
    expect(legalService!.inLanguage).toBe(publicDocumentLanguage(locale));
    expect(legalService!.url).toBe(guidanceCanonicalUrl(locale, 'home'));
    expect(legalService!.description).toBe(guidanceContent[locale].pages.home.description);
    expect((legalService!.provider as Record<string, unknown>)['@id']).toBe(ATTORNEY_PERSON_ID);
  });

  it('emits one FAQPage on the guidance home from the visible faq items', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const faqs = guidanceContent[locale].pages.faq.faqs ?? [];
      expect(faqs.length).toBeGreaterThan(0);
      // The home pack still has no faq field of its own; the visible items are
      // the translated faq page, headed by this locale's `nav.faq`.
      expect(guidanceContent[locale].pages.home.faqs).toBeUndefined();

      const markup = renderGuidanceHome(locale);
      expect(markup, `${locale} faq heading`).toContain(guidanceContent[locale].nav.faq);
      const visible = visibleHomeFaqs(markup);
      expect(visible, `${locale} visible faqs`).toEqual(
        faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
      );

      const faqPages = nodesOfType(markup, 'FAQPage');
      expect(faqPages, `${locale} home FAQPage`).toHaveLength(1);
      expect(faqPages[0].inLanguage).toBe(publicDocumentLanguage(locale));
      expect(faqPages[0]['@context']).toBe('https://schema.org');

      const mainEntity = faqPages[0].mainEntity as Array<Record<string, unknown>>;
      expect(mainEntity).toHaveLength(visible.length);
      mainEntity.forEach((entity, index) => {
        expect(entity['@type']).toBe('Question');
        expect(entity.name).toBe(visible[index].question);
        expect(entity.acceptedAnswer).toEqual({
          '@type': 'Answer',
          text: visible[index].answer,
        });
      });

      // Person stays, and LegalService consultation languages stay the fixed four.
      expect(nodesOfType(markup, 'Person'), `${locale} home Person`).toHaveLength(1);
      const legalServices = nodesOfType(markup, 'LegalService');
      expect(legalServices, `${locale} home LegalService`).toHaveLength(1);
      const availableLanguage = legalServices[0].availableLanguage as string[];
      expect(availableLanguage).toEqual(CONSULTATION_LANGUAGES);
      expect(availableLanguage, `${locale} home consultation languages`).toHaveLength(4);
      for (const guidanceLocale of GUIDANCE_LOCALES_4) {
        expect(availableLanguage).not.toContain(guidanceLocale);
      }

      expect(parseJsonLdNodes(markup), `${locale} home JSON-LD nodes`).toHaveLength(3);
      expect(
        parseJsonLdNodes(markup).some((node) => node['@type'] === 'SearchAction'),
        `${locale} home SearchAction`,
      ).toBe(false);
    }
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

/**
 * WO-O28. The remaining `@type` gap against `/en` was structural, not textual:
 * the guidance pages carried no `BreadcrumbList`, `Person` or `CollectionPage`
 * node. These assertions pin the shape at the render path; the live `@type`
 * set is compared against `/en` in `international-guidance.playwright.ts`.
 */
describe('guidance breadcrumb / person / collection JSON-LD', () => {
  it.each(GUIDANCE_LOCALES_4)('emits a localized two-step breadcrumb on %s', (locale) => {
    const breadcrumb = nodeOfType(renderGuidance(locale, 'pricing'), 'BreadcrumbList');
    expect(breadcrumb).toBeDefined();

    const items = breadcrumb!.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(2);
    expect(items[0]['@type']).toBe('ListItem');
    // Names come from this locale's own nav / page copy, never from English.
    expect(items[0].name).toBe(guidanceContent[locale].nav.home);
    expect(items[0].item).toBe(guidanceCanonicalUrl(locale, 'home'));
    expect(items[1].name).toBe(guidanceContent[locale].pages.pricing.title);
    expect(items[1].item).toBe(guidanceCanonicalUrl(locale, 'pricing'));
  });

  it.each(GUIDANCE_LOCALES_4)('pins the %s roster Person to the canonical entity', (locale) => {
    for (const pageKey of ['lawyers', 'about'] as const) {
      const person = nodeOfType(renderGuidance(locale, pageKey), 'Person');
      expect(person, `${locale}/${pageKey} Person`).toBeDefined();
      expect(person!['@id']).toBe(ATTORNEY_PERSON_ID);

      const profile = getAttorneyProfile('en', primaryAttorneySlug)!;
      // No invented translation: the biography stays the canonical English one.
      expect(person!.name).toBe(profile.name);
      expect(person!.description).toBe(profile.description);
      // The one language-dependent field the firm does publish per locale.
      expect(person!.jobTitle).toBe(guidanceTeamCopy[locale].roles['tseng-junwei']);
      // `/{guidance locale}/lawyers/{slug}` is a 404, so the English profile
      // route is used — the same URL the visible roster link points at.
      expect(person!.url).toBe(`https://tseng-law.com/en/lawyers/${profile.slug}`);
      const alumni = person!.alumniOf as Array<Record<string, unknown>>;
      expect(alumni.length).toBeGreaterThan(0);
      expect(alumni[0]['@type']).toBe('CollegeOrUniversity');
    }
  });

  it.each(GUIDANCE_LOCALES_4)('lists the %s roster in a CollectionPage', (locale) => {
    const collection = nodeOfType(renderGuidance(locale, 'lawyers'), 'CollectionPage');
    expect(collection).toBeDefined();
    expect(collection!.url).toBe(guidanceCanonicalUrl(locale, 'lawyers'));
    expect(collection!.inLanguage).toBe(publicDocumentLanguage(locale));

    const list = collection!.mainEntity as Record<string, unknown>;
    expect(list['@type']).toBe('ItemList');
    const items = list.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(GUIDANCE_TEAM_MEMBER_IDS.length);
    items.forEach((item, index) => {
      const memberId = GUIDANCE_TEAM_MEMBER_IDS[index];
      expect(item['@type']).toBe('ListItem');
      expect(item.name).toBe(teamContent.en.members.find((m) => m.id === memberId)!.name);
      expect(item.description).toBe(guidanceTeamCopy[locale].roles[memberId]);
      // Every item points at the card actually rendered on this locale's page.
      expect(item.url).toBe(`${guidanceCanonicalUrl(locale, 'lawyers')}#${memberId}`);
    });
  });

  it.each(GUIDANCE_LOCALES_4)('carries a ContactPoint on the %s LegalService', (locale) => {
    const legalService = nodeOfType(renderGuidance(locale, 'about'), 'LegalService');
    const contactPoint = legalService!.contactPoint as Array<Record<string, unknown>>;
    expect(contactPoint).toHaveLength(1);
    expect(contactPoint[0]['@type']).toBe('ContactPoint');
    // The consultation languages, not the page language.
    expect(contactPoint[0].availableLanguage).toEqual(CONSULTATION_LANGUAGES);
    expect(contactPoint[0].url).toBe(guidanceCanonicalUrl(locale, 'contact'));
  });

  it.each(GUIDANCE_LOCALES_4)('emits a %s WebSite node without a SearchAction', (locale) => {
    const website = buildGuidanceWebsiteJsonLd(locale) as Record<string, unknown>;
    expect(website['@type']).toBe('WebSite');
    expect(website.inLanguage).toBe(publicDocumentLanguage(locale));
    expect(website.url).toBe(guidanceCanonicalUrl(locale, 'home'));
    // Explicit exception to the parity rule: no `/search` route exists here.
    expect(website).not.toHaveProperty('potentialAction');

    const publisher = website.publisher as Record<string, unknown>;
    expect(publisher['@type']).toBe('Organization');
    expect((publisher.logo as Record<string, unknown>)['@type']).toBe('ImageObject');
  });

  it('keeps the SearchAction on the four site locales', () => {
    for (const siteLocale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      const website = buildWebsiteJsonLd(siteLocale) as Record<string, unknown>;
      expect(website.potentialAction, `${siteLocale} SearchAction`).toBeDefined();
    }
  });
});
