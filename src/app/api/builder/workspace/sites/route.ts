import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  addSite,
  ensureDefaultAccount,
  listWorkspaceSites,
} from '@/lib/builder/workspace/workspace-store';
import { BUILDER_WORKSPACE_ROLES } from '@/lib/builder/workspace/account-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  siteId: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(BUILDER_WORKSPACE_ROLES as unknown as [string, ...string[]]).optional(),
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
    await ensureDefaultAccount();
    const sites = await listWorkspaceSites();
    return NextResponse.json({ ok: true, total: sites.length, sites });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = createSchema.parse(await request.json());
    await ensureDefaultAccount();
    const site = await addSite({
      siteId: input.siteId,
      name: input.name,
      role: input.role as never,
    });
    return NextResponse.json({ ok: true, site }, { status: 201 });
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