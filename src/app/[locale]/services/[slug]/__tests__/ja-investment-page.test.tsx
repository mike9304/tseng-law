import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getJapaneseServiceDetail } from '@/data/service-details-ja';
import { getServiceArea } from '@/data/service-details';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getColumnPost } from '@/lib/columns';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import ServiceDetailPage, {
  generateMetadata,
  generateStaticParams,
} from '../page';

const SITE_URL = 'https://tseng-law.com';
const unsupportedJapaneseSlugs = ['family', 'labor', 'criminal', 'ip'] as const;

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

function makeBuilderArea(slug = 'investment') {
  const area = getServiceArea(slug);
  if (!area) throw new Error(`Missing service fixture: ${slug}`);
  return {
    ...area,
    sourceSlug: area.slug,
  };
}

describe('Japanese investment service-detail route', () => {
  beforeEach(() => {
    navigationMocks.notFound.mockClear();
    navigationMocks.permanentRedirect.mockClear();
    sourceMocks.readBySlug.mockReset();
    sourceMocks.readBySlug.mockImplementation(
      async (_siteId: string, _locale: 'ko' | 'zh-hant' | 'en', slug: string) =>
        getServiceArea(slug) ? makeBuilderArea(slug) : null,
    );
    sourceMocks.readRecords.mockReset();
    sourceMocks.readRecords.mockResolvedValue([
      makeBuilderArea('investment'),
      makeBuilderArea('civil'),
    ]);
    visibilityMock.read.mockClear();
  });

  it('publishes exact Japanese metadata with four locale alternates and x-default', async () => {
    const approved = getJapaneseServiceDetail('investment');
    expect(approved).toBeDefined();
    const expectedDescription = approved!.intro.length > 160
      ? `${approved!.intro.slice(0, 159).trimEnd()}…`
      : approved!.intro;

    const metadata = await generateMetadata({
      params: { locale: 'ja', slug: 'investment' },
    });

    expect(metadata.title).toBe(approved!.title);
    expect(metadata.description).toBe(expectedDescription);
    expect(metadata.alternates?.canonical).toBe(
      `${SITE_URL}/ja/services/investment`,
    );
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: approved!.title,
      description: expectedDescription,
      url: `${SITE_URL}/ja/services/investment`,
      locale: 'ja_JP',
    });
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/services/investment`,
      'zh-Hant': `${SITE_URL}/zh-hant/services/investment`,
      en: `${SITE_URL}/en/services/investment`,
      ja: `${SITE_URL}/ja/services/investment`,
      'x-default': `${SITE_URL}/ko/services/investment`,
    });
    expect(metadata.keywords).toEqual(expect.arrayContaining([
      approved!.title,
      approved!.subtitle,
      '曾雋崴弁護士',
    ]));
    expect(sourceMocks.readBySlug).not.toHaveBeenCalled();
  });

  it('adds only approved Japanese details to static params and reads builder records once', async () => {
    const params = await generateStaticParams();

    expect(params).toEqual(expect.arrayContaining([
      { locale: 'ko', slug: 'investment' },
      { locale: 'zh-hant', slug: 'investment' },
      { locale: 'en', slug: 'investment' },
      { locale: 'ko', slug: 'civil' },
      { locale: 'zh-hant', slug: 'civil' },
      { locale: 'en', slug: 'civil' },
      { locale: 'ja', slug: 'investment' },
      { locale: 'ja', slug: 'civil' },
    ]));
    expect(params.filter(({ locale }) => locale === 'ja')).toEqual([
      { locale: 'ja', slug: 'investment' },
      { locale: 'ja', slug: 'civil' },
    ]);
    expect(sourceMocks.readRecords).toHaveBeenCalledTimes(1);
    expect(sourceMocks.readRecords).toHaveBeenCalledWith(
      DEFAULT_BUILDER_SITE_ID,
      'ko',
    );
  });

  it('renders only approved Japanese body, labels, links, and structured data', async () => {
    const approved = getJapaneseServiceDetail('investment');
    const base = getServiceArea('investment');
    const attorney = getAttorneyProfile('ja', primaryAttorneySlug);
    expect(approved).toBeDefined();
    expect(base).toBeDefined();
    expect(attorney).toBeDefined();

    const page = await ServiceDetailPage({
      params: { locale: 'ja', slug: 'investment' },
    });
    const html = renderToStaticMarkup(page);

    for (const exactBody of [
      approved!.title,
      approved!.subtitle,
      approved!.intro,
      ...approved!.keyPoints,
    ]) {
      expect(html).toContain(exactBody);
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
    for (const slug of base!.columnSlugs) {
      const column = getColumnPost(slug, 'ja');
      expect(column, slug).toBeDefined();
      expect(html).toContain(`href="/ja/columns/${slug}"`);
    }

    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain('"@type":"LegalService"');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain(`${SITE_URL}/ja/services/investment`);
    expect(html).toContain(`${SITE_URL}/ja/lawyers/wei-tseng`);
    expect(html).toContain(`${SITE_URL}/ja/contact`);

    for (const englishLabel of [
      'Back to services',
      'Key Points',
      'Book Consultation',
      'Read full article',
    ]) {
      expect(html).not.toContain(englishLabel);
    }
    expect(html).not.toContain(base!.intro.ko);
    expect(html).not.toContain(base!.intro.en);
    expect(html).not.toContain('href="/ko/');
    expect(html).not.toContain('href="/en/');

    expect(sourceMocks.readBySlug).not.toHaveBeenCalled();
    expect(visibilityMock.read).toHaveBeenCalledWith(
      'service-areas.item-template',
      'en',
    );
  });

  it.each(unsupportedJapaneseSlugs)(
    'keeps Japanese %s unavailable without a builder source read',
    async (slug) => {
      await expect(generateMetadata({
        params: { locale: 'ja', slug },
      })).resolves.toEqual({});
      await expect(ServiceDetailPage({
        params: { locale: 'ja', slug },
      })).rejects.toThrow('NEXT_NOT_FOUND');

      expect(navigationMocks.notFound).toHaveBeenCalledTimes(1);
      expect(sourceMocks.readBySlug).not.toHaveBeenCalled();
      expect(visibilityMock.read).not.toHaveBeenCalled();
    },
  );

  it('redirects normalized Japanese casing to the canonical investment path', async () => {
    await expect(ServiceDetailPage({
      params: { locale: 'ja', slug: 'INVESTMENT' },
    })).rejects.toThrow('NEXT_REDIRECT:/ja/services/investment');

    expect(navigationMocks.permanentRedirect).toHaveBeenCalledWith(
      '/ja/services/investment',
    );
    expect(sourceMocks.readBySlug).not.toHaveBeenCalled();
  });

  it.each(['ko', 'zh-hant', 'en'] as const)(
    'preserves %s builder source and template visibility behavior',
    async (locale) => {
      const page = await ServiceDetailPage({
        params: { locale, slug: 'investment' },
      });
      const html = renderToStaticMarkup(page);

      expect(sourceMocks.readBySlug).toHaveBeenCalledWith(
        DEFAULT_BUILDER_SITE_ID,
        locale,
        'investment',
      );
      expect(visibilityMock.read).toHaveBeenCalledWith(
        'service-areas.item-template',
        locale,
      );
      expect(html).toContain(getServiceArea('investment')!.subtitle[locale]);
    },
  );
});
