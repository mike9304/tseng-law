import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PricingCards from '@/components/PricingCards';
import { pageCopy } from '@/data/page-copy';
import { getLegacyPageMetadata, renderLegacyPage } from '../index';
import { PricingLegacyPageBody } from '../legacy-page-bodies';
import { getPricingLegacyMetadata, PricingLegacyPage } from '../pricing-legacy';

const SITE_URL = 'https://tseng-law.com';

describe('Japanese pricing integration', () => {
  it('publishes Japanese metadata with the reviewed SEO contract', () => {
    const metadata = getPricingLegacyMetadata('ja');

    expect(metadata.title).toBe('費用のご案内');
    expect(metadata.description).toBe(
      '昊鼎国際法律事務所の主要サービスについて、費用の目安をご案内します。',
    );
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ja/pricing`);
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: '費用のご案内',
      description:
        '昊鼎国際法律事務所の主要サービスについて、費用の目安をご案内します。',
      url: `${SITE_URL}/ja/pricing`,
      locale: 'ja_JP',
    });
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/pricing`,
      'zh-Hant': `${SITE_URL}/zh-hant/pricing`,
      en: `${SITE_URL}/en/pricing`,
      ja: `${SITE_URL}/ja/pricing`,
      'x-default': `${SITE_URL}/ko/pricing`,
    });
    expect(metadata.keywords).toEqual([
      '台湾弁護士費用',
      '台湾会社設立費用',
      '台湾訴訟費用',
      '昊鼎国際法律事務所 費用',
    ]);
  });

  it('passes ja directly through the pricing-only legacy dispatcher', async () => {
    const dispatchedMetadata = getLegacyPageMetadata('pricing', 'ja');
    const dispatchedPage = await renderLegacyPage('pricing', 'ja') as ReactElement<{
      locale: string;
    }>;

    expect(dispatchedMetadata?.title).toBe(pageCopy.ja.pricing.title);
    expect(dispatchedMetadata?.title).not.toBe(pageCopy.en.pricing.title);
    expect(dispatchedPage.type).toBe(PricingLegacyPage);
    expect(dispatchedPage.props.locale).toBe('ja');

    const page = PricingLegacyPage({ locale: 'ja' }) as ReactElement<{
      locale: string;
    }>;
    expect(page.type).toBe(PricingLegacyPageBody);
    expect(page.props.locale).toBe('ja');
  });

  it('renders the exact reviewed Japanese prices, qualifications, and CTA', () => {
    const html = renderToStaticMarkup(<PricingLegacyPageBody locale="ja" />);

    expect(html).toContain('PRICING');
    expect(html).toContain('費用のご案内');
    expect(html).toContain(
      '昊鼎国際法律事務所の主要サービスについて、費用の目安をご案内します。',
    );
    expect(html).toContain('一般法律相談');
    expect(html).toContain('民事・刑事訴訟');
    expect(html).toContain('台湾での会社設立');
    expect(html).toContain('年間法律顧問');
    expect(html).toContain('NT$ 3,000');
    expect(html.match(/NT\$ 50,000/g)).toHaveLength(2);
    expect(html).toContain('銀行への同行は別途費用');
    expect(html).toContain('居留証（ARC）の申請代行は別途費用');
    expect(html).toContain(
      '上記の費用は基本的な目安であり、案件の性質、複雑性、緊急性により変動する場合があります。正確な費用は、初回相談後に書面によるお見積りでご案内します。',
    );
    expect(html).toContain('href="mailto:wei@hoveringlaw.com.tw?subject=');
    expect(html).toContain('法律相談を申し込む');

    for (const fallback of [
      'General Legal Consultation',
      'Request a Quote',
      'Book a Consultation',
    ]) {
      expect(html).not.toContain(fallback);
    }
    for (const unsupportedTerm of [
      '税込',
      '政府手数料',
      '裁判費用',
      '翻訳費用',
      '公証費用',
      '成功報酬',
      '無制限',
    ]) {
      expect(html).not.toContain(unsupportedTerm);
    }
  });

  it.each([
    ['ko', 'NTD (대만달러)', '일반 법률상담', '견적 문의', '상담 예약하기'],
    ['zh-hant', 'NTD (新台幣)', '一般法律諮詢', '報價諮詢', '預約諮詢'],
    ['en', 'NTD (New Taiwan Dollar)', 'General Legal Consultation', 'Request a Quote', 'Book a Consultation'],
  ] as const)(
    'preserves representative %s pricing and CTA',
    (locale, currency, consultationTitle, litigationPrice, ctaLabel) => {
      const html = renderToStaticMarkup(<PricingCards locale={locale} />);

      expect(html).toContain(currency);
      expect(html).toContain(consultationTitle);
      expect(html).toContain(litigationPrice);
      expect(html).toContain('NT$ 3,000');
      expect(html.match(/NT\$ 50,000/g)).toHaveLength(2);
      expect(html).toContain(ctaLabel);
      expect(html).toContain('href="mailto:wei@hoveringlaw.com.tw?subject=');
    },
  );
});
