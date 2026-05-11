import { NextRequest, NextResponse } from 'next/server';
import { seedSitePages } from '@/lib/builder/canvas/seed-pages';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SeedRequestBody = {
  locale?: unknown;
  siteId?: unknown;
};

async function readJsonBody(request: NextRequest): Promise<SeedRequestBody | null> {
  const text = await request.text();
  if (!text.trim()) return {};
  const parsed = JSON.parse(text) as unknown;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  return parsed as SeedRequestBody;
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: SeedRequestBody | null;
  try {
    body = await readJsonBody(request);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body) {
    return NextResponse.json({ ok: false, error: 'JSON body must be an object' }, { status: 400 });
  }

  const locale = normalizeLocale(
    typeof body.locale === 'string'
      ? body.locale
      : request.nextUrl.searchParams.get('locale') || undefined,
  );
  const siteId = normalizeBuilderSiteId(
    typeof body.siteId === 'string'
      ? body.siteId
      : request.nextUrl.searchParams.get('siteId'),
  );

  await seedSitePages(siteId, locale);

  return NextResponse.json({ ok: true, siteId, locale });
}
