import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking, StaffAvailability } from '@/lib/builder/bookings/types';
import { dayOfWeeks } from '@/lib/builder/bookings/types';
import type { CalendarConnection, ExternalCalendarEvent } from '@/lib/builder/bookings/calendar-sync/types';

const fixtures = vi.hoisted(() => ({
  availability: null as StaffAvailability | null,
  bookings: new Map<string, Booking>(),
  listBookingsResult: [] as Booking[],
  savedAvailabilities: [] as StaffAvailability[],
  savedBookings: [] as Booking[],
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getBooking: vi.fn(async (bookingId: string) => fixtures.bookings.get(bookingId) ?? null),
  getService: vi.fn(async () => null),
  getStaff: vi.fn(async () => null),
  getStaffAvailability: vi.fn(async (staffId: string) => fixtures.availability ?? {
    staffId,
    weekly: Object.fromEntries([
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ].map((day) => [day, []])),
    blockedDates: [],
    timezone: 'Asia/Seoul',
  }),
  listBookings: vi.fn(async () => fixtures.listBookingsResult),
  saveBooking: vi.fn(async (booking: Booking) => {
    fixtures.bookings.set(booking.bookingId, booking);
    fixtures.savedBookings.push(booking);
  }),
  saveStaffAvailability: vi.fn(async (availability: StaffAvailability) => {
    fixtures.availability = availability;
    fixtures.savedAvailabilities.push(availability);
  }),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-12T00:00:00.000Z',
  })),
}));

import { applyPulledCalendarEvents } from '@/lib/builder/bookings/calendar-sync/sync-engine';

function weekly(): StaffAvailability['weekly'] {
  return Object.fromEntries(dayOfWeeks.map((day) => [day, [{ start: '09:00', end: '17:00' }]])) as StaffAvailability['weekly'];
}

function connection(input: Partial<CalendarConnection> = {}): CalendarConnection {
  return {
    connectionId: 'cs_google_staff-test',
    staffId: 'staff-test',
    provider: 'google',
    refreshTokenEncrypted: 'encrypted',
    scope: 'calendar',
    status: 'connected',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...input,
  };
}

function externalEvent(input: Partial<ExternalCalendarEvent> = {}): ExternalCalendarEvent {
  return {
    provider: 'google',
    externalId: 'evt-1',
    summary: 'External deposition',
    start: '2026-05-18T10:00:00+09:00',
    end: '2026-05-18T11:00:00+09:00',
    status: 'confirmed',
    ...input,
  };
}

function booking(): Booking {
  return {
    bookingId: 'bk-sync',
    serviceId: 'svc-test',
    staffId: 'staff-test',
    customer: { name: 'Client', email: 'client@example.com', locale: 'ko' },
    startAt: '2026-05-18T00:00:00.000Z',
    endAt: '2026-05-18T00:30:00.000Z',
    status: 'confirmed',
    source: 'web',
    reminders: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  };
}

describe('calendar sync pull application', () => {
  beforeEach(() => {
    fixtures.availability = {
      staffId: 'staff-test',
      weekly: weekly(),
      blockedDates: [],
      timezone: 'Asia/Seoul',
    };
    fixtures.bookings = new Map();
    fixtures.listBookingsResult = [];
    fixtures.savedAvailabilities = [];
    fixtures.savedBookings = [];
  });

  it('imports external events as idempotent staff blocked dates', async () => {
    const first = await applyPulledCalendarEvents(connection(), [externalEvent()]);
    expect(first).toEqual({ pulled: 1, bookingUpdates: 0, blockedUpdates: 1 });
    expect(fixtures.availability?.blockedDates).toEqual([
      {
        start: '2026-05-18T01:00:00.000Z',
        end: '2026-05-18T02:00:00.000Z',
        reason: 'External calendar:google:cs_google_staff-test:evt-1:External deposition',
      },
    ]);

    const duplicate = await applyPulledCalendarEvents(connection(), [externalEvent()]);
    expect(duplicate).toEqual({ pulled: 0, bookingUpdates: 0, blockedUpdates: 0 });
    expect(fixtures.savedAvailabilities).toHaveLength(1);

    const moved = await applyPulledCalendarEvents(connection(), [
      externalEvent({ end: '2026-05-18T12:00:00+09:00' }),
    ]);
    expect(moved.blockedUpdates).toBe(1);
    expect(fixtures.availability?.blockedDates[0].end).toBe('2026-05-18T03:00:00.000Z');

    const cancelled = await applyPulledCalendarEvents(connection(), [
      externalEvent({
        status: 'cancelled',
        summary: '(deleted)',
        start: '',
        end: '',
      }),
    ]);
    expect(cancelled).toEqual({ pulled: 1, bookingUpdates: 0, blockedUpdates: 1 });
    expect(fixtures.availability?.blockedDates).toEqual([]);
  });

  it('updates or cancels matching Hojeong bookings when the external event carries a Booking ID', async () => {
    fixtures.bookings.set('bk-sync', booking());

    const rescheduled = await applyPulledCalendarEvents(connection(), [
      externalEvent({
        summary: '[Hojeong] consultation',
        description: 'Booking ID: bk-sync\nMoved by staff',
        start: '2026-05-18T13:00:00+09:00',
        end: '2026-05-18T13:30:00+09:00',
      }),
    ]);

    expect(rescheduled).toEqual({ pulled: 1, bookingUpdates: 1, blockedUpdates: 0 });
    expect(fixtures.bookings.get('bk-sync')).toMatchObject({
      startAt: '2026-05-18T04:00:00.000Z',
      endAt: '2026-05-18T04:30:00.000Z',
      status: 'confirmed',
    });

    const cancelled = await applyPulledCalendarEvents(connection(), [
      externalEvent({
        summary: '[Hojeong] consultation',
        description: 'Booking ID: bk-sync',
        status: 'cancelled',
        start: '',
        end: '',
      }),
    ]);

    expect(cancelled).toEqual({ pulled: 1, bookingUpdates: 1, blockedUpdates: 0 });
    expect(fixtures.bookings.get('bk-sync')).toMatchObject({
      status: 'cancelled',
      cancellationReason: 'Cancelled from google calendar',
    });
  });

  it('uses stored external event mappings for tombstone deletes and ignores stale duplicate push events', async () => {
    fixtures.bookings.set('bk-sync', booking());
    const mappedConnection = connection({
      eventMappings: [{
        bookingId: 'bk-sync',
        externalId: 'evt-mapped',
        lastPushedAt: '2026-05-12T00:00:00.000Z',
      }],
    });

    const stale = await applyPulledCalendarEvents(mappedConnection, [
      externalEvent({
        externalId: 'evt-stale',
        summary: '[Hojeong] old duplicate',
        description: 'Booking ID: bk-sync',
        start: '2026-05-18T15:00:00+09:00',
        end: '2026-05-18T15:30:00+09:00',
      }),
    ]);
    expect(stale).toEqual({ pulled: 0, bookingUpdates: 0, blockedUpdates: 0 });
    expect(fixtures.bookings.get('bk-sync')?.startAt).toBe('2026-05-18T00:00:00.000Z');

    const deleted = await applyPulledCalendarEvents(mappedConnection, [
      externalEvent({
        externalId: 'evt-mapped',
        summary: '(deleted)',
        status: 'cancelled',
        description: undefined,
        start: '',
        end: '',
      }),
    ]);
    expect(deleted).toEqual({ pulled: 1, bookingUpdates: 1, blockedUpdates: 0 });
    expect(fixtures.bookings.get('bk-sync')).toMatchObject({
      status: 'cancelled',
      cancellationReason: 'Cancelled from google calendar',
    });
  });

  it('does not apply provider reschedules that overlap another booking', async () => {
    fixtures.bookings.set('bk-sync', booking());
    fixtures.listBookingsResult = [{
      ...booking(),
      bookingId: 'bk-other',
      startAt: '2026-05-18T04:10:00.000Z',
      endAt: '2026-05-18T04:40:00.000Z',
    }];

    const result = await applyPulledCalendarEvents(connection(), [
      externalEvent({
        summary: '[Hojeong] consultation',
        description: 'Booking ID: bk-sync',
        start: '2026-05-18T13:00:00+09:00',
        end: '2026-05-18T13:30:00+09:00',
      }),
    ]);

    expect(result).toEqual({ pulled: 0, bookingUpdates: 0, blockedUpdates: 0 });
    expect(fixtures.bookings.get('bk-sync')).toMatchObject({
      startAt: '2026-05-18T00:00:00.000Z',
      endAt: '2026-05-18T00:30:00.000Z',
      status: 'confirmed',
    });
  });

  it('skips invalid ranges and Hojeong push echoes without a booking id', async () => {
    const result = await applyPulledCalendarEvents(connection(), [
      externalEvent({ externalId: 'bad', start: 'not-a-date' }),
      externalEvent({ externalId: 'echo', summary: '[Hojeong] pushed event' }),
    ]);

    expect(result).toEqual({ pulled: 0, bookingUpdates: 0, blockedUpdates: 0 });
    expect(fixtures.savedAvailabilities).toEqual([]);
    expect(fixtures.savedBookings).toEqual([]);
  });
});
