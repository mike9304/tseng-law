import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/services/[slug]/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin-1', user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('/api/builder/services/[slug]', () => {
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
          pageId: 'page-services',
          slug: 'practice-areas',
          title: { ko: 'Practice areas', en: 'Practice areas', 'zh-hant': 'Practice areas' },
          locale: 'ko',
          dynamicItem: {
            kind: 'collection-item-v1',
            collectionId: 'service-areas',
            targetId: 'home.services.list',
            slugField: 'slug',
            defaultRecordSlug: 'civil',
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

  it('returns slug redirect acknowledgement for service source slug changes', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/services/civil?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug: 'civil litigation',
          subtitle: { en: 'Updated civil services' },
        }),
      }),
      { params: Promise.resolve({ slug: 'civil' }) },
    );
    const data = await response.json() as {
      ok?: boolean;
      record?: { slug?: string };
      slugRedirect?: {
        status?: string;
        redirects?: Array<{ from?: string; to?: string }>;
      } | null;
    };

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.record?.slug).toBe('civil-litigation');
    expect(data.slugRedirect?.status).toBe('created');
    expect(data.slugRedirect?.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/services/civil',
        to: '/ko/services/civil-litigation',
      }),
      expect.objectContaining({
        from: '/ko/practice-areas/civil',
        to: '/ko/practice-areas/civil-litigation',
      }),
    ]));
    expect(site.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/services/civil',
        to: '/ko/services/civil-litigation',
      }),
      expect.objectContaining({
        from: '/ko/practice-areas/civil',
        to: '/ko/practice-areas/civil-litigation',
      }),
    ]));
  });

  it('returns localized not-found errors', async () => {
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/services/unknown?locale=zh-hant'),
      { params: Promise.resolve({ slug: 'unknown' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      ok: false,
      error: '找不到服務領域。',
      errorCode: 'service_area_not_found',
    });
  });

  it('returns localized invalid JSON errors without raw parser details', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/services/civil?locale=en', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: '{',
      }),
      { params: Promise.resolve({ slug: 'civil' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: 'Check the service area request format.',
      errorCode: 'invalid_json',
    });
    expect(JSON.stringify(data)).not.toContain('Unexpected');
  });

  it('returns localized validation errors without raw Zod issues', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/services/civil?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: '' }),
      }),
      { params: Promise.resolve({ slug: 'civil' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '서비스 영역 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(data).not.toHaveProperty('issues');
  });

  it('returns localized conflict errors without raw source issues', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/services/civil?locale=zh-hant', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: 'investment' }),
      }),
      { params: Promise.resolve({ slug: 'civil' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({
      ok: false,
      error: '服務領域設定與其他項目衝突。',
      errorCode: 'service_area_conflict',
    });
    expect(JSON.stringify(data)).not.toContain('already used by investment');
  });

  it('returns slug redirect acknowledgement when resetting service source overrides', async () => {
    const seededResponse = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/services/civil?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug: 'civil litigation',
        }),
      }),
      { params: Promise.resolve({ slug: 'civil' }) },
    );
    expect(seededResponse.status).toBe(200);

    const resetResponse = await route.DELETE(
      new NextRequest('https://law.example.test/api/builder/services/civil-litigation?locale=ko', {
        method: 'DELETE',
      }),
      { params: Promise.resolve({ slug: 'civil-litigation' }) },
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
    expect(resetData.record?.slug).toBe('civil');
    expect(resetData.slugRedirect?.status).toBe('created');
    expect(resetData.slugRedirect?.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/services/civil-litigation',
        to: '/ko/services/civil',
      }),
      expect.objectContaining({
        from: '/ko/practice-areas/civil-litigation',
        to: '/ko/practice-areas/civil',
      }),
    ]));
    expect(site.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/services/civil-litigation',
        to: '/ko/services/civil',
      }),
      expect.objectContaining({
        from: '/ko/practice-areas/civil-litigation',
        to: '/ko/practice-areas/civil',
      }),
    ]));
  });

  it('returns localized reset failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('service reset secret leaked'));

    const response = await route.DELETE(
      new NextRequest('https://law.example.test/api/builder/services/civil?locale=en', {
        method: 'DELETE',
      }),
      { params: Promise.resolve({ slug: 'civil' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to reset the service area.',
      errorCode: 'service_area_reset_failed',
    });
    expect(JSON.stringify(data)).not.toContain('service reset secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder-services] reset failed', expect.any(Error));
    consoleError.mockRestore();
  });
});
