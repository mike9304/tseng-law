import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking } from '@/lib/builder/bookings/types';
import type { CalendarConnection } from '@/lib/builder/bookings/calendar-sync/types';

const fixtures = vi.hoisted(() => ({
  bookings: [] as Booking[],
  googleEvents: [] as Array<{ provider: 'google'; externalId: string; summary: string; start: string; end: string; status: 'confirmed' | 'cancelled'; description?: string; bookingId?: string }>,
  savedConnections: [] as CalendarConnection[],
}));

const mocks = vi.hoisted(() => ({
  googleRefresh: vi.fn(async () => ({ ok: true as const, accessToken: 'token-google' })),
  googleList: vi.fn(async (): Promise<{ ok: true; events: typeof fixtures.googleEvents } | { ok: false; error: string }> => ({ ok: true as const, events: fixtures.googleEvents })),
  googlePush: vi.fn(async () => ({ ok: true as const, id: 'evt-google' })),
  googleUpdate: vi.fn(async () => ({ ok: true as const, id: 'evt-google' })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getBooking: vi.fn(async (bookingId: string) => fixtures.bookings.find((booking) => booking.bookingId === bookingId) ?? null),
  getService: vi.fn(async () => null),
  getStaff: vi.fn(async () => null),
  getStaffAvailability: vi.fn(async () => ({
    staffId: 'staff-test',
    weekly: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    blockedDates: [],
    timezone: 'Asia/Seoul',
  })),
  listBookings: vi.fn(async () => fixtures.bookings),
  saveBooking: vi.fn(async () => undefined),
  saveStaffAvailability: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-12T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/storage', () => ({
  listConnections: vi.fn(async () => []),
  saveConnection: vi.fn(async (connection: CalendarConnection) => {
    fixtures.savedConnections.push(connection);
  }),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/google', () => ({
  refreshGoogleAccessToken: mocks.googleRefresh,
  listEventsFromGoogle: mocks.googleList,
  pushEventToGoogle: mocks.googlePush,
  updateEventInGoogle: mocks.googleUpdate,
}));

vi.mock('@/lib/builder/bookings/calendar-sync/outlook', () => ({
  refreshOutlookAccessToken: vi.fn(async () => ({ ok: true as const, accessToken: 'token-outlook' })),
  listEventsFromOutlook: vi.fn(async () => ({ ok: true as const, events: [] })),
  pushEventToOutlook: vi.fn(async () => ({ ok: true as const, id: 'evt-outlook' })),
  updateEventInOutlook: vi.fn(async () => ({ ok: true as const, id: 'evt-outlook' })),
}));

import { syncConnection } from '@/lib/builder/bookings/calendar-sync/sync-engine';

function connection(input: Partial<CalendarConnection> = {}): CalendarConnection {
  return {
    connectionId: 'cs_google_staff-test',
    staffId: 'staff-test',
    provider: 'google',
    refreshTokenEncrypted: 'encrypted',
    scope: 'https://www.googleapis.com/auth/calendar.events',
    status: 'connected',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...input,
  };
}

describe('calendar sync QA summary', () => {
  beforeEach(() => {
    fixtures.bookings.length = 0;
    fixtures.googleEvents.length = 0;
    fixtures.savedConnections = [];
    mocks.googleRefresh.mockReset().mockResolvedValue({ ok: true as const, accessToken: 'token-google' });
    mocks.googleList.mockReset().mockResolvedValue({ ok: true as const, events: fixtures.googleEvents });
    mocks.googlePush.mockReset().mockResolvedValue({ ok: true as const, id: 'evt-google' });
    mocks.googleUpdate.mockReset().mockResolvedValue({ ok: true as const, id: 'evt-google' });
  });

  it('persists the latest sync result on the connection record', async () => {
    const result = await syncConnection(connection());

    expect(result).toEqual({ ok: true, pushed: 0, pulled: 0, bookingUpdates: 0, blockedUpdates: 0, reconciliationFeed: [], errors: [] });
    expect(fixtures.savedConnections).toHaveLength(1);
    expect(fixtures.savedConnections[0]).toMatchObject({
      status: 'connected',
      lastError: undefined,
      lastSyncResult: {
        ok: true,
        pushed: 0,
        pulled: 0,
        bookingUpdates: 0,
        blockedUpdates: 0,
        reconciliationFeed: [],
        errors: [],
      },
    });
    expect(fixtures.savedConnections[0].lastSyncedAt).toBeTruthy();
  });

  it('records booking and block reconciliation counts from the provider pull', async () => {
    fixtures.bookings.push({
      bookingId: 'bk-1',
      serviceId: 'svc-1',
      staffId: 'staff-test',
      customer: { name: 'Customer', email: 'customer@example.com' },
      status: 'confirmed',
      startAt: '2026-05-31T08:00:00.000Z',
      endAt: '2026-05-31T09:00:00.000Z',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-01T00:00:00.000Z',
    } as Booking);
    fixtures.googleEvents.push(
      {
        provider: 'google',
        externalId: 'external-booking',
        summary: 'Booking update',
        start: '2026-05-31T08:30:00.000Z',
        end: '2026-05-31T09:30:00.000Z',
        status: 'confirmed',
        description: 'Booking ID: bk-1',
        bookingId: 'bk-1',
      },
      {
        provider: 'google',
        externalId: 'external-block',
        summary: 'Team offsite',
        start: '2026-05-31T11:00:00.000Z',
        end: '2026-05-31T12:00:00.000Z',
        status: 'confirmed',
      },
    );

    const result = await syncConnection(connection());

    expect(result.bookingUpdates).toBe(1);
    expect(result.blockedUpdates).toBe(1);
    expect(result.reconciliationFeed).toEqual([
      expect.objectContaining({ kind: 'booking', status: 'updated', bookingId: 'bk-1' }),
      expect.objectContaining({ kind: 'block', status: 'created' }),
    ]);
    expect(fixtures.savedConnections[0]).toMatchObject({
      lastSyncResult: {
        bookingUpdates: 1,
        blockedUpdates: 1,
        reconciliationFeed: [
          expect.objectContaining({ kind: 'booking', status: 'updated', bookingId: 'bk-1' }),
          expect.objectContaining({ kind: 'block', status: 'created' }),
        ],
      },
    });
  });

  it('records provider API failures in the reconciliation feed', async () => {
    mocks.googleList.mockImplementationOnce(async () => ({ ok: false as const, error: 'Google calendarView 500' } as const));

    const result = await syncConnection(connection());

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([{ kind: 'pull', message: 'Google calendarView 500' }]);
    expect(result.reconciliationFeed).toEqual([
      expect.objectContaining({
        kind: 'block',
        status: 'error',
        source: 'pull',
        summary: 'google pull failed',
        note: 'Google calendarView 500',
      }),
    ]);
    expect(fixtures.savedConnections[0]).toMatchObject({
      status: 'error',
      lastError: 'Google calendarView 500',
      lastSyncResult: {
        ok: false,
        errors: [{ kind: 'pull', message: 'Google calendarView 500' }],
        reconciliationFeed: [
          expect.objectContaining({
            kind: 'block',
            status: 'error',
            source: 'pull',
            summary: 'google pull failed',
            note: 'Google calendarView 500',
          }),
        ],
      },
    });
  });
});
