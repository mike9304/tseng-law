import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createMember,
  loginMember,
  publicMember,
} from '@/lib/builder/members/members-engine';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { POST } from '../route';

vi.mock('@/lib/builder/members/members-engine', () => ({
  createMember: vi.fn(),
  loginMember: vi.fn(),
  publicMember: vi.fn(),
}));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(),
}));

const createMemberMock = vi.mocked(createMember);
const loginMemberMock = vi.mocked(loginMember);
const publicMemberMock = vi.mocked(publicMember);
const checkRateLimitMock = vi.mocked(checkRateLimit);

function request({
  body = JSON.stringify({
    email: 'unverified-claim@example.com',
    name: 'Unverified Claim',
    password: 'password123',
  }),
  headers = {},
  locale = 'ko',
}: {
  body?: string;
  headers?: Record<string, string>;
  locale?: string;
} = {}): NextRequest {
  return new NextRequest(
    `https://tseng-law.com/api/members/signup?locale=${encodeURIComponent(locale)}`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://tseng-law.com',
        ...headers,
      },
      body,
    },
  );
}

describe('members signup API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ['ko', '공개 회원가입은 지원하지 않습니다. 회원 계정은 담당자가 확인 후 발급합니다.'],
    ['zh-hant', '目前不提供公開註冊。會員帳戶將由事務所確認後建立。'],
    ['en', 'Public signup is unavailable. Member accounts are issued by the firm after review.'],
    ['ja', '一般公開の会員登録は受け付けていません。会員アカウントは事務所での確認後に発行されます。'],
  ])('fails closed with a stable localized 403 for %s', async (locale, error) => {
    const response = await POST(request({ locale }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error,
      errorCode: 'public_signup_disabled',
    });
    expect(response.headers.get('cache-control')).toBe('private, no-store, max-age=0');
    expect(response.headers.get('x-robots-tag')).toBe('noindex, noarchive');
  });

  it('does not parse or process attacker-controlled signup input', async () => {
    const invalidJson = await POST(request({ body: '{' }));
    const crossOrigin = await POST(request({
      headers: { origin: 'https://attacker.example' },
      locale: 'en',
    }));

    expect(invalidJson.status).toBe(403);
    expect(crossOrigin.status).toBe(403);
    await expect(invalidJson.json()).resolves.toMatchObject({
      ok: false,
      errorCode: 'public_signup_disabled',
    });
    await expect(crossOrigin.json()).resolves.toMatchObject({
      ok: false,
      errorCode: 'public_signup_disabled',
    });
  });

  it('never creates a member, logs in, exposes a member, rate limits, or sets a session cookie', async () => {
    const response = await POST(request());

    expect(response.status).toBe(403);
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(createMemberMock).not.toHaveBeenCalled();
    expect(loginMemberMock).not.toHaveBeenCalled();
    expect(publicMemberMock).not.toHaveBeenCalled();
    expect(checkRateLimitMock).not.toHaveBeenCalled();
  });

  it('uses the safe Korean fallback for unsupported locale values', async () => {
    const response = await POST(request({ locale: 'fr' }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: '공개 회원가입은 지원하지 않습니다. 회원 계정은 담당자가 확인 후 발급합니다.',
      errorCode: 'public_signup_disabled',
    });
  });
});
