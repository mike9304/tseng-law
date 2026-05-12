import { describe, expect, it, vi } from 'vitest';
import { listEventsFromGoogle } from '@/lib/builder/bookings/calendar-sync/google';
import { listEventsFromOutlook } from '@/lib/builder/bookings/calendar-sync/outlook';

function jsonFetch(payload: unknown, status = 200): typeof fetch {
  return vi.fn(async () =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  ) as unknown as typeof fetch;
}

function jsonSequenceFetch(payloads: unknown[]): typeof fetch {
  const queue = [...payloads];
  return vi.fn(async () => {
    const payload = queue.shift() ?? {};
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch;
}

describe('calendar provider event mappers', () => {
  it('normalizes Google timed events, follows pages, and skips all-day/free events', async () => {
    const fetchImpl = jsonSequenceFetch([{
      items: [
        {
          id: 'g-1',
          summary: 'Client meeting',
          description: 'Busy window',
          start: { dateTime: '2026-05-18T10:00:00+09:00' },
          end: { dateTime: '2026-05-18T11:00:00+09:00' },
          attendees: [{ email: 'client@example.com' }],
          htmlLink: 'https://calendar.google.com/event?eid=g-1',
          extendedProperties: { private: { hojeongBookingId: 'bk-123' } },
        },
        {
          id: 'g-all-day',
          summary: 'All day',
          start: { date: '2026-05-18' },
          end: { date: '2026-05-19' },
        },
        {
          id: 'g-free',
          summary: 'Free hold',
          transparency: 'transparent',
          start: { dateTime: '2026-05-18T12:00:00+09:00' },
          end: { dateTime: '2026-05-18T13:00:00+09:00' },
        },
      ],
      nextPageToken: 'page-2',
    }, {
      items: [
        {
          id: 'g-cancelled',
          status: 'cancelled',
        },
      ],
    }]);

    const result = await listEventsFromGoogle('access-token', {
      timeMin: '2026-05-18T00:00:00.000Z',
      timeMax: '2026-05-19T00:00:00.000Z',
    }, fetchImpl);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events).toHaveLength(2);
    expect(result.events[0]).toMatchObject({
      provider: 'google',
      externalId: 'g-1',
      summary: 'Client meeting',
      start: '2026-05-18T01:00:00.000Z',
      end: '2026-05-18T02:00:00.000Z',
      attendees: ['client@example.com'],
      status: 'confirmed',
      bookingId: 'bk-123',
    });
    expect(result.events[1]).toMatchObject({
      provider: 'google',
      externalId: 'g-cancelled',
      status: 'cancelled',
      start: '',
      end: '',
    });
  });

  it('normalizes Outlook calendarView events, follows pages, and skips all-day/free events', async () => {
    const fetchImpl = jsonSequenceFetch([{
      value: [
        {
          id: 'o-1',
          subject: 'Court prep',
          bodyPreview: 'Booking ID: bk-123',
          start: { dateTime: '2026-05-18T01:00:00.0000000', timeZone: 'UTC' },
          end: { dateTime: '2026-05-18T02:00:00.0000000', timeZone: 'UTC' },
          attendees: [{ emailAddress: { address: 'client@example.com' } }],
          isCancelled: true,
          webLink: 'https://outlook.office.com/calendar/item/o-1',
        },
        {
          id: 'o-all-day',
          subject: 'All day',
          start: { dateTime: '2026-05-18T00:00:00.0000000', timeZone: 'UTC' },
          end: { dateTime: '2026-05-19T00:00:00.0000000', timeZone: 'UTC' },
          isAllDay: true,
        },
        {
          id: 'o-free',
          subject: 'Free hold',
          start: { dateTime: '2026-05-18T03:00:00.0000000', timeZone: 'UTC' },
          end: { dateTime: '2026-05-18T04:00:00.0000000', timeZone: 'UTC' },
          showAs: 'free',
        },
      ],
      '@odata.nextLink': 'https://graph.microsoft.com/v1.0/me/calendarView?page=2',
    }, {
      value: [
        {
          id: 'o-2',
          subject: 'Busy client call',
          start: { dateTime: '2026-05-18T05:00:00.0000000', timeZone: 'UTC' },
          end: { dateTime: '2026-05-18T06:00:00.0000000', timeZone: 'UTC' },
          showAs: 'busy',
        },
      ],
    }]);

    const result = await listEventsFromOutlook('access-token', {
      timeMin: '2026-05-18T00:00:00.000Z',
      timeMax: '2026-05-19T00:00:00.000Z',
    }, fetchImpl);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events).toHaveLength(2);
    expect(result.events[0]).toMatchObject({
      provider: 'outlook',
      externalId: 'o-1',
      summary: 'Court prep',
      description: 'Booking ID: bk-123',
      start: '2026-05-18T01:00:00.000Z',
      end: '2026-05-18T02:00:00.000Z',
      status: 'cancelled',
    });
    expect(result.events[1]).toMatchObject({
      provider: 'outlook',
      externalId: 'o-2',
      summary: 'Busy client call',
      start: '2026-05-18T05:00:00.000Z',
      end: '2026-05-18T06:00:00.000Z',
      status: 'confirmed',
    });
  });

  it('surfaces provider list errors without throwing', async () => {
    const result = await listEventsFromGoogle('bad-token', {
      timeMin: '2026-05-18T00:00:00.000Z',
      timeMax: '2026-05-19T00:00:00.000Z',
    }, jsonFetch({ error: { message: 'unauthorized' } }, 401));

    expect(result).toEqual({ ok: false, error: 'unauthorized' });
  });
});
