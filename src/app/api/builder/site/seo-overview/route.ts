import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { buildBuilderSeoOverview } from '@/lib/builder/seo/overview';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const canvasesByPageId = new Map<string, BuilderCanvasDocument | null>();

    await Promise.all(site.pages.map(async (page) => {
      const draft = await readPageCanvas('default', page.pageId, 'draft');
      canvasesByPageId.set(page.pageId, draft);
    }));

    return NextResponse.json({
      ok: true,
      overview: buildBuilderSeoOverview({ site, canvasesByPageId }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
