import { NextRequest, NextResponse } from 'next/server';
import { runConsultationEval } from '@/lib/consultation/eval/run-eval';
import { safeEqualStrings } from '@/lib/builder/security/timing-safe';

export const runtime = 'nodejs';
/** This endpoint runs a sequential sweep of 25+ LLM calls. Do not cache. */
export const dynamic = 'force-dynamic';

/**
 * Guarded evaluation endpoint.
 *
 * In development (NODE_ENV === 'development'), it runs with no secret —
 * that's fine because the dev server only listens on localhost.
 *
 * In production, it requires a CONSULTATION_EVAL_SECRET environment
 * variable and the caller must send it as `x-eval-secret` header. If the
 * secret env var is NOT set, the endpoint always returns 403 in prod to
 * prevent accidental exposure.
 *
 * This prevents the public internet from triggering unbounded LLM calls
 * on the live server.
 */
function guardOrNull(request: NextRequest): NextResponse | null {
  // Dev mode check is robust against .env.local accidentally carrying
  // VERCEL=1 / VERCEL_ENV=production (which happens when the developer
  // runs `vercel env pull --environment=production .env.local` for
  // local testing of production values). We treat "dev" as
  // `NODE_ENV !== 'production'`, which next dev always sets correctly.
  if (process.env.NODE_ENV !== 'production') return null;

  const expected = process.env.CONSULTATION_EVAL_SECRET;
  if (!expected) {
    return NextResponse.json(
      { success: false, error: 'Evaluation endpoint is disabled in production.' },
      { status: 403 },
    );
  }

  const provided = request.headers.get('x-eval-secret');
  if (!safeEqualStrings(provided, expected)) {
    return NextResponse.json(
      { success: false, error: 'Invalid or missing evaluation secret.' },
      { status: 403 },
    );
  }

  return null;
}

export async function POST(request: NextRequest) {
  const blocked = guardOrNull(request);
  if (blocked) return blocked;

  try {
    const report = await runConsultationEval();
    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('[consultation] eval run failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'unknown_eval_failure',
      },
      { status: 500 },
    );
  }
}
