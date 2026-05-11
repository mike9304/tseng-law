import { NextRequest, NextResponse } from 'next/server';
import { encryptToken } from '@/lib/builder/bookings/calendar-sync/encryption';
import { exchangeGoogleCode } from '@/lib/builder/bookings/calendar-sync/google';
import { exchangeOutlookCode } from '@/lib/builder/bookings/calendar-sync/outlook';
import {
  makeConnectionId,
  saveConnection,
} from '@/lib/builder/bookings/calendar-sync/storage';
import type { CalendarConnection, CalendarProvider } from '@/lib/builder/bookings/calendar-sync/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * OAuth callback for Google + Outlook. State encodes the provider and
 * staffId as `provider:staffId:nonce`; without that the request is
 * rejected so we never write a connection without knowing which staff
 * member owns it.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code') ?? '';
  const state = request.nextUrl.searchParams.get('state') ?? '';
  const errorParam = request.nextUrl.searchParams.get('error');
  if (errorParam) {
    return NextResponse.json({ error: `OAuth provider error: ${errorParam}` }, { status: 400 });
  }
  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
  }
  const [providerRaw, staffId] = state.split(':');
  const provider = providerRaw as CalendarProvider;
  if ((provider !== 'google' && provider !== 'outlook') || !staffId) {
    return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  }

  const exchange = provider === 'google'
    ? await exchangeGoogleCode(code)
    : await exchangeOutlookCode(code);
  if (!exchange.ok) {
    return NextResponse.json({ error: exchange.error }, { status: 502 });
  }

  let encrypted: string;
  try {
    encrypted = encryptToken(exchange.refreshToken);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'encrypt failed' }, { status: 500 });
  }

  const now = new Date().toISOString();
  const connection: CalendarConnection = {
    connectionId: makeConnectionId(staffId, provider),
    staffId,
    provider,
    refreshTokenEncrypted: encrypted,
    scope: provider === 'google'
      ? 'https://www.googleapis.com/auth/calendar.events'
      : 'offline_access Calendars.ReadWrite',
    status: 'connected',
    createdAt: now,
    updatedAt: now,
  };
  await saveConnection(connection);
  return NextResponse.json({ ok: true, connectionId: connection.connectionId, provider, staffId });
}
