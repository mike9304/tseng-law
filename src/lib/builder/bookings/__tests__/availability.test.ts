import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking, BookingResource, BookingService, Staff, StaffAvailability } from '@/lib/builder/bookings/types';
import { createLocalizedText, dayOfWeeks } from '@/lib/builder/bookings/types';
import { computeAvailableSlots, isSlotAvailable } from '@/lib/builder/bookings/availability';

const fixtures = vi.hoisted(() => ({
  service: null as BookingService | null,
  staff: [] as Staff[],
  availability: null as StaffAvailability | null,
  bookings: [] as Booking[],
  resources: [] as BookingResource[],
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(async () => fixtures.service),
  getStaff: vi.fn(async (staffId: string) => fixtures.staff.find((member) => member.staffId === staffId) ?? null),
  getStaffAvailability: vi.fn(async () => fixtures.availability),
  listBookings: vi.fn(async (options: { staffId?: string } = {}) =>
    fixtures.bookings.filter((booking) => !options.staffId || booking.staffId === options.staffId),
  ),
  listStaff: vi.fn(async () => fixtures.staff),
  listResources: vi.fn(async () => fixtures.resources),
}));

function weekly(start = '09:00', end = '10:00'): StaffAvailability['weekly'] {
  return Object.fromEntries(dayOfWeeks.map((day) => [day, [{ start, end }]])) as StaffAvailability['weekly'];
}

function makeBooking(startAt: string, endAt: string, overrides: Partial<Booking> = {}): Booking {
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
    ...overrides,
  };
}

function makeResource(overrides: Partial<BookingResource> = {}): BookingResource {
  return {
    resourceId: 'room-a',
    name: createLocalizedText('Room A'),
    description: createLocalizedText('Test room'),
    location: 'Taipei',
    capacity: 4,
    blockedDates: [],
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
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
      maxParticipants: 1,
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
    fixtures.resources = [];
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

  it('converts availability windows with the configured IANA timezone', async () => {
    fixtures.availability = {
      ...fixtures.availability!,
      timezone: 'America/New_York',
    };

    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(slots.map((slot) => slot.startAt)).toEqual([
      '2099-01-05T14:00:00.000Z',
      '2099-01-05T14:15:00.000Z',
      '2099-01-05T14:30:00.000Z',
    ]);
    expect(slots.every((slot) => slot.timezone === 'America/New_York')).toBe(true);
  });

  it('checks slot availability against the staff local date instead of the UTC date', async () => {
    fixtures.availability = {
      ...fixtures.availability!,
      weekly: weekly('23:00', '23:45'),
      timezone: 'America/New_York',
    };

    await expect(isSlotAvailable({
      serviceId: 'svc-test',
      staffId: 'staff-test',
      startAt: '2099-01-06T04:00:00.000Z',
    })).resolves.toBe(true);
  });

  it('applies before and after buffers when checking existing bookings', async () => {
    fixtures.bookings = [
      makeBooking('2099-01-05T00:45:00.000Z', '2099-01-05T01:15:00.000Z'),
    ];

    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(slots.map((slot) => slot.startAt)).toEqual(['2099-01-05T00:00:00.000Z']);
  });

  it('keeps group booking slots open until the service capacity is full', async () => {
    fixtures.service = { ...fixtures.service!, maxParticipants: 2, bufferBeforeMinutes: 0, bufferAfterMinutes: 0 };
    fixtures.bookings = [
      makeBooking('2099-01-05T00:00:00.000Z', '2099-01-05T00:30:00.000Z'),
    ];

    const partiallyFilled = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(partiallyFilled[0]).toMatchObject({
      startAt: '2099-01-05T00:00:00.000Z',
      capacityRemaining: 1,
      capacityTotal: 2,
    });
    expect(partiallyFilled.map((slot) => slot.startAt)).not.toContain('2099-01-05T00:15:00.000Z');

    fixtures.bookings = [
      ...fixtures.bookings,
      makeBooking('2099-01-05T00:00:00.000Z', '2099-01-05T00:30:00.000Z'),
    ];

    const full = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(full.map((slot) => slot.startAt)).not.toContain('2099-01-05T00:00:00.000Z');
  });

  it('blocks slots when a required resource is already booked by another staff member', async () => {
    fixtures.service = { ...fixtures.service!, requiredResourceIds: ['room-a'], bufferBeforeMinutes: 0, bufferAfterMinutes: 0 };
    fixtures.staff = [
      fixtures.staff[0],
      {
        staffId: 'staff-other',
        name: createLocalizedText('Other Attorney'),
        title: createLocalizedText('Attorney'),
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    fixtures.bookings = [
      makeBooking('2099-01-05T00:00:00.000Z', '2099-01-05T00:30:00.000Z', {
        bookingId: 'bk-other-resource',
        staffId: 'staff-other',
        resourceIds: ['room-a'],
      }),
    ];

    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(slots.map((slot) => slot.startAt)).not.toContain('2099-01-05T00:00:00.000Z');
    expect(slots.map((slot) => slot.startAt)).toContain('2099-01-05T00:30:00.000Z');
  });

  it('blocks slots when a required resource has blocked time', async () => {
    fixtures.service = { ...fixtures.service!, requiredResourceIds: ['room-a'], bufferBeforeMinutes: 0, bufferAfterMinutes: 0 };
    fixtures.resources = [makeResource({
      blockedDates: [{
        start: '2099-01-05T00:00:00.000Z',
        end: '2099-01-05T00:30:00.000Z',
        reason: 'Maintenance',
      }],
    })];

    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(slots.map((slot) => slot.startAt)).not.toContain('2099-01-05T00:00:00.000Z');
    expect(slots.map((slot) => slot.startAt)).toContain('2099-01-05T00:30:00.000Z');
  });

  it('applies service buffers when checking required resource blocked time', async () => {
    fixtures.service = { ...fixtures.service!, requiredResourceIds: ['room-a'], bufferBeforeMinutes: 0, bufferAfterMinutes: 15 };
    fixtures.resources = [makeResource({
      blockedDates: [{
        start: '2099-01-05T00:30:00.000Z',
        end: '2099-01-05T00:45:00.000Z',
        reason: 'Room reset',
      }],
    })];

    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(slots.map((slot) => slot.startAt)).not.toContain('2099-01-05T00:00:00.000Z');
  });

  it('ignores blocked time from resources the service does not require', async () => {
    fixtures.service = { ...fixtures.service!, requiredResourceIds: ['room-a'], bufferBeforeMinutes: 0, bufferAfterMinutes: 0 };
    fixtures.resources = [
      makeResource(),
      makeResource({
        resourceId: 'room-b',
        name: createLocalizedText('Room B'),
        blockedDates: [{
          start: '2099-01-05T00:00:00.000Z',
          end: '2099-01-05T00:30:00.000Z',
          reason: 'Private event',
        }],
      }),
    ];

    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(slots.map((slot) => slot.startAt)).toContain('2099-01-05T00:00:00.000Z');
  });

  it('keeps required resource blocked time enforced when excluding the booking being rescheduled', async () => {
    fixtures.service = { ...fixtures.service!, requiredResourceIds: ['room-a'], bufferBeforeMinutes: 0, bufferAfterMinutes: 0 };
    fixtures.resources = [makeResource({
      blockedDates: [{
        start: '2099-01-05T00:00:00.000Z',
        end: '2099-01-05T00:30:00.000Z',
        reason: 'Maintenance',
      }],
    })];
    fixtures.bookings = [
      makeBooking('2099-01-05T00:00:00.000Z', '2099-01-05T00:30:00.000Z', {
        bookingId: 'bk-reschedule',
        resourceIds: ['room-a'],
      }),
    ];

    const slots = await computeAvailableSlots({
      serviceId: 'svc-test',
      staffId: 'staff-test',
      date: '2099-01-05',
      excludeBookingId: 'bk-reschedule',
    });

    expect(slots.map((slot) => slot.startAt)).not.toContain('2099-01-05T00:00:00.000Z');
  });

  it('closes group booking slots with remaining capacity when required resource time is blocked', async () => {
    fixtures.service = {
      ...fixtures.service!,
      maxParticipants: 2,
      requiredResourceIds: ['room-a'],
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
    };
    fixtures.resources = [makeResource({
      blockedDates: [{
        start: '2099-01-05T00:00:00.000Z',
        end: '2099-01-05T00:30:00.000Z',
        reason: 'Maintenance',
      }],
    })];
    fixtures.bookings = [
      makeBooking('2099-01-05T00:00:00.000Z', '2099-01-05T00:30:00.000Z', {
        resourceIds: ['room-a'],
      }),
    ];

    const slots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2099-01-05' });

    expect(slots.map((slot) => slot.startAt)).not.toContain('2099-01-05T00:00:00.000Z');
  });

  it('can exclude the booking being rescheduled from resource conflicts', async () => {
    fixtures.service = {
      ...fixtures.service!,
      staffIds: [],
      requiredResourceIds: ['room-a'],
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
    };
    fixtures.staff = [
      fixtures.staff[0],
      {
        staffId: 'staff-other',
        name: createLocalizedText('Other Attorney'),
        title: createLocalizedText('Attorney'),
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    fixtures.bookings = [
      makeBooking('2099-01-05T00:00:00.000Z', '2099-01-05T00:30:00.000Z', {
        bookingId: 'bk-reschedule',
        resourceIds: ['room-a'],
      }),
    ];

    const blocked = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-other', date: '2099-01-05' });
    const excluded = await computeAvailableSlots({
      serviceId: 'svc-test',
      staffId: 'staff-other',
      date: '2099-01-05',
      excludeBookingId: 'bk-reschedule',
    });

    expect(blocked.map((slot) => slot.startAt)).not.toContain('2099-01-05T00:00:00.000Z');
    expect(excluded.map((slot) => slot.startAt)).toContain('2099-01-05T00:00:00.000Z');
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

  it('excludes automatic public holidays from recurring weekly slots', async () => {
    fixtures.availability = {
      ...fixtures.availability!,
      holidayCalendar: 'kr',
    };

    const normalSlots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2026-10-08' });
    const holidaySlots = await computeAvailableSlots({ serviceId: 'svc-test', staffId: 'staff-test', date: '2026-10-09' });

    expect(normalSlots.length).toBeGreaterThan(0);
    expect(holidaySlots).toEqual([]);
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
