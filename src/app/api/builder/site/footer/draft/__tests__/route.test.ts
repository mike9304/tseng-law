import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { createBlankCanvasDocument } from '@/lib/builder/canvas/types';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import {
  ensureGlobalHeaderFooterIds,
  readFooterCanvas,
  readSiteDocument,
  writeFooterCanvas,
} from '@/lib/builder/site/persistence';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'u1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  ensureGlobalHeaderFooterIds: vi.fn(async () => undefined),
  readFooterCanvas: vi.fn(),
  readSiteDocument: vi.fn(),
  writeFooterCanvas: vi.fn(async () => undefined),
}));

const SELECTED_SITE_REFERER =
  'https://law.example.test/ko/admin-builder?siteId=workspace-site-b&pageId=home';

function request(method: string, body?: string, query = '', referer?: string): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (referer) headers.set('referer', referer);

  return new NextRequest(`https://law.example.test/api/builder/site/footer/draft${query}`, {
    method,
    headers,
    body,
  });
}

describe('/api/builder/site/footer/draft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'u1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    vi.mocked(readFooterCanvas).mockResolvedValue(createBlankCanvasDocument('ko'));
    vi.mocked(readSiteDocument).mockResolvedValue({
      pages: [],
      navigation: [],
    } as unknown as Awaited<ReturnType<typeof readSiteDocument>>);
  });

  it('returns the draft without changing the success shape', async () => {
    const route = await import('../route');
    const response = await route.GET(request('GET', undefined, '?locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.document.locale).toBe('ko');
  });

  it('routes GET to the selected workspace site from the admin-builder referer', async () => {
    const route = await import('../route');
    const response = await route.GET(
      request('GET', undefined, '?locale=ko', SELECTED_SITE_REFERER),
    );

    expect(response.status).toBe(200);
    expect(readFooterCanvas).toHaveBeenCalledWith('workspace-site-b');
  });

  it('saves the draft to the selected workspace site from the admin-builder referer', async () => {
    const document = createBlankCanvasDocument('ko');
    vi.mocked(readSiteDocument).mockResolvedValue(
      createDefaultSiteDocument('ko', 'workspace-site-b'),
    );

    const route = await import('../route');
    const response = await route.PUT(
      request(
        'PUT',
        JSON.stringify({ siteId: 'default', document }),
        '?locale=ko',
        SELECTED_SITE_REFERER,
      ),
    );

    expect(response.status).toBe(200);
    expect(writeFooterCanvas).toHaveBeenCalledWith(
      'workspace-site-b',
      expect.objectContaining({ locale: 'ko' }),
    );
    expect(ensureGlobalHeaderFooterIds).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(readSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
  });

  it('returns localized stable-code JSON when the draft is missing', async () => {
    vi.mocked(readFooterCanvas).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.GET(request('GET', undefined, '?locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toMatchObject({
      ok: false,
      error: '전역 푸터 초안을 찾을 수 없습니다.',
      errorCode: 'global_footer_draft_not_found',
    });
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
    expect(writeFooterCanvas).not.toHaveBeenCalled();
    expect(ensureGlobalHeaderFooterIds).not.toHaveBeenCalled();
  });
});
