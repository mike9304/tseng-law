import { NextRequest, NextResponse } from 'next/server';
import { readRecentAuditEvents } from '@/lib/builder/audit/store';
import type { AuditEvent } from '@/lib/builder/audit/types';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getBuilderSiteApiErrorPayload } from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(locale: Locale): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, 'audit_events_load_failed') },
    { status: 500 },
  );
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const limitParam = Number(request.nextUrl.searchParams.get('limit') ?? 200);
  const filters = readAuditEventFilters(request);
  try {
    const events = await readRecentAuditEvents(Number.isFinite(limitParam) ? limitParam : 200);
    const filteredEvents = filterAuditEvents(events, filters);

    return NextResponse.json({
      ok: true,
      events: filteredEvents,
    });
  } catch {
    return errorResponse(locale);
  }
}

function readAuditEventFilters(request: NextRequest): {
  readonly collectionId?: string;
  readonly recordId?: string;
} {
  const collectionId = readFilterValue(request, 'collectionId');
  const recordId = readFilterValue(request, 'recordId');
  return {
    ...(collectionId ? { collectionId } : {}),
    ...(recordId ? { recordId } : {}),
  };
}

function readFilterValue(request: NextRequest, key: string): string | undefined {
  const value = request.nextUrl.searchParams.get(key)?.trim();
  return value ? value : undefined;
}

function filterAuditEvents(
  events: readonly AuditEvent[],
  filters: { readonly collectionId?: string; readonly recordId?: string },
): readonly AuditEvent[] {
  return events.filter((event) => (
    matchesCollectionFilter(event, filters.collectionId)
    && matchesRecordFilter(event, filters.recordId)
  ));
}

function matchesCollectionFilter(event: AuditEvent, collectionId: string | undefined): boolean {
  if (!collectionId) return true;
  return 'collectionId' in event && event.collectionId === collectionId;
}

function matchesRecordFilter(event: AuditEvent, recordId: string | undefined): boolean {
  if (!recordId) return true;
  return 'recordIds' in event && event.recordIds.includes(recordId);
}
