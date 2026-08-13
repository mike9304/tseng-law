import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import {
  readTranslationReleasePolicy,
  translationReleasePolicyPayloadSchema,
  writeTranslationReleasePolicy,
} from '@/lib/builder/publish-gate/translation-release-policy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'manage-translations');
  if (auth instanceof NextResponse) return auth;

  const policy = await readTranslationReleasePolicy(DEFAULT_BUILDER_SITE_ID);
  return NextResponse.json({ ok: true, policy });
}

export async function PUT(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  let body: unknown = {};
  try {
    body = await request.json();
  } catch (error) {
    if (!(error instanceof Error)) throw error;
  }

  const parsed = translationReleasePolicyPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid translation release policy.', errorCode: 'validation_error' },
      { status: 400 },
    );
  }

  const policy = await writeTranslationReleasePolicy(DEFAULT_BUILDER_SITE_ID, {
    mode: parsed.data.mode,
    updatedBy: auth.username,
    ...(parsed.data.approvalRequiredForRoles
      ? { approvalRequiredForRoles: parsed.data.approvalRequiredForRoles }
      : {}),
  });
  return NextResponse.json({ ok: true, policy });
}
