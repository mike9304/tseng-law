import { describe, expect, it } from 'vitest';
import { getFeaturedInsights, insightsArchive } from '../insights-archive';

describe('insights archive publication order', () => {
  it.each(['ko', 'zh-hant', 'en'] as const)(
    'uses the verified 2026 cosmetics publication date in %s',
    (locale) => {
      const cosmetics = insightsArchive[locale].posts.find(
        (post) => post.id === 'cosmetics-market-entry',
      );

      expect(cosmetics?.date).toBe('2026.02.04');
      expect(getFeaturedInsights(locale)[0]?.id).toBe('cosmetics-market-entry');
    },
  );
});
