import { Children, isValidElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ContactBlocks from '@/components/ContactBlocks';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import MessengerChatSection from '@/components/MessengerChatSection';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import { pageCopy } from '@/data/page-copy';
import { ContactLegacyPage, getContactLegacyMetadata } from '../contact-legacy';
import { getLegacyPageMetadata, renderLegacyPage } from '../index';
import { ContactLegacyPageBody } from '../legacy-page-bodies';

const SITE_URL = 'https://tseng-law.com';
const KAKAO_URL = 'https://pf.kakao.com/_hojeong/chat';
const EMAIL_HREF = 'mailto:wei@hoveringlaw.com.tw';
const PHONE_HREF = 'tel:+821029929304';
const TAIPEI_MAP_URL = 'https://maps.app.goo.gl/mULpyAnQGz3M1GoQ6';
const NAVER_MAP_URL =
  'https://map.naver.com/p/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%96%91%EC%A3%BC%EC%8B%9C%20%EC%98%A5%EC%A0%95%EB%8F%99%EB%A1%9C%20177%20%EC%88%98%ED%98%84%ED%94%84%EB%9D%BC%EC%9E%90%204%EC%B8%B5';

describe('Japanese contact route integration', () => {
  it('publishes the exact reviewed Japanese metadata contract', () => {
    const metadata = getContactLegacyMetadata('ja');

    expect(metadata.title).toBe('お問い合わせ');
    expect(metadata.description).toBe(
      'お問い合わせ種別、連絡先、事務所所在地をまとめてご案内します。',
    );
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ja/contact`);
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: 'お問い合わせ',
      description: 'お問い合わせ種別、連絡先、事務所所在地をまとめてご案内します。',
      url: `${SITE_URL}/ja/contact`,
      locale: 'ja_JP',
    });
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/contact`,
      'zh-Hant': `${SITE_URL}/zh-hant/contact`,
      en: `${SITE_URL}/en/contact`,
      ja: `${SITE_URL}/ja/contact`,
      'x-default': `${SITE_URL}/ko/contact`,
    });
    expect(metadata.keywords).toEqual([
      '台湾法律相談',
      '台湾弁護士相談',
      '昊鼎国際法律事務所',
      '台湾会社設立相談',
    ]);
  });

  it('passes ja unchanged through the contact-only dispatcher and page component', async () => {
    const dispatchedMetadata = getLegacyPageMetadata('contact', 'ja');
    const dispatchedPage = await renderLegacyPage('contact', 'ja') as ReactElement<{
      locale: string;
    }>;

    expect(dispatchedMetadata?.title).toBe(pageCopy.ja.contact.title);
    expect(dispatchedMetadata?.title).not.toBe(pageCopy.en.contact.title);
    expect(dispatchedPage.type).toBe(ContactLegacyPage);
    expect(dispatchedPage.props.locale).toBe('ja');

    const page = ContactLegacyPage({ locale: 'ja' }) as ReactElement<{
      locale: string;
    }>;
    expect(page.type).toBe(ContactLegacyPageBody);
    expect(page.props.locale).toBe('ja');
  });

  it('passes ja to every localized contact child component', () => {
    const body = ContactLegacyPageBody({ locale: 'ja' });
    const children = Children.toArray(body.props.children);
    const localizedChildTypes = [
      ConsultationGuideSection,
      MessengerChatSection,
      ContactBlocks,
      OfficeMapTabs,
    ];

    for (const childType of localizedChildTypes) {
      const child = children.find(
        (candidate) => isValidElement(candidate) && candidate.type === childType,
      );
      expect(isValidElement<{ locale: string }>(child)).toBe(true);
      if (isValidElement<{ locale: string }>(child)) {
        expect(child.props.locale).toBe('ja');
      }
    }
  });

  it('renders reviewed Japanese hero, guide, messenger, direct contact, and Taipei copy', () => {
    const html = renderToStaticMarkup(<ContactLegacyPageBody locale="ja" />);

    for (const expected of [
      'CONTACT',
      'お問い合わせ',
      'お問い合わせ種別、連絡先、事務所所在地をまとめてご案内します。',
      'ご相談前の確認事項',
      'ご利用いただける連絡手段',
      'KakaoTalk、メール、電話でお問い合わせいただけます。',
      'ご用意いただきたい資料',
      'ご相談の流れ',
      'メッセンジャーでのお問い合わせ',
      'KakaoTalkチャンネルからお問い合わせいただけます。',
      'KakaoTalkチャンネルでお問い合わせ',
      'お問い合わせ種別',
      'ビジネス・投資',
      '事務所所在地',
      '台北事務所',
      '台北市大同区承徳路一段35号7F-2',
    ]) {
      expect(html).toContain(expected);
    }

    for (const fallback of [
      'Before You Contact Us',
      'Messenger Consultation',
      'Office Locations',
      '諮詢前可先確認的事項',
      '即時通訊諮詢',
      '事務所據點',
    ]) {
      expect(html).not.toContain(fallback);
    }
    expect(html).not.toContain('LINE');
    expect(html).not.toContain('lin.ee');
    expect(html).not.toContain('line.me');
  });

  it('renders only verified contact hrefs and keeps external map links protected', () => {
    const html = renderToStaticMarkup(<ContactLegacyPageBody locale="ja" />);

    expect((html.match(new RegExp(`href="${KAKAO_URL}"`, 'g')) ?? [])).toHaveLength(1);
    expect(html).toContain(`href="${EMAIL_HREF}"`);
    expect(html).toContain(`href="${PHONE_HREF}"`);
    expect(
      html.match(
        new RegExp(
          `href="${TAIPEI_MAP_URL}" target="_blank" rel="noopener noreferrer"`,
          'g',
        ),
      ) ?? [],
    ).toHaveLength(3);
    expect(
      html.match(
        new RegExp(
          `href="${NAVER_MAP_URL}" target="_blank" rel="noopener noreferrer"`,
          'g',
        ),
      ) ?? [],
    ).toHaveLength(2);
  });

  it('renders three office tabs with Taipei selected and exact Japanese media alternatives', () => {
    const html = renderToStaticMarkup(<ContactLegacyPageBody locale="ja" />);

    expect(html.match(/role="tab"/g) ?? []).toHaveLength(3);
    expect(html).toMatch(
      /role="tab"[^>]*aria-selected="true"[^>]*>台北事務所<\/button>/,
    );
    expect(html).toContain('title="台北事務所の地図"');
    expect(html).toContain('alt="昊鼎国際法律事務所 台北事務所の応接室"');
    expect(html).toContain('alt="昊鼎国際法律事務所 台北事務所の執務室"');
    expect(html).toContain('alt="昊鼎国際法律事務所 台北事務所の会議室"');
  });

  it.each([
    ['ko', '문의 및 연락처', '상담 전 확인 사항', '오시는길'],
    ['zh-hant', '聯絡與諮詢', '諮詢前可先確認的事項', '事務所據點'],
    ['en', 'Contact & Inquiry', 'Before You Contact Us', 'Office Locations'],
  ] as const)(
    'preserves representative %s contact metadata and body behavior',
    async (locale, title, guideTitle, officesTitle) => {
      const metadata = getLegacyPageMetadata('contact', locale);
      const dispatchedPage = await renderLegacyPage('contact', locale) as ReactElement<{
        locale: string;
      }>;
      const html = renderToStaticMarkup(<ContactLegacyPageBody locale={locale} />);

      expect(metadata?.title).toBe(title);
      expect(metadata?.alternates?.canonical).toBe(`${SITE_URL}/${locale}/contact`);
      expect(metadata?.alternates?.languages).not.toHaveProperty('ja');
      expect(dispatchedPage.type).toBe(ContactLegacyPage);
      expect(dispatchedPage.props.locale).toBe(locale);
      expect(html).toContain(guideTitle);
      expect(html).toContain(officesTitle);
    },
  );
});
