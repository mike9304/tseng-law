import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  autoTranslateNodes,
  extractTranslatableNodes,
} from '@/lib/builder/translations/auto-translate';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { DEFAULT_TRANSLATION_SOURCE_LOCALE } from '@/lib/builder/translations/sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'edit-pages',
  });
  if (auth instanceof NextResponse) return auth;

  let body: {
    sourceLocale?: string;
    targetLocale?: string;
    pageId?: string;
    siteId?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_json' },
      { status: 400 },
    );
  }

  if (typeof body.pageId !== 'string' || body.pageId.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'pageId is required' },
      { status: 400 },
    );
  }
  if (typeof body.targetLocale !== 'string') {
    return NextResponse.json(
      { ok: false, error: 'targetLocale is required' },
      { status: 400 },
    );
  }
  const targetLocale = normalizeLocale(body.targetLocale) as Locale;
  const sourceLocale = normalizeLocale(
    body.sourceLocale || DEFAULT_TRANSLATION_SOURCE_LOCALE,
  ) as Locale;
  if (targetLocale === sourceLocale) {
    return NextResponse.json(
      { ok: false, error: 'targetLocale must differ from sourceLocale' },
      { status: 400 },
    );
  }
  const siteId = body.siteId || 'default';

  const site = await readSiteDocument(siteId, sourceLocale);
  const sourcePage = site.pages.find((page) => page.pageId === body.pageId);
  if (!sourcePage) {
    return NextResponse.json(
      { ok: false, error: 'pageId not found' },
      { status: 404 },
    );
  }

  const canvas = await readPageCanvas(siteId, sourcePage.pageId, 'draft');
  if (!canvas) {
    return NextResponse.json(
      { ok: false, error: 'source canvas missing' },
      { status: 404 },
    );
  }

  const sources = extractTranslatableNodes(canvas);
  if (sources.length === 0) {
    return NextResponse.json({
      ok: true,
      proposals: [],
      errors: [],
    });
  }

  // Forward cookie so the upstream /api/builder/ai-generator/text route
  // (which calls guardMutation itself) accepts our internal call as the
  // same authenticated session.
  const cookieHeader = request.headers.get('cookie') ?? undefined;
  const upstreamUrl = new URL('/api/builder/ai-generator/text', request.nextUrl.origin).toString();

  const result = await autoTranslateNodes(
    sources,
    sourceLocale,
    targetLocale,
    {
      endpoint: upstreamUrl,
      cookieHeader,
      siteName: site.name,
    },
  );

  return NextResponse.json(result);
}