import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { getExperiment, saveExperiment } from '@/lib/builder/experiments/storage';
import { experimentUpdateSchema } from '@/lib/builder/experiments/types';
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

export async function GET(
  request: NextRequest,
  { params }: { params: { experimentId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  try {
    const experiment = await getExperiment(params.experimentId);
    if (!experiment) return errorResponse(locale, 'experiment_not_found', 404);
    return NextResponse.json({ ok: true, experiment });
  } catch (error) {
    console.error('[builder/experiments/:id] GET failed:', error);
    return errorResponse(locale, 'experiment_load_failed', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { experimentId: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const fallbackLocale = requestLocale(request);

  let existing: Awaited<ReturnType<typeof getExperiment>>;
  try {
    existing = await getExperiment(params.experimentId);
  } catch (error) {
    console.error('[builder/experiments/:id] PATCH load failed:', error);
    return errorResponse(fallbackLocale, 'experiment_update_failed', 500);
  }
  if (!existing) return errorResponse(fallbackLocale, 'experiment_not_found', 404);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch (error) {
    console.error('[builder/experiments/:id] PATCH JSON parse failed:', error);
    return errorResponse(fallbackLocale, 'invalid_json', 400);
  }
  const locale = requestLocale(request, (raw as { locale?: unknown } | null)?.locale);
  const parsed = experimentUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'validation_error', 400, { details: parsed.error.issues.slice(0, 3) });
  }

  if (parsed.data.variants) {
    const ids = parsed.data.variants.map((variant) => variant.variantId);
    if (new Set(ids).size !== ids.length) {
      return errorResponse(locale, 'duplicate_variant_ids', 400);
    }
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
  try {
    await saveExperiment(merged);
    return NextResponse.json({ ok: true, experiment: merged });
  } catch (error) {
    console.error('[builder/experiments/:id] PATCH failed:', error);
    return errorResponse(locale, 'experiment_update_failed', 500);
  }
}
