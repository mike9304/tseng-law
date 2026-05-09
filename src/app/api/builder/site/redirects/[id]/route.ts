/**
 * SEO maturity — single redirect rule mutation.
 *
 * PATCH  /api/builder/site/redirects/[id]   → update fields / toggle active
 * DELETE /api/builder/site/redirects/[id]   → remove rule
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteRedirect,
  updateRedirect,
} from '@/lib/builder/site/redirects';

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

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  let payload: z.infer<typeof redirectPatchSchema>;
  try {
    payload = redirectPatchSchema.parse(raw);
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    throw error;
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const result = await updateRedirect('default', locale, params.id, payload);
  if ('notFound' in result) {
    return NextResponse.json({ ok: false, error: 'Redirect not found' }, { status: 404 });
  }
  if ('error' in result) {
    return NextResponse.json(
      { ok: false, error: result.error.message, field: result.error.field },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true, redirect: result.redirect });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const removed = await deleteRedirect('default', locale, params.id);
  if (!removed) {
    return NextResponse.json({ ok: false, error: 'Redirect not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
