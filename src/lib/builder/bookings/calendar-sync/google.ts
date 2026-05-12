import { decryptToken } from './encryption';
import type { CalendarConnection, ExternalCalendarEvent } from './types';

const SCOPE = 'https://www.googleapis.com/auth/calendar.events';

export interface OauthEnv {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export function getGoogleEnv(): { ok: true; env: OauthEnv } | { ok: false; missing: string[] } {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID ?? '';
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '';
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI ?? '';
  const missing: string[] = [];
  if (!clientId) missing.push('GOOGLE_OAUTH_CLIENT_ID');
  if (!clientSecret) missing.push('GOOGLE_OAUTH_CLIENT_SECRET');
  if (!redirectUri) missing.push('GOOGLE_OAUTH_REDIRECT_URI');
  if (missing.length > 0) return { ok: false, missing };
  return { ok: true, env: { clientId, clientSecret, redirectUri } };
}

export function buildGoogleAuthUrl(state: string): { ok: boolean; url?: string; error?: string } {
  const env = getGoogleEnv();
  if (!env.ok) return { ok: false, error: `Google OAuth unconfigured: ${env.missing.join(', ')}` };
  const params = new URLSearchParams({
    client_id: env.env.clientId,
    redirect_uri: env.env.redirectUri,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    state,
  });
  return { ok: true, url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` };
}

export async function exchangeGoogleCode(code: string): Promise<{ ok: true; accessToken: string; refreshToken: string; expiresIn: number } | { ok: false; error: string }> {
  const env = getGoogleEnv();
  if (!env.ok) return { ok: false, error: `Google OAuth unconfigured: ${env.missing.join(', ')}` };
  const body = new URLSearchParams({
    code,
    client_id: env.env.clientId,
    client_secret: env.env.clientSecret,
    redirect_uri: env.env.redirectUri,
    grant_type: 'authorization_code',
  });
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const data = (await res.json().catch(() => ({}))) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      error?: string;
    };
    if (!res.ok || !data.access_token || !data.refresh_token) {
      return { ok: false, error: data.error ?? `Token exchange failed (${res.status})` };
    }
    return { ok: true, accessToken: data.access_token, refreshToken: data.refresh_token, expiresIn: data.expires_in ?? 3600 };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function refreshGoogleAccessToken(connection: CalendarConnection): Promise<{ ok: true; accessToken: string } | { ok: false; error: string }> {
  const env = getGoogleEnv();
  if (!env.ok) return { ok: false, error: `Google OAuth unconfigured: ${env.missing.join(', ')}` };
  let refreshToken: string;
  try {
    refreshToken = decryptToken(connection.refreshTokenEncrypted);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'decrypt failed' };
  }
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: env.env.clientId,
    client_secret: env.env.clientSecret,
    grant_type: 'refresh_token',
  });
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const data = (await res.json().catch(() => ({}))) as { access_token?: string; error?: string };
    if (!res.ok || !data.access_token) {
      return { ok: false, error: data.error ?? `refresh failed (${res.status})` };
    }
    return { ok: true, accessToken: data.access_token };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export interface GoogleCalendarEvent {
  summary: string;
  start: string;
  end: string;
  description?: string;
  attendees?: string[];
  bookingId?: string;
}

type CalendarEventWriteResult = { ok: true; id: string } | { ok: false; error: string; status?: number };

function toIsoOrEmpty(value: string | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function googleEventBody(event: GoogleCalendarEvent): object {
  return {
    summary: event.summary,
    description: event.description,
    start: { dateTime: event.start },
    end: { dateTime: event.end },
    attendees: event.attendees?.map((email) => ({ email })),
    extendedProperties: event.bookingId ? { private: { hojeongBookingId: event.bookingId } } : undefined,
  };
}

export async function pushEventToGoogle(
  accessToken: string,
  event: GoogleCalendarEvent,
  fetchImpl: typeof fetch = fetch,
): Promise<CalendarEventWriteResult> {
  try {
    const res = await fetchImpl('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleEventBody(event)),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
    if (!res.ok || !data.id) {
      return { ok: false, error: data.error?.message ?? `${res.status}`, status: res.status };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function updateEventInGoogle(
  accessToken: string,
  eventId: string,
  event: GoogleCalendarEvent,
  fetchImpl: typeof fetch = fetch,
): Promise<CalendarEventWriteResult> {
  try {
    const res = await fetchImpl(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleEventBody(event)),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
    if (!res.ok) {
      return { ok: false, error: data.error?.message ?? `${res.status}`, status: res.status };
    }
    return { ok: true, id: data.id ?? eventId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function listEventsFromGoogle(
  accessToken: string,
  range: { timeMin: string; timeMax: string },
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: true; events: ExternalCalendarEvent[] } | { ok: false; error: string }> {
  try {
    const events: ExternalCalendarEvent[] = [];
    let pageToken: string | undefined;
    do {
      const params = new URLSearchParams({
        timeMin: range.timeMin,
        timeMax: range.timeMax,
        singleEvents: 'true',
        orderBy: 'startTime',
        showDeleted: 'true',
        maxResults: '250',
      });
      if (pageToken) params.set('pageToken', pageToken);
      const res = await fetchImpl(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = (await res.json().catch(() => ({}))) as {
        items?: Array<{
          id?: string;
          status?: string;
          summary?: string;
          description?: string;
          htmlLink?: string;
          updated?: string;
          transparency?: string;
          start?: { dateTime?: string; date?: string };
          end?: { dateTime?: string; date?: string };
          attendees?: Array<{ email?: string }>;
          extendedProperties?: { private?: { hojeongBookingId?: string } };
          error?: { message?: string };
        }>;
        nextPageToken?: string;
        error?: { message?: string };
      };
      if (!res.ok) {
        return { ok: false, error: data.error?.message ?? `list failed (${res.status})` };
      }
      for (const item of data.items ?? []) {
        if (!item.id) continue;
        const status = item.status === 'cancelled' ? 'cancelled' : 'confirmed';
        if (status !== 'cancelled' && item.transparency === 'transparent') continue;
        const start = toIsoOrEmpty(item.start?.dateTime);
        const end = toIsoOrEmpty(item.end?.dateTime);
        if (status !== 'cancelled' && (!start || !end)) continue;
        events.push({
          provider: 'google',
          externalId: item.id,
          summary: item.summary || '(untitled)',
          description: item.description,
          start,
          end,
          status,
          attendees: item.attendees?.map((attendee) => attendee.email || '').filter(Boolean),
          updatedAt: item.updated,
          htmlLink: item.htmlLink,
          bookingId: item.extendedProperties?.private?.hojeongBookingId,
        });
      }
      pageToken = data.nextPageToken;
    } while (pageToken);
    return { ok: true, events };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
