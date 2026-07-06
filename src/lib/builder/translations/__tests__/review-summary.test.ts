import { describe, expect, it } from 'vitest';
import type { TranslationEntry } from '@/lib/builder/translations/types';
import { buildTranslationReviewSummary, countTranslationStatuses } from '@/lib/builder/translations/review-summary';

const entries = [
  {
    key: 'nav.home',
    sourceLocale: 'ko',
    sourceText: '홈',
    sourceHash: 'h1',
    content: { category: 'navigation', contentType: 'menu-item', contentRef: 'nav.home', label: 'Home' },
    translations: {
      en: { text: 'Home', status: 'translated', sourceHashAtTranslation: 'h1', translatedBy: 'manual', translatedAt: '2026-05-20T00:00:00.000Z' },
      'zh-hant': { text: '首頁', status: 'manual', sourceHashAtTranslation: 'h1', translatedBy: 'manual', translatedAt: '2026-05-20T00:00:00.000Z' },
    },
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  },
  {
    key: 'nav.about',
    sourceLocale: 'ko',
    sourceText: '소개',
    sourceHash: 'h2',
    content: { category: 'navigation', contentType: 'menu-item', contentRef: 'nav.about', label: 'About' },
    translations: {
      en: { text: 'About us', status: 'outdated', sourceHashAtTranslation: 'old', translatedBy: 'ai-openai', translatedAt: '2026-05-20T00:00:00.000Z' },
    },
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  },
] satisfies TranslationEntry[];

describe('translation review summary', () => {
  it('counts status totals per locale and overall candidates', () => {
    const summary = buildTranslationReviewSummary(entries, ['en', 'zh-hant']);

    expect(summary.totalEntries).toBe(2);
    expect(summary.statusCounts).toEqual({
      translated: 1,
      outdated: 1,
      missing: 1,
      manual: 1,
    });
    expect(summary.locales).toEqual([
      {
        locale: 'en',
        total: 2,
        translated: 1,
        manual: 0,
        outdated: 1,
        missing: 0,
        batchCandidates: 1,
      },
      {
        locale: 'zh-hant',
        total: 2,
        translated: 0,
        manual: 1,
        outdated: 0,
        missing: 1,
        batchCandidates: 1,
      },
    ]);
    expect(countTranslationStatuses(entries, ['en', 'zh-hant'])).toBe(2);
  });
});
