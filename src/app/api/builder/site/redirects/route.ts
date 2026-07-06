/**
 * SEO maturity — site-level redirect rules CRUD.
 *
 * GET    /api/builder/site/redirects?locale=ko   → list rules
 * POST   /api/builder/site/redirects             → create new rule
 *
 * Mutation routes are guarded by `guardMutation` (auth + CSRF + rate
 * limit) just like every other admin-builder endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createRedirect,
  listRedirects,
} from '@/lib/builder/site/redirects';
import { getRedirectValidationErrorPayload } from '@/lib/builder/site/redirect-validation-payload';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const redirectInputSchema = z
  .object({
    from: z.string().trim().min(1).max(1024),
    to: z.string().trim().min(1).max(2048),
    type: z
      .union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)])
      .default(301),
    isActive: z.boolean().default(true),
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

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    const redirects = await listRedirects('default', locale);
    return NextResponse.json({ ok: true, redirects });
  } catch {
    return errorResponse(locale, 'redirects_load_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }

  let payload: z.infer<typeof redirectInputSchema>;
  try {
    payload = redirectInputSchema.parse(raw);
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    throw error;
  }

  try {
    const result = await createRedirect('default', locale, payload);
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
