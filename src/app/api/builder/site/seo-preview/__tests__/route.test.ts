import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/seo-preview/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);

const SELECTED_SITE_REFERER =
  'https://law.example.test/ko/admin-builder?siteId=workspace-site-b&pageId=home';

function postRequest(body: unknown, query = '', referer?: string): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (referer) headers.set('referer', referer);

  return new NextRequest(`https://law.example.test/api/builder/site/seo-preview${query}`, {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/site/seo-preview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    mockedReadSiteDocument.mockResolvedValue(createDefaultSiteDocument('ko', 'default'));
  });

  it('routes preview generation to the selected workspace site from the editor referer', async () => {
    mockedReadSiteDocument.mockResolvedValue(createDefaultSiteDocument('ko', 'workspace-site-b'));

    const response = await route.POST(postRequest(
      { defaults: { noIndex: true } },
      '?locale=ko',
      SELECTED_SITE_REFERER,
    ));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
  });

  it('returns localized stable-code JSON for malformed preview payloads', async () => {
    const response = await route.POST(postRequest('{', '?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(mockedReadSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for invalid preview payloads', async () => {
    const response = await route.POST(postRequest({ defaults: { twitterCard: 'large' } }, '?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the site request.',
      errorCode: 'validation_error',
    });
    expect(data.issues).toBeDefined();
    expect(mockedReadSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when preview generation fails', async () => {
    mockedReadSiteDocument.mockRejectedValueOnce(new Error('raw preview failure'));
    const response = await route.POST(postRequest({ defaults: { noIndex: true } }, '?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'SEO 미리보기를 만들지 못했습니다.',
      errorCode: 'seo_preview_failed',
    });
    expect(data.error).not.toContain('raw preview failure');
  });
});
