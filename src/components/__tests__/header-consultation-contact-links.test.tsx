import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/ko',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import Header from '@/components/Header';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';

function renderHeader(locale: SiteLocale): string {
  navigationState.pathname = `/${locale}`;
  return renderToStaticMarkup(<Header locale={locale} />);
}

describe('Header consultation and contact links', () => {
  it.each([
    ['ko', '문의하기'],
    ['zh-hant', '聯絡我們'],
    ['en', 'Contact Us'],
  ] as const)(
    'routes the %s high-intent link to the locale consultation email',
    (locale, label) => {
      const html = renderHeader(locale);
      const expectedHref = getConsultationPublicMailto(locale).split('&').join('&amp;');

      expect(html).toContain(`href="${expectedHref}"><span>${label}</span>`);
    },
  );

  it.each([
    ['ko', '연락처', '/ko/contact'],
    ['zh-hant', '聯絡方式', '/zh-hant/contact'],
    ['ja', '連絡先', '/ja/contact'],
    ['en', 'Contact information', '/en/contact'],
  ] as const)(
    'keeps the %s contact-information link on the internal contact page',
    (locale, label, href) => {
      const html = renderHeader(locale);

      expect(html).toContain(`href="${href}">${label}</a>`);
    },
  );

  it.each(['ko', 'zh-hant', 'ja', 'en'] as const)(
    'contains no phone, KakaoTalk, or LINE consultation channel in the %s header',
    (locale) => {
      const html = renderHeader(locale);

      expect(html).toContain(CONSULTATION_EMAIL);
      expect(html).not.toMatch(
        /010-2992-9304|tel:|kakao|pf\.kakao|line\.me|lin\.ee/i,
      );
    },
  );
});
