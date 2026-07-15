import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import {
  appendBookingReminderMarker,
  getService,
  listBookings,
} from '@/lib/builder/bookings/storage';
import { sendSms } from '@/lib/builder/bookings/sms-client';
import { reminderWindowsForService } from '@/lib/builder/bookings/reminders';
import type { Booking } from '@/lib/builder/bookings/types';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/cron-auth', () => ({
  isCronAuthorized: vi.fn(() => false),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  appendBookingReminderMarker: vi.fn(),
  getService: vi.fn(async () => null),
  listBookings: vi.fn(async () => []),
}));

vi.mock('@/lib/builder/bookings/sms-client', () => ({
  sendSms: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/reminders', () => ({
  reminderWindowsForService: vi.fn(() => [{
    type: 'sms-reminder-24h',
    hoursAhead: 24,
    toleranceMinutes: 10,
  }]),
}));

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-sms-1',
    serviceId: 'svc-1',
    staffId: 'staff-1',
    customer: {
      name: 'Client',
      email: 'client@example.test',
      phone: '+821012345678',
      locale: 'ko',
    },
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
  return new NextRequest('https://law.example.test/api/booking/sms-reminders', { method });
}

describe('/api/booking/sms-reminders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-13T00:00:00.000Z'));
    vi.mocked(isCronAuthorized).mockReturnValue(true);
    vi.mocked(listBookings).mockResolvedValue([booking()]);
    vi.mocked(getService).mockResolvedValue(null);
    vi.mocked(reminderWindowsForService).mockReturnValue([{
      type: 'sms-reminder-24h',
      hoursAhead: 24,
      toleranceMinutes: 10,
    }]);
    vi.mocked(sendSms).mockResolvedValue({ ok: true, sid: 'SM-test' });
    vi.mocked(appendBookingReminderMarker).mockImplementation(async (bookingId, marker) => ({
      ok: true,
      booking: booking({ bookingId, reminders: [marker] }),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps the POST and GET authorization boundary', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);

    const post = await POST(request('POST'));
    const get = await GET(request('GET'));

    expect(post.status).toBe(401);
    expect(get.status).toBe(401);
    expect(listBookings).not.toHaveBeenCalled();
  });

  it('sends and records a marker only after accepted delivery', async () => {
    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      scanned: 1,
      sent: 1,
      failed: 0,
      skipped: 0,
      errors: [],
    });
    expect(appendBookingReminderMarker).toHaveBeenCalledWith('bk-sms-1', {
      sentAt: '2026-07-13T00:00:00.000Z',
      type: 'sms-reminder-24h',
    });
  });

  it('supports authorized GET with the same successful dispatch semantics', async () => {
    const response = await GET(request('GET'));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, sent: 1, failed: 0 });
  });

  it('returns 503 and a sanitized failure when Twilio is unconfigured', async () => {
    vi.mocked(sendSms).mockResolvedValue({
      ok: false,
      reason: 'unconfigured',
      details: 'TWILIO_AUTH_TOKEN was absent',
    });

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toMatchObject({ ok: false, scanned: 1, sent: 0, failed: 1 });
    expect(payload.errors).toEqual([{
      bookingId: 'bk-sms-1',
      type: 'sms-reminder-24h',
      reason: 'unconfigured',
    }]);
    expect(JSON.stringify(payload)).not.toContain('TWILIO_AUTH_TOKEN');
    expect(appendBookingReminderMarker).not.toHaveBeenCalled();
  });

  it('returns 502 and hides provider details when SMS delivery fails', async () => {
    vi.mocked(sendSms).mockResolvedValue({
      ok: false,
      reason: 'send',
      details: 'provider response contained private data',
    });

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.errors).toEqual([{
      bookingId: 'bk-sms-1',
      type: 'sms-reminder-24h',
      reason: 'provider_error',
    }]);
    expect(JSON.stringify(payload)).not.toContain('private data');
    expect(appendBookingReminderMarker).not.toHaveBeenCalled();
  });

  it('isolates per-booking failures and keeps mixed result counts', async () => {
    vi.mocked(listBookings).mockResolvedValue([
      booking({ bookingId: 'bk-provider-failure' }),
      booking({ bookingId: 'bk-success' }),
    ]);
    vi.mocked(sendSms)
      .mockResolvedValueOnce({ ok: false, reason: 'network', details: 'socket secret' })
      .mockResolvedValueOnce({ ok: true, sid: 'SM-success' });

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toMatchObject({ ok: false, scanned: 2, sent: 1, failed: 1, skipped: 0 });
    expect(payload.errors).toEqual([{
      bookingId: 'bk-provider-failure',
      type: 'sms-reminder-24h',
      reason: 'provider_error',
    }]);
    expect(appendBookingReminderMarker).toHaveBeenCalledTimes(1);
  });

  it('returns 500 for metadata failures without exposing internal details', async () => {
    vi.mocked(getService).mockRejectedValue(new Error('storage path and customer data'));

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.errors).toEqual([{
      bookingId: 'bk-sms-1',
      type: 'metadata',
      reason: 'internal_error',
    }]);
    expect(JSON.stringify(payload)).not.toContain('storage path');
    expect(sendSms).not.toHaveBeenCalled();
  });

  it('returns 500 when delivery succeeds but marker persistence fails', async () => {
    vi.mocked(appendBookingReminderMarker).mockRejectedValue(new Error('private storage details'));

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toMatchObject({ ok: false, sent: 0, failed: 1 });
    expect(payload.errors).toEqual([{
      bookingId: 'bk-sms-1',
      type: 'sms-reminder-24h',
      reason: 'marker_persist_failed_after_delivery',
    }]);
    expect(JSON.stringify(payload)).not.toContain('private storage');
  });

  it('returns a successful no-op when there are no due bookings', async () => {
    vi.mocked(listBookings).mockResolvedValue([]);

    const response = await GET(request('GET'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, scanned: 0, sent: 0, failed: 0, skipped: 0, errors: [] });
    expect(sendSms).not.toHaveBeenCalled();
  });
});
