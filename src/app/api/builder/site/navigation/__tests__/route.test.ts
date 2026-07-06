import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'u1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(async () => undefined),
}));

const SELECTED_SITE_REFERER =
  'https://law.example.test/ko/admin-builder?siteId=workspace-site-b&pageId=home';

function request(method: string, body?: string, query = '', referer?: string): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (referer) headers.set('referer', referer);

  return new NextRequest(`https://law.example.test/api/builder/site/navigation${query}`, {
    method,
    headers,
    body,
  });
}

describe('/api/builder/site/navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'u1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    vi.mocked(readSiteDocument).mockResolvedValue({
      siteId: 'default',
      locale: 'ko',
      pages: [],
      navigation: [{ id: 'home', label: { ko: '홈' }, href: '/ko' }],
      updatedAt: '2026-06-03T00:00:00Z',
    } as unknown as Awaited<ReturnType<typeof readSiteDocument>>);
  });

  it('returns navigation on GET without changing the success shape', async () => {
    const route = await import('../route');
    const response = await route.GET(request('GET', undefined, '?locale=ko'));
    const payload = await response.json();
    const navigation = payload.navigation as Array<{ id: string; children?: Array<{ id: string }> }>;

    expect(response.status).toBe(200);
    expect(navigation[0].id).toBe('home');
    expect(navigation.map((item) => item.id)).toEqual(expect.arrayContaining([
      'nav-services',
      'nav-columns',
    ]));
    expect(navigation.find((item) => item.id === 'nav-services')?.children?.map((item) => item.id)).toContain(
      'nav-services-investment',
    );
  });

  it('routes GET to the selected workspace site from the admin-builder referer', async () => {
    const route = await import('../route');
    const response = await route.GET(
      request('GET', undefined, '?locale=ko', SELECTED_SITE_REFERER),
    );

    expect(response.status).toBe(200);
    expect(readSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
  });

  it('saves navigation to the selected workspace site from the admin-builder referer', async () => {
    const selectedSite = createDefaultSiteDocument('ko', 'workspace-site-b');
    const nextNavigation = [
      { id: 'nav-about', label: '소개', pageId: 'about-page', href: '/ko/about' },
    ];
    vi.mocked(readSiteDocument).mockResolvedValue(selectedSite);

    const route = await import('../route');
    const response = await route.PUT(
      request(
        'PUT',
        JSON.stringify({ siteId: 'default', locale: 'ko', navigation: nextNavigation }),
        '',
        SELECTED_SITE_REFERER,
      ),
    );

    expect(response.status).toBe(200);
    expect(readSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(writeSiteDocument).toHaveBeenCalledWith(
      expect.objectContaining({ siteId: 'workspace-site-b', navigation: nextNavigation }),
      { preserveMissingNavigation: false },
    );
  });

  it('returns localized stable-code JSON for malformed PUT bodies', async () => {
    const route = await import('../route');
    const response = await route.PUT(request('PUT', '{', '?locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(writeSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when navigation is missing', async () => {
    const route = await import('../route');
    const response = await route.PUT(
      request('PUT', JSON.stringify({ locale: 'en', navigation: null })),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: 'A navigation item array is required.',
      errorCode: 'navigation_required',
    });
    expect(writeSiteDocument).not.toHaveBeenCalled();
  });
});
