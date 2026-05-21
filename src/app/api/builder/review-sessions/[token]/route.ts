import { NextRequest, NextResponse } from 'next/server';
import { verifyReviewToken } from '@/lib/builder/security/review-tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Public endpoint — does NOT require admin auth. The token itself is
 * the credential; verification covers signature, expiry, and revocation.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } },
) {
  const token = decodeURIComponent(params.token);
  const verified = await verifyReviewToken(token);
  if (!verified) {
    return NextResponse.json(
      { ok: false, error: 'invalid_or_expired_token' },
      { status: 401 },
    );
  }
  return NextResponse.json({
    ok: true,
    audience: {
      audienceRole: verified.audienceRole,
      branchOrPageId: verified.branchOrPageId,
      expiresAt: verified.expiresAt,
    },
  });
}