import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  disableBuilderApp,
  enableBuilderApp,
  rollbackBuilderApp,
  restoreUninstalledBuilderApp,
  uninstallBuilderApp,
} from '@/lib/builder/apps/installed';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getBuilderAppsApiErrorPayload,
  type BuilderAppsApiErrorCode,
} from '@/lib/builder/apps/apps-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const lifecyclePayloadSchema = z.union([
  z.object({
    status: z.enum(['enabled', 'disabled']),
  }).strict(),
  z.object({
    action: z.literal('rollback'),
  }).strict(),
  z.object({
    action: z.literal('restore'),
  }).strict(),
]);

const uninstallPayloadSchema = z.object({
  cleanupMode: z.enum(['keep-data', 'remove-data']).optional(),
}).strict();

interface RouteParams {
  params: {
    appId: string;
  };
}

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

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  let payload: z.infer<typeof lifecyclePayloadSchema>;
  try {
    payload = lifecyclePayloadSchema.parse(await request.json());
  } catch (error) {
    return errorResponse(locale, error instanceof z.ZodError ? 'invalid_request' : 'invalid_json', 400);
  }
  let result: Awaited<ReturnType<typeof enableBuilderApp>>;
  try {
    result = 'action' in payload
      ? payload.action === 'rollback'
        ? await rollbackBuilderApp(DEFAULT_BUILDER_SITE_ID, locale, params.appId, auth.username)
        : await restoreUninstalledBuilderApp(DEFAULT_BUILDER_SITE_ID, locale, params.appId, auth.username)
      : payload.status === 'enabled'
        ? await enableBuilderApp(DEFAULT_BUILDER_SITE_ID, locale, params.appId, auth.username)
        : await disableBuilderApp(DEFAULT_BUILDER_SITE_ID, locale, params.appId, auth.username);
  } catch (error) {
    console.error('[builder/apps/installations/:appId] lifecycle failed:', error);
    return errorResponse(locale, 'app_action_failed', 500);
  }

  if (!result) {
    return errorResponse(locale, 'app_not_installed', 404);
  }
  if (result.rollbackUnavailable) {
    return errorResponse(locale, 'app_rollback_unavailable', 409, result as unknown as Record<string, unknown>);
  }
  if (result.restoreUnavailable) {
    return errorResponse(locale, 'app_restore_unavailable', 409, result as unknown as Record<string, unknown>);
  }
  if (result.migrationFailed) {
    return errorResponse(locale, 'app_migration_failed', 409, result as unknown as Record<string, unknown>);
  }
  return NextResponse.json({ ok: true, ...result });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  const text = await request.text();
  let payload: z.infer<typeof uninstallPayloadSchema> | { cleanupMode: undefined };
  try {
    payload = text.trim()
      ? uninstallPayloadSchema.parse(JSON.parse(text) as unknown)
      : { cleanupMode: undefined };
  } catch (error) {
    return errorResponse(locale, error instanceof z.ZodError ? 'invalid_request' : 'invalid_json', 400);
  }
  let result: Awaited<ReturnType<typeof uninstallBuilderApp>>;
  try {
    result = await uninstallBuilderApp(
      DEFAULT_BUILDER_SITE_ID,
      locale,
      params.appId,
      auth.username,
      payload.cleanupMode,
    );
  } catch (error) {
    console.error('[builder/apps/installations/:appId] uninstall failed:', error);
    return errorResponse(locale, 'app_action_failed', 500);
  }
  if (!result) {
    return errorResponse(locale, 'app_not_found', 404);
  }
  return NextResponse.json({ ok: true, ...result });
}
