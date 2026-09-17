import { describe, expect, it } from 'vitest';
import {
  getCorporateAdvisory,
  getCorporateAdvisoryHref,
} from '@/data/corporate-advisory';
import { getIntentPage, intentPageSlugs } from '@/data/intent-pages';
import { getPublicIntentSearchDocs } from '../public-intent-docs';

describe('getPublicIntentSearchDocs', () => {
  it('returns no KO or ZH-HANT docs', () => {
    expect(getPublicIntentSearchDocs('ko')).toEqual([]);
    expect(getPublicIntentSearchDocs('zh-hant')).toEqual([]);
  });

  it.each(['en', 'ja'] as const)(
    'returns three intent pages plus the corporate anchor for %s',
    (locale) => {
      const docs = getPublicIntentSearchDocs(locale);
      const href = getCorporateAdvisoryHref(locale);
      const advisory = getCorporateAdvisory(locale);

      expect(docs).toHaveLength(4);
      expect(new Set(docs.map((doc) => doc.id)).size).toBe(4);
      expect(docs.every((doc) => doc.kind === 'page')).toBe(true);
      expect(docs.every((doc) => doc.locale === locale)).toBe(true);
      expect(docs.every((doc) => !('publishedAt' in doc))).toBe(true);
      expect(href).toBe(`/${locale}/taiwan-lawyer#corporate-advisory`);
      expect(advisory).not.toBeNull();

      for (const slug of intentPageSlugs) {
        const page = getIntentPage(locale, slug);
        const doc = docs.find((item) => item.url === `/${locale}/${slug}`);
        expect(page).toBeDefined();
        expect(doc).toBeDefined();
        expect(doc?.id).toBe(`page:${locale}:${slug}`);
        expect(doc?.title).toBe(page!.title);
        expect(doc?.summary).toBe(page!.description);
        expect(doc?.body).toContain(page!.searchTerms[0]);
        expect(doc?.body).toContain(page!.heroPoints[0]);
        expect(doc?.body).toContain(page!.idealFor[0]);
        expect(doc?.body).toContain(page!.faq[0].question);
        expect(doc?.body).toContain(page!.faq[0].answer);
      }

      const corporate = docs.find((doc) => doc.url === href);
      expect(corporate?.id).toBe(`page:${locale}:taiwan-lawyer#corporate-advisory`);
      expect(corporate?.title).toBe(advisory!.headline);
      expect(corporate?.summary).toBe(advisory!.summary);
      expect(corporate?.body).toContain(advisory!.body);
      expect(corporate?.body).toContain(advisory!.items[0].title);
      expect(corporate?.body).toContain(advisory!.items[0].body);
      expect(corporate?.body).toContain(advisory!.relatedLinks[0].label);
      expect(corporate?.url).toContain('#corporate-advisory');
    },
  );

  it('keeps the corporate arrival distinct from the parent intent page', () => {
    const docs = getPublicIntentSearchDocs('en');
    const urls = docs.map((doc) => doc.url);
    expect(urls).toContain('/en/taiwan-lawyer');
    expect(urls).toContain('/en/taiwan-lawyer#corporate-advisory');
    expect(new Set(urls).size).toBe(urls.length);
  });
});
