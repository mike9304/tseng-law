import {
  getBooking,
  getService,
  getStaff,
  getStaffAvailability,
  listBookings,
  saveBooking,
  saveStaffAvailability,
  timestamped,
} from '@/lib/builder/bookings/storage';
import { listConnections, saveConnection } from './storage';
import { refreshGoogleAccessToken, listEventsFromGoogle, pushEventToGoogle, updateEventInGoogle } from './google';
import { refreshOutlookAccessToken, listEventsFromOutlook, pushEventToOutlook, updateEventInOutlook } from './outlook';
import type { CalendarConnection, CalendarEventMapping, CalendarSyncResult, ExternalCalendarEvent } from './types';
import type { Booking, StaffAvailability } from '@/lib/builder/bookings/types';

/**
 * PR #8 — Calendar sync.
 *
 * Push uses the booking.endAt/startAt as the source. Pull is conservative:
 * events carrying a `Booking ID:` line update/cancel the matching booking,
 * while other external events become staff availability blocks so public
 * slots stay unavailable without fabricating customer bookings.
 */

const PULL_WINDOW_DAYS = 90;
const BOOKING_ID_RE = /(?:^|\n)\s*Booking ID:\s*([A-Za-z0-9_-]+)/i;
const EXTERNAL_BLOCK_PREFIX = 'External calendar';

async function refreshAccessToken(connection: CalendarConnection): Promise<{ ok: boolean; token?: string; error?: string }> {
  if (connection.provider === 'google') {
    const result = await refreshGoogleAccessToken(connection);
    return result.ok ? { ok: true, token: result.accessToken } : { ok: false, error: result.error };
  }
  const result = await refreshOutlookAccessToken(connection);
  return result.ok ? { ok: true, token: result.accessToken } : { ok: false, error: result.error };
}

function isMissingExternalEvent(status?: number): boolean {
  return status === 404 || status === 410;
}

async function pushBooking(
  connection: CalendarConnection,
  accessToken: string,
  booking: Booking,
  eventMappings: CalendarEventMapping[],
): Promise<{ ok: boolean; error?: string; mapping?: CalendarEventMapping }> {
  const service = await getService(booking.serviceId);
  const staff = await getStaff(booking.staffId);
  const summary = `[Hojeong] ${service?.name?.ko || service?.name?.en || 'Booking'} · ${booking.customer.name}`;
  const description = [
    `Booking ID: ${booking.bookingId}`,
    `Service: ${service?.name?.ko || service?.name?.en || booking.serviceId}`,
    `Staff: ${staff?.name || booking.staffId}`,
    `Customer: ${booking.customer.email}`,
    booking.customer.notes ?? '',
    booking.meetingLink ? `Meeting link: ${booking.meetingLink}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  const event = {
    summary,
    description,
    start: booking.startAt,
    end: booking.endAt,
    attendees: [booking.customer.email],
    bookingId: booking.bookingId,
  };
  const existing = eventMappings.find((mapping) => mapping.bookingId === booking.bookingId);
  if (connection.provider === 'google') {
    const updated = existing
      ? await updateEventInGoogle(accessToken, existing.externalId, event)
      : null;
    if (updated?.ok) {
      return { ok: true, mapping: { bookingId: booking.bookingId, externalId: updated.id, lastPushedAt: new Date().toISOString() } };
    }
    if (updated && !isMissingExternalEvent(updated.status)) return { ok: false, error: updated.error };
    const created = await pushEventToGoogle(accessToken, event);
    return created.ok
      ? { ok: true, mapping: { bookingId: booking.bookingId, externalId: created.id, lastPushedAt: new Date().toISOString() } }
      : { ok: false, error: created.error };
  }
  const updated = existing
    ? await updateEventInOutlook(accessToken, existing.externalId, event)
    : null;
  if (updated?.ok) {
    return { ok: true, mapping: { bookingId: booking.bookingId, externalId: updated.id, lastPushedAt: new Date().toISOString() } };
  }
  if (updated && !isMissingExternalEvent(updated.status)) return { ok: false, error: updated.error };
  const created = await pushEventToOutlook(accessToken, event);
  return created.ok
    ? { ok: true, mapping: { bookingId: booking.bookingId, externalId: created.id, lastPushedAt: new Date().toISOString() } }
    : { ok: false, error: created.error };
}

function pullWindow(now = new Date()): { timeMin: string; timeMax: string } {
  return {
    timeMin: now.toISOString(),
    timeMax: new Date(now.getTime() + PULL_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString(),
  };
}

async function listExternalEvents(
  connection: CalendarConnection,
  accessToken: string,
  window: { timeMin: string; timeMax: string },
): Promise<{ ok: true; events: ExternalCalendarEvent[] } | { ok: false; error: string }> {
  return connection.provider === 'google'
    ? listEventsFromGoogle(accessToken, window)
    : listEventsFromOutlook(accessToken, window);
}

function bookingIdFromEvent(connection: CalendarConnection, event: ExternalCalendarEvent): string | null {
  const mappedByExternalId = connection.eventMappings?.find((mapping) => mapping.externalId === event.externalId);
  if (mappedByExternalId) return mappedByExternalId.bookingId;
  const embeddedBookingId = event.bookingId;
  if (embeddedBookingId) {
    const mappedByBookingId = connection.eventMappings?.find((mapping) => mapping.bookingId === embeddedBookingId);
    return mappedByBookingId && mappedByBookingId.externalId !== event.externalId ? null : embeddedBookingId;
  }
  const match = event.description?.match(BOOKING_ID_RE);
  const bookingId = match?.[1];
  if (!bookingId) return null;
  const mappedByBookingId = connection.eventMappings?.find((mapping) => mapping.bookingId === bookingId);
  return mappedByBookingId && mappedByBookingId.externalId !== event.externalId ? null : bookingId;
}

function blockReasonPrefix(connection: CalendarConnection, event: ExternalCalendarEvent): string {
  return `${EXTERNAL_BLOCK_PREFIX}:${connection.provider}:${connection.connectionId}:${event.externalId}:`;
}

function blockReason(connection: CalendarConnection, event: ExternalCalendarEvent): string {
  return `${blockReasonPrefix(connection, event)}${event.summary}`;
}

function isSameRange(left: { start: string; end: string }, right: { start: string; end: string }): boolean {
  return left.start === right.start && left.end === right.end;
}

function normalizeEventRange(event: ExternalCalendarEvent): ExternalCalendarEvent | null {
  const start = new Date(event.start);
  const end = new Date(event.end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) return null;
  return {
    ...event,
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function intervalsOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && aEnd > bStart;
}

async function canApplyBookingRange(
  booking: Booking,
  event: ExternalCalendarEvent,
  availability: StaffAvailability,
): Promise<boolean> {
  const service = await getService(booking.serviceId);
  const durationMs = new Date(event.end).getTime() - new Date(event.start).getTime();
  if (service && durationMs !== service.durationMinutes * 60_000) return false;
  const blockedConflict = availability.blockedDates.some((block) =>
    intervalsOverlap(event.start, event.end, block.start, block.end),
  );
  if (blockedConflict) return false;
  const bookings = await listBookings({ from: event.start, to: event.end, staffId: booking.staffId });
  return !bookings.some((other) =>
    other.bookingId !== booking.bookingId &&
    other.status !== 'cancelled' &&
    intervalsOverlap(event.start, event.end, other.startAt, other.endAt),
  );
}

export async function applyPulledCalendarEvents(
  connection: CalendarConnection,
  events: ExternalCalendarEvent[],
): Promise<{ pulled: number; bookingUpdates: number; blockedUpdates: number }> {
  let pulled = 0;
  let bookingUpdates = 0;
  let blockedUpdates = 0;
  const availability = await getStaffAvailability(connection.staffId);
  let blockedDates = [...availability.blockedDates];
  let blockedChanged = false;

  for (const event of events) {
    const bookingId = bookingIdFromEvent(connection, event);
    if (bookingId) {
      const booking = await getBooking(bookingId);
      if (!booking || booking.staffId !== connection.staffId) continue;
      if (event.status === 'cancelled') {
        if (booking.status !== 'cancelled') {
          await saveBooking(timestamped({
            ...booking,
            status: 'cancelled',
            cancellationReason: `Cancelled from ${connection.provider} calendar`,
            cancelledAt: new Date().toISOString(),
          }, booking.createdAt));
          bookingUpdates += 1;
          pulled += 1;
        }
        continue;
      }
      const eventToApply = normalizeEventRange(event);
      if (!eventToApply) continue;
      if (!(await canApplyBookingRange(booking, eventToApply, availability))) continue;
      if (!isSameRange({ start: booking.startAt, end: booking.endAt }, eventToApply)) {
        await saveBooking(timestamped({
          ...booking,
          startAt: eventToApply.start,
          endAt: eventToApply.end,
        }, booking.createdAt));
        bookingUpdates += 1;
        pulled += 1;
      }
      continue;
    }

    if (event.summary.startsWith('[Hojeong]')) continue;

    const reasonPrefix = blockReasonPrefix(connection, event);
    if (event.status === 'cancelled') {
      const before = blockedDates.length;
      blockedDates = blockedDates.filter((block) => !(block.reason ?? '').startsWith(reasonPrefix));
      const removed = before - blockedDates.length;
      if (removed > 0) {
        blockedChanged = true;
        blockedUpdates += removed;
        pulled += removed;
      }
      continue;
    }

    const eventToApply = normalizeEventRange(event);
    if (!eventToApply) continue;

    const reason = blockReason(connection, eventToApply);
    const existingIndex = blockedDates.findIndex((block) => block.reason === reason);
    const sameExternalEventIndex = existingIndex >= 0
      ? existingIndex
      : blockedDates.findIndex((block) => (block.reason ?? '').startsWith(reasonPrefix));
    const nextBlock = { start: eventToApply.start, end: eventToApply.end, reason };
    if (sameExternalEventIndex >= 0) {
      const existing = blockedDates[sameExternalEventIndex];
      if (existing.start !== eventToApply.start || existing.end !== eventToApply.end || existing.reason !== reason) {
        blockedDates[sameExternalEventIndex] = nextBlock;
        blockedChanged = true;
        blockedUpdates += 1;
        pulled += 1;
      }
    } else {
      blockedDates.push(nextBlock);
      blockedChanged = true;
      blockedUpdates += 1;
      pulled += 1;
    }
  }

  if (blockedChanged) {
    await saveStaffAvailability({
      ...availability,
      blockedDates: blockedDates.sort((left, right) => left.start.localeCompare(right.start)),
    });
  }

  return { pulled, bookingUpdates, blockedUpdates };
}

export async function syncConnection(connection: CalendarConnection): Promise<CalendarSyncResult> {
  const result: CalendarSyncResult = { ok: true, pushed: 0, pulled: 0, errors: [] };

  const tokenResult = await refreshAccessToken(connection);
  if (!tokenResult.ok || !tokenResult.token) {
    result.ok = false;
    result.errors.push({ kind: 'token', message: tokenResult.error ?? 'unknown' });
    await saveConnection({ ...connection, status: 'error', lastError: tokenResult.error });
    return result;
  }

  let eventMappings = [...(connection.eventMappings ?? [])];

  const pulled = await listExternalEvents(connection, tokenResult.token, pullWindow());
  if (pulled.ok) {
    const applied = await applyPulledCalendarEvents({ ...connection, eventMappings }, pulled.events);
    result.pulled += applied.pulled;
  } else {
    result.errors.push({ kind: 'pull', message: pulled.error });
  }

  // Future-dated, confirmed bookings only. Run after pull so provider deletes
  // can cancel a booking before the push phase considers recreating it.
  const now = new Date().toISOString();
  const bookings = await listBookings({ from: now, staffId: connection.staffId });
  for (const booking of bookings) {
    if (booking.status !== 'confirmed') continue;
    const pushed = await pushBooking(connection, tokenResult.token, booking, eventMappings);
    if (pushed.ok) {
      result.pushed += 1;
      if (pushed.mapping) {
        eventMappings = [
          ...eventMappings.filter((mapping) => mapping.bookingId !== pushed.mapping?.bookingId),
          pushed.mapping,
        ];
      }
    } else {
      result.errors.push({ kind: 'push', message: pushed.error ?? 'unknown' });
    }
  }

  await saveConnection({
    ...connection,
    eventMappings,
    status: result.errors.length === 0 ? 'connected' : 'error',
    lastError: result.errors[0]?.message,
    lastSyncedAt: new Date().toISOString(),
  });

  if (result.errors.length > 0) result.ok = false;
  return result;
}

export async function syncAllConnections(): Promise<{ connections: Array<{ connectionId: string; result: CalendarSyncResult }> }> {
  const connections = await listConnections();
  const out: Array<{ connectionId: string; result: CalendarSyncResult }> = [];
  for (const connection of connections) {
    if (connection.status === 'revoked') continue;
    const result = await syncConnection(connection);
    out.push({ connectionId: connection.connectionId, result });
  }
  return { connections: out };
}
