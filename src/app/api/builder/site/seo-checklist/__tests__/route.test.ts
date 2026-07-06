import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/seo-checklist/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

const SELECTED_SITE_REFERER =
  'https://law.example.test/ko/admin-builder?siteId=workspace-site-b&pageId=home';

describe('/api/builder/site/seo-checklist', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
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
      settings: {
        seoChecklist: {
          businessName: '호정국제',
          keywords: ['국제 법률'],
          serviceMode: 'both',
        },
        localizedOverrides: {
          en: {
            seoChecklist: {
              businessName: 'Tseng Law',
              keywords: ['international law'],
              serviceMode: 'online',
            },
          },
        },
      },
      pages: [],
      createdAt: '2026-05-29T00:00:00.000Z',
      updatedAt: '2026-05-29T00:00:00.000Z',
    };
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('returns locale-resolved checklist settings on GET', async () => {
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/seo-checklist?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.checklist.businessName).toBe('Tseng Law');
    expect(data.checklist.keywords).toEqual(['international law']);
  });

  it('routes checklist GET to the selected workspace site from the editor referer', async () => {
    const response = await route.GET(new NextRequest(
      'https://law.example.test/api/builder/site/seo-checklist?locale=ko',
      { headers: { referer: SELECTED_SITE_REFERER } },
    ));

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
  });

  it('returns localized stable-code JSON when checklist loading fails', async () => {
    mockedReadSiteDocument.mockRejectedValueOnce(new Error('raw checklist load failure'));
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/seo-checklist?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法載入 SEO 檢查清單。',
      errorCode: 'seo_checklist_load_failed',
    });
    expect(data.error).not.toContain('raw checklist load failure');
  });

  it('persists locale-specific checklist overrides on PATCH', async () => {
    const response = await route.PATCH(new NextRequest('https://law.example.test/api/builder/site/seo-checklist?locale=en', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Tseng Law',
        keywords: ['international law', 'cross-border'],
        serviceMode: 'online',
      }),
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.checklist.businessName).toBe('Tseng Law');
    expect(site.settings?.seoChecklist?.businessName).toBe('호정국제');
    expect(site.settings?.localizedOverrides?.en?.seoChecklist?.businessName).toBe('Tseng Law');
    expect(site.settings?.localizedOverrides?.en?.seoChecklist?.keywords).toEqual(['international law', 'cross-border']);
    expect(site.settings?.localizedOverrides?.en?.seoChecklist?.serviceMode).toBe('online');
  });

  it('saves checklist settings to the selected workspace site from the editor referer', async () => {
    site = { ...site, siteId: 'workspace-site-b' };
    mockedReadSiteDocument.mockResolvedValue(site);

    const response = await route.PATCH(new NextRequest('https://law.example.test/api/builder/site/seo-checklist?locale=ko', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', referer: SELECTED_SITE_REFERER },
      body: JSON.stringify({
        businessName: 'Selected Site',
        keywords: ['selected'],
        serviceMode: 'both',
      }),
    }));

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(mockedWriteSiteDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        siteId: 'workspace-site-b',
        settings: expect.objectContaining({
          seoChecklist: expect.objectContaining({ businessName: 'Selected Site' }),
        }),
      }),
    );
  });

  it('returns localized stable-code JSON for malformed checklist saves', async () => {
    const response = await route.PATCH(new NextRequest('https://law.example.test/api/builder/site/seo-checklist?locale=ko', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: '{',
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '사이트 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when checklist saving fails', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw checklist write failure'));
    const response = await route.PATCH(new NextRequest('https://law.example.test/api/builder/site/seo-checklist?locale=en', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ businessName: 'Tseng Law' }),
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to save the SEO checklist.',
      errorCode: 'seo_checklist_save_failed',
    });
    expect(data.error).not.toContain('raw checklist write failure');
  });
});
