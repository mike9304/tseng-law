import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getMember,
  loginMember,
  MEMBER_SESSION_COOKIE,
  publicMember,
  revokeSession,
} from '@/lib/builder/members/members-engine';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { POST } from '../route';

vi.mock('@/lib/builder/members/members-engine', () => ({
  getMember: vi.fn(),
  loginMember: vi.fn(),
  MEMBER_SESSION_COOKIE: 'builder_member_session',
  publicMember: vi.fn((member: unknown) => member),
  revokeSession: vi.fn(),
}));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(),
}));

const member = {
  memberId: 'member-1',
  email: 'member@example.com',
  name: 'Member One',
  role: 'free',
  verified: true,
  blocked: false,
  createdAt: '2026-06-03T00:00:00.000Z',
};

const loginMemberMock = vi.mocked(loginMember);
const getMemberMock = vi.mocked(getMember);
const publicMemberMock = vi.mocked(publicMember);
const revokeSessionMock = vi.mocked(revokeSession);
const checkRateLimitMock = vi.mocked(checkRateLimit);

function request(query = '', body: string | unknown = {
  email: 'member@example.com',
  password: 'password123',
  locale: 'ko',
}, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(`https://tseng-law.com/api/members/login${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://tseng-law.com',
      'x-forwarded-for': '203.0.113.10, 10.0.0.1',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('members login API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loginMemberMock.mockResolvedValue({
      sessionId: 'session-1',
      memberId: 'member-1',
      expiresAt: '2026-06-10T00:00:00.000Z',
      createdAt: '2026-06-03T00:00:00.000Z',
    } as never);
    getMemberMock.mockResolvedValue(member as never);
    publicMemberMock.mockImplementation((nextMember) => nextMember as never);
    revokeSessionMock.mockResolvedValue(undefined);
    checkRateLimitMock.mockResolvedValue({
      allowed: true,
      remaining: 4,
      retryAfterMs: 0,
    });
  });

  it('accepts a same-origin request and rejects missing or cross-origin requests', async () => {
    const allowed = await POST(request());
    const missing = await POST(request('', undefined, { origin: '' }));
    const crossOrigin = await POST(request('', undefined, {
      origin: 'https://attacker.example',
    }));

    expect(allowed.status).toBe(200);
    expect(missing.status).toBe(403);
    expect(crossOrigin.status).toBe(403);
    await expect(crossOrigin.json()).resolves.toMatchObject({
      error: 'csrf_origin_mismatch',
      code: 'csrf_origin_mismatch',
    });
    expect(loginMemberMock).toHaveBeenCalledTimes(1);
  });

  it('preserves origin-less local development requests', async () => {
    const localRequest = new NextRequest('http://localhost:3000/api/members/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
      },
      body: JSON.stringify({
        email: 'member@example.com',
        password: 'password123',
        locale: 'ko',
      }),
    });

    const response = await POST(localRequest);

    expect(response.status).toBe(200);
    expect(loginMemberMock).toHaveBeenCalledOnce();
  });

  it('returns localized validation errors using the body locale', async () => {
    const response = await POST(request('', {
      email: 'bad',
      password: '',
      locale: 'zh-hant',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認會員請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(loginMemberMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors using the query locale', async () => {
    const response = await POST(request('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the member request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized invalid-credential errors', async () => {
    loginMemberMock.mockResolvedValueOnce(null);

    const response = await POST(request('', {
      email: 'member@example.com',
      password: 'wrong',
      locale: 'en',
    }));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({
      ok: false,
      error: 'Email or password is incorrect.',
      errorCode: 'invalid_credentials',
    });
  });

  it('returns a generic Japanese credential error without leaking verification state', async () => {
    loginMemberMock.mockResolvedValueOnce(null);

    const response = await POST(request('', {
      email: 'claimed-victim@example.com',
      password: 'wrong',
      locale: 'ja',
    }));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({
      ok: false,
      error: 'メールアドレスまたはパスワードが正しくありません。',
      errorCode: 'invalid_credentials',
    });
    expect(JSON.stringify(payload)).not.toContain('verified');
  });

  it('logs in members while preserving success response shape and session cookie', async () => {
    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, member });
    expect(response.headers.get('set-cookie')).toContain(`${MEMBER_SESSION_COOKIE}=session-1`);
    expect(loginMemberMock).toHaveBeenCalledWith('member@example.com', 'password123');
    expect(getMemberMock).toHaveBeenCalledWith('member-1');
  });

  it('revokes a session and returns the generic credential error for an unverified member', async () => {
    getMemberMock.mockResolvedValueOnce({ ...member, verified: false } as never);

    const response = await POST(request('', {
      email: 'claimed-victim@example.com',
      password: 'password123',
      locale: 'en',
    }));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({
      ok: false,
      error: 'Email or password is incorrect.',
      errorCode: 'invalid_credentials',
    });
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(revokeSessionMock).toHaveBeenCalledWith('session-1');
    expect(publicMemberMock).not.toHaveBeenCalled();
    expect(JSON.stringify(payload)).not.toContain('verified');
    expect(JSON.stringify(payload)).not.toContain('claimed-victim@example.com');
  });

  it('rate limits by Vercel client IP and normalized email with Retry-After', async () => {
    checkRateLimitMock
      .mockResolvedValueOnce({ allowed: true, remaining: 19, retryAfterMs: 0 })
      .mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 2_200 });

    const response = await POST(request('', {
      email: ' Member@Example.COM ',
      password: 'password123',
      locale: 'en',
    }));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('3');
    expect(payload).toEqual({
      ok: false,
      error: 'Too many requests. Please try again later.',
      errorCode: 'too_many_requests',
    });
    expect(checkRateLimitMock).toHaveBeenNthCalledWith(
      1,
      'members-login:ip:203.0.113.10',
      20,
      5 * 60_000,
    );
    expect(checkRateLimitMock).toHaveBeenNthCalledWith(
      2,
      'members-login:email:member@example.com',
      5,
      5 * 60_000,
    );
    expect(loginMemberMock).not.toHaveBeenCalled();
  });

  it('revokes an orphaned session and returns a generic authentication failure', async () => {
    getMemberMock.mockResolvedValueOnce(null);

    const response = await POST(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to sign in.',
      errorCode: 'member_login_failed',
    });
    expect(revokeSessionMock).toHaveBeenCalledWith('session-1');
    expect(JSON.stringify(payload)).not.toContain('member-1');
  });

  it('returns localized fallback failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loginMemberMock.mockRejectedValueOnce(new Error('login secret leaked'));

    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '로그인하지 못했습니다.',
      errorCode: 'member_login_failed',
    });
    expect(payload.error).not.toContain('login secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[members/login] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
