/**
 * F105 — Custom code slots PATCH/GET endpoint.
 *
 * Stores site-level head/bodyStart/bodyEnd snippets on the site document
 * under the `customCode` field. Per-page custom code is wired through the
 * existing pages PATCH route (see integration notes).
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  CUSTOM_CODE_MAX_LENGTH,
  validateSiteCustomCode,
} from '@/lib/builder/site/custom-code';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const customCodeSchema = z
  .object({
    siteHead: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
    siteBodyStart: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
    siteBodyEnd: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
  })
  .strict();

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

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'settings');
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    const site = await readSiteDocument('default', locale);
    return NextResponse.json({ ok: true, customCode: site.customCode ?? {} });
  } catch {
    return errorResponse(locale, 'custom_code_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    const payload = customCodeSchema.parse(await request.json());
    const validation = validateSiteCustomCode(payload);
    if (validation.oversized) {
      return errorResponse(locale, 'custom_code_too_long', 400, {
        maxLength: CUSTOM_CODE_MAX_LENGTH,
        warnings: validation.warnings,
      });
    }
    const site = await readSiteDocument('default', locale);
    const now = new Date().toISOString();
    site.customCode = {
      ...(site.customCode ?? {}),
      ...validation.values,
    };
    // Empty strings should clear a slot to keep the document tidy.
    for (const slot of ['siteHead', 'siteBodyStart', 'siteBodyEnd'] as const) {
      if (Object.prototype.hasOwnProperty.call(payload, slot) && !validation.values[slot]) {
        delete site.customCode[slot];
      }
    }
    site.updatedAt = now;
    await writeSiteDocument(site);
    return NextResponse.json({
      ok: true,
      customCode: site.customCode ?? {},
      warnings: validation.warnings,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'custom_code_save_failed', 500);
  }
}
