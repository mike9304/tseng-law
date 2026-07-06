import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { buildBuilderSeoOverview } from '@/lib/builder/seo/overview';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import { getBuilderSiteApiErrorPayload } from '@/lib/builder/site/site-api-copy';
import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  try {
    const site = await readSiteDocument(siteId, locale);
    const canvasesByPageId = new Map<string, BuilderCanvasDocument | null>();

    await Promise.all(site.pages.map(async (page) => {
      const draft = await readPageCanvas(siteId, page.pageId, 'draft');
      canvasesByPageId.set(page.pageId, draft);
    }));

    return NextResponse.json({
      ok: true,
      overview: buildBuilderSeoOverview({ site, canvasesByPageId }),
    });
  } catch {
    return NextResponse.json(
      { ok: false, ...getBuilderSiteApiErrorPayload(locale, 'seo_overview_failed') },
      { status: 500 },
    );
  }
}
