import { NextRequest, NextResponse } from 'next/server';
import {
  MEMBER_SESSION_COOKIE,
  revokeSession,
} from '@/lib/builder/members/members-engine';
import { validateCsrf } from '@/lib/builder/security/csrf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  try {
    const sessionId = request.cookies.get(MEMBER_SESSION_COOKIE)?.value;
    if (sessionId) await revokeSession(sessionId);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(MEMBER_SESSION_COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(0),
    });
    return response;
  } catch (error) {
    console.error('[members/logout] POST failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to sign out.', errorCode: 'member_logout_failed' },
      { status: 500 },
    );
  }
}
