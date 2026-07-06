import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { seedSitePages } from '@/lib/builder/canvas/seed-pages';
import { guardMutation } from '@/lib/builder/security/guard';
import * as route from '@/app/api/builder/site/seed/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/canvas/seed-pages', () => ({
  seedSitePages: vi.fn(),
}));

const mockedSeedSitePages = vi.mocked(seedSitePages);

function postRequest(body: string | undefined, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/seed${query}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

describe('/api/builder/site/seed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    mockedSeedSitePages.mockResolvedValue(undefined);
  });

  it('returns localized stable-code JSON for malformed seed payloads', async () => {
    const response = await route.POST(postRequest('{', '?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '사이트 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(mockedSeedSitePages).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for non-object seed payloads', async () => {
    const response = await route.POST(postRequest('[]', '?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認初始化請求內容。',
      errorCode: 'seed_body_invalid',
    });
    expect(mockedSeedSitePages).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when seeding fails', async () => {
    mockedSeedSitePages.mockRejectedValueOnce(new Error('raw seed failure'));
    const response = await route.POST(postRequest(JSON.stringify({ locale: 'en' })));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to seed the site pages.',
      errorCode: 'seed_failed',
    });
    expect(data.error).not.toContain('raw seed failure');
  });
});
