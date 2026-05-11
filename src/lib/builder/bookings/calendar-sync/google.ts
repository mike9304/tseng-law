import { decryptToken } from './encryption';
import type { CalendarConnection } from './types';

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
}

export async function pushEventToGoogle(accessToken: string, event: GoogleCalendarEvent): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.start },
        end: { dateTime: event.end },
        attendees: event.attendees?.map((email) => ({ email })),
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
    if (!res.ok || !data.id) {
      return { ok: false, error: data.error?.message ?? `${res.status}` };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
