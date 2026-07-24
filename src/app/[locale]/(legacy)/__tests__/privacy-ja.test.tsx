import { type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { legalPageContent } from '@/data/legal-pages';
import { getLegacyPageMetadata, renderLegacyPage } from '../index';
import { PrivacyLegacyPageBody } from '../legacy-page-bodies';
import {
  getPrivacyLegacyMetadata,
  PrivacyLegacyPage,
} from '../privacy-legacy';

const SITE_URL = 'https://tseng-law.com';

describe('Japanese privacy integration', () => {
  it('publishes exact Japanese metadata with four-language alternates', () => {
    const content = legalPageContent.ja.privacy;
    const metadata = getPrivacyLegacyMetadata('ja');

    expect(metadata.title).toBe(content.title);
    expect(metadata.description).toBe(content.description);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ja/privacy`);
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: content.title,
      description: content.description,
      url: `${SITE_URL}/ja/privacy`,
      locale: 'ja_JP',
    });
    expect(metadata.keywords).toEqual([
      '台湾 法律事務所 プライバシーポリシー',
      '昊鼎国際法律事務所 個人情報',
      '台湾 法律相談 プライバシー',
    ]);
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/privacy`,
      'zh-Hant': `${SITE_URL}/zh-hant/privacy`,
      en: `${SITE_URL}/en/privacy`,
      ja: `${SITE_URL}/ja/privacy`,
      'x-default': `${SITE_URL}/ko/privacy`,
    });
  });

  it('passes ja directly through the privacy dispatcher and page', async () => {
    const dispatchedMetadata = getLegacyPageMetadata('privacy', 'ja');
    const dispatchedPage = await renderLegacyPage('privacy', 'ja') as ReactElement<{
      locale: string;
    }>;

    expect(dispatchedMetadata?.title).toBe(legalPageContent.ja.privacy.title);
    expect(dispatchedMetadata?.title).not.toBe(legalPageContent.en.privacy.title);
    expect(dispatchedPage.type).toBe(PrivacyLegacyPage);
    expect(dispatchedPage.props.locale).toBe('ja');

    const page = PrivacyLegacyPage({ locale: 'ja' }) as ReactElement<{
      locale: string;
    }>;
    expect(page.type).toBe(PrivacyLegacyPageBody);
    expect(page.props.locale).toBe('ja');
  });

  it('renders the complete reviewed Japanese privacy structure and breadcrumb', () => {
    const html = renderToStaticMarkup(<PrivacyLegacyPageBody locale="ja" />);
    const content = legalPageContent.ja.privacy;

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

    expect(html).toContain('ホーム');
    expect(html).toContain('href="/ja"');
    expect(html).not.toContain('href="/ja/columns"');
    expect(html).toContain(`${SITE_URL}/ja`);
    expect(html).toContain('昊鼎国際法律事務所');
    expect(html).toContain('wei@hoveringlaw.com.tw');

    for (const fallback of [
      'Privacy Policy',
      'Information we collect',
      '개인정보 처리방침',
      '수집하는 정보',
    ]) {
      expect(html).not.toContain(fallback);
    }
  });

  it.each([
    [
      'ko',
      '개인정보 처리방침',
      ['개인정보 처리방침', '법무법인 호정 개인정보', '대만 변호사 개인정보'],
    ],
    [
      'zh-hant',
      '隱私權政策',
      ['隱私權政策', '昊鼎個資', '台灣律師隱私'],
    ],
    [
      'en',
      'Privacy Policy',
      ['privacy policy', 'Taiwan law firm privacy', 'legal consultation privacy'],
    ],
  ] as const)('preserves representative %s privacy metadata', (locale, title, keywords) => {
    const metadata = getPrivacyLegacyMetadata(locale);

    expect(metadata.title).toBe(title);
    expect(metadata.keywords).toEqual(keywords);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/${locale}/privacy`);
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/privacy`,
      'zh-Hant': `${SITE_URL}/zh-hant/privacy`,
      en: `${SITE_URL}/en/privacy`,
      'x-default': `${SITE_URL}/ko/privacy`,
    });
    expect(metadata.alternates?.languages).not.toHaveProperty('ja');
  });

  it('keeps Japanese privacy dispatch direct after disclaimer localization', async () => {
    const metadata = getLegacyPageMetadata('privacy', 'ja');
    const page = await renderLegacyPage('privacy', 'ja') as ReactElement<{
      locale: string;
    }>;

    expect(metadata?.title).toBe(legalPageContent.ja.privacy.title);
    expect(metadata?.title).not.toBe(legalPageContent.en.privacy.title);
    expect(page.type).toBe(PrivacyLegacyPage);
    expect(page.props.locale).toBe('ja');
  });
});
