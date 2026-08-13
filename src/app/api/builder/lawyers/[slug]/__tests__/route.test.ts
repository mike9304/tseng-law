import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/lawyers/[slug]/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin-1', user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('/api/builder/lawyers/[slug]', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    const now = new Date('2026-05-30T00:00:00.000Z').toISOString();
    site = {
      version: 1,
      siteId: 'default',
      name: '호정국제',
      locale: 'ko',
      navigation: [],
      theme: {
        colors: {
          primary: '#123b63',
          secondary: '#1e5a96',
          accent: '#e8a838',
          background: '#ffffff',
          text: '#1f2937',
          muted: '#f3f4f6',
        },
        fonts: { heading: 'system-ui', body: 'system-ui' },
        radii: { sm: 2, md: 8, lg: 12 },
      },
      pages: [
        {
          pageId: 'page-lawyers',
          slug: 'team',
          title: { ko: 'Team', en: 'Team', 'zh-hant': 'Team' },
          locale: 'ko',
          dynamicItem: {
            kind: 'collection-item-v1',
            collectionId: 'attorney-profiles',
            targetId: 'home.attorney.profile',
            slugField: 'slug',
            defaultRecordSlug: 'wei-tseng',
            createdAt: now,
          },
          createdAt: now,
          updatedAt: now,
        } satisfies BuilderPageMeta,
      ],
      cmsCollections: [],
      redirects: [],
      createdAt: now,
      updatedAt: now,
    };
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('returns slug redirect acknowledgement for lawyer source slug changes', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/lawyers/wei-tseng?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug: 'wei tseng profile',
          localized: {
            ko: {
              role: '테스트 역할',
              languages: ['한국어', '영어'],
              practiceAreas: ['대만 투자', '상표 출원'],
              internalLinks: [{ label: '상담 문의', href: '/ko/contact' }],
            },
          },
          email: 'test@example.com',
          image: '/images/team/test-profile.png',
          imageAltText: '테스트 변호사 프로필 사진',
          imageFocalPoint: { x: 0.18, y: 0.66 },
        }),
      }),
      { params: Promise.resolve({ slug: 'wei-tseng' }) },
    );
    const data = await response.json() as {
      ok?: boolean;
      record?: {
        slug?: string;
        image?: string;
        imageAltText?: string;
        imageFocalPoint?: { x?: number; y?: number };
        languages?: string[];
        practiceAreas?: string[];
        internalLinks?: Array<{ label?: string; href?: string }>;
      };
      slugRedirect?: {
        status?: string;
        redirects?: Array<{ from?: string; to?: string }>;
      } | null;
    };

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.record?.slug).toBe('wei-tseng-profile');
    expect(data.record?.image).toBe('/images/team/test-profile.png');
    expect(data.record?.imageAltText).toBe('테스트 변호사 프로필 사진');
    expect(data.record?.imageFocalPoint).toEqual({ x: 0.18, y: 0.66 });
    expect(data.record?.languages).toEqual(['한국어', '영어']);
    expect(data.record?.practiceAreas).toEqual(['대만 투자', '상표 출원']);
    expect(data.record?.internalLinks).toEqual([{ label: '상담 문의', href: '/ko/contact' }]);
    expect(data.slugRedirect?.status).toBe('created');
    expect(data.slugRedirect?.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/lawyers/wei-tseng',
        to: '/ko/lawyers/wei-tseng-profile',
      }),
      expect.objectContaining({
        from: '/ko/team/wei-tseng',
        to: '/ko/team/wei-tseng-profile',
      }),
    ]));
    expect(site.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/lawyers/wei-tseng',
        to: '/ko/lawyers/wei-tseng-profile',
      }),
      expect.objectContaining({
        from: '/ko/team/wei-tseng',
        to: '/ko/team/wei-tseng-profile',
      }),
    ]));
  });

  it('returns slug redirect acknowledgement when resetting lawyer source overrides', async () => {
    const seededResponse = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/lawyers/wei-tseng?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug: 'wei tseng profile',
        }),
      }),
      { params: Promise.resolve({ slug: 'wei-tseng' }) },
    );
    expect(seededResponse.status).toBe(200);

    const resetResponse = await route.DELETE(
      new NextRequest('https://law.example.test/api/builder/lawyers/wei-tseng-profile?locale=ko', {
        method: 'DELETE',
      }),
      { params: Promise.resolve({ slug: 'wei-tseng-profile' }) },
    );
    const resetData = await resetResponse.json() as {
      ok?: boolean;
      record?: { slug?: string };
      slugRedirect?: {
        status?: string;
        redirects?: Array<{ from?: string; to?: string }>;
      } | null;
    };

    expect(resetResponse.status).toBe(200);
    expect(resetData.ok).toBe(true);
    expect(resetData.record?.slug).toBe('wei-tseng');
    expect(resetData.slugRedirect?.status).toBe('created');
    expect(resetData.slugRedirect?.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/lawyers/wei-tseng-profile',
        to: '/ko/lawyers/wei-tseng',
      }),
      expect.objectContaining({
        from: '/ko/team/wei-tseng-profile',
        to: '/ko/team/wei-tseng',
      }),
    ]));
    expect(site.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/lawyers/wei-tseng-profile',
        to: '/ko/lawyers/wei-tseng',
      }),
      expect.objectContaining({
        from: '/ko/team/wei-tseng-profile',
        to: '/ko/team/wei-tseng',
      }),
    ]));
  });
});
