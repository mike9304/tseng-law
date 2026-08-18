/**
 * F110 — Dev logs read endpoint.
 *
 * Auth-required (read-only); UI panels poll this every few seconds.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import {
  clearLogs,
  flushDevLogWrites,
  listLogsAsync,
  pruneLogsBefore,
  type DevLogEntry,
  type DevLogLevel,
  type DevLogSource,
} from '@/lib/builder/dev/logs-store';
import {
  buildDevLogsExportFile,
  buildDevLogsExportFilename,
  serializeDevLogsExportFile,
  serializeDevLogsJsonLines,
  type DevLogsExportSource,
} from '@/lib/builder/dev/logs-export';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LOG_SOURCES = ['function', 'webhook', 'app'] as const satisfies readonly DevLogSource[];
const EXPORT_SOURCES = ['function', 'webhook', 'app', 'all'] as const;
const EXPORT_LEVELS = ['all', 'log', 'info', 'warn', 'error'] as const;

const ALLOWED_SOURCES: ReadonlySet<DevLogSource> = new Set(LOG_SOURCES);

const optionalQueryString = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().optional(),
);

const optionalTimestampQueryString = optionalQueryString.refine(
  (value) => value === undefined || Number.isFinite(Date.parse(value)),
);

const normalLimitSchema = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.coerce.number().int().min(1).max(200).optional(),
);

const exportLimitSchema = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.coerce.number().int().min(1).max(600).default(200),
);

const logsQuerySchema = z.object({
  source: z.enum(LOG_SOURCES).default('function'),
  since: optionalQueryString,
  limit: normalLimitSchema,
  reference: optionalQueryString,
});

const exportQuerySchema = z.object({
  source: z.enum(EXPORT_SOURCES).default('function'),
  format: z.enum(['json', 'jsonl']),
  level: z.enum(EXPORT_LEVELS).default('all'),
  query: z.string().trim().default(''),
  since: optionalQueryString,
  limit: exportLimitSchema,
  reference: optionalQueryString,
});

const deleteQuerySchema = z.object({
  source: z.enum(EXPORT_SOURCES).default('all'),
  before: optionalTimestampQueryString,
});

function parseLogSource(source: string): DevLogSource | null {
  if (source === 'function' || source === 'webhook' || source === 'app') return source;
  return null;
}

function queryRecord(params: URLSearchParams): Record<string, string> {
  const record: Record<string, string> = {};
  params.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

function badQueryResponse() {
  return NextResponse.json(
    { ok: false, error: 'invalid_query' },
    { status: 400 },
  );
}

function sourcesForExport(source: DevLogsExportSource): readonly DevLogSource[] {
  return source === 'all' ? LOG_SOURCES : [source];
}

function matchesQuery(entry: DevLogEntry, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    entry.message,
    entry.reference ?? '',
    entry.source,
    entry.level,
    entry.timestamp,
  ].join(' ').toLowerCase();
  return haystack.includes(needle);
}

function filterExportEntries(
  entries: readonly DevLogEntry[],
  level: DevLogLevel | 'all',
  query: string,
  limit: number,
): DevLogEntry[] {
  return entries
    .filter((entry) => (level === 'all' || entry.level === level) && matchesQuery(entry, query))
    .sort((left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp))
    .slice(-limit);
}

async function exportLogs(request: NextRequest): Promise<NextResponse> {
  const parsed = exportQuerySchema.safeParse(queryRecord(request.nextUrl.searchParams));
  if (!parsed.success) return badQueryResponse();
  const query = parsed.data;
  const sourceEntries = await Promise.all(
    sourcesForExport(query.source).map((source) => (
      listLogsAsync(source, {
        sinceTs: query.since,
        limit: query.limit,
        reference: query.reference,
      })
    )),
  );
  const entries = filterExportEntries(sourceEntries.flat(), query.level, query.query, query.limit);
  const file = buildDevLogsExportFile({
    source: query.source,
    level: query.level,
    query: query.query,
    format: query.format,
    entries,
  });
  const filename = buildDevLogsExportFilename({
    source: query.source,
    level: query.level,
    query: query.query,
    format: query.format,
    entries,
  });
  const body = query.format === 'jsonl'
    ? serializeDevLogsJsonLines(entries)
    : serializeDevLogsExportFile(file);
  const contentType = query.format === 'jsonl'
    ? 'application/x-ndjson; charset=utf-8'
    : 'application/json; charset=utf-8';
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': contentType,
    },
  });
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'settings');
  if (auth instanceof NextResponse) return auth;
  if (request.nextUrl.searchParams.has('format')) {
    return exportLogs(request);
  }
  const parsed = logsQuerySchema.safeParse(queryRecord(request.nextUrl.searchParams));
  if (!parsed.success) return badQueryResponse();
  const source = parseLogSource(parsed.data.source);
  if (!source || !ALLOWED_SOURCES.has(source)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_source', allowed: Array.from(ALLOWED_SOURCES) },
      { status: 400 },
    );
  }
  const entries = await listLogsAsync(source, {
    sinceTs: parsed.data.since,
    limit: parsed.data.limit,
    reference: parsed.data.reference,
  });
  return NextResponse.json({ ok: true, source, entries, ...(parsed.data.reference ? { reference: parsed.data.reference } : {}) });
}

export async function DELETE(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const parsed = deleteQuerySchema.safeParse(queryRecord(request.nextUrl.searchParams));
  if (!parsed.success) return badQueryResponse();
  if (parsed.data.before) {
    const retention = await pruneLogsBefore(
      parsed.data.before,
      parsed.data.source === 'all' ? undefined : parsed.data.source,
    );
    await flushDevLogWrites();
    return NextResponse.json({ ok: true, source: parsed.data.source, retention });
  }
  if (parsed.data.source === 'all') {
    clearLogs();
  } else {
    clearLogs(parsed.data.source);
  }
  await flushDevLogWrites();
  return NextResponse.json({ ok: true, source: parsed.data.source });
}
