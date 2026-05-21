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
import { normalizeLocale } from '@/lib/locales';

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

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  const payload = lifecyclePayloadSchema.parse(await request.json());
  const result = 'action' in payload
    ? payload.action === 'rollback'
      ? await rollbackBuilderApp(DEFAULT_BUILDER_SITE_ID, locale, params.appId, auth.username)
      : await restoreUninstalledBuilderApp(DEFAULT_BUILDER_SITE_ID, locale, params.appId, auth.username)
    : payload.status === 'enabled'
      ? await enableBuilderApp(DEFAULT_BUILDER_SITE_ID, locale, params.appId, auth.username)
      : await disableBuilderApp(DEFAULT_BUILDER_SITE_ID, locale, params.appId, auth.username);

  if (!result) {
    return NextResponse.json({ ok: false, error: 'app_not_installed' }, { status: 404 });
  }
  if (result.rollbackUnavailable) {
    return NextResponse.json({ ok: false, error: 'app_rollback_unavailable', ...result }, { status: 409 });
  }
  if (result.restoreUnavailable) {
    return NextResponse.json({ ok: false, error: 'app_restore_unavailable', ...result }, { status: 409 });
  }
  if (result.migrationFailed) {
    return NextResponse.json({ ok: false, error: 'app_migration_failed', ...result }, { status: 409 });
  }
  return NextResponse.json({ ok: true, ...result });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  const text = await request.text();
  const payload = text.trim()
    ? uninstallPayloadSchema.parse(JSON.parse(text) as unknown)
    : { cleanupMode: undefined };
  const result = await uninstallBuilderApp(
    DEFAULT_BUILDER_SITE_ID,
    locale,
    params.appId,
    auth.username,
    payload.cleanupMode,
  );
  if (!result) {
    return NextResponse.json({ ok: false, error: 'app_not_found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, ...result });
}
