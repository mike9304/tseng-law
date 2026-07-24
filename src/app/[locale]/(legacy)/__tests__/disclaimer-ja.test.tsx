import { type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { legalPageContent } from '@/data/legal-pages';
import {
  DisclaimerLegacyPage,
  getDisclaimerLegacyMetadata,
} from '../disclaimer-legacy';
import { getLegacyPageMetadata, renderLegacyPage } from '../index';
import {
  DisclaimerLegacyPageBody,
  PrivacyLegacyPageBody,
} from '../legacy-page-bodies';
import { PrivacyLegacyPage } from '../privacy-legacy';

const SITE_URL = 'https://tseng-law.com';

describe('Japanese disclaimer integration', () => {
  it('publishes exact Japanese metadata with four-language alternates', () => {
    const content = legalPageContent.ja.disclaimer;
    const metadata = getDisclaimerLegacyMetadata('ja');

    expect(metadata.title).toBe(content.title);
    expect(metadata.description).toBe(content.description);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ja/disclaimer`);
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: content.title,
      description: content.description,
      url: `${SITE_URL}/ja/disclaimer`,
      locale: 'ja_JP',
    });
    expect(metadata.keywords).toEqual([
      '台湾 法律事務所 免責事項',
      '台湾 法律情報 免責',
      '昊鼎国際法律事務所 免責',
    ]);
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/disclaimer`,
      'zh-Hant': `${SITE_URL}/zh-hant/disclaimer`,
      en: `${SITE_URL}/en/disclaimer`,
      ja: `${SITE_URL}/ja/disclaimer`,
      'x-default': `${SITE_URL}/ko/disclaimer`,
    });
  });

  it('passes ja directly through the disclaimer dispatcher and page', async () => {
    const dispatchedMetadata = getLegacyPageMetadata('disclaimer', 'ja');
    const dispatchedPage = await renderLegacyPage('disclaimer', 'ja') as ReactElement<{
      locale: string;
    }>;

    expect(dispatchedMetadata?.title).toBe(legalPageContent.ja.disclaimer.title);
    expect(dispatchedMetadata?.title).not.toBe(legalPageContent.en.disclaimer.title);
    expect(dispatchedPage.type).toBe(DisclaimerLegacyPage);
    expect(dispatchedPage.props.locale).toBe('ja');

    const page = DisclaimerLegacyPage({ locale: 'ja' }) as ReactElement<{
      locale: string;
    }>;
    expect(page.type).toBe(DisclaimerLegacyPageBody);
    expect(page.props.locale).toBe('ja');
  });

  it('renders the complete reviewed Japanese disclaimer and breadcrumb', () => {
    const html = renderToStaticMarkup(<DisclaimerLegacyPageBody locale="ja" />);
    const content = legalPageContent.ja.disclaimer;

    expect(html).toContain(content.title);
    expect(html).toContain(`${content.effectiveDateLabel}: ${content.effectiveDate}`);
    for (const section of content.sections) {
      expect(html).toContain(section.title);
      for (const paragraph of section.paragraphs) {
        expect(html).toContain(paragraph);
      }
    }

    expect(html).toContain('ホーム');
    expect(html).toContain('href="/ja"');
    expect(html).not.toContain('href="/ja/columns"');
    expect(html).toContain(`${SITE_URL}/ja`);

    for (const fallback of [
      'Disclaimer',
      'General information only',
      '면책 고지',
      '일반 정보 제공',
    ]) {
      expect(html).not.toContain(fallback);
    }
  });

  it.each([
    [
      'ko',
      '면책 고지',
      ['면책 고지', '법무법인 호정 면책', '법률정보 면책'],
    ],
    [
      'zh-hant',
      '免責聲明',
      ['免責聲明', '昊鼎免責', '法律資訊免責'],
    ],
    [
      'en',
      'Disclaimer',
      ['disclaimer', 'law firm disclaimer', 'Taiwan legal information disclaimer'],
    ],
  ] as const)('preserves representative %s disclaimer metadata', (locale, title, keywords) => {
    const metadata = getDisclaimerLegacyMetadata(locale);

    expect(metadata.title).toBe(title);
    expect(metadata.keywords).toEqual(keywords);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/${locale}/disclaimer`);
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/disclaimer`,
      'zh-Hant': `${SITE_URL}/zh-hant/disclaimer`,
      en: `${SITE_URL}/en/disclaimer`,
      'x-default': `${SITE_URL}/ko/disclaimer`,
    });
    expect(metadata.alternates?.languages).not.toHaveProperty('ja');
  });

  it('preserves direct Japanese privacy dispatch and page behavior', async () => {
    const metadata = getLegacyPageMetadata('privacy', 'ja');
    const dispatchedPage = await renderLegacyPage('privacy', 'ja') as ReactElement<{
      locale: string;
    }>;

    expect(metadata?.title).toBe(legalPageContent.ja.privacy.title);
    expect(dispatchedPage.type).toBe(PrivacyLegacyPage);
    expect(dispatchedPage.props.locale).toBe('ja');

    const page = PrivacyLegacyPage({ locale: 'ja' }) as ReactElement<{
      locale: string;
    }>;
    expect(page.type).toBe(PrivacyLegacyPageBody);
    expect(page.props.locale).toBe('ja');
  });
});
