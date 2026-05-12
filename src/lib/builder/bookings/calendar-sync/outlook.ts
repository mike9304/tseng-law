import { decryptToken } from './encryption';
import type { CalendarConnection, ExternalCalendarEvent } from './types';

const SCOPE = 'offline_access Calendars.ReadWrite';

interface OauthEnv {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  tenant: string;
}

export function getOutlookEnv(): { ok: true; env: OauthEnv } | { ok: false; missing: string[] } {
  const clientId = process.env.MS_OAUTH_CLIENT_ID ?? '';
  const clientSecret = process.env.MS_OAUTH_CLIENT_SECRET ?? '';
  const redirectUri = process.env.MS_OAUTH_REDIRECT_URI ?? '';
  const tenant = process.env.MS_OAUTH_TENANT ?? 'common';
  const missing: string[] = [];
  if (!clientId) missing.push('MS_OAUTH_CLIENT_ID');
  if (!clientSecret) missing.push('MS_OAUTH_CLIENT_SECRET');
  if (!redirectUri) missing.push('MS_OAUTH_REDIRECT_URI');
  if (missing.length > 0) return { ok: false, missing };
  return { ok: true, env: { clientId, clientSecret, redirectUri, tenant } };
}

export function buildOutlookAuthUrl(state: string): { ok: boolean; url?: string; error?: string } {
  const env = getOutlookEnv();
  if (!env.ok) return { ok: false, error: `Microsoft OAuth unconfigured: ${env.missing.join(', ')}` };
  const params = new URLSearchParams({
    client_id: env.env.clientId,
    redirect_uri: env.env.redirectUri,
    response_type: 'code',
    response_mode: 'query',
    scope: SCOPE,
    state,
  });
  return { ok: true, url: `https://login.microsoftonline.com/${encodeURIComponent(env.env.tenant)}/oauth2/v2.0/authorize?${params.toString()}` };
}

export async function exchangeOutlookCode(code: string): Promise<{ ok: true; accessToken: string; refreshToken: string; expiresIn: number } | { ok: false; error: string }> {
  const env = getOutlookEnv();
  if (!env.ok) return { ok: false, error: `Microsoft OAuth unconfigured: ${env.missing.join(', ')}` };
  const body = new URLSearchParams({
    code,
    client_id: env.env.clientId,
    client_secret: env.env.clientSecret,
    redirect_uri: env.env.redirectUri,
    grant_type: 'authorization_code',
    scope: SCOPE,
  });
  try {
    const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(env.env.tenant)}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const data = (await res.json().catch(() => ({}))) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      error_description?: string;
    };
    if (!res.ok || !data.access_token || !data.refresh_token) {
      return { ok: false, error: data.error_description ?? `Token exchange failed (${res.status})` };
    }
    return { ok: true, accessToken: data.access_token, refreshToken: data.refresh_token, expiresIn: data.expires_in ?? 3600 };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function refreshOutlookAccessToken(connection: CalendarConnection): Promise<{ ok: true; accessToken: string } | { ok: false; error: string }> {
  const env = getOutlookEnv();
  if (!env.ok) return { ok: false, error: `Microsoft OAuth unconfigured: ${env.missing.join(', ')}` };
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
    redirect_uri: env.env.redirectUri,
    grant_type: 'refresh_token',
    scope: SCOPE,
  });
  try {
    const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(env.env.tenant)}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const data = (await res.json().catch(() => ({}))) as { access_token?: string; error_description?: string };
    if (!res.ok || !data.access_token) {
      return { ok: false, error: data.error_description ?? `refresh failed (${res.status})` };
    }
    return { ok: true, accessToken: data.access_token };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export interface OutlookCalendarEvent {
  summary: string;
  start: string;
  end: string;
  description?: string;
  attendees?: string[];
  bookingId?: string;
}

type CalendarEventWriteResult = { ok: true; id: string } | { ok: false; error: string; status?: number };

function outlookDateToIso(value: string | undefined): string {
  if (!value) return '';
  const dateInput = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}Z`;
  const date = new Date(dateInput);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function outlookEventBody(event: OutlookCalendarEvent, includeTransactionId = true): object {
  return {
    subject: event.summary,
    body: { contentType: 'Text', content: event.description ?? '' },
    start: { dateTime: event.start, timeZone: 'UTC' },
    end: { dateTime: event.end, timeZone: 'UTC' },
    attendees: event.attendees?.map((email) => ({
      emailAddress: { address: email },
      type: 'required',
    })),
    transactionId: includeTransactionId && event.bookingId ? `hojeong-${event.bookingId}` : undefined,
  };
}

export async function pushEventToOutlook(
  accessToken: string,
  event: OutlookCalendarEvent,
  fetchImpl: typeof fetch = fetch,
): Promise<CalendarEventWriteResult> {
  try {
    const res = await fetchImpl('https://graph.microsoft.com/v1.0/me/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(outlookEventBody(event)),
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

export async function updateEventInOutlook(
  accessToken: string,
  eventId: string,
  event: OutlookCalendarEvent,
  fetchImpl: typeof fetch = fetch,
): Promise<CalendarEventWriteResult> {
  try {
    const res = await fetchImpl(`https://graph.microsoft.com/v1.0/me/events/${encodeURIComponent(eventId)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(outlookEventBody(event, false)),
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

export async function listEventsFromOutlook(
  accessToken: string,
  range: { timeMin: string; timeMax: string },
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: true; events: ExternalCalendarEvent[] } | { ok: false; error: string }> {
  try {
    const events: ExternalCalendarEvent[] = [];
    const params = new URLSearchParams({
      startDateTime: range.timeMin,
      endDateTime: range.timeMax,
      '$top': '250',
      '$select': 'id,subject,bodyPreview,start,end,attendees,isCancelled,isAllDay,showAs,webLink,lastModifiedDateTime',
      '$orderby': 'start/dateTime',
    });
    let nextUrl: string | undefined = `https://graph.microsoft.com/v1.0/me/calendarView?${params.toString()}`;
    while (nextUrl) {
      const res = await fetchImpl(nextUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'outlook.timezone="UTC"',
        },
      });
      const data = (await res.json().catch(() => ({}))) as {
        value?: Array<{
          id?: string;
          subject?: string;
          bodyPreview?: string;
          isCancelled?: boolean;
          isAllDay?: boolean;
          showAs?: string;
          webLink?: string;
          lastModifiedDateTime?: string;
          start?: { dateTime?: string; timeZone?: string };
          end?: { dateTime?: string; timeZone?: string };
          attendees?: Array<{ emailAddress?: { address?: string } }>;
        }>;
        '@odata.nextLink'?: string;
        error?: { message?: string };
      };
      if (!res.ok) {
        return { ok: false, error: data.error?.message ?? `list failed (${res.status})` };
      }
      for (const item of data.value ?? []) {
        if (!item.id) continue;
        if (item.isAllDay) continue;
        const status = item.isCancelled ? 'cancelled' : 'confirmed';
        if (status !== 'cancelled' && item.showAs === 'free') continue;
        const start = outlookDateToIso(item.start?.dateTime);
        const end = outlookDateToIso(item.end?.dateTime);
        if (status !== 'cancelled' && (!start || !end)) continue;
        events.push({
          provider: 'outlook',
          externalId: item.id,
          summary: item.subject || '(untitled)',
          description: item.bodyPreview,
          start,
          end,
          status,
          attendees: item.attendees?.map((attendee) => attendee.emailAddress?.address || '').filter(Boolean),
          updatedAt: item.lastModifiedDateTime,
          htmlLink: item.webLink,
        });
      }
      nextUrl = data['@odata.nextLink'];
    }
    return { ok: true, events };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
