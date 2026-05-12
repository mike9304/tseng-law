import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking, BookingService, Staff, StaffAvailability } from '@/lib/builder/bookings/types';
import { createLocalizedText, dayOfWeeks } from '@/lib/builder/bookings/types';
import { computeAvailableSlots } from '@/lib/builder/bookings/availability';

const fixtures = vi.hoisted(() => ({
  service: null as BookingService | null,
  staff: [] as Staff[],
  availability: null as StaffAvailability | null,
  bookings: [] as Booking[],
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(async () => fixtures.service),
  getStaff: vi.fn(async (staffId: string) => fixtures.staff.find((member) => member.staffId === staffId) ?? null),
  getStaffAvailability: vi.fn(async () => fixtures.availability),
  listBookings: vi.fn(async () => fixtures.bookings),
  listStaff: vi.fn(async () => fixtures.staff),
}));

function weekly(start = '09:00', end = '10:00'): StaffAvailability['weekly'] {
  return Object.fromEntries(dayOfWeeks.map((day) => [day, [{ start, end }]])) as StaffAvailability['weekly'];
}

function makeBooking(startAt: string, endAt: string): Booking {
  return {
    bookingId: `bk-${startAt}`,
    serviceId: 'svc-test',
    staffId: 'staff-test',
    customer: { name: 'Tester', email: 'test@example.com', locale: 'ko' },
    startAt,
    endAt,
    status: 'confirmed',
    source: 'web',
    createdAt: startAt,
    updatedAt: startAt,
    reminders: [],
  };
}

describe('booking availability slots', () => {
  beforeEach(() => {
    fixtures.service = {
      serviceId: 'svc-test',
      slug: 'test',
      name: createLocalizedText('Test consultation'),
      description: createLocalizedText('Test description'),
      durationMinutes: 30,
      priceTwd: 0,
      category: 'consultation',
      staffIds: ['staff-test'],
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 15,
      slotStepMinutes: 15,
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      paymentMode: 'free',
      priceCurrency: 'TWD',
    };
    fixtures.staff = [{
      staffId: 'staff-test',
      name: createLocalizedText('Attorney Test'),
      title: createLocalizedText('Attorney'),
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }];
    fixtures.availability = {
      staffId: 'staff-test',
      weekly: weekly(),
      blockedDates: [],
      timezone: 'Asia/Seoul',
    };
    fixtures.bookings = [];
  });

  it('uses the service booking interval instead of a hard-coded 30 minute step', async () => {
    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(slots.map((slot) => slot.startAt)).toEqual([
      '2099-01-05T00:00:00.000Z',
      '2099-01-05T00:15:00.000Z',
      '2099-01-05T00:30:00.000Z',
    ]);
    expect(slots.every((slot) => slot.timezone === 'Asia/Seoul')).toBe(true);
  });

  it('applies before and after buffers when checking existing bookings', async () => {
    fixtures.bookings = [
      makeBooking('2099-01-05T00:45:00.000Z', '2099-01-05T01:15:00.000Z'),
    ];

    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(slots.map((slot) => slot.startAt)).toEqual(['2099-01-05T00:00:00.000Z']);
  });

  it('excludes imported external calendar busy blocks from public slots', async () => {
    fixtures.availability = {
      ...fixtures.availability!,
      blockedDates: [{
        start: '2099-01-05T00:15:00.000Z',
        end: '2099-01-05T00:45:00.000Z',
        reason: 'External calendar:google:cs_google_staff-test:evt-1:Client meeting',
      }],
    };

    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(slots.map((slot) => slot.startAt)).toEqual([]);
  });

  it('fans out "any staff" requests across eligible active staff only', async () => {
    fixtures.service = { ...fixtures.service!, staffIds: [] };
    fixtures.staff = [
      fixtures.staff[0],
      {
        staffId: 'staff-inactive',
        name: createLocalizedText('Inactive'),
        title: createLocalizedText('Attorney'),
        isActive: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ];

    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'any', date: '2099-01-05' });

    expect(slots).toHaveLength(3);
    expect(slots.every((slot) => slot.staffId === 'staff-test')).toBe(true);
  });
});
