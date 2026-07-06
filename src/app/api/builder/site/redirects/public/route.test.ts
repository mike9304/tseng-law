import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listRedirects } from '@/lib/builder/site/redirects';
import type { SiteRedirect } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/redirects/public/route';

vi.mock('@/lib/builder/site/redirects', () => ({
  listRedirects: vi.fn(),
}));

const mockedListRedirects = vi.mocked(listRedirects);

const activeRedirect: SiteRedirect = {
  redirectId: 'redir-active',
  from: '/ko/old',
  to: '/ko/new',
  type: 301,
  isActive: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
  note: 'internal note',
};

const inactiveRedirect: SiteRedirect = {
  ...activeRedirect,
  redirectId: 'redir-inactive',
  from: '/ko/inactive',
  isActive: false,
};

describe('/api/builder/site/redirects/public', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedListRedirects.mockResolvedValue([activeRedirect, inactiveRedirect]);
  });

  it('returns localized stable-code JSON outside local origins', async () => {
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/redirects/public?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: '找不到重新導向清單。',
      errorCode: 'redirects_public_unavailable',
    });
    expect(mockedListRedirects).not.toHaveBeenCalled();
  });

  it('returns only active local redirects without note metadata', async () => {
    const response = await route.GET(new NextRequest('http://localhost:3000/api/builder/site/redirects/public?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.redirects).toEqual([
      {
        redirectId: 'redir-active',
        from: '/ko/old',
        to: '/ko/new',
        type: 301,
        isActive: true,
        updatedAt: '2026-06-03T00:00:00.000Z',
      },
    ]);
  });

  it('returns localized stable-code JSON when local redirect loading fails', async () => {
    mockedListRedirects.mockRejectedValueOnce(new Error('raw public redirect load failure'));
    const response = await route.GET(new NextRequest('http://127.0.0.1:3000/api/builder/site/redirects/public?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to load the redirect list.',
      errorCode: 'redirects_load_failed',
    });
    expect(data.error).not.toContain('raw public redirect load failure');
  });
});
