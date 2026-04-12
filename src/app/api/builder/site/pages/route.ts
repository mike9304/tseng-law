import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { listPages, createPage } from '@/lib/builder/site/persistence';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const pages = await listPages('default', locale);
  return NextResponse.json({ pages });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { slug?: string; title?: string; locale?: string };
  const locale = normalizeLocale(body.locale || 'ko');
  const slug = body.slug?.trim() || '';
  const title = body.title?.trim() || 'New Page';

  if (slug.length > 200) {
    return NextResponse.json({ error: 'Slug too long' }, { status: 400 });
  }

  const page = await createPage('default', locale, slug, title);
  return NextResponse.json({ success: true, page });
}
