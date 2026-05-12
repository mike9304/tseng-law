import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  cancelScheduledPublishes,
  getActiveScheduledPublish,
  schedulePagePublish,
} from '@/lib/builder/site/scheduled-publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const job = await getActiveScheduledPublish(DEFAULT_BUILDER_SITE_ID, params.pageId);
  return NextResponse.json({ ok: true, job });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { bucket: 'publish', permission: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const locale = normalizeLocale(
    typeof body.locale === 'string'
      ? body.locale
      : request.nextUrl.searchParams.get('locale') ?? undefined,
  );
  const scheduledAt = typeof body.scheduledAt === 'string' ? body.scheduledAt : '';
  const scheduledMs = Date.parse(scheduledAt);
  if (!Number.isFinite(scheduledMs)) return badRequest('scheduledAt must be an ISO timestamp.');
  if (scheduledMs <= Date.now()) return badRequest('scheduledAt must be in the future.');

  const expectedDraftRevision =
    typeof body.expectedDraftRevision === 'number' && Number.isFinite(body.expectedDraftRevision)
      ? Math.trunc(body.expectedDraftRevision)
      : undefined;

  const job = await schedulePagePublish({
    siteId: DEFAULT_BUILDER_SITE_ID,
    pageId: params.pageId,
    locale,
    scheduledAt: new Date(scheduledMs).toISOString(),
    expectedDraftRevision,
    requestedBy: auth.username,
  });

  return NextResponse.json({ ok: true, job });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { bucket: 'publish', permission: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const cancelled = await cancelScheduledPublishes(
    DEFAULT_BUILDER_SITE_ID,
    params.pageId,
    `cancelled by ${auth.username}`,
  );
  return NextResponse.json({ ok: true, cancelled });
}
