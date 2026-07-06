import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
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
import {
  getExperimentsApiErrorPayload,
  type ExperimentsApiErrorCode,
} from '@/lib/builder/experiments/experiments-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  try {
    const experiments = await listExperiments();
    return NextResponse.json({ ok: true, experiments, total: experiments.length });
  } catch (error) {
    console.error('[builder/experiments] GET failed:', error);
    return errorResponse(locale, 'experiments_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const fallbackLocale = requestLocale(request);
  let raw: unknown;
  try {
    raw = await request.json();
  } catch (error) {
    console.error('[builder/experiments] POST JSON parse failed:', error);
    return errorResponse(fallbackLocale, 'invalid_json', 400);
  }
  const locale = requestLocale(request, (raw as { locale?: unknown } | null)?.locale);
  const parsed = experimentCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'validation_error', 400, { details: parsed.error.issues.slice(0, 3) });
  }
  const ids = parsed.data.variants.map((v) => v.variantId);
  if (new Set(ids).size !== ids.length) {
    return errorResponse(locale, 'duplicate_variant_ids', 400);
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
  try {
    await saveExperiment(experiment);
    return NextResponse.json({ ok: true, experiment }, { status: 201 });
  } catch (error) {
    console.error('[builder/experiments] POST failed:', error);
    return errorResponse(locale, 'experiment_create_failed', 500);
  }
}
