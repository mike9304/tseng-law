import { describe, expect, it } from 'vitest';
import {
  REQUIRED_STANDARD_PAGE_SLUGS,
  matchesStandardPageSlugForLocale,
  needsStandardPageSeedForLocale,
} from '@/lib/builder/site/standard-pages';
import type { Locale } from '@/lib/locales';

function page(slug: string, locale: Locale = 'ko', options: { home?: boolean } = {}) {
  return {
    slug,
    locale,
    isHomePage: options.home,
  };
}

function completePages(locale: Locale) {
  return REQUIRED_STANDARD_PAGE_SLUGS.map((slug) => page(slug, locale, { home: slug === '' }));
}

describe('needsStandardPageSeedForLocale', () => {
  it('does not seed when the requested locale has every standard page', () => {
    expect(needsStandardPageSeedForLocale(completePages('ko'), 'ko')).toBe(false);
  });

  it('requires seeding when another locale has home but the requested locale does not', () => {
    const pages = [
      page('', 'zh-hant', { home: true }),
      ...REQUIRED_STANDARD_PAGE_SLUGS.filter((slug) => slug !== '')
        .map((slug) => page(slug, 'ko')),
    ];

    expect(needsStandardPageSeedForLocale(pages, 'ko')).toBe(true);
  });

  it('requires seeding when another locale has a matching slug only', () => {
    const pages = completePages('ko').filter((entry) => entry.slug !== 'services');
    pages.push(page('services', 'zh-hant'));

    expect(needsStandardPageSeedForLocale(pages, 'ko')).toBe(true);
  });

  it('treats legacy pages without locale as default Korean pages only', () => {
    const legacyPages = REQUIRED_STANDARD_PAGE_SLUGS.map((slug) => ({
      slug,
      isHomePage: slug === '',
    }));

    expect(needsStandardPageSeedForLocale(legacyPages, 'ko')).toBe(false);
    expect(needsStandardPageSeedForLocale(legacyPages, 'zh-hant')).toBe(true);
  });

  it('matches duplicate seed candidates only inside the requested locale', () => {
    expect(matchesStandardPageSlugForLocale(page('', 'zh-hant', { home: true }), 'ko', '')).toBe(false);
    expect(matchesStandardPageSlugForLocale(page('', 'ko', { home: true }), 'ko', '')).toBe(true);
    expect(matchesStandardPageSlugForLocale(page('services', 'zh-hant'), 'ko', 'services')).toBe(false);
    expect(matchesStandardPageSlugForLocale(page('services', 'ko'), 'ko', 'services')).toBe(true);
  });
});
