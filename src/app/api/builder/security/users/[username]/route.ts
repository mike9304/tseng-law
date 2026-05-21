import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  BUILDER_ROLE_NAMES,
  removeUserRole,
  upsertUserRole,
} from '@/lib/builder/security/user-role-store';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  role: z.enum(BUILDER_ROLE_NAMES as unknown as [string, ...string[]]),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

function decodeUsername(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'manage-roles',
  });
  if (auth instanceof NextResponse) return auth;

  try {
    if (!(await userHasPermission(auth.username, 'manage-roles'))) {
      return NextResponse.json(
        { ok: false, error: 'Missing permission: manage-roles' },
        { status: 403 },
      );
    }
    const patch = patchSchema.parse(await request.json());
    const username = decodeUsername(params.username);
    const user = await upsertUserRole({
      username,
      role: patch.role as never,
      addedBy: auth.username,
    });
    return NextResponse.json({ ok: true, user });
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
  { params }: { params: { username: string } },
) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'manage-roles',
  });
  if (auth instanceof NextResponse) return auth;
  try {
    if (!(await userHasPermission(auth.username, 'manage-roles'))) {
      return NextResponse.json(
        { ok: false, error: 'Missing permission: manage-roles' },
        { status: 403 },
      );
    }
    const username = decodeUsername(params.username);
    const removed = await removeUserRole(username);
    if (!removed) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 400 },
    );
  }
}