/**
 * F86 — AI Brand voice route.
 *
 * GET  /api/builder/ai-generator/brand-voice — returns the saved profile or
 *                                              null if no profile is set.
 * PUT  /api/builder/ai-generator/brand-voice — analyzes samples + overrides
 *                                              and writes the profile.
 *
 * Storage at runtime-data/ai-generator/brand-voice.json (file backend) or
 * the equivalent Vercel Blob path when BLOB_READ_WRITE_TOKEN is set.
 */

import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  brandVoiceInputSchema,
  readBrandVoiceProfile,
  writeBrandVoiceProfile,
} from '@/lib/builder/ai-generator/brand-voice';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'edit-pages');
  if (auth instanceof NextResponse) return auth;

  try {
    const result = await readBrandVoiceProfile();
    return NextResponse.json({
      ok: true,
      backend: result.backend,
      persisted: result.persisted,
      profile: result.profile,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'brand_voice_read_failed',
        message: err instanceof Error ? err.message : 'unknown error',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'edit-pages',
  });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = brandVoiceInputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_brand_voice_request',
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  try {
    const updatedBy = 'username' in auth ? auth.username : undefined;
    const result = await writeBrandVoiceProfile(parsed.data, updatedBy);
    return NextResponse.json({
      ok: true,
      backend: result.backend,
      profile: result.profile,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'brand_voice_write_failed',
        message: err instanceof Error ? err.message : 'unknown error',
      },
      { status: 500 },
    );
  }
}
