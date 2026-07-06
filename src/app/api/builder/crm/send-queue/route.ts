import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getSendQueueStats } from '@/lib/builder/crm/campaign-queue';
import {
  getBuilderCrmApiErrorPayload,
  type BuilderCrmApiErrorCode,
} from '@/lib/builder/crm/crm-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, {
    allowReadOnly: true,
    permission: 'view-contacts',
  });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  const url = request.nextUrl;
  const recentLimitRaw = Number(url.searchParams.get('recent') ?? '20');
  const recentLimit = Number.isFinite(recentLimitRaw)
    ? Math.min(100, Math.max(0, Math.floor(recentLimitRaw)))
    : 20;

  try {
    const stats = await getSendQueueStats(recentLimit);
    return NextResponse.json({ ok: true, stats });
  } catch (error) {
    console.error('[builder/crm/send-queue] stats failed:', error);
    return errorResponse(locale, 'send_queue_stats_failed', 500);
  }
}
