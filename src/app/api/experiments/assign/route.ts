import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getExperiment,
  saveExperiment,
} from '@/lib/builder/experiments/storage';
import { assignVariant } from '@/lib/builder/experiments/assign';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  const ip = clientIp(request);
  const rate = await checkRateLimit(`exp-assign:${ip}`, 120, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const experimentId = request.nextUrl.searchParams.get('experimentId') ?? '';
  if (!experimentId) {
    return NextResponse.json({ error: 'experimentId required' }, { status: 400 });
  }
  const experiment = await getExperiment(experimentId);
  if (!experiment) {
    return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
  }
  if (experiment.status !== 'running') {
    return NextResponse.json({ ok: true, variantId: null, reason: 'not-running' });
  }
  const sessionId = deriveSessionId(request);
  const variant = assignVariant(experiment, sessionId);
  if (!variant) {
    return NextResponse.json({ ok: true, variantId: null, reason: 'no-variants' });
  }

  // Increment exposure count (best-effort; not a transaction — slight skew tolerated).
  experiment.metrics.exposures[variant.variantId] = (experiment.metrics.exposures[variant.variantId] ?? 0) + 1;
  void saveExperiment(experiment).catch(() => undefined);

  const response = NextResponse.json({
    ok: true,
    variantId: variant.variantId,
    label: variant.label,
    overrides: variant.overrides,
    pageId: variant.pageId,
  });
  // Sticky cookie so subsequent calls land on the same variant.
  if (!request.headers.get('cookie')?.includes('tw_exp_sid=')) {
    response.cookies.set('tw_exp_sid', sessionId, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      path: '/',
    });
  }
  return response;
}
