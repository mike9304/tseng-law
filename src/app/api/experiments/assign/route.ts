import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { validateCsrf } from '@/lib/builder/security/csrf';
import {
  getExperiment,
  incrementExperimentMetric,
} from '@/lib/builder/experiments/storage';
import { assignVariant } from '@/lib/builder/experiments/assign';
import {
  createExperimentAssignmentToken,
  verifyExperimentAssignmentToken,
} from '@/lib/builder/experiments/assignment-token';
import { claimExperimentMetricOnce } from '@/lib/builder/experiments/metric-idempotency';
import {
  getExperimentsApiErrorPayload,
  type ExperimentsApiErrorCode,
} from '@/lib/builder/experiments/experiments-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const exposureSchema = z.object({
  assignmentToken: z.string().trim().min(1).max(2_048),
  locale: z.string().optional(),
});

function requestLocale(request: NextRequest, input?: unknown): Locale {
  if (typeof input === 'string') return normalizeLocale(input);
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

function readSessionId(request: NextRequest): string | null {
  const cookieValue = request.cookies.get('tw_exp_sid')?.value;
  return cookieValue || null;
}

function setSessionCookie(response: NextResponse, sessionId: string): void {
  response.cookies.set('tw_exp_sid', sessionId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

function setExposureCookie(
  response: NextResponse,
  name: string,
  variantId: string,
): void {
  response.cookies.set(name, variantId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
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
  const existingSessionId = readSessionId(request);
  const sessionId = existingSessionId ?? crypto.randomUUID();
  let variant: ReturnType<typeof assignVariant>;
  try {
    variant = assignVariant(experiment, sessionId);
  } catch (error) {
    console.error('[experiments/assign] assignment failed:', error);
    return errorResponse(locale, 'experiment_assign_failed', 500);
  }
  if (!variant) return NextResponse.json({ ok: true, variantId: null, reason: 'no-variants' });

  const exposureCookieName = `tw_exp_${experiment.experimentId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  const alreadyCounted = Boolean(existingSessionId) && request.cookies.has(exposureCookieName);
  let assignmentToken: string;
  try {
    assignmentToken = createExperimentAssignmentToken(
      experiment.experimentId,
      variant.variantId,
      sessionId,
    );
  } catch (error) {
    console.error('[experiments/assign] assignment token creation failed:', error);
    return errorResponse(locale, 'experiment_assign_failed', 500);
  }

  // GET only resolves the deterministic variant and establishes its HttpOnly
  // session. Exposure metrics and marker cookies are written by the explicit,
  // CSRF-protected POST below.
  const response = NextResponse.json({
    ok: true,
    variantId: variant.variantId,
    label: variant.label,
    overrides: variant.overrides,
    pageId: variant.pageId,
    firstExposure: !alreadyCounted,
    assignmentToken,
  });
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  if (!existingSessionId) setSessionCookie(response, sessionId);
  return response;
}

export async function POST(request: NextRequest) {
  const fallbackLocale = requestLocale(request);
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  const ip = clientIp(request);
  const rate = await checkRateLimit(`exp-exposure:${ip}`, 60, 60_000);
  if (!rate.allowed) {
    return errorResponse(fallbackLocale, 'too_many_requests', 429);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch (error) {
    console.error('[experiments/assign] POST JSON parse failed:', error);
    return errorResponse(fallbackLocale, 'invalid_json', 400);
  }

  const locale = requestLocale(
    request,
    typeof (raw as { locale?: unknown } | null)?.locale === 'string'
      ? (raw as { locale: string }).locale
      : undefined,
  );
  const parsed = exposureSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'validation_error', 400);
  }

  const sessionId = readSessionId(request);
  if (!sessionId) {
    return errorResponse(locale, 'invalid_assignment_token', 403);
  }
  const assignment = verifyExperimentAssignmentToken(
    parsed.data.assignmentToken,
    sessionId,
  );
  if (!assignment) {
    return errorResponse(locale, 'invalid_assignment_token', 403);
  }

  const exposureCookieName = `tw_exp_${assignment.experimentId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  if (request.cookies.has(exposureCookieName)) {
    return NextResponse.json({ ok: true, ignored: 'already-counted' });
  }

  let experiment: Awaited<ReturnType<typeof getExperiment>>;
  try {
    experiment = await getExperiment(assignment.experimentId);
  } catch (error) {
    console.error('[experiments/assign] exposure experiment load failed:', error);
    return errorResponse(locale, 'experiment_assign_failed', 500);
  }
  if (!experiment) return errorResponse(locale, 'experiment_not_found', 404);
  if (experiment.status !== 'running') {
    return NextResponse.json({ ok: true, ignored: 'not-running' });
  }
  if (!experiment.variants.some((variant) => variant.variantId === assignment.variantId)) {
    return errorResponse(locale, 'unknown_variant', 400);
  }

  let claim: Awaited<ReturnType<typeof claimExperimentMetricOnce>>;
  try {
    claim = await claimExperimentMetricOnce({
      experimentId: assignment.experimentId,
      kind: 'exposure',
      sessionId,
    });
  } catch (error) {
    console.error('[experiments/assign] exposure claim failed:', error);
    return errorResponse(locale, 'experiment_assign_failed', 500);
  }
  if (!claim.claimed) {
    // A persistent claim may have been left behind by a failed write in an
    // earlier request. Do not set a browser marker unless this request knows
    // that the metric itself was persisted; the visitor can safely retry.
    return NextResponse.json({ ok: true, ignored: 'already-claimed' });
  }

  try {
    await incrementExperimentMetric({
      experimentId: assignment.experimentId,
      variantId: assignment.variantId,
      kind: 'exposure',
    });
  } catch (error) {
    await claim.release().catch((releaseError) => {
      console.error('[experiments/assign] exposure claim release failed:', releaseError);
    });
    console.error('[experiments/assign] exposure metric mutation failed:', error);
    return errorResponse(locale, 'experiment_assign_failed', 500);
  }

  const response = NextResponse.json({ ok: true });
  setExposureCookie(response, exposureCookieName, assignment.variantId);
  return response;
}
