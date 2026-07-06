import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createLightbox,
  listLightboxes,
  writeLightboxCanvas,
} from '@/lib/builder/site/persistence';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import type { BuilderLightbox } from '@/lib/builder/site/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'u1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  createLightbox: vi.fn(),
  listLightboxes: vi.fn(),
  writeLightboxCanvas: vi.fn(async () => undefined),
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

function postRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/lightboxes${query}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const SELECTED_SITE_REFERER =
  'https://law.example.test/ko/admin-builder?siteId=workspace-lightbox-list&pageId=home';

function selectedGetRequest(): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/lightboxes?locale=ko', {
    headers: { referer: SELECTED_SITE_REFERER },
  });
}

function selectedPostRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/lightboxes?locale=ko', {
    method: 'POST',
    headers: { 'content-type': 'application/json', referer: SELECTED_SITE_REFERER },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/site/lightboxes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      username: 'u1',
      permission: 'edit-pages',
    });
    vi.mocked(listLightboxes).mockResolvedValue([]);
    vi.mocked(createLightbox).mockResolvedValue(makeLightbox());
  });

  it('returns localized stable-code JSON for malformed create bodies', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest('{', '?locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(createLightbox).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for invalid slugs', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ slug: 'Bad Slug', name: 'Bad', locale: 'en' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      errorCode: 'invalid_lightbox_slug',
    });
    expect(createLightbox).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for slug conflicts', async () => {
    vi.mocked(listLightboxes).mockResolvedValue([makeLightbox({ slug: 'promo' })]);
    const route = await import('../route');
    const response = await route.POST(postRequest({ slug: 'promo', name: 'Promo', locale: 'zh-hant' }));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toMatchObject({
      ok: false,
      error: '已有使用相同網址的燈箱。',
      errorCode: 'lightbox_slug_conflict',
    });
    expect(createLightbox).not.toHaveBeenCalled();
  });

  it('creates a lightbox and seeds a blank canvas on valid POST', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ slug: 'promo', name: 'Promo', locale: 'ko' }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.lightbox.slug).toBe('promo');
    expect(createLightbox).toHaveBeenCalledWith(DEFAULT_BUILDER_SITE_ID, 'ko', 'promo', 'Promo');
    expect(writeLightboxCanvas).toHaveBeenCalled();
  });

  it('routes lightbox GET to the selected workspace site from the editor referer', async () => {
    const route = await import('../route');
    const response = await route.GET(selectedGetRequest());

    expect(response.status).toBe(200);
    expect(listLightboxes).toHaveBeenCalledWith('workspace-lightbox-list', 'ko');
  });

  it('routes lightbox POST and canvas seed to the selected workspace site from the editor referer', async () => {
    const route = await import('../route');
    const response = await route.POST(selectedPostRequest({
      slug: 'workspace-promo',
      name: 'Workspace Promo',
      locale: 'ko',
    }));

    expect(response.status).toBe(200);
    expect(listLightboxes).toHaveBeenCalledWith('workspace-lightbox-list', 'ko');
    expect(createLightbox).toHaveBeenCalledWith('workspace-lightbox-list', 'ko', 'workspace-promo', 'Workspace Promo');
    expect(writeLightboxCanvas).toHaveBeenCalledWith(
      'workspace-lightbox-list',
      'lb-1',
      expect.objectContaining({ nodes: [] }),
    );
  });
});
