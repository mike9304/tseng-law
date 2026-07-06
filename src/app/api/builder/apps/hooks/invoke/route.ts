import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import {
  appHookEventSchema,
  toAppHookEvent,
} from '@/lib/builder/apps/hook-event-schema';
import { dispatchAppHookEvent } from '@/lib/builder/apps/hook-runtime';
import {
  getBuilderAppsApiErrorPayload,
  type BuilderAppsApiErrorCode,
} from '@/lib/builder/apps/apps-api-copy';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderAppsApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderAppsApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderAppsApiErrorPayload(locale, 'invalid_request'), issues: error.flatten() },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const parsed = appHookEventSchema.parse(await request.json());
    const summary = await dispatchAppHookEvent(toAppHookEvent(parsed));
    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) return errorResponse(locale, 'invalid_json', 400);
    console.error('[builder/apps/hooks/invoke] dispatch failed:', error);
    return errorResponse(locale, 'hook_invoke_failed', 500);
  }
}
