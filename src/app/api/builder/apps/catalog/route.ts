import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listBuilderAppCatalogEntries,
  normalizeBuilderAppCategory,
  normalizeBuilderAppStatus,
} from '@/lib/builder/apps/installed';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  const entries = await listBuilderAppCatalogEntries(DEFAULT_BUILDER_SITE_ID, locale, {
    search: request.nextUrl.searchParams.get('search') ?? undefined,
    category: normalizeBuilderAppCategory(request.nextUrl.searchParams.get('category')),
    status: normalizeBuilderAppStatus(request.nextUrl.searchParams.get('status')),
  });

  return NextResponse.json({ ok: true, entries });
}
