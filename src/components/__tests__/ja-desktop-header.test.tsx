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
    expect(html).toContain('href="/ja/contact">お問い合わせ</a>');
    expect(html).toContain('href="/ja/contact#offices">アクセス</a>');
    expect(html).toContain('🇰🇷');
    expect(html).toContain('🇯🇵');
    expect(html).toContain('🇹🇼');
    expect(html).toContain('🇺🇸');
  });

  it('omits Japanese desktop member and search UI and guards the member request', () => {
    const html = renderHeader('ja');

    expect(html).not.toContain('class="utility-member-nav"');
    expect(html).not.toContain('class="header-search-btn"');
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
