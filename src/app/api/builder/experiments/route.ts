import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listExperiments,
  makeExperimentId,
  saveExperiment,
} from '@/lib/builder/experiments/storage';
import {
  emptyMetrics,
  experimentCreateSchema,
  type Experiment,
} from '@/lib/builder/experiments/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const experiments = await listExperiments();
  return NextResponse.json({ ok: true, experiments, total: experiments.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null);
  const parsed = experimentCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid experiment', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }
  // Reject duplicate variantIds within the experiment.
  const ids = parsed.data.variants.map((v) => v.variantId);
  if (new Set(ids).size !== ids.length) {
    return NextResponse.json({ error: 'Variant ids must be unique' }, { status: 400 });
  }
  const now = new Date().toISOString();
  const experiment: Experiment = {
    experimentId: makeExperimentId(),
    name: parsed.data.name,
    description: parsed.data.description,
    targetPath: parsed.data.targetPath,
    variants: parsed.data.variants,
    goalEvent: parsed.data.goalEvent,
    status: 'draft',
    metrics: emptyMetrics(),
    createdAt: now,
    updatedAt: now,
  };
  await saveExperiment(experiment);
  return NextResponse.json({ ok: true, experiment }, { status: 201 });
}
