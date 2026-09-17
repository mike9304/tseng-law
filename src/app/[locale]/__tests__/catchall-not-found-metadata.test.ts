import type { Metadata } from 'next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MainSiteCatchAllPage, { generateMetadata } from '../[[...slug]]/page';

const resolvers = vi.hoisted(() => ({
  publishedMetadata: vi.fn(),
  publishedPage: vi.fn(),
  legacyMetadata: vi.fn(),
  legacyPage: vi.fn(),
}));

vi.mock('@/lib/builder/site/public-page', () => ({
  buildPublishedSitePageMetadata: resolvers.publishedMetadata,
  resolvePublishedSitePage: resolvers.publishedPage,
  PublishedSitePageView: () => null,
}));
vi.mock('@/app/[locale]/(legacy)', () => ({
  getLegacyPageMetadata: resolvers.legacyMetadata,
  renderLegacyPage: resolvers.legacyPage,
}));
vi.mock('@/lib/builder/apps/lifecycle-emitters', () => ({ emitPublicPageRenderHook: vi.fn() }));
vi.mock('@/lib/builder/members/current-member', () => ({ getCurrentSiteMember: vi.fn() }));
vi.mock('@/lib/builder/members/members-engine', () => ({ checkAccess: vi.fn() }));
vi.mock('next/navigation', () => ({
  notFound: () => { throw new Error('NEXT_NOT_FOUND'); },
  redirect: () => { throw new Error('NEXT_REDIRECT'); },
}));

beforeEach(() => {
  vi.clearAllMocks();
  resolvers.publishedMetadata.mockResolvedValue(null);
  resolvers.publishedPage.mockResolvedValue(null);
  resolvers.legacyMetadata.mockReturnValue(null);
  resolvers.legacyPage.mockResolvedValue(null);
});

describe('catchall missing-page metadata', () => {
  it.each([
    ['ko', '페이지를 찾을 수 없습니다 | 법무법인 호정'],
    ['en', 'Page not found | Hovering International Law Firm'],
    ['ja', 'ページが見つかりません | 昊鼎国際法律事務所'],
    ['zh-hant', '找不到頁面 | 昊鼎國際法律事務所'],
  ] as const)('localizes the real %s catchall metadata and retains its not-found response', async (locale, title) => {
    const props = { params: Promise.resolve({ locale, slug: ['design-review-missing-page'] }) };
    const metadata = await generateMetadata(props);

    expect(metadata.title).toEqual({ absolute: title });
    expect(metadata.robots).toEqual({ index: false, follow: false });
    await expect(MainSiteCatchAllPage(props)).rejects.toThrow('NEXT_NOT_FOUND');
    if (locale === 'ja') {
      expect(resolvers.publishedMetadata).not.toHaveBeenCalled();
      expect(resolvers.publishedPage).not.toHaveBeenCalled();
    }
  });

  it.each(['ko', 'en', 'ja', 'zh-hant'] as const)('preserves valid %s legacy page metadata', async (locale) => {
    const validMetadata: Metadata = {
      title: 'Existing valid page title',
      description: 'Existing valid description',
      robots: { index: true, follow: true },
      alternates: { canonical: `/${locale}/about` },
    };
    resolvers.legacyMetadata.mockReturnValue(validMetadata);
    const metadata = await generateMetadata({ params: Promise.resolve({ locale, slug: ['about'] }) });

    expect(metadata).toBe(validMetadata);
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it.each([
    ['ko', 'ko_KR'], ['en', 'en_US'], ['zh-hant', 'zh_TW'],
  ] as const)('preserves published %s metadata and its existing Open Graph locale behavior', async (locale, ogLocale) => {
    const validMetadata: Metadata = {
      title: 'Published title',
      description: 'Published description',
      robots: { index: true, follow: true },
      openGraph: { title: 'Published social title' },
    };
    resolvers.publishedMetadata.mockResolvedValue(validMetadata);
    const metadata = await generateMetadata({ params: Promise.resolve({ locale, slug: ['public-page'] }) });

    expect(metadata.title).toBe(validMetadata.title);
    expect(metadata.description).toBe(validMetadata.description);
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.openGraph).toEqual({ title: 'Published social title', locale: ogLocale });
    expect(resolvers.legacyMetadata).not.toHaveBeenCalled();
  });
});
