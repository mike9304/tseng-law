import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MEMBER_SESSION_COOKIE,
  publicMember,
  updateMemberProfile,
  validateSession,
} from '@/lib/builder/members/members-engine';
import { GET, PATCH } from '../route';

vi.mock('@/lib/builder/members/members-engine', () => ({
  MEMBER_SESSION_COOKIE: 'builder_member_session',
  publicMember: vi.fn((member: unknown) => member),
  updateMemberProfile: vi.fn(),
  validateSession: vi.fn(),
}));

const member = {
  memberId: 'member-1',
  email: 'member@example.com',
  name: 'Member One',
  phone: '+886-2-1234-5678',
  role: 'free',
  verified: true,
  blocked: false,
  createdAt: '2026-06-03T00:00:00.000Z',
};

const validateSessionMock = vi.mocked(validateSession);
const updateMemberProfileMock = vi.mocked(updateMemberProfile);
const publicMemberMock = vi.mocked(publicMember);

function request(
  method: 'GET' | 'PATCH',
  query = '',
  body: string | unknown = {
    name: 'Member Updated',
    phone: '+886-2-1111-2222',
    locale: 'ko',
  },
  cookie = `${MEMBER_SESSION_COOKIE}=session-1`,
): NextRequest {
  return new NextRequest(`https://law.example.test/api/members/me${query ? `?${query}` : ''}`, {
    method,
    headers: {
      ...(method === 'PATCH' ? { 'content-type': 'application/json' } : {}),
      ...(cookie ? { cookie } : {}),
    },
    body: method === 'PATCH' ? typeof body === 'string' ? body : JSON.stringify(body) : undefined,
  });
}

describe('members me API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    validateSessionMock.mockResolvedValue(member as never);
    updateMemberProfileMock.mockResolvedValue({ ...member, name: 'Member Updated' } as never);
    publicMemberMock.mockImplementation((nextMember) => nextMember as never);
  });

  it('returns a signed-out profile state without logging a 401 for guests', async () => {
    validateSessionMock.mockResolvedValueOnce(null);

    const response = await GET(request('GET', 'locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, member: null });
  });

  it('still requires authentication for profile updates', async () => {
    validateSessionMock.mockResolvedValueOnce(null);

    const response = await PATCH(request('PATCH', 'locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({
      ok: false,
      error: '需要登入。',
      errorCode: 'not_authenticated',
    });
  });

  it('returns the current member while preserving success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, member });
  });

  it('returns localized email-change verification errors using the body locale', async () => {
    const response = await PATCH(request('PATCH', '', {
      email: 'other@example.com',
      name: 'Member One',
      locale: 'zh-hant',
    }));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({
      ok: false,
      error: '變更電子郵件需要先完成驗證。',
      errorCode: 'email_change_requires_verification',
    });
    expect(updateMemberProfileMock).not.toHaveBeenCalled();
  });

  it('returns localized duplicate-email errors', async () => {
    updateMemberProfileMock.mockRejectedValueOnce(new Error('duplicate_email'));

    const response = await PATCH(request('PATCH', 'locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: 'That email is already registered.',
      errorCode: 'duplicate_email',
    });
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await PATCH(request('PATCH', 'locale=zh-hant', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認會員請求格式。',
      errorCode: 'invalid_json',
    });
  });

  it('updates profiles while preserving success response shape', async () => {
    const response = await PATCH(request('PATCH', 'locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, member: { ...member, name: 'Member Updated' } });
    expect(updateMemberProfileMock).toHaveBeenCalledWith('member-1', {
      name: 'Member Updated',
      phone: '+886-2-1111-2222',
    });
  });
});
