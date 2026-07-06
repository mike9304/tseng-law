import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readOutbox } from '@/lib/builder/crm/automation-model';
import {
  getBuilderCrmApiErrorPayload,
  type BuilderCrmApiErrorCode,
} from '@/lib/builder/crm/crm-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: z.string().trim().optional(),
  recent: z.coerce.number().int().min(0).max(100).default(20).catch(20),
});

function queryRecord(params: URLSearchParams): Record<string, string> {
  const record: Record<string, string> = {};
  params.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderCrmApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderCrmApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function logOutboxFailure(error: unknown): void {
  if (error instanceof Error) {
    console.error('[builder/crm/outbox] list failed:', error);
    return;
  }
  console.error('[builder/crm/outbox] list failed:', new Error('Unknown outbox failure'));
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, {
    allowReadOnly: true,
    permission: 'view-contacts',
  });
  if (auth instanceof NextResponse) return auth;

  const parsed = querySchema.parse(queryRecord(request.nextUrl.searchParams));
  const locale = normalizeLocale(parsed.locale ?? 'ko');

  try {
    const entries = await readOutbox();
    const recent = [...entries]
      .sort((left, right) => right.triggeredAt.localeCompare(left.triggeredAt))
      .slice(0, parsed.recent);
    return NextResponse.json({ ok: true, total: entries.length, entries: recent });
  } catch (error) {
    logOutboxFailure(error);
    return errorResponse(locale, 'outbox_list_failed', 500);
  }
}
