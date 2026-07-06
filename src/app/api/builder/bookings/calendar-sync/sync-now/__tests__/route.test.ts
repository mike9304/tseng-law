import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { getConnection } from '@/lib/builder/bookings/calendar-sync/storage';
import {
  syncAllConnections,
  syncConnection,
} from '@/lib/builder/bookings/calendar-sync/sync-engine';
import type { CalendarConnection } from '@/lib/builder/bookings/calendar-sync/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/storage', () => ({
  getConnection: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/sync-engine', () => ({
  syncConnection: vi.fn(async () => ({
    ok: true,
    pushed: 1,
    pulled: 0,
    bookingUpdates: 0,
    blockedUpdates: 0,
    reconciliationFeed: [],
    errors: [],
  })),
  syncAllConnections: vi.fn(async () => ({
    ok: true,
    results: [],
  })),
}));

function connection(): CalendarConnection {
  return {
    connectionId: 'cs_google_staff-1',
    staffId: 'staff-1',
    provider: 'google',
    refreshTokenEncrypted: 'encrypted',
    scope: 'https://www.googleapis.com/auth/calendar.events',
    status: 'connected',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  };
}

describe('/api/builder/bookings/calendar-sync/sync-now', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors for missing connection ids', async () => {
    const route = await import('../route');
    const response = await route.POST(
      new NextRequest(
        'https://law.example.test/api/builder/bookings/calendar-sync/sync-now?connectionId=missing&locale=zh-hant',
        { method: 'POST' },
      ),
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '找不到行事曆連線。',
      errorCode: 'connection_not_found',
    });
    expect(syncConnection).not.toHaveBeenCalled();
  });

  it('syncs a specific connection when it exists', async () => {
    const existing = connection();
    vi.mocked(getConnection).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.POST(
      new NextRequest(
        'https://law.example.test/api/builder/bookings/calendar-sync/sync-now?connectionId=cs_google_staff-1&locale=ko',
        { method: 'POST' },
      ),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.result).toEqual(expect.objectContaining({ pushed: 1, pulled: 0 }));
    expect(syncConnection).toHaveBeenCalledWith(existing);
  });

  it('syncs all connections when no connection id is provided', async () => {
    const route = await import('../route');
    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/bookings/calendar-sync/sync-now?locale=en', {
        method: 'POST',
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, results: [] });
    expect(syncAllConnections).toHaveBeenCalled();
    expect(getConnection).not.toHaveBeenCalled();
  });
});
