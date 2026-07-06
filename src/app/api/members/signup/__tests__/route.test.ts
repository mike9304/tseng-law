import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createMember,
  loginMember,
  MEMBER_SESSION_COOKIE,
  publicMember,
} from '@/lib/builder/members/members-engine';
import { POST } from '../route';

vi.mock('@/lib/builder/members/members-engine', () => ({
  createMember: vi.fn(),
  loginMember: vi.fn(),
  MEMBER_SESSION_COOKIE: 'builder_member_session',
  publicMember: vi.fn((member: unknown) => member),
}));

const member = {
  memberId: 'member-1',
  email: 'member@example.com',
  name: 'Member One',
  role: 'free',
  verified: false,
  blocked: false,
  createdAt: '2026-06-03T00:00:00.000Z',
};

const createMemberMock = vi.mocked(createMember);
const loginMemberMock = vi.mocked(loginMember);
const publicMemberMock = vi.mocked(publicMember);

function request(query = '', body: string | unknown = {
  email: 'member@example.com',
  name: 'Member One',
  password: 'password123',
  locale: 'ko',
}): NextRequest {
  return new NextRequest(`https://law.example.test/api/members/signup${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('members signup API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMemberMock.mockResolvedValue(member as never);
    loginMemberMock.mockResolvedValue({
      sessionId: 'session-1',
      memberId: 'member-1',
      expiresAt: '2026-06-10T00:00:00.000Z',
      createdAt: '2026-06-03T00:00:00.000Z',
    } as never);
    publicMemberMock.mockImplementation((nextMember) => nextMember as never);
  });

  it('returns localized validation errors using the body locale', async () => {
    const response = await POST(request('', {
      email: 'bad',
      name: '',
      password: 'short',
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
    expect(createMemberMock).not.toHaveBeenCalled();
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

  it('returns localized duplicate-email errors without leaking engine messages', async () => {
    createMemberMock.mockRejectedValueOnce(new Error('이미 가입된 이메일입니다.'));

    const response = await POST(request('', {
      email: 'member@example.com',
      name: 'Member One',
      password: 'password123',
      locale: 'en',
    }));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: 'That email is already registered.',
      errorCode: 'duplicate_email',
    });
    expect(JSON.stringify(payload)).not.toContain('이미 가입된 이메일입니다.');
  });

  it('returns localized session-create failures', async () => {
    loginMemberMock.mockResolvedValueOnce(null);

    const response = await POST(request('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法建立會員工作階段。',
      errorCode: 'session_create_failed',
    });
  });

  it('creates members while preserving success response shape and session cookie', async () => {
    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toEqual({ ok: true, member });
    expect(response.headers.get('set-cookie')).toContain(`${MEMBER_SESSION_COOKIE}=session-1`);
    expect(createMemberMock).toHaveBeenCalledWith({
      email: 'member@example.com',
      name: 'Member One',
      password: 'password123',
      role: 'free',
    });
  });
});
