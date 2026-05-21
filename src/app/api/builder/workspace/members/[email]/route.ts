import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  removeMember,
  updateMemberRole,
} from '@/lib/builder/workspace/workspace-store';
import { BUILDER_WORKSPACE_ROLES } from '@/lib/builder/workspace/account-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  role: z.enum(BUILDER_WORKSPACE_ROLES as unknown as [string, ...string[]]),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

function decodeEmail(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { email: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const patch = patchSchema.parse(await request.json());
    const email = decodeEmail(params.email);
    const member = await updateMemberRole(email, patch.role as never);
    if (!member) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, member });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { email: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  try {
    const email = decodeEmail(params.email);
    const removed = await removeMember(email);
    if (!removed) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 400 },
    );
  }
}