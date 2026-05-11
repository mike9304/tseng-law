import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getConnection } from '@/lib/builder/bookings/calendar-sync/storage';
import {
  syncAllConnections,
  syncConnection,
} from '@/lib/builder/bookings/calendar-sync/sync-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const connectionId = request.nextUrl.searchParams.get('connectionId');
  if (connectionId) {
    const connection = await getConnection(connectionId);
    if (!connection) return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    const result = await syncConnection(connection);
    return NextResponse.json({ ok: result.ok, result });
  }
  const result = await syncAllConnections();
  return NextResponse.json({ ok: true, ...result });
}
