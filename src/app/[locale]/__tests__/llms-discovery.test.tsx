import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { guidanceContent } from '@/data/international-guidance-content';
import {
  GUIDANCE_LLMS_NOTICES,
  LOCALE_LLMS_TXT_MAX_BYTES,
  buildGuidanceLlmsTxt,
  validateLlmsTxt,
} from '@/lib/llms-txt';
import { siteLocales } from '@/lib/locales';
import {
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  guidancePublicPath,
} from '@/lib/public-guidance';
import LocaleLayout from '../layout';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

vi.mock('@/app/fonts', () => ({
  getLocaleFontClassName: () => 'font-mock',
  getManagedLocaleFontClassNames: () => ['font-managed'],
}));

vi.mock('@/lib/seo', () => ({
  buildWebsiteJsonLd: () => ({ '@type': 'WebSite' }),
  buildLegalServiceJsonLd: () => ({ '@type': 'LegalService' }),
  getOrganizationName: () => 'Test Org',
}));

vi.mock('@/components/JsonLd', () => ({ default: () => null }));
vi.mock('@/components/DocumentLocaleSync', () => ({ default: () => null }));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/ScrollTopButton', () => ({ default: () => null }));
vi.mock('@/components/QuickContactWidget', () => ({ default: () => null }));
vi.mock('@/components/YearEndEventPopup', () => ({ default: () => null }));
vi.mock('@/components/CinematicRouteShell', () => ({
  default: ({ children }: { children?: ReactNode }) => children ?? null,
}));
vi.mock('@/components/metrics/VisitTracker', () => ({ default: () => null }));

async function renderLocaleLayout(locale: string): Promise<string> {
  const element = await LocaleLayout({
    children: <div>child</div>,
    params: Promise.resolve({ locale }),
  });
  return renderToStaticMarkup(element);
}

describe('locale llms.txt discovery link', () => {
  it.each(siteLocales)('renders a describedby link to the %s llms.txt manifest in markup', async (locale) => {
    const html = await renderLocaleLayout(locale);
    const describedByLinks = html.match(/<link\b[^>]*rel="describedby"[^>]*>/gu) ?? [];
    expect(describedByLinks).toHaveLength(1);
    const describedBy = describedByLinks[0];
    expect(describedBy).toBeDefined();
    expect(describedBy).toContain(`href="/${locale}/llms.txt"`);
  });

  it('does not claim a page-specific Markdown alternate that does not exist', async () => {
    const html = await renderLocaleLayout('en');
    expect(html).not.toMatch(/rel="alternate"[^>]*(?:markdown|\.md)/iu);
    expect(html).not.toMatch(/type="text\/markdown"/iu);
  });
});

describe('guidance locale llms.txt catalogs', () => {
  it.each(GUIDANCE_LOCALES_4)('lists the ten %s guidance pages once each', (locale) => {
    const body = buildGuidanceLlmsTxt(locale);
    const bullets = body.split('\n').filter((line) => line.startsWith('- ['));

    expect(GUIDANCE_PAGE_KEYS).toHaveLength(10);
    expect(bullets).toHaveLength(10);

    for (const pageKey of GUIDANCE_PAGE_KEYS) {
      const url = `https://tseng-law.com${guidancePublicPath(locale, pageKey)}`;
      const page = guidanceContent[locale].pages[pageKey];
      expect(bullets.filter((line) => line.includes(`](${url}):`))).toHaveLength(1);
      // Title and one-line annotation come from the page's own published copy.
      expect(body).toContain(`- [${page.title}](${url}): ${page.description}`);
    }
  });

  it.each(GUIDANCE_LOCALES_4)('keeps the %s catalog free of the other guidance locales', (locale) => {
    const body = buildGuidanceLlmsTxt(locale);
    for (const other of GUIDANCE_LOCALES_4.filter((candidate) => candidate !== locale)) {
      expect(body).not.toContain(`https://tseng-law.com/${other}`);
    }
  });

  it.each(GUIDANCE_LOCALES_4)('carries the %s notice block in that language', (locale) => {
    const body = buildGuidanceLlmsTxt(locale);
    const pack = guidanceContent[locale];
    const notices = GUIDANCE_LLMS_NOTICES[locale];

    expect(body).toContain(pack.footerNotice);
    expect(body).toContain(notices.consultationNotice);
    expect(body).toContain(notices.discoveryNotice);
    expect(body).toContain(notices.confidentialNotice);
    // "No ranking, endorsement or guaranteed visibility" is kept in every language.
    expect(notices.discoveryNotice).toContain('llms.txt');
  });

  it.each(GUIDANCE_LOCALES_4)(
    'quotes the published %s pages verbatim in the notice block',
    (locale) => {
      const pack = guidanceContent[locale];
      const notices = GUIDANCE_LLMS_NOTICES[locale];

      const faqAnswers = (pack.pages.faq.faqs ?? []).map((faq) => faq.answer).join('\n');
      expect(faqAnswers).toContain(notices.consultationNotice);

      const privacyParagraphs = pack.pages.privacy.sections
        .flatMap((section) => section.paragraphs)
        .join('\n');
      expect(privacyParagraphs).toContain(notices.confidentialNotice);
    },
  );

  it('writes a distinct notice set for each of the four guidance languages', () => {
    const notices = GUIDANCE_LOCALES_4.flatMap((locale) =>
      Object.values(GUIDANCE_LLMS_NOTICES[locale]),
    );
    expect(notices).toHaveLength(12);
    expect(new Set(notices).size).toBe(notices.length);
  });

  it.each(GUIDANCE_LOCALES_4)('satisfies the locale llms.txt contract for %s', (locale) => {
    const body = buildGuidanceLlmsTxt(locale);
    expect(() => validateLlmsTxt(body, LOCALE_LLMS_TXT_MAX_BYTES)).not.toThrow();
    expect(body.endsWith('\n')).toBe(true);
    expect(body.split('\n').filter((line) => line.startsWith('# '))).toHaveLength(1);
  });
});
