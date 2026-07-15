import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { syncAllConnections } from '@/lib/builder/bookings/calendar-sync/sync-engine';
import type { CalendarSyncResult } from '@/lib/builder/bookings/calendar-sync/types';

vi.mock('@/lib/builder/security/cron-auth', () => ({
  isCronAuthorized: vi.fn(() => false),
}));

vi.mock('@/lib/builder/bookings/calendar-sync/sync-engine', () => ({
  syncAllConnections: vi.fn(async () => ({ connections: [] })),
}));

function cronRequest(method: 'GET' | 'POST' = 'POST'): NextRequest {
  return new NextRequest('https://law.example.test/api/cron/calendar-sync', { method });
}

function syncResult(overrides: Partial<CalendarSyncResult> = {}): CalendarSyncResult {
  return {
    ok: true,
    pushed: 0,
    pulled: 0,
    bookingUpdates: 0,
    blockedUpdates: 0,
    reconciliationFeed: [],
    errors: [],
    ...overrides,
  };
}

describe('/api/cron/calendar-sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isCronAuthorized).mockReturnValue(true);
    vi.mocked(syncAllConnections).mockResolvedValue({ connections: [] });
  });

  it.each([
    ['GET', 'GET'],
    ['POST', 'POST'],
  ] as const)('keeps the cron auth gate for %s', async (_label, method) => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);
    const route = await import('../route');
    const response = await route[method](cronRequest(method));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
    expect(syncAllConnections).not.toHaveBeenCalled();
  });

  it.each([
    ['GET', 'GET'],
    ['POST', 'POST'],
  ] as const)('treats an empty %s run as a successful no-op', async (_label, method) => {
    const route = await import('../route');
    const response = await route[method](cronRequest(method));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      counts: { total: 0, succeeded: 0, failed: 0 },
      connections: [],
    });
  });

  it('returns 200 and truthful counts when every connection succeeds', async () => {
    vi.mocked(syncAllConnections).mockResolvedValue({
      connections: [
        { connectionId: 'connection-a', result: syncResult({ pulled: 2 }) },
        { connectionId: 'connection-b', result: syncResult({ pushed: 1 }) },
      ],
    });
    const route = await import('../route');
    const response = await route.POST(cronRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.counts).toEqual({ total: 2, succeeded: 2, failed: 0 });
    expect(payload.connections).toHaveLength(2);
  });

  it.each([
    ['GET', 'GET'],
    ['POST', 'POST'],
  ] as const)('returns 502 with top-level ok false for a partial %s failure', async (_label, method) => {
    vi.mocked(syncAllConnections).mockResolvedValue({
      connections: [
        { connectionId: 'connection-ok', result: syncResult({ pulled: 1 }) },
        {
          connectionId: 'connection-failed',
          result: syncResult({
            ok: false,
            errors: [{ kind: 'pull', message: 'provider token secret=do-not-leak' }],
            reconciliationFeed: [
              {
                externalId: 'private-provider-id',
                summary: 'Confidential client appointment',
                kind: 'booking',
                status: 'error',
                source: 'pull',
                note: 'provider token secret=do-not-leak',
              },
            ],
          }),
        },
      ],
    });
    const route = await import('../route');
    const response = await route[method](cronRequest(method));
    const payload = await response.json();
    const serialized = JSON.stringify(payload);

    expect(response.status).toBe(502);
    expect(payload.ok).toBe(false);
    expect(payload.counts).toEqual({ total: 2, succeeded: 1, failed: 1 });
    expect(payload.connections[1].result.errors).toEqual([
      { kind: 'pull', reason: 'calendar_sync_pull_failed' },
    ]);
    expect(payload.connections[1].result.reconciliationFeed).toEqual([
      { kind: 'booking', status: 'error', source: 'pull' },
    ]);
    expect(serialized).not.toContain('do-not-leak');
    expect(serialized).not.toContain('Confidential client appointment');
    expect(serialized).not.toContain('private-provider-id');
  });

  it('fails closed when a connection reports errors despite an inconsistent ok flag', async () => {
    vi.mocked(syncAllConnections).mockResolvedValue({
      connections: [
        {
          connectionId: 'connection-inconsistent',
          result: syncResult({
            ok: true,
            errors: [{ kind: 'unexpected-provider-shape', message: 'raw provider response' }],
          }),
        },
      ],
    });
    const route = await import('../route');
    const response = await route.POST(cronRequest());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.ok).toBe(false);
    expect(payload.counts).toEqual({ total: 1, succeeded: 0, failed: 1 });
    expect(payload.connections[0].result).toMatchObject({
      ok: false,
      errors: [{ kind: 'sync', reason: 'calendar_sync_sync_failed' }],
    });
    expect(JSON.stringify(payload)).not.toContain('raw provider response');
    expect(JSON.stringify(payload)).not.toContain('unexpected-provider-shape');
  });

  it.each([
    ['GET', 'GET'],
    ['POST', 'POST'],
  ] as const)('returns a sanitized 500 when the %s sync throws', async (_label, method) => {
    vi.mocked(syncAllConnections).mockRejectedValue(new Error('refresh_token=raw-provider-secret'));
    const route = await import('../route');
    const response = await route[method](cronRequest(method));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: {
        kind: 'calendar-sync-execution-failed',
        reason: 'calendar_sync_execution_failed',
      },
    });
    expect(JSON.stringify(payload)).not.toContain('raw-provider-secret');
  });
});
