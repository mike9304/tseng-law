import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { buildGoogleAuthUrl } from '@/lib/builder/bookings/calendar-sync/google';
import { buildOutlookAuthUrl } from '@/lib/builder/bookings/calendar-sync/outlook';
import { buildOauthState } from '@/lib/builder/bookings/calendar-sync/oauth-state';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/google', () => ({
  buildGoogleAuthUrl: vi.fn(() => ({ ok: true, url: 'https://google.example.test/oauth' })),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/outlook', () => ({
  buildOutlookAuthUrl: vi.fn(() => ({ ok: true, url: 'https://outlook.example.test/oauth' })),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/oauth-state', () => ({
  buildOauthState: vi.fn(() => 'signed-state'),
}));

describe('/api/builder/bookings/calendar-sync/connect/:provider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
    vi.mocked(buildOauthState).mockReturnValue('signed-state');
    vi.mocked(buildGoogleAuthUrl).mockReturnValue({ ok: true, url: 'https://google.example.test/oauth' });
    vi.mocked(buildOutlookAuthUrl).mockReturnValue({ ok: true, url: 'https://outlook.example.test/oauth' });
  });

  it('returns localized errors when Google connect requests omit staffId', async () => {
    const route = await import('../google/route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/calendar-sync/connect/google?locale=zh-hant'),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: '請選擇員工。',
      errorCode: 'missing_staff_id',
    });
    expect(buildOauthState).not.toHaveBeenCalled();
    expect(buildGoogleAuthUrl).not.toHaveBeenCalled();
  });

  it('returns safe localized errors when Google auth URL creation fails', async () => {
    vi.mocked(buildGoogleAuthUrl).mockReturnValueOnce({
      ok: false,
      error: 'Google OAuth unconfigured: GOOGLE_OAUTH_CLIENT_ID',
    });
    const route = await import('../google/route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/calendar-sync/connect/google?staffId=staff-1&locale=en'),
    );
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toEqual({
      error: 'Unable to create the calendar connection URL.',
      errorCode: 'auth_url_failed',
    });
    expect(payload.error).not.toContain('GOOGLE_OAUTH_CLIENT_ID');
    expect(buildOauthState).toHaveBeenCalledWith('google', 'staff-1');
  });

  it('returns Google connect URLs on valid requests', async () => {
    const route = await import('../google/route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/calendar-sync/connect/google?staffId=staff-1&locale=ko'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      url: 'https://google.example.test/oauth',
      state: 'signed-state',
    });
    expect(buildGoogleAuthUrl).toHaveBeenCalledWith('signed-state');
  });

  it('returns localized state errors for Outlook connect requests', async () => {
    vi.mocked(buildOauthState).mockImplementationOnce(() => {
      throw new Error('OAUTH_STATE_SECRET (or CRON_SECRET) is not configured');
    });
    const route = await import('../outlook/route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/calendar-sync/connect/outlook?staffId=staff-2&locale=ko'),
    );
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toEqual({
      error: '캘린더 연결 보안 상태를 만들 수 없습니다.',
      errorCode: 'oauth_state_failed',
    });
    expect(buildOutlookAuthUrl).not.toHaveBeenCalled();
  });

  it('returns Outlook connect URLs on valid requests', async () => {
    const route = await import('../outlook/route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/calendar-sync/connect/outlook?staffId=staff-2&locale=zh-hant'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      url: 'https://outlook.example.test/oauth',
      state: 'signed-state',
    });
    expect(buildOauthState).toHaveBeenCalledWith('outlook', 'staff-2');
    expect(buildOutlookAuthUrl).toHaveBeenCalledWith('signed-state');
  });
});
