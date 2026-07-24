import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  buildPublishedSitePageMetadata: vi.fn(),
  checkAccess: vi.fn(),
  emitPublicPageRenderHook: vi.fn(),
  getAllColumnPosts: vi.fn(),
  getCurrentSiteMember: vi.fn(),
  JsonLd: vi.fn(),
  PublishedSitePageView: vi.fn(),
  redirect: vi.fn((path: string): never => {
    throw new Error(`redirect:${path}`);
  }),
  resolvePublishedSitePage: vi.fn(),
  VideosLegacyPageBody: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}));

vi.mock('@/components/JsonLd', () => ({
  default: mocks.JsonLd,
}));

vi.mock('@/lib/columns', () => ({
  getAllColumnPosts: mocks.getAllColumnPosts,
}));

vi.mock('@/lib/builder/site/public-page', () => ({
  buildPublishedSitePageMetadata: mocks.buildPublishedSitePageMetadata,
  PublishedSitePageView: mocks.PublishedSitePageView,
  resolvePublishedSitePage: mocks.resolvePublishedSitePage,
}));

vi.mock('@/lib/builder/apps/lifecycle-emitters', () => ({
  emitPublicPageRenderHook: mocks.emitPublicPageRenderHook,
}));

vi.mock('@/lib/builder/members/current-member', () => ({
  getCurrentSiteMember: mocks.getCurrentSiteMember,
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  checkAccess: mocks.checkAccess,
}));

vi.mock('@/app/[locale]/(legacy)/legacy-page-bodies', () => ({
  VideosLegacyPageBody: mocks.VideosLegacyPageBody,
}));

import VideosPage, { generateMetadata } from '../page';
import { attorneyProfiles } from '@/data/attorney-profiles';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';

function buildColumnFixtures(count: number): readonly { readonly slug: string }[] {
  return Array.from({ length: count }, (_, index) => ({ slug: `column-${index + 1}` }));
}

describe('videos route builder parity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.buildPublishedSitePageMetadata.mockResolvedValue(null);
    mocks.checkAccess.mockReturnValue(true);
    mocks.getAllColumnPosts.mockReturnValue(buildColumnFixtures(17));
    mocks.getCurrentSiteMember.mockResolvedValue(null);
    mocks.resolvePublishedSitePage.mockResolvedValue(null);
  });

  it('uses published builder metadata when the standard videos page exists', async () => {
    const metadata = { title: 'Published videos metadata' };
    mocks.buildPublishedSitePageMetadata.mockResolvedValue(metadata);

    const result = await generateMetadata({ params: { locale: 'ko' } });

    expect(result).toBe(metadata);
    expect(mocks.buildPublishedSitePageMetadata).toHaveBeenCalledWith('ko', 'videos');
  });

  it('renders the published builder videos page before the legacy fallback', async () => {
    const publishedPage = {
      site: { siteId: 'site-tseng-law' },
      pageMeta: { pageId: 'page-videos', memberAccess: undefined },
    };
    mocks.resolvePublishedSitePage.mockResolvedValue(publishedPage);

    const element = await VideosPage({ params: { locale: 'ko' } });

    expect(React.isValidElement<{ readonly resolved: unknown }>(element)).toBe(true);
    if (!React.isValidElement<{ readonly resolved: unknown }>(element)) {
      throw new Error('Expected VideosPage to return a React element');
    }
    expect(element.type).toBe(mocks.PublishedSitePageView);
    expect(element.props.resolved).toBe(publishedPage);
    expect(mocks.emitPublicPageRenderHook).toHaveBeenCalledWith({
      kind: 'public.page-render',
      payload: {
        siteId: 'site-tseng-law',
        pageId: 'page-videos',
        slug: 'videos',
        locale: 'ko',
      },
    });
    expect(mocks.getAllColumnPosts).not.toHaveBeenCalled();
  });

  it('passes the static public column count to the legacy videos body when no builder page is published', async () => {
    const element = await VideosPage({ params: { locale: 'ko' } });

    expect(React.isValidElement<{ readonly children?: React.ReactNode }>(element)).toBe(true);
    if (!React.isValidElement<{ readonly children?: React.ReactNode }>(element)) {
      throw new Error('Expected VideosPage fallback to return a React fragment');
    }

    const bodyElement = React.Children
      .toArray(element.props.children)
      .find((child) => React.isValidElement(child) && child.type === mocks.VideosLegacyPageBody);

    expect(React.isValidElement<{ readonly columnCount: number; readonly locale: string }>(bodyElement)).toBe(true);
    if (!React.isValidElement<{ readonly columnCount: number; readonly locale: string }>(bodyElement)) {
      throw new Error('Expected fallback fragment to include VideosLegacyPageBody');
    }

    expect(bodyElement.props).toMatchObject({
      columnCount: 17,
      locale: 'ko',
    });
    expect(mocks.getAllColumnPosts).toHaveBeenCalledWith('ko');
  });

  it('builds Japanese metadata with Japanese keywords and all four public alternates', async () => {
    const metadata = await generateMetadata({ params: { locale: 'ja' } });

    expect(metadata.title).toBe(pageCopy.ja.videos.title);
    expect(metadata.description).toBe(pageCopy.ja.videos.description);
    expect(metadata.keywords).toEqual(expect.arrayContaining([
      '曾雋崴弁護士',
      '台湾法律動画',
      'WEI Lawyerチャンネル',
    ]));
    expect(new URL(String(metadata.alternates?.canonical)).pathname).toBe('/ja/videos');
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      locale: 'ja_JP',
      title: pageCopy.ja.videos.title,
      description: pageCopy.ja.videos.description,
    });

    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(Object.fromEntries(
      ['ko', 'zh-Hant', 'en', 'ja'].map((language) => [
        language,
        new URL(String(languages[language])).pathname,
      ]),
    )).toEqual({
      ko: '/ko/videos',
      'zh-Hant': '/zh-hant/videos',
      en: '/en/videos',
      ja: '/ja/videos',
    });
    expect(mocks.buildPublishedSitePageMetadata).not.toHaveBeenCalled();
  });

  it('renders the complete Japanese static page and JSON-LD without builder or member calls', async () => {
    const element = await VideosPage({ params: { locale: 'ja' } });

    expect(React.isValidElement<{ readonly children?: React.ReactNode }>(element)).toBe(true);
    if (!React.isValidElement<{ readonly children?: React.ReactNode }>(element)) {
      throw new Error('Expected Japanese VideosPage to return a React element');
    }

    const children = React.Children.toArray(element.props.children);
    const jsonLdElements = children.filter(
      (child): child is React.ReactElement<{ readonly data: Record<string, unknown> }> =>
        React.isValidElement<{ readonly data: Record<string, unknown> }>(child)
        && child.type === mocks.JsonLd,
    );
    const bodyElement = children.find(
      (child) => React.isValidElement(child) && child.type === mocks.VideosLegacyPageBody,
    );

    expect(jsonLdElements).toHaveLength(3);
    expect(React.isValidElement<{
      readonly columnCount: number;
      readonly locale: string;
    }>(bodyElement)).toBe(true);
    if (!React.isValidElement<{
      readonly columnCount: number;
      readonly locale: string;
    }>(bodyElement)) {
      throw new Error('Expected Japanese fragment to include VideosLegacyPageBody');
    }

    expect(bodyElement.props).toMatchObject({
      columnCount: 17,
      locale: 'ja',
    });
    expect(mocks.getAllColumnPosts).toHaveBeenCalledWith('ja');

    const breadcrumb = jsonLdElements[0].props.data as {
      '@type': string;
      itemListElement: Array<{ name: string; item: string }>;
    };
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
    expect(breadcrumb.itemListElement.map(({ name, item }) => ({
      name,
      path: new URL(item).pathname,
    }))).toEqual([
      { name: 'ホーム', path: '/ja' },
      { name: pageCopy.ja.videos.title, path: '/ja/videos' },
    ]);

    const collection = jsonLdElements[1].props.data as {
      '@type': string;
      inLanguage: string;
      mainEntity: {
        itemListElement: Array<{
          name: string;
          url: string;
          description: string;
        }>;
      };
    };
    const channelItems = [
      siteContent.ja.videos.featured,
      ...siteContent.ja.videos.items,
    ];
    expect(collection).toMatchObject({
      '@type': 'CollectionPage',
      inLanguage: 'ja',
    });
    expect(collection.mainEntity.itemListElement).toHaveLength(channelItems.length);
    expect(collection.mainEntity.itemListElement.map((item) => ({
      name: item.name,
      url: item.url,
      description: item.description,
    }))).toEqual(channelItems.map((item) => ({
      name: item.title,
      url: expect.stringContaining(item.href),
      description: item.duration,
    })));

    const person = jsonLdElements[2].props.data as {
      '@type': string;
      name: string;
      url: string;
      jobTitle: string;
      worksFor: { url: string };
    };
    expect(person).toMatchObject({
      '@type': 'Person',
      name: '曾雋崴弁護士',
      jobTitle: attorneyProfiles.ja['wei-tseng'].role,
    });
    expect(new URL(person.url).pathname).toBe('/ja/lawyers/wei-tseng');
    expect(new URL(person.worksFor.url).pathname).toBe('/ja');

    expect(mocks.resolvePublishedSitePage).not.toHaveBeenCalled();
    expect(mocks.getCurrentSiteMember).not.toHaveBeenCalled();
    expect(mocks.checkAccess).not.toHaveBeenCalled();
    expect(mocks.emitPublicPageRenderHook).not.toHaveBeenCalled();
  });
});
