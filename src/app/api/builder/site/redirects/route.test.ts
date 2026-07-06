import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { createRedirect, listRedirects } from '@/lib/builder/site/redirects';
import type { SiteRedirect } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/redirects/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/redirects', () => ({
  createRedirect: vi.fn(),
  listRedirects: vi.fn(),
}));

const mockedCreateRedirect = vi.mocked(createRedirect);
const mockedListRedirects = vi.mocked(listRedirects);

const sampleRedirect: SiteRedirect = {
  redirectId: 'redir-1',
  from: '/ko/old',
  to: '/ko/new',
  type: 301,
  isActive: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

function postRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/redirects${query}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/site/redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    mockedListRedirects.mockResolvedValue([sampleRedirect]);
    mockedCreateRedirect.mockResolvedValue({ redirect: sampleRedirect });
  });

  it('returns localized stable-code JSON when redirect loading fails', async () => {
    mockedListRedirects.mockRejectedValueOnce(new Error('raw redirect load failure'));
    const response = await route.GET(new NextRequest('https://law.example.test/api/builder/site/redirects?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to load the redirect list.',
      errorCode: 'redirects_load_failed',
    });
    expect(data.error).not.toContain('raw redirect load failure');
  });

  it('returns localized stable-code JSON for malformed redirect creates', async () => {
    const response = await route.POST(postRequest('{', '?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(mockedCreateRedirect).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for invalid redirect create payloads', async () => {
    const response = await route.POST(postRequest({ from: '', to: '/ko/new' }, '?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '사이트 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(data.issues).toBeDefined();
    expect(mockedCreateRedirect).not.toHaveBeenCalled();
  });

  it('does not expose raw redirect validation helper messages on create', async () => {
    mockedCreateRedirect.mockResolvedValueOnce({
      error: {
        field: 'from',
        message: 'from "/ko/old" already has an active redirect',
      },
    });

    const response = await route.POST(postRequest({ from: '/ko/old', to: '/ko/new' }, '?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the redirect rule.',
      errorCode: 'redirect_rule_invalid',
      field: 'from',
    });
    expect(data.error).not.toContain('/ko/old');
  });

  it('returns stable wildcard-overlap diagnostics on create without exposing raw helper messages', async () => {
    mockedCreateRedirect.mockResolvedValueOnce({
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

    const response = await route.POST(postRequest({ from: '/ko/old/columns/*', to: '/ko/new-columns/*' }, '?locale=en'));
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

  it('returns localized stable-code JSON when redirect creation fails', async () => {
    mockedCreateRedirect.mockRejectedValueOnce(new Error('raw redirect save failure'));
    const response = await route.POST(postRequest({ from: '/ko/old', to: '/ko/new' }, '?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '리디렉션 규칙을 저장하지 못했습니다.',
      errorCode: 'redirect_save_failed',
    });
    expect(data.error).not.toContain('raw redirect save failure');
  });
});
