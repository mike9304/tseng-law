import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getJapaneseServiceDetail } from '@/data/service-details-ja';
import { getServiceArea } from '@/data/service-details';
import { getColumnPost } from '@/lib/columns';
import ServiceDetailPage, { generateMetadata } from '../page';

const SITE_URL = 'https://tseng-law.com';
const LABOR_COLUMN_SLUGS = [
  'taiwan-labor-severance-law',
  'taiwan-voluntary-resignation-severance',
  'taiwan-mandatory-employment-period',
] as const;

const navigationMocks = vi.hoisted(() => ({
  notFound: vi.fn((): never => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  permanentRedirect: vi.fn((destination: string): never => {
    throw new Error(`NEXT_REDIRECT:${destination}`);
  }),
}));

const sourceMocks = vi.hoisted(() => ({
  readBySlug: vi.fn(),
  readRecords: vi.fn(),
}));

const visibilityMock = vi.hoisted(() => ({
  read: vi.fn(async () => ({
    persisted: true,
    revision: 1,
    savedAt: '2026-07-25T00:00:00.000Z',
    visibleBlockIds: [
      'service-areas.item.hero',
      'service-areas.item.body',
      'service-areas.item.seo',
    ],
  })),
}));

vi.mock('next/navigation', () => ({
  notFound: navigationMocks.notFound,
  permanentRedirect: navigationMocks.permanentRedirect,
}));

vi.mock('@/lib/builder/services/source', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/services/source')>();
  return {
    ...actual,
    readServiceAreaSourceRecordBySlug: sourceMocks.readBySlug,
    readServiceAreaSourceRecords: sourceMocks.readRecords,
  };
});

vi.mock('@/lib/builder/dynamic-template-drafts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/dynamic-template-drafts')>();
  return {
    ...actual,
    readBuilderDynamicTemplatePublishedBlockVisibility: visibilityMock.read,
  };
});

describe('Japanese labor service-detail route', () => {
  beforeEach(() => {
    navigationMocks.notFound.mockClear();
    navigationMocks.permanentRedirect.mockClear();
    sourceMocks.readBySlug.mockReset();
    sourceMocks.readRecords.mockReset();
    visibilityMock.read.mockClear();
  });

  it('publishes exact Japanese metadata with canonical locale and all alternates', async () => {
    const approved = getJapaneseServiceDetail('labor');
    expect(approved).toBeDefined();
    const expectedDescription = approved!.intro.length > 160
      ? `${approved!.intro.slice(0, 159).trimEnd()}…`
      : approved!.intro;

    const metadata = await generateMetadata({
      params: { locale: 'ja', slug: 'labor' },
    });

    expect(metadata.title).toBe(approved!.title);
    expect(metadata.description).toBe(expectedDescription);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ja/services/labor`);
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: approved!.title,
      description: expectedDescription,
      url: `${SITE_URL}/ja/services/labor`,
      locale: 'ja_JP',
    });
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/services/labor`,
      'zh-Hant': `${SITE_URL}/zh-hant/services/labor`,
      en: `${SITE_URL}/en/services/labor`,
      ja: `${SITE_URL}/ja/services/labor`,
      'x-default': `${SITE_URL}/ko/services/labor`,
    });
    expect(sourceMocks.readBySlug).not.toHaveBeenCalled();
  });

  it('renders exact approved body, ordered points, columns, links, and structured data', async () => {
    const approved = getJapaneseServiceDetail('labor');
    const base = getServiceArea('labor');
    const attorney = getAttorneyProfile('ja', primaryAttorneySlug);
    expect(approved).toBeDefined();
    expect(base).toBeDefined();
    expect(attorney).toBeDefined();
    expect(approved!.keyPoints).toHaveLength(5);
    expect(base!.columnSlugs).toEqual(LABOR_COLUMN_SLUGS);

    const page = await ServiceDetailPage({
      params: { locale: 'ja', slug: 'labor' },
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain(approved!.title);
    expect(html).toContain(approved!.subtitle);
    expect(html).toContain(approved!.intro);
    let previousPointIndex = -1;
    for (const point of approved!.keyPoints) {
      const pointIndex = html.indexOf(point);
      expect(pointIndex).toBeGreaterThan(previousPointIndex);
      previousPointIndex = pointIndex;
    }

    for (const label of [
      '← サービス一覧へ',
      '主なポイント',
      'この分野の担当弁護士',
      '関連コラム — 詳しく見る',
      '記事を読む →',
      '法律相談',
      'この分野に関するご相談は、お問い合わせフォームからお申し込みください。',
      'お問い合わせ',
      'このページは',
      'が内容を確認し、関連コラムと相談窓口をご案内しています。',
      'ホーム',
      '取扱業務',
    ]) {
      expect(html).toContain(label);
    }

    expect(html).toContain(attorney!.name);
    expect(html).toContain('href="/ja/lawyers/wei-tseng"');
    expect(html).toContain('href="/ja/contact"');
    for (const slug of LABOR_COLUMN_SLUGS) {
      expect(getColumnPost(slug, 'ja'), slug).toBeDefined();
      expect(html).toContain(`href="/ja/columns/${slug}"`);
    }

    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain('"@type":"LegalService"');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain(`${SITE_URL}/ja/services/labor`);
    expect(html).toContain(`${SITE_URL}/ja/lawyers/wei-tseng`);
    expect(html).toContain(`${SITE_URL}/ja/contact`);

    for (const staleText of [
      getServiceArea('labor')!.intro.ko,
      getServiceArea('labor')!.intro['zh-hant'],
      getServiceArea('labor')!.intro.en,
    ]) {
      expect(html).not.toContain(staleText);
    }
    for (const englishLabel of [
      'Back to services',
      'Key Points',
      'Book Consultation',
      'Read full article',
    ]) {
      expect(html).not.toContain(englishLabel);
    }

    expect(sourceMocks.readBySlug).not.toHaveBeenCalled();
    expect(sourceMocks.readRecords).not.toHaveBeenCalled();
    expect(visibilityMock.read).toHaveBeenCalledWith(
      'service-areas.item-template',
      'en',
    );
  });

  it('redirects normalized Japanese casing to the canonical labor path', async () => {
    await expect(ServiceDetailPage({
      params: { locale: 'ja', slug: 'LABOR' },
    })).rejects.toThrow('NEXT_REDIRECT:/ja/services/labor');

    expect(navigationMocks.permanentRedirect).toHaveBeenCalledWith(
      '/ja/services/labor',
    );
    expect(sourceMocks.readBySlug).not.toHaveBeenCalled();
    expect(visibilityMock.read).not.toHaveBeenCalled();
  });
});
