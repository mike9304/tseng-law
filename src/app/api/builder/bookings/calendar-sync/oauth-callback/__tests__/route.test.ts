import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { encryptToken } from '@/lib/builder/bookings/calendar-sync/encryption';
import { exchangeGoogleCode } from '@/lib/builder/bookings/calendar-sync/google';
import { exchangeOutlookCode } from '@/lib/builder/bookings/calendar-sync/outlook';
import { verifyOauthState } from '@/lib/builder/bookings/calendar-sync/oauth-state';
import {
  makeConnectionId,
  saveConnection,
} from '@/lib/builder/bookings/calendar-sync/storage';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/encryption', () => ({
  encryptToken: vi.fn(() => 'encrypted-refresh-token'),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/google', () => ({
  exchangeGoogleCode: vi.fn(async () => ({
    ok: true,
    accessToken: 'google-access-token',
    refreshToken: 'google-refresh-token',
    expiresIn: 3600,
  })),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/outlook', () => ({
  exchangeOutlookCode: vi.fn(async () => ({
    ok: true,
    accessToken: 'outlook-access-token',
    refreshToken: 'outlook-refresh-token',
    expiresIn: 3600,
  })),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/oauth-state', () => ({
  verifyOauthState: vi.fn(() => ({ provider: 'google', staffId: 'staff-route-test' })),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/storage', () => ({
  makeConnectionId: vi.fn((staffId: string, provider: string) => `cs_${provider}_${staffId}`),
  saveConnection: vi.fn(async () => undefined),
}));

function callbackRequest(query: string): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/calendar-sync/oauth-callback?${query}`);
}

describe('/api/builder/bookings/calendar-sync/oauth-callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-04T10:00:00.000Z'));
    vi.mocked(requireBuilderAdminAuth).mockReturnValue({ username: 'admin' });
    vi.mocked(encryptToken).mockReturnValue('encrypted-refresh-token');
    vi.mocked(exchangeGoogleCode).mockResolvedValue({
      ok: true,
      accessToken: 'google-access-token',
      refreshToken: 'google-refresh-token',
      expiresIn: 3600,
    });
    vi.mocked(exchangeOutlookCode).mockResolvedValue({
      ok: true,
      accessToken: 'outlook-access-token',
      refreshToken: 'outlook-refresh-token',
      expiresIn: 3600,
    });
    vi.mocked(verifyOauthState).mockReturnValue({ provider: 'google', staffId: 'staff-route-test' });
    vi.mocked(makeConnectionId).mockImplementation((staffId, provider) => `cs_${provider}_${staffId}`);
    vi.mocked(saveConnection).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns localized provider-denied callback errors without exposing provider details', async () => {
    const route = await import('../route');
    const response = await route.GET(callbackRequest('error=access_denied&locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: 'The calendar provider did not approve the connection.',
      errorCode: 'oauth_provider_error',
    });
    expect(payload.error).not.toContain('access_denied');
    expect(verifyOauthState).not.toHaveBeenCalled();
    expect(saveConnection).not.toHaveBeenCalled();
  });

  it('returns localized errors when callback params are missing', async () => {
    const route = await import('../route');
    const response = await route.GET(callbackRequest('code=oauth-code&locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: '行事曆連線回應不正確。',
      errorCode: 'missing_oauth_params',
    });
    expect(verifyOauthState).not.toHaveBeenCalled();
  });

  it('returns localized state verification errors', async () => {
    vi.mocked(verifyOauthState).mockReturnValueOnce(null);
    const route = await import('../route');
    const response = await route.GET(callbackRequest('code=oauth-code&state=expired-state&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: '캘린더 연결 보안 상태가 만료되었거나 올바르지 않습니다.',
      errorCode: 'invalid_oauth_state',
    });
    expect(exchangeGoogleCode).not.toHaveBeenCalled();
  });

  it('returns safe localized errors when token exchange fails', async () => {
    vi.mocked(exchangeGoogleCode).mockResolvedValueOnce({
      ok: false,
      error: 'Google OAuth unconfigured: GOOGLE_OAUTH_CLIENT_SECRET',
    });
    const route = await import('../route');
    const response = await route.GET(callbackRequest('code=oauth-code&state=signed-state&locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      error: 'Unable to receive the calendar connection token.',
      errorCode: 'token_exchange_failed',
    });
    expect(payload.error).not.toContain('GOOGLE_OAUTH_CLIENT_SECRET');
    expect(encryptToken).not.toHaveBeenCalled();
    expect(saveConnection).not.toHaveBeenCalled();
  });

  it('returns safe localized errors when token encryption fails', async () => {
    vi.mocked(encryptToken).mockImplementationOnce(() => {
      throw new Error('CALENDAR_SYNC_ENCRYPTION_KEY is not configured');
    });
    const route = await import('../route');
    const response = await route.GET(callbackRequest('code=oauth-code&state=signed-state&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      error: '캘린더 연결 토큰을 안전하게 저장할 수 없습니다.',
      errorCode: 'token_encrypt_failed',
    });
    expect(payload.error).not.toContain('CALENDAR_SYNC_ENCRYPTION_KEY');
    expect(saveConnection).not.toHaveBeenCalled();
  });

  it('saves Google callback connections on valid callbacks', async () => {
    const route = await import('../route');
    const response = await route.GET(callbackRequest('code=oauth-code&state=signed-state&locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      connectionId: 'cs_google_staff-route-test',
      provider: 'google',
      staffId: 'staff-route-test',
    });
    expect(verifyOauthState).toHaveBeenCalledWith('signed-state');
    expect(exchangeGoogleCode).toHaveBeenCalledWith('oauth-code');
    expect(exchangeOutlookCode).not.toHaveBeenCalled();
    expect(encryptToken).toHaveBeenCalledWith('google-refresh-token');
    expect(saveConnection).toHaveBeenCalledWith(expect.objectContaining({
      connectionId: 'cs_google_staff-route-test',
      staffId: 'staff-route-test',
      provider: 'google',
      refreshTokenEncrypted: 'encrypted-refresh-token',
      scope: 'https://www.googleapis.com/auth/calendar.events',
      status: 'connected',
      createdAt: '2026-05-04T10:00:00.000Z',
      updatedAt: '2026-05-04T10:00:00.000Z',
    }));
  });

  it('saves Outlook callback connections on valid callbacks', async () => {
    vi.mocked(verifyOauthState).mockReturnValueOnce({ provider: 'outlook', staffId: 'staff-outlook-test' });
    const route = await import('../route');
    const response = await route.GET(callbackRequest('code=outlook-code&state=signed-state&locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      connectionId: 'cs_outlook_staff-outlook-test',
      provider: 'outlook',
      staffId: 'staff-outlook-test',
    });
    expect(exchangeOutlookCode).toHaveBeenCalledWith('outlook-code');
    expect(exchangeGoogleCode).not.toHaveBeenCalled();
    expect(encryptToken).toHaveBeenCalledWith('outlook-refresh-token');
    expect(saveConnection).toHaveBeenCalledWith(expect.objectContaining({
      connectionId: 'cs_outlook_staff-outlook-test',
      staffId: 'staff-outlook-test',
      provider: 'outlook',
      refreshTokenEncrypted: 'encrypted-refresh-token',
      scope: 'offline_access Calendars.ReadWrite',
      status: 'connected',
    }));
  });
});
