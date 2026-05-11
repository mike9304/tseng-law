import { listBookings, getService, getStaff } from '@/lib/builder/bookings/storage';
import { listConnections, saveConnection } from './storage';
import { refreshGoogleAccessToken, pushEventToGoogle } from './google';
import { refreshOutlookAccessToken, pushEventToOutlook } from './outlook';
import type { CalendarConnection, CalendarSyncResult } from './types';
import type { Booking } from '@/lib/builder/bookings/types';

/**
 * PR #8 — One-way sync (Hojeong bookings → external calendar).
 *
 * Bidirectional pull (external → bookings) is intentionally deferred: the
 * existing booking flow is the source of truth and we don't want users
 * accidentally clobbering availability rules by editing events on Google.
 * Push uses the booking.endAt/startAt as the source.
 */

async function refreshAccessToken(connection: CalendarConnection): Promise<{ ok: boolean; token?: string; error?: string }> {
  if (connection.provider === 'google') {
    const result = await refreshGoogleAccessToken(connection);
    return result.ok ? { ok: true, token: result.accessToken } : { ok: false, error: result.error };
  }
  const result = await refreshOutlookAccessToken(connection);
  return result.ok ? { ok: true, token: result.accessToken } : { ok: false, error: result.error };
}

async function pushBooking(connection: CalendarConnection, accessToken: string, booking: Booking): Promise<{ ok: boolean; error?: string }> {
  const service = await getService(booking.serviceId);
  const staff = await getStaff(booking.staffId);
  const summary = `[Hojeong] ${service?.name?.ko || service?.name?.en || 'Booking'} · ${booking.customer.name}`;
  const description = [
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
  };
  if (connection.provider === 'google') {
    const res = await pushEventToGoogle(accessToken, event);
    return { ok: res.ok, error: res.error };
  }
  return pushEventToOutlook(accessToken, event);
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

  // Future-dated, confirmed bookings only.
  const now = new Date().toISOString();
  const bookings = await listBookings({ from: now, staffId: connection.staffId });
  for (const booking of bookings) {
    if (booking.status !== 'confirmed') continue;
    const pushed = await pushBooking(connection, tokenResult.token, booking);
    if (pushed.ok) {
      result.pushed += 1;
    } else {
      result.errors.push({ kind: 'push', message: pushed.error ?? 'unknown' });
    }
  }

  await saveConnection({
    ...connection,
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
