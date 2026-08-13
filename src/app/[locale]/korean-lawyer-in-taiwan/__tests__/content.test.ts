import { describe, expect, it } from 'vitest';
import { buildFaqJsonLd, buildLegalServiceJsonLd } from '@/lib/seo';
import { locales } from '@/lib/locales';
import { landingContent } from '../content';

describe('korean-lawyer-in-taiwan content', () => {
  it('provides content for every supported locale', () => {
    for (const locale of locales) {
      expect(landingContent[locale]).toBeDefined();
    }
  });

  it('has a declarative lead, non-empty services/languages, and 5 FAQ items per locale', () => {
    for (const locale of locales) {
      const c = landingContent[locale];
      expect(c.lead.length).toBeGreaterThanOrEqual(3);
      expect(c.services.length).toBeGreaterThan(0);
      expect(c.languages.length).toBeGreaterThan(0);
      expect(c.faq).toHaveLength(5);
      expect(c.relatedResources).toHaveLength(5);
      for (const item of c.faq) {
        expect(item.q.trim()).not.toBe('');
        expect(item.a.trim()).not.toBe('');
      }
    }
  });

  it('links every locale to the same five related P0 resources', () => {
    const expected = [
      'guides/taiwan-company-setup',
      'taiwan-company-setup-lawyer',
      'taiwan-lawyer',
      'taiwan-litigation-lawyer',
      'services',
    ];

    for (const locale of locales) {
      expect(landingContent[locale].relatedResources.map((item) => item.href)).toEqual(expected);
    }
  });

  it('builds a non-null FAQPage JSON-LD with 5 entities per locale', () => {
    for (const locale of locales) {
      const c = landingContent[locale];
      const faq = buildFaqJsonLd(c.faq, locale);
      expect(faq).not.toBeNull();
      expect(faq).toMatchObject({ '@type': 'FAQPage' });
      expect((faq!.mainEntity as unknown[]).length).toBe(5);
    }
  });

  it('builds a LegalService JSON-LD node per locale', () => {
    for (const locale of locales) {
      const c = landingContent[locale];
      const node = buildLegalServiceJsonLd(locale, {
        description: c.description,
        path: 'korean-lawyer-in-taiwan',
      });
      expect(node).toMatchObject({ '@type': 'LegalService' });
      expect(node.url).toContain('/korean-lawyer-in-taiwan');
    }
  });

  it('routes every localized consultation surface exclusively to Attorney Tseng email', () => {
    const expectedLawyerReferences = {
      ko: '증준외',
      'zh-hant': '曾雋崴',
      en: 'Attorney Tseng',
      ja: '曾雋崴',
    } as const;

    for (const locale of locales) {
      const c = landingContent[locale];
      const consultationFaq = c.faq.find((item) =>
        /상담은 어떻게|如何預約諮詢|How do I request a consultation|相談はどのよう/.test(item.q),
      );
      const consultationSurface = JSON.stringify({
        office: c.office,
        consultationFaq,
        ctaText: c.ctaText,
        ctaButton: c.ctaButton,
      });

      expect(consultationFaq).toBeDefined();
      expect(consultationSurface).toContain('wei@hoveringlaw.com.tw');
      expect(consultationSurface).toContain(expectedLawyerReferences[locale]);
      expect(consultationSurface).not.toMatch(/(?:\+82-?)?0?10-2992-9304/);
    }
  });
});
