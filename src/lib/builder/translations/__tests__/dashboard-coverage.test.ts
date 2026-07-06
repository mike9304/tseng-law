import { describe, expect, it } from 'vitest';
import type { Locale } from '@/lib/locales';
import type {
  TranslationContentRef,
  TranslationEntry,
  TranslationTargetValue,
} from '@/lib/builder/translations/types';
import { buildTranslationDashboardCoverageSummaries } from '@/lib/builder/translations/dashboard-coverage';

const now = '2026-06-19T00:00:00.000Z';

function targetValue(
  status: TranslationTargetValue['status'],
): TranslationTargetValue {
  return {
    text: `${status} text`,
    status,
    sourceHashAtTranslation: 'source-hash',
    translatedBy: status === 'manual' ? 'manual' : 'mock',
    translatedAt: now,
  };
}

function entry({
  key,
  category,
  contentType,
  translations,
}: {
  key: string;
  category: TranslationContentRef['category'];
  contentType: TranslationContentRef['contentType'];
  translations: Partial<Record<Locale, TranslationTargetValue>>;
}): TranslationEntry {
  return {
    key,
    sourceLocale: 'ko',
    sourceText: `Source ${key}`,
    sourceHash: `hash-${key}`,
    content: {
      contentType,
      contentRef: key,
      category,
      label: key,
    },
    translations,
    createdAt: now,
    updatedAt: now,
  };
}

describe('buildTranslationDashboardCoverageSummaries', () => {
  it('groups CMS, media, and app translation health by locale', () => {
    const summaries = buildTranslationDashboardCoverageSummaries(
      [
        entry({
          key: 'column:immigration:title',
          category: 'columns',
          contentType: 'column-title',
          translations: {
            en: targetValue('manual'),
            'zh-hant': targetValue('outdated'),
          },
        }),
        entry({
          key: 'page:home:hero:image:alt',
          category: 'pages',
          contentType: 'node-image-alt',
          translations: {
            en: targetValue('translated'),
          },
        }),
        entry({
          key: 'app:faq-manager:content:faq-1:question',
          category: 'apps',
          contentType: 'app-content',
          translations: {
            'zh-hant': targetValue('manual'),
          },
        }),
      ],
      ['zh-hant', 'en'],
    );

    expect(summaries.map((summary) => summary.key)).toEqual(['cms', 'media', 'apps']);
    expect(summaries).toContainEqual(expect.objectContaining({
      key: 'cms',
      totalStrings: 1,
      totalCells: 2,
      manual: 1,
      outdated: 1,
      missing: 0,
      needsAttention: 1,
      completionRate: 50,
    }));
    expect(summaries).toContainEqual(expect.objectContaining({
      key: 'media',
      totalStrings: 1,
      translated: 1,
      missing: 1,
      needsAttention: 1,
      completionRate: 50,
    }));
    expect(summaries).toContainEqual(expect.objectContaining({
      key: 'apps',
      totalStrings: 1,
      manual: 1,
      missing: 1,
      needsAttention: 1,
      completionRate: 50,
    }));

    const cms = summaries.find((summary) => summary.key === 'cms');
    expect(cms?.locales).toContainEqual(expect.objectContaining({
      locale: 'en',
      manual: 1,
      needsAttention: 0,
      completionRate: 100,
    }));
    expect(cms?.locales).toContainEqual(expect.objectContaining({
      locale: 'zh-hant',
      outdated: 1,
      needsAttention: 1,
      completionRate: 0,
    }));
  });
});
