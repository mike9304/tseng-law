import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  buildPublishedSitePageMetadata: vi.fn(),
  checkAccess: vi.fn(),
  emitPublicPageRenderHook: vi.fn(),
  getAllColumnPosts: vi.fn(),
  getCurrentSiteMember: vi.fn(),
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
  default: vi.fn(),
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
});
