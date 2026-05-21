import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import {
  MEMBER_SESSION_COOKIE,
  publicMember,
  updateMemberProfile,
  validateSession,
} from '@/lib/builder/members/members-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const profileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(80).optional(),
  profilePhoto: z.string().trim().max(2000).optional(),
  customFields: z.record(z.string(), z.string().max(500)).optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

async function currentMember(request: NextRequest) {
  const sessionId = request.cookies.get(MEMBER_SESSION_COOKIE)?.value;
  return sessionId ? validateSession(sessionId) : null;
}

export async function GET(request: NextRequest) {
  const member = await currentMember(request);
  if (!member) return NextResponse.json({ ok: false, error: 'not_authenticated' }, { status: 401 });
  return NextResponse.json({ ok: true, member: publicMember(member) });
}

export async function PATCH(request: NextRequest) {
  const member = await currentMember(request);
  if (!member) return NextResponse.json({ ok: false, error: 'not_authenticated' }, { status: 401 });

  try {
    const patch = profileSchema.parse(await request.json());
    const saved = await updateMemberProfile(member.memberId, patch);
    if (!saved) return NextResponse.json({ ok: false, error: 'member_not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, member: publicMember(saved) });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'unknown_error' }, { status: 500 });
  }
}
