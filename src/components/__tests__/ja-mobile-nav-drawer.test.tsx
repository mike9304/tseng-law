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
import { LANGUAGE_PICKER_COPY } from '@/lib/public-language-registry';
import { PUBLIC_LANGUAGE_AUTONYMS } from '@/lib/public-guidance';
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

function expectGlobeLanguageTrigger(html: string, locale: SiteLocale): void {
  expect(html).toContain('aria-haspopup="dialog"');
  expect(html).toContain(`aria-label="${LANGUAGE_PICKER_COPY[locale].open}"`);
  expect(html).toContain(PUBLIC_LANGUAGE_AUTONYMS[locale]);
  expect(html).toContain('global-language-picker--mobile');
  expect(html).not.toContain('<details');
  expect(html).not.toContain('aria-label="言語選択"');
  expect(html).not.toContain('aria-label="언어 선택"');
  expect(html).not.toContain('locale-flag-switcher--mobile');
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
  it('renders Japanese dialog, navigation, firm copy, primary links, CTA, and globe language picker', () => {
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
    expectGlobeLanguageTrigger(html, 'ja');
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
    'retains existing $locale drawer copy, search, member login, CTA, and globe language picker',
    ({ locale, close, drawer, nav, brand }) => {
      const html = renderDrawer(locale);
      const content = siteContent[locale];

      expect(html).toContain(`aria-label="${close}"`);
      expect(html).toContain(`aria-label="${drawer}"`);
      expect(html).toContain(`aria-label="${nav}"`);
      const brandLink = html.match(/<a class="header-logo drawer-brand"[^>]*>([\s\S]*?)<\/a>/)?.[1];
      expect(brandLink).toBeDefined();
      expect(brandLink?.replace(/<[^>]*>/g, '')).toBe(brand);
      expect(html).toContain(`aria-label="${content.nav.searchLabel}"`);
      expect(html).toContain('class="utility-member-nav drawer-member-nav"');
      expect(html).toContain('data-member-role-link="login"');
      expect(html).toContain(`href="${renderedMailto(locale)}"`);
      expect(html).not.toContain('href="tel:');
      expect(html).not.toMatch(/kakao|line\.me|lin\.ee/i);
      expectGlobeLanguageTrigger(html, locale);
    },
  );
});
