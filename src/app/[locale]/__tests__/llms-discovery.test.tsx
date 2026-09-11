import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { guidanceContent } from '@/data/international-guidance-content';
import { getGuidancePage } from '@/data/international-guidance-extra';
import {
  GUIDANCE_LLMS_NOTICES,
  LOCALE_LLMS_TXT_MAX_BYTES,
  ROOT_LLMS_TXT_MAX_BYTES,
  buildGuidanceLlmsTxt,
  buildRootLlmsTxt,
  validateLlmsTxt,
} from '@/lib/llms-txt';
import { siteLocales } from '@/lib/locales';
import {
  GUIDANCE_ALL_PAGE_KEYS,
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  PUBLIC_LANGUAGE_AUTONYMS,
  guidancePublicPath,
} from '@/lib/public-guidance';
import LocaleLayout from '../layout';
import { GET as getLocaleLlmsTxt } from '../llms.txt/route';

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
  // Same shape as the real helper; the root llms.txt builder needs it.
  getLocalizedPath: (locale: string, path = '') =>
    (!path || path === '/' ? `/${locale}` : `/${locale}${path.startsWith('/') ? path : `/${path}`}`),
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
  it.each(GUIDANCE_LOCALES_4)('lists the twelve %s guidance pages once each', (locale) => {
    const body = buildGuidanceLlmsTxt(locale);
    const bullets = body.split('\n').filter((line) => line.startsWith('- ['));

    expect(GUIDANCE_PAGE_KEYS).toHaveLength(10);
    expect(GUIDANCE_ALL_PAGE_KEYS).toHaveLength(12);
    expect(bullets).toHaveLength(12);

    for (const pageKey of GUIDANCE_ALL_PAGE_KEYS) {
      const url = `https://tseng-law.com${guidancePublicPath(locale, pageKey)}`;
      const page = getGuidancePage(locale, pageKey);
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

function requestLlmsTxt(locale: string) {
  return getLocaleLlmsTxt(new Request(`https://tseng-law.com/${locale}/llms.txt`), {
    params: Promise.resolve({ locale }),
  });
}

describe('/[locale]/llms.txt route — guidance four', () => {
  it.each(GUIDANCE_LOCALES_4)('serves the %s guidance catalog as plain UTF-8 text', async (locale) => {
    const response = await requestLlmsTxt(locale);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(response.headers.get('content-language')).toBe(locale);
    expect(response.headers.get('cache-control')).toMatch(/^public,/u);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(body).toBe(buildGuidanceLlmsTxt(locale));
  });

  it.each(GUIDANCE_LOCALES_4)('lists the twelve %s guidance URLs exactly once each', async (locale) => {
    const body = await (await requestLlmsTxt(locale)).text();
    const urls = GUIDANCE_ALL_PAGE_KEYS.map(
      (pageKey) => `https://tseng-law.com${guidancePublicPath(locale, pageKey)}`,
    );

    expect(urls).toHaveLength(12);
    expect(new Set(urls).size).toBe(12);
    for (const pageKey of ['company-setup', 'debt-collection'] as const) {
      expect(body, `${locale}/${pageKey}`).toContain(
        `https://tseng-law.com${guidancePublicPath(locale, pageKey)}`,
      );
    }
    for (const url of urls) {
      expect(body.split(`](${url}):`).length - 1, url).toBe(1);
    }
  });

  it.each(siteLocales)('keeps the existing %s locale manifest and headers unchanged', async (locale) => {
    const response = await requestLlmsTxt(locale);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(response.headers.get('cache-control')).toMatch(/^public,/u);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(() => validateLlmsTxt(body, LOCALE_LLMS_TXT_MAX_BYTES)).not.toThrow();
    for (const guidanceLocale of GUIDANCE_LOCALES_4) {
      expect(body).not.toContain(`https://tseng-law.com/${guidanceLocale}`);
    }
  });

  it.each(['fr', 'xx', 'vi-VN', 'zh'])('keeps returning 404 for the unsupported locale %s', async (locale) => {
    const response = await requestLlmsTxt(locale);
    const body = await response.text();

    expect(response.status).toBe(404);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(body).toBe('Not Found\n');
    expect(body).not.toContain('/ko/');
  });
});

describe('root llms.txt guidance catalog links', () => {
  it('stays inside the 8 KiB root budget and the documented grammar', () => {
    const body = buildRootLlmsTxt();

    expect(new TextEncoder().encode(body).byteLength).toBeLessThanOrEqual(ROOT_LLMS_TXT_MAX_BYTES);
    expect(() => validateLlmsTxt(body, ROOT_LLMS_TXT_MAX_BYTES)).not.toThrow();
    expect(body.match(/^## [^\n]+$/gmu)).toEqual([
      '## Locale catalogs',
      '## Public AI consultation interfaces',
    ]);
  });

  it('lists four site-locale catalogs and four guidance catalogs', () => {
    const body = buildRootLlmsTxt();
    const catalogUrls = Array.from(
      body.matchAll(/\]\((https:\/\/tseng-law\.com\/[a-z-]+\/llms\.txt)\):/gu),
      (match) => match[1],
    );

    expect(catalogUrls).toEqual([
      ...siteLocales.map((locale) => `https://tseng-law.com/${locale}/llms.txt`),
      ...GUIDANCE_LOCALES_4.map((locale) => `https://tseng-law.com/${locale}/llms.txt`),
    ]);
    expect(catalogUrls).toHaveLength(8);
  });

  it('labels each guidance catalog in its own language without widening consultation languages', () => {
    const body = buildRootLlmsTxt();
    const lines = body.split('\n');

    for (const locale of GUIDANCE_LOCALES_4) {
      const line = lines.find((candidate) =>
        candidate.includes(`](https://tseng-law.com/${locale}/llms.txt):`));
      expect(line, locale).toBeDefined();
      expect(line).toContain(PUBLIC_LANGUAGE_AUTONYMS[locale]);
      expect(line).toContain(
        'Consultations are conducted only in English, Chinese, Japanese, and Korean.',
      );
    }
  });
});
