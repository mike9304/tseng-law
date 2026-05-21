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
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  CUSTOM_CODE_MAX_LENGTH,
  validateSiteCustomCode,
} from '@/lib/builder/site/custom-code';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const customCodeSchema = z
  .object({
    siteHead: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
    siteBodyStart: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
    siteBodyEnd: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
  })
  .strict();

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    return NextResponse.json({ ok: true, customCode: site.customCode ?? {} });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  try {
    const payload = customCodeSchema.parse(await request.json());
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const validation = validateSiteCustomCode(payload);
    if (validation.oversized) {
      return NextResponse.json(
        {
          ok: false,
          error: 'custom_code_too_long',
          maxLength: CUSTOM_CODE_MAX_LENGTH,
          warnings: validation.warnings,
        },
        { status: 400 },
      );
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
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}