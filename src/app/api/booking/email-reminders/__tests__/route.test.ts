import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import {
  appendBookingReminderMarker,
  getService,
  getStaff,
  listBookings,
} from '@/lib/builder/bookings/storage';
import { renderBookingEmail } from '@/lib/builder/bookings/email-templates';
import { reminderWindowsForService } from '@/lib/builder/bookings/reminders';
import type { Booking } from '@/lib/builder/bookings/types';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/cron-auth', () => ({
  isCronAuthorized: vi.fn(() => false),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(async () => null),
  getStaff: vi.fn(async () => null),
  listBookings: vi.fn(async () => []),
  appendBookingReminderMarker: vi.fn(async (bookingId, marker) => ({
    ok: true,
    booking: booking({ bookingId, reminders: [marker] }),
  })),
}));

vi.mock('@/lib/builder/bookings/email-templates', () => ({
  renderBookingEmail: vi.fn(async () => ({ subject: 'Reminder', html: '<p>Reminder</p>', text: 'Reminder' })),
}));

vi.mock('@/lib/builder/bookings/reminders', () => ({
  reminderWindowsForService: vi.fn(() => [{
    type: 'email-reminder-24h',
    hoursAhead: 24,
    toleranceMinutes: 10,
  }]),
}));

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-reminder-1',
    serviceId: 'svc-1',
    staffId: 'staff-1',
    customer: { name: 'Client', email: 'client@example.test', locale: 'ko' },
    startAt: '2026-07-14T00:00:00.000Z',
    endAt: '2026-07-14T01:00:00.000Z',
    status: 'confirmed',
    source: 'web',
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    reminders: [],
    ...overrides,
  };
}

function request(method: 'GET' | 'POST' = 'POST'): NextRequest {
  return new NextRequest('https://law.example.test/api/booking/email-reminders', { method });
}

describe('/api/booking/email-reminders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-13T00:00:00.000Z'));
    vi.mocked(isCronAuthorized).mockReturnValue(true);
    vi.mocked(listBookings).mockResolvedValue([booking()]);
    vi.mocked(getService).mockResolvedValue(null);
    vi.mocked(getStaff).mockResolvedValue(null);
    vi.mocked(appendBookingReminderMarker).mockImplementation(async (bookingId, marker) => ({
      ok: true,
      booking: booking({ bookingId, reminders: [marker] }),
    }));
    vi.mocked(renderBookingEmail).mockResolvedValue({ subject: 'Reminder', html: '<p>Reminder</p>', text: 'Reminder' });
    vi.mocked(reminderWindowsForService).mockReturnValue([{
      type: 'email-reminder-24h',
      hoursAhead: 24,
      toleranceMinutes: 10,
    }]);
    process.env.RESEND_API_KEY = 'resend-secret';
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ id: 'email-1' }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    })));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    delete process.env.RESEND_API_KEY;
  });

  it('keeps the POST and GET authorization boundary', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);

    const post = await POST(request('POST'));
    const get = await GET(request('GET'));

    expect(post.status).toBe(401);
    expect(get.status).toBe(401);
    expect(listBookings).not.toHaveBeenCalled();
  });

  it('records a reminder marker only after accepted delivery', async () => {
    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ ok: true, scanned: 1, sent: 1, failed: 0, errors: [] });
    expect(appendBookingReminderMarker).toHaveBeenCalledWith('bk-reminder-1', {
      sentAt: '2026-07-13T00:00:00.000Z',
      type: 'email-reminder-24h',
    });
  });

  it('reuses the same provider idempotency key across concurrent cron retries', async () => {
    const fetchMock = vi.mocked(fetch);

    const [first, second] = await Promise.all([POST(request()), POST(request())]);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    const keys = fetchMock.mock.calls.map((call) => (
      (call[1]?.headers as Record<string, string>)['Idempotency-Key']
    ));
    expect(keys).toHaveLength(2);
    expect(keys[0]).toBe(keys[1]);
    expect(keys[0]).not.toContain('bk-reminder-1');
    expect(keys[0]).not.toContain('client@example.test');
  });

  it('keeps all markers when multiple reminder windows are due', async () => {
    vi.mocked(reminderWindowsForService).mockReturnValue([
      { type: 'email-reminder-24h', hoursAhead: 24, toleranceMinutes: 10 },
      { type: 'email-reminder-1h', hoursAhead: 24, toleranceMinutes: 10 },
    ]);
    vi.mocked(appendBookingReminderMarker)
      .mockResolvedValueOnce({
        ok: true,
        booking: booking({
          reminders: [{ sentAt: '2026-07-13T00:00:00.000Z', type: 'email-reminder-24h' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        booking: booking({
          reminders: [
            { sentAt: '2026-07-13T00:00:00.000Z', type: 'email-reminder-24h' },
            { sentAt: '2026-07-13T00:00:00.000Z', type: 'email-reminder-1h' },
          ],
        }),
      });

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(appendBookingReminderMarker).toHaveBeenCalledTimes(2);
  });

  it('uses the latest booking returned by marker persistence without writing a stale snapshot', async () => {
    vi.mocked(reminderWindowsForService).mockReturnValue([
      { type: 'email-reminder-24h', hoursAhead: 24, toleranceMinutes: 10 },
      { type: 'email-reminder-1h', hoursAhead: 24, toleranceMinutes: 10 },
    ]);
    const latestCancelled = booking({
      status: 'cancelled',
      paymentStatus: 'paid',
      cancellationReason: 'client request',
      reminders: [{ sentAt: '2026-07-13T00:00:00.000Z', type: 'email-reminder-24h' }],
    });
    vi.mocked(appendBookingReminderMarker)
      .mockResolvedValueOnce({ ok: true, booking: latestCancelled })
      .mockResolvedValueOnce({
        ok: true,
        booking: {
          ...latestCancelled,
          reminders: [
            ...latestCancelled.reminders,
            { sentAt: '2026-07-13T00:00:00.000Z', type: 'email-reminder-1h' },
          ],
        },
      });

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(appendBookingReminderMarker).toHaveBeenNthCalledWith(1, 'bk-reminder-1', {
      sentAt: '2026-07-13T00:00:00.000Z',
      type: 'email-reminder-24h',
    });
    expect(appendBookingReminderMarker).toHaveBeenNthCalledWith(2, 'bk-reminder-1', {
      sentAt: '2026-07-13T00:00:00.000Z',
      type: 'email-reminder-1h',
    });
    expect(vi.mocked(renderBookingEmail).mock.calls[1]?.[1]).toMatchObject({
      status: 'cancelled',
      paymentStatus: 'paid',
      cancellationReason: 'client request',
    });
  });

  it('returns mixed success and provider failures as a non-2xx partial result', async () => {
    vi.mocked(listBookings).mockResolvedValue([
      booking({ bookingId: 'bk-success' }),
      booking({ bookingId: 'bk-provider-failure' }),
    ]);
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response('{}', { status: 202 }))
      .mockResolvedValueOnce(new Response('provider details', { status: 429 })));

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toMatchObject({ ok: false, scanned: 2, sent: 1, failed: 1 });
    expect(payload.errors).toEqual([{
      bookingId: 'bk-provider-failure',
      type: 'email-reminder-24h',
      reason: 'provider_error',
    }]);
    expect(appendBookingReminderMarker).toHaveBeenCalledTimes(1);
  });

  it('isolates per-booking metadata failures and preserves successful counts', async () => {
    vi.mocked(listBookings).mockResolvedValue([
      booking({ bookingId: 'bk-metadata-failure' }),
      booking({ bookingId: 'bk-success' }),
    ]);
    vi.mocked(getService)
      .mockRejectedValueOnce(new Error('private storage details'))
      .mockResolvedValueOnce(null);

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toMatchObject({ ok: false, scanned: 2, sent: 1, failed: 1 });
    expect(payload.errors).toEqual([{
      bookingId: 'bk-metadata-failure',
      type: 'metadata',
      reason: 'internal_error',
    }]);
    expect(appendBookingReminderMarker).toHaveBeenCalledTimes(1);
  });

  it('returns 503 and does not mark delivery when Resend is unconfigured', async () => {
    delete process.env.RESEND_API_KEY;

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toMatchObject({
      ok: false,
      sent: 0,
      failed: 1,
      errors: [{ bookingId: 'bk-reminder-1', type: 'email-reminder-24h', reason: 'unconfigured' }],
    });
    expect(appendBookingReminderMarker).not.toHaveBeenCalled();
  });

  it('returns 502 and does not mark provider delivery failures', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('provider details', { status: 429 })));

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.errors).toEqual([
      { bookingId: 'bk-reminder-1', type: 'email-reminder-24h', reason: 'provider_error' },
    ]);
    expect(appendBookingReminderMarker).not.toHaveBeenCalled();
  });

  it('reports accepted delivery followed by marker failure as a 500', async () => {
    vi.mocked(appendBookingReminderMarker).mockRejectedValue(new Error('storage secret'));

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toMatchObject({
      ok: false,
      sent: 0,
      failed: 1,
      errors: [{
        bookingId: 'bk-reminder-1',
        type: 'email-reminder-24h',
        reason: 'marker_persist_failed_after_delivery',
      }],
    });
  });

  it('sanitizes render and other internal delivery exceptions as a 500', async () => {
    vi.mocked(renderBookingEmail).mockRejectedValue(new Error('template contained private data'));

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.errors).toEqual([{
      bookingId: 'bk-reminder-1',
      type: 'email-reminder-24h',
      reason: 'internal_error',
    }]);
    expect(appendBookingReminderMarker).not.toHaveBeenCalled();
  });

  it('returns a successful no-op when there are no due bookings', async () => {
    vi.mocked(listBookings).mockResolvedValue([]);

    const response = await GET(request('GET'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, scanned: 0, sent: 0, failed: 0, skipped: 0, errors: [] });
    expect(renderBookingEmail).not.toHaveBeenCalled();
  });
});
