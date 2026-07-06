import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { DEFAULT_THEME, createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import * as route from '@/app/api/builder/site/brand-kit/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('brand kit route', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    site = createDefaultSiteDocument('ko', 'default');
    site.theme = DEFAULT_THEME;
    site.settings = {
      firmName: '호정국제',
      logo: '/logo-ko.png',
      favicon: '/favicon.ico',
      localizedOverrides: {
        en: {
          firmName: 'Tseng Law',
        },
      },
    };
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('returns locale-resolved site name in the brand kit metadata', async () => {
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/brand-kit?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.brandKit.metadata.siteName).toBe('Tseng Law');
    expect(data.brandKit.logoLight).toBe('/logo-ko.png');
  });

  it('returns localized stable-code JSON when the brand kit fails to load', async () => {
    mockedReadSiteDocument.mockRejectedValueOnce(new Error('raw brand kit storage failure'));
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/brand-kit?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法載入品牌套件。',
      errorCode: 'brand_kit_load_failed',
    });
    expect(data.error).not.toContain('raw brand kit storage failure');
  });

  it('uses locale-resolved settings as the fallback brand kit metadata on save', async () => {
    const response = await route.POST(new NextRequest('https://law.example.test/api/builder/site/brand-kit?locale=en', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        brandKit: {
          colors: {
            primary: '#111111',
            secondary: '#222222',
            accent: '#333333',
            background: '#ffffff',
            text: '#000000',
          },
          fonts: { title: 'Inter', body: 'Inter' },
          radiusScale: 8,
        },
      }),
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.brandKit.metadata.siteName).toBe('Tseng Law');
    expect(data.settings.firmName).toBe('호정국제');
    expect(mockedWriteSiteDocument).toHaveBeenCalled();
  });

  it('persists brand kit custom colors under settings.brand on save and returns them', async () => {
    const response = await route.POST(new NextRequest('https://law.example.test/api/builder/site/brand-kit?locale=ko', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        brandKit: {
          colors: {
            primary: '#111111',
            secondary: '#222222',
            accent: '#333333',
            background: '#ffffff',
            text: '#000000',
          },
          fonts: { title: 'Inter', body: 'Inter' },
          radiusScale: 8,
          customColors: [
            { name: 'Accent Red', color: '#FF0000' },
            { name: 'Bad', color: 'not-a-color' },
          ],
        },
      }),
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    // Invalid color dropped + hex lowercased during persistence.
    expect(data.settings.brand.customColors).toEqual([
      { name: 'Accent Red', color: '#ff0000' },
    ]);
    expect(data.brandKit.customColors).toEqual([
      { name: 'Accent Red', color: '#ff0000' },
    ]);
    expect(mockedWriteSiteDocument).toHaveBeenCalled();
  });

  it('clears persisted brand custom colors when the kit no longer has any', async () => {
    // Seed persisted custom colors.
    site.settings = { ...(site.settings ?? {}), brand: { customColors: [{ name: 'Old', color: '#ff0000' }] } };
    mockedReadSiteDocument.mockResolvedValue(site);

    const response = await route.POST(new NextRequest('https://law.example.test/api/builder/site/brand-kit?locale=ko', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        brandKit: {
          colors: {
            primary: '#111111',
            secondary: '#222222',
            accent: '#333333',
            background: '#ffffff',
            text: '#000000',
          },
          fonts: { title: 'Inter', body: 'Inter' },
          radiusScale: 8,
          customColors: [],
        },
      }),
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.brandKit.customColors).toBeUndefined();
    expect(data.settings.brand).toBeUndefined();
  });

  it('returns localized stable-code JSON for malformed save payloads', async () => {
    const response = await route.POST(new NextRequest('https://law.example.test/api/builder/site/brand-kit?locale=ko', {
      method: 'POST',
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

  it('returns localized stable-code JSON for invalid brand asset paths', async () => {
    const response = await route.POST(new NextRequest('https://law.example.test/api/builder/site/brand-kit?locale=en', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        brandKit: {
          assets: {
            logoLightAssetId: 'https://example.test/logo.png',
          },
        },
      }),
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the brand asset path.',
      errorCode: 'invalid_brand_asset_id',
      issues: ['assets.logoLightAssetId'],
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when the brand kit save fails', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw write failure'));
    const response = await route.POST(new NextRequest('https://law.example.test/api/builder/site/brand-kit?locale=zh-hant', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        brandKit: {
          colors: {
            primary: '#111111',
            secondary: '#222222',
            accent: '#333333',
            background: '#ffffff',
            text: '#000000',
          },
          fonts: { title: 'Inter', body: 'Inter' },
          radiusScale: 8,
        },
      }),
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法儲存品牌套件。',
      errorCode: 'brand_kit_save_failed',
    });
    expect(data.error).not.toContain('raw write failure');
  });
});
