import { Children, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AboutLegacyPage, getAboutLegacyMetadata } from '../about-legacy';
import { AboutLegacyPageBody } from '../legacy-page-bodies';
import { getLegacyPageMetadata, renderLegacyPage } from '../index';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import ContactBlocks from '@/components/ContactBlocks';
import FirmIntroductionSection from '@/components/FirmIntroductionSection';
import { pageCopy } from '@/data/page-copy';

const SITE_URL = 'https://tseng-law.com';

describe('Japanese About integration', () => {
  it('publishes Japanese metadata with the canonical locale and four-language alternates', () => {
    const metadata = getAboutLegacyMetadata('ja');

    expect(metadata.title).toBe(pageCopy.ja.about.title);
    expect(metadata.description).toBe(pageCopy.ja.about.description);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ja/about`);
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: pageCopy.ja.about.title,
      description: pageCopy.ja.about.description,
      url: `${SITE_URL}/ja/about`,
      locale: 'ja_JP',
    });
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/about`,
      'zh-Hant': `${SITE_URL}/zh-hant/about`,
      en: `${SITE_URL}/en/about`,
      ja: `${SITE_URL}/ja/about`,
      'x-default': `${SITE_URL}/ko/about`,
    });
    expect(metadata.keywords).toEqual([
      '昊鼎国際法律事務所',
      '曾雋崴弁護士',
      '台湾弁護士',
      '韓国・台湾業務チーム',
    ]);
  });

  it('passes ja through the About legacy dispatcher and all About children', async () => {
    const dispatchedMetadata = getLegacyPageMetadata('about', 'ja');
    expect(dispatchedMetadata?.title).toBe(pageCopy.ja.about.title);
    expect(dispatchedMetadata?.title).not.toBe(pageCopy.en.about.title);

    const dispatchedPage = await renderLegacyPage('about', 'ja') as ReactElement<{ locale: string }>;
    expect(dispatchedPage.type).toBe(AboutLegacyPage);
    expect(dispatchedPage.props.locale).toBe('ja');
    expect(dispatchedPage.props.locale).not.toBe('en');

    const aboutBody = AboutLegacyPage({ locale: 'ja' }) as ReactElement<{ locale: string }>;
    expect(aboutBody.type).toBe(AboutLegacyPageBody);
    expect(aboutBody.props.locale).toBe('ja');

    const body = AboutLegacyPageBody({ locale: 'ja' }) as ReactElement<{ children: ReactNode }>;
    const children = Children.toArray(body.props.children) as ReactElement<{ locale?: string }>[];
    const localeChildren = [
      children.find(({ type }) => type === FirmIntroductionSection),
      children.find(({ type }) => type === AttorneyProfileSection),
      children.find(({ type }) => type === ContactBlocks),
    ];

    expect(localeChildren.every(Boolean)).toBe(true);
    expect(localeChildren.map((child) => child?.props.locale)).toEqual(['ja', 'ja', 'ja']);
  });

  it('renders reviewed Japanese firm, team, contact copy and Japanese team labels only', () => {
    const html = renderToStaticMarkup(<AboutLegacyPageBody locale="ja" />);

    for (const label of [
      '紹介',
      '学歴',
      '経歴',
      '詳細プロフィール',
      '相談を申し込む',
      '代表弁護士',
      '所属弁護士・スタッフ',
      '提携会計士',
    ]) {
      expect(html).toContain(label);
    }

    for (const englishLabel of [
      'Introduction',
      'Education',
      'Experience',
      'Full profile',
      'Book consultation',
      'Managing Attorney',
      'Lawyers &amp; Staff',
      'Partner CPA',
    ]) {
      expect(html).not.toContain(englishLabel);
    }

    expect(html).toContain('昊鼎国際法律事務所は2016年');
    expect(html).toContain('曾雋崴弁護士');
    expect(html).toContain('企業・個人の幅広い案件を担当');
    expect(html).toContain('お問い合わせ種別');
    expect(html).toContain('メール');
    expect(html).toContain('台北オフィス');
    expect(html).not.toContain('Learn our story and meet the Korea-Taiwan legal team.');
  });

  it.each([
    ['ko', '호정 소개', '호정의 스토리와 한국 업무팀 구성원을 확인할 수 있습니다.'],
    ['zh-hant', '昊鼎介紹', '查看昊鼎團隊背景與韓國業務團隊成員。'],
    ['en', 'About Hovering', 'Learn our story and meet the Korea-Taiwan legal team.'],
  ] as const)('preserves representative %s About metadata', (locale, title, description) => {
    const metadata = getAboutLegacyMetadata(locale);

    expect(metadata.title).toBe(title);
    expect(metadata.description).toBe(description);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/${locale}/about`);
    expect(metadata.alternates?.languages).not.toHaveProperty('ja');
  });
});
