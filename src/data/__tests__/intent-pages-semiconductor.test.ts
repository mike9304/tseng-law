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

  it.each(siteLocales)('resolves %s content with the shared service slugs', (locale) => {
    const page = getIntentPage(locale, slug);

    expect(page).toBeDefined();
    expect(page?.slug).toBe(slug);
    expect(page?.serviceSlugs).toEqual(['investment', 'civil', 'labor', 'ip']);
  });

  it('points Korean related columns at company-setup and hiring topics', () => {
    // 한국어 카피는 반도체 공급사 맥락으로 다시 썼으므로 화장품·물류 칼럼을 뺀다.
    expect(getIntentPage('ko', slug)?.columnSlugs).toEqual([
      'taiwan-company-establishment-basics',
      'taiwan-company-subsidiary-vs-branch',
      'taiwan-labor-severance-law',
      'taiwan-mandatory-employment-period',
    ]);
  });

  it.each(['zh-hant', 'en', 'ja'] as const)('keeps the %s related columns unchanged', (locale) => {
    expect(getIntentPage(locale, slug)?.columnSlugs).toEqual([
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
    // 한국어 화면 H1은 파이프 키워드 나열 대신 사람이 읽는 문장을 쓰고,
    // 검색결과용 파이프 제목은 seoTitle로 분리했다.
    expect(getIntentPage('ko', slug)?.title).toBe('대만 반도체 소재·장비 공급사를 위한 법무 안내');
    expect(getIntentPage('ko', slug)?.seoTitle).toBe(
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

  it('keeps SEO-only pipe titles out of the other locales and pages', () => {
    for (const locale of ['zh-hant', 'en', 'ja'] as const) {
      expect(getIntentPage(locale, slug)?.seoTitle).toBeUndefined();
    }

    for (const otherSlug of intentPageSlugs.filter((item) => item !== slug)) {
      expect(getIntentPage('ko', otherSlug)?.seoTitle).toBeUndefined();
    }
  });

  it('carries page-specific Korean overrides for the attorney card, CTA and service blurbs', () => {
    const page = getIntentPage('ko', slug);

    expect(page?.attorneyHeadingOverride).toBe('반도체 공급사 사안을 맡는 대만 변호사');
    expect(page?.ctaTextOverride).toContain('견적서, 공급 계약서, 거래처가 보낸 요구 사항');
    expect(Object.keys(page?.serviceBlurbs ?? {})).toEqual(['investment', 'civil', 'labor', 'ip']);
    expect(page?.serviceBlurbs?.civil).toContain('납품은 끝났는데');
    // 재사용 블러브(유학생 헬스장 실적, 퇴직금 신·구제 설명)가 다시 들어오지 않아야 한다.
    expect(JSON.stringify(page?.serviceBlurbs)).not.toContain('157만');
    expect(JSON.stringify(page?.serviceBlurbs)).not.toContain('舊制');
  });

  it('leaves the other Korean intent pages without overrides', () => {
    for (const otherSlug of intentPageSlugs.filter((item) => item !== slug)) {
      const page = getIntentPage('ko', otherSlug);

      expect(page?.attorneyHeadingOverride).toBeUndefined();
      expect(page?.ctaTextOverride).toBeUndefined();
      expect(page?.serviceBlurbs).toBeUndefined();
    }
  });

  it('states the repeated Korean facts once each', () => {
    const page = getIntentPage('ko', slug);
    const serialized = JSON.stringify(page);
    const occurrences = (needle: string) => serialized.split(needle).length - 1;

    expect(occurrences('영어·중국어·한국어·일본어')).toBe(1);
    expect(occurrences('약 3개월')).toBe(1);
    expect(occurrences('NT$3,000')).toBe(1);
    expect(occurrences('NT$50,000')).toBe(1);
    // 공개된 사실은 그대로 유지한다.
    expect(page?.description).toContain('영어·중국어·한국어·일본어');
    expect(serialized).toContain('대면 또는 화상');
  });

  it('varies Korean list lengths instead of repeating a four-item template', () => {
    const page = getIntentPage('ko', slug)!;
    const listLengths = [
      page.heroPoints.length,
      page.idealFor.length,
      page.reviewPoints.length,
      page.processFlow.length,
      page.prepareChecklist.length,
      page.cautionPoints.length,
    ];

    expect(new Set(listLengths).size).toBeGreaterThan(1);
    for (const length of listLengths) {
      expect(length).toBeGreaterThanOrEqual(3);
      expect(length).toBeLessThanOrEqual(5);
    }
  });

  it('keeps the semiconductor-specific Korean situations in the copy', () => {
    const serialized = JSON.stringify(getIntentPage('ko', slug));

    for (const token of ['OSAT', '벤더 등록', '대리점', '품질보증', '리콜', 'NDA', 'A/S']) {
      expect(serialized).toContain(token);
    }
  });

  it('keeps the Korean search-term chips untouched', () => {
    expect(getIntentPage('ko', slug)?.searchTerms).toEqual([
      '대만 반도체 소재 장비 법무',
      '대만 반도체 공급사 법인설립',
      '대만 장비 공급사 계약',
    ]);
    expect(getIntentPage('ko', slug)?.keywords).toEqual([
      '대만 반도체 소재 장비',
      '대만 반도체 공급사 법무',
      '대만 법인설립',
      '대만 공급 계약',
      '대만 미수금',
    ]);
  });
});
