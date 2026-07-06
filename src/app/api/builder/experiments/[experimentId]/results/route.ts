import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { getExperiment } from '@/lib/builder/experiments/storage';
import { computeExperimentStats } from '@/lib/builder/experiments/stats';
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

export async function GET(
  request: NextRequest,
  { params }: { params: { experimentId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  let experiment: Awaited<ReturnType<typeof getExperiment>>;
  try {
    experiment = await getExperiment(params.experimentId);
  } catch (error) {
    console.error('[builder/experiments/:id/results] GET load failed:', error);
    return errorResponse(locale, 'experiment_results_failed', 500);
  }
  if (!experiment) return errorResponse(locale, 'experiment_not_found', 404);

  try {
    return NextResponse.json({
      ok: true,
      experimentId: experiment.experimentId,
      status: experiment.status,
      goalEvent: experiment.goalEvent,
      stats: computeExperimentStats(experiment),
      totals: {
        exposures: Object.values(experiment.metrics.exposures).reduce((a, b) => a + b, 0),
        conversions: Object.values(experiment.metrics.conversions).reduce((a, b) => a + b, 0),
      },
    });
  } catch (error) {
    console.error('[builder/experiments/:id/results] GET failed:', error);
    return errorResponse(locale, 'experiment_results_failed', 500);
  }
}
