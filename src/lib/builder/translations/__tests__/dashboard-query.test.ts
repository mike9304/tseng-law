import { describe, expect, it } from 'vitest';
import {
  buildTranslationDashboardQuery,
  parseTranslationDashboardStatusFilter,
} from '@/lib/builder/translations/dashboard-query';
import {
  buildTranslationManagerQuery,
  buildTranslationManagerReviewQuery,
} from '@/lib/builder/translations/query';

describe('translation dashboard query helpers', () => {
  it('parses a dashboard status filter safely', () => {
    expect(parseTranslationDashboardStatusFilter('missing')).toBe('untranslated');
    expect(parseTranslationDashboardStatusFilter('published')).toBe('published');
    expect(parseTranslationDashboardStatusFilter('invalid')).toBe('all');
    expect(parseTranslationDashboardStatusFilter(undefined)).toBe('all');
  });

  it('builds dashboard query strings from the current filter state', () => {
    expect(buildTranslationDashboardQuery({ sourceLocale: 'ko', statusFilter: 'all' })).toBe('sourceLocale=ko');
    expect(buildTranslationDashboardQuery({ sourceLocale: 'ko', statusFilter: 'draft' })).toBe('sourceLocale=ko&status=draft');
  });

  it('can force a single target locale review link for the manager', () => {
    expect(buildTranslationManagerQuery({
      sourceLocale: 'ko',
      selectedCategory: 'all',
      search: '',
      statusFilter: 'outdated',
      visibleTargets: ['en', 'zh-hant'],
      allTargetLocales: ['en', 'zh-hant'],
      targetLocale: 'en',
    })).toBe('sourceLocale=ko&status=outdated&target=en');
  });

  it('can build a missing-locale review link for the manager', () => {
    expect(buildTranslationManagerQuery({
      sourceLocale: 'ko',
      selectedCategory: 'all',
      search: '',
      statusFilter: 'missing',
      visibleTargets: ['zh-hant'],
      allTargetLocales: ['en', 'zh-hant'],
      targetLocale: 'zh-hant',
    })).toBe('sourceLocale=ko&status=missing&target=zh-hant');
  });

  it('can build a concise review query for a single target locale', () => {
    expect(buildTranslationManagerReviewQuery({
      sourceLocale: 'ko',
      targetLocale: 'en',
      statusFilter: 'outdated',
    })).toBe('sourceLocale=ko&status=outdated&target=en');
  });
});
