import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  BUILDER_ROLE_NAMES,
  listUserRoles,
  upsertUserRole,
} from '@/lib/builder/security/user-role-store';
import { BUILDER_PERMISSIONS } from '@/lib/builder/security/permissions';
import { rolePermissionMatrix } from '@/lib/builder/security/role-permissions';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const upsertSchema = z.object({
  username: z.string().trim().min(1).max(180),
  role: z.enum(BUILDER_ROLE_NAMES as unknown as [string, ...string[]]),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const blocked = guardBuilderRead(request);
  if (blocked instanceof NextResponse) return blocked;
  try {
    const users = await listUserRoles();
    const matrix = rolePermissionMatrix(BUILDER_PERMISSIONS);
    return NextResponse.json({
      ok: true,
      total: users.length,
      users,
      roles: BUILDER_ROLE_NAMES,
      permissions: BUILDER_PERMISSIONS,
      matrix,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'manage-roles',
  });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = upsertSchema.parse(await request.json());
    if (!(await userHasPermission(auth.username, 'manage-roles'))) {
      return NextResponse.json(
        { ok: false, error: 'Missing permission: manage-roles' },
        { status: 403 },
      );
    }
    const user = await upsertUserRole({
      username: input.username,
      role: input.role as never,
      addedBy: auth.username,
    });
    return NextResponse.json({ ok: true, user }, { status: 201 });
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