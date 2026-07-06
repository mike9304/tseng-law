import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getExperiment,
  saveExperiment,
} from '@/lib/builder/experiments/storage';
import { assignVariant } from '@/lib/builder/experiments/assign';
import {
  getExperimentsApiErrorPayload,
  type ExperimentsApiErrorCode,
} from '@/lib/builder/experiments/experiments-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function requestLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: ExperimentsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getExperimentsApiErrorPayload(locale, errorCode),
    },
    { status },
  );
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function deriveSessionId(request: NextRequest): string {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)tw_exp_sid=([^;]+)/);
  if (cookieMatch) return cookieMatch[1];
  // Fallback: hash ip+ua so the same client gets sticky variants without a cookie.
  return crypto
    .createHash('sha256')
    .update(`${clientIp(request)}|${request.headers.get('user-agent') ?? ''}`)
    .digest('hex')
    .slice(0, 24);
}

export async function GET(request: NextRequest) {
  const locale = requestLocale(request);
  const ip = clientIp(request);
  const rate = await checkRateLimit(`exp-assign:${ip}`, 120, 60_000);
  if (!rate.allowed) {
    return errorResponse(locale, 'too_many_requests', 429);
  }
  const experimentId = request.nextUrl.searchParams.get('experimentId') ?? '';
  if (!experimentId) {
    return errorResponse(locale, 'experiment_id_required', 400);
  }
  let experiment: Awaited<ReturnType<typeof getExperiment>>;
  try {
    experiment = await getExperiment(experimentId);
  } catch (error) {
    console.error('[experiments/assign] experiment load failed:', error);
    return errorResponse(locale, 'experiment_assign_failed', 500);
  }
  if (!experiment) return errorResponse(locale, 'experiment_not_found', 404);
  if (experiment.status !== 'running') {
    return NextResponse.json({ ok: true, variantId: null, reason: 'not-running' });
  }
  const sessionId = deriveSessionId(request);
  let variant: ReturnType<typeof assignVariant>;
  try {
    variant = assignVariant(experiment, sessionId);
  } catch (error) {
    console.error('[experiments/assign] assignment failed:', error);
    return errorResponse(locale, 'experiment_assign_failed', 500);
  }
  if (!variant) return NextResponse.json({ ok: true, variantId: null, reason: 'no-variants' });

  // Only count the FIRST exposure per session/experiment, otherwise every page
  // navigation by the same visitor inflates the count and skews the z-test.
  const cookieHeader = request.headers.get('cookie') ?? '';
  const exposureCookieName = `tw_exp_${experiment.experimentId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  const alreadyCounted = cookieHeader.includes(`${exposureCookieName}=`);
  if (!alreadyCounted) {
    experiment.metrics.exposures[variant.variantId] = (experiment.metrics.exposures[variant.variantId] ?? 0) + 1;
    void saveExperiment(experiment).catch(() => undefined);
  }

  const response = NextResponse.json({
    ok: true,
    variantId: variant.variantId,
    label: variant.label,
    overrides: variant.overrides,
    pageId: variant.pageId,
    firstExposure: !alreadyCounted,
  });
  // Sticky cookie so subsequent calls land on the same variant.
  if (!cookieHeader.includes('tw_exp_sid=')) {
    response.cookies.set('tw_exp_sid', sessionId, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      path: '/',
    });
  }
  if (!alreadyCounted) {
    response.cookies.set(exposureCookieName, variant.variantId, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      path: '/',
    });
  }
  return response;
}
