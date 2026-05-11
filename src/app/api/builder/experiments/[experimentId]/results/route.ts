import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getExperiment } from '@/lib/builder/experiments/storage';
import { computeExperimentStats } from '@/lib/builder/experiments/stats';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { experimentId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const experiment = await getExperiment(params.experimentId);
  if (!experiment) return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });

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
}
