import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { attorneyProfiles } from '@/data/attorney-profiles';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import LawyerProfilePage, {
  generateMetadata,
  generateStaticParams,
} from '../page';

const SITE_URL = 'https://tseng-law.com';

const sourceMocks = vi.hoisted(() => ({
  readBySlug: vi.fn(),
  readRecords: vi.fn(),
}));

const visibilityMock = vi.hoisted(() => ({
  read: vi.fn(async () => ({
    persisted: true,
    revision: 1,
    savedAt: '2026-07-24T00:00:00.000Z',
    visibleBlockIds: [
      'attorney-profiles.item.hero',
      'attorney-profiles.item.body',
      'attorney-profiles.item.seo',
    ],
  })),
}));

vi.mock('@/lib/builder/lawyers/source', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/lawyers/source')>();
  return {
    ...actual,
    readAttorneyProfileSourceRecordBySlug: sourceMocks.readBySlug,
    readAttorneyProfileSourceRecords: sourceMocks.readRecords,
  };
});

vi.mock('@/lib/builder/dynamic-template-drafts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/dynamic-template-drafts')>();
  return {
    ...actual,
    readBuilderDynamicTemplatePublishedBlockVisibility: visibilityMock.read,
  };
});

function makeBuilderProfile(locale: 'ko' | 'zh-hant' | 'en') {
  const profile = attorneyProfiles[locale]['wei-tseng'];
  return {
    ...profile,
    sourceSlug: profile.slug,
    imageAltText: `${profile.name} ${profile.role}`,
    imageFocalPoint: { x: 0.5, y: 0.5 },
  };
}

describe('Japanese lawyer-profile integration', () => {
  beforeEach(() => {
    sourceMocks.readBySlug.mockReset();
    sourceMocks.readBySlug.mockImplementation(
      async (_siteId: string, locale: 'ko' | 'zh-hant' | 'en') =>
        makeBuilderProfile(locale),
    );
    sourceMocks.readRecords.mockReset();
    sourceMocks.readRecords.mockResolvedValue([
      { ...makeBuilderProfile('ko'), slug: 'builder-wei' },
    ]);
    visibilityMock.read.mockClear();
  });

  it('publishes native Japanese metadata with four-language alternates', async () => {
    const profile = attorneyProfiles.ja['wei-tseng'];
    const metadata = await generateMetadata({
      params: { locale: 'ja', slug: 'wei-tseng' },
    });

    expect(metadata.title).toBe(profile.title);
    expect(metadata.description).toBe(profile.description);
    expect(metadata.alternates?.canonical).toBe(
      `${SITE_URL}/ja/lawyers/wei-tseng`,
    );
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: profile.title,
      description: profile.description,
      url: `${SITE_URL}/ja/lawyers/wei-tseng`,
      locale: 'ja_JP',
    });
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/lawyers/wei-tseng`,
      'zh-Hant': `${SITE_URL}/zh-hant/lawyers/wei-tseng`,
      en: `${SITE_URL}/en/lawyers/wei-tseng`,
      ja: `${SITE_URL}/ja/lawyers/wei-tseng`,
      'x-default': `${SITE_URL}/ko/lawyers/wei-tseng`,
    });
    expect(sourceMocks.readBySlug).not.toHaveBeenCalled();
  });

  it('renders approved Japanese data, labels, and structured data without builder reads', async () => {
    const profile = attorneyProfiles.ja['wei-tseng'];
    const page = await LawyerProfilePage({
      params: { locale: 'ja', slug: 'wei-tseng' },
    });
    const html = renderToStaticMarkup(page);

    for (const label of [
      '弁護士プロフィール',
      '基本情報',
      '学歴',
      '経歴',
      '主な取扱業務・実績',
      '関連サービス・コンテンツ',
      '外部プロフィール・チャンネル',
      '相談を申し込む',
      'よく検索されるテーマ',
      'ホーム',
      '弁護士紹介',
    ]) {
      expect(html).toContain(label);
    }

    expect(html).toContain(profile.name);
    expect(html).toContain(profile.description);
    expect(html).toContain(profile.image);
    expect(html).toContain(profile.email);
    expect(profile.internalLinks).toHaveLength(6);
    for (const internalLink of profile.internalLinks) {
      expect(html).toContain(`href="${internalLink.href}"`);
      expect(html).toContain(internalLink.label);
    }
    for (const unsafeHref of [
      '/ja/taiwan-lawyer',
      '/ja/taiwan-company-setup-lawyer',
      '/ja/services/investment',
      '/ja/services/civil',
    ]) {
      expect(html).not.toContain(`href="${unsafeHref}"`);
    }
    for (const sameAs of profile.sameAs) {
      expect(html).toContain(sameAs);
    }

    expect(html).toContain('"@type":"ProfilePage"');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('"inLanguage":"ja"');
    expect(html).toContain(`${SITE_URL}/ja/lawyers/wei-tseng`);
    expect(html).not.toContain('PROFILE');
    expect(html).not.toContain('Key Facts');

    const jsonLdNodes = [...html.matchAll(
      /<script type="application\/ld\+json">([^<]+)<\/script>/g,
    )].map((match) => JSON.parse(match[1]) as Record<string, unknown>);
    expect(jsonLdNodes).toContainEqual(expect.objectContaining({
      '@type': 'FAQPage',
      inLanguage: 'ja',
    }));

    expect(sourceMocks.readBySlug).not.toHaveBeenCalled();
    expect(visibilityMock.read).not.toHaveBeenCalled();
  });

  it('adds the canonical Japanese profile to static params without a JA source read', async () => {
    const params = await generateStaticParams();

    expect(params).toContainEqual({ locale: 'ja', slug: 'wei-tseng' });
    expect(params).not.toContainEqual({ locale: 'ja', slug: 'builder-wei' });
    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      expect(params).toContainEqual({ locale, slug: 'builder-wei' });
    }
    expect(sourceMocks.readRecords).toHaveBeenCalledTimes(1);
    expect(sourceMocks.readRecords).toHaveBeenCalledWith(DEFAULT_BUILDER_SITE_ID, 'ko');
  });

  it.each(['ko', 'zh-hant', 'en'] as const)(
    'preserves %s builder source and visibility behavior',
    async (locale) => {
      const page = await LawyerProfilePage({
        params: { locale, slug: 'wei-tseng' },
      });
      const html = renderToStaticMarkup(page);

      expect(sourceMocks.readBySlug).toHaveBeenCalledWith(
        DEFAULT_BUILDER_SITE_ID,
        locale,
        'wei-tseng',
      );
      expect(visibilityMock.read).toHaveBeenCalledWith(
        'attorney-profiles.item-template',
        locale,
      );
      expect(html).toContain(attorneyProfiles[locale]['wei-tseng'].name);

      const metadata = await generateMetadata({
        params: { locale, slug: 'wei-tseng' },
      });
      // WO#3: /ja/lawyers/wei-tseng is a live Japanese page, so ja must be advertised.
      expect(metadata.alternates?.languages).toHaveProperty('ja', `${SITE_URL}/ja/lawyers/wei-tseng`);
    },
  );
});
