import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createLightbox,
  listLightboxes,
  writeLightboxCanvas,
} from '@/lib/builder/site/persistence';
import { createDefaultCanvasDocument } from '@/lib/builder/canvas/types';
import {
  resolveBuilderSiteIdForMutationFromRequest,
  resolveBuilderSiteIdFromRequest,
} from '@/lib/builder/site/admin-routing';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import type { Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  const lightboxes = await listLightboxes(siteId, locale);
  return NextResponse.json({ lightboxes });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: { slug?: string; name?: string; locale?: string; siteId?: unknown };
  try {
    body = (await request.json()) as { slug?: string; name?: string; locale?: string; siteId?: unknown };
  } catch {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    return errorResponse(locale, 'invalid_json', 400);
  }

  const locale = normalizeLocale(body.locale || 'ko');
  const slug = (body.slug ?? '').trim();
  const name = (body.name ?? '').trim() || 'Untitled lightbox';
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;

  if (!slug || slug.length > 100 || !SLUG_RE.test(slug)) {
    return errorResponse(locale, 'invalid_lightbox_slug', 400);
  }

  const existing = await listLightboxes(siteId, locale);
  if (existing.some((lb) => lb.slug === slug)) {
    return errorResponse(locale, 'lightbox_slug_conflict', 409);
  }

  const lightbox = await createLightbox(siteId, locale, slug, name);

  const canvas = createDefaultCanvasDocument(locale);
  const blank = { ...canvas, nodes: [], stageWidth: 600, stageHeight: 400 };
  await writeLightboxCanvas(siteId, lightbox.id, blank);

  return NextResponse.json({ ok: true, lightbox });
}
