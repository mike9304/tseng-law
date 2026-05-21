import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import {
  getMember,
  loginMember,
  MEMBER_SESSION_COOKIE,
  publicMember,
} from '@/lib/builder/members/members-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().trim().email().max(180),
  password: z.string().min(1).max(128),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  try {
    const input = loginSchema.parse(await request.json());
    const session = await loginMember(input.email, input.password);
    if (!session) return NextResponse.json({ ok: false, error: 'invalid_credentials' }, { status: 401 });

    const member = await getMember(session.memberId);
    if (!member) return NextResponse.json({ ok: false, error: 'member_not_found' }, { status: 404 });

    const response = NextResponse.json({ ok: true, member: publicMember(member) });
    response.cookies.set(MEMBER_SESSION_COOKIE, session.sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(session.expiresAt),
    });
    return response;
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'unknown_error' }, { status: 500 });
  }
}
