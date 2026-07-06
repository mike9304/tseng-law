import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync, readFileSync } from 'fs';
import os from 'os';
import path from 'path';
import {
  appendLog,
  clearLogs,
  flushDevLogWrites,
  listLogsAsync,
  listLogs,
  pruneLogsBefore,
  resetDevLogsMemory,
} from '@/lib/builder/dev/logs-store';

const blobStore = vi.hoisted(() => ({
  objects: new Map<string, string>(),
}));

vi.mock('@vercel/blob', () => ({
  put: vi.fn(async (pathname: string, body: string) => {
    blobStore.objects.set(pathname, body);
    return { url: `https://blob.example/${pathname}`, pathname };
  }),
  get: vi.fn(async (pathname: string) => {
    const body = blobStore.objects.get(pathname);
    if (!body) return { statusCode: 404, stream: null };
    return { statusCode: 200, stream: new Response(body).body };
  }),
  del: vi.fn(async (pathname: string) => {
    blobStore.objects.delete(pathname);
  }),
}));

describe('dev logs store', () => {
  const previousPath = process.env.BUILDER_OPS_DEV_LOGS_PATH;
  const previousBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const previousLogsBackend = process.env.BUILDER_DEV_LOGS_BACKEND;
  let tempRoot = '';

  beforeEach(() => {
    if (tempRoot) {
      rmSync(tempRoot, { recursive: true, force: true });
    }
    tempRoot = mkdtempSync(path.join(os.tmpdir(), 'builder-dev-logs-'));
    process.env.BUILDER_OPS_DEV_LOGS_PATH = tempRoot;
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.BUILDER_DEV_LOGS_BACKEND;
    blobStore.objects.clear();
    clearLogs();
  });

  afterAll(() => {
    if (previousPath === undefined) delete process.env.BUILDER_OPS_DEV_LOGS_PATH;
    else process.env.BUILDER_OPS_DEV_LOGS_PATH = previousPath;
    if (previousBlobToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = previousBlobToken;
    if (previousLogsBackend === undefined) delete process.env.BUILDER_DEV_LOGS_BACKEND;
    else process.env.BUILDER_DEV_LOGS_BACKEND = previousLogsBackend;
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  });

  it('appends and lists function logs by source', () => {
    appendLog('function', {
      level: 'log',
      message: 'hello',
      reference: 'fn-a',
      timestamp: '2026-05-29T00:00:00.000Z',
    });
    appendLog('app', {
      level: 'info',
      message: 'app event',
      reference: 'app-a',
      timestamp: '2026-05-29T00:00:01.000Z',
    });

    expect(listLogs('function')).toEqual([
      expect.objectContaining({
        source: 'function',
        level: 'log',
        message: 'hello',
        reference: 'fn-a',
      }),
    ]);
    expect(listLogs('app')).toEqual([
      expect.objectContaining({
        source: 'app',
        message: 'app event',
      }),
    ]);
  });

  it('persists logs to disk and can reload them after memory reset', () => {
    const entry = appendLog('function', {
      level: 'info',
      message: 'persist me',
      reference: 'fn-persist',
      timestamp: '2026-05-29T00:00:00.000Z',
    });

    const filePath = path.join(tempRoot, 'function.json');
    const raw = readFileSync(filePath, 'utf8');
    expect(raw).toContain(entry.id);
    expect(raw).toContain('persist me');

    resetDevLogsMemory();
    expect(listLogs('function')).toEqual([
      expect.objectContaining({
        id: entry.id,
        message: 'persist me',
        reference: 'fn-persist',
      }),
    ]);
  });

  it('filters by timestamp and limit', () => {
    appendLog('function', { level: 'log', message: 'old', timestamp: '2026-05-29T00:00:00.000Z' });
    appendLog('function', { level: 'log', message: 'middle', timestamp: '2026-05-29T00:00:01.000Z' });
    appendLog('function', { level: 'log', message: 'new', timestamp: '2026-05-29T00:00:02.000Z' });

    expect(listLogs('function', { sinceTs: '2026-05-29T00:00:00.500Z' }).map((entry) => entry.message))
      .toEqual(['middle', 'new']);
    expect(listLogs('function', { limit: 1 }).map((entry) => entry.message)).toEqual(['new']);
  });

  it('prunes entries older than a retention cutoff while keeping newer history', async () => {
    appendLog('function', { level: 'log', message: 'old', timestamp: '2026-05-29T00:00:00.000Z' });
    appendLog('function', { level: 'warn', message: 'new', timestamp: '2026-05-29T00:00:02.000Z' });
    appendLog('app', { level: 'info', message: 'app old', timestamp: '2026-05-29T00:00:00.000Z' });

    const result = await pruneLogsBefore('2026-05-29T00:00:01.000Z', 'function');

    expect(result).toEqual({
      before: '2026-05-29T00:00:01.000Z',
      deleted: 1,
      remaining: 1,
      sources: [
        {
          source: 'function',
          deleted: 1,
          remaining: 1,
        },
      ],
    });
    resetDevLogsMemory();
    expect(listLogs('function').map((entry) => entry.message)).toEqual(['new']);
    expect(listLogs('app').map((entry) => entry.message)).toEqual(['app old']);
  });

  it('filters persisted logs by exact reference', () => {
    appendLog('function', {
      level: 'log',
      message: 'slot a',
      reference: 'canvas-code-block:Slot A',
      timestamp: '2026-05-29T00:00:00.000Z',
    });
    appendLog('function', {
      level: 'log',
      message: 'slot b',
      reference: 'canvas-code-block:Slot B',
      timestamp: '2026-05-29T00:00:01.000Z',
    });

    resetDevLogsMemory();

    expect(listLogs('function', { reference: 'canvas-code-block:Slot B' }).map((entry) => entry.message))
      .toEqual(['slot b']);
  });

  it('mirrors appended logs to Blob and reads them through the async distributed path', async () => {
    process.env.BLOB_READ_WRITE_TOKEN = 'test-blob-token';
    process.env.BUILDER_DEV_LOGS_BACKEND = 'blob';
    const entry = appendLog('app', {
      level: 'error',
      message: 'durable app failure',
      reference: 'app-hook:durable',
      timestamp: '2026-06-18T00:00:00.000Z',
    });

    await flushDevLogWrites();
    resetDevLogsMemory();
    rmSync(tempRoot, { recursive: true, force: true });

    const entries = await listLogsAsync('app', { reference: 'app-hook:durable' });

    expect(entries).toEqual([
      expect.objectContaining({
        id: entry.id,
        source: 'app',
        level: 'error',
        message: 'durable app failure',
        reference: 'app-hook:durable',
      }),
    ]);
  });
});
