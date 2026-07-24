import { Children, type ReactElement } from 'react';
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

function renderedLinks(locale: 'ko' | 'ja' | 'zh-hant' | 'en'): string[] {
  const html = renderToStaticMarkup(<LocaleFlagSwitcher locale={locale} />);
  return html.match(/<a\b[\s\S]*?<\/a>/g) ?? [];
}

describe('LocaleFlagSwitcher', () => {
  beforeEach(() => {
    navigationState.pathname = '/ko/services';
  });

  it('renders the exact KR, JP, TW, EN order with matching flags, labels, and core-route hrefs', () => {
    expect(LOCALE_FLAG_OPTIONS.map(({ code, flag }) => [code, flag])).toEqual([
      ['KR', '🇰🇷'],
      ['JP', '🇯🇵'],
      ['TW', '🇹🇼'],
      ['EN', '🇺🇸'],
    ]);

    const links = renderedLinks('ko');
    const expected = [
      { href: '/ko/services', code: 'KR', flag: '🇰🇷', label: '한국어 (대한민국)' },
      { href: '/ja/services', code: 'JP', flag: '🇯🇵', label: '日本語 (日本)' },
      { href: '/zh-hant/services', code: 'TW', flag: '🇹🇼', label: '繁體中文 (台灣)' },
      { href: '/en/services', code: 'EN', flag: '🇺🇸', label: 'English (United States)' },
    ];

    expect(links).toHaveLength(expected.length);
    expected.forEach((option, index) => {
      expect(links[index]).toContain(`href="${option.href}"`);
      expect(links[index]).toContain(`aria-label="${option.label}"`);
      expect(links[index]).toContain(option.flag);
      expect(links[index]).toContain(`>${option.code}</span>`);
    });
  });

  it('uses the JA fail-closed fallback while preserving unsupported paths for complete locales', () => {
    navigationState.pathname = '/en/account/settings';

    expect(localeFlagHref(navigationState.pathname, 'ko')).toBe('/ko/account/settings');
    expect(localeFlagHref(navigationState.pathname, 'zh-hant')).toBe('/zh-hant/account/settings');
    expect(localeFlagHref(navigationState.pathname, 'en')).toBe('/en/account/settings');
    expect(localeFlagHref(navigationState.pathname, 'ja')).toBe('/ja/columns');

    expect(renderedLinks('en')[1]).toContain('href="/ja/columns"');
  });

  it('marks only the active locale as the current page', () => {
    navigationState.pathname = '/ja/columns/taiwan-investment';
    const links = renderedLinks('ja');

    expect(links[0]).not.toContain('aria-current');
    expect(links[1]).toContain('aria-current="page"');
    expect(links[2]).not.toContain('aria-current');
    expect(links[3]).not.toContain('aria-current');
  });

  it('calls the mobile close callback after a language choice', () => {
    const onLocaleSelect = vi.fn();
    const switcher = LocaleFlagSwitcher({ locale: 'ko', onLocaleSelect });
    const links = Children.toArray(switcher.props.children) as ReactElement<{
      onClick?: () => void;
    }>[];

    links[2].props.onClick?.();

    expect(onLocaleSelect).toHaveBeenCalledOnce();
    expect(onLocaleSelect).toHaveBeenCalledWith('zh-hant');
  });
});
