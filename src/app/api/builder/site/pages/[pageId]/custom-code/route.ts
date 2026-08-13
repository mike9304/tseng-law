/**
 * F105 — Per-page custom code PATCH endpoint.
 *
 * Kept on its own route so the existing page PATCH (slug/title/redirect)
 * stays focused. The custom-code field lives on BuilderPageMeta.customCode
 * (see types.ts).
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  CUSTOM_CODE_MAX_LENGTH,
  validatePageCustomCode,
} from '@/lib/builder/site/custom-code';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const pageCustomCodeSchema = z.object({
  head: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
  bodyStart: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
  bodyEnd: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
}).strict();

function errorResponse(
  locale: ReturnType<typeof normalizeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

function validationErrorResponse(locale: ReturnType<typeof normalizeLocale>, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ pageId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    const payload = pageCustomCodeSchema.parse(await request.json());
    const validation = validatePageCustomCode(payload);
    if (validation.oversized) {
      return errorResponse(locale, 'custom_code_too_long', 400, {
        maxLength: CUSTOM_CODE_MAX_LENGTH,
        warnings: validation.warnings,
      });
    }
    const site = await readSiteDocument('default', locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);
    if (!page) {
      return errorResponse(locale, 'page_not_found', 404);
    }
    const next = { ...(page.customCode ?? {}), ...validation.values };
    for (const slot of ['head', 'bodyStart', 'bodyEnd'] as const) {
      if (Object.prototype.hasOwnProperty.call(payload, slot) && !validation.values[slot]) {
        delete next[slot];
      }
    }
    page.customCode = Object.keys(next).length > 0 ? next : undefined;
    page.updatedAt = new Date().toISOString();
    site.updatedAt = page.updatedAt;
    await writeSiteDocument(site);
    return NextResponse.json({
      ok: true,
      customCode: page.customCode ?? {},
      warnings: validation.warnings,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'page_custom_code_save_failed', 500);
  }
}
