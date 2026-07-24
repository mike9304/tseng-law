import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { legalPageContent } from '@/data/legal-pages';
import AccessibilityPage, { generateMetadata } from '../page';

const SITE_URL = 'https://tseng-law.com';

describe('Japanese accessibility integration', () => {
  it('publishes exact Japanese metadata with four-language alternates', () => {
    const content = legalPageContent.ja.accessibility;
    const metadata = generateMetadata({ params: { locale: 'ja' } });

    expect(metadata.title).toBe(content.title);
    expect(metadata.description).toBe(content.description);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ja/accessibility`);
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: content.title,
      description: content.description,
      url: `${SITE_URL}/ja/accessibility`,
      locale: 'ja_JP',
    });
    expect(metadata.keywords).toEqual([
      'ウェブアクセシビリティ',
      '昊鼎国際法律事務所 アクセシビリティ',
      '台湾 法律サイト アクセシビリティ',
    ]);
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/accessibility`,
      'zh-Hant': `${SITE_URL}/zh-hant/accessibility`,
      en: `${SITE_URL}/en/accessibility`,
      ja: `${SITE_URL}/ja/accessibility`,
      'x-default': `${SITE_URL}/ko/accessibility`,
    });
  });

  it('renders the complete reviewed Japanese content and visible breadcrumb', () => {
    const html = renderToStaticMarkup(
      <AccessibilityPage params={{ locale: 'ja' }} />,
    );
    const content = legalPageContent.ja.accessibility;

    expect(html).toContain(content.title);
    expect(html).toContain(`${content.effectiveDateLabel}: ${content.effectiveDate}`);
    for (const section of content.sections) {
      expect(html).toContain(section.title);
      for (const paragraph of section.paragraphs) {
        expect(html).toContain(paragraph);
      }
      for (const item of section.items ?? []) {
        expect(html).toContain(item);
      }
    }

    expect(html).toContain('昊鼎国際法律事務所');
    expect(html).toContain('ホーム');
    expect(html).toContain('href="/ja"');
    expect(html).not.toContain('href="/ja/columns"');

    for (const fallback of [
      'Accessibility Statement',
      'Accessibility focus',
      '웹 접근성 안내',
      '접근성 원칙',
    ]) {
      expect(html).not.toContain(fallback);
    }
  });

  it('publishes the exact Japanese breadcrumb JSON-LD', () => {
    const html = renderToStaticMarkup(
      <AccessibilityPage params={{ locale: 'ja' }} />,
    );
    const script = html.match(
      /<script type="application\/ld\+json">([^<]+)<\/script>/,
    );

    expect(script?.[1]).toBeTruthy();
    const breadcrumb = JSON.parse(script?.[1] ?? '{}');
    expect(breadcrumb).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'ホーム',
          item: `${SITE_URL}/ja`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: legalPageContent.ja.accessibility.title,
          item: `${SITE_URL}/ja/accessibility`,
        },
      ],
    });
  });

  it.each([
    [
      'ko',
      '웹 접근성 안내',
      ['웹 접근성', '법무법인 호정 접근성', '대만 변호사 사이트 접근성'],
      '접근성 원칙',
      '법무법인 호정은 키보드 탐색, 명확한 제목 구조, 충분한 대비, 읽기 쉬운 문장 구성을 중심으로 접근성을 개선하고 있습니다.',
    ],
    [
      'zh-hant',
      '無障礙聲明',
      ['無障礙聲明', '昊鼎網站可近用性', '法律網站無障礙'],
      '改善方向',
      '昊鼎國際法律事務所持續改善鍵盤操作、標題層級、閱讀對比與版面可讀性，讓主要資訊更容易被理解與使用。',
    ],
    [
      'en',
      'Accessibility Statement',
      ['accessibility statement', 'law firm accessibility', 'accessible legal website'],
      'Accessibility focus',
      'We continue to improve keyboard navigation, heading structure, readable contrast, and page clarity so visitors can understand important information more easily.',
    ],
  ] as const)(
    'preserves representative %s metadata and body',
    (locale, title, keywords, sectionTitle, paragraph) => {
      const metadata = generateMetadata({ params: { locale } });
      const html = renderToStaticMarkup(
        <AccessibilityPage params={{ locale }} />,
      );

      expect(metadata.title).toBe(title);
      expect(metadata.description).toBe(
        legalPageContent[locale].accessibility.description,
      );
      expect(metadata.keywords).toEqual(keywords);
      expect(metadata.alternates?.canonical).toBe(
        `${SITE_URL}/${locale}/accessibility`,
      );
      expect(metadata.alternates?.languages).toEqual({
        ko: `${SITE_URL}/ko/accessibility`,
        'zh-Hant': `${SITE_URL}/zh-hant/accessibility`,
        en: `${SITE_URL}/en/accessibility`,
        'x-default': `${SITE_URL}/ko/accessibility`,
      });
      expect(metadata.alternates?.languages).not.toHaveProperty('ja');
      expect(html).toContain(title);
      expect(html).toContain(sectionTitle);
      expect(html).toContain(paragraph);
      expect(html).not.toContain('アクセシビリティについて');
    },
  );
});
