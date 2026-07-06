import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteLightbox,
  updateLightbox,
} from '@/lib/builder/site/persistence';
import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import type { Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const patchSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    slug: z.string().trim().min(1).max(100).regex(SLUG_RE).optional(),
    sizeMode: z.enum(['auto', 'fixed']).optional(),
    width: z.number().int().min(120).max(2000).optional(),
    height: z.number().int().min(80).max(2000).optional(),
    closeOnOutsideClick: z.boolean().optional(),
    closeOnEsc: z.boolean().optional(),
    dismissable: z.boolean().optional(),
    backdropOpacity: z.number().int().min(0).max(100).optional(),
  })
  .strict();

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  try {
    const body = await request.json();
    const patch = patchSchema.parse(body);
    const updated = await updateLightbox(siteId, locale, params.id, patch);
    if (!updated) {
      return errorResponse(locale, 'lightbox_not_found', 404);
    }
    return NextResponse.json({ ok: true, lightbox: updated });
  } catch (error) {
    if (error instanceof ZodError) return validationError(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'lightbox_update_failed', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  const ok = await deleteLightbox(siteId, locale, params.id);
  if (!ok) {
    return errorResponse(locale, 'lightbox_not_found', 404);
  }
  return NextResponse.json({ ok: true });
}
