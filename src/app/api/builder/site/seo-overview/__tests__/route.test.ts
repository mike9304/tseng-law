import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/seo-overview/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readPageCanvas: vi.fn(),
  readSiteDocument: vi.fn(),
}));

const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);

const SELECTED_SITE_REFERER =
  'https://law.example.test/ko/admin-builder?siteId=workspace-site-b&pageId=home';

describe('/api/builder/site/seo-overview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    mockedReadSiteDocument.mockResolvedValue(createDefaultSiteDocument('ko', 'default'));
    mockedReadPageCanvas.mockResolvedValue(null);
  });

  it('returns the SEO overview without changing the success shape', async () => {
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/seo-overview?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.overview).toBeDefined();
  });

  it('routes overview reads and draft canvas reads to the selected workspace site', async () => {
    mockedReadSiteDocument.mockResolvedValue(createDefaultSiteDocument('ko', 'workspace-site-b'));

    const response = await route.GET(new NextRequest(
      'https://law.example.test/api/builder/site/seo-overview?locale=ko',
      { headers: { referer: SELECTED_SITE_REFERER } },
    ));

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(mockedReadPageCanvas).toHaveBeenCalledWith('workspace-site-b', expect.any(String), 'draft');
  });

  it('returns localized stable-code JSON when overview loading fails', async () => {
    mockedReadSiteDocument.mockRejectedValueOnce(new Error('raw overview storage failure'));
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/seo-overview?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法載入 SEO 摘要。',
      errorCode: 'seo_overview_failed',
    });
    expect(data.error).not.toContain('raw overview storage failure');
  });
});
