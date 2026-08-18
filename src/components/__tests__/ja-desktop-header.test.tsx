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

describe('Japanese desktop header', () => {
  it('renders Japanese branding, home and utility links, and the shared flag switcher', () => {
    const html = renderHeader('ja');

    expect(html).toMatch(/class="header-logo"[^>]*href="\/ja"/);
    expect(html).toContain('昊鼎国際法律事務所');
    expect(html).toContain('aria-label="補助メニュー"');
    expect(html).toContain('href="/ja/contact">連絡先</a>');
    expect(html).toContain('href="/ja/contact#offices">アクセス</a>');
    expect(html).toContain('🇰🇷');
    expect(html).toContain('🇯🇵');
    expect(html).toContain('🇹🇼');
    expect(html).toContain('🇺🇸');
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
    expect(headerSource).toContain(
      "{locale !== 'ja' ? (\n        <SearchOverlay",
    );
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
