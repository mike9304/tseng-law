import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import {
  APP_HOOK_KINDS,
  isValidAppHookId,
  isValidAppId,
} from '@/lib/builder/apps/hooks-model';
import {
  listStoredAppHookDeliveries,
} from '@/lib/builder/apps/hook-deliveries';
import {
  getBuilderAppsApiErrorPayload,
  type BuilderAppsApiErrorCode,
} from '@/lib/builder/apps/apps-api-copy';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  appId: z.string().trim().min(2).max(80).optional(),
  hookId: z.string().trim().min(2).max(80).optional(),
  kind: z.enum(APP_HOOK_KINDS).optional(),
  status: z.enum(['succeeded', 'failed']).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
}).strict();

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

function optionalParam(request: NextRequest, key: string): string | undefined {
  const value = request.nextUrl.searchParams.get(key)?.trim();
  return value && value.length > 0 ? value : undefined;
}

function queryPayload(request: NextRequest): Record<string, string | undefined> {
  return {
    appId: optionalParam(request, 'appId'),
    hookId: optionalParam(request, 'hookId'),
    kind: optionalParam(request, 'kind'),
    status: optionalParam(request, 'status'),
    limit: optionalParam(request, 'limit'),
  };
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const parsed = querySchema.parse(queryPayload(request));
    if (parsed.appId && !isValidAppId(parsed.appId)) return errorResponse(locale, 'invalid_app_id', 400);
    if (parsed.hookId && !isValidAppHookId(parsed.hookId)) return errorResponse(locale, 'invalid_hook_id', 400);
    const deliveries = await listStoredAppHookDeliveries(parsed);
    return NextResponse.json({ ok: true, deliveries, total: deliveries.length });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(locale, 'invalid_request', 400, { issues: error.flatten() });
    }
    console.error('[builder/apps/hooks/deliveries] list failed:', error);
    return errorResponse(locale, 'hook_deliveries_failed', 500);
  }
}
