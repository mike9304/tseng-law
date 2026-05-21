import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  ensureDefaultAccount,
  listMembers,
  listWorkspaceSites,
  updateAccountName,
} from '@/lib/builder/workspace/workspace-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120),
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
    const account = await ensureDefaultAccount();
    const [sites, members] = await Promise.all([listWorkspaceSites(), listMembers()]);
    return NextResponse.json({
      ok: true,
      account,
      siteCount: sites.length,
      memberCount: members.length,
      sites,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const patch = patchSchema.parse(await request.json());
    const account = await updateAccountName(patch.name);
    return NextResponse.json({ ok: true, account });
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