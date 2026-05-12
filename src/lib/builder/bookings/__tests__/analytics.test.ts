import { describe, expect, it } from 'vitest';
import { buildBookingAnalytics, buildCustomerProfiles } from '@/lib/builder/bookings/analytics';
import type { Booking, BookingService, Staff } from '@/lib/builder/bookings/types';

const service: BookingService = {
  serviceId: 'svc-paid',
  slug: 'paid',
  name: { ko: '유료 상담', 'zh-hant': '付費諮詢', en: 'Paid consult' },
  description: { ko: '', 'zh-hant': '', en: '' },
  durationMinutes: 30,
  priceTwd: 5000,
  priceAmount: 5000,
  priceCurrency: 'TWD',
  paymentMode: 'paid',
  category: 'consultation',
  staffIds: ['staff-a'],
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: 0,
  isActive: true,
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
};

const staff: Staff = {
  staffId: 'staff-a',
  name: { ko: '담당 변호사', 'zh-hant': '律師', en: 'Attorney' },
  title: { ko: '상담', 'zh-hant': '諮詢', en: 'Counsel' },
  isActive: true,
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
};

function booking(partial: Partial<Booking> & Pick<Booking, 'bookingId' | 'startAt' | 'status'>): Booking {
  return {
    serviceId: 'svc-paid',
    staffId: 'staff-a',
    customer: { name: 'Client', email: 'client@example.com', locale: 'ko' },
    endAt: new Date(Date.parse(partial.startAt) + 30 * 60_000).toISOString(),
    source: 'web',
    reminders: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...partial,
  };
}

describe('booking analytics', () => {
  it('summarizes status rates, revenue, and service/staff breakdowns', () => {
    const bookings = [
      booking({ bookingId: 'b1', startAt: '2026-05-13T00:00:00.000Z', status: 'completed', paymentStatus: 'paid' }),
      booking({ bookingId: 'b2', startAt: '2026-05-14T00:00:00.000Z', status: 'cancelled', paymentStatus: 'refunded' }),
      booking({ bookingId: 'b3', startAt: '2026-05-15T00:00:00.000Z', status: 'no-show', paymentStatus: 'partial-refund' }),
      booking({ bookingId: 'b4', startAt: '2026-05-16T00:00:00.000Z', status: 'pending' }),
    ];

    const analytics = buildBookingAnalytics(bookings, [service], [staff], 'ko', Date.parse('2026-05-12T00:00:00.000Z'));

    expect(analytics).toMatchObject({
      total: 4,
      upcoming: 3,
      pending: 1,
      completed: 1,
      cancelled: 1,
      noShow: 1,
      completionRate: 25,
      cancellationRate: 25,
      noShowRate: 25,
      revenueAmount: 7500,
    });
    expect(analytics.byService[0]).toMatchObject({ id: 'svc-paid', label: '유료 상담', total: 4, revenueAmount: 7500 });
    expect(analytics.byStaff[0]).toMatchObject({ id: 'staff-a', label: '담당 변호사', total: 4 });
  });

  it('groups customer profiles by email with next and last booking dates', () => {
    const profiles = buildCustomerProfiles([
      booking({ bookingId: 'old', startAt: '2026-05-10T00:00:00.000Z', status: 'completed' }),
      booking({ bookingId: 'next', startAt: '2026-05-13T00:00:00.000Z', status: 'confirmed' }),
      booking({
        bookingId: 'other',
        startAt: '2026-05-14T00:00:00.000Z',
        status: 'cancelled',
        customer: { name: 'Other', email: 'other@example.com', locale: 'ko' },
      }),
    ], Date.parse('2026-05-12T00:00:00.000Z'));

    expect(profiles).toHaveLength(2);
    expect(profiles.find((profile) => profile.email === 'client@example.com')).toMatchObject({
      totalBookings: 2,
      upcomingBookings: 1,
      completedBookings: 1,
      nextBookingAt: '2026-05-13T00:00:00.000Z',
      lastBookingAt: '2026-05-13T00:00:00.000Z',
      bookingIds: ['old', 'next'],
    });
  });
});
