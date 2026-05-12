import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getExperiment, saveExperiment } from '@/lib/builder/experiments/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  experimentId: z.string().trim().min(1).max(120),
  variantId: z.string().trim().min(1).max(80),
  goal: z.string().trim().min(1).max(80),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const rate = await checkRateLimit(`exp-event:${ip}`, 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 });
  }
  const experiment = await getExperiment(parsed.data.experimentId);
  if (!experiment) {
    return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
  }
  if (experiment.goalEvent !== parsed.data.goal) {
    return NextResponse.json({ ok: true, ignored: 'wrong goal' });
  }
  if (!experiment.variants.some((v) => v.variantId === parsed.data.variantId)) {
    return NextResponse.json({ error: 'Unknown variant' }, { status: 400 });
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
  await saveExperiment(experiment);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(goalCookie, '1', {
    maxAge: 60 * 60 * 24,
    sameSite: 'lax',
    path: '/',
  });
  return response;
}
