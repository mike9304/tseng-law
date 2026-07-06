import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import { CUSTOM_CODE_MAX_LENGTH } from '@/lib/builder/site/custom-code';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/custom-code/route';

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

function patchRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/custom-code${query}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/site/custom-code', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderRead).mockReturnValue(null as unknown as ReturnType<typeof guardBuilderRead>);
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    site = createDefaultSiteDocument('ko', 'default');
    site.customCode = { siteHead: '<meta name="x" content="y">' };
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('returns custom code without changing the success shape', async () => {
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/custom-code?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      ok: true,
      customCode: { siteHead: '<meta name="x" content="y">' },
    });
  });

  it('returns localized stable-code JSON when loading fails', async () => {
    mockedReadSiteDocument.mockRejectedValueOnce(new Error('raw custom code load failure'));
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/custom-code?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法載入自訂程式碼。',
      errorCode: 'custom_code_load_failed',
    });
    expect(data.error).not.toContain('raw custom code load failure');
  });

  it('returns localized stable-code JSON for malformed saves', async () => {
    const response = await route.PATCH(patchRequest('{', '?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '사이트 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for oversized saves', async () => {
    const response = await route.PATCH(patchRequest(
      { siteHead: 'x'.repeat(CUSTOM_CODE_MAX_LENGTH + 1) },
      '?locale=en',
    ));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Custom code is too long.',
      errorCode: 'custom_code_too_long',
      maxLength: CUSTOM_CODE_MAX_LENGTH,
    });
    expect(data.warnings).toEqual([
      expect.objectContaining({ code: 'too_long', slot: 'siteHead' }),
    ]);
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when saving fails', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw custom code write failure'));
    const response = await route.PATCH(patchRequest({ siteBodyEnd: '<script>ok()</script>' }, '?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法儲存自訂程式碼。',
      errorCode: 'custom_code_save_failed',
    });
    expect(data.error).not.toContain('raw custom code write failure');
  });
});
