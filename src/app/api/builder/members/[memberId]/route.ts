import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  deleteMember,
  getMember,
  publicMember,
  updateMemberAdmin,
} from '@/lib/builder/members/members-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(80).optional(),
  role: z.enum(['free', 'premium', 'admin']).optional(),
  verified: z.boolean().optional(),
  blocked: z.boolean().optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest, { params }: { params: { memberId: string } }) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;
  const member = await getMember(params.memberId);
  if (!member) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true, member: publicMember(member) });
}

export async function PATCH(request: NextRequest, { params }: { params: { memberId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const patch = patchSchema.parse(await request.json());
    const member = await updateMemberAdmin(params.memberId, patch);
    if (!member) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, member: publicMember(member) });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'unknown_error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { memberId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  await deleteMember(params.memberId);
  return NextResponse.json({ ok: true });
}
