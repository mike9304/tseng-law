import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { listBookings, listServices, listStaff } from '@/lib/builder/bookings/storage';
import { buildBookingAnalyticsBundle } from '@/lib/builder/bookings/analytics';
import type { Booking, BookingService } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listBookings: vi.fn(async () => []),
  listServices: vi.fn(async () => []),
  listStaff: vi.fn(async () => []),
}));

vi.mock('@/lib/builder/bookings/analytics', () => ({
  buildBookingAnalyticsBundle: vi.fn(() => ({
    funnel: {},
    sourceFunnel: [],
    trend: [],
    serviceUtilization: [],
    staffUtilization: [],
    heatmap: [],
  })),
}));

function service(serviceId: string): BookingService {
  return {
    serviceId,
    slug: serviceId,
    name: { ko: serviceId, 'zh-hant': serviceId, en: serviceId },
    description: { ko: '', 'zh-hant': '', en: '' },
    durationMinutes: 30,
    staffIds: ['staff-1'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    paymentMode: 'paid',
    priceAmount: 5000,
    priceCurrency: 'TWD',
  };
}

function booking(overrides: Pick<Booking, 'bookingId' | 'serviceId'> & Partial<Booking>): Booking {
  return {
    staffId: 'staff-1',
    customer: { name: 'Client', email: 'client@example.com', locale: 'ko' },
    startAt: '2026-05-10T09:00:00.000Z',
    endAt: '2026-05-10T09:30:00.000Z',
    status: 'completed',
    source: 'web',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    reminders: [],
    ...overrides,
  };
}

describe('/api/builder/bookings/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
  });

  it('requires view-bookings and short-circuits storage when permission is denied', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: view-bookings' }, { status: 403 }),
    );
    const route = await import('../route');
    const request = new NextRequest('https://law.example.test/api/builder/bookings/analytics');
    const response = await route.GET(request);

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'view-bookings');
    expect(listBookings).not.toHaveBeenCalled();
    expect(listServices).not.toHaveBeenCalled();
    expect(listStaff).not.toHaveBeenCalled();
  });

  it('returns a default-locale payload when the locale query is unsupported', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/analytics?locale=fr'),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-bookings',
    );
    expect(payload).toEqual({
      error: '지원하지 않는 언어입니다.',
      errorCode: 'unknown_locale',
    });
    expect(listBookings).not.toHaveBeenCalled();
    expect(buildBookingAnalyticsBundle).not.toHaveBeenCalled();
  });

  it('returns zh-hant payloads for invalid from timestamps', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/analytics?locale=zh-hant&from=nope'),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.errorCode).toBe('invalid_from_timestamp');
    expect(payload.error).toBe('請確認開始時間。');
    expect(payload.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
    expect(listBookings).not.toHaveBeenCalled();
  });

  it('returns en payloads for invalid to timestamps', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/analytics?locale=en&to=nope'),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: 'Check the to timestamp.',
      errorCode: 'invalid_to_timestamp',
    });
    expect(listBookings).not.toHaveBeenCalled();
  });

  it('passes locale into the analytics bundle on valid requests', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/analytics?locale=zh-hant&from=2026-05-01T00%3A00%3A00.000Z&to=2026-05-31T00%3A00%3A00.000Z'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.locale).toBe('zh-hant');
    expect(payload.paymentAttribution).toEqual([]);
    expect(listBookings).toHaveBeenCalledWith({
      from: '2026-05-01T00:00:00.000Z',
      to: '2026-05-31T00:00:00.000Z',
      staffId: undefined,
      includeCancelled: true,
    });
    expect(listServices).toHaveBeenCalledWith(true);
    expect(listStaff).toHaveBeenCalledWith(true);
    expect(buildBookingAnalyticsBundle).toHaveBeenCalledWith(
      [],
      [],
      [],
      'zh-hant',
      expect.objectContaining({
        from: '2026-05-01T00:00:00.000Z',
        to: '2026-05-31T00:00:00.000Z',
      }),
    );
  });

  it('scopes analytics bundle and payment attribution to the requested service', async () => {
    const targetBooking = booking({
      bookingId: 'target-stripe',
      serviceId: 'svc-target',
      paymentIntentId: 'pi_target',
      paymentStatus: 'paid',
      onlinePaidAmount: 5000,
    });
    const otherBooking = booking({
      bookingId: 'other-manual',
      serviceId: 'svc-other',
      paymentStatus: 'partially_paid',
      manualPayments: [{
        paymentId: 'manual-other',
        amountCents: 7000,
        currency: 'TWD',
        method: 'bank_transfer',
        status: 'succeeded',
        actor: 'admin',
        createdAt: '2026-05-10T10:00:00.000Z',
      }],
    });
    vi.mocked(listBookings).mockResolvedValueOnce([targetBooking, otherBooking]);
    vi.mocked(listServices).mockResolvedValueOnce([service('svc-target'), service('svc-other')]);

    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/analytics?serviceId=svc-target&locale=en'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(buildBookingAnalyticsBundle).toHaveBeenCalledWith(
      [targetBooking],
      expect.any(Array),
      [],
      'en',
      expect.objectContaining({ serviceId: 'svc-target' }),
    );
    expect(payload.paymentAttribution).toEqual([
      expect.objectContaining({
        provider: 'stripe',
        total: 1,
        paidBookings: 1,
        revenueAmount: 5000,
      }),
    ]);
  });
});
