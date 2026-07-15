import { NextRequest, NextResponse } from 'next/server';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { syncAllConnections } from '@/lib/builder/bookings/calendar-sync/sync-engine';
import type {
  CalendarSyncReconciliationEntry,
  CalendarSyncResult,
} from '@/lib/builder/bookings/calendar-sync/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorized(request: NextRequest): boolean {
  return isCronAuthorized(request);
}

const SAFE_ERROR_KINDS = new Set(['token', 'pull', 'push']);

function safeErrorKind(kind: string): string {
  return SAFE_ERROR_KINDS.has(kind) ? kind : 'sync';
}

function safeReconciliationEntry(entry: CalendarSyncReconciliationEntry) {
  return {
    kind: entry.kind,
    status: entry.status,
    ...(entry.source ? { source: entry.source } : {}),
  };
}

function safeResult(result: CalendarSyncResult) {
  const ok = result.ok && result.errors.length === 0;
  return {
    ok,
    pushed: result.pushed,
    pulled: result.pulled,
    bookingUpdates: result.bookingUpdates,
    blockedUpdates: result.blockedUpdates,
    reconciliationFeed: result.reconciliationFeed.map(safeReconciliationEntry),
    errors: result.errors.map((error) => {
      const kind = safeErrorKind(error.kind);
      return {
        kind,
        reason: `calendar_sync_${kind}_failed`,
      };
    }),
  };
}

async function run(request: NextRequest): Promise<NextResponse> {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncAllConnections();
    const connections = result.connections.map(({ connectionId, result: connectionResult }) => ({
      connectionId,
      result: safeResult(connectionResult),
    }));
    const failed = connections.filter(({ result: connectionResult }) => !connectionResult.ok).length;
    const counts = {
      total: connections.length,
      succeeded: connections.length - failed,
      failed,
    };
    const ok = failed === 0;

    return NextResponse.json(
      { ok, counts, connections },
      { status: ok ? 200 : 502 },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: {
          kind: 'calendar-sync-execution-failed',
          reason: 'calendar_sync_execution_failed',
        },
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return run(request);
}
export async function POST(request: NextRequest) {
  return run(request);
}
