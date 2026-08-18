/**
 * SEO maturity — single redirect rule mutation.
 *
 * PATCH  /api/builder/site/redirects/[id]   → update fields / toggle active
 * DELETE /api/builder/site/redirects/[id]   → remove rule
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteRedirect,
  updateRedirect,
} from '@/lib/builder/site/redirects';
import { getRedirectValidationErrorPayload } from '@/lib/builder/site/redirect-validation-payload';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const redirectPatchSchema = z
  .object({
    from: z.string().trim().min(1).max(1024).optional(),
    to: z.string().trim().min(1).max(2048).optional(),
    type: z
      .union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)])
      .optional(),
    isActive: z.boolean().optional(),
    note: z.string().trim().max(500).optional(),
  })
  .strict();

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...extra },
    { status },
  );
}

function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderSiteApiErrorPayload(locale, 'validation_error'),
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }

  let payload: z.infer<typeof redirectPatchSchema>;
  try {
    payload = redirectPatchSchema.parse(raw);
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    throw error;
  }

  try {
    const result = await updateRedirect('default', locale, params.id, payload);
    if ('notFound' in result) {
      return errorResponse(locale, 'redirect_not_found', 404);
    }
    if ('error' in result) {
      return errorResponse(
        locale,
        'redirect_rule_invalid',
        400,
        getRedirectValidationErrorPayload(result.error),
      );
    }
    return NextResponse.json({ ok: true, redirect: result.redirect });
  } catch {
    return errorResponse(locale, 'redirect_save_failed', 500);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    const removed = await deleteRedirect('default', locale, params.id);
    if (!removed) {
      return errorResponse(locale, 'redirect_not_found', 404);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return errorResponse(locale, 'redirect_delete_failed', 500);
  }
}
