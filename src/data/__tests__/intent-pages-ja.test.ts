import { describe, expect, it } from 'vitest';

import { getIntentPage, intentPageSlugs } from '@/data/intent-pages';
import { guideContent } from '@/app/[locale]/guides/taiwan-company-setup/content';
import { landingContent } from '@/app/[locale]/korean-lawyer-in-taiwan/content';
import { siteLocales } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

const hangulPattern = /[가-힣]/;

function expectJapaneseContent(payload: unknown, label: string) {
  const serialized = JSON.stringify(payload);
  expect(serialized, label).not.toMatch(hangulPattern);
  expect(serialized, label).not.toContain('/ko/');
}

describe('Japanese intent landing pages', () => {
  it.each(intentPageSlugs)('resolves Japanese content for %s', (slug) => {
    const page = getIntentPage('ja', slug);

    expect(page).toBeDefined();
    expect(page?.slug).toBe(slug);
  });

  it.each(intentPageSlugs)('keeps Japanese copy free of Korean sentences for %s', (slug) => {
    expectJapaneseContent(getIntentPage('ja', slug), slug);
  });

  it.each(intentPageSlugs)('mirrors the Korean service/column structure for %s', (slug) => {
    const ko = getIntentPage('ko', slug);
    const ja = getIntentPage('ja', slug);

    expect(ja?.serviceSlugs).toEqual(ko?.serviceSlugs);
    expect(ja?.columnSlugs).toEqual(ko?.columnSlugs);
    // WO-JA-1 added one Japanese-only FAQ to both the company-setup and litigation pages.
    const jaOnlyFaqCount =
      slug === 'taiwan-company-setup-lawyer' || slug === 'taiwan-litigation-lawyer' ? 1 : 0;
    expect(ko).toBeDefined();
    expect(ja?.faq).toHaveLength(ko!.faq.length + jaOnlyFaqCount);
  });

  it('pins the WO-JA-1 company-setup description and appended FAQ copy', () => {
    const page = getIntentPage('ja', 'taiwan-company-setup-lawyer');

    expect(page?.description).toBe(
      '日本企業の台湾進出に向けた会社設立の手続き・費用・期間と、子会社・支店・駐在員事務所の違いを日本語で解説します。投資審査から銀行口座開設、就業許可までを一貫してサポートします。',
    );
    expect(page?.faq[0]).toEqual({
      question: '台湾の会社設立は通常どのくらいかかりますか？',
      answer:
        '一般的に約3ヶ月前後を見込みますが、投資承認の対象かどうか、資本金送金の時期、業種別許可の必要性によって変わることがあります。',
    });
    expect(page?.faq[3]).toEqual({
      question: '設立にはどのくらいかかりますか？',
      answer:
        '会社設立自体はおおむね3か月、その後の就業許可・居留証に約1か月が目安です（詳細は台湾法人設立総合ガイドをご覧ください）。',
    });
  });

  it.each(intentPageSlugs)('emits a self-referencing /ja canonical for %s', (slug) => {
    const page = getIntentPage('ja', slug);
    const metadata = buildSeoMetadata({
      locale: 'ja',
      title: page?.title ?? '',
      description: page?.description ?? '',
      path: `/${slug}`,
      keywords: page?.keywords,
      alternateLocales: siteLocales,
    });

    expect(metadata.alternates?.canonical).toBe(`https://tseng-law.com/ja/${slug}`);
    expect(metadata.alternates?.languages?.ja).toBe(`https://tseng-law.com/ja/${slug}`);
    expect(metadata.alternates?.languages?.ko).toBe(`https://tseng-law.com/ko/${slug}`);
    expect(metadata.alternates?.languages?.['zh-Hant']).toBe(`https://tseng-law.com/zh-hant/${slug}`);
    expect(metadata.alternates?.languages?.en).toBe(`https://tseng-law.com/en/${slug}`);
  });

  it('keeps the Korean source content untouched', () => {
    expect(getIntentPage('ko', 'taiwan-lawyer')?.title).toBe(
      '대만변호사 | 한국어 상담·소송·법인설립 지원',
    );
    expect(getIntentPage('ko', 'taiwan-company-setup-lawyer')?.title).toBe(
      '대만 법인설립·회사설립 변호사 | 절차·비용·기간',
    );
    expect(getIntentPage('ko', 'taiwan-litigation-lawyer')?.title).toBe(
      '대만 소송 변호사 | 민사·형사·노동 한국어 대응',
    );
  });
});

describe('Japanese Taiwan company setup guide', () => {
  it('resolves Japanese guide content without Korean sentences', () => {
    expect(guideContent.ja).toBeDefined();
    expectJapaneseContent(guideContent.ja, 'guideContent.ja');
  });

  it('keeps the same step and row counts as the Korean guide', () => {
    expect(guideContent.ja.steps).toHaveLength(guideContent.ko.steps.length);
    expect(guideContent.ja.comparisonRows).toHaveLength(guideContent.ko.comparisonRows.length);
    expect(guideContent.ja.costRows).toHaveLength(guideContent.ko.costRows.length);
    expect(guideContent.ja.faq).toHaveLength(guideContent.ko.faq.length);
  });

  it('emits a self-referencing /ja canonical for the guide path', () => {
    const metadata = buildSeoMetadata({
      locale: 'ja',
      title: guideContent.ja.metaTitle,
      description: guideContent.ja.description,
      path: '/guides/taiwan-company-setup',
      keywords: guideContent.ja.keywords,
      alternateLocales: siteLocales,
    });

    expect(metadata.alternates?.canonical).toBe(
      'https://tseng-law.com/ja/guides/taiwan-company-setup',
    );
    expect(metadata.alternates?.languages?.ja).toBe(
      'https://tseng-law.com/ja/guides/taiwan-company-setup',
    );
  });
});

describe('Japanese Korean-lawyer-in-Taiwan landing', () => {
  it('resolves Japanese landing content without Korean sentences', () => {
    expect(landingContent.ja).toBeDefined();
    expectJapaneseContent(landingContent.ja, 'landingContent.ja');
  });

  it('keeps the same list counts as the Korean landing content', () => {
    expect(landingContent.ja.lead).toHaveLength(landingContent.ko.lead.length);
    expect(landingContent.ja.services).toHaveLength(landingContent.ko.services.length);
    expect(landingContent.ja.languages).toHaveLength(landingContent.ko.languages.length);
    expect(landingContent.ja.faq).toHaveLength(landingContent.ko.faq.length);
  });

  it('emits a self-referencing /ja canonical for the landing path', () => {
    const metadata = buildSeoMetadata({
      locale: 'ja',
      title: landingContent.ja.metaTitle,
      description: landingContent.ja.description,
      path: '/korean-lawyer-in-taiwan',
      keywords: landingContent.ja.keywords,
      alternateLocales: siteLocales,
    });

    expect(metadata.alternates?.canonical).toBe(
      'https://tseng-law.com/ja/korean-lawyer-in-taiwan',
    );
    expect(metadata.alternates?.languages?.ja).toBe(
      'https://tseng-law.com/ja/korean-lawyer-in-taiwan',
    );
  });
});
