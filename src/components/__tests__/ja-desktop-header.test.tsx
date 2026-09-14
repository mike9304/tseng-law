import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/ja/columns',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import Header from '@/components/Header';
import type { SiteLocale } from '@/lib/locales';

const headerSource = readFileSync(
  path.join(process.cwd(), 'src/components/Header.tsx'),
  'utf8',
);

function renderHeader(locale: SiteLocale): string {
  navigationState.pathname = `/${locale}/columns`;
  return renderToStaticMarkup(<Header locale={locale} />);
}

const EXPECTED_AUTONYMS = [
  '한국어',
  '繁體中文',
  'English',
  '日本語',
  'Tiếng Việt',
  'Bahasa Indonesia',
  'ไทย',
  'Filipino',
] as const;

const EXPECTED_LANGUAGE_HREFS = [
  '/ko/columns',
  '/zh-hant/columns',
  '/en/columns',
  '/ja/columns',
  '/vi/columns',
  '/id/columns',
  '/th/columns',
  '/fil/columns',
] as const;

describe('Japanese desktop header', () => {
  it('renders Japanese branding, home and utility links, and the shared flag switcher', () => {
    const html = renderHeader('ja');

    expect(html).toMatch(/class="header-logo"[^>]*href="\/ja"/);
    expect(html).toContain('昊鼎国際法律事務所');
    expect(html).toContain('aria-label="補助メニュー"');
    expect(html).toContain('href="/ja/contact">連絡先</a>');
    expect(html).toContain('href="/ja/contact#offices">アクセス</a>');
    expect(html).toContain('<details');
    expect(html).toContain('aria-label="言語選択"');
    for (const autonym of EXPECTED_AUTONYMS) {
      expect(html).toContain(autonym);
    }
    for (const href of EXPECTED_LANGUAGE_HREFS) {
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).not.toContain('🇰🇷');
    expect(html).not.toContain('🇯🇵');
    expect(html).not.toContain('🇹🇼');
    expect(html).not.toContain('🇺🇸');
    expect(html).not.toContain('>KR</span>');
    expect(html).not.toContain('>JP</span>');
    expect(html).not.toContain('>TW</span>');
    expect(html).not.toContain('>EN</span>');
  });

  it('renders a Japanese header search link to /ja/search but still omits member UI and the search overlay', () => {
    const html = renderHeader('ja');

    expect(html).not.toContain('class="utility-member-nav"');
    expect(html).toContain('class="header-search-btn"');
    expect(html).toMatch(/class="header-search-btn"[^>]*href="\/ja\/search"/);
    expect(html).toContain('aria-label="検索を開く"');
    expect(headerSource).toContain("if (locale === 'ja') {");
    expect(headerSource).toContain("setMemberNav({ status: 'signed-out' });");
    expect(headerSource).toContain('}, [locale, pathname]);');
    expect(headerSource).toMatch(
      /if \(locale === 'ja'\) \{[\s\S]*?return;[\s\S]*?fetch\(`\/api\/members\/me\?locale=\$\{locale\}`/,
    );
    // O14: the guidance four also render this header and have no search index,
    // so the overlay guard now excludes them as well. JA still never gets it.
    expect(headerSource).toContain(
      "{locale !== 'ja' && !isGuidance ? (\n        <SearchOverlay",
    );
  });

  it('exposes crawlable Japanese service-detail links in the services mega panel', () => {
    const html = renderHeader('ja');

    expect(html).toContain('投資・会社設立');
    for (const href of [
      '/ja/services/investment',
      '/ja/services/civil',
      '/ja/services/family',
      '/ja/services/labor',
      '/ja/services/criminal',
      '/ja/services/ip',
      '/ja/services',
    ]) {
      expect(html).toContain(`href="${href}"`);
    }
  });

  it.each(['ko', 'zh-hant', 'en'] as const)(
    'retains desktop member and search UI for %s',
    (locale) => {
      const html = renderHeader(locale);

      expect(html).toContain('class="utility-member-nav"');
      expect(html).toContain('data-member-role-link="login"');
      expect(html).toContain('class="header-search-btn"');
    },
  );
});
