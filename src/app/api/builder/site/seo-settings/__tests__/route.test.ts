import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/seo-settings/route';

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

function patchRequest(body: unknown, query = '', referer?: string): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (referer) headers.set('referer', referer);

  return new NextRequest(`https://law.example.test/api/builder/site/seo-settings${query}`, {
    method: 'PATCH',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/site/seo-settings', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    site = createDefaultSiteDocument('ko', 'default');
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('returns SEO settings without changing the success shape', async () => {
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/seo-settings?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.defaults).toBeDefined();
    expect(data.preview).toBeDefined();
  });

  it('routes settings GET to the selected workspace site from the editor referer', async () => {
    site = createDefaultSiteDocument('ko', 'workspace-site-b');
    mockedReadSiteDocument.mockResolvedValue(site);

    const response = await route.GET(new NextRequest(
      'https://law.example.test/api/builder/site/seo-settings?locale=ko',
      { headers: { referer: SELECTED_SITE_REFERER } },
    ));

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
  });

  it('returns localized stable-code JSON when settings loading fails', async () => {
    mockedReadSiteDocument.mockRejectedValueOnce(new Error('raw settings load failure'));
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/seo-settings?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to load the SEO settings.',
      errorCode: 'seo_settings_load_failed',
    });
    expect(data.error).not.toContain('raw settings load failure');
  });

  it('returns localized stable-code JSON for malformed settings saves', async () => {
    const response = await route.PATCH(patchRequest('{', '?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('saves settings to the selected workspace site from the editor referer', async () => {
    site = createDefaultSiteDocument('ko', 'workspace-site-b');
    mockedReadSiteDocument.mockResolvedValue(site);

    const response = await route.PATCH(patchRequest(
      { noIndex: true, robotsTxt: 'User-agent: *' },
      '?locale=ko',
      SELECTED_SITE_REFERER,
    ));

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(mockedWriteSiteDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        siteId: 'workspace-site-b',
        settings: expect.objectContaining({
          robotsTxt: 'User-agent: *',
        }),
      }),
    );
  });

  it('returns localized stable-code JSON when settings saving fails', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw settings write failure'));
    const response = await route.PATCH(patchRequest({ noIndex: true }, '?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'SEO 설정을 저장하지 못했습니다.',
      errorCode: 'seo_settings_save_failed',
    });
    expect(data.error).not.toContain('raw settings write failure');
  });
});
