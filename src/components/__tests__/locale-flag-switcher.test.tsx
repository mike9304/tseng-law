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

  it('uses the JA fail-closed fallback while preserving unsupported paths for complete locales', () => {
    navigationState.pathname = '/en/account/settings';

    expect(localeFlagHref(navigationState.pathname, 'ko')).toBe('/ko/account/settings');
    expect(localeFlagHref(navigationState.pathname, 'zh-hant')).toBe('/zh-hant/account/settings');
    expect(localeFlagHref(navigationState.pathname, 'en')).toBe('/en/account/settings');
    expect(localeFlagHref(navigationState.pathname, 'ja')).toBe('/ja/columns');
    expect(localeFlagHref(navigationState.pathname, 'vi')).toBe('');
    expect(localeFlagHref(navigationState.pathname, 'id')).toBe('');
    expect(localeFlagHref(navigationState.pathname, 'th')).toBe('');
    expect(localeFlagHref(navigationState.pathname, 'fil')).toBe('');

    const links = renderedLinks('en');
    expect(links.some((link) => link.includes('href="/ja/columns"'))).toBe(true);
    expect(links.some((link) => link.includes('href="/vi/'))).toBe(false);
    expect(links.some((link) => link.includes('href="/id/'))).toBe(false);
    expect(links.some((link) => link.includes('href="/th/'))).toBe(false);
    expect(links.some((link) => link.includes('href="/fil/'))).toBe(false);
  });

  it('preserves the translated Wei Tseng lawyer detail across the four source languages', () => {
    navigationState.pathname = '/ja/lawyers/wei-tseng';

    const links = renderedLinks('ja');
    const expectedHrefs = [
      '/ko/lawyers/wei-tseng',
      '/zh-hant/lawyers/wei-tseng',
      '/en/lawyers/wei-tseng',
      '/ja/lawyers/wei-tseng',
    ];

    expect(links).toHaveLength(expectedHrefs.length);
    expectedHrefs.forEach((href) => {
      expect(links.some((link) => link.includes(`href="${href}"`))).toBe(true);
    });
    expect(links.find((link) => link.includes('href="/ja/lawyers/wei-tseng"'))).toContain(
      'aria-current="page"',
    );
    expect(links.find((link) => link.includes('href="/ko/lawyers/wei-tseng"'))).not.toContain(
      'aria-current',
    );
    expect(localeFlagHref(navigationState.pathname, 'vi')).toBe('');
    expect(renderedHtml('ja')).toContain('aria-disabled="true"');
    expect(renderedHtml('ja')).not.toContain('href="/vi/lawyers/wei-tseng"');
  });

  it('falls back to the Japanese lawyer list for unsupported lawyer details', () => {
    navigationState.pathname = '/en/lawyers/unsupported-attorney';

    expect(localeFlagHref(navigationState.pathname, 'ja')).toBe('/ja/lawyers');
    expect(renderedLinks('en').some((link) => link.includes('href="/ja/lawyers"'))).toBe(true);
    expect(localeFlagHref(navigationState.pathname, 'vi')).toBe('');
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

  it('calls the mobile close callback after an available language choice only', () => {
    const onLocaleSelect = vi.fn();
    const switcher = LocaleFlagSwitcher({ locale: 'ko', onLocaleSelect });
    const zhHantLink = collectElements(switcher).find(
      (element) => element.props.href === '/zh-hant/services',
    );
    const disabled = collectElements(switcher).filter(
      (element) => element.props['aria-disabled'] === true,
    );

    expect(zhHantLink).toBeDefined();
    zhHantLink?.props.onClick?.();
    expect(onLocaleSelect).toHaveBeenCalledOnce();
    expect(onLocaleSelect).toHaveBeenCalledWith('zh-hant');

    expect(disabled).toHaveLength(0);
  });

  it('does not invoke onLocaleSelect for unavailable guidance languages', () => {
    navigationState.pathname = '/ko/columns/taiwan-investment';
    const onLocaleSelect = vi.fn();
    const switcher = LocaleFlagSwitcher({ locale: 'ko', onLocaleSelect });
    const disabled = collectElements(switcher).filter(
      (element) => element.props['aria-disabled'] === 'true',
    );

    expect(disabled).toHaveLength(4);
    disabled.forEach((element) => {
      expect(element.type).toBe('span');
      expect(element.props.href).toBeUndefined();
      expect(element.props.onClick).toBeUndefined();
      element.props.onClick?.();
    });
    expect(onLocaleSelect).not.toHaveBeenCalled();
    expect(renderedLinks('ko').some((link) => /href="\/(vi|id|th|fil)\//.test(link))).toBe(false);
  });

  it('uses the target autonym in the unavailable-language notice, not this page language', () => {
    navigationState.pathname = '/ko/columns/taiwan-investment';
    const html = renderedHtml('ko');
    const expected = internationalInquiryCopy.ko.unavailableLanguageNotice
      .split('{language}')
      .join(PUBLIC_LANGUAGE_AUTONYMS.vi);
    const currentLanguageNotice = internationalInquiryCopy.ko.unavailableLanguageNotice
      .split('{language}')
      .join(PUBLIC_LANGUAGE_AUTONYMS.ko);
    const switcher = LocaleFlagSwitcher({ locale: 'ko' });
    const viDisabled = collectElements(switcher).find(
      (element) =>
        element.props['aria-disabled'] === 'true'
        && element.props['aria-label'] === PUBLIC_LANGUAGE_AUTONYMS.vi,
    );

    expect(expected).toContain('Tiếng Việt');
    expect(expected).not.toBe(currentLanguageNotice);
    expect(html).toContain(`aria-description="${expected}"`);
    expect(html).toContain(expected);
    expect(html).toContain(`aria-label="${PUBLIC_LANGUAGE_AUTONYMS.vi}"`);
    expect(html).toContain(PUBLIC_LANGUAGE_AUTONYMS.vi);
    expect(html).not.toContain(internationalInquiryCopy.ko.unavailableTranslationNotice);
    expect(html).not.toContain(currentLanguageNotice);
    expect(viDisabled).toBeDefined();
    expect(viDisabled?.type).toBe('span');
    expect(viDisabled?.props.href).toBeUndefined();
    expect(viDisabled?.props.onClick).toBeUndefined();
    expect(viDisabled?.props['aria-description']).toBe(expected);
    expect(renderedLinks('ko').some((link) => link.includes('href="/vi/'))).toBe(false);
  });
});
