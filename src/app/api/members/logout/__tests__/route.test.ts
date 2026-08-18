import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MEMBER_SESSION_COOKIE,
  revokeSession,
} from '@/lib/builder/members/members-engine';
import { POST } from '../route';

vi.mock('@/lib/builder/members/members-engine', () => ({
  MEMBER_SESSION_COOKIE: 'builder_member_session',
  revokeSession: vi.fn(),
}));

const revokeSessionMock = vi.mocked(revokeSession);

function request(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('https://tseng-law.com/api/members/logout', {
    method: 'POST',
    headers: {
      origin: 'https://tseng-law.com',
      cookie: `${MEMBER_SESSION_COOKIE}=session-1`,
      ...headers,
    },
  });
}

describe('members logout API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    revokeSessionMock.mockResolvedValue(undefined);
  });

  it('revokes the server session before clearing the member cookie', async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(revokeSessionMock).toHaveBeenCalledWith('session-1');
    expect(response.headers.get('set-cookie')).toContain(`${MEMBER_SESSION_COOKIE}=`);
    expect(response.headers.get('set-cookie')).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });

  it('rejects missing and cross-origin requests without revoking the session', async () => {
    const missing = await POST(request({ origin: '' }));
    const crossOrigin = await POST(request({ origin: 'https://attacker.example' }));

    expect(missing.status).toBe(403);
    expect(crossOrigin.status).toBe(403);
    expect(revokeSessionMock).not.toHaveBeenCalled();
  });

  it('returns a generic failure without clearing the cookie when server revocation fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    revokeSessionMock.mockRejectedValueOnce(new Error('database credentials leaked'));

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to sign out.',
      errorCode: 'member_logout_failed',
    });
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(JSON.stringify(payload)).not.toContain('database credentials leaked');
    consoleError.mockRestore();
  });
});
