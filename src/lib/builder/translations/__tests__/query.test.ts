import { describe, expect, it } from 'vitest';
import { buildTranslationManagerQuery, parseTranslationTargetLocales } from '@/lib/builder/translations/query';

describe('translation manager query helpers', () => {
  it('parses comma-separated target locales and falls back to all allowed locales', () => {
    expect(parseTranslationTargetLocales('en, zh-hant', ['en', 'zh-hant', 'ko'])).toEqual(['en', 'zh-hant']);
    expect(parseTranslationTargetLocales('invalid', ['en', 'zh-hant'])).toEqual(['en', 'zh-hant']);
    expect(parseTranslationTargetLocales(undefined, ['en', 'zh-hant'])).toEqual(['en', 'zh-hant']);
  });

  it('builds shareable query strings for the current review state', () => {
    const query = buildTranslationManagerQuery({
      sourceLocale: 'ko',
      selectedCategory: 'navigation',
      search: 'home',
      statusFilter: 'outdated',
      visibleTargets: ['en'],
      allTargetLocales: ['en', 'zh-hant'],
    });

    expect(query).toBe('sourceLocale=ko&category=navigation&search=home&status=outdated&target=en');
  });

  it('uses targets when multiple locales are visible', () => {
    const query = buildTranslationManagerQuery({
      sourceLocale: 'ko',
      selectedCategory: 'all',
      search: '',
      statusFilter: 'all',
      visibleTargets: ['en', 'zh-hant'],
      allTargetLocales: ['en', 'zh-hant'],
    });

    expect(query).toBe('sourceLocale=ko');
  });

  it('stores a targets list when only some locales are visible', () => {
    const query = buildTranslationManagerQuery({
      sourceLocale: 'ko',
      selectedCategory: 'all',
      search: '',
      statusFilter: 'all',
      visibleTargets: ['zh-hant'],
      allTargetLocales: ['en', 'zh-hant'],
    });

    expect(query).toBe('sourceLocale=ko&target=zh-hant');
  });
});
