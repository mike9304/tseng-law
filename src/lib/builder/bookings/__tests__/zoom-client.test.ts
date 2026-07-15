import { afterEach, describe, expect, it, vi } from 'vitest';

import { createZoomMeeting } from '../zoom-client';

const meetingArgs = {
  topic: 'Initial consultation',
  startTimeISO: '2026-07-13T09:00:00.000Z',
  durationMinutes: 60,
  timezone: 'Asia/Seoul',
  customerEmail: 'client@example.com',
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('createZoomMeeting', () => {
  it('fails closed in production even when every mock override is enabled', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BUILDER_ZOOM_MOCK_ALLOW', '1');
    vi.stubEnv('BUILDER_ZOOM_MOCK_MEETING_LINK', 'https://mock.invalid/private-link');
    vi.stubEnv('BUILDER_ZOOM_MOCK_PATH', '/tmp/zoom-mock.json');
    vi.stubEnv('ZOOM_ACCOUNT_ID', '');
    vi.stubEnv('ZOOM_CLIENT_ID', '');
    vi.stubEnv('ZOOM_CLIENT_SECRET', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await createZoomMeeting(meetingArgs);

    expect(result).toEqual({ ok: false, reason: 'unconfigured' });
    expect(JSON.stringify(result)).not.toContain('mock.invalid');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('retains mock meeting creation outside production', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('BUILDER_ZOOM_MOCK_MEETING_LINK', 'https://meet.example.test/consultation');
    vi.stubEnv('ZOOM_ACCOUNT_ID', '');
    vi.stubEnv('ZOOM_CLIENT_ID', '');
    vi.stubEnv('ZOOM_CLIENT_SECRET', '');

    const result = await createZoomMeeting(meetingArgs);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected development mock meeting');
    expect(result.meetingId).toBe('mock');
    const meetingUrl = new URL(result.meetingLink);
    expect(meetingUrl.origin + meetingUrl.pathname).toBe('https://meet.example.test/consultation');
    expect(meetingUrl.searchParams.get('customerEmail')).toBe(meetingArgs.customerEmail);
  });

  it.each([
    [{ ZOOM_ACCOUNT_ID: '', ZOOM_CLIENT_ID: '', ZOOM_CLIENT_SECRET: '' }, 'unconfigured'],
    [{ ZOOM_ACCOUNT_ID: 'account', ZOOM_CLIENT_ID: '', ZOOM_CLIENT_SECRET: '' }, 'unconfigured'],
    [{ ZOOM_ACCOUNT_ID: '', ZOOM_CLIENT_ID: 'client', ZOOM_CLIENT_SECRET: 'secret' }, 'unconfigured'],
  ] as const)('reports missing and partial credential states coherently', async (credentials, reason) => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ZOOM_ACCOUNT_ID', credentials.ZOOM_ACCOUNT_ID);
    vi.stubEnv('ZOOM_CLIENT_ID', credentials.ZOOM_CLIENT_ID);
    vi.stubEnv('ZOOM_CLIENT_SECRET', credentials.ZOOM_CLIENT_SECRET);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(createZoomMeeting(meetingArgs)).resolves.toEqual({ ok: false, reason });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports token failure only after complete credentials reach the OAuth provider', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ZOOM_ACCOUNT_ID', 'account');
    vi.stubEnv('ZOOM_CLIENT_ID', 'client');
    vi.stubEnv('ZOOM_CLIENT_SECRET', 'secret');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('sensitive OAuth provider diagnostics', { status: 401 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await createZoomMeeting(meetingArgs);

    expect(result).toEqual({ ok: false, reason: 'token' });
    expect(JSON.stringify(result)).not.toContain('sensitive');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('uses the real provider in production and does not expose provider error bodies', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BUILDER_ZOOM_MOCK_ALLOW', '1');
    vi.stubEnv('BUILDER_ZOOM_MOCK_MEETING_LINK', 'https://mock.invalid/private-link');
    vi.stubEnv('ZOOM_ACCOUNT_ID', 'account');
    vi.stubEnv('ZOOM_CLIENT_ID', 'client');
    vi.stubEnv('ZOOM_CLIENT_SECRET', 'secret');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'provider-token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response('sensitive Zoom provider diagnostics', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await createZoomMeeting(meetingArgs);

    expect(result).toEqual({ ok: false, reason: 'meeting' });
    expect(JSON.stringify(result)).not.toContain('sensitive');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toContain('zoom.us/oauth/token');
    expect(fetchMock.mock.calls[1]?.[0]).toBe('https://api.zoom.us/v2/users/me/meetings');
  });

  it('returns the real provider meeting when production credentials are valid', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ZOOM_ACCOUNT_ID', 'account');
    vi.stubEnv('ZOOM_CLIENT_ID', 'client');
    vi.stubEnv('ZOOM_CLIENT_SECRET', 'secret');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'provider-token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        join_url: 'https://zoom.example.test/j/12345',
        id: 12345,
      }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await createZoomMeeting(meetingArgs);

    expect(result).toEqual({
      ok: true,
      meetingLink: 'https://zoom.example.test/j/12345',
      meetingId: '12345',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not expose network error details', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ZOOM_ACCOUNT_ID', 'account');
    vi.stubEnv('ZOOM_CLIENT_ID', 'client');
    vi.stubEnv('ZOOM_CLIENT_SECRET', 'secret');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'provider-token' }), { status: 200 }))
      .mockRejectedValueOnce(new Error('internal network secret'));
    vi.stubGlobal('fetch', fetchMock);

    const result = await createZoomMeeting(meetingArgs);

    expect(result).toEqual({ ok: false, reason: 'network' });
    expect(JSON.stringify(result)).not.toContain('secret');
  });
});
