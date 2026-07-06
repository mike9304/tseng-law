import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  guardBuilderRead,
  guardMutation,
} from '@/lib/builder/security/guard';
import {
  clearLogs,
  flushDevLogWrites,
  listLogs,
  listLogsAsync,
  pruneLogsBefore,
} from '@/lib/builder/dev/logs-store';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'builder-admin@example.test' })),
  guardMutation: vi.fn(async () => ({ username: 'builder-admin@example.test' })),
}));

vi.mock('@/lib/builder/dev/logs-store', () => ({
  clearLogs: vi.fn(),
  flushDevLogWrites: vi.fn(async () => undefined),
  pruneLogsBefore: vi.fn(async () => ({
    before: '2026-06-18T00:00:02.000Z',
    deleted: 2,
    remaining: 1,
    sources: [
      {
        source: 'app',
        deleted: 2,
        remaining: 1,
      },
    ],
  })),
  listLogs: vi.fn(() => [
    {
      id: 'sync-log',
      source: 'app',
      level: 'warn',
      message: 'sync path should not be used',
      timestamp: '2026-06-18T00:00:00.000Z',
    },
  ]),
  listLogsAsync: vi.fn(async () => [
    {
      id: 'async-log',
      source: 'app',
      level: 'error',
      message: 'distributed path used',
      timestamp: '2026-06-18T00:00:01.000Z',
      reference: 'app-hook:durable',
    },
  ]),
}));

function request(query = 'source=app&reference=app-hook%3Adurable&limit=5'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/dev/logs?${query}`);
}

type DeleteRoute = {
  readonly DELETE: (request: NextRequest) => Promise<Response> | Response;
};

function hasDeleteRoute(value: unknown): value is DeleteRoute {
  return Boolean(
    value
      && typeof value === 'object'
      && 'DELETE' in value
      && typeof value.DELETE === 'function',
  );
}

describe('/api/builder/dev/logs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads logs through the async distributed log path', async () => {
    const response = await GET(request());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderRead).toHaveBeenCalled();
    expect(listLogsAsync).toHaveBeenCalledWith('app', {
      sinceTs: undefined,
      limit: 5,
      reference: 'app-hook:durable',
    });
    expect(listLogs).not.toHaveBeenCalled();
    expect(body).toEqual({
      ok: true,
      source: 'app',
      reference: 'app-hook:durable',
      entries: [
        {
          id: 'async-log',
          source: 'app',
          level: 'error',
          message: 'distributed path used',
          timestamp: '2026-06-18T00:00:01.000Z',
          reference: 'app-hook:durable',
        },
      ],
    });
  });

  it('returns 400 for invalid sources before reading logs', async () => {
    const response = await GET(request('source=invalid'));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(listLogsAsync).not.toHaveBeenCalled();
  });

  it('exports filtered durable logs from all sources as JSONL', async () => {
    vi.mocked(listLogsAsync).mockImplementation(async (source) => {
      if (source === 'function') {
        return [
          {
            id: 'function-error',
            source,
            level: 'error',
            message: 'function boom',
            timestamp: '2026-06-18T00:00:03.000Z',
          },
        ];
      }
      if (source === 'webhook') {
        return [
          {
            id: 'webhook-warn',
            source,
            level: 'warn',
            message: 'webhook boom but wrong level',
            timestamp: '2026-06-18T00:00:02.000Z',
          },
        ];
      }
      return [
        {
          id: 'app-error',
          source,
          level: 'error',
          message: 'app stayed quiet',
          timestamp: '2026-06-18T00:00:01.000Z',
        },
      ];
    });

    const response = await GET(request('source=all&format=jsonl&level=error&query=boom&limit=20'));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/x-ndjson');
    expect(response.headers.get('Content-Disposition')).toBe(
      'attachment; filename="dev-logs-all-error-boom.jsonl"',
    );
    expect(listLogsAsync).toHaveBeenCalledWith('function', {
      sinceTs: undefined,
      limit: 20,
      reference: undefined,
    });
    expect(listLogsAsync).toHaveBeenCalledWith('webhook', {
      sinceTs: undefined,
      limit: 20,
      reference: undefined,
    });
    expect(listLogsAsync).toHaveBeenCalledWith('app', {
      sinceTs: undefined,
      limit: 20,
      reference: undefined,
    });
    expect(listLogs).not.toHaveBeenCalled();
    expect(body.trim().split('\n').map((line) => JSON.parse(line))).toEqual([
      {
        id: 'function-error',
        source: 'function',
        level: 'error',
        message: 'function boom',
        timestamp: '2026-06-18T00:00:03.000Z',
      },
    ]);
  });

  it('clears one source through the mutation guard and durable flush', async () => {
    const route: unknown = await import('../route');
    if (!hasDeleteRoute(route)) {
      throw new Error('Expected dev logs route to export DELETE');
    }

    const response = await route.DELETE(request('source=app'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutation).toHaveBeenCalled();
    expect(clearLogs).toHaveBeenCalledWith('app');
    expect(flushDevLogWrites).toHaveBeenCalled();
    expect(body).toEqual({ ok: true, source: 'app' });
  });

  it('prunes logs older than a retention cutoff through the mutation guard', async () => {
    const route: unknown = await import('../route');
    if (!hasDeleteRoute(route)) {
      throw new Error('Expected dev logs route to export DELETE');
    }

    const response = await route.DELETE(request('source=app&before=2026-06-18T00%3A00%3A02.000Z'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutation).toHaveBeenCalled();
    expect(pruneLogsBefore).toHaveBeenCalledWith('2026-06-18T00:00:02.000Z', 'app');
    expect(clearLogs).not.toHaveBeenCalled();
    expect(flushDevLogWrites).toHaveBeenCalled();
    expect(body).toEqual({
      ok: true,
      source: 'app',
      retention: {
        before: '2026-06-18T00:00:02.000Z',
        deleted: 2,
        remaining: 1,
        sources: [
          {
            source: 'app',
            deleted: 2,
            remaining: 1,
          },
        ],
      },
    });
  });
});
