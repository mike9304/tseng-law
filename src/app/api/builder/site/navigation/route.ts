import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { guardMutation } from '@/lib/builder/security/guard';
import type { BuilderNavItem } from '@/lib/builder/site/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const site = await readSiteDocument('default', locale);
  return NextResponse.json({ navigation: site.navigation });
}

export async function PUT(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  let body: { navigation?: BuilderNavItem[]; locale?: string };
  try {
    body = (await request.json()) as { navigation?: BuilderNavItem[]; locale?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const locale = normalizeLocale(body.locale || 'ko');

  if (!Array.isArray(body.navigation)) {
    return NextResponse.json({ error: 'navigation array required' }, { status: 400 });
  }

  const site = await readSiteDocument('default', locale);
  site.navigation = body.navigation;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);

  return NextResponse.json({ success: true, navigation: site.navigation });
}
