import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { listPages, createPage, writePageCanvas } from '@/lib/builder/site/persistence';
import { normalizeCanvasDocument, createDefaultCanvasDocument } from '@/lib/builder/canvas/types';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const pages = await listPages('default', locale);
  return NextResponse.json({ pages });
}

export async function POST(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  let body: { slug?: string; title?: string; locale?: string; document?: unknown };
  try {
    body = (await request.json()) as { slug?: string; title?: string; locale?: string; document?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const locale = normalizeLocale(body.locale || 'ko');
  const slug = body.slug?.trim() || '';
  const title = body.title?.trim() || 'New Page';

  if (slug.length > 200) {
    return NextResponse.json({ error: 'Slug too long' }, { status: 400 });
  }

  const page = await createPage('default', locale, slug, title);

  // Save the initial canvas document (template or blank)
  const canvasDoc = body.document
    ? normalizeCanvasDocument(body.document, locale)
    : createDefaultCanvasDocument(locale);
  await writePageCanvas('default', page.pageId, 'draft', canvasDoc);

  return NextResponse.json({ success: true, pageId: page.pageId, page });
}
