import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/ko/services',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import LocaleFlagSwitcher, {
  LOCALE_FLAG_OPTIONS,
  localeFlagHref,
} from '@/components/LocaleFlagSwitcher';
import { PUBLIC_LANGUAGE_AUTONYMS, type PublicLocale8 } from '@/lib/public-guidance';
import { restrictedPublicFamilyListPath } from '@/lib/public-route-policy';

function renderedHtml(locale: PublicLocale8): string {
  return renderToStaticMarkup(<LocaleFlagSwitcher locale={locale} />);
}

function renderedLinks(locale: PublicLocale8): string[] {
  return renderedHtml(locale).match(/<a\b[\s\S]*?<\/a>/g) ?? [];
}

describe('public module locale family switching', () => {
  beforeEach(() => {
    navigationState.pathname = '/ko/services';
  });

  it('keeps the eight autonym order without country codes', () => {
    expect(LOCALE_FLAG_OPTIONS.map((option) => option.locale)).toEqual([
      'ko',
      'zh-hant',
      'en',
      'ja',
      'vi',
      'id',
      'th',
      'fil',
    ]);
    expect(LOCALE_FLAG_OPTIONS.map((option) => option.label)).toEqual([
      PUBLIC_LANGUAGE_AUTONYMS.ko,
      PUBLIC_LANGUAGE_AUTONYMS['zh-hant'],
      PUBLIC_LANGUAGE_AUTONYMS.en,
      PUBLIC_LANGUAGE_AUTONYMS.ja,
      PUBLIC_LANGUAGE_AUTONYMS.vi,
      PUBLIC_LANGUAGE_AUTONYMS.id,
      PUBLIC_LANGUAGE_AUTONYMS.th,
      PUBLIC_LANGUAGE_AUTONYMS.fil,
    ]);
  });

  it('maps the 12 product/category/portfolio EN/ZH switches to family lists', () => {
    const twelveEnZhCases: Array<[string, 'en' | 'zh-hant', string]> = [
      ['/ko/store/products/taiwan-startup-guide', 'en', '/en/store'],
      ['/ko/store/products/taiwan-startup-guide', 'zh-hant', '/zh-hant/store'],
      ['/ko/store/categories/imports', 'en', '/en/store'],
      ['/ko/store/categories/imports', 'zh-hant', '/zh-hant/store'],
      ['/ko/store/categories/digital-guides', 'en', '/en/store'],
      ['/ko/store/categories/digital-guides', 'zh-hant', '/zh-hant/store'],
      ['/ko/store/categories/consultation', 'en', '/en/store'],
      ['/ko/store/categories/consultation', 'zh-hant', '/zh-hant/store'],
      ['/ko/portfolio/taiwan-company-setup-case', 'en', '/en/portfolio'],
      ['/ko/portfolio/taiwan-company-setup-case', 'zh-hant', '/zh-hant/portfolio'],
      ['/ko/portfolio/taiwan-labor-dispute-case', 'en', '/en/portfolio'],
      ['/ko/portfolio/taiwan-labor-dispute-case', 'zh-hant', '/zh-hant/portfolio'],
    ];
    expect(twelveEnZhCases).toHaveLength(12);
    for (const [pathname, target, expected] of twelveEnZhCases) {
      expect(localeFlagHref(pathname, target)).toBe(expected);
      expect(localeFlagHref(pathname.replace('/ko/', '/ja/'), target)).toBe(expected);
      expect(localeFlagHref(pathname, 'vi')).toBe('');
    }
  });

  it('preserves the current language path for restricted family details', () => {
    expect(localeFlagHref('/ko/store/products/taiwan-startup-guide', 'ko')).toBe('/ko/store/products/taiwan-startup-guide');
    expect(localeFlagHref('/zh-hant/portfolio/company-setup-case', 'zh-hant')).toBe('/zh-hant/portfolio/company-setup-case');
    expect(localeFlagHref('/en/events/seminar-2026', 'en')).toBe('/en/events/seminar-2026');
  });

  it('falls back event details to the family list for other languages including JA', () => {
    expect(localeFlagHref('/ko/events/seminar-2026', 'en')).toBe('/en/events');
    expect(localeFlagHref('/ko/events/seminar-2026', 'zh-hant')).toBe('/zh-hant/events');
    expect(localeFlagHref('/ko/events/seminar-2026', 'ja')).toBe('/ja/events');
    expect(localeFlagHref('/ko/events/seminar-2026', 'ko')).toBe('/ko/events/seminar-2026');
    expect(localeFlagHref('/ko/events/seminar-2026', 'vi')).toBe('');
  });

  it('preserves JA login and JA family list roots', () => {
    expect(localeFlagHref('/en/login', 'ja')).toBe('/ja/login');
    expect(localeFlagHref('/ja/login', 'ja')).toBe('/ja/login');
    expect(localeFlagHref('/ko/store', 'ja')).toBe('/ja/store');
    expect(localeFlagHref('/ko/portfolio', 'ja')).toBe('/ja/portfolio');
    expect(localeFlagHref('/ko/events', 'ja')).toBe('/ja/events');
    expect(localeFlagHref('/en/login', 'vi')).toBe('');
    expect(localeFlagHref('/ko/store', 'vi')).toBe('');
  });

  it('preserves core article, service, and profile counterparts', () => {
    expect(localeFlagHref('/ko/columns/taiwan-investment', 'ja')).toBe('/ja/columns/taiwan-investment');
    expect(localeFlagHref('/ko/columns/taiwan-investment', 'en')).toBe('/en/columns/taiwan-investment');
    expect(localeFlagHref('/ko/columns/taiwan-investment', 'vi')).toBe('');
    expect(localeFlagHref('/ko/services/investment', 'ja')).toBe('/ja/services/investment');
    expect(localeFlagHref('/ko/services/investment', 'zh-hant')).toBe('/zh-hant/services/investment');
    expect(localeFlagHref('/ko/services/investment', 'fil')).toBe('');
    expect(localeFlagHref('/en/lawyers/wei-tseng', 'ja')).toBe('/ja/lawyers/wei-tseng');
    expect(localeFlagHref('/ja/lawyers/wei-tseng', 'en')).toBe('/en/lawyers/wei-tseng');
    expect(localeFlagHref('/en/lawyers/wei-tseng', 'th')).toBe('');
  });

  it('keeps the existing account/settings JA safe fallback', () => {
    expect(localeFlagHref('/en/account/settings', 'ja')).toBe('/ja/columns');
    expect(localeFlagHref('/en/account/settings', 'ko')).toBe('/ko/account/settings');
    expect(localeFlagHref('/en/account/settings', 'id')).toBe('');
  });

  it('links the exact billing and booking utilities to JA without changing their token or query', () => {
    expect(localeFlagHref('/en/account/billing', 'ja')).toBe('/ja/account/billing');
    expect(localeFlagHref('/ko/bookings/manage/audit-invalid-token', 'ja')).toBe('/ja/bookings/manage/audit-invalid-token');
    expect(localeFlagHref('/en/account/billing?view=summary#details', 'ja')).toBe('/ja/account/billing?view=summary#details');
    expect(localeFlagHref('/en/bookings/manage/audit%2Fopaque-token?view=summary#details', 'ja')).toBe('/ja/bookings/manage/audit%2Fopaque-token?view=summary#details');
    const currentPath = '/ja/bookings/manage/audit-invalid-token?view=summary';
    expect(localeFlagHref(currentPath, 'ja')).toBe(currentPath);
    expect(localeFlagHref('/en/account/billing?view=summary#details', 'vi')).toBe('');
  });

  it('keeps other account and booking paths on the existing JA fallback', () => {
    for (const path of [
      '/en/account/settings?view=summary',
      '/en/account/billing/history',
      '/en/bookings/manage',
      '/en/bookings/manage/audit-invalid-token/history',
      '/en/bookings/create/audit-invalid-token',
    ]) {
      expect(localeFlagHref(path, 'ja')).toBe('/ja/columns');
      expect(localeFlagHref(path, 'vi')).toBe('');
    }
  });

  it('does not treat services or unsafe fragments as restricted families', () => {
    expect(restrictedPublicFamilyListPath('services/investment')).toBeNull();
    expect(restrictedPublicFamilyListPath('store/checkout')).toBeNull();
    expect(restrictedPublicFamilyListPath('portfolio/foo/bar')).toBeNull();
    expect(restrictedPublicFamilyListPath('portfolio//foo')).toBeNull();
    expect(restrictedPublicFamilyListPath('store/products//guide')).toBeNull();
    expect(restrictedPublicFamilyListPath('store/products/taiwan-startup-guide?next=/admin#frag')).toBe('/store');
  });

  it('renders family-list hrefs for other flags while keeping the current product path', () => {
    navigationState.pathname = '/ko/store/products/taiwan-startup-guide';
    const html = renderedHtml('ko');
    const links = renderedLinks('ko');
    const current = links.find((link) => link.includes('href="/ko/store/products/taiwan-startup-guide"'));

    expect(current).toContain('aria-current="page"');
    expect(links.some((link) => link.includes('href="/ja/store"'))).toBe(true);
    expect(links.some((link) => link.includes('href="/zh-hant/store"'))).toBe(true);
    expect(links.some((link) => link.includes('href="/en/store"'))).toBe(true);
    expect(html).not.toContain('/en/store/products/taiwan-startup-guide');
    expect(html).not.toContain('/zh-hant/store/products/taiwan-startup-guide');
    expect(html).not.toContain('href="/vi/store');
    expect(html).not.toContain('href="/vi/store/products/taiwan-startup-guide');
    expect(html).toContain('aria-disabled="true"');
  });
});
