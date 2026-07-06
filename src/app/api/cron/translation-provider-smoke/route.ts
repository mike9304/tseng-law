import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { runScheduledTranslationProviderSmoke } from '@/lib/builder/translations/providers/scheduled-smoke';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  sourceLocale: z.string().optional(),
  targetLocale: z.string().optional(),
  sourceText: z.string().trim().min(1).max(500).optional(),
}).strict();

function routeInput(request: NextRequest) {
  const parsed = querySchema.safeParse({
    sourceLocale: request.nextUrl.searchParams.get('sourceLocale') ?? undefined,
    targetLocale: request.nextUrl.searchParams.get('targetLocale') ?? undefined,
    sourceText: request.nextUrl.searchParams.get('sourceText') ?? undefined,
  });
  if (!parsed.success) return null;
  return {
    sourceLocale: normalizeLocale(parsed.data.sourceLocale ?? 'ko'),
    targetLocale: normalizeLocale(parsed.data.targetLocale ?? 'en'),
    sourceText: parsed.data.sourceText ?? '호정국제 번역 제공자 정기 점검',
  };
}

async function run(request: NextRequest): Promise<NextResponse> {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const input = routeInput(request);
  if (!input || input.sourceLocale === input.targetLocale) {
    return NextResponse.json({ ok: false, error: 'Invalid smoke request' }, { status: 400 });
  }

  const summary = await runScheduledTranslationProviderSmoke(input);
  return NextResponse.json({ ok: true, ...summary });
}

export async function GET(request: NextRequest) {
  return run(request);
}

export async function POST(request: NextRequest) {
  return run(request);
}
