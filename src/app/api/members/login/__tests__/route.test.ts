import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getMember,
  loginMember,
  MEMBER_SESSION_COOKIE,
  publicMember,
} from '@/lib/builder/members/members-engine';
import { POST } from '../route';

vi.mock('@/lib/builder/members/members-engine', () => ({
  getMember: vi.fn(),
  loginMember: vi.fn(),
  MEMBER_SESSION_COOKIE: 'builder_member_session',
  publicMember: vi.fn((member: unknown) => member),
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

function request(query = '', body: string | unknown = {
  email: 'member@example.com',
  password: 'password123',
  locale: 'ko',
}): NextRequest {
  return new NextRequest(`https://law.example.test/api/members/login${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
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

  it('logs in members while preserving success response shape and session cookie', async () => {
    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, member });
    expect(response.headers.get('set-cookie')).toContain(`${MEMBER_SESSION_COOKIE}=session-1`);
    expect(loginMemberMock).toHaveBeenCalledWith('member@example.com', 'password123');
    expect(getMemberMock).toHaveBeenCalledWith('member-1');
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
