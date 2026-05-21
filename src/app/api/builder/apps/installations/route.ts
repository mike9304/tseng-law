import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardMutation } from '@/lib/builder/security/guard';
import { installBuilderApp, listBuilderAppCatalogEntries } from '@/lib/builder/apps/installed';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const installPayloadSchema = z.object({
  appId: z.string().trim().min(2).max(80),
}).strict();

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  const entries = await listBuilderAppCatalogEntries(DEFAULT_BUILDER_SITE_ID, locale, { status: 'installed' });
  return NextResponse.json({ ok: true, entries });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  const payload = installPayloadSchema.parse(await request.json());
  const result = await installBuilderApp(DEFAULT_BUILDER_SITE_ID, locale, payload.appId, auth.username);
  if (!result) {
    return NextResponse.json({ ok: false, error: 'app_not_found' }, { status: 404 });
  }
  if (result.migrationFailed) {
    return NextResponse.json({ ok: false, error: 'app_migration_failed', ...result }, { status: 409 });
  }
  return NextResponse.json({ ok: true, ...result }, { status: result.changed ? 201 : 200 });
}
