import { describe, expect, it } from 'vitest';

import { getIntentPage, intentPageSlugs } from '@/data/intent-pages';
import { siteLocales } from '@/lib/locales';

const slug = 'taiwan-semiconductor-supplier-legal' as const;
const hangulPattern = /[\uac00-\ud7a3]/;
const forbiddenTokens = [
  '승소율',
  'win rate',
  'TSMC counsel',
  '最高',
  '전문 1위',
  '1.57',
  'gym',
] as const;

const semiconductorTokenByLocale = {
  ko: '반도체',
  'zh-hant': '半導體',
  en: 'semiconductor',
  ja: '半導体',
} as const;

describe('semiconductor supplier intent page', () => {
  it('is registered as a fourth intent slug', () => {
    expect(intentPageSlugs).toContain(slug);
    expect(intentPageSlugs).toHaveLength(4);
  });

  it.each(siteLocales)('resolves %s content with the shared service and column slugs', (locale) => {
    const page = getIntentPage(locale, slug);

    expect(page).toBeDefined();
    expect(page?.slug).toBe(slug);
    expect(page?.serviceSlugs).toEqual(['investment', 'civil', 'labor', 'ip']);
    expect(page?.columnSlugs).toEqual([
      'taiwan-company-establishment-basics',
      'taiwan-company-subsidiary-vs-branch',
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
      'taiwan-logistics-business-setup',
    ]);
  });

  it('uses the reviewed titles', () => {
    expect(getIntentPage('en', slug)?.title).toBe(
      'Taiwan Legal Support for Overseas Semiconductor Materials and Equipment Suppliers',
    );
    expect(getIntentPage('ko', slug)?.title).toBe(
      '대만 반도체 소재·장비 공급사 법무 | 법인설립·계약·고용·미수금',
    );
    expect(getIntentPage('ja', slug)?.title).toBe(
      '台湾の半導体素材・装置サプライヤー法務 | 会社設立・契約・労務・売掛',
    );
    expect(getIntentPage('zh-hant', slug)?.title).toBe(
      '台灣半導體材料與設備供應商法務 | 公司設立、契約、勞務、欠款追索',
    );
  });

  it.each(siteLocales)('includes a semiconductor token in %s copy', (locale) => {
    const serialized = JSON.stringify(getIntentPage(locale, slug));
    expect(serialized).toContain(semiconductorTokenByLocale[locale]);
  });

  it('keeps English copy free of Korea-as-audience residue and Hangul', () => {
    const serialized = JSON.stringify(getIntentPage('en', slug));

    expect(serialized).not.toMatch(/[\uac00-\ud7a3]/);
    expect(serialized).not.toMatch(/Korean clients|based in Korea|Korean HQ|Korea–Taiwan/i);
  });

  it('keeps Japanese copy free of Hangul and /ko/ links', () => {
    const serialized = JSON.stringify(getIntentPage('ja', slug));

    expect(serialized).not.toMatch(hangulPattern);
    expect(serialized).not.toContain('/ko/');
  });

  it('keeps Korean and Japanese FAQ counts identical', () => {
    const ko = getIntentPage('ko', slug);
    const ja = getIntentPage('ja', slug);

    expect(ko?.faq.length).toBeGreaterThan(0);
    expect(ja?.faq).toHaveLength(ko!.faq.length);
  });

  it.each(siteLocales)('forbids ranking and unrelated tokens in %s copy', (locale) => {
    const serialized = JSON.stringify(getIntentPage(locale, slug));

    for (const token of forbiddenTokens) {
      expect(serialized.toLowerCase()).not.toContain(token.toLowerCase());
    }
  });

  it.each(siteLocales)(
    'does not invent installation, warranty, or representative-office trading limits in %s copy',
    (locale) => {
      const serialized = JSON.stringify(getIntentPage(locale, slug));
      const unpublishedClaims = [
        'direct sales, distributor, installation',
        'sell, install, or service',
        'warranty allocation',
        'after-sales',
        'representative office often cannot',
        '설치·유지보수',
        '하자 책임',
        '연락사무소는 영업 활동 범위가 제한',
        '据付',
        '瑕疵責任',
        '駐在員事務所は営業活動の範囲が限られる',
        '安裝或售後',
        '聯絡處能從事的商業活動範圍通常較有限',
      ];

      for (const token of unpublishedClaims) {
        expect(serialized).not.toContain(token);
      }
    },
  );
});
