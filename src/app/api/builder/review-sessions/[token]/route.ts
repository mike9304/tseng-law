import { NextRequest, NextResponse } from 'next/server';
import {
  getBuilderReviewSessionsApiErrorPayload,
  type BuilderReviewSessionsApiErrorCode,
} from '@/lib/builder/security/review-sessions-api-copy';
import { verifyReviewToken } from '@/lib/builder/security/review-tokens';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderReviewSessionsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderReviewSessionsApiErrorPayload(locale, errorCode) },
    { status },
  );
}

/**
 * Public endpoint — does NOT require admin auth. The token itself is
 * the credential; verification covers signature, expiry, and revocation.
 */
export async function GET(request: NextRequest, props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const token = decodeURIComponent(params.token);
  try {
    const verified = await verifyReviewToken(token);
    if (!verified) {
      return errorResponse(locale, 'review_token_invalid', 401);
    }
    return NextResponse.json({
      ok: true,
      audience: {
        audienceRole: verified.audienceRole,
        branchOrPageId: verified.branchOrPageId,
        expiresAt: verified.expiresAt,
      },
    });
  } catch (error) {
    console.error('[builder/review-sessions/[token]] GET failed:', error);
    return errorResponse(locale, 'review_token_verify_failed', 500);
  }
}
