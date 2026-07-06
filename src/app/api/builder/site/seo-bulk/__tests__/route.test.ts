import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { readPageCanvas, readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/seo-bulk/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readPageCanvas: vi.fn(),
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

const SELECTED_SITE_REFERER =
  'https://law.example.test/ko/admin-builder?siteId=workspace-site-b&pageId=home';

function patchRequest(body: unknown, query = '', referer?: string): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (referer) headers.set('referer', referer);

  return new NextRequest(`https://law.example.test/api/builder/site/seo-bulk${query}`, {
    method: 'PATCH',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/site/seo-bulk', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    site = createDefaultSiteDocument('ko', 'default');
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedReadPageCanvas.mockResolvedValue(null);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('applies bulk SEO updates to the selected workspace site from the editor referer', async () => {
    site = createDefaultSiteDocument('ko', 'workspace-site-b');
    mockedReadSiteDocument.mockResolvedValue(site);
    const pageIds = site.pages.map((page) => page.pageId).slice(0, 1);

    const response = await route.PATCH(patchRequest(
      { pageIds, setIndexable: false },
      '?locale=ko',
      SELECTED_SITE_REFERER,
    ));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.updated).toBe(1);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(mockedWriteSiteDocument).toHaveBeenCalledWith(
      expect.objectContaining({ siteId: 'workspace-site-b' }),
    );
    expect(mockedReadPageCanvas).toHaveBeenCalledWith('workspace-site-b', expect.any(String), 'draft');
  });

  it('returns localized stable-code JSON for malformed bulk payloads', async () => {
    const response = await route.PATCH(patchRequest('{', '?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '사이트 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(mockedReadSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for invalid bulk payloads', async () => {
    const response = await route.PATCH(patchRequest({ pageIds: [] }, '?locale=en'));
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

  it('returns localized stable-code JSON when the bulk update fails', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw bulk write failure'));
    const response = await route.PATCH(patchRequest(
      { pageIds: [site.pages[0]?.pageId], setIndexable: false },
      '?locale=ko',
    ));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'SEO 일괄 변경을 적용하지 못했습니다.',
      errorCode: 'seo_bulk_update_failed',
    });
    expect(data.error).not.toContain('raw bulk write failure');
  });
});
