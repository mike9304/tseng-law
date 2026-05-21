/**
 * F111 — Deploy/publish pre-flight validation endpoint.
 *
 * Runs the publish gate (existing `runAllChecks`) without mutating
 * publish state. Returns the suite so the publish UI can show blockers
 * and warnings before the user commits.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { runAllChecks } from '@/lib/builder/publish-gate/gate-runner';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { findPageMetaForLocale } from '@/lib/builder/site/page-resolution';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  pageId: z.string().trim().min(1).max(200).optional(),
  slug: z.string().trim().max(200).optional(),
  locale: z.enum(['ko', 'zh-hant', 'en']).default('ko'),
  siteId: z.string().trim().max(120).default('default'),
});

export async function GET(request: NextRequest) {
  const blocked = guardBuilderRead(request);
  if (blocked instanceof NextResponse) return blocked;

  const params = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!params.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_query', issues: params.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  const locale = normalizeLocale(params.data.locale);
  const siteId = params.data.siteId;

  try {
    const site = await readSiteDocument(siteId, locale);
    let pageMeta = null;
    if (params.data.pageId) {
      pageMeta = site.pages.find((p) => p.pageId === params.data.pageId) ?? null;
    } else if (params.data.slug !== undefined) {
      pageMeta = findPageMetaForLocale(site.pages, locale, params.data.slug) ?? null;
    }
    if (!pageMeta) {
      return NextResponse.json(
        { ok: false, error: 'page_not_found' },
        { status: 404 },
      );
    }

    // Prefer draft canvas (matches what the user is about to publish).
    const canvas = await readPageCanvas(siteId, pageMeta.pageId, 'draft');
    if (!canvas) {
      return NextResponse.json(
        { ok: false, error: 'canvas_missing' },
        { status: 404 },
      );
    }

    const suite = await runAllChecks(canvas, pageMeta, site);
    return NextResponse.json({
      ok: true,
      pageId: pageMeta.pageId,
      slug: pageMeta.slug,
      locale,
      ...suite,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
