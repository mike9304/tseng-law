import { describe, expect, it } from 'vitest';
import { getFeaturedInsights, insightsArchive } from '../insights-archive';

describe('insights archive publication order', () => {
  it.each(['ko', 'zh-hant', 'en'] as const)(
    'keeps the verified cosmetics date and the semiconductor lead article in %s',
    (locale) => {
      const cosmetics = insightsArchive[locale].posts.find(
        (post) => post.id === 'cosmetics-market-entry',
      );

      expect(cosmetics?.date).toBe('2026.02.04');
      // 2026-09-19 owner decision: column 018 stays public and leads the home feed.
      expect(getFeaturedInsights(locale)[0]?.id).toBe('semiconductor-market-entry');
      expect(getFeaturedInsights(locale).map((post) => post.id)).toContain('cosmetics-market-entry');
    },
  );

  it('labels the English archive Insights to match the nav', () => {
    expect(insightsArchive.en.title).toBe('Insights');
    expect(insightsArchive.en.title).not.toBe('Columns');
  });
});

