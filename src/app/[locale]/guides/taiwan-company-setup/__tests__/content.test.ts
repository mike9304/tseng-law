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

  it('has 5 HowTo steps, locale-specific FAQ counts, and 4 related columns per locale', () => {
    for (const locale of locales) {
      const c = guideContent[locale];
      expect(c.steps).toHaveLength(5);
      expect(c.faq).toHaveLength(locale === 'ko' ? 7 : 5);
      expect(c.relatedColumns).toHaveLength(4);
      expect(c.relatedResources).toHaveLength(4);
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
      expect((faq!.mainEntity as unknown[]).length).toBe(locale === 'ko' ? 7 : 5);
    }
  });

  it('keeps the Korean legal-entity setup answers in visible content and FAQ JSON-LD', () => {
    const ko = guideContent.ko;
    expect(ko.title).toBe('대만 법인설립(회사설립) 종합 가이드');
    expect(ko.metaTitle).toBe(
      '대만 법인설립·회사설립 절차·비용 총정리 (2026) | 법무법인 호정',
    );
    expect(ko.description).toContain('대만 법인설립');
    expect(ko.summary[0]).toBe(
      '대만 법인설립 절차는 투심회 승인, 사명 예심·공증, 설립·세적 등기, 정식 계좌 개설 순으로 진행됩니다.',
    );

    const faq = buildFaqJsonLd(ko.faq, 'ko');
    const questions = (faq!.mainEntity as Array<{ name: string }>).map((entity) => entity.name);
    expect(questions).toContain('대만 법인설립 절차는 어떻게 되나요?');
    expect(questions).toContain('대만 법인설립 기간은 얼마나 걸리나요?');
  });

  it('the related column slugs match the four expected source columns', () => {
    const expected = [
      'taiwan-company-establishment-basics',
      'taiwan-company-establishment-advanced-1',
      'taiwan-company-establishment-advanced-2',
      'taiwan-company-subsidiary-vs-branch',
    ];
    const ko = guideContent.ko;
    expect(ko.relatedColumns.map((c) => c.slug)).toEqual(expected);
  });

  it('links every locale to the four related P0 resources', () => {
    const expected = [
      'korean-lawyer-in-taiwan',
      'taiwan-company-setup-lawyer',
      'taiwan-lawyer',
      'services/investment',
    ];

    for (const locale of locales) {
      expect(guideContent[locale].relatedResources.map((item) => item.href)).toEqual(expected);
    }
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
