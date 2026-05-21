import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  createMember,
  listMembers,
  publicMember,
} from '@/lib/builder/members/members-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const memberCreateSchema = z.object({
  email: z.string().trim().email().max(180),
  name: z.string().trim().min(1).max(120),
  password: z.string().min(8).max(128),
  role: z.enum(['free', 'premium', 'admin']).default('free'),
  verified: z.boolean().default(true),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const role = request.nextUrl.searchParams.get('role') ?? 'all';
  const members = (await listMembers())
    .filter((member) => role === 'all' || member.role === role)
    .map(publicMember)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ ok: true, total: members.length, members });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = memberCreateSchema.parse(await request.json());
    const member = await createMember(input);
    return NextResponse.json({ ok: true, member: publicMember(member) }, { status: 201 });
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
