import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
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
  LocaleFlagSwitcherView,
  localeFlagHref,
} from '@/components/LocaleFlagSwitcher';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import {
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  type PublicLocale8,
} from '@/lib/public-guidance';

function renderedHtml(locale: PublicLocale8): string {
  return renderToStaticMarkup(<LocaleFlagSwitcher locale={locale} />);
}

function renderedLinks(locale: PublicLocale8): string[] {
  return renderedHtml(locale).match(/<a\b[\s\S]*?<\/a>/g) ?? [];
}

/** WO-O22 A: the pure view, with no provider — the conservative fallback path. */
function switcherTree(locale: PublicLocale8, onLocaleSelect?: (target: PublicLocale8) => void) {
  return LocaleFlagSwitcherView({
    locale,
    pathname: navigationState.pathname,
    onLocaleSelect,
  });
}

function collectElements(node: ReactNode): ReactElement[] {
  const out: ReactElement[] = [];
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;
    out.push(child);
    if (child.props?.children != null) {
      out.push(...collectElements(child.props.children));
    }
  });
  return out;
}

describe('LocaleFlagSwitcher', () => {
  beforeEach(() => {
    navigationState.pathname = '/ko/services';
  });

  it('renders the eight autonyms without national flags or country labels', () => {
    expect(LOCALE_FLAG_OPTIONS.map((option) => [option.locale, option.label])).toEqual([
      ['ko', '한국어'],
      ['zh-hant', '繁體中文'],
      ['en', 'English'],
      ['ja', '日本語'],
      ['vi', 'Tiếng Việt'],
      ['id', 'Bahasa Indonesia'],
      ['th', 'ไทย'],
      ['fil', 'Filipino'],
    ]);
    expect(LOCALE_FLAG_OPTIONS.map((option) => option.locale)).toEqual([...PUBLIC_LOCALES_8]);

    const html = renderedHtml('ko');
    expect(html).not.toContain('🇰🇷');
    expect(html).not.toContain('🇯🇵');
    expect(html).not.toContain('🇹🇼');
    expect(html).not.toContain('🇺🇸');
    expect(html).not.toContain('대한민국');
    expect(html).not.toContain('United States');
    expect(html).not.toContain('>KR</span>');
    expect(html).not.toContain('>JP</span>');
    expect(html).not.toContain('>TW</span>');
    expect(html).not.toContain('>EN</span>');

    const links = renderedLinks('ko');
    const expected = [
      { href: '/ko/services', label: '한국어' },
      { href: '/zh-hant/services', label: '繁體中文' },
      { href: '/en/services', label: 'English' },
      { href: '/ja/services', label: '日本語' },
      { href: '/vi/services', label: 'Tiếng Việt' },
      { href: '/id/services', label: 'Bahasa Indonesia' },
      { href: '/th/services', label: 'ไทย' },
      { href: '/fil/services', label: 'Filipino' },
    ];

    expect(links).toHaveLength(expected.length);
    expected.forEach((option, index) => {
      expect(links[index]).toContain(`href="${option.href}"`);
      expect(links[index]).toContain(option.label);
      expect(links[index]).not.toMatch(/>ko</i);
      expect(links[index]).not.toMatch(/>zh-hant</i);
    });
  });

  it('uses the JA fail-closed fallback and sends the new four to their home page', () => {
    navigationState.pathname = '/en/account/settings';

    expect(localeFlagHref(navigationState.pathname, 'ko')).toBe('/ko/account/settings');
    expect(localeFlagHref(navigationState.pathname, 'zh-hant')).toBe('/zh-hant/account/settings');
    expect(localeFlagHref(navigationState.pathname, 'en')).toBe('/en/account/settings');
    expect(localeFlagHref(navigationState.pathname, 'ja')).toBe('/ja/columns');
    // WO-O22 A: `/vi/account/settings` does not exist, so the switcher lands on
    // the nearest page that does — the language home — never a 404.
    expect(localeFlagHref(navigationState.pathname, 'vi')).toBe('/vi');
    expect(localeFlagHref(navigationState.pathname, 'id')).toBe('/id');
    expect(localeFlagHref(navigationState.pathname, 'th')).toBe('/th');
    expect(localeFlagHref(navigationState.pathname, 'fil')).toBe('/fil');

    const links = renderedLinks('en');
    expect(links).toHaveLength(PUBLIC_LOCALES_8.length);
    expect(links.some((link) => link.includes('href="/ja/columns"'))).toBe(true);
    for (const locale of ['vi', 'id', 'th', 'fil'] as const) {
      const link = links.find((candidate) => candidate.includes(`href="/${locale}"`));
      expect(link, `${locale} fallback link`).toBeDefined();
      expect(link).toContain('data-locale-switch-fallback="home"');
      expect(link).toContain('aria-label=');
    }
    expect(links.some((link) => /href="\/(vi|id|th|fil)\/account/.test(link))).toBe(false);
  });

  it('preserves the translated Wei Tseng lawyer detail across the four source languages', () => {
    navigationState.pathname = '/ja/lawyers/wei-tseng';

    const links = renderedLinks('ja');
    const expectedHrefs = [
      '/ko/lawyers/wei-tseng',
      '/zh-hant/lawyers/wei-tseng',
      '/en/lawyers/wei-tseng',
      '/ja/lawyers/wei-tseng',
      // WO-O22 A: the new four have no lawyer detail page, so they keep their
      // slot in the switcher and link to their own home page instead.
      '/vi',
      '/id',
      '/th',
      '/fil',
    ];

    expect(links).toHaveLength(PUBLIC_LOCALES_8.length);
    expectedHrefs.forEach((href) => {
      expect(links.some((link) => link.includes(`href="${href}"`))).toBe(true);
    });
    expect(links.find((link) => link.includes('href="/ja/lawyers/wei-tseng"'))).toContain(
      'aria-current="page"',
    );
    expect(links.find((link) => link.includes('href="/ko/lawyers/wei-tseng"'))).not.toContain(
      'aria-current',
    );
    expect(localeFlagHref(navigationState.pathname, 'vi')).toBe('/vi');
    expect(renderedHtml('ja')).not.toContain('aria-disabled');
    expect(renderedHtml('ja')).not.toContain('href="/vi/lawyers/wei-tseng"');
  });

  it('falls back to the Japanese lawyer list for unsupported lawyer details', () => {
    navigationState.pathname = '/en/lawyers/unsupported-attorney';

    expect(localeFlagHref(navigationState.pathname, 'ja')).toBe('/ja/lawyers');
    expect(renderedLinks('en').some((link) => link.includes('href="/ja/lawyers"'))).toBe(true);
    expect(localeFlagHref(navigationState.pathname, 'vi')).toBe('/vi');
  });

  it('marks only the active locale as the current page', () => {
    navigationState.pathname = '/ja/columns/taiwan-investment';
    const links = renderedLinks('ja');

    expect(links.find((link) => link.includes('href="/ja/columns/taiwan-investment"'))).toContain(
      'aria-current="page"',
    );
    expect(links.find((link) => link.includes('href="/ko/columns/taiwan-investment"'))).not.toContain(
      'aria-current',
    );
    expect(links.some((link) => link.includes('href="/vi/columns/taiwan-investment"'))).toBe(false);
  });

  it('calls the mobile close callback for every language, including the new four', () => {
    const onLocaleSelect = vi.fn();
    const switcher = switcherTree('ko', onLocaleSelect);
    const elements = collectElements(switcher);
    const zhHantLink = elements.find((element) => element.props.href === '/zh-hant/services');
    const viLink = elements.find((element) => element.props.href === '/vi/services');
    const disabled = elements.filter(
      (element) => element.props['aria-disabled'] !== undefined,
    );

    expect(zhHantLink).toBeDefined();
    zhHantLink?.props.onClick?.();
    expect(onLocaleSelect).toHaveBeenCalledWith('zh-hant');

    expect(viLink).toBeDefined();
    viLink?.props.onClick?.();
    expect(onLocaleSelect).toHaveBeenCalledWith('vi');
    expect(onLocaleSelect).toHaveBeenCalledTimes(2);

    expect(disabled).toHaveLength(0);
  });

  it('keeps every guidance language selectable on a column detail page', () => {
    navigationState.pathname = '/ko/columns/taiwan-investment';
    const onLocaleSelect = vi.fn();
    const switcher = switcherTree('ko', onLocaleSelect);
    const elements = collectElements(switcher);
    // No provider here, so the switcher refuses to guess an article URL and
    // degrades to each language's column index — a real page, never a 404.
    const fallbackLinks = elements.filter(
      (element) => element.props['data-locale-switch-fallback'] === 'columns-list',
    );

    expect(fallbackLinks).toHaveLength(4);
    fallbackLinks.forEach((element) => {
      expect(element.props['aria-disabled']).toBeUndefined();
      expect(element.props.href).toMatch(/^\/(vi|id|th|fil)\/columns$/);
      element.props.onClick?.();
    });
    expect(onLocaleSelect.mock.calls.map(([target]) => target)).toEqual(['vi', 'id', 'th', 'fil']);
    expect(renderedLinks('ko').some((link) => /href="\/(vi|id|th|fil)\/columns\//.test(link))).toBe(
      false,
    );
  });

  it('names the target language in the fallback notice, not this page language', () => {
    navigationState.pathname = '/ko/columns/taiwan-investment';
    const html = renderedHtml('ko');
    const expected = internationalInquiryCopy.ko.unavailableLanguageNotice
      .split('{language}')
      .join(PUBLIC_LANGUAGE_AUTONYMS.vi);
    const currentLanguageNotice = internationalInquiryCopy.ko.unavailableLanguageNotice
      .split('{language}')
      .join(PUBLIC_LANGUAGE_AUTONYMS.ko);
    const viFallback = collectElements(switcherTree('ko')).find(
      (element) => element.props.href === '/vi/columns',
    );

    expect(expected).toContain('Tiếng Việt');
    expect(expected).not.toBe(currentLanguageNotice);
    expect(html).toContain(`title="${expected}"`);
    expect(html).toContain(`aria-label="${PUBLIC_LANGUAGE_AUTONYMS.vi}. ${expected}"`);
    expect(html).toContain(PUBLIC_LANGUAGE_AUTONYMS.vi);
    expect(html).not.toContain(internationalInquiryCopy.ko.unavailableTranslationNotice);
    expect(html).not.toContain(currentLanguageNotice);
    expect(viFallback).toBeDefined();
    expect(viFallback?.props['aria-label']).toBe(`${PUBLIC_LANGUAGE_AUTONYMS.vi}. ${expected}`);
    expect(viFallback?.props.title).toBe(expected);
    expect(renderedLinks('ko').some((link) => link.includes('href="/vi/columns/'))).toBe(false);
  });

  it('links a column detail straight to the same article when the translation exists', () => {
    navigationState.pathname = '/ja/columns/taiwan-labor-severance-law';
    const switcher = LocaleFlagSwitcherView({
      locale: 'ja',
      pathname: navigationState.pathname,
      columnSlugsByLocale: {
        vi: ['taiwan-labor-severance-law'],
        id: ['taiwan-labor-severance-law'],
        th: ['taiwan-labor-severance-law'],
        fil: ['taiwan-labor-severance-law'],
      },
    });
    const elements = collectElements(switcher);

    for (const locale of ['vi', 'id', 'th', 'fil'] as const) {
      const link = elements.find(
        (element) => element.props.href === `/${locale}/columns/taiwan-labor-severance-law`,
      );
      expect(link, `${locale} same-slug link`).toBeDefined();
      expect(link?.props['data-locale-switch-fallback']).toBeUndefined();
      expect(link?.props['aria-label']).toBeUndefined();
    }
  });
});
