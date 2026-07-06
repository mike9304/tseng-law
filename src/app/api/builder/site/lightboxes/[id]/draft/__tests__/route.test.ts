import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  readLightboxCanvas,
  writeLightboxCanvas,
} from '@/lib/builder/site/persistence';
import { createDefaultCanvasDocument } from '@/lib/builder/canvas/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'u1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readLightboxCanvas: vi.fn(),
  writeLightboxCanvas: vi.fn(async () => undefined),
}));

const SELECTED_SITE_REFERER =
  'https://law.example.test/ko/admin-builder?siteId=workspace-lightbox-draft&pageId=home';

function request(method: string, body?: string, locale = 'ko', referer?: string): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/lightboxes/lb-1/draft?locale=${locale}`, {
    method,
    headers: referer
      ? { 'content-type': 'application/json', referer }
      : { 'content-type': 'application/json' },
    body,
  });
}

describe('/api/builder/site/lightboxes/[id]/draft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      username: 'u1',
      permission: 'edit-pages',
    });
    vi.mocked(readLightboxCanvas).mockResolvedValue(null);
  });

  it('returns localized stable-code JSON when the draft is missing', async () => {
    const route = await import('../route');
    const response = await route.GET(request('GET', undefined, 'zh-hant'), {
      params: { id: 'lb-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toMatchObject({
      ok: false,
      error: '找不到燈箱草稿。',
      errorCode: 'lightbox_draft_not_found',
    });
  });

  it('returns localized stable-code JSON for malformed draft PUT bodies', async () => {
    const route = await import('../route');
    const response = await route.PUT(request('PUT', '{', 'en'), {
      params: { id: 'lb-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: 'Check the site request format.',
      errorCode: 'invalid_json',
    });
    expect(writeLightboxCanvas).not.toHaveBeenCalled();
  });

  it('routes lightbox draft GET to the selected workspace site from the editor referer', async () => {
    vi.mocked(readLightboxCanvas).mockResolvedValue(createDefaultCanvasDocument('ko'));
    const route = await import('../route');
    const response = await route.GET(request('GET', undefined, 'ko', SELECTED_SITE_REFERER), {
      params: { id: 'lb-1' },
    });

    expect(response.status).toBe(200);
    expect(readLightboxCanvas).toHaveBeenCalledWith('workspace-lightbox-draft', 'lb-1');
  });

  it('routes lightbox draft PUT to the selected workspace site from the editor referer', async () => {
    const route = await import('../route');
    const document = createDefaultCanvasDocument('ko');
    const response = await route.PUT(
      request(
        'PUT',
        JSON.stringify({ document }),
        'ko',
        SELECTED_SITE_REFERER,
      ),
      { params: { id: 'lb-1' } },
    );

    expect(response.status).toBe(200);
    expect(writeLightboxCanvas).toHaveBeenCalledWith(
      'workspace-lightbox-draft',
      'lb-1',
      expect.any(Object),
    );
  });
});
