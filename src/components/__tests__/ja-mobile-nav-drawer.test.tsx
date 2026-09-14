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
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';

function renderedMailto(locale: SiteLocale): string {
  return getConsultationPublicMailto(locale).replace(/&/g, '&amp;');
}

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

function expectEightAutonymLanguageDetails(html: string): void {
  expect(html).toContain('<details');
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
    expect(html).toContain(`href="${renderedMailto('ja')}"`);
    expect(html).toContain(siteContent.ja.nav.cta.label);
    expect(html).not.toContain('href="tel:');
    expect(html).not.toMatch(/kakao|line\.me|lin\.ee/i);
    expect(html).toContain('aria-label="言語選択"');
    expectEightAutonymLanguageDetails(html);
  });

  it('renders the Japanese search chip link and member login link for signed-out visitors', () => {
    const html = renderDrawer('ja');

    expect(html).toContain(`aria-label="${siteContent.ja.nav.searchLabel}"`);
    expect(html).toMatch(/class="chip"[^>]*href="\/ja\/search"/);
    expect(html).toContain('class="utility-member-nav drawer-member-nav"');
    expect(html).toContain('data-member-role-link="login"');
    expect(html).toContain('ログイン');
    expect(html).toMatch(/data-member-role-link="login"[^>]*href="\/ja\/login/);
  });

  it('renders Japanese account controls for a signed-in admin', () => {
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

    expect(html).toContain('data-member-role-link="account"');
    expect(html).toContain('href="/ja/account"');
    expect(html).toContain('data-member-role-link="premium"');
    expect(html).toContain('data-member-role-link="logout"');
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
      expect(html).toContain(`href="${renderedMailto(locale)}"`);
      expect(html).not.toContain('href="tel:');
      expect(html).not.toMatch(/kakao|line\.me|lin\.ee/i);
      expectEightAutonymLanguageDetails(html);
    },
  );
});
