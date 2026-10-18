import { describe, expect, it } from 'vitest';
import historicalTemplates from './fixtures/historical-consultation-mailto.json';
import { JULY_CONSULTATION_MAILTO, upgradeLegacyConsultationMailto } from '../legacy-mailto';
import { getConsultationPublicMailto } from '../public-contact';
import type { SiteLocale } from '@/lib/locales';

// Frozen independently from git show public-contact.ts at every historical revision.
// Do not generate these inputs from the production legacy constants or current bodies.
const historical = historicalTemplates.map((template) => ({
  ...template,
  locale: template.locale as SiteLocale,
  revision: template.revisions[0],
  href: `mailto:wei@hoveringlaw.com.tw?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`,
}));

describe('upgradeLegacyConsultationMailto', () => {
  it.each(historical)('maps the exact $locale stock draft from $revision to its current locale', ({ locale, href }) => {
    expect(upgradeLegacyConsultationMailto(href)).toBe(getConsultationPublicMailto(locale));
    expect(upgradeLegacyConsultationMailto(upgradeLegacyConsultationMailto(href))).toBe(getConsultationPublicMailto(locale));
  });

  it('shares the unchanged July fingerprint link', () => {
    expect(JULY_CONSULTATION_MAILTO).toBe(historical.find(({ locale }) => locale === 'zh-hant')!.href);
  });

  it.each(historical)('preserves authored changes to the $locale draft from $revision', ({ href, subject, body }) => {
    const variants = [
      href.replace('wei@hoveringlaw.com.tw', 'author@example.com'),
      href.replace(encodeURIComponent(subject), encodeURIComponent(`${subject} (authored)`)),
      href.replace(encodeURIComponent(body), encodeURIComponent(`${body}\nAuthored detail`)),
      `${href}&cc=author@example.com`,
      `${href}&bcc=author@example.com`,
      `${href}&custom=1`,
      ` ${href} `,
      href.replace('mailto:', 'MAILTO:'),
      href.replace(/%20/g, '+'),
      `mailto:wei@hoveringlaw.com.tw?body=${encodeURIComponent(body)}&subject=${encodeURIComponent(subject)}`,
    ];
    for (const authored of variants) {
      expect(upgradeLegacyConsultationMailto(authored)).toBe(authored);
    }
  });

  it.each(['ko', 'zh-hant', 'en', 'ja'] as const)('leaves the current %s href alone', (locale) => {
    const href = getConsultationPublicMailto(locale);
    expect(upgradeLegacyConsultationMailto(href)).toBe(href);
  });

  it.each([
    'mailto:wei@hoveringlaw.com.tw', 'mailto:author@example.com?subject=Authored',
    'https://example.com', '/ko/contact', '#inquiry', 'tel:+886212345678', 'lightbox:contact', '',
  ])('leaves unrelated href %s alone', (href) => {
    expect(upgradeLegacyConsultationMailto(href)).toBe(href);
  });
});
