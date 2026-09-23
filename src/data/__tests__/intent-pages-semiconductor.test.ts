import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getIntentPage, intentPageSlugs } from '@/data/intent-pages';
import { siteLocales, type SiteLocale } from '@/lib/locales';

const slug = 'taiwan-semiconductor-supplier-legal' as const;
const hiringColumnSlugs = [
  'taiwan-company-establishment-basics',
  'taiwan-company-subsidiary-vs-branch',
  'taiwan-labor-severance-law',
  'taiwan-mandatory-employment-period',
] as const;

function semiconductorSourceBlock(locale: SiteLocale): string {
  const source = readFileSync(join(process.cwd(), 'src/data/intent-pages.ts'), 'utf8');
  const marker = "'taiwan-semiconductor-supplier-legal': {";
  const starts: number[] = [];
  let from = 0;
  while (from < source.length) {
    const found = source.indexOf(marker, from);
    if (found === -1) {
      break;
    }
    starts.push(found);
    from = found + marker.length;
  }
  const order: SiteLocale[] = ['ko', 'zh-hant', 'en', 'ja'];
  const start = starts[order.indexOf(locale)];
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }
  throw new Error(`Unclosed semiconductor block for ${locale}`);
}

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

  it.each(siteLocales)('points %s related columns at company-setup and hiring topics', (locale) => {
    // 화장품·물류 칼럼은 반도체 공급사 맥락과 무관해 네 로케일 모두 제외한다.
    // columns-en / columns-ja / columns-zh 에 아래 4 slug가 실제로 있다.
    expect(getIntentPage(locale, slug)?.columnSlugs).toEqual([...hiringColumnSlugs]);
  });

  it('uses human H1 titles and keeps the former SEO titles in seoTitle', () => {
    // 한국어 화면 H1은 파이프 키워드 나열 대신 사람이 읽는 문장을 쓰고,
    // 검색결과용 파이프 제목은 seoTitle로 분리했다.
    expect(getIntentPage('ko', slug)?.title).toBe('대만 반도체 소재·장비 공급사를 위한 법무 안내');
    expect(getIntentPage('ko', slug)?.seoTitle).toBe(
      '대만 반도체 소재·장비 공급사 법무 | 법인설립·계약·고용·미수금',
    );
    expect(getIntentPage('en', slug)?.title).toBe(
      'Legal guidance for overseas semiconductor materials and equipment suppliers in Taiwan',
    );
    // WO-X2 (EN-20): shortened so `<title>` (with " | Hovering Law") stays ≤ 60.
    expect(getIntentPage('en', slug)?.seoTitle).toBe('Taiwan Semiconductor Supplier Legal Support');
    expect(getIntentPage('ja', slug)?.title).toBe(
      '台湾の半導体材料・装置サプライヤー向け法務案内',
    );
    expect(getIntentPage('ja', slug)?.seoTitle).toBe(
      '台湾の半導体素材・装置サプライヤー法務 | 会社設立・契約・労務・売掛',
    );
    expect(getIntentPage('zh-hant', slug)?.title).toBe(
      '海外半導體材料與設備供應商的台灣法務說明',
    );
    expect(getIntentPage('zh-hant', slug)?.seoTitle).toBe(
      '台灣半導體材料與設備供應商法務 | 公司設立、契約、勞動、欠款追索',
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

  it('splits seoTitle from the H1 on every locale and leaves other intent pages untouched', () => {
    // WO-X2 (EN-20): EN intent pages may carry a short seoTitle so the rendered
    // <title> stays within 60 characters; other locales stay untouched.
    for (const locale of siteLocales) {
      const page = getIntentPage(locale, slug);
      expect(page?.seoTitle).toBeDefined();
      expect(page?.seoTitle).not.toBe(page?.title);
    }

    for (const locale of siteLocales) {
      for (const otherSlug of intentPageSlugs.filter((item) => item !== slug)) {
        const page = getIntentPage(locale, otherSlug);
        if (locale === 'en') {
          expect(page?.seoTitle).toBeDefined();
          expect(`${page?.seoTitle} | Hovering Law`.length).toBeLessThanOrEqual(60);
        } else {
          expect(page?.seoTitle).toBeUndefined();
        }
        expect(page?.attorneyHeadingOverride).toBeUndefined();
        expect(page?.ctaTextOverride).toBeUndefined();
        expect(page?.serviceBlurbs).toBeUndefined();
      }
    }
  });

  it('carries page-specific overrides for the attorney card, CTA and service blurbs', () => {
    const ko = getIntentPage('ko', slug);
    expect(ko?.attorneyHeadingOverride).toBe('반도체 공급사 사안을 맡는 대만 변호사');
    expect(ko?.ctaTextOverride).toContain('견적서, 공급 계약서, 거래처가 보낸 요구 사항');
    expect(Object.keys(ko?.serviceBlurbs ?? {})).toEqual(['investment', 'civil', 'labor', 'ip']);
    expect(ko?.serviceBlurbs?.civil).toContain('납품은 끝났는데');
    // 재사용 블러브(유학생 헬스장 실적, 퇴직금 신·구제 설명)가 다시 들어오지 않아야 한다.
    expect(JSON.stringify(ko?.serviceBlurbs)).not.toContain('157만');
    expect(JSON.stringify(ko?.serviceBlurbs)).not.toContain('舊制');

    const en = getIntentPage('en', slug);
    expect(en?.attorneyHeadingOverride).toBe('Taiwan attorney for semiconductor supplier matters');
    expect(en?.ctaTextOverride).toContain('quotation, the supply agreement, and the vendor pack');
    expect(Object.keys(en?.serviceBlurbs ?? {})).toEqual(['investment', 'civil', 'labor', 'ip']);
    expect(en?.serviceBlurbs?.civil).toContain('delivery is done but payment has not arrived');

    const ja = getIntentPage('ja', slug);
    expect(ja?.attorneyHeadingOverride).toBe('半導体サプライヤーの案件を担当する台湾弁護士');
    expect(ja?.ctaTextOverride).toContain('見積書、供給契約書、取引先から届いた提出書類');
    expect(Object.keys(ja?.serviceBlurbs ?? {})).toEqual(['investment', 'civil', 'labor', 'ip']);
    expect(ja?.serviceBlurbs?.civil).toContain('納入は終わっているのに代金が入らない');

    const zh = getIntentPage('zh-hant', slug);
    expect(zh?.attorneyHeadingOverride).toBe('處理半導體供應商案件的台灣律師');
    expect(zh?.ctaTextOverride).toContain('報價單、供應契約、以及客戶寄來的供應商登錄文件');
    expect(Object.keys(zh?.serviceBlurbs ?? {})).toEqual(['investment', 'civil', 'labor', 'ip']);
    expect(zh?.serviceBlurbs?.civil).toContain('貨已交完但帳款未進');
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

  it.each(siteLocales)(
    'varies %s list lengths instead of repeating a four-item template',
    (locale) => {
      const page = getIntentPage(locale, slug)!;
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
    },
  );

  it('keeps the semiconductor-specific Korean situations in the copy', () => {
    const serialized = JSON.stringify(getIntentPage('ko', slug));

    for (const token of ['OSAT', '벤더 등록', '대리점', '품질보증', '리콜', 'NDA', 'A/S']) {
      expect(serialized).toContain(token);
    }
  });

  it('keeps the semiconductor-specific situations in the other locales', () => {
    const en = JSON.stringify(getIntentPage('en', slug));
    for (const token of [
      'OSAT',
      'vendor registration',
      'distributor',
      'warranty',
      'recall',
      'NDA',
      'field-service',
    ]) {
      expect(en).toContain(token);
    }

    const ja = JSON.stringify(getIntentPage('ja', slug));
    for (const token of ['OSAT', 'ベンダー登録', '代理店', '品質保証', 'リコール', 'NDA']) {
      expect(ja).toContain(token);
    }

    const zh = JSON.stringify(getIntentPage('zh-hant', slug));
    for (const token of ['OSAT', '供應商登錄', '代理商', '品質保證', '召回', 'NDA', '投審會']) {
      expect(zh).toContain(token);
    }
  });

  it('states the repeated facts once each in every locale', () => {
    const occurrences = (serialized: string, needle: string) =>
      serialized.split(needle).length - 1;

    const en = JSON.stringify(getIntentPage('en', slug));
    expect(occurrences(en, 'English, Chinese, Korean, and Japanese')).toBe(1);
    expect(occurrences(en, 'around three months')).toBe(1);
    expect(occurrences(en, 'NT$3,000')).toBe(1);
    expect(occurrences(en, 'NT$50,000')).toBe(1);
    expect(en).toContain('in person or by video');

    const ja = JSON.stringify(getIntentPage('ja', slug));
    expect(occurrences(ja, '英語・中国語・韓国語・日本語')).toBe(1);
    expect(occurrences(ja, '約3か月')).toBe(1);
    expect(occurrences(ja, 'NT$3,000')).toBe(1);
    // WO-X2 (JA-17): first currency mention on the ja page spells out 新台湾ドル（NT$）.
    expect(occurrences(ja, '50,000新台湾ドル（NT$）')).toBe(1);
    expect(ja).toContain('対面またはビデオ');

    const zh = JSON.stringify(getIntentPage('zh-hant', slug));
    expect(occurrences(zh, '英語、中文、韓語、日語')).toBe(1);
    expect(occurrences(zh, '約 3 個月')).toBe(1);
    expect(occurrences(zh, 'NT$3,000')).toBe(1);
    expect(occurrences(zh, 'NT$50,000')).toBe(1);
    expect(zh).toContain('面談或視訊');
  });

  it.each(siteLocales)('places at least ten attorney-review comments in the %s block', (locale) => {
    const reviews = semiconductorSourceBlock(locale).match(/\/\/ REVIEW: 변호사 검수 필요/g) ?? [];
    expect(reviews.length).toBeGreaterThanOrEqual(10);
    expect(reviews.length).toBe(17);
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

  it('keeps the other-locale search-term chips untouched', () => {
    expect(getIntentPage('en', slug)?.searchTerms).toEqual([
      'Taiwan semiconductor materials equipment legal',
      'semiconductor supplier company setup Taiwan',
      'Taiwan equipment supplier contracts',
    ]);
    expect(getIntentPage('ja', slug)?.searchTerms).toEqual([
      '台湾 半導体素材 装置 法務',
      '台湾 半導体サプライヤー 会社設立',
      '台湾 装置サプライヤー 契約',
    ]);
    expect(getIntentPage('zh-hant', slug)?.searchTerms).toEqual([
      '台灣半導體材料設備法務',
      '台灣半導體供應商公司設立',
      '台灣設備供應商契約',
    ]);
  });
});
