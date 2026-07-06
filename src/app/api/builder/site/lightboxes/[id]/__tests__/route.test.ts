import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { deleteLightbox, updateLightbox } from '@/lib/builder/site/persistence';
import type { BuilderLightbox } from '@/lib/builder/site/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'u1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  deleteLightbox: vi.fn(),
  updateLightbox: vi.fn(),
}));

function makeLightbox(overrides: Partial<BuilderLightbox> = {}): BuilderLightbox {
  return {
    id: 'lb-1',
    slug: 'promo',
    name: 'Promo',
    locale: 'ko',
    sizeMode: 'auto',
    closeOnOutsideClick: true,
    closeOnEsc: true,
    dismissable: true,
    backdropOpacity: 60,
    createdAt: '2026-06-03T00:00:00Z',
    updatedAt: '2026-06-03T00:00:00Z',
    ...overrides,
  };
}

const SELECTED_SITE_REFERER =
  'https://law.example.test/ko/admin-builder?siteId=workspace-lightbox-detail&pageId=home';

function patchRequest(body: unknown, locale = 'ko', referer?: string): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/lightboxes/lb-1?locale=${locale}`, {
    method: 'PATCH',
    headers: referer
      ? { 'content-type': 'application/json', referer }
      : { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function deleteRequest(locale = 'ko', referer?: string): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/lightboxes/lb-1?locale=${locale}`, {
    method: 'DELETE',
    headers: referer ? { referer } : undefined,
  });
}

describe('/api/builder/site/lightboxes/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      username: 'u1',
      permission: 'edit-pages',
    });
    vi.mocked(updateLightbox).mockResolvedValue(makeLightbox({ name: 'Renamed' }));
    vi.mocked(deleteLightbox).mockResolvedValue(true);
  });

  it('updates a lightbox on valid PATCH', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ name: 'Renamed' }), {
      params: { id: 'lb-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.lightbox.name).toBe('Renamed');
  });

  it('returns localized stable-code JSON for invalid PATCH payloads', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ slug: 'Bad Slug' }, 'zh-hant'), {
      params: { id: 'lb-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認網站請求。',
      errorCode: 'validation_error',
    });
    expect(updateLightbox).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when PATCH target is missing', async () => {
    vi.mocked(updateLightbox).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ name: 'Missing' }, 'en'), {
      params: { id: 'missing' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toMatchObject({
      ok: false,
      error: 'Lightbox not found.',
      errorCode: 'lightbox_not_found',
    });
  });

  it('returns localized stable-code JSON when DELETE target is missing', async () => {
    vi.mocked(deleteLightbox).mockResolvedValue(false);
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('zh-hant'), {
      params: { id: 'missing' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.errorCode).toBe('lightbox_not_found');
  });

  it('routes lightbox PATCH to the selected workspace site from the editor referer', async () => {
    const route = await import('../route');
    const response = await route.PATCH(
      patchRequest({ name: 'Workspace Lightbox' }, 'ko', SELECTED_SITE_REFERER),
      { params: { id: 'lb-1' } },
    );

    expect(response.status).toBe(200);
    expect(updateLightbox).toHaveBeenCalledWith(
      'workspace-lightbox-detail',
      'ko',
      'lb-1',
      { name: 'Workspace Lightbox' },
    );
  });

  it('routes lightbox DELETE to the selected workspace site from the editor referer', async () => {
    const route = await import('../route');
    const response = await route.DELETE(deleteRequest('ko', SELECTED_SITE_REFERER), {
      params: { id: 'lb-1' },
    });

    expect(response.status).toBe(200);
    expect(deleteLightbox).toHaveBeenCalledWith('workspace-lightbox-detail', 'ko', 'lb-1');
  });
});
