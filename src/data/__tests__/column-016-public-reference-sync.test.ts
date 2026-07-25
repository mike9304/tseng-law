import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, it } from 'vitest';

import { insightsArchive } from '@/data/insights-archive';
import { siteContent } from '@/data/site-content';
import { getSearchIndex } from '@/lib/search';

const slug = 'taiwan-inheritance-custody-analysis';
const archiveId = 'inheritance-custody';
const locales = ['ko', 'zh-hant', 'en'] as const;
const siteLocales = [...locales, 'ja'] as const;

const expectedTitles = {
  ko: '대만 상속과 친권: 남은 가족을 위한 법률 안내',
  'zh-hant': '台灣繼承與親權：遺屬法律指南',
  en: 'Taiwan Inheritance and Parental Rights: A Guide for Surviving Families',
  ja: '台湾の相続と親権：遺された家族のための法律ガイド',
} as const;

const expectedArchiveRecords = {
  ko: {
    title: expectedTitles.ko,
    summary:
      '대만의 상속순위, 배우자 재산청구, 친권상 권리·의무와 미성년자 재산보호를 익명 사례 없이 설명합니다.',
    image: '/images/016-taiwan-inheritance-custody-analysis/featured-generic.webp',
    keywords: ['상속', '친권', '미성년자 재산'],
    href: '/ko/insights/taiwan-inheritance-custody-analysis',
  },
  'zh-hant': {
    title: expectedTitles['zh-hant'],
    summary:
      '說明台灣法下的繼承順位、配偶剩餘財產請求、親權權利義務及未成年人財產保護。',
    image: '/images/016-taiwan-inheritance-custody-analysis/featured-generic.webp',
    keywords: ['繼承', '親權', '未成年人財產'],
    href: '/zh-hant/insights/taiwan-inheritance-custody-analysis',
  },
  en: {
    title: expectedTitles.en,
    summary:
      'A guide to Taiwan succession, spousal residual-property claims, parental rights and duties, and protection of a minor’s property.',
    image: '/images/016-taiwan-inheritance-custody-analysis/featured-generic.webp',
    keywords: ['inheritance', 'parental rights', 'minor property'],
    href: '/en/insights/taiwan-inheritance-custody-analysis',
  },
} as const;

function getRelatedColumn(locale: (typeof siteLocales)[number]) {
  return siteContent[locale].services.items
    .flatMap((item) => item.relatedColumns ?? [])
    .find((column) => column.slug === slug);
}

function getArchiveRecord(locale: (typeof locales)[number]) {
  return insightsArchive[locale].posts.find((post) => post.id === archiveId);
}

describe('column 016 public reference synchronization', () => {
  it('uses the four exact related-column titles', () => {
    for (const locale of siteLocales) {
      expect(getRelatedColumn(locale), locale).toMatchObject({
        slug,
        title: expectedTitles[locale],
      });
    }
  });

  it('uses exact localized archive copy, image, keywords, and canonical search hrefs', () => {
    for (const locale of locales) {
      expect(getArchiveRecord(locale), locale).toMatchObject(expectedArchiveRecords[locale]);
    }
  });

  it('propagates exact localized copy and canonical column hrefs to search', () => {
    for (const locale of locales) {
      const result = getSearchIndex(locale).find(
        (item) => item.id === 'insight-post-inheritance-custody',
      );

      expect(result, locale).toMatchObject({
        title: expectedArchiveRecords[locale].title,
        description: expectedArchiveRecords[locale].summary,
        href: `/${locale}/columns/${slug}`,
      });
    }
  });

  it('keeps permanent column and insights aliases in every public locale', async () => {
    const configPath = path.join(process.cwd(), 'next.config.mjs');
    const configModule = await import(pathToFileURL(configPath).href);
    const redirects = await configModule.default.redirects();

    for (const locale of siteLocales) {
      expect(redirects).toContainEqual({
        source: `/${locale}/columns/inheritance-custody`,
        destination: `/${locale}/columns/${slug}`,
        permanent: true,
      });
      expect(redirects).toContainEqual({
        source: `/${locale}/insights/inheritance-custody`,
        destination: `/${locale}/columns/${slug}`,
        permanent: true,
      });
    }
  });

  it('removes every former title and the old image from synchronized references', () => {
    const runtimeFiles = [
      path.join(process.cwd(), 'src/data/site-content.ts'),
      path.join(process.cwd(), 'src/data/insights-archive.ts'),
      path.join(process.cwd(), 'next.config.mjs'),
    ];
    const serializedRuntimeFiles = runtimeFiles
      .map((filePath) => fs.readFileSync(filePath, 'utf8'))
      .join('\n');

    for (const formerReference of [
      '유산·친권 이슈 분석',
      '구준엽 씨와 서희원씨 간 유산·친권 이슈 분석',
      '遺產與親權分析',
      '遺產與親權議題案例分析',
      'Inheritance & Custody Analysis',
      'Inheritance and Custody Issue Analysis',
      '具俊曄氏と徐熙媛氏の遺産・親権問題の分析',
    ]) {
      expect(serializedRuntimeFiles).not.toContain(formerReference);
    }

    const synchronizedArchiveRecords = locales.map((locale) => getArchiveRecord(locale));
    expect(JSON.stringify(synchronizedArchiveRecords)).not.toContain('featured-01.jpg');
  });

  it('keeps named people and SBS variants out of synchronized records', () => {
    const synchronizedRecords = JSON.stringify([
      ...siteLocales.map((locale) => getRelatedColumn(locale)),
      ...locales.map((locale) => getArchiveRecord(locale)),
      ...locales.map((locale) =>
        getSearchIndex(locale).find(
          (item) => item.id === 'insight-post-inheritance-custody',
        ),
      ),
    ]);

    expect(synchronizedRecords).not.toMatch(
      /구준엽|서희원|왕소비|서희제|具俊曄|徐熙媛|汪小菲|徐熙娣|Koo Jun-yup|Barbie Hsu|Wang Xiaofei|Dee Hsu/i,
    );
    expect(synchronizedRecords).not.toMatch(
      /(?:^|[^A-Za-z])SBS(?:\s*(?:News|뉴스|新聞|ニュース))?(?:[^A-Za-z]|$)/i,
    );
  });
});
