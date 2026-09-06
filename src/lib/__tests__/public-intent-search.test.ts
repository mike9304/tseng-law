import { describe, expect, it } from 'vitest';
import { getCorporateAdvisory } from '@/data/corporate-advisory';
import { getIntentPage } from '@/data/intent-pages';
import { filterSearchIndex, getSearchIndex } from '@/lib/search';
import { getPublicIntentSearchDocs } from '@/lib/builder/search/public-intent-docs';

const INTENT_HREFS = {
  ko: [
    '/ko/taiwan-lawyer',
    '/ko/taiwan-company-setup-lawyer',
    '/ko/taiwan-litigation-lawyer',
    '/ko/taiwan-lawyer#corporate-advisory',
  ],
  'zh-hant': [
    '/zh-hant/taiwan-lawyer',
    '/zh-hant/taiwan-company-setup-lawyer',
    '/zh-hant/taiwan-litigation-lawyer',
    '/zh-hant/taiwan-lawyer#corporate-advisory',
  ],
} as const;

const EXPECTED_EN_LEGACY_SEARCH_IDS = [
  'services-0',
  'services-1',
  'services-2',
  'services-3',
  'services-4',
  'services-5',
  'featured-0',
  'featured-1',
  'featured-2',
  'insight-post-gym-injury-lawsuit',
  'insight-post-cosmetics-market-entry',
  'insight-post-company-advanced-2',
  'insight-post-withdraw-capital',
  'insight-post-logistics-business',
  'insight-post-company-location',
  'insight-post-company-advanced-1',
  'insight-post-subsidiary-vs-branch',
  'insight-post-company-basics',
  'insight-post-inheritance-custody',
  'insight-post-overtaking-accident',
  'insight-post-severance-exception',
  'insight-post-divorce-qna',
  'insight-post-massage-law',
  'insight-post-mandatory-employment',
  'insight-post-labor-severance',
  'insight-post-traffic-accident-procedure',
  'guide-0',
  'guide-1',
  'guide-2',
  'newsletter-0',
  'newsletter-1',
  'video-featured',
  'video-0',
  'video-1',
  'video-2',
  'video-3',
  'faq-0',
  'faq-1',
] as const;

describe('legacy client search index + public intent docs', () => {
  it('leaves KO and ZH-HANT indexes without public intent routes', () => {
    for (const locale of ['ko', 'zh-hant'] as const) {
      const items = getSearchIndex(locale);
      expect(items[0]?.id).toBe('services-0');
      for (const href of INTENT_HREFS[locale]) {
        expect(items.some((item) => item.href === href)).toBe(false);
      }
      expect(items.some((item) => item.id.startsWith(`page:${locale}:`))).toBe(false);
    }
  });

  it('prepends EN static service docs, shows summaries, and keeps existing relative order', () => {
    const staticDocs = getPublicIntentSearchDocs('en');
    const items = getSearchIndex('en');
    const prepended = items.slice(0, staticDocs.length);
    const rest = items.slice(staticDocs.length);

    expect(staticDocs).toHaveLength(4);
    expect(prepended.map((item) => item.href)).toEqual(staticDocs.map((doc) => doc.url));
    expect(prepended.every((item) => item.category === 'services')).toBe(true);
    expect(rest[0]?.id).toBe('services-0');
    expect(rest.some((item) => item.id === 'video-featured')).toBe(true);
    expect(rest.some((item) => item.id === 'faq-0')).toBe(true);
    expect(rest.map((item) => item.id)).toEqual([...EXPECTED_EN_LEGACY_SEARCH_IDS]);

    const newHrefs = staticDocs.map((doc) => doc.url);
    const newIds = prepended.map((item) => item.id);
    expect(new Set(newIds).size).toBe(4);
    for (const href of newHrefs) {
      expect(items.filter((item) => item.href === href)).toHaveLength(1);
      expect(rest.some((item) => item.href === href)).toBe(false);
    }

    const setupPage = getIntentPage('en', 'taiwan-company-setup-lawyer')!;
    const setupItem = items.find((item) => item.href === '/en/taiwan-company-setup-lawyer');
    expect(setupItem?.title).toBe(setupPage.title);
    expect(setupItem?.description).toBe(setupPage.description);
    expect(setupItem?.description).not.toBe(setupItem?.tags.join(' '));
    expect(setupItem?.tags.join(' ')).toContain(setupPage.searchTerms[0]);
    expect(setupItem?.tags.join(' ')).toContain(setupPage.faq[0].question);

    const advisory = getCorporateAdvisory('en')!;
    const corporateItem = items.find((item) => item.href === '/en/taiwan-lawyer#corporate-advisory');
    expect(corporateItem?.title).toBe(advisory.headline);
    expect(corporateItem?.description).toBe(advisory.summary);
    expect(corporateItem?.description).not.toContain(advisory.items[0].body);
    expect(corporateItem?.tags.join(' ')).toContain(advisory.items[0].title);
  });

  it('finds corporate, litigation, and setup links through filterSearchIndex on the EN index', () => {
    const items = getSearchIndex('en');

    expect(
      filterSearchIndex(items, 'corporate').some(
        (item) => item.href === '/en/taiwan-lawyer#corporate-advisory',
      ),
    ).toBe(true);
    expect(
      filterSearchIndex(items, 'litigation').some(
        (item) => item.href === '/en/taiwan-litigation-lawyer',
      ),
    ).toBe(true);
    expect(
      filterSearchIndex(items, 'setup').some(
        (item) => item.href === '/en/taiwan-company-setup-lawyer',
      ),
    ).toBe(true);
  });

  it('does not surface those EN intent hrefs from KO or ZH-HANT filters', () => {
    expect(
      filterSearchIndex(getSearchIndex('ko'), 'corporate').some((item) =>
        item.href.includes('taiwan-lawyer'),
      ),
    ).toBe(false);
    expect(
      filterSearchIndex(getSearchIndex('zh-hant'), 'litigation').some((item) =>
        item.href.includes('taiwan-litigation-lawyer'),
      ),
    ).toBe(false);
    expect(
      filterSearchIndex(getSearchIndex('ko'), 'setup').some(
        (item) => item.href === '/ko/taiwan-company-setup-lawyer',
      ),
    ).toBe(false);
  });
});
