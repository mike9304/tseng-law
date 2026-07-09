import { describe, expect, it } from 'vitest';
import { buildFaqJsonLd, buildHowToJsonLd } from '@/lib/seo';
import { locales, type Locale } from '@/lib/locales';
import { guideContent } from '../content';

describe('guides/taiwan-company-setup content', () => {
  it('provides content for every supported locale', () => {
    for (const locale of locales) {
      expect(guideContent[locale]).toBeDefined();
    }
  });

  it('has 5 HowTo steps, 5 FAQ items, and 4 related columns per locale', () => {
    for (const locale of locales) {
      const c = guideContent[locale];
      expect(c.steps).toHaveLength(5);
      expect(c.faq).toHaveLength(5);
      expect(c.relatedColumns).toHaveLength(4);
      // Each step must have a name + text to survive HowTo filtering
      for (const step of c.steps) {
        expect(step.name.trim()).not.toBe('');
        expect(step.text.trim()).not.toBe('');
      }
      // Each FAQ must have q + a
      for (const item of c.faq) {
        expect(item.q.trim()).not.toBe('');
        expect(item.a.trim()).not.toBe('');
      }
    }
  });

  it('has a 4-column comparison table whose rows each carry 3 values', () => {
    for (const locale of locales) {
      const c = guideContent[locale];
      expect(c.comparisonColumns).toHaveLength(4);
      expect(c.comparisonRows.length).toBeGreaterThan(0);
      for (const row of c.comparisonRows) {
        expect(row.values).toHaveLength(3);
      }
    }
  });

  it('builds a non-null HowTo and FAQPage JSON-LD with the expected counts per locale', () => {
    for (const locale of locales) {
      const c = guideContent[locale];
      const howTo = buildHowToJsonLd({
        name: c.title,
        description: c.description,
        steps: c.steps,
        locale,
      });
      const faq = buildFaqJsonLd(c.faq, locale);

      expect(howTo).not.toBeNull();
      expect(howTo).toMatchObject({ '@type': 'HowTo' });
      expect((howTo!.step as unknown[]).length).toBe(5);
      expect(faq).not.toBeNull();
      expect((faq!.mainEntity as unknown[]).length).toBe(5);
    }
  });

  it('the related column slugs match the four expected source columns', () => {
    const expected = [
      '001-taiwan-company-establishment-basics',
      '013-taiwan-company-establishment-advanced-1',
      '005-taiwan-company-establishment-advanced-2',
      '004-taiwan-company-subsidiary-vs-branch',
    ];
    const ko = guideContent.ko;
    expect(ko.relatedColumns.map((c) => c.slug)).toEqual(expected);
  });

  it('canonicalizes the locale tag in the inLanguage field', () => {
    const howTo = buildHowToJsonLd({
      name: guideContent['zh-hant'].title,
      steps: guideContent['zh-hant'].steps,
      locale: 'zh-hant' as Locale,
    });
    expect(howTo!.inLanguage).toBe('zh-Hant');
  });
});
