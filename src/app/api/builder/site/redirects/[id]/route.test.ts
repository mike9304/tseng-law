import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { deleteRedirect, updateRedirect } from '@/lib/builder/site/redirects';
import type { SiteRedirect } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/redirects/[id]/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/redirects', () => ({
  deleteRedirect: vi.fn(),
  updateRedirect: vi.fn(),
}));

const mockedDeleteRedirect = vi.mocked(deleteRedirect);
const mockedUpdateRedirect = vi.mocked(updateRedirect);

const sampleRedirect: SiteRedirect = {
  redirectId: 'redir-1',
  from: '/ko/old',
  to: '/ko/new',
  type: 301,
  isActive: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

function patchRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/redirects/redir-1${query}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function deleteRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/redirects/redir-1${query}`, {
    method: 'DELETE',
  });
}

describe('/api/builder/site/redirects/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    mockedUpdateRedirect.mockResolvedValue({ redirect: sampleRedirect });
    mockedDeleteRedirect.mockResolvedValue(true);
  });

  it('returns localized stable-code JSON for malformed redirect patches', async () => {
    const response = await route.PATCH(patchRequest('{', '?locale=ko'), { params: { id: 'redir-1' } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '사이트 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(mockedUpdateRedirect).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when a redirect patch target is missing', async () => {
    mockedUpdateRedirect.mockResolvedValueOnce({ notFound: true });
    const response = await route.PATCH(patchRequest({ to: '/ko/new' }, '?locale=zh-hant'), {
      params: { id: 'redir-missing' },
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: '找不到重新導向規則。',
      errorCode: 'redirect_not_found',
    });
  });

  it('does not expose raw redirect validation helper messages on patch', async () => {
    mockedUpdateRedirect.mockResolvedValueOnce({
      error: {
        field: 'to',
        message: 'to "/ko/new" is itself the source of an active redirect (creates a chain)',
      },
    });

    const response = await route.PATCH(patchRequest({ to: '/ko/new' }, '?locale=en'), {
      params: { id: 'redir-1' },
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the redirect rule.',
      errorCode: 'redirect_rule_invalid',
      field: 'to',
    });
    expect(data.error).not.toContain('creates a chain');
  });

  it('returns stable wildcard-overlap diagnostics on patch without exposing raw helper messages', async () => {
    mockedUpdateRedirect.mockResolvedValueOnce({
      error: {
        field: 'from',
        message: 'from "/ko/old/columns/*" overlaps active wildcard redirect "/ko/old/*"',
        code: 'wildcard-overlap',
        diagnostic: {
          code: 'wildcard-overlap',
          conflictingFrom: '/ko/old/*',
          conflictingRedirectId: 'redir-wildcard',
        },
      },
    });

    const response = await route.PATCH(patchRequest({ from: '/ko/old/columns/*' }, '?locale=en'), {
      params: { id: 'redir-1' },
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the redirect rule.',
      errorCode: 'redirect_rule_invalid',
      field: 'from',
      diagnostic: {
        code: 'wildcard-overlap',
        conflictingFrom: '/ko/old/*',
        conflictingRedirectId: 'redir-wildcard',
      },
    });
    expect(data.error).not.toContain('/ko/old/columns/*');
  });

  it('returns localized stable-code JSON when redirect patch persistence fails', async () => {
    mockedUpdateRedirect.mockRejectedValueOnce(new Error('raw redirect patch failure'));
    const response = await route.PATCH(patchRequest({ to: '/ko/new' }, '?locale=ko'), {
      params: { id: 'redir-1' },
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '리디렉션 규칙을 저장하지 못했습니다.',
      errorCode: 'redirect_save_failed',
    });
    expect(data.error).not.toContain('raw redirect patch failure');
  });

  it('returns localized stable-code JSON when a redirect delete target is missing', async () => {
    mockedDeleteRedirect.mockResolvedValueOnce(false);
    const response = await route.DELETE(deleteRequest('?locale=en'), { params: { id: 'redir-missing' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: 'Redirect rule not found.',
      errorCode: 'redirect_not_found',
    });
  });

  it('returns localized stable-code JSON when redirect deletion fails', async () => {
    mockedDeleteRedirect.mockRejectedValueOnce(new Error('raw redirect delete failure'));
    const response = await route.DELETE(deleteRequest('?locale=zh-hant'), { params: { id: 'redir-1' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法刪除重新導向規則。',
      errorCode: 'redirect_delete_failed',
    });
    expect(data.error).not.toContain('raw redirect delete failure');
  });
});
