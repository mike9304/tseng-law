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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const pageCustomCodeSchema = z.object({
  head: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
  bodyStart: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
  bodyEnd: z.string().max(CUSTOM_CODE_MAX_LENGTH * 2).optional(),
}).strict();

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;
  try {
    const payload = pageCustomCodeSchema.parse(await request.json());
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const validation = validatePageCustomCode(payload);
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
    const page = site.pages.find((entry) => entry.pageId === params.pageId);
    if (!page) {
      return NextResponse.json({ ok: false, error: 'Page not found' }, { status: 404 });
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
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}