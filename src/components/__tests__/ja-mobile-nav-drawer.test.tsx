import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/ja/columns',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import MobileNavDrawer from '@/components/MobileNavDrawer';
import { siteContent } from '@/data/site-content';
import type { SiteLocale } from '@/lib/locales';

function renderDrawer(
  locale: SiteLocale,
  memberNav: React.ComponentProps<typeof MobileNavDrawer>['memberNav'] = {
    status: 'signed-out',
  },
): string {
  navigationState.pathname = `/${locale}/columns`;
  return renderToStaticMarkup(
    <MobileNavDrawer
      open
      onClose={vi.fn()}
      locale={locale}
      onSearch={vi.fn()}
      memberNav={memberNav}
    />,
  );
}

describe('Japanese mobile navigation drawer', () => {
  it('renders Japanese dialog, navigation, firm copy, primary links, CTA, and flag switcher', () => {
    const html = renderDrawer('ja');

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-label="モバイルメニュー"');
    expect(html).toContain('aria-label="閉じる"');
    expect(html).toContain('aria-label="モバイルメインメニュー"');
    expect(html).toMatch(/class="header-logo drawer-brand"[^>]*href="\/ja"/);
    expect(html).toContain('昊鼎国際法律事務所');

    for (const item of siteContent.ja.nav.primary) {
      expect(html).toContain(`href="${item.href}"`);
      expect(html).toContain(item.label);
    }
    expect(html).toContain(`href="${siteContent.ja.nav.cta.href}"`);
    expect(html).toContain(siteContent.ja.nav.cta.label);
    expect(html).toContain('🇰🇷');
    expect(html).toContain('🇯🇵');
    expect(html).toContain('🇹🇼');
    expect(html).toContain('🇺🇸');
  });

  it('hides Japanese search and every member control even for a signed-in admin', () => {
    const html = renderDrawer('ja', {
      status: 'signed-in',
      member: {
        memberId: 'member-ja-admin',
        email: 'admin@example.com',
        name: 'Admin',
        role: 'admin',
        createdAt: '2026-07-24T00:00:00.000Z',
        verified: true,
        blocked: false,
      },
    });

    expect(html).not.toContain(`aria-label="${siteContent.ja.nav.searchLabel}"`);
    expect(html).not.toContain('class="utility-member-nav drawer-member-nav"');
    expect(html).not.toContain('data-member-role-link=');
    expect(html).not.toContain('/ja/login');
    expect(html).not.toContain('/ja/account');
  });

  it.each([
    {
      locale: 'ko',
      close: '닫기',
      drawer: '모바일 메뉴',
      nav: '모바일 주요 메뉴',
      brand: '법무법인 호정',
    },
    {
      locale: 'zh-hant',
      close: '關閉',
      drawer: '行動選單',
      nav: '行動主要選單',
      brand: '昊鼎國際法律事務所',
    },
    {
      locale: 'en',
      close: 'Close',
      drawer: 'Mobile menu',
      nav: 'Mobile main menu',
      brand: 'Hovering International Law Firm',
    },
  ] as const)(
    'retains existing $locale drawer copy, search, member login, CTA, and flag switcher',
    ({ locale, close, drawer, nav, brand }) => {
      const html = renderDrawer(locale);
      const content = siteContent[locale];

      expect(html).toContain(`aria-label="${close}"`);
      expect(html).toContain(`aria-label="${drawer}"`);
      expect(html).toContain(`aria-label="${nav}"`);
      expect(html).toContain(brand);
      expect(html).toContain(`aria-label="${content.nav.searchLabel}"`);
      expect(html).toContain('class="utility-member-nav drawer-member-nav"');
      expect(html).toContain('data-member-role-link="login"');
      expect(html).toContain(`href="${content.nav.cta.href}"`);
      expect(html).toContain('🇰🇷');
      expect(html).toContain('🇯🇵');
      expect(html).toContain('🇹🇼');
      expect(html).toContain('🇺🇸');
    },
  );
});
