import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import GuidancePageBody from '@/components/GuidancePageBody';
import LegalPageSections from '@/components/LegalPageSections';
import PageHeader from '@/components/PageHeader';
import { legalPageContent } from '@/data/legal-pages';
import {
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  type GuidanceLocale4,
  type GuidancePageKey,
} from '@/lib/public-guidance';

/**
 * O14: vi/id/th/fil must render with the same page composition as the existing
 * four languages — the shared `PageHeader` band, a `.section` card grid built
 * from the site design system, and the closing contact band — not a bare
 * article of paragraphs.
 */

function sectionSignatures(markup: string): string[] {
  return Array.from(markup.matchAll(/<section[^>]*class="([^"]+)"/g)).map((match) => match[1]);
}

function renderGuidance(locale: GuidanceLocale4, pageKey: GuidancePageKey): string {
  return renderToStaticMarkup(<GuidancePageBody locale={locale} pageKey={pageKey} />);
}

describe('guidance pages share the existing four-language page composition', () => {
  it('renders the same design-system sections as the English legal page', () => {
    const englishMarkup = renderToStaticMarkup(
      <>
        <PageHeader
          locale="en"
          label={legalPageContent.en.privacy.label}
          title={legalPageContent.en.privacy.title}
          description={legalPageContent.en.privacy.description}
        />
        <LegalPageSections locale="en" content={legalPageContent.en.privacy} />
      </>,
    );
    const englishSections = new Set(
      sectionSignatures(englishMarkup).map((value) => value.split(' ')[0]),
    );
    expect(englishSections.has('section')).toBe(true);

    for (const locale of GUIDANCE_LOCALES_4) {
      const markup = renderGuidance(locale, 'privacy');
      const signatures = sectionSignatures(markup);

      // Same shared header band and card-grid section the old four use.
      expect(signatures.some((value) => value.includes('page-header')), `${locale} page header`).toBe(true);
      expect(signatures.some((value) => value.includes('section--light')), `${locale} card grid`).toBe(true);
      expect(
        signatures.some((value) => value.includes('home-contact-cta')),
        `${locale} contact band`,
      ).toBe(true);

      // Every section is a design-system `.section`, exactly as on en.
      for (const signature of signatures) {
        expect(signature.split(' ')[0], `${locale} section base class`).toBe('section');
      }

      // Card markup, not a bare paragraph stack.
      expect(markup, `${locale} uses the shared card grid`).toContain('grid-bento contact-grid');
      expect(markup, `${locale} uses shared cards`).toContain('class="card legal-card"');
    }
  });

  it('gives all four guidance locales an identical section composition per page', () => {
    for (const pageKey of GUIDANCE_PAGE_KEYS) {
      const perLocale = GUIDANCE_LOCALES_4.map((locale) =>
        sectionSignatures(renderGuidance(locale, pageKey)),
      );
      for (const signatures of perLocale) {
        expect(signatures, `${pageKey} composition`).toEqual(perLocale[0]);
      }
    }
  });
});
