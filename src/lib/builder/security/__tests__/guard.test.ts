import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkDraftSaveRateLimit, checkMutationRateLimit } from '@/lib/builder/security/rate-limit';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import {
  guardBuilderRead,
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(),
}));

vi.mock('@/lib/builder/security/csrf', () => ({
  validateCsrf: vi.fn(),
}));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkAssetUploadRateLimit: vi.fn(),
  checkDraftSaveRateLimit: vi.fn(),
  checkMutationRateLimit: vi.fn(),
  checkPublishRateLimit: vi.fn(),
}));

vi.mock('@/lib/builder/security/resolve-permission', () => ({
  userHasPermission: vi.fn(),
}));

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const validateCsrfMock = vi.mocked(validateCsrf);
const checkDraftSaveRateLimitMock = vi.mocked(checkDraftSaveRateLimit);
const checkMutationRateLimitMock = vi.mocked(checkMutationRateLimit);
const userHasPermissionMock = vi.mocked(userHasPermission);

function request(): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/pages/page-1/draft', {
    method: 'PUT',
  });
}

describe('guardMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ username: 'designer' });
    validateCsrfMock.mockReturnValue(null);
    checkDraftSaveRateLimitMock.mockResolvedValue({ allowed: true, remaining: 179, retryAfterMs: 0 });
    checkMutationRateLimitMock.mockResolvedValue({ allowed: true, remaining: 9, retryAfterMs: 0 });
    userHasPermissionMock.mockResolvedValue(true);
  });

  it('checks granular permission against the authenticated username role', async () => {
    const result = await guardMutation(request(), { permission: 'edit-pages' });

    expect(result).toEqual({ username: 'designer', permission: 'edit-pages' });
    expect(userHasPermissionMock).toHaveBeenCalledWith('designer', 'edit-pages');
  });

  it.each(['reviewer', 'viewer'])(
    'fails closed for authenticated %s users when the permission is omitted',
    async (username) => {
      requireBuilderAdminAuthMock.mockReturnValueOnce({ username });
      userHasPermissionMock.mockResolvedValueOnce(false);

      const result = await guardMutation(request());

      expect(result).toBeInstanceOf(NextResponse);
      if (!(result instanceof NextResponse)) throw new Error('Expected forbidden response.');
      expect(result.status).toBe(403);
      expect(await result.json()).toEqual({ error: 'Missing permission: edit-pages' });
      expect(userHasPermissionMock).toHaveBeenCalledWith(username, 'edit-pages');
      expect(checkDraftSaveRateLimitMock).not.toHaveBeenCalled();
      expect(checkMutationRateLimitMock).not.toHaveBeenCalled();
    },
  );

  it.each(['owner', 'editor'])(
    'allows authenticated %s users with the default edit-pages permission',
    async (username) => {
      requireBuilderAdminAuthMock.mockReturnValueOnce({ username });

      const result = await guardMutation(request());

      expect(result).toEqual({ username, permission: 'edit-pages' });
      expect(userHasPermissionMock).toHaveBeenCalledWith(username, 'edit-pages');
      expect(checkMutationRateLimitMock).toHaveBeenCalledWith('unknown');
    },
  );

  it('keeps allowReadOnly callers subject to their explicit granular permission', async () => {
    const result = await guardMutation(request(), {
      allowReadOnly: true,
      permission: 'view-contacts',
    });

    expect(result).toEqual({ username: 'designer', permission: 'view-contacts' });
    expect(userHasPermissionMock).toHaveBeenCalledWith('designer', 'view-contacts');
    expect(checkMutationRateLimitMock).toHaveBeenCalledWith('unknown');
  });

  it('uses the draft save bucket when requested', async () => {
    const result = await guardMutation(request(), { bucket: 'draft', permission: 'edit-pages' });

    expect(result).toEqual({ username: 'designer', permission: 'edit-pages' });
    expect(checkDraftSaveRateLimitMock).toHaveBeenCalledWith('unknown');
    expect(checkMutationRateLimitMock).not.toHaveBeenCalled();
  });

  it('rejects authenticated users that lack the requested mutation permission', async () => {
    userHasPermissionMock.mockResolvedValueOnce(false);

    const result = await guardMutation(request(), { permission: 'publish' });

    expect(result).toBeInstanceOf(NextResponse);
    if (!(result instanceof NextResponse)) throw new Error('Expected forbidden response.');
    expect(result.status).toBe(403);
    expect(await result.json()).toEqual({ error: 'Missing permission: publish' });
  });

  it('returns a sanitized 503 when the production rate-limit backend is unavailable', async () => {
    checkMutationRateLimitMock.mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });

    const result = await guardMutation(request());

    expect(result).toBeInstanceOf(NextResponse);
    if (!(result instanceof NextResponse)) throw new Error('Expected unavailable response.');
    expect(result.status).toBe(503);
    expect(await result.json()).toEqual({ error: 'rate_limit_unavailable' });
    expect(result.headers.get('Retry-After')).toBeNull();
  });

  it('keeps actual rate-limit exhaustion mapped to 429', async () => {
    checkMutationRateLimitMock.mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      retryAfterMs: 2_500,
    });

    const result = await guardMutation(request());

    expect(result).toBeInstanceOf(NextResponse);
    if (!(result instanceof NextResponse)) throw new Error('Expected rate-limit response.');
    expect(result.status).toBe(429);
    expect(await result.json()).toEqual({ error: 'Too many requests' });
    expect(result.headers.get('Retry-After')).toBe('3');
  });
});

describe('guardBuilderRead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ username: 'designer' });
    userHasPermissionMock.mockResolvedValue(true);
  });

  it('keeps auth-only reads synchronous for legacy callers', () => {
    const result = guardBuilderRead(request());

    expect(result).toEqual({ username: 'designer' });
    expect(userHasPermissionMock).not.toHaveBeenCalled();
    expect(validateCsrfMock).not.toHaveBeenCalled();
    expect(checkMutationRateLimitMock).not.toHaveBeenCalled();
  });

  it('checks granular permission for protected read routes without CSRF or mutation rate limits', async () => {
    const result = await guardBuilderReadWithPermission(request(), 'settings');

    expect(result).toEqual({ username: 'designer', permission: 'settings' });
    expect(userHasPermissionMock).toHaveBeenCalledWith('designer', 'settings');
    expect(validateCsrfMock).not.toHaveBeenCalled();
    expect(checkMutationRateLimitMock).not.toHaveBeenCalled();
  });

  it('rejects authenticated users that lack the requested read permission', async () => {
    userHasPermissionMock.mockResolvedValueOnce(false);

    const result = await guardBuilderReadWithPermission(request(), 'settings');

    expect(result).toBeInstanceOf(NextResponse);
    if (!(result instanceof NextResponse)) throw new Error('Expected forbidden response.');
    expect(result.status).toBe(403);
    expect(await result.json()).toEqual({ error: 'Missing permission: settings' });
  });
});
