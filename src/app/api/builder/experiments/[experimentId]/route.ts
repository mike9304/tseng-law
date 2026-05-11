import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getExperiment, saveExperiment } from '@/lib/builder/experiments/storage';
import { experimentUpdateSchema } from '@/lib/builder/experiments/types';

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
  return NextResponse.json({ ok: true, experiment });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { experimentId: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getExperiment(params.experimentId);
  if (!existing) return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });

  const raw = await request.json().catch(() => null);
  const parsed = experimentUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid update' }, { status: 400 });
  }

  const nextStatus = parsed.data.status ?? existing.status;
  const merged = {
    ...existing,
    ...parsed.data,
    status: nextStatus,
    startedAt:
      nextStatus === 'running' && !existing.startedAt ? new Date().toISOString() : existing.startedAt,
    endedAt: nextStatus === 'completed' ? new Date().toISOString() : existing.endedAt,
    updatedAt: new Date().toISOString(),
  };
  await saveExperiment(merged);
  return NextResponse.json({ ok: true, experiment: merged });
}
