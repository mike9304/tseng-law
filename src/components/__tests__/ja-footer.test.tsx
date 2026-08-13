import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/ja/columns',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import Footer from '@/components/Footer';
import { siteContent } from '@/data/site-content';
import type { SiteLocale } from '@/lib/locales';

function renderFooter(locale: SiteLocale): string {
  navigationState.pathname = `/${locale}/columns`;
  return renderToStaticMarkup(<Footer locale={locale} />);
}

function anchorForHref(html: string, href: string): string | undefined {
  return (html.match(/<a\b[\s\S]*?<\/a>/g) ?? []).find((anchor) =>
    anchor.includes(`href="${href}"`),
  );
}

describe('footer social localization', () => {
  it.each([
    { locale: 'ko', legal: '© 2026 법무법인 호정.' },
    { locale: 'zh-hant', legal: '© 2026 昊鼎國際法律事務所。' },
    { locale: 'en', legal: '© 2026 Hovering International Law Firm.' },
    { locale: 'ja', legal: '© 2026 昊鼎国際法律事務所。' },
  ] as const)(
    'renders the exact reviewed $locale copyright line',
    ({ locale, legal }) => {
      const html = renderFooter(locale);
      const copyrightRow = html.match(
        /<p class="footer-copyright-row">[\s\S]*?<\/p>/,
      )?.[0];
      const contentLegal = siteContent[locale].footer.legal;

      expect(copyrightRow).toContain(legal);
      expect(contentLegal).toBe(legal);
      expect(html).not.toMatch(/all rights reserved/i);
      expect(contentLegal).not.toMatch(/all rights reserved/i);
      expect(contentLegal.match(/©/g)).toHaveLength(1);
      expect(contentLegal).toContain('2026');
    },
  );

  it.each([
    { locale: 'ko', heading: '팔로우' },
    { locale: 'ja', heading: 'フォロー' },
    { locale: 'zh-hant', heading: '追蹤我們' },
    { locale: 'en', heading: 'Follow' },
  ] as const)('renders the $locale social heading as $heading', ({ locale, heading }) => {
    const html = renderFooter(locale);

    expect(html).toContain(`<span class="social-label">${heading}</span>`);
  });

  it('preserves the Japanese footer contract', () => {
    const html = renderFooter('ja');
    const expectedTopics = [
      { label: '台湾弁護士', href: '/ja/lawyers' },
      { label: '台湾会社設立', href: '/ja/services#investment' },
      { label: '台湾訴訟', href: '/ja/services#civil' },
      {
        label: '台湾会社設立ガイド',
        href: '/ja/columns/taiwan-company-establishment-basics',
      },
      { label: '韓国語対応の台湾弁護士', href: '/ja/lawyers/wei-tseng' },
    ];
    const popularTopics = siteContent.ja.footer.columns.find(
      (column) => column.title === '人気トピック',
    );

    expect(html).toContain(
      '<p class="footer-main-brand">昊鼎国際法律事務所</p>',
    );
    expect(html).toContain('aria-label="事務所所在地へのクイックリンク"');
    expect(popularTopics?.links).toEqual(expectedTopics);

    [
      {
        href: '/ja/contact#offices',
        labels: ['台北事務所', '台中事務所', '高雄事務所', '屏東事務所'],
      },
      { href: '/ja/privacy', labels: ['プライバシーポリシー'] },
      { href: '/ja/disclaimer', labels: ['免責事項'] },
      { href: '/ja/accessibility', labels: ['アクセシビリティ'] },
      { href: '/sitemap.xml', labels: ['サイトマップ'] },
    ].forEach(({ href, labels }) => {
      labels.forEach((label) => {
        if (href === '/ja/contact#offices') {
          expect(html).toContain(`<span class="office-link-name">${label}</span>`);
        } else {
          expect(html).toContain(`href="${href}">${label}</a>`);
        }
      });
    });

    expect(
      anchorForHref(html, 'https://blog.naver.com/wei_lawyer/223461663913'),
    ).toContain('aria-label="ブログ"');
    expect(anchorForHref(html, 'https://www.youtube.com/@weilawyer')).toContain(
      'aria-label="YouTube"',
    );
    expect(anchorForHref(html, 'https://tseng-law.com/')).toContain(
      'aria-label="公式サイト"',
    );

    expectedTopics.slice(0, 3).forEach(({ href, label }) => {
      expect(html).toContain(`href="${href}">${label}</a>`);
    });

    [
      '/ja/taiwan-lawyer',
      '/ja/taiwan-company-setup-lawyer',
      '/ja/taiwan-litigation-lawyer',
      '/ja/guides/taiwan-company-setup',
      '/ja/korean-lawyer-in-taiwan',
    ].forEach((href) => {
      expect(html).not.toContain(`href="${href}"`);
    });

    const switcher = html.match(
      /<div class="locale-flag-switcher footer-locale-switch"[\s\S]*?<\/div>/,
    )?.[0];

    expect(switcher).toContain('aria-label="言語選択"');
    expect(switcher).toContain('aria-current="page"');
    expect(
      Array.from(
        switcher?.matchAll(
          /class="locale-flag-switcher-code" aria-hidden="true">([^<]+)<\/span>/g,
        ) ?? [],
        (match) => match[1],
      ),
    ).toEqual(['KR', 'JP', 'TW', 'EN']);
    expect(switcher).toContain('🇰🇷');
    expect(switcher).toContain('🇯🇵');
    expect(switcher).toContain('🇹🇼');
    expect(switcher).toContain('🇺🇸');
  });
});
