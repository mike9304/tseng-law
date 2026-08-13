import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ColumnContent, {
  resolveColumnMarkdownLinkHref,
} from '@/components/ColumnContent';
import { getColumnPost } from '@/lib/columns';
import {
  getConsultationEmailTemplate,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';

const representativeColumns: Array<{
  locale: SiteLocale;
  slug: string;
  label: string;
}> = [
  {
    locale: 'ko',
    slug: 'taiwan-company-establishment-basics',
    label: '상담 문의',
  },
  {
    locale: 'zh-hant',
    slug: 'taiwan-company-establishment-basics',
    label: '聯絡我們',
  },
  {
    locale: 'en',
    slug: 'taiwan-company-establishment-basics',
    label: 'Contact Our Office',
  },
  {
    locale: 'ja',
    slug: 'taiwan-company-establishment-basics',
    label: 'ご相談・お問い合わせ',
  },
];

describe('ColumnContent consultation CTA links', () => {
  it.each(representativeColumns)(
    'renders the $locale representative column consultation CTA as the localized central mailto',
    ({ locale, slug }) => {
      const post = getColumnPost(slug, locale);
      expect(post).toBeDefined();

      const html = renderToStaticMarkup(
        <ColumnContent content={post?.content ?? ''} locale={locale} />,
      );
      const expectedHref = getConsultationPublicMailto(locale).replace(/&/g, '&amp;');
      const template = getConsultationEmailTemplate(locale);

      expect(html).toContain(`href="${expectedHref}"`);
      expect(html).toContain(encodeURIComponent(template.subject));
      expect(html).toContain(encodeURIComponent(template.body));
      expect(html).not.toContain(`href="/${locale}/contact"`);
      expect(html).not.toMatch(
        /href="(?:tel:|[^"]*(?:kakao|line\.me|lin\.ee))/i,
      );
    },
  );

  it.each(representativeColumns)(
    'resolves the explicit $locale consultation label only for the matching locale contact route',
    ({ locale, label }) => {
      expect(
        resolveColumnMarkdownLinkHref(`/${locale}/contact`, label, locale),
      ).toBe(getConsultationPublicMailto(locale));
      expect(
        resolveColumnMarkdownLinkHref(`/${locale}/contact?source=column`, label, locale),
      ).toBe(getConsultationPublicMailto(locale));
      expect(
        resolveColumnMarkdownLinkHref(`/${locale}/contact#form`, label, locale),
      ).toBe(getConsultationPublicMailto(locale));
    },
  );

  it('leaves ordinary navigation, foreign-locale routes, and unrelated links unchanged', () => {
    expect(
      resolveColumnMarkdownLinkHref('/en/contact', 'Contact page', 'en'),
    ).toBe('/en/contact');
    expect(
      resolveColumnMarkdownLinkHref('/ko/contact', 'Contact Us', 'en'),
    ).toBe('/ko/contact');
    expect(
      resolveColumnMarkdownLinkHref('/en/services', 'Contact Us', 'en'),
    ).toBe('/en/services');
    expect(
      resolveColumnMarkdownLinkHref('https://example.com/contact', 'Contact Us', 'en'),
    ).toBe('https://example.com/contact');
  });

  it('keeps a non-CTA Contact page Markdown link navigational', () => {
    const html = renderToStaticMarkup(
      <ColumnContent
        locale="en"
        content="[Contact page](/en/contact) [Contact Us](/en/contact)"
      />,
    );

    expect(html).toContain('href="/en/contact"');
    expect(html).toContain(
      `href="${getConsultationPublicMailto('en').replace(/&/g, '&amp;')}"`,
    );
  });
});
