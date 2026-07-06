import { describe, expect, it } from 'vitest';
import type { Locale } from '@/lib/locales';
import { resolveHomeInsightsCardLabels } from '@/lib/builder/home-insights-card-format';

const fallbackByLocale = {
  ko: '게시일 확인중',
  'zh-hant': '日期待確認',
  en: 'Date pending',
} satisfies Record<Locale, string>;

describe('resolveHomeInsightsCardLabels', () => {
  it.each([
    {
      locale: 'ko',
      dateDisplay: '2025-09-18',
      date: '2025-09-18T09:00:00.000Z',
      readTime: '3분 분량',
      content: '가'.repeat(2_180),
      expectedDate: '2025-09-18',
      expectedReadTime: '11 min',
    },
    {
      locale: 'zh-hant',
      dateDisplay: '2025年9月13日',
      date: '2025-09-18T09:00:00.000Z',
      readTime: '3分鐘閱讀',
      content: '法'.repeat(2_180),
      expectedDate: '2025-09-18',
      expectedReadTime: '11 min',
    },
    {
      locale: 'en',
      dateDisplay: 'September 18, 2025',
      date: '2025-09-18T09:00:00.000Z',
      readTime: '3 min read',
      content: 'law '.repeat(545),
      expectedDate: '2025-09-18',
      expectedReadTime: '11 min',
    },
  ] satisfies ReadonlyArray<{
    readonly locale: Locale;
    readonly dateDisplay: string;
    readonly date: string;
    readonly readTime: string;
    readonly content: string;
    readonly expectedDate: string;
    readonly expectedReadTime: string;
  }>)(
    'preserves composite card labels for $locale',
    ({ locale, dateDisplay, date, readTime, content, expectedDate, expectedReadTime }) => {
      const labels = resolveHomeInsightsCardLabels(
        { content, dateDisplay, date, readTime },
        fallbackByLocale[locale],
      );

      expect(labels.date).toBe(expectedDate);
      expect(labels.readTime).toBe(expectedReadTime);
    },
  );

  it('falls back to the composite raw date before the locale fallback label', () => {
    expect(resolveHomeInsightsCardLabels(
      { content: '', dateDisplay: '', date: '2025-09-18', readTime: '' },
      fallbackByLocale['zh-hant'],
    )).toEqual({ date: '2025-09-18', readTime: '' });
    expect(resolveHomeInsightsCardLabels(
      { content: '', dateDisplay: '', date: '', readTime: '' },
      fallbackByLocale.ko,
    )).toEqual({ date: '게시일 확인중', readTime: '' });
  });
});
