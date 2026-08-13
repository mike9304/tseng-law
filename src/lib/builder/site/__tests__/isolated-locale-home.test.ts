import { describe, expect, it } from 'vitest';
import {
  BUILDER_AUTHORING_LOCALES,
  createIsolatedHomeDecomposeBody,
  createIsolatedHomePublishBody,
  createIsolatedHomeSeedBody,
  parseBuilderAuthoringLocale,
} from '../isolated-locale-home';

describe('isolated locale home request contract', () => {
  it('accepts the three builder authoring locales and rejects public-only ja', () => {
    expect(BUILDER_AUTHORING_LOCALES).toEqual(['ko', 'zh-hant', 'en']);
    expect(parseBuilderAuthoringLocale('ko')).toBe('ko');
    expect(parseBuilderAuthoringLocale('zh-hant')).toBe('zh-hant');
    expect(parseBuilderAuthoringLocale('en')).toBe('en');
    expect(parseBuilderAuthoringLocale('ja')).toBeNull();
    expect(parseBuilderAuthoringLocale('')).toBeNull();
    expect(parseBuilderAuthoringLocale(undefined)).toBeNull();
  });

  it('builds the documented seed/decompose/publish bodies used by isolated QA', () => {
    expect(createIsolatedHomeSeedBody('zh-hant')).toEqual({ locale: 'zh-hant' });
    expect(createIsolatedHomeDecomposeBody('en')).toEqual({ slug: '', locale: 'en' });
    expect(createIsolatedHomePublishBody('page-home-en', 'en')).toEqual({
      pageIds: ['page-home-en'],
      cmsCollectionIds: [],
      locale: 'en',
    });
  });
});
