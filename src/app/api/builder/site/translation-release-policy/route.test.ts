import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import {
  readTranslationReleasePolicy,
  writeTranslationReleasePolicy,
} from '@/lib/builder/publish-gate/translation-release-policy';
import * as route from '@/app/api/builder/site/translation-release-policy/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/publish-gate/translation-release-policy', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/publish-gate/translation-release-policy')>();
  return {
    ...actual,
    readTranslationReleasePolicy: vi.fn(async () => ({
      siteId: 'tseng-law-main-site',
      mode: 'acknowledge-other-page-warnings',
      approvalRequiredForRoles: [],
      updatedAt: '2026-06-20T00:00:00.000Z',
    })),
    writeTranslationReleasePolicy: vi.fn(async () => ({
      siteId: 'tseng-law-main-site',
      mode: 'block-other-page-warnings',
      approvalRequiredForRoles: [],
      updatedAt: '2026-06-20T00:01:00.000Z',
      updatedBy: 'admin',
    })),
  };
});

function request(method: string, body?: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/translation-release-policy?locale=ko', {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('/api/builder/site/translation-release-policy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
  });

  it('returns the current organization translation release policy', async () => {
    const response = await route.GET(request('GET'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.policy).toMatchObject({
      siteId: 'tseng-law-main-site',
      mode: 'acknowledge-other-page-warnings',
      approvalRequiredForRoles: [],
    });
    expect(readTranslationReleasePolicy).toHaveBeenCalledWith('tseng-law-main-site');
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(Request),
      'manage-translations',
    );
  });

  it('returns 403 before reading policy data when translation permission is missing', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json(
        { error: 'Missing permission: manage-translations' },
        { status: 403 },
      ),
    );

    const response = await route.GET(request('GET'));

    expect(response.status).toBe(403);
    expect(readTranslationReleasePolicy).not.toHaveBeenCalled();
  });

  it('saves a blocking organization translation release policy', async () => {
    const response = await route.PUT(request('PUT', { mode: 'block-other-page-warnings' }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.policy).toMatchObject({
      siteId: 'tseng-law-main-site',
      mode: 'block-other-page-warnings',
      approvalRequiredForRoles: [],
      updatedBy: 'admin',
    });
    expect(writeTranslationReleasePolicy).toHaveBeenCalledWith('tseng-law-main-site', {
      mode: 'block-other-page-warnings',
      updatedBy: 'admin',
    });
    expect(guardMutation).toHaveBeenCalledWith(expect.any(Request), { permission: 'settings' });
  });

  it('saves role-scoped approval requirements for translation release', async () => {
    const response = await route.PUT(request('PUT', {
      mode: 'acknowledge-other-page-warnings',
      approvalRequiredForRoles: ['admin', 'editor'],
    }));

    expect(response.status).toBe(200);
    expect(writeTranslationReleasePolicy).toHaveBeenCalledWith('tseng-law-main-site', {
      mode: 'acknowledge-other-page-warnings',
      updatedBy: 'admin',
      approvalRequiredForRoles: ['admin', 'editor'],
    });
  });
});
