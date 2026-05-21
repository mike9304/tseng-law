import { describe, expect, it } from 'vitest';
import {
  buildBookingAnalyticsBundle,
  buildBookingFunnelMetrics,
  buildPeakHourHeatmap,
  buildServiceUtilization,
  buildStaffUtilization,
} from '@/lib/builder/bookings/analytics';
import type { Booking, BookingService, Staff } from '@/lib/builder/bookings/types';

const services: BookingService[] = [
  {
    serviceId: 'svc-30',
    slug: 'svc-30',
    name: { ko: '30분', 'zh-hant': '30分', en: '30 min' },
    description: { ko: '', 'zh-hant': '', en: '' },
    durationMinutes: 30,
    priceTwd: 3000,
    category: 'consultation',
    staffIds: ['staff-a'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  },
  {
    serviceId: 'svc-60',
    slug: 'svc-60',
    name: { ko: '60분', 'zh-hant': '60分', en: '60 min' },
    description: { ko: '', 'zh-hant': '', en: '' },
    durationMinutes: 60,
    priceTwd: 6000,
    category: 'consultation',
    staffIds: ['staff-a', 'staff-b'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  },
];

const staff: Staff[] = [
  {
    staffId: 'staff-a',
    name: { ko: 'A 변호사', 'zh-hant': 'A 律師', en: 'Attorney A' },
    title: { ko: '상담', 'zh-hant': '諮詢', en: 'Counsel' },
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  },
  {
    staffId: 'staff-b',
    name: { ko: 'B 변호사', 'zh-hant': 'B 律師', en: 'Attorney B' },
    title: { ko: '상담', 'zh-hant': '諮詢', en: 'Counsel' },
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  },
];

function booking(partial: Partial<Booking> & Pick<Booking, 'bookingId' | 'startAt' | 'status'>): Booking {
  const startMs = Date.parse(partial.startAt);
  const durationMin = partial.endAt
    ? (Date.parse(partial.endAt) - startMs) / 60_000
    : 30;
  return {
    serviceId: 'svc-30',
    staffId: 'staff-a',
    customer: { name: 'Client', email: 'client@example.com', locale: 'ko' },
    endAt: partial.endAt ?? new Date(startMs + durationMin * 60_000).toISOString(),
    source: 'web',
    reminders: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...partial,
  };
}

describe('buildBookingFunnelMetrics', () => {
  it('counts leads, confirms, and rates', () => {
    const bookings = [
      booking({ bookingId: 'b1', startAt: '2026-05-12T09:00:00.000Z', status: 'pending' }),
      booking({ bookingId: 'b2', startAt: '2026-05-12T10:00:00.000Z', status: 'confirmed' }),
      booking({ bookingId: 'b3', startAt: '2026-05-12T11:00:00.000Z', status: 'completed' }),
      booking({ bookingId: 'b4', startAt: '2026-05-12T12:00:00.000Z', status: 'cancelled' }),
      booking({ bookingId: 'b5', startAt: '2026-05-12T13:00:00.000Z', status: 'no-show' }),
    ];

    const funnel = buildBookingFunnelMetrics(bookings);
    expect(funnel.leads).toBe(5);
    // confirmed includes confirmed + completed + no-show
    expect(funnel.confirmed).toBe(3);
    expect(funnel.completed).toBe(1);
    expect(funnel.cancelled).toBe(1);
    expect(funnel.noShow).toBe(1);
    // lead -> confirm: 3/5 = 60%
    expect(funnel.leadToConfirmRate).toBe(60);
    // lead -> completion: 1/5 = 20%
    expect(funnel.leadToCompletionRate).toBe(20);
    // no-show / confirmed: 1/3 = 33.3%
    expect(funnel.noShowRate).toBe(33.3);
    // cancellation / leads: 1/5 = 20%
    expect(funnel.cancellationRate).toBe(20);
  });

  it('filters by date window, service, and staff', () => {
    const bookings = [
      booking({ bookingId: 'a', startAt: '2026-05-10T09:00:00.000Z', status: 'completed', serviceId: 'svc-30', staffId: 'staff-a' }),
      booking({ bookingId: 'b', startAt: '2026-05-15T09:00:00.000Z', status: 'completed', serviceId: 'svc-60', staffId: 'staff-b' }),
      booking({ bookingId: 'c', startAt: '2026-05-20T09:00:00.000Z', status: 'completed', serviceId: 'svc-30', staffId: 'staff-a' }),
    ];

    const windowed = buildBookingFunnelMetrics(bookings, {
      from: '2026-05-11T00:00:00.000Z',
      to: '2026-05-19T00:00:00.000Z',
    });
    expect(windowed.leads).toBe(1);

    const byService = buildBookingFunnelMetrics(bookings, { serviceId: 'svc-30' });
    expect(byService.leads).toBe(2);

    const byStaff = buildBookingFunnelMetrics(bookings, { staffId: 'staff-b' });
    expect(byStaff.leads).toBe(1);
  });

  it('returns zeroes for an empty input', () => {
    const funnel = buildBookingFunnelMetrics([]);
    expect(funnel.leads).toBe(0);
    expect(funnel.leadToConfirmRate).toBe(0);
    expect(funnel.noShowRate).toBe(0);
  });
});

describe('buildServiceUtilization', () => {
  it('sums booked minutes (excluding cancelled) and reports per service', () => {
    const bookings = [
      booking({
        bookingId: 'a',
        startAt: '2026-05-12T09:00:00.000Z',
        endAt: '2026-05-12T09:30:00.000Z',
        status: 'completed',
        serviceId: 'svc-30',
      }),
      booking({
        bookingId: 'b',
        startAt: '2026-05-12T10:00:00.000Z',
        endAt: '2026-05-12T11:00:00.000Z',
        status: 'completed',
        serviceId: 'svc-60',
      }),
      booking({
        bookingId: 'c',
        startAt: '2026-05-12T11:00:00.000Z',
        endAt: '2026-05-12T11:30:00.000Z',
        status: 'cancelled',
        serviceId: 'svc-30',
      }),
    ];

    const result = buildServiceUtilization(bookings, services, 'ko');
    const svc30 = result.find((row) => row.serviceId === 'svc-30');
    const svc60 = result.find((row) => row.serviceId === 'svc-60');
    expect(svc30?.total).toBe(2);
    expect(svc30?.completed).toBe(1);
    expect(svc30?.bookedMinutes).toBe(30);
    expect(svc30?.completionRate).toBe(50);
    expect(svc60?.bookedMinutes).toBe(60);
    // sorted by booked minutes desc
    expect(result[0].serviceId).toBe('svc-60');
  });
});

describe('buildStaffUtilization', () => {
  it('computes utilizationPercent from capacity', () => {
    const bookings = [
      booking({
        bookingId: 'a',
        startAt: '2026-05-12T09:00:00.000Z',
        endAt: '2026-05-12T10:00:00.000Z',
        status: 'completed',
        staffId: 'staff-a',
      }),
      booking({
        bookingId: 'b',
        startAt: '2026-05-12T11:00:00.000Z',
        endAt: '2026-05-12T12:00:00.000Z',
        status: 'confirmed',
        staffId: 'staff-a',
      }),
    ];

    const result = buildStaffUtilization(bookings, staff, 'ko', {
      capacityMinutesByStaff: { 'staff-a': 480 },
    });
    const a = result.find((row) => row.staffId === 'staff-a');
    expect(a?.bookedMinutes).toBe(120);
    // 120 / 480 = 25%
    expect(a?.utilizationPercent).toBe(25);
  });

  it('returns 0 percent when capacity is missing', () => {
    const bookings = [
      booking({
        bookingId: 'a',
        startAt: '2026-05-12T09:00:00.000Z',
        endAt: '2026-05-12T10:00:00.000Z',
        status: 'completed',
        staffId: 'staff-a',
      }),
    ];
    const result = buildStaffUtilization(bookings, staff, 'ko');
    expect(result[0].utilizationPercent).toBe(0);
  });
});

describe('buildPeakHourHeatmap', () => {
  it('returns cells with counts and maxCount', () => {
    const bookings = [
      booking({ bookingId: 'a', startAt: '2026-05-12T09:00:00.000Z', status: 'confirmed' }), // Tue 09
      booking({ bookingId: 'b', startAt: '2026-05-12T09:30:00.000Z', status: 'completed' }), // Tue 09
      booking({ bookingId: 'c', startAt: '2026-05-13T14:00:00.000Z', status: 'confirmed' }), // Wed 14
      booking({ bookingId: 'd', startAt: '2026-05-12T09:45:00.000Z', status: 'cancelled' }), // excluded
    ];
    const heatmap = buildPeakHourHeatmap(bookings);
    const tue09 = heatmap.cells.find((cell) => cell.dayOfWeek === 2 && cell.hour === 9);
    const wed14 = heatmap.cells.find((cell) => cell.dayOfWeek === 3 && cell.hour === 14);
    expect(tue09?.count).toBe(2);
    expect(wed14?.count).toBe(1);
    expect(heatmap.maxCount).toBe(2);
    expect(heatmap.cells).toHaveLength(2);
  });

  it('returns an empty heatmap for no bookings', () => {
    const heatmap = buildPeakHourHeatmap([]);
    expect(heatmap.cells).toHaveLength(0);
    expect(heatmap.maxCount).toBe(0);
  });
});

describe('buildBookingAnalyticsBundle', () => {
  it('assembles funnel + utilization + heatmap in one call', () => {
    const bookings = [
      booking({
        bookingId: 'a',
        startAt: '2026-05-12T09:00:00.000Z',
        endAt: '2026-05-12T09:30:00.000Z',
        status: 'completed',
        serviceId: 'svc-30',
        staffId: 'staff-a',
      }),
      booking({
        bookingId: 'b',
        startAt: '2026-05-12T10:00:00.000Z',
        endAt: '2026-05-12T11:00:00.000Z',
        status: 'confirmed',
        serviceId: 'svc-60',
        staffId: 'staff-b',
      }),
    ];
    const bundle = buildBookingAnalyticsBundle(bookings, services, staff, 'ko');
    expect(bundle.funnel.leads).toBe(2);
    expect(bundle.serviceUtilization).toHaveLength(2);
    expect(bundle.staffUtilization).toHaveLength(2);
    expect(bundle.peakHours.cells).toHaveLength(2);
  });
});