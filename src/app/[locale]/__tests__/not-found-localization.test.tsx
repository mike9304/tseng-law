import { type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { headers } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import LocalizedNotFound, { generateMetadata } from '../not-found';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: function MockLink({
    href,
    children,
    className,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  },
}));

const copyByLocale: Record<
  SiteLocale,
  { title: string; description: string; home: string; contact: string; brand: string }
> = {
  ko: {
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 주소가 변경되었거나 존재하지 않습니다.',
    home: '홈으로 돌아가기',
    contact: '상담 문의',
    brand: '법무법인 호정',
  },
  'zh-hant': {
    title: '找不到頁面',
    description: '您所查找的網址可能已變更或不存在。',
    home: '返回首頁',
    contact: '聯絡諮詢',
    brand: '昊鼎國際法律事務所',
  },
  en: {
    title: 'Page not found',
    description: 'The address may have changed or the requested page does not exist.',
    home: 'Return home',
    contact: 'Contact us',
    brand: 'Hovering International Law Firm',
  },
  ja: {
    title: 'ページが見つかりません',
    description: 'ご指定のアドレスは変更されたか、存在しない可能性があります。',
    home: 'ホームへ戻る',
    contact: 'お問い合わせ',
    brand: '昊鼎国際法律事務所',
  },
};

function mockPathname(pathname: string | null) {
  vi.mocked(headers).mockResolvedValue({
    get: (name: string) => (name === 'x-tseng-pathname' ? pathname : null),
  } as unknown as Awaited<ReturnType<typeof headers>>);
}

function htmlAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

describe('localized 404', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(siteLocales)(
    'renders %s heading, home href, and public-contact mailto',
    async (locale) => {
      mockPathname(`/${locale}/design-review-missing-page`);
      const copy = copyByLocale[locale];
      const html = renderToStaticMarkup(await LocalizedNotFound());

      expect(html).toContain(`<h1 id="not-found-title">${copy.title}</h1>`);
      expect(html).toContain(copy.description);
      expect(html).toContain(`href="/${locale}"`);
      expect(html).toContain(copy.home);
      expect(html).toContain(copy.contact);
      expect(html).toContain(
        `href="${htmlAttribute(getConsultationPublicMailto(locale))}"`,
      );
      expect(html).toContain(
        `aria-label="${copy.contact}: ${CONSULTATION_EMAIL}"`,
      );
    },
  );

  it.each([
    { header: null, label: 'missing' },
    { header: '/fr/design-review-missing-page', label: 'unknown' },
  ] as const)(
    'defaults to Korean when x-tseng-pathname is $label',
    async ({ header }) => {
      mockPathname(header);
      const copy = copyByLocale.ko;
      const html = renderToStaticMarkup(await LocalizedNotFound());

      expect(html).toContain(`<h1 id="not-found-title">${copy.title}</h1>`);
      expect(html).toContain('href="/ko"');
      expect(html).toContain(
        `href="${htmlAttribute(getConsultationPublicMailto('ko'))}"`,
      );
    },
  );

  it.each(siteLocales)(
    'generateMetadata uses %s brand and noindex nofollow',
    async (locale) => {
      mockPathname(`/${locale}/design-review-missing-page`);
      const copy = copyByLocale[locale];
      const metadata = await generateMetadata();

      expect(metadata.title).toEqual({
        absolute: `${copy.title} | ${copy.brand}`,
      });
      expect(metadata.robots).toEqual({ index: false, follow: false });
    },
  );

  it.each([
    { header: null, label: 'missing' },
    { header: '/not-a-locale/page', label: 'invalid' },
  ] as const)(
    'generateMetadata defaults to Korean when x-tseng-pathname is $label',
    async ({ header }) => {
      mockPathname(header);
      const copy = copyByLocale.ko;
      const metadata = await generateMetadata();

      expect(metadata.title).toEqual({
        absolute: `${copy.title} | ${copy.brand}`,
      });
      expect(metadata.robots).toEqual({ index: false, follow: false });
    },
  );
});
