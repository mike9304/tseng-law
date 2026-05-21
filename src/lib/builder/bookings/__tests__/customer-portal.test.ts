import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking, BookingService, Staff } from '@/lib/builder/bookings/types';
import { createLocalizedText } from '@/lib/builder/bookings/types';
import { getCustomerBookingPortal } from '@/lib/builder/bookings/customer-portal';

const fixtures = vi.hoisted(() => ({
  bookings: [] as Booking[],
  services: [] as BookingService[],
  staff: [] as Staff[],
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listBookings: vi.fn(async () => fixtures.bookings),
  listServices: vi.fn(async () => fixtures.services),
  listStaff: vi.fn(async () => fixtures.staff),
}));

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: overrides.bookingId ?? `bk-${Math.random().toString(36).slice(2, 8)}`,
    serviceId: 'svc-test',
    staffId: 'staff-test',
    customer: {
      name: 'Client',
      email: 'client@example.com',
      locale: 'ko',
    },
    startAt: '2099-01-05T00:00:00.000Z',
    endAt: '2099-01-05T00:30:00.000Z',
    status: 'confirmed',
    source: 'web',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    reminders: [],
    ...overrides,
  };
}

describe('customer booking portal', () => {
  beforeEach(() => {
    fixtures.services = [{
      serviceId: 'svc-test',
      slug: 'test',
      name: createLocalizedText('상담'),
      description: createLocalizedText('Test'),
      durationMinutes: 30,
      priceTwd: 0,
      staffIds: ['staff-test'],
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      slotStepMinutes: 30,
      isActive: true,
      paymentMode: 'free',
      priceCurrency: 'TWD',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }];
    fixtures.staff = [{
      staffId: 'staff-test',
      name: createLocalizedText('담당 변호사'),
      title: createLocalizedText('Attorney'),
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }];
    fixtures.bookings = [];
  });

  it('returns only bookings matching the member email and splits upcoming from past', async () => {
    fixtures.bookings = [
      booking({ bookingId: 'bk-upcoming', customer: { name: 'Client', email: ' Client@Example.com ', locale: 'ko' } }),
      booking({
        bookingId: 'bk-past',
        startAt: '2026-01-05T00:00:00.000Z',
        endAt: '2026-01-05T00:30:00.000Z',
        status: 'completed',
      }),
      booking({
        bookingId: 'bk-cancelled',
        startAt: '2099-02-05T00:00:00.000Z',
        endAt: '2099-02-05T00:30:00.000Z',
        status: 'cancelled',
      }),
      booking({
        bookingId: 'bk-other',
        customer: { name: 'Other', email: 'other@example.com', locale: 'ko' },
      }),
    ];

    const portal = await getCustomerBookingPortal('client@example.com', 'ko', '2027-01-01T00:00:00.000Z');

    expect(portal.email).toBe('client@example.com');
    expect(portal.upcoming.map((item) => item.bookingId)).toEqual(['bk-upcoming']);
    expect(portal.past.map((item) => item.bookingId)).toEqual(['bk-cancelled', 'bk-past']);
    expect(portal.upcoming[0]).toMatchObject({
      serviceName: '상담',
      staffName: '담당 변호사',
      status: 'confirmed',
    });
    expect(portal.upcoming[0]).not.toHaveProperty('managePath');
    expect(portal.upcoming[0]).not.toHaveProperty('paymentIntentId');
    expect(portal.upcoming[0]).not.toHaveProperty('billingDocuments');
    expect(portal.upcoming[0]).not.toHaveProperty('manualPayments');
  });
});
