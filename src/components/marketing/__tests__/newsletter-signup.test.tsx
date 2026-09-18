import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import NewsletterSignup from '@/components/marketing/NewsletterSignup';
import {
  SUBSCRIBE_LOCALE_BY_SITE_LOCALE,
  newsletterSignupCopy,
} from '@/data/newsletter-signup-copy';
import { DEFAULT_MARKETING_CONSENT_TEXT } from '@/lib/builder/marketing/subscriber-consent';
import { siteLocales, type SiteLocale } from '@/lib/locales';

const LOCALES = [...siteLocales] as SiteLocale[];

/** Promises the widget must never make (regulation gate in the email plan §1). */
const FORBIDDEN = [
  /무료/, /승소/, /보장/, /최고/, /유일/,
  /免費/, /勝訴/, /保證/, /無料/,
  /\bfree\b/i, /\bguarantee/i, /\bwithin 24\b/i,
];

describe('NewsletterSignup widget', () => {
  it('renders an unchecked consent box whose label is the stored consent sentence', () => {
    for (const locale of LOCALES) {
      const html = renderToStaticMarkup(<NewsletterSignup locale={locale} />);
      const stored = DEFAULT_MARKETING_CONSENT_TEXT[SUBSCRIBE_LOCALE_BY_SITE_LOCALE[locale]];
      expect(html, locale).toContain('type="checkbox"');
      expect(html, locale).not.toContain('checked=""');
      expect(newsletterSignupCopy[locale].consentLabel, locale).toBe(stored);
    }
  });

  it('keeps the honeypot field out of view and out of the accessibility tree', () => {
    const html = renderToStaticMarkup(<NewsletterSignup locale="ko" />);
    expect(html).toContain('name="company"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('tabindex="-1"');
  });

  it('tells the reader it is double opt-in and how to stop receiving mail', () => {
    for (const locale of LOCALES) {
      const copy = newsletterSignupCopy[locale];
      const html = renderToStaticMarkup(<NewsletterSignup locale={locale} />);
      expect(copy.successMessage.length, locale).toBeGreaterThan(10);
      expect(html, locale).toContain(copy.unsubscribeNote);
    }
  });

  it('states that a Japanese reader receives the newsletter in English', () => {
    expect(SUBSCRIBE_LOCALE_BY_SITE_LOCALE.ja).toBe('en');
    const html = renderToStaticMarkup(<NewsletterSignup locale="ja" />);
    expect(html).toContain('ニュースレターは英語でお送りします');
  });

  it('makes no promise about outcome, price, or response time', () => {
    for (const locale of LOCALES) {
      const html = renderToStaticMarkup(<NewsletterSignup locale={locale} />);
      for (const pattern of FORBIDDEN) {
        expect(html, `${locale} / ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it('says the newsletter is general information, not advice on the reader matter', () => {
    expect(newsletterSignupCopy.ko.description).toContain('법률 자문이 아닙니다');
    expect(newsletterSignupCopy.en.description).toContain('not advice on your matter');
    expect(newsletterSignupCopy.ja.description).toContain('法律意見ではありません');
    expect(newsletterSignupCopy['zh-hant'].description).toContain('不是針對個案的法律意見');
  });
});
