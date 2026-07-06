import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/settings/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => null),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('/api/builder/site/settings', () => {
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
        firmName: '호정국제',
        phone: '02-1234-5678',
        localizedOverrides: {
          en: {
            firmName: 'Tseng Law',
            phone: '02-9999-0000',
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

  it('returns locale-resolved settings and mobile bottom bar defaults on GET', async () => {
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/settings?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.settings.firmName).toBe('Tseng Law');
    expect(data.mobileBottomBar.actions[0].href).toBe('tel:0299990000');
  });

  it('returns localized stable-code JSON when settings loading fails', async () => {
    mockedReadSiteDocument.mockRejectedValueOnce(new Error('raw settings load failure'));
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/settings?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法載入網站設定。',
      errorCode: 'site_settings_load_failed',
    });
    expect(data.error).not.toContain('raw settings load failure');
  });

  it('persists locale-specific overrides on PUT without overwriting the source locale', async () => {
    const response = await route.PUT(new NextRequest('https://law.example.test/api/builder/site/settings?locale=en', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        settings: {
          firmName: 'Tseng Law',
          phone: '02-9999-0000',
        },
      }),
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.settings.firmName).toBe('Tseng Law');
    expect(data.mobileBottomBar.actions[0].href).toBe('tel:0299990000');
    expect(site.settings?.firmName).toBe('호정국제');
    expect(site.settings?.localizedOverrides?.en?.firmName).toBe('Tseng Law');
    expect(site.settings?.localizedOverrides?.en?.phone).toBe('02-9999-0000');
  });

  it('persists brand custom colors on PUT (source locale) and clears them when empty', async () => {
    const saveResponse = await route.PUT(new NextRequest('https://law.example.test/api/builder/site/settings?locale=ko', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        settings: {
          brand: {
            customColors: [
              { name: 'Accent Red', color: '#FF0000' },
              { name: 'Deep Blue', color: '#1d4ed8' },
            ],
          },
        },
      }),
    }));
    const saved = await saveResponse.json();

    expect(saveResponse.status).toBe(200);
    // Hex values are lowercased during merge sanitization.
    expect(saved.settings.brand.customColors).toEqual([
      { name: 'Accent Red', color: '#ff0000' },
      { name: 'Deep Blue', color: '#1d4ed8' },
    ]);
    expect(site.settings?.brand?.customColors).toEqual([
      { name: 'Accent Red', color: '#ff0000' },
      { name: 'Deep Blue', color: '#1d4ed8' },
    ]);

    // Clearing the palette removes the brand section entirely.
    const clearResponse = await route.PUT(new NextRequest('https://law.example.test/api/builder/site/settings?locale=ko', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        settings: {
          brand: { customColors: [] },
        },
      }),
    }));
    await clearResponse.json();

    expect(site.settings?.brand).toBeUndefined();
  });

  it('rejects brand custom colors with invalid hex on PUT (strict schema)', async () => {
    const response = await route.PUT(new NextRequest('https://law.example.test/api/builder/site/settings?locale=ko', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        settings: {
          brand: {
            customColors: [{ name: 'Bad', color: 'nope' }],
          },
        },
      }),
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({ ok: false, errorCode: 'validation_error' });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for malformed settings saves', async () => {
    const response = await route.PUT(new NextRequest('https://law.example.test/api/builder/site/settings?locale=ko', {
      method: 'PUT',
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

  it('returns localized stable-code JSON for invalid settings saves', async () => {
    const response = await route.PUT(new NextRequest('https://law.example.test/api/builder/site/settings?locale=en', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        theme: {
          colors: {
            primary: '#123b63',
          },
        },
      }),
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the site request.',
      errorCode: 'validation_error',
    });
    expect(data.issues).toBeDefined();
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when settings saving fails', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw settings write failure'));
    const response = await route.PUT(new NextRequest('https://law.example.test/api/builder/site/settings?locale=zh-hant', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        settings: {
          firmName: '曾氏法律',
        },
      }),
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法儲存網站設定。',
      errorCode: 'site_settings_save_failed',
    });
    expect(data.error).not.toContain('raw settings write failure');
  });
});
