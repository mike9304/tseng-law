import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { locales } from '@/lib/locales';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import {
  listAiIntakeVersions,
  normalizeAiIntakeSiteId,
} from '@/lib/builder/ai-generator/intake-versions-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const localeQuerySchema = z.enum(locales).optional();

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;

  const siteId = normalizeAiIntakeSiteId(request.nextUrl.searchParams.get('siteId') ?? undefined);
  const localeParsed = localeQuerySchema.safeParse(request.nextUrl.searchParams.get('locale') ?? undefined);
  if (!localeParsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_locale' }, { status: 400 });
  }
  const versions = await listAiIntakeVersions(siteId, { locale: localeParsed.data });
  return NextResponse.json({ ok: true, siteId, versions });
}
