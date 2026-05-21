import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import {
  createMember,
  loginMember,
  MEMBER_SESSION_COOKIE,
  publicMember,
} from '@/lib/builder/members/members-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const signupSchema = z.object({
  email: z.string().trim().email().max(180),
  name: z.string().trim().min(1).max(120),
  password: z.string().min(8).max(128),
  locale: z.string().trim().max(20).optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  try {
    const input = signupSchema.parse(await request.json());
    const member = await createMember({
      email: input.email,
      name: input.name,
      password: input.password,
      role: 'free',
    });
    const session = await loginMember(input.email, input.password);
    if (!session) {
      return NextResponse.json({ ok: false, error: 'session_create_failed' }, { status: 500 });
    }

    const response = NextResponse.json({ ok: true, member: publicMember(member) }, { status: 201 });
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
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 400 },
    );
  }
}
