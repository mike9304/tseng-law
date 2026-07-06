import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getExperiment, saveExperiment } from '@/lib/builder/experiments/storage';
import {
  getExperimentsApiErrorPayload,
  type ExperimentsApiErrorCode,
} from '@/lib/builder/experiments/experiments-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  experimentId: z.string().trim().min(1).max(120),
  variantId: z.string().trim().min(1).max(80),
  goal: z.string().trim().min(1).max(80),
});

function requestLocale(request: NextRequest, input?: unknown): Locale {
  if (typeof input === 'string') return normalizeLocale(input);
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: ExperimentsApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getExperimentsApiErrorPayload(locale, errorCode),
      ...(extra ?? {}),
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

export async function POST(request: NextRequest) {
  const fallbackLocale = requestLocale(request);
  const ip = clientIp(request);
  const rate = await checkRateLimit(`exp-event:${ip}`, 60, 60_000);
  if (!rate.allowed) {
    return errorResponse(fallbackLocale, 'too_many_requests', 429);
  }
  let raw: unknown;
  try {
    raw = await request.json();
  } catch (error) {
    console.error('[experiments/event] POST JSON parse failed:', error);
    return errorResponse(fallbackLocale, 'invalid_json', 400);
  }
  const locale = requestLocale(request, (raw as { locale?: unknown } | null)?.locale);
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'validation_error', 400, { details: parsed.error.issues.slice(0, 3) });
  }
  let experiment: Awaited<ReturnType<typeof getExperiment>>;
  try {
    experiment = await getExperiment(parsed.data.experimentId);
  } catch (error) {
    console.error('[experiments/event] experiment load failed:', error);
    return errorResponse(locale, 'experiment_event_failed', 500);
  }
  if (!experiment) return errorResponse(locale, 'experiment_not_found', 404);
  if (experiment.goalEvent !== parsed.data.goal) {
    return NextResponse.json({ ok: true, ignored: 'wrong goal' });
  }
  if (!experiment.variants.some((v) => v.variantId === parsed.data.variantId)) {
    return errorResponse(locale, 'unknown_variant', 400);
  }

  // Only count each conversion once per session/experiment/goal — otherwise a
  // designer's CTA that re-fires (e.g. modal re-open) inflates the conversion
  // rate. The marker cookie is short-lived (24h) so a returning visitor on a
  // different day can still convert.
  const cookieHeader = request.headers.get('cookie') ?? '';
  const safeId = parsed.data.experimentId.replace(/[^a-zA-Z0-9_]/g, '_');
  const safeGoal = parsed.data.goal.replace(/[^a-zA-Z0-9_]/g, '_');
  const goalCookie = `tw_exp_conv_${safeId}_${safeGoal}`;
  if (cookieHeader.includes(`${goalCookie}=`)) {
    return NextResponse.json({ ok: true, ignored: 'already-counted' });
  }
  experiment.metrics.conversions[parsed.data.variantId] =
    (experiment.metrics.conversions[parsed.data.variantId] ?? 0) + 1;
  try {
    await saveExperiment(experiment);
  } catch (error) {
    console.error('[experiments/event] conversion save failed:', error);
    return errorResponse(locale, 'experiment_event_failed', 500);
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(goalCookie, '1', {
    maxAge: 60 * 60 * 24,
    sameSite: 'lax',
    path: '/',
  });
  return response;
}
