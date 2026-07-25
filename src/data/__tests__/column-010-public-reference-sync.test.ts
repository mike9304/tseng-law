import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, it } from 'vitest';

import { insightsArchive } from '@/data/insights-archive';
import { siteContent } from '@/data/site-content';
import { attorneyProfiles } from '@/data/attorney-profiles';
import { getSearchIndex } from '@/lib/search';

const slug = 'taiwan-gym-injury-lawsuit';
const archiveId = 'gym-injury-lawsuit';
const locales = ['ko', 'zh-hant', 'en'] as const;
const siteLocales = [...locales, 'ja'] as const;

const expectedTitles = {
  ko: '대만 헬스장 부상 손해배상: 1심 사례·청구기한·증거·배상항목',
  'zh-hant': '台灣健身房受傷求償：一審案例、期限、證據與賠償項目',
  en: 'Taiwan Gym Injury Claims: Case Study, Deadlines, Evidence, and Damages',
  ja: '台湾のジム事故損害賠償：一審事例・期限・証拠・賠償項目',
} as const;

const expectedAttorneyLinkLabels = {
  ko: '대만 헬스장 부상 손해배상 칼럼',
  'zh-hant': '台灣健身房受傷求償專欄',
  en: 'Taiwan Gym Injury Claims Column',
  ja: '台湾のジム事故損害賠償コラム',
} as const;

const expectedArchiveRecords = {
  ko: {
    title: expectedTitles.ko,
    summary:
      '대만 헬스장 부상 1심 사례를 바탕으로 형사 고소·민사 청구기한, 증거보전, 배상항목과 보험 확인 사항을 정리합니다.',
    href: '/ko/insights/gym-injury-lawsuit',
  },
  'zh-hant': {
    title: expectedTitles['zh-hant'],
    summary:
      '以台灣健身房受傷的一審案例為基礎，整理刑事告訴與民事求償期限、證據保存、賠償項目及保險確認事項。',
    href: '/zh-hant/insights/gym-injury-lawsuit',
  },
  en: {
    title: expectedTitles.en,
    summary:
      'Using a first-instance Taiwan gym injury case, this guide explains criminal-complaint and civil-claim deadlines, evidence preservation, damages, and insurance checks.',
    href: '/en/insights/gym-injury-lawsuit',
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

function getAttorneyLink(locale: (typeof siteLocales)[number]) {
  return attorneyProfiles[locale]['wei-tseng'].internalLinks.find(
    (link) => link.href === `/${locale}/columns/${slug}`,
  );
}

describe('column 010 public reference synchronization', () => {
  it('uses the four exact related-column titles', () => {
    for (const locale of siteLocales) {
      expect(getRelatedColumn(locale), locale).toEqual({
        slug,
        title: expectedTitles[locale],
      });
    }
  });

  it('uses exact localized archive copy, keywords, and canonical insights hrefs', () => {
    for (const locale of locales) {
      expect(getArchiveRecord(locale), locale).toMatchObject(expectedArchiveRecords[locale]);
    }
  });

  it('propagates exact archive copy and canonical column hrefs to search', () => {
    for (const locale of locales) {
      const result = getSearchIndex(locale).find((item) => item.id === 'insight-post-gym-injury-lawsuit');

      expect(result, locale).toMatchObject({
        title: expectedArchiveRecords[locale].title,
        description: expectedArchiveRecords[locale].summary,
        href: `/${locale}/columns/gym-injury-lawsuit`,
      });
    }
  });

  it('uses the exact internal-link labels and canonical column hrefs in attorney profiles', () => {
    for (const locale of siteLocales) {
      expect(getAttorneyLink(locale), locale).toEqual({
        label: expectedAttorneyLinkLabels[locale],
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
        source: `/${locale}/columns/gym-injury-lawsuit`,
        destination: `/${locale}/columns/${slug}`,
        permanent: true,
      });
      expect(redirects).toContainEqual({
        source: `/${locale}/insights/gym-injury-lawsuit`,
        destination: `/${locale}/columns/${slug}`,
        permanent: true,
      });
    }
  });

  it('removes stale public titles from synchronized runtime files', () => {
    const runtimeFiles = [
      path.join(process.cwd(), 'src/data/insights-archive.ts'),
      path.join(process.cwd(), 'src/data/site-content.ts'),
      path.join(process.cwd(), 'src/data/attorney-profiles.ts'),
    ];
    const serializedRuntimeFiles = runtimeFiles.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n');

    for (const formerReference of [
      '대만 헬스장 부상 소송',
      '台灣健身房受傷訴訟',
      'Taiwan Gym Injury Lawsuit',
      '헬스장 부상 소송 (157만 TWD)',
      '健身房受傷訴訟（157萬 TWD）',
      'Gym Injury Case (TWD 1.57M)',
      '台湾ジム傷害訴訟（157万新台湾ドル）',
      '헬스장 부상 소송 칼럼',
      '健身房受傷案件專欄',
      'Gym Injury Case Column',
      'ジム負傷訴訟コラム',
    ]) {
      expect(serializedRuntimeFiles).not.toContain(formerReference);
    }
  });
});
